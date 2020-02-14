import BASE_URL from './BASEURL'

// 获取分类数据
function apiGetUserInfo ({ code, encryptedData, iv, rawData, signature }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/users/wxlogin`, // 开发者服务器接口地址",
      method: 'post',
      data: {
        code,
        encryptedData,
        iv,
        rawData,
        signature
      },
      success: res => {
        if (res.data.meta.status === 200) {
          if (res.data.meta.status === 200) {
            resolve(res.data.message)
          }
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export { apiGetUserInfo }
