<template>
    <div class="mainbox">
        <header class="mint-header">
            <div class="heade">
                <div class="mint-header-button is-left">
                    <button class="mint-button" @click="back">
                        <span class="mint-button-icon">
                            <i class="mintui mintui-back"></i>
                        </span>
                    </button>
                </div>
                <div class="tite">商超/便利店</div>
                <router-link to="/orientation" class="location">
                    <img src="@/assets/images/by_home_tab3.png" />
                    <span class="adress">{{address=='null'?district=='null'?city:district:address}}</span>
                    <i class="el-icon-arrow-right"></i>
                </router-link>
            </div>
        </header>
        <div class="search">
            <div class="searhed">
                <i class="el-icon-search"></i>
                <input type="text" placeholder="查找商家/商品/服务" v-model="search" @focus="searhed" />
            </div>
        </div>
        <div class="column-img" v-if="banner.length > 0">
            <mt-swipe :auto="4000" :show-indicators="false">
                <mt-swipe-item v-for="(item,i) in banner" :key="i">
                    <a @click="bannerLink(item.jumpTarget)">
                        <img :src="item.imageUrl" />
                    </a>
                </mt-swipe-item>
            </mt-swipe>
        </div>
        <!-- <div class="shounav">
            <div class="shouitem" @click="gogoods(item)" v-for="(item,y) in tubiao">
                <img :src="item.imageUrl">
                <div class="mtop">{{ item.name }}</div>
            </div>
    </div>-->
        <div class="maix">
            <div class="tabnav">
                <ul class="tabnav-list">
                    <li :class="{'hover':tabnavText=='classify' && linevist}" @click="tabnav('classify')">
                        <a>
                            {{ categoryName==''?'综合排序':categoryName }}
                            <i :class="tabnavText=='classify' && linevist?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                        </a>
                    </li>
                    <li :class="{'hover':tabnavText=='sorting' && linevist}" @click="tabnav('sorting')">
                        <a>
                            销量
                            <i :class="tabnavText=='sorting' && linevist?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
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
                                <div class="goodname">
                                    <p>{{ item.name}}</p>
                                </div>
                                <div class="score">
                                    <div class="left">
                                        <div style="color: #FF8245; margin-right: 0.3rem;">{{ item.avgScore }}</div>
                                        <div v-show="item.avgSales">月售{{item.avgSales}}</div>
                                    </div>
                                    <div class="right">
                                        <div style="margin-right: 0.3rem;">{{item.deliveryTime }}</div>
                                        <div>{{ item.distance }}</div>
                                    </div>
                                </div>
                                <div class="area">
                                    <p>{{ item.startingPriceText }}</p>
                                    <p>{{ item.deliveryFeeText }}</p>
                                </div>
                                <div class="pricebox" :class="{'ss':item.isShowExtra}">
                                    <ul>
                                        <li class="youhui" v-for="(v,i) in item.shopExtraInfoList" :key="i">
                                            <div class="act">{{v.title}}</div>
                                            <div v-for="(s,i) in v.shopLabelList" :key="i" class="act">{{s.content}}
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="col" @click.stop="getYouhui(item)">
                                        <i :class="item.isShowExtra?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </div>
                <loading v-if="!nodata" :load.sync="loadshow" :end.sync="loadend"></loading>
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
                close: false,
                search: "",
                history: [],
                urllength: new Number(this.$route.query.urllength),
                loading: true,
                list: [],
                loadshow: true,
                lng: "",
                lat: "",
                page: 1,
                size: 8,
                sidx: "id",
                order: "desc",

                category: "",
                categoryName: "",
                categoryPost: [{
                    id: "",
                    name: "全部"
                }],
                name: this.$route.query.name ? this.$route.query.name : "",
                loadend: false,
                nodata: false,
                levelid: this.$cookie.get("level_id") ? this.$cookie.get("level_id") : 1,
                linevist: false,
                morevist: false,
                youhuiShow: false,
                tabnavText: "",
                line: [],
                score: 5,
                banner: [],
                tubiao: [],
                address: "",
                sortStatus: "",
                userid: this.$cookie.get("userid"),
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
                    let ides = this.address.indexOf("市");
                    if (ides > -1) {
                        this.address = this.address.substring(ides + 1);
                    }
                    that.loadMore();
                }
            }, 100);

            this.getbunner();
        },
        methods: {
            //图标跳转至对应的查询条件
            gogoods(val) {
                this.$router.push({
                    path: "/goodClassify",
                    query: {
                        id: val.id,
                        urllength: -1
                    }
                });
            },

            // banner轮播图跳转
            bannerLink(links) {
                if (!!links) {
                    if (links.indexOf("http") >= 0 || links.indexOf("https") >= 0) {
                        window.location.href = links;
                    } else {
                        this.$router.push({
                            path: links
                        });
                    }
                }
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

            back() {
                if (this.$route.query.platform == "android") {
                    window.action.backAPP();
                } else if (this.$route.query.platform == "ios") {
                    window.action.backAPPiOS();
                } else {
                    let num = this.urllength ? this.urllength : -1;
                    this.$router.go(-1);
                }
            },

            searhed() {
                this.$router.push({
                    path: "/comment/supersearch"
                });
            },
            submitfn() {
                let text = this.search;
                if (text == "") {
                    Toast("请输入搜索关键词。");
                    return false;
                }
                this.list = [];
                this.page = 1;
                this.name = text;
                this.loadMore();
            },
            tabnav(val) {
                switch (val) {
                    case "classify":
                        this.line = this.categoryPost;
                        this.morevist = !this.morevist;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case "sorting":
                        this.line = [];
                        this.category = "";
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        if (this.linevist) {
                            this.sortStatus = 2;
                        } else {
                            this.sortStatus = 1;
                        }

                        this.list = [];
                        this.page = 1;
                        this.loadMore();

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

                this.lineClick(obj);
            },
            // 头部导航详细选择后，刷新数据
            lineClick(obj) {
                switch (this.tabnavText) {
                    case "classify":
                        this.urllength--;

                        this.category = obj.sortId;
                        this.categoryName = obj.sortName;
                        let queryData = {};
                        for (var i in this.$route.query) {
                            queryData[i] = this.$route.query[i];
                        }
                        queryData.urllength = this.urllength;
                        queryData.id = obj.id;
                        this.list = [];
                        this.page = 1;
                        this.sortStatus = "";
                        this.name = "";
                        this.loadMore();
                        break;
                }

                this.zzaofn();
            },
            zzaofn() {
                this.linevist = false;
                this.morevist = false;
            },
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
                    sortId: this.category
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
            addressfn(arr) {
                let text = "";
                arr.forEach(post => {
                    if (post) text += post;
                });
                return text;
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

    .mint-header {
        background: #ff911e;
        width: 100%;
        border-bottom: none;
        font-size: 16px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
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

    .send {
        width: 20px;
        position: relative;
        z-index: 1;
        font-size: 0.6rem;
    }

    .send img {
        display: block;
    }

    .send .right-list {
        position: absolute;
        right: -8px;
        top: -0.4em;
        font-size: 12px;
        color: red;
        line-height: 1.4em;
        min-width: 1.4em;
        background: white;
        border-radius: 2rem;
    }

    .chanpinlist {
        overflow: hidden;
    }

    .cptitle {
        padding: 0.5rem;
        border-bottom: 1px solid #d6d6d6;
        text-align: center;
    }

    .cptitle img {
        width: 9rem;
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

    /* zzao */
    .zzao {
        background: rgba(0, 0, 0, 0.4);
        height: 100vh;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .cptitle {
        background-color: #fff;
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

    .goodlist .goodbox .goodname p {
        flex: 1;
        font-size: 0.7rem;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 1em;
    }

    .goodlist .goodbox .goodname img {
        margin-left: 0.5rem;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        position: relative;
        top: 0.1rem;
    }

    .goodlist .goodbox .goodname span {
        font-size: 0.6rem;
        color: #999;
    }

    .goodlist .goodbox .score {
        font-size: 0.52rem;
        color: #999;
        margin-right: 0.2rem;
        display: flex;
        justify-content: space-between;
        line-height: 0.8rem;
    }

    /* >>> */
    .score {
        overflow: hidden;
        display: -webkit-flex;
        display: flex;
        align-items: center;
    }

    .score .left {
        display: flex;
        justify-content: flex-start;
        width: 50%;
    }

    .score .right {
        display: flex;
        justify-content: flex-end;
        width: 50%;
    }

    .score>>>.slist {
        font-size: 0.58rem;
        color: #999;
        float: left;
        line-height: 0.58rem;
        padding-left: 0.5em;
    }

    .score>>>.slist span {
        font-size: 0.6rem;
        color: #ccc;
        padding: 0 10px;
    }

    /* area */
    .area {
        overflow: hidden;
        font-size: 0.52rem;
        color: #999;
        display: flex;
        justify-content: flex-start;
        line-height: 0.8rem;
    }

    .area p {
        margin-right: 0.5rem;
    }

    .pricebox {
        font-size: 0.58rem;
        display: flex;
        height: 1rem;
        overflow: hidden;
    }

    .ss {
        height: auto;
    }

    .pricebox ul {
        flex: 1;
    }

    .pricebox .col {
        width: 10%;
        text-align: center;
        color: #ff8245;
    }

    .pricebox .a1 {
        flex: 1;
        overflow: hidden;
        height: 1rem;
    }

    .pricebox .a2 {
        flex: 1;
        overflow: hidden;
    }

    .pricebox ul .youhui {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.2rem;
    }

    .pricebox ul .youhui .act {
        padding: 0.1rem 0.2rem;
        background-color: #fff0ea;
        color: #ff8245;
        margin-right: 0.3rem;
    }

    .mint-header .heade {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mint-header .heade .tite {
        flex: 1;
        text-align: center;
    }

    .mint-header-button {
        -webkit-box-flex: 0.12;
        -ms-flex: 0.12;
        flex: 0.12;
    }

    .mint-header .location {
        color: #fff;
        text-align: left;
        display: flex;
        align-items: center;
        font-size: 0.55rem;
    }

    .location i.el-icon-caret-bottom {
        float: left;
        font-size: 14px;
        padding-top: 1px;
    }

    .location img {
        width: 0.5rem;
        height: 0.6rem;
        margin-right: 0.1rem;
    }

    .mint-button {
        height: 1.5rem;
    }

    .location>>>.mint-button-text {
        padding-top: 0.2em;
        display: block;
    }

    .column-img>>>.mint-swipe {
        width: 100%;
        min-height: 110px;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .column-img>>>.mint-swipe-items-wrap {
        width: 90%;
        height: 90%;
        border-radius: 12px;
    }

    .column-img>>>.mint-swipe-item img {
        width: 100%;
        height: 100%;
    }

    .shounav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5rem;
        font-size: 0.5rem;
    }

    .shounav .shouitem {
        width: 19%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .shounav .shouitem .mtop {
        margin-top: 0.4rem;
    }

    .shounav .shouitem img {
        width: 75%;
    }

    .adress {
        font-size: 12px;
        float: left;
        max-width: 12em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

</style>
