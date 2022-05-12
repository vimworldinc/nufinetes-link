import { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useAccount } from './AccountProvider'

const Dapp = memo(() => {
  const { connector, chainId, accounts, isActivating, error, account, isActive } = useWeb3React()
  const { currentAccount, authToken, handleConnect, handleLogout, isSigning, isRequestingCode, isLogining } =
    useAccount()

  useEffect(() => {
    connector.connectEagerly()
  }, [])

  return (
    <DappWrapper>
      <DappContent>
        <>
          {isRequestingCode && <span>正在获取登录 code</span>}
          {isSigning && <span>请在钱包内完成登录签名</span>}
          {isLogining && <span>登录中...</span>}
        </>
        {!authToken ? (
          <>
            {!(isSigning || isRequestingCode || isLogining) ? (
              <>
                {isActivating ? (
                  <span>Activating</span>
                ) : (
                  <ConnectButton onClick={handleConnect}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="31.785" height="31.053">
                      <path
                        fill="#fff"
                        d="M23.944 9.839l-2.3-3.984a1.1 1.1 0 00-1.494-.407L5.035 14.174a1.1 1.1 0 01-1.1-1.905L19.05 3.543a1.1 1.1 0 00-1.1-1.906L2.835 10.364a3.286 3.286 0 00-1.185 4.494l7.7 13.337a3.286 3.286 0 004.485 1.221L28.95 20.69a1.1 1.1 0 00.394-1.498l-2.3-3.984a3.289 3.289 0 00-3.1-5.37zm2.96 9.491l-14.17 8.181a1.1 1.1 0 01-1.494-.407L5.09 16.452a3.212 3.212 0 001.045-.372l14.17-8.182 1.65 2.858-2.834 1.637a3.3 3.3 0 003.3 5.715l2.835-1.636zM25.1 14.022l-3.779 2.181a1.1 1.1 0 01-1.1-1.905L24 12.116a1.1 1.1 0 011.1 1.906z"
                      ></path>
                    </svg>
                  </ConnectButton>
                )}
              </>
            ) : null}
          </>
        ) : (
          <AccountContent>
            {authToken}
            <div className="button-group">
              <div onClick={handleConnect} className="single-button add">
                Add Account
              </div>
              <div onClick={handleLogout} className="single-button">
                Logout
              </div>
            </div>
          </AccountContent>
        )}
      </DappContent>

      <h1>Dapp Account Status</h1>
      <div className="inner">
        <StatusLine>
          <div className="left">Auth Token:</div>
          <div className="right">{authToken}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Is Signing:</div>
          <div className="right">{isSigning ? 'true' : 'false'}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Account Using:</div>
          <div className="right">{currentAccount}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Priority Account:</div>
          <div className="right">{account}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Accounts Provided:</div>
          <div className="right">
            {accounts?.length
              ? accounts.map((a) => (
                  <span key={a} className={a.toLowerCase() === currentAccount.toLowerCase() ? 'red' : ''}>
                    {a}
                    <br />
                  </span>
                ))
              : ''}
          </div>
        </StatusLine>
      </div>

      <h1>Nufinetes Status</h1>
      <div className="inner">
        <StatusLine>
          <div className="left">Current Chain Id:</div>
          <div className="right">{chainId}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Wallet Connected Correct:</div>
          <div className="right">{isActive ? 'true' : 'false'}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">is Activating:</div>
          <div className="right">{isActivating ? 'true' : 'false'}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Priority Account:</div>
          <div className="right">{account}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Accounts Provided:</div>
          <div className="right">{accounts?.join(', ')}</div>
        </StatusLine>
        <StatusLine>
          <div className="left">Error:</div>
          <div className="right">{JSON.stringify({ error })}</div>
        </StatusLine>
      </div>
    </DappWrapper>
  )
})

export default Dapp

const DappWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StatusLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 700px;
  font-size: 20px;
  margin-bottom: 14px;

  .right {
    font-weight: bold;
    word-break: break-all;
    max-width: 450px;

    .red {
      color: red;
    }
  }
`

const DappContent = styled.div`
  height: 200px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px;
  width: 500px;
  margin-top: 20px;
`

const ConnectButton = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 36px;
  background: #f44336;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const AccountContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .button-group {
    .single-button {
      min-width: 120px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: solid 1px #000;
      border-radius: 10px;
      margin-top: 12px;
      cursor: pointer;
      &:hover {
        &.add {
          background: #1665e3;
        }
        background: #ff4436;
      }
    }
  }
`
