<template>
    <div class="settings">
        <topnav :topnav="topnav"></topnav>
        <div class="ljuan">
            <div class="cart-list abs">
                <div class="tite">
                    <img src="@/assets/images/storeplat/spxx_icon_da.png">
                    <p>达达配送</p>
                    <p class="fc">{{status==1?'(审核不通过)':status==2?'(审核中)':status==3?'(审核通过)':''}}</p>
                </div>
                <div class="items">
                    <el-switch class="switchStyle" v-model="scope" active-color="#ff9d19" active-text="已开启" on-value="1"
                        inactive-color="#eee" inactive-text="已关闭" off-value="0" @change="changeSwitch(scope)">
                    </el-switch>
                </div>
            </div>
            <div class="cart-list ad">
                <div>请确保您已在达达注册商户,填写一下信息点击商户注册,我们将帮您自动绑定达达账号</div>
            </div>
            <div v-if="scope">
                <div class="cart-list" v-if="status == 3">
                    <div  style="display:flex; height: 1.8rem; align-items: center;flex: 1;">
                        <div class="a1">账户余额：</div>
                        <div style="color: #ff4400;">￥{{money}}</div>
                    </div>
                    <div style="display:flex; height: 1.8rem; align-items: center; justify-content: flex-end;">
                      <div class="chongzhi">充值</div>
                    </div>
                    
                </div>
                <div class="cart-list">
                    <div class="left">
                        <div class="a1">商户编号<span class="f1">*</span>:</div>
                        <div class="a2">请登录达达商户管理平台查看您的商户ID</div>
                    </div>
                    <p class="lmain">
                        <input type="text" placeholder="请输入" v-model="shCard" :readonly="readonly">
                    </p>
                </div>
                <div class="cart-list">
                    <div class="left">
                        <div class="a1">手机号<span class="f1">*</span>:</div>
                        <div class="a2">注册商户的手机号</div>
                    </div>
                    <p class="lmain">
                        <input type="text" placeholder="请输入" v-model="shPhone"  :readonly="readonly">
                    </p>
                </div>
                <div class="cart-list">
                    <div class="left">
                        <div class="a1">城市名称<span class="f1">*</span>:</div>
                        <div class="a2">商户城市名称 (如,上海) 不要“市”</div>
                    </div>
                    <p class="lmain">
                        <input type="text" placeholder="请输入" v-model="shArea" :readonly="readonly">
                    </p>
                </div>
                <div class="cart-list">
                    <div class="left">
                        <div class="a1">企业名称<span class="f1">*</span>:</div>
                    </div>
                    <p class="lmain">
                        <input type="text" placeholder="请输入" v-model="shName" :readonly="readonly">
                    </p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="tijiao" v-if="status== 0"> 绑定达达账号</div>
            <div class="tijiao" v-if="status== 1"> 重新绑定达达账号</div>
        </div>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '配送'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                scope: true,
                status: 0,
                shCard: '',
                shPhone: '',
                shArea: '',
                shName: '',
                money:'200.00',
                readonly:false,

            }
        },
        mounted() {
               if(this.status==2||this.status==3){
                   this.readonly =true
               }
        },
        methods: {

            //开关
            changeSwitch(data) {
                console.log(data)
            },
        },
    }

</script>

<style scoped>
    .settings {

        min-height: 100vh;
        background: #eee;

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


    .ljuan>>>.items {
        margin-left: 0.5rem;
        font-size: 0.55rem;
        padding-right: 0.5rem;
        display: flex;
        justify-content: flex-end;

    }

    .ljuan>>>.switchStyle .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }

    .ljuan>>>.switchStyle .el-switch__label--left {
        z-index: 9;
        left: 1rem;
    }

    .ljuan>>>.switchStyle .el-switch__label--right {
        z-index: 9;
        left: -0.1rem;
    }

    .ljuan>>>.switchStyle .el-switch__label.is-active {
        display: block;
        line-height: 1.2rem !important;
        height: 1.2rem;

    }

    .ljuan>>>.switchStyle.el-switch .el-switch__core,
    .ljuan>>>.el-switch .el-switch__label {
        width: 3.1rem !important;
        height: 1.2rem !important;
    }

    .ljuan>>>.el-switch__core:after {
        top: .22rem;

    }

    .ljuan>>>.el-switch__core {
        border-radius: 0.6rem;
    }

    .ljuan>>>.el-switch__label * {
        font-size: 0.5rem;
    }

    .ljuan>>>.el-switch__core:after {
        width: 0.7rem;
        height: 0.7rem;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.2rem 0;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }
    .cart-list .chongzhi {
        width: 2.25rem;
        height: 1rem;
        line-height: 1rem;
        border: 1px solid #FF9D19;
        color: #ff911e;
        text-align: center;
        border-radius: 0.2rem;
    }
    .cart-list .left .a1 {
        line-height: 1rem;
    }

    .cart-list .left .a2 {
        color: #999;
        font-size: 0.45rem;
    }

    .cart-list img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.3rem;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list .left .a1 .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.2rem;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: #333;
        flex: 1;
        margin-left: .416667rem;
    }

    .cart-list .lmain input {
        width: 100%;
        text-align: right;
        color: #666;
    }

    .abs {
        height: 2.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: 0;

    }

    .abs .tite {
        flex: 1;
        font-size: 0.58rem;
        color: #333;
        display: flex;

    }

    .abs .tite img {
        width: 1.25rem;
        height: 1.25rem;

    }

    .abs .tite p {
        line-height: 1.25rem;
        font-weight: 500;
    }

    .abs .tite .fc {
        margin-left: 0.3rem;
        color: #ff4400;
    }

    .ad {
        color: #999;
        padding: 0.3rem 0;
        font-size: 0.45rem;
        line-height: 0.9rem;
    }

</style>
