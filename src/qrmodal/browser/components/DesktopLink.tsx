// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'

import { TextMap } from '../types'
import { NUFINETES_LOGO_SVG } from '../assets/nufinetes'
import { PcImage } from './PcImage'
import { MOBILE_LINK_SVG } from '../assets/mobile_image'
import { formatIOSMobile, isAndroid, saveMobileLinkInfo } from '@walletconnect/legacy-utils'
import { IMobileRegistryEntry } from '@walletconnect/legacy-types'

interface DesktopLinkProps {
  mobile?: boolean
  wcUri: string
  text: TextMap
}

function getMobileBrowserScheme() {
  if (typeof window === 'undefined') {
    return ''
  }
  const ua = window.navigator.userAgent
  var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i)
  var webkit = !!ua.match(/WebKit/i)
  const iOSChrome = iOS && webkit && ua.match(/CriOS/i)
  // const iOSSafari = iOS && webkit && !ua.match(/CriOS/i)

  return iOSChrome ? 'chrome' : ''
}

const NUNI_UNIVERSAL_LINK = 'https://apple.vimworld.org'

function DesktopLink({ mobile, wcUri, text }: DesktopLinkProps) {
  const android = isAndroid()
  return (
    <>
      {mobile ? (
        <div className="walletconnect-modal__mobileImageWrap">
          <img src={MOBILE_LINK_SVG} className="walletconnect-modal__mobileImage" />
        </div>
      ) : (
        <div className="walletconnect-modal__pcImage">
          <PcImage />
        </div>
      )}
      <div
        onClick={() => {
          if (android) {
            saveMobileLinkInfo({
              name: 'Unknown',
              href: wcUri,
            })
            window.open(`${wcUri}&from_browser=${getMobileBrowserScheme()}`)
            return
          }
          if (mobile) {
            // const href = formatIOSMobile(wcUri, { universalLink: NUNI_UNIVERSAL_LINK } as IMobileRegistryEntry)
            // saveMobileLinkInfo({
            //   name: 'Nufinetes',
            //   href: href,
            // })
            if (typeof localStorage !== 'undefined') {
              localStorage?.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
            }
            const encodedUri = encodeURIComponent(wcUri)
            window.open(`${NUNI_UNIVERSAL_LINK}/wc?uri=${encodedUri}`)
            return
          }
          const href = formatIOSMobile(wcUri, { deepLink: 'vimwallet:' } as IMobileRegistryEntry)
          saveMobileLinkInfo({
            name: 'Nufinetes',
            href: href,
          })
          window.location.href = `vimwallet://--/connect?uri=${wcUri}&from_browser=${getMobileBrowserScheme()}`
        }}
        className="walletconnect-modal__desktopLink"
      >
        <div className="walletconnect-modal__desktopLinkInner">
          <img src={NUFINETES_LOGO_SVG} className="walletconnect-modal__nufinetesLogo" />
          <p>{text.nufinetes_wallet}</p>
        </div>
        <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" fill="rgba(255, 255, 255, 0.6)">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        </svg>
      </div>
    </>
  )
}

export default DesktopLink
