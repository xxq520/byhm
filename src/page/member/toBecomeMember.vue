<template>
    <div class="become-member">
        <!-- 头部 -->
        <div class="head">
            <mt-header :title="title">
                <router-link to="/" slot="left">
                    <mt-button icon="back"></mt-button>
                </router-link>
                <mt-button class="head-btn mr_6" v-if="showxuka!=1" slot="right" @click="goToBuyCard">续卡</mt-button>
                <mt-button class="head-btn" slot="right" @click="goToCardRecord">订单</mt-button>
            </mt-header>
        </div>
 
        <div class="card_box" v-if="(isActive == 0 && isFake == 0)||(isFake == 1&&code!=0)">
            <P>开通身份立享专属特权</P>
            <div class="img_box">
                <img :src="images1" alt="">
            </div>
        </div>

        <!-- 用户卡 -->
        <template v-else>
            <card :carvist.sync="carvist" :cart.sync="postData"  ></card>
            <div class="between-flex">
           
                <div>消费券：{{yuprice==null?0:yuprice}}元</div>
                <button class="search-btn" @click="goAzj">详情</button>
            </div>
            <record-number :text.sync="ewmtext" @visibleChange="visibleChange" @change="recordChange"></record-number>
        </template>
        <!-- 二维码 -->
        <div class="fix_box" v-if="(isActive == 0 && isFake == 0)||(isFake == 1&&code!=0)">
            <p>{{shenFen}}服务费用：<span class="red">￥{{ (price.money/100).toFixed(2) }}</span></p>
            <p class="payFor" @click="goToCash">立即开通</p>
        </div>
        <bottomnav v-else :carcount="carcount" :cart.sync="postData"></bottomnav>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                carcount: "用户福利",
                title: '惠盟用户福利',
                userid: this.$cookie.get('userid'),
                seq: this.$cookie.get('seq'),
                cardNo: this.$cookie.get('card'),
                price: {},
                carvist: false,
                postData: {},
                popupVisible: false, //出示二维码弹窗
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                subClick: false,
                rightVisible: false,
                payChannel: '',
                amount: '',
                ewmtext: '',
                isFake: this.$cookie.get('isFake'),
                cardType: this.$cookie.get('cardType'),
                level: this.$cookie.get('level_id'),
                cardType2: this.$route.params.cardType,
                levelId: this.$route.params.level,
                code: this.$route.params.code,
                showxuka: false,
                renewa: true,

                price: {
                    money: '',
                    name: '百业惠盟优惠一卡通一年服务费'
                },
                pricedata: {},
                shenFen: '超级会员',
                images1: '',
                yuprice: 0,

            };
        },

        mounted() {


            let cardType4 = this.cardType2 == undefined ? this.cardType : this.cardType2;
            let isActive = this.$cookie.get('isActive');
            if (this.code != '0' && this.code) {
                this.panduan();
            }

            if (this.cardType2 == 4) {
                this.shenFen = "惠盟用户"
            }
            let that = this;
            // 获取价格
            axios({
                url: this.Api + '/goods/getPrice?userId=' + this.userid + '&cardType=' + cardType4,
                method: "get",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                },
            }).then(res => {

                this.price.money = res.data.data;
                this.pricedata = this.price;
                console.log(this.price.money, '555')
            });


        },

        methods: {
            //判断推荐人是否正确
            panduan() {

                let level2 = this.levelId == undefined ? 1 : this.level;
                let cardType4 = this.cardType2 == undefined ? this.cardType : this.cardType2;

                axios({
                    url: this.Api + 'goods/getUpgradePrice?userId=' + this.userid + '&cardType=' + cardType4 +
                        '&levelId=' + level2,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                    console.log(res, '6')
                    if (res.data.code == 0) {
                        this.post = res.data.data;
                        let post1 = res.data.data;
                        let params = {
                            cardNo: !parseInt(this.code) ? post.inviterCardNo : this.code,
                            cardType: cardType4,
                            id: this.userid
                        }
                        axios({
                            url: this.Api + "user/updateVipInfo",
                            method: "post",
                            data: params,
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token"),
                            }
                        }).then(res => {
                            // console.log(res, '8')
                            if (res.data.code == 0) {

                                let cardType4 = this.cardType2 == undefined ? this.cardType : this
                                    .cardType2;
                                let isActive = this.$cookie.get('isActive');
                                if (this.isActive == 1 && this.cardType == 4 && this.level == 1 &&
                                    this.levelId == 1) {
                                    this.$router.push({
                                        path: '/upgrading'
                                    })
                                }
                                if (this.isActive == 1 && this.cardType == 11 && this.level == 1 &&
                                    this.levelId == 1) {
                                    this.$router.push({
                                        path: '/tyupgrading',
                                        query: {
                                            cardType: this.cardType2
                                        }
                                    })
                                }
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
                                        axios({
                                            url: this.Api +
                                                "user/modifyUserInviter?superCardNo=" +
                                                this.$route.params.code,
                                            method: "post",

                                            headers: {
                                                "X-Nideshop-Token": this.$cookie.get(
                                                    "token"),
                                            }
                                        }).then(res => {
                                            console.log(res, '44')

                                        });



                                        let cardType4 = this.cardType2 == undefined ? this
                                            .cardType : this.cardType2;
                                        let isActive = this.$cookie.get('isActive');
                                        if (this.isActive == 1 && this.cardType == 11 && this
                                            .level == 1 &&
                                            this.levelId == 1) {
                                            this.$router.push({
                                                path: '/tyupgrading',
                                                query: {
                                                    cardType: this.cardType2
                                                }
                                            })
                                        }
                                    } else {
                                        this.$router.push({
                                            path: '/mine'
                                        });
                                    }
                                });
                            } else {
                                MessageBox({
                                    title: '温馨提示',
                                    message: res.data.msg,
                                }).then(action => {
                                    if (action === 'confirm') {
                                        this.$router.push({
                                            path: '/mine'
                                        })
                                    }
                                });
                            }

                        })
                    }
                });

            },
            goToCardRecord() {
                this.$router.push({
                    name: "buyCardRecord",
                    params: {}
                });
            },
            goToBuyCard() {
                this.$router.push({
                    name: "selectionCard"
                });
            },
            goAzj() {
                this.$router.push({
                    path: "/azjDetails"
                });
            },
            pricefn(val) {
                this.price = val;
            },
            //跳转到收银台
            goToCash() {


                let that = this;
                this.subClick = true;
                setTimeout(function () {
                    console.log(that.cardType2, that.level, that.code, '8')
                    that.subClick = false;
                    that.$router.push({
                        path: "/cashRegister",
                        query: {
                            cardType: that.cardType2,
                            level: 1,
                            code: that.code
                        }
                    });
                }, 1000);


            },
            //时间格式
            getdate(date) {
                let d = new Date(date);
                let yy = d.getFullYear();
                let mm = d.getMonth() + 1;
                if (mm < 10) {
                    mm = '0' + mm
                }
                let dd = d.getDate();
                if (dd < 10) {
                    dd = '0' + dd
                }
                //let hh = d.getHours();
                //let mu = d.getMinutes();
                //let ss = d.getSeconds();
                //return yy+'-'+mm+'-'+dd+' '+hh+':'+mu+':'+ss;
                return yy + '.' + mm + '.' + dd;
            },
            // 二维码
            showEWM() {
                this.rightVisible = true;
            },
            visibleChange(val) {
                this.rightVisible = false;
            },
            recordChange(val) {
                let params = this.$cookie.get('card');
                this.payChannel = val.payChannel;
                this.amount = val.amount;
                axios.post(this.Api + 'user/queryByCardNo?cardNo=' + params).then(res => {
                    let data = res.data;
                    if (data.realName == undefined || data.realName == null) {
                        data.realName == ""
                    }
                    this.ewmtext = this.Api + 'user/saveAndGetCardUsedLog?' +
                        'userId=' + this.userid +
                        '&cardNo=' + this.card +
                        '&payChannel=' + this.payChannel +
                        '&amount=' + this.amount +
                        '&username=' + data.realName;
                });

            },
            //获取基本信息
            getBasicInformation() {
                axios.post(this.Api + '/user/queryByCardNo?cardNo=' + this.cardNo).then(res => {
                    console.log(res)
                    this.isActive = res.data.isActive
                    this.isFake = res.data.isFake
                    this.$cookie.set('cardType', res.data.cardType);
                    this.$cookie.set('isFake', res.data.isFake);
                    this.$cookie.set('isActive', res.data.isActive);
                    this.getwelfare()
                    if (this.isFake == 1) {
                        this.title = '用户福利'
                    }
                    // console.log(this.isFake)
                })
            },
            //判断用户福利显示
            getwelfare() {
                if (this.isActive == 1) {
                    let vtime = this.$cookie.get('vip_time') && this.$cookie.get('vip_time') != null ? this.$cookie.get(
                        'vip_time') : 0;
                    let tdate = new Date().getTime();
                    console.log(vtime > tdate);
                    if (vtime > tdate) {
                        Indicator.open();
                        this.carvist = true;
                        axios({
                            url: this.Api + '/order/buyCardReport?userId=' + this.userid,
                            method: "get",
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get('token')
                            }
                        }).then(res => {
                            Indicator.close();
                            let data = res.data.data;
                            if (!data) return false;
                            this.postData = data;
                            // console.log(this.postData, '5')
                            this.showxuka = data.isEmplyee
                            this.postData.startTime = this.getdate(this.postData.startTime);
                            this.postData.endTime = this.getdate(this.postData.endTime);
                            this.postData.addTime = this.getdate(this.postData.addTime);

                        }).catch((err) => {
                            Indicator.close();

                        });
                    } else {
                        this.carvist = false;
                    }
                } else if (this.isActive == 0 && this.isFake == 1) {
                    let vtime = this.$cookie.get('vip_time') && this.$cookie.get('vip_time') != null ? this.$cookie.get(
                        'vip_time') : 0;
                    let tdate = new Date().getTime();

                    if (vtime > tdate) {
                        Indicator.open();
                        this.carvist = true;
                        axios({
                            url: this.Api + '/order/buyCardReport?userId=' + this.userid,
                            method: "get",
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get('token')
                            }
                        }).then(res => {

                            Indicator.close();
                            let data = res.data.data;
                            if (!data) return false;
                            this.postData = data;
                            console.log(this.postData, '6')
                            this.showxuka = data.isEmplyee
                            this.postData.startTime = this.getdate(this.postData.startTime);
                            this.postData.endTime = this.getdate(this.postData.endTime);
                            this.postData.addTime = this.getdate(this.postData.addTime);
                        }).catch((err) => {
                            Indicator.close();

                        });
                    } else {
                        this.carvist = false;
                    }
                } else {
                    this.carvist = false;
                }
            },

            consumption() {
                axios({
                    url: this.Api + 'order/couponDetails?userId=' + this.userid,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                       if(res.data.code==0){
                       this.yuprice = res.data.balance;
                       }
                })
            },
        },
        //消费卷详情

        created() {

            this.getBasicInformation();

            this.consumption();
            axios({
                url: this.Api + 'agency/rightsInfo?type=0',
                method: "get",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                },
            }).then(res => {
                this.images1 = res.data.data
            })

        }
    };

</script>

<style scoped>
    .search-btn {
        width: 50px;
        background: #ff6e04;
        border-radius: 1.3rem;
        border: none;
        color: #fff;
        height: 30px;
        line-height: 30px;
    }

    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        padding-bottom: 60px;
        overflow: hidden;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
    }

    .red {
        color: #f74a73;
    }

    .pay-btn-box {
        overflow: hidden;
        margin-top: 0.8rem;
        text-align: center;
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

    .between-flex {
        display: flex;
        justify-content: space-between;
        height: 1.8rem;
        align-items: center;
        font-size: .625rem;
        color: #666666;
        padding: 0 0.833333rem;
        background: #ffffff;
    }


    .go-back {
        width: 10px;
        position: absolute;
        left: 10px;
        top: 18px;
    }

    /* 二维码 */
    .sub {
        display: block;
        text-align: center;
        color: white;
        padding: 0.4rem 0;
        width: 60%;
        font-size: 0.7rem;
        line-height: 1.6em;
        background: #ff8f28;
        border-radius: 20rem;
        margin: 1rem auto;
    }

    .EWM {
        width: 10.9556rem;
        height: 13.1778rem;
        border-radius: 40px;
    }

    .EWM .close {
        width: 1.1556rem;
        height: 1.1556rem;
        border-radius: 50%;
        background: rgba(200, 200, 200, 1);
        position: fixed;
        right: -5px;
        top: -8px;
    }

    .EWM .ewmPng {
        width: 5.7778rem;
        height: 5.7778rem;
        position: fixed;
        top: 31%;
        right: 24%;
        padding: 5px;
        background: white;

    }

    .mappopup {
        width: 80%;
        height: 15rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
    }

    .head .head-btn>>>.mint-button-text {
        font-size: 12px;
        padding: 2px;
        border: 1px solid #ffac67;
        border-radius: 4px;
    }

    .head .mr_6 {
        margin-right: 6px;
    }

    .fix_box {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 0 .4444rem
            /* 20/45 */
        ;
        height: 2.1778rem
            /* 98/45 */
        ;
        line-height: 2.1778rem
            /* 98/45 */
        ;
        font-size: .6222rem
            /* 28/45 */
        ;
        color: #666666;
        justify-content: space-between;
        background-color: #ffffff;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
    }

    .fix_box .red {
        color: #ff6e04;
    }

    .fix_box .payFor {
        width: 3.1111rem
            /* 140/45 */
        ;
        height: .9778rem
            /* 44/45 */
        ;
        text-align: center;
        line-height: .9778rem
            /* 44/45 */
        ;
        border-radius: .4889rem
            /* 22/45 */
        ;
        color: #fffefe;
        background-color: #ff6e04;

    }

    .card_box {
        background-color: #ffffff;
    }

    .card_box p {
        height: 1.6rem
            /* 72/45 */
        ;
        line-height: 1.6rem
            /* 72/45 */
        ;
        padding: 0 .4444rem
            /* 20/45 */
        ;
        border-bottom: 1px solid #eeeeee;
        color: #666;
        font-size: .5778rem
            /* 26/45 */
        ;
    }

    .card_box .img_box {
        padding: .666rem
            /* 30/45 */
            0.5rem
            /* 60/45 */
        ;
    }

</style>
