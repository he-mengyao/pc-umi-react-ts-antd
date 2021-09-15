import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/login', component: '/src/pages/login/login.tsx', title: '登录' },
    {
      path: '/', component: '/src/pages/layout/layout.tsx', routes: [
        { path: '/', component: '@/pages/index', title: '首页' },
        { path: '/carousel', component: '/src/pages/carousel/carousel.tsx', title: '轮播图管理' },
        { path: '/navs', component: '/src/pages/navs/navs.tsx', title: '导航管理' },
        { path: '/recom', component: '/src/pages/recom/recom.tsx', title: '推荐导航' },
        { path: '/user', component: '/src/pages/user/user.tsx', title: '用户管理' },
        { path: '/goods', component: '/src/pages/goods/goods.tsx', title: '商品管理' },
        { path: '/addgoods', component: '/src/pages/goods/addgoods.tsx', title: '添加商品' },
        { path: '/categ', component: '/src/pages/goods/categ.tsx', title: '商品分类' },
        { path: '/goodsModel', component: '/src/pages/goods/goodsModel.tsx', title: '商品模型' },
        { path: '/goodsSpec', component: '/src/pages/goods/goodsSpec.tsx', title: '商品规格' },
        { path: '/goodsParms', component: '/src/pages/goods/goodsParms.tsx', title: '商品参数' },
        { path: '/spec', component: '/src/pages/goods/spec.tsx', title: '规格参数' },
        { path: '/splike', component: '/src/pages/splike/splike.tsx', title: '秒杀管理' },
        { path: '/coupon', component: '/src/pages/coupon/coupon.tsx', title: '优惠券管理' },
        { path: '/order', component: '/src/pages//order/order.tsx', title: '订单管理' },
        { path: '/notice', component: '/src/pages/notice/notice.tsx', title: '通知管理' },
        { path: '/chat', component: '/src/pages/chat/chat.tsx', title: '客服消息' }
      ]
    }
  ],
  fastRefresh: { },
  locale: {
    default: 'zh-CN'
  }
});
