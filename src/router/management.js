const management = resolve => require(['@/page/management/index'], resolve);
const shopMessage = resolve => require(['@/page/management/shopMessage/shopMessage'], resolve);
const shopMessageIndex = resolve => require(['@/page/management/shopMessage/shopMessageIndex'], resolve);
const shopMsgDetail = resolve => require(['@/page/management/shopMessage/shopMsgDetail'], resolve);
const priceMessage = resolve => require(['@/page/management/priceMessage/index'], resolve);
const pricelist = resolve => require(['@/page/management/priceMessage/pricelist'], resolve);
const addromve = resolve => require(['@/page/management/priceMessage/addromve'], resolve);
const privilege = resolve => require(['@/page/management/priceMessage/privilege'], resolve);
const profitDetail = resolve => require(['@/page/management/profitDetail'], resolve);
const PDFilter = resolve => require(['@/page/management/PDFilter'], resolve);
const scanResults = resolve => require(['@/page/management/scanResults'], resolve);


const xianShopManage = resolve => require(['@/page/xianShopManage/xianShopManage'], resolve);
const shopDetail = resolve => require(['@/page/xianShopManage/shopDetail'], resolve);
const applicationShop = resolve => require(['@/page/xianShopManage/applicationShop'], resolve);
const xianPriceMessage = resolve => require(['@/page/xianShopManage/xianPriceMessage'], resolve);

const classificatlist = resolve => require(['@/page/xianShopManage/classificatlist'], resolve);

export default [
    // 商家管理（入驻）首页
    {
        path: '/management/',
        name: 'management',
        component: management,
        meta: {
            requireAuth: true,
            massage: '商家入驻'
        }
    },
      { //商家信息管理首页
          path: '/classificatlist',
          name: 'classificatlist',
          component: classificatlist,
          meta: {
              massage: '分类列表'
          }
      },
    { //商家信息管理首页
        path: '/management/shopMessage/shopMessageIndex',
        name: 'shopMessageIndex',
        component: shopMessageIndex,
        meta: {
            requireAuth: true,
            massage: '商家信息管理首页'
        }
    },
    // 商家店铺详情
    {
        path: '/management/shopMessage/shopMessage',
        name: 'shopMessage',
        component: shopMessage,
        meta: {
            requireAuth: true,
            massage: '商家店铺详情',
            keepAlive: true
        }
    },
    // 商家店铺资质详情
    {
        path: '/management/shopMessage/shopMsgDetail',
        name: 'shopMsgDetail',
        component: shopMsgDetail,
        meta: {
            requireAuth: true,
            massage: '商家店铺资质详情'
        }
    },
    // 店铺优惠
    {
        path: '/management/priceMessage',
        name: 'priceMessage',
        component: priceMessage,
        meta: {
            requireAuth: true,
            massage: '店铺优惠'
        }
    },
    // 店铺优惠列表
    {
        path: '/management/:postId/pricelist',
        name: 'pricelist',
        component: pricelist,
        meta: {
            requireAuth: true,
            massage: '店铺优惠'
        }
    },
    // 店铺优惠编辑和添加
    {
        path: '/management/:postId/addromve',
        name: 'addromve',
        component: addromve,
        meta: {
            requireAuth: true,
            massage: '店铺优惠'
        }
    },
    // 店铺优惠使用说明
    {
        path: '/management/privilege',
        name: 'privilege',
        component: privilege,
        meta: {
            requireAuth: true,
            massage: '店铺优惠使用说明'
        }
    },
    // 收入明细
    {
        path: '/management/profitDetail',
        name: 'profitDetail',
        component: profitDetail,
        meta: {
            requireAuth: true,
            massage: '收入明细'
        }
    },
    // 收入明细-筛选结果页面
    {
        path: '/management/PDFilter',
        name: 'PDFilter',
        component: PDFilter,
        meta: {
            requireAuth: true,
            massage: '收入明细'
        }
    },
    // 县运营商店铺管理
    {
        path: '/xianShopManage/xianShopManage',
        name: 'xianShopManage',
        component: xianShopManage,
        meta: {
            requireAuth: true,
            massage: '店铺管理',
            keepAlive: true
        }
    },
    // 县运营商店铺管理--店铺信息
    {
        path: '/xianShopManage/shopDetail',
        name: 'shopDetail',
        component: shopDetail,
        meta: {
            requireAuth: true,
            massage: '县运营商店铺管理',

        }
    },
    // 县运营商店铺管理--申请店铺
    {
        path: '/xianShopManage/applicationShop',
        name: 'applicationShop',
        component: applicationShop,
        meta: {
            requireAuth: true,
            massage: '县运营商店铺申请',
            keepAlive: true
        }
    },
  
    // 县运营商店铺管理--优惠管理
    {
        path: '/xianShopManage/xianPriceMessage',
        name: 'xianPriceMessage',
        component: xianPriceMessage,
        meta: {
            requireAuth: true,
            massage: '县运营商优惠管理'
        }
    },
    {
        path: '/management/scanResults',
        name: 'scanResults',
        component: scanResults,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
]
