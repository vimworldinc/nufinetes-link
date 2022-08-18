import type WalletConnectProvider from '@walletconnect/web3-provider'
import QRCodeModal from './qrmodal'
import DefaultModal from '@walletconnect/qrcode-modal'
import type { IWCEthRpcConnectionOptions } from '@walletconnect/types'
import type { Actions, ProviderRpcError, AddEthereumChainParameter } from '@web3-react/types'
import { Connector } from '@web3-react/types'
import EventEmitter3 from 'eventemitter3'
import type { EventEmitter } from 'node:events'
import { getBestUrl } from './utils'
import NufinetesWeb3Provider from './nufinetes-web3-provider'

export const URI_AVAILABLE = 'URI_AVAILABLE'

export enum NufinetesConnectorErrors {
  NO_AVAIL_RPC = 'No RPC url available for this chainId',
  USER_CLOSE_MODAL = 'User closed modal',
}
// const VE_CHAIN_IDS = [818000000, 818000001]

type CustomWalletConnectProvider = WalletConnectProvider &
  EventEmitter & {
    createSession: () => Promise<void>
    killSession: () => void
    transportClose: () => void
    uri: string
    provider: WalletConnectProvider
  }

function parseChainId(chainId: string | number) {
  return typeof chainId === 'string' ? Number.parseInt(chainId) : chainId
}

type WalletConnectOptions = Omit<IWCEthRpcConnectionOptions, 'rpc' | 'infuraId' | 'chainId'> & {
  rpc: { [chainId: number]: string | string[] }
}

export class NufinetesConnector extends Connector {
  /** {@inheritdoc Connector.provider} */
  public provider: CustomWalletConnectProvider | undefined
  public readonly events = new EventEmitter3()

  private readonly options: Omit<WalletConnectOptions, 'rpc' | 'client'>
  private readonly rpc: { [chainId: number]: string[] }
  private useDefaultModal?: boolean
  private eagerConnection?: Promise<void>
  private treatModalCloseAsError: boolean
  private wcInstance: CustomWalletConnectProvider | undefined
  private lastChainId: number
  private lastAccounts: string[]

  /**
   * @param options - Options to pass to `@walletconnect/ethereum-provider`
   * @param connectEagerly - A flag indicating whether connection should be initiated when the class is constructed.
   * @param useDefaultModal - use default wallet connect modal instead of nufinetes-modal
   * @param treatModalCloseAsError - throw an error while qrmodal closing to fix some wallet connect issues
   */
  constructor(
    actions: Actions,
    options: WalletConnectOptions,
    connectEagerly = false,
    useDefaultModal = false,
    treatModalCloseAsError = true
  ) {
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
    this.useDefaultModal = useDefaultModal
    this.wcInstance = undefined
    this.lastChainId = -1
    this.lastAccounts = []
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

  private updateProvider = async (chainId: number, cb?: () => void) => {
    // get rpc urls for evm chains
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
    // first create a wallet connect instance for wc connection and operation.
    import('@walletconnect/client').then(async (m) => {
      this.wcInstance = new m.default({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: this.useDefaultModal ? DefaultModal : QRCodeModal,
        // ...this.options,
        // chainId,
        // rpc: await rpc,
      }) as unknown as CustomWalletConnectProvider

      // remove all provider events and ready to bind new events
      if (this.provider) {
        this.removeEvents()
        this.provider = undefined
      }
      // initialize a NufinetesWeb3Provider
      // a NufinetesWeb3Provider is a web3 provider which can also be used to operate wallet connect connection directly.
      // for example: you can directly call sendCustomRequest in a NufinetesWeb3Provider
      if (!this.rpc[this.wcInstance.chainId]) {
        this.actions.reportError(new Error(NufinetesConnectorErrors.NO_AVAIL_RPC))
        return
      }
      this.provider = new NufinetesWeb3Provider(this.wcInstance as any, {
        ...this.options,
        chainId: chainId > 0 ? chainId : null,
        rpc,
      }) as unknown as CustomWalletConnectProvider
      this.provider.on('modal_closed', this.modalClosingListener)
      this.provider.on('connect', this.sessionListener)
      this.provider.on('disconnect', this.disconnectListener)
      this.provider.on('chainChanged', this.chainChangedListener)
      this.provider.on('accountsChanged', this.accountsChangedListener)
      this.provider.on('session_update', this.sessionListener)
      // makesure the web3-react core hooks useProvider will return original NufinetesWeb3Provider instead of Wrapped Web3Provider
      this.customProvider = this.provider
      cb && cb()
      // this.provider.connector.on('display_uri', this.URIListener)
    })
  }

  private sessionListener = async (
    _: Error | null,
    payload: { params: { accounts: string[]; chainId: number }[] }
  ): Promise<void> => {
    try {
      const {
        params: [{ accounts, chainId }],
      } = payload
      if (
        this.lastChainId === chainId &&
        this.lastAccounts.length === accounts.length &&
        (!accounts.length || this.lastAccounts.every((x, i) => x.toLowerCase() === accounts[i].toLowerCase()))
      ) {
        return
      }
      // this.updateProvider()
      this.actions.startActivation()
      // this.actions.update({ chainId })
      this.lastChainId = chainId
      this.lastAccounts = accounts
      // update web3 provider for new chain
      await this.updateProvider(chainId, () => {
        this.actions.update({ chainId: parseChainId(chainId), accounts })
      })
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
    this.actions.reportError(new Error(NufinetesConnectorErrors.USER_CLOSE_MODAL))
  }

  private URIListener = (_: Error | null, payload: { params: string[] }): void => {
    this.events.emit(URI_AVAILABLE, payload.params[0])
  }

  private async isomorphicInitialize(chainId?: number): Promise<void> {
    if (this.eagerConnection) return this.eagerConnection

    await this.updateProvider(chainId || -1)
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
        const accounts = await this.wcInstance!.accounts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chainId = parseChainId(await this.wcInstance!.chainId)

        if (!this.rpc?.[chainId]) {
          this.actions.reportError(new Error(NufinetesConnectorErrors.NO_AVAIL_RPC))
          return
        }

        this.lastChainId = chainId
        this.lastAccounts = accounts
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
   * @param desiredChainIdOrChainParameters - If defined, indicates the desired chain to connect to. If the user is
   * already connected to this chain, no additional steps will be taken. Otherwise, the user will be prompted to switch
   * to the chain, if their wallet supports it.
   */
  public async activate(desiredChainIdOrChainParameters?: number | AddEthereumChainParameter): Promise<void> {
    const desiredChainId =
      typeof desiredChainIdOrChainParameters === 'number'
        ? desiredChainIdOrChainParameters
        : desiredChainIdOrChainParameters?.chainId
    if (desiredChainId && this.rpc[desiredChainId] === undefined) {
      this.actions.reportError(new Error(NufinetesConnectorErrors.NO_AVAIL_RPC))
      return
      // throw new Error(`no url(s) provided for desiredChainId ${desiredChainId}`)
    }

    // this early return clause catches some common cases if we're already connected
    if (this.wcInstance?.connected) {
      if (!desiredChainId || desiredChainId === this.wcInstance?.chainId) {
        const accounts = await this.wcInstance!.accounts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chainId = parseChainId(await this.wcInstance!.chainId)
        if (!this.rpc?.[chainId]) {
          this.actions.reportError(new Error(NufinetesConnectorErrors.NO_AVAIL_RPC))
          return
        }

        return this.actions.update({ chainId, accounts })
      }

      // will be useful while our Nufinetes supported switch chain method in the future
      // const desiredChainIdHex = `0x${desiredChainId.toString(16)}`
      // return (this.provider.provider as CustomWalletConnectProvider)
      //   .request<void>({
      //     method: 'wallet_switchEthereumChain',
      //     params: [{ chainId: desiredChainIdHex }],
      //   })
      //   .catch(() => void 0)
    }

    this.actions.startActivation()

    // if we're trying to connect to a specific chain that we're not already initialized for, we have to re-initialize
    if (desiredChainId && desiredChainId !== this.provider?.chainId) await this.deactivate()
    await this.isomorphicInitialize(desiredChainId)

    try {
      if (this.wcInstance?.connected) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const accounts = await this.wcInstance!.accounts
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const chainId = parseChainId(await this.wcInstance!.chainId)
        if (!this.rpc?.[chainId]) {
          this.actions.reportError(new Error(NufinetesConnectorErrors.NO_AVAIL_RPC))
          return
        }
        if (!desiredChainId || desiredChainId === chainId) {
          return this.actions.update({ chainId, accounts })
        }

        // because e.g. metamask doesn't support wallet_switchEthereumChain, we have to report connections,
        // even if the chainId isn't necessarily the desired one. this is ok because in e.g. rainbow,
        // we won't report a connection to the wrong chain while the switch is pending because of the re-initialization
        // logic above, which ensures first-time connections are to the correct chain in the first place
        this.actions.update({ chainId, accounts })

        // the case that chain is not a veChain, we should update provider to a ethereum-provider
        // if (!VE_CHAIN_IDS.includes(chainId) && this.customProvider) {
        //   // after isomorphicInitialize with out chainId, the provider will be a wallet-connect instance. We need a ethereum-provider for a Evm chain, so we call updateProvider again with a chainId parameter.
        //   await this.updateProvider(chainId, () => {

        //   })
        // }
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

  private async removeEvents() {
    this.provider?.off('modal_closed', this.modalClosingListener)
    this.provider?.off('connect', this.sessionListener)
    this.provider?.off('disconnect', this.disconnectListener)
    this.provider?.off('chainChanged', this.chainChangedListener)
    this.provider?.off('accountsChanged', this.accountsChangedListener)
    this.provider?.off('session_update', this.sessionListener)
    ;(this.provider?.connector as unknown as EventEmitter | undefined)?.off('display_uri', this.URIListener)
  }

  /** {@inheritdoc Connector.deactivate} */
  public async deactivate(error?: Error): Promise<void> {
    this.removeEvents()

    await this.provider?.provider!?.disconnect()
    if (this.wcInstance!?.connected) {
      this.customProvider = null
      this.wcInstance.transportClose()
      await this.wcInstance?.killSession()
    }
    this.lastAccounts = []
    this.lastChainId = -1
    this.customProvider = undefined
    this.provider = undefined
    this.wcInstance = undefined
    this.eagerConnection = undefined
    this.actions.reportError(error)
  }
}
