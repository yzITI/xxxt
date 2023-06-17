<script setup>
  import srpc from '$lib/utilities/srpc.js'
  import { user, point } from '$lib/stores.js'
  import swal from 'sweetalert2'
  import { sendIn, setListener } from '$lib/utilities/iframe.js'
  import { fade } from 'svelte/transition';
  
  srpc('https://a.aauth.link/aichat')

  let iframe = null, loading = false
  const msgs = [{ role: 'system', content: '你是信息学堂AI助教，简短回答问题' }]

  const html = '同学们可以在这里提问各种信息技术问题哦！'

  setListener(async msg => {
    if (msg.ready) {
      sendIn({ slide: { data: { html } } }, iframe)
    }
    if (msg.response) {
      msgs.push({ role: 'user', content: msg.response })
      loading = true
      const res = await srpc.chat($user?.token, msgs)
      loading = false
      if (res.err) return swal.fire('Error', res.err, 'error')
      const m = res.choices[0].message
      m.content = m.content.trim()
      msgs.push(m)
      sendIn({ message: m.content }, iframe)
      $point = res.point
      if (typeof $point !== 'number') $point = Infinity
    }
  })
</script>

<div class="w-full h-screen relative" style="height: 100dvh;">
  <iframe title="test" class="w-full h-full" bind:this={iframe} src="https://s.yzzx.org/slide/#/plugins/chat?inverse=1" />
  {#if loading}
    <div transition:fade class="absolute w-full h-20 bg-gray-100 bottom-0 left-0 flex items-center justify-between text-sm p-4">
      <div>正在响应，请稍等......</div>
      {#if $point}
        <div class="font-mono">点数剩余：{$point}</div>
      {/if}
    </div>
  {/if}
</div>
