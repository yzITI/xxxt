import { browser } from '$app/environment'

export function sendIn (msg, iframe) {
  if (!browser) return
  const win = iframe?.contentWindow
  if (!win) return
  win.postMessage(JSON.stringify(msg), '*')
}

export function sendOut (msg) {
  if (!browser) return
  const win = window.parent
  if (!win) return
  win.postMessage(JSON.stringify(msg), '*')
}

export function setListener (f) {
  if (!browser) return
  window.onmessage = e => {
    try { f(JSON.parse(e.data)) }
    catch { return }
  }
}
