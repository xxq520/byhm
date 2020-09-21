<template>
    <div class="settings">
        <!-- 头部 -->
        <topnav :topnav="topnav" class="navs"></topnav>
        <div class="header">
            <div class="switch" @click="peiSong">
                <div class="act" :class="{'tianxuan':payShow==false}"> 配送 </div>
                <div class="act" :class="{'tianxuan':payShow==true}">自提</div>
            </div>
            <div v-if="paiWay==1">
                <div class="cart-list " @click="closeArea()">
                    <p class="lmain">
                        <img src="@/assets/images/shoppingMall/home_p2_icon_dw.png" style="margin-right: 0.2rem;">
                        <span v-if="!areadata" style="font-size: 0.62rem; color: #333;">请选择收货地址</span>
                        <label v-else class="diqu">
                            {{ areadata}}
                        </label>
                    </p>
                    <i class="el-icon-arrow-right mr-l-14" style="float: right;"></i>
                </div>
                <div class="user" v-if="areadata">{{ userName}} {{yingPhone(userPhone)}}</div>
                <div class="cart-list " @click="closeTime()">
                    <p class="lmain">
                        <img src="@/assets/images/shoppingMall/home_p5.png" style="margin-right: 0.2rem;">
                        <span v-if="!startTime" style="font-size: 0.6rem;color: #666; ">
                            请选择送出时间</span>
                        <label v-else class="diqu">
                            {{ startTime}}配送
                        </label>
                    </p>
                    <i class="el-icon-arrow-right mr-l-14" style="float: right;"></i>
                </div>
            </div>
            <div v-else>
                <div class="ziti">
                    <div class="cart-list  abs">
                        <div class="lmain"> <img src="@/assets/images/shoppingMall/home_p2_icon_dw.png">
                            <label class="diqu"> {{shopArea}} </label>
                        </div>
                        <div class="ztTime">可提货时间：{{tiTime}}</div>
                    </div>

                </div>
            </div>
        </div>
        <div class="tuijie">
            <div class="name">{{shopname}}</div>
            <div class="shopInfo" v-for=" item in list">
                <div class="left"><img :src="item.picUrl"></div>
                <div class="right">
                    <div class="shopname">{{item.goodsName}} </div>
                    <div class="a1">
                        <div>x{{item.goodsNum}} </div>
                        <div>￥{{item.retailPrice}} </div>
                    </div>
                </div>
            </div>
            <mt-cell title="配送费" class="line"><span class="item"
                    style="margin-right: 0.2rem;">￥{{peimoney==null?0:peimoney}}</span>
            </mt-cell>
            <mt-cell title="优惠券" class="line" @click.native="goqualificat"><span class="item" style="color: #FF4400;"
                    v-if="fwlist.length>0">{{couponId?'已优惠'+yhjmoney:fwlist.length+'张可用'}}<i
                        class="el-icon-arrow-right"></i>
                </span><span class="item" style="color: #777;" v-else>暂无可用 <i class="el-icon-arrow-right"></i> </span>
            </mt-cell>
        </div>
        <div class="footer">
            <div class="left">
                <div class="money"><span style="font-size: 0.6rem;">合计:</span>￥{{orderPrice}}</div>
                <div class="pei">已优惠<span style="color: #FF4400;">￥{{discountPrice}}</span></div>
            </div>
            <div class="right" @click="goShoporder">
                提交订单
            </div>
        </div>

        <mt-popup v-model="areaVisible" position="bottom">
            <div class="visiblebtn">
                <img src="@/assets/images/shoppingMall/zcgli_icon_del.png" class="card-text" @click="closeArea()">
            </div>
            <div class="hdmk">
                <li v-for="(item,index) in areaslist" class="araelist">
                    <div class="header" v-if="item.isOptional" @click="qiebtn(item,index)">
                        <img src="@/assets/images/shoppingMall/by_paym.png" v-if="imgbtn ==index">
                        <img src="@/assets/images/shoppingMall/by_pay.png" v-else>
                    </div>
                    <div class="mian">
                        <div class="middle">
                            <div style="color:#333;" v-if="!item.isOptional">
                                超出配送范围
                            </div>
                            <div style="color:#333;">
                                {{item.detailInfo}}
                            </div>
                            <div class="detail">
                                <div>{{item.userName}}</div>
                                <div>{{item.shippingSex}}</div>
                                <div>{{item.telNumber}}</div>
                            </div>
                        </div>
                        <div class="foer">
                            <img src="@/assets/images/shoppingMall/home_page.png" @click="editArea(item)">
                        </div>
                    </div>
                </li>
                <div class="addlist" @click="addArea">
                    <img src="@/assets/images/shoppingMall/by_page2_ic.png">
                    新增收货地址
                </div>
            </div>
        </mt-popup>
        <mt-popup v-model="timeVisible" position="bottom">
            <div class="timevis">
                <div class="acd">选择配送时间</div>
                <img src="@/assets/images/shoppingMall/zcgli_icon_del.png" class="card-text" @click="closeTime()">
            </div>
            <div class="mainb">
                <div class="left">
                    <div v-for="(v,idx) in timeList" :class="{'active2':timeIndex==idx}" class="days"
                        @click="timeqie(idx)"> {{v.dayAndWeek}}</div>
                </div>
                <div class="right">
                    <div class="hours" v-if=" timeIndex == 0&&ljShow" :class="{'active3':hoersIndex==9999}"
                        @click="hoursqie('立即',9999)">
                        <div>立即配送</div>
                        <img src="@/assets/images/shoppingMall/home_p2.png" v-if="hoersIndex==9999">
                    </div>
                    <div v-for="(c,i) in hoursList" class="hours" :class="{'active3':hoersIndex==i}"
                        @click="hoursqie(c,i)">
                        <div>{{c.hourTimes}}</div>
                        <img src="@/assets/images/shoppingMall/home_p2.png" v-if="hoersIndex==i">
                    </div>
                </div>
            </div>
        </mt-popup>

    </div>
</template>

<script type="text/javascript">
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
                topnav: {
                    title: '提交订单'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                applogin: false,
                id: this.$route.query.id ? this.$route.query.id : '',
                postData: {},
                shopImg: {},
                payShow: false,
                paiWay: 1,
                areadata: '',
                shopArea: '',
                userName: '',
                userPhone: '',
                tiTime: '',
                peimoney: '',
                shopname: '',
                orderPrice: '',
                list: [],
                areaslist: [],
                fwlist: [],
                goodsId: this.$store.state.shopcarId,
                areaVisible: false,
                timeVisible: false,
                startTime: '',
                imgbtn: null,
                discountPrice: '',
                timeList: [],
                hoursList: [],
                timeIndex: 0,
                hoersIndex: null,
                xuanTime: '',
                areaId: '',
                couponId: '',
                ljShow: true,
                yhjmoney: '',
                ziti: '',
                userPhone: this.$cookie.get('userPhone'),
            }
        },
        activated() {
            this.couponId = this.$store.state.shopcouId;
            this.getOrder();
        },
        mounted() {
            this.handler();
            this.getInfo();
            this.gettimeInfo();
            this.getZTInfo();
        },
        methods: {
            //获取店家是否开启自提功能
            getZTInfo() {
                let post = {
                    merchantId: this.id
                };
                axios({
                    url: this.Api1 + '/shop/otoMerchantConfig/selectMerConfig',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.ziti = data.selfTaking;
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //时间转换函数
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds();
                return Y + M + D + ' ' + h + ':' + m + ':00';
            },
            //切换选中的时间段
            hoursqie(val, i) {
                this.hoersIndex = i;
                if (i == 9999) {
                    this.startTime = val;
                    this.xuanTime = this.formData(new Date());
                } else {
                    this.startTime = val.currentTime;
                    this.xuanTime = val.currentTime;
                }
                this.timeVisible = false
            },
            //切换时间日期弹窗
            closeTime() {
                this.timeVisible = !this.timeVisible;
            },
            //切换选中日期
            timeqie(idx) {
                this.hoersIndex = null;
                this.timeIndex = idx;
                this.hoursList = this.timeList[idx].deliveryTimeList;
            },
            //编辑收货地址
            editArea(val) {
                this.$router.push({
                    path: '/newAddress',
                    query: {
                        id: val.id
                    }
                });
            },
            //切换地址tap
            qiebtn(val, idx) {
                this.imgbtn = idx;
                this.areadata = val.detailInfo;
                this.userName = val.userName;
                this.userPhone = val.telNumber;
                this.areaId = val.id;
                this.areaVisible = false
                this.getOrder();
            },
            //获取订单信息
            getOrder() {
                let post = {
                    couponId: this.couponId,
                    fromDevice: 'H5',
                    merId: this.id,
                    shipType: this.paiWay,
                    shippingAddressId: this.areaId
                };
                axios({
                    url: this.Api1 + '/order/confirmOrder',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shopArea = data.merchant.takingAddress;
                        this.tiTime = data.merchant.takingTime;
                        this.shopname = data.merchant.name;
                        this.list = data.orderDetails;
                        this.peimoney = data.freightPrice;
                        this.orderPrice = data.totalOrderPrice;
                        this.discountPrice = data.discountPrice;
                        this.yhjmoney = data.couponPrice;
                    } else {
                        if(res.data.message=="订单生成失败, 无结算商品"){
                             this.$router.push({
                             path: '/merchorder?merchid=1'
                             })
                        }
                        
                    }
                })
            },
            //获取收货地址列表
            getInfo() {

                axios({
                    method: "get",
                    url: this.Api1 + '/user/shippingAddress/queryAll',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    params:{
                        merId:this.id
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data
                        this.areaslist = data;
                    }
                })
            },
            //获取收货时间列表
            gettimeInfo() {
                let post = {
                    merchantId: this.id
                }
                axios({
                    method: "get",
                    params: post,
                    url: this.Api1 + '/shop/otoShipConfig/selectDeliveryTime',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data
                        if (data.deliveryTimeVOS.length > 0) {
                            this.timeList = data.deliveryTimeVOS;
                            this.ljShow = data.immediately;
                            this.timeqie(0);
                        }

                    }
                })
            },
            //新增地址
            addArea() {
                this.$router.push({
                    path: '/newAddress'
                });
            },

            //提交订单
            goShoporder() {
                if (this.paiWay == 1) {
                    if (this.areaId == null || this.areaId === '') {
                        Toast('请选择收货地址')
                        return false
                    }
                }
                if (this.paiWay == 1) {
                    if (this.xuanTime == null || this.xuanTime === '') {
                        Toast('请选择配送时间')
                        return false
                    }
                }
                let post = {
                    couponId: this.couponId,
                    fromDevice: 'H5',
                    merId: this.id,
                    shipType: this.paiWay,
                    shippingAddressId: this.areaId,
                    selectedDeliveryTime: this.xuanTime
                };
                axios({
                    url: this.Api1 + '/order/submitOrder',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data
                        this.couponIds('')
                        window.location.href = data.paySource.payUrl;
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //隐藏手机号码
            yingPhone(val) {
                return val.substring(0, 3) + "****" + val.substr(val.length - 4);
            },

            //切换地址弹窗
            closeArea() {
                this.areaVisible = !this.areaVisible;
            },
            //获取优惠券张数
            handler() {
                let post = {
                    goodsIds: this.goodsId,
                    userId: this.userid,
                    username: this.userPhone,
                    amount: this.$store.state.shopcarAm,
                    merchantId: this.id
                };
                axios({
                    url: this.Api1 + '/user/userVoucher/goodsVoucherList',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.fwlist = res.data.data.usableVoucherList;
                    }
                })
            },
            //去领券
            goqualificat() {
                this.$router.push({
                    path: '/comment/choiceRoll',
                    query: {
                        id: this.id
                    }
                });
            },
            //切换配送方式
            peiSong() {

                if (!this.payShow) {
                    if (this.ziti == 1) {
                        this.payShow = true;
                        this.paiWay = 0;
                        this.getOrder();
                    } else {
                        Toast('商家未开启自提功能，请选择配送方式下单')
                    }

                } else {
                    this.payShow = false;
                    this.paiWay = 1;
                    this.getOrder();
                }
            },

            ...mapMutations(["couponIds"])
        },

    }

</script>

<style scoped>
    .settings {
        min-height: 100vh;
        background: #f5f5f5;
        padding-bottom: 2rem;
        padding-top: 40px;
    }

    .settings .mineContent {
        padding: 0 0.4rem;
        background: white;
    }

    .settings .tuijie {
        padding: 0.5rem;
        background: white;
    }

    .navs {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .line {
        font-size: 0.55rem;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
    }

    .line:last-child {
        border: none;
    }

    .settings .mineContent .line #avatar {
        width: 30px;
        height: 30px;
    }

    .settings .mineContent .line #clear {
        width: 2.7778rem;
        height: 0.8444rem;
    }

    .settings .mineContent .line .item {
        font-size: 0.55rem;
        color: #666666;
    }

    .settings>>>.mint-msgbox {
        width: 60%;
    }

    .settings>>>.mint-cell-wrapper {
        background: none;
    }

    .mint-cell.line2 {
        background-color: #f5f5f5;

    }

    .settings>>>.mint-cell-title {
        font-size: 0.55rem;
    }

    .code02 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 20rem;
        padding: 0 10px;
        line-height: 1.8em;
    }

    .tuijie>>>.item {
        font-size: 0.55rem;
    }

    .tuijie>>>.mint-cell-text {
        font-size: 0.62rem;
        min-width: 3rem;
        display: inline-block;
    }

    .tuijie>>>.mint-cell-wrapper {
        padding: 0;
    }

    .tuijie .name {
        line-height: 2rem;
        font-size: 0.65rem;
        color: #666;
        border-bottom: 1px solid #eee;
    }


    .header {
        padding: 0.4rem;
        margin-bottom: 0.4rem;
        background-color: #fff;
    }

    .header .switch {
        display: flex;
        line-height: 1.2rem;
        border-radius: 0.6rem;
        width: 30%;
        background-color: #eee;
        color: #999;
        font-size: 0.6rem;
    }

    .mint-popup {
        width: 100%;
        border-radius: 0.5rem 0.5rem 0 0;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;

    }

    .visiblebtn .card-text {
        float: right;
        width: 0.7rem;
        height: 0.7rem;
    }

    .header .switch .act {
        width: 50%;
        border-radius: 0.6rem;
        text-align: center;
    }

    .header .switch .tianxuan {
        background-color: #FF9D19;
        color: #fff;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        font-size: 0.7rem;
        line-height: 1.4em;

    }

    .ziti {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .ziti .abs {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .header .user {
        font-size: 0.55rem;
        text-indent: 2em;
        color: #999;
    }

    .cart-box .cart-list .lmain {
        display: -webkit-flex;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem
    }

    .cart-list .lmain img {
        width: 0.5rem;
        height: 0.6rem;
    }

    .cart-list .ztTime {
        font-size: 0.6rem;
        color: #999;
        text-indent: 2em;
    }

    .diqu {
        line-height: 1rem;
        font-size: 0.58rem;
        color: #666;
    }

    .shopInfo {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0.3rem 0.3rem 0;
        font-size: 0.58rem;
        color: #666;

    }

    .shopInfo .left {
        width: 20%;
        border-radius: 5px;
        overflow: hidden;

    }

    .shopInfo .left img {
        width: 100%;
        height: 100%;

    }

    .shopInfo .right {
        flex: 1;
        padding-left: 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .shopInfo .right .shopname {
        line-height: 0.85rem;
        max-height: 1.7rem;
        overflow: hidden;
    }

    .shopInfo .right .a1 {
        line-height: 1.1rem;
        display: flex;
        justify-content: space-between;
        position: relative;
    }

    .settings>>>.picker-items {
        width: 100%;

    }

    .settings>>>.mint-datetime .picker-item {
        padding: 0;
    }

    .footer {
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        height: 2rem;
        display: flex;
        z-index: 99;
    }

    .footer .left {
        flex: 1;
        display: flex;
        justify-content: center;
        background-color: #212121;
        color: #f5f5f5;
        align-items: center;
    }


    .footer .left .money {
        font-size: 0.75rem;
        line-height: 1.1rem;
        margin-right: 0.5rem;
    }

    .footer .left .pei {
        font-size: 0.5rem;
        line-height: 0.9rem;
        color: #f5f5f5;
    }

    .footer .right {
        width: 30%;
        line-height: 2rem;
        text-align: center;
        background-color: #ff911e;
        color: #fff;
        font-size: 0.625rem;
    }

    .hdmk {
        max-height: 60vh;
        overflow: auto;
    }

    .hdmk::-webkit-scrollbar {
        display: none
    }

    .araelist {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .araelist .mian {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .araelist .mian .foer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 8%;

    }

    .araelist .mian .foer img {
        width: 0.65rem;
        height: 0.65rem;
    }

    .araelist .mian .middle {
        background-color: #fff;
        line-height: 1rem;
        padding: 0.3rem;
        padding-left: 0.5rem;
        font-size: 0.62rem;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-around;

    }

    .araelist .mian .middle:last-child {
        border-bottom: none;
    }

    .araelist .mian .middle .detail {
        display: flex;
        font-size: 0.55rem;
        color: #666;
        margin: 0.3rem 0;
    }

    .araelist .mian .middle .detail div {
        margin-right: 0.5rem;
    }

    .araelist .header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 10%;
    }

    .araelist .header img {
        width: 0.65rem;
        height: 0.65rem;
    }

    .addlist {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 90%;
        margin-left: 10%;
        height: 1.8rem;
        border-bottom: 1px solid #eee;
        font-size: 0.62rem;
        color: #ff4400;
        margin-bottom: 0.5rem;

    }

    .addlist img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
    }

    .timevis {
        display: flex;
        align-items: center;
        height: 1.8rem;
        color: #333;
        font-size: 0.58rem;
        padding: 0 0.5rem;
        margin-bottom: 0.8rem;
    }

    .timevis img {
        width: 0.7rem;
        height: 0.7rem;
    }

    .timevis .acd {
        flex: 1;
        text-align: center;
    }

    .mainb {
        display: flex;
        justify-content: space-between;
    }

    .mainb .left {
        background-color: #f5f5f5;
        color: #666;
        font-size: 0.52rem;
        width: 33%;
        height: 50vh;
        overflow: auto;
    }

    .mainb .right {
        background-color: #fff;
        color: #333;
        font-size: 0.58rem;
        width: 62%;
        height: 50vh;
        overflow: auto;
        padding: 0 0.5rem;
    }

    .mainb .right .hours {
        height: 2rem;

        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f5f5f5;
    }

    .mainb .right .hours img {
        width: 0.6rem;
        height: 0.45rem;
    }

    .mainb .right .active3 {
        color: #FF9D19;
    }

    .mainb .left::-webkit-scrollbar {
        display: none
    }

    .mainb .right::-webkit-scrollbar {
        display: none
    }

    .mainb .left .days {
        height: 2rem;
        line-height: 2rem;
        width: 100%;
        text-align: center;
    }

    .mainb .left .active2 {
        background-color: #fff;
        color: #333;
    }

</style>
