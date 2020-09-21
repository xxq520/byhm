<template>
    <div class="mainbox">
        <header class="mint-header">
            <div class="heade">
                <div class="mint-header-button is-left">
                    <button class="mint-button" @click="goback">
                        <span class="mint-button-i">
                            <i class="mintui mintui-back"></i>
                        </span>
                    </button>
                </div>
                <div class="search">
                    <div class="searhed" @click="gocomms">
                        <i class="el-icon-search"></i>
                        <input type="text" placeholder="查找商品" v-model="search" readonly>
                        <i class="el-icon-circle-close" v-show="close"></i>
                    </div>
                </div>
                <img src="@/assets/images/share_ic.png" @click="changeShare">
            </div>
        </header>
        <div>
            <div class="bg"></div>
            <div class="start" @click="gomarketinfo">
                <div class="top">
                    <div class="b1">
                        <p>{{postData.merchantName}}</p>
                        <img src="@/assets/images/shoppingMall/home_p2_i.png" v-if="!postData.isCollect"
                            @click.stop="Collection()">
                        <img src="@/assets/images/shoppingMall/home_p2_icon_sc_s.png" @click.stop="disCollection()"
                            v-else>

                    </div>
                    <div class="b2">
                        <p>{{postData.selfTaking==1?'支持自取 |':'不支持自取 |'}} 月售{{postData.monthlySales}} </p>
                        <a :href="'tel:'+postData.mobile" > <img
                                src="@/assets/images/shoppingMall/home_p2_icon_lxsj.png">联系商家</a>
                    </div>
                    <div class="b3">
                        公告： {{postData.notice?postData.notice:'暂无公告'}}
                    </div>
                </div>
            </div>
            <div class="discounts" @click="disScount">
                <div class="coupons">
                    <p style="font-size: 0.65rem; font-weight: 500; color: #333;">优惠</p>
                    <ul>
                        <li v-for="item in voucherList"> {{item}}</li>
                    </ul>
                    <i style="margin-right:0.5rem; font-size: 0.9rem;color:#aaa;" class="el-icon-arrow-right"></i>
                </div>
                <div class="count" v-if="cherList.length > 0">
                    <li v-for="item in cherList">
                        <div style="font-size: 0.52rem;" v-if="item.type==0">{{item.discount}}折</div>
                        <div style="font-size: 0.52rem;" v-else>￥{{Math.floor(item.discountAmount)}}</div>
                        <div style="font-size: 0.45rem;">{{item.remarks}}</div>
                        <div class="abs" v-if="item.isGet==0">领取</div>
                        <div class="abs" v-else>已领取</div>
                    </li>
                </div>
            </div>
            <div class="comm">
                <div><span style="margin-right:0.5rem;font-size: 0.7rem;">评价</span><span
                        style="color: #999;">{{postData.comments}}条</span>
                </div>
                <div @click="gomercheval"><span
                        style="margin-right:0.5rem; color: #FF4400;">{{!!postData.grade?postData.grade:4.0}}分</span><i
                        class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="filterPop">
                <div class="shi">
                    <li v-for="(t,index) in postData.categoryAndGoodsListVOS" :key="index"
                        :class="{'active1':messagebtn==index}" @click="messagebtnfn(index)">
                        <div class="bord" :class="{'active2':messagebtn==index}">
                            <img src="@/assets/images/shoppingMall/home_p2_icon_hd.png" v-if="t.categoryName=='活动'">
                            {{t.categoryName}}
                        </div>
                    </li>
                </div>
                <div class="time-box">
                    
                    <ul class="list" :class="`listshow${idx}`" v-for="(v,idx) in list">
                        <div style="font-size: 0.7rem;color: #333;padding: 0 0.3rem;
                        ">{{v.categoryName}}</div>
                        <li v-for="(item,index) in v.goodsResults" :key="index">
                            <div class="shopInfo" @click="gocommodity(item.goodsSn)">
                                <div class="left"><img :src="item.listPicUrl">
                                    <div class="labels" v-if="item.isOpenTag !=0"> {{ sbringx(item.promotionTag)}}</div>
                                </div>
                                <div class="right">
                                    <div class="a1">
                                        {{item.goodsName}}
                                    </div>
                                    <div class="a2">
                                        月售 {{item.monthSales==null?0:item.monthSales}}
                                    </div>
                                    <div class="a3">
                                        <div class="b1" v-show="item.remarks">{{item.remarks}}</div>
                                         <div style="margin-right: 0.1rem;" v-show="item.limitNum">限购{{item.limitNum}}份
                                         </div>
                                        <div>{{!!item.purchaseQuantity?item.purchaseQuantity:1}}份起购</div>
                                    </div>
                                    <div class="lq">
                                        <div class="lleft">
                                            <div class="a4">
                                                <div style="font-size: 0.65rem;">￥{{item.retailPrice}}</div>
                                                <div class="yuanjia">￥{{item.marketPrice}}</div>
                                            </div>
                                        </div>
                                        <img src="@/assets/images/shoppingMall/home_p2_icon_zjsp.png"
                                            @click.stop="choiceSpc(item,item.goodsSn)">
                                    </div>

                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <shopcar :disvisible.sync="disvisible" :spevisible.sync="spevisible" :id="id" ref="child"></shopcar>
        <mt-popup v-model="disvisible" position="bottom"
            style="width: 100%;border-radius:10px 10px 0  0 ; bottom: 2rem;">
            <div class="disbtn">
                <div class="heade">
                    <div class="name">店铺优惠</div>
                    <div class="close" @click="disHcount">x</div>
                </div>
                <div class="maine">
                    <div v-for="item in youhui" class="zhekou">
                        <div class="zhekou_1">{{item.type==0?'折扣':'满减'}}</div>
                        <div class="zhekou_2">{{item.remarks}}</div>
                    </div>
                    <div style="line-height: 1.5rem ;color: #333;font-weight: 500;">可领取</div>
                    <div v-for="item in juan" class="coupon">


                        <div class="coupon_1" v-if="item.type == 0">
                            <div class="named">{{item.discount}}折</div>
                        </div>
                        <div class="coupon_1" v-else>
                            <div class="named"><span
                                    style="font-size: 0.6rem;">￥</span>{{Math.floor(item.discountAmount)}}</div>
                            <div class="timed">满{{Math.floor(item.maxAmount)}}元可用</div>
                        </div>
                        <div class="coupon_2">
                            <div class="named">{{item.name}}</div>
                            <div class="timed" v-if="item.isForthwith==2">
                                {{arrquxiao(item.startTime)}}~{{arrquxiao(item.endTime)}}</div>
                            <div class="timed" v-if="item.isForthwith==1">
                                领取后{{item.expireTime}}天有效</div>
                        </div>
                        <div class="coupon_3">
                            <div class="named" v-if="item.isGet==1" @click="Touse(item.id,item.isCommon)">去使用
                            </div>
                            <div class="timed" @click="lingjuan(item)" v-else>立即领取</div>
                        </div>
                    </div>
                </div>
            </div>
        </mt-popup>

        <mt-popup v-model="spevisible" position="bottom"
            style="width: 100%;border-radius:10px 10px 0  0 ; bottom: 2rem;">
            <div class="spebtn">
                <div class="heade">
                    <div class="name">{{goodsName}}</div>
                    <div class="close" @click="closeSpc">x</div>
                </div>
                <div class="mmoo">
                    <div class="a4">
                        <div style="font-size: 0.65rem;">￥{{retailPrice}}
                        </div>
                        <div class="yuanjia">{{marketPrice}}</div>
                    </div>
                    <div style="color: #999;">库存:{{goodstock}}</div>
                </div>

                <div class="subItem" v-for="(item,index) in subItemList" :key="index">
                    <div class="itemTitle">{{item.attrName}}</div>
                    <div class="itemContent">
                        <ul>
                            <li v-for="(b,Index) in item.attrValueList" :key="Index"
                                @click="selectItem(b,index,$event,Index)"
                                :class="subIndex[index] == Index?'selectActive':'itemLi'">{{b.attrValue}}</li>
                        </ul>
                    </div>
                </div>
                <div class="spefoot">
                    <div class="tjspe" @click="speSubmit()">确定</div>
                </div>
            </div>
        </mt-popup>
        <share ref="share" :shareData=" shareData"></share>
    </div>
</template>

<script>
    export default {
        name: 'searh',
        data() {
            return {
                close: false,
                search: '',
                id: this.$route.query.id ? this.$route.query.id : '',
                postData: {},
                levelid: this.$cookie.get('level_id') ? this.$cookie.get('level_id') : 1,
                userid: this.$cookie.get('userid'),
                userPhone: this.$cookie.get('userPhone'),
                voucherList: [],
                cherList: [],
                youhui: [],
                juan: [],
                messagebtn: 0,
                messagebtn1: 1,
                loadshow: true,
                loadend: false,
                loading: false,
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                list: [],
                disvisible: false,
                searhShow: false,
                subjectShow: false,
                searchList: [],
                spevisible: false,
                showSelectSpec: [],
                subItemList: [],
                selectArr: [], // 存放被选中的值
                subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
                skulist: [],
                goodsName: '',
                retailPrice: '',
                marketPrice: '',
                goodstock: 0,
                keyword: '',
                goodsSn: '',
                shareData: {
                    sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                }, //分享时的数据
            }
        },
        mounted() {

            this.handler();
            this.shcount();
            this.wshcount();
        },
        methods: {


            //分享商品事件
            changeShare() {
                this.$refs.share.changeShare()
            },
            arrquxiao(val) {
                let abs = val.split(' ');
                return abs[0];
            },
            //字符串截取
            sbringx(val) {
                if (val) {
                    if (val.length > 2) {
                        return val.substr(0, 2)
                    } else {
                        return val
                    }
                }
            },
            //去使用优惠劵
            Touse(val,isCommon) {

                this.$router.push({
                    path: '/comment/commSearch',
                    query: {
                        id: this.id,
                        cearyid: val,
                        isCommon:isCommon
                    }
                })
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
                        Toast('领取成功')
                        this.shcount()
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //返回
            goback() {
                this.$router.go(-1)
            },
            //去到商品搜索页
            gocomms() {
                this.$router.push({
                    path: '/comment/commSearch',
                    query: {
                        id: this.id
                    }
                })
            },
            //去到商品详情
            gocommodity(val) {
                this.$router.push({
                    path: '/comment/commodity',
                    query: {
                        goodsSn: val,
                        merId: this.id
                    }
                })
            },
            //获取选定规格
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
            checkItem: function () {
                var self = this;
                // console.log(JSON.parse(JSON.stringify(self.selectArr)));
                let option = []
                for (var i = 0; i < this.selectArr.length; i++) {
                    option.push(this.selectArr[i].attrValue)
                }
                self.$forceUpdate(); // 重绘
                self.showSelectSpec = option;

                if (option.length == this.subItemList.length) {
                    let sss = this.skulist.filter(value => {
                        return option.join(',') == value.combines.join(',')
                    });
                    this.marketPrice = sss[0].marketPrice;
                    this.retailPrice = sss[0].retailPrice;
                    this.goodstock = sss[0].stock;
                }

            },
            //提交所选规格
            speSubmit() {

                for (var i = 0; i < this.subItemList.length; i++) {
                    if (this.selectArr[i] == undefined) {
                        Toast('请选择完整规格')
                        return;
                    }
                }
                this.spevisible = false;
                let post = {
                    username: this.userPhone,
                    merchantId: this.id,
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
                            this.skulist = data.skuList;
                        }
                    });
                    this.spevisible = true;
                } else {
                    this.showSelectSpec = [];
                    this.subItemList = [];
                    this.speSubmit()
                }
            },
            //关闭规格
            closeSpc() {
                this.spevisible = false;
            },

            //去到商家评价页面
            gomercheval() {
                this.$router.push({
                    path: '/comment/mercheval',
                    query: {
                        id: this.id
                    }
                })
            },
            //弹出优惠信息
            disScount() {
                this.disvisible = true;
            },
            //关闭优惠信息
            disHcount() {
                this.disvisible = false;
            },

            //获取店铺优惠券信息
            shcount() {
                let post = {
                    merchantId: this.id,
                    userId: this.userid
                };
                axios({
                    url: this.Api1 + '/activity/eventAndVoucher/eventAndVoucherList',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.youhui = res.data.data.showEventList;
                        this.juan = res.data.data.showVoucherList;
                    }
                })
            },
            //获取店铺外面优惠信息
            wshcount() {
                let post = {
                    merchantId: this.id,
                    userId: this.userid
                };
                axios({
                    url: this.Api1 + '/activity/eventAndVoucher/showEventAndVoucher',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.voucherList = res.data.data.eventRemark;
                        this.cherList = res.data.data.showVoucherVOList;
                    }


                })
            },
          
            //收藏商家
            Collection() {
                let post = {
                    merchantId: this.id,
                    userId: this.userid,
                    isColloct: true
                };
                axios({
                    method: "post",
                    url: this.Api1 + '/shop/otoCollect/collectOrNoCollect',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    data: post
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast("收藏成功");
                        this.handler()
                    } else {
                        Toast(res.data.message);
                    }

                });
            },
            //取消收藏
            disCollection() {
                MessageBox({
                    title: "温馨提示",
                    message: '是否取消收藏该店铺？',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        let post = {
                            merchantId: this.id,
                            userId: this.userid,
                            isColloct: false
                        };
                        axios({
                            method: "post",
                            url: this.Api1 + '/shop/otoCollect/collectOrNoCollect',
                            headers: {
                                "Content-Type": "application/json; charset=UTF-8",
                            },
                            data: post
                        }).then(res => {
                            if (res.data.code == 200) {
                                Toast("已取消收藏该店铺");
                                this.handler()
                            } else {
                                Toast(res.data.message);
                            }

                        });
                    }
                });
            },
            //去商家详情信息
            gomarketinfo() {
                this.$router.push({
                    path: '/comment/marketinfo',
                    query: {
                        id: this.id
                    }
                })
            },
            //切换按钮
            messagebtnfn(num) {
                   var el=document.getElementsByClassName(`listshow${num}`)[0];
                //    console.log(el.offsetTop);
                   if(this.messagebtn==num){
                   this.messagebtn=null;
                   }else{
                   this.messagebtn=num;
                   }
                   var addss = document.getElementsByClassName('time-box')[0];
                   this.$nextTick(function () {
                   addss.scrollTo({"behavior":"smooth","top":el.offsetTop-20});
                   })
               
            },

            //获取店铺信息
            handler() {
                let LngLats = JSON.parse(sessionStorage.getItem('LngLats'));
                let param = {
                    merchantId: this.id,
                    userId: this.userid
                };
                Indicator.open();
                axios({
                    url: this.Api1 + '/shop/merchantDetails/selectPartDetails',
                    params: param,
                    method: "get"
                }).then(res => {
                    Indicator.close();
                    if (res.data.code == 200) {

                        let data = res.data.data
                        this.postData = data;
                        if (data.categoryAndGoodsListVOS.length > 0) {
                            this.list = data.categoryAndGoodsListVOS
                        }

                        if (data.grade && data.grade == 0 || data.grade == "") {
                            this.score = 4;
                        } else {
                            this.score = data.grade;
                        }

                        var shareObj = {
                            // 分享的链接，默认使用location.href
                            url: window.location.href,
                            // 分享的标题，默认使用document.title
                            title: "我再百业惠盟发现一件不错的商店,快来看看吧",
                            // 分享的摘要，默认使用<meta name="description" content="">content的值
                            digest: data.merchantName,
                            // 分享的图片，默认获取本页面第一个img元素的src
                            pic: data.logoUrl,
                            // 默认显示的网站为以下六个个,支持设置的网站有
                            // weixin,weixintimeline,qq,qzone,yixin,weibo,tqq,renren,douban,tieba
                            sites: ['weixin', 'weixintimeline', 'qq', 'qzone']
                        }
                        this.shareData = shareObj;
                    }
                }).catch(err => {
                    Indicator.close();
                })

            },


        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        background: #fff;
        width: 100%;
        min-height: 100vh;
        padding-top: 40px;
        margin-bottom: 2rem;

    }

    .mint-header {
        background: #ff911e;
        width: 100%;
        border-bottom: none;
        font-size: 16px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;

    }

    .search {
        overflow: hidden;
        padding: 0.2rem;
        font-size: 0.65rem;
        width: 80%;
        display: flex;
        align-items: center;
    }

    .searhed {
        display: block;
        height: 1.25rem;
        padding: 5px 0.5rem;
        border-radius: 2em;
        flex: 1;
        margin: 0 auto;
        background-color: #eee;
    }

    .searhed input {
        float: left;
        background: transparent;
        color: #856d54;
        font-size: 14px;
        width: calc(100% - 3rem);
    }

    .searhed i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 2px;
        font-size: 14px;

    }

    .searhed i.el-icon-circle-close {
        float: right;
    }

    .send {
        width: 20px;
        position: relative;
        z-index: 1;
        font-size: 0.6rem;
    }

    .send img {
        display: block;
    }

    .send .right-list {
        position: absolute;
        right: -8px;
        top: -0.4em;
        font-size: 12px;
        color: red;
        line-height: 1.4em;
        min-width: 1.4em;
        background: white;
        border-radius: 2rem;
    }



    .mint-header .heade {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mint-header .heade img {
        width: 0.75rem;
        height: 0.75rem;
    }

    .mint-header .heade .tite {
        flex: 1;
        text-align: center;
    }

    .mint-header-button {
        -webkit-box-flex: .12;
        -ms-flex: .12;
        flex: .12;

    }

    .mint-button {
        height: 1.5rem;
    }

    .bg {
        background-color: #ff911e;
        height: 3.5rem;
    }

    .start {
        width: 100%;
        padding: 0.5rem;
        margin-top: -3.3rem;
    }



    .top {
        width: 100%;
        background-color: #fff;
        height: 6rem;
        box-shadow: 0 0 5px #ccc;
        border-radius: 0.5rem;
        padding: 0.5rem;
        color: #666;
        font-size: 0.62rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;




    }

    .top .b1 {
        display: flex;
        align-items: center;
        line-height: 1.6rem;
    }

    .top .b1 p {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
        color: #333;
        font-size: 0.75rem;
    }

    .top img {
        width: 0.75rem;
        height: 0.75rem;
        margin: 0 0.5rem;
    }

    .top .b2 {
        display: flex;
        align-items: center;
        line-height: 1.6rem;
        justify-content: space-between;
    }

    .top .b2 p {
        color: #999;
        font-size: 0.55rem;
    }

    .top .b2 a {
        color: #FF4400;

        display: flex;
        align-items: center;
    }

    .top .b3 {
        font-size: 0.55rem;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1rem;
    }

    .coupons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1.6rem;

    }

    .discounts {
        color: #666;
        font-size: 0.58rem;
        padding: 0 0 0 0.6rem;
        margin-bottom: 0.6rem;
    }

    .coupons ul {
        flex: 1;
        display: flex;
        padding: 0 0.5rem;
        height: 1rem;
        flex-wrap: wrap;
        overflow: hidden;

    }

    .coupons ul li {
        background-color: #FFF0EA;
        color: #FF8245;
        margin: 0 0.2rem;
        line-height: 0.8rem;
        font-size: 0.5rem;
        padding: 0.1rem 0.2rem;

    }

    .count {
        overflow: auto;
        height: 1.6rem;
        display: flex;
        flex-shrink: 0;
    }

    .count::-webkit-scrollbar {
        display: none
    }

    .count li {
        background: linear-gradient(#FF713D, #FE534F);
        display: flex;
        flex-shrink: 0;
        width: 47%;
        align-items: center;
        margin-right: 0.4rem;
        border-radius: 0.3rem;
        color: #fff;
        justify-content: space-between;
        padding: 0 0.3rem;

    }

    .count li .abs {
        font-size: 0.54rem;
        height: 1.2rem;
        padding-left: 0.3rem;
        line-height: 1.2rem;
        border-left: 1px dashed #eee;
    }

    .comm {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 2.25rem;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
        padding: 0 0.5rem;
        font-size: 0.58rem;
        color: #333;

    }

    .filterPop {
        width: 100%;
        height: 15.5rem;
        overflow: hidden;
        background: #fff;
        position: relative;
        display: flex;
    }

    .filterPop .shi {
        width: 25%;
        height: 15.5rem;
        overflow-y: auto;
        color: #666;
        background-color: #f1f1f1;
        font-size: 0.6777rem;
        text-align: center;
    }

    .filterPop .shi::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .filterPop .shi li {
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        font-size: 0.55rem;
    }

    .filterPop .shi li .bord {
        height: 1.4rem;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .filterPop .shi li .bord img {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.2rem;
    }

    .active2 {
        border-left: 2px solid #FF9D19;
    }

    .active1 {
        background-color: #fff;
        color: #333;
    }

    .active3 {
        background-color: #FFF8CC !important;
        color: #333 !important;
    }

    .filterPop .time-box {
        flex: 1;
        padding: 0.1rem;
        margin-top: 0.5rem;
        overflow: auto;

    }

    .filterPop .time-box .navbox {
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.58rem;
        color: #666;
    }
     .filterPop .time-box::-webkit-scrollbar{
         display: none;
     }
    .filterPop .time-box .navbox li {
        width: 28%;
        text-align: center;
        height: 1.5rem;
        line-height: 1.5rem;
        background-color: #f5f5f5;
    }



    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
    }

    .list li .shopInfo {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.2rem;

    }

    .list li .shopInfo .left {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

    }

    .list li .shopInfo .left .labels {
        padding: 0 0.2rem;
        background-color: #FF9D19;
        font-size: 0.5rem;
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
    }

    .list li .shopInfo .left img {
        width: 90%;
        height: 90%;

    }

    .list li .shopInfo .right {
        flex: 1;
        padding-left: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list li .shopInfo .right .a1 {
        line-height: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.65rem;
        font-weight: 500;

    }

    .list li .shopInfo .right .a2 {
        font-size: 0.55rem;
        line-height: 0.8rem;
    }

    .list li .shopInfo .right .lq {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .list li .shopInfo .right .lq .lleft {
        flex: 1;
    }

    .list li .shopInfo .right .lq img {
        width: 0.8rem;
        height: 0.8rem;
    }

    .list li .shopInfo .right .a3 {
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
        line-height: 0.8rem;
    }

    .list li .shopInfo .right .a3 .b1 {
        background-color: #FFF0EA;
        padding: 0 0.2rem;
        border-radius: 0.2rem;
        margin-right: 0.2rem;

    }

    .list li .shopInfo .right .a4 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
    }

    .list li .shopInfo .right .a4 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;


    }

    .spebtn .mmoo {
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
    }

    .spebtn .mmoo .a4 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
        flex: 1;
    }

    .spebtn .mmoo .a4 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;


    }

    .itembox {
        height: 90%;
        overflow: auto;
    }

    .itembox::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }



    .disbtn {
        padding: 0.4rem;
        width: 100%;
        max-height: 65vh;
        color: #666;
        font-size: 0.62rem;
    }

    .disbtn .heade {
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #f2f2f2;
    }

    .disbtn .heade .name {
        flex: 1;
        text-align: center;
        font-size: 0.7rem;
        color: #333;

    }

    .disbtn .heade .close {
        width: 10%;
        font-size: 1.25rem;
        color: #999;
        text-align: center;
    }

    .disbtn .maine {
        padding: 0.4rem 0;
        overflow: auto;
        max-height: 50vh;
    }

    .disbtn .maine::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .disbtn .zhekou {
        display: flex;
        height: 1.2rem;
        align-items: center;
        color: #666;
        font-size: 0.55rem;
    }

    .disbtn .zhekou .zhekou_1 {
        padding: 0.1rem 0.3rem;
        background-color: #FFF0EA;
        color: #FF4400;
    }

    .disbtn .zhekou .zhekou_2 {
        flex: 1;
        margin-left: 0.6rem;
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
        font-size: 0.8rem;
        font-weight: 600;
    }

    .disbtn .coupon .coupon_1 .timed {
        font-size: 0.52rem;

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
        font-size: 0.58rem;
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

    .spebtn {
        width: 100%;
        max-height: 60vh;
        color: #666;
        font-size: 0.62rem;
        padding: 0.5rem;

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

</style>
