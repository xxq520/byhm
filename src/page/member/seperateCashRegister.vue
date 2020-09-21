<template>
    <div class="buy-card-record">
        <!-- 头部 -->
        <div class="head">
            <topnav :topnav="topnav"></topnav>
        </div>

        <div class="money">
            <div>收款金额</div>
            <div class="price">¥ {{ money?money/100:'' }}</div>
        </div>
        <div class="flex-box mb-10">
            <div>商品名称</div>
            <div class="l-s-1">{{ name }}</div>
        </div>
        <div class="flex-box mb-10">
            <div>订单编号</div>
            <div>{{ code }}</div>
        </div>
        <div class="flex-box mb-10">
            <div>收款方</div>
            <div>付款给百业惠盟</div>
        </div>
        <!--<div class="flex-box mb-10">
      <div>卡号<input type="number" id="card-input" placeholder="请输入卡号"></div>
      <div><img class="i-icon" src="@/assets/images/ghh.png"/></div>
    </div>
    <div class="use-card">
      <a>可用银行卡与限额</a>
    </div>-->
        <div class="tip-box">
            <div class="title">温馨提示：您的订单已经生成;</div>
            <!-- <div class="tip">订单金额过大时，为了避免银联支付限额支付失败，建议选择分单支付；</div>
      <div class="tip">选择分单支付系统根据总订单单额自动拆分为5000元每笔订单；</div> -->
            <!-- <div class="tip">您的订单已经生成;</div> -->
        </div>
        <div class="pay-box">
            <div class="pay-way">支付方式</div>
            <div class="between-flex" v-if="$store.state.weixin4">
                <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/weixin.png" />微信支付</div>
                <div>
                    <div class="select-pay" :class="{'quan':checked=='0'}" @click="checkedfn(0)" ref="weixin"
                        id="weixin">
                        <i class="el-icon-check select"></i>
                    </div>
                </div>
            </div>
            <!-- <div class="between-flex" v-if="$store.state.weixinshow">
                <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/weixin.png" />高汇通</div>
                <div>
                    <div class="select-pay" :class="{'quan':checked=='3'}" @click="checkedfn(3)" ref="weixin"
                        id="weixin">
                        <i class="el-icon-check select"></i>
                    </div>
                </div>
            </div> -->
            <div class="between-flex">
                <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/blank.png" />银联支付</div>
                <div>
                    <div class="select-pay" :class="{'quan':checked=='2'}" @click="checkedfn(2)" ref="weixin"
                        id="weixin">
                        <i class="el-icon-check select"></i>
                    </div>
                </div>
            </div>

        </div>
        <div class="next-box">
            <!-- <div v-if="!subClick" class="next-btn" @click="priceCheck">确定支付</div>
      <div v-else class="next-btn" style="background:#999;">
        <mt-spinner type="fading-circle" color="#fff" :size="15"></mt-spinner>确定支付
      </div> -->
            <div class="seperate-btn" @click="goToOrder">去支付</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "cashRegister",
        data() {
            return {
                topnav: {
                    title: '收银台',
                },
                money: '',
                name: '',
                code: '',
                seq: this.$cookie.get('seq'),
                subClick: false,
                way: '', //支付方式 0-微信 2-银联
                checked: '',
                weixinshow:false
            };
        },
        beforeRouteLeave(to, from, next) {
          if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {

          } else {
          this.$store.commit('gb4')
          }
        next();
        },
        mounted() {
          
        },
        methods: {
            goBack() {
                this.$router.go(-1);
            },
            getPrice() {
                this.money = this.$route.query.money;
                this.name = this.$route.query.name;
                this.code = this.$route.query.code;
            },

            checkedfn(val) {
                console.log(val);
                this.checked = val == this.checked ? '' : val;
                this.way = val;
                console.log(this.way);
            },

            //分单支付
            goToOrder() {

                let param = {
                    order_sn: this.code,
                    paymentMethod: this.way,

                }
                axios({
                    method: 'post',
                    url: this.Api + 'order/updatePayMethod',
                    data: param,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    console.log(res, '8')
                })

            
                this.$router.push({
                    name: 'myOrder'
                })
            }
        },
        created() {
            this.getPrice();
            this.checkedfn(2);
        }
    };

</script>

<style scoped>
    /* >>>可以修改某一个标签里面的其他组件样式 */
    .pay-way {
        background: #f2f2f2;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        color: #333333;
        font-size: .625rem;
        letter-spacing: 3px;
        font-weight: bold;
    }

    .between-flex {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        font-size: .625rem;
        color: #666666;
        padding: 0 0.833333rem;
        background: #ffffff;
        margin-bottom: 1px;
    }

    .flex-pic {
        display: flex;
        align-items: center;
    }

    .weixin-pic {
        width: 1.333333rem;
        margin-right: .791667rem;
    }

    .select-pay i {
        display: none;
    }

    .select-pay {
        width: .833333rem;
        height: .833333rem;
        border-radius: 50%;
        font-weight: bold;
        border: 1px solid #a5a5a5;
    }

    .buy-card-record {
        height: 100vh;
        background: #f5f5f5;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
    }

    .money {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .625rem;
    }

    .price {
        font-size: 1.083333rem;
        color: #ec0746;
        margin-left: 14px;
    }

    .flex-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #ffffff;
        padding: 0 1.25rem;
    }

    .flex-box div:first-child {
        font-size: .625rem;
        color: #333333;
        font-weight: bold;
    }

    .flex-box div:last-child {
        font-size: .541667rem;
        color: #666666;
    }

    .mb-10 {
        margin-bottom: 10px;
    }

    .l-s-1 {
        letter-spacing: 1px;
    }

    #card-input {
        height: 40px;
        padding-left: 30px;
        font-size: 12px;
        width: 10.416667rem;
    }

    .use-card {
        text-align: right;
        font-size: 12px;
        color: #194dd1;
        padding-right: 1.25rem;
    }

    .use-card a {
        border-bottom: 1px solid #194dd1;
    }

    .next-box {
        margin-top: 1.666667rem;
        /* display: flex;
  justify-content: space-between; */
        text-align: center;
        padding: 0 1.583333rem;
    }

    .next-btn {

        width: 5.833333rem;
        height: 1.458333rem;
        line-height: 1.458333rem;
        border-radius: 10rem;
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
        font-size: .666667rem;
        letter-spacing: 2px;
    }

    .go-back {
        width: 10px;
        position: absolute;
        left: 10px;
        top: 18px;
    }

    .i-icon {
        width: .291667rem;
        height: .666667rem;
    }

    .next-btn span {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .next-btn>>>.mint-spinner-fading-circle {
        display: inline-block;
        margin-right: 5px;
        padding-top: 0.2em;
    }

    .tip-box {
        color: #666666;
        font-size: 12px;
        padding: 0 1.25rem;
    }

    .tip-box .title {
        margin-bottom: .291667rem;
    }

    .tip-box .tip {
        line-height: .916667rem;
    }

    .seperate-btn {
        width: 5.833333rem;
        height: 1.458333rem;
        line-height: 1.458333rem;
        background-color: #f0073b;
        color: #ffffff;
        border-radius: 10rem;
        font-size: .666667rem;
        letter-spacing: 2px;
        text-align: center;
        margin: 0 auto;
    }

    .select {
        color: #F52052;
        font-size: .916667rem;
    }

    .quan {
        border-color: #F52052;
        background: #F52052;
    }

    .quan i {
        display: inline-block;
        font-size: .7rem;
        color: white;
        line-height: .75rem;
    }

</style>
