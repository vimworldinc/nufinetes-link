// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'
import { TextMap } from '../types'

export type SwitcherType = 'mobile' | 'desktop'

interface SwitcherProps {
  curTab: SwitcherType
  setCurTab: (v: SwitcherType) => void
  text: TextMap
}

function Switcher({ curTab, setCurTab, text }: SwitcherProps) {
  return (
    <div className="walletconnect-modal__switcherWrap">
      <div
        onClick={() => setCurTab('mobile')}
        className={`walletconnect-modal_singleSwitcher${curTab === 'mobile' ? ' isActive' : ''}`}
      >
        Nufinetes {text.mobile}
      </div>
      <div
        onClick={() => setCurTab('desktop')}
        className={`walletconnect-modal_singleSwitcher${curTab === 'desktop' ? ' isActive' : ''}`}
      >
        Nufinetes {text.desktop}
      </div>
      <div className={`walletconnect-modal_switcherBg${curTab === 'desktop' ? ' moved' : ''}`}></div>
    </div>
  )
}

export default Switcher
