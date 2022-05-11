export const handleGetCode = async (): Promise<string> => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve('code1122334455')
    }, 2000)
  })
}

export const handleGetToken = async (params) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve(`token-${new Date().getTime()}`)
    }, 3000)
  })
}

export function getQuery(url) {
  const splitUrl = (url || '').split('?')
  if (splitUrl.length < 2) {
    return {}
  }
  let qs = splitUrl[1]
  qs = qs.split('#')[0]
  if (qs.length === 0) {
    return {}
  }
  const paramPairs = qs.split('&')
  const params = {}
  paramPairs.forEach((e) => {
    if (!e || e.length === 0) {
      return
    }
    const pair = e.split('=')
    if (pair.length < 2) {
      return
    }
    const key = pair[0]
    const value = pair.slice(1, pair.length).join('=')
    if (value.length === 0) {
      return
    }
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  })
  return params
}

export function refreshLink(address = '') {
  const href = window.location.href
  const params: any = getQuery(href)
  if (!address && !params.userAddress) return
  params.userAddress = address
  const newParams = Object.keys(params).map((key: string) => {
    return `${key}=${params[key]}`
  })
  let newHref = `${href.split('?')[0]}`
  if (newParams.length > 0) {
    newHref += `?${newParams.join('&')}`
  }
  if (`${window.location.href}`.includes('/Code403')) {
    // 403刷新的时候跳转至dashboard
    window.location.href = `${window.location.origin}/dashboard?userAddress=${address}`
  } else {
    window.location.href = newHref
  }
}
