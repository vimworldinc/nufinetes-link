import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { NufinetesConnector } from 'nufinetes-link'
import type { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as nufinetesHooks, nufinetes } from '../connectors/nufinetes'
import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'
import CurrentWallet from './CurrentWallet'

// function getName(connector: Connector) {
//   if (connector instanceof NufinetesConnector) return 'Nufinetes'
//   if (connector instanceof MetaMask) return 'MetaMask'
//   if (connector instanceof WalletConnect) return 'WalletConnect'
//   return 'Unknown'
// }

const connectors: [MetaMask | NufinetesConnector | WalletConnect, Web3ReactHooks][] = [
  [nufinetes, nufinetesHooks],
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
]

export default function ProviderExample() {
  return (
    <Web3ReactProvider connectors={connectors} lookupENS={false}>
      <CurrentWallet />
    </Web3ReactProvider>
  )
}
