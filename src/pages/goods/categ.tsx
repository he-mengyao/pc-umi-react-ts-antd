import React, { useEffect, useState } from 'react'
import { Input, Tree, Modal, Form, Table, Popconfirm, Radio, Select, Divider, Card } from 'antd'
import { useDispatch, useSelector } from 'umi'
import styles from '../../base.less'
const { Search } = Input
const { DirectoryTree } = Tree;

const Categ = () => {
  let dispatch = useDispatch()
  let categ = (useSelector((state: any) => state.goods.categData))
  let [form] = Form.useForm()
  let [query, setQuery] = useState('')
  // 判断是否点了新增
  let [n, setN] = useState(0)
  // 新增分类确认
  let confirm = (() => {
    let values: any = form.getFieldsValue()
    if (values.category) {
      dispatch({
        type: 'goods/addSecondCategorys',
        payload: {
          name: values.name,
          parentId: values.category,
          isShow: true,
        }
      })
    } else {
      dispatch({
        type: 'goods/addCategorys',
        payload: {
          name: values.name,
          short_name: values.short_name,
          isShow: true,
        }
      })
    }
    form.resetFields()
  })
  // 选择上级分类
  let onGenderChange = ((a: any, b: any) => {
    // console.log(b);
  })
  // 获取分类数据
  let getCate = () => {
    dispatch({
      type: 'goods/getCategorys',
      payload: query
    })
  }
  let [id, setId] = useState('')
  // 搜索
  let onSearch = ((val: any) => {
    dispatch({
      type: 'goods/getCategorys',
      payload: val.nativeEvent.data ? val.nativeEvent.data : ''
    })
  })
  // 点击树形数据
  let onSelect = ((key: any, info: any) => {
    setId(key)
  })
  // 点击新增
  let add = (i: any) => {
    form.setFieldsValue({ category: i })
  }
  // 点击删除
  let del = ((ids: any) => {
    // console.log(ids);
    dispatch({
      type: 'goods/delCategorys',
      payload: {
        id: ids
      }
    })
  })
  useEffect(() => {
    getCate()
  }, [])
  return (
    <div className={`chat`} style={{ height: 700 }}>
      <Card>
        <div className={`flex flex-b mrtb-10`}>
          {/* 左边 */}
          <div>
            <Search style={{ marginBottom: 8, width: 400 }} placeholder="请输入分类名称" onChange={onSearch} />
            <DirectoryTree
              multiple
              defaultExpandAll
              onSelect={onSelect}
              treeData={categ.data && categ.data}
              titleRender={(item: any) => {
                return <div style={{ display: 'flex pr', zIndex: 9999, width: 400 }} className={`${styles.h}`}>
                  <div>{item.title}</div>
                  <div className={`flex pa ${item.key === id ? '' : 'none'} ${styles.right}`} style={{ right: "0", top: '0' }}>
                    {
                      item.isLeaf ? null : <span onClick={(e) => { add(item.key), e.stopPropagation() }}>新增</span>
                    }
                    &nbsp;
                    <span onClick={(e) => { e.stopPropagation(), setN(1) }}>禁用</span>&nbsp;
                    {
                      item.isLeaf ? null : <span onClick={(e) => { e.stopPropagation(), del(item.key) }}>删除</span>
                    }
                  </div>
                </div>
              }}
            />
          </div>
          {/* 右边 */}
          <div className={`border`}>
            <Card title="新增分类" extra={<a href="#" onClick={() => form.submit()}>确认</a>} style={{ width: 500 }}>
              <Form onFinish={confirm} form={form}>
                <Form.Item label="分类名称" required={true} name="name" ><Input placeholder="请输入分类名称"></Input></Form.Item>
                <Form.Item label="上级分类" style={{ marginLeft: 10 }} name="category"
                >
                  <Select style={{ width: "100%" }} placeholder='请选择上级分类' onChange={onGenderChange} allowClear>
                    {
                      categ.data && categ.data.map((item: any) => {
                        return <Select.Option value={item.key} key={item.key}>{item.title}</Select.Option>
                      })
                    }
                  </Select>
                </Form.Item>
                <Form.Item label="分类别名" style={{ marginLeft: 10 }} name="short_name"><Input placeholder="请输入分类别名"></Input></Form.Item>
              </Form>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Categ
