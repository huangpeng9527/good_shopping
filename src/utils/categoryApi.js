import BASE_URL from './BASEURL'

// 获取分类数据
function apiGetCategoryData () {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/categories`, // 开发者服务器接口地址",
      method: 'GET',
      success: res => {
        if (res.data.meta.status === 200) {
          resolve(res)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export { apiGetCategoryData }
