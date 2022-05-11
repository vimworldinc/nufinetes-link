import QRCode from 'qrcode.react'

export function CusomModal({ uri }: { uri: string }) {
  if (uri) {
    return (
      <div>
        <QRCode
          size={146}
          level="M"
          bgColor="#ffffff00"
          imageSettings={{
            src: 'M',
            height: 146,
            width: 146,
          }}
          value={uri}
        />
      </div>
    )
  }

  return <div>No Uri</div>
}

export const renderModal = (uri) => {
  return <CusomModal uri={uri} />
}
