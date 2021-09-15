import React, { useState, useEffect } from 'react'
import { Card, message, Button, Switch, Popconfirm, Input, Table, Pagination, Form, Modal, Space, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'umi'

const { Search } = Input

const User = () => {
  let list = useSelector((state: any) => state.coupon.list)
  let [form] = Form.useForm()
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [item, setItem] = useState<any>()
  let [status, setStatus] = useState(false)
  // 获取用户列表
  let getData = () => {
    dispatch({
      type: 'coupon/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  const columns: any = [{
    title: '优惠券名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    align: 'center',
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    align: 'center',
  },
  {
    title: '优惠金额',
    dataIndex: 'amount',
    align: 'center',
    ellipsis: true
  }, {
    title: '使用门槛',
    dataIndex: 'threshold',
    align: 'center',
    ellipsis: true
  },
  {
    title: '发放数量',
    dataIndex: 'number',
    align: 'center',
    ellipsis: true
  }, {
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
    // console.log(val);
    dispatch({
      type: 'coupon/getList',
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
    if (num === 1) {
      setVisible(false)
      dispatch({
        type: 'coupon/addCoupons',
        payload: {
          name: values.name,
          amount: values.amount,
          threshold: values.threshold,
          start_time: values.start_time,
          end_time: values.end_time,
          number: values.number,
          isShow: true,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    } else if (num === 2) {
      dispatch({
        type: 'coupon/updateCoupons',
        payload: {
          name: values.name,
          amount: values.amount,
          threshold: values.threshold,
          start_time: values.start_time,
          end_time: values.end_time,
          number: values.number,
          id: item._id,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
      setTimeout(() => {
        setVisible(false)
      }, 100);
    } else {
      message.error('请先上传头像')
    }
  }
  // 切换显示
  let onChange = ((e: any, i: any) => {
    // console.log(e, i);
    setStatus(e)
    dispatch({
      type: 'coupon/showCoupons',
      payload: {
        isShow: e,
        id: i._id,
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  })
  // 点击编辑
  let click = (val: any) => {
    // console.log(val);
    setItem(val)
    setNum(2)
    setVisible(true)
  }
  // 选择时间
  let onChange1 = ((date: any, dateString: any) => {
    form.setFieldsValue({ start_time: dateString })
  })
  let onChange2 = ((date: any, dateString: any) => {
    form.setFieldsValue({ end_time: dateString })
  })
  // 确定删除
  let confirm = ((val: any) => {
    dispatch({
      type: 'coupon/delCoupons',
      payload: {
        id: val._id,
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  })
  // 点击分页
  let onChange5 = ((a: any, b?: any) => {
    // console.log(val);
    setCurrent(a)
    setPageSize(b!)
    dispatch({
      type: 'coupon/getList',
      payload: {
        current: a,
        pageSize: b,
        query: query
      }
    })
  })
  useEffect(() => {
    getData()
  }, [])
  return (
    <div>
      <Card>
        {/* 搜索 */}
        <div>
          <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1) }}>添加优惠券</Button>
        </div>
        {/* 表格 */}
        <div className={`mrtb-20`}>
          <Table columns={columns} rowKey='_id' dataSource={list && list.data} pagination={false} ></Table>
          {/* 分页 */}
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={list.total && list.total} showSizeChanger
              showTotal={total => `共 ${list.total && list.total} 条`}
              pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
              onChange={onChange5}
            />
          </div>
        </div>
      </Card>
      {/* 弹出框 */}
      <Modal title={num === 1 ? `添加优惠券` : `编辑优惠券`}
        visible={visible}
        onOk={() => form.submit()}
        onCancel={() => { setVisible(false), form.resetFields(), setItem('') }}
        okText="确认"
        destroyOnClose
        cancelText="取消">
        <Form
          form={form}
          onFinish={onok}
          preserve={false}
        >
          <Form.Item
            label="优惠券名称"
            name="name"
            rules={[{ required: true, message: '优惠券名称不能为空' }]}
            initialValue={item && item.name}
          >
            <Input placeholder="请输入优惠券名称" />
          </Form.Item>
          <div style={{ marginLeft: 13 }}>
            <Form.Item
              label="使用门槛"
              name="threshold"
              rules={[{ required: true, message: '使用门槛不能为空' }]}
              initialValue={item && item.threshold}
            >
              <Input placeholder="请输入使用门槛" type='number' />
            </Form.Item>
            <Form.Item
              label="优惠金额"
              name="amount"
              rules={[{ required: true, message: '优惠金额不能为空' }]}
              initialValue={item && item.amount}
            >
              <Input type='number' placeholder="请输入优惠金额" />
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
              label="发放数量"
              name="number"
              rules={[{ required: true, message: '发放数量不能为空' }]}
              initialValue={item && item.number}
            >
              <Input type='number' placeholder="请输入发放数量" min="1" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default User
