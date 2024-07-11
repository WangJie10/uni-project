<template>
  <view>
    <view class="search_input">

    </view>
    <view class="swiper_box">
      <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
        <swiper-item v-for="(item,i) in swiperList" :key="i">
          <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
            <image :src="item.image_src"></image>
          </navigator>
        </swiper-item>
      </swiper>
    </view>
    <view class="nav_box">
      <view class="nav_item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" mode=""></image>
      </view>
    </view>
    <!-- 楼层内容 -->
    <view class="floor_box" v-for="(item,index) in floorList" :key="index">
      <!-- 楼层标题 -->
      <image :src="item.floor_title.image_src" class="floor_title"></image>
      <view class="floor_img_box">
        <navigator class="floor_left" :url="item.product_list[0].url">
          <image 
          :src="item.product_list[0].image_src" 
          mode="widthFix" 
          :style="{width:item.product_list[0].image_width + 'rpx'}"
          >
          </image>
        </navigator>
        <view class="floor_right">
          <navigator 
          class="right_top" 
          v-for="(item2, i2) in item.product_list" 
          :key="i2" 
          v-if="i2 !== 0"
          :url="item2.url"
          >
            <image 
            :src="item2.image_src" 
            mode="widthFix" 
            :style="{width: item2.image_width + 'rpx'}"
            ></image>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [],
        navList: [],
        floorList: []
      };
    },
    onLoad() {
      // 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 轮播图
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.swiperList = res.message
      },
      // 导航
      async getNavList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 导航跳转
      navClickHandler(item) {
        if (item.name == "分类") {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 楼层列表数据
      async getFloorList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()
        // 处理跳转链接
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
    }
  }
</script>

<style lang="scss">
  .swiper {
    height: 330rpx;
  }

  .swiper-item {
    width: 100%;
    height: 100%;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav_box {
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
  }

  .nav_item image {
    width: 128rpx;
    height: 140rpx;
  }

  .floor_title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }
  .floor_img_box{
    display: flex;
    padding-left: 10rpx;
    // flex-wrap: wrap;
    // justify-content: space-around;
  }
  .floor_right{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>