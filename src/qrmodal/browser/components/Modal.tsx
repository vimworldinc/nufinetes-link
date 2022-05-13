import * as React from 'preact/compat'
import {
  // IMobileRegistryEntry,
  IQRCodeModalOptions,
  // IAppRegistry, IMobileLinkInfo
} from '@walletconnect/legacy-types'
import {
  isMobile,
  // isAndroid,
  // formatIOSMobile,
  // saveMobileLinkInfo,
  // getMobileLinkRegistry,
  // getWalletRegistryUrl,
  // formatMobileRegistry,
} from '@walletconnect/legacy-utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Footer from './Footer'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DesktopLink from './DesktopLink'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import QRCodeDisplay from './QRCodeDisplay'

import { WALLETCONNECT_MODAL_ID } from '../constants'
import { TextMap } from '../types'

interface ModalProps {
  text: TextMap
  uri: string
  onClose: () => void
  qrcodeModalOptions?: IQRCodeModalOptions
}

function Modal(props: ModalProps) {
  const mobile = isMobile()

  const displayProps = {
    mobile,
    text: props.text,
    uri: props.uri,
    qrcodeModalOptions: props.qrcodeModalOptions,
  }
  return (
    <div id={WALLETCONNECT_MODAL_ID} className="walletconnect-qrcode__base animated fadeIn">
      <div className="walletconnect-modal__base">
        <h5 className="walletconnect-modal__title">{props.text.connect_wallet}</h5>
        {!mobile && <QRCodeDisplay {...displayProps} />}
        <DesktopLink text={props.text} wcUri={props.uri} />
        <Footer onClose={props.onClose} />
      </div>
    </div>
  )
}

export default Modal
