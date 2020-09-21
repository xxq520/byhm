<template>
    <div class="become-member">
        <!-- 头部 -->
        <topnav :topnav="topnav" class="topnav"></topnav>
        <!-- <div class="toren" @click="togetCard"><img src="@/assets/images/shoppingMall/kq_icon_l.png"></div> -->
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==item.id}" @click="messagebtnfn(item.id)" v-for="item in navlist">
                {{item.name}}
            </li>
        </ul>

        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <ul class="list">
                <div class="nodata" v-if="!list.length"><img src="@/assets/images/xinx-img.png"></div>
                <li v-for="(item,index) in list" :key="index">
                    <div class="youInfo">
                        <div class="a1" v-if="item.type==2">
                            <div style="color: #FF4400;font-size: 0.85rem;">￥{{item.discountAmount}} </div>
                            <div> 满{{item.maxAmount}}可用 </div>
                        </div>
                        <div class="a1" v-else>
                            <div style="color: #FF4400;font-size: 0.85rem;"> {{item.discount}}折</div>
                        </div>
                        <div class="a2">
                            <div style="display: flex;justify-content: space-between;">
                                <div style="font-size: 0.72rem;"> {{item.name}} </div>

                            </div>
                            <div>适用店铺：{{item.merchantName}}</div>
                            <div style="color:#999;">限：{{arrquxiao(item.startTime)}}-{{arrquxiao(item.endTime)}}</div>
                        </div>
                    </div>
                    <div class="foot" v-if="item.status == 0 ">
                        <div @click="Touse(item.voucherId,item.merId,item.isCommon)"> 立即使用</div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
            </div>
        </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '领券中心',
                },
                seq: this.$cookie.get('seq'),
                price: {},
                carvist: false,
                postData: {},
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: 0,
                loadshow: true,
                loadend: false,
                loading: false,
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                navlist: [{
                        name: '全部',
                        id: '0'
                    },
                    {
                        name: '待使用',
                        id: '1'
                    },
                    {
                        name: '已使用',
                        id: '2'
                    },
                    {
                        name: '已过期',
                        id: '3'
                    },
                ],
                list: [],
                page: 1
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //时间转换
           arrquxiao(val) {
           let abs = val.split(' ');
           return abs[0];
           },
            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                this.page = 1;
                this.list = [];
                this.loadMore();
            },
            //去领券
            togetCard() {
                this.$router.push({
                    path: '/renewalCard'
                })
            },
            //使用劵
            Touse(val,id,isCommon) {

                this.$router.push({
                    path: '/comment/commSearch',
                    query: {
                        id: id,
                        cearyid: val,
                        isCommon:isCommon
                    }
                })
            },
            loadMore() {
                let that = this;
                this.loading = true;
                this.loadshow = true;
                let post = {
                    status: this.messagebtn,
                    userId: this.userid,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                axios({
                    url: this.Api1 + '/user/userVoucher/voucherList',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        if (data.list.length == 0) {
                            that.loadend = true;
                            that.loading = true;
                            that.loadshow = false;
                            return false;
                        };
                        (that.page) ++;
                        that.list = that.list.concat(data.list);

                    } else {
                        Toast(res.data.errmsg || res.data.msg)
                    };
                    that.loading = false;
                    that.loadshow = false;
                })

            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        padding-top: 40px;
        overflow: hidden;

    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .managebtn {
        width: 100%;
        background-color: #fff;
        display: flex;

        align-items: center;
        overflow: auto;
    }

    .managebtn::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .managebtn li {

        text-align: center;
        padding: .4889rem 0;
        font-size: .6222rem;
        color: #333333;
        height: 2.2rem;
        line-height: 1.2rem;
        width: 25%;
        flex-shrink: 0;
    }

    .managebtn li p.count {
        color: #666666;
        font-size: .5333rem;
        line-height: .6667rem;
    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 80%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 10%;
    }

    .managebtn li.hover p {
        color: #ff6e04;
    }

    .list {
        padding: 0.4rem;
    }

    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
    }

    .list li .youInfo {
        display: flex;
        padding: 0.6rem 0;

        position: relative;
    }

    .list li .youInfo .a1 {
        width: 33%;
        text-align: center;
        line-height: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-right: 1px dashed #eee;
    }

    .list li .youInfo .a2 {
        flex: 1;

        line-height: 1.4rem;
        padding-left: 0.5rem;
    }

    .list li .youInfo::before {
        content: '';
        width: 7px;
        height: 14px;

        border: 1px solid #eee;
        border-radius: 0 20px 20px 0;
        border-left: 1px solid transparent;
        background-color: #f5f5f5;
        position: absolute;
        left: 0px;
        bottom: 1.2rem;
    }

    .list li .youInfo::after {
        content: '';
        width: 7px;
        height: 14px;
        position: absolute;
        border: 1px solid #eee;
        border-radius: 20px 0 0 20px;
        border-right: 1px solid transparent;
        background-color: #f5f5f5;
        position: absolute;
        right: 0px;
        bottom: 1.2rem;
    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .list li .foot div {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;

        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #FF9D19;
        margin-right: 0.4rem;
        color: #FF9D19;


    }

    .toren {
        width: 100%;
        height: 5rem;

        display: flex;
        justify-content: center;
        align-items: center;

    }

    .toren img {
        width: 4rem;
        height: 3.8rem;
    }

</style>
