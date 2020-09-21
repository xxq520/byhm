<template>
    <div class="become-member">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
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
                    <div class="shopInfo">
                        <div class="left"><img :src="item.logoUrl"></div>
                        <div class="right">
                            <div class="a1">
                                <div>{{item.merchantName}} </div>
                                <div> {{categoryfn(item.distance)}}</div>
                            </div>
                            <div class="a1">
                                <div> {{item.grade}}</div>
                                <div>{{item.categoryName}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="youInfo">
                        <div class="a1" v-if="item.type==2">
                            <div style="color: #FF4400;font-size: 0.85rem;">￥{{item.discountAmount}} </div>
                            <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                        </div>
                        <div class="a1" v-else>
                            <div style="color: #FF4400;font-size: 0.85rem;"> {{item.discount}}折</div>
                            <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                        </div>
                        <div class="a2">
                            <div style="display: flex;justify-content: space-between;">
                                <div style="font-size: 0.72rem;"> {{item.name}} </div>

                            </div>
                            <div style="color:#999;">限：{{formData(item.startTime)}}-{{formData(item.endTime)}}</div>
                        </div>
                    </div>
                    <div class="foot">
                          <div class="named" v-if="item.isGet==1">去使用</div>
                          <div class="timed" @click="lingjuan(item)" v-else>立即领取</div>
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
                messagebtn: 1000,
                loadshow: true,
                loadend: false,
                loading: false,
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                navlist: [],
                list: [],
                page: 1

            };
        },
        created() {

        },
        mounted() {
            this.getfenlei()
        },
        methods: {
            //时间转化
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
            // 判断路程数目太高以计量单位粗略显示
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
            //获取分类
            getfenlei() {
                axios({
                    url: this.Api1 + '/basic/queryMerCategoryAll',
                    method: "get",
                    headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.navlist = res.data.data;
                    }
                })
            },
            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                this.page = 1;
                this.list = [];
                this.loadMore();
            },
            loadMore() {
                let that = this;
                let LngLats = JSON.parse(sessionStorage.getItem('LngLats'));
                this.loading = true;
                this.loadshow = true;
                let post = {
                    categoryId: this.messagebtn,
                    userId: this.userid,
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    lng: LngLats.lng,
                    lat: LngLats.lat,
                };
                axios({
                    url: this.Api1 + '/activity/otoMerVoucher/allVoucher',
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
                        Toast(res.data.message)
                    };
                    that.loading = false;
                    that.loadshow = false;
                })

            },
            //用户领券
            lingjuan(val) {
                let post = {
                    voucherId: val.id,
                    userId: this.userid
                }
                axios({
                    url: this.Api1 + '/user/userVoucher/getVoucher',
                    data: post,
                    method: "post",
                    headers: {
                          "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('领取成功')
                        this.page = 1;
                        this.list = [];
                        this.loadMore()
                    } else {
                        Toast(res.data.message)
                    }

                })
            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;

        overflow: hidden;

    }

    .managebtn {
        width: 100%;
        margin-top: 0.4rem;
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
        padding: .4rem 0.3rem;
        font-size: .6222rem;
        color: #333333;
        height: 2.2rem;
        line-height: 1.2rem;
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

    .list li .shopInfo {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.3rem;
    }

    .list li .shopInfo .left {
        width: 20%;
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

    }

    .list li .shopInfo .right .a1 {
        line-height: 1.1rem;
        display: flex;
        justify-content: space-between;

    }

    .list li .youInfo {
        display: flex;
        padding: 0.3rem;
        border-bottom: 1px solid #eee;
        position: relative;
    }

    .list li .youInfo .a1 {
        width: 33%;
        text-align: center;
        line-height: 1.1rem;
        border-right: 1px dashed #eee;
    }

    .list li .youInfo .a2 {
        flex: 1;

        line-height: 1.1rem;
        padding-left: 0.5rem;
    }

    .list li .youInfo::before {
        content: '';
        width: 7px;
        height: 14px;
        position: absolute;
        border: 1px solid #eee;
        border-radius: 0 20px 20px 0;
        border-left: 1px solid transparent;
        background-color: #f5f5f5;
        position: absolute;
        left: 0px;
        top: 20px;
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
        top: 20px;
    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;

    }

    .list li .foot div {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #ddd;
        margin-right: 0.4rem;


    }

</style>
