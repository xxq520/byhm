<template>
    <div class="preferentialbox">
        <mt-header title="" class="topnav">
            <mt-button slot="left" @click="goback"><i class="question"><img
                        src="@/assets/images/shoppingMall/common_bar1.png" /></i>
            </mt-button>
            <mt-button slot="right" @click="changeShare"><i class="question"><img
                        src="@/assets/images/shoppingMall/common_bar2.png" /></i>
            </mt-button>
        </mt-header>
        <div class="column-img">
            <mt-swipe :auto="4000" @change="handleChange">
                <mt-swipe-item v-for="(item,i) in banner" :key="i">
                    <a><img :src="item"></a>
                </mt-swipe-item>
            </mt-swipe>
            <div class="suoyin">{{swipeIndex}}/{{banner.length}}</div>
        </div>
        <div class="info">
            <div class="name"> {{postData.goodsName}}</div>
            <div class="zekou">
                <li v-if="abc"
                    style="background-color: #FFF0EA; padding: 0 0.5rem; margin-right: 0.5rem;border-radius: 0.2rem;">
                    {{abc}}
                </li>
                <li>
                    {{abd}}
                </li>
            </div>
            <div class="lleft">
                <div class="a1">
                    <div class="a2">
                        月售 {{postData.monthlySales}}
                    </div>
                    <div class="a3">
                        <div style="font-size: 0.7rem;">￥{{postData.retailPrice}}</div>
                        <div class="yuanjia">￥{{postData.marketPrice}}</div>
                    </div>
                </div>
                <div class="a4">
                    <div class="a5" @click="choiceSpc(postData,postData.goodsSn)">加入购物车</div>
                </div>
            </div>
        </div>
        <div class="ljuan">
            <div @click="toshopjuan" class="weixin" style="border-bottom: 1px solid #eee;" v-show="juan.length>0">
                <mt-cell title="领券" class="line" is-link><span class="item"
                        style="color: #FF4400;">{{info==null?'':info}}</span></mt-cell>
            </div>
            <div class="wei" v-show="abc">
                <mt-cell title="活动" class="line"><span class="item">{{abc}}</span></mt-cell>
            </div>
            <div @click="choiceSpc(postData,postData.goodsSn)" class="weixin" v-if="postData.specificationType==1">
                <mt-cell title="规格" class="line" is-link><span class="item"
                        v-for="v in selectArr">{{v.attrValue}}</span>
                </mt-cell>
            </div>
        </div>
        <div class="coninfo">
            <div class="name">商品详情</div>
            <div v-for="d in postData.goodsDetails" class="detali">
                <div class="name">{{d.name}}</div>
                <div class="text">{{d.text}}</div>
            </div>
        </div>
        <shopcar :spevisible.sync="spevisible" :id="merId" ref="child"></shopcar>
        <mt-popup v-model="visible" position="bottom" style="width: 100%;border-radius:10px 10px 0  0 ; bottom: 2rem;">
            <div class="spebtn">
                <div class="heade">
                    <div class="name">{{postData.goodsName}}</div>
                    <div class="close" @click="closeSpc">x</div>
                </div>
                <div class="subItem" v-for="(item,index) in subItemList" :key="index">
                    <div class="itemTitle">{{item.attrName}}</div>
                    <div class="itemContent">
                        <ul>
                            <li v-for="(res,resIndex) in item.attrValueList"
                                @click="selectItem(res,index,$event,resIndex)"
                                :class="subIndex[index] == resIndex?'selectActive':'itemLi'">{{res.attrValue}}</li>
                        </ul>
                    </div>
                </div>
                <div class="spefoot">
                    <div class="tjspe" @click="speSubmit">确定</div>
                </div>
            </div>
        </mt-popup>

        <div class="settings" v-if="yhShow">
            <div class="top_nav">
                <i class="el-icon-arrow-left" @click="back"></i>
                <span>领券</span>
            </div>
            <div class="disbtn">
                <div class="maine">
                    <div v-for="item in juan" class="coupon">
                        <div class="coupon_1" v-if="item.type ==2">
                            <div class="named"><span style="font-size: 0.6rem;">￥</span>{{item.discountAmount}}</div>
                            <div class="timed">满{{item.maxAmount}}可用</div>
                        </div>
                        <div class="coupon_1" v-else>
                            <div class="named">{{item.discount}}折</div>
                        </div>
                        <div class="coupon_2">
                            <div class="named">{{item.name}}</div>
                            <div class="timed" v-if="item.isForthwith==2">
                                {{arrquxiao(item.startTime)}}~{{arrquxiao(item.endTime)}}</div>
                            <div class="timed" v-if="item.isForthwith==1">
                                领取后{{item.expireTime}}天有效</div>
                        </div>

                        <div class="coupon_3">
                            <div class="named" v-if="item.isGet==1" @click="back()">去使用</div>
                            <div class="timed" v-else @click="lingjuan(item)">立即领取</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <share ref="share" :shareData=" shareData"></share>
    </div>
</template>

<script>
    import soshm from 'soshm/dist/soshm'
    export default {

        data() {
            return {
                topnav: {
                    title: "商品详情"
                },
                goodsSn: this.$route.query.goodsSn,
                banner: [],
                list: [],
                shoplist: [],
                applogin: false,
                shareimg: '',
                popupVisible: false,
                seq: this.$cookie.get('seq'),
                userid: this.$cookie.get('userid'),
                userPhone: this.$cookie.get('userPhone'),
                appfrom: false,
                full: 0,
                abc: '',
                abd: '',
                postData: {},
                info: '',
                spevisible: false,
                visible: false,
                showSelectSpec: [],
                subItemList: [],
                selectArr: [], // 存放被选中的值
                subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
                swipeIndex: 1,
                yhShow: false,
                juan: [],
                goodsId: '',
                merId: this.$route.query.merId,
                shareData: {
                    sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                }, //分享时的数据
            }
        },
        mounted() {
            this.handler();

            this.applogin = sessionStorage.getItem('applogin') ? true : false;
            this.appfrom = sessionStorage.getItem('appfrom') ? true : false;
        },
        methods: {

            //分享商品事件
            changeShare() {
                this.$refs.share.changeShare()
            },
            //用户领券
            lingjuan(val) {
                let post = {
                    voucherId: val.id,
                    userId: this.userid
                }
                axios({
                    url: this.Api1 + '/user/userVoucher/getVoucher',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('领取成功');
                        this.yhShow = false;
                        this.youhuijuan();
                    } else {
                        Toast(res.data.message)
                    }

                })
            },
            // //时间转换
            arrquxiao(val) {
                let abs = val.split(' ');
                return abs[0];
            },
            //获取优惠券
            youhuijuan() {
                let post = {

                    goodsId: this.goodsId,
                    userId: this.userid,
                    merchantId: this.merId
                };
                Indicator.open();
                axios({
                    url: this.Api1 + '/activity/otoMerVoucher/selectGoodsVoucher',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                }).then(res => {
                    Indicator.close();
                    if (res.data.code == 200) {
                        this.juan = res.data.data;
                        this.info = '';
                        if (this.juan.length > 1) {
                            for (let i = 0; i < 2; i++) {
                                if (this.juan[i].remarks == "无门槛") {
                                  this.juan[i].remarks = '无门槛'+this.juan[i].discountAmount+'元劵'
                                }
                                this.info += this.juan[i].remarks+' '
                            }
                        } else {
                            if (this.juan[0].remarks == "无门槛") {
                               this.juan[0].remarks = '无门槛'+this.juan[0].discountAmount+'元劵'
                            }
                            this.info = this.juan[0].remarks;
                        }


                    } else {
                        // Toast(res.data.message)
                    }
                }).catch(err => {
                    Indicator.close();
                })
            },
            //获取选定规格
            selectSpec(index) {
                let t = this;
                t.showSpec = true;
            },
            selectItem(res, index, enevt, resIndex) {
                let t = this;
                if (t.selectArr[index] !== res) {
                    t.selectArr[index] = res;
                    t.subIndex[index] = resIndex;
                } else {
                    t.selectArr[index] = "";
                    t.subIndex[index] = -1; // 去掉选中的颜色
                }
                t.checkItem();
            },
            checkItem() {
                var self = this;
                let option = []
                for (var i = 0; i < this.selectArr.length; i++) {
                    option.push(this.selectArr[i].attrValue)
                }
                self.$forceUpdate(); // 重绘
                self.showSelectSpec = option
            },
            //提交所选规格
            speSubmit() {

                for (var i = 0; i < this.subItemList.length; i++) {
                    if (this.selectArr[i] == undefined) {
                        Toast('请选择完整规格');
                        return;
                    }
                }
                this.visible = false;
                let post = {
                    username: this.userPhone,
                    merchantId: this.merId,
                    goodsSn: this.goodsSn,
                    amount: 1,
                    propertiesValueList: this.showSelectSpec
                };
                axios({
                    url: this.Api1 + '/user/shoppingCart/buyerCart',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.showSelectSpec = [];
                        this.subIndex = [];
                        this.$refs.child.choiceSpc();
                    } else {
                        Toast(res.data.message)
                    }
                });
            },
            //选择规格
            choiceSpc(val, id) {

                this.goodsSn = id;
                if (val.specificationType == 1) {
                    let post = {
                        goodsSn: id
                    };
                    this.goodsName = val.goodsName
                    axios({
                        url: this.Api1 + '/goods/querySpecification',
                        params: post,
                        method: "get",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                    }).then(res => {
                        let data = res.data.data;
                        if (res.data.code == 200 && JSON.stringify(data) != '{}') {
                            this.marketPrice = data.skuList[0].marketPrice;
                            this.retailPrice = data.skuList[0].retailPrice;
                            this.goodstock = data.skuList[0].stock;
                            this.subItemList = data.props;
                            this.skulist = data.skuList[0];
                        } else {
                            Toast(res.data.message)
                        }
                    });
                    this.visible = true;
                    this.spevisible = true;
                } else {
                    this.showSelectSpec = [];
                    this.speSubmit()
                }
            },
            //关闭规格
            closeSpc() {
                this.visible = false;
            },
            //轮播图
            handleChange(index) {
                this.swipeIndex = index + 1
            },
            //去领券
            toshopjuan() {
                this.yhShow = true;
            },
            back() {
                this.yhShow = false;
            },
            //分享
            showShare() {

            },
            // 返回上传
            goback() {

                if (this.appfrom) {
                    try {
                        window.action.backAPP();
                    } catch (err) {
                        window.action.backAPPiOS();
                    }
                } else {
                    this.$router.go(-1)
                }
            },
            //获取商品信息
            handler() {

                let post = {
                    goodsSn: this.goodsSn,
                };
                Indicator.open();
                axios({
                    url: this.Api1 + '/goods/queryGoodsDetailPage',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                }).then(res => {
                    Indicator.close();
                    if (res.data.code == 200) {
                        let data = res.data.data
                        var shareObj = {
                            // 分享的链接，默认使用location.href
                            url: window.location.href,
                            // 分享的标题，默认使用document.title
                            title: "我再百业惠盟发现一件不错的商品,快来看看吧",
                            // 分享的摘要，默认使用<meta name="description" content="">content的值
                            digest: data.goods.goodsName,
                            // 分享的图片，默认获取本页面第一个img元素的src
                            pic: data.goods.goodsImages[0],
                            // 默认显示的网站为以下六个个,支持设置的网站有
                            // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                            sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                        }
                        this.shareData = shareObj;
                        this.banner = data.goods.goodsImages;
                        this.postData = data.goods;
                        this.goodsId = data.goods.id;
                        this.subItemList = data.goodsSpecs.props;
                        if (data.goods.activityLabel != null) {
                            this.abc = data.goods.activityLabel.text;
                        }
                        if (data.goods.otherLabel) {
                            this.abd = data.goods.otherLabel.text;
                        }

                        this.youhuijuan()
                    } else {
                        Toast(res.data.message)
                    }
                }).catch(err => {
                    Indicator.close();
                })
            },
        }
    }

</script>

<style scoped>
    .preferentialbox {
        overflow: hidden;
        background-color: #f5f5f5;
        min-height: 100vh;
        color: #444;
        position: relative;
        padding-bottom: 2.5rem;

    }

    .topnav {
        background-color: transparent;
        border-bottom: none;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;

    }

    .topnav .question {
        width: 1.05rem;
        height: 1.05rem;
        border-radius: 50%;
        display: inline-block;
        text-align: center;
        line-height: .8rem;
    }

    .column-img {
        position: relative;
    }

    .column-img .suoyin {
        position: absolute;
        bottom: 0.6rem;
        right: 0.6rem;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 0.5rem;
        padding: 0.1rem 0.3rem;
        border-radius: 0.5rem;


    }

    .column-img>>>.mint-swipe {
        height: calc(100vw*0.9);
        max-height: 330px
    }

    .column-img>>>.mint-swipe-item img {
        width: 100%;
        height: 100%;
    }

    .info {
        width: 100%;
        padding: 0.5rem;
        color: #444;
        font-size: 0.56rem;
        line-height: 1.1rem;
        background-color: #fff;

    }

    .info .name {
        font-size: 0.65rem;
        width: 100%;
        line-height: 1.1rem;
        color: #333;
        font-weight: 500;
        margin-bottom: 0.2rem;
        overflow: hidden;
    }

    .info .zekou {
        display: flex;
        color: #FF8245;
    }

    .info .zekou li {
        margin-right: 0.3rem;
    }

    .info .lleft {
        display: flex;

    }

    .info .lleft .a1 {
        flex: 1;
    }

    .info .lleft .a2 {
        color: #999;

    }

    .info .lleft .a3 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
    }

    .info .lleft .a3 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;
    }

    .info .lleft .a4 {
        width: 35%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .info .lleft .a5 {
        padding: 0.1rem 0.6rem;
        border-radius: 0.8rem;
        background-color: #FF9D19;
        color: #fff;
    }

    .ljuan {
        margin: 0.5rem 0;
        padding: 0 0.5rem;
        background-color: #fff;
    }

    .ljuan .wei {

        border-bottom: 1px solid #eee;
    }

    .ljuan>>>.mint-cell-title {
        flex: 0.22;
        color: #888;
    }

    .ljuan>>>.item {
        color: #333;
        font-size: 0.55rem;
        display: inline-block;
        margin-right: 0.3rem;
    }

    .ljuan>>>.mint-cell-value.is-link {
        margin-right: 0;
    }

    .spebtn {
        width: 100%;
        max-height: 60vh;
        color: #666;
        font-size: 0.62rem;
        padding: 0.5rem;

    }

    .spebtn .spefoot {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 2rem;

    }

    .spebtn .spefoot .tjspe {
        width: 60%;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
    }

    .spebtn .heade {
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #f2f2f2;
    }

    .spebtn .heade .name {
        flex: 1;
        font-size: 0.7rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .spebtn .heade .close {
        width: 10%;
        font-size: 1.25rem;
        color: #999;
        text-align: center;
    }

    .subItem {
        font-size: 0.8em;
        margin-top: 10px;
    }

    .itemContent ul {
        display: flex;
        flex-wrap: wrap;
    }

    .itemContent ul li {
        width: 30%;
        margin-right: 3%;
        border-radius: 0.4rem;
        margin-top: 0.4rem;
        line-height: 1.5rem;
        height: 1.5rem;
        text-align: center;
    }

    .subItem .itemTitle {
        font-size: 0.65rem;

    }

    .itemLi {
        color: #666;
        background-color: #F5F5F5;
    }

    .selectActive {

        color: #FF4400;
        background-color: #FFF0EA;
    }

    .coninfo {
        background-color: #fff;
        font-size: 0.65rem;
    }

    .coninfo .name {
        padding: 0 0.5rem;
        line-height: 1.5rem;
    }

    .coninfo .detali {
        padding: 0 0.5rem;
        height: 1.8rem;
        display: flex;
        align-items: center;

    }

    .coninfo .detali .name {
        font-size: 0.62rem;
        color: #666;
        margin-right: 0.5rem;
        padding: 0;
    }

    .coninfo .detali .text {
        font-size: 0.58rem;
        color: #333;
        flex: 1;
    }

    .settings {
        min-height: 100vh;
        width: 100%;
        background: #fff;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        padding-top: 2rem;
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
        font-size: 16px;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .disbtn {
        padding: 0 0.4rem;
        width: 100%;

        color: #666;
        font-size: 0.62rem;
    }

    .disbtn .maine {
        padding: 0.4rem 0;
        overflow: auto;
        height: calc(100vh - 40px);

    }

    .disbtn .maine::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }



    .disbtn .coupon {
        border: 1px solid #FFAB8D;
        margin-top: 0.4rem;
        border-radius: 0.3rem;
        display: flex;
        height: 4rem;
        align-items: center;
        justify-content: space-between;
    }

    .disbtn .coupon .coupon_1 {
        text-align: center;
        width: 28%;
        color: #FF4400;

    }

    .disbtn .coupon .coupon_1 .named {
        font-size: 1rem;
        font-weight: 600;
    }

    .disbtn .coupon .coupon_2 {
        flex: 1;
        border-left: 1px dashed #ddd;
        border-right: 1px dashed #FFAB8D;
        text-align: center;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .disbtn .coupon .coupon_2 .named {
        font-size: 0.7rem;
        color: #333;
        line-height: 1.6rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .disbtn .coupon .coupon_2 .timed {
        font-size: 0.5rem;
        color: #999;
    }

    .disbtn .coupon .coupon_3 {
        width: 15%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.6rem;
        color: #FF4400;
        height: 100%;
        text-align: center;
        position: relative;
    }

    .disbtn .coupon .coupon_3::before {
        content: '';
        width: 14px;
        height: 7px;
        border: 1px solid #FFAB8D;
        border-radius: 20px 20px 0 0;
        border-bottom: 1px solid transparent;
        background-color: #fff;
        position: absolute;
        left: -8px;
        bottom: -1px;
    }

    .disbtn .coupon .coupon_3::after {
        content: '';
        width: 14px;
        height: 7px;
        position: absolute;
        border: 1px solid #FFAB8D;
        border-radius: 0 0 20px 20px;
        border-top: 1px solid transparent;
        background-color: #fff;
        position: absolute;
        left: -8px;
        top: -1px;
    }

    .disbtn .coupon .coupon_3 .named {
        width: 1rem;
    }

    .disbtn .coupon .coupon_3 .timed {
        width: 1.5rem;
    }

</style>
