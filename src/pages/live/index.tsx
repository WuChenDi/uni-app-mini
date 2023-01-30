import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LiveIndex',
  setup() {
    const titleRef = ref('live 自定义推流直播123')

    return () => (
      <view class="uni-container">
        {titleRef}
      </view>
    )
  }
})
