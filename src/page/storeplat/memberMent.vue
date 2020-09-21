<template>
    <div class="preferentialbox">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="header">
            <div class="e1" style="border-right: 1px dashed #eee;">
                <div class="left"><img src="@/assets/images/storeplat/hy_icon_ddb.png" alt="">
                </div>
                <div class="right">
                    <div class="a1">今日到店 </div>
                    <div> {{daodian.toDayToShopNumber}}人 </div>
                </div>
            </div>
            <div class="e1">
                <div class="left"><img src="@/assets/images/storeplat/hy_icon_dda.png" alt="">
                </div>
                <div class="right">
                    <div class="a1">今日下单 </div>
                    <div> {{daodian.toDayPlaceOrderNumber}}人 </div>
                </div>
            </div>
        </div>
        <div class="chanpinlist">
            <!-- <div class="tabnav">
                <ul class="tabnav-list">
                    <li :class="{'hover':volumeShow}" @click="volumeTap">
                        <a>订单量<i :class="volumeShow?'el-icon-caret-top':'el-icon-caret-bottom'"></i></a>
                    </li>
                    <li :class="{'hover':orderShow}" @click="orderTap">
                        <a>消费金额<i :class="orderShow?'el-icon-caret-top':'el-icon-caret-bottom'"></i></a>
                    </li>
                </ul>
            </div> -->
            <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <ul class="shqmaix">
                    <li v-for="item in list" class="merchandise">
                        <div class="left"><img :src="item.avatar" alt="">
                        </div>
                        <div class="right">
                            <div class="name">
                                <div class="a1"> {{item.nickname}} </div>
                                <div> {{item.createTime}} </div>
                            </div>
                            <div style="line-height: 1rem ;margin: 0.3rem 0;">{{item.username}}</div>
                            <div class="price">
                                <div style="margin-right: 1rem;"> 订单数：{{item.orderNumber}} </div>
                                <div> 消费金额：{{item.sumAmount}} </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: "会员管理"
                },
                id: this.$route.query.id,
                list: [ ],
                pageNum: 1,
                pageSize: 5,
                loading: false,
                loadshow: true,
                loadend: false,
                genreId: '',
                sortPrice: 1,
                customTypeId: '',
                volumeShow: false,
                orderShow: false,
                daodian:{}
            }
        },
        mounted() {


        },
        methods: {
            //切换订单量
            volumeTap() {
                this.volumeShow = !this.volumeShow;
            },

            //切换消费金额
            orderTap() {
                this.orderShow = !this.orderShow;
            },

            loadMore() {
                this.loading = true;
                this.loadshow = true;
                axios({
                    method: 'post',
                    url: this.Api1 + "/basic/queryTodayPlaceOrder",
                    data: {
                        merId: this.id,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    let data = res.data.data;
                    if (res.data.code == 200) {
                        this.daodian = data ;
                        if (data.todayPlaceOrderDetails.list.length == 0) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        this.pageNum++;
                        this.list = this.list.concat(data.todayPlaceOrderDetails.list);
                        this.loading = false;
                        this.loadshow = false;
                    } else {
                        this.loadshow = false;
                    };
                })
            },

        }
    }

</script>

<style scoped>
    .preferentialbox {
        overflow: hidden;
        background-color: #f2f2f2;
        min-height: 100vh;
        color: #444;
        position: relative;
        padding-top: 40px;

    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .tabnav {
        overflow: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.4rem;

    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .tabnav ul.tabnav-list li {
        overflow: hidden;
        text-align: center;
        width: 33%;
    }

    .tabnav ul.tabnav-list li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0.7em 0;
        color: #666;
    }

    .tabnav ul.tabnav-list li.hover a {
        color: #f86b1f;
    }

    .merchandise {
        padding: 0.3rem 0.2rem;
        border-bottom: 1px solid #f5f5f5;
        display: flex;
        font-size: 0.58rem;
        background-color: #fff;


    }

    .merchandise .left {
        padding: 2px;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .merchandise .left img {
        width: 1.5rem;
        height: 1.5rem;
    }

    .merchandise .right {
        flex: 1;
        padding: 3px;
        padding-left: 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 68%;
        overflow: hidden;
        color: #999;
    }

    .merchandise .right .name {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1rem;

    }

    .merchandise .right .name .a1 {
        flex: 1;
        color: #333;
    }

    .merchandise .right .price {
        line-height: 0.82rem;
        display: flex;
        justify-content: flex-start;
        line-height: 1rem;
        color: #666;
    }

    .header {
        width: 100%;
        display: flex;
        background-color: #fff;
        margin-bottom: 0.4rem;
        font-size: 0.6rem;
        color: #333;
        padding: 0.4rem;
    }

    .header .e1 {
        width: 50%;
        padding: 0.3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header .e1 img {
        width: 1.75rem;
        height: 1.75rem;
        margin-right: 0.5rem;
    }

</style>
