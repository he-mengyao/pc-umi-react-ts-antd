import { message } from 'antd';
import React from 'react';
import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import dayjs from 'dayjs'
import moment from 'moment'

export interface SplikeModelState {
  list: any
}

export interface SplikeModelType {
  namespace: 'splike',
  state: SplikeModelState,
  effects: {
    getList: Effect
    addSeckills: Effect
    delSeckills: Effect
    showSeckills: Effect
    updateSeckills: Effect
  }
  reducers: {
    setList: Reducer<SplikeModelState>
  }
}

const SplikeModel: SplikeModelType = {
  namespace: 'splike',
  state: {
    list: {}
  },
  effects: {
    // 获取数据列表
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getSeckill, payload)
      // console.log(res)
      res.data.map((item: any, index: number) => {
        item.index = index + 1
        item.start_time1 = dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss')
        item.end_time1 = dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss')
        item.start_time2 = moment(item.start_time)
        item.end_time2 = moment(item.nd_time)
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
    *addSeckills({ payload }, { call, put }) {
      let res = yield call(api.addSeckill, payload)
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
    *delSeckills({ payload }, { call, put }) {
      let res = yield call(api.delSeckill, payload)
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
    *showSeckills({ payload }, { call, put }) {
      let res = yield call(api.showSeckill, payload)
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
    *updateSeckills({ payload }, { call, put }) {
      let res = yield call(api.updateSeckill, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getList',
          payload: {
            current: 1,
            pageSize: 5,
            query: ''
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

export default SplikeModel