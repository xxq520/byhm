<template>
    <div class="recruitment-agent">
        <topnav :topnav="topnav"></topnav>
        <recruit-top ref="top" :content="content"></recruit-top>
        <!-- <recruit-pay :payContent="payContent"></recruit-pay> -->
        <div class="pay-btn-box">
            <div class="pay-btn" @click="goToApplication">确定申请</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "recruitmentAgent",
        data() {
            return {
                topnav: {
                    title: "运营商说明",

                },
                invite: [{
                        level: 5,
                        title: '省级区域服务运营商',
                        text: [
                            '大中国地大物博，人口众多，但区域发展不平衡。全中国有31个省（直辖市），333个市/州/盟，2853个区/县/旗，百业惠盟需要在各地有服务合作商，形成全国性的优惠体系。运营商一方面需要洽谈与服务惠盟商家，另一方面需要承销百业惠盟的消费券，同时需要承担对他们使用百业惠盟平台技术的培训等具体服务事宜，从中获得稳定可观和长期的合作报酬。',
                            '成为百业惠盟的运营商需要是在所在地长期生活与工作的人士，能为当地运营商、惠盟商家、消费者提供就近、及时、满意、高效的服务。需要身体健康、作风正派、为人诚实、口碑好，有能力、有实力、有爱心、有责任心、遵纪守法、需要赚钱的人士。',

                        ],
                        link: ''
                    },
                    {
                        level: 4,
                        title: '市级区域服务运营商',
                        text: [
                            '大中国地大物博，人口众多，但区域发展不平衡。全中国有31个省（直辖市），333个市/州/盟，2853个区/县/旗，百业惠盟需要在各地有服务合作商，形成全国性的优惠体系。运营商一方面需要洽谈与服务惠盟商家，另一方面需要承销百业惠盟的消费券，同时需要承担对他们使用百业惠盟平台技术的培训等具体服务事宜，从中获得稳定可观和长期的合作报酬。',
                            '成为百业惠盟的运营商需要是在所在地长期生活与工作的人士，能为当地推广商、惠盟商家、消费者提供就近、及时、满意、高效的服务。需要身体健康、作风正派、为人诚实、口碑好，有能力、有实力、有爱心、有责任心、遵纪守法、需要赚钱的人士。',
                        ],
                        link: ''
                    },
                    {
                        level: 3,
                        title: '县级区域服务运营商',
                        text: [
                            '大中国地大物博，人口众多，但区域发展不平衡。全中国有31个省（直辖市），333个市/州/盟，2853个区/县/旗，百业惠盟需要在各地有服务合作商，形成全国性的优惠体系。运营商一方面需要洽谈与服务惠盟商家，另一方面需要承销百业惠盟的消费券，同时需要承担对他们使用百业惠盟平台技术的培训等具体服务事宜，从中获得稳定可观和长期的合作报酬。',
                            '成为百业惠盟的运营商需要是在所在地长期生活与工作的人士，能为当地运营商、惠盟商家、消费者提供就近、及时、满意、高效的服务。需要身体健康、作风正派、为人诚实、口碑好，有能力、有实力、有爱心、有责任心、遵纪守法、需要赚钱的人士。',
                        ],
                        link: ''

                    },
                    {
                        level: 2,
                        title: '运营商',
                        text: [
                            '大中国地大物博，人口众多，但区域发展不平衡。全中国有31个省（直辖市），333个市/州/盟，2853个区/县/旗，百业惠盟需要在各地有服务合作商，形成全国性的优惠体系。运营商一方面需要洽谈与服务惠盟商家，另一方面需要承销百业惠盟的消费券，同时需要承担对他们使用百业惠盟平台技术的培训等具体服务事宜，从中获得稳定可观和长期的合作报酬。',
                            '成为百业惠盟的运营商需要是在所在地长期生活与工作的人士，能为当地运营商、惠盟商家、消费者提供就近、及时、满意、高效的服务。需要身体健康、作风正派、为人诚实、口碑好，有能力、有实力、有爱心、有责任心、遵纪守法、需要赚钱的人士。',
                        ],
                        link: ''
                    }
                ],
                content: null,
                level_id: this.$cookie.get('level_id'), //1 520用户，2表示推广商，6表示商家，0是普通用户
                operationName: '运营商',
                isPartner: this.$cookie.get('isPartner'),
                inviterIsPartner: 0,
                userId: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                level: this.$route.params.level,
                code: this.$route.params.code

            };
        },
        methods: {
            goToApplication() {

                axios({
                    method: 'get',
                    url: this.Api + 'order/isPayment?userId=' + this.userId,
                }).then(res => {
                    console.log(res, '2')
                    if (res.data.code == 0) {
                        if (this.$refs.top._data.agreen) {
                            //判断是否是伙伴非伙伴做跳转
                            // if((this.isPartner != 1 || this.inviterIsPartner != 1) && this.$route.params.level > 1 && this.$route.params.code != '88888888') 
                            if (res.data.isPayStatus == 1) {

                                this.$router.push({
                                    name: 'myOrder'
                                })
                                return false
                            } else {
                                let params = {
                                    cardNo: this.$route.params.code,
                                    level: this.$route.params.level
                                }
                                console.log(params)
                                axios({
                                    url: this.Api + "agency/updateAgencyInfo",
                                    method: "post",
                                    data: params,
                                    headers: {
                                        "X-Nideshop-Token": this.$cookie.get("token"),
                                    }
                                }).then(res => {
                                    console.log(res, '8')
                                    if (res.data.code == 0) {
                                        this.$router.push({
                                            name: "confirmOrder",
                                            query: {
                                                code: this.code,
                                                level: this.level,
                                               
                                            }
                                        });

                                    } else if (res.data.code == 301) {

                                              

                                        MessageBox({
                                            title: "温馨提示",
                                            message: res.data.msg,
                                            showCancelButton: true,
                                            showConfirmButton: true,
                                            confirmButtonText: "确定",
                                            cancelButtonText: "取消"
                                        }).then(action => {
                                            if (action === 'confirm') {
                                        
                                                this.$router.push({
                                                    name: "confirmOrder",
                                                    query: {
                                                        code: this.code,
                                                        level: this.level,
                                                      
                                                    }
                                                });

                                            } else {
                                                this.$router.push({
                                                    path: '/mine'
                                                });
                                            }
                                        });

                                    } else {

                                        MessageBox({
                                            title: "温馨提示",
                                            message: res.data.msg
                                        }).then(action => {
                                            if (action === 'confirm') {
                                                this.$router.push({
                                                    path: '/mine'
                                                });
                                            }
                                        });
                                    }
                                }).catch((err) => {

                                });


                            }
                        } else {
                            $('#app').animate({
                                scrollTop: $('.recruitment-agent').outerHeight() - $('#app').height()
                            });
                            Toast({
                                message: '请同意成为' + this.operationName + '协议',
                                position: 'middle'
                            })
                        }
                    }
                })
            },
            jiancha() {
                axios({
                    url: this.Api + 'merchant/isMerchant?userId=' + this.userId,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                    console.log(res, '5')
                    if (res.data.code == 501) {
                        MessageBox({
                            title: '温馨提示',
                            message: res.data.msg,
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            closeOnClickModal: false
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push('/toBecomeMember/' + this.code + '/1/' + this
                                    .cardType)
                            } else {

                                this.$router.push('/mine')
                            }

                        });
                    } else if (res.data.code == 502) {
                        MessageBox({
                            title: '温馨提示',
                            message: res.data.msg,

                            confirmButtonText: '确定'
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push('/')
                            }
                        });
                    } else if (res.data.code == 503) {
                        MessageBox({
                            title: '温馨提示',
                            message: res.data.msg,
                            showCancelButton: true,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            closeOnClickModal: false
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push({
                                    path: '/upgrading/',
                                    query: {
                                        card: this.code
                                    }
                                })
                            } else {
                                this.$router.push('/mine')
                            }

                        });
                    }

                });


            },
            getLive() {
                let level = this.$route.params.level;
                if (level == 2) {
                    this.topnav.title = "运营商说明"
                    this.operationName = "运营商"
                }
                this.invite.forEach(post => {
                    if (level == post.level) {
                        this.content = post;
                        return false;
                    }
                })
                // this.content = this.invite[level]
            },

            contractLink() {
                let that = this
                let isPartner = that.$cookie.get('isPartner')
                if (isPartner == null) {
                    isPartner = 0
                }
                this.invite.forEach(post => {

                    if (post.level == 5) {
                        post.link = require("@/assets/images/contract/province.png")
                    } else if (post.level == 4) {
                        post.link = require("@/assets/images/contract/city.png")
                    } else if (post.level == 3) {
                        post.link = require("@/assets/images/contract/county.png")
                    } else {
                        post.link = require("@/assets/images/contract/jingxiaoshang.png")
                    }
                })
            }
        },
        created() {
            this.getLive();
            this.contractLink();

            axios.post(this.Api + '/user/queryByCardNo?cardNo=' + this.$route.params.code).then(res => {
                let data = res.data;
                this.inviterIsPartner = res.data.isPartner;
            })
        },
        mounted() {
            if (this.level == undefined) {
                this.level = ''
            }
            if (this.code == undefined) {
                this.code = ''
            }
            this.jiancha();
        }
    };

</script>

<style scoped>
    .recruitment-agent {
        padding-bottom: 3rem;
        background: #ffffff;
    }

    .pay-btn-box {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 0.5rem 0;
        text-align: center;
        background: white;
        border-top: 1px solid #e9e9e9;
        z-index: 999;
    }

    .pay-btn {
        display: inline-block;
        width: 9.375rem;
        height: 1.666667rem;
        border-radius: .833333rem;
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

</style>
