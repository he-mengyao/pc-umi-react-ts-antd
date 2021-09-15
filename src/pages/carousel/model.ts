import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import { message } from 'antd';

export interface CarouselModelState {
  CarouselList: any,
  formData: any
}
export interface CarouselModelType {
  namespace: 'carousel'
  state: CarouselModelState
  effects: {
    getCarouselList: Effect,
    getformData: Effect,
    delCarousel: Effect
    updateCarouse: Effect,
    showBanners: Effect
  }
  reducers: {
    setCarouselList: Reducer<CarouselModelState>
    setformData: Reducer<CarouselModelState>
  }
}
const CarouselModel: CarouselModelType = {
  namespace: 'carousel',
  state: {
    CarouselList: {},
    formData: {}
  },
  effects: {
    // 添加轮播图
    *getCarouselList({ payload }, { call, put }) {
      let res = yield call(api.addBanner, payload)
      // console.log(res)
      if (res.code === 200) {
        yield put({
          type: 'getformData',
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
    // 获取表格数据
    *getformData({ payload }, { call, put }) {
      let res = yield call(api.getBanner, payload)
      res.data.map((item: any, index: number) => {
        item.index = index + 1
      })
      if (res.code === 200) {
        yield put({
          type: 'setformData',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 删除
    *delCarousel({ payload }, { call, put }) {
      let res = yield call(api.delBanner, payload.id)
      if (res.code === 200) {
        // 再调获取列表的请求
        yield put({
          type: 'getformData',
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
    *updateCarouse({ payload }, { call, put }) {
      let res = yield call(api.updateBanner, payload)
      if (res.code === 200) {
        yield put({
          type: 'getformData',
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
    // 显示轮播图
    *showBanners({ payload }, { call, put }) {
      let res = yield call(api.showBanner, payload)
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    },
  },
  reducers: {
    setCarouselList(state, action) {
      return {
        formData: state!.formData,
        CarouselList: action.payload
      }
    },
    setformData(state, action) {
      return {
        CarouselList: state!.CarouselList,
        formData: action.payload
      }
    }
  }
}

export default CarouselModel