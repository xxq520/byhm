<template>
    <div class="selected">
        <topnav :topnav="topnav"></topnav>
        <div class="total">
            <p class="money"></p>
            <p>已选对应{{post.size}}个周期分利</p>
        </div>
        <!-- <div class="itemBox"> -->
        <ul class="itemBox" v-for="(item, index) in post.list" :key="index">
            <li>
                <div class="leftBox">
                    <p>{{formData(item.startTime,'MM')+"-"+formData(item.startTime,'DD')}}至{{formData(item.auditTime,'MM')+"-"+formData(item.auditTime,'DD')}}
                    </p>
                    <p class="fontS">分利次数：{{item.auditStatus}}</p>
                </div>
                <div class="rightBox">
                    <p class="fontS">分利金额：<span>￥+{{returnFloat(item.bonus)}}</span></p>
                    <p class="mingxi"  @click="shouxi(item.id,item.bonus)">收益明细</p>
                </div>
            </li>

        </ul>
        <!-- </div> -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '已选周期',
                    send: false
                },
                id: this.$route.query.id,
                post: [],
                lenght: ""
            }
        },
        created() {

            // axios.get(this.Api + 'withdraw/info?id='+this.id).then(res => {
            axios.get(
                this.Api +"ledgerwithdrawweekly/findWeeklyListByLedgerWithdrawId?ledgerWithdrawId=" +
                this.id,{headers: { "X-Nideshop-Token": this.$cookie.get('token') }}).then(res => {


                this.post = res.data.Data
       
                // this.post.status = 2

                // if(data.code == 0){
                // this.post = data.withdraw;
                // this.revenue();
                // }else{
                // Toast(data.msg);
                // }
            });
        },
         methods: {
            formData(time, text) {
                var date = new Date(time);
                var Y = date.getFullYear();
                var M = (date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1);
                var D = date.getDate();
                var
                    h = date.getHours();
                var m = date.getMinutes();
                var s = date.getSeconds();
                return text == 'YY' ? Y : text == 'MM' ? M :
                    text == 'DD' ? D : text == 'hh' ? h : text == 'mm' ? m : '';
            }, 



            returnFloat(value) {
                var value = Math.round(parseFloat(value) ) / 100;
                var xsd = value.toString().split(".");
                if (xsd.length == 1) {
                    value = value.toString() + ".00";
                    return value;
                }
                if (xsd.length > 1) {
                    if (xsd[1].length < 2) {
                        value = value.toString() + "0";
                    }
                    return value;
                }
            },
             shouxi(id,bonus){

             this.$router.push(
             {path:'/settings/incomeDetails',query:{id:id,total:bonus}}
             )
             },
        }
    }

</script>
<style scoped>
    .selected {
        background-color: #f2f2f2;
        min-height: 100vh;
        overflow: hidden;
    }

    .selected .total {
        background-color: #ffffff;
        width: 100%;
        height: 4.4444rem
            /* 200/45 */
        ;
        text-align: center;
        font-size: .6222rem
            /* 28/45 */
        ;
        color: #666666;
        box-sizing: border-box;
        padding: 1.2444rem
            /* 56/45 */
        ;
        margin-bottom: .4444rem
            /* 20/45 */
        ;
    }

    .selected .total .money {
        font-size: .8889rem
            /* 40/45 */
        ;
        color: #ff0051;
    }

    .selected .itemBox {
        padding: 0 .4444rem
            /* 20/45 */
        ;
        background-color: #fff;

    }

    .selected .itemBox {
        border-bottom: 1px solid #eeeeee;
        padding: .4444rem
            /* 20/45 */
            0;
        position: relative;
    }

    .selected .itemBox :last-child {
        border-bottom: none;
    }

    .itemBox .leftBox {
        text-align: left;
        font-size: 0.66rem;
        padding-left: 10px;
    }

    .itemBox .leftBox .fontS {
            padding: 3px;
        font-size: 0.58rem;
    }

    .itemBox .rightBox {
        text-align: right;
    }

    .itemBox .rightBox .mingxi {
        font-size: 0.55rem;
        color: #f3670c;

    }
    .itemBox .rightBox .fontS{
         padding: 0 0 5px 0;
    }

    .selected .itemBox li {
        font-size: .6667rem
            /* 30/45 */
        ;
        color: #333333;
        display: flex;
        justify-content: space-between;
        padding-right: 1.1111rem
            /* 50/45 */
        ;
        align-items: center;
    }

    .selected .itemBox li .flexBox p {
        line-height: 1.2889rem
            /* 58/45 */
        ;
    }

    .selected .itemBox li .flexBox p.fontS {
        font-size: .5778rem
            /* 26/45 */
        ;
        color: #666666;
    }

    .selected .itemBox li .flexBox p.fontS span {
        color: #f86b1f;
    }

</style>
