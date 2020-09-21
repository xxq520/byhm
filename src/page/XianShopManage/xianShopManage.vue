<template>
    <div class="xianShopManage">
        <header class="mint-header">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <h1 class="mint-header-title">店铺查询</h1>
            <!-- <h1 class="mint-header-title">{{identity}}</h1> -->
            <div class="filter" @click="gotoxieshop">
                <div class="filter-title">协助入驻</div>
                <div class="jiantou"><img src="@/assets/images/transction.png" class="screen"></div>
            </div>
        </header>
        <div class="nav">
            <button :class="{'hover':invitebtn==1}" @click="inviteAll">区域内商家<i
                   >({{regionCount}})</i></button>
            <button :class="{'hover':invitebtn==0}" @click="inviteByMe">发展商家<i>({{mineCount}})</i>

            </button>
        </div>
        <div class="top">
            <div class="searchBox">
                <i class="el-icon-search" v-show="!close" style="margin-left: 25px;"></i>
                <input type="text" placeholder="输入要搜索的店铺名称" v-model="search" @focus="searhed" @blur="blurfn"
                    onfocus="this.placeholder=''" onblur="this.placeholder='输入要搜索的店铺名称'" />
                <i id="close" class="el-icon-circle-close" v-show="close" @click="closefn"></i>

            </div>
            <button @click="searchfn" class="search-btn">搜索</button>
            <!-- <p>共{{count}}个商家</p> -->
        </div>
        <!-- 店铺list -->
        <div class="tabnav">
            <ul class="tabnav-list">
                <li :class="{'hover':tabnavText=='classify' && linevist}" @click="tabnav('classify')" v-if="quyu">
                    <a>{{ city==''?'全部城市':city }}<i
                            :class="tabnavText=='classify' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i></a>
                </li>
                <li :class="{'hover':tabnavText=='distance' && linevist}" @click="tabnav('distance')">
                    <a>全部分类<i
                            :class="tabnavText=='distance' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i></a>
                </li>
                <li :class="{'hover':tabnavText=='sorting' && linevist}" @click="tabnav('sorting')">
                    <a>筛选<i
                            :class="tabnavText=='sorting' && linevist?'el-icon-caret-top':'el-icon-caret-bottom'"></i></a>
                </li>
            </ul>
            <div class="filterPop" v-if="classVisible||distanceVisible||sortingVisible">
                <div v-if="classVisible" class="box">
                    <div class="time-box">
                        <div class="shi">
                            <ul class="date classification">
                                <li :class="{'active1':messagebtn4==0}" @click="messagebtnfn4(0,'全部城市')">全部城市</li>
                                <li v-for="(t,index) in cityList" :key="index" :class="{'active1':messagebtn4==t.id}"
                                    @click="messagebtnfn4(t.id,t.name)">
                                    {{t.name}}
                                </li>
                            </ul>
                        </div>
                        <div class="xian">
                            <ul class="date classification">
                                <li class="city">{{city}}</li>
                                <li v-for="(t,index) in district" :key="index" :class="{'active':messagebtn3==t.id}"
                                    @click="messagebtnfn3(t.id,t.name)">{{t.name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- btn -->
                    <div class="btnWrap">
                        <div class="btn" @click="resetFn"><button>重置</button></div>
                        <div class="btn" @click="submit"><button>完成</button></div>
                    </div>
                </div>

                <div v-if="distanceVisible" class="box">
                    <div class="time-box">
                        <div class="time">

                            <ul class="date classification">

                                <li v-for="(t,index) in typeList" :key="index" :class="{'active':messagebtn2==t.id}"
                                    @click="messagebtnfn2(t.id)">{{t.name}}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- btn -->
                    <div class="btnWrap">
                        <div class="btn" @click="resetFn"><button>重置</button></div>
                        <div class="btn" @click="submit"><button>完成</button></div>
                    </div>
                </div>
                <div v-if="sortingVisible" class="box">
                    <div class="time-box">
                        <div class="time">

                            <ul class="date">
                                <li v-for="(t,index) in timeList" :key="index" :class="{'active':messagebtn==index}"
                                    @click="messagebtnfn(index)">{{t}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="btnWrap">
                        <div class="btn" @click="resetFn"><button>重置</button></div>
                        <div class="btn" @click="submit"><button>完成</button></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="list-box">
            <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <div class="item" v-for="(item,i) in postdata" :key="i"
                    @click="ToShopDetail(item.id,item.status,item.inviter)">
                    <div class="left">
                        <div class="content">
                            <span class="title" :class="{'red':item.updateCheck}">{{ item.name }}</span>
                            <span class="type">{{ typefn(item.category) }}</span>
                        </div>
                        <div class="tel" v-if="fazhan">
                            {{item.status==1?'审核通过':item.status==0?'审核中':item.status==2?'审核不通过':''}}</div>
                    </div>
                    <div class="right">
                        <p class="address">{{ addressfn([item.province, item.city, item.county, item.address]) }}</p>
                        <div class="distance-box">
                            <span class="distance">100米</span>
                            <img src="@/assets/images/arrow_g.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <loading :load.sync="loadshow" :end.sync="loadend"></loading>
        </div>
        <!-- 协助商家入驻 -->
        <!-- <div class="xiezhu">
        <div v-if="type != 6" class="xiezhubtn" @click="gotoforSelf">自主入驻</div>
        <div class="xiezhubtn" @click="gotoxieshop">协助商家入驻</div>
      </div> -->
        <!-- 筛选弹窗 -->

        <bottomnav :carcount="carcount"></bottomnav>
    </div>
</template>

<script type="text/javascript">
    export default {
        name: "xianShopManage",
        data() {
            return {
                carcount: '店铺查询',
                messagebtn: 0,
                messagebtn2: 0,
                messagebtn3: 0,
                messagebtn4: 0,
                initmessagebtn2: null,
                search: "",
                close: false,
                timeList: ['全部', '营业中', '休息中', '已关闭', '不通过', '缺资料'],
                typeList: [],
                postdata: [],
                page: 1,
                size: 8,
                userId: this.$cookie.get("userid"),
                loading: false,
                loadshow: false,
                loadend: false,
                selectParameter: null, //刷选参数
                selectPage: 1,
                selectSize: 8,
                selectLoadMore: false,
                categoryName: '',
                mineCount: '',
                regionCount: '',
                invitebtn: 1, //0为我的商家 1为区域商家
                regionPage: 1,
                regionSize: 8,
                regionMore: false,
                minemore: true,
                isMineDisable: true, //防止我的发展商按钮多次点击多次请求
                isRegionDisable: false, //防止区域发展商按钮多次点击多次请求
                searchQuery: false,
                searchPage: 1,
                searchSize: 8,
                showCount: true,
                showCount2: true,
                identity: "",
                lng: null,
                lat: null,
                inviter: this.$cookie.get('userid'),
                type: this.$cookie.get('vip_type'),
                showTab: true,
                linevist: false,
                tabnavText: '',
                quyu: true,
                fazhan: '',
                classVisible: false,
                distanceVisible: false,
                sortingVisible: false,
                districtList: [],
                cityList: [],
                district: [],
                city: '全部城市',
                county: '',
                city2: ''
            };
        },
        created() {
            this.typeListfn();
            Indicator.close();
        },
        mounted() {
            axios.post(this.Api + 'region/checkArea?userId=' + this.inviter).then(res => {
                console.log(res, '59')
                this.cityList = res.data.data;
            });

            axios({
                method: 'get',
                url: this.Api + "merchant/filterQuery",
                params: {
                    userId: this.userId,
                    page: this.page,
                    size: this.size,
                    index: 1,
                }
            }).then(res => {
                console.log(res, '5')
                   this.regionCount=res.data.data.count;
            })
            axios({
                method: 'get',
                url: this.Api + "merchant/filterQuery",
                params: {
                    userId: this.userId,
                    page: this.page,
                    size: this.size,
                    index: 0,
                }
            }).then(res => {
            this.mineCount=res.data.data.count;

            })


        },
        methods: {
            tabnav(val) {
                switch (val) {
                    case 'classify':
                        this.classVisible = !this.classVisible;
                        this.distanceVisible = false;
                        this.sortingVisible = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case 'distance':
                        this.distanceVisible = !this.distanceVisible;
                        this.classVisible = false;
                        this.sortingVisible = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case 'sorting':
                        this.sortingVisible = !this.sortingVisible;
                        this.classVisible = false;
                        this.distanceVisible = false;
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                };
                this.tabnavText = val;
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
            showFilter() {
                this.popupVisible = !this.popupVisible;
            }, //状态按钮
            messagebtnfn(val) {
                this.messagebtn = val;

            }, //分类按钮
            messagebtnfn2(val) {
                this.messagebtn2 = val;
            },
            messagebtnfn3(val, name) {
                this.messagebtn3 = val;
                this.county = name;
            },
            messagebtnfn4(val, name) {
                this.messagebtn4 = val;
                this.city = name;
                this.city2 = this.city == '全部城市' ? '' : this.city;
                let dis = this.cityList.filter(item => {
                    return item.name == this.city
                })
                if (dis.length) {
                    this.district = dis[0].districtList
                } else {
                    this.district = []
                }

            },
            closefn(e) {
                this.search = "";
            },
            resetFn() {
                this.messagebtn = 0;
                this.messagebtn2 = this.initmessagebtn2;
                this.messagebtn3 = 0;
                this.messagebtn4 = 0;
                this.city = '全部城市';
                this.city2 = '';
                this.county = '';
                this.district = [];
            },
            // 刷选
            submit() {
                let that = this
                this.classVisible = false;
                this.distanceVisible = false;
                this.sortingVisible = false;
                let parameter = {};
                if (that.messagebtn == 0) {
                    // 筛选全部
                    parameter["userId"] = that.userId;
                    parameter["status"] = "";
                    parameter["storeStatus"] = "";
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                } else if (that.messagebtn == 4) {
                    // 筛选不通过
                    parameter["userId"] = that.userId;
                    parameter["status"] = 2;
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                } else if (that.messagebtn == 5) {
                    // 筛选缺资料
                    parameter["userId"] = that.userId;
                    parameter["status"] = 3;
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                } else if (that.messagebtn == 1) {
                    // 筛选营业中
                    parameter["userId"] = that.userId;
                    parameter["storeStatus"] = 0;
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                } else if (that.messagebtn == 2) {
                    // 筛选休息中
                    parameter["userId"] = that.userId;
                    parameter["storeStatus"] = 1;
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                } else if (that.messagebtn == 3) {
                    // 筛选已关闭
                    parameter["userId"] = that.userId;
                    parameter["storeStatus"] = 2;
                    parameter["category"] = that.messagebtn2;
                    parameter["keywords"] = that.search;
                    parameter["index"] = that.invitebtn;
                    parameter["page"] = that.selectPage;
                    parameter["size"] = that.selectSize;
                    parameter["city"] = that.city2;
                    parameter["county"] = that.county;
                }
                that.selectParameter = parameter
                that.selectLoadMore = true
                that.loadend = false
                that.loadMore();
            },
            blurfn() {
                this.close = false;
            },
            searhed() {
                this.close = true;
            },
            // 跳到店铺详情
            ToShopDetail(val, status, invite, userid) {
                // if(status == 0) {
                //   Toast('商家审核中，暂不能修改！')
                // }else {
                if (this.inviter == invite) {
                    if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {
                        window.action.gotoApply(JSON.stringify({
                            id: val
                        }));
                    } else {
                        this.$router.push({
                            path: '/xianShopManage/shopDetail',
                            query: {
                                id: val
                            }
                        })
                    }
                } else {
                    Toast("您没有权限修改。谢谢！")
                }
            },
            //初始化列表
            loadMore() {
                let that = this;
                this.loading = true;
                this.loadshow = true;
                // 初始化加载更多
                if (that.selectParameter == null && that.invitebtn == 0 && that.search == "") {
                    if (that.minemore) {
                        that.postdata.splice(0, that.postdata.length);
                        that.minemore = false
                        that.page = 1
                    }
                    axios({
                        method: 'get',
                        url: this.Api + "merchant/filterQuery",
                        // url: "http://192.168.1.140:8080/api/merchant/filterQuery",
                        params: {
                            userId: this.userId,
                            page: this.page,
                            size: this.size,
                            index: this.invitebtn,
                        }
                    }).then(res => {
                        console.log(res, '1')
                        let data = res.data;
                        if (data.errno == 0) {
                            let post = data.data.data;
                            that.mineCount = data.data.count
                            if (post.length == 0) {
                                that.loadend = true;
                                that.loading = true;
                                that.loadshow = false;
                                return false;
                            };
                            (that.page) ++;
                            console.log(that.postdata)
                            that.postdata = that.postdata.concat(post);
                            that.loading = false;
                            that.loadshow = false;
                        } else {
                            // Toast(res.data.msg || res.data.errmsg);
                            that.loadshow = false;
                        };
                    })

                } else if (that.selectParameter != null) {
                    // 刷选后加载更多

                    if (that.selectLoadMore) {
                        that.postdata.splice(0, that.postdata.length);
                        that.selectLoadMore = false

                    }
                    axios({
                        method: 'get',
                        url: that.Api + "merchant/filterQuery",
                        // url: "http://192.168.1.140:8080/api/merchant/filterQuery",
                        params: that.selectParameter
                    }).then(res => {
                        console.log(res, '2')
                        if (res.data.errno == 0) {
                            let post = res.data.data.data
                            if (that.invitebtn == 0) {
                                that.mineCount = res.data.data.count
                            }
                            if (that.invitebtn == 1) {
                                that.regionCount = res.data.data.count
                            }
                            if (post.length == 0) {
                                that.loadend = true;
                                that.loading = true;
                                that.loadshow = false;
                                return false;
                            };
                            (that.selectParameter.page) ++;
                            console.log(that.selectParameter.page)
                            console.log(that.postdata)
                            that.postdata = that.postdata.concat(post);
                            that.loading = false;
                            that.loadshow = false;
                        } else {
                            that.loadshow = false;
                        };
                    })

                } else if (that.selectParameter == null && that.invitebtn == 1 && that.search == "") {
                    // 区域商家
                    if (that.regionMore) {
                        that.postdata.splice(0, that.postdata.length);
                        that.regionMore = false
                        that.regionPage = 1
                    }
                    axios({
                        method: 'get',
                        url: this.Api + "merchant/filterQuery",
                        // url: "http://192.168.1.140:8080/api/merchant/filterQuery",
                        params: {
                            userId: that.userId,
                            page: that.regionPage,
                            size: that.regionSize,
                            index: that.invitebtn
                        }
                    }).then(res => {
                        console.log(res, '3')
                        if (res.data.errno == 0) {
                            let post = res.data.data.data
                            that.regionCount = res.data.data.count
                            if (post.length == 0) {
                                that.loadend = true;
                                that.loading = true;
                                that.loadshow = false;
                                return false;
                            };
                            (that.regionPage) ++;
                            console.log()
                            console.log(that.postdata)
                            that.postdata = that.postdata.concat(post);
                            that.loading = false;
                            that.loadshow = false;
                        } else {
                            that.loadshow = false;
                        };
                    })

                } else if (that.search != "") {
                    // 搜索查询
                    if (that.searchQuery) {
                        that.postdata.splice(0, that.postdata.length);
                        that.searchQuery = false

                    }
                    console.log(that.search)
                    axios({
                        method: 'get',
                        url: that.Api + "merchant/filterQuery",
                        // url: "http://192.168.1.140:8080/api/merchant/filterQuery",
                        params: {
                            userId: that.userId,
                            status: "",
                            storeStatus: "",
                            category: "",
                            keywords: that.search,
                            index: that.invitebtn,
                            page: that.searchPage,
                            size: that.searchSize
                        }
                    }).then(res => {
                        console.log(res, '4 ')
                        if (res.data.errno == 0) {
                            let post = res.data.data.data
                            if (that.invitebtn == 0) {
                                that.mineCount = res.data.data.count
                            }
                            if (that.invitebtn == 1) {
                                that.regionCount = res.data.data.count
                            }
                            if (post.length == 0) {
                                that.loadend = true;
                                that.loading = true;
                                that.loadshow = false;
                                return false;
                            };
                            (that.searchPage) ++;
                            console.log(that.postdata)
                            that.postdata = that.postdata.concat(post);
                            that.loading = false;
                            that.loadshow = false;
                        } else {
                            that.loadshow = false;
                        };
                    })
                }

            },
            // 合并地区和地址
            addressfn(arr) {
                let text = '';
                arr.forEach(post => {
                    if (post) text += post;
                });
                return text;
            },
            typefn(val) {
                for (var i = 0; i < this.typeList.length; i++) {
                    if (this.typeList[i].id == val) {
                        return this.typeList[i].name;
                    }
                }
            },
            typeListfn() {
                axios({
                    url: this.Api + '/merchant/categoryList',
                    method: "post",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    let data = res.data.categoryEntities;
                    let arr = [];
                    data.forEach((post, index) => {
                        let p = {
                            id: post.id,
                            name: post.name
                        };
                        arr.push(p)
                    });
                    this.typeList = arr;
                    this.typeList.unshift({
                        id: "",
                        name: '全部'
                    })
                    console.log(this.typeList)
                    this.initmessagebtn2 = this.typeList[0].id
                    this.messagebtn2 = this.typeList[0].id
                });
            },
            //搜索查询
            searchfn() {
                this.searchQuery = true
                this.regionMore = true;
                this.minemore = true
                this.selectParameter = null
                this.loadend = false
                this.searchPage = 1;
                this.isRegionDisable = false
                this.isMineDisable = false
                this.loadMore()


            },
            //自己发展的商家
            inviteByMe() {
                this.sortingVisible=false;
                this.distanceVisible=false;
                this.classVisible=false;
                this.fazhan = true;
                this.quyu = false;
                this.invitebtn = 0;
                this.regionMore = true;
                this.minemore = true;
                this.selectParameter = null;
                this.loadend = false;
                // this.isRegionDisable = false
                this.isRegionDisable = false;
                this.isMineDisable = true;
                this.search = "";
                this.loadMore();
            },
            //全部商家
            inviteAll() {
                this.sortingVisible=false;
                this.distanceVisible=false;
                this.classVisible=false;
                this.fazhan = false;
                this.quyu = true;
                this.invitebtn = 1;
                this.regionMore = true;
                this.selectParameter = null;
                this.minemore = true;
                this.loadend = false;
                // this.isMineDisable = true
                this.isRegionDisable = true;
                this.isMineDisable = false;
                this.search = "";
                this.loadMore();

            },
            //跳转到协助商家申请
            gotoxieshop() {
                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {
                    window.action.gotoApply();
                } else {
                    this.$router.push({
                        name: 'applicationShop'
                    })
                }
            },
            gotoforSelf() {
                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {
                    window.action.gotoApplyForSelf();
                } else {
                    this.$router.push({
                        path: '/application/0'
                    })
                }
            },
            //获取app经纬度
            getAppjw() {
                // let that = this
                // if(this.$route.query.platform == 'android' || this.$route.query.platform == 'ios'){

                // }else{
                //   this.$router.go(-1);
                // }
            },
            // goback(){
            //   if(this.$route.query.platform == 'android'){
            //     window.action.backAPP();
            //   }else if(this.$route.query.platform == 'ios'){
            //     window.action.backAPPiOS();
            //   }else{
            //     this.$router.go(-1);
            //   }
            // },
        }
    };

</script>

<style scoped>
    .active {
        border: 1px solid #ff920e !important;
        background-color: #fff;
        color: #ff8922;
    }

    .active1 {

        background-color: #fff;
        color: #ff8922;
    }

    .xianShopManage {
        width: 100%;
        background: #f5f5f5;
        height: 100vh;
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
    }

    /* 头部 */
    .xianShopManage>>>.mint-header {
        background: #ff911e;
        height: 2rem;
        border-bottom: none;
        font-size: 16px;
    }

    .xianShopManage .filter {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
    }

    .xianShopManage .filter .jiantou {
        width: 0.65rem;
        height: 0.6rem;
        color: #fff;
        margin-left: 0.1111rem;
    }

    .xianShopManage .filter .filter-title {
        font-size: 0.5556rem
            /* 25/45 */
        ;
    }

    .tabnav {
        overflow: hidden;
        width: 100%;
        background: white;
        border: 1px solid #eee;
        z-index: 99999;

    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #eee;
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
        font-size: 0.62rem;
        padding: 0.7em 0;
        color: #666;
    }

    .tabnav ul.tabnav-list li.hover a {
        color: #f86b1f;
    }

    /* 交易简介 */
    .xianShopManage .top {
        width: 100%;
        padding: 10px;
        background: #f5f5f5;
        overflow: hidden;
        position: relative;
    }

    .xianShopManage .top p {
        font-size: .4889rem;
        color: #999999;
    }

    .xianShopManage .top .searchBox {
        font-size: 14px;
        width: 11.1111rem;
        height: 30px;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
    }

    .xianShopManage .top .searchBox #close {
        margin-right: 5px;
    }

    .search-btn {
        width: 50px;
        position: absolute;
        right: 20px;
        background: #ff920e;
        border-radius: 1.3rem;
        border: none;
        color: #fff;
        height: 30px;
        line-height: 30px;
        top: 50%;
        margin-top: -15px;

    }

    /* 列表 */
    .xianShopManage {
        width: 100%;

        position: relative;
    }

    .xianShopManage .list .item {
        background: #fff;
        padding: 0.433rem 0.6rem;
        border-bottom: 1px solid #eeeeee;
        color: #333;
        overflow: hidden;
    }

    .xianShopManage .list .item .right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.4em;
    }

    .xianShopManage .list .item .right .address {
        font-size: 0.58rem;
        width: 18em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .xianShopManage .list .item .right img {
        width: .333333rem
    }

    .xianShopManage .list .item .left {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .xianShopManage .list .item .left .content {
        display: flex
    }

    .xianShopManage .list .item .left .title {
        font-size: .6667rem;
        margin-right: .416667rem;
    }

    .xianShopManage .list .item .left .type {
        font-size: .52rem;
        background: #ff920e;
        color: #fff;
        padding: 0 .1rem;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .xianShopManage .list .item .left .tel {
        font-size: .6rem;
        color: #ff8922;
    }

    .distance-box {
        display: flex;
        align-items: center;
    }

    .distance {
        font-size: .5rem;
        color: #ff8922;
        margin-right: 10px;
        display: none;
    }

    /* 筛选条件弹窗 */
    .xianShopManage .filterPop {
        width: 100%;
        height: 53vh;
        overflow: hidden;
        background: #fff;
        position: relative;

    }

    .xianShopManage .filterPop .box {
        overflow: hidden;
        width: 100%;
        display: flex;
        flex-direction: column;

    }

    .xianShopManage .filterPop .time-box {
        max-height: 48vh;
        overflow-y: auto;
        width: 100%;
        margin-bottom: 1.8rem;
        overflow: hidden;


    }

    .xianShopManage .filterPop .time-box .shi {
        float: left;
        width: 25%;
        max-height: 48vh;
        overflow-y: auto;
        color: #666;
        background-color: #f1f1f1;
        font-size: 0.6777rem;
        text-align: center;
    }

    .xianShopManage .filterPop .time-box .shi li {
        width: 100%;
        height: 1.5rem;
        line-height: 1.5rem;
    }

    .xianShopManage .filterPop .btnWrap {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 10%;
    }

    .xianShopManage .filterPop .time-box .xian {
        float: left;
        width: 75%;
        color: #666;
        background-color: #fff;
        font-size: 0.6rem;
        text-align: center;
        padding: 0.75rem 0 0 0.5rem;
    }

    .filterPop .time-box .xian li {
        float: left;
        margin-right: 0.5rem;
        width: 28%;
        min-height: 1.3rem;
        line-height: 1.3rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .filterPop .time-box .xian li.city {
        width: 96.5%;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        height: 1.3rem;
        line-height: 1.3rem;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .xianShopManage .filterPop .time-box .time {

        width: 100%;
        max-height: 48vh;
        overflow-y: auto;
        color: #666;
        background-color: #fff;
        font-size: 0.6rem;
        padding: 0.75rem 0 0 0.5rem;
    }

    .filterPop .time-box .time li {
        float: left;
        width: 21%;
        text-align: center;
        min-height: 1.3rem;
        line-height: 1.3rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }

    /* 按钮 */
    .xianShopManage .filterPop .btnWrap {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.6667rem;
    }

    .xianShopManage .filterPop .btnWrap .btn {
        width: 50%;
        height: 1.5556rem;
        font-size: .6222rem;
    }

    .xianShopManage .filterPop .btnWrap button {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        border-top: 1px solid #eeeeee;
        border-right: 1px solid #eeeeee;
        background: #fff;
    }

    .xianShopManage .filterPop .btnWrap .btn:nth-child(2) button {
        border-right: none;
        color: #ff920e;
    }

    .xianShopManage>>>.mint-navbar .mint-tab-item {
        color: #ff8724;
        background-color: #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        border-top: 1px solid #f5f5f5;
        margin-bottom: 0;
    }

    .xianShopManage>>>.mint-navbar .mint-tab-item.is-selected {
        background-color: #fff;
        border-bottom: 1px solid #f5f5f5;
        border-top: 1px solid #f5f5f5;
        margin-bottom: 0;
    }

    .nav {
        display: flex;
    }

    .nav button {
        /* width: 50%; */
        flex: 1;
        border: none;
        border-bottom: 1px solid #f5f5f5;
        border-top: 1px solid #f5f5f5;
        outline: none;
        text-align: center;
        background-color: #f5f5f5;
        color: #666666;
        font-size: .6rem;
        height: 2.083333rem;
        line-height: 2.083333rem;
        margin-bottom: 3px;
    }

    .nav button.hover {
        border: none;
        background-color: #fff;
        color: #ff8724;


    }

    .nav button.hover::after {
        content: "";
        width: 4rem;
        height: 2px;
        background-color: #ff8724;
        margin: 0 auto;
        display: block;
    }

    .list-box {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 2rem;

    }

    .list-box::-webkit-scrollbar {
        display: none
    }

    /* 隐藏滚动条 */
    .xiezhu {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
    }

    .xiezhubtn {
        flex: 1;
        text-align: center;
        color: white;
        font-size: 0.7rem;
        height: 2.1rem;
        line-height: 2.1rem;
        background: #ff8f28;
        border-right: 1px solid #ffd0a4;
    }

    .xiezhubtn:last-child {
        border-right: none;
    }



    .red {
        color: #ec0746;
    }

</style>
