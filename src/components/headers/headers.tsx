import React, { useState } from 'react'
import avator from '../../static/avator.png'
import a from '../../static/a.png'
import { Dropdown, Menu, Modal, Button } from 'antd';
import { useHistory, setLocale } from 'umi'

const Headers = () => {
  let user = JSON.parse(localStorage.getItem('user')!)
  let [visible, setVisible] = useState(false)
  // 点击退出
  let history = useHistory()
  let handleOk = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    history.push('/login')
  }
  // 切换中英文
  let onclick = ((val: number) => {
    if (val === 1) {
      setLocale('en-US', true);
    } else if (val === 2) {
      setLocale('zh-CN', true);
    } else {
      setLocale('zh-TW', true);
    }
  })
  let menu1 = (
    <Menu>
      <Menu.Item onClick={() => onclick(1)} key="1">
        转英文
      </Menu.Item>
      <Menu.Item onClick={() => onclick(2)} key="2">
        转中文
      </Menu.Item>
      <Menu.Item onClick={() => onclick(3)} key="3">
        转繁体
      </Menu.Item>
    </Menu>
  )
  let menu = (
    <Menu>
      <Menu.Item onClick={() => setVisible(true)} key="1">
        退出登录
      </Menu.Item>
    </Menu>
  )
  return (
    <div className={`flex ai-c`}>
      <iframe width="235" height="18" frameBorder="0" scrolling="no" src="https://i.tianqi.com/?c=code&id=10"></iframe>
      <Dropdown overlay={menu}>
        <div style={{ marginTop: 5 }} className={`flex ai-c`}>
          <img src={avator} alt="" className={`img-20 mrr-10`} />
          <div className={`color-a0a0`}>{user.username}</div>
        </div>
      </Dropdown>
      <Dropdown overlay={menu1}>
        <img src={a} alt="" style={{ width: 30, marginLeft: 20 }} />
      </Dropdown>
      {/* 弹框提示 */}
      <Modal title="提示" visible={visible} onOk={handleOk} onCancel={() => setVisible(false)}
        okText="确认"
        cancelText="取消"
      >
        <p>确认退出登陆吗？</p>
      </Modal>
    </div>
  )
}

export default Headers
