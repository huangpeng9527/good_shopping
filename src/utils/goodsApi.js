import BASE_URL from './BASEURL'

// 获取商品搜索列表
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
        if (res.data.meta.status === 200) {
          resolve(res.data.message)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 获取商品详情
function apiGetGoodsDetail (goodsId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/goods/detail`, // 开发者服务器接口地址",
      method: 'GET',
      data: {
        goods_id: goodsId
      },
      success: res => {
        if (res.data.meta.status === 200) {
          resolve(res.data.message)
        }
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export { apiGetGoodsList, apiGetGoodsDetail }
