// 导入base_url
import BASE_URL from './BASEURL'

// 获取轮播图数据
function apiGetSwiperData () {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/home/swiperdata`, // 开发者服务器接口地址",
      method: 'GET',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 获取分类列表
function apiGetCatitems () {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/home/catitems`,
      method: 'GET',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
// 获取楼层数据
function apiGetFloorData () {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/api/public/v1/home/floordata`,
      method: 'GET',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

export { apiGetSwiperData, apiGetCatitems, apiGetFloorData }
