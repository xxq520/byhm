<template>
    <div class="settings">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="ljuan">
            <div class="cart-list">
                <label style="width: 8em;">提现至:</label>
                <p class="lmain">
                    <input type="text" placeholder="请选择" v-model="ads" readonly>
                    <i class="el-icon-arrow-right "></i>
                </p>
            </div>
            <div class="cart">
                <label>提现金额:</label>
                <p class="lmain">
                    ￥ {{balance}}
                </p>
            </div>
            <div class="dis">
                <div class="a1">当前余额为￥{{balance}}</div>

            </div>

        </div>
        <div class="footer">
            <div class="tijiao" @click="toCash">
                提现
            </div>
        </div>
        <div v-if="zhifuShow" class="zhezao">
            <div class="pwd-box">
                <img src="@/assets/images/storeplat/zcgli_icon_del.png" class="closes" @click="closes">
                <div id="box-title">请输入提现密码</div>
                <input type="tel" maxlength="6" class="pwd-input" id="pwd-input" v-model="password" @input="passChange">
                <div class="fake-box">
                    <input type="password" readonly v-model="pass1">
                    <input type="password" readonly v-model="pass2">
                    <input type="password" readonly v-model="pass3">
                    <input type="password" readonly v-model="pass4">
                    <input type="password" readonly v-model="pass5">
                    <input type="password" readonly v-model="pass6">
                </div>
                <div class="btn" @click="Submit">确定</div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '余额提现'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                paytotal: '',
                shopClassName: '银行卡',
                shopVisible: false,
                balance: '',
                tixianShow: false,
                password: null,
                pass1: null,
                pass2: null,
                pass3: null,
                pass4: null,
                pass5: null,
                pass6: null,
                zhifuShow: false,
                bankName:'',
                btnShow:true,
                ads:'',
            }
        },
        mounted() {
            this.getInfo();
            this.getCard();

        },
        methods: {
            //关闭输入支付密码
            closes() {
                this.zhifuShow = false;
            },
            //获取银行卡信息
            getCard() {

                this.zhifuShow = false;
                let post = {
                    userId: this.userid,
                    type: 0
                };
                this.btnShow = false; 
                axios({
                    method: "get",
                    url: this.Api + '/userledgerregister/findOneByUserIdAndType',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    params: post
                }).then(res => {
                    this.btnShow = true;
                    if (res.data.code == 0) {
                      this.shopClassName = res.data.list.bankNo;
                      this.bankName = res.data.list.bankName;
                      if(this.bankName==null){
                       this.bankName = '' ;
                      }
                      this.ads = this.bankName  +' '+ this.shopClassName ;
                    } else {
                  
                    }
                })

            },
            //确定提现

            Submit() {
                this.zhifuShow = false;
                let post = {
                    merId: this.merId,
                    secretKey: this.password
                };

                axios({
                    method: "post",
                    url: this.Api1 + '/pay/sl/apply',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    data: post
                }).then(res => {
                    this.password = '';
                    this.passChange();
                    if (res.data.code == 200) {
                        Toast('已提交提现申请，请等待审核');


                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //输入支付密码
            passChange() {
                let arr = this.password.split("")
                arr.length
                switch (arr.length) {
                    case 0:
                        this.pass1 = null;
                        this.pass2 = null;
                        this.pass3 = null;
                        this.pass4 = null;
                        this.pass5 = null;
                        this.pass6 = null;
                        break;
                    case 1:
                        this.pass1 = arr[0];
                        this.pass2 = null;
                        this.pass3 = null;
                        this.pass4 = null;
                        this.pass5 = null;
                        this.pass6 = null;
                        break;
                    case 2:
                        this.pass1 = arr[0];
                        this.pass2 = arr[1];
                        this.pass3 = null;
                        this.pass4 = null;
                        this.pass5 = null;
                        this.pass6 = null;
                        break;
                    case 3:
                        this.pass1 = arr[0];
                        this.pass2 = arr[1];
                        this.pass3 = arr[2];
                        this.pass4 = null;
                        this.pass5 = null;
                        this.pass6 = null;
                        break;
                    case 4:
                        this.pass1 = arr[0];
                        this.pass2 = arr[1];
                        this.pass3 = arr[2];
                        this.pass4 = arr[3];
                        this.pass5 = null;
                        this.pass6 = null;
                        break;
                    case 5:
                        this.pass1 = arr[0];
                        this.pass2 = arr[1];
                        this.pass3 = arr[2];
                        this.pass4 = arr[3];
                        this.pass5 = arr[4];
                        this.pass6 = null;
                        break;
                    case 6:
                        this.pass1 = arr[0];
                        this.pass2 = arr[1];
                        this.pass3 = arr[2];
                        this.pass4 = arr[3];
                        this.pass5 = arr[4];
                        this.pass6 = arr[5];
                        break;
                }

            },
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
                        this.balance = res.data.data.total;

                    } else {
                        Toast(res.data.message)
                    }
                })
            },

            //去提现
            toCash() {
                if(!this.btnShow){
                    return;
                }
                if (Number(this.balance) == 0) {
                    Toast("无可提现余额");
                    return;
                }
                this.zhifuShow = true;

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
        background: #eee;
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

    .ljuan {
        margin-top: 0.5rem;
        padding: 0.5rem;
        background-color: #fff;
    }

    .ljuan>>>.item {
        color: #333;
        font-size: 0.55rem;
        margin-right: 0.3rem;
        flex: 1;
        padding-right: 1rem;
        text-align: right;
        display: flex;
        align-items: center;

    }

    .settings .footer {
        position: absolute;
        left: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 1.5rem 0;
    }

    .settings .footer .tijiao {
        font-size: 0.6rem;
        width: 60%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 0;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart {
        padding: 0.4rem 0;
        font-size: 0.6rem;
        border-bottom: 1px solid #eee;
    }

    .cart label {
        line-height: 1.2rem;
    }

    .cart .lmain {
        line-height: 1.6rem;
    }

    .cart .lmain input {
        margin-left: 0.5rem;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }



    .cart-list p.lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem;
        padding-right: 0.4rem;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

    .cart-list input.a1 {
        padding-right: 0.5rem;
    }

    .mint-popup {
        width: 100%;
    }

    .visiblebtn>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .visiblebtn>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

    .dis {
        display: flex;
        align-items: center;
        line-height: 1.2rem;
        font-size: 0.55rem;
        color: #666;
    }

    .dis .a2 {
        margin-left: 0.5rem;
        color: #ff4400;
    }

    .zhezao {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 40px;
        background: rgba(0, 0, 0, 0.4);
        z-index: 99;
    }

    .pwd-box {
        width: 74%;
        height: 8rem;
        left: 13%;
        top: 40%;
        position: absolute;
        border: none;
        background: white;
        border-radius: 10px;
        padding: 0.5rem;
    }

    .pwd-box .closes {
        width: 0.62rem;
        height: 0.62rem;
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;

    }

    .pwd-box .btn {
        width: 70%;
        height: 1.5rem;
        background-color: #ff911e;
        color: #fff;
        border-radius: 0.8rem;
        margin-left: 15%;
        text-align: center;
        font-size: 0.65rem;
        line-height: 1.5rem;
        margin-top: 1rem;
    }

    .pwd-box input[type="tel"] {
        width: 100%;
        height: 2rem;
        color: transparent;
        position: absolute;
        top: 75px;
        left: 0;
        border: none;
        font-size: 18px;
        opacity: 0;
        z-index: 1;
        letter-spacing: 25px;
    }

    .fake-box {
        width: 90%;
        bottom: 2px;
        height: 1.575rem;
        margin-top: 30px;
        margin-left: 5%;
        border: 1px solid #bfb6b6;
        display: flex;

    }

    .fake-box input {
        width: 16.7%;
        height: 1.575rem;
        border: none;
        border-right: 1px solid #e5e5e5;
        text-align: center;
        font-size: 1rem;
        margin: 0 !important;
    }

    .fake-box input:nth-last-child(1) {
        border: none;
    }

    #box-title {
        height: 1.5rem;
        width: 100%;
        text-align: center;
        font-size: 0.65rem;
        border-bottom: 0.2px solid #e5e5e5;
    }

</style>
