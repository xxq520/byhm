<template>
    <div class="warp">

        <mt-header fixed title="提现" class="topNav">
            <mt-button icon="back" slot="left" @click="goback()"></mt-button>
            <mt-button slot="right" @click="questionBox"><i class="question"><img
                        src="@/assets/images/icon_yiwen.png" /></i></mt-button>
        </mt-header>

        <div class="yonghu">
            <div class="info">
                <p class="p1">普通账户</p>
                <p class="p2" @click="tixian(1,balance)">去提现<i class="el-icon-arrow-right"></i></p>
            </div>
            <div class="money">{{balance?balance:'0'}}</div>
        </div>
        <div class="yonghu">
            <div class="info">
                <p class="p1">银联账户 <span>分账</span></p>
                <p class="p2" @click="tixian(3,money1)">去提现<i class="el-icon-arrow-right"></i></p>
            </div>
            <div class="money">{{ledger_balance?ledger_balance:'0'}}</div>
        </div>
        <div class="yonghu">
            <div class="info">
                <p class="p1">高汇通账户 <span>分账</span></p>
                <p class="p2" @click="tixian(5,money2)">去提现<i class="el-icon-arrow-right"></i></p>
            </div>
            <div class="money">{{ledger ?ledger:'0'}}</div>
        </div>
        <!-- 入驻前 -->
        <p class="beforeRZ" v-if="isYLEnter">现百业惠盟已接入银联支付，建议您立即 <span @click="goToYL">入驻银联<i
                    class="el-icon-arrow-right"></i></span></p>

        <!-- 弹框 -->
        <div class="winModal" v-if="isShowBox">
            <div class="mainBox">
                <ul>
                    <li>
                        <label>分账（入驻前）：</label>
                        <p>接入银联支付后，当前账户未成功入驻银联，所有收益将统计入分账（入驻前）账户，该账户提现由平台代扣代缴免税收入外的20%个税及提现金额的6.76%增值税等税费</p>
                    </li>
                    <li>
                        <label>分账（入驻后）：</label>
                        <p>接入银联支付后，当前账户已成功入驻银联，所有收益将统计入分账（入驻后）账户，该账户每次提现只需支付1元/笔手续费</p>
                    </li>
                    <li>
                        <label>普通账户：</label>
                        <p>接入银联支付前，所有收益将统计入普通账户，该账户提现按照国家规定，单月800月（含800）内免收个税，超过部分则按劳务报酬累计税率代扣代缴个税</p>
                    </li>
                    <li>
                        <label>高汇通账户(入驻前)：</label>
                        <p>接入银联支付后，当前账户未成功入驻银联，所有通过高汇通产生的收益，可提现金额将统计入分账（入驻前）账户，该账户提现由平台代扣代缴免税收入外的20%个税及提现金额的6.76%银联服务税费
                        </p>
                    </li>
                    <li>
                        <label>高汇通账户(入驻后)：</label>
                        <p>接入高汇通支付后，当前账户已成功入驻，所有通过高汇通产生的收益，可提现金额将统计入分账（入驻后）账户，该账户每次提现只需支付1元/笔手续费</p>
                    </li>
                </ul>
                <div class="closeBtn" @click="closeQuestionBox">我知道了</div>
            </div>
        </div>
        <!-- <div class="mianTz" v-show="isTshow">
            <header class="mint-header">
                <img src="@/assets/images/arrow_return.png" @click="goback">
                <h1 class="mint-header-title">新春结算通知</h1>
            </header>
            <div class="btn2">
                <div class="btn3" @click="goback">取消</div>
                <div class="btn3" @click="drawMoneyFn">继续提现</div>
            </div>
        </div> -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // topnav:{
                //     title:'提现'
                // },
                cur_tab: 0,
                isShowBox: false, //弹框显示
                isPartner: this.$cookie.get('isPartner'), //是否合伙人
                userId: this.$cookie.get('userid'),
                accountMsg: {},
                // isYLeEnter:this.$cookie.get('isYLEnter'),//是否银联入驻
                isYLEnter: false,
                balance: '', //普通账户
                seq: this.$cookie.get('seq'),
                ledger_balance: 0, //银联
                app: this.$route.query.platform,
                cycleList: [], //可提现周期
                ledger: 0, //高汇通
                money1: 0, //银联入驻前
                money2: 0, //高汇通入驻前
                isTshow: false,
            }
        },
        created() {
            this.getYLinfo();
        },
        mounted() {

            this.kaiguan();
            this.getAccountMsg();
            this.getGenBalanceByUid();
            this.getBalanceAll();
            this.getLedgerBalance();

        },
        methods: {
            kaiguan() {
                axios({
                    method: 'get',
                    url: this.Api + 'showstatus/showStatus?type=7',
                }).then(res => {

                    if (res.data.code == 0) {
                        if (res.data.data == 0) {
                            this.isTshow = false
                        } else {
                            this.isTshow = true
                        }

                    }
                })
            },
            drawMoneyFn() {

                this.isTshow = false;

            },
            goback() {
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else if (this.$route.name == "bankCartList") {
                    console.log(this.$route.query.idx);
                    if (this.$route.query.idx === undefined) {

                        this.$router.push({
                            name: "MineIndex"
                        });
                    } else {
                        this.$router.go(-1)
                    }

                } else {
                    this.$router.go(-1);
                }
            },
            getAccountMsg() {
                axios({
                    url: this.Api + "ledgerwithdraw/getWithdrawBalance",
                    method: "post",
                    data: qs.stringify({
                        userId: this.userId
                    }),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.Bool == true) {
                        this.accountMsg = res.data.Data;
                        sessionStorage.setItem('total', this.accountMsg.canWithdrawBouns);

                    }
                })
            },
            changeState(idx) {
                this.cur_tab = idx;
            },
            questionBox() {
                this.isShowBox = true;
            },
            closeQuestionBox() {
                this.isShowBox = false;
            },
            tixian(val, money) {
                this.$router.push({
                    path: '/settings/tixianDetails',
                    query: {
                        idx: val,
                        money: money
                    }
                })
            },

            linkTotixian(idx) {

                if (idx == 1 && this.cycleList.length == 0) {

                    MessageBox({
                        title: '提示',
                        message: '抱歉，您之前提现申请还未处理完。再次提现需等之前提现完成后再可申请，请耐心等候，不便之处 敬请谅解！',
                        showCancelButton: false,
                        closeOnClickModal: false
                    }).then(action => {
                        if (action === 'confirm') {
                            // this.$router.go(-1);
                        }
                    });
                } else {
                    this.$router.push('/settings/bankList?idx=' + idx);
                }

            },
            // linkToRecord(idx) {
            //     if (idx == 1) {
            //         this.$router.push('/mine/drawalRecordNew');
            //     } else if (idx == 0) {
            //         this.$router.push('/mine/separateRecord');
            //     } else {
            //         this.$router.push('/mine/drawalRecordPT');
            //     }

            // },
            // 普通账户
            getGenBalanceByUid() {
                axios.get(
                    this.Api + "user/getGenBalanceByUid?uid=" + this.userId
                    // {headers: { "X-Nideshop-Token": this.$cookie.get('token') }}
                ).then(res => {
                    if (res.data.code == 0) {
                        // console.log(res.data.gen_balance);
                        this.balance = res.data.gen_balance;
                    }
                });

            },
            // 银联入驻后
            getYLinfo() {
                axios.get(this.Api + 'UnionPayEnter/findAccountInfo?seq=' + this.seq, {
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    })
                    .then(res => {
                        console.log(res.data.code);
                        if (res.data.code == 200) {
                            // let success = res.data.data.success;
                            let applyStatus = res.data.data.applyStatus;
                            if (applyStatus == '05') {
                                this.isYLEnter = false;
                            } else {
                                this.isYLEnter = true;
                            }


                        }
                    })
            },
            // 银联与高汇通入驻前
            getLedgerBalance() {
                axios.get(
                    this.Api + "user/getLedgerBalanceByUid?uid=" + this.userId + "&type=0"

                ).then(res => {

                    // console.log(res.data,'11');
                    if (res.data.code == 0) {
                        this.money1 = res.data.ledger_balance;

                    }
                });
                //高汇通入驻前
                axios.get(
                    this.Api + "user/getLedgerBalanceByUid?uid=" + this.userId + "&type=1"

                ).then(res => {
                    //   console.log(res.data,'12');
                    if (res.data.code == 0) {
                        this.money2 = res.data.ledger_balance;

                    }
                });
            },
            //提现总金额
            getBalanceAll() {
                axios.get(
                    this.Api + "ledgerwithdraw/getLedgerBalanceTotal?userId=" + this.userId + "&type=99"
                ).then(res => {
                    if (res.status == 200) {
                        this.ledger_balance = res.data.Data.ledgerBalanceTotal
                        this.ledger = res.data.Data.ledgerBalanceHTTotal
                    }
                });
                //高汇通入驻前

            },
            // 去入驻
            goToYL() {
                if (this.app) {
                    window.location.href = this.YLApi + "wholesale/uploading?from=by&isApp=" + this.app + "&seq=" + this
                        .$cookie.get('seq');
                } else {
                    window.location.href = this.YLApi + "wholesale/uploading?from=by&seq=" + this.$cookie.get('seq');
                }
            },
            // 判断能否提现
            // getData() {
            //     axios.get(this.Api + 'ledgerwithdrawweekly/findByUserId?userId=' + this.userId + '&auditStatus=4', {
            //             headers: {
            //                 "X-Nideshop-Token": this.$cookie.get('token')
            //             }
            //         })
            //         .then(res => {
            //             console.log(res);
            //             if (res.data.Bool == true) {
            //                 this.cycleList = res.data.Data;
            //             }
            //         })
            // },

        }
    }

</script>
<style scoped>
    .mianTz {
        width: 100%;
        height: 100%;
        background-image: url('../../../../assets/images/bytz.png');
        background-size: 100% 100%;
        z-index: 1000;
        position: fixed;
        left: 0;
        top: 0;
    }

    .mint-header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        border: none;
        display: flex;

    }

    .mint-header img {
        width: 14px;
        height: 20px;
    }

    .mint-header-title {
        flex: 1;
        font-size: 16px;
    }

    .btn2 {
        width: 100%;
        position: absolute;
        bottom: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }

    .btn3 {
        background-image: url('../../../../assets/images/basj.png');
        background-size: 100% 100%;
        border-radius: 15px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #ff1b5c;
        margin-right: 30px;
        margin-left: 20px;

    }

    .yonghu {
        padding: 0.3rem 0.7rem;
        background-color: #ffffff;
        margin-top: 0.35rem;
    }

    .yonghu .info {
        font-size: 0.677rem;
        border-bottom: 1px solid #eee;
        height: 1.6rem;
        line-height: 1.6rem;
        padding: 0 0.2rem;
    }

    .yonghu .info .p1 {
        float: left;
    }

    .yonghu .info .p1 span {
        background-color: #ff8624;
        color: #fff;
        padding: 0.1rem 0.3rem;
        border-radius: 0.6rem;
        font-size: 0.55rem;
    }

    .yonghu .info .p2 {
        float: right;
    }

    .yonghu .money {
        font-size: 1.0667rem;
        color: #f86b1f;
        padding: 0.88rem 0.2rem;
    }

    .topNav {
        background-color: #ff911e;
        border-bottom: none;
    }

    .topNav .question {
        width: .8rem
            /* 36/45 */
        ;
        height: .8rem
            /* 36/45 */
        ;
        /* border: 1px solid #ffffff; */
        border-radius: 50%;
        display: inline-block;
        text-align: center;
        line-height: .8rem
            /* 36/45 */
        ;
    }

    .warp {
        padding-top: 40px;
        min-height: 100vh;
        background-color: #f2f2f2;
        overflow: hidden;
    }

    .tabnav {
        width: 100%;
        height: 1.9556rem
            /* 88/45 */
        ;
        line-height: 1.9556rem
            /* 88/45 */
        ;
        box-sizing: border-box;
        display: flex;
        /* justify-content: space-between; */
        justify-content: space-around;
        background-color: #ffffff;
    }

    .tabnav li {
        /* width: 50%; */
        text-align: center;
        font-size: .6667rem
            /* 30/45 */
        ;
        background-color: #ffffff;
        color: #333333;
        /* padding: 0 .8889rem ; */


    }

    .tabnav li.act span {
        /* padding: 0 .8889rem ; */
        display: inline-block;
        border-bottom: 2px solid #ff8624;
        color: #ff8624;
    }

    .details {
        background-color: #ffffff;
        padding: 1.1111rem
            /* 50/45 */
            .6667rem
            /* 30/45 */
        ;
        border-radius: .2222rem
            /* 10/45 */
        ;
        margin: .4444rem
            /* 20/45 */
            .6667rem
            /* 30/45 */
        ;
        text-align: center;
        color: #666666;
        font-size: .5333rem
            /* 24/45 */
        ;
    }

    .details .total {
        font-size: 1.0667rem
            /* 48/45 */
        ;
        color: #f86b1f;
        padding: .8889rem
            /* 40/45 */
            0 1.5556rem
            /* 70/45 */
        ;
    }

    .details .partList {
        border-top: 1px solid #eeeeee;
        display: flex;
        justify-content: space-around;
        padding-top: .8889rem
            /* 40/45 */
        ;
        font-size: .7111rem
            /* 32/45 */
        ;
        color: #333333;
    }

    .details .partList .title {
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #999999;
        padding-bottom: .6667rem
            /* 30/45 */
        ;
    }

    .details .partList .line {
        width: 1px;
        height: inherit;
        background-color: #eeeeee;
        display: block;
    }

    .btnLis {
        display: flex;
        justify-content: space-around;
        padding-top: 1.3333rem
            /* 60/45 */
        ;
    }

    .btnLis div {
        padding: 0 1.7111rem
            /* 77/45 */
        ;
        height: 1.5556rem
            /* 70/45 */
        ;
        line-height: 1.5556rem
            /* 70/45 */
        ;
        border-radius: .7778rem
            /* 35/45 */
        ;
        font-size: .7rem;
    }

    .btnLis div.record {
        border: 1px solid #ff6e04;
        color: #ff6e04;
        background-color: #ffffff;
    }

    .btnLis div.disable {
        pointer-events: none;
        background-color: #999999;
        color: #ffffff;
    }

    .btnLis div.tixian {
        background-color: #ff6e04;
        color: #fefefe;
    }

    /* 弹框 */
    .winModal {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .winModal .mainBox {
        background-color: #ffffff;
        width: 90%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 24rem;
        border-radius: .2222rem
            /* 10/45 */
        ;
        padding: 1.2222rem
            /* 55/45 */
            .6667rem
            /* 30/45 */
            .8889rem
            /* 40/45 */
        ;
        box-sizing: border-box;
        /* overflow: hidden; */
        overflow: auto;
    }

    .winModal .mainBox ul li {
        /* display: flex; */
        /* justify-content: flex-start; */
        font-size: .5333rem
            /* 24/45 */
        ;
        padding-bottom: 1.0222rem
            /* 46/45 */
        ;
        color: #666666;
    }

    .winModal .mainBox ul li label {
        /* width: 35%; */
        width: 45%;
    }

    .winModal .mainBox .closeBtn {
        width: 4.4444rem
            /* 200/45 */
        ;
        height: 1.3778rem
            /* 62/45 */
        ;
        text-align: center;
        line-height: 1.3778rem
            /* 62/45 */
        ;
        color: #ffffff;
        background-color: #ff8624;
        border-radius: .6889rem
            /* 31/45 */
        ;
        font-size: .6667rem
            /* 30/45 */
        ;
        margin: .6rem auto 0;
    }

    .beforeRZ {
        padding: 0 .6667rem
            /* 30/45 */
        ;
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #333;
    }

    .beforeRZ span {
        color: red;
        font-weight: 800;
        font-size: .5778rem
            /* 26/45 */
        ;
    }
   
</style>
