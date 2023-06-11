<script>
  import { user, point } from '$lib/stores.js'
  import { goto } from '$app/navigation'
  import { AIcon } from 'ace.svelte'
  import { mdiCardAccountDetailsOutline, mdiPresentation, mdiForumOutline, mdiTooltipQuestionOutline, mdiCodeTags, mdiAlertCircleOutline, mdiGiftOutline, mdiQrcodeScan, mdiTuneVertical } from '@mdi/js'
  import swal from 'sweetalert2'
  import srpc from '$lib/utilities/srpc.js'

  srpc('https://a.aauth.link/aichat')

  const developer = window.localStorage.developer
  if (!$user.id) goto('/')

  async function init () {
    point.set('Loading...')
    const res = await srpc.point($user.token)
    point.set(typeof res === 'number' ? res : Infinity)
  }
  init()

  const showID = () => swal.fire({
    showConfirmButton: false,
    html: `
    <div class="flex flex-col items-center">
      <svg class="w-48 my-4" viewBox="0 0 18 18" fill="#000" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" version="1.1">${DATAMatrix({ msg: $user.id, pad: 0 }).innerHTML}</svg>
      <p><code>${$user.id}</code></p>
    </div>`
  })

  function gotoWithPoint (route) {
    if ($point < 1) return swal.fire('点数不足', '您的点数不足，请联系管理员！', 'error')
    goto(route)
  }

  const buttonList = [{
    title: '我的ID',
    icon: mdiCardAccountDetailsOutline,
    action: showID
  }, {
    title: '课堂课件',
    icon: mdiPresentation,
    action: () => window.open('https://s.yzzx.org/slide/#/view/xxxt?name=' + $user.name)
  }, {
    title: 'AI助教',
    icon: mdiForumOutline,
    action: () => gotoWithPoint('/chat')
  }, {
    title: '通用答疑',
    icon: mdiTooltipQuestionOutline,
    action: () => gotoWithPoint('/question')
  }, {
    title: '代码检查',
    icon: mdiCodeTags,
    action: () => gotoWithPoint('/code-check')
  }, {
    title: '错误解释',
    icon: mdiAlertCircleOutline,
    action: () => gotoWithPoint('/error-check')
  }, {
    title: '支持一下',
    icon: mdiGiftOutline,
    action: () => goto('/donate')
  }, {
    title: '扫一扫',
    icon: mdiQrcodeScan,
    action: () => goto('/scan'),
    developer: true
  }, {
    title: '点数分配',
    icon: mdiTuneVertical,
    action: () => goto('/grant'),
    developer: true
  }]
</script>

<svelte:head>
  <script src="https://cdn.jsdelivr.net/gh/datalog/datamatrix-svg/datamatrix.min.js" async></script>
</svelte:head>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100">
  <h1 class="font-bold text-3xl">你好，{$user.name}</h1>
  <p class="my-1 text-gray-500">欢迎来到信息学堂！您的点数剩余：<code>{$point}</code></p>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-4">
    {#each buttonList as b}
      {#if developer || !b.developer}
        <button on:click={b.action} class="m-2 p-4 bg-gray-200 flex items-center font-bold text-gray-700 rounded hover:bg-gray-300 transition-all">
          <AIcon path={b.icon} size="2rem" color="#333333" />
          <div class="ml-2">{b.title}</div>
        </button>
      {/if}
    {/each}
  </div>
</div>
