import { Card } from 'antd';
import { useEffect, useRef, useState } from 'react';
import api from '@/http/api'
import * as echarts from 'echarts';
import dayjs from 'dayjs'

export default function IndexPage() {
  let btns = ['订单总数', '商品总数', '用户总数']
  let [sum1, setSum1] = useState(0)
  let [sum2, setSum2] = useState(0)
  let [sum3, setSum3] = useState(0)
  var box1 = useRef(null);
  var box2 = useRef(null);
  var box3 = useRef(null);
  // // 图1x轴
  let [a, setA] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  let [b, setB] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  // // 图1y轴
  let [list11, setList11] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
  useEffect(() => {
    var myChart1 = echarts.init(box1.current!);
    var myChart2 = echarts.init(box2.current!);
    var myChart3 = echarts.init(box3.current!);
    var option1;
    var option2;
    var option3;
    api.getIndex().then((res: any) => {
      console.log(res);
      if (res.code === 200) {
        setSum1(res.data.orderCount)
        setSum2(res.data.goodsCount)
        setSum3(res.data.userCount)
      }
    }).catch(() => {
      console.log('首页数据请求失败');
    })
    // 折线图
    // 获取订单
    api.getOrder().then((res: any) => {
      // console.log(res.data);
      res.data.map((i: any) => {
        let time = dayjs(dayjs().format('YYYY-MM-DD ') + '0:00:00').valueOf()
        let endtime = dayjs(dayjs().format('YYYY-MM-DD ') + '23:59:59').valueOf()
        if (i.pay_time >= time && i.pay_time <= endtime) {
          i.pay_time = dayjs(Number(i.pay_time)).hour()
          a[i.pay_time] += Number(i.price)
          b[i.pay_time] += 1
        }
      })
      option1 = {
        title: {
          text: '今日订单'
        },
        legend: {
          data: ['订单量合集']
        },
        xAxis: {
          type: 'category',
          data: list11
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '订单量合集',
          type: 'line',
          stack: '总量',
          data: b
        },]
      }
      option2 = {
        color: ['#f9df80'],
        title: {
          text: '今日销售额'
        },
        legend: {
          data: ['销售额合计']
        },
        xAxis: {
          type: 'category',
          data: list11
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '销售额合计',
          type: 'line',
          stack: '总量',
          data: a
        },]
      }
      option1 && myChart1.setOption(option1);
      option2 && myChart2.setOption(option2);
    }).catch(() => {
      console.log('订单请求失败');
    })
    // 获取分类
    api.getCategory('').then((res: any) => {
      // console.log(res)
      let arr: any = []
      res.data.map((i: any) => {
        arr.push({
          name: i.name,
          value: i.list.length
        })
      })
      option3 = {
        title: {
          text: '商品分类',
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '12%',
          orient: 'vertical',
          left: 'left',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: arr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option3 && myChart3.setOption(option3);
    }).catch((err: any) => {
      console.log('首页分类请求失败')
    })
  }, [])
  return (
    <div className={`chat`} style={{ height: 700 }}>
      <div className={`bg-fff pd-20`}>
        {/* 顶部 */}
        <div className={`flex flex-b f18`}>
          {
            btns.map((i: any, s: number) => {
              return <div key={s} className={`cw btn flex-1 ${s === 0 ? 'btn1' : ''} ${s === 1 ? 'btn2' : ''} ${s === 2 ? 'btn3' : ''}`}>
                <div className={`fw`}>{s === 0 ? sum1 : (s === 1 ? sum2 : sum3)}</div>
                <div>{i}</div>
              </div>
            })
          }
        </div>
        {/* 折线图 */}
        <div className={`flex`} style={{ marginTop: 40 }}>
          <div style={{ width: '40%', height: 300, marginRight: 100 }} ref={box1}>
          </div>
          <div style={{ width: '40%', height: 300 }} ref={box2}>
          </div>
        </div>
        {/* 饼图 */}
        <div style={{ width: '80%', height: 500 }} ref={box3}></div>
      </div>
    </div>
  );
}
