//评论
const storeplat = resolve => require(['@/page/storeplat/index'], resolve);

const shopeval = resolve => require(['@/page/storeplat/shopeval'], resolve);
const messageList = resolve => require(['@/page/storeplat/messageList'], resolve);
const memberMent = resolve => require(['@/page/storeplat/memberMent'], resolve);
//设置
const systemSetup = resolve => require(['@/page/storeplat/Settin/systemSetup'], resolve);
const basic = resolve => require(['@/page/storeplat/Settin/basic'], resolve);
const Payword = resolve => require(['@/page/storeplat/Settin/Payword'], resolve);
const Preferential = resolve => require(['@/page/storeplat/Settin/Preferential'], resolve);
const storeSetup = resolve => require(['@/page/storeplat/Settin/storeSetup'], resolve);
const distribution = resolve => require(['@/page/storeplat/Settin/distribution'], resolve);
//资产
const assetsment = resolve => require(['@/page/storeplat/Assets/assetsment'], resolve);
const Balance = resolve => require(['@/page/storeplat/Assets/Balance'], resolve);
const settlement = resolve => require(['@/page/storeplat/Assets/settlement'], resolve);
const rawalStatus = resolve => require(['@/page/storeplat/Assets/rawalStatus'], resolve);
const Statement = resolve => require(['@/page/storeplat/Assets/Statement'], resolve);

//应用
const Application = resolve => require(['@/page/storeplat/Applicat/Application'], resolve);
const Express = resolve => require(['@/page/storeplat/Applicat/Express'], resolve);
const IssueCoupons = resolve => require(['@/page/storeplat/Applicat/IssueCoupons'], resolve);
const Discountact = resolve => require(['@/page/storeplat/Applicat/Discountact'], resolve);
const fullReduction = resolve => require(['@/page/storeplat/Applicat/fullReduction'], resolve);
const Merchlist = resolve => require(['@/page/storeplat/Applicat/Merchlist'], resolve);
const Addcoupons = resolve => require(['@/page/storeplat/Applicat/Addcoupons'], resolve);
const Fullactlist = resolve => require(['@/page/storeplat/Applicat/Fullactlist'], resolve);

//订单
const orderManage = resolve => require(['@/page/storeplat/Order/orderManage'], resolve);
const merchOrder = resolve => require(['@/page/storeplat/Order/merchOrder'], resolve);
const writeOff = resolve => require(['@/page/storeplat/Order/writeOff'], resolve);
const Confirmwrite = resolve => require(['@/page/storeplat/Order/Confirmwrite'], resolve);

//商品管理
const administ = resolve => require(['@/page/storeplat/Merchandise/administ'], resolve);
const Classified = resolve => require(['@/page/storeplat/Merchandise/Classified'], resolve);
const comMent = resolve => require(['@/page/storeplat/Merchandise/comMent'], resolve);






export default [
    // 商家管理（入驻）首页
    {
        path: '/storeplat',
        name: 'storeplat',
        component: storeplat,
        meta: {
            requireAuth: true,
            massage: '商家管理'
        }
    },
    //系统设置
    {
        path: '/storeplat/systemSetup',
        name: 'systemSetup',
        component: systemSetup,
        meta: {
            requireAuth: true,
            massage: '系统设置'
        }
    },
    {
        path: '/storeplat/messageList',
        name: 'messageList',
        component: messageList,
        meta: {
            requireAuth: true,
            massage: '消息列表'
        }
    },
    {
        path: '/storeplat/basic',
        name: 'basic',
        component: basic,
        meta: {
            requireAuth: true,
            massage: '基础设置'
        }
    },
    {
        path: '/storeplat/shopeval',
        name: 'shopeval',
        component: shopeval,
        meta: {
            requireAuth: true,
            massage: '评论管理'
        }
    },
    {
        path: '/storeplat/Payword',
        name: 'Payword',
        component: Payword,
        meta: {
            requireAuth: true,
            massage: '提现密码设置'
        }
    },
    {
        path: '/storeplat/Preferential',
        name: 'Preferential',
        component: Preferential,
        meta: {
            requireAuth: true,
            massage: '优惠规则设置'
        }
    },
    {
        path: '/storeplat/storeSetup',
        name: 'storeSetup',
        component: storeSetup,
        meta: {
            requireAuth: true,
            massage: '店铺设置',
            keepAlive: true

        }
    },
    {
        path: '/storeplat/distribution',
        name: 'distribution',
        component: distribution,
        meta: {
            requireAuth: true,
            massage: '配送规则'
        }
    },
    {
        path: '/storeplat/memberMent',
        name: 'memberMent',
        component: memberMent,
        meta: {
            requireAuth: true,
            massage: '会员管理'
        }
    },
    {
        path: '/storeplat/assetsment',
        name: 'assetsment',
        component: assetsment,
        meta: {
            requireAuth: true,
            massage: '资产管理'
        }
    },
    {
        path: '/storeplat/Balance',
        name: 'Balance',
        component: Balance,
        meta: {
            requireAuth: true,
            massage: '余额提现'
        }
    },
    {
        path: '/storeplat/settlement',
        name: 'settlement',
        component: settlement,
        meta: {
            requireAuth: true,
            massage: '待结算'
        }
    },
    {
        path: '/storeplat/rawalStatus',
        name: 'rawalStatus',
        component: rawalStatus,
        meta: {
            requireAuth: true,
            massage: '提现状态'
        }
    },
    {
        path: '/storeplat/Statement',
        name: 'Statement',
        component: Statement,
        meta: {
            requireAuth: true,
            massage: '对账单'
        }
    },

    {
        path: '/storeplat/Application',
        name: 'Application',
        component: Application,
        meta: {
            requireAuth: true,
            massage: '应用管理'
        }
    },
    {
        path: '/storeplat/Express',
        name: 'Express',
        component: Express,
        meta: {
            requireAuth: true,
            massage: '配送'
        }
    },
    {
        path: '/storeplat/IssueCoupons',
        name: 'IssueCoupons',
        component: IssueCoupons,
        meta: {
            requireAuth: true,
            massage: '发放优惠券'
        }
    },
    {
        path: '/storeplat/Discountact',
        name: 'Discountact',
        component: Discountact,
        meta: {
            requireAuth: true,
            massage: '折扣活动',
            keepAlive: true

        }
    },
    {
        path: '/storeplat/fullReduction',
        name: 'fullReduction',
        component: fullReduction,
        meta: {
            requireAuth: true,
            massage: '满减活动'
        }
    },
    {
        path: '/storeplat/Fullactlist',
        name: 'Fullactlist',
        component: Fullactlist,
        meta: {
            requireAuth: true,
            massage: '满减活动列表'
        }
    },
    {
        path: '/storeplat/Merchlist',
        name: 'Merchlist',
        component: Merchlist,
        meta: {
            requireAuth: true,
            massage: '折扣活动',

        }
    },
    {
        path: '/storeplat/Addcoupons',
        name: 'Addcoupons',
        component: Addcoupons,
        meta: {
            requireAuth: true,
            massage: '添加优惠券',
            keepAlive: true
        }
    },

    {
        path: '/storeplat/orderManage',
        name: 'orderManage',
        component: orderManage,
        meta: {
            requireAuth: true,
            massage: '订单管理',
             keepAlive: true

        }
    },
    {
        path: '/storeplat/merchOrder',
        name: 'merchOrder',
        component: merchOrder,
        meta: {
            requireAuth: true,
            massage: '订单详情',

        }
    },
    {
        path: '/storeplat/writeOff',
        name: 'writeOff',
        component: writeOff,
        meta: {
            requireAuth: true,
            massage: '商品核销',
        }
    },
    {
        path: '/storeplat/Confirmwrite',
        name: 'Confirmwrite',
        component: Confirmwrite,
        meta: {
            requireAuth: true,
            massage: '确定核销',
        }
    },

    {
        path: '/storeplat/administ',
        name: 'administ',
        component: administ,
        meta: {
            requireAuth: true,
            massage: '商品管理',
        }
    },
    {
        path: '/storeplat/Classified',
        name: 'Classified',
        component: Classified,
        meta: {
            requireAuth: true,
            massage: '分类管理',
        }
    },
    {
        path: '/storeplat/comMent',
        name: 'comMent',
        component: comMent,
        meta: {
            requireAuth: true,
            massage: '分类管理',
        }
    },
]
