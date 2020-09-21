<template>
    <div class="mainbox">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <!--  -->
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==0}" @click="messagebtnfn(0)">
                所有收益
            </li>
            <li :class="{'hover':messagebtn==1}" @click="messagebtnfn(1)">爱之家收益
            </li>
            <li :class="{'hover':messagebtn==2}" @click="messagebtnfn(2)">百业惠盟收益
            </li>
        </ul>
        <div class="mainTab" v-if="messagebtn==0">
            <div>
                <p>{{Number(incomeAll).toFixed(2)}}</p>
                <p>总收益(元)</p>
            </div>
            <div>
                <p>{{count}}</p>
                <p>收益次数</p>
            </div>
        </div>
        <div v-else>
            <div class="mainTab">
                <div class="accordion" @click="revenue">

                    <li style="flex: 1;">
                        <p>{{Number(totalEarnings).toFixed(2)}}</p>
                        <p>总收益(元)</p>
                    </li>
                    <img src="@/assets/images/arrow_g.png">
                </div>
                <div>
                    <p>{{earningsCount}}</p>
                    <p>收益次数</p>
                </div>
            </div>
            <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
                <div class="itembox" v-else>
                    <ul>
                        <li v-for="(item,index) in list" :key="index" v-if="item">
                            <div v-if="messagebtn==2">
                                <p><span>{{item.cardNo}}<i>{{item.levelName}}</i></span><span
                                        class="price">+￥{{(item.profitStr*100/100).toFixed(2)}}</span></p>
                                <p><span>{{ formData(item.createTime,'YY')}}</span><span>{{item.remark}}</span>
                                </p>
                            </div>
                            <div v-else>
                                <p><span>{{item.orderno}}<i>{{item.levelName}}</i></span><span
                                        class="price">+￥{{(item.profit).toFixed(2)}}</span></p>
                                <p><span>{{ formData(item.payTime,'YY')}}</span><span>{{item.remarks}}</span>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'Earndetail',
        data() {
            return {
                topnav: {
                    title: '收益明细',
                },
                messagebtn: 0,
                loading: false,
                list: [],
                loadshow: true,
                loadend: false,
                userid: this.$cookie.get('userid'),
                pageNum: 1,
                pageSize: 10,
                incomeAll: 0,
                count: 0,
                type: 0,
                ruleLevel: this.$route.query.level,
                totalEarnings: 0,
                earningsCount: 0,
            }
        },
        mounted() {

            this.getincomeAll();
        },
        methods: {
            //跳转收益详情
            revenue() {
                if (this.messagebtn == 1) {
                    this.$router.push({
                        path: '/operation/arevenue',
                        query: {
                            type: this.change
                        }
                    });
                } else {
                    this.$router.push({
                        path: '/operation/brevenue',
                        query: {
                            type: this.change
                        }
                    });
                }
            },
            // 获取所有收益与次数
            getincomeAll() {
                axios({
                    method: 'get',
                    url: this.Api + 'benefit/getTotalProfit?userId=' + this.userid,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 0) {
                        this.incomeAll = res.data.data.totalProfit;
                        this.count = res.data.data.totalNumber;
                    }

                })
            },
            //切换tap
            messagebtnfn(val) {

                this.messagebtn = val;
                this.pageNum = 1;
                this.list = [];
                this.loadMore();
            },
            goback() {
                this.$store.commit("bbb");

                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                // console.log(this.$route.query.from);
                if (this.$route.query.platform == 'android') {

                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {

                    window.action.backAPPiOS();
                } else {

                    this.$router.go(-1)
                }
            },


            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                if (this.messagebtn == 2) {
                    Indicator.open();

                    let param = {
                        userId: this.userid,
                        pageNo: this.pageNum,
                        pageSize: this.pageSize,
                        profitType: this.type
                    }
                    axios({
                        method: 'get',
                        url: this.Api + 'benefit/user/profit/detail',
                        params: param,
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    }).then(res => {

                        if (res.data.code == 0) {
                            this.totalEarnings = res.data.totalProfit
                            this.earningsCount = res.data.profitTimes
                            this.list = this.list.concat(res.data.page.list);

                            if (res.data.page.hasNextPage == false) {
                                this.loadend = true;
                                this.loadshow = false;
                                this.loading = true;
                                Indicator.close();
                                return false;
                            }
                            this.pageNum++;

                            this.loading = false;
                            this.loadshow = false;
                            Indicator.close();


                        } else {
                            Indicator.close();
                        }
                    })
                } else {

                    Indicator.open();
                    let param = {

                        pageNo: this.pageNum,
                        pageSize: this.pageSize,
                        type: 1
                    }
                    axios({
                        method: 'get',
                        url: this.Api + 'benefit/getLoveHomeProfitAll',
                        params: param,
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    }).then(res => {

                        if (res.data.code == 0) {
                            this.totalEarnings = res.data.data.totalEarnings
                            this.earningsCount = res.data.data.earningsCount
                            this.list = this.list.concat(res.data.data.list);
                            // console.log(this.incomeAll, this.list)
                            if (res.data.data.totalPage <= this.pageNum) {
                                this.loadend = true;
                                this.loadshow = false;
                                this.loading = true;
                                Indicator.close();
                                return false;
                            }
                            this.pageNum++;
                            this.loading = false;
                            this.loadshow = false;
                            Indicator.close();
                        } else {
                            Indicator.close();
                        }
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
    .topnav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
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

    .mainTab .accordion {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mainTab .accordion img {
        width: 12px;
        height: 20px;
        margin-right: 0.4rem;
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

    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
        padding-top: 2rem;
    }

    .managebtn {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }


    .managebtn li {
        text-align: center;
        padding: .5889rem 0;
        font-size: .6222rem;
        color: #333333;
        height: 2.2222rem;

        width: 30%;


    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 60%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 20%;
    }

    .managebtn li.hover p {
        color: #ff6e04;
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


    .maixBox {
        background-color: #fff;
        padding: 0 .4444rem
            /* 20/45 */
        ;
    }

    .maixBox ul li {
        border-bottom: 1px solid #eeeeee;
        padding: .8667rem 0;

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
        font-size: .6667rem
            /* 30/45 */
        ;

    }

    .maixBox ul li:last-child {
        border-bottom: none;
    }

</style>
