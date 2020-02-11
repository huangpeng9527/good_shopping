<template>
  <div>
    <!-- searchlink组件 -->
    <SearchLink />
    <div class="container">
      <scroll-view :scroll-y='true'
                   class="category-nav">
        <ul>
          <li v-for="(item,index) in categoryData"
              :key="cat_id"
              class="catenav-item"
              :class="{active:active===index}"
              @click="currentClick(index)">
            <span>{{ item.cat_name }}</span>
          </li>
        </ul>
      </scroll-view>
      <scroll-view :scroll-y='true'
                   class="category-brand">
        <image class="title"
               src="/static/images/titleImage.png" />
        <div v-if="categoryDetail.length > 0">
          <div v-for="(item,i) in categoryDetail"
               :key="i">
            <h2>{{ item.cat_name }}</h2>
            <ul class="brand-list">
              <li v-for="(el,idx) in item.children"
                  :key="idx"
                  @click="toGoodsList(el)">
                <image :src="el.cat_icon"
                       lazy-load="true" />
                <p>{{ el.cat_name }}</p>
              </li>
            </ul>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
// 导入搜索searchLink组件
import SearchLink from '../../components/SearchLink'
// 导入api
import { apiGetCategoryData } from '../../utils/categoryApi'
export default {
  data () {
    return {
      categoryData: [], // 左侧分类总数据
      categoryDetail: [], // 右侧分类数据列表
      active: 0
    }
  },
  onLoad () {
    this.getCategoryData()
  },
  methods: {
    getCategoryData () {
      // 开启loading
      wx.showLoading({
        title: '内容加载中', // 提示的内容,
        mask: true // 显示透明蒙层，防止触摸穿透,
      })
      // 获取数据
      apiGetCategoryData().then(res => {
        // 获取总数据
        this.categoryData = res
        // 获取分类详情数据
        this.categoryDetail = this.categoryData[0].children
        // 隐藏loading
        wx.hideLoading()
      })
    },
    // 分类导航点击事件,当前高亮,渲染右侧列表
    currentClick (index) {
      this.active = index
      this.categoryDetail = this.categoryData[index].children
    },
    // 跳转到搜索列表界面
    toGoodsList (data) {
      console.log(data)
      wx.navigateTo({
        url: `/pages/goodsList/main?queryValue=${data.cat_name}`,
        success (res) {
          // 两种方法传递参数 一种是 url拼接参数
          // 另一种是 success回调函数中通过 res.eventChannel.emit('事件名'.{数据名:数据值}) 来传递
          res.eventChannel.emit('toQueryValue', { data: data.cat_name })
        }
      })
    }
  },
  components: {
    SearchLink: SearchLink
  }
}
</script>

<style lang="less">
.container {
  width: 100%;
  position: fixed;
  top: 100rpx;
  bottom: 0;
  display: flex;
  .category-nav {
    width: 198rpx;
    background-color: #f4f4f4;
    .catenav-item {
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      border-bottom: 1rpx solid #eee;
      span {
        display: inline-block;
        width: 100%;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        color: #333;
      }
    }
    .catenav-item.active {
      background-color: #fff;
      & > span {
        border-left: 8rpx solid #eb4450;
        color: #eb4450;
        font-weight: 700;
      }
    }
  }
  .category-brand {
    flex: 1;
    padding: 16rpx;
    color: #333;
    .title {
      width: 100%;
      height: 180rpx;
    }
    h2 {
      height: 110rpx;
      line-height: 110rpx;
      text-align: center;
      font-weight: 700;
    }
    .brand-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 33.3%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30rpx;
        image {
          width: 120rpx;
          height: 120rpx;
        }
        p {
          margin-top: 20rpx;
          font-size: 12px;
        }
      }
    }
  }
}
</style>