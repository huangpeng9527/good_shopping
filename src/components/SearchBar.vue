<template>
  <div class="header">
    <div class="search-input">
      <icon type="search"
            size="22"
            @click="search">
      </icon>
      <input type="text"
             v-model.trim="keyword"
             confirm-type="search"
             @confirm="search">
    </div>
  </div>
</template>

<script>
export default {
  props: ['query'],
  data () {
    return {
      keyword: this.query
    }
  },
  methods: {
    //  搜索方法
    search () {
      if (this.keyword.length) {
        this.$emit('search', this.keyword)
      }
    }
  },
  watch: {
    query (newValue) {
      // 当新值变化将新的值传递给父组件
      this.keyword = newValue
    }
  }
}
</script>

<style lang="less">
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
</style>