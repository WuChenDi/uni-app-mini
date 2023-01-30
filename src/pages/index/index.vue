<template>
  <view class="uni-container">
    <view class="uni-header-logo">
      <image class="uni-header-image" src="/static/avatar.png"></image>
    </view>
    <view class="uni-hello-text">
      <text class="hello-text"> {{ title }} </text>
    </view>

    <view class="demo-home-nav">
      <!-- <view class="demo-home-nav__title">基础组件</view> -->
      <view class="demo-home-nav__group">
        <view v-for="(item, index) in baseListRef" class="demo-home-nav__block" @click="goDetailPage(item.pathName)"
          :key="index">
          {{ item.name }}
          <image class="common-arrow-right" src="https://cos.wshoto.com/marketing-wxapp/group-punch/a18.png" />
        </view>
      </view>
    </view>
  </view>
  <Footer />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Footer from '@/components/footer/index.vue'

const title = ref('Hello, 业务开发记录一些组件')

const baseListRef = ref([
  {
    pathName: 'calendar',
    name: 'calendar 日历组件',
  },
  {
    pathName: 'live',
    name: 'live 自定义推流直播',
  }
])

const goDetailPage = (name: string) => {
  console.log(name)

  uni.navigateTo({
    url: `/pages/${name}/index`
  })
}
</script>

<style scoped>
/* #ifndef APP-PLUS-NVUE */
page {
  min-height: 100%;
  height: auto;
}

/* #endif */

/* 解决头条小程序字体图标不显示问题，因为头条运行时自动插入了span标签，且有全局字体 */
/* #ifdef MP-TOUTIAO */
/* text :not(view) {
    font-family: uniicons;
} */
/* #endif */

.uni-icon {
  font-family: uniicons;
  font-weight: normal;
}

.uni-container {
  padding: 15px 40rpx;
  background: #fff;
}

.uni-header-logo {
  display: flex;
  padding: 15px 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
}

.uni-header-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
}

.uni-hello-text {
  margin-bottom: 20px;
}

.hello-text {
  color: #7A7E83;
  font-size: 14px;
  line-height: 20px;
}

.hello-link {
  color: #7A7E83;
  font-size: 14px;
  line-height: 20px;
}

.uni-panel {
  margin-bottom: 12px;
}

.uni-panel-h {
  /* #ifdef H5 */
  display: flex;
  /* #endif */
  background-color: #ffffff;
  flex-direction: row !important;
  /* justify-content: space-between !important; */
  align-items: center !important;
  padding: 12px;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

/*
.uni-panel-h:active {
    background-color: #f8f8f8;
}
 */
.uni-panel-h-on {
  background-color: #f0f0f0;
}

.uni-panel-text {
  flex: 1;
  color: #000000;
  font-size: 14px;
  font-weight: normal;
}

.uni-panel-icon {
  margin-left: 15px;
  color: #999999;
  font-size: 14px;
  font-weight: normal;
  transform: rotate(0deg);
  transition-duration: 0s;
  transition-property: transform;
}

.uni-panel-icon-on {
  transform: rotate(180deg);
}

.uni-navigate-item {
  /* #ifdef H5 */
  display: flex;
  /* #endif */
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-top-style: solid;
  border-top-color: #f0f0f0;
  border-top-width: 1px;
  padding: 12px;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-navigate-item:active {
  background-color: #f8f8f8;
}

.uni-navigate-text {
  flex: 1;
  color: #000000;
  font-size: 14px;
  font-weight: normal;
}

.uni-navigate-icon {
  margin-left: 15px;
  color: #999999;
  font-size: 14px;
  font-weight: normal;
}


.demo-home__title {
  padding: 40px 0 100px 0;
  margin: 0;
}

.demo-home-nav {
  padding-bottom: 100px;
}

.demo-home-nav__title {
  margin: 0 0 10px 10px;
  color: rgba(69, 90, 100, 0.6);
  font-size: 14px;
  /* // .fontsize(14px); */
}

.demo-home-nav__block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 24rpx;
  padding-left: 20rpx;
  color: #323233;
  font-weight: 600;
  font-size: 28rpx;
  /* // .fontsize(14px); */
  line-height: 80rpx;
  background: #f7f8fa;
  border-radius: 99rpx;
  transition: background 0.3s;
}

.common-arrow-right {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
}
</style>
