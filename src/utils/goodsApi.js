import BASE_URL from './BASEURL'

// 获取分类数据
function apiGetGoodsList ({ query, pagesize, pagenum }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/goods/search`, // 开发者服务器接口地址",
      method: 'GET',
      data: {
        query,
        pagesize,
        pagenum
      },
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export { apiGetGoodsList }
