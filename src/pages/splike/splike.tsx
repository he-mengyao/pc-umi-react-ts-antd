import React, { useState, useEffect } from 'react'
import { Card, message, Button, Switch, Popconfirm, Modal, Form, Input, Space, DatePicker, Select, Table, Pagination } from 'antd';
import { useDispatch, useSelector } from 'umi'
import dayjs from 'dayjs'
import Goods from '../goods/goods';

const { Search } = Input
const { Option } = Select

const User = () => {
  // 商品列表
  let goodsList = useSelector((state: any) => state.goods.goodsList)
  // 秒杀商品列表
  let list = useSelector((state: any) => state.splike.list)
  let [form] = Form.useForm()
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [item, setItem] = useState<any>()
  let [status, setStatus] = useState(false)
  let [goodsId, setGoodsId] = useState('')
  let [price, setPrice] = useState<any>()
  // 获取秒杀列表
  let getData = () => {
    dispatch({
      type: 'splike/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  const columns: any = [{
    title: '秒杀商品',
    dataIndex: 'goods',
    align: 'center',
    render: (goods: any) => (
      <div>{goods.name}</div>
    )
  },
  {
    title: '开始时间',
    dataIndex: 'start_time1',
    align: 'center',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time1',
    align: 'center',
  },
  {
    title: '秒杀价格',
    dataIndex: 'price',
    align: 'center',
    ellipsis: true
  }, {
    title: '秒杀数量',
    dataIndex: 'goods_number',
    align: 'center',
    ellipsis: true
  },
  {
    title: '是否禁用  ',
    dataIndex: 'inShow',
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
        <Button type="primary" className={`mrr-10`} onClick={() => { click(record) }}>
          编辑
        </Button>
        <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消" onConfirm={() => confirm(record)}>
          <Button danger>
            删除
          </Button>
        </Popconfirm>
      </div>
    )
  },
  ]
  // 搜索
  let onSearch = (val: any) => {
    dispatch({
      type: 'splike/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: val
      }
    })
  }
  // 弹框确认
  let onok = () => {
    let values: any = form.getFieldsValue()
    // 添加
    let goods = goodsList.data.filter((i: any) => {
      return values.goods === i.name
    })
    if (num === 1) {
      setVisible(false)
      dispatch({
        type: 'splike/addSeckills',
        payload: {
          start_time: values.start_time,
          end_time: values.end_time,
          goods_number: values.goods_number,
          goods: goods[0],
          isShow: false,
          price: values.price,
          current: current,
          pageSize: pageSize,
          query: query,
        }
      })
    } else if (num === 2) {
      setVisible(false)
      message.warning('暂不能编辑')
    }
  }
  // 切换显示
  let onChange = ((e: any, i: any) => {
    // console.log(e, i);
    setStatus(e)
    dispatch({
      type: 'splike/showSeckills',
      payload: {
        isShow: e,
        id: i._id,
        current: current,
        pageSize: pageSize,
        query: query,
      }
    })
  })
  // 选择时间
  let onChange1 = ((date: any, dateString: any) => {
    form.setFieldsValue({ start_time: dateString })
  })
  let onChange2 = ((date: any, dateString: any) => {
    form.setFieldsValue({ end_time: dateString })
  })
  // 点击编辑
  let click = (val: any) => {
    setItem(val)
    setNum(2)
    setVisible(true)
  }
  // 选择商品
  let onchange = ((a: any, b: any) => {
    setGoodsId(b.key)
    let n = goodsList.data.find((i: any) => i._id === b.key).originalPrice
    setPrice(n)
  })
  // 确定删除,等商品做好之后再做
  let confirm = ((val: any) => {
    dispatch({
      type: 'splike/delSeckills',
      payload: {
        id: val._id,
        goodsId: val.goods._id,
        current: current,
        pageSize: pageSize,
        query: query,
      }
    })
  })
  // 点击分页
  let onChange5 = ((a: any, b?: any) => {
    // console.log(val);
    setCurrent(a)
    setPageSize(b!)
    dispatch({
      type: 'splike/getList',
      payload: {
        current: a,
        pageSize: b!,
        query: query
      }
    })
  })
  useEffect(() => {
    // 秒杀列表
    getData()
    // 商品列表
    dispatch({
      type: 'goods/getGoods',
      payload: {
        current: 1,
        pageSize: 10,
        query: ''
      }
    })
  }, [])
  return (
    <div>
      <Card>
        {/* 搜索 */}
        <div>
          <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1), setItem(''), form.resetFields() }}>添加秒杀</Button>
        </div>
        {/* 表格 */}
        <div className={`mrtb-20`}>
          <Table columns={columns} rowKey='_id' dataSource={list && list.data} pagination={false} ></Table>
          {/* 分页 */}
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={list.total && list.total} showSizeChanger
              showTotal={total => `共 ${list.total ? list.total : 0} 条`}
              pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
              onChange={onChange5}
            />
          </div>
        </div>
      </Card>
      {/* 添加秒杀弹出框 */}
      <Modal title={num === 1 ? `添加秒杀` : `编辑秒杀`}
        visible={visible}
        onOk={() => form.submit()}
        onCancel={() => { setVisible(false), setPrice('') }}
        okText="确认"
        destroyOnClose
        cancelText="取消">
        <Form
          form={form}
          onFinish={onok}
          preserve={false}
        >
          {
            price ? <Form.Item>商品原价为：{price}</Form.Item> : null
          }
          <Form.Item rules={[{ required: true, message: '商品不能为空' }]} label="所属商品" name='goods' initialValue={item ? item.goods.name : undefined}>
            <Select placeholder='请选择秒杀商品' onChange={onchange}>
              {
                goodsList.data && goodsList.data.map((item: any) => {
                  return <Option value={item.name} key={item._id}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="开始时间"
            name="start_time"
            rules={[{ required: true, message: '开始时间不能为空' }]}
            initialValue={item && item.start_time2}
          >
            <Space direction="vertical" className={`w-100`}>
              <DatePicker className={`w-100`} showTime onChange={onChange1} defaultValue={item && item.start_time2} />
            </Space>
          </Form.Item>
          <Form.Item
            label="结束时间"
            name="end_time"
            rules={[{ required: true, message: '结束时间不能为空' }]}
            initialValue={item && item.end_time}
          >
            <Space direction="vertical" className={`w-100`}>
              <DatePicker showTime className={`w-100`} onChange={onChange2} defaultValue={item && item.end_time2}
              /></Space>
          </Form.Item>
          <Form.Item
            label="秒杀价格"
            name="price"
            rules={[{ required: true, message: '秒杀价格不能为空' }]}
            initialValue={item && item.price}
          >
            <Input type='number' placeholder="请输入秒杀价格" min="1" />
          </Form.Item>
          <Form.Item
            label="秒杀数量"
            name="goods_number"
            rules={[{ required: true, message: '秒杀数量不能为空' }]}
            initialValue={item && item.goods_number}
          >
            <Input type='number' placeholder="请输入秒杀数量" min="1" />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}

export default User
