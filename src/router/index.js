import Vue from 'vue'
import Router from 'vue-router'

const index = resolve => require(['@/page/index'], resolve);
const login = resolve => require(['@/page/login'], resolve);
const registered = resolve => require(['@/page/registered'], resolve);
const bindTel = resolve => require(['@/page/bindTel'], resolve);
// home

const shopDetails = resolve => require(['@/page/home/shopDetails/index'], resolve);
const shopImg = resolve => require(['@/page/home/shopImg'], resolve);
const qualificationImg = resolve => require(['@/page/home/qualificationImg'], resolve);
const officialImg = resolve => require(['@/page/home/officialImg'], resolve);
const goodClassify = resolve => require(['@/page/home/goodClassify'], resolve);
const message = resolve => require(['@/page/home/message'], resolve);
const searh = resolve => require(['@/page/home/searh'], resolve);
const orientation = resolve => require(['@/page/home/orientation'], resolve);
const newAddress = resolve => require(['@/page/home/newAddress'], resolve);
const areaList = resolve => require(['@/page/home/areaList'], resolve);
const successful = resolve => require(['@/page/successful'], resolve);
const applogin = resolve => require(['@/page/applogin'], resolve);

const Single = resolve => require(['@/page/home/shopDetails/Single'], resolve);
const selectAddress = resolve => require(['@/page/home/selectAddress'], resolve);



// 我的
import mine from './mine'
// 代理商招募
import recruit from './recruit'
// 用户
import member from './member'
// 商家管理
import management from './management'
// 提现
import bank from './bank'
// 分账提现
import banking from './banking'
// 评论
import comment from './comment'
// 百度地图地区地址
import mapAdress from './mapAdress'
//运营商升级
import upgrade from './upgrade'
//运营中心
import operation from './operation'
// 人脉管理
import peopleManage from './peopleManage'
//商家端
import storeplat from './storeplat'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    routes: [
        // 首页
        {
            path: '/',
            name: 'index',
            component: index,
            meta: {
                massage: '店铺详情页面'
            }
        },
        // 登录页面
        {
            path: '/login',
            name: 'login',
            component: login
        },
        // 520登录页面
        {
            path: '/applogin',
            name: 'applogin',
            component: applogin
        },
        // 注册页面
        {
            path: '/registered',
            name: 'registered',
            component: registered
        },
        // 微信绑定手机号
        {
            path: '/bindTel',
            name: 'bindTel',
            component: bindTel
        },
        // 二级店铺详情页面
        {
            path: '/shopDetails',
            name: 'shopDetails',
            component: shopDetails,
            meta: {
                massage: '店铺详情页面'
            }
        },

        // 二级店铺详情页面更多图片
        {
            path: '/shopImg',
            name: 'shopImg',
            component: shopImg,
            meta: {
                requireAuth: true,
                massage: '更多图片'
            }
        },
        //营业资质图片
        {
            path: '/qualificationImg',
            name: 'qualificationImg',
            component: qualificationImg,
            meta: {
                requireAuth: true,
                massage: '更多图片'
            }
        },
        // 官方更多图片
        {
            path: '/officialImg',
            name: 'officialImg',
            component: officialImg,
            meta: {
                requireAuth: true,
                massage: '官方更多图片'
            }
        },
        // 二级店铺分类页面
        {
            path: '/goodClassify',
            name: 'goodClassify',
            component: goodClassify,
            meta: {

                massage: '店铺分类'
            }
        },
        // 二级信息管理页面
        {
            path: '/message',
            name: 'message',
            component: message,
            meta: {
                requireAuth: true,
                massage: '信息管理'
            }
        },
        // 二级搜索页面
        {
            path: '/searh',
            name: 'searh',
            component: searh
        },
        // 二级定位页面
        {
            path: '/orientation',
            name: 'orientation',
            component: orientation,
            meta: {
           
                massage: '信息管理'
            }
        },
        {
            path: '/selectAddress',
            name: 'selectAddress',
            component: selectAddress,
            meta: {
                requireAuth: true,
                massage: '首页选择地址'
            }
        },
        {
            path: '/newAddress',
            name: 'newAddress',
            component: newAddress,
            meta: {
                requireAuth: true,
                massage: '添加地址'
            }
        },
        {
            path: '/areaList',
            name: 'areaList',
            component: areaList,
            meta: {
                requireAuth: true,
                massage: '地址列表'
            }
        },
        // 支付成功
        {
            path: '/successful',
            name: 'successful',
            component: successful,
            meta: {
                requireAuth: true,
                massage: '信息管理'
            }
        },
        {
            path: '/Single',
            name: 'Single',
            component: Single,
            meta: {
                requireAuth: true,
                massage: '信息管理'
            }
        },
        // 我的模块页面
        ...mine,
        // 代理商招募页面
        ...recruit,
        // 用户卡
        ...member,
        // 商家管理
        ...management,
        // 提现
        ...bank,
        //分账提现
        ...banking,
        //评论
        ...comment,
        // 百度地图地区地址
        ...mapAdress,
        //运营商升级
        ...upgrade,
        //运营中心
        ...operation,
        // 人脉管理
        ...peopleManage,
        //商家端
        ...storeplat
    ]
})
