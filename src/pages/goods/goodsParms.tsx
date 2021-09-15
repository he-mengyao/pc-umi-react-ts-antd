import React, { useEffect, useState } from 'react'
import { Form, Card, Select, Button, Popconfirm, message, Table, Pagination, Image } from 'antd'
import { useDispatch, useSelector } from 'umi'
import AddParms from '@/components/goods/addParms'

const { Option } = Select

const GoodsParms = () => {
  let dispatch = useDispatch()
  // 添加参数显示
  let [visible, setVisible] = useState(false)
  let [n, setN] = useState(1)
  // 商品列表
  let goodsList = useSelector((state: any) => state.goods.goodsList)
  // 参数列表
  let Params = useSelector((state: any) => state.goods.Params)
  // 表格
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(20)
  let [query, setQuery] = useState('')
  let [name, setName] = useState('')
  let [parentId, setParentId] = useState('')
  const columns: any = [{
    title: '#',
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: '图片',
    dataIndex: 'url',
    align: 'center',
    render: (url: any) => (
      <Image src={url} width={50}></Image>
    )
  },
  {
    title: '参数名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '参数描述',
    dataIndex: 'desc',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'index',
    align: 'center',
    key: 'index',
    render: (text: any, record: any) => (
      <div className={`flex ai-c flex-c`}>
        <Button type="primary" className={`mrr-10`} size="small" onClick={() => message.warning('暂不能编辑')}>
          编辑
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
  // 选择商品
  let onchange2 = ((val: any, keys: any) => {
    setParentId(keys.key)
    setName(val)
    dispatch({
      type: 'goods/getParams',
      payload: {
        parentId: keys.key
      }
    })
  })
  // 弹框取消
  let sendVisible = ((val: boolean) => {
    setVisible(val)
  })
  // 弹框确认
  let sendValues = ((val: any) => {
    if (n === 1) {
      dispatch({
        type: 'goods/addParams',
        payload: {
          url: val.url,
          name: val.name,
          desc: val.desc,
          parentId: parentId,
        }
      })
    } else {
      console.log(val);
    }
  })
  let confirm = ((record: any) => {
    console.log(record);
    dispatch({
      type: 'goods/delParams',
      payload: {
        parentId: parentId,
        attrId: record._id,
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  })
  useEffect(() => {
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
    <div>
      <Card>
        <div className={`flex`}>
          <Form>
            <Form.Item rules={[{ required: true, message: '商品不能为空' }]} label="所属商品" name='name' style={{ width: 400 }}>
              <Select placeholder='请选择所属商品' onChange={onchange2}>
                {
                  goodsList.data && goodsList.data.map((item: any) => {
                    return <Option value={item.name} key={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
          <Button className={`mrl-20`} disabled={!name} onClick={() => setVisible(true)}>添加参数</Button>
        </div>
        <div className={`mrtb-20`}>
          <Table columns={columns} dataSource={Params.data && Params.data} rowKey='_id' pagination={false} />
        </div>
      </Card>
      <AddParms visible={visible} n={n} sendVisible={sendVisible} sendValues={sendValues}></AddParms>
    </div>
  )
}

export default GoodsParms
