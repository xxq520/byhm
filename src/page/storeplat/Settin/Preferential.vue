<template>
    <div class="settings">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <div class="ljuan">
            <div class="abs">
                <div class="tite">
                    <div class="name"> 满减优惠同享</div>
                    <div class="cont"> 开启后，满减活动与其他优惠活动共享</div>
                </div>
                <div class="items">
                    <el-switch class="switchStyle" v-model="scope" active-color="#ff9d19" active-text="已开启" on-value="1"
                        inactive-color="#eee" inactive-text="已关闭" off-value="0" @change="changeSwitch(scope)">
                    </el-switch>
                </div>
            </div>
            <div class="abs">
                <div class="tite">
                    <div class="name">折扣优惠同享</div>
                    <div class="cont">开启后，折扣活动与其他优惠活动共享</div>
                </div>
                <div class="items">
                    <el-switch class="switchStyle" v-model="ziti" active-color="#ff9d19" active-text="已开启" on-value="1"
                        inactive-color="#eee" inactive-text="已关闭" off-value="0" @change="changeSwitch1(ziti)">
                    </el-switch>
                </div>
            </div>
            <div class="foot">优惠优先级：折扣 > 满减 > 优惠券 </div>
        </div>

    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '优惠规则设置'
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
                scope: false,
                ziti: false,
                openVisible: false,
                openTime: '',
                areadata: {},
                address: '',
                id: this.$route.query.id,
            }
        },
        mounted() {

       this. getInfo()
        },
        methods: {
            //开关
            changeSwitch(data) {
                    this.qierolus()
            },
            changeSwitch1(data) {
                this.qierolus()
            },
            //切换规则保存
            qierolus() {
                var scope = 0;
                var ziti = 0;
                if (this.ziti) {
                    ziti = 1
                }
                if (this.scope) {
                    scope = 1
                }
                let post = {
                    merId: this.id,
                    discountOffShare:scope,
                    discountShare:ziti
                };
                axios({
                    url: this.Api1 + '/shop/otoMerchantConfig/updateMerConfig',
                    data: post,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                    

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取地址
            getInfo() {
                let post = {
                    merchantId: this.id
                };
                axios({
                    url: this.Api1 + '/shop/otoMerchantConfig/selectMerConfig',
                    params: post,
                    method: "get",
                    headers: {
                      "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.openTime = data.takingTime;
                        this.address = data.address;
                        this.ziti = data.discountShare == 1 ? true : false;
                        this.scope = data.discountOffShare == 1 ? true : false;

                    } else {
                        Toast(res.data.message)
                    }
                })
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

    .abs {
        height: 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }

    .abs .tite {
        flex: 1;
        font-size: 0.65rem;
        color: #333;
        line-height: 1.5rem;
    }

    .abs .tite .cont {
        font-size: 0.45rem;
        color: #999;
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

    .foot {
        padding: 0 0.5rem;
        line-height: 1.5rem;
        font-size: 0.55rem;
        color: #999;
    }

</style>
