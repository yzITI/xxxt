import { goto } from '$app/navigation'
import { user } from '$lib/stores.js'

export const ssr = false

export function load (ctx) { // login with token
  const token = ctx.url.searchParams.get('token')
  if (!token) return
  window.sessionStorage.token = token
  goto('/home')
}
