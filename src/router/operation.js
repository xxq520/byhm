

const operation = resolve => require(['@/page/operation/index'], resolve);
const partnerInfor = resolve => require(['@/page/operation/partnerInfor'], resolve);
const centerInfor = resolve => require(['@/page/operation/centerInfor'], resolve);
const task = resolve => require(['@/page/operation/task'], resolve);
const myOrder = resolve => require(['@/page/operation/myOrder/order'], resolve);
const upLoading = resolve => require(['@/page/operation/myOrder/upLoadRemittance'], resolve);
const orderDetails = resolve => require(['@/page/operation/myOrder/orderDetails'], resolve);
const upgradeAduit = resolve => require(['@/page/operation/myOrder/upgradeAduit'], resolve);
const aduitDetails = resolve => require(['@/page/operation/myOrder/aduitDetails'], resolve);
const aduitsuccessful = resolve => require(['@/page/operation/myOrder/aduitsuccessful'], resolve);
const ChangeCode = resolve => require(['@/page/operation/ChangeCode'], resolve);
const areaInfor = resolve => require(['@/page/operation/areaInfor'], resolve);
const Income = resolve => require(['@/page/operation/Income'], resolve);
const arevenue = resolve => require(['@/page/operation/arevenue'], resolve);
const Earndetail = resolve => require(['@/page/operation/Earndetail'], resolve);
const brevenue = resolve => require(['@/page/operation/brevenue'], resolve);
export default [
  {
    path: '/operation',
    name: 'operation',
    component: operation,
    meta: {
      requireAuth: true,
      massage: '',
      keepAlive: true
    }
  },
  {
    path: '/operation/Income',
    name: 'Income',
    component: Income,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/arevenue',
    name: 'arevenue',
    component: arevenue,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/Earndetail',
    name: 'Earndetail',
    component: Earndetail,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  
  {
    path: '/operation/brevenue',
    name: 'brevenue',
    component: brevenue,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/areaInfor',
    name: 'areaInfor',
    component: areaInfor,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/upgradeAduit',
    name: 'upgradeAduit',
    component: upgradeAduit,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/aduitDetails',
    name: 'aduitDetails',
    component: aduitDetails,
    meta: {
      requireAuth: true,
      massage: '',
      keepAlive: true
    }
  },
  {
    path: '/operation/partnerInfor',
    name: 'partnerInfor',
    component: partnerInfor,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/centerInfor',
    name: 'centerInfor',
    component: centerInfor,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/operation/task',
    name: 'task',
    component: task,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },

  {
    path: '/settings/ChangeCode',
    name: 'ChangeCode',
    component: ChangeCode
  },
  {
    path: '/myorder',
    name: 'myOrder',
    component: myOrder,
    meta: {
      requireAuth: true,
      massage: '我的订单'
    }
  },
  {
    path: '/myorder/upLoading',
    name: 'upLoading',
    component: upLoading,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/orderDetail',
    name: 'orderDetail',
    component: orderDetails,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/aduitsuccessful',
    name: 'aduitsuccessful',
    component: aduitsuccessful,
    meta: {
      requireAuth: true,
      massage: ''
    }
  }
]
