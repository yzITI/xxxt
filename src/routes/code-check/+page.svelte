<script>
  import swal from 'sweetalert2'
  import srpc from '$lib/utilities/srpc.js'
  import { micromark } from 'micromark'
  import { point, user } from '$lib/stores.js'
  import { AIcon, AButton } from 'ace.svelte'
  import { mdiTranslate } from '@mdi/js'

  srpc('https://a.aauth.link/aichat')

  let lang = false // en: false, zh: true
  let ready = false, loading = false
  let input = '', pointUsed = 0
  let html = ''

  $: if (input.match(/\S/)) {
    html = ''
    ready = true
  } else {
    html = ''
    ready = false
  }

  async function analyze () {
    if (!ready || loading) return
    loading = true
    const msgs = [{ role: 'system', content: 'find errors without code or explanation' + (lang ? ' in Chinese' : '') }, { role: 'user', content: input }]
    const res = await srpc.chat($user?.token, msgs)
    loading = false
    if (res.err) return swal.fire('Error', res.err, 'error')
    const r = res.choices[0].message.content.trim()
    html = micromark(r)
    pointUsed = res.usage
    point.set(typeof res.point === 'number' ? res.point : Infinity)
  }
</script>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <h1 class="font-bold text-3xl flex items-center justify-between">
    <span>{lang ? '代码检查' : 'Code Check'}</span>
    <button on:click={() => { lang = !lang }}>
      <AIcon path={mdiTranslate} size="2rem" color="#333333" />
    </button>
  </h1>
  <p class="text-gray-500 my-2">{lang ? '请将需要检查的代码复制到下面的输入框中' : 'Please paste your code in the input box below'}</p>
  <textarea class="block p-2 font-mono border w-full resize-none text-sm" rows="20" bind:value={input}></textarea>
  {#if loading}
    <p class="m-2">Loading...</p>
  {:else if html}
    <div class="shadow border rounded my-2 p-4 bg-white">
      <h4 class="font-bold text-xl">{lang ? '检查结果' : 'Result'}</h4>
      <hr class="my-1">
      <p class="text-gray-500 text-xs font-mono mb-3">Points: {pointUsed} used, {$point} left.</p>
      {@html html}
    </div>
  {:else}
    <button on:click={analyze} class={(ready ? 'bg-blue-500' : 'bg-gray-500') + ' font-bold text-lg px-4 py-2 my-2 rounded shadow transition-all hover:shadow-md text-white'}>{lang ? '提 交' : 'Submit'}</button>
  {/if}
</div>
