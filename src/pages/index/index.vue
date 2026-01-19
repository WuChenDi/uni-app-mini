<script setup lang="ts">
import { ref } from 'vue';
import Footer from '@/components/footer/index.vue';

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const title = ref('Hello, 业务开发记录一些组件')
const baseListRef = ref([
  {
    pathName: 'calendar',
    name: 'Calendar 日历组件',
  },
  {
    pathName: 'live',
    name: 'Live 自定义推流直播',
  },
]);

const goDetailPage = (name: string) => {
  uni.navigateTo({
    url: `/pages/${name}/index`,
  })
}
</script>

<template>
  <view class="p-[30px_40rpx] bg-white">
    <view class="center flex-col py-15px mt-10rpx">
      <image class="w-80px h-80px rd-10px" src="/static/avatar.jpg" />
    </view>

    <view class="mb-20px">
      <text class="text-[#7a7e83] text-14px lh-20px">
        {{ title }}
      </text>
    </view>

    <view class="pb-100px pb-safe">
      <view class="m-[0_0_10px_10px] text-[rgba(69,90,100,0.6)] text-14px">
        基础组件
      </view>

      <view class="flex flex-col gap-12px">
        <view v-for="(item, index) in baseListRef" :key="index"
          class="flex items-center justify-between px-15px text-[#323233] font-600 text-14px lh-40px bg-[#f7f8fa] rd-99px active:opacity-70 transition-all"
          @click="goDetailPage(item.pathName)">
          <text>{{ item.name }}</text>
          <image class="w-20px h-20px" src="https://cos.wshoto.com/marketing-wxapp/group-punch/a18.png" />
        </view>
      </view>
    </view>
  </view>
  <Footer />
</template>

<style scoped lang="scss">
page {
  min-height: 100%;
  height: auto;
}
</style>
