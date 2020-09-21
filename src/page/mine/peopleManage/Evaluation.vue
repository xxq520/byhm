<template>
    <div class="comment">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="comment-body" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="comment-box" v-for="(item,index) in comment" :key="index">
                <div class="people-pic">
                    <img :src="item.avatar">
                </div>

                <div class="comment-main">
                    <div class="comment-top">
                        <div class="name">
                            {{ item.username }}
                        </div>
                        <div class="time">
                            {{ item.createTime }}
                        </div>
                    </div>
                    <div class="score">
                        <el-rate v-model="item.rate" disabled disabled-void-color="#c3c3c3"
                            :colors="['#f86b1f','#f86b1f','#f86b1f']"></el-rate>
                    </div>
                    <div class="comment-text">{{ item.content }}</div>
                    <div class="comment-pic">
                        <img v-for="(url,i) in item.picUrls" :key="i" :src="url" />
                    </div>
                    <div class="shop" @click="goshop(item.mchid)">
                        <div class="a2">
                            <img :src="item.logoUrl">
                        </div>
                        <div class="a1">
                            <div style="display: flex;flex-direction: column;justify-content: space-between;">
                                <div style="color: #333;font-size: 0.65rem;">{{item.mchname}}</div>
                                <div>{{item.categroyName}}</div>
                            </div>
                            <div style="display: flex;justify-content: center;align-items: center;">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    <div class="foot">
                        <div @click="cleareval(item.id)">删除评价</div>
                    </div>
                </div>
            </div>
        </div>
        <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    </div>
</template>
<script>
    export default {
        name: "comment",
        data() {
            return {
                topnav: {
                    title: '我的评价',
                },
                id: this.$route.query.id,
                comment: [],
                list: {},
                page: 1,
                size: 6,
                defheadimg: require('@/assets/images/dp_tx_nmtx.png'),
                headimg: {},
                condition: this.$route.query.condition ? this.$route.query.condition : this.$route.query.labelName ?
                    '' : '0',
                labelName: this.$route.query.labelName ? this.$route.query.labelName : '',
                loading: false,
                loadshow: true,
                loadend: false,
                userid: this.$cookie.get('userid'),
            };
        },
        mounted() {

        },
        methods: {
            // //跳转店铺详情
            goshop(val) {
                console.log(val);

                this.$router.push({
                    path: '/comment/marketDetalis',
                    query: {
                        id: val
                    }
                });
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let post = {
                    userId: this.userid,
                    pageNum: this.page,
                    pageSize: this.size,
                };
                axios({
                    url: this.Api1 + '/shop/merchantComment/userCommentList',
                    method: "get",
                    params: post,
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",

                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        if (data.list.length == 0) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        (this.page) ++;
                        this.comment = this.comment.concat(data.list);
                        console.log(this.comment);

                    };
                    this.loading = false;
                    this.loadshow = false;
                });
            },
            //删除评价
            cleareval(val) {
                let post = {
                    id: val
                };
                axios({
                    url: this.Api1 + '/shop/merchantComment/deleteComment',
                    method: "post",
                    data: post,
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                }).then(res => {

                    if (res.data.code == 200) {

                        this.comment = [];
                        this.page = 1;
                        this.loadMore();
                        Toast('评价已删除')
                    }
                })
            },
            // 输出时间日期
            formData(time) {
                if (time) {
                    var date = new Date(time);
                    var Y = date.getFullYear();
                    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                    return Y + '-' + M + '-' + D;
                }
            },

        }
    }

</script>
<style scoped>
    .comment {
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;
        padding-top: 40px;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
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

    .score {
        overflow: hidden;
        width: 100%;
        padding: 0.2em 0;
        height: 1rem;
    }

    .score>>>.el-rate {
        height: auto;
        overflow: hidden;
        float: left;
    }

    .score>>>.el-rate__icon {
        font-size: 15px;
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
        font-size: 0.6rem;
        color: #666;
        float: left;
        line-height: 16px;
        padding-left: 0.5em;
    }

    .score>>>.slist span {
        font-size: 0.6rem;
        color: #ccc;
        padding: 0 10px;
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
        margin-bottom: 0.5rem;
    }

    .comment-pic img {

        width: 30%;
        height: 3.75rem;
        border-radius: 0.416667rem;
        margin-right: 0.35rem;
        margin-bottom: 0.4rem;
    }

    .foot {
        display: flex;
        justify-content: flex-end;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .foot div {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #ddd;
        margin-right: 0.4rem;


    }

    .shop {
        background-color: #f5f5f5;
        display: flex;
        padding: 0.3rem 0;
        font-size: 0.58rem;
        color: #666;

    }

    .shop .a2 {
        width: 2.2rem;
        height: 2.2rem;
        margin-right: 0.5rem;
        margin-left: 0.5rem;
    }

    .shop .a2 img {
        width: 100%;
        height: 100%;
        border-radius: 0.2rem;
    }

    .shop .a1 {
        flex: 1;
        display: flex;
        justify-content: space-between;
    }

</style>
