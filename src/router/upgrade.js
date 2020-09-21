// upgrade

const upgrade = resolve => require(['@/page/upgrade/index'], resolve);
const order = resolve => require(['@/page/upgrade/order'], resolve);
const orderDetails = resolve => require(['@/page/upgrade/orderDetails'], resolve);
const agreement = resolve => require(['@/page/upgrade/agreement'], resolve);
const upgradeInformation = resolve => require(['@/page/upgrade/upgradeInformation'], resolve);
const confirmOrder = resolve => require(['@/page/upgrade/confirmOrder'], resolve);
const upgrading = resolve => require(['@/page/upgrade/upgrading'], resolve);
const selectUpgrade = resolve => require(['@/page/upgrade/selectUpgrade'], resolve);
const video = resolve => require(['@/page/upgrade/video'], resolve);
const experience = resolve => require(['@/page/upgrade/experience'], resolve);
const tyupgrading = resolve => require(['@/page/upgrade/tyupgrading'], resolve);


export default [
  {
    path: '/upgrade',
    name: 'upgrade',
    component: upgrade,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },

    {
        path: '/upgrading',
        name: 'upgrading',
        component: upgrading,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
      {
          path: '/selectUpgrade',
          name: 'selectUpgrade',
          component: selectUpgrade,
          meta: {
         
              massage: ''
          }
      },
   
        {
            path: '/tyupgrading',
            name: 'tyupgrading',
            component: tyupgrading,
            meta: {
                requireAuth: true,
                massage: ''
            }
        },
    //一元体验
    { 
        path: '/experience/:code/:level/:cardType',
        name: 'experience',
        component: experience,
        meta: {
            requireAuth: true,
            massage: ''
        }
    },
  {
    path: '/order',
    name: 'order',
    component: order,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
   {
       path: '/video',
       name: 'video',
       component: video,
       meta: {
           requireAuth: true,
           massage: ''
       }
   },
  {
    path: '/orderDetails',
    name: 'orderDetails',
    component: orderDetails,
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: agreement,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/upgradeInformation',
    name: 'upgradeInformation',
    component: upgradeInformation,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/confirmOrder',
    name: 'confirmOrder',
    component: confirmOrder,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
]
