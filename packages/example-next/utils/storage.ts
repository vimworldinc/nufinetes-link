const WALLET_ADDRESS_KEY = 'userAddress'
const ACCESS_TOKEN_KEY = 'jwtToken'
const REFRESH_TOKEN_KEY = 'refresh'
const WALLET_CONNECT_SECTION_INDEX = 'walletConnectSectionIndex'

const storage = {
  getAccessToken(walletAddressInput?: string): string {
    const walletAddress = walletAddressInput
    if (!walletAddress) return ''

    const value = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!value) return ''

    const parseValue = JSON.parse(value)
    return parseValue?.[walletAddress]?.accessToken || ''
  },
  setAccessInfoByWalletAddress(walletAddress: string, accessInfo: any): void {
    const itemStr = localStorage.getItem(ACCESS_TOKEN_KEY)
    let obj = {}
    try {
      obj = JSON.parse(itemStr) || {}
    } catch (e) {
      obj = {}
    }

    obj[walletAddress] = accessInfo

    localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(obj))
  },

  setLocalStorageObject(key, subKey, value): void {
    const itemStr = localStorage.getItem(key)
    let obj = {}

    try {
      obj = JSON.parse(itemStr) || {}
    } catch (e) {}

    obj[subKey] = value

    localStorage.setItem(key, JSON.stringify(obj))
  },

  getLocalStorageObject(key, subKey) {
    const itemStr = localStorage.getItem(key)
    let obj = {}

    try {
      obj = JSON.parse(itemStr) || {}
    } catch (e) {}

    return subKey ? obj[subKey] : obj
  },
}

export { storage }
