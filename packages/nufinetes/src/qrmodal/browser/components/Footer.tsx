// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'

import { ARROW_SVG_URL } from '../assets/arrow'
import { WALLETCONNECT_FOOTER_TEXT } from '../constants'

interface FooterProps {
  onClose: () => void
}

function Footer(props: FooterProps) {
  return (
    <div onClick={props.onClose} className="walletconnect-modal__backButton">
      <img src={ARROW_SVG_URL} className="walletconnect-modal__backButtonArrow" />
      <p>{WALLETCONNECT_FOOTER_TEXT}</p>
    </div>
  )
}

export default Footer
