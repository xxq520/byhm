<template>
    <div class="ChangeCode" v-if="!xiuCode">
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>

        <div class="formwrap">
            <div class="cart-list">
                <label>消费金额:</label>
                <p class="lmain">
                    <input type="text" placeholder="询问店员后输入" v-model="xfmoney" @input="yhxz()">
                </p>
            </div>
            <div class="cart-list">
                <label>不参与优惠金额:</label>
                <p class="lmain">
                    <input type="text" placeholder="询问店员后输入" v-model="ewmoney" @input="bcyje()">
                </p>
            </div>
        </div>
        <div class="youhui" v-show="hui.length"> 选择优惠活动 </div>
        <div class="formwrap" v-show="hui.length">
            <div class="cart-list" v-for="item in hui">
                <label>{{item.detail}}</label>
                <p class="lmain" v-if="item.type == 2&&xiShow&&Number(item.enoughAmount) > xfmoney"
                    style="color:#FF830D ;">
                    未满足活动条件
                </p>
                <p class="lmain" @click="qietap(item.id,item.detail)" v-else>
                    <img src="@/assets/images/storeplat/by_payment_ict.png" v-show="shopidx== item.id"> <img
                        src="@/assets/images/storeplat/by_payment_ics.png" v-show="shopidx !=item.id">
                </p>
            </div>
            <div class="tixing">*优惠活动中的金额将从百业惠盟抵扣券中抵扣，当前券余额<span class="aa" v-show="jmoney">￥{{jmoney}}</span>，本次抵扣<span
                    class="aa">￥{{dikou?dikou:'0.00'}}</span></div>
        </div>
        <div class="formwrap">
            <div class="cart-list">
                <label>抵扣金额:</label>
                <p class="lmain"> <span class="aa">￥{{dikou?dikou:'0.00'}}</span> </p>
            </div>
            <div class="cart-list">
                <label>实付金额:</label>
                <p class="lmain"> <span class="aa">￥{{actual?actual:'0.00' }}</span> </p>
            </div>
        </div>
        <div class="btnwrap">
            <div class="btn" type="default" @click="sureChange">确认买单</div>
        </div>
        <div class="bullet" v-if="tapShow">
            <div class="main">
                <div class="closes" @click="close()"><img src="@/assets/images/storeplat/zcgli_icon_del.png">
                </div>
                <div class="heads">温馨提示</div>
                <div class="conts">
                    抵扣券余额不足,无法完全抵扣
                </div>
                <div class="foots">
                    <div class="c1" @click="gotel">剩余额度抵扣</div>
                    <div class="c2" @click="addtime">购买抵扣券</div>
                </div>
            </div>
        </div>
    </div>
    <div class="ChangeCode" v-else>
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>买单成功</span>
        </div>
        <div class="mainbox">
            <div class="imgs"><img src="@/assets/images/user/by_bgima_1.png" alt=""></div>
            <div style="color: #333;font-size: 0.75rem;line-height: 1.2rem;">买单成功</div>
            <div class=" A1" @click="back">返回店铺</div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'ChangeCode',
        data() {
            return {
                topnav: {
                    title: '商品信息'
                },
                userPhone: this.$cookie.get('userPhone'),
                seq: this.$cookie.get('seq'),
                userId: this.$cookie.get('userid'),
                id: this.$route.query.id,
                xiuCode: false,
                xfmoney: '',
                ewmoney: '',
                shopidx: 0,
                hui: [],
                xiShow: false,
                jmoney: 0,
                dikou: 0,
                actual: 0,
                tapShow: false,
                detail: ''
            }
        },
        mounted() {
            this.getdis()
        },
        watch: {


        },
        methods: {

            goback() {
                if (this.xiuCode) {
                    this.xiuCode = false;
                    this.topnav.title = "商品信息"
                } else {
                    if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                        window.action.backAPP();
                    } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                        window.action.backAPPiOS()
                    } else {
                        this.$router.go(-1)
                    }
                }
            },
            back() {
                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                    window.action.backAPPiOS()
                } else {
                    this.$router.go(-1)
                }
            },
            //保存
            sureChange() {
                if (this.xfmoney == '') {
                    Toast('请先输入消费金额')
                    retrun;
                }

                var ewmoney = 0;
                if (this.ewmoney != '') {
                    ewmoney = this.ewmoney
                }
                let post = {
                    seq: this.seq,
                    voucherId: this.shopidx,
                    amount: this.xfmoney,
                    nonparticipation: ewmoney,
                    userId: this.userId,
                    merId: this.id,
                    payChannel: 0,
                    remarks: this.detail

                };
                axios({
                    url: this.Api + '/consumptionrecord/insertRecord',
                    data: post,
                    method: "POST",
                    headers: {
                       
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        this.xiuCode = true
                    }
                })


            },
            //选择优惠活动
            qietap(val, detail) {
                if (this.xfmoney == '') {
                    Toast('请先输入消费金额')
                    retrun;
                }
                this.shopidx = val;
                this.detail = detail;
                this.getActual()

            },
            //获取折扣价
            getActual() {
                var ewmoney = 0;
                if (this.ewmoney != '') {
                    ewmoney = this.ewmoney
                }
                console.log(
                    this.ewmoney, this.xfmoney
                );

                let post = {
                    seq: this.seq,
                    voucherId: this.shopidx,
                    amount: this.xfmoney,
                    nonparticipation: ewmoney
                };
                axios({
                    url: this.Api + '/consumptionrecord/queryActually',
                    data: post,
                    method: "POST",
                    headers: {
                    
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data
                        this.dikou = data.discounts;
                        this.actual = data.actually;
                        if (!data.isEnough) {
                            this.tapShow = true;
                        }
                    }
                })
            },

            //获取优惠信息
            getdis() {
                let post = {
                    seq: this.seq,
                    id: this.id,
                    // id: 652,
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
                        this.jmoney = data.balance;
                        this.hui = data.voucherVOS;
                    }
                })
            },
            //监听输入框
            yhxz() {

                if (Number(this.xfmoney) < 0) {
                    Toast('消费金额必须大于0')
                    this.xfmoney = '';
                }
                if (Number(this.ewmoney) > Number(this.xfmoney)) {
                    this.ewmoney = this.xfmoney
                }
                if (this.xfmoney == '') {
                    this.xiShow = false;
                }
                this.getActual()

            },
            //监听不参与金额变化
            bcyje() {
                
                if (this.ewmoney == '') {
                    Toast('请先输入消费金额')
                    retrun;
                }
                if (Number(this.ewmoney) < 0) {
                    Toast('不参与优惠金额必须大于0');
                    this.ewmoney = '';
                }
                if (Number(this.ewmoney) > Number(this.xfmoney)) {
                    this.ewmoney = this.xfmoney;
                    Toast('不参与优惠金额不能大于消费金额')
                }
       
                this.getActual()
            },
            //不足抵扣
            gotel() {
                this.tapShow = false
            },
            //购券
            addtime() {
                this.$router.push({
                    path: "/cashRegister",
                    query: {
                        cardType: 1,
                        level: 1,
                        code: 0
                    }
                });
            },
            //关闭弹窗
            close() {
                this.tapShow = false
            }
        },
        created() {

        }
    }

</script>

<style scoped>
    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        min-height: 100vh;
        padding-top: 40px;
        padding-bottom: 3.5rem;
        position: relative;
    }

    .mainbox {

        font-size: 0.62rem;
        color: #666;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90vh;
    }

    .mainbox .imgs {
        width: 50%;
        margin-top: 4rem;
        margin-bottom: 1.5rem;

    }


    .A1 {
        width: 60%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        border-radius: 0.8rem;
        margin-top: 2rem;
        background-color: #ff911e;
        color: #fff;
    }

    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 0.62rem;
        text-align: center;
        text-indent: -2em;
    }

    .formwrap {
        margin-top: 0.4rem;
        background-color: #fff;
    }

    .formwrap .tixing {
        font-size: 0.62rem;
        color: #999;
        padding: 0.3rem 0.5rem;
        line-height: 0.9rem;
    }

    .formwrap .aa {
        color: #FF830D;
    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .btn {
        width: 9rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.2rem;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        padding-right: 0.5rem;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        flex: 1;
        color: #333;
        margin-left: .416667rem;

    }

    .cart-list .lmain img {
        width: 0.8rem;
        height: 0.8rem;
        margin-left: 0.5rem;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

    .youhui {
        width: 100%;
        height: 2rem;
        color: #FF8004;
        font-size: 0.65rem;
        line-height: 2rem;
        padding: 0 0.5rem;
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

    .bullet .closes {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 0.65rem;
        height: 0.65rem;
    }

    .bullet .main {
        width: 80%;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 0.58rem;
        position: relative;
    }

    .bullet .main .heads {
        line-height: 1.4rem;
        text-align: center;
    }

    .bullet .main .conts {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 3.2rem;
    }

    .bullet .main .foots {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.62rem;
        justify-content: space-around;
    }

    .bullet .main .foots .c1 {
        width: 40%;
        text-align: center;
        color: #333;
        background-color: #bbb;
        border-radius: 0.4rem;
    }

    .bullet .main .foots .c2 {
        width: 40%;
        text-align: center;
        color: #fff;
        background-color: #ff911e;
        border-radius: 0.4rem;
    }

</style>
