<template>
    <div class="settings">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="main">
            <div class="bgt">
                <div class="yue"> 余额 (元)</div>
                <div class="tixian">
                    <div class="a1"><span style="font-size: 0.58rem;">￥</span>{{paymoney}}</div>
                    <div class="a2" @click="Cash">去提现 <i class="el-icon-arrow-right"></i></div>
                </div>
            </div>
            <div class="cart" @click="Settlement">
                <div class="left"> <img src="@/assets/images/storeplat/zcgli_bga.png">
                    <p>待结算</p>
                </div>
                <div class="right"><span style="color: #FF4400;"></span> <i
                        class="el-icon-arrow-right"></i> </div>
            </div>
            <div class="cart" @click="Reconciliat">
                <div class="left"> <img src="@/assets/images/storeplat/zcgli_bgb.png">
                    <p>提现记录</p>
                </div>
                <div class="right"> <i class="el-icon-arrow-right"></i> </div>
            </div>
        </div>

    </div>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                topnav: {
                    title: '资产管理'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                paymoney: '',
                merId: this.$route.query.id
            }
        },
        mounted() {
              this.getInfo();
        },
        methods: {
            //待结算
            Settlement() {
                this.$router.push({
                    path: '/storeplat/settlement'
                })
            },
            //对账单
            Reconciliat() {
                this.$router.push({
                    path: '/storeplat/Statement'
                })
            },
            //去提现
            Cash() {
                this.$router.push({
                    path: '/storeplat/Balance'
                })
            },
            //获取图标信息
            getInfo() {
                let post = {
                    merId: this.merId
                };
                axios({
                    url: this.Api1 + '/pay/sl/get',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.paymoney = res.data.data.total;

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //返回
            goback() {
                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                    window.action.backAPPiOS()
                } else {
                    this.$router.go(-1)
                }
            },

        },
    }

</script>

<style scoped>
    .settings {

        min-height: 100vh;
        padding-top: 40px;
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
        font-size: 18px;
        text-indent: -50px;
    }

    .main {
        font-size: 0.58rem;
        color: #333;
        padding: 0.5rem;
    }

    .bgt {
        background: linear-gradient(#FFC406, #FFA323);
        width: 100%;
        height: 6rem;
        border-radius: 0.5rem;
        padding: 0.5rem 0 0.5rem 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .bgt .tixian {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .bgt .tixian .a1 {
        color: #fff;
        font-size: 0.9rem;
    }

    .bgt .tixian .a2 {
        background-color: #FFEDB4;
        line-height: 1.2rem;
        padding: 0 0.4rem;
        border-radius: 0.6rem 0 0 0.6rem;
    }

    .bgt .yue {
        color: #fff;
        font-size: 0.65rem;
    }

    .cart {
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .cart .left {
        display: flex;
        flex: 1;
        align-items: center;
    }

    .cart .left img {
        width: 1rem;
        height: 1rem;
        margin-right: 0.3rem;
    }

</style>
