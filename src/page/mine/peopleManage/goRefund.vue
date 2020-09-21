<template>
    <div class="become-member">
        <topnav :topnav="topnav"></topnav>

        <div class="mainbox">

            <div class="merinfo">
                <div class="sname">退款信息</div>
                <div class="stext">
                    <div><span style="color: #999;">退款金额：</span>￥{{stuats}}</div>
                    <div><span style="color: #999;">退款方式：</span>￥{{yuyi}}</div>
                </div>
            </div>
            <div class="bootinfo">
                <div class="sname">退款原因</div>
                <div class="stext">
                    <mt-radio v-model="value" :options="['下错单了', '不想要了/计划有变', '收货地址错误','其他']">
                    </mt-radio>
                </div>
            </div>
            <div class="footer">
                <div class="tijiao" @click="refund">
                    提交
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '申请退款',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: this.$route.query.merchid,
                stuats: '',
                yuyi: '原路退回',
                value: '下错单了',
                orderSn: this.$route.query.orderSn,
            };
        },
        created() {

        },
        mounted() {
            this.getDetali();

        },
        methods: {
            getDetali() {
                let post = {
                    orderSn: this.orderSn
                };
                axios({
                    url: this.Api1 + '/order/get',
                    params: post,
                    method: "get",
                    headers: {
                           "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.stuats = res.data.data.orderPrice
                    }

                })
            },
        
            //申请退款
            refund() {
                let post = {
                    orderSn: this.orderSn,
                    afterSalesWhy: this.value
                };
                axios({
                    url: this.Api1 + '/order/afterSales',
                    data: post,
                    method: "post",
                    headers: {
                           "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('已申请退款，请等待商家审核')
                        setTimeout(() => {
                            this.$router.go(-1);
                        }, 1000);
                    } else {
                        Toast(res.data.message)
                    }
                })
            }

        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;

        overflow: hidden;

    }

    .mainbox {
        padding: 0.5rem;
        font-size: 0.62rem;
        color: #666;
    }



    .mainbox .merinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .sname {
        line-height: 1.6rem;
        position: relative;
        text-indent: 1em;
        color: #666;
    }

    .mainbox .sname::before {
        content: '';
        width: 2px;
        height: 14px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.52rem;

    }

    .mainbox .merinfo .stext {
        padding: 0.5rem 0.1rem;

        border-top: 1px solid #eee;
    }

    .mainbox .merinfo .foot {
        display: flex;
        align-items: center;
        line-height: 1.6rem;

    }

    .mainbox .merinfo .foot div {
        width: 50%;
        display: flex;
        align-items: center;

    }

    .mainbox .merinfo .foot img {
        width: 0.75rem;
        width: 0.75rem;
    }

    .mainbox .bootinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .bootinfo .stext {
        line-height: 1.4rem;
        border-top: 1px solid #eee;
    }

    .mainbox .bootinfo .stext>>>.mint-radio-input:checked+.mint-radio-core {

        background-color: #ff9d19;
        border-color: #ff9d19;
    }

    .mainbox .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1.5rem;
    }

    .mainbox .footer .tijiao {
        width: 60%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
    }

</style>
