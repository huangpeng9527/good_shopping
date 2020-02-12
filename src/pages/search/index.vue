<template>
  <div class="wrapper">
    <SearchBar @search="toGoodsList"
               :query="query" />
    <div class="history-search"
         v-show="historyList.length">
      <div class="title">
        <span class="title">历史搜索</span>
        <icon type="clear"
              size="18"
              @click="removeHistory">
        </icon>
      </div>
      <ul>
        <li v-for="(item,index) in historyList"
            :key="index"
            @click="toGoodsList(item)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar'
export default {
  data () {
    return {
      historyList: [],
      query: ''
    }
  },
  onShow () {
    this.query = ''
    this.historyList = wx.getStorageSync('historyList') || []
  },
  methods: {
    // 触发搜索方法,跳转到goodsList
    toGoodsList (data) {
      let _historyList = this.historyList
      // 将搜索关键字添加到头部
      _historyList.unshift(data)
      // 数组去重
      this.historyList = [...new Set(_historyList)]
      // 存储到本地
      wx.setStorageSync('historyList', this.historyList)
      // 跳转到商品列表页面
      wx.navigateTo({ url: '/pages/goodsList/main?queryValue=' + data })
    },
    // 清除历史记录
    removeHistory () {
      wx.showModal({
        title: '提示', // 提示的标题,
        content: '您确认要清除历史记录吗', // 提示的内容,
        success: res => {
          if (res.confirm) {
            this.historyList = []
            wx.removeStorageSync('historyList')
          }
        }
      })
    }
  },
  components: {
    SearchBar: SearchBar
  }
}
</script>

<style lang="less">
.search {
  background-color: #eee;
  padding: 30rpx 15rpx;
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  position: relative;
  icon {
    position: absolute;
    top: 50rpx;
    left: 38rpx;
  }
  input {
    height: 60rpx;
    flex: 1;
    background-color: #fff;
    padding-left: 70rpx;
    box-sizing: border-box;
    border-radius: 4rpx;
  }
  button {
    width: 160rpx;
    height: 60rpx;
    line-height: 60rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    border: 1rpx solid #bfbfbf;
    background-color: #eee;
    margin-left: 20rpx;
  }
}

.history-search {
  color: #333;
  font-size: 28rpx;
  padding: 30rpx 30rpx 30rpx 15rpx;
  .title {
    display: flex;
    justify-content: space-between;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30rpx;
    li {
      height: 64rpx;
      line-height: 64rpx;
      padding: 0 26rpx;
      background-color: #ddd;
      margin: 0 30rpx 16rpx 0;
    }
  }
}
</style>