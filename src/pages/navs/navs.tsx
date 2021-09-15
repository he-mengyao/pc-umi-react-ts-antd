import React, { useEffect, useState } from 'react'
import { Switch, Button, Popconfirm, Table, Pagination, Modal, Form, Upload, Image, Input } from 'antd';
import { useDispatch, useSelector } from 'umi'
const { Search } = Input
const Navs = () => {
  let list = useSelector((state: any) => state.navs.list)
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(1)
  let [form] = Form.useForm()
  let [url, setUrl] = useState('')
  let [item, setItem] = useState<any>()
  const columns: any = [{
    title: '图片',
    dataIndex: 'url',
    align: 'center',
    render: (url: any) => (
      <img src={url} alt="" width='60' height='60' />)
  },
  {
    title: '路径',
    dataIndex: 'url',
    align: 'center',
  },
  {
    title: '标题',
    dataIndex: 'title',
    align: 'center',
  },
  {
    title: '链接',
    dataIndex: 'link',
    align: 'center',
    ellipsis: true
  }, {
    title: '是否显示',
    dataIndex: 'index',
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
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 获取表格数据
  let getData = () => {
    dispatch({
      type: 'navs/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  // 搜索
  let onSearch = (e: any) => {
    dispatch({
      type: 'navs/getList',
      payload: {
        current: current,
        pageSize: pageSize,
        query: e
      }
    })
  }
  // 是否显示
  let onChange = (e: boolean, i: any) => {
    dispatch({
      type: 'navs/showNavs',
      payload: {
        id: i._id,
        isShow: e,
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  // 上传图片
  let onChange1 = (info: any) => {
    if (info.file.status === 'done') {
      setUrl(info.file.response.data)
      form.setFieldsValue({ url: info.file.response.data })
    }
  }
  // 点击编辑
  let click = (e: any) => {
    setNum(2)
    setVisible(true)
    setItem(e)
    setUrl(e.url)
  }
  // 弹框确认
  let onok = () => {
    let values: any = form.getFieldsValue()
    setVisible(false)
    if (num === 1) {
      dispatch({
        type: 'navs/getNavs',
        payload: {
          title: values.title,
          url: values.url,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    } else if (num === 2) {
      // 编辑提交
      dispatch({
        type: 'navs/updateNavs',
        payload: {
          id: item._id,
          title: values.title,
          url: values.url,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    }
  }
  // 删除
  let confirm = (i: any) => {
    // console.log(i);
    dispatch({
      type: 'navs/delNavs',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query,
        id: i._id,
      }
    })
  }
  // 点击分页
  let onChange5 = ((a: any, b?: any) => {
    // console.log(a, b);
    setCurrent(a)
    setPageSize(b!)
    dispatch({
      type: 'navs/getList',
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
    <div className={`chat`} style={{ height: 700 }}>
      <div>
        <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
        <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1), setItem(''), setUrl('') }}>添加导航</Button>
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
      {/* 弹出框 */}
      <Modal title={num === 1 ? `添加导航` : `编辑导航`}
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
            label='导航标题'
            name='title'
            className={`mrl-10`}
            initialValue={item && item.title}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Navs
