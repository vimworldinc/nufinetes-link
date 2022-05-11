import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import Header from '../components/Header'
import { AccountProvider } from '../components/AccountProvider'
import Dapp from '../components/Dapp'

import { MetaMask } from '@web3-react/metamask'
import { NufinetesConnector } from '@web3-react/nufinetes'
import type { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'
// import { hooks as metaMaskHooks, metaMask } from '../connectors/metaMask'
import { hooks as nufinetesHooks, nufinetes } from '../connectors/nufinetes'
// import { hooks as walletConnectHooks, walletConnect } from '../connectors/walletConnect'

const connectors: [MetaMask | NufinetesConnector | WalletConnect, Web3ReactHooks][] = [
  [nufinetes, nufinetesHooks],
  // [metaMask, metaMaskHooks],
  // [walletConnect, walletConnectHooks],
]

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: 'center' }}>
        Dapp 链接示例
        <br />
        本示例提供了对 Dapp 相关业务的模拟, 比如钱包链接后需要获取登录 token, 以及可以多钱包登录的特性
      </div>

      <Web3ReactProvider connectors={connectors} lookupENS={false}>
        <AccountProvider>
          <Dapp />
        </AccountProvider>
      </Web3ReactProvider>
    </div>
  )
}
