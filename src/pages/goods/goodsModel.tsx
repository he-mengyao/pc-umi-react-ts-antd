import React, { useState, useEffect } from 'react'
import { Input, Button, Modal, Form, Table, Popconfirm, Pagination } from 'antd'
import { useDispatch, useSelector, useHistory } from 'umi'

const { Search } = Input;

const GoodsModel = () => {
  let dispatch = useDispatch()
  let history = useHistory()
  let formData = useSelector((state: any) => state.goods.list)
  let [visible, setVisible] = useState(false)
  let [num, setNum] = useState(0)
  let [form] = Form.useForm()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [item, setItem] = useState<any>()
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
    title: '操作',
    align: 'center',
    render: (text: any, record: any) => (
      <div className={`flex ai-c flex-c`}>
        <Button type="primary" className={`mrr-10`} onClick={() => { click(record, 1) }}>
          编辑
        </Button>
        <Button type="primary" className={`mrr-10`} onClick={() => { click(record, 2) }}>
          添加规格
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
  let onSearch = ((val: any) => {
    console.log(val);
  })
  // 弹框确认
  let onok = () => {
    let values: any = form.getFieldsValue()
    if (num === 1) {
      dispatch({
        type: 'goods/addModels',
        payload: {
          name: values.name
        }
      })
    } else {
      dispatch({
        type: 'goods/updateModels',
        payload: {
          name: values.name,
          id: item._id
        }
      })
    }
    setVisible(false)
  }
  // 点击编辑和规格
  let click = ((i: any, n: number) => {
    if (n === 1) {
      setVisible(true)
      setItem(i)
    } else {
      history.push('/goodsSpec', { val: i })
    }
  })
  // 删除
  let confirm = ((i: any) => {
    // console.log(i);
    dispatch({
      type: 'goods/delModels',
      payload: i._id
    })
  })
  // 点击分页
  let onChange = ((c: number, p?: number) => {
    dispatch({
      type: 'goods/getList',
      payload: {
        current: c, pageSize: p, query: query
      }
    })
    setCurrent(c)
    setPageSize(p!)
  })
  useEffect(() => {
    dispatch({
      type: 'goods/getList',
      payload: {
        current: current, pageSize: pageSize, query: query
      }
    })
  }, [])
  return (
    <div>
      {/* 搜索 */}
      <div>
        <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
        <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1), setItem('') }}>添加模型</Button>
      </div>
      {/* 表格 */}
      <div style={{ marginTop: 20 }}>
        <Table columns={columns} dataSource={formData.data} rowKey='_id' pagination={false} />
      </div>
      {/* 分页 */}
      <div style={{ marginTop: 20, textAlign: 'right' }}>
        <Pagination current={current} total={formData && formData.total} showSizeChanger
          showTotal={total => `共 ${formData && formData.total} 条`}
          pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
          onChange={onChange}
        />
      </div>
      {/* 弹框 */}
      <Modal title={num === 1 ? `添加模型` : `编辑模型`}
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
            label="模型名称"
            name="name"
            rules={[{ required: true, message: '模型名称不能为空' }]}
            initialValue={item && item.name}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}

export default GoodsModel
