<template>
  <view class="page-bg min-h-100vh relative">
    <view class="group-details">
      <view class="calendar-box relative w-702rpx mx-auto pt-126rpx pb-38rpx">
        <view class="title absolute top-30rpx left-50% -translate-x-1/2 h-80rpx leading-80rpx text-28rpx font-500 text-#fa6044">
          我的打卡记录
        </view>
        <view class="calendar-content px-24rpx bg-repeat-y">
          <Calendar
            :goNow="true"
            disabledTips="不在活动日期范围内"
            :defaultTime="defaultTime"
            :spotMap="spotMap"
            :disabledDate="disabledDateFn"
            :changeTime="changeTime"
            @getDateList="getDateList"
            @selectDay="selectDayFn"
            @openChange="openChange"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Calendar from './components/calendar.vue'

defineOptions({
  name: 'GroupDetails',
})

interface DateDetail {
  day: number
  month: number
  year: number
}

interface GetDateListDetail {
  setYear: number
  setMonth: number
}

const defaultTime = ref('')
const spotMap = ref(['y2026m1d17', 'y2026m1d10'])
const changeTime = ref('')
const dateListMap = ref<string[]>([])

const disabledDateFn = ({ day, month, year }: DateDetail) => {
  // 例子，今天之后的日期不能被选中
  const now = new Date()
  const date = new Date(year, month - 1, day)
  return date > now
}

// 获取日期数据，通常用来请求后台接口获取数据
const getDateList = (detail: GetDateListDetail) => {
  // 检查是否已经获取过该月的数据
  if (filterGetList(detail)) {
    // 获取数据
    console.log(detail, '获取数据')
  }
}

// 过滤重复月份请求的方法
const filterGetList = ({ setYear, setMonth }: GetDateListDetail) => {
  const dateListSet = new Set(dateListMap.value)
  const key = `y${setYear}m${setMonth}`
  if (dateListSet.has(key)) return false

  dateListSet.add(key)
  dateListMap.value = [...dateListSet]
  return true
}

// 日期改变的回调
const selectDayFn = (detail: DateDetail) => {
  console.log(detail, 'selectDay detail')
}

// 展开收起时的回调
const openChange = (open: boolean) => {
  console.log(open, 'openChange detail')
}
</script>

<style lang="scss" scoped>
.page-bg {
  background: url('@/static/group-punch/a3.png'), linear-gradient(180deg, #ffbd79 77%, #ffbd79 100%);
  background-size: 100%;
  background-repeat: no-repeat;
}

.calendar-box {
  height: auto;
  margin-top: 0;
  background-image: url('@/static/group-punch/a6.png'), url('@/static/group-punch/a7.png');
  background-size: 100% 80px, 100% 40rpx;
  background-position: left top, left bottom;
  background-repeat: no-repeat, no-repeat;
}

.calendar-content {
  background: url('@/static/group-punch/a8.png') repeat-y;
  background-size: 100% 24rpx;
}
</style>
