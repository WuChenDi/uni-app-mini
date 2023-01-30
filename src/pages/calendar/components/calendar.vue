<template>
  <view class="calendar">
    <view class="header">
      <view class="title-new">
        <view class="before">
          <view class="before-year" @click="beforeYearFn"></view>
          <view class="before-month" @click="beforeMonthFn"></view>
        </view>
        <view class="month-text">
          <view class="month"> {{ selectDay.year }}年 {{ selectDay.month }}月 </view>
          <view
            v-if="
              goNow &&
              !(nowDay.year === selectDay.year && nowDay.month === selectDay.month && nowDay.day === selectDay.day)
            "
            class="today"
            @click="switchNowDate"
          >
            今日
          </view>
        </view>
        <view class="after">
          <view class="after-month" @click="afterMonthFn"></view>
          <view class="after-year" @click="afterYearFn"></view>
        </view>
      </view>
    </view>
    <view class="calendar-con">
      <!-- 日历头部 -->
      <view class="flex-around calendar-week">
        <view class="view">日</view>
        <view class="view">一</view>
        <view class="view">二</view>
        <view class="view">三</view>
        <view class="view">四</view>
        <view class="view">五</view>
        <view class="view">六</view>
      </view>
      <!-- 日历主体 -->
      <swiper
        class="swiper"
        :style="{ height: swiperHeight + 'rpx' }"
        @change="handleSwiperChange"
        :circular="true"
        :current="swiperCurrent"
        :duration="swiperDuration"
      >
        <swiper-item v-for="(list, index) in dateListComp" :key="index">
          <!-- :style="{ height: (list.length / 7) * 82 + 'rpx' }" :data-height="list" -->
          <view class="flex-around flex-wrap calendar-main" :style="{ height: swiperHeight - 18 + 'rpx' }">
            <view v-for="(item, tIndex) in list" :key="tIndex" class="day" :class="open ? 'fold-day' : 'unfold-day'">
              <view
                class="bg1"
                :class="[
                  signFnClass(item, selectDay, spotMap),
                  hasNowFnClass(item, nowDay),
                  hasNowMonthFnClass(item, selectDay),
                  hasSelectFnClass(item, calendar, oldCurrent, index),
                  hasDisableFnClass(item, disabledDateList)
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
      <view v-if="showShrink" @click.stop="openChange" class="flex list-open">
        {{ open ? '收起日历' : '展开日历' }}
        <view class="icon" :class="open ? 'fold' : 'unfold'"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'calendar',
  props: {
    // 标点的日期
    spotMap: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 选中时间（不传默认为今日）
     *
     * 标记的日期，默认为今日 注意：传入格式推荐为'2022/1/2'或'2022/01/02', 其他格式在ios系统上可能出现问题
     */
    defaultTime: {
      type: String,
      default: ''
    },
    // 是否有快速回到今天的功能
    goNow: {
      type: Boolean,
      default: false
    },
    // 是否是打开状态
    defaultOpen: {
      type: Boolean,
      default: false
    },
    // 是否显示收缩展开功能
    showShrink: {
      type: Boolean,
      default: true
    },
    // 指定不可用日期
    disabledDate: Function,
    // 要改变的日期
    changeTime: {
      type: String,
      default: ''
    },
    // 点击禁止提示文案
    disabledTips: String
  },
  data() {
    return {
      selectDay: {}, // 选中的日期
      nowDay: {}, // 现在的日期
      calendar: {},
      disabledDate1: {}, // 禁用的日期
      open: false,
      swiperCurrent: 1, // 选中的日期
      oldCurrent: 1, // 之前选中的日期
      dateList0: [], // 0位置的日历数组
      dateList1: [], // 1位置的日历数组
      dateList2: [], // 2位置的日历数组
      swiperDuration: 500,
      swiperHeight: 0,
      backChange: false, // 跳过change切换
      disabledDateList: {} // 禁用的日期集合
    }
  },
  computed: {
    dateListComp() {
      const { dateList0, dateList1, dateList2 } = this
      return [dateList0, dateList1, dateList2]

      // return Object.assign({}, dateList0, dateList1, dateList2)
    }
  },
  watch: {
    // 重新设置打开状态
    defaultOpen(value) {
      this.open = value
    },
    // 切换日期
    changeTime(value) {
      // 检测切换日期
      if (!value) return

      this.witchDate(new Date(value))
    }
  },
  created() {
    const now = this.defaultTime ? new Date(this.defaultTime) : new Date()
    this.nowDay = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    }
    this.setMonthFn(now.getFullYear(), now.getMonth() + 1, now.getDate(), true)
    this.updateList(now, -1, 0)
    this.updateList(now, 0, 1)
    this.updateList(now, 1, 2)
    this.setSwiperHeight(1)
  },
  methods: {
    /**
     * 标点的逻辑计算
     * @param item
     * @param selectDay
     * @param spotMap
     * @returns {string}
     */
    signFnClass(item, selectDay, spotMap) {
      // 只有当前月才显示标点
      if (item.month === selectDay.month) {
        // 通过年月日拼接的key来判断是否有标点
        let key = 'y' + item.year + 'm' + item.month + 'd' + item.day
        if (spotMap[key]) {
          return 'sign'
          // return spotMap[key]
        }
      }
      return ''
    },
    /**
     * 今日日期逻辑计算(显示今天的日期)
     * @param item
     * @param nowDay
     * @returns {string}
     */
    hasNowFnClass(item, nowDay) {
      return item.year === nowDay.year && item.month === nowDay.month && item.day === nowDay.day ? 'now' : ''
    },
    /**
     * 日期渲染字段，单前只有日期跟今天，作为扩展方法
     *
     * 例如： 16 或 今
     * @param item
     * @returns {any}
     */
    dayTextFn(item, index) {
      const { selectDay, spotMap, nowDay, calendar, oldCurrent } = this

      let state = false
      let text = ''

      // 标记（已打卡）
      if (!!this.signFnClass(item, selectDay, spotMap)) {
        state = true
        text = ''
      }

      // 今天
      if (!!this.hasNowFnClass(item, nowDay)) {
        state = true
        text = '今'
      }

      // 今天+选中
      if (!!this.hasNowFnClass(item, nowDay) && !!this.hasSelectFnClass(item, calendar, oldCurrent, index)) {
        state = true
        text = ''
      }

      // 今天+标记（已打卡）
      if (!!this.hasNowFnClass(item, nowDay) && !!this.signFnClass(item, selectDay, spotMap)) {
        state = true
        text = ''
      }

      // 今天+标记（已打卡）+选中
      if (
        !!this.hasNowFnClass(item, nowDay) &&
        !!this.signFnClass(item, selectDay, spotMap) &&
        !!this.hasSelectFnClass(item, calendar, oldCurrent, index)
      ) {
        state = true
        text = '今'
      }

      return state ? text : item.day
    },
    /**
     * 当前月的逻辑计算(其他月的日期变灰)
     * @param item
     * @param selectDay
     * @returns {string}
     */
    hasNowMonthFnClass(item, selectDay) {
      return item.year === selectDay.year && item.month === selectDay.month ? '' : 'other-month'
    },
    /**
     * 选中日期的逻辑计算(选中的日期变色)
     * @param item
     * @param selectDay
     * @param oldCurrent
     * @param listIndex
     * @returns {string}
     */
    hasSelectFnClass(item, selectDay, oldCurrent, listIndex) {
      if (
        item.year === selectDay.year &&
        item.month === selectDay.month &&
        item.day === selectDay.day &&
        oldCurrent === listIndex
      ) {
        return 'select'
      }
      return ''
    },
    /**
     * 禁用日期的逻辑计算(禁用的日期变灰)
     * @param item
     * @param disabledDateList
     * @returns {string}
     */
    hasDisableFnClass(item, disabledDateList) {
      let key = 'disabled' + item.year + 'M' + item.month + 'D' + item.day
      if (disabledDateList[key]) {
        return 'disabled'
      }
      return ''
    },

    /**
     * 日历滑动时触发的方法
     * @param e
     */
    handleSwiperChange(e) {
      if (this.backChange) {
        this.backChange = false
        return
      }
      // 计算第三个索引
      const rest = 3 - e.detail.current - this.oldCurrent
      const dif = e.detail.current - this.oldCurrent

      if (dif === -2 || (dif > 0 && dif !== 2)) {
        // 向右划的情况，日期增加
        const date = this.open
          ? new Date(this.selectDay.year, this.selectDay.month)
          : new Date(this.selectDay.year, this.selectDay.month - 1, this.selectDay.day + 7)
        this.setMonthFn(date.getFullYear(), date.getMonth() + 1, this.open ? undefined : date.getDate())

        const result = {
          setYear: this.selectDay.year,
          setMonth: this.open ? this.selectDay.month : this.selectDay.month - 1,
          setDay: this.selectDay.day + 7,
          dateIndex: rest
        }
        this.open && delete result.setDay

        this.getIndexList(result)
      } else {
        // 向左划的情况，日期减少
        const date = this.open
          ? new Date(this.selectDay.year, this.selectDay.month - 2)
          : new Date(this.selectDay.year, this.selectDay.month - 1, this.selectDay.day - 7)
        this.setMonthFn(date.getFullYear(), date.getMonth() + 1, this.open ? undefined : date.getDate())

        const result = {
          setYear: this.selectDay.year,
          setMonth: this.open ? this.selectDay.month - 2 : this.selectDay.month - 1,
          setDay: this.open ? this.selectDay.day - 7 : undefined,
          dateIndex: rest
        }
        this.open && delete result.setDay

        this.getIndexList(result)
      }
      this.oldCurrent = e.detail.current
      this.setSwiperHeight(e.detail.current)
    },
    /**
     * 根据指定位置数组的大小计算日历的高度
     * @param index
     */
    setSwiperHeight(index) {
      if (this[`dateList${index}`].length === 7) {
        this.swiperHeight = 84
      } else {
        this.swiperHeight = (this[`dateList${index}`].length / 7) * 82 + 18
      }
    },
    /**
     * 更新指定的索引和月份的列表
     * @param setYear
     * @param setMonth
     * @param setDay
     * @param dateIndex
     */
    getIndexList({ setYear, setMonth, setDay = void 0, dateIndex }) {
      let appointMonth
      if (setDay) appointMonth = new Date(setYear, setMonth, setDay)
      else appointMonth = new Date(setYear, setMonth)
      const listName = `dateList${dateIndex}`
      const dataList = this.dateInit({
        setYear: appointMonth.getFullYear(),
        setMonth: appointMonth.getMonth() + 1,
        setDay: appointMonth.getDate(),
        hasBack: true
      })
      const disabledDateList = {}
      if (this.disabledDate) {
        dataList.forEach((item) => {
          if (!this.disabledDateList[`disabled${item.year}M${item.month}D${item.day}`] && this.disabledDate(item)) {
            disabledDateList[`disabled${item.year}M${item.month}D${item.day}`] = true
          }
        })
      }

      this[listName] = dataList
      this.disabledDateList = Object.assign(this.disabledDateList, disabledDateList)
    },
    // 根据data更新禁用日期对象
    // setDisabledDateList(data) {
    //   const disabledDateList = {}
    //   data.forEach((item) => {
    //     if (this.disabledDate(item)) {
    //       disabledDateList[`disabled${item.year}M${item.month}D${item.day}`] = true
    //     }
    //   })
    //   this.disabledDateList = disabledDateList
    // },

    /**
     * 设置月份
     * @param setYear
     * @param setMonth
     * @param setDay
     * @param isSyncCalendar 同步设置 calendar
     */
    setMonthFn(setYear, setMonth, setDay, isSyncCalendar = false) {
      this.selectDay = {
        year: setYear,
        month: setMonth,
        day: setDay || Math.min(new Date(setYear, setMonth, 0).getDate(), this.selectDay.day)
      }
      if ((this.selectDay.year !== setYear || this.selectDay.month !== setMonth) && !setDay) {
        this.open = !setDay
      }

      if (isSyncCalendar) {
        this.calendar = this.selectDay
      }
      this.$nextTick(() => {
        this.triggerEventSelectDay()
      })
    },
    /**
     * 展开收起
     */
    openChange() {
      // 展开收起事件
      this.$emit('openChange', !this.open)
      this.open = !this.open
      // 更新数据
      const selectDate = new Date(this.selectDay.year, this.selectDay.month - 1, this.selectDay.day)
      switch (this.oldCurrent) {
        case 0:
          this.updateList(selectDate, -1, 2)
          this.updateList(selectDate, 0, 0)
          this.updateList(selectDate, 1, 1)
          break
        case 1:
          this.updateList(selectDate, -1, 0)
          this.updateList(selectDate, 0, 1)
          this.updateList(selectDate, 1, 2)
          break
        case 2:
          this.updateList(selectDate, -1, 1)
          this.updateList(selectDate, 0, 2)
          this.updateList(selectDate, 1, 0)
          break
        default:
          break
      }

      this.setSwiperHeight(this.oldCurrent)
    },

    /**
     * 选中并切换今日日期
     * @param setDate
     * @param isSyncCalendar 同步设置 calendar
     */
    witchDate(setDate, isSyncCalendar = false) {
      const selectDate = new Date(this.selectDay.year, this.selectDay.month - 1, this.selectDay.day)
      let dateDiff =
        (selectDate.getFullYear() - setDate.getFullYear()) * 12 + (selectDate.getMonth() - setDate.getMonth())
      let diff = dateDiff === 0 ? 0 : dateDiff > 0 ? -1 : 1
      const diffSum = (x) => (3 + (x % 3)) % 3

      switch (this.oldCurrent) {
        case 0:
          this.updateList(setDate, -1, diffSum(2 + diff))
          this.updateList(setDate, 0, diffSum(0 + diff))
          this.updateList(setDate, 1, diffSum(1 + diff))
          break
        case 1:
          this.updateList(setDate, -1, diffSum(0 + diff))
          this.updateList(setDate, 0, diffSum(1 + diff))
          this.updateList(setDate, 1, diffSum(2 + diff))
          break
        case 2:
          this.updateList(setDate, -1, diffSum(1 + diff))
          this.updateList(setDate, 0, diffSum(2 + diff))
          this.updateList(setDate, 1, diffSum(0 + diff))
          break
        default:
          break
      }
      this.swiperCurrent = diffSum(this.oldCurrent + diff)
      this.oldCurrent = diffSum(this.oldCurrent + diff)
      this.backChange = dateDiff !== 0

      this.selectDay = {
        year: setDate.getFullYear(),
        month: setDate.getMonth() + 1,
        day: setDate.getDate()
      }
      if (isSyncCalendar) {
        this.calendar = this.selectDay
      }

      this.$nextTick(() => {
        this.triggerEventSelectDay()
        this.setSwiperHeight(this.oldCurrent)
      })
    },
    // 切换到今天
    switchNowDate() {
      this.witchDate(new Date(), true)
    },

    /**
     * 日历主体的渲染方法
     * @param setYear
     * @param setMonth
     * @param setDay
     * @param hasBack
     * @returns {*[]}
     */
    dateInit(
      { setYear, setMonth, setDay = this.selectDay.day, hasBack = false } = {
        setYear: this.selectDay.year,
        setMonth: this.selectDay.month,
        setDay: this.selectDay.day,
        asBack: false
      }
    ) {
      // console.log('日历主体的渲染方法')
      // 需要遍历的日历数组数据
      let dateList = []
      // 当前月份的1号
      let now = new Date(setYear, setMonth - 1)
      // 目标月1号对应的星期
      let startWeek = now.getDay()
      // 当前月有多少天
      let dayNum = new Date(setYear, setMonth, 0).getDate()
      // 当前月跨越的周数
      let forNum = Math.ceil((startWeek + dayNum) / 7) * 7
      let selectDay = setDay || this.selectDay.day
      const isOpen = this.open
      /**
       * 展开状态，需要渲染完整的月份
       *
       * 非展开状态，只需要渲染当前周
       */
      for (let i = 0; i < (isOpen ? forNum : 7); i++) {
        const now2 = new Date(now)
        isOpen
          ? now2.setDate(i - startWeek + 1)
          : now2.setDate(Math.ceil((selectDay + (startWeek - 1)) / 7) * 7 - 6 - startWeek + i) // 当前周的7天
        let obj = {}
        obj = {
          day: now2.getDate(),
          month: now2.getMonth() + 1,
          year: now2.getFullYear()
        }
        dateList[i] = obj
      }

      if (hasBack) return dateList

      this.dateList1 = dateList
    },
    /**
     * 一天被点击时
     * @param e
     */
    selectChange(e) {
      const { disabledTips } = this
      const { year, month, day, disabled } = e.currentTarget.dataset
      const selectDay = { year, month, day }

      if (disabled && !!disabledTips) {
        uni.showToast({ title: disabledTips, icon: 'none' })
      }

      if (this.open && (this.selectDay.year !== year || this.selectDay.month !== month)) {
        if (year * 12 + month > this.selectDay.year * 12 + this.selectDay.month) {
          // 下个月
          this.swiperCurrent = this.oldCurrent === 2 ? 0 : this.oldCurrent + 1
        } else {
          // 点击上个月
          this.swiperCurrent = this.oldCurrent === 0 ? 2 : this.oldCurrent - 1
        }
        if (!disabled) {
          this.selectDay.day = day
          this.triggerEventSelectDay()
        }
      } else if (this.selectDay.day !== day && !disabled) {
        this.selectDay = selectDay
        this.triggerEventSelectDay()
      }
      if (!disabled) {
        // 只有点击的时候才更新数据 calendar
        this.calendar = this.selectDay
      }
    },
    // 选择某天时触发的事件
    triggerEventSelectDay() {
      if (
        !this.disabledDateList['disabled' + this.selectDay.year + 'M' + this.selectDay.month + 'D' + this.selectDay.day]
      ) {
        this.$emit('selectDay', this.selectDay)
      }
    },
    /**
     * 更新日历列表
     * @param date
     * @param offset
     * @param index
     */
    updateList(date, offset, index) {
      const setDate = this.open
        ? new Date(date.getFullYear(), date.getMonth() + offset * 1) // 打开状态, 取得当前日期的上个月日期
        : new Date(date.getFullYear(), date.getMonth(), date.getDate() + offset * 7) // 关闭状态, 取得当前日期的七天后的日期

      const result = {
        setYear: setDate.getFullYear(),
        setMonth: setDate.getMonth(),
        setDay: setDate.getDate(),
        dateIndex: index
      }
      this.open && delete result.setDay

      this.getIndexList(result)
    },
    /**
     * 上一年
     */
    beforeYearFn() {
      const { year, month, day } = this.selectDay
      this.witchDate(new Date(year - 1, month - 1, day))
    },
    /**
     * 上个月
     */
    beforeMonthFn() {
      // const diffSum = (x) => (3 + (x % 3)) % 3
      // const current = diffSum(this.oldCurrent - 1)
      // this.handleSwiperChange({ detail: { current } })
      this.$nextTick(() => {
        // this.swiperCurrent = current
        this.swiperCurrent = this.oldCurrent === 0 ? 2 : this.oldCurrent - 1
      })
    },
    /**
     * 下个月
     */
    afterMonthFn() {
      // const diffSum = (x) => (3 + (x % 3)) % 3
      // const current = diffSum(this.oldCurrent + 1)
      // this.handleSwiperChange({ detail: { current } })
      this.$nextTick(() => {
        // this.swiperCurrent = current
        this.swiperCurrent = this.oldCurrent === 2 ? 0 : this.oldCurrent + 1
      })
    },
    /**
     * 下一年
     */
    afterYearFn() {
      const { year, month, day } = this.selectDay
      this.witchDate(new Date(year + 1, month - 1, day))
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.swiper {
  transition: height 0.3s;
}

.header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.direction-column {
  flex-direction: column;
}

.flex1 {
  flex: 1;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.flex-wrap {
  flex-wrap: wrap;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.align-stretch {
  align-items: stretch;
}

.calendar .title {
  padding: 10rpx 16rpx 10rpx 20rpx;
  line-height: 60rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #1c2525;
  letter-spacing: 1px;
}

.list-open {
  position: relative;
  justify-content: center;
  height: 48rpx;
  background: rgba(255, 243, 229, 0.52);
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #fa6044;
}

.icon {
  background-image: url('@/static/group-punch/a10.png');
  background-size: 100% auto;
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
}

.fold {
  transform: rotate(180deg);
}

.unfold {
  transform: rotate(0deg);
}

.calendar {
  .header {
    background: #ffffff;
    border-radius: 16px 16px 0 0;

    .title-new {
      display: flex;
      height: 72rpx;

      .before {
        display: flex;
        align-items: center;

        &-year {
          width: 32rpx;
          height: 32rpx;
          background-image: url('@/static/group-punch/a16.png');
          background-size: 100% auto;

          &:active {
            background-image: url('@/static/group-punch/a12.png');
          }
        }

        &-month {
          width: 32rpx;
          height: 32rpx;
          background-image: url('@/static/group-punch/a17.png');
          background-size: 100% auto;
          margin-left: 16rpx;

          &:active {
            background-image: url('@/static/group-punch/a13.png');
          }
        }
      }

      .month-text {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .month {
          font-size: 24rpx;
          font-weight: 500;
          color: #222222;
        }

        .today {
          width: 88rpx;
          height: 42rpx;
          background: linear-gradient(169deg, #ff9134 0%, #fa6044 100%);
          border-radius: 8rpx;
          font-size: 24rpx;
          line-height: 42rpx;
          color: #fff;
          text-align: center;
          margin-left: 40rpx;
        }

        .today:active {
          background: linear-gradient(169deg, #ff9134 0%, #f1310f 100%);
        }
      }

      .after {
        display: flex;
        align-items: center;

        &-year {
          width: 32rpx;
          height: 32rpx;
          background-image: url('@/static/group-punch/a19.png');
          background-size: 100% auto;

          &:active {
            background-image: url('@/static/group-punch/a15.png');
          }
        }

        &-month {
          width: 32rpx;
          height: 32rpx;
          background-image: url('@/static/group-punch/a18.png');
          background-size: 100% auto;
          margin-right: 16rpx;

          &:active {
            background-image: url('@/static/group-punch/a14.png');
          }
        }
      }
    }
  }

  .calendar-con {
    background: #fff8f1;
    border-radius: 12px;

    .calendar-week {
      line-height: 40rpx;
      padding: 16rpx 0 8rpx 0;

      .view {
        width: 100rpx;
        text-align: center;
        font-size: 24rpx;
        font-weight: 400;
        color: #555555;
      }
    }
  }

  .calendar-main {
    transition: height 0.3s;
    align-content: flex-start;
    overflow: hidden;

    .day {
      display: flex;
      justify-content: center;
      width: 90rpx;
      position: relative;
      text-align: center;

      .bg1 {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64rpx;
        height: 64rpx;
        background-image: url('@/static/group-punch/a24.png');
        background-size: 100% auto;
        font-size: 24rpx;
        font-weight: 500;
        color: #fa6044;
        border-radius: 50%;
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
        color: rgba(250, 96, 68, 0.5);
      }

      .other-month {
        color: rgba(250, 96, 68, 0.5);
      }
    }

    .fold-day {
      .bg1 {
        margin-bottom: 24rpx;
      }
    }

    .unfold-day {
      .bg1 {
        margin-bottom: 0rpx;
      }
    }
  }
}

.header-wrap .month {
  font-size: 28rpx;
  color: #929797;
}
</style>
