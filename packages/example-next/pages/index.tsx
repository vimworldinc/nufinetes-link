import Link from 'next/link'
import Header from '../components/Header'
import MetaMaskCard from '../components/connectors/MetaMaskCard'
// import WalletConnectCard from '../components/connectors/WalletConnectCard'
import NefinetesCard from '../components/connectors/NefinetesCard'
import ProviderExample from '../components/ProviderExample'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Header />

      <div style={{ fontSize: 18, width: 800, textAlign: 'center' }}>
        多钱包链接示例
        <br />
        本示例提供了两个面板用来分别显示 Nufinetes 和 MetaMask 的链接状态, MetaMask 钱包还可以主动切换需要链接的链
        <br />
        Nufinetes 的优先级是最高的, 也就意味着如果两种钱包同时处于链接状态的话, useWeb3React context 提供的链接器
        connector 将是 Nufinetes, 只有 Nufinetes 断开, 首选链接器才会变成 MetaMask
      </div>

      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <NefinetesCard />
        <MetaMaskCard />
        {/* <WalletConnectCard /> */}
        {/* <CoinbaseWalletCard /> */}
        {/* <NetworkCard /> */}
      </div>

      <div style={{ fontSize: 18, width: 800, textAlign: 'center' }}>
        在这里演示了一个原生 Web3ReactProvider 的示例
        <br />
        原生 Web3ReactProvider 提供了 connector, chainId, accounts, isActivating, error, account, isActive, provider
        等多个钱包状态或对象, 足够满足常规 dapp 需要, 如果有额外需要维护的状态, 则可自行在业务中封装一层 provider
        进行状态提供, 也可以通过其他状态管理工具来维护
        <br />
        在 Dapp wallet example 中, 将演示根据业务需要自行封装一层 Provider 的案例, 以模拟 Vim Dapp 需要多账户登录以及需要单独获取 token 的业务, <Link href="/dapp">点击跳转</Link>
      </div>

      <ProviderExample />
    </div>
  )
}
