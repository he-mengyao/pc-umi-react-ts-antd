import { message } from 'antd';
import React from 'react';
import { Effect, Reducer } from 'umi'
import api from '@/http/api'

export interface UserModelState {
  list: any
}

export interface UserModelType {
  namespace: 'user',
  state: UserModelState,
  effects: {
    getList: Effect
    addUsers: Effect
    delUsers: Effect
    showUsers: Effect
    updateUsers: Effect
  }
  reducers: {
    setList: Reducer<UserModelState>
  }
}

const UserModel: UserModelType = {
  namespace: 'user',
  state: {
    list: {}
  },
  effects: {
    // 获取数据列表
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getUser, payload)
      // console.log(res)
      if (res.code === 200) {
        yield put({
          type: 'setList',
          payload: res
        })
      }
    },
    // 添加用户
    *addUsers({ payload }, { call, put }) {
      let res = yield call(api.addUser, payload)
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
      }
    },
    // 删除用户
    *delUsers({ payload }, { call, put }) {
      let res = yield call(api.delUser, payload.id)
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
    // 切换用户状态
    *showUsers({ payload }, { call, put }) {
      let res = yield call(api.showUser, payload)
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
    // 编辑用户
    *updateUsers({ payload }, { call, put }) {
      let res = yield call(api.updateUser, payload)
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

export default UserModel