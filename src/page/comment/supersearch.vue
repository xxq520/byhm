<template>
    <div class="mainbox">
        <topnav :topnav="topnav" class="topnav"></topnav>
        <div class="search">
            <div class="searhed">
                <i class="el-icon-search"></i>
                <input type="text" placeholder="查找商家\商品" v-model="search" @focus="searhed" @blur="submitfn" />
                <i class="el-icon-circle-close" v-show="close" @click="closefn"></i>
            </div>
            <!-- <div @click=" submitfn">搜索</div> -->
        </div>
        <div class="maix">
            <div class="tabnav">
                <ul class="tabnav-list">
                    <li :class="{'hover':tabnavText=='classify' && linevist}" @click="tabnav('classify')">
                        <a>
                            {{ categoryName==''?'综合排序':categoryName }}
                            <i :class="tabnavText=='classify' && linevist?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                        </a>
                    </li>
                </ul>
                <div class="tabnav-main" v-if="morevist">
                    <!--分类，附近，排序-->
                    <div class="tn-line" v-show="linevist">
                        <div v-for="(item,i) in line" :key="i" class="line" :class="{'hover': category == item.sortId}"
                            @click="linefn($event,item)">{{item.sortName }}</div>
                    </div>
                </div>
            </div>
            <div class="chanpinlist">
                <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                    infinite-scroll-distance="3">
                    <!---->
                    <li class="goodlist" v-for="(item,index) in list" :key="index">
                        <div class="goodbox" @click="goShopDetail(item)">
                            <div class="goodimg">
                                <img :src="item.logoUrl" />
                            </div>
                            <div class="goodtext">
                                <div class="goodname">{{ item.name}}</div>
                                <div style="color: #FF8245; font-size: 0.62rem;">{{ item.avgScore }}</div>
                                <div style="color: #999; font-size: 0.62rem;">{{categoryfn(item.distance) }}</div>
                            </div>
                        </div>
                    </li>
                </div>
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
                <div class="nodata" v-if="nodata">暂无数据</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searh",
        data() {
            return {
                topnav: {
                    title: "商店搜索"
                },
                close: false,
                search: "",
                history: [],
                urllength: new Number(this.$route.query.urllength),
                loading: false,
                list: [],
                loadshow: true,
                lng: "",
                lat: "",
                page: 1,
                size: 8,
                sidx: "id",
                order: "desc",
                category: 1,
                categoryName: "",
                categoryPost: [{
                    id: "",
                    name: "全部"
                }],
                loadend: true,
                nodata: false,
                levelid: this.$cookie.get("level_id") ? this.$cookie.get("level_id") : 1,
                userId: this.$cookie.get("userid"),
                linevist: false,
                morevist: false,
                youhuiShow: false,
                tabnavText: "",
                line: [],
                score: 5,
                sortStatus: 1,
                keyword: ""
            };
        },
        mounted() {
            let that = this;
            let index = 1;
            let timer = setInterval(() => {
                index++;
                if (
                    (sessionStorage.getItem("cityMap") &&
                        sessionStorage.getItem("LngLats")) ||
                    index > 10
                ) {
                    clearInterval(timer);
                    let prov = sessionStorage.getItem("provMap");
                    let district = sessionStorage.getItem("distMap");
                    let LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
                    let cityMap = sessionStorage.getItem("cityMap");
                    that.lng = LngLats && LngLats.lng ? LngLats.lng : "";
                    that.lat = LngLats && LngLats.lat ? LngLats.lat : "";
                    that.city = cityMap;
                    that.prov = prov;
                    that.district = district;
                    this.address = sessionStorage.getItem("address");
                    let ides = this.address.indexOf("省");
                    if (ides > -1) {
                        this.address = this.address.substring(ides + 1);
                    }
                }
            }, 100);
            this.getbunner();
        },
        methods: {
            //获取轮播图
            getbunner() {
                let post = {
                    category: "1010"
                };
                axios({
                    method: "post",
                    url: this.Api1 + "/home/businessSuper/homePage",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    data: post
                }).then(res => {
                    this.banner = res.data.data.listBanner;
                    this.tubiao = res.data.data.listCategory;
                    this.categoryPost = res.data.data.listSortLeft;
                });
            },
            //跳转去商家详情
            goShopDetail(val) {
                if (val.category == "1010" && val.productNum > 0) {
                    this.$router.push({
                        path: "/comment/marketDetalis",
                        query: {
                            id: val.merId
                        }
                    });
                } else {
                    this.$router.push({
                        path: "/shopDetails",
                        query: {
                            id: val.merId
                        }
                    });
                }
            },
            //展开优惠信息
            getYouhui(item, val) {
                item.isShowExtra = !item.isShowExtra;
            },
            closefn() {
                this.search = "";
                $(".searhed input").focus();
                this.close = false;
            },
            blurfn() {},
            searhed() {
                this.close = true;
            },
            submitfn() {
                this.list = [];
                this.page = 1;
                this.keyword = this.search;
                this.loadMore();
            },
            tabnav(val) {
                switch (val) {
                    case "classify":
                        this.line = this.categoryPost;
                        this.morevist = !this.morevist;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                }
                this.tabnavText = val;
            },
            // 头部导航详细选择
            linefn(elem, obj) {
                var el = elem.currentTarget;
                $(el)
                    .siblings()
                    .removeClass("hover");
                $(el).addClass("hover");
                this.list = [];
                this.page = 1;
                this.morevist = false;
                this.nodata = false;
                this.loadend = false;
                console.log(obj);
                this.lineClick(obj);
            },
            // 头部导航详细选择后，刷新数据
            lineClick(obj) {
                switch (this.tabnavText) {
                    case "classify":
                        this.urllength--;
                        this.category = obj.sortId;
                        this.categoryName = obj.sortName;
                        this.linevist = false;
                        this.morevist = false;
                        this.list = [];
                        this.page = 1;
                        this.name = "";
                        this.loadMore();
                        break;
                }
            },
            loadMore() {
                this.searchShow = true;
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let post = {
                    category: "1010",
                    lng: this.lng,
                    lat: this.lat,
                    pageNum: this.page,
                    pageSize: this.size,
                    sortStatus: this.sortStatus,
                    sortId: this.category,
                    keyword: this.keyword
                };
                axios({
                    method: "post",
                    url: this.Api1 + "/shop/businessSuper/list",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    data: post
                }).then(res => {
                    let data = res.data.data;
                    this.loadshow = false;
                    if (data.list.length == 0) {
                        this.loadend = true;
                        this.loading = true;
                        this.loadshow = false;
                        return false;
                    }
                    this.page++;
                    this.list = this.list.concat(data.list);
                    this.loading = false;
                    this.loadshow = false;
                });
            },
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 100) / 100 + "km";
                    } else {
                        distance = distance + "m";
                    }
                    return distance;
                }
            }
        }
    };

</script>

<style scoped>
    .mainbox {
        overflow: visible;
        padding-top: 40px;
        min-height: 100vh;
        background: #fff;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .search {
        overflow: hidden;
        padding: 0.5rem;
        background: #fff;
        font-size: 0.65rem;
        width: 100%;
    }

    .searhed {
        display: block;
        height: 1.3rem;
        padding: 5px 0.5rem;
        border-radius: 2em;
        width: calc(100% - 1rem);
        margin: 0 auto;
        background-color: #eee;
    }

    .searhed input {
        float: left;
        background: transparent;
        color: #856d54;
        font-size: 14px;
        width: calc(100% - 3rem);
    }

    .searhed i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 2px;
        font-size: 14px;
    }

    .searhed i.el-icon-circle-close {
        float: right;
    }

    .chanpinlist {
        overflow: hidden;
    }

    .cpbox {
        overflow: hidden;
        background: white;
    }

    .nodata {
        text-align: center;
        color: #999;
        font-weight: bold;
        font-size: 0.7rem;
        padding-top: 1rem;
    }

    .tabnav {
        width: 100%;
        background: white;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 40px;
    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .tabnav ul.tabnav-list li {
        overflow: hidden;
        text-align: center;
        /* flex-grow: 1; */
        width: 35%;
    }

    .tabnav ul.tabnav-list li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0.7em 0;
        color: #666;
    }

    .tabnav ul.tabnav-list li.hover a {
        color: #f86b1f;
    }

    .tabnav-main {
        overflow: hidden;
        z-index: 99;
        background: rgba(0, 0, 0, 0.4);
        height: 90vh;
        width: 100%;
        position: absolute;
        top: 55px;
    }

    .tabnav-main .tn-line {
        overflow: hidden;
        padding: 0 10px;
        max-height: 40vh;
        overflow: auto;
        background-color: #fff;
        border-top: 1px solid #eee;
    }

    .tabnav-main .tn-line::-webkit-scrollbar {
        display: none;
    }

    .tabnav-main .tn-line .line {
        font-size: 0.6rem;
        border-bottom: 1px solid #eee;
        padding: 0.6em 0;
        color: #333;
    }

    .tabnav-main .tn-line .hover {
        color: #f86b1f;
    }

    .tabnav-main .tn-more {
        padding-bottom: 0.5em;
        color: #333;
    }

    .tabnav-main .morelist {
        overflow: hidden;
        font-size: 0.6rem;
    }

    .tabnav-main .morelist .moretitle {
        overflow: hidden;
        padding: 0.5em 0;
    }

    .tabnav-main .morelist .morebox {
        overflow: hidden;
        width: calc(100% + 0.4em);
    }

    .tabnav-main .morelist .morebox p {
        float: left;
        min-width: calc(25% - 0.4em);
        margin: 0 0.4em 0.4em 0;
        text-align: center;
        line-height: 2.2em;
        border: 1px solid #e9e9e9;
    }

    .tabnav-main .morelist .morebox p.hover {
        color: #f86b1f;
        border-color: #f86b1f;
    }

    /* goodlist */
    .goodlist {
        display: block;
        background: white;
        overflow: hidden;
        padding: 0.4rem;

        border-bottom: 1px solid #e9e9e9;
    }

    .goodlist .goodbox {
        overflow: hidden;
    }

    .goodlist .goodbox .goodimg {
        float: left;
        width: 3.75rem;
        height: 3.75rem;
        overflow: hidden;
        border-radius: 0.4em;
        background: #e9e9e9;
    }

    .goodlist .goodbox .goodimg img {
        display: block;
        width: 100%;
        height: 100%;
    }

    .goodlist .goodbox .goodtext {
        float: right;
        width: calc(100% - 4.2rem);
        display: -webkit-flex;
        min-height: 3.8rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .goodlist .goodbox .goodname {
        font-size: 0.62rem;
        line-height: 1.2em;
        margin-bottom: 0.2rem;
        display: -webkit-flex;
        display: flex;
    }

</style>
