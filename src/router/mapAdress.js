//recruit


const mapAdress = resolve => require(['@/page/mapAdress/index'], resolve);
const mapAdressSeach = resolve => require(['@/page/mapAdress/seach'], resolve);
const mapAdressRegion = resolve => require(['@/page/mapAdress/region'], resolve);

export default [
  {
    path: '/mapAdress',
    name: 'mapAdress',
    component: mapAdress,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/mapAdress/seach',
    name: 'mapAdressSeach',
    component: mapAdressSeach,
    meta: {
      requireAuth: true,
      massage: ''
    }
  },
  {
    path: '/mapAdress/region',
    name: 'mapAdressRegion',
    component: mapAdressRegion,
    meta: {
      requireAuth: true,
      massage: ''
    }
  }
]
