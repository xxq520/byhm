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
            <div class="fs">折扣设置</div>
        </div>
        <div class="cart-list">
            <label>限购<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="0表示不限购" v-model="restriction" style="margin-right: 0.6rem;"
                    @afterpaste="rsx1($event)" @keyup="rex1($event)"> 件

            </p>
        </div>
        <div class="cart-list">
            <label>折扣<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入1-99的折扣数" v-model="discount" style="margin-right: 0.6rem;"
                    @afterpaste="rsx($event)" @keyup="rex($event)"> 
            </p>
        </div>
        <div class="shopcs">
            <div class="fs">选择商品</div>
            <div class="duoyu">
                <div class="fp" @click="tapqie(1)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                        v-show="shopidx==2"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                        v-show="shopidx==1"> 全部通用</div>
                <div class="fp" @click="tapqie(2)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                        v-show="shopidx==1"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                        v-show="shopidx==2"> 部分适用</div>
            </div>

        </div>
        <div class="cart-list" @click="tomechlist">
            <label>活动商品:</label>
            <p class="lmain">
                <input type="text" placeholder="" v-model="shopnum" readonly>
                <i class="el-icon-arrow-right mr-l-14" v-show="shopShow"></i>
            </p>
        </div>
        <div class="shoplist" v-show="shopShow">
            <div class="name">商品列表</div>
            <div v-for="(item,i) in shoplist">
                <li class="merchandise">
                    <div class="left"><img :src="item.listPicUrl" alt="">
                    </div>
                    <div class="right">
                        <div class="shopname">
                            {{item.goodsName}}
                        </div>
                        <div class="price">
                            <div style="color: #ff4400;"> ￥{{item.retailPrice}} </div>
                            <img src="@/assets/images/storeplat/by_page2_ix.png"
                                style="width: 0.75rem ;height: 0.75rem;" @click="deleteShop(i)">
                        </div>
                    </div>
                </li>
                <div class="dazhe">
                    <div>折扣</div>
                    <input type="text" placeholder="请输入折扣" v-model="item.discount" @afterpaste="rsx($event)"
                        @keyup="rex($event)">
                </div>
                <div class="dazhe">
                    <div>活动库存</div>
                    <input type="text" placeholder="请输入库存" v-model="item.stock" @afterpaste="rsx($event)"
                        @keyup="rex($event)">
                </div>
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
    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '折扣活动'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                scope: false,
                name: '',
                actinfo: '',
                restriction: '',
                discount: '',
                shopnum: '全部商品',
                StartTime: null,
                EndTime: null,
                shopidx: 1,
                shoplist: [],
                shopShow: false,
                idsArray: {
                    ids: []
                },
                merId: this.$cookie.get('merId'),
                ceryId: this.$route.query.ceryId,

            }
        },
        watch: {
            discount(val) {
                if (this.discount.length > 2) {
                    this.discount = this.discount.substr(0, 4)
                };
            },
        },
        mounted() {
            if (this.ceryId) {
                this.getInfo().then(res => {

                    this.getcodeShop()
                });
                this.topnav.title = "编辑折扣活动";


            }
        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.removeItem('smaShop');
            sessionStorage.removeItem('smaShow')
            next();
        },
        activated() {
            let hmf = sessionStorage.getItem('smaShow')
            if (hmf == 1) {
                this.idsArray.ids = JSON.parse(sessionStorage.getItem('smaShop'));
                this.getcodeShop2()
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
            rex1(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }

            },
            rsx1(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '0')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }
            },
            //获取修改信息
            getInfo() {
                var that = this;
                return new Promise(function (resolve, reject) {

                    let post = {
                        eventId: that.ceryId
                    };
                    axios({
                        url: that.Api1 + '/activity/otoMerEvent/selectOne',
                        params: post,
                        method: "get",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Nideshop-Token": that.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            that.name = data.name;
                            that.type = data.type;
                            that.discount = data.discount;
                            that.shoplist = data.eventGoods;
                            that.shopidx = data.isCommon;
                            that.actinfo = data.detail;
                            that.restriction = data.limitNum;
                            that.StartTime = data.startTime;
                            that.EndTime = data.endTime;
                            resolve();

                            that.$forceUpdate();

                        } else {
                            Toast(res.data.message)
                        }
                    })
                })
            },
            //跳转去商品列表
            tomechlist() {

                var that = this;
                if (this.shopidx == 2) {
                    if (this.StartTime == null || this.StartTime == '') {
                        Toast('请先选择折扣活动时间')
                        return false
                    }
                    if (this.EndTime == null || this.EndTime == '') {
                        Toast('请先选择折扣活动时间')
                        return false
                    }
                    this.$router.push({
                        path: '/storeplat/Merchlist',
                        query: {
                            stime: this.StartTime,
                            atime: this.EndTime,
                            eventId: this.ceryId
                        }
                    })
                }

            },
            //切换适用商品
            tapqie(val) {

                if (this.ceryId) {
                    return
                }
                this.shopidx = val;
                if (val == 1) {
                    this.shopnum = "全部商品";
                    this.shopShow = false;
                } else {
                    this.shopShow = true;
                    if (!this.shoplist) {
                        this.shopnum = '已选择0件'
                    } else {
                        this.shopnum = '已选择' + this.shoplist.length + '件'
                    }
                }
            },
            //删除商品
            deleteShop(i) {
                this.shoplist.splice(i, 1)
                this.shopnum = '已选择' + this.shoplist.length + '件'
            },
            //获取商品关联优惠券
            getcodeShop() {
                let post = {
                    activityId: this.ceryId,
                };
                axios({
                    url: this.Api1 + '/activity/otoEventGoods/selectEventGoods',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shoplist = res.data.data;

                        if (this.shopidx == 2) {
                            this.shopShow = true;
                            this.shopnum = '已选择' + this.shoplist.length + '件'
                        } else {
                            this.shopnum = "全部商品"
                        }

                        this.$forceUpdate();

                    }
                })
            },
            getcodeShop2() {
                let post = {
                    idsArray: this.idsArray
                };
                axios({
                    url: this.Api1 + '/activity/otoEventGoods/selectEventGoods',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shoplist = res.data.data;
                        this.tapqie(2)
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
            //修改商品
            Modificat() {
                var that = this;
                if (that.name == null || that.name == '') {
                    Toast('请选填写活动名称')
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
                if (this.discount == null || this.discount == '') {
                    Toast('请输入折扣数')
                    return false
                }
                if (this.restriction == null || this.restriction == '') {
                    Toast('请输入限购数量')
                    return false
                }
                let post = {
                    merId: this.merId,
                    id: this.ceryId,
                    name: this.name,
                    type: 0,
                    remarks: this.discount / 10 + '折',
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    detail: this.actinfo,
                    limitNum: this.restriction,
                    discount: this.discount,
                    isCommon: this.shopidx,
                    eventGoods: this.shoplist,
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
                        Toast('修改折扣活动成功')
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
                    Toast('请选填写活动名称')
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
                if (this.discount == null || this.discount == '') {
                    Toast('请输入折扣数')
                    return false
                }
                if (this.restriction == null || this.restriction == '') {
                    Toast('请输入限购数量')
                    return false
                }
                 if (this.shopidx == 2) { 
                   if(this.shoplist.length == 0){
                       Toast('部分适用请选择适用商品')
                       return false
                   }

                 }
                let post = {
                    merId: this.merId,
                    name: this.name,
                    type: 0,
                    remarks: this.discount / 10 + '折',
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    detail: this.actinfo,
                    limitNum: this.restriction,
                    discount: this.discount,
                    isCommon: this.shopidx,
                    eventGoods: this.shoplist,
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
                        Toast('添加折扣活动成功')
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
        position: relative;
        padding-bottom: 4rem;
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
        padding-bottom: 1.5rem;
        position: absolute;
        left: 0;
        bottom: 0;
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
        border-bottom: 1px solid #eee;
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

    .shopcs {
        height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .shopcs .duoyu {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

    }

    .shopcs .fs {
        padding-left: 0.5rem;
        position: relative;
    }

    .shopcs .fs::before {
        content: '';
        width: 3px;
        height: 16px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.1rem;
    }

    .shopcs .fp {
        font-size: 0.55rem;
        color: #999;
        height: 1.5rem;
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .shopcs .fp img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.3rem;
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

    .shoplist {
        width: 100%;
        background-color: #fff;
        font-size: 0.58rem;
        color: #333;
    }

    .shoplist .name {
        width: 100%;
        height: 2rem;
        line-height: 2rem;
        padding: 0 0.5rem;

    }

    .shoplist .dazhe {
        width: 100%;
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #eee;
        padding: 0 0.5rem;
    }

    .shoplist .dazhe input {
        color: #999;
        text-align: right;
    }

    .merchandise {
        padding: 0.2rem 0.3rem;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        font-size: 0.58rem;
        background-color: #fff;
    }

    .merchandise .left {

        border-radius: 0.5rem;
        overflow: hidden;
        padding: 0.1rem;
        display: flex;
        align-items: center;
    }

    .merchandise .left img {
        width: 3rem;
        height: 3rem;
    }

    .merchandise .right {
        flex: 1;
        padding: 3px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 68%;
        overflow: hidden;
        color: #999;
        padding-left: 0.5rem;
    }

    .merchandise .right .shopname {
        width: 100%;
        display: flex;
        align-items: center;
        color: #333;
        line-height: 1rem;
        font-size: 0.62rem;
        max-height: 2rem;
        overflow: hidden;

    }

    .merchandise .right .price {
        line-height: 0.82rem;
        display: flex;
        justify-content: space-between;
        line-height: 1rem;
        color: #999;
    }

</style>
