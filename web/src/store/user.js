import { ref, reactive } from 'vue'

class UserStore {
  constructor() {
    this.token = ref(localStorage.getItem('token'))
    this.userInfo = reactive({
      id: '',
      name: '',
      avatar: ''
    })
  }

  setToken(token) {
    this.token.value = token
    localStorage.setItem('token', token)
  }

  clearToken() {
    this.token.value = null
    localStorage.removeItem('token')
  }

  setUserInfo(info) {
    Object.assign(this.userInfo, info)
  }

  get isLoggedIn() {
    return !!this.token.value
  }
}

let userStore = null

export function useUserStore() {
  if (!userStore) {
    userStore = new UserStore()
  }
  return userStore
}