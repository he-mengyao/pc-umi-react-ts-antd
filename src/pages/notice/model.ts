import { message } from 'antd';
import React from 'react';
import { Effect, Reducer } from 'umi'
import api from '@/http/api'

export interface NoticeModelState {
  list: any
}

export interface NoticeModelType {
  namespace: 'notice',
  state: NoticeModelState,
  effects: {
    getList: Effect
    addNotices: Effect
    delNotices: Effect
    showNotices: Effect
    updateNotices: Effect
  }
  reducers: {
    setList: Reducer<NoticeModelState>
  }
}

const NoticeModel: NoticeModelType = {
  namespace: 'notice',
  state: {
    list: { }
  },
  effects: {
    // 获取数据列表
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getNotice, payload)
      // console.log(res)
      res.data.map((item: any, index: number) => {
        item.index = index + 1
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
    // 添加通知
    *addNotices({ payload }, { call, put }) {
      let res = yield call(api.addNotice, payload)
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
    // 删除通知
    *delNotices({ payload }, { call, put }) {
      let res = yield call(api.delNotice, payload)
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
    // 切换通知状态
    *showNotices({ payload }, { call, put }) {
      let res = yield call(api.showNotice, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    },
    // 编辑通知
    *updateNotices({ payload }, { call, put }) {
      let res = yield call(api.updateNotice, payload)
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

export default NoticeModel