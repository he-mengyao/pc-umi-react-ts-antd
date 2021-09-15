import React, { useState, useEffect } from 'react'
import { Input, Button, Modal, Form, Table, Popconfirm, Radio, Select, Divider, Card } from 'antd'
import { useDispatch, useSelector, useHistory, useLocation } from 'umi'
import { SearchOutlined, RedoOutlined } from '@ant-design/icons'


const GoodsModel = () => {
  let dispatch = useDispatch()
  let location: any = useLocation().state
  let [initvalue, setInitvalue] = useState<any>(null)
  // 模型数据
  let list = useSelector((state: any) => state.goods.list)
  // 表格数据
  let formData = useSelector((state: any) => state.goods.form)
  let [visible, setVisible] = useState(false)
  let [form] = Form.useForm()
  let [form1] = Form.useForm()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(20)
  // 一行规格
  let [parentId, setparentId] = useState(null)
  let [name, setName] = useState('')
  let [query, setQuery] = useState('')
  let columns: any = [{
    title: '#',
    dataIndex: 'index',
    align: 'center'
  },
  {
    title: '模型名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '所属模型',
    dataIndex: 'model',
    align: 'center'
  },
  {
    title: '展现方式',
    dataIndex: 'mode',
    align: 'center'
  },
  {
    title: '规格项',
    dataIndex: 'spec_item',
    align: 'center'
  },
  {
    title: '操作',
    align: 'center',
    render: (text: any, record: any) => (
      <div className={`flex ai-c flex-c`}>
        <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消" onConfirm={() => confirm(record)}>
          <Button danger>
            删除
          </Button>
        </Popconfirm>
      </div>
    )
  }
  ]
  // 选择类型
  let onGenderChange = ((val: any, i: any) => {
    setparentId(i.key)
    setName(i.children)
  })
  // 点击查询
  let search = (() => {
    dispatch({
      type: 'goods/getSpecs',
      payload: {
        parentId: parentId
      }
    })
  })
  // 点击重置
  let reset = (() => {
    form.resetFields()
    dispatch({
      type: 'goods/empty',
      payload: {
        parentId: parentId
      }
    })
  })
  // 弹框确认
  let onok = () => {
    let values: any = form.getFieldsValue()
    setVisible(false)
    // console.log(values);
    // 添加规格
    dispatch({
      type: 'goods/addSpecs',
      payload: {
        name: values.name,
        model: values.model,
        spec_item: values.spec_item,
        mode: values.mode,
        parentId: parentId
      }
    })
  }
  // 删除
  let confirm = ((i: any) => {
    console.log(i);
    // 获取模型数据
    dispatch({
      type: 'goods/delSpecs',
      payload: {
        parentId: i.parentId,
        attrId: i._id
      }
    })
  })
  useEffect(() => {
    dispatch({
      type: 'goods/getList',
      payload: {
        current: current, pageSize: pageSize, query: query
      }
    })
  }, [])
  // useEffect(() => {
  //   location.val && setInitvalue(location.val._id)
  // }, [location.val])
  return (
    <div>
      {/* 搜索 */}
      <div>
        <Card bordered={false}>
          <Form
            form={form1}
            preserve={false}
          >
            <Form.Item
              label="所属类型"
              name="name"
              rules={[{ required: true }]}
              initialValue={initvalue}
            >
              <Select style={{ width: 300 }} placeholder='请选择所属类型' onChange={onGenderChange} allowClear>
                {
                  list.data && list.data.map((item: any) => {
                    return <Select.Option value={item._id} key={item._id}>{item.name}</Select.Option>
                  })
                }
              </Select>
              <Button type="primary" className={`mrl-10`} onClick={search}
                icon={<SearchOutlined />}
              >查询</Button>
              <Button className={`mrl-10`} icon={<RedoOutlined />} onClick={reset}>重置</Button>
            </Form.Item>
          </Form>
          <Divider plain></Divider>
          <Button disabled={!name} onClick={() => { setVisible(true) }}>添加规格</Button>
        </Card>
      </div>
      {/* 表格 */}
      <div style={{ marginTop: 20 }}>
        <Card bordered={false}>
          <Table columns={columns} dataSource={formData && formData.data} rowKey='index' pagination={false} />
        </Card>
      </div>
      {/* 弹框 */}
      <Modal title='新增规格'
        visible={visible}
        onOk={() => form.submit()}
        onCancel={() => { setVisible(false) }}
        okText="确认"
        destroyOnClose={true}
        cancelText="取消">
        <Form
          form={form}
          onFinish={onok}
          preserve={false}
        >
          <Form.Item
            label="规格名称"
            name="name"
            rules={[{ required: true, message: '规格名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="所属类型"
            name="model"
            rules={[{ required: true }]}
            initialValue={name && name}
          >
            <Select placeholder='请选择所属类型' onChange={onGenderChange}>
              {
                list.data && list.data.map((item: any) => {
                  return <Select.Option value={item.name} key={item._id}>{item.name}</Select.Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item name={['spec_item']} label="规格项" style={{ marginLeft: 24 }}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="mode" label="展示方式" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="文字">文字</Radio>
              <Radio value="图片">图片</Radio>
              <Radio value="颜色">颜色</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}

export default GoodsModel
