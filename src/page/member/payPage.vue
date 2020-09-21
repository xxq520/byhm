<template>
    <div class="pay">
        <mt-header title="付款" ref="header" :fixed='true'>
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="payPrice">
            <p class="payTit">需要支付金额(元)</p>
            <p class="price"><i>￥</i>{{order.totalOrderPrice||'选择支付方式'}}</p>
        </div>
        <p class="payType">支付方式</p>
        <ul class="typeList">
            <li v-for="(item,index) in payType" @click="changePay(index)">
                <div>
                    <img :src="item.icon" class="icon" alt="">
                    <!-- 余额支付 -->
              
                    <span>{{item.text}}</span>
                </div>
                <img :src="item.checked ? checked[1] : checked[0]" class="checked" alt="">
            </li>
        </ul>
        <button class="payButton" v-preventReClick @click="payOrder">立即支付</button>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                checked: [
                    require("@/assets/images/bank/pf_payment_icon_checkbox_n.png"),
                    require("@/assets/images/bank/pf_payment_icon_checkbox_s.png"),
                ],
                // 支付的方式
                payType: [
                    {
                        icon: require("@/assets/images/bank/pf_payment_icon_WeChatPay.png"),
                        text: "微信支付",
                        type: 9,
                        checked: true
                    },
                    {
                        icon: require("@/assets/images/bank/pf_payment_icon_alipay.png"),
                        text: "支付宝支付",
                        type: 10,
                        checked: false
                    },
                    {
                        icon: 'https://pay.520shq.com/Content/images/unionpay_wap.jpg',
                        text: "银联快捷支付",
                        type: 11,
                        checked: false
                    },
                    
                ],
                // 当前用户信息 支付角色
                seq: "",
            
                // 订单数据
                order: {},
                // 使用余额
                moneyVal: ''
            }
        },
        created() {
            let order = {};
            let query = this.$route.query;
            // 支付单号
            if (query.totalOrderSn) {
                order.totalOrderSn = query.totalOrderSn;
                order.totalOrderPrice = query.totalOrderPrice;
                this.seq = query.seq;
                this.order = order;
                // 获取用户余额
                this.getUserdBalance();
            } else {
                Toast('缺少支付单号');
                // setTimeout(()=>{
                //     history.back();
                // },1000)
            }
        },
        mounted() {
            this.$refs.header.$el.style.background = "linear-gradient(-90deg,rgba(255,93,35,1),rgba(255,119,37,1))";
            this.$refs.header.$el.style.color = "#fff";
        },

        methods: {
      
      
            // 返回事件
            goBack() {
                try {
                    window.action.app_back();
                } catch (err) {
                    history.go(-1);
                }
            },
            // 点击切换支付方式
            changePay(index) {
                let payType = this.payType;
                if (index < this.payType.length - 1) {
                    for (let i = 0; i < payType.length - 1; i++) {
                        payType[i].checked = false;
                    }
                }
                payType[index].checked = !payType[index].checked;
                this.payType = payType;
                Indicator.open();
                setTimeout(() => {
                    Indicator.close();
                }, 300)
            },
            // 支付订单
            payOrder() {
                let payTypeH5 = "";
                let balance = this.payType[3].checked;
                let changePrice = () => {
                    let paytype = this.payType.filter(item => {
                        return item.checked;
                    });
                    payTypeH5 = paytype[0].type
                };
                // 判断是全余额支付
               
                var params = {
                    "fromDevice": "H5",
                    "payTypeH5": payTypeH5,
                    "totalOrderNo": this.order.totalOrderSn,
                    "returnUrl": `${location.origin}${location.pathname}#/block/paysuccess?orderNo=${this.order.totalOrderSn}`,
                    "useBalance": balance ? this.moneyVal : 0,
                    "userAgentType": userAgent() || "Android"
                };
                // 获取支付所需参数
                axios.post(this.blockURL + '/qypfs-order/api/pay/getPayInfo', params).then(res => {
                    if (res.data.code == 200) {
                        // 是否全余额支付
                        res.data.data.allUseBalance ? location.href = params.returnUrl : location.href = res.data.data.payBunch;
                    } else {
                        Toast({
                            message: res.data.message,
                        });
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .pay {
        width: 100vw;
        height: calc(100vh - 44px);
        background-color: #fff;
    }

    .payPrice {
        margin-top: 44px;
        background: #fff;
        height: 6.39rem;
        text-align: center;
        border-top: 1px solid transparent;
    }

    .payPrice .payTit {
        margin-top: 1.7rem;
        margin-bottom: 0.9rem;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .payPrice .price {
        font-size: 1.1rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
    }

    .payPrice .price i {
        font-size: 0.7rem;
    }

    .payType {
        height: 2.2rem;
        line-height: 2.2rem;
        font-size: 0.73rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        background: rgba(245, 245, 245, 1);
        padding-left: 0.45rem;
    }

    .typeList {
        padding: 0 0.5rem;
    }

    .typeList li {
        height: 2.27rem;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.64rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
    }

    .typeList li > div {
        display: flex;
        align-items: center;
    }

    .typeList li .icon {
        width: 1.14rem;
        height: 1.14rem;
        margin-right: 0.2rem;
    }

    .typeList li .checked {
        height: 0.82rem;
        width: 0.82rem;
    }

    .payButton {
        width: 80%;
        height: 1.91rem;
        background: linear-gradient(-90deg, rgba(255, 94, 35, 1), rgba(255, 119, 37, 1));
        border-radius: 1rem;
        font-size: 0.68rem;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        border: none;
        display: block;
        margin: 0 auto;
        margin-top: 5rem;
        outline: none;
    }

    .myMoney {
        display: flex;
        align-items: center;
    }

    .myMoney div:first-child span {
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
    }

    .myMoney div:last-child {
        margin-left: 0.4rem;
        padding: 0.25rem;
        border-radius: 0.2rem;
        font-size: 0.55rem;
        font-family: PingFang SC;
        font-weight: 500;
        align-items: center;
        background: rgba(255, 209, 192, 1);
        font-size: 0.55rem;
        color: rgba(255, 68, 0, 1);
        display: flex;
    }

    .myMoney div:last-child input {
        background: rgba(255, 209, 192, 1);
        color: rgba(255, 68, 0, 1);
        max-width: 2.8rem;
    }

    .myMoney div:last-child input::placeholder {
        background: rgba(255, 209, 192, 1);
        color: rgba(255, 68, 0, 1);
        max-width: 2.8rem;
    }
</style>
