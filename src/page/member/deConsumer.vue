<template>
    <div class="peopleManage">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <div class="mainBox">

            <ul class="list">
                <li>
                    <p class="boex">
                        <span class="left">订单号:</span>
                        <span class="right">{{list.orderSn}}</span>
                    </p>
                    <p>
                        <span class="left">消费金额:</span>
                        <span class="right"><span v-show="list.amount">￥</span> {{list.amount}}</span>
                    </p>
                    <p>
                        <span class="left">抵扣金额:</span>
                        <span class="right"> <span v-show="list.discounts">￥</span>{{list.discounts}}</span>
                    </p>
                    <p>
                        <span class="left">实付金额:</span>
                        <span class="right"><span v-show="list.actually">￥</span>{{list.actually}}</span>
                    </p>
                    <p>
                        <span class="left">买单时间:</span>
                        <span class="right">{{list.createTime}}</span>
                    </p>
                    <p>
                        <span class="left">支付方式:</span>
                        <span class="right">{{list.payChannel}}</span>
                    </p>
                </li>
            </ul>

        </div>
    </div>

</template>
<script>
    import azjlinks from '@/assets/js/AZJlinks'
    export default {
        data() {
            return {
                topnav: {
                    title: '订单详情',
                    back: true
                },
                isShowBox: false,
                level: this.$cookie.get('level_id'), //0 潜在用户、1 一级用户和 2二级用户
                userid: this.$cookie.get('userid'), //用户id
                sidx: '', //排序字段
                sort: '', //排序方式
                list: [],
                total: '',
                type: 0,
                orderSn: this.$route.query.orderSn,
            }
        },
        mounted() {
            this.getdis()
        },
        methods: {
            //获取订单详情信息
            getdis() {
                let post = {
                    // orderSn: '20200610220439289839247',
                    orderSn: this.orderSn
                };
                axios({
                    url: this.Api + '/consumptionrecord/queryDetail',
                    params: post,
                    method: "get",
                    headers: {
                     
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data
                        this.list = data
                    }
                })
            },

            toMoney(val) {
                let money = (val * 100 / 100).toFixed(2)
                return money
            },

        }
    }

</script>
<style scoped>
    .peopleManage {
        min-height: 100vh;
        background-color: #eee;
        overflow: hidden;

    }

    .mainBox {
        background-color: #f6f6f6;

    }

    .mainBox .list li {
        background-color: #fff;
        padding: 0 0.5rem;
        font-size: .5333rem;
        color: #666666;
        margin-bottom: 0.5rem;
    }


    .mainBox .list li p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2.1rem;
        border-bottom: 1px solid #eee;
    }

    .mainBox .list li p:first-child {
        font-size: .5778rem;
        color: #333333;
    }

    .mainBox .list li p:last-child {
        border: none;
    }

    .mainBox .list li p .phoneIcon {
        width: .8444rem;
        height: .8444rem;

    }

    .mainBox .list li p .Label {
        height: .8444rem;
        line-height: .8444rem;
        padding: 0 .3111rem;
        font-size: .4889rem;
        border-radius: .4rem;
        background-color: #ff6e04;
        color: #fefefe;
    }

</style>
