// banking

const TXapplication = resolve => require(['@/page/mine/Settings/banking/TXapplication'], resolve); //提现
const tixianDetails = resolve => require(['@/page/mine/Settings/banking/tixianDetails'], resolve); //提现详情
const cashWithdrawal = resolve => require(['@/page/mine/Settings/banking/cashWithdrawal'], resolve);
const bankCartList = resolve => require(['@/page/mine/Settings/banking/bankCartList'], resolve); //银行卡
const cyclePresentation = resolve => require(['@/page/mine/Settings/banking/cyclePresentation'], resolve); //按周期提现
const incomeDetails = resolve => require(['@/page/mine/Settings/banking/incomeDetails'], resolve); //入驻后收益明细
const selectedCycle = resolve => require(['@/page/mine/Settings/banking/selectedCycle'], resolve); //已选周期
const withdrawalProcess2 = resolve => require(['@/page/mine/Settings/banking/withdrawalProcess2'], resolve);
const separateWithdrawal = resolve => require(['@/page/mine/Settings/banking/separateWithdrawal'], resolve); //分账前提现

export default [
    {
    path: '/settings/TXapplication',
    name: 'TXapplication',
    component: TXapplication,
    meta: {
        requireAuth: true,
        massage: '提现'
    }
    },
    {
        path: '/settings/tixianDetails',
        name: 'tixianDetails',
        component: tixianDetails,
        meta: {
            requireAuth: true,
            massage: '提现详情'
        }
    },
  {
    path: '/settings/cashWithdrawal',
    name: 'cashWithdrawal',
    component: cashWithdrawal,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  },
  {
    path: '/settings/bankList',
    name: 'bankCartList',
    component: bankCartList,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  },
  {
    path: '/settings/cyclePresentation',
    name: 'cyclePresentation',
    component: cyclePresentation,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  },
  {
    path: '/settings/incomeDetails',
    name: 'incomeDetails',
    component: incomeDetails,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  },
  {
    path: '/banking/selectedCycle',
    name: 'selectedCycle',
    component: selectedCycle,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  },
   {
       path: '/banking/withdrawalProcess2',
       name: 'withdrawalProcess2',
       component: withdrawalProcess2,
       meta: {
           requireAuth: true,
           massage: '银行卡提现'
       }
   },
   {
    path: '/settings/separateWithdrawal',
    name: 'separateWithdrawal',
    component: separateWithdrawal,
    meta: {
      requireAuth: true,
      massage: '提现'
    }
  }


]
