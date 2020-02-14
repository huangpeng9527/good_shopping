<template>
  <div>
    <button open-type="getUserInfo"
            @getuserinfo="getUserInfo">点我登录</button>
  </div>
</template>

<script>
import { apiGetUserInfo } from '../../utils/userinfoApi'
export default {
  methods: {
    getUserInfo (userinfo) {
      // 用户数据详情
      let detail = userinfo.mp.detail
      // 获取登录数据
      wx.login({
        success: async (res) => {
          let data = await apiGetUserInfo({
            code: res.code,
            encryptedData: detail.encryptedData,
            iv: detail.iv,
            rawData: detail.rawData,
            signature: detail.signature
          })
          // 获取数据后存储token并back
          wx.setStorageSync('best_buy_token', data.token)
          // 返回前一个页面
          wx.navigateBack()
        }
      })
    }
  }
}
</script>

<style>
</style>