<template>
    <div class="become-member">
        <!-- 头部 -->
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="score">
            <div class="slist">商家评分<span style="color: #FF4400;">{{ review.merchantGrade }}</span>
            </div>
            <el-rate v-model="score" disabled text-color="#f86b1f" :colors="['#f86b1f', '#f86b1f', '#f86b1f']">
            </el-rate>
        </div>
        <ul class="managebtn">
            <li :class="{'active':messagebtn==0}" @click="messagebtnfn(0)">
                全部({{inferior.totalCount}})
            </li>
            <li :class="{'active':messagebtn==2}" @click="messagebtnfn(2)">
                好评({{inferior.goodsCount}})
            </li>
            <li :class="{'active':messagebtn==1}" @click="messagebtnfn(1)">
                差评({{inferior.inferiorCount}})
            </li>
            <li :class="{'active':messagebtn==3}" @click="messagebtnfn(3)">
                有图({{inferior.havePicCount}})
            </li>
        </ul>
        <div class="comment-body" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="comment-box" v-for="(item,index) in comment" :key="index">
                <div class="people-pic">
                    <img :src="item.avatar" v-if="!!item.avatar">
                    <img src="@/assets/images/dp_tx_nmtx.png" v-else>
                </div>
                <div class="comment-main">
                    <div class="comment-top">
                        <div class="name">
                            {{ item.username }}
                        </div>
                    </div>
                    <div class="score" style="padding: 0; ">
                        <el-rate v-model="item.rate" disabled disabled-void-color="#c3c3c3"
                            :colors="['#f86b1f','#f86b1f','#f86b1f']"></el-rate>
                        <div class="slist" style="line-height: 1rem ;font-size: 0.55rem;color: #999;">
                            {{ item.createTime }}
                        </div>
                    </div>
                    <div class="comment-text">{{ item.content }}</div>
                    <div class="comment-pic">
                        <img v-for="(url,i) in item.picUrls" :key="i" :src="url" />
                    </div>
                </div>
            </div>
        </div>
        <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '评价',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: 0,
                id: this.$route.query.id,
                loadshow: true,
                loadend: false,
                loading: false,
                pageNum: "1", //当前页
                pageSize: '6', //每页显示行数
                score:0,
                popupVisible: false,
                comment: [],
                condition: '',
                reviewLevel: 0,
                review: {},
                inferior:{}


            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //时间转换
            formData(time) {
                if (time) {
                    var date = new Date(time);
                    var Y = date.getFullYear();
                    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                    var D = date.getDate() <
                        10 ? '0' + date.getDate() : date.getDate();
                    var h = date.getHours() < 10 ? '0' + date.getHours() :
                        date.getHours();
                    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    var
                        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                    return Y + '-' + M + '-' + D;
                }
            },

            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                     this.comment = [];
                this.pageNum = 1;
        
                this.loadMore();


            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let post = {
                    merchantId: this.id,
                    reviewLevel: this.messagebtn,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                };
                axios({
                    url: this.Api1 + '/shop/merchantComment/commentList',
                    params: post,
                    method: "get",
                    headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                    },
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data.merchantComments;
                        this.review = res.data.data;
                        this.inferior = res.data.data.commentCountVO;
                        this.score = Number(this.review.merchantGrade);
                        console.log(this.score );
                        
                        if (data.list.length == 0) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        this.pageNum++;
                        this.comment = this.comment.concat(data.list);
                    }
                    this.loading = false;
                    this.loadshow = false;
                });
            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #fff;
        min-height: 100vh;
        overflow: hidden;
        padding-top: 40px;
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
        margin-top: 0.4rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0.2rem 0.5rem;
        border-bottom: 1px solid #eee;
        border-top: 1px solid #eee;
    }

    .managebtn li {
        width: 30%;
        text-align: center;
        font-size: .6222rem;
        color: #666;
        margin: 0.2rem 0;
        line-height: 1.4rem;
        text-align: center;
        background-color: #f5f5f5;
    }

    .active {
        color: #FF4400 !important;
        background-color: #FFF0EA !important;
    }

    .score {
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        padding-bottom: 0.2em;
        justify-content: space-between;
        padding: 0 0.5rem;

    }

    .score>>>.el-rate {
        height: auto;
        overflow: hidden;
        float: left;
    }

    .score>>>.el-rate__icon {
        font-size: 0.8rem;
        margin-right: 0.2em;
    }

    .score>>>.el-rate__item {
        float: left
    }

    .score>>>.el-rate__text {
        line-height: 15px;
        float: left;
    }

    .score>>>.slist {
        font-size: 0.7rem;
        color: #666;

        line-height: 2rem;
        padding-left: 0.5em;
    }

    .score>>>.slist span {
        font-size: 0.6rem;
        color: #ccc;
        padding: 0 10px;
    }

    .comment-body {
        line-height: 1rem;
    }

    .comment-box {
        display: flex;
        justify-content: space-between;
        background-color: #fff;
        padding: 0.5rem 0.3rem;
        margin-top: 10px;
        border-bottom: 1px solid #eee;
    }

    .comment-box .people-pic {
        width: 1.666667rem;
        height: 1.666667rem;
    }

    .comment-box .people-pic img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }

    .comment-box .comment-main {
        width: calc(100% - 2.5rem);

    }

    .comment-main .score>>>.el-rate .el-rate__icon {
        font-size: 0.6rem;
    }

    .comment-top {
        display: flex;
        justify-content: space-between;
        line-height: 1rem;
        height: 1rem;
        margin-top: 2px;
    }

    .comment-top .name {
        font-size: 0.583333rem;
    }

    .comment-top .time {
        font-size: 12px;
        color: #999999;
        position: relative;
    }

    .comment-top .time .yz-icom {
        width: 1.5rem;
        position: absolute;
        right: 6px;
        top: 4px;
    }

    .comment-top .name .live {
        width: 30px;
        border-radius: 10px;
        color: #ffffff;
        text-align: center;
        font-size: 12px;
        background-color: #f86b1f;
        display: inline-block;
        font-weight: normal;
        margin-left: 10px;
    }

    .comment-text {
        font-size: 0.58rem;
        color: #333333;
        margin-bottom: 0.416667rem;
        line-height: 1.2rem;
    }

    .comment-pic {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;

    }

    .comment-pic img {
        width: 3.35rem;
        height: 3.35rem;
        border-radius: 0.4rem;
        margin-right: 0.5rem;
        margin-bottom: 0.25rem;
    }

</style>
