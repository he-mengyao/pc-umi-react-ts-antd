import { Reducer, Effect } from 'umi';
import api from '@/http/api'

export interface OrderModuleState {
  list: any
}

export interface OrderModuleType {
  namespace: 'order',
  state: OrderModuleState,
  effects: {
    getList: Effect
  },
  reducers: {
    setList: Reducer<OrderModuleState>
  },
}

const OrderModel: OrderModuleType = {
  namespace: 'order',
  state: {
    list: []
  },
  effects: {
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getOrder, payload)
      console.log(res)
      if (res.code === 200) {
        yield put({
          type: 'setList',
          payload: res
        })
      }
    }
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

export default OrderModel