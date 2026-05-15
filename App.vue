<script setup>
import { onShow, onHide } from '@dcloudio/uni-app'
import wsService from './ws服务.js'

onShow(() => {
  const token = uni.getStorageSync('token')
  const userInfo = uni.getStorageSync('userInfo')

  if (token && userInfo && userInfo.id) {
    console.log('App: Connecting WebSocket for user', userInfo.id)
    wsService.connect(userInfo.id)
    wsService.startHeartbeat()
  }
})

onHide(() => {
  wsService.disconnect()
})
</script>

<style>
/*每个页面公共css */
</style>
