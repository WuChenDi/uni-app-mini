<script setup lang="ts">
import { ref } from 'vue'
definePage({
  style: {
    navigationBarTitleText: 'Live',
  },
})

const title = ref('live 自定义推流直播')
</script>

<template>
  <view class="uni-container">
    {{ title }}
  </view>
</template>

<style scoped></style>
