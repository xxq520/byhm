<template>
    <div class="glode">
        <topnav :topnav="topnav"></topnav>
        <div class="cartList">
            <div class="text">
                <div class="bankname"><img src="@/assets/images/bank.png">{{bankName?bankName.substr(0,position):''}}
                </div>
                <div class="numbers">
                    <span>****</span>
                    <span>****</span>
                    <span>****</span>
                    <span>{{cardNo?cardNo.substr(-4):'****'}}</span>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="choose">
            <span>按周期提现</span>
            <span class="chooseBtn" @click="linktoCycle">已选{{count}}笔</span>
        </div>
        <div class="details">
            <p class="titel">提现金额</p>
            <p class="total"><span>￥</span>{{(total/100).toFixed(2)}}</p>
            <div class="explain">
                <p v-if="this.index==6&&this.hahaShow">实际提现金额:<span>￥{{total==0? '0.00':(total/100).toFixed(2)}}</span></p>
                <p v-else>实际提现金额:<span>￥{{total==0? '0.00':((total-fee)/100).toFixed(2)}}</span></p>
                <p>*优惠期间，分账提现暂不收取手续费；</p>
                <p>*优惠结束后，每笔收取最低<span>1元/笔</span>的手续费，最终收取手续费时间和费率根据平台公布为准；</p>
                <p>预计提现到账时间：T+2个工作日</p>
            </div>
        </div>
        <div class="confirm" @click="confirmTX">确认提现</div>
    </div>
</template>
<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
                topnav: {
                    title: '提现'
                },
                count: 0,
                total: 0,
                userId: this.$cookie.get('userid'),
                bankName: '',
                cardNo: '',
                position: 1,
                weekIds: '',
                // total:sessionStorage.getItem('total'),
                total: 0,
                fee: sessionStorage.getItem('fee'),
                index: this.$route.query.index,
                msg: '',
                accountMsg: "",
                hahaShow: false,
            }
        },
        computed: {
            ...mapState(["withdrawal"])

        },
        mounted() {

            this.getYLinfo();
            console.log(sessionStorage.getItem('fee'));
            this.withdrawal.forEach(post => {
                this.count++;
                this.total += post.bonus;
                this.weekIds += post.id + ',';
            });
            this.getAccountMsg()
        
        },
        methods: {
            getAccountMsg() {
                axios({
                    url: this.Api + "ledgerwithdraw/getWithdrawBalance",
                    method: "post",
                    data: qs.stringify({
                        userId: this.userId,
                        type: 1
                    }),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.Bool == true) {
                        this.accountMsg = res.data.Data.canWithdrawBouns;
                            console.log(this.accountMsg,this.total,'9')
                            if( this.accountMsg>this.total+1){
                            this.hahaShow=true
                            }else{
                            this.hahaShow=false
                            }
                    }
                })
            },
            linktoCycle() {
                this.$router.push('/settings/cyclePresentation?index=' + this.index+'&money='+this.accountMsg);
            },
            confirmTX() {
                let that = this;
                if (this.count == 0) {
                    Toast('请选择周期提现');
                    return
                }
                let total = (this.total / 100).toFixed(2);
                let lastTotal = this.total != 0 ? (this.total / 100 - 1).toFixed(2) : '0.00';
                if (this.index == 6) {
                    this.msg = "您本次申请提现金额¥" + total + "，实际到账金额¥" + total +
                        "。手续费：¥:1.00将从余额中扣除，余额不足时将从本次提现金额扣除，确定提现后，将于两个工作日左右处理到账，请注意查收，谢谢！"
                } else {
                    this.msg = "您本次申请提现金额¥" + total + "，手续费：¥:1.00，实际到账金额¥" + lastTotal +
                        "。确定提现后，将于两个工作日左右处理到账，请注意查收，谢谢！"
                }
                MessageBox({
                    title: "提示",

                    message: this.msg,
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"

                }).then(action => {
                    if (action == 'confirm') {
                        that.weekIds = that.weekIds.slice(0, -1);
                        // console.log(this.weekIds);
                        that.applyWithdrawal();
                        // console.log(this);

                        // that.$router.push('/bank/successful');

                    }
                });

            },
            applyWithdrawal() {
                let that = this;
                let type = this.index == 6 ? 1 : 0;
                let param = {
                    userId: this.userId,
                    weekIds: this.weekIds,
                    type: type
                }
                console.log(param);
                axios({
                    url: this.Api + "ledgerwithdraw/applyWithdrawal",
                    method: "post",
                    data: qs.stringify(param),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.Bool) {
                        console.log(res);
                        that.$router.push('/bank/successful')
                        that.$store.commit("removeWithdrawal")
                        that.count = 0;
                        that.total = 0;
                        sessionStorage.removeItem('fee');

                    } else {
                        Toast(res.data.Msg);
                    }
                })
            },
            // 获取银联卡信息
            // 获取银联入驻信息
            getYLinfo() {
                let seq = this.$cookie.get('seq');
                axios.get(this.Api + 'UnionPayEnter/findAccountInfo?seq=' + seq, {
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            console.log(res);
                            let name = res.data.data.bankName;
                            let idx = name.indexOf('行');
                            this.position = idx + 1;
                            this.bankName = name;
                            this.cardNo = res.data.data.bankCard;
                        }
                    })
            },


        }
    }

</script>
<style scoped>
    .glode {
        background-color: #f2f2f2;
        min-height: 100vh;
        overflow: hidden;
    }

    .cartList {
        margin: .4444rem
            /* 20/45 */
            .6667rem
            /* 30/45 */
            0;
        background-color: #ffffff;
        padding: .6667rem
            /* 30/45 */
            1.2667rem
            /* 57/45 */
        ;
        border-radius: .2222rem
            /* 10/45 */
        ;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .cartList .text {
        flex: 1;
    }

    .cartList .buttext {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 13px;
        color: #666;
    }

    .cartList .buttext .but i {
        padding: 0 0.7em;
        color: #e9e9e9;
    }

    .cartList .text .bankname {
        font-size: 16px;
        line-height: 1.6em;
        color: #333;
        margin-bottom: 0.4em;
    }

    .cartList .text .addtext {
        font-size: 16px;
        line-height: 1.6em;
        color: #fe7000;
    }

    .cartList .text .bankname img {
        width: auto;
        height: 1em;
        vertical-align: middle;
        padding-right: 0.5em;
    }

    .cartList .text .bankname .state {
        color: #fe7000;
        font-size: 14px;
        margin-left: .4444rem
            /* 20/45 */
        ;
    }

    .cartList .text .numbers {
        font-size: 14px;
        line-height: 1.6em;
        color: #999;
    }

    .choose {
        margin: .4444rem
            /* 20/45 */
            .6667rem
            /* 30/45 */
            0;
        background-color: #fff;
        padding: 1rem
            /* 45/45 */
            .6667rem
            /* 30/45 */
        ;
        font-size: .6667rem
            /* 30/45 */
        ;
        color: #333333;
        display: flex;
        justify-content: space-between;
        border-radius: .2222rem
            /* 10/45 */
        ;
    }

    .choose .chooseBtn {
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #999999;
    }

    .choose .chooseBtn::after {
        content: "";
        display: inline-block;
        width: 0.4rem;
        height: 0.4rem;
        border-top: 1px solid #999999;
        border-right: 1px solid #999999;
        transform: rotate(45deg);
        margin-left: .2222rem
            /* 10/45 */
        ;
    }

    .details {
        margin: .4444rem
            /* 20/45 */
            .6667rem
            /* 30/45 */
            0;
        padding: .8889rem
            /* 40/45 */
            .6667rem
            /* 30/45 */
        ;
        background-color: #fff;
        border-radius: .2222rem
            /* 10/45 */
        ;
    }

    .details .titel {
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #666;

    }

    .details .total {
        padding: .6444rem
            /* 29/45 */
            0 .4444rem
            /* 20/45 */
        ;
        font-size: 1.2444rem
            /* 56/45 */
        ;
        color: #333;
    }

    .details .total span {
        font-size: .8rem
            /* 36/45 */
        ;
        margin-right: .4444rem
            /* 20/45 */
        ;
    }

    .details .explain {
        width: 100%;
        border-top: 1px solid #eeeeee;
        padding-top: .4444rem
            /* 20/45 */
        ;
    }

    .details .explain p:first-child {
        padding-bottom: .8889rem
            /* 40/45 */
        ;
    }

    .details .explain p span {
        color: #ff0051;
    }

    .details .explain p {
        color: #666;
        font-size: .5333rem
            /* 24/45 */
        ;
        line-height: 1rem
            /* 45/45 */
        ;
    }

    .confirm {
        margin: .6667rem
            /* 30/45 */
            3.3333rem
            /* 150/45 */
        ;
        text-align: center;
        height: 1.7778rem
            /* 80/45 */
        ;
        line-height: 1.7778rem
            /* 80/45 */
        ;
        background-color: #ff9500;
        font-size: .7111rem
            /* 32/45 */
        ;
        color: #fefefe;
        border-radius: .8889rem
            /* 40/45 */
        ;
    }

</style>
