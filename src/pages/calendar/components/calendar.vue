<template>
  <view class="calendar">
    <view class="header bg-white rd-t-16rpx">
      <view class="h-72rpx flex items-center">
        <view class="flex items-center">
          <view class="before-year w-32rpx h-32rpx" @click="beforeYearFn"></view>
          <view class="before-month w-32rpx h-32rpx ml-16rpx" @click="beforeMonthFn"></view>
        </view>

        <view class="flex-1 center">
          <view class="text-24rpx font-500 text-#222">
            {{ selectDay.year }}年 {{ selectDay.month }}月
          </view>
          <view
            v-if="
              goNow &&
              !(nowDay.year === selectDay.year && nowDay.month === selectDay.month && nowDay.day === selectDay.day)
            "
            class="today w-88rpx h-42rpx ml-40rpx rd-8rpx text-24rpx leading-42rpx text-white text-center"
            @click="switchNowDate"
          >
            今天
          </view>
        </view>

        <view class="flex items-center">
          <view class="after-month w-32rpx h-32rpx mr-16rpx" @click="afterMonthFn"></view>
          <view class="after-year w-32rpx h-32rpx" @click="afterYearFn"></view>
        </view>
      </view>
    </view>

    <view class="bg-#fff8f1 rd-12rpx">
      <!-- 日历头部 -->
      <view class="flex justify-around items-center leading-40rpx pt-16rpx pb-8rpx">
        <view class="w-100rpx text-center text-24rpx text-#555">日</view>
        <view class="w-100rpx text-center text-24rpx text-#555">一</view>
        <view class="w-100rpx text-center text-24rpx text-#555">二</view>
        <view class="w-100rpx text-center text-24rpx text-#555">三</view>
        <view class="w-100rpx text-center text-24rpx text-#555">四</view>
        <view class="w-100rpx text-center text-24rpx text-#555">五</view>
        <view class="w-100rpx text-center text-24rpx text-#555">六</view>
      </view>

      <!-- 日历主体 -->
      <swiper
        class="transition-height duration-300"
        :style="{ height: swiperHeight + 'rpx' }"
        @change="handleSwiperChange"
        :circular="true"
        :current="swiperCurrent"
        :duration="swiperDuration"
      >
        <swiper-item v-for="(list, index) in dateListComp" :key="index" @touchmove.stop>
          <!-- :style="{ height: (list.length / 7) * 82 + 'rpx' }" :data-height="list" -->
          <view
            class="flex justify-around flex-wrap transition-height duration-300 content-start overflow-hidden"
            :style="{ height: swiperHeight - 18 + 'rpx' }"
          >
            <view v-for="(item, tIndex) in list" :key="tIndex" class="flex justify-center w-90rpx relative text-center">
              <view
                class="day-bg center w-64rpx h-64rpx text-24rpx font-500 text-#fa6044 rd-50%"
                :class="[
                  open ? 'mb-24rpx' : 'mb-0',
                  signFnClass(item, selectDay, spotMap),
                  hasNowFnClass(item, nowDay),
                  hasNowMonthFnClass(item, selectDay),
                  hasSelectFnClass(item, calendar, oldCurrent, index),
                  hasDisableFnClass(item, disabledDateList),
                ]"
                @click.stop="selectChange"
                :data-disabled="!!hasDisableFnClass(item, disabledDateList)"
                :data-day="item.day"
                :data-year="item.year"
                :data-month="item.month"
              >
                <!-- {{ !signFnClass(item, selectDay, spotMap) ? item.day : '' }} -->
                {{ dayTextFn(item, index) }}
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <!-- 展开收缩 -->
      <view
        v-if="showShrink"
        @click.stop="openChange"
        class="relative center h-48rpx bg-rgba-255-243-229/52 rd-8rpx text-24rpx font-400 text-#fa6044"
      >
        {{ open ? '收起日历' : '展开日历' }}
        <view class="icon w-24rpx h-24rpx ml-8rpx transition-transform duration-300" :class="open ? 'rotate-180' : 'rotate-0'"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'

defineOptions({
  name: 'Calendar',
})

interface DayItem {
  year: number
  month: number
  day: number
}

interface Props {
  spotMap?: string[]
  defaultTime?: string
  goNow?: boolean
  defaultOpen?: boolean
  showShrink?: boolean
  disabledDate?: (item: DayItem) => boolean
  changeTime?: string
  disabledTips?: string
}

interface Emits {
  (e: 'selectDay', day: DayItem): void
  (e: 'openChange', open: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  spotMap: () => [],
  defaultTime: '',
  goNow: false,
  defaultOpen: false,
  showShrink: true,
  changeTime: '',
})

const emit = defineEmits<Emits>()

const selectDay = ref<DayItem>({} as DayItem)
const nowDay = ref<DayItem>({} as DayItem)
const calendar = ref<DayItem>({} as DayItem)
const open = ref(false)
const swiperCurrent = ref(1)
const oldCurrent = ref(1)
const dateList0 = ref<DayItem[]>([])
const dateList1 = ref<DayItem[]>([])
const dateList2 = ref<DayItem[]>([])
const swiperDuration = ref(500)
const swiperHeight = ref(0)
const backChange = ref(false)
const disabledDateList = ref<Record<string, boolean>>({})

const dateListComp = computed(() => {
  return [dateList0.value, dateList1.value, dateList2.value]
})

watch(
  () => props.defaultOpen,
  (value) => {
    open.value = value
  }
)

watch(
  () => props.changeTime,
  (value) => {
    if (!value) return
    witchDate(new Date(value))
  }
)

onMounted(() => {
  const now = props.defaultTime ? new Date(props.defaultTime) : new Date()
  nowDay.value = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  }
  setMonthFn(now.getFullYear(), now.getMonth() + 1, now.getDate(), true)
  updateList(now, -1, 0)
  updateList(now, 0, 1)
  updateList(now, 1, 2)
  setSwiperHeight(1)
})

const signFnClass = (item: DayItem, selectDay: DayItem, spotMap: string[]) => {
  if (item.month === selectDay.month) {
    let key = 'y' + item.year + 'm' + item.month + 'd' + item.day
    if (spotMap.includes(key)) {
      return 'sign'
    }
  }
  return ''
}

const hasNowFnClass = (item: DayItem, nowDay: DayItem) => {
  return item.year === nowDay.year && item.month === nowDay.month && item.day === nowDay.day ? 'now' : ''
}

const dayTextFn = (item: DayItem, index: number) => {
  let state = false
  let text = ''

  const isSign = !!signFnClass(item, selectDay.value, props.spotMap)
  const isNow = !!hasNowFnClass(item, nowDay.value)
  const isSelect = !!hasSelectFnClass(item, calendar.value, oldCurrent.value, index)

  if (isSign) {
    state = true
    text = ''
  }

  if (isNow) {
    state = true
    text = '今'
  }

  if (isNow && isSelect) {
    state = true
    text = ''
  }

  if (isNow && isSign) {
    state = true
    text = ''
  }

  if (isNow && isSign && isSelect) {
    state = true
    text = '今'
  }

  return state ? text : item.day
}

const hasNowMonthFnClass = (item: DayItem, selectDay: DayItem) => {
  return item.year === selectDay.year && item.month === selectDay.month ? '' : 'other-month'
}

const hasSelectFnClass = (item: DayItem, selectDay: DayItem, oldCurrent: number, listIndex: number) => {
  if (
    item.year === selectDay.year &&
    item.month === selectDay.month &&
    item.day === selectDay.day &&
    oldCurrent === listIndex
  ) {
    return 'select'
  }
  return ''
}

const hasDisableFnClass = (item: DayItem, disabledDateList: Record<string, boolean>) => {
  let key = 'disabled' + item.year + 'M' + item.month + 'D' + item.day
  if (disabledDateList[key]) {
    return 'disabled'
  }
  return ''
}

const handleSwiperChange = (e: any) => {
  if (backChange.value) {
    backChange.value = false
    return
  }

  const rest = 3 - e.detail.current - oldCurrent.value
  const dif = e.detail.current - oldCurrent.value

  if (dif === -2 || (dif > 0 && dif !== 2)) {
    const date = open.value
      ? new Date(selectDay.value.year, selectDay.value.month)
      : new Date(selectDay.value.year, selectDay.value.month - 1, selectDay.value.day + 7)
    setMonthFn(date.getFullYear(), date.getMonth() + 1, open.value ? undefined : date.getDate())

    const result: any = {
      setYear: selectDay.value.year,
      setMonth: open.value ? selectDay.value.month : selectDay.value.month - 1,
      setDay: selectDay.value.day + 7,
      dateIndex: rest,
    }
    open.value && delete result.setDay

    getIndexList(result)
  } else {
    const date = open.value
      ? new Date(selectDay.value.year, selectDay.value.month - 2)
      : new Date(selectDay.value.year, selectDay.value.month - 1, selectDay.value.day - 7)
    setMonthFn(date.getFullYear(), date.getMonth() + 1, open.value ? undefined : date.getDate())

    const result: any = {
      setYear: selectDay.value.year,
      setMonth: open.value ? selectDay.value.month - 2 : selectDay.value.month - 1,
      setDay: open.value ? selectDay.value.day - 7 : undefined,
      dateIndex: rest,
    }
    open.value && delete result.setDay

    getIndexList(result)
  }
  oldCurrent.value = e.detail.current
  setSwiperHeight(e.detail.current)
}

const setSwiperHeight = (index: number) => {
  const listName = `dateList${index}` as 'dateList0' | 'dateList1' | 'dateList2'
  const dateListMap = { dateList0: dateList0.value, dateList1: dateList1.value, dateList2: dateList2.value }

  if (dateListMap[listName].length === 7) {
    swiperHeight.value = 84
  } else {
    swiperHeight.value = (dateListMap[listName].length / 7) * 82 + 18
  }
}

const getIndexList = ({ setYear, setMonth, setDay, dateIndex }: any) => {
  let appointMonth: Date
  if (setDay) appointMonth = new Date(setYear, setMonth, setDay)
  else appointMonth = new Date(setYear, setMonth)

  const dataList = dateInit({
    setYear: appointMonth.getFullYear(),
    setMonth: appointMonth.getMonth() + 1,
    setDay: appointMonth.getDate(),
    hasBack: true,
  })

  const newDisabledDateList: Record<string, boolean> = {}
  if (props.disabledDate) {
    dataList.forEach((item) => {
      const key = `disabled${item.year}M${item.month}D${item.day}`
      if (!disabledDateList.value[key] && props.disabledDate!(item)) {
        newDisabledDateList[key] = true
      }
    })
  }

  const listMap: any = { 0: dateList0, 1: dateList1, 2: dateList2 }
  listMap[dateIndex].value = dataList
  disabledDateList.value = Object.assign(disabledDateList.value, newDisabledDateList)
}

const setMonthFn = (setYear: number, setMonth: number, setDay?: number, isSyncCalendar = false) => {
  selectDay.value = {
    year: setYear,
    month: setMonth,
    day: setDay || Math.min(new Date(setYear, setMonth, 0).getDate(), selectDay.value.day),
  }
  if ((selectDay.value.year !== setYear || selectDay.value.month !== setMonth) && !setDay) {
    open.value = !setDay
  }

  if (isSyncCalendar) {
    calendar.value = selectDay.value
    nextTick(() => {
      triggerEventSelectDay()
    })
  }
}

const openChange = () => {
  emit('openChange', !open.value)
  open.value = !open.value

  const selectDate = new Date(selectDay.value.year, selectDay.value.month - 1, selectDay.value.day)
  switch (oldCurrent.value) {
    case 0:
      updateList(selectDate, -1, 2)
      updateList(selectDate, 0, 0)
      updateList(selectDate, 1, 1)
      break
    case 1:
      updateList(selectDate, -1, 0)
      updateList(selectDate, 0, 1)
      updateList(selectDate, 1, 2)
      break
    case 2:
      updateList(selectDate, -1, 1)
      updateList(selectDate, 0, 2)
      updateList(selectDate, 1, 0)
      break
  }

  setSwiperHeight(oldCurrent.value)
}

const witchDate = (setDate: Date, isSyncCalendar = false) => {
  const selectDate = new Date(selectDay.value.year, selectDay.value.month - 1, selectDay.value.day)
  let dateDiff =
    (selectDate.getFullYear() - setDate.getFullYear()) * 12 + (selectDate.getMonth() - setDate.getMonth())
  let diff = dateDiff === 0 ? 0 : dateDiff > 0 ? -1 : 1
  const diffSum = (x: number) => (3 + (x % 3)) % 3

  switch (oldCurrent.value) {
    case 0:
      updateList(setDate, -1, diffSum(2 + diff))
      updateList(setDate, 0, diffSum(0 + diff))
      updateList(setDate, 1, diffSum(1 + diff))
      break
    case 1:
      updateList(setDate, -1, diffSum(0 + diff))
      updateList(setDate, 0, diffSum(1 + diff))
      updateList(setDate, 1, diffSum(2 + diff))
      break
    case 2:
      updateList(setDate, -1, diffSum(1 + diff))
      updateList(setDate, 0, diffSum(2 + diff))
      updateList(setDate, 1, diffSum(0 + diff))
      break
  }

  swiperCurrent.value = diffSum(oldCurrent.value + diff)
  oldCurrent.value = diffSum(oldCurrent.value + diff)
  backChange.value = dateDiff !== 0

  selectDay.value = {
    year: setDate.getFullYear(),
    month: setDate.getMonth() + 1,
    day: setDate.getDate(),
  }
  if (isSyncCalendar) {
    calendar.value = selectDay.value
  }

  nextTick(() => {
    triggerEventSelectDay()
    setSwiperHeight(oldCurrent.value)
  })
}

const switchNowDate = () => {
  witchDate(new Date(), true)
}

const dateInit = ({
  setYear = selectDay.value.year,
  setMonth = selectDay.value.month,
  setDay = selectDay.value.day,
  hasBack = false,
}: {
  setYear?: number
  setMonth?: number
  setDay?: number
  hasBack?: boolean
} = {}) => {
  let dateList: DayItem[] = []
  let now = new Date(setYear, setMonth - 1)
  let startWeek = now.getDay()
  let dayNum = new Date(setYear, setMonth, 0).getDate()
  let forNum = Math.ceil((startWeek + dayNum) / 7) * 7
  let selectDayVal = setDay || selectDay.value.day
  const isOpen = open.value

  for (let i = 0; i < (isOpen ? forNum : 7); i++) {
    const now2 = new Date(now)
    isOpen
      ? now2.setDate(i - startWeek + 1)
      : now2.setDate(Math.ceil((selectDayVal + (startWeek - 1)) / 7) * 7 - 6 - startWeek + i)

    dateList[i] = {
      day: now2.getDate(),
      month: now2.getMonth() + 1,
      year: now2.getFullYear(),
    }
  }

  if (hasBack) return dateList

  dateList1.value = dateList
  return dateList
}

const selectChange = (e: any) => {
  const { year, month, day, disabled } = e.currentTarget.dataset
  const newSelectDay: DayItem = { year, month, day }

  if (disabled && !!props.disabledTips) {
    uni.showToast({ title: props.disabledTips, icon: 'none' })
  }

  if (open.value && (selectDay.value.year !== year || selectDay.value.month !== month)) {
    if (year * 12 + month > selectDay.value.year * 12 + selectDay.value.month) {
      swiperCurrent.value = oldCurrent.value === 2 ? 0 : oldCurrent.value + 1
    } else {
      swiperCurrent.value = oldCurrent.value === 0 ? 2 : oldCurrent.value - 1
    }
    if (!disabled) {
      selectDay.value.day = day
    }
  } else if (selectDay.value.day !== day && !disabled) {
    selectDay.value = newSelectDay
  }

  if (!disabled) {
    calendar.value = selectDay.value
    triggerEventSelectDay()
  }
}

const triggerEventSelectDay = () => {
  emit('selectDay', selectDay.value)
}

const updateList = (date: Date, offset: number, index: number) => {
  const setDate = open.value
    ? new Date(date.getFullYear(), date.getMonth() + offset * 1)
    : new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset * 7)

  const result: any = {
    setYear: setDate.getFullYear(),
    setMonth: setDate.getMonth(),
    setDay: setDate.getDate(),
    dateIndex: index,
  }
  open.value && delete result.setDay

  getIndexList(result)
}

const beforeYearFn = () => {
  const { year, month, day } = selectDay.value
  witchDate(new Date(year - 1, month - 1, day))
}

const beforeMonthFn = () => {
  nextTick(() => {
    swiperCurrent.value = oldCurrent.value === 0 ? 2 : oldCurrent.value - 1
  })
}

const afterMonthFn = () => {
  nextTick(() => {
    swiperCurrent.value = oldCurrent.value === 2 ? 0 : oldCurrent.value + 1
  })
}

const afterYearFn = () => {
  const { year, month, day } = selectDay.value
  witchDate(new Date(year + 1, month - 1, day))
}
</script>

<style lang="scss" scoped>
// 背景图片样式
.before-year {
  background-image: url('@/static/group-punch/a16.png');
  background-size: 100% auto;

  &:active {
    background-image: url('@/static/group-punch/a12.png');
  }
}

.before-month {
  background-image: url('@/static/group-punch/a17.png');
  background-size: 100% auto;

  &:active {
    background-image: url('@/static/group-punch/a13.png');
  }
}

.after-month {
  background-image: url('@/static/group-punch/a18.png');
  background-size: 100% auto;

  &:active {
    background-image: url('@/static/group-punch/a14.png');
  }
}

.after-year {
  background-image: url('@/static/group-punch/a19.png');
  background-size: 100% auto;

  &:active {
    background-image: url('@/static/group-punch/a15.png');
  }
}

.today {
  background: linear-gradient(169deg, #ff9134 0%, #fa6044 100%);

  &:active {
    background: linear-gradient(169deg, #ff9134 0%, #f1310f 100%);
  }
}

.icon {
  background-image: url('@/static/group-punch/a10.png');
  background-size: 100% auto;
}

// 日历日期背景
.day-bg {
  background-image: url('@/static/group-punch/a24.png');
  background-size: 100% auto;
}

// 标记
.sign {
  background-image: url('@/static/group-punch/a27.png');
  background-size: 100% auto;
}

// 今日日期
.now {
  background-image: url('@/static/group-punch/a28.png');
  background-size: 100% auto;
  color: #fff;
}

// 选中
.select {
  background-image: url('@/static/group-punch/a26.png');
  background-size: 100% auto;
  color: #fff;
}

// 今日日期+选中
.now.select {
  background-image: url('@/static/group-punch/a30.png');
  background-size: 100% auto;
  color: #fff;
}

// 今日日期+标记
.now.sign {
  background-image: url('@/static/group-punch/a29.png');
  background-size: 100% auto;
  color: #fff;
}

// 今日日期+选中+标记
.sign.now.select {
  background-image: url('@/static/group-punch/a26.png');
  background-size: 100% auto;
  color: #fff;
}

// 标记+选中
.sign.select {
  background-image: url('@/static/group-punch/a11.png');
  background-size: 100% auto;
  color: #fff;
}

// 禁止
.disabled {
  opacity: 0.7;
}

// 其他月份
.other-month {
  opacity: 0.7;
}
</style>
