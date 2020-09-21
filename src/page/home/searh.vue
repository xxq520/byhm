<template>
    <div class="mainbox">
        <!--搜索-->
        <header class="mint-header">
            <div class="mint-header-button is-left">
                <button class="mint-button" @click="back">
                    <span class="mint-button-icon">
                        <i class="mintui mintui-back"></i>
                    </span>
                </button>
            </div>
            <h1 class="mint-header-title">
                <div class="searhed">
                    <i class="el-icon-search"></i>
                    <input type="text" placeholder="查找商家/商品/服务" v-model="search" @focus="searhed"
                        @input="searhXian(search)" />
                    <i class="el-icon-circle-close" v-show="close" @click="closefn"></i>
                </div>
            </h1>
            <div class="mint-header-button is-right" @click="submitfn">搜索</div>
        </header>
        <div class="search" v-show="!searchShow">
            <div class="search-title">
                <span>历史搜索</span>
                <span class="clear" @click="clearhistory">清空</span>
            </div>
            <div class="search-box" v-show="history.length > 0">
                <span class="search-list" v-for="(item,index) in history" :key="index"
                    @click="historylist(item)">{{ item }}</span>
            </div>
        </div>
        <div class="maix" v-if="searchShow">
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
                        <div class="goodbox" @click="goshop(item)">
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
                                        <div>月售{{item.avgSales}}</div>
                                    </div>
                                    <div class="right">
                                        <div style="margin-right: 0.3rem;">{{item.deliveryTime }}</div>
                                        <div>{{ categoryfn(item.distance) }}</div>
                                    </div>
                                </div>
                                <div class="area">
                                    <p>{{ item.startingPriceText }}</p>
                                    <p>{{ item.deliveryFeeText }}</p>
                                </div>
                                <div class="pricebox">
                                    <ul :class="item.isShowExtra?'a2':'a1'">
                                        <li class="youhui">
                                            <div v-for="(v,i) in item.shopActivityList" :key="i" class="act">
                                                {{v.content}}</div>
                                        </li>
                                        <li class="youhui" v-for="(v,i) in item.shopExtraInfoList" :key="i">
                                            <div class="act">{{v.title}}</div>
                                            <div v-for="(s,i) in v.shopLabelList" :key="i" class="act">{{s.content}}
                                            </div>
                                        </li>
                                    </ul>
                                    <div class="col" @click.stop="getYouhui(item,index)">
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
        <div class="sclist" v-show="scShow">
            <li v-for="(item,index) in sclist" class="listd" @click="goshop(item)">
                <div class="fuc" style=" display:flex;">
                    <div style="color:#666; margin-right: 1rem;">
                        <span>{{item.name.slice(0,item.name.toLowerCase().indexOf(search.toLowerCase()))}}</span>
                        <span
                            style="color:#ff4400">{{item.name.slice(item.name.toLowerCase().indexOf(search.toLowerCase()),item.name.toLowerCase().indexOf(search.toLowerCase())+search.length)}}</span>
                        <span>{{item.name.substr(item.name.toLowerCase().indexOf(search.toLowerCase())+search.length)}}</span>
                    </div>
                </div>
                <div class="zlj">
                    <div class="a1">
                        <div style="margin-right: 0.5rem;">{{item.startingPriceText}}</div>
                        <div>{{item.deliveryFeeText}}</div>
                    </div>

                    <div>{{item.distance}}</div>
                </div>
            </li>
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
                distance: "",
                dist: "",
                order: "desc",
                sidxname: "智能排序",
                category: 1,
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
                urllength: this.$route.query.urllength ?
                    new Number(this.$route.query.urllength) :
                    -1,
                exist: "",
                searchShow: false,
                keyword: "",
                bntIndex: 0,
                scShow: false,
                sclist: [],
                hangyeShow: false,
                categoryId: ""
            };
        },
        mounted() {
            let that = this;
            let index = 1;
            let timer = setInterval(() => {
                index++;
                if (sessionStorage.getItem("LngLats") || index > 10) {
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
                }
            }, 100);

            this.addhistory();
            this.getbunner();
        },
        methods: {
            //展开优惠信息
            getYouhui(item, val) {
                item.isShowExtra = !item.isShowExtra;
            },

            //跳转去店铺详情
            goshop(val) {
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
                    this.categoryPost = res.data.data.listSortLeft;
                });
            },
            //监听搜索框
            searhXian(val) {
                if (val == "" || val == undefined) {
                    this.searchShow = false;
                    this.scShow = false;
                    return;
                }
                let post = {
                    lng: this.lng,
                    lat: this.lat,
                    keyword: val
                };
                this.sclist = [];
                axios({
                    method: "post",
                    url: this.Api1 + "/shop/businessSuper/list",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                    },
                    data: post
                }).then(res => {
                    if (res.data.code == 200) {
                        this.sclist = res.data.data.list;
                        this.scShow = true;
                    }
                });
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
            closefn() {
                this.search = "";
                $(".searhed input").focus();
                this.close = false;
            },
            blurfn() {},
            searhed() {
                this.close = true;
            },
            clearhistory() {
                this.$cookie.delete("SearchHistory");
                this.addhistory();
            },
            addhistory() {
                this.history = this.$cookie.get("SearchHistory") ?
                    JSON.parse(this.$cookie.get("SearchHistory")) :
                    [];
            },
            historylist(val) {
                this.list = [];
                this.page = 1;
                this.keyword = val;
                this.loadMore();
            },
            submitfn() {
                let searchHistory = this.$cookie.get("SearchHistory");
                let history = [];
                let num = 10;
                if (this.search == "") {
                    Toast("请输入搜索关键词。");
                    return false;
                }
                if (searchHistory == null || searchHistory == undefined) {
                    history.push(this.search);
                } else {
                    let searchArr = JSON.parse(searchHistory);

                    if (searchHistory.indexOf(this.search) == -1) {
                        if (searchArr.length > 0 && searchArr.length < num) {
                            history.push(this.search);
                            history = history.concat(searchArr);
                        } else if (searchArr.length == num) {
                            searchArr.splice(num - 1, 1);
                            history.push(this.search);
                            history = history.concat(searchArr);
                        } else {
                            history.push(this.search);
                        }
                    } else {
                        history = searchArr;
                    }
                }
                this.hangyeShow = false;
                this.list = [];
                this.page = 1;
                this.keyword = this.search;
                this.$cookie.set("SearchHistory", JSON.stringify(history), 365);
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
                        let queryData = {};
                        for (var i in this.$route.query) {
                            queryData[i] = this.$route.query[i];
                        }
                        queryData.urllength = this.urllength;
                        queryData.id = obj.id;
                        this.list = [];
                        this.page = 1;
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

            loadMore() {
                this.scShow = false;
                this.searchShow = true;
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let post = {
                    category: this.categoryId,
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
        overflow: hidden;

        min-height: 100vh;
        background: #f2f2f2;
        padding-top: 40px;
        position: relative;
    }

    .mint-header {
        background: #ff911e;
        height: auto;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        border-bottom: none;
        font-size: 16px;
        z-index: 9;
    }

    .mint-header-button {
        -webkit-box-flex: 0.12;
        -ms-flex: 0.12;
        flex: 0.12;
    }

    .searhed {
        display: block;
        float: left;
        padding: 5px 0.5rem;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 2em;
        width: calc(100% - 0.5rem);
        margin: 0 auto;
    }

    .searhed input {
        float: left;
        background: transparent;
        color: #856d54;
        font-size: 14px;
        width: calc(100% - 2rem);
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

    .search {
        overflow: hidden;
        padding: 0.4rem 10px 0;
        background: white;
        margin-bottom: 0.5rem;
        font-size: 0.65rem;
    }

    .search-title {
        overflow: hidden;
        line-height: 1.2em;
        padding: 0.6rem 0;
        color: #212121;
        /*border-bottom:1px solid #e6e6e6;
  margin-bottom:0.4rem;*/
    }

    .search-title span {
        float: left;
    }

    .search-title i {
        float: right;
        color: #686868;
        font-size: 0.7rem;
    }

    .search-title .clear {
        color: #f14574;
        float: right;
    }

    .search-box {
        overflow: hidden;
    }

    .search-list {
        max-width: 6em;
        color: #666;
        line-height: 1.2em;
        padding: 0.3rem 0.6rem;
        background: #f5f5f5;
        float: left;
        margin: 0 0.4rem 0.4rem 0;
        border-radius: 2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        overflow: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.4rem;
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
    }

    .tabnav-main .tn-line {
        overflow: hidden;
        padding: 0 10px;
        max-height: 40vh;
        overflow: auto;
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
        z-index: 99;
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

    .pricebox {
        overflow: hidden;
    }

    .sclist {
        position: fixed;
        top: 45px;
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        width: 100%;
        height: calc(100% - 45px);
        overflow-y: scroll;
        padding: 0.4rem;
    }

    .sclist li {
        height: 2.5rem;
        width: 100%;
        padding: 0.2rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }

    .sclist li:last-child {
        border-bottom: none;
    }

    .sclist li .bq {
        font-size: 0.5rem;
        padding: 0.1rem 0.5rem;
        background-color: #ff9d19;
        border-radius: 0.4rem;
        color: #fff;
    }

    .zlj {
        display: flex;
        justify-content: space-between;
        color: #666;
        font-size: 0.53rem;
    }

    .zlj .a1 {
        display: flex;
    }

</style>
