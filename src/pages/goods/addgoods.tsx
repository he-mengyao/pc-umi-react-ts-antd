import React, { useEffect, useState } from 'react'
import { Card, Input, Button, Tabs, Table, Pagination, Popconfirm, Switch, message } from 'antd'
import Goods1 from '@/components/goods/goods1'
import Goods2 from '@/components/goods/goods2'
import Goods3 from '@/components/goods/goods3'
import Goods4 from '@/components/goods/goods4'
import { useDispatch, useSelector } from 'umi'
import GoodsDetail from '@/components/goods/goodsDetail'

const { Search } = Input
const { TabPane } = Tabs

const Addgoods = () => {
  let dispatch = useDispatch()
  // 规格数据
  let list = useSelector((state: any) => state.goods.list)
  // 商品列表
  let goodsList = useSelector((state: any) => state.goods.goodsList)
  // 分类数据
  let categ = useSelector((state: any) => state.goods.categData)
  // 添加商品显示
  let [visible, setVisible] = useState(false)
  // 商品详情显示
  let [visible1, setVisible1] = useState(false)
  let [item, setItem] = useState<any>()
  let [n, setN] = useState(1)
  // 表格
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  const columns: any = [{
    title: '#',
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '商品原价',
    dataIndex: 'originalPrice',
    align: 'center',
  },
  {
    title: '商品现价',
    dataIndex: 'presentPrice',
    align: 'center',
  },
  {
    title: '商品库存',
    dataIndex: 'stock',
    align: 'center',
  },
  {
    title: '是否新品',
    dataIndex: 'isNewGood',
    align: 'center',
    render: (isNewGood: boolean) => (
      <div>{isNewGood ? '是' : '否'}</div>
    )
  },
  {
    title: '是否热卖',
    dataIndex: 'isHot',
    align: 'center',
    render: (isHot: boolean) => (
      <div>{isHot ? '是' : '否'}</div>
    )
  },
  {
    title: '是否推荐',
    dataIndex: 'isRecommend',
    align: 'center',
    render: (isRecommend: boolean) => (
      <div>{isRecommend ? '是' : '否'}</div>
    )

  }, {
    title: '上下架',
    dataIndex: 'isShow',
    align: 'center',
    render: (text: boolean, record: any) => (
      <Switch defaultChecked={record.isShow} onChange={(e) => { onChange(e, record) }} />
    )
  },
  {
    title: '操作',
    dataIndex: 'index',
    align: 'center',
    key: 'index',
    render: (text: any, record: any) => (
      <div className={`flex ai-c`}>
        <Button type="primary" className={`mrr-10`} size="small" onClick={() => message.warning('暂不能编辑')}>
          编辑
        </Button>
        <Button className={`mrr-10`} size="small" onClick={() => { goDetail(record) }}>
          详情
        </Button>
        <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消" onConfirm={() => confirm(record)}>
          <Button danger size="small">
            删除
          </Button>
        </Popconfirm>
      </div>
    )
  },
  ]
  // 删除商品
  let confirm = ((record: any) => {
    // console.log(record);
    dispatch({
      type: 'goods/delGoods',
      payload: record._id
    })
  })
  // 搜索
  let onSearch = (val: any) => {
    setQuery(val)
    dispatch({
      type: 'goods/getGoods',
      payload: {
        current: current,
        pageSize: pageSize,
        query: val
      }
    })
  }
  // 点击取消
  let sendDel = ((val: number) => {
    if (val === 1) {
      setVisible(false)
    } else {
      setN(val - 1)
    }
  })
  // 点击详情
  let goDetail = ((record: any) => {
    setVisible1(true)
    setItem(record)
  })
  // 点击详情取消
  let sendVisible1 = ((val: boolean) => {
    setVisible1(val)
  })
  // 点击tab栏
  let onTabClick = ((val: any) => {
    // console.log(val);
    setN(val)
  })
  let [text1, setText1] = useState<any>()
  let [text2, setText2] = useState<any>()
  let [text3, setText3] = useState<any>()
  let sendValues = ((val: any, num: number) => {
    if (num === 1) {
      setText1(val)
      setN(num + 1)
    } else if (num === 2) {
      let arr: any = []
      val.pic.fileList.map((i: any) => {
        arr.push(i.response.data)
      })
      val.pic = arr
      setText2(val)
      setN(num + 1)
    } else if (num === 3) {
      setText3(val)
      setN(num + 1)
    } else if (num === 5) {
      setVisible(false)
      setN(1)
      dispatch({
        type: 'goods/addGoods',
        payload: {
          name: text1.name,
          category: text1.category.length > 1 ? text1.category[1] : text1.category[0],
          pic: text2.pic,
          video: "",
          isHot: text1.isHot,
          isRecommend: text1.isRecommend,
          cover: text1.cover.file.response.data,
          originalPrice: text1.originalPrice,
          presentPrice: text1.presentPrice,
          discount: "",
          detail: val.detail,
          spec: text3,
          introduction: text1.introduction,
          company: text1.company,
          stock: text1.stock,
          isNewGood: text1.isNewGood,
          comment: "",
          isShow: text1.isShow,
          sellDesc: text1.sellDesc,
          productionDesc: "",
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    }
  })
  // 点击分页
  let onChanges = ((c: number, p?: number) => {
    dispatch({
      type: 'goods/getGoods',
      payload: {
        current: c, pageSize: p, query: query
      }
    })
    setCurrent(c)
    setPageSize(p!)
  })
  // 上下架
  let onChange = ((e: any, record: any) => {
    message.warning('暂未开放')
  })
  useEffect(() => {
    // 模型
    dispatch({
      type: 'goods/getList',
      payload: {
        current: 1,
        pageSize: 10,
        query: ''
      }
    })
    // 分类
    dispatch({
      type: 'goods/getCategorys',
      payload: ''
    })
    // 商品列表
    dispatch({
      type: 'goods/getGoods',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }, [])
  return (
    <div className={`chat`} style={{ height: 700 }}>
      {/* 搜索 */}
      {
        !visible ?
          <Card>
            <div className={`flex`}>
              <Search style={{ width: 300 }} placeholder="请输入" onSearch={onSearch}></Search>
              <Button type='primary' className={`mrl-20`} onClick={() => setVisible(true)}>添加商品</Button>
            </div>
            <div className={`mrtb-20`}>
              <Table columns={columns} dataSource={goodsList.data} rowKey='_id' pagination={false} />
              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <Pagination current={current} total={goodsList.total ? goodsList.total : 0} onChange={onChanges} showSizeChanger pageSizeOptions={['5', '10', '15', '20']} pageSize={pageSize} showTotal={total => `共 ${goodsList.total ? goodsList.total : 0} 条`} />
              </div>
            </div>
          </Card> :
          <Card title="添加商品" extra={<span className={`color-a0a0 f18`} onClick={() => setVisible(false)}>×</span>} style={{ width: '100%' }}>
            <Tabs activeKey={String(n)} onTabClick={onTabClick}>
              <TabPane tab="基础设置" key="1">
                <Goods1 n={1} list={list && list.data} categ={categ.data1 && categ.data1}
                  sendDel={sendDel} sendValues={sendValues}
                ></Goods1>
              </TabPane>
              <TabPane tab="媒体信息" key="2" disabled={n < 2 ? true : false}>
                <Goods2 n={2} sendDel={sendDel} sendValues={sendValues}></Goods2 >
              </TabPane>
              <TabPane tab="商品规格" key="3" disabled={n < 3 ? true : false}>
                <Goods3 n={3} list={list && list.data} sendDel={sendDel} sendValues={sendValues}></Goods3>
              </TabPane>
              <TabPane tab="商品详情" key="4" disabled={n < 4 ? true : false}>
                <Goods4 n={4} sendDel={sendDel} sendValues={sendValues}></Goods4>
              </TabPane>
            </Tabs>
          </Card>
      }
      <GoodsDetail item={item && item} sendVisible1={sendVisible1} visible={visible1} data={categ.data1 && categ.data1}></GoodsDetail>
    </div>
  )
}

export default Addgoods
