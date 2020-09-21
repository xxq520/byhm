<template>
    <div id="mainbox">
        <div class="mainbox" id="sllbody">

            <mt-header :title="topnav.title">
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
                <mt-button icon="more" slot="right" @click="changeTab"></mt-button>
            </mt-header>
            <!--  -->
            <div class="topTab" v-if="topTab">
                <!-- <p @click="goComment"><span><img src="@/assets/images/comment-icon.png" alt="" /></span>评论商家</p> -->
                <p @click="goWelfare"><span><img src="@/assets/images/user-icon.png" alt="" /></span>用户福利</p>
                <p @click="showShare"><span><img src="@/assets/images/13.png" alt="" /></span>店铺分享</p>
            </div>
            <!--toubu-->
            <div class="column-img">
                <mt-swipe :auto="4000" :show-indicators="false" @change="handleChange">
                    <mt-swipe-item v-for="(item,index) in shopImg" :key="index"><img :src="item"></mt-swipe-item>
                </mt-swipe>
                <router-link :to="`/shopImg?id=${id}`" class="col"><i class="el-icon-picture-outline"></i>{{ allimg }}
                </router-link>
            </div>
            <div class="topbox">
                <div class="topname">
                    <span>{{ postData.name }}</span>
                    <img :src="postData.icon" v-if="postData.isRecommend">
                </div>
                <div class="score">
                    <el-rate v-model="score" disabled text-color="#f86b1f" :colors="['#f86b1f', '#f86b1f', '#f86b1f']">
                    </el-rate>
                    <div class="slist">{{ score }}分({{ comments }}人评)

                    </div>
                </div>
                <div class="business">
                    <p>营业时间：{{ postData.openTime }}</p>
                </div>
                <div class="tel">
                    <span v-if="backshqPd" @click="mobilefn(postData.mobile)"><img
                            src="@/assets/images/xqdh.png"></span>
                    <span v-else><a :href="'tel:'+postData.mobile"><img src="@/assets/images/xqdh.png"></a></span>
                </div>
                <div class="address" @click="mappopupfn(postData)">
                    <span><i class="el-icon-location"></i>{{ categoryfn(postData.distance) }}</span>
                    <p>{{ addressfn([postData.province, postData.city, postData.county, postData.address]) }}</p>
                    <div class="daohang">导航</div>
                </div>
            </div>
            <!-- <div class="pochang">
                <div class="left">
                    <div class="name">优惠买单</div>
                    <div class="text">买单享受低扣券优惠</div>
                </div>
                <div class="right" @click="goPay()">买单 </div>
            </div> -->
            <div class="detailed">
                <div class="tabnav">
                    <ul>

                        <li @click="youhui($event,'preferential')"><a>店铺优惠<i></i></a></li>

                        <li @click="youhui($event,'storeImage')"><a>环境<i></i></a></li>

                        <!-- <li @click="youhui($event,'comments')"><a>评论<i></i></a></li> -->
                        <li @click="youhui($event,'information')"><a>商家信息<i></i></a></li>

                    </ul>
                </div>
                <div class="preferential scrolllist" id="preferential">
                    <preferential></preferential>
                </div>
                <!--店铺图片-->
                <div class="storeimg scrolllist" id="storeImage">
                    <div class="detailhead">
                        <p>环境</p>
                    </div>
                    <div class="imgbox" v-if="imageCollection.length > 0">
                        <ul>
                            <li v-for="(item,i) in imageCollection" :key="i">

                                <img v-lazy="item.imgUrl">
                            </li>
                        </ul>
                    </div>
                </div>
                <!---->
                <!--用户评论-->
                <!-- <div class="comments scrolllist" id="comments">
                    <div class="detailhead">
                        <p>评论</p>
                        <router-link :to="`/comment/commentList?id=${id}&category=${postData.category}`">
                            更多评论({{ count }}条)</router-link>
                    </div>
                    <div class="commentbox">
                        <comments :category="postData.category" @count="getcount"></comments>
                        <div class="cart-list">
                            <label>查看全部评论</label>
                            <router-link :to="`/comment/commentList?id=${id}&category=${postData.category}`"
                                class="lmain">{{ count }}条<i class="el-icon-arrow-right mr-l-14"></i></router-link>
                        </div>
                    </div>
                </div> -->
                <!---->
                <!--商家信息-->
                <div class="information scrolllist" id="information">
                    <div class="detailhead">
                        <p>商家信息</p>
                    </div>
                    <div class="inforbox">
                        <div class="infortext">{{ introduce }}</div>
                    </div>
                </div>
                <div class="information scrolllist" style="margin-bottom:2rem;">
                    <div class="detailhead">
                        <label>营业资质</label>
                        <router-link :to="`/qualificationImg?id=${id}`" class="lmain"><i
                                class="el-icon-arrow-right mr-l-14" style="font-size: 25px;"></i>
                        </router-link>
                    </div>

                </div>
            </div>
        </div>
        <!--地图展示-->
        <mt-popup v-model="mapVisible" position="middle" class="mappopup">
            <mt-header title="地图显示" fixed
                style="background:#ff911e;height:40px; z-index: 999;-webkit-overflow-scroll:touch">
                <mt-button slot="left" icon="back" @click="mapVisible = false" style="font-size: 16px;">返回</mt-button>
                <mt-button slot="right" @click="navigat" style="font-size: 16px;">导航</mt-button>
            </mt-header>
            <div style="width:100%;height:100%;">
                <gaodeMap v-if="center.text && center.lnglat" :cented="center" :visible.sync="mapVisible"></gaodeMap>
            </div>
        </mt-popup>
        <mt-popup class="pop1" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <div class="shareItem">
                <div class="title" style="backgound:#ccc"><img src="@/assets/images/wx-share.png" alt=""></div>
            </div>
            <button class="cancelBtn" @click="hidePop">取消</button>
        </mt-popup>
    </div>
</template>

<script>
    import wx from "weixin-js-sdk";
    import wxshare from './wxshare1.js';
    import gaodeMap from '@/components/gaodeMap' // 地图组件
    import preferential from './preferential' // 优惠组件
    import comments from './comments' // 评论组件
    import {
        constants
    } from 'fs';
    export default {
        name: 'shopDetails',
        data() {
            return {
                topnav: {
                    title: '店铺详情',
                    comment: true
                },
                postData: [],
                id: this.$route.query.id,
                shopImg: [],
                otherQualication: [],
                score: 0,
                tabnav: 0,
                center: {},
                mapVisible: false,
                allimg: 0,
                average: 0,
                comments: 0,
                bizLicence: '',
                introduce: '',
                imageCollection: [],
                count: 0,
                scrollnum: 0,
                cardType: this.$cookie.get('cardType'),
                backshqPd: sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route
                    .query.platform == 'ios',
                topTab: false,
                code: this.$cookie.get('card'),
                popupVisible: false,
                inviteCode: this.$route.query.code,
                isActive: this.$cookie.get('isActive'),
                userid: this.$cookie.get('userid'),

                goodsCount: 0,
                mobile: '',
                shqseq: this.$route.query.seq,
                hui: []

            }
        },
        components: {
            gaodeMap,
            preferential,
            comments
        },
        mounted() {
            let shareCode = this.$route.query.shareCode
            if (shareCode) {
                sessionStorage.setItem('shareCode', shareCode);
            }
            this.id = this.id ? this.id : '';
            this.shqseq = this.shqseq ? this.shqseq : '';
            sessionStorage.removeItem('shaid', this.id);
            this.tabnav = this.setTop($('.tabnav')[0]) - 40 - $('.tabnav').height(); // tabnav启用固定定位样式所在
            // this.boxscroll();
            this.handler();
            // 流量
            axios.get(this.Api + 'mechantprint/saveOrUpdate?merid=' + this.id + '&seq=' + this.shqseq).then(res => {});
            $('#mainbox').on('scroll', this.boxscroll); // 启动滚动条事件
            this.fenxiang();
            if (this.userid) {
                this.fenshop();
            }
        },
        methods: {
            getdis() {
                let post = {
                    seq: this.seq,
                    id: this.id,
                };
                axios({
                    url: this.Api + '/voucher/showVoucher',
                    params: post,
                    method: "get",
                    headers: {

                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data
                        this.hui = data.voucherVOS;
                        console.log(data.voucherVOS);

                    }
                })
            },
            //去买单 
            goPay() {
                this.$router.push({
                    path: "/Single",
                    query: {
                        id: this.id
                    }
                })
            },
            //跳转到520商品列表
            allsShop() {
                this.$router.push({
                    path: "/allGoods",
                    query: {
                        shopSeq: this.seq

                    }
                })
            },

            //判断是否有装地图
            navigat() {
                var that = this;
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (result) {
                    // console.log(result)
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        var latCurrent = result.point.lat; //获取到的纬度
                        var lngCurrent = result.point.lng; //获取到的经度
                        if (latCurrent && lngCurrent) {
                            var scheme = '';
                            console.log(that.center)
                            var queryStr = '?origin=name:我的位置|latlng:' + latCurrent + ',' + lngCurrent + '&destination=' + that.center.lnglat[1] + ',' + that.center.lnglat[0] +
                                '&region=' + that.center.address + '&coord_type=bd09ll&mode=driving';
                                console.log(queryStr);
                                
                            if (that.$route.query.platform == 'ios') {
                                // ios 端
                                scheme = 'baidumap://map/direction' + queryStr;
                            } else {
                                // android 端
                                scheme = 'bdapp://map/direction' + queryStr;
                            }

                            // 主要实现代码
                            window.location.href = scheme;

                            var startTime = Date.now();
                            var count = 0;
                            var endTime = 0;

                            var t = setInterval(function () {
                                count += 1;
                                endTime = Date.now() - startTime;
                                if (endTime > 800) {
                                    clearInterval(t);
                                }
                                if (count < 30) return;
                                if (!(document.hidden || document.webkitHidden)) {
                                    window.location.href = 'https://api.map.baidu.com/direction' +
                                        queryStr + '&output=html';
                                }
                            }, 20);
                            window.onblur = function () {
                                clearInterval(t);
                            };
                        } else {
                            alert('获取不到定位，请检查手机定位设置');
                        }
                    }
                });
            },
            //  判断是否是分享店铺过来的
            fenshop() {
                if (this.inviteCode && this.code != this.inviteCode && this.isActive == 0) {
                    MessageBox({
                        title: '温馨提示',
                        message: "您还不是惠盟用户，建议您进行缴纳1元成为试用会员，享受更多福利",
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        closeOnClickModal: false
                    }).then(action => {
                        if (action === 'confirm') {
                            sessionStorage.setItem('shaid', this.id);
                            this.$router.push({
                                name: 'experience',
                                params: {
                                    code: this.inviteCode,
                                    level: 1,
                                    cardType: 11
                                }
                            })
                        } else {
                            wx.closeWindow();

                            clearCookie();

                        }
                    });
                }
            },
            fenxiang() {
                let url = window.location.href + '&inviteCode=' + this.inviteCode;
                axios.post(
                        "http://by.520shq.com/api/wechat/wechatParam?url=" +
                        window.location.href.split("#")[0]
                    )
                    .then(res => {
                        console.log(res, '33')
                        if (res.status == 200) {

                            let data = res.data;

                            this.signature = data.signature;
                            this.timestamp = data.timestamp;
                            this.nonceStr = data.nonceStr;
                            wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: "wxd4d112b4765d1b4b",
                                timestamp: this.timestamp,
                                nonceStr: this.nonceStr,
                                signature: this.signature,
                                jsApiList: [
                                    "onMenuShareAppMessage",
                                    "onMenuShareTimeline",
                                    "translateVoice",
                                    "onMenuShareQQ",
                                    "onMenuShareQZone"
                                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });

                        } else {
                            Toast("网络错误，请重试！");
                        }
                    });
            },
            showShare() {
                let url = window.location.host + '/#/shopDetails?id=' + this.id + '&shareCode=' + this.inviteCode;

                this.topTab = false;
                var that = this;
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {

                    this.popupVisible = true;
                    wxshare(url);

                } else {
                    let titleStr = "邀您成为惠盟商家 \n 共享惠盟无限商机";
                    let desc = "百业惠盟欢迎您——";
                    let imgUrl = require("@/assets/images/dp_tx_nmtx.png");
                    let links = window.location.host + '/#/shopDetails?id=' + this.id + '&shareCode=' + this.code;

                    if (this.$route.query.platform == 'ios') {

                        window.action.ShareLinks(titleStr, desc, imgUrl, links);
                    } else {
                        Toast("请在微信浏览器中分享");
                    }
                }

            },
            hidePop() {
                this.popupVisible = false;
            },

            changeTab() {
                this.topTab = !this.topTab;

            },
            tiaozhuang() {

            },
            goComment() {
                this.topTab = false;
                this.$router.push({
                    path: `/comment/pushComment?id=${this.id}&category=${this.postData.category}`
                })
            },
            goWelfare() {
                this.topTab = false;
                if (this.backshqPd) {

                    window.action.backAPPUser();
                } else {

                    this.$router.push({

                        name: "toBecomeMember",
                        params: {
                            code: 0,
                            level: 1,
                            cardType: this.cardType
                        }
                    });

                }

            },
            goback() {
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else {
                    if (window.history.length > 1) {
                        this.$router.go(-1);
                    }else{
                        this.$router.push({
                        path: '/'
                        });
                    }
                  

                }
            },
            getcount(val) {
                this.count = val;
            },
            // 安卓电话方法
            mobilefn(number) {
                window.action.phoneCall(number);
            },
            // 打开地图
            mappopupfn(obj) {

                if (!this.center.text && !this.center.lnglat) {
                    Toast('无法定位该店铺位置。')
                } else {
                    if (this.backshqPd) {
                        let that = this;
                        window.action.mapLngLat(JSON.stringify({
                            lng: obj.lng,
                            lat: obj.lat,
                            address: obj.address
                        }));
                    } else {
                        this.mapVisible = true;
                    }
                }
            },
            // 地址
            addressfn(arr) {
                let text = '';
                arr.forEach(post => {
                    if (post) text += post;
                });
                this.adresstext = text;
                return text;
            },
            // 距离
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 100) / 100 + 'km';
                    } else {
                        distance = distance + 'm';
                    }
                    return distance;
                }
            },
            handler() {


                if (this.$route.query.lat && this.$route.query.lng) {
                    sessionStorage.setItem('LngLat', JSON.stringify({
                        lng: this.$route.query.lng,
                        lat: this.$route.query.lat
                    }));
                };
                let cityChange = this.$cookie.get('cityChange');
                let LngLat = JSON.parse(sessionStorage.getItem('LngLat'));
                let param = {
                    seq: this.shqseq,
                    merid: this.id,
                    lng: !cityChange && LngLat && LngLat.lng ? LngLat.lng : '',
                    lat: !cityChange && LngLat && LngLat.lat ? LngLat.lat : ''
                };
                Indicator.open();
                axios({
                    url: this.Api + 'merchant/queryHomepage',
                    params: param,
                    method: "get"
                }).then(res => {
                    Indicator.close();
                    if (res.data.code == 0) {
                        let data = res.data.resultMap
                        this.shopImg = data.pictureUrl;
                        this.allimg = data.totalPicture;
                        this.postData = data.merchantVo;
                        this.seq = data.merchantVo.seq;
                        this.average = data.averageConsumption;
                        this.comments = data.comments;
                        this.mobile = data.merchantVo.mobile;
                        if (data.grade && data.grade == 0 || data.grade == "") {
                            this.score = 4;
                        } else {
                            this.score = data.grade;
                        }
                        let map = {};
                        map.lnglat = []
                        map.lnglat.push(this.postData.lng);
                        map.lnglat.push(this.postData.lat);
                        map.address = this.postData.address;
                        map.province = this.postData.province;
                        map.city = this.postData.city;
                        map.county = this.postData.county;
                        map.text = this.postData.name;
                        this.center = map;
                        console.log(this.center, '8');

                    }
                }).catch(err => {
                    Indicator.close();
                })
                // 店铺信息
                axios({
                    url: this.Api + 'merchant/queryMerchantInfo?merid=' + this.id + '&seq=' + this.shqseq,
                    method: "get"
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.resultMap;
                        this.introduce = data.introduce;
                        this.bizLicence = data.bizLicence;
                        this.otherQualication = data.merchantOtherQualification;
                    }
                });
                // 店铺图片
                axios({
                    url: this.Api + 'merchant/queryMerchantPicture?type=1&merid=' + this.id + '&seq=' + this
                        .shqseq,
                    method: "get"
                }).then(res => {
                    let data = res.data;
                    if (data.code == 0) {
                        this.imageCollection = data.list;
                    };
                });
            },

            tabnavfn(n) {
                let that = this;
                if (n >= this.tabnav) {
                    $('.tabnav').addClass('tabhover');
                } else {
                    $('.tabnav').removeClass('tabhover');
                };
            },
            handleChange(val) {

            },
            // 点击定位到相关位置
            youhui(elem, val) {
                let el = elem.currentTarget;
                // console.log(el);
                let that = this;
                let height = this.setTop($('#' + val)[0]) - 40 - $('.tabnav').height();
                that.tabnavfn(height);
                $('#mainbox').off('scroll', this.boxscroll); // 停止mainbox滚动条事件
                $('.tabnav li').removeClass('hover');
                $(el).addClass('hover');
                $('#mainbox').animate({
                    scrollTop: height
                }, 500, function () {
                    let top = $('#mainbox')[0].scrollTop + $('#mainbox').height() == $('#sllbody').height() ||
                        $('#mainbox')[0].scrollTop == height;
                    // if (val == 'storeImage') that.storeImagefn(height);
                    setTimeout(() => {
                        if (top) {
                            $('#mainbox').on('scroll', that.boxscroll); // 当事件完成后启动mainbox滚动条事件
                        }
                    }, 100);
                });
            },


            setTop(elem) {
                var top = elem.offsetTop,
                    parent = elem.offsetParent;
                while (parent !== null) {
                    top += parent.offsetTop,
                        parent = parent.offsetParent;
                }
                return top;
            }
        }
    }

</script>

<style scoped>
    .pop1 {
        width: 100%;
        background-color: #fff;
        /* position: relative; */
    }

    .pop1 .shareItem .title {
        width: 100%;
        height: 80%;
        background: #000;
        opacity: 0.8;
    }

    .pop1 .shareItem .group ul {
        overflow: hidden;
        width: 15.3333rem;
        margin: 1.3333rem auto 1rem;
    }

    .pop1 .shareItem .group ul li {
        float: left;
        width: 20%;
        display: flex;
        text-align: center;
    }

    .pop1 .shareItem .group ul li img {
        width: 2rem;
        height: 2rem;
    }

    .pop1 .shareItem .group ul li .name {
        font-size: 0.6222rem;
        color: #666666;
    }

    .pop1 .shareItem .group ul li a {
        display: block;
    }

    .pop1 .cancelBtn {
        width: 100%;
        height: 2rem;
        background-color: #F2F2F2;
        color: #666666;
        font-size: .6667rem;
        border: none;
        outline: none;
    }

    #mainbox {
        width: 100%;
        height: 100%;
        padding-top: 40px;
        overflow: auto;
    }

    #mainbox>>>.mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .8rem;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 999;
    }

    #mainbox::-webkit-scrollbar {
        display: none
    }

    /* 隐藏滚动条 */
    .mainbox {
        min-height: 100vh;
        background: #f2f2f2;
    }

    .column-img {
        position: relative;
        height: calc(100vw*0.53);
        max-height: 400px;
    }

    .column-img img {
        display: block;
        height: 100%;
    }

    .col {
        position: absolute;
        right: 10px;
        bottom: 10px;
        background: rgba(0, 0, 0, 0.4);
        color: white;
        border-radius: 5rem;
        padding: 0.2rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .topbox {
        background: white;
        margin-bottom: 0.5rem;
        padding: 10px;
        position: relative;


    }

    .topbox .tel {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
    }

    .topbox img {
        margin-left: 0.5rem;
        width: 1rem;
        height: 1rem;
        position: relative;
        top: 0.3rem;
    }

    .topname {
        font-size: 17px;
        line-height: 1.4em;
        padding-bottom: 0.4em;
    }

    /* >>> */
    .score {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        align-items: center;
        padding-bottom: 0.2em;
    }

    .score>>>.el-rate {
        height: auto;
        overflow: hidden;
        float: left;
    }

    .score>>>.el-rate__icon {
        font-size: 15px;
        margin-right: 0.2em;
    }

    .score>>>.el-rate__item {
        float: left
    }

    .score>>>.el-rate__text {
        line-height: 15px;
        float: left;
    }

    .score>>>.slist {
        font-size: 0.6rem;
        color: #666;
        float: left;
        line-height: 16px;
        padding-left: 0.5em;
    }

    .score>>>.slist span {
        font-size: 0.6rem;
        color: #ccc;
        padding: 0 10px;
    }

    /**/
    .business {
        overflow: hidden;
        font-size: 0.6rem;
        color: #999;
        line-height: 1.4em;
        padding-bottom: 0.2em;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .business p {
        float: left;
    }

    .business span {
        float: right;
    }

    .business span img {
        font-size: 13px;
        width: auto;
        height: 1.4em;
    }

    .address {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
    }

    .address span {
        float: left;
        font-size: 0.6rem;
        color: #f86b1f;
        padding-right: 0.5em;
        margin-right: 0.5em;
        border-right: 1px solid #ccc;
    }

    .address p {
        float: left;
        font-size: 0.6rem;
        color: #333;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* detailed */
    .detailed {
        overflow: hidden;
    }

    .detailed .tabnav {
        overflow: hidden;
        width: 100%;
        background: white;
        border-bottom: 1px solid #ccc;
    }

    .daohang {
        color: #f86b1f;
        width: 50px;
        font-size: 16px;
        display: inline-block;
        text-align: center;
    }

    .detailed .tabnav ul {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .detailed .tabnav ul li {
        overflow: hidden;
        text-align: center;
        flex-grow: 1;
        font-size: 0.65rem;
    }

    .detailed .tabnav ul li a {
        display: inline-block;
        position: relative;
        font-size: 0.62rem;
        padding: 0.6em 0;
        color: #666;
    }

    .detailed .tabnav ul li a i {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
    }

    .detailed .tabnav ul li.hover a {
        color: #f86b1f;
    }

    .detailed .tabnav ul li.hover a i {
        background: #f86b1f;
    }

    /* preferential */
    .preferential {
        overflow: hidden;
        padding: 0.5rem 0 0.5rem;
        background: white;
        margin-bottom: 0.5rem;
    }

    /* detailhead */
    .detailhead {
        overflow: hidden;
        padding: 0.7em 10px;
        font-size: 0.65rem;
        border-bottom: 1px solid #eee;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .detailhead a {
        color: #f86b1f;
        font-size: 0.6rem;
    }

    /**/
    .storeimg {
        overflow: hidden;
        background: white;
        margin-bottom: 0.5rem;
    }

    .storeimg .imgbox {
        overflow: hidden;
        margin: 0.5rem 0 0.5rem;
        margin-bottom: 0.5rem;
    }

    .storeimg .imgbox li {
        width: 100%;
        background: #e9e9e9;
    }

    .storeimg .imgbox li img {
        display: block;
    }

    /* comments */
    .comments {
        overflow: hidden;
        background: white;
        margin-bottom: 0.5rem;
    }

    /* information */
    .information {
        overflow: hidden;
        background: white;
        margin-bottom: 0.5rem;
    }

    /* mappopup */
    .mappopup {
        padding-top: 40px;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    /* inforbox */
    .inforbox {
        overflow: hidden;
        padding: 0 10px;
    }

    .infortext {
        overflow: hidden;
        font-size: 0.6rem;
        line-height: 1.4em;
        text-indent: 2em;
        padding: 10px 0;
    }

    .inforimg {
        overflow: hidden;
        padding-bottom: 0.5rem;
    }

    .license {
        width: 48%;
        float: left;
        border: 1px solid #e9e9e9;
        height: 10rem;
        padding: 0.4rem;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .license img {
        width: auto;
        height: auto;
        max-height: 100%;
    }

    .certificate {
        width: 48%;
        float: right;
        border: 1px solid #e9e9e9;
        height: 10rem;
        padding: 0 0.4rem;
        overflow: auto;
    }

    .certificate img {
        padding: 10px;
    }

    /**/
    .cart-list {
        display: -webkit-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.5rem 10px;
        font-size: 0.6rem;
        padding-left: 2.5rem;
    }

    .cart-list label {
        float: left;
        flex: 1;
        color: #333;
    }

    .cart-list .lmain {
        display: -webkit-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: 0.6rem;
        color: #333;
    }

    .cart-list .lmain i {
        font-size: 0.6rem;
        padding-left: 0.1rem;
    }

    .topTab {
        position: fixed;
        top: 46px;
        right: .5333rem;
        z-index: 1000;
        width: 4rem;
        background-color: #ffffff;
        border-radius: .2222rem;
        padding: 0 .3556rem;
    }

    .topTab p {
        font-size: .5333rem;
        line-height: 1.3333rem;
        border-bottom: 1px solid #eeeeee;
        color: #666666;
    }

    .topTab p:last-child {
        border-bottom: none;
    }

    .topTab p span {
        display: inline-block;
        width: .5556rem;
        height: .6444rem;
        margin-right: .2222rem;
    }

    .topTab::after {
        content: '';
        position: absolute;
        right: .4444rem;
        top: -5px;
        width: 0;
        height: 0;
        border-right: .3rem solid transparent;
        border-left: .3rem solid transparent;
        border-bottom: .3rem solid #ffffff;

    }

    .pochang {
        background-color: #fff;
        width: 100%;
        height: 2.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        font-size: 0.52rem;
        color: #999;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
    }

    .pochang .left {
        height: 2.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }

    .pochang .left .name {
        font-size: 0.65rem;
        color: #FF6E04;
    }

    .pochang .right {
        background: linear-gradient(#FF9F18, #FF8126);
        color: #fff;
        padding: 0.2rem 0.5rem;
        border-radius: 0.2rem;
    }

</style>
