import { Form, Input, Divider, Upload, Switch, Button, Select, Checkbox, Cascader, Modal } from 'antd'
import { useEffect, useState } from 'react'

const { Option } = Select

interface Props {
  n: number,
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
  // 上传商品图片
  const props1 = {
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
      <Form form={form} onFinish={onFinish}>
        <div>
          <Form.Item rules={[{ required: true, message: '商品图片不能为空' }]} label="商品图片" name='pic'
            valuePropName="pic"
          >
            <Upload {...props1} listType="picture-card" onPreview={(e) => { setVisible(true), onPreview(e) }} multiple
            >点击上传图片 </Upload>
          </Form.Item>
          <Form.Item label="商品视频" style={{ marginLeft: 13 }}>
          </Form.Item>
        </div>
        {/* 确认和取消 */}
        <Form.Item>
          <Button onClick={() => prop.sendDel(2)}>取消</Button>
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
