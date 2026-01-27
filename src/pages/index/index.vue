<script setup lang="ts">
import { ref } from 'vue';
import Footer from '@/components/footer/index.vue';

defineOptions({
  name: 'Home',
})
definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const featureSections = ref([
  {
    title: '基础组件',
    items: [
      {
        pathName: 'calendar',
        name: 'Calendar 日历组件',
      },
      {
        pathName: 'live',
        name: 'Live 自定义推流直播',
      },
    ]
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
      <text class="text-[#7a7e83] text-14px">
        Hello, 业务开发记录一些组件
      </text>
    </view>

    <view class="pb-safe">
      <view v-for="(section, sectionIndex) in featureSections" :key="sectionIndex" class="mb-20px">
        <view class="m-[0_0_10px_10px] text-[rgba(69,90,100,0.6)] text-14px">
          {{ section.title }}
        </view>

        <view class="flex flex-col gap-12px">
          <view v-for="(item, index) in section.items" :key="index"
            class="flex items-center justify-between px-15px text-[#323233] font-600 text-14px lh-40px bg-[#f7f8fa] rd-99px active:opacity-70 transition-all"
            @click="goDetailPage(item.pathName)">
            <text>{{ item.name }}</text>
            <image class="w-20px h-20px" src="https://cos.wshoto.com/marketing-wxapp/group-punch/a18.png" />
          </view>
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
