<template>
  <!-- header搜索栏目 -->
  <div class="header">
    <div class="search"
         @click="toPage">
      <icon type="search"
            size="18" />
      <span>搜索</span>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toPage () {
      console.log('--')
      wx.navigateTo({ url: '/pages/search/main' })
    }
  }

}
</script>

<style lang="less" scoped>
/* header */
.header {
  height: 100rpx;
  background-color: #eb4450;
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  .search {
    width: 100%;
    height: 60rpx;
    background-color: #fff;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #bbb;
    font-size: 14px;
    span {
      margin-left: 16rpx;
    }
  }
}
</style>