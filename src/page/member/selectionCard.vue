<template>
    <div class="become-member">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <div class="cart">
            <div>
                <img src="@/assets/images/yhfl_img_card.png" />
            </div>
            <div class="card-name">{{cardName}}</div>

            <div class="card-content">
                <template>
                    <div class="card-num">NO:{{cardNo }}</div>
                </template>
            </div>
        </div>
        <!-- 选择续卡 -->
        <div class="main-box">
            <div class="select-card">
                <div class="select" :class="{'active': selectIndex == index}" v-for="(item,index) in cardList"
                    :key="index" @click="selectCardFn(index,item.cardType)">
                    <div class="card-title">{{item.card_name}}</div>
                    <div class="card-price">{{item.order_price}}</div>
                </div>
            </div>

            <div class="buy-tip">
                <div>购买须知:</div>
                <p>*购买99元爱之家商城消费券，则赠送百业惠盟VIP身份一年，并赠送300元爱之家商城消费券，升级为超级会员可以再获得900元爱之家商城消费券。</p>
                <p>*购买365元爱之家商城消费券，直接成为百业惠盟超级会员，即可赠与惠盟VIP身份一年，并获得1200元爱之家商城消费券。</p>
                <p>*惠盟VIP在惠盟商家店铺结算时，搜索找到该惠盟商家店铺，选择享受优惠的项目，进入后直接输入消费金额，若商家有满减免或者折扣的，会自动换算出优惠后的实付金额，直接提交后线下另外支付给商家实付金额就可以了。（这里优惠后的实付金额不作为支付用途，只用于惠盟VIP享受惠盟商家抵扣券的数额，把优惠后的数额告知惠盟VIP和商家的一种方式，实际还需线下支付优惠后实付金额给商家）。
                </p>
                <p>*成为惠盟VIP或超级会员后，消费券会自动送达爱之家商城，惠盟VIP只需要下载爱之家商城APP，登录即可购买到爱之家商城带来货真价惠的商品，并可以在爱之家商城百业专区享受优惠折扣，并且可以到有百业商家的门店，消费直接抵扣商家带来的现金优惠或者其他优惠政策。</p>
                <p>*百业惠盟一卡通仅限于本人使用，不可转让或者给他人使用；</p>
                <p>*消费券只能在爱之家商城百业惠盟专场购买商品使用，惠盟VIP和超级会员可以抵扣支付额的10%，运营商以上角色只能抵扣支付额的5%，惠盟商家根据自己优惠政策抵扣相对应的优惠券额度。</p>
                <p>*消费券一旦使用，退款不会返还；</p>
                <p>*消费券不可提现；</p>
                <p>*最终解析权归广州华磐网络科技公司所有；</p>

            </div>
        </div>
        <!-- <template>
      <div class="pay-btn-box">
        <div v-if="!subClick" class="pay-btn" @click="goToCash">立即购买</div>
        <div v-else class="pay-btn" style="background:#999;">确定支付</div>
      </div>
    </template> -->
        <div class="pay-btn-box">
            <div v-if="!subClick" class="pay-btn" @click="goToCash">立即购买</div>
            <div v-else class="pay-btn" style="background:#999;">确定支付</div>
        </div>

    </div>
</template>

<script>
    export default {
        name: "selectionCard",
        data() {
            return {
                topnav: {
                    title: '续卡',
                },
                userid: this.$cookie.get('userid'),
                seq: this.$cookie.get('seq'),
                cardNo: this.$cookie.get('card'),
                cardName: '优惠一卡通(年卡)',
                cardList: [],
                selectIndex: 0,
                cardType: 1,
                orderPrice: 36500,
                priceName: '百业惠盟优惠一卡通一年卡服务费',
                levelId: this.$cookie.get('level_id'),
                subClick: false,
            };
        },
        mounted() {

        },
        methods: {
            //跳转到收银台
            goToCash() {
                let that = this;
                that.subClick = true;
                Indicator.open();
                //运营商续卡
                if (that.levelId > 1 && that.cardType == 4) {
                    MessageBox({
                        title: '温馨提示',
                        message: '尊敬的运营商，您若继续享有运营商的权利请购买年卡，如果坚持购买季卡的话，您的运营商身份将会失效，不再享有运营商权益，只保留惠盟用户权利，是否确定继续购买季卡呢？',
                        showCancelButton: true,
                        confirmButtonText: '购买年卡',
                        cancelButtonText: '购买季卡',
                        closeOnClickModal: false
                    }).then(action => {
                        if (action === 'confirm') {
                            that.cardType = 1
                            that.priceName = '百业惠盟优惠一卡通一年卡服务费'

                            this.submitFn();
                            this.getOrderPrice();
                        } else {
                            this.submitFn()
                        }
                    });
                    return false
                }
                this.submitFn()

            },
            //获取续卡信息
            getCardInformation() {
                let that = this
                axios({
                    method: 'get',
                    url: that.Api + 'order/getRenewalCard?userId=' + that.userid,
                }).then(res => {
                    console.log(res)
                    if (res.data.errno == 0) {
                        that.cardList = res.data.data.renewalCardList
                    } else {
                        Toast(res.data.errmsg)
                    }
                })
            },
            //选择卡类型
            selectCardFn(val, cardType) {
                let that = this
                that.selectIndex = val
                that.cardType = cardType
                console.log(that.cardType)
                if (that.cardType == 1) {
                    that.cardName = "优惠一卡通(年卡)"
                    that.priceName = "百业惠盟优惠一卡通一年卡服务费"
                }
            },
            //获取价格订单价格
            getOrderPrice() {
                // let that = this
                // axios({
                //   url: that.Api + '/goods/getPrice?userId=' + that.userid +'&cardType=' + that.cardType,
                //   method:"get",
                //   headers:{
                //     "X-Nideshop-Token": this.$cookie.get('token')
                //   },
                // }).then(res => {
                //   console.log(res)
                //   if(res.data.errno == 0) {
                //     that.orderPrice = res.data.data
                //   }else {
                //     Toast(res.data.errmsg)
                //   }
                // })
            },
            //提交请求函数
            submitFn() {
                let that = this
                let timeLate = setTimeout(() => {
                    that.subClick = false;
                    that.$router.push({
                        path: "/cashRegister",
                        query: {
                            cardType: -1,
                            level: 1,
                            code: 0,
                            xuka: 'xuka'
                        }
                    });
                    clearTimeout(timeLate)
                }, 2000)


            }

        },
        created() {
            this.getOrderPrice()
            this.getCardInformation()
        }
    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        padding-bottom: 60px;
        overflow: hidden;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
    }

    .pay-btn-box {
        width: 100%;
        height: 2.5rem;
        line-height: 2.3rem;

        background-color: #efefef;
        position: fixed;
        bottom: 0;
        left: 0;
        overflow: hidden;
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

    .cart {
        position: relative;
        padding: 20px 1.458333rem;
        background: #f5f5f5;
    }

    .card-content {
        position: absolute;
        bottom: 20%;
        right: 1.458333rem;
        padding: 0 10px;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .card-num {
        color: #FFFBC7;
    }

    .card-price {
        color: #FFFBC7;

    }

    .card-name {
        position: absolute;
        font-size: .666667rem;
        font-weight: bold;
        left: 2.291667rem;
        top: 15%;
    }

    .main-box {
        padding: .625rem 0;
        background-color: #ffffff;
    }

    .select-card {
        padding: 0 .833333rem;
        display: flex;
        width: calc(100% + .416667rem)
    }

    .select-card .select {
        flex: 1;
        height: 3.125rem;
        border: 1px solid #ffcc99;
        border-radius: .166667rem;
        text-align: center;
        margin-right: .416667rem;
    }

    .select-card .select .card-title {
        font-size: .583333rem;
        color: #666666;
        margin: .583333rem 0 .208333rem 0;
    }

    .select-card .select .card-price {
        font-size: .75rem;
        color: #333333;
    }

    .select-card .active {
        background-color: #ffcc99;
    }

    .select-card .active .card-title {
        color: #ec0746;
    }

    .select-card .active .card-price {
        color: #ec0746;
    }

    .buy-tip {
        padding: 0 .833333rem;
        margin-bottom: 1.5333rem；
    }

    .buy-tip {
        margin-top: .625rem;
        font-size: 12px;
        color: #666666;
        line-height: .833333rem;
    }

</style>
