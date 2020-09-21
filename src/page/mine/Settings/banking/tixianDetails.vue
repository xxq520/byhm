<template>
    <div class="warp">
        <topnav :topnav="topnav"></topnav>
        <ul class="tab">
            <li v-if="idx==3" :class="{act : cur_tab == 3 }" @click="changeState(3)"><span>入驻前</span></li>
            <li v-if="idx==3&&isYLEnter" :class="{act : cur_tab == 4}" @click="changeState(4)"><span>入驻后</span>
            </li>
            <li v-if="idx==5" :class="{act : cur_tab == 5 }" @click="changeState(5)"><span>入驻前</span></li>
            <!-- <li v-if="idx==5&&isYLEnter" :class="{act : cur_tab == 6}" @click="changeState(6)"><span>入驻后</span>
            </li> -->
            <li v-if="idx==1" class="act" @click="changeState(0)"><span>普通账户</span></li>
        </ul>

        <div class="details" v-if="cur_tab == 6||cur_tab == 4">
            <p>可提现金额(元)</p>
            <p class="total">{{accountMsg.canWithdrawBouns?(accountMsg.canWithdrawBouns/100):'0'}}</p>
            <div class="partList">
                <div class="part">
                    <p class="title">发展分利(元)</p>
                    <p>{{accountMsg.managementBouns?(accountMsg.managementBouns/100):'0'}}</p>
                </div>
                <i class="line"></i>
                <div class="part">
                    <p class="title">管理分利(元)</p>
                    <p>{{accountMsg.recommendBouns?(accountMsg.recommendBouns/100):'0'}}</p>
                </div>
            </div>
        </div>
        <div class="details" v-else>
            <p>可提现金额(元)</p>
            <p class="total" v-if="cur_tab==1">
                {{money?money:'0'}}</p>
            <p class="total" v-if="cur_tab==3">
                {{money?money:'0'}}</p>
            <p class="total" v-if="cur_tab==5">
                {{money?money:'0'}}</p>
        </div>
        <div class="btnLis">
            <div :class="accountMsg.canWithdrawBouns== 0? 'disable ':'tixian'" @click="linkTotixian(cur_tab)"
                v-if="cur_tab == 4">立即提现</div>
                <div :class="accountMsg.canWithdrawBouns <0? 'disable ':'tixian'" @click="linkTotixian(cur_tab)"
                    v-if="cur_tab == 6">立即提现</div>
            <div :class="money== 0? 'disable ':'tixian'" @click="linkTotixian(idx)"
                v-if="cur_tab == 3||cur_tab == 1||cur_tab == 5">
                立即提现</div>
            <span style="color:#f00;font-size:12px;"
                v-if="cur_tab == 6&&accountMsg.canWithdrawBouns <1000">您的余额不足10元，无法提现！</span>
            <div class="record" @click="linkToRecord(cur_tab)">提现记录</div>
              
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '普通账户提现'
                },
                cur_tab: 1,
                isPartner: this.$cookie.get('isPartner'), //是否合伙人
                userId: this.$cookie.get('userid'),
                accountMsg: {},
                // isYLeEnter:this.$cookie.get('isYLEnter'),//是否银联入驻
                isYLEnter: false,
                balance: '', //普通账户
                seq: this.$cookie.get('seq'),
                ledger_balance: '', //入驻前
                app: this.$route.query.platform,
                cycleList: [], //可提现周期
                idx: this.$route.query.idx,
                money: this.$route.query.money
            }
        },

        mounted() {
            this.getYLinfo();
            // console.log(this.isYLEnter);
            this.getAccountMsg();
            // this.getGenBalanceByUid();
            // this.getLedgerBalance();
            this.getData();
            console.log(this.cycleList);
            this.topnav.title = this.idx == 5 || this.idx == 4 ? "高汇通账户提现" : this.idx == 2 || this.idx == 3 ? "银联账户提现" :
                '普通账户提现';
          
        },
        methods: {
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
                 let type = this.idx==5?1:0;

                axios({
                    url: this.Api + "ledgerwithdraw/getWithdrawBalance",
                    method: "post",
                    data: qs.stringify({
                        userId: this.userId,
                        type: type
                    }),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.Bool == true) {
                        this.accountMsg = res.data.Data;
                        // console.log( this.accountMsg,'86')
                        sessionStorage.setItem('total', this.accountMsg.canWithdrawBouns);

                    }
                })
            },
            changeState(idx) {
                this.cur_tab = idx;
            },
        
            linkTotixian(idx) {
         
                if (idx==4&&this.cycleList.length>0 ) {
                        
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
                  
                    this.$router.push('/settings/bankList?idx='+idx);
                }

            },
            linkToRecord(idx) {
                
                if (idx == 4||idx == 6) {

                    this.$router.push({path:'/mine/drawalRecordNew',query:{index:idx}});
                   
                } else if (idx == 3||idx == 5) {
                    this.$router.push({path:'/mine/separateRecord',query:{index:idx}});
                } else {
                    this.$router.push('/mine/drawalRecordPT');
                }

            },
            // 普通账户
            // getGenBalanceByUid() {
            //     axios.get(
            //         this.Api + "user/getGenBalanceByUid?uid=" + this.userId
            //         // {headers: { "X-Nideshop-Token": this.$cookie.get('token') }}
            //     ).then(res => {
            //         if (res.data.code == 0) {
            //             console.log(res.data.gen_balance);
            //             this.balance = res.data.gen_balance;
            //         }
            //     });

            // },
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
                                this.isYLEnter = true;
                                if (this.idx == 3) {
                                    this.cur_tab = 4;
                                }
                                if (this.idx == 5) {
                                    this.cur_tab = 5;     
                                }
                            } else {
                                if (this.idx == 3) {
                                    this.cur_tab = 3;
                                }
                                if (this.idx == 5) {
                                    this.cur_tab = 5;
                                }
                            }
                        }
                    })
            },
            // 银联入驻前
            // getLedgerBalance() {
            //     axios.get(
            //         this.Api + "user/getLedgerBalanceByUid?uid=" + this.userId
            //         // {headers: { "X-Nideshop-Token": this.$cookie.get('token') }}
            //     ).then(res => {
            //         console.log(11);
            //         console.log(res.data);
            //         if (res.data.code == 0) {
            //             this.ledger_balance = res.data.ledger_balance;
            //         }
            //     });
            // },
            // 去入驻
            // goToYL() {
            //     if (this.app) {
            //         window.location.href = this.YLApi + "wholesale/uploading?from=by&isApp=" + this.app + "&seq=" + this
            //             .$cookie.get('seq');
            //     } else {
            //         window.location.href = this.YLApi + "wholesale/uploading?from=by&seq=" + this.$cookie.get('seq');
            //     }
            // },
            // 判断能否提现
            getData() {
                axios.get(this.Api + 'ledgerwithdrawweekly/findByUserId?userId=' + this.userId + '&auditStatus=0', {
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    })
                    .then(res => {
                        console.log(res,'3');
                        if (res.data.Bool == true) {
                            this.cycleList = res.data.Data;

                            
                        }
                    })
            },

        }
    }

</script>
<style scoped>
    .warp {

        min-height: 100vh;
        background-color: #f2f2f2;
        overflow: hidden;
    }

    .tab {
        width: 100%;
        height: 1.9556rem;
        line-height: 1.9556rem;
        box-sizing: border-box;
        display: flex;

        justify-content: space-around;
        background-color: #ffffff;
    }

    .tab li {
        text-align: center;
        font-size: .6667rem;
        background-color: #ffffff;
        color: #333333;
    }

    .tab li.act span {
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
        margin-top: 0.4rem;
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
        color: #666;
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
        flex-direction: column;
        align-items: center;
        padding-top: 1rem;
        text-align: center;
    }

    .btnLis div {
        padding: 0 1.7111rem;
      
        width: 70%;
        height: 1.5556rem
        
        ;
        line-height: 1.5556rem
            /* 70/45 */
        ;
        border-radius: .7778rem
            /* 35/45 */
        ;
        font-size: .7rem;
        margin-bottom: 0.2rem;
        margin-top: 0.3rem;
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
