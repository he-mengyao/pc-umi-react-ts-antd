import React, { useEffect, useState } from 'react'
import { Button, Input } from 'antd';
import emoji from '@/lib/emoji'
import img from '../../static/emoji.png'
import io from 'socket.io-client'
const socket = io('http://localhost:3000')

const Chat = () => {
  let [value, setValue] = useState('')
  let [flag, setFlag] = useState(false)
  let [list, setList] = useState<any[]>([])
  let open = () => {
    setFlag(!flag)
  }
  let click = (item: any) => {
    setValue(value + item)
  }
  let onPressEnter = () => {
    socket.emit('event', {
      username: JSON.parse(localStorage.getItem('user')!).username,
      value: value,
      platform: 'h5'
    })
    setValue('')
    setFlag(false)
  }
  let input = (e: any) => {
    setValue(e.target.value)
  }
  useEffect(() => {
    socket.on('broadcast', (val: any) => {
      list.push(val)
      setList([...list])
    })
  }, [])
  useEffect(() => {
    let length = list.length
    if (length > 0) {
      let dom = document.getElementById(`chatItem-${length - 1}`)
      dom!.scrollIntoView()
    }
    // }
  }, [list])
  return (
    <div className={`pr bg-fff `} style={{ height: 680 }}>
      <div className={`pd-10 chat`}>
        {
          list && list.map((item: any, index: number) => {
            return <div key={index} id={`chatItem-${index}`}>
              {
                item.platform === 'app' ? <div className={`flex flex-l mrtb-10`} ><div className={`text2 c `}>{item.value}</div></div> :
                  <div className={`flex flex-r mrtb-10`}><div className={`text1 c`}>{item.value}</div></div>
              }
            </div>
          })
        }
      </div>
      <div className={`pa bg-fff`} style={{ bottom: 0, left: 0, right: 0 }}>
        <div>
          <Input placeholder="请输入" style={{ width: '90%' }} onInput={(e) => { input(e) }} value={value} />
          <img src={img} alt="" style={{ width: 30, height: 30 }} className={`mrrl-10`} onClick={open} />
          <Button type="primary" onClick={onPressEnter}>发送</Button>
        </div>
        {
          flag ? <div style={{ height: 180 }} className={`bg-fff flex wrap chat`}>
            {
              emoji.map((i: any, index: number) => {
                return <div key={index} className={`f28 mrrl-10`} onClick={() => { click(i) }}>{i}</div>
              })
            }
          </div> : null
        }
      </div>
    </div>
  )
}

export default Chat
