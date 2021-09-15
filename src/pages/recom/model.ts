import { message } from 'antd';
import React from 'react';
import { Effect, Reducer } from 'umi'
import api from '@/http/api'

export interface RecomModelState {
  list: any
}

export interface RecomModelType {
  namespace: 'recom',
  state: RecomModelState,
  effects: {
    getList: Effect
    addRecommendNav: Effect
    delRecommendNav: Effect
    showRecommendNav: Effect
    updateRecommendNav: Effect
  }
  reducers: {
    setList: Reducer<RecomModelState>
  }
}

const RecomModel: RecomModelType = {
  namespace: 'recom',
  state: {
    list: {}
  },
  effects: {
    // 获取导航
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getRecommendNav, payload)
      // console.log(res)
      if (res.code === 200) {
        yield put({
          type: 'setList',
          payload: res
        })
      }
    },
    // 添加导航
    *addRecommendNav({ payload }, { call, put }) {
      let res = yield call(api.addRecommendNav, payload)
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
      }
    },
    // 删除导航
    *delRecommendNav({ payload }, { call, put }) {
      let res = yield call(api.delRecommendNav, payload)
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
    // 显示导航
    *showRecommendNav({ payload }, { call, put }) {
      let res = yield call(api.showRecommendNav, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    },
    // 编辑导航
    *updateRecommendNav({ payload }, { call, put }) {
      let res = yield call(api.updateRecommendNav, payload)
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

export default RecomModel