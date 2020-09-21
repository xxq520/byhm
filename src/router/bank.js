// bank


const bankCard = resolve => require(['@/page/mine/Settings/bank/bankCard'], resolve);
const bankCardYL = resolve => require(['@/page/mine/Settings/bank/bankCardYL'], resolve);
const bankList = resolve => require(['@/page/mine/Settings/bank/bankList'], resolve);
const withdrawal = resolve => require(['@/page/mine/Settings/bank/withdrawal'], resolve);
const successful = resolve => require(['@/page/mine/Settings/bank/successful'], resolve);
const withdrawalProcess = resolve => require(['@/page/mine/Settings/bank/withdrawalProcess'], resolve);

export default [
  {
    path: '/settings/bankCard',
    name: 'bankCard',
    component: bankCard,
    meta: {
      requireAuth: true,
      massage: '绑定银行卡'
    }
  },

  {
    path: '/settings/bankCardYL',
    name: 'bankCardYL',
    component: bankCardYL,
    meta: {
      requireAuth: true,
      massage: '绑定银行卡'
    }
  },
  {
    path: '/settings/bankListOld',
    name: 'bankList',
    component: bankList,
    meta: {
      requireAuth: true,
      massage: '银行卡列表'
    }
  },
  {
    path: '/settings/withdrawal',
    name: 'withdrawal',
    component: withdrawal,
    meta: {
      requireAuth: true,
      massage: '银行卡提现'
    }
  },
  {
    path: '/bank/successful',
    name: 'banksuccessful',
    component: successful,
    meta: {
      requireAuth: true,
      massage: '银行卡提现'
    }
  },
  {
    path: '/bank/withdrawalProcess',
    name: 'withdrawalProcess',
    component: withdrawalProcess,
    meta: {
      requireAuth: true,
      massage: '银行卡提现'
    }
  },
]
