import BASE_URL from './BASEURL'

// 获取分类数据
function apiGetCartsList (goodsIds) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/goods/goodslist`, // 开发者服务器接口地址",
      method: 'GET',
      data: {
        goods_ids: goodsIds
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

export { apiGetCartsList }
