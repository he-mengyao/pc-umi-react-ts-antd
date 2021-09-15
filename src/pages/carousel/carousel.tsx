import React, { useEffect, useState } from 'react'
import { Card, Switch, Button, Popconfirm, Input, Table, Pagination, Form, Modal, Image, Upload } from 'antd';
import { useSelector, useDispatch } from 'umi'

const { Search } = Input


const Carousel = () => {
  let CarouselList = useSelector((state: any) => state.carousel.CarouselList)
  let formData = useSelector((state: any) => state.carousel.formData)
  const columns: any = [
    {
      title: '#',
      dataIndex: 'index',
      align: 'center',
    }, {
      title: '图片',
      dataIndex: 'url',
      align: 'center',
      render: (url: any) => (
        <img src={url} alt="" width='120' height='60' />)
    },
    {
      title: '路径',
      dataIndex: 'url',
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '链接',
      dataIndex: 'link',
      align: 'center',
      ellipsis: true
    }, {
      title: '是否显示',
      dataIndex: 'index',
      align: 'center',
      render: (text: any, record: any) => (
        <Switch defaultChecked={record.isShow} onChange={(e) => { onChange(e, record) }} />
      )
    },
    {
      title: '操作',
      dataIndex: 'index',
      align: 'center',
      key: 'index',
      render: (text: any, record: any) => (
        <div className={`flex ai-c`}>
          <Button type="primary" className={`mrr-10`} onClick={() => { click(record) }}>
            编辑
          </Button>
          <Popconfirm title="确认删除吗？" okText="确定" cancelText="取消" onConfirm={() => confirm(record)}>
            <Button danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    },
  ]
  let dispatch = useDispatch()
  let [current, setCurrent] = useState(1)
  let [pageSize, setPageSize] = useState(5)
  let [query, setQuery] = useState('')
  let [num, setNum] = useState(0)
  let [form] = Form.useForm()
  let [url, setUrl] = useState('')
  // 编辑数据
  let [item, setItem] = useState<any>()
  // 添加弹出层显示
  let [visible, setVisible] = useState(false)
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  // 获取列表
  let getData = () => {
    dispatch({
      type: 'carousel/getformData',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query
      }
    })
  }
  // 添加确认
  let onok = (val: any) => {
    setVisible(false)
    let values: any = form.getFieldsValue()
    if (num === 1) {
      // 添加
      dispatch({
        type: 'carousel/getCarouselList',
        payload: {
          url: values.url,
          title: values.title,
          link: values.link,
          current: current,
          pageSize: pageSize,
          query: query

        }
      })
    } else if (num === 2) {
      //  编辑
      dispatch({
        type: 'carousel/updateCarouse',
        payload: {
          id: item._id,
          url: values.url,
          title: values.title,
          link: values.link,
          current: current,
          pageSize: pageSize,
          query: query
        }
      })
    }
    setUrl('')
  }
  // 切换显示
  let onChange = (e: boolean, i: any) => {
    // console.log(e);
    dispatch({
      type: 'carousel/showBanners',
      payload: {
        id: i._id,
        isShow: e
      }
    })
  }
  // 上传图片
  let onChangep = (info: any) => {
    if (info.file.status === 'done') {
      form.setFieldsValue({ url: info.file.response.data })
      setUrl(info.file.response.data)
      console.log(info.file.response.data);
    }
  }
  // 点击编辑
  let click = (e: any) => {
    // console.log(e);
    setVisible(true)
    setItem(e)
    setNum(2)
    setUrl(e.url)
    form.setFieldsValue({ url: e.url })
  }
  // 确认删除
  let confirm = (e: any) => {
    // console.log(e);
    dispatch({
      type: 'carousel/delCarousel',
      payload: {
        current: current,
        pageSize: pageSize,
        query: query,
        id: e._id,
      }
    })
  }
  // 搜索
  let onSearch = (e: any) => {
    dispatch({
      type: 'carousel/getformData',
      payload: {
        current: current,
        pageSize: pageSize,
        query: e
      }
    })
  }
  // 点击分页
  let onChanges = ((a: any, b?: number) => {
    // console.log(val);
    setCurrent(a!)
    setPageSize(b!)
    dispatch({
      type: 'carousel/getformData',
      payload: {
        current: a,
        pageSize: b,
        query: query
      }
    })
  })
  useEffect(() => {
    getData()
  }, [])
  return (
    <div className={`chat`}>
      <Card>
        {/* 搜索 */}
        <div>
          <Search placeholder="请输入" onSearch={onSearch} style={{ width: 300 }} />
          <Button type="primary" className={`mrl-20`} onClick={() => { setVisible(true), setNum(1), setItem(''), form.resetFields() }}>添加轮播图</Button>
        </div>
        {/* 表格 */}
        <div className={`mrtb-10`}>
          <Table columns={columns} dataSource={formData.data} rowKey='_id' pagination={false} />
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Pagination current={current} total={formData ? formData.total : 0} onChange={onChanges} showSizeChanger pageSizeOptions={['5', '10', '15', '20']} pageSize={pageSize} showTotal={total => `共 ${formData ? formData.total : 0} 条`} />
          </div>
        </div>
        {/* 添加弹出层*/}
        <Modal title={num === 1 ? `添加轮播图` : `编辑轮播图`}
          visible={visible}
          onOk={() => form.submit()}
          onCancel={() => { setVisible(false) }}
          okText="确认"
          destroyOnClose={true}
          cancelText="取消">
          <Form
            form={form}
            onFinish={onok}
            preserve={false}
          >
            <Form.Item
              label="图片地址"
              name="url"
              getValueFromEvent={normFile}
              rules={[{ required: true, message: '请上传图片' }]}
            >
              <Upload action="http://localhost:7001/admin/upload"
                showUploadList={false} onChange={onChangep}
                listType="picture" headers={{ Authorization: localStorage.getItem('token')! }}>
                <span className={`mrl-20 color-blue`}>点击上传图片</span></Upload>
              <div>
                <Image src={url} width={200}></Image>
              </div>
            </Form.Item>
            <Form.Item
              label="轮播图标题"
              name='title'
              initialValue={item ? item.title : ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="图片链接"
              name='link'
              style={{ marginLeft: 13 }}
              initialValue={item ? item.link : ""}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  )
}

export default Carousel
