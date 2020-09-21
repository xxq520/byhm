<template>
    <div class="become-member">
        <mt-header :title="topnav.title">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button slot="right" @click="togetCard" style="font-size:0.5rem;">添加优惠券</mt-button>
        </mt-header>
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
                    <img src="@/assets/images/storeplat/common_labb.png" class="guajian" v-if="item.status == 0">
                    <img src="@/assets/images/storeplat/common_laba.png" class="guajian" v-else>
                    <div class="youInfo">
                        <div class="a1" v-if="item.type==2">
                            <div style="color: #FF4400;font-size: 0.8rem;">￥{{item.discountAmount}} </div>
                            <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                        </div>
                        <div class="a1" v-else>
                            <div style="color: #FF4400;font-size: 0.8rem;"> {{item.discount/10}}折</div>
                            <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                        </div>
                        <div class="a2">
                            <div>{{item.name}}</div>
                            <div>{{item.issuedNum}}张</div>
                            <div v-if="item.isForthwith==1">领取后{{item.expireTime}}天有效</div>
                            <div v-else>{{arrquxiao(item.startTime)}}-- {{arrquxiao(item.endTime)}}</div>
                        </div>

                    </div>
                    <div class="foot" v-if="item.status == 0 ">
                        <div @click="godelete(item.id)" class="btn">删除</div>
                        <div @click="goEditing(item.id)" class="btn">编辑</div>
                        <div @click="goHair(item.id,item.status)" class="btn">发放</div>
                    </div>
                    <div class="foot" v-if="item.status == 1" style="justify-content: space-between;">
                        <div>已领取{{item.claimNum}}张</div>
                        <div class="btn" @click="goHair(item.id,item.status)">停止发放</div>
                    </div>
                    <div class="foot" v-if="item.status == 3" style="justify-content: space-between;">
                        <div>已领取{{item.claimNum}}张</div>
                        <div class="btn" @click="goHair(item.id,item.status)">继续发放</div>
                    </div>
                    <div class="foot" v-if="item.status == 2">
                        <div class="btn" style="padding: 0 0.5rem;"> 已领取完</div>
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
                    title: '优惠券',
                },
                seq: this.$cookie.get('seq'),
                price: {},
                carvist: false,
                postData: {},
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: 4,
                loadshow: true,
                loadend: false,
                loading: false,
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                navlist: [{
                        name: '全部',
                        id: '4'
                    },
                    {
                        name: '未发放',
                        id: '0'
                    },
                    {
                        name: '已发放',
                        id: '1'
                    },
                ],
                list: [],
                pageNum: 1,
                merId: this.$cookie.get('merId')
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //显示 时间
            arrquxiao(val) {
            let abs = val.split(' ');
            return abs[0];
            },
                //去编辑
                goEditing(id) {
                        this.$router.push({
                            path: '/storeplat/Addcoupons',
                            query: {
                                id: id,
                                edite: 1
                            }
                        })
                    },
                    //删除
                    godelete(id) {
                        axios({
                            method: 'post',
                            url: this.Api1 + "/activity/otoMerVoucher/deleteOne",
                            data: {
                                id: id
                            },
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                Toast('删除成功')
                                this.pageNum = 1;
                                this.list = [];
                                this.loadMore()
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    },
                    //发放
                    goHair(id, status) {
                        var gaibian = status == 0 ? 1 : status == 1 ? 3 : 1
                        axios({
                            method: 'post',
                            url: this.Api1 + "/activity/otoMerVoucher/updateStatus",
                            data: {
                                id: id,
                                status: gaibian,
                            },
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            if (res.data.code == 200) {
                                this.pageNum = 1;
                                this.list = [];
                                this.loadMore()
                            }else{
                                Toast(res.data.message)
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
                    //去添加优化券
                    togetCard() {
                        this.$router.push({
                            path: '/storeplat/Addcoupons',
                            query: {
                                edite: 0
                            }
                        })
                    },

                    goback() {
                        if (this.$route.query.platform == 'android') {
                            window.action.backAPP();
                        } else if (this.$route.query.platform == 'ios') {
                            window.action.backAPPiOS();
                        } else {
                            this.$router.go(-1);
                        }
                    },
                    loadMore() {
                        this.loading = true;
                        this.loadshow = true;
                        let status = this.messagebtn == 4 ? '' : this.messagebtn;
                        axios({
                            method: 'get',
                            url: this.Api1 + "/activity/otoMerVoucher/selectMerVoucherList",
                            params: {
                                merchantId: this.merId,
                                status: status,
                                pageNum: this.pageNum,
                                pageSize: this.pageSize,
                            },
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            let data = res.data.data;
                            if (res.data.code == 200) {
                                if (data.list.length == 0) {
                                    this.loadend = true;
                                    this.loading = true;
                                    this.loadshow = false;
                                    return false;
                                };
                                this.pageNum++;
                                this.list = this.list.concat(data.list);
                                this.loading = false;
                                this.loadshow = false;
                            } else {
                                this.loadshow = false;
                            };
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

    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .62rem;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
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
        width: 33%;
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
        position: relative;
    }

    .list li .guajian {
        position: absolute;
        right: 0;
        top: 0;
        width: 2.25rem;
        height: 2.25rem;
    }

    .list li .youInfo {
        display: flex;
        padding: 0.4rem 0;
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
        padding: 0 0.5rem;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .list li .foot .btn {
        font-size: 0.58rem;
        padding: 0 0.6rem;
        height: 1.2rem;
        line-height: 1.2rem;
        border-radius: 0.3rem;
        border: 1px solid #FF9D19;
        margin-right: 0.5rem;
        color: #FF9D19;
    }

</style>
