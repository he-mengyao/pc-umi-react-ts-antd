import React, { useState, useEffect } from 'react'
import { Card, Input, Button, Modal, Form, Select, Table, Switch, Popconfirm, Pagination } from 'antd';
import { useSelector, useDispatch } from 'umi'

const { Search } = Input
const { Option } = Select

const Recom = () => {
  // 添加
  let [visible, setVisible] = useState(false)
  // 查看
  let [visible1, setVisible1] = useState(false)
  let dispatch = useDispatch()
  // 商品列表
  let goodsList = useSelector((state: any) => state.goods.goodsList)
  // 导航列表
  let recomList = useSelector((state: any) => state.recom.list)
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [item, setItem] = useState<any>()
  let [form] = Form.useForm()
  let [n, setN] = useState(1)
  let columns: any = [{
    title: '导航名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '导航描述',
    dataIndex: 'desc',
    align: 'center'
  },
  {
    title: '是否禁用',
    dataIndex: 'isShow',
    align: 'center',
    render: (isShow: boolean, record: any) => (
      <Switch defaultChecked={isShow} onChange={(e) => onChange(e, record)}></Switch>
    )
  },
  {
    title: '操作',
    align: 'center',
    render: (text: any, record: any) => (
      <div className={`flex ai-c flex-c`}>
        <Button className={`mrr-10`} onClick={() => look(record)}>
          查看商品
        </Button>
        <Button type="primary" className={`mrr-10`} onClick={() => edit(record)}>
          编辑
        </Button>
        <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消" onConfirm={() => confirm(record)}>
          <Button danger>
            删除
          </Button>
        </Popconfirm>
      </div>
    )
  }
  ]
  // 搜索
  let onSearch = ((val: any) => {
    dispatch({
      type: 'recom/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: val
      }
    })
  })
  // 切换导航
  let onChange = ((val: boolean, record: any) => {
    dispatch({
      type: 'recom/showRecommendNav',
      payload: {
        id: record._id,
        isShow: val
      }
    })
  })
  // 删除导航
  let confirm = ((record: any) => {
    dispatch({
      type: 'recom/delRecommendNav',
      payload: record._id
    })
  })
  // 点击编辑
  let edit = ((record: any) => {
    let i = record
    let name: any = []
    i.goods.map((s: any) => {
      name.push(s.name)
    })
    i.goods1 = name
    setVisible(true)
    setN(2)
    setItem(i)
  })
  // 查看
  let look = ((record: any) => {
    console.log(record);
    setVisible1(true)
    setItem(record)
  })
  // 分页 
  let onChange5 = ((a: any, b: any) => {
    dispatch({
      type: 'recom/getList',
      payload: {
        current: a,
        pageSize: b,
        query: query
      }
    })
  })
  // 添加确认
  let onFinish = (() => {
    let values: any = form.getFieldsValue()
    let goods = goodsList.data.filter((i: any) => {
      return values.goods.some((q: any) => q === i.name)
    })
    if (n === 1) {
      dispatch({
        type: 'recom/addRecommendNav',
        payload: {
          name: values.name,
          desc: values.desc,
          goods: goods
        }
      })
    } else {
      dispatch({
        type: 'recom/updateRecommendNav',
        payload: {
          id: item._id,
          name: values.name,
          desc: values.desc,
          goods: goods
        }
      })
    }
    setVisible(false)
    form.resetFields()
  })
  useEffect(() => {
    // 商品列表
    dispatch({
      type: 'goods/getGoods',
      payload: {
        current: 1,
        pageSize: 99,
        query: ''
      }
    })
    // 导航列表
    dispatch({
      type: 'recom/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }, [])
  return (
    <div>
      <Card>
        <div>
          <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setN(1), setItem('') }}>添加推荐导航</Button>
        </div>
        <div className={`mrtb-20`}>
          <Table columns={columns} rowKey='_id' dataSource={recomList && recomList.data} pagination={false} ></Table>
          {/* 分页 */}
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={recomList && recomList.total} showSizeChanger
              showTotal={total => `共 ${recomList && recomList.total} 条`}
              pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
              onChange={onChange5}
            />
          </div>
        </div>
      </Card>
      {/* 添加导航弹出框 */}
      <Modal visible={visible} title={n === 1 ? '添加推荐导航' : '编辑推荐导航'} onCancel={() => { setVisible(false) }}
        okText="确认" cancelText='取消' onOk={() => form.submit()} destroyOnClose={true}
      >
        <Form form={form} onFinish={onFinish} preserve={false}>
          <Form.Item rules={[{ required: true, message: '导航名称不能为空' }]} label="导航名称" name="name" initialValue={item ? item.name : ''}><Input></Input></Form.Item>
          <Form.Item rules={[{ required: true, message: '导航描述不能为空' }]} label="导航描述" name="desc" initialValue={item ? item.desc : ''}><Input></Input></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品不能为空' }]} label="所属商品" name='goods' initialValue={item ? item.goods1 : undefined}>
            <Select placeholder='请选择所属商品' mode="multiple">
              {
                goodsList.data && goodsList.data.map((item: any) => {
                  return <Option value={item.name} key={item._id}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* 查看商品弹出框 */}
      <Modal visible={visible1} title='分类下属商品' footer={null} onCancel={() => setVisible1(false)}
      >
        {
          item && item.goods.map((i: any, index: number) => {
            return <div key={index}>商品名称：{i.name}</div>
          })
        }
      </Modal>
    </div >
  )
}

export default Recom
