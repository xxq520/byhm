<template>
    <div class="mainbox">
        <mt-header :title="topnav.title" class="top">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button slot="right" @click="getAllinfo">全部标记为已读</mt-button>
        </mt-header>
        <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
            <div class="itembox" v-else>
                <ul>
                    <li v-for="(item,index) in list" :key="index">
                        <div @click="getinfo(item)">
                            <p>{{item.msgName}}<i v-if="item.isRead==0"></i>
                            </p>
                            <p><span>{{item.content}}</span></p>
                            <p style="color:#999;">{{item.createTime}}</p>
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
                total: '',
                type: 0,
                count: '', //
                allLoaded: false,
                totalCount: '',
                profitCount: '',
                shopinfo: ''
            }
        },
        mounted() {


        },
        methods: {
            //返回
            golist() {
                this.allLoaded = false;
            },
            handleScroll() {

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
                    method: 'post',
                    url: this.Api1 + "/shop/message/allMessageIsRead",
                    data: {
                        userId: this.userId
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                    
                        Toast(res.data.message)
                    } else {
                        Toast(res.data.message)
                    }
                })
            },

            loadMore() {
                this.loading = true;
                this.loadshow = true;
                axios({
                    method: 'get',
                    url: this.Api1 + "/shop/message/messageList",
                    params: {
                        userId: this.userId,
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
        padding-top: 40px;
    }

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
        background-color: #f5f5f5;
        padding: 0.5rem;
    }

    .maixBox ul li {
        padding: .5rem;
        background-color: #fff;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;

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
        font-size: .5778rem;
        color: #333333;
        height: 1.3rem;
        line-height: 1.3rem;
        padding-bottom: .2rem;
        justify-content: flex-start;
        align-items: center;
    }

    .maixBox ul li p i {
        background-color: #FF4400;
        display: inline-block;
        border-radius: 50%;
        margin-left: .6667rem;
        width: 0.4rem;
        height: 0.4rem;
    }

    .maixBox ul li p .price {
        color: #ff6e04;
        font-size: .6667rem;
    }

    .maixBox ul li:last-child {
        border-bottom: none;
    }

    .xiangqing {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: #f5f5f5;
        padding-top: 50px;

    }

    .xiangqing .cont {
        background-color: #fff;
        font-size: 0.6rem;
        color: #666;
        padding: 0.5rem;
        height: 100%
    }

    .xiangqing .foot {
        position: absolute;
        left: 30%;
        bottom: 5%;
        width: 40%;
        line-height: 1.6rem;
        text-align: center;
        background-color: #ff911e;
        color: #fff;
        font-size: 0.65rem;
        border-radius: 0.8rem;

    }

</style>
