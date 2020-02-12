<template>
  <div>我的</div>
</template>

<script>
export default {
  onShow () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      wx.getSetting({
        success: res => {
          console.log(res)
          if (res.authSetting['scope.address'] === false) {
            console.log('false')
            wx.showModal({
              title: '提示', // 提示的标题,
              content: '请在设置中开启权限', // 提示的内容,
              success: res => {
                if (res.confirm) {
                  wx.openSetting()
                }
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.address',
              success: res => {
                console.log(res, 'author')
                wx.chooseAddress({
                  success: function (result) {
                    console.log(result)
                  }
                })
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style>
</style>