<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <!-- <view class="left-scroll-view-item active">xxx</view> -->
        <block v-for="(item,index) in cateList" :key="index">
          <view class="left-scroll-view-item" :class="index == activeIndex? 'active' :''"
            @click="handleCateIndex(index)">
            <!-- :class="['left-scroll-view-item', i === active ? 'active' : '']" -->
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view class="cate_lv2" v-for="(item,index) in cateLevel2" :key="index">
          <view class="cate_lv2_title">/ {{item.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item.children" :key="i3" @click="getGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
          <!-- <view class="cate_lv2_item" v-for="(item2,i) in item.children" :key="i">
            <image :src="item2.cat_icon" mode=""></image>
            <text class="item_title">{{item2.cat_name}}</text>
          </view> -->
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        cateList: [],
        activeIndex: 0,
        cateLevel2: [],
        scrollTop: 0, //切换一级分类后重置滚动条 
      };
    },
    onLoad() {
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight

      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        console.log(this.cateList, ">>>>>>>>>")
        this.cateLevel2 = res.message[0].children
        console.log(this.cateLevel2)
      },
      // 高亮active
      handleCateIndex(index) {
        this.activeIndex = index
        this.cateLevel2 = this.cateList[index].children
        this.scrollTop = this.scrollTop ? 0 : 1
        console.log(this.cateLevel2)
      },
      getGoodsList(item3){
        uni.navigateTo({
          url: "/subpkg/goods_list/goods_list?cid=" + item3.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;

        // 激活项的样式
        &.active {
          background-color: #ffffff;
          position: relative;

          // 渲染激活项左侧的红色指示边线
          &::before {
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
    }
  }

  .cate_lv2_title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      display: flex;
      width: 33.33%;
      flex-direction: column;
      margin-bottom: 10px;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>