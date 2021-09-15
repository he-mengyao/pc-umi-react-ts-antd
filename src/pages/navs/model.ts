import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import { message } from 'antd';

export interface NavsModelState {
  list: any
}

export interface NavsModelType {
  namespace: 'navs',
  state: NavsModelState,
  effects: {
    getList: Effect
    getNavs: Effect
    showNavs: Effect
    updateNavs: Effect
    delNavs: Effect
  },
  reducers: {
    setList: Reducer<NavsModelState>,
  }
}

const NavsModel: NavsModelType = {
  namespace: 'navs',
  state: {
    list: {}
  },
  effects: {
    // 获取导航数据
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getNav, payload)
      // console.log(res)
      if (res.code === 200) {
        yield put({
          type: 'setList',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 新增导航
    *getNavs({ payload }, { call, put }) {
      let res = yield call(api.addNav, payload)
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
    // 切换导航显示状态
    *showNavs({ payload }, { call, put }) {
      let res = yield call(api.showNav, payload)
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
    // 修改导航
    *updateNavs({ payload }, { call, put }) {
      let res = yield call(api.updateNav, payload)
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
    // 删除导航
    *delNavs({ payload }, { call, put }) {
      let res = yield call(api.delNav, payload.id)
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
        ...state,
        list: action.payload
      }
    }
  }
}
export default NavsModel