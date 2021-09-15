import { Effect, Reducer } from 'umi'
import { message } from 'antd'
import api from '../http/api'

export interface HomeModelState {
  topics: any,
}
export interface HomeModelType {
  namespace: 'home'
  state: HomeModelState
  effcts: {
    getTopics: Effect,
  }
  reducers: {
    setTopics: Reducer<HomeModelState>
  }
}

const HomeModel: HomeModelType = {
  namespace: 'home',
  state: {
    topics: [],
  },
  effcts: {
    *getTopics({ payload }, { call, put }) {
      let res = yield call(api.getIndex)
      console.log(res)
    }
  },
  reducers: {
    setTopics(state, action) {
      return {
        ...state,
        topics: action.payload
      }
    }
  }
}

export default HomeModel