<script>
  import bannerImg from '$lib/images/banner.svg'
  import logoImg from '$lib/images/logo.svg'
  import { goto } from '$app/navigation'
  import swal from 'sweetalert2'
  import { user } from '$lib/stores.js'

  function login () {
    window.location.href = 'https://cn.aauth.link/#/launch/xxxt'
  }

  let cot = 0
  function hit () {
    cot++
    if (cot >= 5) {
      swal.fire('Developer Mode!', 'You have entered the developer mode', 'success')
      window.localStorage.developer = 1
    }
    setTimeout(() => { cot-- }, 2000)
  }
</script>

<section class="w-full h-screen relative bg-black text-white flex flex-col items-center justify-center">
  <img src={bannerImg} class="absolute w-full left-0 object-cover opacity-30" style="height: 120vh; top: -20vh;">
  <img on:click={hit} src={logoImg} class="absolute w-20 h-20 top-2 left-2">
  <div class="relative flex flex-col items-center">
    <h1 class="font-bold text-6xl sm:text-8xl">信息学堂</h1>
    <button on:click={login} class="bg-white shadow transition-all hover:shadow-md px-4 py-2 rounded text-xl text-gray-700 font-bold hover:px-6 my-10">登 录</button>
  </div>
</section>