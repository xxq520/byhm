<template>
    <div class="profitDetail">
        <div class="is-fixed">
            <header class="mint-header">
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
                <h1 class="mint-header-title">收入明细</h1>
                <div class="filter" @click="showFilter">
                    <div class="filter-title">筛选</div>
                    <div class="jiantou"><img src="@/assets/images/transction.png" class="screen"></div>
                </div>
            </header>
            <!-- top -->
            <div class="top">
                <div class="aba">
                    <p class="num">{{totalNum}}</p>
                    <p class="num_title">交易人数</p>
                </div>
                <div class="aba">
                    <p class="num">{{totalNum}}</p>
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
        <div class="filterPop">
            <mt-popup v-model="popupVisible" position="top" popup-transition="popup-fade">
                <div class="card_no">
                    <p class="title">用户卡号：</p>
                    <div class="cardWrap">
                        <input class="content" placeholder="请输入用户卡号" type="text" v-model="card_no" @focus="searhed"
                            @blur="blurfn" maxlength="15" onkeyup="value=value.replace(/[^\d]/g,'')"
                            onfocus="this.placeholder=''" onblur="this.placeholder='请输入用户卡号(纯数字)'" />
                        <i class="el-icon-circle-close" v-show="close" @click="closefn($event)"></i>
                    </div>
                </div>
                <div class="time">
                    <p class="title">时间：</p>
                    <ul class="date">
                        <li v-for="(t,index) in timeList" :key="index" :class="{'active':messagebtn==index}"
                            @click="messagebtnfn(index)">{{t}}</li>
                    </ul>
                </div>
                <div class="own">
                    <p class="title">自定义时间：</p>
                    <div class="ownTime">
                        <div class="numipt">
                            <input type="text" placeholder='选择开始时间' v-model="inputStartTime" @click="openPicker"
                                onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                            <img src="../../assets/images/filter_date.png" alt="">
                        </div>
                        <div id="zhi">至</div>
                        <div class="numipt">
                            <input type="text" placeholder='选择结束时间' v-model="inputEndTime" @click="openPicker2"
                                onkeyup="this.value=this.value.replace(/\s+/g,'')" readonly="readonly">
                            <img src="../../assets/images/filter_date.png" alt="">
                        </div>
                    </div>
                </div>
                <!-- btn -->
                <div class="btnWrap">
                    <div class="btn" @click="resetFn"><button>重置</button></div>
                    <div class="btn" @click="submit"><button>完成</button></div>
                </div>
            </mt-popup>
        </div>
        <div class="no-data" style="margin-top:100px" v-if="nodata"><img src="@/assets/images/qs.png" alt=""></div>
        <!-- mint datepicker 开始时间-->
        <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" v-model="startTime"
            month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm" :startDate="startDate"
            :endDate="endDate">
        </mt-datetime-picker>
        <!-- mint datepicker 结束时间-->
        <mt-datetime-picker ref="picker2" type="date" year-format="{value} 年" v-model="endTime" month-format="{value} 月"
            date-format="{value} 日" @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
        </mt-datetime-picker>
    </div>
</template>

<script type="text/javascript">
    import {
        DatetimePicker
    } from "mint-ui";
    export default {
        name: "profitDetail",
        data() {
            return {
                messagebtn: 0,
                popupVisible: false,
                card_no: null, //用户卡号
                merId: '', //商家id
                totalNum: '', //今日交易用户数
                totalMoney: '', //今日交易总金额
                dayNum: null, //时间
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                list: [], //收入明细列表
                close: false,
                pickerValue: false,
                startTime: new Date(),
                endTime: new Date(),
                inputStartTime: null,
                inputEndTime: null,
                startDate: new Date('2018/01/01'),
                startDate2: new Date('2018/01/01'), //开始时间
                endDate: new Date(), // 结束时间
                timeList: ['全部', '近7天', '近15天', '近30天'],
                nodata: false,
                flitTopList: [],
                loadshow: true,
                loadend: false,
                loading: false,
            };
        },
        mounted() {
            /* 查询总消费人数及金额 */
            var params = {
                merId: this.$route.query.id,
                dayNum: 0
            }
            axios.get(this.Api + '/detail/totalNumInfoByMerchant', {
                params: params
            }).then(res => {
                if (res.status == 200) {
                    var data = res.data;
                    this.totalNum = data.page.count == null ? 0 : data.page.count;
                    this.totalMoney = data.page.totalAmount == null ? 0 : data.page.totalAmount.replace(/\,/g,
                        '');
                    this.$nextTick(function () {
                        $('.profitDetail').css({
                            'padding-top': function () {
                                return $('.profitDetail .is-fixed').height() + 'px';
                            }
                        })
                    })
                } else {
                    Toast('网络异常，请联系管理员')
                }
            });
        },
        methods: {
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let params = {
                    merId: that.$route.query.id,
                    dayNum: 0,
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                };
                axios.get(that.Api + '/detail/listByMerchant', {
                    params
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
                            (that.pageNum) ++;
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
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else {
                    if (window.history.length > 1) {
                        this.$router.go(-1);
                    } else {
                        this.$router.push({
                            path: '/'
                        });
                    }
                }
            },
            showFilter() {
                this.popupVisible = !this.popupVisible;
            },
            showData() {
                this.pickerValue = true;
            },
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                // var m = date.getMinutes() + ':';
                var m = date.getMinutes();
                var s = date.getSeconds();
                // return Y+M+D+h+m+s;
                return Y + M + D;
            },
            messagebtnfn(val) {
                this.messagebtn = val;
                switch (val) {
                    case 0:
                        this.dayNum = null;
                        break;
                    case 1:
                        this.dayNum = 7;
                        break;
                    case 2:
                        this.dayNum = 15;
                        break;
                    case 3:
                        this.dayNum = 30;
                        break;
                }
            },
            submit() {


                /* 查询总消费人数及金额 */
                var posts = {
                    merId: this.$route.query.id,
                    cardNo: this.card_no == 'null' ? null : this.card_no == '' ? null : this.card_no,
                    dayNum: this.dayNum, //最近多少天
                    startTime: this.inputStartTime == "" ? null : this.inputStartTime, //查询的开始时间
                    endTime: this.inputEndTime == "" ? null : this.inputEndTime, //查询的结束时间  如
                }

                this.$router.push({
                    path: '/management/PDFilter',
                    query: posts
                })
            },
            toMoney(val) {
                let money = (val / 100).toFixed(2)
                return money
            },
            closefn(e) {
                this.card_no = "";
            },
            resetFn() {
                this.card_no = null;
                this.messagebtn = 0;
                this.inputStartTime = null;
                this.inputEndTime = null;
            },
            handleConfirm(data) {
                if (new Date(data).getTime() <= new Date(this.endTime).getTime()) {
                    let date = this.formData(data);
                    this.inputStartTime = date;
                    // console.log(this.inputStartTime);
                } else {
                    Toast({
                        message: '开始时间不能大于结束时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            handleConfirm2(data) {
                if (new Date(data).getTime() >= new Date(this.startTime).getTime()) {
                    let date = this.formData(data);
                    this.inputEndTime = date;
                    // console.log(this.inputEndTime);
                } else {
                    Toast({
                        message: '结束时间不能小于开始时间！',
                        duration: 2000,
                        className: 'counttc'
                    });
                }
            },
            blurfn() {
                this.close = false;
            },
            searhed() {
                this.close = true;
            },
            // 时间筛选
            openPicker() {
                this.$refs.picker.open();
            },
            openPicker2() {
                this.$refs.picker2.open();
            },
            formData1(time) { // 列表时间格式化
                var date = new Date(time);
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                return h + ":" + m;
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
    .active {
        border: 1px solid #ff920e !important;
    }

    .is-fixed {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: #f2f2f2;
    }

    .profitDetail {
        width: 100%;
        background: #f2f2f2;
        min-height: 100vh;
        overflow: hidden;
    }

    /* 头部 */
    .profitDetail>>>.mint-header {
        background: #ff911e;
        height: 2rem;
        border-bottom: none;
        font-size: 16px;
        position: relative;
    }

    .profitDetail .filter {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        position: absolute;
        right: 10px;
    }

    .profitDetail>>>.mint-header .mint-button {
        position: absolute;
    }

    .profitDetail .filter .jiantou {
        width: 0.65rem;
        height: 0.6rem;
        color: #fff;
        margin-left: 0.1111rem;
    }

    .profitDetail .filter .filter-title {
        font-size: 0.5556rem
            /* 25/45 */
        ;
    }

    /* 交易简介 */
    .profitDetail .top {
        width: 100%;
        padding: 0.4444rem 0.4444rem;
        margin-bottom: 0.4444rem;
        background: #fff;
        overflow: hidden;
        display: flex;

    }

    .profitDetail .top .num {
        font-size: .789rem;
        margin-top: 0.3333rem;
        color: #333333;
    }

    .profitDetail .top .num_title {
        font-size: .5333rem;
        color: #666666;
        margin-top: 0.6rem;
    }

    .profitDetail .top .aba {
        width: 30%;
        text-align: center;
        border-right: 1px solid #f2f2f2;
    }

    .profitDetail .top .abs {
        width: 40%;
        text-align: center;

    }

    /* 列表 */
    .profitDetail {
        width: 100%;
        overflow: hidden;
    }

    .profitDetail .list {
        background-color: #f2f2f2;
        padding: 0.5rem;

    }

    .profitDetail .list .item {
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #eeeeee;
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        align-items: stretch;
    }

    .profitDetail .list .item .time {
        width: 0.5rem;
        background-color: #FFCA80;
        border-radius: 1rem 0 0 1rem;
    }

    .profitDetail .list .item .item_conten {
        font-size: .55rem;
        flex: 1;
        color: #666;
        background-color: #fff;
        padding: 0.4rem;
        line-height: 1rem;
    }

    .profitDetail .list .item .item_conten .name {
        font-size: 0.58rem;
        color: #333;
    }

    .profitDetail .list .item .item_conten .detail {
        margin-top: 0.2222rem;
        display: flex;
        justify-content: space-between;
    }

    .profitDetail .list .item .profit {
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

    /* 筛选条件弹窗 */
    .profitDetail .filterPop {
        width: 100%;
        background: #fff;
    }

    .profitDetail>>>.v-modal {
        top: 2rem;
    }

    .profitDetail>>>.mint-popup {
        width: 100%;
    }

    .profitDetail>>>.mint-popup-top {
        top: 2rem;
    }

    .profitDetail .filterPop .card_no {
        padding: 0.6667rem 0.4444rem;
    }

    .profitDetail .filterPop .card_no .cardWrap {
        position: relative;
    }

    .profitDetail .filterPop .time,
    .own {
        padding: 0 0.4444rem 0.6667rem 0.444rem;
    }

    .profitDetail .filterPop .card_no .title {
        font-size: .5778rem;
    }

    .profitDetail .filterPop .time .title {
        font-size: .5778rem;
    }

    .profitDetail .filterPop .own .title {
        font-size: .5778rem;
    }

    .profitDetail .filterPop .card_no .content {
        border: 1px solid #c6c6c6;
        border-radius: 5px;
        width: 13.46rem;
        height: 1.3333rem;
        margin-top: 0.4444rem;
        text-indent: .5em;
    }

    .profitDetail .filterPop .card_no i {
        font-size: 15px;
        position: relative;
        right: 35px;
        top: 0px;
    }

    .profitDetail .filterPop .time .date {
        width: 100%;
        overflow: hidden;
        margin-top: 0.4444rem;
    }

    .profitDetail .filterPop .time .date li {
        width: 20%;
        height: 1.3333rem;
        border: 1px solid #c6c6c6;
        border-radius: 5px;
        font-size: .5778rem;
        display: block;
        text-align: center;
        padding: 0.2222rem;
        float: left;
        margin-right: 0.46rem;
    }

    .profitDetail .filterPop .time .date li:last-child {
        margin-right: none;
    }

    .profitDetail .filterPop .own .ownTime {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }

    .profitDetail .filterPop .own .ownTime #zhi {
        font-size: .6667rem;
        margin: .4444rem;
        padding-top: 7px;
    }

    .profitDetail .filterPop .own .ownTime .numipt {
        border-radius: 5px;
        border: 1px solid #c6c6c6;
        width: 39.7%;
        height: 1.3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: .1111rem .2222rem;
        margin-top: .444rem;
    }

    .profitDetail .filterPop .own .ownTime .numipt input {
        width: 90%;
    }

    .profitDetail .filterPop .own .ownTime .numipt img {
        width: .69rem;
        height: .69rem;
    }

    /* 按钮 */
    .profitDetail .filterPop .btnWrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.6667rem;
    }

    .profitDetail .filterPop .btnWrap .btn {
        width: 50%;
        height: 1.5556rem;
        font-size: .5778rem;
        color: #666666;
    }

    .profitDetail .filterPop .btnWrap button {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        border-top: 1px solid #eeeeee;
        border-right: 1px solid #eeeeee;
        background: #fff;
    }

    .profitDetail .filterPop .btnWrap .btn:nth-child(2) button {
        border-right: none;
        color: #ff920e;
    }

</style>
