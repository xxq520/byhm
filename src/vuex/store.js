import Vue from "vue";
import vuex from "vuex";

Vue.use(vuex);

export default new vuex.Store({
    state: {
        map: {},
        mapPost: {},
        guideCloseShow: 0,
        withdrawal: [],
        xianshi: true, // 周期提现
        picture1: false, //行业协议
        picture2: false,
        tankuang: false,
        weixinshow: false,
        weixin1: false,
        weixin2: false,
        weixin3: false,
        weixin4: false,
        picture3: false,
        isShow: false,
        keepAlive: ['operation'],
        cityChoose:'',
        shopcarId:[],
        shopcarAm:'',
        shopcouId:'',
    },
    mutations: {
        changeMap(state, data) {
            state.map = data;
        },
        removeMap(state) {
            state.map = {};
        },
        changeMapPost(state, data) {
            state.mapPost = data;
        },
        removeMapPost(state) {
            state.mapPost = {};
        },
        // 周期提现
        addWithdrawal(state, data) {
            state.withdrawal = data;
        },
        removeWithdrawal(state, data) {
            state.withdrawal = [];
        },
        bnavx(state) {
            state.xianshi = false;
        },
        bbb(state) {
            state.xianshi = true; //底部导航控制
        },
        pictureView1(state) {
            state.picture1 = true;

        },
        pictureView2(state) {
            state.picture2 = true;

        },
        pictureView3(state) {
            state.picture3 = true;

        },
        pictureView(state) {
            state.picture = false;
            state.picture2 = false
            state.picture3 = false;
        },
        tankuang(state) {
            state.tankuang = true;
        },
        show(state) {
            state.weixinshow = true;

        },
        hide(state) {
            state.weixinshow = false
        },
        gb1(state) {
            state.weixin1 = true
        },
        gb22(state) {
            state.weixin2 = true
        },
        gb3(state) {
            state.weixin3 = true
        },
        gb4(state) {
            state.weixin4 = true
        },
        cityChose(state,data){
            state.cityChoose = data
        },
       //购物车ID
        shopCar(state, data) {
            state.shopcarId = data;
        },
        shopMoney(state, data){
            state.shopcarAm = data;
        },
        couponIds(state,data){
            state.shopcouId = data;         
        }

    }
})
