//人脉管理


const peopleManage = resolve => require(['@/page/mine/peopleManage/index'], resolve);
const peopleDetails = resolve => require(['@/page/mine/peopleManage/peopleDetails'], resolve);
const renewalCard = resolve => require(['@/page/mine/peopleManage/renewalCard'], resolve)
const cardCoupon = resolve => require(['@/page/mine/peopleManage/cardCoupon'], resolve)
const collection = resolve => require(['@/page/mine/peopleManage/Collection'], resolve)
const evaluation = resolve => require(['@/page/mine/peopleManage/Evaluation'], resolve)
const merchorder = resolve => require(['@/page/mine/peopleManage/merchorder'], resolve)
const orderdetail = resolve => require(['@/page/mine/peopleManage/orderdetails'], resolve)
const goComment = resolve => require(['@/page/mine/peopleManage/goComment'], resolve)
const goRefund = resolve => require(['@/page/mine/peopleManage/goRefund'], resolve)
const negotiation = resolve => require(['@/page/mine/peopleManage/negotiation'], resolve)
const payMode = resolve => require(['@/page/mine/peopleManage/payMode'], resolve)
const paySuccess = resolve => require(['@/page/mine/peopleManage/paySuccess'], resolve)


export default [
     {
         path: '/mine/paySuccess',
         name: 'paySuccess',
         component: paySuccess,
         meta: {
             requireAuth: true,
             massage: '支付成功'
         }
     },
    {
        path: '/mine/payMode',
        name: 'payMode',
        component: payMode,
        meta: {
            requireAuth: true,
            massage: '选择支付方式'
        }
    },
    {
        path: '/mine/negotiation',
        name: 'negotiation',
        component: negotiation,
        meta: {
            requireAuth: true,
            massage: '订单详情'
        }
    },
    {
        path: '/mine/orderdetails',
        name: 'orderdetail',
        component: orderdetail,
        meta: {
            requireAuth: true,
            massage: '订单详情'
        }
    },
    {
        path: '/mine/goComment',
        name: 'goComment',
        component: goComment,
        meta: {
            requireAuth: true,
            massage: '去评价'
        }
    },
    {
        path: '/mine/goRefund',
        name: 'goRefund',
        component: goRefund,
        meta: {
            requireAuth: true,
            massage: '去退款'
        }
    },
    {
        path: '/merchorder',
        name: 'merchorder',
        component: merchorder,
        meta: {
            requireAuth: true,
            massage: '商家订单'
        }
    },
    {
        path: '/collection',
        name: 'collection',
        component: collection,
        meta: {
            requireAuth: true,
            massage: '收藏'
        }
    },
    {
        path: '/cardCoupon',
        name: 'cardCoupon',
        component: cardCoupon,
        meta: {
            requireAuth: true,
            massage: '卡券'
        }
    },
    {
        path: '/evaluation',
        name: 'evaluation',
        component: evaluation,
        meta: {
            requireAuth: true,
            massage: '评价'
        }
    },
    {
        path: '/renewalCard',
        name: 'renewalCard',
        component: renewalCard,
        meta: {
            requireAuth: true,
            massage: '领券中心'
        }
    },
    {
        path: '/mine/peopleManage',
        name: 'peopleManage',
        component: peopleManage,
        meta: {
            requireAuth: true,
            massage: '人脉管理',
            keepAlive: true
        }
    },
    {
        path: '/mine/peopleDetails',
        name: 'peopleDetails',
        component: peopleDetails,
        meta: {
            requireAuth: true,
            massage: '人脉管理',
            keepAlive: true
        }
    },
]
