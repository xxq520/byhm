// mine


const MineIndex = resolve => require(['@/page/mine/MineIndex'], resolve);
const InviteShop = resolve => require(['@/page/mine/invatation/InviteShop'], resolve);
const InvitMember = resolve => require(['@/page/mine/invatation/InvitMember'], resolve);
const InvitUsers = resolve => require(['@/page/mine/invatation/InvitUsers'], resolve);



const InviteCity = resolve => require(['@/page/mine/invatation/InviteCity'], resolve);
const InviteArea = resolve => require(['@/page/mine/invatation/InviteArea'], resolve);
const InviteProvince = resolve => require(['@/page/mine/invatation/InviteProvince'], resolve);
const inviteBusiness = resolve => require(['@/page/mine/invatation/inviteBusiness'], resolve);
const inviteExper = resolve => require(['@/page/mine/invatation/inviteExper'], resolve);
const partner = resolve => require(['@/page/mine/invatation/partner'], resolve);
const InviteChoice = resolve => require(['@/page/mine/invatation/InviteChoice'], resolve);
const InviteAzj = resolve => require(['@/page/mine/invatation/Inviteazj'], resolve);
const inviteSupplier = resolve => require(['@/page/mine/invatation/inviteSupplier'], resolve);




const settings = resolve => require(['@/page/mine/Settings/settings'], resolve);
const About = resolve => require(['@/page/mine/Settings/About'], resolve);
const information = resolve => require(['@/page/mine/Settings/information'], resolve);
const ChangeGender = resolve => require(['@/page/mine/Settings/ChangeGender'], resolve);
const ChangeName = resolve => require(['@/page/mine/Settings/ChangeName'], resolve);
const wxName = resolve => require(['@/page/mine/Settings/wxName'], resolve);
const MyHeader = resolve => require(['@/page/mine/Settings/MyHeader'], resolve);
const adress = resolve => require(['@/page/mine/Settings/adress'], resolve);
const Earndetail = resolve => require(['@/page/mine/detail/Earndetail'], resolve);

const cousterDetail = resolve => require(['@/page/mine/detail/cousterDetail'], resolve);
const cdDetail = resolve => require(['@/page/mine/detail/cdDetail'], resolve);



const exchangeRecord = resolve => require(['@/page/mine/detail/exchangeRecord'], resolve);
const ERFilter = resolve => require(['@/page/mine/detail/ERFilter'], resolve);
const drawalRecord = resolve => require(['@/page/mine/detail/drawalRecord'], resolve);
const WeChatLogin = resolve => require(['@/page/mine/WeChatLogin'], resolve);
const application = resolve => require(['@/page/mine/application'], resolve);

const rlservice = resolve => require(['@/page/mine/rlservice'], resolve);

const Advice = resolve => require(['@/page/mine/tools/Advice'], resolve);
const AboutUs = resolve => require(['@/page/mine/tools/AboutUs'], resolve);


const EditAdvice = resolve => require(['@/page/mine/tools/EditAdvice'], resolve);
const AdviceDetail = resolve => require(['@/page/mine/tools/AdviceDetail'], resolve);
const CommonProblem = resolve => require(['@/page/mine/tools/CommonProblem'], resolve);
const noviceGuide = resolve => require(['@/page/mine/tools/noviceGuide'], resolve)

const drawalRecordNew = resolve => require(['@/page/mine/detail/drawalRecordNew'], resolve);
const separateRecord = resolve => require(['@/page/mine/detail/drawalRecordSeparate'], resolve);
const drawalRecordPT = resolve => require(['@/page/mine/detail/drawalRecordPT'], resolve);



export default [

  {
    path: '/tools/AboutUs',
    name: 'AboutUs',
    component: AboutUs,
    meta:{
      requireAuth: true,
      massage: '关于我们'
    }
  }, //我的工具-关于我们
  {
    path: '/tools/Advice',
    name: 'Advice',
    component: Advice,
    meta: {
      requireAuth: true,
      massage: '意见反馈'
    }
  }, //我的工具-意见反馈
  {
    path: '/tools/EditAdvice',
    name: 'EditAdvice',
    component: EditAdvice,
    meta: {
      requireAuth: true,
      massage: '新增反馈'
    }
  }, //我的工具-新增反馈
  {
    path: '/tools/AdviceDetail',
    name: 'AdviceDetail',
    component: AdviceDetail,
    meta: {
      requireAuth: true,
      massage: '查看反馈细节'
    }
  }, //我的工具-查看反馈细节
  {
    path: '/tools/CommonProblem',
    name: 'CommonProblem',
    component: CommonProblem,
    meta: {
      requireAuth: true,
      massage: '常见问题'
    }
  }, //我的工具-常见问题
  {
    path: '/tools/noviceGuide',
    name: 'noviceGuide',
    component: noviceGuide,
    meta: {
      requireAuth: true,
      massage: '新手指引'
    }
  }, //我的工具-新手指引
  {
    path: '/mine',
    name: 'MineIndex',
    component: MineIndex,
    meta: {
      requireAuth:false,
      massage: '我的栏目'
    }
  }, //我的首页
  {
    path: '/mine/InviteShop',
    name: 'InviteShop',
    component: InviteShop,
    meta: {
      requireAuth: true,
      massage: '我的栏目'
    }
  }, //邀请商铺入驻
    {
        path: '/mine/InviteAzj',
        name: 'InviteAzj',
        component: InviteAzj,
        meta: {
            requireAuth: true,
            massage: '爱之家'
        }
    },
    { //邀请爱之家供应商
      path: '/mine/inviteSupplier',
      name: 'inviteSupplier',
      component: inviteSupplier,
      meta: {
        requireAuth: true,
        massage: ''
      }
    },
  {
    path: '/mine/InvitMember',
    name: 'InvitMember',
    component: InvitMember,
    meta: {
   
      massage: '邀请超级会员入驻'
    }
  }, //邀请成为520用户
  {
      path: '/mine/InvitUsers',
      name: 'InvitUsers',
      component: InvitUsers,
      meta: {
          
          massage: '邀请成为惠盟VIP'
      }
  },//邀请成为惠盟VIP
  {
    path: '/mine/InviteCity',
    name: 'InviteCity',
    component: InviteCity,
    meta: {
      requireAuth: true,
      massage: '邀请成为惠盟用户'
    }
  }, //邀请成为市级代理
  {
    path: '/mine/InviteArea',
    name: 'InviteArea',
    component: InviteArea,
    meta: {
      requireAuth: true,
      massage: '邀请成为市级代理'
    }
  }, //邀请成为区域合伙人
  {
    path: '/mine/InviteProvince',
    name: 'InviteProvince',
    component: InviteProvince,
    meta: {
      requireAuth: true,
      massage: '邀请成为区域合伙人'
    }
  }, //邀请成为省级代理
  {
    path: '/mine/inviteBusiness',
    name: 'inviteBusiness',
    component: inviteBusiness,
    meta: {
      requireAuth: true,
      massage: '邀请成为省级代理'
    }
  },
 
  // 体验卡
  {
    path: '/mine/inviteExper',
    name: 'inviteExper',
    component: inviteExper,
    meta: {
      massage: ''
    }
  },
  // 合伙人
  {
    path: '/mine/partner',
    name: 'partner',
    component: partner,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
 

  { //邀请自选身份
    path: '/mine/InviteChoice',
    name: 'InviteChoice',
    component: InviteChoice,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  //人脉管理
  {
    path: '/mine/settings',
    name: 'settings',
    component: settings,
    meta: {
      requireAuth: true,
      massage: '设置'
    }
  },//设置页面
   {
       path: '/settings/About',
       name: 'About',
       component: About,
       meta: {
           massage: '关于'
       }
   },
    {
        path: '/mine/information',
        name: 'information',
        component: information,
        meta: {
            requireAuth: true,
            massage: '设置'
        }
    }, //设置页面
  { path: '/WeChatLogin',name: 'WeChatLogin',component: WeChatLogin},//绑定微信登录
  {
    path: '/settings/ChangeGender',
    name: 'ChangeGender',
    component: ChangeGender,
    meta: {
      requireAuth: true,
      massage: '修改性别'
    }
  },//修改性别
 
 
   
  { 
    path: '/settings/ChangeName',
    name: 'ChangeName',
    component: ChangeName,
    meta: {
      requireAuth: true,
      massage: '修改昵称'
    }
  },//修改昵称
  {
    path: '/settings/wxName',
    name: 'wxName',
    component: wxName,
    meta: {
      requireAuth: true,
      massage: '修改WX昵称'
    }
  },//修改昵称
  { 
    path: '/settings/MyHeader',
    name: 'MyHeader',
    component: MyHeader,
    meta: {
      requireAuth: true,
      massage: '我的上级'
    }
  },//我的上级
  {
    path: '/mine/Earndetail',
    name: 'Earndetail',//收益明细
    component: Earndetail,
    meta: {
      requireAuth: true,
      massage: '收益明细'
    }
  },
 
  {
    path: '/mine/cousterDetail',
    name: 'cousterDetail',//消费明细
    component: cousterDetail,
    meta: {
      requireAuth: true,
      massage: '消费明细'
    }
  },
  {
    path: '/mine/exchangeRecord',
    name: 'exchangeRecord',//兑换记录
    component: exchangeRecord,
    meta: {
      requireAuth: true,
      massage: '兑换记录'
    }
  },
  {
    path: '/mine/ERFilter',
    name: 'ERFilter',//兑换记录筛选结果页
    component: ERFilter,
    meta: {
      requireAuth: true,
      massage: '兑换记录'
    }
  },
  {
    path: '/mine/cousterDetail/cdDetail',
    name: 'cdDetail', //消费明细详情
    component: cdDetail,
    meta: {
      requireAuth: true,
      massage: '消费明细详情'
    }
  },
  {
    path: '/mine/adress',
    name: 'adress',     //地址信息
    component: adress,
    meta: {
      requireAuth: true,
      massage: '地址信息'
    }
  },
  {
    path: '/mine/drawalRecord',
    name: 'drawalRecord',//提现记录
    component: drawalRecord,
    meta: {
      requireAuth: true,
      massage: '提现记录'
    }
  },
  {
    path: '/application/:inveteCardId',
    name: 'application',//邀请申请表
    component: application,
    meta:{
      requireAuth: true,
      massage: '店铺申请',
      keepAlive: true
    }
  },
 
  {
      path: '/mine/rlservice',
      name: 'rlservice',
      component: rlservice,
      meta: {
          requireAuth: true,
          massage: '人工服务'
      }
  },
  {
    path: '/mine/drawalRecordNew', //新的提现记录
    name: 'drawalRecordNew',
    component: drawalRecordNew,
    meta:{
      requireAuth: true,
      massage: '提现记录'
    }
  },
  {
    path: '/mine/separateRecord', //入驻前的提现记录
    name: 'separateRecord',
    component: separateRecord,
    meta:{
      requireAuth: true,
      massage: '提现记录'
    }
  },
  {
    path: '/mine/drawalRecordPT', //普通提现记录
    name: 'drawalRecordPT',
    component: drawalRecordPT,
    meta:{
      requireAuth: true,
      massage: '提现记录'
    }
  },
]
