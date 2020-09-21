<template>
    <div class="PDFilter">
        <div class="is-fixed">
            <header class="mint-header">
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
                <h1 class="mint-header-title">收入明细</h1>
            </header>
            <!-- top -->
            <div class="top">
                <div class="aba">
                    <p class="num">{{totalNum}}</p>
                    <p class="num_title">交易人数</p>
                </div>
                <div class="aba">
                    <p class="num">{{totalcount}}</p>
                    <p class="num_title">交易次数</p>
                </div>
                <div class="abs">
                    <p class="num">{{totalMoney}}</p>
                    <p class="num_title">交易金额</p>
                </div>
            </div>
        </div>
        <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
            <div class="item" v-for="(item,index) in list" :key="index">
                <div class="time"> </div>
                <div class="item_conten">
                    <div class="name">{{item.username=='null'?'无':item.username}}（{{item.remarks}}）</div>
                    <div> 订单号：{{item.orderNum}} </div>
                    <p class="minut">买单时间：{{item.createTime}}</p>
                       <p class="date" v-show="item.consumptionAmount">消费金额：{{item.consumptionAmount}}</p>
                       <p class="date" v-show="item.discounts">抵扣金额：{{item.discounts}}</p>
                </div>
                <div class="profit">+{{item.amount}}</div>
            </div>
        </div>
        <loading :load.sync="loadshow" :end.sync="loadend"></loading>

    </div>
</template>

<script type="text/javascript">
    import {
        DatetimePicker
    } from "mint-ui";
    export default {
        name: "PDFilter",
        data() {
            return {

                list: [],
                nodata: false,
                loadshow: true,
                loadend: false,
                loading: false,
                params: this.$route.query,
                pageNum: 1,
                pageSize: 8,
                totalMoney: '',
                totalNum: '',
                totalcount: '',
            };
        },
        mounted() {
            axios.get(this.Api + '/detail/totalNumInfoByMerchant', {
                params: this.params
            }).then(res => {
                if (res.status == 200) {
                    var data = res.data;
                    this.topList = data.page;
                    this.totalNum = this.topList.vipNum == null ? 0 : this.topList.vipNum;
                    this.totalcount = this.topList.count == null ? 0 : this.topList.count;
                    this.totalMoney = this.topList.totalAmount == null ? 0 : this.topList.totalAmount
                        .replace(/\,/g, '');
                    this.$nextTick(function () {
                        $('.PDFilter').css({
                            'padding-top': function () {
                                return $('.PDFilter .is-fixed').height() + 'px';
                            }
                        })
                    })
                } else {
                    Toast('网络异常，请联系管理员')
                }
            })
        },
        methods: {
            toMoney(val) {
                let money = (val / 100).toFixed(2)
                return money
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                this.params.pageNum = this.pageNum;
                this.params.pageSize = this.pageSize;
                axios.get(that.Api + '/detail/listByMerchant', {
                    params: this.params
                }).then(res => {
                    let data = res.data.page;
                    if (res.status == 200) {
                        if (data.code == 500) {
                            Toast(data.msg || data.errmsg)
                        } else {
                            if (data.list.length == 0) {
                                that.loadend = true;
                                that.loadshow = false;
                                that.loading = true;
                                return false;
                            };;
                            (this.pageNum) ++;
                            that.list = that.list.concat(data.list);
                            that.loading = false;
                            that.loadshow = false;
                        }
                    } else {
                        Toast('后台异常，请联系管理员')
                    }
                })
            },
            goback() {
                this.$router.go(-1);
            },
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '.';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                // var m = date.getMinutes() + ':';
                var m = date.getMinutes();
                var s = date.getSeconds();
                // return Y+M+D+h+m+s;
                return Y + M + D;
            },
            formData1(time) { // 列表时间格式化
                var date = new Date(time);
                var h = date.getHours() + ':';
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                return h + m;
            },
            formData2(time) { // 列表日期格式化
                var date = new Date(time);
                var Y = date.getFullYear() + '.';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
                var D = date.getDate() + ' ';
                return Y + M + D;
            },
        }
    };

</script>

<style scoped>
    .PDFilter {
        width: 100%;
        background: #f2f2f2;
        min-height: 100vh;
        overflow: hidden;
    }

    .is-fixed {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: #f2f2f2;
    }

    /* 头部 */
    .PDFilter>>>.mint-header {
        background: #ff911e;
        height: 2rem;
        border-bottom: none;
        font-size: 16px;
    }

    .PDFilter .filter {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }

    .PDFilter .filter .jiantou {
        width: 0.65rem;
        height: 0.6rem;
        color: #fff;
        margin-left: 0.1111rem;
    }

    .PDFilter .filter .filter-title {
        font-size: 0.5556rem
            /* 25/45 */
        ;
    }

    /* 交易简介 */
    .PDFilter .top {
        width: 100%;
        padding: 0.4444rem 0.4444rem;
        margin-bottom: 0.4444rem;
        background: #fff;
        overflow: hidden;
        display: flex;

    }

    .PDFilter .top .num {
        font-size: .789rem;
        margin-top: 0.3333rem;
        color: #333333;
    }

    .PDFilter .top .num_title {
        font-size: .5333rem;
        color: #666666;
        margin-top: 0.6rem;
    }

    .PDFilter .top .aba {
        width: 31%;
        text-align: center;
        border-right: 1px solid #f2f2f2;
    }

    .PDFilter .top .abs {
        width: 38%;
        text-align: center;

    }


    /* 列表 */
    .PDFilter {
        width: 100%;
        overflow: hidden;
    }

    .PDFilter .endd {
        font-size: .6rem;
        text-align: center;
        color: #666666;
    }

    .PDFilter .list {
        background-color: #f2f2f2;
        padding: 0.5rem;

    }

    .PDFilter .list .item {
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #eeeeee;
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        align-items: stretch;
    }

    .PDFilter .list .item .time {
        width: 0.5rem;
        background-color: #FFCA80;
        border-radius: 1rem 0 0 1rem;
    }

    .PDFilter .list .item .item_conten {
        font-size: .55rem;
        flex: 1;
        color: #666;
        background-color: #fff;
        padding: 0.4rem;
        line-height: 1rem;
    }

    .PDFilter .list .item .item_conten .name {
        font-size: 0.58rem;
        color: #333;
    }

    .PDFilter .list .item .item_conten .detail {
        margin-top: 0.2222rem;
        display: flex;
        justify-content: space-between;
    }

    .PDFilter .list .item .profit {
        display: -webkit-flex;
        color: #ff920e;
        background-color: #fff;
        font-size: .8rem;
        display: flex;
        align-items: flex-end;
        padding-right: 0.5rem;
        padding-bottom: 0.5rem;
        border-radius: 0 0.5rem 0.5rem 0;

    }

</style>
