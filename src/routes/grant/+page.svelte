<script>
  import swal from 'sweetalert2'
  import srpc from '$lib/utilities/srpc.js'
  import { point, user } from '$lib/stores.js'

  srpc('https://a.njsc.ltd/aichat')

  let value = 0
  let users = ''
  let loading = false
  let cot = 0

  $: cot = users.match(/\S/) ? users.trim().split('\n').length : 0

  async function submit () {
    const us = users.trim().split('\n').map(x => x.trim())
    if (us.length * value > $point) return swal.fire('剩余点数不足', '', 'error')
    loading = true
    await srpc.grant($user?.token, us, value)
    loading = false
    $point -= us.length * value
    return swal.fire('成功', '', 'success')
  }

  async function del () {
    const us = users.trim().split('\n').map(x => x.trim())
    loading = true
    await srpc.del($user?.token, us)
    loading = false
    return swal.fire('成功', '', 'success')
  }
</script>

<div class="w-full min-h-screen p-4 sm:p-10 bg-gray-100 flex flex-col">
  <h1 class="text-3xl font-bold my-2">点数分配</h1>
  <p>您的点数剩余：<code>{$point}</code></p>
  <label class="block my-2">分配点数数值: <input type="number" class="border px-2 py-1 font-mono" bind:value={value}></label>
  <label class="block mt-2">用户id:</label>
  <textarea class="block w-full p-2 my-1" placeholder="一行一个用户id" rows="10" bind:value={users}></textarea>
  <p class="text-sm">共计分配点数：<code>{value} * {cot} = {value * cot}</code></p>
  {#if loading}
    <p class="m-4">Loading...</p>
  {:else}
    <div class="flex items-center">
      <button on:click={submit} class="bg-blue-500 text-white px-3 py-1 m-4 rounded transition-all shadow hover:shadow-md self-start font-bold">分配点数</button>
      {#if $user.id === 'root'}
        <button on:click={del} class="bg-red-500 text-white px-3 py-1 m-4 rounded transition-all shadow hover:shadow-md self-start font-bold">清空点数</button>
      {/if}
    </div>
  {/if}
</div>