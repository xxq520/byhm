<template>
    <div class="preferentialbox">
        <topnav :topnav="topnav" class="topnav"></topnav>

        <div class="chanpinlist">
            <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <ul class="shqmaix">
                    <li v-for="item in list" class="merchandise" @click="toshopDetail(item.goodsId)">
                        <div class="name">
                            <div> 订单号：{{item.orderSn}} </div>
                            <div style="color: #666;">订单支付 </div>
                        </div>
                        <div class="price">
                            <div>{{item.confirmTime}} </div>
                            <div style="color: #ff4400;"> +￥{{item.totalOrderPrice}} </div>
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
                    title: "待结算"
                },
                id: this.$route.query.shopSeq,
                list: [],
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
                merId:this.$cookie.get('merId')
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
                let that = this;
                let post = {
                    merId: this.merId,
                    pageIndex: this.pageNum,
                    pageSize: this.pageSize,
                };
                axios({
                    method: "post",
                    url: this.Api1 + '/order/notSLOrder',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    data: post
                }).then(res => {
                    if(res.data.code ==200){
                         let data = res.data.data;
                         if (data.list.length == 0) {
                         this.loadend = true;
                         this.loading = true;
                         this.loadshow = false;
                         return false;
                         };
                         (this.pageNum) ++;
                         this.list = this.list.concat(data.list);
                         this.loading = false;
                         this.loadshow = false;
                    }
                  
                });
            },
            toshopDetail(val) {
                this.$router.push({
                    path: "shqGoodDetail",
                    query: {
                        shopSeq: this.id,
                        goodsid: val
                    }
                })
            }
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

    .chanpinlist {
        margin-top: 0.4rem;
    }

    .merchandise {
        padding: 0.5rem 0.5rem 0.3rem;
        border-bottom: 1px solid #f5f5f5;
        font-size: 0.58rem;
        background-color: #fff;
    }

    .merchandise .name {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.2rem;
        color: #999;
    }

    .merchandise .price {
        line-height: 0.82rem;
        display: flex;
        justify-content: space-between;
        line-height: 1.4rem;
        color: #999;
    }

</style>
