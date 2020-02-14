<template>
  <div>
    <!-- searchLink组件 -->
    <SearchLink />
    <!-- swiper -->
    <swiper class="swiper"
            indicator-dots
            autoplay
            circular
            indicator-color="rgba(255,255,255,.6)"
            indicator-active-color="#fff">
      <block v-for="(item,idx) in swiperList"
             :key="idx">
        <swiper-item>
          <image :src="item.image_src" />
        </swiper-item>
      </block>
    </swiper>
    <!-- 分类category -->
    <div class="category">
      <div class="category-item"
           v-for="(item,idx) in categoryList"
           :key="idx">
        <image :src="item.image_src" />
      </div>
    </div>
    <!-- 楼层floor -->
    <div class="floor"
         v-for="(item,i) in floorList"
         :key="i">
      <!-- 标题图片 -->
      <div class="floor-title">
        <image :src="item.floor_title.image_src" />
      </div>
      <!-- 产品 -->
      <div class="product">
        <div class="product-left">
          <image :src="item.product_list[0].image_src" />
        </div>
        <div class="product-right">
          <block v-for="(ele,index) in item.product_list"
                 :key="index">
            <div v-if="index>0">
              <image :src="ele.image_src" />
            </div>
          </block>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
// 导入api接口
import { apiGetSwiperData, apiGetCatitems, apiGetFloorData } from '../../utils/homeApi'
// 导入searchLink组件
import SearchLink from '../../components/SearchLink'
export default {
  components: {
    SearchLink
  },
  data () {
    return {
      swiperList: [], // 轮播图列表
      categoryList: [], // 分类列表
      floorList: [] // 楼层列表
    }
  },
  created () {
    this.getSwiperData()
    this.getCatitems()
    this.getFloorList()
  },
  methods: {
    // 获取轮播图列表
    getSwiperData () {
      apiGetSwiperData().then((res) => {
        this.swiperList = res
      })
    },
    // 获取分类列表
    getCatitems () {
      apiGetCatitems().then((res) => {
        this.categoryList = res
      })
    },
    // 获取楼层列表
    getFloorList () {
      apiGetFloorData().then((res) => {
        this.floorList = res
      })
    }
  }
}
</script>

<style lang='less'>
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