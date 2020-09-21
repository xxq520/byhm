<template>
    <div class="become-member">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="head">
            <div style="font-size:0.62rem;">{{delist.currentOrderStatusDesc}}</div>
            <div style="font-size:0.55rem;" v-if="timeShow&&delist.currentOrderStatus==0">
                支付倒计时：{{hours}}:{{minutes}}:{{seconds}}</div>
            <div v-else style="font-size:0.55rem;">{{statustishi}}</div>
        </div>
        <div class="mainbox">
            <div v-if="delist.currentOrderStatus>9">
                <div class="xname">协商记录</div>
                <div class="bootinfo" @click="negotiation(delist.orderSn)">
                    <div style="line-height: 1.2rem;display: flex;justify-content: space-between;align-items: center;">
                        {{delist.latestRefundStatus}}<i class="el-icon-arrow-right"></i></div>
                </div>
            </div>

            <div class="shopinfo">
                <li v-for="item in delist.orderDetails">
                    <div class="left"><img :src="item.picUrl" alt=""></div>
                    <div class="right">
                        <div style="line-height: 0.8rem;max-height: 1.6rem;overflow: hidden;">{{item.goodsName}}</div>
                        <div style="display: flex; justify-content: space-between;">
                            <div>￥{{item.totalPrice}}</div>
                            <div>x{{item.goodsNum}}</div>
                        </div>
                    </div>
                </li>
            </div>
            <div class="merinfo">
                <div class="sname">商家信息</div>
                <div class="stext">
                    <div style="line-height: 1.6rem ; color: #333;">{{postData.name}}</div>
                    <div style="color: #666;">
                        {{postData.takingAddress}}</div>
                </div>
                <div class="foot">
                    <div @click="navigat()"><img src="@/assets/images/user/dd_icon_t.png" alt="">地图/导航</div>
                    <div @click="mobilefn(postData.mobile)"><img src="@/assets/images/user/dd_icon_m.png" alt=""><a
                            :href="`tel:${postData.mobile}`">联系商家</a></div>
                </div>
            </div>
            <div class="bootinfo" v-if="isTaking">
                <div class="sname">自提信息</div>
                <div class="stext">
                    <div><span style="color: #999;">可提货时间：</span>{{postData.takingTime}}</div>
                    <div style="display: flex;">
                        <div style="color: #999;flex-shrink: 0;">提货地址：</div>
                        <div>{{postData.takingAddress}}</div>
                    </div>
                </div>
            </div>
            <div class="orderinfo" v-if="!isTaking">
                <div class="sname">配送信息</div>
                <div class="stext">
                    <div class="stext">
                        <div class="ad"><span class="abs">配送时间： </span><span
                                class="abf">{{delist.selectedDeliveryTime}}</span></div>
                        <div class="ad"><span class="abs">收货人： </span> <span class="abf">{{delist.consignee}}</span>
                        </div>
                        <div class="ad"><span class="abs">手机号： </span> <span class="abf">{{delist.mobile}}</span>
                        </div>
                        <div class="ad"><span class="abs">收货地址： </span><span class="abf">
                                {{delist.province}}{{delist.city}}{{delist.district}}{{delist.address}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="orderinfo">
                <div class="sname">订单信息</div>
                <div class="stext">
                    <div class="stext">
                        <div class="ad"><span class="abs">订单编号： </span><span class="abf">{{delist.orderSn}}</span></div>
                        <div class="ad"><span class="abs">下单时间： </span> <span class="abf">{{delist.createTime}}</span>
                        </div>
                        <div class="ad"><span class="abs">支付方式： </span> <span class="abf">{{delist.shipType}}</span>
                        </div>
                        <div class="ad"><span class="abs">实付金额： </span><span
                                class="abf">￥{{delist.totalOrderPrice}}</span>
                        </div>
                        <div class="ad"><span class="abs">订单金额： </span><span class="abf">￥{{delist.orderPrice}}</span>
                        </div>
                        <div class="ad"><span class="abs">优惠金额： </span><span
                                class="abf">￥{{delist.discountPrice}}</span></div>
                        <div class="ad"><span class="abs">配送费： </span><span class="abf">￥{{delist.freightPrice}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="dele" @click="queren(delist.orderSn)" v-if="delist.currentOrderStatus==4">确认收货</div>
            <div @click="Oncemore(delist.merId)" v-if="delist.currentOrderStatus==6||delist.currentOrderStatus==7">
                再来一单</div>
            <div class="dele" @click="payMode(delist.orderSn,delist.totalOrderPrice)"
                v-if="delist.currentOrderStatus==0">去支付
            </div>
            <div class="dele" @click="gocomment(delist.orderSn)" v-if="delist.currentOrderStatus==9&&shopcoms">去评价</div>
            <div @click="cancel(delist.orderSn)" v-if="delist.currentOrderStatus==0">取消订单</div>
            <div @click="refund(delist.orderSn)" v-if="delist.currentOrderStatus> 0 &&delist.currentOrderStatus < 4">
                申请退款
            </div>
            <div @click="mobilefn(postData.mobile)" v-if="delist.currentOrderStatus==4"><a
                    :href="`tel:${postData.mobile}`"></a>联系商家</div>
            <div class="dele" @click="deleteOrder(delist.orderSn)"
                v-if="delist.currentOrderStatus==6||delist.currentOrderStatus==7">删除订单</div>
            <div class="dele" @click="Applicat(delist.orderSn,delist.afterSalesWhy)"
                v-if="delist.currentOrderStatus==12||delist.currentOrderStatus==14">联系客服</div>

        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '订单详情',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                orderSn: this.$route.query.orderSn,
                delist: {},
                daojishi: '',
                seconds: '',
                minutes: '',
                hours: '',
                timeShow: true,
                statustishi: '',
                isTaking: false,
                postData: {},
                applogin: false,
                shopcoms: true,
            }
        },
        created() {

        },
        mounted() {
            this.applogin = sessionStorage.getItem('applogin') ? true : false;
            this.getDetali();
            this.shopcom();
        },
        methods: {
            //获取商家是否开启评论功能
            shopcom() {
                axios({
                    url: this.Api1 + '/order/comment-status',
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shopcoms = res.data.data;
                    }

                })
            },
            mobilefn(number) {
                if (this.applogin) {
                    window.action.phoneCall(number);
                }
            },
            //判断是否有装地图
            navigat() {
                if (this.applogin) {
                    window.action.navAddress(this.postData.takingAddress);
                } else {
                    var that = this;
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (result) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            var latCurrent = result.point.lat; //获取到的纬度
                            var lngCurrent = result.point.lng; //获取到的经度
                            if (latCurrent && lngCurrent) {
                                var scheme = '';
                                console.log(that.center)
                                var queryStr = '?origin=name:我的位置|latlng:' + latCurrent + ',' + lngCurrent +
                                    '&destination=' +
                                    that.postData.lat + ',' + that.postData.lng +
                                    '&region=' + that.postData.takingAddress +
                                    '&coord_type=bd09ll&mode=driving';
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
                }


            },
            //再来一单
            Oncemore(id) {
                this.$router.push({
                    path: '/comment/marketDetalis',
                    query: {
                        id: id
                    }
                })
            },
            //Applicat重新申请退款
            Applicat(goodSn, yuan) {
                this.$router.push({
                    path: 'mine/rlservice',
               
                })

            },
            //倒计时
            updateNumbers: function (val) {
                var end_time = val;
                var duration = parseInt(end_time - Date.now()) / 1000;
                if (duration <= 0) {
                    this.timeShow = false;
                    return;
                }
                this.seconds = parseInt(duration % 60);
                if (this.seconds < 10) this.seconds = "0" + this.seconds;
                duration = parseInt(duration / 60);
                this.minutes = duration % 60;
                if (this.minutes < 10) this.minutes = "0" + this.minutes;
                duration = parseInt(duration / 60);
                this.hours = duration % 24;
                if (this.hours < 10) this.hours = "0" +
                    this.hours;
                var that = this;
                setTimeout(function () {
                    that.updateNumbers(val)
                }, 1000);
            },
            //删除订单
            deleteOrder(val) {
                MessageBox({
                    title: "温馨提示",
                    message: '是删除该订单？',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        let post = {
                            orderSn: val,
                            type: 0
                        };
                        axios({
                            url: this.Api1 + '/order/delete',
                            data: post,
                            method: "post",
                            headers: {
                                "Content-Type": "application/json;charset=utf-8",
                                "X-Nideshop-Token": this.$cookie.get("token")
                            },
                        }).then(res => {
                            if (res.data.code == 200) {
                                Toast('删除成功')
                                this.$router.go(-1)
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    }
                })
            },
            //获取详情
            getDetali() {
                let post = {
                    orderSn: this.orderSn,
                    type: 0
                };
                axios({
                    url: this.Api1 + '/order/get',
                    params: post,
                    method: "get",
                    headers: {
                        "content-type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.delist = data;
                        this.daojishi = data.createTime;
                        this.isTaking = data.isTaking;
                        this.statustishi = data.orderDetailPrompt;
                        this.postData = data.merchantInfo;
                        if (data.currentOrderStatus == 0) {
                            this.updateNumbers(data.payExpireTimeStamp);
                        }

                    }
                })
            },
            //取消订单
            cancel(val) {
                let post = {
                    orderSn: val
                };
                axios({
                    url: this.Api1 + '/order/cancel',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('取消成功')
                        this.$router.go(-1)
                    }
                })
            },
            //确认收货
            queren(val) {
                let post = {
                    orderSn: val
                };
                axios({
                    url: this.Api1 + '/order/finish',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('订单已确认')
                        this.$router.go(-1)
                    }
                })
            },

            //去评价
            gocomment(val) {
                this.$router.push({
                    path: '/mine/goComment',
                    query: {
                        merId: val
                    }
                })
            },
            //协商记录
            negotiation(val) {
                this.$router.push({
                    path: '/mine/negotiation',
                    query: {
                        orderSn: val
                    }

                })
            },
            //申请退款
            refund(val) {
                this.$router.push({
                    path: '/mine/goRefund',
                    query: {
                        orderSn: val
                    }
                })
            },
            //去支付
            payMode(val, money) {
                if (this.applogin) {
                    window.action.AppGoPay(10036, val, money)
                } else {
                    window.location.href = this.Price + 'home/indexwap?comefrom=10035&busimode=0&salenumber=' + val +
                        '&seq=' + this.seq;
                }
            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        overflow: hidden;
        padding-top: 40px;
        padding-bottom: 2.25rem;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    a:hover,
    a:visited,
    a:link,
    a:active {
        text-decoration: none;
        color: #555;
    }

    .head {
        background-color: #ff911e;
        color: #fff;
        text-align: center;
        font-size: 0.65rem;
        margin-top: 0.1rem;
        padding: 0.5rem;
    }

    .mainbox {
        padding: 0.5rem;
        font-size: 0.62rem;
        color: #666;
    }

    .mainbox .shopinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;
    }

    .mainbox .shopinfo li {
        display: flex;
        padding: 0.4rem 0;
        border-bottom: 1px solid #eee;
    }

    .mainbox .shopinfo li:last-child {
        border: none;
    }

    .mainbox .shopinfo li .left {
        width: 20%;
        height: 2.5rem;
        margin-right: 0.5rem;

    }

    .mainbox .shopinfo li .left img {
        width: 100%;
        height: 100%;
    }

    .mainbox .shopinfo li .right {
        flex: 1;
        font-size: 0.58rem;
        color: #666;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .mainbox .merinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .sname {
        line-height: 1.6rem;
        position: relative;
        text-indent: 1em;
        color: #666;
    }

    .mainbox .xname {
        line-height: 1.6rem;
        position: relative;
        text-indent: 0.5em;
        color: #666;
    }

    .mainbox .sname::before {
        content: '';
        width: 2px;
        height: 14px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.52rem;

    }

    .mainbox .merinfo .stext {
        padding: 0.5rem 0.1rem;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
    }

    .mainbox .merinfo .foot {
        display: flex;
        align-items: center;
        line-height: 1.6rem;

    }

    .mainbox .merinfo .foot div {
        width: 50%;
        display: flex;
        align-items: center;

    }

    .mainbox .merinfo .foot img {
        width: 0.75rem;
        width: 0.75rem;
    }

    .mainbox .bootinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .bootinfo .stext {
        line-height: 1.4rem;
        border-top: 1px solid #eee;
    }

    .mainbox .orderinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .bootinfo .stext {
        line-height: 1.4rem;
        border-top: 1px solid #eee;
    }

    .mainbox .orderinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .orderinfo .stext {
        line-height: 1.1rem;
        font-size: 0.55rem;

    }

    .mainbox .orderinfo .stext .ad {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mainbox .orderinfo .stext .ad .abs {
        width: 25%;
        display: inline-block;
        color: #999;
        flex-shrink: 0;

    }

    .mainbox .orderinfo .stext .ad .abf {
        flex: 1;
        flex-shrink: 0;
        color: #333;
    }

    .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0.5rem 0;
        background: #fff;
        flex-wrap: wrap;
    }

    .footer div {
        line-height: 1.0rem;
        text-align: center;
        padding: 0 0.3rem;
        border-radius: .6rem;
        font-size: 0.6rem;
        color: #666;
        border: 1px solid #ccc;
        margin-right: 0.7rem;
    }

    .footer div.dele {
        border: 1px solid #ff9d19;
        color: #ff9d19;
    }

</style>
