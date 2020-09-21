<template>
    <div class="preferentialbox">
        <topnav :topnav="topnav" class="topnav"></topnav>

        <div class="chanpinlist">
            <div class="header" style="display: none;">
                <div class="e1">
                    <img src="@/assets/images/storeplat/dzdi_icon_zsr.png" alt="">
                    <div class="a1">总收入：￥{{Income}} </div>
                </div>
                <div class="e1">
                    <img src="@/assets/images/storeplat/dzdi_icon_zzc.png" alt="">
                    <div class="a1">总支出：￥{{expenditure}} </div>
                </div>
            </div>
            <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="30">
                <ul class="shqmaix">
                    <li v-for="item in list" class="merchandise">
                        <div class="name">
                            <div> 订单号：{{item.batchLuchId}} </div>
                            <div> {{item.orderAmount}} </div>
                        </div>
                        <div class="price">
                            <div> {{item.createTime}} </div>

                            <div style="color: #ff4400;"> +￥{{item.supplierProfit}} </div>
                            <div style="color: #ff4400;">{{item.financeAudit==0?'待审核':item.financeAudit==1?'审核通过':'审核不通过'}} </div>
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
                    title: "申请记录"
                },
                list: [],
                pageNum: 1,
                pageSize: 10,
                loading: false,
                loadshow: true,
                loadend: false,
                genreId: '',
                sortPrice: 1,
                customTypeId: '',
                volumeShow: false,
                orderShow: false,
                Income: '',
                expenditure: '',
                merId: this.$cookie.get('merId')
            }
        },
        mounted() {

        },

        methods: {
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
                    url: this.Api1 + '/pay/sl/record',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    data: post
                }).then(res => {
                    let data = res.data.data;
                    if (data.recordList.length == 0) {
                        this.loadend = true;
                        this.loading = true;
                        this.loadshow = false;
                        return false;
                    };
                    (this.pageNum) ++;
                    this.list = this.list.concat(data.recordList);
                    this.loading = false;
                    this.loadshow = false;
                });
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
        background: f5f5f5;
        margin-bottom: 0.4rem;
    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        flex-direction: column;

    }

    .tabnav ul.tabnav-list li {
        overflow: hidden;
        text-align: center;
        width: 100%;
        padding: 0 0.5rem;
    }

    .tabnav ul.tabnav-list li a {
        display: inline-block;
        position: relative;
        font-size: 0.58rem;
        padding: 0.7em 0;
        color: #333;
    }

    .tabnav ul.tabnav-list li.hover a {
        color: #f86b1f;
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
        color: #666;
    }

    .header {
        width: 100%;
        display: flex;
        background-color: #fff;
        font-size: 0.55rem;
        color: #333;
        padding: 0.3rem 0.4rem;
        line-height: 1.5rem;
        border-bottom: 1px solid #eee;
    }

    .header .e1 {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .header .e1 img {
        width: 0.75rem;
        height: .75rem;
        margin-right: 0.5rem;
    }

    .visiblebtn>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .mint-popup {
        width: 100%;
    }

    .visiblebtn>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

</style>
