<template>
  <div>
    <!-- 顶部搜索框 -->
    <SearchBar :query="query"
               @search="search" />
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
                 @scrolltolower="scrollBottom">
      <div class="goods-item"
           v-for="(item,index) in goodsList"
           :key="index"
           @click="toGoodsDetail(item)">
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
// 导入组件
import SearchBar from '@/components/SearchBar'
export default {
  data () {
    return {
      isDesc: true, // 商品价格升序降序排序
      sortData: ['综合', '销量', '价格'], // 商品排序方式
      goodsList: [], // 商品列表
      current: 0, // 刷选排序下标
      query: null, // 搜索框的值
      isLastPage: false, // 是否显示加载提示
      prompt: '加载中...' // 加载提示内容
    }
  },
  onLoad (options) {
    this.isRequest = false // 是否是请求状态重置为false
    this.pagesize = 8 // 设置页容量
    wx.showLoading({
      title: '商品加载中', // 提示的内容,
      mask: true // 显示透明蒙层，防止触摸穿透,
    })
    // wx.navigateTo通过url拼接的参数在onLoad函数中通过options接收
    // 将得到的参数赋值给输入框
    this.query = options.queryValue
    // wx.navigateTo通过eventChannel.emit()方法传递的参数用eventChannel.on(事件名,回调函数(data))接收
    // 在mpvue中是通过this.$mp.page.getOpenerEventChannel().on()接收
    // this.$mp.page.getOpenerEventChannel().on('toQueryValue', (data) => {
    //   // 赋值给value
    //   this.query = data.data
    // })
    this.reLoad()
  },
  onPullDownRefresh () {
    this.reLoad()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      if (this.isRequest || this.isLastPage) {
        return
      }
      // async await可以接收promise对象then方法中返回的数据
      // 一进来表示请求中isRequset为true
      this.isRequest = true
      wx.showNavigationBarLoading()
      let res = await apiGetGoodsList({
        query: this.query,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
      // 获取列表赋值
      this.goodsList = [...this.goodsList, ...res.goods]
      // 请求状态改为false
      this.isRequest = false
      // 数据有了关闭下拉刷新
      wx.stopPullDownRefresh()
      // 关闭导航栏加载动画
      wx.hideNavigationBarLoading()
      // 判断列表是否全部加载完毕
      if (this.goodsList.length === res.total) {
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
      this.getGoodsList()
    },
    // 上拉刷新
    reLoad () {
      this.goodsList = [] // 重置商品列表
      this.pagenum = 1 // 重置页码
      this.isLastPage = false // 重置是否最后一页
      this.prompt = '加载中...' // 重置提示语为加载中
      this.getGoodsList() // 获取商品列表
    },
    // 跳转商品详情页
    toGoodsDetail (item) {
      console.log(item)
      wx.navigateTo({ url: '/pages/goodsDetail/main?goodsId=' + item.goods_id })
    },
    // 获取searchBar组件传过来的query值并触发搜索
    search (data) {
      this.query = data
      this.reLoad()
    }
  },
  components: {
    SearchBar: SearchBar
  }

}
</script>

<style lang='less'>
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