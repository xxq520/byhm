<template>
    <div class="become-member">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="head">
            <div style="font-size:0.62rem;">{{delist.currentOrderStatusDesc}}</div>
            <div style="font-size:0.55rem;">{{statustishi}}</div>
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
                    <div class="left"><img :src="item.picUrl" alt="" v-if="item.picUrl">
                    </div>
                    <div class="right">
                        <div style="line-height: 0.8rem;max-height: 1.6rem;overflow: hidden;">{{item.goodsName}}</div>
                        <div style="display: flex; justify-content: space-between;">
                            <div>￥{{item.totalPrice}}</div>
                            <div>x{{item.goodsNum}}</div>
                        </div>
                    </div>
                </li>
            </div>
              <div class="orderinfo" v-if="!delist.isTaking">
                 <div class="sname">配送信息</div>
                <div class="stext">
                    <div class="ad">
                        <span class="abs">配送服务： </span><span class="abf">商家配送</span>
                         </div>
                      <div class="ad">
                        <span class="abs">配送时间： </span> <span class="abf">{{delist.selectedDeliveryTime}}</span>
                         </div>
                    <div class="ad">
                        <span class="abs">收货人：</span> <span class="abf">{{delist.consignee}}</span>
                    </div>
                     <div class="ad">
                        <span class="abs">手机号：</span><span class="abf">{{delist.mobile}}</span>
                         </div>
                      <div class="ad">
                        <span class="abs">收货地址：</span><span class="abf">{{delist.address}}</span>
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
            <div class="bnt " @click="gotel()" v-if="delist.currentOrderStatus==1">拒绝接单</div>
            <div class="bnt dele" v-if="delist.currentOrderStatus==1" @click="receipt(delist.orderSn)">确认接单</div>
            <div class="bnt " @click="Rejectapp(delist.orderSn,1)" v-if="delist.currentOrderStatus==11">拒绝申请</div>
            <div class="bnt dele" @click="Agreeapp(delist.orderSn,1)" v-if="delist.currentOrderStatus==11">同意申请
            </div>
            <div class="bnt" v-if="delist.currentOrderStatus==10" @click="Rejectapp(delist.orderSn,2)">拒绝退款</div>
            <div class="bnt dele " v-if="delist.currentOrderStatus==10" @click="Agreeapp(delist.orderSn,2)">确认退款
            </div>
            <div class="bnt dele " v-if="delist.currentOrderStatus==3" @click="Distribut(delist)">已配送
            </div>
            <div class="bnt " v-if="delist.currentOrderStatus==7||delist.currentOrderStatus==13"
                @click="deleteOrder(delist.orderSn)">删除订单</div>
            <div class="bnt a1" @click="gowriteOff(delist.orderSn)"
                v-if="delist.isTaking&&delist.currentOrderStatus==2">扫码核销
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
                statustishi: '',
                tapShow: false,
                moneyShow: false,
                moneyOrder: '',
                couAmount: '',
                couAm: '',
                orderShipType: 1,
                reject: 0,
                id: this.$cookie.get('merId')

            }
        },
        created() {


        },
        mounted() {
            this.getDetali()
        },
        methods: {
            //去商品核销
            gowriteOff(id) {
                this.$router.push({
                    path: '/storeplat/writeOff',
                    query: {
                        orderSn: id
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
                            type: 1
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
                                this.getDetali()
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    }
                })
            },
            //已配送
            Distribut(val) {
                let post = {
                    orderSn: val.orderSn,
                    waybillNo: val.waybillNo,
                    carrier: val.carrier
                };
                axios({
                    url: this.Api1 + '/order/deliver',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast("操作成功")
                        this.page = 1;
                        this.list = [];
                        this.getDetali()
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //拒绝申请
            qxRwfuse() {

                this.tapShow = false;
                this.couAmount = '';
                this.couAm = '';
                this.moneyShow = false;
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
                            this.getDetali()
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
                            this.getDetali()
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
            //确定拒绝退款申请
            //确定拒绝审核申请
            goReject() {
                if (this.couAm == null || this.couAm == '') {
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
                            this.getDetali()
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
                            this.getDetali()
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
                        this.getDetali()
                        Toast('接单成功')
                    } else {
                        this.tapShow = false;
                        Toast(res.data.message)
                    }
                })
            },
            gotel(val) {
                this.tapShow = true;
            },
            //确定拒绝接单
            goRefuse() {
                if (this.couAmount == null || this.couAmount == '') {
                    Toast('拒绝理由不能为空');
                    return;
                }
                let post = {
                    orderSn: this.moneyOrder,
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
                        this.couAmount = '';
                        this.getDetali()
                        Toast('拒单成功')
                    }
                })
            },


            //获取详情
            getDetali() {
                let post = {
                    orderSn: this.orderSn,
                    type: 1
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
                        this.delist = res.data.data;
                        this.daojishi = res.data.data.createTime;
                        this.moneyOrder = this.delist.orderSn;
                        this.statustishi = data.orderDetailPrompt;

                    }
                })
            },

            // 安卓电话方法
            mobilefn(number) {
                window.action.phoneCall(number);
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
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
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
        align-items: center;
        line-height: 2rem;
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
        color: #ff9d19;
    }

</style>
