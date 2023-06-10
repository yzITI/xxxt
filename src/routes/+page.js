import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { user } from '$lib/stores.js'

function decodeToken (token) {
  let input = token.split('.')[1]
  if (!input) return {}
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = input.length % 4
  if (pad) input += new Array(5 - pad).join('=')
  return JSON.parse(decodeURIComponent(atob(input).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')))
}

export function load (ctx) {
  if (!browser) return
  const SS = window.sessionStorage
  const token = ctx.url.searchParams.get('token') || SS.token
  if (!token) return
  const payload = decodeToken(token)
  if (!payload.id || payload.iat < Date.now() - 86400e3) return
  user.set({ ...payload, token })
  SS.token = token
  goto('/home')
}
