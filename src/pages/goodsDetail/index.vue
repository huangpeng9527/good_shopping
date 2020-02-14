<template>
  <div class="wrapper">
    <swiper class="swiper"
            indicator-dots
            autoplay
            circular
            indicator-color="#ccc"
            indicator-active-color="#fff">
      <block v-for="(item, index) in goodsDetail.pics"
             :key="index">
        <swiper-item @click="preImg(index)">
          <image class="swiper-img"
                 :src="item.pics_big_url"></image>
        </swiper-item>
      </block>
    </swiper>
    <!-- 商品信息 -->
    <div class="goods-info">
      <p class="price">￥{{ goodsDetail.goods_price}}</p>
      <div class="name-favo">
        <p class="name">{{ goodsDetail.goods_name }}</p>
        <div class="favo">
          <span class="iconfont icon-share"></span>
          <span>分享</span>
          <button open-type="share"></button>
        </div>
      </div>
      <p class="express">快递: 免运费</p>
    </div>
    <div class="promote">
      <ul>
        <li>
          <span class="name">促销</span>
          <span class="detail">满300减30元</span>
        </li>
        <li class="brother">
          <span class="name">已选</span>
          <span class="detail gray">黑色/S/1件</span>
        </li>
      </ul>
    </div>
    <!-- 图文介绍 -->
    <div class="goods-detail">
      <div class="tabs">
        <span :class="{active : activeTab}"
              @click="activeTab=true">图文介绍</span>
        <span :class="{active : !activeTab}"
              @click="activeTab=false">规格参数</span>
      </div>
      <div class="main">
        <div v-show="activeTab"
             v-html="goodsDetail.goods_introduce">图文介绍</div>
        <div v-show="!activeTab">商品参数</div>
      </div>
    </div>
    <div class="fixed-bottom">
      <div class="icon-text">
        <span class="iconfont icon-service"></span>
        <span>联系客服</span>
        <button open-type="contact"></button>
      </div>
      <div class="icon-text"
           @click="toCart">
        <span class="iconfont icon-cart"></span>
        <span>购物车</span>
      </div>
      <div class="btn add-cart-btn"
           @click="addToCart">加入购物车</div>
      <div class="btn buy-btn"
           @click="toPay">立即购买</div>
    </div>
  </div>
</template>

<script>
// 导入接口
import { apiGetGoodsDetail } from '../../utils/goodsApi'
export default {
  data () {
    return {
      goodsDetail: {},
      activeTab: true
    }
  },
  onLoad (options) {
    this.getGoodsDetail(options.goodsId)
    console.log(options.goodsId)
  },
  // 自定义转发内容
  onShareAppMessage () {
    return {
      title: this.goodsDetail.goods_name,
      imageUrl: this.goodsDetail.pics[0].pics_big_url
    }
  },
  methods: {
    async getGoodsDetail (goodsId) {
      let res = await apiGetGoodsDetail(goodsId)
      this.goodsDetail = res
    },
    toPay () {
      // 先判断是否登录
      let token = wx.getStorageSync('best_buy_token')
      if (!token) {
        // 跳转到登录页面
        wx.showToast({
          title: '请先登录', // 提示的内容
          icon: 'none' // 图标
        })
        wx.navigateTo({ url: '/pages/login/main' })
        return
      }
      // 如果登录跳转到pay页面
      wx.navigateTo({ url: '/pages/pay/main?goodsId=' + this.goodsDetail.goods_id })
    },
    // 图片预览
    preImg (index) {
      let preImgs = this.goodsDetail.pics.map((item) => { return item.pics_big_url })
      wx.previewImage({
        urls: preImgs, // 需要预览的图片链接列表,
        current: preImgs[index]
      })
    },
    // 加入购物车
    addToCart () {
      // 获取购物车对象
      let carts = wx.getStorageSync('carts') || {}
      // 获取goodsId
      let goodsId = this.goodsDetail.goods_id
      // 将数据存入购物车对象
      // 如果这个对象存在则num(num表示商品数量)的值加1,不存在则为1
      carts[goodsId] = {
        num: carts[goodsId] ? carts[goodsId].num + 1 : 1,
        checked: true
      }
      // 将数据存入本地
      wx.setStorageSync('carts', carts)
      wx.showToast({
        title: '添加成功', // 提示的内容,
        icon: 'success' // 图标,
      })
    },
    // 跳转到购物车界面
    toCart () {
      wx.switchTab({ url: '/pages/cart/main' })
    }
  }

}
</script>
<style lang="less">
.wrapper {
  background-color: #f4f4f4;
  padding-bottom: 98rpx;
}

.swiper {
  height: 720rpx;
}

.swiper-img {
  width: 100%;
  height: 720rpx;
}

.goods-info {
  padding: 40rpx 0 30rpx 20rpx;
  background-color: #fff;

  .price {
    color: #eb4450;
    font-size: 40rpx;
  }

  .name-favo {
    display: flex;
    height: 78rpx;
    margin-top: 14rpx;

    .name {
      color: #333;
      flex: 1;
      font-size: 28rpx;
      padding-right: 78rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; // 控制多行的行数
      -webkit-box-orient: vertical;
    }

    .favo {
      border-left: 1px solid #ddd;
      width: 144rpx;
      color: #999;
      font-size: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }
    button {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .express {
    color: #999;
    font-size: 24rpx;
    margin-top: 20rpx;
  }
}

.promote {
  margin-top: 20rpx;

  li {
    background-color: #fff;
    height: 96rpx;
    line-height: 96rpx;
    font-size: 28rpx;
    margin-top: 20rpx;
    padding-left: 20rpx;

    &.brother {
      margin-top: 0;
    }

    .name {
      color: #404040;
    }

    .detail {
      color: #ff4055;
      margin-left: 40rpx;

      &.gray {
        color: #dfdfdf;
      }
    }
  }
}

.goods-detail {
  margin-top: 20rpx;
  background-color: #fff;

  .tabs {
    display: flex;

    span {
      flex: 1;
      text-align: center;
      color: #404040;
      font-size: 22rpx;
      height: 100rpx;
      line-height: 100rpx;
      box-sizing: border-box;

      &.active {
        color: #ff4055;
        border-bottom: 10rpx solid #ff2644;
      }
    }
  }
}

.fixed-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 98rpx;
  display: flex;
  background-color: #fff;

  .icon-text {
    flex: 2;
    font-size: 20rpx;
    color: #404040;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    button {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }

  .btn {
    flex: 3;
    color: #fff;
    text-align: center;
    line-height: 98rpx;

    &.add-cart-btn {
      background-color: #ffb400;
    }

    &.buy-btn {
      background-color: #ff2d4a;
    }
  }
}
</style>