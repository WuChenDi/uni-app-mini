<template>
  <view class="footer_container">
    <uni-link :href="urlRef" :text="textRef"></uni-link>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const urlRef = ref('https://github.com/WuChenDi')
const textRef = ref('wudi')
</script>

<style scoped>
.footer_container {
  position: fixed;
  left: 0;
  bottom: 60rpx;
  width: 100%;
  height: 37rpx;
  line-height: 37rpx;
  text-align: center;
  font-size: 26rpx;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(144, 147, 153, 1);
}

.footer_container text {
  padding: 20rpx;
}
</style>
