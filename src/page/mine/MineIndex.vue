<template>
    <div class="mine" :class="{hehe:anhei}">
        <div class="header">
            <div class="head">
                <router-link to="/mine/rlservice" v-if="id">
                    <div class="setting">
                        <img src="@/assets/images/user/mine_icon_8.png" alt>
                    </div>
                </router-link>
                <router-link to="/mine/Settings">
                    <div class="setting">
                        <img src="@/assets/images/user/mine_icon_9.png" alt>
                    </div>
                </router-link>
            </div>
            <!-- 头部用户信息 -->
            <div class="top">
                <div class="logo">
                    <img id="avatar" :src="advatar" alt>
                </div>
                <div class="Label" v-if="id">
                    <p class="userName">{{info.nickname==null||''?info.username:info.nickname}}</p>
                    <p class="level" :class="{isactive:isActive==0}">
                        <span v-for="(item,index) in levelLabel" :key="index">{{item}}</span>
                    </p>
                </div>
                <div class="Label" v-else>
                    <p class="userName">您还未登录哦~</p>
                    <p class="level">
                        <span @click="toLogin">登录</span>
                        <span @click="toRegistered">注册</span>
                    </p>
                </div>

            </div>
            <div class="footer" v-if="id">
                <li @click="userfunct(1)">
                    <a>
                        <img src="@/assets/images/user/mine_icon_2.png" alt="">
                        <div class="pname">
                            收藏
                        </div>
                    </a>
                </li>
                <li @click="userfunct(2)">
                    <a>
                        <img src="@/assets/images/user/mine_icon_1.png" alt="">
                        <div class="pname">
                            评价

                        </div>
                    </a>
                </li>
                <li @click="userfunct(3)">
                    <a>
                        <img src="@/assets/images/user/mine_icon_3.png" alt="">
                        <div class="pname">
                            卡券
                        </div>
                    </a>
                </li>

                <li @click="userfunct(4)">
                    <a>
                        <img src="@/assets/images/user/mine_icon_3.png" alt="">
                        <div class="pname">
                            消息
                        </div>
                    </a>
                </li>
            </div>
        </div>


        <!-- 4.18版收益明细 -->
        <div class="earnDetail">
            <div class="cash">
                <span>可提现收益：<em>¥{{earnDetail.bonus==null||''?'0':earnDetail.bonus}}</em></span>
                <span v-if="(info.levelId > 1 || earnDetail.bonus>0)&&isEmplyee!=1" @click="drawMoneyFn"
                    class="drawMoney">立即提现</span>
            </div>
            <ul class="detailInfo">
                <li>
                    <p>￥{{earnDetail.totalProfit?earnDetail.totalProfit:0}}</p>
                    <p>累计收益</p>
                </li>
                <li>
                    <p>￥{{earnDetail.dayProfit?earnDetail.dayProfit:0}}</p>
                    <p>今日收益</p>
                </li>
                <li>
                    <p>￥{{earnDetail.monthProfit?earnDetail.monthProfit:0}}</p>
                    <p>本月收益</p>
                </li>
                <li>
                    <p>￥{{earnDetail.withdrawCash?earnDetail.withdrawCash:0}}</p>
                    <p>已提现</p>
                </li>

            </ul>
            <div class="listInfo">
                <router-link to="/mine/cousterDetail"><span>消费明细</span></router-link>
                <router-link to="/mine/Earndetail"><span>收益明细</span></router-link>
                <router-link to="/mine/drawalRecord"><span class="last">提现记录</span></router-link>
            </div>

        </div>
        <div class="huim" v-if="id">
            <div class="title">
                <div>我的订单</div>
                <div @click="shqOrder(0)">查看全部订单<i class="el-icon-arrow-right "></i></div>
            </div>
            <div class="fulis">
                <ul class="azj">
                    <li @click="shqOrder(1)">
                        <a>
                            <img src="@/assets/images/user/mine_icon_7.png" alt="">
                            <div class="pname">
                                <p style="font-size: 0.55rem;margin-top: 0.2rem;">待付款</p>

                            </div>
                        </a>
                    </li>
                    <li @click="shqOrder(6)">
                        <a>
                            <img src="@/assets/images/user/mine_icon_11.png" alt="">
                            <div class="pname">
                                <p style="font-size: 0.55rem;margin-top: 0.2rem;">待使用</p>

                            </div>
                        </a>
                    </li>
                    <li @click="shqOrder(5)">
                        <a>
                            <img src="@/assets/images/user/mine_icon_4.png" alt="">
                            <div class="pname">
                                <p style="font-size: 0.55rem;margin-top: 0.2rem;">待评价</p>

                            </div>
                        </a>
                    </li>

                    <li @click="shqOrder(4)">
                        <a>
                            <img src="@/assets/images/user/mine_icon_10.png" alt="">
                            <div class="pname">
                                <p style="font-size: 0.55rem;margin-top: 0.2rem;">退款/售后</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 人脉管理 -->
        <div class="people" v-if="id">
            <div class="title">人脉管理</div>
            <div class="peopleClass">
                <ul>
                    <li>
                        <router-link :to="{path:'/mine/PeopleManage',query:{flag:0,cardNo:cardNo}}">
                            <img src="@/assets/images/vip_1.png" alt>
                            <div class="pname">潜在人脉</div>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/mine/PeopleManage',query:{flag:1,cardNo:cardNo}}">
                            <img src="@/assets/images/vip_2.png" alt>
                            <div class="pname">直接人脉</div>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/mine/PeopleManage',query:{flag:2,cardNo:cardNo}}">
                            <img src="@/assets/images/vip_3.png" alt>
                            <div class="pname">间接人脉</div>
                        </router-link>
                    </li>
                    <li>
                        <router-link :to="{path:'/mine/PeopleManage',query:{flag:3,cardNo:cardNo}}">
                            <img src="@/assets/images/invite_10.png" alt>
                            <div class="pname">试用会员</div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class="huim" v-if="id">
            <div class="title">惠盟用户--爱之家商城 功能入口</div>
            <div class="fuli">
                <ul class="azj">
                    <li @click="azjlin">
                        <a>
                            <img style="height:1.3rem" src="@/assets/images/memberGift.png" alt="">
                            <div class="pname">
                                <p>分享爱之家</p>
                                <p>商城给好友</p>
                            </div>
                        </a>
                    </li>
                    <li @click="azjlinks">
                        <a>
                            <img style="height:1.3rem" src="@/assets/images/memberGift.png" alt="">
                            <div class="pname">
                                <p>爱之家消费券</p>
                                <p>使用专场</p>
                            </div>
                        </a>
                    </li>
                    <li v-show="type>1||partnerdj>2" @click="azjSupplierlinks">
                        <a>
                            <img style="height:1.3rem" src="@/assets/images/memberGift.png" alt="">
                            <div class="pname" style="color:#666;">
                                <p>邀请供应商</p>
                                <p>为爱之家供货</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 弹出框 -->


        <!-- 我要赚钱 -->
        <div class="people" v-if="isActive==1||isFake==1">

            <div class="title">
                惠盟邀请
                <img class="inviteText" src="@/assets/images/inviteText.png" alt>
            </div>
            <div class="peopleClass inviteImg">
                <ul>
                    <li v-for="item in tapbtn" @click="tapto(item.qrCodeSort)">
                        <a href="javascript:void(0)">
                            <img :src="item.iconUrl">
                            <p class="pnam">{{item.iconName}}</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!--合伙人选择弹窗-->
        <mt-popup v-model="partnerDrop" popup-transition="popup-fade">
            <div class="dropdowntitle">请选择合伙人类型</div>
            <div class="dropdownbox">
                <li v-for="q in fansil" @click="tapto(q.qrCodeSort)">
                    <a href="javascript:void(0)">
                        <img :src="q.iconUrl">
                        <p class="pnam">{{q.iconName}}</p>
                    </a>
                </li>
            </div>
        </mt-popup>

        <!-- 我的工具 -->
        <div class="people">
            <div class="title">我的工具</div>
            <div class="peopleClass">
                <ul>
                    <li v-for="(item,index) in tools" :key="index" ref="tooool" :class="{'l4':index > 2}"
                        @click="ToolsFn(item.label)">
                        <a href="javascript:void(0)">
                            <img :src="item.imgurl" alt>
                            <div class="pname">{{item.label}}</div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <bottomnav :carcount="carcount"></bottomnav>
        <!-- 兑换栏弹窗 -->
        <div class="exchange">
            <mt-popup v-model="exchangePopup" popup-transition="popup-fade">
                <div class="topIcon">
                    <img src="@/assets/images/exchange.png" alt>
                    <span class="success">兑换成功！</span>
                </div>
                <div class="exchangeC">尊敬的惠盟用户，您已成功兑换爱之家商城代金券。现在就去货真价惠“为爱为家”的网络商城-【爱之家商城】使用吧！</div>
                <div class="exchangeTips" @click="toIntroduce">
                    <img src="@/assets/images/tips.png" alt>
                    <span>使用说明</span>
                </div>
                <div class="exchangeBtn">
                    <button @click="hideExchange">留在百业</button>
                    <button @click="to520">立即使用</button>
                </div>
            </mt-popup>
        </div>
        <!-- 兑换券使用说明弹窗 -->
        <div class="introduce">
            <mt-popup v-model="introducePopup" popup-transition="popup-fade" position='right'>
                <div class="introWrap">
                    <button class="closeBtn" @click="closeIntro">关闭</button>
                    <p class="introText">使用说明</p>
                    <p class="introTitle">
                        1、兑换成功后，可点击去商城即可到软件商城下载爱之家商城的APP，下载完成并打开登录爱之家商城，点击底部菜单栏中“我的”，再点击“我的优惠券”功能，打开“我的卡包”即可看到代金券信息。</p>
                    <p class="introTitle">
                        2、选择好购买的商品后，在结算的时候点击使用代金券，即可抵扣代金券金额的费用，如果商品金额小于代金券金额，直接操作付款即可，若商品金额大于代金券部分，超出金额可以另外支付。</p>
                    <p class="introTitle">3、代金券没有有效期，用完即止。</p>
                    <p class="introTitle">4、代金券不能和其它优惠一并使用。</p>
                    <p class="introTitle">5、代金券可以循环使用，用多少算多少，用不完下次可以继续使用。</p>
                    <p class="introTitle">6、代金券不可抵扣运费。</p>
                    <p class="introTitle">7、代金券不可取现。</p>
                    <p class="introTitle">8、代金券可以在爱之家商城全场使用，品牌广场商品除外。</p>
                    <p class="introTitle">9、代金券使用规则最终解释权归广州华项科技有限公司所有。</p>
                </div>
            </mt-popup>
        </div>

    </div>
</template>

<script type="text/javascript">
    import azjlinks from '@/assets/js/AZJlinks'
    export default {
        name: "MineIndex",
        data() {
            return {
                carcount: "我的",
                audit: "", //审核中的角色判断
                // levelName:'惠盟用户',//用户角色区别
                isActive: this.$cookie.get("isActive"),
                agencyStatus: this.$cookie.get("agencyStatus"),
                seq: this.$cookie.get("seq"), //用户编号
                id: this.$cookie.get("userid"), //用户编号
                type: this.$cookie.get("level_id"),
                fullVipNum: this.$cookie.get("fullVipNum"),
                vip_type: this.$cookie.get("vip_type"),
                partner: null, //1 惠盟用户，2表示推广商，0是普通用户
                info: {},
                inPost: {},
                cardNo: this.$cookie.get("card"),

                tools: [{
                        imgurl: require("@/assets/images/tool_2.png"),
                        label: "常见问题"
                    },
                    {
                        imgurl: require("@/assets/images/tool_3.png"),
                        label: "专属客服"
                    },
                    {
                        imgurl: require("@/assets/images/tool_4.png"),
                        label: "意见反馈"
                    },
                    {
                        imgurl: require("@/assets/images/tool_5.png"),
                        label: "关于我们"
                    },
                    {
                        imgurl: require("@/assets/images/tool_6.png"),
                        label: "新手指引"
                    }
                ],
                advatar: require("@/assets/images/vip_hp.png"),
                inviter: "", //推荐人id
                voucher: "", //代金券
                exchangeBtn: false, //立即兑换按钮可以点击
                exchangePopup: false, //兑换弹窗
                introducePopup: false,
                userid: this.$cookie.get('userid'),
                isWhiteList: '', //校园季卡判断

                partnerDrop: false,
                dropdown: false,
                type2: 1,
                partnerdj: "",
                list: '',
                isFake: this.$cookie.get("isFake"),
                cardType: this.$cookie.get("cardType"),
                levelLabel: '', //身份等级
                earnDetail: {}, //收益明细
                isShowBox: false,
                tapbtn: [],
                fansil: [],
                isEmplyee: '',
                goodsShow: {
                    goodsImgUrl: '../../assets/images/aboutUs.jpg',
                    goodsName: '百业惠盟',
                    goods: '惠盟商品优惠',
                    goodsUrl: 'http://byhm.520shq.com/#/'
                },
                usre: this.$cookie.get("userPhone"),
                anhei: true



            };
        },
        created() {

            axios.get(this.Head + "rest/user/getUserImgUrlBySeq?seq=" + this.seq).then(res => {
                if (res.data.status == 200) {
                    this.advatar = res.data.data;
                }
            });

        },
        mounted() {

            if (this.id) {
                this.getInfo();
                this.getYLinfo();
                this.tubiao();
                this.shqshow = true;
            }


        },
        methods: {
            //用户跳转
            userfunct(val) {
                switch (val) {

                    case 1:
                        this.$router.push({
                            path: '/collection'
                        })
                        break;

                    case 2:
                        this.$router.push({
                            path: '/evaluation'
                        })
                        break;
                    case 3:
                        this.$router.push({
                            path: '/cardCoupon'
                        })
                        break;
                    case 4:
                        this.$router.push({
                            path: '/message'
                        })
                        break;

                };
            },
            //跳转520平台订单
            shqOrder(val) {
                this.$router.push({
                    path: '/merchorder',
                    query: {
                        merchid: val
                    }
                })
            },
            //去登录
            toLogin() {
                this.$router.push({
                    path: '/login'
                });
            },
            //去注册
            toRegistered() {
                this.$router.push({
                    path: '/registered'
                });
            },
            //跳转邀请页面
            tapto(val) {
                switch (val) {
                    case 0:
                        this.partnerDrop = true;
                        break;
                    case 1:
                        this.$router.push({
                            path: '/mine/InviteProvince'
                        })
                        break;

                    case 2:
                        this.$router.push({
                            path: '/mine/InviteCity'
                        })
                        break;
                    case 3:
                        this.$router.push({
                            path: '/mine/InviteArea'
                        })
                        break;
                    case 4:
                        this.$router.push({
                            path: '/mine/inviteBusiness'
                        })
                        break;
                    case 5:
                        this.$router.push({
                            path: '/mine/partner',
                            query: {
                                exper: "province"
                            }
                        })
                        break;
                    case 6:
                        this.$router.push({
                            path: '/mine/partner',
                            query: {
                                exper: "city"
                            }
                        })
                        break;
                    case 7:
                        this.$router.push({
                            path: '/mine/partner',
                            query: {
                                exper: "county"
                            }
                        })
                        break;
                    case 8:
                        this.$router.push({
                            path: '/mine/invitMember'
                        })
                        break;
                    case 9:
                        this.$router.push({
                            path: '/mine/InvitUsers'
                        })
                        break;
                    case 10:
                        this.$router.push({
                            path: '/mine/inviteShop'
                        })
                        break;
                    case 11:
                        this.$router.push({
                            path: '/mine/InviteChoice',
                            query: {
                                isPartner: this.partner
                            }
                        })
                        break;
                    case 12:
                        this.$router.push({
                            path: '/mine/inviteExper'
                        })
                        break;
                };
            },
            //获取图标
            tubiao() {
                axios.get(this.Api + "/iconlibrary/queryIconLibraryAll?userId=" + this.id).then(res => {
                    if (res.status == 200) {
                        // console.log(res, '4')
                        this.tapbtn = res.data.data;
                        this.fansil = res.data.partnerUrl;
                        // console.log(this.fansil, this.tapbtn.length)
                    } else {
                        Toast(res.data.msg);
                    }
                });
            },
            azjSupplierlinks() {
                this.$router.push({
                    path: '/mine/inviteSupplier'
                })
            },
            azjlin() {
                this.$router.push({
                    path: '/mine/InviteAzj'
                })
            },
            getInfo() {
                let that = this
                Indicator.open();
                let params = {
                    id: this.id,
                    type: this.type
                };
                // 用户基本信息
                function queryUserData() {
                    return axios({
                        url: that.Api + "/user/queryUserData",
                        params: params,
                        method: "get",
                        headers: {
                            "X-Nideshop-Token": that.$cookie.get('token')
                        }
                    })
                }
                // 判断推广商是否已经审核通过
                function agency() {
                    return axios({
                        url: that.Api + "/agency/info/",
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": that.$cookie.get("token")
                        }
                    });
                };
                // 处理多个异步加载的接口返回数据
                axios.all([queryUserData(), agency()])
                    .then(axios.spread(function (query, agency) {
                        Indicator.close();
                        console.log(query.data, '585')
                        that.partner = query.data.partnerLevel;
                        that.partnerdj = query.data.partnerLevel;
                        that.info = query.data;
                        that.cardNo = query.data.cardNo;
                        that.inviter = query.data.inviter;
                        that.voucher = query.data.voucher;
                        that.isWhiteList = query.data.isWhiteList;
                        that.levelLabel = query.data.userProfitVo.levelDescList;
                        that.earnDetail = query.data.userProfitVo.profitVo;
                        that.isEmplyee = query.data.isEmplyee;
                        that.inPost = agency.data;
                        if (that.info.isActive == 1 && that.info.levelId > 1 && that.info.type == 6) {

                        };
                        if ((that.inPost.data && that.inPost.data != "") || that.inPost.data != null) {

                        } else {
                            that.audit = '';
                        }
                    }));
            },
            hideExchange() {
                this.exchangePopup = false;
            },
            to520() {
                this.getInfo();
                azjlinks(this, this.userid, 'index');
            },
            /* 立即兑换 */
            exchangeFn() {
                //  Toast('工程师正在建设中，待完成即可兑换，请耐心等候，谢谢！')
                axios.get(this.Api + "/user/conversionVoucher?userId=" + this.id).then(res => {
                    if (res.status == 200) {
                        var data = res.data;
                        if (data.code == 0) {
                            this.voucher = 0;
                            this.exchangePopup = true; //打开兑换提醒弹窗
                        } else if (data.code == 400) {
                            Toast(data.msg);
                        } else if (data.code == 500) {
                            Toast(data.msg || data.errmsg);
                        }
                    } else {
                        Toast("网络错误，请联系管理员！");
                    }
                });
            },
            toIntroduce() {
                // console.log('兑换页说明');
                this.introducePopup = true;
            },
            closeIntro() {
                this.introducePopup = false;
            },
            /* 立即提现 */
            drawMoneyFn() {

                this.$router.push({
                    path: "/settings/TXapplication"
                });


            },
            //我要赚钱
            JumpFn(val) {
                if (val == 5) {
                    this.$router.push({
                        path: "/mine/inviteShop"
                    });
                } else if (this.info.isActive == 0) {
                    //  isactive'用户卡是否激活（续费） 0-未激活 1-已激活
                    if (this.info.isFake == 1 && val == 4) {
                        this.$router.push({
                            path: "/mine/invitMember"
                        });
                    } else if (this.info.isFake == 1 && val == 6) {
                        this.$router.push({
                            path: "/mine/invitJiMember"
                        });
                    } else if (this.type == 0 && this.inviter == 0) {
                        MessageBox({
                            title: "提示",
                            message: "抱歉，本平台暂不开放运营商申请，不便之处，敬请谅解！"
                        });

                    } else {
                        MessageBox.confirm("", {
                            title: "您的用户卡暂未激活，请激活后分享！",
                            message: "立即激活，开启赚钱之旅？"
                        }).then(action => {
                            if (action == "confirm") {

                                this.$router.push({
                                    path: '/selectionCard',
                                    query: {
                                        cardType: 1
                                    }
                                })
                            }
                        })
                    };
                } else if (this.type >= 1) {
                    switch (val) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 7:
                            if (this.type >= 2) {
                                this.agency(val);
                            } else {
                                Toast("对不起，没有分享权限。");
                            }
                            break;
                        case 4:
                            this.$router.push({
                                path: "/mine/invitMember"
                            });
                            break;
                        case 6:
                            this.$router.push({
                                path: "/mine/invitJiMember"
                            });
                            break;

                    }
                } else {
                    Toast("对不起，没有分享权限。");
                }

            },
            LinkToChoice() {
                this.$router.push({
                    path: "/mine/InviteChoice"
                });
            },
            // 判断运营商是否审核中0审核，1通过
            agency(val) {
                let data = this.inPost;

                if ((data.data && data.data != "") || data.data != null) {
                    if (data.data.status == 1) {
                        switch (val) {
                            case 0:
                                this.$router.push({
                                    path: "/mine/InviteProvince"
                                });
                                break;
                            case 1:
                                this.$router.push({
                                    path: "/mine/InviteCity"
                                });
                                break;
                            case 2:
                                this.$router.push({
                                    path: "/mine/InviteArea"
                                });
                                break;
                            case 3:
                                this.$router.push({
                                    path: "/mine/inviteBusiness"
                                });
                                break;
                            case 7:
                                this.$router.push({
                                    path: "/mine/InviteChoice"
                                });
                                break;

                        }
                    } else if (data.data.status == 0) {
                        Toast("运营商审核中");
                    } else if (data.data == 0) {
                        Toast(data.errmsg);
                    }
                } else {
                    Toast(data.errmsg || data.msg)
                }
            },
            closes() {
                this.isShowBox = false;
            },
            //我的工具

            ToolsFn(val) {
                switch (val) {
                    case "新手指引":
                        this.$router.push({
                            path: "/tools/noviceGuide"
                        });
                        break;
                    case "常见问题":
                        this.$router.push({
                            path: "/tools/CommonProblem"
                        });
                        break;
                    case "专属客服":

                        this.closeQuestionBox();

                        break;
                    case "意见反馈":
                        this.$router.push({
                            path: "/tools/Advice"
                        });
                        break;
                    case "关于我们":
                        this.$router.push({
                            path: "/tools/AboutUs"
                        });
                        break;
                }
            },
            //联系客服
            closeQuestionBox() {
                let date = new Date();
                if (date.getHours() == 23 || (date.getHours() >= 0 && date.getHours() < 9)) {
                    MessageBox({
                        title: "提示",
                        message: "已经过了专属客服时间，请于早上9点到晚上23点前咨询。"
                    });
                    return false;
                }

                this.$router.push({
                    path: "/mine/rlservice"
                });

            },
            //关闭弹窗
            clear() {
                this.isShowBox = false;
            },


            // 爱之家跳转
            azjlinks() {
                azjlinks(this, this.userid);
            },

            //判断是否有银联入驻
            getYLinfo() {
                let seq = this.$cookie.get('seq');
                this.$cookie.set('isShow', 'no')
                axios.get(this.Api + 'UnionPayEnter/findAccountInfo?seq=' + seq, {
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    })
                    .then(res => {

                        console.log(res.data, '333')
                        if (res.data.code == 0) {
                            if (res.data.data.applyStatus == '05') {
                                this.$cookie.set('isYLEnter', 'yes');
                            }
                        }

                    })
            },

        }
    };

</script>


<style scoped>
    /* 客服弹窗 */



    /* 兑换弹窗 */
    .mine .huim {
        width: 100%;
        background-color: #fff;
        margin: 0 auto;
        margin-top: 0.4444rem;
        padding: 0 0.4444rem;
    }

    /* .hehe {
         background-color: black !important;
         color:#fff;
     } */
    .mine .huim .title {
        font-size: 0.58rem;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
        padding: 0.6667rem 0.5333rem;
        display: flex;
        justify-content: space-between;
    }

    .mine .huim .fuli ul {
        width: 100%;
        padding: 0.6889rem 0;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .mine .huim .fulis ul {
        width: 100%;
        padding: 0.6889rem 0;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .mine .huim .fulis ul li {

        width: 25%;
        font-size: 0.58rem;
        text-align: center;

    }

    .mine .huim .fuli ul li {
        padding: 0.5rem;
        width: 33%;
        font-size: 0.55rem;
        text-align: center;

    }

    .mine .huim .fuli ul li a {
        color: #666;
    }

    .mine .huim .fulis ul li a {
        color: #666;
    }


    .mine .huim .fuli ul li img {

        width: auto;
        height: 1.3rem;
    }

    .mine .huim .fulis ul li img {

        width: auto;
        height: 1.1rem;
    }

    .mine .exchange>>>.mint-popup {
        width: 80% !important;
        border-radius: 5px;
        background: #fff;
    }

    .mint-popup {
        width: 80% !important;
        border-radius: 5px;
        background: #fff;
        font-size: 0.66rem;
        text-align: center;
    }

    .mint-popup li {
        width: 33%;
    }

    .mint-popup img {
        width: 2rem;
        height: 2rem;
        ;
    }

    .mine .exchange .topIcon {
        font-size: 0.8rem;
        color: #fe7e01;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.1111rem 0.6667rem 0 0.6667rem;
    }

    .mine .exchange .exchangeC {
        text-indent: 1rem;
        font-size: 0.5778rem;
        color: #666666;
        line-height: 20px;
        text-align: justify;
        margin-top: 1.1111rem;
        padding: 0 0.6667rem;
    }

    .mine .exchange .exchangeTips {
        width: 100%;
        font-size: 0.6222rem;
        color: #ff9000;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
    }

    .mine .exchange .exchangeTips img {
        width: 16px;
        height: 16px;
        margin-right: 2px;
    }

    .mine .exchange .exchangeBtn {
        font-size: 0.5778rem;
        margin-top: 1rem;
        border-top: 1px solid #eeeeee;
    }

    .mine .exchange .exchangeBtn button {
        border: none;
        background: none;
        color: #ff9000;
        width: 49%;
        padding: 0.5556rem 1.7778rem;
        outline: none;
    }

    .mine .exchange .exchangeBtn button:first-child {
        color: #666666;
        border-right: 1px solid #eeeeee;
    }

    .mine .exchange .topIcon img {
        width: 1rem;
        height: 1rem;
        margin-right: 10px;
    }

    /* 兑换页操作手册 */
    .mine .introduce>>>.mint-popup {
        width: 100%;
        background: #fff;
        height: 90%;
    }

    .mine .introduce .introWrap {
        padding: .4444rem 1.5rem;
    }

    .mine .introduce .introWrap .introText {
        text-align: center;
        font-size: .85rem;
        margin-top: .222rem;
    }

    .mine .introduce .introWrap .introTitle {
        margin-top: .4444rem;
        text-align: justify;
        font-size: .59rem;
        line-height: 20px;
        text-indent: -1.5em;
    }

    .mine .introduce .introWrap .closeBtn {
        outline: none;
        border: none;
        background: #ff9000;
        color: #fff;
        padding: 5px 10px;
        border-radius: 5px;
        display: block;
    }

    .mine {
        width: 100%;
        background: #f2f2f2;
        min-height: 100vh;
        background-size: contain;
        padding-bottom: 60px;
    }

    .mine .header {
        background-color: #ff9f18;
        padding: 0.6rem 0;
    }

    .mine .header .footer {
        margin-top: 0.8rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 0.58rem;
        color: #333;
    }

    .mine .header .footer img {
        width: 1.1rem;
        height: 1.1rem;
    }

    .mine .header .head {
        display: flex;
        justify-content: flex-end;
        align-items: center;

    }

    .mine .header .head a {
        height: 1.8rem;
    }

    /* 设置 */
    .mine .setting {
        height: 1.8rem;
        line-height: 1.8rem;
    }

    .mine .setting img {
        width: 0.9333rem;
        height: 1rem;
        margin-right: 0.7rem;

    }

    /* 头部信息区 */
    .top {
        width: 100%;
        margin: 0 auto;

        display: flex;
    }

    .top .ctmDetail {
        color: white;
        display: inline-block;
        /* width: 49%; */
        width: 100%;
        font-size: 0.6222rem;
        text-align: center;
        padding-bottom: 0.4444rem;
        padding-top: 0.4444rem;
    }

    .mine .top .logo {
        width: 2.5333rem;
        height: 2.4889rem;
        border-radius: 50%;
        /* position: absolute; */
        background: #eee;
        /* top: -15%; */
        margin-left: 0.4444rem;
        overflow: hidden;
    }

    .mine .top .Label {
        margin-left: .4444rem;
        flex: 1;
    }

    .mine .top .Label p.userName {
        font-size: .6667rem
            /* 30/45 */
        ;
        color: #ffffff;
        padding-top: .0889rem
            /* 4/45 */
        ;
    }

    .mine .top .Label p.level {
        display: flex;
        padding-top: .4444rem
            /* 20/45 */
        ;
    }

    .mine .top .Label p.level span {
        display: inline-block;
        padding: 0 .3333rem
            /* 15/45 */
        ;
        height: .8222rem
            /* 37/45 */
        ;
        line-height: .8222rem
            /* 37/45 */
        ;
        font-size: .4889rem
            /* 22/45 */
        ;
        color: #ff1b5c;
        background-color: #ffffff;
        border-radius: .4rem
            /* 18/45 */
        ;
        margin-right: .2222rem
            /* 10/45 */
        ;
    }

    .mine .top .Label p.isactive span {
        color: #555;
    }

    .mine .top .logo #avatar {
        width: 100%;
        height: 100%;
        display: block;
    }

    .mine .top .line1,
    .line2 {
        background-color: #ed1d56;
        padding: 0 0.4444rem
            /* 20/45 */
        ;
        display: flex;
        justify-content: space-between;
    }

    .mine .top .line {
        color: #fff;
        font-size: 14px;
        display: block;
        text-align: right;
        margin-bottom: -15px;
    }

    .mine .top .line span {
        padding-right: 5px;
    }

    .mine .top .line3 {
        padding: .3rem 0.4444rem 0 0.4444rem;
        display: flex;
        justify-content: space-between;
    }

    .mine .top .line3 .l31 {
        color: #fff;
        font-size: 0.6222rem
            /* 28/45 */
        ;
        display: flex;
        align-items: center;
    }

    .mine .top .line3 .member img {
        width: 3.2rem;
        height: 1rem;
    }

    .mine .top .line3 .member {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mine .top .line3 .l32 {
        color: #ffd400;
        font-size: 0.7111rem
            /* 32/45 */
        ;
    }

    .mine .top .line3 .l33 {
        color: #d9d9d9;
        font-size: 0.4422rem
            /* 19.9/45 */
        ;
    }

    .mine .top .line1 {
        padding-top: 1rem;
        padding-right: 5px;
    }

    .mine .top .line1 .name {
        color: #fff;
        font-size: 0.7111rem;
    }

    .mine .top .line1 .member {
        overflow: hidden;
        height: 1.0667rem;
        width: 4.166667rem;
    }

    .mine .top .line1 .member .audit {
        color: #e0174e;
        font-size: 12px;
        border: 1px solid #ffd400;
        padding: 2px 2px 2px 5px;
        border-radius: 25px;
        background: #fff;
        text-align: center;
    }

    .mine .top .line2 {
        color: #d9d9d9;
        font-size: 0.5333rem;
        padding-bottom: 0.4444rem;
        padding-top: 0.2222rem;
    }

    .mine .top .line3 .exchange {
        text-align: center;
        font-size: 0.5rem;
        color: #ec0746;
        width: 3.13rem;
        min-width: 3rem;
        height: .95rem;
        background: #fff;
        border-radius: 20px;
        padding: 2px 14px;
        border: 1px solid #ffd400;
    }

    .mine .top .line3 .noexchange {
        display: block;
        font-size: 0.5rem;
        color: #666666;
        width: 3.25rem;
        min-width: 3rem;
        height: 1.1111rem;
        background: #fff;
        border-radius: 20px;
        padding: 3px 19px;
        border: 1px solid #eeeeee;
    }

    .mine .top .shoping {
        width: 3.25rem;
        height: 1.25rem;
        align-self: flex-end;
    }

    .mine .top .profit {
        border-top: 1px solid #e0174e;
        border-bottom: 1px solid #e0174e;
        padding: 0 0.4444rem;
    }

    .mine .top .profit ul {
        overflow: hidden;
        width: 100%;
        margin: 0.5556rem 0;
    }

    .mine .top .profit ul li {
        float: left;
        width: 25%;
        text-align: center;
        height: 80%;
    }

    .mine .top .profit li {
        color: #ffc800;
        font-size: 0.6222rem
            /* 28/45 */
        ;
        border-right: 1px solid #efeee5;
    }

    .mine .top .profit li:last-child {
        border-right: none;
    }

    .mine .top .profit .pmoey {
        color: #eeeeee;
        font-size: 0.5333rem
            /* 24/45 */
        ;
        text-align: center;
    }

    .mine .top .classP {
        color: #fff;
        font-size: 0.6222rem
            /* 28/45 */
        ;
    }


    /* 新版消费明细样式 */
    .mine .top .classP span {
        display: inline-block;
        padding: 0 1.1rem;
        color: white;
    }

    .mine .top .classP .c1 {
        margin: 0.5556rem 0;
        border-right: 1px solid #efeee5;
        text-align: center;
    }

    /* 用户返利 */
    .mine .rebate {
        width: 100%;
        background-color: #fe9f17;
        border-radius: 8px;
        margin: 0 auto;
        margin-top: 0.4444rem;
        padding: 0 0.4444rem;
    }

    .mine .rebate .rline1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e99116;
        padding: 0.6667rem 0;
    }

    .mine .rebate .rline2 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e99116;
        padding-bottom: 0.6667rem;
        padding-top: 0.4444rem
            /* 20/45 */
        ;
    }

    .mine .rebate .rline1 .rr1 {
        font-size: 0.6667rem;
        color: #fff;
    }

    .mine .rebate .rline1 .rr2 {
        font-size: 0.4889rem;
        color: #eeeeee;
    }

    .mine .rebate .rline2 .rl1 {
        font-size: 0.5778rem;
        color: #eeeeee;
    }

    .mine .rebate .rline2 .rl1 i {
        font-size: 0.6667rem;
        color: #f20d4c;
    }

    .mine .rebate .rline2 .rl2 i {
        font-size: 0.6667rem;
        color: #f20d4c;
    }

    .mine .rebate .rline2 .rl2 {
        font-size: 0.5778rem;
        color: #eeeeee;
    }


    /* 新版收益明细 4.18 */
    .mine .earnDetail {
        width: 100%;
        background-color: #fff;

        margin: 0 auto;
        margin-top: 0.4444rem;
        padding: 0 .4444rem;
    }

    .mine .earnDetail .cash {
        height: 1.9556rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: .6222rem;
        color: #666;

    }

    .mine .earnDetail .cash em {
        font-style: normal;
        color: #FF4400;
        font-size: .7111rem;
    }

    .mine .earnDetail .cash .drawMoney {
        width: 3.2222rem;
        height: .9778rem;
        line-height: .9778rem;
        text-align: center;
        border-radius: .4889rem;
        color: #fff;
        font-size: .5333rem;
        background-color: #ff9f18;

    }

    .mine .earnDetail .detailInfo {
        padding: .6667rem 0;
        display: flex;
        justify-content: space-around;
        border-top: 1px solid #eee;
    }

    .mine .earnDetail .detailInfo li {
        width: 25%;
        font-size: .4889rem;
        color: #ffffff;
        text-align: center;
        border-right: 1px solid #eeeeee;
    }

    .acti {
        position: fixed;
        right: 10px;
        bottom: 20%;
    }

    .acti img {
        width: 2.4rem;
        height: 2.4rem;
    }

    .mine .earnDetail .detailInfo li:last-child {
        border-right: none;
    }

    .mine .earnDetail .detailInfo li p {
        line-height: .8rem;
        color: #666;
    }

    .mine .earnDetail .detailInfo li p:first-child {
        color: #FF4400;
        font-size: .5333rem;
    }

    .mine .earnDetail .listInfo {
        border-top: 1px solid #eee;
        font-size: .5778rem;
        padding: .6667rem 0;
        box-sizing: border-box;
        width: 100%;
    }

    .mine .earnDetail .listInfo span {
        color: #666;
        display: inline-block;
        width: 32%;
        text-align: center;
        box-sizing: border-box;
        border-right: 1px solid #eeeeee;
        height: 1.0667rem;
        line-height: 1.0667rem;
    }

    .mine .earnDetail .listInfo .last {
        border-right: none;
    }

    /* 人脉管理 */
    .mine .people {
        width: 100%;
        background-color: #fff;
        margin: 0 auto;
        margin-top: 0.4444rem;
        padding: 0 0.4444rem;
    }

    .mine .people .title {
        font-size: 0.6889rem;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
        padding: 0.6667rem 0.5333rem;
    }

    .mine .people .title .inviteText {
        width: 6.5556rem;
        height: 0.5556rem;
        float: right;
        display: block;
        margin-top: 5px;
    }

    .mine .people .peopleClass ul {
        width: 100%;
        padding: 0.6889rem 0;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .mine .people .peopleClass ul li img {
        width: auto;
        height: 1.2rem;
    }

    .mine .people .peopleClass ul li {
        width: 33%;
        height: 3.5rem;
    }

    .mine .people .inviteImg>>>.el-dropdown {
        width: 100%;
    }

    /*用户体验卡*/
    .mint-popup {
        border-radius: 0.3em;
        overflow: hidden;
    }

    .dropdowntitle {
        overflow: hidden;
        text-align: center;
        font-size: 0.7rem;
        color: #333;
        padding: 1rem 0.6rem 0;
    }

    .dropdownbox {
        display: -webkit-flex;
        display: flex;
        padding: 1rem 0.6rem 1rem;
        overflow: hidden;
        flex-direction: row;
        background: white;
    }

    .dropdown {
        text-align: center;
        font-size: 0.5556rem;
        padding-right: 2em;
    }

    .dropdown:last-child {
        padding-right: 0;
    }

    .dropdown img {
        display: block;
        margin: 0 auto;
        width: 1.5rem;
    }

    .dropdown p {
        line-height: 1.2em;
        padding-top: 0.5em;
        color: #666;
        white-space: nowrap;
    }

    /**/
    .mine .people .inviteImg ul li img {
        width: 1.2667rem;
    }

    .mine .people .peopleClass ul li a {
        color: #666;
        font-size: 0.5556rem;
        display: block;
        text-align: center;
    }

    .mine .people .peopleClass ul li a .pname {

        margin-top: 0.3333rem;

    }

    .mine .people .peopleClass ul li a .cname {
        color: #000;
    }

    .mine .people .peopleClass ul li {
        float: left;
        width: 33%;
        border: none;
    }

    .mine .people .peopleClass ul .l4 {
        float: left;
        width: 33%;
        border: none;
        margin-top: 1.3333rem;
    }

    /* 我要赚钱 */

</style>
