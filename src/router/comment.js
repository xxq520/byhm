//评论

const pushComment = resolve => require(['@/page/comment/pushComment'], resolve);
const commentList = resolve => require(['@/page/comment/commentList'], resolve);
const PrivacyPolicy = resolve => require(['@/page/comment/Privacy'], resolve);
const UserProtocol = resolve => require(['@/page/comment/UserProtocol'], resolve);
const supermarket = resolve => require(['@/page/comment/supermarket'], resolve);
const marketDetalis = resolve => require(['@/page/comment/marketDetalis'], resolve);
const marketinfo = resolve => require(['@/page/comment/marketinfo'], resolve);
const mercheval = resolve => require(['@/page/comment/mercheval'], resolve);
const commodity = resolve => require(['@/page/comment/commodity'], resolve);
const choiceRoll = resolve => require(['@/page/comment/choiceRoll'], resolve);
const Settlement = resolve => require(['@/page/comment/Settlement'], resolve);
const supersearch = resolve => require(['@/page/comment/supersearch'], resolve);
const commSearch = resolve => require(['@/page/comment/commSearch'], resolve);
const Takeout = resolve => require(['@/page/comment/Takeout'], resolve);



export default [{
        path: '/comment/pushComment',
        name: 'pushComment',
        component: pushComment,
        meta: {
            requireAuth: true,
            massage: '发布评论'
        }
    },

    {
        path: '/comment/commentList',
        name: 'commentList',
        component: commentList,
        meta: {
            requireAuth: true,
            massage: '全部评论'
        }
    },

    //隐私政策
    {
        path: '/PrivacyPolicy',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy

    },
    {
        path: '/UserProtocol',
        name: 'UserProtocol',
        component: UserProtocol,

    },
    {
        path: '/supermarket',
        name: 'supermarket',
        component: supermarket,
        meta: {
            massage: '商超首页'
        }
    },
      {
          path: '/Takeout',
          name: 'Takeout',
          component: Takeout,
          meta: {
              massage: '外卖首页'
          }
      },
    {
        path: '/comment/marketDetalis',
        name: 'marketDetalis',
        component: marketDetalis,
        meta: {
            requireAuth: true,
            massage: '商超列表'
        }
    },
    {
        path: '/comment/marketinfo',
        name: 'marketinfo',
        component: marketinfo,
        meta: {
            requireAuth: true,
            massage: '商家信息'
        }
    },
    {
        path: '/comment/mercheval',
        name: 'mercheval',
        component: mercheval,
        meta: {
            requireAuth: true,
            massage: '商家评论'
        }
    },

    {
        path: '/comment/commodity',
        name: 'commodity',
        component: commodity,
        meta: {
            requireAuth: true,
            massage: '商品信息'
        }
    },
    {
        path: '/comment/choiceRoll',
        name: 'choiceRoll',
        component: choiceRoll,
        meta: {
            requireAuth: true,
            massage: '选择优惠券'
        }
    },
    {
        path: '/comment/Settlement',
        name: 'Settlement',
        component: Settlement,
        meta: {
            requireAuth: true,
            massage: '提交订单',
            keepAlive: true
        }
    },
    {
        path: '/comment/supersearch',
        name: 'supersearch',
        component: supersearch,
        meta: {
            requireAuth: true,
            massage: '提交订单'
        }
    },
    {
        path: '/comment/commSearch',
        name: 'commSearch',
        component: commSearch,
        meta: {
            requireAuth: true,
            massage: '商品搜索'
        }
    },
]
