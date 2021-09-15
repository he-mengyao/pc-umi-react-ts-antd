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
  let [list, setList] = useState<any>()
  let [checkSpec, setCheckSpec] = useState([''])
  let [form] = Form.useForm()
  // 选择商品模型
  let onchange2 = ((val: any) => {
    // console.log(val);
    setList(prop.list.find((item: any) => {
      return item.name === val
    }));
  })
  // 全选
  const onCheckAllChange = (e: any, item: any) => {
    if (e.target.checked) {
      item.checkList = [...item.spec_item1]
      setCheckSpec([...item.checkList, item.name, ...checkSpec])
    } else {
      let arr: string[] = []
      item.checkList = []
      arr = checkSpec.filter((i: any) => {
        return !item.spec_item1.some((q: any) => q === i)
      })
      setCheckSpec(arr)
    }
  };
  // 单选
  let onCheckChange = ((e: any, val: any, item1: any) => {
    if (e.target.checked) {
      // 选中
      item1.checkList = [...item1.checkList, val]
      setCheckSpec([...checkSpec, val])
    } else {
      // 未选中
      item1.checkList = item1.checkList!.filter((i: any) => i !== val)
      let arr1: string[] = []
      arr1 = checkSpec.filter((i: any) => i !== val)
      setCheckSpec(arr1)
    }
  })
  // 确认
  let onFinish = (() => {
    let spec = list && list.specifications.filter((i: any) => {
      return i.checkList.length > 0
    })
    prop.sendValues(spec, prop.n)
  })
  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <div>
          <Form.Item rules={[{ required: true, message: '商品模型不能为空' }]} label="商品模型" name='model' style={{ width: 400 }}>
            <Select placeholder='请选择商品模型' onChange={onchange2}>
              {
                prop.list && prop.list.map((item: any) => {
                  return <Option value={item.name} key={item._id}>{item.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item label="商品规格" style={{ marginLeft: 10 }}>
            {
              list && list.specifications.map((item1: any) => {
                return <div key={item1._id}>
                  <div>
                    {/* 全选 */}
                    <Checkbox onChange={(e) => onCheckAllChange(e, item1)} checked={item1.checkList!.length === item1.spec_item1.length}>
                      {item1.name}
                    </Checkbox>
                    {/* 单项 */}
                    <div className={`mrtb-20`}>
                      {
                        item1.spec_item && item1.spec_item.split('\n').map((i: any, index: any) => {
                          return (
                            <span key={index}>
                              <Checkbox onChange={(e) => onCheckChange(e, i, item1)} checked={item1.checkList!.includes(i)}>
                                {i}
                              </Checkbox>
                            </span>
                          )
                        })
                      }
                    </div>
                  </div>
                  <Divider orientation="right" plain>
                  </Divider>
                </div>
              })
            }
          </Form.Item>
        </div>
        {/* 确认和取消 */}
        <Form.Item>
          <Button onClick={() => prop.sendDel(3)}>取消</Button>
          <Button type='primary' className={`mrl-20`} htmlType="submit">确认</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Goods1
