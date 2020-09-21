//recruit

const investment = resolve => require(['@/page/recruit/investment'], resolve);
const regionalAgent = resolve => require(['@/page/recruit/regionalAgent'], resolve);
const provinceAgent = resolve => require(['@/page/recruit/provinceAgent'], resolve);
const cityAgent = resolve => require(['@/page/recruit/cityAgent'], resolve);
const distributionAgent = resolve => require(['@/page/recruit/distributionAgent'], resolve);
const agentApplication = resolve => require(['@/page/recruit/agentApplication'], resolve);
const invite = resolve => require(['@/page/recruit/invite'], resolve);
const partnerApplication = resolve => require(['@/page/recruit/partnerApplication'], resolve);
const optionalUpgrade = resolve => require(['@/page/recruit/optionalUpgrade'], resolve);
const partnerApplications = resolve => require(['@/page/recruit/partnerApplications'], resolve);


export default [
  {
    path: '/invite/:code/:level',
    name: 'invite',
    component: invite,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/investment',
    name: 'investment',
    component: investment
  },
  {
    path: '/regionalAgent',
    name: 'regionalAgent',
    component: regionalAgent,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/provinceAgent',
    name: 'provinceAgent',
    component: provinceAgent,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/cityAgent',
    name: 'cityAgent',
    component: cityAgent,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/distributionAgent',
    name: 'distributionAgent',
    component: distributionAgent,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/agentApplication',
    name: 'agentApplication',
    component: agentApplication,
    meta:{
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/partnerApplication/:code/:levle/:exper/:comefrom',
    name: 'partnerApplication',
    component: partnerApplication,
    meta:{
      requireAuth: true,
      massage: ''
    }

  },
    {
        path: '/partnerApplications',
        name: 'partnerApplications',
        component: partnerApplications,
        meta: {
            requireAuth: true,
            massage: ''
        }

    },
  {
    path: '/optionalUpgrade/:code/:level',
    name: 'optionalUpgrade',
    component: optionalUpgrade,
    meta:{
      requireAuth: true,
      massage: ''
    }
  },
]
