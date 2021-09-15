import { Form, Button, } from 'antd'
import { useEffect, useState } from 'react'
import E from 'wangeditor'


interface Props {
  n: number,
  // 分类
  categ?: any,
  sendDel: (val: number) => void,
  sendValues: (val: any, val1: number) => void
}

const Goods1 = (prop: Props) => {
  let [form] = Form.useForm()
  let [text, setText] = useState<any>()
  // 确认
  let onFinish = (() => {
    let values: any = form.getFieldsValue()
    prop.sendValues(values, 5)
  })
  let [editor, setEditor] = useState<any>()
  useEffect(() => {
    if (!editor) {
      let editor1: any = new E(document.getElementById("div1"));
      editor1.create();
      setEditor(editor)
      // 配置 onchange 回调函数
      editor1.config.onchange = function (newHtml: any) {
        // console.log(newHtml);
        text = newHtml
        setText(text)
        form.setFieldsValue({ detail: newHtml })
      };
    }
  }, [])
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <div>
          <Form.Item rules={[{ required: true, message: '商品详情不能为空' }]} label="商品详情" name="detail"
            initialValue={text}
          >
            <div id="div1">
            </div>
          </Form.Item>
        </div>
        {/* 确认和取消 */}
        <Form.Item className={`mrtb-20`}>
          <Button onClick={() => prop.sendDel(4)}>取消</Button>
          <Button type='primary' className={`mrl-20`} htmlType="submit">确认</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Goods1
