<template>
    <div class="become-member">
        <mt-header :title="topnav.title">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button slot="right" @click="togetCard" style="font-size:0.5rem;">添加活动</mt-button>
        </mt-header>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==item.id}" @click="messagebtnfn(item.id)" v-for="item in navlist">
                {{item.name}}
            </li>
        </ul>
        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <ul class="list">
                <li v-for="(item,index) in list" :key="index"
                    >
                    <img src="@/assets/images/storeplat/common2.png" v-if="item.status==0" class="guajian">
                    <img src="@/assets/images/storeplat/common1.png" v-if="item.status==1" class="guajian">
                    <img src="@/assets/images/storeplat/common3.png" v-if="item.status==2" class="guajian">
                    <div class="youInfo">
                        <div class="left"><img src="@/assets/images/storeplat/spxx_icon_zk.png" alt=""
                                v-if="item.type==0">
                            <img src="@/assets/images/storeplat/spxx_icon_mj.png" alt="" v-else>
                        </div>
                        <div class="right">
                            <div class="name" style="font-size: 0.68rem; color: #333;"> {{item.name}} </div>
                            <div>{{item.remarks}}</div>
                            <div class="price">
                                {{arrquxiao(item.startTime)}}--{{arrquxiao(item.endTime)}}
                            </div>
                        </div>

                    </div>
                    <div class="foot" v-if="item.status != 2">
                        <div @click="godelete(item.id,item.type)" class="btn" v-if="item.status == 0 ">删除</div>
                        <div @click="goEditing(item.id,item.type)" class="btn" v-if="item.status != 2 ">编辑</div>
                        <div @click="goHair(item.id,item.status)" class="btn" v-if="item.status == 1 ">结束活动</div>
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
                    title: '活动列表',
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
                        name: '未开始',
                        id: '0'
                    },
                    {
                        name: '进行中',
                        id: '1'
                    },
                    {
                        name: '已结束',
                        id: '2'
                    },
                ],
                list: [],
                pageNum: 1,
                merId: this.$cookie.get('merId'),
                fenlei: this.$route.query.fenlei,
             

            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //去编辑
            goEditing(id, type) {
                if (type == 0) {
                    this.$router.push({
                        path: '/storeplat/Discountact',
                        query: {
                            ceryId: id
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/storeplat/fullReduction',
                        query: {
                            ceryId: id
                        }
                    })
                }
            },
            //删除
            godelete(id, type) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/activity/otoMerEvent/deleteEventById",
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
            //结束活动
            goHair(id) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/activity/otoMerEvent/updateStatus",
                    data: {
                        id: id
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('已结束此活动')
                        this.pageNum = 1;
                        this.list = [];
                        this.loadMore()
                    } else {
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
                if (this.fenlei == 0) {
                    this.$router.push({
                        path: '/storeplat/Discountact'
                    })
                } else {
                    this.$router.push({
                        path: '/storeplat/fullReduction'
                    })
                }
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
                    url: this.Api1 + "/activity/otoMerEvent/selectMerEventList",
                    params: {
                        merchantId: this.merId,
                        type :this.fenlei,
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

            arrquxiao(val) {
            let abs =  val.split(' ');
            return  abs[0];
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
        padding: 0.4rem;
        position: relative;
    }

    .list li .youInfo .left img {
        width: 3rem;
        height: 3rem;

    }

    .list li .youInfo .right {
        padding-left: 0.5rem;
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        font-size: 0.5rem;
    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        padding: 0.5rem;
        height: 2rem;

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
