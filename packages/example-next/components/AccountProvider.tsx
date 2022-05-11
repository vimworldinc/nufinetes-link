import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { handleGetCode, handleGetToken, refreshLink } from '../utils'
import { storage } from '../utils/storage'
interface TokenBalanceProps extends TokenSubscriptionProps {
  balance: number
  decimals?: number
}

interface TokenSubscriptionProps {
  isSolid: boolean // won't remove even if forseUpdate is true
  symbol: string
  address: string
  decimals?: number
}

interface PrecisionMap {
  amountPrecision: number
  pricePrecision: number
}

const AccountContext = createContext<
  | {
      account: string
      currentAccount: string
      authToken: string
      handleConnect: () => void
      handleLogout: () => void
      isSigning: boolean
      isRequestingCode: boolean
      isLogining: boolean
      acceptTermsData: {
        address: string
        loginCert: string
        getTokenRes: string
      }
    }
  | undefined
>(undefined)

const keepSignInfo = (acceptTermsData) => {
  if (typeof window === 'undefined') {
    return
  }
  storage.setLocalStorageObject('_cert_', acceptTermsData.address, acceptTermsData.loginCert)
  storage.setAccessInfoByWalletAddress(acceptTermsData.address, acceptTermsData.getTokenRes)
  localStorage.setItem('userAddress', acceptTermsData.address)

  // 更新签名时间
  const agreeObj = storage.getLocalStorageObject('TermsConditionsAgree', null)
  agreeObj[acceptTermsData.address] = new Date().getTime()
  localStorage.setItem('TermsConditionsAgree', JSON.stringify(agreeObj))
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { connector, chainId, accounts, isActivating, error, account, isActive, provider } = useWeb3React()
  const [isRequestingCode, setIsRequestingCode] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [isLogining, setIsLogining] = useState(false)
  const [currentAccount, setCurrentAccount] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [acceptTermsData, setAcceptTermsData] = useState(Object.create(null))

  const handleGetSignRes = async (code) => {
    try {
      const signParams = {
        id: 1,
        jsonrpc: '2.0',
        method: 'vechain_certificate',
        params: [
          {
            cert: JSON.stringify({
              purpose: 'identification',
              payload: {
                type: 'text',
                content: code,
              },
              domain: window.location.origin,
            }),
          },
        ],
      }
      console.log(provider, 'check provider')
      const walletSignRes = await (provider as any).sendCustomRequest(signParams)
      return walletSignRes
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleConnect = async () => {
    if (!isActive) {
      connector.activate()
    }
    setIsRequestingCode(true)
    const code = await handleGetCode()
    console.log(code, 'check code')
    if (code) {
      setAuthCode(code)
    }
    setIsRequestingCode(false)
  }

  const handleSignAndLogin = async () => {
    try {
      setIsSigning(true)
      const signRes = await handleGetSignRes(authCode)
      console.log(signRes, 'check sign res')
      setIsSigning(false)
      const walletSignResObj = JSON.parse(signRes)
      const signingAddress = (walletSignResObj.signer || '').toLowerCase()
      const loginCert = {
        chainId: chainId,
        signature: walletSignResObj.signature,
        certificate: {
          purpose: 'purpose',
          domain: walletSignResObj.domain,
          signer: walletSignResObj.signer,
          timestamp: walletSignResObj.timestamp,
          payload: {
            type: 'type',
            content: authCode,
          },
        },
      }
      setIsLogining(true)
      const tokenRes = await handleGetToken(loginCert)
      setAcceptTermsData({
        address: signingAddress,
        getTokenRes: tokenRes,
      })

      setIsLogining(false)
      handleConfirmLogin({
        address: signingAddress,
        getTokenRes: tokenRes,
      })
    } catch (error) {
      console.log(error)
      setIsSigning(false)
      setAuthCode('')
    }
  }

  const handleLogout = () => {
    setIsSigning(false)
    setIsLogining(false)
    setIsRequestingCode(false)
    setAuthCode('')
    setAcceptTermsData(Object.create(null))
    localStorage.removeItem('_cert_')
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userAddress')
    connector.deactivate()
  }

  const handleConfirmLogin = (acceptTermsData) => {
    var r = confirm('Accept terms and login ?')
    console.log(acceptTermsData, r, 'check r')
    if (r) {
      setCurrentAccount(acceptTermsData.address)
      refreshLink(acceptTermsData.address)
      keepSignInfo(acceptTermsData)
    } else {
      setIsSigning(false)
      setIsLogining(false)
      setIsRequestingCode(false)
      setAuthCode('')
    }
  }

  useEffect(() => {
    if (authCode && isActive) {
      console.log('sign and logining')
      handleSignAndLogin()
    }
  }, [authCode, isActive])

  useEffect(() => {
    if (!isActive || typeof window === 'undefined') {
      return
    }
    const { search } = window.location
    const _targetAddr = search.indexOf('userAddress') !== -1 ? search.split('userAddress=')[1] : ''
    const curAccount = _targetAddr || account.toLowerCase()
    const localToken = localStorage.getItem('jwtToken')
    console.log(_targetAddr, account.toLowerCase(), localToken, 'check location')
    if (!localToken) {
      return
    }

    const parsedToken = JSON.parse(localToken)
    if (!parsedToken?.[curAccount as string] && !parsedToken?.[account.toLowerCase()]) {
      return
    }

    if (parsedToken?.[curAccount as string]) {
      setCurrentAccount(curAccount)
      setAcceptTermsData({
        address: curAccount,
        getTokenRes: parsedToken?.[curAccount as string],
      })
    } else if (parsedToken?.[account.toLowerCase()]) {
      setCurrentAccount(account.toLowerCase())
      setAcceptTermsData({
        address: curAccount,
        getTokenRes: parsedToken?.[account.toLowerCase()],
      })
    }
  }, [isActive, account])

  return (
    <AccountContext.Provider
      value={{
        account,
        currentAccount,
        authToken: acceptTermsData?.getTokenRes,
        handleConnect,
        handleLogout,
        isSigning,
        isRequestingCode,
        isLogining,
        acceptTermsData,
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccountProvider must be used in AccountProvider')
  } else {
    return context
  }
}
