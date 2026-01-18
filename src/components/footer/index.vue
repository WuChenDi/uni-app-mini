<template>
  <view class="footer_container">
    <uni-link href="https://github.com/WuChenDi" text="wudi"></uni-link>
  </view>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Footer',
})
</script>

<style scoped lang="scss">
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
