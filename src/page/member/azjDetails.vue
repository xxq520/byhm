<template>
    <div class="peopleManage">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <!-- 顶部类型切换 -->

        <div class="between-flex">
            <div class="xf">消费券余额：<i style="color:#fd0278;">{{toMoney(yuprice)}}</i></div>
            <button class="search-btn" @click="azjlinks">去使用</button>
            <button class="search-btn" @click="azjGive">转赠</button>
        </div>
        <ul class="manage">
            <li>
                <p class="count">{{toMoney(totalAmount?totalAmount:0)}}</p>
                <p>累计</p>
            </li>
            <li>
                <p class="count">{{count?count:0}}</p>
                <p v-if="messagebtn==0">获券次数</p>
                <p v-else>送出次数</p>
            </li>
            <li>
                <p class="count">{{toMoney(usedAmount)}}</p>
                <p>消费使用</p>
            </li>
        </ul>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==0}" @click="messagebtnfn(0)">已获赠</li>
            <li :class="{'hover':messagebtn==2}" @click="messagebtnfn(2)">已消费</li>
            <li :class="{'hover':messagebtn==1}" @click="messagebtnfn(1)">已送出 </li>
        </ul>
        <div class="mainBox">
            <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
                <ul class="list">
                    <li v-for="(v,index) in xflist" :key="index" v-if="messagebtn==2" class="aadds"
                        @click="goConsumer(v.orderSn)">
                        <p class="ads">
                            <span class="left">订单编号:</span>
                            <span class="right">{{v.orderSn}} <i class="el-icon-arrow-right"></i></span>
                        </p>
                        <div class="huatu">
                            <div class="lefts"><img :src="v.imageUrl" alt=""></div>
                            <div class="rights">
                                <div style="line-height: 0.8rem;max-height: 1.6rem;overflow: hidden;">{{v.merName}}
                                </div>

                                <div>消费金额：￥{{v.amount}}</div>
                                <div>实际消费：￥{{v.actually}}</div>

                            </div>
                        </div>

                    </li>

                    <li v-for="(item,index) in list" :key="index" v-if="messagebtn==0||messagebtn==1">
                        <p class="boex">
                            <span class="left">{{item.instructions}}</span>
                            <span class="right" style="color: #ff6e04">{{toMoney(item.orderPrice)}}</span>
                        </p>
                        <p>
                            <span class="left">有效期至</span>
                            <span class="right">{{item.endTime}}</span>
                        </p>
                        <p v-if="messagebtn==0">
                            <span class="left">赠出账号</span>
                            <span class="right">{{item.givePhone}}</span>
                        </p>
                        <p v-if="messagebtn==1">
                            <span class="left">获赠账号</span>
                            <span class="right">{{item.phone}}</span>
                        </p>
                        <p>
                            <span class="left">{{messagebtn==0?'获赠时间':'送出时间'}}</span>
                            <span class="right">{{item.startTime}}</span>
                        </p>
                    </li>
                </ul>
                <div class="loading">
                    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import azjlinks from '@/assets/js/AZJlinks'
    export default {
        data() {
            return {
                topnav: {
                    title: '消费券详情',
                    back: true
                },
                isShowBox: false,
                messagebtn: 0,
                loadshow: true,
                loadend: false,
                loading: false,
                level: this.$cookie.get('level_id'), //0 潜在用户、1 一级用户和 2二级用户
                userid: this.$cookie.get('userid'), //用户id

                sidx: '', //排序字段
                sort: '', //排序方式
                pageNum: 1, //当前页
                pageSize: 3, //每页显示行数
                list: [],
                total: '',
                type: 0,
                backshqPd: sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route
                    .query.platform == 'ios',
                yuprice: '',
                count: '',
                usedAmount: '',
                totalAmount: '',
                xflist: []
            }
        },
        mounted() {
            this.messagebtnfn(0)
        },
        methods: {
            azjGive() {
                this.$router.push({
                    path: '/consumption',
                    query: {
                        flag: 0
                    }
                })
            },
            //跳转查看买单消费详情
            goConsumer(id) {
                this.$router.push({
                    path: '/deConsumer',
                    query: {
                        orderSn: id
                    }
                })
            },
            questionBox() {
                this.isShowBox = !this.isShowBox;
            },
            closeQuestionBox() {
                this.isShowBox = false;
            },
            messagebtnfn(val) {
                this.messagebtn = val;
                this.pageNum = 1;
                this.list = [];
                this.xflist = [];
                this.loadMore();
            },
            azjlinks() {
                azjlinks(this, this.userid);
            },

            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                axios({
                    url: this.Api +
                        'order/couponDetails?userId=' + this.userid + '&index=' + this.messagebtn +
                        '&pageIndex=' + this.pageNum + '&pageSize=' + this.pageSize,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                    let data = res.data;
                    this.count = res.data.count;
                    this.yuprice = res.data.balance;
                    this.usedAmount = res.data.usedAmount;
                    this.totalAmount = res.data.totalAmount;
                    if (this.messagebtn == 2) {
                        if (data.userConsumptionRecords.length == 0) {
                            that.loadend = true;
                            that.loadshow = false;
                            that.loading = true;
                            return false;
                        };
                        that.xflist = that.xflist.concat(data.userConsumptionRecords);
                    } else {
                        if (data.couponDetails.length == 0) {
                            that.loadend = true;
                            that.loadshow = false;
                            that.loading = true;
                            return false;
                        };
                        that.list = that.list.concat(data.couponDetails);
                    }

                    that.pageNum++;
                    that.loading = false;
                    that.loadshow = false;
                })
            },
            toMoney(val) {
                let money = (val * 100 / 100).toFixed(2)
                return money
            },
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '.';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();

                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

                return Y + M + D + ' ' + h + ':' + m;
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

    .search-btn {
        width: 55px;
        background: #ff6e04;
        border-radius: 1.3rem;
        border: none;
        color: #fff;
        margin-left: 0.2rem;
        height: 30px;
        line-height: 30px;
    }

    .xf {
        flex: 1;
    }

    .mnav {
        height: 2.2rem;
        line-height: 2.2rem;
        padding: 0 0.75rem;
        font-size: 0.6rem;
        color: #333;


    }

    .between-flex {
        display: flex;
        justify-content: space-between;
        height: 2.4rem;
        align-items: center;
        font-size: .6rem;
        color: #333;
        padding: 0 0.75rem;
        background: #ffffff;
        border-bottom: 1px solid #eee;
    }


    /*  */
    .manage {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.18rem;
        margin-bottom: 0.2rem;
    }

    .manage li {
        text-align: center;
        padding: .2rem 0;
        font-size: .62rem;
        color: #444;
        line-height: 1.2rem;
    }

    .mainBox .itembox {
        background-color: #f6f6f6;

    }

    .mainBox .itembox .list li {
        background-color: #fff;
        padding: 0 0.5rem;
        font-size: .5333rem;
        color: #666666;
        margin-bottom: 0.5rem;
        width: 100%;
    }

    .mainBox .itembox .list li .ads {
        display: flex;
    }

    .mainBox .itembox .list li .ads .right {
        padding: 0 0.5rem;
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }



    .aadds .lefts {
        width: 3.75rem;
        height: 3.75rem;
        margin-right: 0.5rem;
        border-radius: 0.3rem;
        overflow: hidden;

    }

    .aadds .huatu {
        display: flex;
        padding: 0.3rem 0;
    }

    .aadds .lefts img {
        width: 3.75rem;
        height: 3.75rem;
    }

    .aadds .rights {
        flex: 1;
        font-size: 0.58rem;
        color: #666;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .mainBox .itembox .list li p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2.1rem;
        border-bottom: 1px solid #eee;
    }

    .mainBox .itembox .list li p:first-child {
        font-size: .5778rem;
        color: #333333;
    }

    .mainBox .itembox .list li p:last-child {
        border: none;
    }

    .mainBox .itembox .list li p .phoneIcon {
        width: .8444rem;
        height: .8444rem;

    }

    .mainBox .itembox .list li p .Label {
        height: .8444rem;
        line-height: .8444rem;
        padding: 0 .3111rem;
        font-size: .4889rem;
        border-radius: .4rem;
        background-color: #ff6e04;
        color: #fefefe;
    }

    .managebtn {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: 1px solid #eee;
    }


    .managebtn li {
        width: 33%;
        text-align: center;
        padding: .4889rem 0;
        font-size: .6222rem;
        color: #333333;
        height: 2.2222rem;
    }



    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 50%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 25%;
    }

</style>
