<template>
    <div class="become-member">
        <!-- 头部 -->
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="nav">
            <div class="switch" @click="peiSong">
                <div class="act" :class="{'tianxuan':payShow==false}"> 配送 </div>
                <div class="act" :class="{'tianxuan':payShow==true}">自提</div>
            </div>
        </div>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==item.id}" @click="messagebtnfn(item.id)" v-for="item in navlist">
                {{item.name}}
            </li>
        </ul>
        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <ul class="list">
                <li v-for="(item,index) in list" :key="index" v-if="item.orderDetails.length>0">
                    <div class="head">
                        <div>订单号：{{item.orderSn}}</div>
                        <div style="color: #ff4400;">{{item.currentOrderStatusDesc}}</div>
                    </div>
                    <div class="merchandise" @click="getDetalis(item.orderSn)">
                        <div class="left"><img  :src="item.orderDetails[0].picUrl" alt=""></div>
                        <div class="right">
                            <div class="shopname">
                                {{item.orderDetails[0].goodsName}}
                            </div>
                            <div class="rolus">{{item.orderDetails[0].goodsSpecifitionNameValue}}

                            </div>
                            <div class="price">
                                <div style="color: #ff4400;"> ￥{{item.totalOrderPrice}} </div>
                                <div> x{{item.orderDetails[0].goodsNum}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="foot">
                        <div class="bnt " @click="gotel(item.orderSn)" v-if="item.currentOrderStatus==1">拒绝接单</div>
                        <div class="bnt a1" v-if="item.currentOrderStatus==1" @click="receipt(item.orderSn)">确认接单</div>
                        <div class="bnt " v-if="item.currentOrderStatus==7||item.currentOrderStatus==13"
                            @click="deleteOrder(item.orderSn)">删除订单</div>
                        <div class="bnt a1" @click="gowriteOff(item.orderSn)"
                            v-if="payShow ==true&&item.currentOrderStatus==2">扫码核销
                        </div>
                        <div class="bnt " @click="Rejectapp(item.orderSn,1)" v-if="item.currentOrderStatus==11">拒绝申请
                        </div>
                        <div class="bnt a1" @click="Agreeapp(item.orderSn,1)" v-if="item.currentOrderStatus==11">同意申请
                        </div>
                        <div class="bnt" v-if="item.currentOrderStatus==10" @click="Rejectapp(item.orderSn,2)">拒绝退款
                        </div>
                        <div class="bnt a1 " v-if="item.currentOrderStatus==10" @click="Agreeapp(item.orderSn,2)">确认退款
                        </div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
            </div>
        </div>
        <div class="bullet" v-if="tapShow">
            <div class="main">
                <div class="heads">拒绝理由</div>
                <div class="conts">
                    <textarea placeholder="请输入拒绝理由，20字以内" v-model="couAmount"
                        style="width: 100%;height: 2.5rem;"></textarea>
                </div>
                <div class="foots">
                    <div class="c1" @click="qxRwfuse">取消</div>
                    <div class="c2" @click="goRefuse">确定</div>
                </div>
            </div>
        </div>

        <div class="bullet" v-if="moneyShow">
            <div class="main">
                <div class="heads">拒绝理由</div>
                <div class="conts">
                    <textarea placeholder="请输入拒绝理由，20字以内" v-model="couAm"
                        style="width: 100%;height: 2.5rem;"></textarea>
                </div>
                <div class="foots">
                    <div class="c1" @click="qxRwfuse">取消</div>
                    <div class="c2" @click="goReject">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '订单管理',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                id: this.$route.query.id,
                messagebtn: 0,
                loadshow: true,
                loadend: false,
                loading: false,
                page: 1, //当前页
                pageSize: 8, //每页显示行数
                navlist: [{
                        name: '全部',
                        id: '0'
                    },
                    {
                        name: '待付款',
                        id: '1'
                    },
                    {
                        name: '待接单',
                        id: '2'
                    },
                    {
                        name: '待配送',
                        id: '3'
                    },
                    {
                        name: '退款/售后',
                        id: '4'
                    },
                ],
                list: [],
                popupVisible: false,
                payShow: false,
                tapShow: false,
                moneyShow: false,
                moneyOrder: '',
                couAmount: '',
                couAm: '',
                orderShipType: 1,
                jjorder: '',
                reject: 0,

            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //拒绝申请
            qxRwfuse() {
                this.jjorder = '';
                this.tapShow = false;
                this.couAmount = '';
                this.couAm = '';
                this.moneyShow = false;
                this.moneyOrder = '';
            },
            //同意申请
            Agreeapp(val, i) {
                let post = {
                    orderSn: val,
                    merId: this.id
                };
                if (i == 1) {
                    axios({
                        url: this.Api1 + '/order/cb/agreeApply',
                        data: post,
                        method: "post",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('同意退款申请')
                            this.page = 1;
                            this.list = [];
                            this.loadMore();
                        } else {
                            Toast(res.data.message)
                        }
                    })
                } else {
                    axios({
                        url: this.Api1 + '/order/cb/agree',
                        data: post,
                        method: "post",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('同意退款申请')
                            this.page = 1;
                            this.list = [];
                            this.loadMore();
                        } else {
                            Toast(res.data.message)
                        }
                    })
                }

            },


            //拒绝申请
            Rejectapp(val, i) {
                this.moneyShow = true;
                this.moneyOrder = val;
                this.reject = i;
            },
            //确定拒绝审核申请
            goReject() {
                if (this.moneyOrder == null || this.moneyOrder == '') {
                    Toast('拒绝理由不能为空');
                    return;
                }
                let post = {
                    orderSn: this.moneyOrder,
                    rejectReason: this.couAm,
                    merId: this.id
                };
                if (this.reject == 1) {
                    axios({
                        url: this.Api1 + '/order/cb/rejectApply',
                        data: post,
                        method: "post",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.moneyShow = false;
                            this.moneyOrder = '';
                            this.couAm = '';
                            this.page = 1;
                            this.list = [];
                            this.loadMore();
                            Toast('已拒绝审核申请')
                        } else {
                            this.moneyShow = false;
                            Toast(res.data.message)
                        }
                    })
                } else {
                    axios({
                        url: this.Api1 + '/order/cb/reject',
                        data: post,
                        method: "post",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.moneyShow = false;
                            this.moneyOrder = '';
                            this.couAm = '';
                            this.page = 1;
                            this.list = [];
                            this.loadMore();
                            Toast('已拒绝退款申请')
                        } else {
                            this.moneyShow = false;
                            Toast(res.data.message)
                        }
                    })
                }

            },




            //确认接单
            receipt(val) {
                let post = {
                    orderSn: val
                };
                axios({
                    url: this.Api1 + '/order/receipt',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.tapShow = false;
                        this.jjorder = '';
                        this.couAmount = '';
                        this.page = 1;
                        this.list = [];
                        this.loadMore();
                        Toast('接单成功')
                    } else {
                        this.tapShow = false;
                        Toast(res.data.message)
                    }
                })
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
                            type:1
                        };
                        axios({
                            url: this.Api1 + '/order/delete',
                            data: post,
                            method: "post",
                            headers: {
                                "Content-Type": "application/json; charset=UTF-8",
                                "X-Nideshop-Token": this.$cookie.get("token")
                            },
                        }).then(res => {
                            if (res.data.code == 200) {
                                Toast('删除成功')
                                this.page = 1;
                                this.list = [];
                                this.loadMore();
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    }
                })
            },

            //去商品核销
            gowriteOff(id) {
                this.$router.push({
                    path: '/storeplat/writeOff',
                    query: {
                        orderSn: id
                    }
                })
            },

            gotel(val) {
                this.tapShow = true;
                this.jjorder = val
            },
            //确定拒绝接单
            goRefuse() {
                let post = {
                    orderSn: this.jjorder,
                    rejectWhy: this.couAmount
                };
                axios({
                    url: this.Api1 + '/order/reject',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.tapShow = false;
                        this.jjorder = '';
                        this.couAmount = '';
                        this.page = 1;
                        this.list = [];
                        this.loadMore();
                        Toast('拒单成功')
                    }
                })
            },
            //切换配送方式
            peiSong() {
                if (!this.payShow) {
                    this.navlist[3].name = '待提货';
                    this.payShow = true;
                    this.orderShipType = 2;
                    this.page = 1;
                    this.list = [];
                    this.loadMore();
                } else {
                    this.navlist[3].name = '待配送';
                    this.payShow = false;
                    this.orderShipType = 1;
                    this.page = 1;
                    this.list = [];
                    this.loadMore();
                }
            },
            //去详情
            getDetalis(val) {
                this.$router.push({
                    path: '/storeplat/merchOrder',
                    query: {
                        orderSn: val
                    }
                })
            },
            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                this.page = 1;
                this.list = [];
                this.loadMore();
            },
            loadMore() {
                let that = this;

                this.loading = true;
                this.loadshow = true;
                let post = {
                    orderStatusBar: this.messagebtn,
                    merId: this.id,
                    pageIndex: this.page,
                    pageSize: this.pageSize,
                    orderShipType: this.orderShipType
                };
                axios({
                    url: this.Api1 + '/order/list',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        if (data.list.length == 0) {
                            that.loadend = true;
                            that.loading = true;
                            that.loadshow = false;
                            return false;
                        };
                        (that.page) ++;
                        that.list = that.list.concat(data.list);

                    } else {
                        Toast(res.data.message)
                    };
                    that.loading = false;
                    that.loadshow = false;
                })
            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        padding-top: 40px;
        overflow: hidden;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }

    .managebtn {
        width: 100%;
        margin-bottom: 0.4rem;
        background-color: #fff;
        display: flex;

        align-items: center;
        overflow: auto;
    }

    .managebtn::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .managebtn li {

        text-align: center;
        padding: .4889rem 0;
        font-size: .6222rem;
        color: #333333;
        height: 2.2rem;
        line-height: 1.2rem;
        width: 20%;
        flex-shrink: 0;
        border-top: 1px solid #f5f5f5;
    }

    .managebtn li p.count {
        color: #666666;
        font-size: .5333rem;
        line-height: .6667rem;
    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 80%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 10%;
    }

    .managebtn li.hover p {
        color: #ff6e04;
    }


    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
        padding: 0.3rem;
    }

    .list li .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }



    .list li .foot {
        display: flex;
        justify-content: flex-end;

        padding-top: 0.4rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .list li .foot .bnt {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #ddd;
        margin-right: 0.4rem;
    }

    .list li .foot .a1 {
        border: 1px solid #FF9D19;
        color: #FF9D19;
    }

    .mint-popup {
        width: 70%;
    }

    .list li .merchandise {
        padding: 0.3rem;
        display: flex;
    }

    .list li .merchandise .left {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .list li .merchandise .left img {
        width: 3.75rem;
        height: 3.75rem;
    }


    .list li .merchandise .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 0.4rem;
    }

    .list li .merchandise .right .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list li .merchandise .right .rolus {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .list li .merchandise .right .rolus .b1 {
        padding: 0 0.5rem;
        border-right: 1px solid #ccc;
    }

    .list li .merchandise .right .rolus .b1:last-child {
        border: none;
    }

    .list li .merchandise .right .rolus .b1:first-child {
        padding: 0 0.5rem 0 0;
    }

    .topNav>>>.mint-header-button {
        flex: none;
    }

    .nav {
        background-color: #fff;
        width: 100%;
        display: flex;
        align-items: center;
        height: 2rem;
        padding: 0 0.6rem;
    }

    .switch {
        display: flex;
        line-height: 1.2rem;
        border-radius: 0.6rem;
        width: 30%;
        background-color: #eee;
        color: #999;
        font-size: 0.6rem;
    }

    .switch .act {
        width: 50%;
        border-radius: 0.6rem;
        text-align: center;
    }

    .switch .tianxuan {
        background-color: #FF9D19;
        color: #fff;
    }

    .bullet {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }

    .bullet .main {
        width: 76%;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 0.58rem;
    }

    .bullet .main .heads {
        line-height: 1.4rem;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }

    .bullet .main .conts {
        display: flex;
        justify-content: center;
        text-indent: 2em;
        align-items: center;
        min-height: 3.6rem;
    }

    .bullet .main .foots {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.65rem;

        border-top: 1px solid #eee;

    }

    .bullet .main .foots .c1 {
        width: 49%;
        border-right: 1px solid #eee;
        text-align: center;
    }

    .bullet .main .foots .c2 {
        flex: 1;
        text-align: center;
        color: #FF9D19;
    }

</style>
