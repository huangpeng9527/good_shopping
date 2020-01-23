<template>
  <div>
    <!-- header搜索栏目 -->
    <div class="header">
      <div class="search">
        <icon type="search"
              size="18" />
        <span>搜索</span>
      </div>
    </div>
    <!-- swiper -->
    <swiper class="swiper"
            indicator-dots
            autoplay
            circular
            indicator-color="rgba(255,255,255,.6)"
            indicator-active-color="#fff">
      <block v-for="(item,index) in 3"
             :key="index">
        <swiper-item>
          <image src="https://api.zbztb.cn/pyg/banner1.png" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 分类category -->
    <div class="category">
      <div class="category-item"
           v-for="item in 4"
           :key="item">
        <image src="https://api.zbztb.cn/pyg/icon_index_nav_2@2x.png" />

      </div>
    </div>
    <!-- 楼层floor -->
    <div class="floor"
         v-for="(item,idx) in 3"
         :key="idx">
      <!-- 标题图片 -->
      <div class="floor-title">
        <image src="https://api.zbztb.cn/pyg/pic_floor01_title.png" />
      </div>
      <!-- 产品 -->
      <div class="product">
        <div class="product-left">
          <image src="https://api.zbztb.cn/pyg/pic_floor01_1@2x.png" />
        </div>
        <div class="product-right">
          <div v-for="item in 4"
               :key="item">
            <image src="https://api.zbztb.cn/pyg/pic_floor01_5@2x.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang='less'>
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
/* swiper */
.swiper image {
  width: 100%;
  height: 340rpx;
}
/* 分类 */
.category {
  width: 100%;
  height: 194rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .category-item {
    image {
      width: 128rpx;
      height: 140rpx;
    }
  }
}

.floor {
  margin-bottom: 20rpx;
  .floor-title {
    margin-bottom: 20rpx;
    background-color: #f4f4f4;
    height: 88rpx;
    image {
      height: 70rpx;
      margin-top: 18rpx;
    }
  }
  .product {
    width: 100%;
    padding: 0 17rpx;
    display: flex;
    .product-left {
      width: 232rpx;
      height: 374rpx;
    }
    .product-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-content: space-between;
      div {
        width: 232rpx;
        height: 182rpx;
        margin-left: 10rpx;
      }
    }
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>