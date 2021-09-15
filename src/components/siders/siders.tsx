import React, { useEffect, useState } from 'react'
import { Menu } from 'antd'
import { useHistory, useIntl } from 'umi'
import { useLocation } from 'react-router'

import {
  BankOutlined,
  IdcardOutlined,
  BarsOutlined,
  ContactsOutlined,
  UserOutlined,
  TableOutlined,
  HistoryOutlined,
  AccountBookOutlined,
  NotificationOutlined,
  MessageOutlined,
  FileAddOutlined,
  MenuOutlined,
  FileOutlined,
  ApartmentOutlined,
  AppstoreOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

interface Props {
  children: React.ReactNode
}

const Siders = () => {
  const intl = useIntl();
  let list = [
    {
      name: '首页',
      url: '/',
      icon: BankOutlined,
      t: 'home',
    },
    {
      name: '轮播图管理',
      url: '/carousel',
      icon: IdcardOutlined,
      t: 'Carousel_management',
    },
    {
      name: '导航管理',
      url: '/navs',
      icon: BarsOutlined,
      t: 'Navigation_management',
    },
    {
      name: '推荐导航',
      url: '/recom',
      icon: ContactsOutlined,
      t: 'Recommended_navigation',
    },
    {
      name: '用户管理',
      url: '/user',
      icon: UserOutlined,
      t: 'User_Management',
    },
    {
      name: '商品管理',
      url: '/goods',
      icon: TableOutlined,
      t: 'Goods_Management',
      list1: [
        {
          name: '添加商品',
          url: '/addgoods',
          icon: FileAddOutlined,
          t: 'Adding_goods',
        },
        {
          name: '商品分类',
          url: '/categ',
          icon: DatabaseOutlined,
          t: 'Categories',
        },
        {
          name: '商品模型',
          url: '/goodsModel',
          icon: MenuOutlined,
          t: 'Commodity_model',
        },
        {
          name: '商品规格',
          url: '/goodsSpec',
          icon: FileOutlined,
          t: 'Product_specifications',
        },
        {
          name: '商品参数',
          url: '/goodsParms',
          icon: ApartmentOutlined,
          t: 'Product_parameters'
        },
        {
          name: '规格参数',
          url: '/spec',
          icon: AppstoreOutlined,
          t: 'Specifications'
        }
      ]
    },
    {
      name: '秒杀管理',
      url: '/splike',
      icon: HistoryOutlined,
      t: 'Spike_management'
    },
    {
      name: '优惠券管理',
      url: '/coupon',
      icon: AccountBookOutlined,
      t: 'Coupon_management'
    },
    {
      name: '订单管理',
      url: '/order',
      icon: BarsOutlined,
      t: 'Order_management'
    },
    {
      name: '通知管理',
      url: '/notice',
      icon: NotificationOutlined,
      t: 'Notification_management'
    },
    {
      name: '客服消息',
      url: '/chat',
      icon: MessageOutlined,
      t: 'Customer_Service_Management'
    }

  ]
  // 点击导航
  let history = useHistory()
  let location = useLocation()
  let onSelect = (e: any) => {
    history.push(e.key)
  }
  return (
    <div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}
        onSelect={(e) => { onSelect(e) }}
      >
        {
          list.map((item: any, index: number) => {
            if (index === 5) {
              return <SubMenu key={item.url} icon={<item.icon />} title={intl.formatMessage({ id: list[5].t })}>
                {item.list1 && item.list1.map((item1: any, index: number) => {
                  return <Menu.Item key={item1.url} icon={<item1.icon />}>
                    {intl.formatMessage({ id: item1.t })}</Menu.Item>
                })
                }
              </SubMenu>
            } else {
              return <Menu.Item key={item.url} icon={< item.icon />}>
                {intl.formatMessage({ id: item.t })}
              </Menu.Item>
            }
          })
        }
      </Menu>
    </div>
  )
}

export default Siders
