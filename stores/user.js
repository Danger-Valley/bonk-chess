import { defineStore } from 'pinia'
import { useSocketStore } from './socket'

export const useUserStore = defineStore('user', () => {
  let { $API, $getWallets, $connectWallet, $formatWallet } = useNuxtApp()
  const user = ref(),
    wallets = ref()
  const socket = useSocketStore()

  const getUser = computed(() => user)
  const getWallets = computed(() => wallets)

  function saveWallets(wallets_) {
    wallets.value = wallets_;
  }

  async function saveUser(accessToken) {
    localStorage.setItem('accessToken', accessToken)
    await obtainUser();
    console.log(`User saved!`, user.value)
    document.querySelector(`#SignInPopup`)?.classList?.remove('popup__wrapper--active');
    socket.emit('auth', JSON.stringify({accessToken}))
  }

  async function updateUser(objToPass) {
    let accessToken = localStorage.getItem('accessToken')

    let resp = await $API().User.update(accessToken, objToPass);
    let body = await resp.json();

    console.log(body)

    if(body.errors) return $showToast(body.errors[0].message, 'error');

    user.value = body.user;
    console.log(`User updated!`, user.value)
  }

  async function obtainUser() {
    if (!process.client) return;

    let accessToken = localStorage.getItem('accessToken')
    console.log(accessToken, user.value)
    if (accessToken) {
      let resp = await $API().User.get(accessToken)
      let body = await resp.json()
      user.value = body.user;
      localStorage.setItem('userId', body.user.id)
      socket.emit('auth', JSON.stringify({accessToken}))
      $getWallets();
    }
  }

  return { getUser, getWallets, saveUser, obtainUser, updateUser, saveWallets }
})