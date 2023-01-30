<template>
  <view class="uni-container">
    <view class="uni-header-logo">
      <image class="uni-header-image" src="/static/avatar.png"></image>
    </view>
    <view class="uni-hello-text">
      <text class="hello-text"> {{ title }} </text>
    </view>

    <view class="uni-home-nav">
      <!-- <view class="uni-home-nav__title">基础组件</view> -->
      <view class="uni-home-nav__group">
        <view v-for="(item, index) in baseListRef" class="uni-home-nav__block" @click="goDetailPage(item.pathName)"
          :key="index">
          {{ item.name }}
          <image class="uni-common-arrow-right" src="https://cos.wshoto.com/marketing-wxapp/group-punch/a18.png" />
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
  },
])

const goDetailPage = (name: string) => {
  console.log(name)

  uni.navigateTo({
    url: `/pages/${name}/index`,
  })
}
</script>

<style scoped lang="scss">
page {
  min-height: 100%;
  height: auto;
}

.uni-container {
  padding: 15px 40rpx;
  background: #fff;

  .uni-header-logo {
    display: flex;
    padding: 15px 15px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10rpx;

    .uni-header-image {
      width: 80px;
      height: 80px;
      border-radius: 10px;
    }
  }

  .uni-hello-text {
    margin-bottom: 20px;

    .hello-text {
      color: #7a7e83;
      font-size: 14px;
      line-height: 20px;
    }
  }

  .uni-home-nav {
    padding-bottom: 100px;
  }

  .uni-home-nav__title {
    margin: 0 0 10px 10px;
    color: rgba(69, 90, 100, 0.6);
    font-size: 14px;
  }

  .uni-home-nav__block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 12px;
    padding: 0 15px;
    color: #323233;
    font-weight: 600;
    font-size: 14px;
    line-height: 40px;
    background: #f7f8fa;
    border-radius: 99px;
    transition: background 0.3s;
  }

  .uni-common-arrow-right {
    width: 20px;
    height: 20px;
  }
}
</style>
