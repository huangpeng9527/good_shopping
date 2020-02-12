<template>
  <div class="content">
    <div class="title">
      <span class="iconfont icon-shop"></span>
      <span>优购生活馆</span>
    </div>
    <!-- 商品列表 -->
    <ul class="goods-list">
      <li class="goods-item"
          v-for="(item,index) in cartsList"
          :key="index">
        <span class="iconfont"
              :class="item.checked ? 'icon-check' : 'icon-unchecked'"
              @click="item.checked=!item.checked"></span>
        <img :src="item.goods_small_logo"
             alt="">
        <div class="right">
          <p class="line-clamp2 line2">{{item.goods_name}}</p>
          <div class="btm">
            <span class="price">￥<span>{{item.goods_price}}</span>.00</span>
            <div class="goods-num">
              <button :disabled="item.num===1"
                      @click="minus(index)">-</button>
              <span>{{item.num}}</span>
              <button @click="add(index)">+</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="account">
      <div class="select-all">
        <span class="iconfont"
              :class="isAll ? 'icon-check' : 'icon-unchecked'"
              @click="isAll=!isAll"></span>
        <span>全选</span>
      </div>

      <div class="price">
        <p>合计:<span class="num">￥{{settlement.totalPrice}}</span></p>
        <p class="info">包含运费</p>
      </div>
      <div class="account-btn">结算({{settlement.num}})</div>
    </div>
  </div>
</template>

<script>
import { apiGetCartsList } from '../../utils/cartsApi.js'
export default {
  data () {
    return {
      cartsList: [],
      carts: {}
    }
  },
  onShow () {
    this.carts = wx.getStorageSync('carts') || {}
    this.getCartsList()
  },
  methods: {
    async getCartsList () {
      let goodsIds = Object.keys(this.carts).join()
      if (goodsIds) {
        let res = await apiGetCartsList(goodsIds)
        this.cartsList = res.map((item) => {
          item.num = this.carts[item.goods_id].num
          item.checked = this.carts[item.goods_id].checked
          return item
        })
      }
    },
    add (index) {
      let goodsId = this.cartsList[index].goods_id
      this.cartsList[index].num++
      this.carts[goodsId].num++
      wx.setStorageSync('carts', this.carts)
    },
    minus (index) {
      let goodsId = this.cartsList[index].goods_id
      this.cartsList[index].num--
      this.carts[goodsId].num--
      wx.setStorageSync('carts', this.carts)
    }
  },
  computed: {
    // 是否全选
    isAll: {
      get () {
        return this.cartsList.every((item) => {
          return item.checked
        })
      },
      set (newValue) {
        this.cartsList.forEach((item) => {
          item.checked = newValue
        })
      }
    },
    // 结算数量和金额
    settlement () {
      return this.cartsList.reduce((obj, item) => {
        if (item.checked) {
          obj.totalPrice = obj.totalPrice + item.goods_price * item.num
          obj.num = obj.num + item.num
          return obj
        } else {
          return obj
        }
      }, { totalPrice: 0, num: 0 }) // price总金额, num数量
    }
  }
}
</script>

<style lang="less">
.title {
  height: 88rpx;
  display: flex;
  align-items: center;
  .iconfont {
    color: #999;
    margin: 6rpx 12rpx 0 32rpx;
  }
}

.goods-item {
  height: 206rpx;
  background-color: #fff;
  border-top: 1rpx solid #ddd;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  .iconfont {
    color: #eb4450;
    margin: 0 30rpx;
  }
  img {
    width: 160rpx;
    height: 160rpx;
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
  top: 88rpx;
  width: 100%;
  overflow: auto;
  padding-bottom: 60rpx;
  background-color: #f4f4f4;
}
.line2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
  margin-right: 26rpx;
}

.account {
  height: 98rpx;
  border-bottom: 1rpx solid #ddd;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  .iconfont {
    color: #eb4450;
    margin: 0 30rpx;
  }
  .account-btn {
    width: 230rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: #eb4450;
  }
  .select-all {
    flex: 1;
  }
  .price {
    margin-right: 20rpx;
    .num {
      color: #eb4450;
    }
    .info {
      color: #999;
    }
  }
}
</style>