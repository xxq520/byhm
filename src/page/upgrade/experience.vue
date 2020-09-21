<template>
    <div class="order">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">

                <div class="order-box">
                    <div class="info">
                        <p>开通立享爱之家代理商专属特权</p>
                        <div class="img_box">
                            <img :src="image2" alt="">
                        </div>
                    </div>
                    <div class="fix_box">
                        <p>{{shenFen}}服务费用：<span class="red">￥{{price?(price/100).toFixed(2):0}}</span></p>
                        <p class="payFor" @click="goToCash">立即开通</p>
                    </div>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '一分体验用户',
                },
                selected: '1',
                userid: this.$cookie.get('userid'),
                operator: true,
                year: false,
                allPrice: '',
                operatorPrice: '',
                yearPrice: '',
                level: this.$route.params.level,
                code: this.$route.params.code,
                shenFenText: '',
                image2: '',
                price: '',
                shenFen: '升级超级会员',
                levelid2: '',
                initlevel: this.$cookie.get('level_id'),
                isActive2: '',
                cardType: this.$route.params.cardType,

            };
        },

        mounted() {

            axios({
                url: this.Api + 'agency/rightsInfo?type=2',
                method: "get",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                },
            }).then(res => {
                this.image2 = res.data.data
            });
            axios({
                url: this.Api + '/goods/getPrice?userId=' + this.userid + '&cardType=' + this.cardType,
                method: "get",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                },
            }).then(res => {

                console.log(res, '555')
                this.price = res.data.data;
            });
            this.panduan();
        },
        methods: {
            goback() {
                this.$router.push({
                    path: '/mine'
                })
            },
            //判断有无推荐人 无推荐人加上
            panduan() {
                let params = {
                    cardNo: this.code,
                    cardType: this.cardType,
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

                    if (res.data.code == 0) {


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


                            } else {
                                this.$router.push({
                                    path: '/mine'
                                });
                            }
                        });

                    } else if (res.data.code == 302) {
                        MessageBox({
                            title: "温馨提示",
                            message: res.data.msg,
                            showCancelButton: true,
                            showConfirmButton: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消"
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push("/selectionCard")

                            } else {
                                this.$router.push({
                                    path: '/mine'
                                });
                            }
                        });
                    } else {
                        Toast(res.data.msg)
                        setTimeout(() => {
                            this.$router.push("/mine")
                        }, 1500);
                    }
                })
            },

            goToCash() {

                this.$router.push({
                    path: "/cashRegister",
                    query: {
                        cardType: this.cardType,
                        level: 1,
                        code: this.code
                    }
                });
            }
        }

    };

</script>

<style scoped>
    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .order-box .info p {
        margin-top: 0.6rem;
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
        padding: .6rem
            /* 30/45 */
            0.5rem
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

    .fix_box p {
        font-size: 0.56rem;
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

</style>
