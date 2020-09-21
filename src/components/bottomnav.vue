<template>
    <div class="bottomnav" v-if="!backshqPd && selected">
        <mt-tabbar v-model="selected" fixed>
            <mt-tab-item id="首页" @click.native.capture="index" :class="{'is-selected':selected=='首页'}">
                <span slot="icon"><i class="icon-shouye"></i></span>
                <span class="bottom-text">首页</span>
            </mt-tab-item>
            <mt-tab-item v-if="type==6" id="店铺管理" @click.native.capture="management"
                :class="{'is-selected':selected=='商家入驻'}">
                <span slot="icon">
                    <img v-if="selected=='商家入驻'" src="../assets/images/sjgl_on.png" alt="" style="height:100%;">
                    <img v-else src="../assets/images/sjgl_no.png" alt="" style="height:100%;">
                </span>
                <span class="bottom-text">店铺管理</span>
            </mt-tab-item>
            <mt-tab-item id="身份升级" v-if="isActive == 1&& levelId== 1&&type!=6" @click.native.capture="upgrade2"
                :class="{'is-selected':selected=='身份升级'}">
                <span slot="icon">
                    <img v-if="selected=='身份升级'" src="../assets/images/upgrade/icon_sfsj_def.png" alt="">
                    <img v-else src="../assets/images/upgrade/icon_sfsj_sef.png" alt="">
                </span>
                <span class="bottom-text">身份升级</span>
            </mt-tab-item>
            <mt-tab-item id="运营中心" v-if="isActive == 1 && (levelId <= 5 && levelId > 1||partnerdj>2)"
                @click.native.capture="upgrade" :class="{'is-selected':selected=='运营中心'}">
                <span slot="icon">
                    <img v-if="selected=='运营中心'" src="../assets/images/operation.png" alt="">
                    <img v-else src="../assets/images/operation02.png" alt="">
                </span>
                <span class="bottom-text">运营中心</span>
            </mt-tab-item>

            <mt-tab-item id="用户福利" @click.native.capture="shoppingCart" :class="{'is-selected':selected=='用户福利'}">
                <span slot="icon"><i class="icon-huiyuan"></i></span>
                <span class="bottom-text">用户福利</span>
            </mt-tab-item>
            <mt-tab-item id="商家入驻" v-if="(levelId!=2&&levelId!=3 && levelId!=4 && levelId!=5 && type != 6)&&rzShow"
                @click.native.capture="shopCome" :class="{'is-selected':selected=='商家入驻'}">
                <span slot="icon">
                    <img v-if="selected=='商家入驻'" src="../assets/images/dpzm_on.png" alt="">
                    <img v-else src="../assets/images/dpzm_no.png" alt="">
                </span>
                <span class="bottom-text">商家入驻</span>
            </mt-tab-item>

            <mt-tab-item v-if="( levelId==2 || levelId==3 || levelId==4 || levelId==5) && type != 6" id="店铺查询"
                @click.native.capture="xianShopManage" :class="{'is-selected':selected=='店铺查询'}">
                <span slot="icon">
                    <img v-if="selected=='店铺查询'" src="../assets/images/dpcx_on.png" alt="" style="height:100%;">
                    <img v-else src="../assets/images/dpcx_no.png" alt="" style="height:100%;">
                </span>
                <span class="bottom-text">店铺查询</span>
            </mt-tab-item>
            <mt-tab-item id="我的" @click.native.capture="mine" :class="{'is-selected':selected=='我的'}">
                <span slot="icon"><i class="icon-wode"></i></span>
                <span class="bottom-text">我的</span>
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    // carcount改变值刷新底部购物车数量
    export default {
        props: ["carcount"],
        data() {
            return {
                selected: this.carcount,

                userid: 0,
                id: this.$cookie.get('userid'), //用户编号
                type: this.$cookie.get("vip_type"),

                levelId: this.$cookie.get("level_id"),
                isActive: this.$cookie.get("isActive"),
                isFake: this.$cookie.get("isFake"),
                userPhone: this.$cookie.get('userPhone'),
                cardType: this.$cookie.get('cardType') ? this.$cookie.get('cardType') : 1,
                inviter: "",
                postdata: "",
                noMember: JSON.parse(this.$cookie.get('noMember')), //用户福利对普通用户不可见
                backshqPd: sessionStorage.getItem('applogin'), // app登录判断
                // noMember: false
                type2: 1,
                list: [],
                partnerdj: sessionStorage.getItem("partnerdj"),
                superior: this.$cookie.get('superior'),
                isPayStatus: false,
                isKai: false,
                rzShow: false,
                ifsupper: true,
            };
        },
        watch: {
            selected(val) {
                if (val == "推广商招募" && this.$cookie.get("level_id") > 1) {
                    this.selected = this.carcount;

                }
            }

        },

        created() {
            this.kaiguan();

        },

        mounted() {



            let params = this.$cookie.get('card');
            if (params) {
                axios.post(this.Api + '/user/queryByCardNo?cardNo=' + params).then(res => {
                    this.postdata = res.data;
                    this.inviter = res.data.inviter;
                    if (!this.inviter) {
                        this.noMember = false;
                        this.$cookie.set('noMember', 'false')
                    } else if (this.inviter == 0 || this.inviter == null || this.inviter == '') {
                        if (this.noMember != false) {
                            this.noMember = false;
                            this.$cookie.set('noMember', 'false')
                        }
                    } else {
                        // if(this.noMember == false){

                        // }
                        this.noMember = true;
                        this.$cookie.set('noMember', 'true')
                    }
                }).catch(err => {
                    this.$cookie.set('noMember', 'false')
                })
            }
            if (this.id) {
                this.isOrder();
            }


        },
        methods: {
            isOrder() {
                let that = this
                axios({
                    method: 'get',
                    url: that.Api + 'order/isPayStatus?userId=' + that.id,
                }).then(res => {

                    if (res.data.errno == 0) {
                        // console.log(res.data.data.isPayStatus);
                        if (res.data.data.isPayStatus == 1) {
                            that.isPayStatus = true
                        } else if (res.data.data.isPayStatus == 0) {
                            that.isPayStatus = false
                        }
                    } else {

                    }
                })
            },
            // 开关
            kaiguan() {
                axios({
                    method: 'get',
                    url: this.Api + 'showstatus/showStatus?type=2',
                }).then(res => {
                    if (res.data.code == 0) {
                        if (res.data.data == 0) {
                            this.isKai = false
                        } else {
                            this.isKai = true
                        }
                    }
                });
                axios({
                    method: 'get',
                    url: this.Api + 'showstatus/showStatus?type=4',
                }).then(res => {
                    if (res.data.code == 0) {
                        if (res.data.data == 0) {
                            this.rzShow = false
                        } else {
                            this.rzShow = true
                        }
                    }
                })
            },
            index() {
                this.$router.push({
                    path: "/"
                });
            },
            management() {
                if (this.ifsupper) {
                    this.$router.push({
                        path: "/storeplat"
                    });
                } else {
                    this.$router.push({
                        path: "/management"
                    });
                }

            },
            shoppingCart() {

                let level_id = this.$cookie.get('isActive');
                 
                 if (this.isFake == 1) {
                            this.$router.push({
                            name: "toBecomeMember",
                            params: {
                            code: 0,
                            level: 1,
                            cardType: this.cardType
                            }
                            });
                    } else if ((this.superior == 0 || !this.superior) && this.isKai) {
                        this.$router.push({
                            name: 'selectUpgrade'
                        });
                    } else if (this.superior == 10948 && this.isActive == 0) {
                        this.$router.push({
                            name: 'selectUpgrade'
                        });
                    } else {
                        this.$router.push({
                            name: "toBecomeMember",
                            params: {
                                code: 0,
                                level: 1,
                                cardType: this.cardType
                            }
                        });
                    }
                
            },
            investment() {
                if (this.$cookie.get("level_id") > 1) {
                    axios({
                        url: this.Api + "/agency/info/",
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    }).then(res => {
                        let data = res.data;
                        // console.log(data);
                        if ((data.data && data.data != "") || data.data != null) {
                            if (data.data.status == 1) {
                                Toast("您已经是推广商。");
                            } else if (data.data.status == 0) {
                                Toast("推广商审核中");
                            } else {
                                this.$router.push({
                                    name: "investment"
                                });
                            }
                        } else {
                            Toast(data.errmsg);
                        }
                    });
                } else {
                    this.$router.push({
                        name: "investment"
                    });
                }
            },
            mine() {

                this.$router.push({
                    name: "MineIndex"
                });

            },
            // 运营中心
            upgrade() {

                this.$router.push({
                    name: "operation"
                });
            },
            //身份升级
            upgrade2() {
                this.$router.push({
                    name: "upgrade"
                });
            },
            //店铺招募
            inviteShop() {
                this.$router.push({
                    name: "InviteShop"
                });
            },
            //商家入驻
            shopCome() {
                this.$router.push({
                    path: "/application/0"
                });
            },
            // 县推广商店铺管理
            xianShopManage() {
                this.$router.push({
                    name: "xianShopManage"
                });
            }
        },

    };

</script>
<style scoped>
    @import "../assets/fonts/bottom/style.css";

    .bottomnav>>>.mint-tab-item {
        color: #949494;
    }

    .bottomnav>>>.mint-tab-item-icon>* {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .bottomnav>>>.mint-tab-item-icon {
        font-size: 24px;
    }

    .bottomnav>>>.mint-tabbar>.mint-tab-item.is-selected {
        background-color: transparent;
        color: #f86e23;

    }

    .bottomnav>>>.mint-tabbar>.mint-tab-item.is-selected img {
        width: 100%;
        height: 100%;

    }

    .bottomnav>>>.bottom-icon {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

</style>
