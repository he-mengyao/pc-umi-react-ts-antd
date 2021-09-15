import { message } from 'antd';
import React from 'react';
import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import dayjs from 'dayjs'
import moment from 'moment'

export interface CouponModelState {
  list: any
}

export interface CouponModelType {
  namespace: 'coupon',
  state: CouponModelState,
  effects: {
    getList: Effect
    addCoupons: Effect
    delCoupons: Effect
    showCoupons: Effect
    updateCoupons: Effect
  }
  reducers: {
    setList: Reducer<CouponModelState>
  }
}

const CouponModel: CouponModelType = {
  namespace: 'coupon',
  state: {
    list: {}
  },
  effects: {
    // 获取数据列表
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getCoupon, payload)
      // console.log(res)
      res.data.map((item: any, index: number) => {
        item.index = index + 1
        item.start_time = dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss')
        item.end_time = dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss')
        item.start_time2 = moment(item.start_time)
        item.end_time2 = moment(item.end_time)
      })
      if (res.code === 200) {
        yield put({
          type: 'setList',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 添加
    *addCoupons({ payload }, { call, put }) {
      let res = yield call(api.addCoupon, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getList',
          payload: {
            current: payload.current,
            pageSize: payload.pageSize,
            query: payload.query
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 删除
    *delCoupons({ payload }, { call, put }) {
      let res = yield call(api.delCoupon, payload.id)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getList',
          payload: {
            current: payload.current,
            pageSize: payload.pageSize,
            query: payload.query
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 切换
    *showCoupons({ payload }, { call, put }) {
      let res = yield call(api.showCoupon, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getList',
          payload: {
            current: payload.current,
            pageSize: payload.pageSize,
            query: payload.query
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 编辑
    *updateCoupons({ payload }, { call, put }) {
      let res = yield call(api.updateCoupon, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getList',
          payload: {
            current: payload.current,
            pageSize: payload.pageSize,
            query: payload.query
          }
        })
      } else {
        message.error(res.msg)
      }
    },
  },
  reducers: {
    setList(state, action) {
      return {
        type: 'getList',
        list: action.payload
      }
    }
  }
}

export default CouponModel