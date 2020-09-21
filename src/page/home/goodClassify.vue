<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
        <div class="tabnav">
            <ul class="tabnav-list">
                <li :class="{'hover':tabnavText=='classify' && linevist}" @click="tabnav('classify')">
                    <a>
                        {{ categoryName==''?'分类':categoryName }}
                        <i :class="tabnavText=='classify' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                    </a>
                </li>
                <li :class="{'hover':tabnavText=='distance' && linevist}" @click="tabnav('distance')">
                    <a>
                        {{ distance==''?'附近':distance }}
                        <i :class="tabnavText=='distance' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                    </a>
                </li>
                <li :class="{'hover':tabnavText=='sorting' && linevist}" @click="tabnav('sorting')">
                    <a>
                        {{ sidxname}}
                        <i :class="tabnavText=='sorting' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                    </a>
                </li>
            </ul>
            <div class="tabnav-main">
                <!--分类，附近，排序-->
                <div class="tn-line" v-show="linevist">
                    <div v-for="(item,i) in line" :key="i" class="line"
                        :class="{'hover':tabnavText=='classify'?category==item.id:tabnavText=='distance'?dist==item.id:tabnavText=='sorting'?sidx==item.id:false}"
                        @click="linefn($event,item)">{{ item.name }}</div>
                </div>
                <!--更多-->
                <div class="tn-line tn-more" v-show="morevist">
                    <div class="morelist">
                        <div class="moretitle">优惠:</div>
                        <div class="morebox">
                            <p>全部</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="zzao" v-if="linevist || morevist" @click="zzaofn"></div>
        <div class="chanpinlist">
            <div class="indexFl" @click="indexFl" v-if="list.length==0" style="margin-top:1rem">
                <img src="@/assets/images/indexFl.jpg" />
            </div>
            <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <!---->
                <router-link class="goodlist" v-for="(item,index) in list" :key="index"
                    :to="'/shopDetails?id='+item.id">
                    <div class="goodbox">
                        <div class="goodimg">
                            <img :src="item.facadePhoto" />
                        </div>
                        <div class="goodtext">
                            <div class="goodname">
                                <p>
                                    {{ cutString(item.name,10)}}
                                    <img :src="item.icon" v-if="item.isRecommend" />
                                </p>
                                <span>{{ categoryfn(item.distance) }}</span>
                            </div>
                            <div class="score">
                                <el-rate v-model="item.grade==0?4:item.grade" disabled text-color="#f86b1f"
                                    :colors="['#f86b1f', '#f86b1f', '#f86b1f']"></el-rate>
                                <!--<div class="slist">100条点评<span></span>￥50/人</div>-->
                            </div>
                            <div class="area">
                                <p>{{ item.county }}</p>
                            </div>
                            <div class="pricebox" v-for="(v,i) in item.voucherList" :key="i">
                                <div class="cphui" v-if="i<2">
                                    <i>惠</i>
                                    {{ v.remarks }}
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
            <!--loading-->
            <loading v-if="!nodata" :load.sync="loadshow" :end.sync="loadend"></loading>
            <div class="nodata" v-if="nodata">暂无数据</div>
        </div>
        <mt-popup v-model="permisVisible" style="width: 70%;">
            <div class="permis">
                <img src="@/assets/images/tf.png" />
                <span class="permisClose" @click="permisVisible=false"></span>
            </div>
        </mt-popup>
    </div>
</template>
<script>
    export default {
        name: "goodClassify",
        data() {
            return {
                topnav: {
                    searh: true
                },
                loading: true,
                list: [],
                loadshow: true,
                lng: "",
                lat: "",
                city: "",
                prov: "",
                district: "",
                dist: "",
                page: 1,
                size: 8,
                sidx: "id",
                order: "desc",
                sidxname: "智能排序",
                category: this.$route.query.id ? this.$route.query.id : "",
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
                tabnavText: "",
                line: [],
                score: 5,
                distance: "",
                urllength: this.$route.query.urllength ?
                    new Number(this.$route.query.urllength) :
                    -1,
                exist: "",
                permisVisible: false,
                type: this.$cookie.get("vip_type"),
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

                    that.loadMore();
                }
            }, 100);

            // 类型
            axios({
                url: this.Api + "/merchant/categoryList",
                method: "post",
                headers: {
                    "X-Nideshop-Token": this.$cookie.get("token")
                }
            }).then(res => {
                let data = res.data.categoryEntities;
                data.forEach((post, index) => {
                    if (post.id == this.category) this.categoryName = post.name;
                    this.categoryPost.push({
                        id: post.id,
                        name: post.name
                    });
                });
            });
        },
        methods: {
            // 弹出商家申请弹窗
            indexFl() {
                if (this.type == 6) {
                    this.$router.push({
                        path: "/management"
                    });
                } else {
                    this.permisVisible = true;
                }
            },
            // 头部导航分类选择
            tabnav(val) {
                switch (val) {
                    case "classify":
                        this.line = this.categoryPost;
                        this.morevist = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case "distance":
                        this.line = [{
                                id: "",
                                name: "附近"
                            },
                            {
                                id: 500,
                                name: "500m"
                            },
                            {
                                id: 1000,
                                name: "1km"
                            },
                            {
                                id: 3000,
                                name: "3km"
                            },
                            {
                                id: 5000,
                                name: "5km"
                            },
                            {
                                id: 10000,
                                name: "10km"
                            },
                            {
                                id: 20000,
                                name: "20km"
                            }
                        ];
                        this.morevist = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case "sorting":
                        this.line = [{
                                id: "",
                                name: "智能排序",
                                order: "desc"
                            },
                            {
                                id: "distance",
                                name: "距离优先",
                                order: "asc"
                            },

                            {
                                id: "view_num",
                                name: "人气优先",
                                order: "desc"
                            }
                        ];
                        this.morevist = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case "more":
                        this.linevist = false;
                        this.morevist = this.tabnavText == val ? !this.morevist : true;
                        break;
                }
                this.tabnavText = val;
            },
            cutString(str, len) {
                //length属性读出来的汉字长度为1
                if (str.length * 2 <= len) {
                    return str;
                }
                var strlen = 0;
                var s = "";
                for (var i = 0; i < str.length; i++) {
                    s = s + str.charAt(i);
                    if (str.charCodeAt(i) > 128) {
                        strlen = strlen + 2;
                        if (strlen >= len) {
                            return s.substring(0, s.length - 1) + "...";
                        }
                    } else {
                        strlen = strlen + 1;
                        if (strlen >= len) {
                            return s.substring(0, s.length - 2) + "...";
                        }
                    }
                }
                return s;
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
                this.nodata = false;
                this.loadend = false;
                this.lineClick(obj);
            },
            // 头部导航详细选择后，刷新数据
            lineClick(obj) {
                switch (this.tabnavText) {
                    case "classify":
                        this.urllength--;
                        this.category = obj.id;
                        this.categoryName = obj.name;
                        let queryData = {};
                        for (var i in this.$route.query) {
                            queryData[i] = this.$route.query[i];
                        }
                        queryData.urllength = this.urllength;
                        queryData.id = obj.id;
                        this.$router.push({
                            path: "/goodClassify",
                            query: queryData
                        });
                        break;
                    case "distance":
                        this.dist = obj.id;
                        this.distance = obj.name;
                        break;
                    case "sorting":
                        this.sidx = obj.id;
                        this.order = obj.order;
                        this.sidxname = obj.name;
                        break;
                    case "more":
                        break;
                }
                this.loadMore();
                this.zzaofn();
            },
            zzaofn() {
                this.linevist = false;
                this.morevist = false;
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let post = {
                    category: this.category,
                    name: this.name,
                    lng: this.lng,
                    lat: this.lat,
                    dist: this.dist,
                    pageNum: this.page,
                    pageSize: this.size,
                    levelId: this.levelid,
                    sidx: this.sidx,
                    order: this.order
                };
                axios
                    .get(this.Api + "/index/queryMerchantByCategory", {
                        params: post
                    })
                    .then(res => {
                        let data = res.data.page;
                        this.loadshow = false;

                        this.exist = res.data.exist;
                        if (data.list.length == 0) {
                            this.loading = true;
                            if (this.list.length > 0) this.loadend = true;
                            if (this.list.length == 0) this.nodata = true;
                            return false;
                        }
                        this.page++;
                        this.list = this.list.concat(data.list);
                        this.loading = false;
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
        overflow: hidden;
        padding-top: calc(0.9rem + 1.4em + 40px);
        min-height: 100vh;
        background: #f2f2f2;
    }

    /* header */
    .mainbox>>>.mint-header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 999;
    }

    /* chanpinlist */
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
        position: fixed;
        z-index: 99;
        left: 0;
        top: 40px;
    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .tabnav ul.tabnav-list li {
        overflow: hidden;
        text-align: center;
        flex-grow: 1;
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
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: 90;
    }

    .cptitle {
        background-color: #fff;
    }

    /* goodlist */
    .goodlist {
        display: block;
        background: white;
        overflow: hidden;
        padding: 10px 0;
        margin: 0 10px;
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
        width: calc(100% - 4rem);

        flex-direction: column;
        justify-content: space-between;

        display: flex;
    }

    .goodlist .goodbox .goodname {
        font-size: 0.7rem;
        line-height: 1.4em;
        margin-bottom: 0.2rem;
        display: -webkit-flex;
        /* Safari */
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

    .indexFl {
        padding: 0 0.5rem 0.5rem;
        overflow: hidden;
    }

    .indexFl img {
        display: block;
        pointer-events: none;
    }

    .permis {
        overflow: hidden;
        position: relative;
    }

    .permis img {
        pointer-events: none;
    }

    .permisClose {
        position: absolute;
        right: 0;
        top: 15%;
        width: 1.2rem;
        height: 1.2rem;
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
        font-size: 0.58rem;
        color: #999;
    }

    /* >>> */
    .score {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        align-items: center;
    }

    .score>>>.el-rate {
        height: auto;
        overflow: hidden;
        float: left;
    }

    .score>>>.el-rate__icon {
        font-size: 0.58rem;
        margin-right: 0.2em;
    }

    .score>>>.el-rate__item {
        float: left;
    }

    .score>>>.el-rate__text {
        line-height: 0.58rem;
        float: left;
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
        font-size: 0.58rem;
        color: #999;
    }

    .area p {
        float: left;
    }

    .area span {
        float: right;
    }

    .pricebox {
        overflow: hidden;
    }

    .cphui {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #666;
        line-height: 1.4em;
        font-size: 0.58rem;
        margin-bottom: 0.2rem;
    }

    .cphui i {
        display: inline-block;
        color: white;
        padding: 0 0.2em;
        border-radius: 3px;
        margin-right: 0.1rem;
        font-size: 0.58rem;
        background: #ff841e;
    }

</style>
