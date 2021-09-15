import React from 'react'
import { Input, Form, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'umi'

const Login = () => {
  let user = useSelector((state: any) => state.login.user)
  let dispatch = useDispatch()
  let onFinish = (e: any) => {
    dispatch({
      type: 'login/getuser',
      payload: e
    })
  }
  return (
    <div className={`box`}>
      <div className={`flex col ai-c color-a0a0`}>
        <div className={`f24 fw cb`}>小米Lite</div>
        <br />
        <div>欢迎来到小米lite后台管理系统</div>
        <br />
        <div>{user.username}</div>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} style={{ width: 400 }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '用户密码不能为空' }]}
          >
            <Input.Password placeholder="请输入密码" prefix={< LockOutlined />} style={{ width: 400 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ width: 400 }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
