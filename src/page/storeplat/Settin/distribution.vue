<template>
    <div class="settings">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="ljuan">
            <div class="cart-list">
                <label>可提前<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="0表示仅支持当天配送" v-model="aheadTime" class="a1">
                    天预约配送
                </p>
            </div>
            <!-- <div class="cart-list" @click="chooseTime">
                <label>配送时间段<span class="f1">*</span>:</label>
                <p class="lmain" style="justify-content: flex-end;font-size: 0.55rem;color: #999;">{{duration}}
                    <i class="el-icon-arrow-right "></i>
                </p>
            </div> -->
            <div class="cart-list">
                <label>配送时间段<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="选择配送时间段" v-model="openTime" readonly @click="openTimedata">
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="cart-list">
                <label style="width: 8em;">起送价<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="请输入" v-model="minPrice">
                </p>
            </div>
            <div class="cart-list">
                <label style="width: 8em;">配送范围(km)<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="请输入" v-model="scope">

                </p>
            </div>
            <div class="cart-list">
                <label>配送金额<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="0表示免快递费" v-model="fee">

                </p>
            </div>
            <div class="cart-list abs">
                <div class="tite">
                    阶梯收费
                </div>
                <div class="items">
                    <el-switch class="switchStyle" v-model="isOpen" active-color="#ff9d19" active-text="已开启"
                        on-value="1" inactive-color="#eee" inactive-text="已关闭" off-value="0"
                        @change="changeSwitch(isOpen)">
                    </el-switch>
                </div>
            </div>
            <div v-if="isOpen">
                <div class="cart-list">
                    <label>基础费用:</label>
                    <p class="lmain">
                        <input type="text" placeholder="基础距离内的费用" v-model="basicFee">
                    </p>
                </div>
                <div class="cart-list">
                    <label style="width: 8em;">基础距离(km):</label>
                    <p class="lmain">
                        <input type="text" placeholder="超过该距离额外收费" v-model="basicScope">
                    </p>
                </div>
                <div class="cart-list">
                    <div class="b1">
                        每增加
                        <input type="text" placeholder="请输入" v-model="addScope" class="c1">
                        公里
                    </div>
                    <div class="b1 b2">
                        加收
                        <input type="text" placeholder="请输入" v-model="addScopeFee" class="c1">
                        元
                    </div>
                </div>
                <!-- <div class="cart-list">
                    <label style="width: 8em;">基础重量(kg):</label>
                    <p class="lmain">
                        <input type="text" placeholder="超过该重量额外收费" v-model="basicWeight">
                    </p>
                </div>
                <div class="cart-list">
                    <div class="b1">
                        每增加
                        <input type="text" placeholder="请输入" v-model="addWeight" class="c1">
                        公斤
                    </div>
                    <div class="b1 b2">
                        加收
                        <input type="text" placeholder="请输入" v-model="addWeightFee" class="c1">
                        元
                    </div>
                </div> -->
            </div>
        </div>
        <div class="footer">
            <div class="tijiao" @click="Preservation()">
                保存
            </div>
        </div>
        <!-- 营业时间 -->
        <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '配送设置'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                id: this.$route.query.id,
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                isOpen: false,
                aheadTime: '',
                scope: '',
                fee: '',
                basicFee: '',
                basicScope: '',
                basicWeight: '',
                addScope: '',
                addScopeFee: '',
                addWeight: '',
                addWeightFee: '',
                timeShow: false,
                timeList: [{
                    start: '',
                    end: ''
                }],
                minPrice: '',
                openVisible: false,
                openTime: '', //选择配送时间
                qqShow: true,
            }
        },
        mounted() {
            this.getInfo()
        },
        methods: {
            // 营业时间
            openVisiblefn(val) {
                this.openVisible = val;
            },
            openTimefn(val) {
                this.openTime = val;
            },
            openTimedata() {
                this.openVisible = true;
            },

            //提交
            Preservation() {
                var isOpen;
                if (this.isOpen) {
                    isOpen = 1
                }
                if (!this.qqShow) {
                    return;
                }
                this.qqShow = false ;
                let that = this;

                if (that.aheadTime == null || that.aheadTime == '') {
                    Toast('请选填预约配送天数')
                    return false
                }
                if (that.minPrice == null || that.minPrice == '') {
                    Toast('请输入起送价格')
                    return false
                }
                if (that.openTime == null || that.openTime == '') {
                    Toast('请选配送时间段', 'middle')
                    return false
                }
                if (that.scope == null || that.scope == '') {
                    Toast('请填写配送范围', 'middle')
                    return false
                }
                if (that.fee == null || that.fee == '') {
                    Toast('请选配送金额', 'middle')
                    return false
                }

                let post = {
                    merId: this.id,
                    minPrice: this.minPrice,
                    aheadTime: this.aheadTime,
                    duration: this.openTime,
                    scope: this.scope,
                    fee: this.fee,
                    isOpen: this.isOpen,
                    basicFee: this.basicFee,
                    basicScope: this.basicScope,
                    addScope: this.addScope,
                    addScopeFee: this.addScopeFee,
                    basicWeight: this.basicWeight,
                    addWeight: this.addWeight,
                    addWeightFee: this.addWeightFee
                };
                axios({
                    url: this.Api1 + '/shop/otoShipConfig/updateShipConfig',
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
                    this.qqShow = true ;
                })
            },
            //添加时间段
            addtime() {
                this.timeList.push({
                    start: '',
                    end: ''
                })
            },
            //删除时间段
            closetime(idx) {
                this.timeList.splice(idx, 1)
            },
            //选择配送时间段
            chooseTime() {
                this.timeShow = true
            },
            //开关
            changeSwitch(data) {
                console.log(data)
            },
            //返回
            goback() {
                if (this.timeShow) {
                    this.timeShow = !this.timeShow
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
            //获取地址
            getInfo() {
                let post = {
                    merchantId: this.id
                };
                axios({
                    url: this.Api1 + '/shop/otoShipConfig/selectShipConfig',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.aheadTime = data.aheadTime;
                        this.minPrice = data.minPrice;
                        this.openTime = data.duration;
                        this.scope = data.scope;
                        this.fee = data.fee;
                        this.isOpen = data.isOpen;
                        this.basicFee = data.basicFee;
                        this.basicScope = data.basicScope;
                        this.addScope = data.addScope;
                        this.addScopeFee = data.addScopeFee;
                        this.basicWeight = data.basicWeight;
                        this.addWeight = data.addWeight;
                        this.addWeightFee = data.addWeightFee;
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

    .abs {
        height: 2.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;

    }

    .abs .tite {
        flex: 1;
        font-size: 0.58rem;
        color: #333;

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
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 0;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-list .b1 {
        width: 50%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 0.8rem;
    }

    .cart-list .b2 {

        width: 45%;
        padding: 0;
    }

    .cart-list .b3 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 43%;
    }

    .cart-list .b1 .c1 {
        width: 3rem;
        flex: none;
        text-align: center;
    }

    .cart-list .b3 .c1 {
        width: 3rem;
        flex: none;
        text-align: center;
    }

    .cart-list img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.3rem;
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

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.2rem;
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

    .cart-list p.adress span {
        display: block;
        flex: 1;
        height: 1.4em;
        word-break: break-all;
    }

    .cart-list p.adress i {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
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

    .zhezao {
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        padding-top: 40px;
        background-color: #f5f5f5;
        z-index: 99;
    }

    .zhezao .d1 {
        position: absolute;
        bottom: 0;
        left: 0;
    }

</style>
