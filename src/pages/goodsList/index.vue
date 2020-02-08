<template>
  <div>
    <!-- 顶部搜索框 -->
    <div class="header">
      <div class="search-input">
        <icon type="search"
              size="22"
              @click="search">
        </icon>
        <input type="text"
               v-model="value"
               confirm-type="search"
               @confirm="getGoodsList">
      </div>
    </div>
    <!--导航栏-->
    <ul class="nav">
      <li v-for="(item,index) in sortData"
          :class="{price : item==='价格', active: current===index}"
          :key="index"
          lower-threshold="100">
        {{ item }}
        <div v-if="item==='价格'"
             class="sort">
          <i :class="{ asc: !isDesc }"></i>
          <i class="floor"
             :class="{ desc: isDesc }"></i>
        </div>
      </li>
    </ul>
    <!--  goods-->
    <scroll-view class="goods-list"
                 scroll-y="true"
                 @scrolltolower="scrollBottom"
                 refresher-enabled
                 @refresherpulling="refresh">
      <div class="goods-item"
           v-for="(item,index) in goodsList"
           :key="index">
        <img :src="item.goods_small_logo">
        <div class="goods-description">
          <p>{{ item.goods_name }}</p>
          <div class="price"><i class="icon">￥</i><i class="int">{{ item.goods_price }}</i><i class="float">.00</i></div>
        </div>
      </div>
      <div class="prompt"
           v-show="goodsList.length">{{ prompt }}</div>
    </scroll-view>
  </div>
</template>

<script>
import { apiGetGoodsList } from '../../utils/goodsApi'
export default {
  data () {
    return {
      isDesc: true, // 商品价格升序降序排序
      sortData: ['综合', '销量', '价格'], // 商品排序方式
      goodsList: [], // 商品列表
      current: 0, // 刷选排序下标
      value: null, // 搜索框的值
      pagesize: 8, // 页容量
      pagenum: 1, // 当前页
      isLastPage: false, // 是否显示加载提示
      prompt: '加载中...', // 加载提示内容
      isRequest: false // 是否正在加载中
    }
  },
  onLoad (options) {
    wx.showLoading({
      title: '商品加载中', // 提示的内容,
      mask: true // 显示透明蒙层，防止触摸穿透,
    })
    // wx.navigateTo通过url拼接的参数在onLoad函数中通过options接收
    // 将得到的参数赋值给输入框
    this.value = options.value
    // wx.navigateTo通过eventChannel.emit()方法传递的参数用eventChannel.on(事件名,回调函数(data))接收
    // 在mpvue中是通过this.$mp.page.getOpenerEventChannel().on()接收
    // this.$mp.page.getOpenerEventChannel().on('toQueryValue', (data) => {
    //   // 赋值给value
    //   this.value = data.data
    // })
    this.getGoodsList()
  },
  onPullDownRefresh () {
    this.goodsList = []
    this.pagenum = 1
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      if (this.isRequest || this.isLastPage) {
        return
      }
      // async await可以接收promise对象then方法中返回的数据
      // 一进来表示请求中isRequset为true
      this.isRequest = true
      let res = await apiGetGoodsList({
        query: this.value,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      // 获取列表赋值
      this.goodsList = [...this.goodsList, ...res.data.message.goods]
      // 请求状态改为false
      this.isRequest = false
      // 数据有了关闭下拉刷新
      wx.stopPullDownRefresh()
      // 关闭导航栏加载动画
      wx.hideNavigationBarLoading()
      // 判断列表是否全部加载完毕
      if (this.goodsList.length === res.data.message.total) {
        this.isLastPage = true
        this.prompt = '没有更多了'
      }
      wx.hideLoading()
    },
    // 滚动到底部上拉刷新
    scrollBottom () {
      // 当前页+1
      this.pagenum++
      // 渲染列表
      wx.showNavigationBarLoading()
      this.getGoodsList()
    },
    refresh () {
      console.log('refresh')
    }
  }

}
</script>

<style lang='less'>
/* 顶部栏 */
.header {
  background-color: #eee;
  padding: 30rpx 16rpx;
  .search-input {
    height: 60rpx;
    background-color: #fff;
    display: flex;
    display: flex;
    align-items: center;
    border-radius: 8rpx;
    icon {
      margin: 0 30rpx;
    }
  }
}
/* 导航栏 */
.nav {
  height: 100rpx;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  .active {
    color: #eb4450;
  }
  .price {
    display: flex;
    align-items: center;
    .sort {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 70rpx;
      margin-left: 16rpx;
    }
    i {
      display: inline-block;
      width: 0;
      height: 0;
      border: 10rpx solid;
      border-color: transparent transparent #cfcfcf;
    }
    i.asc {
      border-color: transparent transparent #666;
    }
    i.floor {
      border-color: #cfcfcf transparent transparent;
    }
    i.desc {
      border-color: #666 transparent transparent;
    }
  }
}
.goods-list {
  padding-left: 20rpx;
  height: 980rpx;
  .goods-item {
    padding: 30rpx 0;
    display: flex;
    border-bottom: 1px solid #ddd;
    img {
      width: 200rpx;
      height: 200rpx;
    }
    .goods-description {
      flex: 1;
      margin: 0 26rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .price {
        display: flex;
        color: #eb4450;
        align-items: flex-end;
        vertical-align: text-bottom;
        .icon {
          font-size: 28rpx;
        }
        .int {
          font-size: 40rpx;
          vertical-align: bottom;
        }
        .float {
          font-size: 28rpx;
        }
      }
      p {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
        margin-right: 26rpx;
      }
    }
  }
  .prompt {
    height: 80rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 24rpx;
  }
}
</style>