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
            <label>优惠券名称<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入优惠券名称" v-model="name">
            </p>
        </div>
        <div class="cart-list">
            <label>优惠券类型<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请选择优惠券类型" readonly v-model="coutype" @click="typeClassfn">
                <i class="el-icon-arrow-right "></i>
            </p>
        </div>
        <div class="cart-list">
            <label>门槛金额<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="0表示无门槛" v-model="couAmount" @afterpaste="rsx1($event)"
                    @keyup="rex1($event)">

            </p>
        </div>
        <div class="cart-list" v-if="!typeShow">
            <label>面值<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入优惠券面值" v-model="couFace" @afterpaste="rsx($event)"
                    @keyup="rex($event)">

            </p>
        </div>
        <div class="cart-list" v-if="typeShow">
            <label>折扣(折)<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入1-99折扣数" v-model="coudis" @afterpaste="rsx($event)"
                    @keyup="rex($event)">
            </p>
        </div>
        <div class="cart-list">
            <label>发放数量<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入优惠券发放数量" v-model="counum" @afterpaste="rsx($event)"
                    @keyup="rex($event)">

            </p>
        </div>
        <div class="cart-list">
            <label>用户限领<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请选择限领模式" readonly v-model="couLimit" @click="liquClassfn">
                <i class="el-icon-arrow-right "></i>
            </p>
        </div>
        <div class="cart-list" v-if="couLimit == '限领'">
            <label>限领数量<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入限领数量" v-model="limitNum" @afterpaste="rsx($event)"
                    @keyup="rex($event)">

            </p>
        </div>
        <div class="cart-list">
            <label>生效模式<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请选择生效模式" readonly v-model="shopClassName" @click="shopClassfn">
                <i class="el-icon-arrow-right "></i>
            </p>
        </div>
        <div class="cart-list" v-if="!timeShow">
            <label>生效时间<span class="f1">*</span>:</label>
            <p class="lmain">
                <input type="text" placeholder="请输入天数" v-model="coutime" style="margin-right: 0.5rem;"
                    @afterpaste="rsx($event)" @keyup="rex($event)">天内有效
            </p>
        </div>
        <timeChoose :StartTime.sync="StartTime" :EndTime.sync="EndTime" v-if="timeShow">
        </timeChoose>


        <div class="shopcs">
            <div class="fs">选择商品</div>
            <div class="duoyu">
                <div class="fp" @click="tapqie(0)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                        v-show="shopidx==1"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                        v-show="shopidx==0"> 全部通用</div>
                <div class="fp" @click="tapqie(1)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                        v-show="shopidx==0"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                        v-show="shopidx==1"> 部分适用</div>
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
                    <div>活动库存</div>
                    <div style="color: #999;">总库存{{item.stock==null?0:item.stock}}</div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="tijiao" @click="Submit" v-if="edite==0">
                保存
            </div>
            <div class="tijiao" @click="Modificat" v-else>
                修改
            </div>
        </div>
        <!-- 是否限领 -->
        <mt-popup v-model="liquVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="liququxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="liququedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="liquslorts" value-key="name" @change="liquchange"></mt-picker>
        </mt-popup>
        <!-- 优惠券类型 -->
        <mt-popup v-model="typeVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="typequxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="typequedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="typeslorts" value-key="name" @change="typechange"></mt-picker>
        </mt-popup>
        <!-- 生效模式 -->
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
                    title: '添加优惠券'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                scope: false,
                name: '',
                coutype: '',
                couAmount: '',
                couFace: '',
                coudis: '',
                counum: '',
                couLimit: '限领',
                limitNum: '',
                coutime: '',
                shopClassName: '', // 店铺分类
                shopVisible: false,
                timeShow: false,
                shopnum: '全部商品',
                StartTime: null,
                EndTime: null,
                shopidx: 0,
                shoplist: [],
                shopslots: [{
                    flex: 1,
                    values: [{
                            id: '0',
                            name: '领取后生效'
                        },
                        {
                            id: '1',
                            name: '固定时间段内生效'
                        },
                    ],
                }, ],
                liquslorts: [{
                    flex: 1,
                    values: [{
                            id: '0',
                            name: '限领'
                        },
                        {
                            id: '1',
                            name: '不限'
                        }
                    ],
                }],
                liquVisible: false,
                typeslorts: [{
                    flex: 1,
                    values: [{
                            id: '2',
                            name: '满减券'
                        },
                        {
                            id: '0',
                            name: '折扣券'
                        },
                    ],
                }],
                typeVisible: false,
                typeShow: false,
                edite: this.$route.query.edite,
                id: this.$route.query.id,
                editelist: [],
                idsArray: {
                    ids: []
                },
                merid: this.$cookie.get("merId"),
                coutypes: 0,
                shopShow: false,
            }
        },
        mounted() {
            if (this.edite == 1) {
                this.getInfo();
                this.topnav.title = "编辑优惠券";

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
                this.getcodeShop2();

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
            //是否限领
            liquClassfn() {
                this.liquVisible = true;
            },
            liququxiaofn() {
                this.liquVisible = false;
            },
            liquchange(picker, values) {
                this.liquModel = values[0];
            },
            liququedingfn() {
                this.liquVisible = false;
                this.couLimit = this.liquModel.name;
                if (this.liquModel.id == 1) {
                    this.liquShow = true;
                } else {
                    this.liquShow = false;
                }
            },
            //优惠券类型
            typeClassfn() {
                this.typeVisible = true;
            },
            typequxiaofn() {
                this.typeVisible = false;
            },
            typechange(picker, values) {
                this.typeModel = values[0];
            },
            typequedingfn() {
                this.typeVisible = false;
                this.coutype = this.typeModel.name;
                this.coutypes = this.typeModel.id;
                if (this.typeModel.id == 0) {
                    this.typeShow = true;
                    this.couFace = '';

                } else {
                    this.typeShow = false;
                    this.coudis = '';
                }
            },
            //生效模式
            shopClassfn() {
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
                if (this.shopModel.id == 1) {
                    this.timeShow = true;
                    this.coutime = '';

                } else {
                    this.timeShow = false;
                    this.StartTime = '';
                    this.EndTime = '';
                }
            },
            //跳转去商品列表
            tomechlist() {
                if (this.shopidx) {
                    if (this.edite == 1) {
                        this.$router.push({
                            path: '/storeplat/Merchlist',
                            query: {
                              
                                aid:this.id
                            }
                        })
                    } else {
                        this.$router.push({
                            path: '/storeplat/Merchlist',

                        })
                    }

                }

            },
            //切换适用商品
            tapqie(val) {

                // if (this.edite) {
                //     return
                // }
                if (val == 0) {
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

                this.shopidx = val;
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
            //获取商品关联优惠券
            getcodeShop() {
                let post = {
                    activityId: this.id,
                };
                axios({
                    url: this.Api1 + '/activity/otoVoucherGoods/selectVoucherGoods',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shoplist = res.data.data;


                        if (this.shopidx == 1) {
                            this.shopShow = true;
                            this.shopnum = '已选择' + this.shoplist.length + '件'
                        } else {
                            this.shopnum = "全部商品"
                        }

                        this.$forceUpdate();
                    }
                })
            },
            //删除商品
            deleteShop(i) {
                this.shoplist.splice(i, 1)
                this.shopnum = '已选择' + this.shoplist.length + '件'
            },
            //获取商品关联优惠券
            getcodeShop2() {
                let post = {
                    idsArray: this.idsArray
                };
                axios({
                    url: this.Api1 + '/activity/otoVoucherGoods/selectVoucherGoods',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shoplist = res.data.data;
                        this.tapqie(1)

                    }
                })
            },
            //获取信息
            getInfo() {
                var that = this;
                let post = {
                    voucherId: this.id
                };
                axios({
                    url: this.Api1 + '/activity/otoMerVoucher/selectOne',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.editelist = data;
                        this.name = data.name;
                        this.coutype = data.type == 2 ? '满减券' : '折扣券';
                        this.coutypes = data.type;
                        this.typeShow = data.type == 2 ? false : true;
                        this.coudis = data.discount;
                        this.couAmount = data.maxAmount;
                        this.couFace = data.discountAmount;
                        this.counum = data.issuedNum;
                        this.couLimit = data.isLimit == 0 ? '限领' : '不限';
                        this.limitNum = data.limitNum;
                        this.shopClassName = data.isForthwith == 1 ? '领取后生效' : '固定时间段内生效';
                        this.timeShow = data.isForthwith == 1 ? false : true;
                        this.coutime = data.expireTime;
                        this.StartTime = data.startTime;
                        this.EndTime = data.endTime;
                        this.shopidx = data.isCommon == 1 ? 0 : 1;
                        this.getcodeShop();
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //保存信息
            Submit() {
                var that = this;
                if (this.name == null || this.name == '') {
                    Toast('请选填写优惠劵名称')
                    return false
                }
                if (this.coutype == null || this.coutype == '') {
                    Toast('请选择优惠劵类型')
                    return false
                }
                if (this.coutypes == 0) {
                    if (this.coudis == null || this.coudis == '') {
                        Toast('请输入折扣')
                        return false
                    }
                } else {
                    if (this.couFace == null || this.couFace == '') {
                        Toast('请输入优惠券面值')
                        return false
                    }
                }
                if (this.counum == null || this.counum == '') {
                    Toast('请输入发放优惠券数量')
                    return false
                }
                if (this.couLimit == '限领') {
                    if (this.limitNum == null || this.limitNum == '') {
                        Toast('请输入限领数量')
                        return false
                    }
                }

                if (this.shopClassName == '领取后生效') {
                    if (this.coutime == null || this.coutime == '') {
                        Toast('请输入有效时间')
                        return false
                    }
                } else {
                    if (this.StartTime == null || this.StartTime == '') {
                        Toast('请输入选择有效期开始时间')
                        return false
                    }
                    if (this.EndTime == null || this.EndTime == '') {
                        Toast('请输入选择有效期结束时间')
                        return false
                    }
                }
                if (this.shopidx == 1) {
                    if (this.idsArray.ids == null) {
                        Toast('请选择参与优惠的商品')
                    }
                }
                var that = this;
                let post = {
                    merId: this.merid,
                    name: this.name,
                    type: this.coutypes,
                    discount: this.coudis,
                    maxAmount: this.couAmount,
                    discountAmount: this.couFace,
                    issuedNum: this.counum,
                    isLimit: this.couLimit == '限领' ? 0 : 1,
                    limitNum: this.limitNum,
                    isForthwith: this.shopClassName == '领取后生效' ? 1 : 2,
                    expireTime: this.coutime,
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    isCommon: this.shopidx == 0 ? 1 : 2,
                    remarks: '满' + this.couAmount + '元可用',
                    goodsIds: this.idsArray.ids,
                };
                axios({
                    url: this.Api1 + '/activity/otoMerVoucher/insertVoucher',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('添加成功')
                        this.$router.go(-1)
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //修改商品
            Modificat() {
                var that = this;
                if (that.name == null || that.name == '') {
                    Toast('请选填写优惠劵名称')
                    return false
                }
                if (this.coutype == null || this.coutype == '') {
                    Toast('请选择优惠劵类型')
                    return false
                }
                if (this.coutypes == 0) {
                    if (this.coudis == null || this.coudis == '') {
                        Toast('请输入折扣')
                        return false
                    }
                } else {
                    if (this.couFace == null || this.couFace == '') {
                        Toast('请输入优惠券面值')
                        return false
                    }
                }
                if (this.counum == null || this.counum == '') {
                    Toast('请输入发放优惠券数量')
                    return false
                }
                if (this.couLimit == '限领') {
                    if (this.limitNum == null || this.limitNum == '') {
                        Toast('请输入限领数量')
                        return false
                    }
                }

                if (this.shopClassName == '领取后生效') {
                    if (this.coutime == null || this.coutime == '') {
                        Toast('请输入有效时间')
                        return false
                    }
                } else {
                    if (this.StartTime == null || this.StartTime == '') {
                        Toast('请输入选择有效期开始时间')
                        return false
                    }
                    if (this.EndTime == null || this.EndTime == '') {
                        Toast('请输入选择有效期结束时间')
                        return false
                    }
                }
                if (this.shopidx == 1) {
                    if (this.idsArray.ids == null) {
                        Toast('请选择参与优惠的商品')
                    }
                }
                let post = {
                    merId: this.merid,
                    id: this.id,
                    name: this.name,
                    type: this.coutypes,
                    discount: this.coudis,
                    maxAmount: Number(this.couAmount),
                    discountAmount: Number(this.couFace),
                    issuedNum: this.counum,
                    isLimit: this.couLimit == '限领' ? 0 : 1,
                    limitNum: this.limitNum,
                    isForthwith: this.shopClassName == '领取后生效' ? 1 : 0,
                    expireTime: this.coutime,
                    startTime: this.StartTime,
                    endTime: this.EndTime,
                    isCommon: this.shopidx == 0 ? 1 : 2,
                    remarks: '满' + this.couAmount + '元可用',
                    goodsIds: this.idsArray.ids,
                };
                axios({
                    url: this.Api1 + '/activity/otoMerVoucher/updateVoucher',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('修改成功')
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
        z-index: 99;
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
        overflow: hidden;
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

    .settings>>>.picker-item {
        padding: 0;
    }

</style>
