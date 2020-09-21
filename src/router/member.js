//member


const becomeMember = resolve => require(['@/page/member/becomeMember'], resolve);
const buyCardRecord = resolve => require(['@/page/member/buyCardRecord'], resolve);
const buyCardDetails = resolve => require(['@/page/member/buyCardDetails'], resolve);
const cashRegister = resolve => require(['@/page/member/cashRegister'], resolve);
const cashRegisterss = resolve => require(['@/page/member/cashRegisterss'], resolve);
const purchasedCard = resolve => require(['@/page/member/purchasedCard'], resolve);

const selectionCard = resolve => require(['@/page/member/selectionCard'], resolve);
const seperateCashRegister = resolve => require(['@/page/member/seperateCashRegister'], resolve);
const toBecomeMember = resolve => require(['@/page/member/toBecomeMember'], resolve);
const azjDetails = resolve => require(['@/page/member/azjDetails'], resolve);
const azjqrorder = resolve => require(['@/page/member/azjqrorder'], resolve);
const consumption = resolve => require(['@/page/member/consumption'], resolve);
const azjqrenorder = resolve => require(['@/page/member/azjqrenorder'], resolve);
const deConsumer = resolve => require(['@/page/member/deConsumer'], resolve);
const payPage = resolve => require(['@/page/member/payPage'], resolve);


export default [{
        path: '/becomeMember/:card/:level',
        name: 'becomeMember',
        component: becomeMember,
        meta: {
            requireAuth: true,
            massage: '用户福利'
        }
    },
 
    {
        path: '/member/payPage',
        name: 'payPage',
        component: payPage,
        meta: {
            requireAuth: true,
            massage: '用户买卡'
        }
    },
      {
          path: '/consumption',
          name: 'consumption',
          component: consumption,
          meta: {
              requireAuth: true,
              massage: '用户买卡'
          }
      },
    {
        path: '/selectionCard',
        name: 'selectionCard',
        component: selectionCard,
        meta: {
            requireAuth: true,
            massage: '用户续卡'
        }
    },
    {
        path: '/buyCardRecord',
        name: 'buyCardRecord',
        component: buyCardRecord,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    {
        path: '/buyCardDetails',
        name: 'buyCardDetails',
        component: buyCardDetails,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    {
        path: '/azjDetails',
        name: 'azjDetails',
        component: azjDetails,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    {
        path: '/azjqrorder',
        name: 'azjqrorder',
        component: azjqrorder,
        meta: {
            requireAuth: false,
            massage: ''
        }
    },
    {
        path: '/azjqrenorder',
        name: 'azjqrenorder',
        component: azjqrenorder,
        meta: {
            requireAuth: false,
            massage: ''
        }
    },

    {
        path: '/cashRegister',
        name: 'cashRegister',
        component: cashRegister,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    {
        path: '/cashRegisterss',
        name: 'cashRegisterss',
        component: cashRegisterss,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    {
        path: '/purchasedCard',
        name: 'purchasedCard',
        component: purchasedCard,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    // 分单收银台
    {
        path: '/seperateCashRegister',
        name: 'seperateCashRegister',
        component: seperateCashRegister,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    { //新的
        path: '/toBecomeMember/:code/:level/:cardType',
        name: 'toBecomeMember',
        component: toBecomeMember,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
    //买单消费详情
    { //新的
        path: '/deConsumer',
        name: 'deConsumer',
        component: deConsumer,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
]
