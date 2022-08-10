// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'
import QRCode from 'qrcode'
// import copy from 'copy-to-clipboard'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Notification from './Notification'

import { WALLETCONNECT_CTA_TEXT_ID } from '../constants'
import { TextMap } from '../types'

async function formatQRCodeImage(data: string) {
  let result = ''
  const dataString = await QRCode.toString(data, { margin: 0, type: 'svg' })
  if (typeof dataString === 'string') {
    result = dataString.replace('<svg', `<svg class="walletconnect-qrcode__image"`)
  }
  return result
}

interface QRCodeDisplayProps {
  text: TextMap
  uri: string
}

function QRCodeDisplay(props: QRCodeDisplayProps) {
  // const [notification, setNotification] = React.useState('')
  const [svg, setSvg] = React.useState('')

  React.useEffect(() => {
    ;(async () => {
      setSvg(await formatQRCodeImage(`vimwallet://--/connect?uri=${props.uri}`))
    })()
  }, [])

  // const copyToClipboard = () => {
  //   const success = copy(props.uri)
  //   if (success) {
  //     setNotification(props.text.copied_to_clipboard)
  //     setInterval(() => setNotification(''), 1200)
  //   } else {
  //     setNotification('Error')
  //     setInterval(() => setNotification(''), 1200)
  //   }
  // }

  return (
    <>
      <div className="walletconnect-qrcode__displayWrap">
        <div dangerouslySetInnerHTML={{ __html: svg }}></div>
        {/* <div className="walletconnect-modal__footer">
        <a onClick={copyToClipboard}>{props.text.copy_to_clipboard}</a>
      </div> */}
        {/* <Notification message={notification} /> */}
      </div>
      <p id={WALLETCONNECT_CTA_TEXT_ID} className="walletconnect-qrcode__text">
        {props.text.scan_qrcode_with_wallet}
      </p>
    </>
  )
}

export default QRCodeDisplay
