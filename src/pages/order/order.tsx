import React, { useEffect, useState } from 'react'
import { Card, Table, Pagination } from 'antd'
import api from '@/http/api'
import dayjs from 'dayjs'

const Order = () => {
  let [list, setList] = useState<any>([])
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [total, setTotal] = useState()
  const columns: any = [
    {
      title: '用户名称',
      dataIndex: 'user_id',
      align: 'center',
    },
    {
      title: '订单日期',
      dataIndex: 'pay_time',
      align: 'center',
      render: (pay_time: string) => {
        return <div>{dayjs(Number(pay_time)).format('YYYY-MM-DD HH:mm:ss')}</div>
      }
    },
    {
      title: '商品数量',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '订单价格',
      dataIndex: 'price',
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'goods_list',
      align: 'center',
      render: (text: any, recode: any) => {
        return (
          <div>
            {
              recode.goods_list.map((i: any, index: number) => {
                return <div key={index}>{i.goods.name}</div>
              })
            }
          </div>
        )
      }
    },
    {
      title: '订单地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
  ];
  // 点击分页
  let onChange5 = ((a: number, b?: number) => {
    // console.log(val);
    console.log(a, b);
    setCurrent(a)
    setPageSize(b!)
    let arr = list
    arr = arr.slice(a - 1, a - 1 + b!)
    setList(arr)
  })
  useEffect(() => {
    api.getOrder().then((res: any) => {
      if (res.code === 200) {
        setList(res.data)
        setTotal(res.total)
        // console.log(res.data);
      }
    }).catch((err: any) => {
      console.log('订单请求失败');
    })
  }, [])
  return (
    <div className={`chat`} style={{ height: 700 }}>
      <Card style={{ width: '100%' }}>
        <Table dataSource={list.length && list} columns={columns} rowKey='_id' pagination={false} />
        {/* 分页 */}
        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Pagination current={current} total={total} showSizeChanger
            showTotal={total => `共 ${total} 条`}
            pageSize={pageSize} pageSizeOptions={['5', '10', '15', '20']}
            onChange={onChange5}
          />
        </div>
      </Card>
    </div>
  )
}

export default Order
