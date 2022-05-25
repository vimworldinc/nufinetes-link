// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'preact/compat'
// @ts-ignore
import * as ReactDOM from 'preact/compat'
import { getDocumentOrThrow, getNavigatorOrThrow } from '@walletconnect/legacy-utils'
import { IQRCodeModalOptions } from '@walletconnect/legacy-types'

import { WALLETCONNECT_STYLE_SHEET } from './assets/style'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Modal from './components/Modal'
import Languages from './languages'
import {
  ANIMATION_DURATION,
  WALLETCONNECT_WRAPPER_ID,
  WALLETCONNECT_MODAL_ID,
  WALLETCONNECT_STYLE_ID,
} from './constants'
import { TextMap } from './types'

function injectStyleSheet() {
  const doc = getDocumentOrThrow()
  const prev = doc.getElementById(WALLETCONNECT_STYLE_ID)
  if (prev) {
    doc.head.removeChild(prev)
  }
  const style = doc.createElement('style')
  style.setAttribute('id', WALLETCONNECT_STYLE_ID)
  style.innerText = WALLETCONNECT_STYLE_SHEET
  doc.head.appendChild(style)
}

function renderWrapper(): HTMLDivElement {
  const doc = getDocumentOrThrow()
  const wrapper = doc.createElement('div')
  wrapper.setAttribute('id', WALLETCONNECT_WRAPPER_ID)
  doc.body.appendChild(wrapper)
  return wrapper
}

function triggerCloseAnimation(): void {
  const doc = getDocumentOrThrow()
  const modal = doc.getElementById(WALLETCONNECT_MODAL_ID)
  if (modal) {
    modal.className = modal.className.replace('fadeIn', 'fadeOut')
    setTimeout(() => {
      const wrapper = doc.getElementById(WALLETCONNECT_WRAPPER_ID)
      if (wrapper) {
        doc.body.removeChild(wrapper)
      }
    }, ANIMATION_DURATION)
  }
}

function getWrappedCallback(cb: any): any {
  return () => {
    triggerCloseAnimation()
    if (cb) {
      cb()
    }
  }
}

function getVimworldLangStorage(): string | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }
  const isVimworld = Boolean(window.localStorage.getItem('@VIMWORLD/DAPP'))
  if (!isVimworld) {
    return null
  }

  const lang = window.localStorage.getItem('lang') || 'en'
  return lang.split('-')[0]
}

function getText(): TextMap {
  const vimLang = getVimworldLangStorage()
  const lang = vimLang || getNavigatorOrThrow().language.split('-')[0] || 'en'
  return Languages[lang] || Languages['en']
}

export function open(
  uri: string,
  cb: any,
  qrcodeModalOptions?: IQRCodeModalOptions
  // customizeModal?: JSX.Element | string
) {
  injectStyleSheet()
  const wrapper = renderWrapper()
  ReactDOM.render(
    <Modal text={getText()} uri={uri} onClose={getWrappedCallback(cb)} qrcodeModalOptions={qrcodeModalOptions} />,
    wrapper
  )
}

export function close() {
  triggerCloseAnimation()
}
