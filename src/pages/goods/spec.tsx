import React, { useEffect, useState } from 'react'
import { Form, Card, Select, Button, Popconfirm, message, Table, Pagination, Image } from 'antd'
import { useDispatch, useSelector } from 'umi'
import E from 'wangeditor'
import api from '@/http/api'

const { Option } = Select

const Spec = () => {
  let dispatch = useDispatch()
  let [editor, setEditor] = useState<any>()
  // 商品列表
  let goodsList = useSelector((state: any) => state.goods.goodsList)
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(20)
  let [query, setQuery] = useState('')
  let [parentId, setParentId] = useState('')
  let [text, setText] = useState<any>()
  let [form] = Form.useForm()
  // 选择商品
  let onchange2 = ((val: any, keys: any) => {
    setParentId(keys.key)
    api.getSpecParams({ parentId: keys.key }).then((res: any) => {
      // console.log(res);
      editor.txt.html(res.data)
    }).catch((err: any) => {
      console.log(err);
    })
  })
  // 点击确定
  let onFinish = (() => {
    if (parentId && text) {
      dispatch({
        type: 'goods/addSpecParams',
        payload: {
          parentId: parentId,
          specParams: text
        }
      })
    }
    editor.txt.html('')
    form.resetFields()
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
    if (!editor) {
      let editor1: any = new E(document.getElementById("div1"));
      editor1.create();
      setEditor(editor1)
      // 配置 onchange 回调函数
      editor1.config.onchange = function (newHtml: any) {
        // console.log(newHtml);
        setText(newHtml)
      };
    }
  }, [])
  return (
    <div>
      <Card>
        {/* 下拉框 */}
        <div className={`flex col`}>
          <Form form={form} style={{ zIndex: 99999 }} onFinish={onFinish} preserve={false}>
            <Form.Item rules={[{ required: true, message: '商品不能为空' }]} label="所属商品" name='name'>
              <Select placeholder='请选择所属商品' onChange={onchange2}>
                {
                  goodsList.data && goodsList.data.map((item: any) => {
                    return <Option value={item.name} key={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
          {/* 编辑器 */}
          <div id="div1" style={{ zIndex: 1 }}></div>
          {/* 按钮 */}
          <div className={`flex flex-r mrtb-20`}><Button type="primary" onClick={() => form.submit()}>确认</Button></div>
        </div>
      </Card>
    </div>
  )
}

export default Spec
