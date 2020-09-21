import 'babel-polyfill' //用了ES6语法  兼容IE浏览器的
import Es6Promise from 'es6-promise'

require('es6-promise').polyfill()

Es6Promise.polyfill()



import Vue from 'vue'
import App from '@/App' // 模块展示
import router from '@/router' // 路由
import store from "@/vuex/store"; // vuex 地址临时保存数据

// 公共组件
import topnav from '@/components/topnav'
import bottomnav from '@/components/bottomnav'
import loading from '@/components/loading'
import adressPopup from '@/components/adressPopup'
import recruitTop from '@/components/recruitTop'
import card from '@/components/card'
import openTime from '@/components/openTime'
import imgUpload from '@/components/imgUpload'
import recordNumber from '@/components/recordNumber'
import countyimgUpload from '@/components/countyimgUpload'
import firstTierSelection from '@/components/FirstTierSelection'
import shopcar from '@/components/shopcar'
import choosetime from '@/components/choosetime'
import share from '@/components/share.vue'

import preventReClick from '../preventReClick' //防多次点击，重复提交

import 'mint-ui/lib/style.css'; // mint-iu框架css
import MintUI from 'mint-ui'; // mint-iu框架
import {
    Indicator
} from 'mint-ui'; // mint-iu框组件，正在加载中
import {
    MessageBox
} from 'mint-ui'; // mint-iu框组件，有按钮弹出提示
import {
    Toast
} from 'mint-ui'; // mint-iu框组件，无按钮弹出提示，3秒消失
import {
    Popup
} from 'mint-ui';
import axios from 'axios'; // ajax封装插件
import qs from 'qs'; // axios提交数据是以json字符串提交，可以用qs模块改变提交qs.stringify({});
import vueCookie from 'vue-cookie'; // cookie保存，删除，获取插件
import VueJsonp from 'vue-jsonp';
import ElementUI from 'element-ui'; //elementUI组件库
import 'element-ui/lib/theme-chalk/index.css'; //element-ui的样式
import $ from 'jquery'; //引入全局jquery

import vuePictureViewer from 'vue-picture-viewer'
import pictureViewer from '@/components/pictureViewer'
Vue.use(vuePictureViewer)

import '@/assets/css/index.css'; // 公共样式
import appCookie from '@/assets/js/appCookie'; // 登录cookie保存方式
import clearCookie from '@/assets/js/clearCookie'; // 退出登录cookie删除方式

import Video from 'video.js'
import 'video.js/dist/video-js.css'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'


Vue.prototype.$video = Video;
Vue.config.productionTip = false;


Vue.use(preview);
Vue.use(VueJsonp);
Vue.use(vueCookie);
Vue.use(MintUI);
Vue.use(ElementUI);

import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: '1CctB0BFFpTAmKrPGREqoDThkqXbLC4T'
});
//图片懒加载
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/images/jiazai.png'), //请求失败后显示的图片
    loading: require('@/assets/images/jiazai.png'), //加载的loading过渡图片
    attempt: 1 // 加载图片数量
})
/*公用组件*/
Vue.component('topnav', topnav)
Vue.component('bottomnav', bottomnav)
Vue.component('loading', loading);
Vue.component('adressPopup', adressPopup);
Vue.component('shopcar', shopcar);
Vue.component('recruitTop', recruitTop);
Vue.component('card', card);
Vue.component('openTime', openTime);
Vue.component('imgUpload', imgUpload);
Vue.component('record-number', recordNumber);
Vue.component('picture-viewer', pictureViewer);
Vue.component('countyimgUpload', countyimgUpload);
Vue.component('firstTier-selection', firstTierSelection);
Vue.component('timeChoose', choosetime);
Vue.component('share', share);

// 线上
Vue.prototype.Auser = 'https://nfxts.520shq.com:7050'; // 爱之家用户
Vue.prototype.Alinks = 'https://nfxts.520shq.com'; // 爱之家商城跳转链接
Vue.prototype.Img = 'https://upload.520shq.com/'; // 图片上传
Vue.prototype.Api = 'https://by.520shq.com/api/'; // 接口ip
Vue.prototype.Api1 = 'http://oto.520shq.com/api'; // 020接口ip
Vue.prototype.YLApi = 'http://pf.520shq.com/html5/project/index.html#/'; //跳转发网的银联入驻
Vue.prototype.shq = 'http://nbhs2.520shq.com:92/localQuickPurchase/'; //生活圈



// 线上测试·
Vue.prototype.Auser = 'https://nfxts.520shq.com:7050'; // 爱之家用户
Vue.prototype.Alinks = 'https://fxyhjts.520shq.com'; // 爱之家商城跳转链接
Vue.prototype.Img = 'https://upload.520shq.com/'; // 图片上传
Vue.prototype.Api = 'https://byts.520shq.com:3443/api/'; // 旧接口ip
Vue.prototype.Api1 = 'http://otots.520shq.com:8201/api'; // 020接口ip
Vue.prototype.YLApi = 'http://pf.520shq.com/html5/project/index.html#/'; //跳转批发网的银联入驻
Vue.prototype.shq = 'http://nbhs2.520shq.com:92/localQuickPurchase/';




// 线下
// Vue.prototype.Auser = 'http://192.168.1.191/'; // 爱之家用户
// Vue.prototype.Alinks = 'http://192.168.1.223'; // 爱之家商城跳转链接
// // Vue.prototype.Img = 'http://192.168.1.24:10000/'; // 图片上传
// // Vue.prototype.Api1 = '/api'; // 跨域接口ip
// Vue.prototype.Api1 = 'http://192.168.1.88:8201/api'; // 接口ipS
// // Vue.prototype.Api = 'http://192.168.1.24:8082/api/'; // 接口ipSS
// Vue.prototype.Api = 'http://192.168.1.88:8088/api/'; // 接口ip
// Vue.prototype.YLApi = 'http://192.168.1.36:1099/html5/project/index.html#/'; //跳转批发网的银联入驻 
// Vue.prototype.shq = 'http://192.168.1.43:9083/localQuickPurchase/'; //生活圈 





//头像上传
Vue.prototype.Head = 'http://imq.520shq.com:60/';
// 支付跳转ip
Vue.prototype.Price = 'http://pay.520shq.com/'; // 线上 
// Vue.prototype.Price = 'http://payts.520shq.com/'; // 线上测试    
// 支付跳转ip
Vue.prototype.Ak = '95qe9LWme6C13wI6IaM15lj9w6FmvM47';


window.isKai = false;
window.qs = qs;
window.axios = axios; //ajax库
window.Toast = Toast;
window.Popup = Popup;
window.Indicator = Indicator;
window.MessageBox = MessageBox; // 弹窗插件
window.$ = $; // 引入全局$符号为jquery
window.appCookie = appCookie; // 登录cookie
window.clearCookie = clearCookie; // 退出登录cookie

//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 3;
axios.defaults.retryDelay = 3000;


// 设置全局请求头
// axios.interceptors.request.use(
//     config => {
//              config.headers['Content-Type'] = "application/json; charset=UTF-8";
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );
axios.interceptors.response.use(
    response => {
        if (response.data.code == 401) {
            clearCookie();

            if (sessionStorage.getItem('applogin')) {
                window.action.backAPPLogin();
            } else {
                // Toast(response.data.msg || response.data.errmsg);
                router.push({
                    path: '/login'
                });
            }
            return;
        } else if (response.data.code == 402) {
            axios({
                method: "post",
                url: Vue.prototype.Api1 + '/user/author/refreshToken',
                headers: {
                    "X-Nideshop-Token": vueCookie.get("token")
                }
            }).then(res => {
                if (res.data.code == 200) {
                    vueCookie.set("token", res.data.data);
                    setTimeout(() => {
                        router.go(0)
                    }, 1000);

                }
            })
        };
        return response;
    },
    err => {
        var config = err.config;
        if (err && err.response) {
            Indicator.close();
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误'
                    break
                case 401:
                    err.message = '未授权，请登录'
                    break
                case 403:
                    err.message = '拒绝访问'
                    break
                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`
                    break
                case 408:
                    err.message = '请求超时'
                    break
                case 500:
                    err.message = '服务器内部错误'
                    break
                case 501:
                    err.message = '服务未实现'
                    break
                case 502:
                    err.message = '网关错误'
                    break
                case 503:
                    err.message = '服务不可用'
                    break
                case 504:
                    err.message = '网关超时'
                    break
                case 505:
                    err.message = 'HTTP版本不受支持'
                    break
            }
        };
        if (!config || !config.retry) return Promise.reject(err);

        config.__retryCount = config.__retryCount || 0;

        if (config.__retryCount >= config.retry) {
            return Promise.reject(err);
        }

        config.__retryCount += 1;
        var backoff = new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, config.retryDelay || 1);
        });

        return backoff.then(function () {
            return axios(config);
        });
    });

// 使用Vue.mixin的方法拦截了路由离开事件，并在该拦截方法中实现了销毁页面缓存的功能。
// 当页面跳转到百度地图地区地址定位选择页面mapAdress时不清除缓存
Vue.mixin({
    beforeRouteLeave: function (to, from, next) {

        if (to.name !== 'mapAdress' && from.name !== 'operation' && to.name != 'choiceRoll' && to.name != 'Merchlist' && to.name != 'merchOrder') {
            if (this.$vnode && this.$vnode.data.keepAlive) {
                if (this.$vnode.parent && this.$vnode.parent.componentInstance && this.$vnode.parent.componentInstance.cache) {
                    if (this.$vnode.componentOptions) {
                        var key = this.$vnode.key == null ?
                            this.$vnode.componentOptions.Ctor.cid + (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '') :
                            this.$vnode.key;
                        var cache = this.$vnode.parent.componentInstance.cache;
                        var keys = this.$vnode.parent.componentInstance.keys;

                        if (cache[key]) {
                            if (keys.length) {
                                var index = keys.indexOf(key);
                                if (index > -1) {
                                    keys.splice(index, 1);
                                }
                            }
                            delete cache[key];
                        }
                    }
                }
            };
            this.$destroy();
        };
        next();
    },
});
// 路由拦截
router.beforeEach((to, from, next) => {
    if (to.name == 'application' && from.path == '/') {
        sessionStorage.setItem('shopfios', to.name)
    }
    // 清除页面中loading插件
    // 阻止跳转页面不在顶部
    // kefu因为在某些页面上是隐藏的所以在这里要先启动
    Indicator.close();
    $('#app').scrollTop(0);
    // to.query.platform判断来源android或者ios
    if (to.query.platform == 'android' || to.query.platform == 'ios' || to.query.platform == 'Ios') {

        // android或者ios需要把登录返回信息传过来，在跳转页面保存，页面做伪登录效果。从而不使页面空白，确保页面接口正常使用。
 
        sessionStorage.setItem('appfrom', true); // app登录跳转识别
      
        sessionStorage.setItem('applogin', true);
        if (to.path == "/settings/ChangeCode") {
            next();
        }

        if (to.name == 'application' && from.path == '/') {
            sessionStorage.setItem('shopApp', to.name)
        }
    //   console.log(from.fullPath, to.fullPath,"65");
        if (from.fullPath == '/' || to.fullPath == '/shqGoodDetail') {
            clearCookie();
               window['getAddres'] = function (res) {
                   let data = JSON.parse(res)
                   if (!data.district) {
                       data.district = null
                   }
                   if (!data.street) {
                       data.street = null
                   }
            
                   sessionStorage.setItem('cityMap', data.city);
                   sessionStorage.setItem('provMap', data.province);
                   sessionStorage.setItem('distMap', data.district);
                   sessionStorage.setItem('address', data.street);
                   sessionStorage.setItem('LngLats', JSON.stringify({
                       lng: data.longitude,
                       lat: data.latitude
                   }));
               }
            window['getAppLogin'] = function (text) {
            
                appCookie(text);
                setTimeout(function () {
                    // app登录跳转识别
                    sessionStorage.setItem('login', true);
                    next();
                }, 50);
            }

            if (to.meta && to.meta.requireAuth) { // 判断该路由是否需要登录权限

                setTimeout(function () {
                    if (vueCookie.get("token") && vueCookie.get("token") != 'undefined') { //判断是否已经登录
                        next();
                    } else {

                        try {
                            window.action.backAPPLogin();
                        } catch (err) {
                            next({
                                path: '/login'
                            })
                        }
                    }
                }, 1000);
            } else {

                next();
            };

            if (to.path == "/settings/ChangeCode") {
                next();
            }
        } else {
            if (to.meta && to.meta.requireAuth) { // 判断该路由是否需要登录权限
                setTimeout(function () {
                    // console.log(vueCookie.get("token"), "6")
                    if (vueCookie.get("token") && vueCookie.get("token") != 'undefined') { //判断是否已经登录
                        next();
                    } else {
                        window.action.backAPPLogin();
                    }
                }, 500);
            } else {

                next();
            };

        }

    } else {
        if (isKai == false) {
            if (to.name == 'MineIndex') {
                to.meta.requireAuth = true;
            }
        }

        sessionStorage.setItem('login', true);
        if (to.meta && to.meta.requireAuth) { // 判断该路由是否需要登录权限
            if (vueCookie.get("userPhone") && vueCookie.get("token")) { //判断是否已经登录
                next();
            } else {
                // Toast('登录后进入' + to.meta.massage);
                sessionStorage.setItem('fullPath', to.fullPath);
                clearCookie();
                setTimeout(function () {
                    next({
                        path: '/login'
                    })
                }, 50);
            }
        } else {

            next();

        };
    }
});

// vue实例化
new Vue({
    el: '#app',
    router,
    store,
    components: {
        App
    },
    template: '<App/>',
    created() {
        if (vueCookie.get("userPhone")) { //判断是否已经登录,
            let params = this.$cookie.get('card');
            let isA = this.$cookie.get('isActive');
            axios.post(this.Api + '/user/queryByCardNo?cardNo=' + params).then(res => {
                let data = res.data;
                // console.log(res)
                if (isA == 0) { // 判断是否是改变支付购买状态
                    let expire = new Number(this.$cookie.get('expire'));
                    let times = expire / (60 * 60) + 'h'; // 设置过期时间12h
                    this.$cookie.set('level_id', data.levelId, {
                        expires: times
                    }); // 代理商级别
                    this.$cookie.set('vip_type', data.type, {
                        expires: times
                    }); // 用户级别
                    this.$cookie.set('vip_time', data.expireTime, {
                        expires: times
                    }); // 用户过期时间
                    this.$cookie.set('isActive', data.isActive, {
                        expires: times
                    }); // 判断是否是用户
                    this.$cookie.set('isPartner', data.isPartner, {
                        expires: times
                    }); // 合同状态
                }
            })
        };

        axios({
            method: 'get',
            url: this.Api + 'showstatus/showStatus?type=2',
        }).then(res => {

            if (res.data.code == 0) {
                if (res.data.data == 0) {
                    isKai = false
                } else {
                    isKai = true
                }

            }
        })

    },

    beforeDestroy() {
        //清除首页银联入驻弹框缓存
        this.$cookie.delete('isShow');
    }
})
