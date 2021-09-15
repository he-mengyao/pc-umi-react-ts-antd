import React, { useState, useEffect } from 'react'
import { Card, message, Button, Switch, Popconfirm, Table, Pagination, Input, Modal, Form, Upload, Image } from 'antd';
import { useDispatch, useSelector } from 'umi'

const { Search } = Input

const User = () => {
  let list = useSelector((state: any) => state.user.list)
  let [form] = Form.useForm()
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [item, setItem] = useState<any>()
  let [status, setStatus] = useState(false)
  let [url, setUrl] = useState('')
  // 获取用户列表
  let getData = () => {
    dispatch({
      type: 'user/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  const columns: any = [{
    title: '用户头像',
    dataIndex: 'avatar',
    align: 'center',
    render: (avatar: any) => (
      <img src={avatar} alt="" width='40' height='40' />)
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    align: 'center',
  },
  {
    title: '用户电话',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '用户邮箱',
    dataIndex: 'email',
    align: 'center',
    ellipsis: true
  }, {
    title: '是否禁用  ',
    dataIndex: 'index',
    align: 'center',
    render: (text: boolean, record: any) => (
      <Switch defaultChecked={record.status} onChange={(e) => { onChange(e, record) }} />
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
  // 点击添加
  let sendVisible = (val: boolean) => {
    setVisible(true)
    setNum(1)
    setItem('')
  }
  // 搜索
  let onSearch = (val: any) => {
    // console.log(val);
    dispatch({
      type: 'user/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: val
      }
    })
  }
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 上传图片
  let onChange1 = (info: any) => {
    if (info.file.status === 'done') {
      setUrl(info.file.response.data)
      form.setFieldsValue({ url: info.file.response.data })
    }
  }
  // 弹框确认
  let onok = (val: any) => {
    let values: any = form.getFieldsValue()
    // 添加
    if (num === 1) {
      setVisible(false)
      dispatch({
        type: 'user/addUsers',
        payload: {
          username: values.username,
          avatar: values.url,
          email: values.email,
          mobile: values.mobile,
          status: false,
          password: values.password,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    } else if (num === 2) {
      setVisible(false)
      dispatch({
        type: 'user/updateUsers',
        payload: {
          id: item._id,
          username: values.username,
          avatar: values.url,
          email: values.email,
          mobile: values.mobile,
          status: status,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    }
  }
  // 切换显示
  let onChange = ((e: any, i: any) => {
    // console.log(e, i);
    setStatus(e)
    dispatch({
      type: 'user/showUsers',
      payload: {
        status: e,
        id: i._id
      }
    })
  })
  // 点击编辑
  let click = (val: any) => {
    setUrl(val.avatar)
    setItem(val)
    setNum(2)
    setVisible(true)
    form.setFieldsValue({ url: val.avatar })
  }
  // 确定删除
  let confirm = ((val: any) => {
    dispatch({
      type: 'user/delUsers',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query,
        id: val._id
      }
    })
  })
  // 点击分页
  let onChanges = ((a: any, b?: number) => {
    setCurrent(a)
    setPageSize(b!)
    dispatch({
      type: 'user/getList',
      payload: {
        current: a,
        pageSize: b!,
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
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1) }}>添加用户</Button>
        </div>
        {/* 表格 */}
        <div>
          <Table columns={columns} dataSource={list.data} rowKey='_id' pagination={false} />
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={list ? list.total : 0} onChange={onChanges} showSizeChanger pageSizeOptions={['5', '10', '15', '20']} pageSize={pageSize} showTotal={total => `共 ${list ? list.total : 0} 条`} />
          </div>
        </div>
      </Card>
      {/* 弹出框 */}
      <Modal title={num === 1 ? `添加用户` : `编辑用户`}
        visible={visible}
        onOk={() => form.submit()}
        onCancel={() => { setVisible(false), form.resetFields(), setItem(''), setUrl('') }}
        okText="确认"
        destroyOnClose
        cancelText="取消">
        <Form
          form={form}
          onFinish={onok}
          preserve={false}
        >
          <Form.Item
            label="图片地址"
            name="url"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传图片' }]}
            initialValue={item && item.url}
          >
            <Upload action="http://localhost:7001/admin/upload"
              showUploadList={false} onChange={onChange1}
              listType="picture" headers={{ Authorization: localStorage.getItem('token')! }}>
              <span className={`mrl-20 color-blue`}>点击上传图片</span></Upload>
            <div>
              <Image src={url} width={200}></Image>
            </div>
          </Form.Item>
          <Form.Item
            label="用户名称"
            name="username"
            rules={[{ required: true, message: '名称不能为空' }]}
            initialValue={item && item.username}
          >
            <Input />
          </Form.Item>
          {
            num === 1 ? <Form.Item
              label="用户密码"
              name="password"
              rules={[{ required: true, message: '密码不能为空' }]}
              initialValue={item && item.password}
            >
              <Input.Password />
            </Form.Item> : null
          }
          <Form.Item
            label="用户电话"
            name="mobile"
            className={`mrl-10`}
            initialValue={item && item.mobile}
          >
            <Input type='number' />
          </Form.Item>
          <Form.Item
            label="用户邮箱"
            name="email"
            className={`mrl-10`}
            initialValue={item && item.email}
          >
            <Input type='email' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default User
