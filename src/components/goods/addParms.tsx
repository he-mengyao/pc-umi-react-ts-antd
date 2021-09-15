import React, { useState } from 'react'
import { Modal, Form, Upload, Image, Input } from 'antd'
interface Props {
  visible: boolean,
  n: number,
  sendVisible: (val: boolean) => void,
  sendValues: (val: any) => void
}

const AddParms = (prop: Props) => {
  let [form] = Form.useForm()
  let [url, setUrl] = useState('')
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 上传图片
  let onChange = (info: any) => {
    if (info.file.status === 'done') {
      setUrl(info.file.response.data)
      form.setFieldsValue({ url: info.file.response.data })
    }
  }
  // 弹框确认
  let onFinish = (() => {
    prop.sendVisible(false)
    let values: any = form.getFieldsValue()
    prop.sendValues(values)
  })
  return (
    <div>
      <Modal title={prop.n === 1 ? '添加参数' : '编辑参数'} visible={prop.visible} okText='确认' cancelText='取消' onOk={() => form.submit()} onCancel={() => { prop.sendVisible(false), setUrl('') }} destroyOnClose>
        <Form form={form} onFinish={onFinish} preserve={false}>
          <Form.Item
            label="图片地址"
            name="url"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: '请上传图片' }]}
          >
            <Upload name="logo" action="http://localhost:7001/admin/upload"
              showUploadList={false} onChange={onChange}
              listType="picture" headers={{ Authorization: localStorage.getItem('token')! }}>
              <span className={`mrl-20 color-blue`}>点击上传图片</span></Upload>
            <div>
              <Image src={url} width={200}></Image>
            </div>
          </Form.Item>
          <Form.Item label="参数名称" rules={[{ required: true, message: '请填写参数名称' }]} name="name"><Input></Input></Form.Item>
          <Form.Item label="参数描述" rules={[{ required: true, message: '请上传参数描述' }]} name="desc"><Input></Input></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddParms
