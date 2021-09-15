import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import { message } from 'antd';

export interface LoginModelState {
  user: any,
}
export interface LoginModelType {
  namespace: 'login'
  state: LoginModelState
  effects: {
    getuser: Effect,
  }
  reducers: {
    setUser: Reducer<LoginModelState>
  }
}
const LoginModel: LoginModelType = {
  namespace: 'login',
  state: {
    user: {},
  },
  effects: {
    *getuser({ payload }, { call, put }) {
      let res = yield call(api.login, payload)
      if (res.code === 200) {
        yield put({
          type: 'setUser',
          payload: res.data
        })
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        message.success(res.msg)
        window.location.pathname = '/'
      } else {
        message.error(res.msg)
      }
    }
  },
  reducers: {
    setUser(state, action) {
      return {
        ...state,
        user: action.payload
      }
    }
  }
}

export default LoginModel