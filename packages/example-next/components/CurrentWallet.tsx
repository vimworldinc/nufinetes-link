import { memo, useEffect, useState } from 'react'
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'

import { MetaMask } from '@web3-react/metamask'
import { NufinetesConnector } from '@vimworldinc/nufinetes-link'
import type { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'

function getName(connector: Connector) {
  if (connector instanceof NufinetesConnector) return 'Nufinetes'
  if (connector instanceof MetaMask) return 'MetaMask'
  if (connector instanceof WalletConnect) return 'WalletConnect'
  return 'Unknown'
}

const CurrentWallet = memo(() => {
  const { connector, chainId, accounts, isActivating, error, account, isActive, provider } = useWeb3React()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="wrapper">
      <h1>Native Web3ReactProvider Status</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="inner">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">Current Priority Wallet Type:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }} className="right">
            {getName(connector)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">Current Chain Id:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }} className="right">
            {chainId}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">Wallet Connected Correct:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }} className="right">
            {isActive ? 'true' : 'false'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">is Activating:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }} className="right">
            {isActivating ? 'true' : 'false'}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">Priority Account:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20 }} className="right">
            {account}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <div className="left">Accounts Provided:</div>
          <div style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }} className="right">
            {accounts?.join(', ')}
          </div>
        </div>
      </div>
    </div>
  )
})

export default CurrentWallet
