<template>
    <div class="mainbox" >
        <mt-header :title="topnav.title" class="top">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button icon="more" slot="right" @click="changeTab"></mt-button>
        </mt-header>
        <!--  -->
        <div class="topTab" v-if="isShow">
            <p @click="getAllinfo">一键已读</p>
            <p @click="getAlldelete">一键删除</p>
        </div>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==0}" @click="inviteAll"> 全部({{totalCount}}) </li>
            <li :class="{'hover':messagebtn==1}" @click="inviteByMe">收益({{profitCount}}) </li>
        </ul>
        <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
            <div class="itembox" v-else>
                <ul>
                    <li v-for="(item,index) in list" :key="index">
                        <div  @click="getinfo(item.id)">
                            <p><span>{{item.msgName}}<i v-if="item.isRead==0">未读</i></span>
                                <span @click.stop="getdelete(item.id)"><img
                                        src="@/assets/images/xxzy_icon_del.png"></span>
                            </p>
                            <p><span>{{item.content}}</span></p>
                            <p style="color:#999;">{{item.createTimeStr}}</p>
                        </div>
                    </li>
                </ul>
                <loading :load.sync="loadshow"></loading>
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
                    title: '消息中心',
                },
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
                totalCount: '',
                profitCount: ''
            }
        },
        mounted() {
            
         window.addEventListener("scroll", this.handleScroll);
        },
        methods: {
            handleScroll() {
            console.log('1')
            },
            goback() {
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
            //一键已读
            getAllinfo() {
                this.isShow = false
                MessageBox({
                    title: '温馨提示',
                    message: "您确定把全部消息标注为已读消息吗",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    closeOnClickModal: false
                }).then(action => {
                    if (action === 'confirm') {
                        this.getAllyidu()
                    }

                });
            },
            getAllyidu() {
                axios({
                    method: 'get',
                    url: this.Api + "message/updateIsRead",
                    params: {
                        userId: this.userId
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {


                    if (res.data.code == 0) {
                        if (this.messagebtn == 0) {
                            this.inviteAll()
                        }
                        if (this.messagebtn == 1) {
                            this.inviteByMe()
                        }
                        Toast(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                })
            },
            //一键删除
            getAlldelete() {
                this.isShow = false
                MessageBox({
                    title: '温馨提示',
                    message: "您确定把全部消息删除吗？",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    closeOnClickModal: false
                }).then(action => {
                    if (action === 'confirm') {
                        this.getAllde()
                    }

                });
            },
            getAllde(id) {
                axios({
                    method: 'get',
                    url: this.Api + "message/deleteMessage",
                    params: {
                        userId: this.userId
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    console.log(res, '10')
                    if (res.data.code == 0) {
                        if (this.messagebtn == 0) {
                            this.inviteAll()
                        }
                        if (this.messagebtn == 1) {
                            this.inviteByMe()
                        }
                        Toast(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                })
            },
            //全部
            inviteAll() {
                this.isShow = false;
                this.messagebtn = 0;
                this.xinType = '';
                this.list = [];
                this.pageNum = 1;
                this.loadMore();

            },
            // 收益
            inviteByMe() {
                this.isShow = false;
                this.messagebtn = 1;
                this.xinType = 1;
                this.list = [];
                this.pageNum = 1;
                this.loadMore();
            },
            //已读
            getinfo(id) {
                axios({
                    method: 'get',
                    url: this.Api + "message/info",
                    params: {
                        id: id
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    // console.log(res, '8')
                    if (res.data.code == 0) {
                        if (this.messagebtn == 0) {
                            this.inviteAll()
                        }
                        if (this.messagebtn == 1) {
                            this.inviteByMe()
                        }
                        Toast(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                })
            },
            //单个删除
            getdelete(id) {
                axios({
                    method: 'get',
                    url: this.Api + "message/delete",
                    params: {
                        id: id
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    // console.log(res, '12')
                    if (res.data.code == 0) {
                        if (this.messagebtn == 0) {
                            this.inviteAll()
                        }
                        if (this.messagebtn == 1) {
                            this.inviteByMe()
                        }
                        Toast(res.data.msg)
                    } else {
                        Toast(res.data.msg)
                    }
                })
            },
            changeTab() {
                this.isShow = !this.isShow;
            },

            loadMore() {
                this.loading = true;
                this.loadshow = true;
                axios({
                    method: 'get',
                    url: this.Api + "message/list",
                    params: {
                        userId: this.userId,
                        type: this.xinType,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    let data = res.data;
                    this.totalCount = data.noReadCount.totalCount
                    this.profitCount = data.noReadCount.profitCount

                    if (data.code == 0) {
                        if (this.pageNum > data.data.totalPage) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        this.pageNum++;
                        this.list = this.list.concat(data.data.list);
                        this.loading = false;
                        this.loadshow = false;
                    } else {

                        this.loadshow = false;
                    };
                })

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
    .top {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
    }

    .top i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .topTab {
        position: absolute;
        right: .4444rem
            /* 20/45 */
        ;
        width: 3.7778rem
            /* 170/45 */
        ;
        background-color: #616161;
        border-radius: .4444rem
            /* 20/45 */
        ;
        top: 40px;
        padding: 0 .3333rem
            /* 15/45 */
        ;
    }

    .topTab::after {
        content: '';
        position: absolute;
        right: .4444rem
            /* 20/45 */
        ;
        top: -5px;
        width: 0;
        height: 0;
        border-right: .4rem solid transparent;
        border-left: .4rem solid transparent;
        border-bottom: .5rem solid #616161;

    }

    .topTab p {
        height: 1.3333rem
            /* 60/45 */
        ;
        line-height: 1.3333rem
            /* 60/45 */
        ;
        border-bottom: 1px solid #1c1c1c;
        color: #ffffff;
        font-size: .4889rem
            /* 22/45 */
        ;
        text-align: center;
    }

    .topTab p:last-child {
        border-bottom: none;
    }

    .mainbox {
        overflow-y:scroll;
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

    .managebtn {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top:1.6rem;
        margin-bottom: 0.3rem;
    }


    .managebtn li {
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
        width: 3.1111rem;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: -7px;
    }


    .maixBox {
        background-color: #fff;
        padding: 0 .4444rem
            /* 20/45 */
        ;
    }

    .maixBox ul li {
        border-bottom: 1px solid #eeeeee;
        padding: .6667rem 0;

    }

    .maixBox ul li img {
        width: 0.9rem;
        height: 1rem;
        ;

    }

    .maixBox ul li p {
        display: flex;
        justify-content: space-between;
        font-size: .5333rem;
        line-height: 0.8rem;
        color: #666666;
    }

    .maixBox ul li p:first-child {
        font-size: .5778rem
            /* 26/45 */
        ;
        color: #333333;
        height: 1.3rem;
        line-height: 1.3rem;
        padding-bottom: .2rem;

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
