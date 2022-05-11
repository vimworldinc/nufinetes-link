// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'

import { TextMap } from '../types'
import { NUFINETES_LOGO_SVG } from '../assets/nufinetes'
import { WALLETCONNECT_NUFINETES_TEXT } from '../constants'

interface DesktopLinkProps {
  wcUri: string
  text: TextMap
}

function DesktopLink({ wcUri, text }: DesktopLinkProps) {
  console.log(text, 'check text')
  return (
    <>
      <div
        onClick={() => {
          window.location.href = `vimwallet://--/connect?uri=${wcUri}`
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
      <a
        className="walletconnect-modal_appLink"
        href="https://nufinetes.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        {text.no_nufinetes}
      </a>
    </>
  )
}

export default DesktopLink
