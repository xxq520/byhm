<template>
    <div class="become-member">
        <!-- 头部 -->
        <mt-header :title="topnav.title">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button slot="right" @click="changeTab">取消收藏</mt-button>
        </mt-header>

        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <ul class="list">
                <div class="nodata" v-if="!list.length"><img src="@/assets/images/xinx-img.png"></div>
                <li v-for="(item,index) in list" :key="index">
                    <div class="shopInfo" @click="goshop(item)">
                        <div class="left"><img :src="item.logoUrl"></div>
                        <div class="right">
                            <div class="a1">
                                <div>{{item.merchantName}} </div>
                                <div> {{categoryfn(item.distance)}} </div>
                            </div>
                            <div class="a1">
                                <div> {{item.grade}}分</div>
                                <input id="fxk" class="Checkbox" type="checkbox" :value="item.id"
                                    @click.stop="checkedOneFn()">
                            </div>
                        </div>
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
                    title: '我的收藏',
                },
                seq: this.$cookie.get('seq'),
                carvist: false,
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                loadshow: true,
                loadend: false,
                loading: false,
                page: 1, //当前页
                pageSize: 8, //每页显示行数

                list: [],
                LngLats: {}


            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            // //跳转店铺详情
            goshop(val) {
                     
                     
                    this.$router.push({
                        path: '/comment/marketDetalis',
                        query: {
                            id: val.merchantId
                        }
                    });
            },
            //
            loadMore() {
                let that = this;
                that.LngLats = JSON.parse(sessionStorage.getItem('LngLats'));
                this.loading = true;
                this.loadshow = true;
                let post = {
                    lng: this.LngLats.lng,
                    lat: this.LngLats.lat,
                    userId: this.userid,
                    pageNum: this.page,
                    pageSize: this.pageSize
                };
                axios({
                    method: 'get',
                    url: this.Api1 + '/shop/otoCollect/selectCollectList',
                    params: post,
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
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

            goback() {
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else {

                    this.$router.go(-1);

                }
            },
            //取消收藏
            changeTab() {
                var kaka = []; //定义一个数组
                $('input[type="checkbox"]:checked').each(function () {
                    kaka.push($(this).val());
                })
                if(kaka.length==0){
                   return;
                }
                let post = {
                    ids: kaka
                };
                axios({
                    method: 'post',
                    url: this.Api1 + '/shop/otoCollect/deleteBatch',
                    data: post,
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.list = [];
                        this.page = 1;
                        this.loadMore();
                        Toast('已取消收藏该店铺')

                    }
                })
            },
            checkedOneFn() {

            },
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 10) / 10 + 'km';
                    } else {
                        distance = distance + 'm';
                    }
                    return distance;
                }
            },

        }

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


    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
    }

    .list li .shopInfo {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.3rem;

    }

    .list li .shopInfo .left {
        width: 22%;
        height: 3rem;
        border-radius: 5px;
        overflow: hidden;

    }

    .list li .shopInfo .left img {
        width: 100%;
        height: 100%;

    }

    .list li .shopInfo .right {
        flex: 1;
        padding-left: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list li .shopInfo .right .a1 {
        line-height: 1.1rem;
        display: flex;
        justify-content: space-between;
        position: relative;

    }

    #fxk {
        width: 18px;
        height: 18px;
        background-color: #fff;
        border: 1px solid #c9c9c9;
        border-radius: 9px;
        color: #fff;
        text-align: center;
        line-height: 18px;
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        margin: 0 5px;
    }

    #fxk[type="checkbox"]:hover {
        border: 1px solid #ff911e;
    }

    #fxk:checked {
        color: #fff;
        background-color: #ff911e;
        border: 1px solid #ff911e;
    }

    #fxk:after {
        content: "\2713";
    }

</style>
