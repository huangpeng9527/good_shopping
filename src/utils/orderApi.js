import BASE_URL from './BASEURL'

// 创建订单
function apiCreateOrder ({ orderPrice, consigneeAddr, goods }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/my/orders/create`, // 开发者服务器接口地址",
      method: 'post',
      header: {
        'Authorization': wx.getStorageSync('best_buy_token')
      },
      data: {
        order_price: orderPrice,
        consignee_addr: consigneeAddr,
        goods
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

// 支付
function apiToPay (orderNumber) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/my/orders/req_unifiedorder`, // 开发者服务器接口地址",
      method: 'post',
      header: {
        'Authorization': wx.getStorageSync('best_buy_token')
      },
      data: {
        order_number: orderNumber
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
export { apiCreateOrder, apiToPay }
