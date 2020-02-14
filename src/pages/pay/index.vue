<template>
  <div>
    <div class="address-wrapper">
      <div class="address"
           @click="getAddress"
           v-if="address.userName">
        <div class="receiver">
          <p class="name">收货人: &nbsp;&nbsp; {{address.userName}}</p>
          <p class="phone-num">{{address.telNumber}}</p>
          <span class="iconfont icon-arrow-right"></span>
        </div>
        <p class="address-txt">{{filterAddress}}</p>
      </div>
      <!-- 选择地址 -->
      <div class="choose-address"
           v-else
           @click="getAddress">
        <p>请选择地址</p>
        <span class="iconfont icon-arrow-right"></span>
      </div>
      <div class="flower">
        <img src="/static/images/cart_border@2x.png">
      </div>
    </div>

    <!-- 商品列表 -->
    <ul class="goods-list">
      <li class="goods-item"
          v-for="(item,index) in goodsList"
          :key="index">
        <img :src="item.goods_small_logo"
             alt="">
        <div class="right">
          <p class="line-clamp2">{{item.goods_name}}</p>
          <div class="btm">
            <span class="price">￥<span>{{item.goods_price}}</span>.00</span>
            <div class="goods-num">
              <span>x{{item.num}}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div class="bottom-fixed"
         @click="pay">
      微信支付(￥{{totalPrice}})
    </div>
  </div>
</template>


<script>
import { apiGetCartsList } from '../../utils//cartsApi'
import { apiCreateOrder, apiToPay } from '../../utils/orderApi'
export default {
  data () {
    return {
      address: wx.getStorageSync('best_buy_address') || {},
      goodsList: []
    }
  },
  computed: {
    // 结算金额
    totalPrice () {
      return this.goodsList.reduce((sum, item) => {
        return sum + item.goods_price * item.num
      }, 0)
    },
    // 收货地址计算
    filterAddress () {
      let { provinceName, cityName, countyName, detailInfo } = this.address
      return provinceName + cityName + countyName + detailInfo
    }

  },
  onLoad (options) {
    this.goodsIds = options.goodsId
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      let carts = wx.getStorageSync('carts')
      let ids = []
      // 如果是立即购买-用传过来的id获取列表
      if (this.goodsIds) {
        ids = this.goodsIds
      } else {
        // 如果不是立即购买从购物车中获取数据
        // 如果carts中的checked属性是true则将其goodsId添加到ids中
        for (let key in carts) {
          if (carts[key].checked) {
            ids.push(key)
          }
        }
        ids = ids.join(',')
      }
      // 当ids不为空时则发送请求
      if (ids) {
        let res = await apiGetCartsList(ids)
        // 合并商品列表和购物车数据
        res.forEach((item) => {
          item.num = carts[item.goods_id].num
        })
        this.goodsList = res
      }
    },
    // 获取用户地址
    getAddress () {
      wx.getSetting({
        success: res => {
          // 如果用户授权状态是false,提醒用户在设置里面设置权限
          if (res.authSetting['scope.address'] === false) {
            wx.showModal({
              title: '提示', // 提示的标题,
              content: '请在设置中开启通讯地址权限', // 提示的内容,
              success: res => {
                if (res.confirm) {
                  // 打开设置
                  wx.openSetting()
                }
              }
            })
          } else {
            wx.authorize({
              scope: 'scope.address',
              success: res => {
                // 成功就打开通讯地址界面
                wx.chooseAddress({
                  success: (res) => {
                    this.address = res
                    wx.setStorageSync('best_buy_address', res)
                  }
                })
              }
            })
          }
        }
      })
    },
    // 支付
    pay () {
      // 如果收货地址为空时提示
      if (!this.address.userName) {
        wx.showToast({
          title: '请先填写收获地址', // 提示的内容,
          icon: 'none'
        })
        return
      }
      // 如果没有商品时提示
      if (!this.goodsList.length) {
        wx.showToast({
          title: '没有商品不能提交', // 提示的内容,
          icon: 'none'
        })
        return
      }
      // 创建商品订单
      this.createOrder()
    },
    // 创建订单
    async createOrder () {
      let goods = this.goodsList.map((item) => {
        return {
          goods_id: item.goods_id,
          goods_number: item.num,
          goods_price: item.goods_price
        }
      })
      let res = await apiCreateOrder({
        orderPrice: this.totalPrice,
        consigneeAddr: this.filterAddress,
        goods
      })
      // 保存订单号
      this.orderNumber = res.order_number
      // 去付款
      this.WeChatPay()
      // 将订单商品从购物车移除
      this.arrangeCarts()
    },
    async WeChatPay () {
      // 获取微信支付需要的信息
      let res = await apiToPay(this.orderNumber)
      wx.requestPayment({
        ...res.pay,
        success: res => {
          wx.showToast({
            title: '支付成功' // 提示的内容
          })
        },
        fail: (res) => {
          console.log(res)
          wx.showToast({
            title: '支付失败' // 提示的内容
          })
        }
      })
    },
    // 移除订单商品在购物车位置
    arrangeCarts () {
      // 如果是从立即购买页面过来的不对本地carts做处理
      if (this.goodsIds) {
        return
      }
      let carts = wx.getStorageSync('carts') || {}
      for (let key in carts) {
        // 如果checked为true则从购物车中移除
        if (carts[key].checked) {
          delete carts[key]
        }
      }
      // 重新保存购物车
      wx.setStorageSync('carts', carts)
    }
  }
}
</script>

<style lang="less">
.address-wrapper {
  background-color: #fff;
}

.address {
  display: flex;
  flex-direction: column;
  padding: 44rpx 30rpx 48rpx 20rpx;
  .receiver {
    display: flex;
    justify-content: space-between;
    margin-bottom: 50rpx;
    position: relative;
    .phone-num {
      margin-right: 40rpx;
    }
    .icon-arrow-right {
      position: absolute;
      top: 8rpx;
      right: 0;
      color: #999;
    }
  }
}

.choose-address {
  display: flex;
  padding: 44rpx 30rpx 48rpx 20rpx;
  justify-content: space-between;
  .icon-arrow-right {
    color: #999;
  }
}

.flower {
  img {
    height: 16rpx;
    width: 100%;
    display: block;
  }
}

.goods-item {
  height: 206rpx;
  background-color: #fff;
  border-top: 1rpx solid #ddd;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  img {
    width: 160rpx;
    height: 160rpx;
    margin-left: 30rpx;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 20rpx 0 18rpx;
    .btm {
      display: flex;
      margin-top: 40rpx;
      justify-content: space-between;
      .price {
        color: #eb4450;
        > span {
          font-size: 24px;
        }
      }
      .goods-num {
        display: flex;
        align-items: center;
        button {
          width: 60rpx;
          height: 50rpx;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4rpx solid #666;
        }
        span {
          margin: 0 30rpx;
        }
      }
    }
  }
}
.goods-list {
  position: absolute;
  bottom: 98rpx;
  top: 243rpx;
  width: 100%;
  overflow: auto;
  padding-bottom: 60rpx;
  background-color: #f4f4f4;
}

.bottom-fixed {
  position: absolute;
  height: 98rpx;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1aad19;
  color: #fff;
  line-height: 98rpx;
  text-align: center;
}
</style>