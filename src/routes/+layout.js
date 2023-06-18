import { browser } from '$app/environment'
import { user } from '$lib/stores.js'

function decodeToken (token) {
  let input = token?.split('.')[1]
  if (!input) return {}
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = input.length % 4
  if (pad) input += new Array(5 - pad).join('=')
  return JSON.parse(decodeURIComponent(atob(input).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
}

// auto login with SS.token
export function load () {
  if (!browser) return
  const token = window.sessionStorage.token
  if (!token) return
  const payload = decodeToken(token)
  if (!payload.id || payload.iat < Date.now() - 86400e3) {
    window.sessionStorage.removeItem('token')
    return
  }
  user.set({ ...payload, token })
  return { user: { ...payload, token } }
}
