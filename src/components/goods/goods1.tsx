import { Form, Input, Divider, Upload, Switch, Button, Select, Checkbox, Cascader, Modal } from 'antd'
import { useEffect, useState } from 'react'

const { Option } = Select

interface Props {
  n: number,
  // 获取模型数据
  list: any,
  // 分类
  categ?: any,
  sendDel: (val: number) => void,
  sendValues: (val: any, val1: number) => void
}

const Goods1 = (prop: Props) => {
  let [visible, setVisible] = useState(false)
  let [previewTitle, setPreviewTitle] = useState('')
  let [form] = Form.useForm()
  // 上传封面图
  let [src, setSrc] = useState('')
  const props = {
    name: 'file',
    action: 'http://localhost:7001/admin/upload',
    headers: {
      authorization: localStorage.getItem('token')!,
    },
  }
  // 图片预览
  let onPreview = ((info: any) => {
    // console.log(info);
    setSrc(info.response.data)
    setPreviewTitle(info.name)
  })
  // 确认
  let onFinish = (() => {
    let values: any = form.getFieldsValue()
    prop.sendValues(values, prop.n)
  })
  return (
    <div>
      <Form form={form} onFinish={onFinish} >
        <div>
          <Form.Item rules={[{ required: true, message: '商品名称不能为空' }]} label="商品名称" name='name'><Input placeholder='请输入商品名称' /></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品分类不能为空' }]} label="商品分类" name='category'>
            <Cascader
              options={prop.categ && prop.categ}
              placeholder="请选择分类"
            />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '商品原价不能为空' }]} label="商品原价" name='originalPrice'><Input placeholder='请输入商品原价' type='number' min='1' /></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品现价不能为空' }]} label="商品现价" name='presentPrice'><Input placeholder='请输入商品现价' type='number' min='1' /></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品封面图不能为空' }]} label="封面图" name='cover' style={{ marginLeft: 13 }}
            valuePropName="cover"
          >
            <Upload {...props} onPreview={(e) => { setVisible(true), onPreview(e) }} listType='picture-card'
            ><a style={{ marginTop: 10 }}>点击上传图片</a> </Upload>
          </Form.Item>
          {/* <Form.Item> <Image src='' /></Form.Item> */}
          <Form.Item rules={[{ required: true, message: '商品单位不能为空' }]} label="商品单位" name='company'><Input placeholder='请输入商品单位' /></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品库存不能为空' }]} label="商品库存" name='stock'><Input placeholder='请输入商品库存' type='number' min='1' /></Form.Item>
          <Form.Item rules={[{ required: true, message: '商品简介不能为空' }]} label="商品简介" name='introduction'>
            <Input.TextArea placeholder='请输入商品简介' />
          </Form.Item>
          <Form.Item rules={[{ required: true, message: '推荐介绍不能为空' }]} label="推荐介绍" name='sellDesc'>
            <Input.TextArea placeholder='请输入推荐介绍' style={{ height: 80 }} />
          </Form.Item>
          <Form.Item label="是否新品" name='isNewGood' style={{ marginLeft: 12 }} valuePropName="checked" initialValue>
            <Switch defaultChecked  ></Switch>
          </Form.Item>
          <Form.Item label="是否热销" name='isHot' style={{ marginLeft: 12 }} valuePropName="checked" initialValue>
            <Switch defaultChecked ></Switch>
          </Form.Item>
          <Form.Item label="是否推荐" name='isRecommend' style={{ marginLeft: 12 }} valuePropName="checked" initialValue>
            <Switch defaultChecked ></Switch>
          </Form.Item>
        </div>
        {/* 确认和取消 */}
        <Form.Item>
          <Button onClick={() => prop.sendDel(1)}>取消</Button>
          <Button type='primary' className={`mrl-20`} htmlType="submit">确认</Button>
        </Form.Item>
      </Form>
      {/* 图片预览 */}
      <Modal
        visible={visible}
        title={previewTitle}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={src} />
      </Modal>
    </div>
  )
}

export default Goods1
