<template>
    <div class="become-member">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==item.id}" @click="messagebtnfn(item.id)" v-for="item in navlist">
                {{item.name}}
            </li>
        </ul>
        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="80">
            <ul class="list">
                <li v-for="(item,index) in list" :key="index">
                    <div class="merchandise">
                        <div class="left">
                            <img :src="item.goodsImgUrl" alt="">
                            <div class="gaoxin" v-if="item.isSoldOut">已告罄</div>
                        </div>
                        <div class="right">
                            <div class="shopname">
                                {{item.goodsName}}
                            </div>
                            <div class="price">
                                <div style="color: #ff4400;align-self: flex-end;"> ￥{{item.goodsPrice}} </div>
                                <div class="img" v-if="item.putawayStatus ==0&&item.isAvailable"
                                    @click="Onshelf(item.goodsSn)">
                                    <img src="@/assets/images/storeplat/by_page2_ic.png">
                                    <div>上架</div>
                                </div>
                                <div class="img" v-if="item.putawayStatus ==1" @click="Offshelf(item.goodsSn)">
                                    <img src="@/assets/images/storeplat/by_page2_ix.png">
                                    <div>下架</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="yuanyin" v-if="item.putawayStatus ==0&&!item.isAvailable">
                        <div>该商品被平台下架，且不可重新上架</div>
                        <div>下架原因：{{item.region}}</div>
                    </div>
                    <div class="foot">
                        <div class="bnt " @click="kaimove(item.goodsSn,1)">上移</div>
                        <div class="bnt " @click="kaimove(item.goodsSn,2)">下移</div>
                        <div class="bnt " @click="quadmin(item.goodsSn)">编辑</div>
                        <div class="bnt " @click="deletes(item.goodsSn)">删除</div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
            </div>
        </div>
        <div class="footer">
            <div class="abs" @click="getDetalis()"><img src="@/assets/images/storeplat/sj_icon_fla.png"> 分类管理</div>
            <div class="abs" @click="getcomMent()"><img src="@/assets/images/storeplat/sj_icon_flb.png"> 发布商品</div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '商品管理',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                id: this.$route.query.id,
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
                        name: '上架中',
                        id: '1'
                    },
                    {
                        name: '已下架',
                        id: '2'
                    },
                ],
                list: [],
                popupVisible: false,
                payShow: false,
                paiWay: 1,
                tapShow: false,
                couAmount: ''

            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //编辑商品
            quadmin(id) {
                this.$router.push({
                    path: '/storeplat/comMent',
                    query: {
                        goodSn: id
                    }
                })
            },
            //上架商品
            Onshelf(id) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/putOnShelf",
                    data: {
                        goodsSn: id,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('上架成功')
                        this.pageNum = 1;
                        this.list = [];
                        this.loadMore();
                    }
                })
            },
            //下架商品
            Offshelf(id) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/offShelf",
                    data: {
                        goodsSn: id,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('下架成功')
                        this.pageNum = 1;
                        this.list = [];
                        this.loadMore();
                    }
                })
            },
            //删除商品
            deletes(id) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/delete",
                    data: {
                        goodsSn: id,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('删除成功')
                        this.pageNum = 1;
                        this.list = [];
                        this.loadMore();
                    }else{
                        Toast(res.data.message)
                    }
                })
            },
            //上移下移
            kaimove(id, index) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/moveGoods",
                    data: {
                        goodsSn: id,
                        status: index,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": "application/json; charset=UTF-8",
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('操作成功')
                        this.pageNum = 1;
                        this.list = [];
                        this.loadMore();
                    }
                })
            },
            //发布商品
            getcomMent() {
                this.$router.push({
                    path: '/storeplat/comMent'
                })
            },
            //去分类管理
            getDetalis() {
                this.$router.push({
                    path: '/storeplat/Classified'
                })
            },
            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                this.pageNum = 1;
                this.list = [];
                this.loadMore();
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/queryMerGoodsList",
                    data: {
                        merId: this.id,
                        status: this.messagebtn,
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
        height: 100%;
        padding-top: 40px;
        overflow: hidden;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }

    .managebtn {
        width: 100%;
        margin-bottom: 0.4rem;
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
        border-top: 1px solid #f5f5f5;
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
        width: 50%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 25%;
    }

    .managebtn li.hover p {
        color: #ff6e04;
    }


    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;

    }

    .mint-popup {
        width: 70%;
    }

    .itembox {
        height: calc(100% - 6rem);
        overflow: auto;
    }

    .list li .merchandise {
        padding: 0.4rem;
        display: flex;
        border-bottom: 1px solid #f5f5f5;
    }

    .list li .merchandise .left {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.3rem;
        overflow: hidden;
        position: relative;
    }

    .list li .merchandise .left .gaoxin {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        font-size: 0.58rem;
        position: absolute;
        left: 0;
        top: 0;
        line-height: 3rem;
        text-align: center;

    }

    .list li .merchandise .left img {
        width: 3rem;
        height: 3rem;
    }


    .list li .merchandise .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 0.4rem;
        width: calc(100% - 3.5rem);

    }

    .list li .merchandise .right .shopname {
        flex-wrap: wrap;
        line-height: 0.85rem;
        max-height: 1.7rem;
        overflow: hidden;
        width: 100%;
    }

    .list li .merchandise .right .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list li .merchandise .right .price img {
        width: 0.85rem;
        height: 0.85rem;
    }

    .list li .merchandise .right .price .img {
        color: #999;
        font-size: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 0.2rem;
    }

    .topNav>>>.mint-header-button {
        flex: none;
    }

    .list li .yuanyin {
        width: 100%;
        height: 2rem;
        line-height: 1rem;
        text-align: center;
        font-size: 0.5rem;
        color: #999;
        border-bottom: 1px solid #f5f5f5;

    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        height: 2rem;
        line-height: 2rem;
        align-items: center;
        border-bottom: 1px solid #eee;

    }

    .list li .foot .bnt {
        font-size: 0.58rem;
        padding: 0 0.6rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.3rem;
        color: #ff9d19;
        margin-right: 0.4rem;
        background-color: #FFF8CC;
    }

    .footer {
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 0.62rem;
        margin: 0.8rem 0;
    }

    .footer .abs {
        width: 38%;
        height: 1.5rem;
        background-color: #ff9d19;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.7rem;

    }

    .footer .abs img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.3rem;
    }

</style>
