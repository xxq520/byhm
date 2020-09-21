<template>
    <div class="settings">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <div class="ljuan">
            <div class="weixin">
                <mt-cell title="自动接单" class="line">
                    <div class="items">
                        <el-switch class="switchStyle" v-model="scope" active-color="#ff9d19" active-text="已开启"
                            on-value="1" inactive-color="#eee" inactive-text="已关闭" off-value="0"
                            @change="changeSwitch(scope)">
                        </el-switch>
                    </div>
                </mt-cell>
            </div>
            <div class="weixin">
                <mt-cell title="支持自提" class="line">
                    <div class="items">
                        <el-switch class="switchStyle" v-model="ziti" active-color="#ff9d19" active-text="已开启"
                            on-value="1" inactive-color="#eee" inactive-text="已关闭" off-value="0"
                            @change="changeSwitch1(ziti)">
                        </el-switch>
                    </div>
                </mt-cell>
            </div>

            <div class="cart-list address-list" @click="adressfn" v-show="ziti">
                <label>自取地址:</label>
                <p class="lmain">
                    <span v-if="!address"
                        style="font-size: 0.58rem; color: #888; flex: 1;text-align: right;padding-right: 0.5rem;">请选择自取地址</span>
                    <label v-else class="diqu">
                        {{address}}
                    </label>
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="weixin" @click="openTimedata" v-show="ziti">
                <mt-cell title="自取时间" class="line" is-link>
                    <input type="text" :value="openTime" class="item" placeholder="请选择自取时间" readonly>


                </mt-cell>
            </div>
        </div>
        <div class="btnwrap">
            <mt-button class="btn" type="default" @click="Preservation">保存</mt-button>
        </div>
        <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '基础设置'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                id: this.$route.query.id,
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                scope: false,
                ziti: true,
                openVisible: false,
                openTime: '',
                areadata: {},
                address: '',
                latlng: {}
            }
        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.removeItem("getpost");
            next();
        },
        mounted() {
            this.getInfo()
            this.getArea();
        },
        methods: {


            //获取地址
            getArea() {
                this.areadata = JSON.parse(sessionStorage.getItem('getpost'));
                var that = this
                setTimeout(() => {
                    if (that.areadata != null) {
                        this.latlng = this.areadata.point;
                        that.address = that.areadata.address;
                        that.tipName = that.areadata.province + '' + that.areadata.city + '' + that.areadata
                            .area;
                        let indexs = this.address.indexOf('县');
                        let indexss = this.address.indexOf('区');
                        if (indexs > -1 || indexss > -1) {} else {
                            that.address = that.tipName + that.address;
                            console.log(that.address);
                        }
                    }
                }, 500);
            },
            //跳转去选择地址
            adressfn() {
                this.$router.push({
                    path: '/mapAdress',

                });
            },
            //保存
            Preservation() {



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
                    autoTaking: scope,
                    selfTaking: ziti,
                    address: this.address,
                    takingTime: this.openTime,
                    lng: this.latlng.lng,
                    lat: this.latlng.lat
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
                        Toast('保存成功')

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //时间段显示
            openTimedata() {
                this.openVisible = true;
            },
            openVisiblefn(val) {
                this.openVisible = val;
            },
            //选择时间段
            openTimefn(val) {
                this.openTime = val;

            },
            //开关
            changeSwitch(data) {
                console.log(data)
            },
            changeSwitch1(data) {
                console.log(data)
            },
            goshqArea() {

                this.$router.push('/areaList')


            },
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
                        this.ziti = data.selfTaking == 1 ? true : false;
                        this.scope = data.autoTaking == 1 ? true : false;

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
        position: relative;
    }


    .ljuan {
        margin: 0.5rem 0;
        padding: 0 0.5rem;
        background-color: #fff;
    }

    .ljuan .weixin {

        border-bottom: 1px solid #eee;
        line-height: 2rem;
    }

    .ljuan>>>.mint-cell-title {
        flex: 0.3;
        color: #888;
        font-size: 0.58rem;
    }

    .ljuan>>>.mint-cell-value {
        flex: 1;
    }

    .ljuan>>>.mint-cell-wrapper {
        line-height: 2rem;
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

    .ljuan>>>.items {

        font-size: 0.55rem;
        flex: 1;
        padding-right: 0.5rem;
        display: flex;
        justify-content: flex-end;

    }

    .ljuan>>>.mint-cell-value.is-link {
        margin-right: 0;
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
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0 0.4rem;
        font-size: 0.7rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 3.2rem;
        font-size: 0.55rem;
        color: #888;
        display: flex;

        align-items: center;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 3.2rem);
        color: #333;
        margin-left: .416667rem
    }

    .cart-list p.lmain .diqu {
        flex: 1;

    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 10%;
    }

    .btn {
        width: 10rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin-top: 2.4444rem;
    }

</style>
