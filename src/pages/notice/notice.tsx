import React, { useState, useEffect } from 'react'
import { Card, message, Button, Switch, Popconfirm, Input, Modal, Form, Table, Pagination } from 'antd';
import { useDispatch, useSelector } from 'umi'
const { Search } = Input

const User = () => {
  let list = useSelector((state: any) => state.notice.list)
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [item, setItem] = useState<any>()
  let [form] = Form.useForm()
  // 获取用户列表
  let getData = () => {
    dispatch({
      type: 'notice/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  const columns: any = [{
    title: '#',
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: '通知内容',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '是否显示 ',
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
      <div className={`flex ai-c flex-c`}>
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
      type: 'notice/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: val
      }
    })
  }
  // 取消弹框
  let sendVisible1 = (val: any) => {
    setVisible(val)
  }
  // 弹框确认
  let onok = () => {
    // console.log(val);
    let values: any = form.getFieldsValue()
    // 添加
    if (num === 1) {
      setVisible(false)
      dispatch({
        type: 'notice/addNotices',
        payload: {
          content: values.content,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    } else if (num === 2) {
      setVisible(false)
      dispatch({
        type: 'notice/updateNotices',
        payload: {
          content: values.content,
          id: item._id,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    } else {
      message.error('请先上传头像')
    }
  }
  // 切换显示
  let onChange = ((e: any, i: any) => {
    // console.log(e, i);
    dispatch({
      type: 'notice/showNotices',
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
    setItem(val)
    setNum(2)
    setVisible(true)
  }
  // 确定删除
  let confirm = ((val: any) => {
    dispatch({
      type: 'notice/delNotices',
      payload: {
        id: val._id,
        current: current,
        pageSize: pageSize,
        query: query
      },
    })
  })
  // 点击分页
  let onChange5 = ((a: number, b?: number) => {
    // console.log(val);
    setCurrent(a)
    setPageSize(b!)
    dispatch({
      type: 'notice/getList',
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
        <div>
          <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1) }}>添加通知</Button>
        </div>
        {/* 表格 */}
        <div className={`mrtb-20`}>
          <Table columns={columns} rowKey='_id' dataSource={list && list.data} pagination={false} ></Table>
          {/* 分页 */}
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={list && list.total} showSizeChanger
              showTotal={total => `共 ${list && list.total} 条`}
              pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
              onChange={onChange5}
            />
          </div>
        </div>
      </Card>
      {/* 弹出框 */}
      <Modal title={num === 1 ? `添加通知` : `编辑通知`}
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
            label="通知内容"
            name="content"
            rules={[{ required: true, message: '内容不能为空' }]}
            initialValue={item && item.content}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User
