<template>
    <div class="settings">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="name">
            <div class="fs">基本信息</div>
        </div>
        <div class="cart-list">
            <label>活动名称<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入活动名称" v-model="name">

            </p>
        </div>
        <timeChoose :StartTime.sync="StartTime" :EndTime.sync="EndTime">
        </timeChoose>
        <div class="cart-list">
            <label style="width: 8em;">活动说明:</label>
            <p class="lmain">
                <input type="text" placeholder="选填,请输入活动说明" v-model="actinfo">
            </p>
        </div>
        <div class="name">
            <div class="fs">满减设置</div>
        </div>
        <div class="cart-list">
            <label>满减模式<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请选择满减模式" readonly v-model="shopClassName" @click="shopClassfn">
                <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
        </div>
        <div class="full" v-if="fullStatus==1">
            满
            <input type="text" placeholder="￥0.00" v-model="xhm" class="c1" @keyup="rex($event)"
                @afterpaste="rsx($event)">
            减
            <input type="text" placeholder="￥0.00" v-model="xhj" class="c1" @afterpaste="rsx($event)"
                @keyup="rex($event)">
        </div>

        <div class="fullti" v-if="fullStatus==2">
            <div class="cart" v-for="(item,index) in eventExtends">
                <div class="dijian">
                    满
                    <input type="text" placeholder="￥0.00" v-model="item.maxAmount" class="c1" @keyup="rex($event)"
                        @afterpaste="rsx($event)">
                    减
                    <input type="text" placeholder="￥0.00" v-model="item.offAmount" class="c1" @keyup="rex($event)"
                        @afterpaste="rsx($event)">
                </div>
                <img src="@/assets/images/storeplat/by_page2_ix.png" @click="closetime(index)">
            </div>
            <div class="cart" style="justify-content: center;" @click="addtime">
                <img src="@/assets/images/storeplat/by_page2_ic.png" style="margin-right: 0.5rem;">
                <p style="color:#FF4400;">满减梯度</p>
            </div>
        </div>

        <div class="footer">
            <div class="tijiao" @click="Modificat" v-if="ceryId">
                修改
            </div>
            <div class="tijiao" @click="Submit" v-else>
                保存
            </div>
        </div>
        <mt-popup v-model="shopVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="shopquxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="shopquedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="shopslots" value-key="name" @change="shopchange"></mt-picker>
        </mt-popup>

    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '添加满减活动'
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
                scope: false,
                name: '',
                actinfo: '',
                StartTime: null,
                EndTime: null,
                shopClassName: '循环满减', // 店铺分类
                shopVisible: false,
                merid: this.$cookie.get("merId"),
                eventExtends: [{
                    maxAmount: '',
                    offAmount: ''
                }],
                shopslots: [{
                    flex: 1,
                    values: [{
                            id: '1',
                            name: '循环满减'
                        },
                        {
                            id: '2',
                            name: '阶梯满减'
                        },
                    ],

                }, ],
                fullStatus: 1,
                xhm: '',
                xhj: '',
                remarks: '',
                ceryId: this.$route.query.ceryId,

            }
        },
        watch: {
            xhj(val) {
                if (Number(this.xhj) > Number(this.xhm)) {
                    this.xhj = this.xhm;
                }
            }
        },
        mounted() {
            if (this.ceryId) {
                this.getInfo();
                this.topnav.title = "编辑满减活动";
            }
        },
        methods: {
            // 正则限制输入
            rex(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, '')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }

            },
            rsx(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, '0')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }
            },
            //获取修改信息
            getInfo() {
                var that = this;
                let post = {
                    eventId: this.ceryId
                };
                axios({
                    url: this.Api1 + '/activity/otoMerEvent/selectOne',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.name = data.name;
                        this.fullStatus = data.type;
                        if (this.fullStatus == 1) {
                            this.xhm = data.eventExtends[0].maxAmount;
                            this.xhj = data.eventExtends[0].offAmount;
                            // console.log(this.xhm, this.xhj);
                        }
                        this.StartTime = data.startTime;
                        this.EndTime = data.endTime;
                        this.actinfo = data.detail;
                        this.eventExtends = data.eventExtends;
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //添加时间段
            addtime() {
                for (let i = 0; i < this.eventExtends.length; i++) {
                    if (Number(this.eventExtends[i].offAmount) > Number(this.eventExtends[i].maxAmount)) {
                        this.eventExtends[i].offAmoun = this.eventExtends[i].maxAmount;
                        Toast('减少金额不能大于门槛金额');
                    }
                }
                this.eventExtends.push({
                    maxAmount: '',
                    offAmount: '',
                })
            },
            //删除时间段
            closetime(idx) {
                this.eventExtends.splice(idx, 1)
            },

            //选择满减模式
            shopClassfn() {
                if (this.ceryId) {
                    return;
                }
                this.shopVisible = true;
            },
            shopquxiaofn() {
                this.shopVisible = false;
            },
            shopchange(picker, values) {
                this.shopModel = values[0];
            },
            shopquedingfn() {
                this.shopVisible = false;
                this.shopClassName = this.shopModel.name;
                this.fullStatus = this.shopModel.id;
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

            //修改满减
            Modificat() {
                var that = this;
                if (that.name == null || that.name == '') {
                    Toast('请选填写活动名称名称')
                    return false
                }
                if (this.StartTime == null || this.StartTime == '') {
                    Toast('请输入选择有效期开始时间')
                    return false
                }
                if (this.EndTime == null || this.EndTime == '') {
                    Toast('请输入选择有效期结束时间')
                    return false
                }
                if (this.fullStatus == 1) {
                    if (this.xhm == null || this.xhm == '') {
                        Toast('请输入循环满减信息')
                        return false
                    }
                    if (this.xhj == null || this.xhj == '') {
                        Toast('请输入循环满减信息')
                        return false
                    }
                    this.eventExtends[0].maxAmount = this.xhm;
                    this.eventExtends[0].offAmount = this.xhj;
                } else {
                    for (let i = 0; i < this.eventExtends.length; i++) {
                        if (this.eventExtends[i].maxAmount == null ||
                            this.eventExtends[i].maxAmount == "") {
                            Toast('请将添加的阶梯满减信息填写完整');
                            return false
                        };
                        if (this.eventExtends[i].offAmount == null || this.eventExtends[i].offAmount == "") {
                            Toast('请将添加的阶梯满减信息填写完整');
                            return false
                        };
                    }
                }
                let post = {
                    merId: this.merid,
                    name: this.name,
                    type: this.fullStatus,
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    detail: this.actinfo,
                    id: this.ceryId,
                    eventExtends: this.eventExtends
                };
                axios({
                    url: this.Api1 + '/activity/otoMerEvent/updateEvent',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('修改满减活动成功')
                        this.$router.go(-1)
                    } else {
                        Toast(res.data.message)
                    }
                })
            },

            //保存信息
            Submit() {

                var that = this;
                if (that.name == null || that.name == '') {
                    Toast('请选填写活动名称名称')
                    return false
                }
                if (this.StartTime == null || this.StartTime == '') {
                    Toast('请输入选择有效期开始时间')
                    return false
                }
                if (this.EndTime == null || this.EndTime == '') {
                    Toast('请输入选择有效期结束时间')
                    return false
                }
                if (this.fullStatus == 1) {
                    if (this.xhm == null || this.xhm == '') {
                        Toast('请输入循环满减信息')
                        return false
                    }
                    if (this.xhj == null || this.xhj == '') {
                        Toast('请输入循环满减信息')
                        return false
                    }
                    this.eventExtends[0].maxAmount = this.xhm;
                    this.eventExtends[0].offAmount = this.xhj;
                } else {
                    for (let i = 0; i < this.eventExtends.length; i++) {
                        if (this.eventExtends[i].maxAmount == null || this.eventExtends[i].maxAmount == "") {
                            Toast('请将添加的阶梯满减信息填写完整')
                            return false
                        };
                        if (this.eventExtends[i].offAmount == null || this.eventExtends[i].offAmount == "") {
                            Toast('请将添加的阶梯满减信息填写完整')
                            return false
                        };
                    }
                }
                let post = {
                    merId: this.merid,
                    name: this.name,
                    type: this.fullStatus,
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    detail: this.actinfo,
                    eventExtends: this.eventExtends
                };
                axios({
                    url: this.Api1 + '/activity/otoMerEvent/insertEvent',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('添加满减活动成功')
                        this.$router.go(-1)
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
        font-size: 0.62rem;
        text-align: center;
        text-indent: -2em;
    }


    .settings .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      margin-top: 3rem;
    
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

    .name {
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;

    }

    .name .fs {
        padding-left: 0.5rem;
        position: relative;
    }

    .name .fs::before {
        content: '';
        width: 3px;
        height: 16px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.8rem;
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
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.1rem;
    }

    .cart-list .lmain {
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

    .cart-list .lmain .a2 {
        width: 3.5rem;
        text-align: center;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
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

    .settings>>>.picker-items {
        width: 100%;

    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

    .full {
        display: flex;
        height: 2rem;
        background-color: #fff;
        justify-content: center;
        align-items: center;
        font-size: 0.62rem;
    }

    .full .c1 {
        width: 3rem;
        margin: 0 0.6rem;
    }

    .cart {
        display: flex;
        display: flex;
        height: 2rem;
        background-color: #fff;
        justify-content: space-between;
        align-items: center;
        font-size: 0.62rem;
        padding: 0 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .cart .dijian {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .cart .dijian .c1 {
        width: 3rem;
        margin: 0 0.5rem;
    }

    .cart img {
        width: 0.75rem;
        height: 0.75rem;
    }

</style>
