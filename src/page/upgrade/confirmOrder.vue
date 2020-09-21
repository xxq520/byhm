<template>
    <div class="order">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>

        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">

                <div class="order-box">
                    <div class="info">
                        <p>开通正式运营商身份立享专属特权</p>
                        <div class="img_box">
                            <img src="@/assets/images/yys.png" alt="">
                        </div>
                    </div>
                    <div class="fix_box">
                        <p>{{shenFenText}}服务费用：<span class="red">¥:{{ toMoney(allPrice) }}</span></p>
                        <p class="payFor" @click="goToCash">立即开通</p>
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">

                <div class="order-box">
                    <div class="info">
                        <p>开通正式超级会员身份立享专属特权</p>
                        <div class="img_box">
                            <img src="@/assets/images/yys.png" alt="">
                        </div>
                    </div>
                    <div class="fix_box">
                        <p>超级会员（惠盟用户）服务费用：<span class="red">{{ yearPrice?yearPrice:0 }}</span></p>
                        <p class="payFor" @click="goToCash">立即开通</p>
                    </div>
                </div>
            </mt-tab-container-item>

        </mt-tab-container>

    </div>
</template>

<script>
    export default {
        name: "confirmOrder",
        data() {
            return {

                topnav: {
                    title: '确认订单',
                },
                selected: '1',
                userid: this.$cookie.get('userid'),
                operator: true,
                year: false,
                allPrice: '',
                operatorPrice: '',
                yearPrice: '',
                level: this.$route.query.level,
                code: this.$route.query.code,
                shenFenText: ''
            };
        },
        mounted() {
            // this.level = this.selected == '1' ? this.$route.query.level : 1;
            // console.log(this.level,this.code,'5')
            let param = {
                userId: this.userid,
                levelId: this.level
            }
            axios({
                method: "get",
                url: this.Api + "goods/getAgencyPrice",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                },
                params: param
            }).then(res => {
                console.log(res, '34')
                this.allPrice = res.data.data;

            })




        },
        methods: {
            toMoney(val) {
                let money = (val / 100).toFixed(2)
                return money
            },
            operatorTab() {
                this.operator = true;
                this.year = false;
                this.level = this.$route.query.level;
            },
            yearTab() {

                this.year = true;
                this.operator = false;
                this.level = 1;
            },
            // 初始化数据
            initData() {
                let that = this
                let level = that.$route.query.level
                console.log(level)
                switch (level) {
                    case '2':

                        that.shenFenText = '运营商'
                        break
                    case '3':

                        that.shenFenText = '县运营商'
                        break
                    case '4':

                        that.shenFenText = '市运营商'
                        break
                    case '5':
                        that.allPrice = '¥50365'
                        that.shenFenText = '省运营商'
                        break
                }
            },
            //跳转到收银台
            goToCash() {
                let that = this

                this.$router.push({
                    name: 'cashRegisterss',
                    query: {
                        code: this.code,
                        level: this.level,
                        cardType:1
                    }
                })


                // axios({
                //     method: 'post',
                //     url: that.Api + 'order/accountSubmits?userId=' + that.userid + '&levelId=' + this.level,
                // }).then(resData => {
                //     console.log(resData)
                //     if (resData.data.errno == 0) {
                //         let orderData = resData.data.data.orderVoList
                //         if (that.operator) {
                //             that.$router.push({
                //                 name: "seperateCashRegister",
                //                 query: {
                //                     money: resData.data.data.totalPayment,
                //                     name: orderData[0].remark,
                //                     code: resData.data.data.totalOrderSn
                //                 }
                //             });
                //         }
                //         if (that.year) {
                //             console.log(orderData);
                //             that.$router.push({
                //                 name: "cashRegister",
                //                 query: {
                //                     money: orderData[0].order_price,
                //                     name: orderData[0].remark,
                //                     code: orderData[0].order_sn
                //                 }
                //             });
                //         }

                //     } else {

                //         Toast(resData.data.errmsg)

                //     }
                // })
            }
        },
        created() {
            this.initData();
        }
    };

</script>

<style scoped>
    .order {
        background: #f5f5f5;
        min-height: 100vh;
        overflow: hidden;
    }

    .order>>>.mint-navbar .mint-tab-item.is-selected {
        color: #fd7b02;
        border-bottom: .0625rem solid #fd7b02;
    }

    .order .order-tab {
        width: 50%;
        padding: 0 1.666667rem;
    }

    .order>>>.mint-navbar .mint-tab-item-label {
        font-size: .666667rem;
    }

    .order-box {
        background-color: #f5f5f5;
    }

    .order-box .info {
        margin: .4444rem
            /* 20/45 */
            0 2.6222rem
            /* 118/45 */
        ;
        background-color: #ffffff;

    }

    .order-box .info p {
        padding: 0 .4444rem
            /* 20/45 */
        ;
        height: 1.6rem
            /* 72/45 */
        ;
        line-height: 1.6rem
            /* 72/45 */
        ;
        font-size: .5778rem
            /* 26/45 */
        ;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
    }

    .order-box .img_box {
        padding: .6667rem
            /* 30/45 */
            1.3333rem
            /* 60/45 */
        ;
    }

    .order-box .fix_box {
        background-color: #ffffff;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 2.1778rem
            /* 98/45 */
        ;
        line-height: 2.1778rem
            /* 98/45 */
        ;
        width: 100%;
        border-top: 1px solid #eeeeee;
        padding: 0 .4444rem
            /* 20/45 */
        ;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .order-box .fix_box p {
        font-size: .5778rem
            /* 26/45 */
        ;
        color: #666666;
    }

    .order-box .fix_box p .red {
        color: #fc4d00;
    }

    .order-box .fix_box .payFor {
        width: 3.1111rem
            /* 140/45 */
        ;
        height: .9778rem
            /* 44/45 */
        ;
        line-height: .9778rem
            /* 44/45 */
        ;
        text-align: center;
        color: #fffefe;
        background-color: #ff6e04;
        border-radius: .4889rem
            /* 22/45 */
        ;
        font-size: .5333rem
            /* 24/45 */
        ;

    }

    .order-box .card {
        padding: .541667rem 1.333333rem .625rem 1.333333rem;
    }

    .price-box {
        padding: .416667rem .833333rem;
        background-color: #ffffff;
        font-size: .666667rem;
        color: #8f8f8f;
    }

    .price-box .all-price {
        display: flex;
        justify-content: space-between;
        margin-bottom: .166667rem;
    }

    .price-box .all-price .red {
        color: #ec0746;
    }

    .dan-price {
        margin-bottom: .166667rem;
    }

    .privilege-box {
        padding: .416667rem;
        background-color: #ffffff;
        margin-top: .625rem;
        text-align: center;
        color: #666666;
        font-size: .666667rem;
    }

    .privilege-box .title {
        margin-bottom: .625rem;
        margin-top: .208333rem
    }

    .privilege-box .privilege-list {
        display: flex;
        flex-wrap: wrap;
    }

    .privilege-box .privilege-list .privilege {
        width: 33.33%
    }

    .privilege .pic {
        height: 1.666667rem;
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
    }

    .privilege .pic .hui {
        width: 1.25rem;
        height: 1rem;
    }

    .privilege .pic .di {
        width: 1.166667rem;
        height: .958333rem;
    }

    .privilege .pic .de {
        width: 1.25rem;
        height: 1.25rem;
    }

    .privilege div {
        font-size: .583333rem;
    }

    .next-box {
        text-align: center;
        margin-top: 1.25rem;
    }

    .next-btn {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin: 0 auto;
        width: 9.375rem;
        padding: 0.5rem 0;
        border-radius: 20rem;
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
        color: #ffffff;
        font-size: 15px;
        line-height: 1.4em;
        letter-spacing: 2px;
    }

</style>
