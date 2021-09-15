import React, { useEffect, useState } from 'react'
import { Modal, Image } from 'antd';

interface Props {
  item: any,
  visible: boolean,
  data: any,
  sendVisible1: (val: boolean) => void
}
const GoodsDetail = (prop: Props) => {
  // 取消
  let handleCancel = (() => {
    prop.sendVisible1(false)
  })
  let [name, setName] = useState('')
  useEffect(() => {
    let arr: string[] = []
    prop.data && prop.data.map((i: any) => {
      i.children.map((q: any) => {
        if (q.value === (prop.item && prop.item.category)) {
          arr = [i.label, q.label]
        }
      })
    })
    setName(arr.join('/'))
  }, [])
  return (
    <div>
      <Modal title="商品详情" onOk={handleCancel} onCancel={handleCancel} visible={prop.visible}
        okText='确定' cancelText="取消"
      >
        <div>
          <div>商品名称：{prop.item && prop.item.name}</div>
          <div>所属分类：{name && name}</div>
          <div>商品原价：{prop.item && prop.item.originalPrice}</div>
          <div>商品现价：{prop.item && prop.item.presentPrice}</div>
          <div>商品库存：{prop.item && prop.item.stock}</div>
          <div>商品简介：{prop.item && prop.item.introduction}</div>
          <div>推荐介绍：{prop.item && prop.item.sellDesc}</div>
          <div>是否新品：{prop.item && prop.item.isNewGood ? '是' : '否'}</div>
          <div>是否推荐：{prop.item && prop.item.isRecommend ? '是' : '否'}</div>
          <div>是否热销：{prop.item && prop.item.isHot ? '是' : '否'}</div>
          {/* <div>商品规格：{prop.item && prop.item.spec}</div> */}
          <div className={`flex `}>商品详情：<span dangerouslySetInnerHTML={{ __html: prop.item && prop.item.detail }}></span></div>
          <div className={`flex`}>
            <div>商品封面图：</div>
            <Image
              width={50}
              src={prop.item && prop.item.cover}
            />
          </div>
          <div className={`flex`}>
            <div style={{ width: 80 }}>商品图片：</div>
            {
              prop.item && prop.item.pic.map((i: any, index: number) => {
                return (
                  <div key={index} style={{ marginTop: 20, marginRight: 10 }}>
                    <Image
                      width={50}
                      src={i}
                    />
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GoodsDetail
