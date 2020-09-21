<template>
    <div>
        <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
            <div class="itembox" v-else>
                <ul>

                    <li v-for="(item,index) in list" :key="index">
                        <p>
                            <span>{{item.realName}}<i>{{item.currentName}}</i></span><span
                                class="price">{{item.checkName}}</span>
                        </p>
                        <p><span>{{item.mobile}}</span><span>申请成为:{{item.levelName}}</span></p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                messagebtn: 0,
                nodata: false,
                loading: false,
                list: [],
                loadshow: true,
                loadend: false,
                userId: this.$cookie.get('userid'),
                pageNum: 1,
                pageSize: 10,
                isShow: false, //是否显示tab
                total: '',
                type: 0,
                count: '', //
                allLoaded: false,
                 mold: this.$route.query.mold,
            }
        },
        mounted() {
            
               this.mold=sessionStorage.getItem("mold")
        },
        methods: {
            loadMore() {
                    
                if (this.mold == 'aduited') {
                    this.loading = true;
                    this.loadshow = true;
                    let params = {
                        userId: this.userId,
                        type: 1,
                        status: '',
                        pageNum: this.pageNum,
                        pageSize: ''
                    }

                    axios({
                            method: 'get',
                            url: this.Api + "apply/applyList",
                            params: params,
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            console.log(res, '758')
                            if (res.data.code == 0) {
                                this.total = res.data.totalProfit;
                                this.count = res.data.page.total;
                               this.list = this.list.concat(res.data.page.list);
                                if (res.data.page.totalCount/10 < this.pageNum) {
                                    this.loadend = true;
                                    this.loadshow = false;
                                    this.loading = true;
                                    return false;
                                }
                                this.pageNum++;
                                this.loading = false;
                                this.loadshow = false;
                            }
                        })
                        .catch(res => {
                            Toast(res.data.msg)

                        })
                }else {
                    this.loading = true;
                    this.loadshow = true;
                    let params = {
                        userId: this.userId,
                        type: 0,
                        status: '',
                        pageNum:this.pageNum ,
                        pageSize: ''
                    }

                    axios({
                            method: 'get',
                            url: this.Api + "apply/applyList",
                            params: params,
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            if (res.data.code == 0) {
                                this.total = res.data.totalProfit;
                                this.count = res.data.page.total;
                                this.list = this.list.concat(res.data.page.list);
                                if (res.data.page.totalCount/10 < this.pageNum) { 
                                    this.loadend=true;
                               this.loadshow=false; 
                               this.loading=true;
                                return false; 
                            }
                                this.pageNum++;
                                this.loading = false;
                                this.loadshow = false;
                            }
                        })
                        .catch(res => {
                            Toast(res.data.msg)

                        })
                }

            },

            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '.';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + ' ' + h + ':' + m + ':' + s;
            },

        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
    }

    /* loading */
    .loading {
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 14px;
        color: #666;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: row;
        padding: 10px 0;
    }

    .loading>>>.mint-spinner-fading-circle {
        display: inline-block;
        margin-right: 5px;
    }

    .mainTab {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: .4889rem
            /* 22/45 */
            0;
        text-align: center;
        font-size: .8889rem
            /* 40/45 */
        ;
        color: #333333;
        margin-bottom: .4444rem
            /* 20/45 */
        ;

    }

    .mainTab div {
        width: 50%;
        border-left: 1px solid #f2f2f2;
    }

    .mainTab p:first-child {
        padding: .3333rem
            /* 15/45 */
            0;
    }

    .mainTab p:last-child {
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #666666;
    }

    .maixBox {
        background-color: #fff;
        padding: 0 .4444rem
            /* 20/45 */
        ;
    }

    .maixBox ul li {
        border-bottom: 1px solid #eeeeee;
        padding: 0.7rem 0.6rem;
    }

    .maixBox ul li p {
        display: flex;
        justify-content: space-between;
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #666666;
    }

    .maixBox ul li p:first-child {
        font-size: .5778rem
            /* 26/45 */
        ;
        color: #333333;
        line-height: .7111rem
            /* 32/45 */
        ;
        padding-bottom: .2667rem
            /* 12/45 */
        ;

    }

    .maixBox ul li p i {
        padding: 0 .4444rem
            /* 20/45 */
        ;
        height: .7111rem
            /* 32/45 */
        ;
        line-height: .7111rem
            /* 32/45 */
        ;
        font-size: .4444rem
            /* 20/45 */
        ;
        color: #ffffff;
        background-color: #ff6e04;
        display: inline-block;
        border-radius: .3556rem
            /* 16/45 */
        ;
        margin-left: .6667rem
            /* 30/45 */
        ;
        vertical-align: top;

    }

    .maixBox ul li p .price {
        color: #ff6e04;
        font-size: .58rem;
    }

    .maixBox ul li:last-child {
        border-bottom: none;
    }

</style>
