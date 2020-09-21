<template>
    <div class="mainbox">
        <topnav :topnav="topnav" class="topnav1"></topnav>

        <div class="tabnav">
            <ul>
                <li @click="xuanzhe('0')" :class="{'hover':change == '0'}">
                    <a>所有收益<i></i></a>
                </li>
                <li @click="xuanzhe(item.type,item.level)" :class="{'hover':change == item.type}"
                    v-for="item in this.infolist">
                    <a>{{item.name}}<i></i></a>
                </li>

            </ul>
        </div>
        <div class="mainTab">
            <div>
                <p>{{Number(incomeAll).toFixed(2)}}</p>
                <p>总收益(元)</p>
            </div>
            <div>
                <p>{{count}}</p>
                <p>收益次数</p>
            </div>
        </div>

        <div class="mode" v-if="change=='0'">
            <li :class="{'hover':messagebtn == '0'}" @click="messagebtnfn(0)">全部收益</li>
            <li class="yongjin" :class="{'hover':messagebtn == '1'}" @click="messagebtnfn(1)">佣金收益</li>
            <li :class="{'hover':messagebtn == '2'}" @click="messagebtnfn(2)">公佣收益</li>
        </div>
        <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
            <div class="itembox" v-else>
                <ul>
                    <li v-for="(item,index) in list" :key="index">

                        <p><span>{{item.cardNo}}<i>{{item.levelName}}</i></span><span
                                class="price">+￥{{(item.profitStr*100/100).toFixed(2)}}</span></p>
                        <p><span>{{ formData(item.createTime,'YY')}}</span><span>{{item.remark}}</span>
                        </p>


                    </li>
                </ul>
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
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
                    title: '百业惠盟详细收益',
                },
                change: 0,
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
                infolist: [],
                byShow: true,
                messagebtn: 0
            }
        },
        mounted() {


            this.getinfo();
        },
        methods: {
            //tap 切换
            xuanzhe(val, level) {
                if (val != 0) {
                    this.byShow = false;
                }
                this.userLevel = level;
                this.change = val;
                this.pageNum = 1;
                this.list = [];
                this.loadMore();

            },

            //获取身份信息
            getinfo() {
                axios({
                    method: 'get',
                    url: this.Api + '/user/getMultipleIdentitys?type=2&userId=' + this.userid,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    this.infolist = res.data.data;

                })

            },
            messagebtnfn(val) {
                this.byShow = true;
                this.messagebtn = val;
                this.type = val ;
                this.pageNum = 1;
                this.list = [];
                this.loadMore();

            },
            //切换tap

            goback() {

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
                if (this.change == 0 || this.byShow) {
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
                            this.incomeAll = res.data.totalProfit
                            this.count = res.data.profitTimes
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
                        userId: this.userid,
                        pageNo: this.pageNum,
                        pageSize: this.pageSize,
                        type: this.change
                    }
                    axios({
                        method: 'get',
                        url: this.Api + 'benefit/identityProfitDetail',
                        params: param,
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    }).then(res => {

                        if (res.data.code == 0) {
                            this.incomeAll = res.data.totalProfit
                            this.count = res.data.profitTimes
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
    .topnav1 {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .tabnav {
        overflow: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.5rem;
    }

    .tabnav ul {
        width: 100%;
        overflow-x: scroll;
        display: -webkit-flex;
        display: flex;

    }

    .tabnav ul::-webkit-scrollbar {
        display: none;
    }

    .tabnav ul li {
        text-align: center;
        flex-shrink: 0;
        font-size: 0.65rem;
        height: 1.8rem;
        line-height: 1.8rem;
        width: 30%;
    }

    .tabnav ul li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0 0.2rem;
        color: #666;
    }

    .tabnav ul li a i {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
    }

    .tabnav ul li.hover a {
        color: #f86b1f;
    }

    .tabnav ul li.hover a i {
        background: #f86b1f;
    }

    .mainTab {
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: .4889rem 0;
        text-align: center;
        font-size: .8889rem;
        color: #333333;
        margin-bottom: .4444rem;

    }

    .mainTab div {
        width: 50%;
        border-left: 1px solid #f2f2f2;
    }

    .mainTab p:first-child {
        padding: .3333rem 0;
    }

    .mainTab p:last-child {
        font-size: .5333rem;
        color: #666666;
    }

    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
        padding-top: 2rem;
    }

    .mode {
        margin: 0.6rem 0;
        display: flex;
        font-size: 0.58rem;
        justify-content: center;


    }

    .mode li.hover {
        color: #fff;
        background-color: #FF6E04;
    }

    .mode li {
        width: 30%;
        height: 1.34rem;
        line-height: 1.3rem;
        text-align: center;
        border: 1px solid #FF6E04;
        color: #FF6E04;
    }

    .mode .yongjin {
        border-left: none;
        border-right: none;
    }

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
        padding: 0 .4444rem;
    }

    .maixBox ul li {
        border-bottom: 1px solid #eeeeee;
        padding: .8667rem 0;

    }

    .maixBox ul li p {
        display: flex;
        justify-content: space-between;
        font-size: .5333rem;
        color: #666666;
    }

    .maixBox ul li p:first-child {
        font-size: .5778rem;
        color: #333333;
        line-height: .7111rem;
        padding-bottom: .2667rem;

    }

    .maixBox ul li p i {
        padding: 0 .4444rem;
        height: .7111rem;
        line-height: .7111rem;
        font-size: .4444rem;
        color: #ffffff;
        background-color: #ff6e04;
        display: inline-block;
        border-radius: .3556rem;
        margin-left: .6667rem;
        vertical-align: top;

    }

    .maixBox ul li p .price {
        color: #ff6e04;
        font-size: .6667rem;

    }

    .maixBox ul li:last-child {
        border-bottom: none;
    }

</style>
