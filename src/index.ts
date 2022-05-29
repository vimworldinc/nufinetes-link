import type WalletConnectProvider from '@walletconnect/ethereum-provider'
import QRCodeModal from './qrmodal'
import type { IWCEthRpcConnectionOptions } from '@walletconnect/types'
import type { Actions, ProviderRpcError, AddEthereumChainParameter } from '@web3-react/types'
import { Connector } from '@web3-react/types'
import EventEmitter3 from 'eventemitter3'
import type { EventEmitter } from 'node:events'
import { getBestUrl } from './utils'

export const URI_AVAILABLE = 'URI_AVAILABLE'

const VE_CHAIN_IDS = [818000000, 818000001]

type MockWalletConnectProvider = WalletConnectProvider &
  EventEmitter & {
    createSession: () => Promise<void>
    killSession: () => void
    uri: string
  }

function parseChainId(chainId: string | number) {
  return typeof chainId === 'string' ? Number.parseInt(chainId) : chainId
}

type WalletConnectOptions = Omit<IWCEthRpcConnectionOptions, 'rpc' | 'infuraId' | 'chainId'> & {
  rpc: { [chainId: number]: string | string[] }
}

export class NufinetesConnector extends Connector {
  /** {@inheritdoc Connector.provider} */
  public provider: MockWalletConnectProvider | undefined
  public readonly events = new EventEmitter3()

  private readonly options: Omit<WalletConnectOptions, 'rpc' | 'client'>
  private readonly rpc: { [chainId: number]: string[] }
  private eagerConnection?: Promise<void>
  private treatModalCloseAsError: boolean
  private isEvm: boolean
  private wcInstance: MockWalletConnectProvider | undefined

  /**
   * @param options - Options to pass to `@walletconnect/ethereum-provider`
   * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
   */
  constructor(actions: Actions, options: WalletConnectOptions, connectEagerly = false, treatModalCloseAsError = true) {
    super(actions)

    if (connectEagerly && typeof window === 'undefined') {
      throw new Error('connectEagerly = true is invalid for SSR, instead use the connectEagerly method in a useEffect')
    }
    const { rpc, ...rest } = options
    this.rpc = Object.keys(rpc).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
      const value = rpc[Number(chainId)]
      accumulator[Number(chainId)] = Array.isArray(value) ? value : [value]
      return accumulator
    }, {})
    this.options = rest
    this.wcInstance = undefined
    this.isEvm = false
    this.treatModalCloseAsError = treatModalCloseAsError

    if (connectEagerly) void this.connectEagerly()
  }

  private chainChangedListener = (chainId: number | string): void => {
    this.actions.update({ chainId: parseChainId(chainId) })
  }

  private accountsChangedListener = (accounts: string[]): void => {
    this.actions.update({ accounts })
  }

  private disconnectListener = (error: ProviderRpcError | undefined): void => {
    this.deactivate()
    this.actions.reportError(error)
  }

  private updateProvider = async (chainId: number) => {
    if (!this.wcInstance) {
      import('@walletconnect/client').then(async (m) => {
        this.wcInstance = new m.default({
          bridge: 'https://bridge.walletconnect.org',
          qrcodeModal: QRCodeModal,
          // ...this.options,
          // chainId,
          // rpc: await rpc,
        }) as unknown as MockWalletConnectProvider

        this.wcInstance.on('connect', this.sessionListener)
        this.wcInstance.on('session_update', this.sessionListener)
        this.wcInstance.on('disconnect', this.disconnectListener)
        this.wcInstance.on('modal_closed', this.modalClosingListener)
        // this.provider.connector.on('display_uri', this.URIListener)
      })
    }

    if (chainId && VE_CHAIN_IDS.includes(chainId)) {
      this.isEvm = false
      console.log(this.wcInstance)
      this.provider = this.wcInstance
      // this.provider.on('connect', this.sessionListener)
      // this.provider.on('session_update', this.sessionListener)
      // this.provider.on('disconnect', this.disconnectListener)
      // this.provider.on('modal_closed', this.modalClosingListener)
      // this.provider.on('chainChanged', this.chainChangedListener)
      // this.provider.on('accountsChanged', this.accountsChangedListener)
      this.customProvider = this.provider
    } else {
      this.isEvm = true
      const rpc = await Promise.all(
        Object.keys(this.rpc).map(
          async (chainId): Promise<[number, string]> => [Number(chainId), await getBestUrl(this.rpc[Number(chainId)])]
        )
      ).then((results) =>
        results.reduce<{ [chainId: number]: string }>((accumulator, [chainId, url]) => {
          accumulator[chainId] = url
          return accumulator
        }, {})
      )

      import('@walletconnect/ethereum-provider').then(async (m) => {
        this.provider = new m.default({
          ...this.options,
          // client: {
          //   bridge: 'https://bridge.walletconnect.org',
          //   qrcode: QRCodeModal,
          // },
          chainId,
          rpc,
        }) as unknown as MockWalletConnectProvider

        this.provider.on('disconnect', this.disconnectListener)
        this.provider.on('chainChanged', this.chainChangedListener)
        this.provider.on('accountsChanged', this.accountsChangedListener)
        this.provider.on('session_update', this.sessionListener)
        // this.provider.connector.on('display_uri', this.URIListener)
        this.customProvider = null
      })
    }
  }

  private sessionListener = async (
    _: Error | null,
    payload: { params: { accounts: string[]; chainId: number }[] }
  ): Promise<void> => {
    try {
      const {
        params: [{ accounts, chainId }],
      } = payload

      // this.updateProvider()
      this.actions.startActivation()

      // update provider for new chain
      await this.updateProvider(chainId)
      this.actions.update({ chainId: parseChainId(chainId), accounts })
    } catch (error) {
      console.log(error, 'check error')
      throw new Error('Error occurred')
    }
  }

  // private chainChangedListener = (chainId: number | string): void => {
  //   this.actions.update({ chainId: parseChainId(chainId) })
  // }

  // private accountsChangedListener = (accounts: string[]): void => {
  //   this.actions.update({ accounts })
  // }

  private modalClosingListener = (error: ProviderRpcError | undefined): void => {
    this.provider = undefined
    this.customProvider = null
    this.eagerConnection = undefined
    this.actions.reportError(new Error('User closed modal'))
  }

  private URIListener = (_: Error | null, payload: { params: string[] }): void => {
    this.events.emit(URI_AVAILABLE, payload.params[0])
  }

  private async isomorphicInitialize(chainId?: number): Promise<void> {
    if (this.eagerConnection) return this.eagerConnection
    
    // if a chainId is provided, just update the provider by chainId
    if (chainId) {
      await this.updateProvider(chainId)
      // initialize the provider to a wallet-connect instance by default
    } else {
      this.isEvm = false
      await (this.eagerConnection = import('@walletconnect/client').then(async (m) => {
        this.provider = new m.default({
          bridge: 'https://bridge.walletconnect.org',
          qrcodeModal: QRCodeModal,
          // ...this.options,
          // chainId,
          // rpc: await rpc,
        }) as unknown as MockWalletConnectProvider

        this.wcInstance = this.provider
        this.wcInstance.on('connect', this.sessionListener)
        this.wcInstance.on('session_update', this.sessionListener)
        this.wcInstance.on('disconnect', this.disconnectListener)
        this.wcInstance.on('modal_closed', this.modalClosingListener)
        this.customProvider = this.provider
      }))
    }
  }

  /** {@inheritdoc Connector.connectEagerly} */
  public async connectEagerly(): Promise<void> {
    const cancelActivation = this.actions.startActivation()
    await this.isomorphicInitialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (this.wcInstance!?.connected) {
      try {
        // for walletconnect, we always use sequential instead of parallel fetches because otherwise
        // chainId defaults to 1 even if the connecting wallet isn't on mainnet
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const accounts = await this.provider!.accounts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chainId = parseChainId(await this.provider!.chainId)

        // the case that chain is not a veChain, we should update provider to a ethereum-provider
        if (!VE_CHAIN_IDS.includes(chainId) && this.customProvider) {
          // after isomorphicInitialize with out chainId, the provider will be a wallet-connect instance. We need a ethereum-provider for a Evm chain, so we call updateProvider again with a chainId parameter.
          await this.updateProvider(chainId)
        }

        if (accounts.length) {
          this.actions.update({ chainId, accounts })
        } else {
          throw new Error('No accounts returned')
        }
      } catch (error) {
        console.debug('Could not connect eagerly', error)
        cancelActivation()
      }
    } else {
      cancelActivation()
    }
  }

  /**
   * Initiates a connection.
   *
   * @param desiredChainId - If defined, indicates the desired chain to connect to. If the user is
   * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
   * to the chain, if their wallet supports it.
   */
  public async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void> {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === 'number'
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId
    if (desiredChainId && this.rpc[desiredChainId] === undefined) {
      throw new Error(`no url(s) provided for desiredChainId ${desiredChainId}`)
    }

    // this early return clause catches some common cases if we're already connected
    if (this.wcInstance?.connected) {
      if (!desiredChainId || desiredChainId === this.wcInstance?.chainId) return

      const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
      return (this.provider as MockWalletConnectProvider)
        .request<void>({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: desiredChainIdHex }],
        })
        .catch(() => void 0)
    }

    this.actions.startActivation()

    // if we're trying to connect to a specific chain that we're not already initialized for, we have to re-initialize
    if (desiredChainId && desiredChainId !== this.provider?.chainId) await this.deactivate()
    await this.isomorphicInitialize(desiredChainId)

    try {
      if (this.provider?.connected) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const accounts = await this.provider!.accounts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chainId = parseChainId(await this.provider!.chainId)

        // the case that chain is not a veChain, we should update provider to a ethereum-provider
        if (!VE_CHAIN_IDS.includes(chainId) && this.customProvider) {
          // after isomorphicInitialize with out chainId, the provider will be a wallet-connect instance. We need a ethereum-provider for a Evm chain, so we call updateProvider again with a chainId parameter.
          await this.updateProvider(chainId)
        }
        if (!desiredChainId || desiredChainId === chainId) {
          return this.actions.update({ chainId, accounts })
        }

        // because e.g. metamask doesn't support wallet_switchEthereumChain, we have to report connections,
        // even if the chainId isn't necessarily the desired one. this is ok because in e.g. rainbow,
        // we won't report a connection to the wrong chain while the switch is pending because of the re-initialization
        // logic above, which ensures first-time connections are to the correct chain in the first place
        this.actions.update({ chainId, accounts })
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.wcInstance!?.createSession()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // const uri = this.provider!.uri
      // QRCodeModal.open(uri)
      // if we're here, we can try to switch networks, ignoring errors
      // const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
      // return this.provider
      //   ?.request<void>({
      //     method: 'wallet_switchEthereumChain',
      //     params: [{ chainId: desiredChainIdHex }],
      //   })
      //   .catch(() => void 0)
    } catch (error) {
      // this condition is a bit of a hack :/
      // if a user triggers the walletconnect modal, closes it, and then tries to connect again,
      // the modal will not trigger. the logic below prevents this from happening
      if ((error as Error).message === 'User closed modal') {
        await this.deactivate(this.treatModalCloseAsError ? (error as Error) : undefined)
      } else {
        this.actions.reportError(error as Error)
      }
    }
  }

  /** {@inheritdoc Connector.deactivate} */
  public async deactivate(error?: Error): Promise<void> {
    this.provider?.off('disconnect', this.disconnectListener)
    this.provider?.off('connect', this.sessionListener)
    this.provider?.off('session_update', this.sessionListener)
    // this.provider?.off('chainChanged', this.chainChangedListener)
    // this.provider?.off('accountsChanged', this.accountsChangedListener)
    ;(this.provider?.connector as unknown as EventEmitter | undefined)?.off('display_uri', this.URIListener)
    // await this.provider?.disconnect()
    // this.provider?.killSession()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (this.isEvm) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // const wcProvider = (this.provider as any)?.signer?.connection?.wc
      // console.log(wcProvider, wcProvider.connected, 'evm disconnect')
      // if (wcProvider?.connected && wcProvider?.killSession) {
      //   wcProvider.killSession()
      // }
      await this.provider!?.disconnect()
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    } else if (this.wcInstance!?.connected) {
      this.customProvider = null
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.wcInstance!?.killSession()
    }
    this.provider = undefined
    this.wcInstance = undefined
    this.eagerConnection = undefined
    this.actions.reportError(error)
  }
}
