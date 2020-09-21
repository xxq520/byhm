<template>
    <div class="upgrade">
        <!-- 头部 -->
        <div class="head">
            <mt-header title="运营商升级">
                <!-- <mt-button v-if="!carvist" slot="right" @click="goToCardRecord">购卡记录</mt-button> -->
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
                <mt-button class="head-btn" slot="right" @click="goOrder">申请记录</mt-button>
            </mt-header>
        </div>
        <!-- <bottomnav :carcount="carcount" :cart.sync="postData"></bottomnav> -->
        <!-- 运营商升级 -->
        <div class="operator-system">
            <div class="title">运营商体系</div>
            <div class="system-box">
                <img :src="upgradePic" />
            </div>
            <div class="xieyi" v-if="checkStatus==-1||checkStatus==2 ||checkStatus==undefined">
                <el-checkbox class="checked" v-model="checked"></el-checkbox><span
                    @click="goAgreement">我已阅读并同意相关协议和规则内容</span>
            </div>
            <div class="shnegji">
                <div class="pay-btn" @click="aduitFn" v-if="checkStatus==0">审核中</div>
                <div class="pay-btn" @click="aduitFn2" v-if="checkStatus==1">审核通过</div>
                <div class="pay-btn" @click="upgradeFn" v-if="checkStatus==-1||checkStatus==2 ||checkStatus==undefined">
                    立即升级</div>
                <div class="dengji">当前等级：{{shenFen}}</div>
            </div>
        </div>
        <div class="operator-system pd-b-0">
            <div class="title">专属权益</div>
            <div class="system-box">
                <img :src="rightsUrl" />
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "upgrade",
        data() {
            return {
                carcount: "身份升级",
                checked: false,
                levelId: this.$cookie.get('level_id'),
                cardType: this.$cookie.get('cardType'),
                shenFen: '',
                userId: this.$cookie.get('userid'),
                upgradePic: '',
                rightsUrl: '',
                notice: '',
                isCheck: '',
                message: '',
                message2: '',
                checkStatus: '',
                agencyApplyId: '',
                inviterCardNo: '',
            };
        },
        mounted() {

        },
        methods: {
            goback() {
                this.$router.go(-1);
            },
            //跳转到订单
            goOrder() {
                this.$router.push({
                    path: '/operation/upgradeAduit',
                    query: {
                        mold: 'apply'
                    }
                })
            },
            goAgreement() {
                this.$router.push({
                    name: 'agreement'
                })
            },
            aduitFn() {

                this.$router.push({
                    path: '/operation/aduitDetails',
                    query: {
                        id: this.agencyApplyId,
                        mold: 'apply',
                        stuats: 0
                    }
                })
            },
            aduitFn2() {

                this.$router.push({
                    path: '/operation/aduitDetails',
                    query: {
                        id: this.agencyApplyId,
                        mold: 'apply',
                        status: 1
                    }
                })
            },
            //升级函数
            // upgradeFn() {
            //     let that = this
            //     if (!that.checked) {
            //         MessageBox({
            //             title: '温馨提示',
            //             message: '请勾选我已阅读并同意相关协议和规则内容！',
            //         });
            //         return;
            //     }


            //     axios({
            //         method: 'post',
            //         url: that.Api + 'order/accountSubmits?userId=' + that.userId + '&levelId='
            //     }).then(res => {
            //         console.log(res, '585')
            //         if (res.data.errno == 0) {
            //             console.log(res.data.data)
            //             if (res.data.data.isPayStatus == 1) {
            //                 this.$router.push({
            //                     name: 'myOrder'
            //                 })
            //             } else {
            //                 if (this.isCheck == 1) {
            //                     MessageBox({
            //                         title: "温馨提示",
            //                         message: this.message,
            //                         showCancelButton: true,
            //                         showConfirmButton: true,
            //                         confirmButtonText: "确定",
            //                         cancelButtonText: "取消"
            //                     }).then(action => {
            //                         if (action == 'confirm') {

            //                             let id = parseInt(this.levelId) + 1;

            //                             axios({
            //                                 method: 'get',
            //                                 url: that.Api + "apply/saveAgencyApply?userId=" +
            //                                     that.userId + '&level=' + id,
            //                             }).then(res => {
            //                                 console.log(res, '111')
            //                                 if (res.data.code == 0) {
            //                                     this.message2 = res.data.message
            //                                     this.$router.push({
            //                                         path: '/aduitsuccessful',
            //                                         query: {
            //                                             message: this.message2
            //                                         }
            //                                     })
            //                                 }
            //                             }).catch(res => {
            //                                 Toast(res.data.msg)


            //                             })
            //                         }
            //                     });
            //                 } else {
            //                     if (this.levelId == 1 && this.cardType == 4) {
            //                         this.$router.push({
            //                             path: '/upgrading',
            //                             query: {
            //                                 card: this.inviterCardNo
            //                             }
            //                         })
            //                         return;
            //                     } else {

            //                         this.$router.push({
            //                             name: 'upgradeInformation'
            //                         })

            //                     }
            //                 }
            //             }

            //         }
            //     })


            // },
            upgradeFn() {
                let that = this
                if (!that.checked) {
                    MessageBox({
                        title: '温馨提示',
                        message: '请勾选我已阅读并同意相关协议和规则内容！',
                    });
                    return;
                }




                if (this.isPayStatus == 1) {
                    this.$router.push({
                        name: 'myOrder'
                    })
                } else {
                    if (this.isCheck == 1) {
                        MessageBox({
                            title: "温馨提示",
                            message: this.message,
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消"
                        }).then(action => {
                            if (action == 'confirm') {

                                let id = parseInt(this.levelId) + 1;

                                axios({
                                    method: 'get',
                                    url: that.Api + "apply/saveAgencyApply?userId=" +
                                        that.userId + '&level=' + id,
                                }).then(res => {
                                    console.log(res, '111')
                                    if (res.data.code == 0) {
                                        this.message2 = res.data.message
                                        this.$router.push({
                                            path: '/aduitsuccessful',
                                            query: {
                                                message: this.message2
                                            }
                                        })
                                    }
                                }).catch(res => {
                                    Toast(res.data.msg)


                                })
                            }
                        });
                    } else {
                        if (this.levelId == 1 && this.cardType == 4 ) {
                            this.$router.push({
                                path: '/upgrading',
                                query: {
                                    card: this.inviterCardNo
                                }
                            })
                            return;
                        } else if (this.levelId == 1 && this.cardType == 11) {
                            this.$router.push({
                                path: '/tyupgrading',
                                query: {
                                    card: this.inviterCardNo
                                }
                            })
                            return;
                        } else {

                            this.$router.push({
                                name: 'upgradeInformation'
                            })

                        }
                    }
                }




            },
            //基本信息
            getInfo() {
                if (this.cardType == 4) {
                    switch (this.levelId) {
                        case '1':
                            this.shenFen = '惠盟Vip'
                            break
                    }

                } else if (this.cardType == 11) {
                    switch (this.levelId) {
                        case '1':
                            this.shenFen = '试用用户'
                            break
                    }

                } else {
                    switch (this.levelId) {
                        case '1':

                            this.shenFen = '超级会员'
                            break
                        case '2':
                            this.shenFen = '运营商'
                            break
                        case '3':
                            this.shenFen = '县运营商'
                            break
                        case '4':
                            this.shenFen = '市运营商'
                            break
                        case '5':
                            this.shenFen = '省运营商'
                            break
                    }
                }
            },
            //获取升级图片
            getUpgradeImg() {

                axios({
                    method: 'get',
                    url: this.Api + "agency/statusUpdate?userId=" + this.userId,
                }).then(res => {
                    console.log(res, '856')
                    if (res.data.code == 0) {
                        this.upgradePic = res.data.upgradeUrl;
                        this.rightsUrl = res.data.rightsUrl;
                        this.notice = res.data.notice;
                        this.message = res.data.message;
                        this.isCheck = res.data.isCheck;
                        this.checkStatus = res.data.checkStatus;
                        this.agencyApplyId = res.data.agencyApplyId;
                        this.isPayStatus = res.data.isPayStatus;
                        this.inviterCardNo = res.data.inviterCardNo;
                        this.$cookie.set('level_id', res.data.levelId);
                        this.$cookie.set('cardType', res.data.cardType);
                        this.levelId = this.$cookie.get('level_id');
                        this.$cookie.set('province', res.data.province);
                        this.$cookie.set('city', res.data.city);
                        this.$cookie.set('county', res.data.county);
                    }
                    if (res.data.code == 500) {
                        MessageBox({
                            title: '温馨提示',
                            message: res.data.msg,

                            confirmButtonText: '确定'

                        }).then(action => {
                            if (this.$route.query.platform == 'android') {
                                window.action.backAPP();
                            } else if (this.$route.query.platform == 'ios') {
                                window.action.backAPPiOS();
                            } else {
                                this.$router.push({
                                    name: 'operation'
                                })
                            }



                        });
                    }

                })
            }
        },
        created() {
            this.getInfo();
            this.getUpgradeImg();
        }
    };

</script>

<style scoped>
    .upgrade {
        background: #f5f5f5;
        min-height: 100vh;
        padding-bottom: 60px;
        overflow: hidden;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .pay-btn-box {
        overflow: hidden;
        margin-top: 0.8rem;
        text-align: center;
    }

    .shnegji {
        text-align: center;
    }

    .shnegji .dengji {
        font-size: 12px;
        color: #666666;
    }

    .pay-btn {
        display: inline-block;
        width: 9.375rem;
        height: 1.666667rem;
        border-radius: .833333rem;
        margin: .416667rem 0 .625rem 0;
        background: -webkit-linear-gradient(left,
                #ff9500,
                #ff8c39);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ff9500, #ff8c39);
        /* 标准的语法 */
        text-align: center;
        line-height: 1.666667rem;
        color: #ffffff;
        font-size: .625rem;
        letter-spacing: 2px;
    }

    .head .head-btn>>>.mint-button-text {
        font-size: 12px;
        padding: 2px;
    }

    .operator-system {
        width: 13.958333rem;
        background-color: #ffffff;
        margin: 1.8rem 0.65rem 0;
        padding: 0 .666667rem .833333rem 0.666667rem;
    }

    .operator-system .title {
        font-size: .625rem;
        height: 1.833333rem;
        line-height: 1.833333rem;
        border-bottom: 1px solid #eeeeee;
    }

    .system-box {

        padding-top: .416667rem;
    }

    .system-box .system {
        height: 7.083333rem;
        width: 3.125rem;
    }

    .system .county-icom {
        height: 2.416667rem;
    }

    .system .county-icom img {
        width: 1rem;
    }

    .shuoming {
        padding-bottom: .416667rem;
    }

    .shuoming p {
        font-size: 0.58rem;
        color: #666666;
        line-height: 1.0rem;
        margin-bottom: .416667rem;
    }

    .xieyi {
        font-size: 12px;
        color: #2e90ff;
        margin-top: .416667rem;
    }

</style>
