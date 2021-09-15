import { Effect, Reducer } from 'umi'
import api from '@/http/api'
import { message } from 'antd';

export interface GoodsModelState {
  list: any,
  form: any,
  categData: any,
  goodsList: any,
  Params: any
}

export interface GoodsModelType {
  namespace: 'goods',
  state: GoodsModelState,
  effects: {
    // 模型
    getList: Effect
    addModels: Effect
    updateModels: Effect
    delModels: Effect
    // 规格
    getSpecs: Effect
    empty: Effect
    addSpecs: Effect
    delSpecs: Effect
    // 分类
    addCategorys: Effect
    addSecondCategorys: Effect
    getCategorys: Effect
    delCategorys: Effect
    // 商品
    addGoods: Effect
    getGoods: Effect
    delGoods: Effect
    // 参数
    addParams: Effect
    getParams: Effect
    delParams: Effect
    addSpecParams: Effect
  },
  reducers: {
    setList: Reducer<GoodsModelState>,
    setForm: Reducer<GoodsModelState>,
    setCategData: Reducer<GoodsModelState>,
    setgoodsList: Reducer<GoodsModelState>,
    setParams: Reducer<GoodsModelState>,
  }
}

const GoodsModel: GoodsModelType = {
  namespace: 'goods',
  state: {
    list: { },
    form: { },
    categData: { },
    goodsList: { },
    Params: { }
  },
  effects: {
    // 获取模型数据
    *getList({ payload }, { call, put }) {
      let res = yield call(api.getModel, payload)
      if (res.code === 200) {
        res.data.map((item: any, index: number) => {
          item.index = index + 1
          item.specifications.map((i: any) => {
            i.checkList = []
            i.spec_item1 = i.spec_item.split('\n')
          })
        })
        // console.log(res)
        yield put({
          type: 'setList',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 新增模型
    * addModels({ payload }, { call, put }) {
      let res = yield call(api.addModel, payload)
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
    // 编辑模型
    * updateModels({ payload }, { call, put }) {
      let res = yield call(api.updateModel, payload)
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
    // 删除商品模型
    * delModels({ payload }, { call, put }) {
      let res = yield call(api.delModel, payload)
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
    // 获取商品规格
    *getSpecs({ payload }, { call, put }) {
      let res = yield call(api.getSpec, payload)
      // console.log(res)
      if (res.code === 200) {
        res.data.map((item: any, index: number) => {
          item.index = index + 1
        })
        yield put({
          type: 'setForm',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 重置
    *empty({ payload }, { call, put }) {
      let res = yield call(api.getSpec, payload)
      // console.log(res)
      if (res.code === 200) {
        res = null
        yield put({
          type: 'setForm',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 新增规格
    * addSpecs({ payload }, { call, put }) {
      let res = yield call(api.addSpec, payload)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getSpecs',
          payload: { parentId: payload.parentId }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 删除规格
    * delSpecs({ payload }, { call, put }) {
      let res = yield call(api.delSpec, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getSpecs',
          payload: { parentId: payload.parentId }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 添加一级分类
    *addCategorys({ payload }, { call, put }) {
      let res = yield call(api.addCategory, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getCategorys',
          payload: ''
        })
      } else {
        message.error(res.msg)
      }
    },
    // 添加二级分类
    *addSecondCategorys({ payload }, { call, put }) {
      let res = yield call(api.addSecondCategory, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getCategorys',
          payload: ''
        })
      } else {
        message.error(res.msg)
      }
    },
    // 获取分类
    *getCategorys({ payload }, { call, put }) {
      let res = yield call(api.getCategory, payload)
      // 树形图
      let list: any = []
      res.data.map((item: any) => {
        let children: any = []
        item.list.map((item1: any) => {
          let obj1 = {
            title: item1.name,
            key: item1._id,
            isLeaf: item1.isShow
          }
          children.push(obj1)
        })
        let obj = {
          title: item.name,
          key: item._id,
          children: children
        }
        list.push(obj)
      })
      // 层级选择器
      let cascaderList: any = []
      res.data.map((item: any) => {
        let children: any = []
        item.list.map((item1: any) => {
          let obj1 = {
            label: item1.name,
            value: item1._id,
            isLeaf: item1.isShow
          }
          children.push(obj1)
        })
        let obj = {
          value: item._id,
          label: item.name,
          children: children
        }
        cascaderList.push(obj)
      })
      // console.log(list)
      if (res.code === 200) {
        yield put({
          type: 'setCategData',
          payload: {
            data: list,
            data1: cascaderList
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 删除分类
    *delCategorys({ payload }, { call, put }) {
      let res = yield call(api.delCategory, payload.id)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getCategorys',
          payload: ''
        })
      } else {
        message.error(res.msg)
      }
    },
    // 添加商品
    *addGoods({ payload }, { call, put }) {
      let res = yield call(api.addGoods, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getGoods',
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
    // 获取商品
    *getGoods({ payload }, { call, put }) {
      let res = yield call(api.getGoods, payload)
      if (res.code === 200) {
        // console.log(res)
        res.data.map((i: any, index: number) => {
          i.index = index + 1
        })
        yield put({
          type: 'setgoodsList',
          payload: res
        })
      }
    },
    // 删除商品
    *delGoods({ payload }, { call, put }) {
      let res = yield call(api.delGoods, payload)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getGoods',
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
    // 获取参数列表
    *getParams({ payload }, { call, put }) {
      let res = yield call(api.getParams, payload)
      // console.log(res)
      res.data.map((i: any, index: number) => {
        i.index = index + 1
      })
      if (res.code === 200) {
        yield put({
          type: 'setParams',
          payload: res
        })
      } else {
        message.error(res.msg)
      }
    },
    // 新增参数
    *addParams({ payload }, { call, put }) {
      let res = yield call(api.addParams, payload)
      // console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getParams',
          payload: {
            parentId: payload.parentId
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 删除参数
    *delParams({ payload }, { call, put }) {
      let res = yield call(api.delParams, payload)
      console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
        yield put({
          type: 'getParams',
          payload: {
            parentId: payload.parentId
          }
        })
      } else {
        message.error(res.msg)
      }
    },
    // 添加规格参数
    *addSpecParams({ payload }, { call, put }) {
      let res = yield call(api.addSpecParams, payload)
      console.log(res)
      if (res.code === 200) {
        message.success(res.msg)
      } else {
        message.error(res.msg)
      }
    },
  },
  reducers: {
    setList(state, action) {
      return {
        form: state!.form,
        categData: state!.categData,
        goodsList: state!.goodsList,
        Params: state!.Params,
        list: action.payload
      }
    },
    setForm(state, action) {
      return {
        list: state!.list,
        categData: state!.categData,
        goodsList: state!.goodsList,
        Params: state!.Params,
        form: action.payload,
      }
    },
    setCategData(state, action) {
      return {
        form: state!.form,
        list: state!.list,
        goodsList: state!.goodsList,
        Params: state!.Params,
        categData: action.payload
      }
    },
    setgoodsList(state, action) {
      return {
        form: state!.form,
        list: state!.list,
        categData: state!.categData,
        Params: state!.Params,
        goodsList: action.payload
      }
    },
    setParams(state, action) {
      return {
        form: state!.form,
        list: state!.list,
        categData: state!.categData,
        goodsList: state!.goodsList,
        Params: action.payload
      }
    },
  }
}
export default GoodsModel