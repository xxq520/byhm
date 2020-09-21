<template>
    <div class="mainbox" v-cloak @scroll="scrollEvent">
        <header class="mint-header">
            <topnav :topnav="topnav" :info="infoSize" :city.sync="district!='null'?district:city !='null'?city:prov">
            </topnav>
        </header>
        <div class="shounav">
            <div class="shouitem" @click="gogoods(item.jumpTarget)" v-for="(item,y) in category" :key="y" v-if="y<5">
                <img :src="item.imgUrl" />
                <div class="mtop">{{ item.title }}</div>
            </div>
        </div>
        <div class="nav-list">
            <ul>
                <li v-for="(item,y) in category" :key="y" v-if="y>=5">
                    <div @click="gogoods(item.jumpTarget)">
                        <span :style="{ backgroundImage: 'url('+item.imgUrl+')'}"></span>
                        <p>{{ item.title }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="column-img">
            <mt-swipe :auto="4000" :show-indicators="false">
                <mt-swipe-item v-for="(item,i) in banner" :key="i">
                    <a @click="bannerLink(item.jumpTarget)">
                        <img :src="item.imgUrl" />
                    </a>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <div class="indexFl" @click="indexFl" v-if="list.length==0" style="margin-top:1rem">
            <img src="@/assets/images/indexFl.jpg" />
        </div>
        <div style="display: flex;  " class="waterfall">
            <div style="width: 48%;">
                <div class="cplist" v-for="(item,index) in  list" v-if="index%2 ==0 " @click="goshop(item)">
                    <div class="cpimg">
                        <img :src="item.logoUrl" />
                    </div>
                    <div class="cptext">
                        <div class="cpname">{{item.name }}</div>
                        <div class="cpclass">{{ item.avgScore=='暂无评分'?4.0:item.avgScore}}</div>
                        <div class="cphui" v-show="item.avgSales">月售：{{item.avgSales}}</div>
                        <div style="display:flex; font-size: 0.5rem; ">
                            <div style="color:#FF8245; margin-right: 0.1rem;" v-for="f in item.shopActivityList">
                                {{f.content}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="width: 48%;">
                <div class="cplist" v-for="(item,index) in  list" v-if="index%2 ==1" @click="goshop(item)">
                    <div class="cpimg">
                        <img :src="item.logoUrl" />
                    </div>
                    <div class="cptext">
                        <div class="cpname">{{item.name }}</div>
                        <div class="cpclass">{{ item.avgScore=='暂无评分'?4.0:item.avgScore}}</div>
                        <div class="cphui" v-show="item.avgSales">月售：{{item.avgSales}}</div>
                        <div style="display:flex; font-size: 0.5rem; ">
                            <div style="color:#FF8245; margin-right: 0.1rem;" v-for="f in item.shopActivityList">
                                {{f.content}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chanpinlist">
            <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="3">
                <!-- <router-link v-for="(item,i) in list" :key="i" 
                    :to="'/shopDetails?id='+item.id+'&code='+code" class="shopto">
                    <div class="cplist">
                        <div class="cpimg"><img :src="item.facadePhoto"></div>
                        <div class="cptext">
                            <div class="cpname">{{item.name }}</div>
                            <div class="cpclass">{{ 4.6 }}分</div>
                            <div class="cpadress">
                                <p class="p1">满20减5</p>
                                <p class="p2">满50减10</p>
                            </div>
                            <div class="cphui">月售：{{300}}</div>
                        </div>
                    </div>
        </router-link>-->
            </div>
            <loading :load.sync="loadshow" :end.sync="loadend"></loading>
        </div>
        <bottomnav :carcount="carcount"></bottomnav>
        <mt-popup v-model="permisVisible" style="width: 70%;">
            <div class="permis">
                <img src="@/assets/images/tf.png" />
                <span class="permisClose" @click="permisVisible=false"></span>
            </div>
        </mt-popup>
        <!-- 点击跳转到appStory下载app -->
        <div class="guide">
            <div class="dw" v-if="$store.state.guideCloseShow ">
                <img src="@/assets/images/xiazai_bg.png" />
                <div class="down-load" @click="jumpLoad">
                    <img src="@/assets/images/xiazai_butter.png" />
                </div>
                <i class="close-down" @click="closeDown"></i>
            </div>
            <div class="pay-box" v-if="isPayStatus">
                <img src="@/assets/images/xiazai_bg_01.png" />
                <img @click="goToOrder" class="go-pay" src="@/assets/images/xiazai_butter_01.png" />
            </div>
        </div>
        <!-- 爱之家消费卷 -->
        <div class="azj_box" v-if="money!=null">
            <i class="el-icon-circle-close-outline" @click="clear"></i>
            <p class="p1">爱之家商城消费卷</p>
            <p class="p2">{{money?money:0}}</p>
            <p class="p3">惠盟用户使用享超级优惠</p>
            <div class="button-box">
                <div class="default-btn" @click="azjlinks">马上去使用</div>
            </div>
        </div>
    </div>
</template>

<script>
    import azjlinks from "@/assets/js/AZJlinks";
    export default {
        name: "index",
        data() {
            return {
                topnav: {
                    searh: true,
                    back: false,
                    send: true
                },
                carcount: "首页",
                loading: false,
                list: [],
                loadshow: true,
                loadend: false,
                shqlist: [],
                permisVisible: false,
                city: "",
                prov: "",
                district: "",
                banner: [],
                cherList: [],
                categorylist: 0,
                category: [],
                lng: "",
                lat: "",
                dist: "",
                page: 1,
                size: 6,
                levelid: this.$cookie.get("level_id") ? this.$cookie.get("level_id") : 1,
                userId: this.$cookie.get("userid"),
                userid: this.$cookie.get("userid"),
                type: this.$cookie.get("vip_type"),
                backshqPd: sessionStorage.getItem("applogin"), // app登录判断
                isPayStatus: false, //判断是否有没支付的订单
                type2: 1,
                partner: [],
                partnerdj: "",
                money: null,
                code: this.$cookie.get("card"),
                infoSize: 0,
                messagebtn: 0,
                tabnavText: "",
                categoryName: "",
                sidxname: "",
                distance: "",
                linevist: false,
                morevist: false,
                line: [],
                sidx: "",
                classification: [],
                sectionPrice: "",
                maxDistance: "",
                genreId: "",
                LngLats: {},
                xiding: false,
                address: ""
            };
        },

        created() {
            let isShow = this.$cookie.get("isShow");
            // debugger;
            if (this.levelid > 0 && this.userid) {
                if (!isShow) {
                    this.getYLinfo();
                }
            }
            if (this.userid) {
                this.azjxiaofei();
                this.isOrder();
                this.partnerDj();
                this.infosize();
            }
          
       
        },

        mounted() {
            var that = this;
            var u = navigator.userAgent,
                app = navigator.appVersion;
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if (isiOS) {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    let geolocation = new BMap.Geolocation();
                    var gc = new BMap.Geocoder();
                    let _this = this;
                    geolocation.getCurrentPosition(function (r) {
                        _this.map_center = r.point;
                        _this.shop_lng = r.point.lng;
                        _this.shop_lat = r.point.lat;
                        sessionStorage.setItem(
                            "LngLats",
                            JSON.stringify({
                                lng: r.point.lng,
                                lat: r.point.lat
                            })
                        );
                        gc.getLocation(r.point, function (rs) {
                            var addComp = rs.addressComponents;
                            sessionStorage.setItem("cityMap", addComp.city);
                            sessionStorage.setItem("provMap", addComp.province);
                            sessionStorage.setItem("distMap", addComp.district);
                        });
                    });
                }
                this.LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
            }
            // 获取定位，默认取用户手动设置值，如果没有再取百度定位

            Indicator.open();
            let index = 1;
            let timer = setInterval(() => {
                index++;
                if (
                    sessionStorage.getItem("cityMap") &&
                    sessionStorage.getItem("LngLats")
                ) {
                    clearInterval(timer);
                    let prov = sessionStorage.getItem("provMap");
                    let district = sessionStorage.getItem("distMap");
                    let LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
                    let cityMap = sessionStorage.getItem("cityMap");
                    this.address = sessionStorage.getItem("address");
                    let indexs = this.address.indexOf("省");
                    if (indexs > -1) {
                        this.address = this.address.substring(indexs + 1);
                    }
                    that.lng = LngLats && LngLats.lng ? LngLats.lng : "";
                    that.lat = LngLats && LngLats.lat ? LngLats.lat : "";
                    that.city = cityMap;
                    that.prov = prov;
                    that.district = district;
                }
                Indicator.close();
            }, 100);
            this.prov = sessionStorage.getItem("provMap");
            this.city = sessionStorage.getItem("cityMap");
            this.district = sessionStorage.getItem("distMap");
            this.indefn();
            this.maturityTip();
        },

        updated() {
            this.$nextTick(function () {
                let that = this;
                this.navheight(0);
                window.onresize = function () {
                    that.navheight(0);
                };
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
            //跳转店铺详情
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
            //图标跳转至对应的查询条件
            gogoods(links) {
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
            togoods(val) {
                switch (val) {
                    case 1:
                        this.$router.push({
                            path: "/goodClassify",
                            query: {
                                id: 1003,
                                urllength: -1
                            }
                        });
                        break;

                    case 2:
                        this.$router.push({
                            path: "/goodClassify",
                            query: {
                                id: 1005,
                                urllength: -1
                            }
                        });
                        break;
                    case 3:
                        this.$router.push({
                            path: "/supermarket"
                        });
                        break;
                    case 4:
                        this.$router.push({
                            path: "/goodClassify",
                            query: {
                                id: 1000,
                                urllength: -1
                            }
                        });
                        break;
                    case 5:
                        this.$router.push({
                            path: "/goodClassify",
                            query: {
                                id: 1001,
                                urllength: -1
                            }
                        });
                        break;
                }
            },
            scrollEvent(e) {
                let top = e.target.scrollTop;
                if (top > 320) {
                    this.xiding = true;
                } else {
                    this.xiding = false;
                }
            },

            handler({
                BMap,
                Map
            }) {},

            //切换选项卡
            messagebtnfn(val) {
                this.page = 1;
                this.size = 5;
                this.loading = true;
                this.list = [];
                this.loadshow = true;
                this.loadend = false;
                this.shqlist = [];
                this.messagebtn = val;
                this.sectionPrice = "";
                this.maxDistance = "";
                this.genreId = "";
                this.loadMore();
            },
            //合伙人
            partnerDj() {
                axios({
                    method: "get",
                    url: this.Api +
                        "/application/record/agency/level?userId=" +
                        this.userId +
                        "&type=" +
                        this.type2,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.list.length) {
                        this.partnerdj = res.data.list[0].level;
                    } else {
                        this.partnerdj = null;
                    }

                    sessionStorage.setItem("partnerdj", this.partnerdj);
                });
            },
            infosize() {
                axios({
                    method: "get",
                    url: this.Api + "message/noReadNum?userId=" + this.userid,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 0) {
                        this.infoSize = res.data.data.totalCount;
                    } else {}
                });
            },
            azjxiaofei() {
                axios({
                    method: "get",
                    url: this.Api + "voucher/show?userId=" + this.userId,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 0) {
                        this.money = res.data.money;
                    } else {
                        Toast(res.data.msg);
                    }
                });
            },
            azjlinks() {
                azjlinks(this, this.userid);
            },

            clear() {
                this.money = null;
            },
            // 返回520app
            backshqfn() {
                window.action.backSHQ();
            },
            //跳转到订单
            goToOrder() {
                this.$router.push({
                    name: "myOrder"
                });
            },
            //判断是否有没有运营商没支付的订单
            isOrder() {
                let that = this;
                axios({
                    method: "get",
                    url: that.Api + "order/isPayStatus?userId=" + that.userid
                }).then(res => {
                    if (res.data.errno == 0) {
                        if (res.data.data.isPayStatus == 1) {
                            that.isPayStatus = true;
                        } else if (res.data.data.isPayStatus == 0) {
                            that.isPayStatus = false;
                        }
                    } else {
                        Toast({
                            message: res.data.errmsg,
                            position: "middle"
                        });
                    }
                });
            },
            // end
            indefn() {
                axios.get(this.Api1 + "/home/v1/homePage", {}).then(res => {
                    this.category = res.data.data.homePageColumn[0].listModule;
                    this.banner = res.data.data.homePageColumn[1].listModule;
                });
            },
            messagefn() {
                this.$router.push({
                    path: "/message"
                });
            },
            loadMore() {
                let that = this;
                if (this.LngLats == undefined || this.LngLats == null) {
                    setTimeout(() => {
                        that.LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
                        that.loadMore();
                    }, 200);
                    return;
                }
                if (this.district == null || this.district == "null") {
                    this.district = "";
                }

                this.loading = true;
                this.loadshow = true;
                let post = {
                    // lng: this.LngLats.lng,
                    // lat: this.LngLats.lat,
                    distance: this.dist,
                    pageNum: this.page,
                    pageSize: this.size,
                    province: this.prov,
                    city: this.city,
                    county: this.district
                };

                axios({
                        method: "post",
                        url: this.Api1 + "/shop/list",
                        data: post,
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8"
                        }
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            let data = res.data.data;
                            if (data.list.length == 0) {
                                that.loadend = true;
                                that.loading = true;
                                that.loadshow = false;
                                return false;
                            }
                            that.page++;
                            that.list = that.list.concat(data.list);
                        } else {
                            Toast(res.data.message);
                        }
                        that.loading = false;
                        that.loadshow = false;
                    })
                    .catch(err => {
                        that.loading = false;
                        that.loadshow = false;
                        Toast(err.message);
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
            // 推广商申请判断
            levelfn() {
                if (this.levelid && this.levelid > 1) {
                    axios({
                        url: this.Api + "/agency/info/",
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    }).then(res => {
                        let data = res.data;
                        if ((data.data && data.data != "") || data.data != null) {
                            if (data.data.status == 1) {
                                Toast("您已经是推广商。");
                            } else if (data.data.status == 0) {
                                Toast("推广商审核中");
                            } else {
                                this.$router.push({
                                    path: "investment"
                                });
                            }
                        } else {
                            Toast(data.errmsg);
                        }
                    });
                } else {
                    this.$router.push({
                        path: "investment"
                    });
                }
            },
            // 弹出商家申请弹窗
            indexFl() {
                if (this.type == 6) {
                    this.$router.push({
                        path: "/storeplat"
                    });
                } else {
                    this.permisVisible = true;
                }
            },
            navChange(val) {
                this.navheight(val);
            },
            navheight(v) {
                var h = $(" .mint-swipe-item")
                    .eq(v)
                    .height();
                $(" .mint-swipe").css("height", h + "px");
            },
            // 判断路程数目太高以计量单位粗略显示
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 10) / 10 + "km";
                    } else {
                        distance = distance + "m";
                    }
                    return distance;
                }
            },
            // 合并地区和地址
            addressfn(arr) {
                let text = "";
                arr.forEach(post => {
                    if (post) text += post;
                });
                return text;
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
            //判断惠盟用户卡到期七天内弹窗提示
            maturityTip() {
                let that = this;
                if (that.$cookie.get("isShowExpireTimeMsg") == "true") {
                    axios({
                        method: "get",
                        url: that.Api +
                            "order/getEndTimeMsg?userId=" +
                            that.$cookie.get("userid")
                    }).then(res => {
                        // console.log(res)
                        if (res.data.errno == 0) {
                            if (res.data.data.expireTimeMsg != "") {
                                MessageBox({
                                    title: "温馨提示",
                                    message: res.data.data.expireTimeMsg,
                                    showCancelButton: true,
                                    confirmButtonText: "续卡",
                                    closeOnClickModal: false
                                }).then(action => {
                                    if (action === "confirm") {
                                        this.$router.push({
                                            name: "selectionCard"
                                        });
                                    } else {
                                        this.$router.push({
                                            path: "/"
                                        });
                                    }
                                });
                            }
                        } else {}
                    });
                }
            },
            //日期加1天
            addDay(dayNumber, date) {
                date = date ? date : new Date();
                let ms = dayNumber * (1000 * 60 * 60 * 24);
                let newDate = new Date(date.getTime() + ms);
                return newDate;
            },
            //跳转到appStory下载
            jumpLoad() {
                let u = navigator.userAgent,
                    app = navigator.appVersion;
                let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
                let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                // console.log(isAndroid, isIOS)
                if (isAndroid) {
                    //这个是安卓操作系统

                    window.location.href = "http://ndhimg.520shq.com/apk/baiye1.4.2.apk";
                }
                if (isIOS) {
                    //这个是ios操作系统
                    window.location.href =
                        "https://itunes.apple.com/cn/app/m-ishenghuo/id1439281346?mt=8";
                }
            },
            closeDown() {
                this.$store.state.guideCloseShow = 1;
            },

            // 获取银联入驻信息
            getYLinfo() {
                let seq = this.$cookie.get("seq");
                this.$cookie.set("isShow", "no");
                axios
                    .get(this.Api + "UnionPayEnter/findAccountInfo?seq=" + seq, {
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        }
                    })
                    .then(res => {
                        if (res.data.code == 200) {
                            let applyStatus = res.data.data.applyStatus;
                            if (applyStatus == "20") {
                                MessageBox({
                                    title: "温馨提示",
                                    message: "尊贵的惠盟用户，百业惠盟现已接入分账系统，为保证您的收益不受影响，请尽快完成入驻，分账后每操作提现一笔，只需支付1.00元人民币作为提现手续费。请悉知。",
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "去入驻",
                                    cancelButtonText: "关闭"
                                }).then(action => {
                                    if (action == "confirm") {
                                        window.location.href =
                                            this.YLApi +
                                            "wholesale/uploading?from=by&seq=" +
                                            this.$cookie.get("seq");
                                    }
                                });
                                return;
                            }
                            if (applyStatus == "04" || applyStatus == "99") {
                                MessageBox({
                                    title: "温馨提示",
                                    message: "尊贵的运营商，您的银联入驻申请审核不通过，为保证您的收益不受影响，请重新提交资料",
                                    showCancelButton: true,
                                    showConfirmButton: true,
                                    confirmButtonText: "重填资料",
                                    cancelButtonText: "关闭"
                                }).then(action => {
                                    if (action == "confirm") {
                                        // this.$router.push('/settings/bankCardYL');
                                        window.location.href =
                                            this.YLApi +
                                            "wholesale/uploadf?from=by&seq=" +
                                            this.$cookie.get("seq");
                                    }
                                });
                                return;
                            }
                            if (applyStatus == "21") {
                                this.$cookie.set("isYLEnter", "yes");
                            }
                        }
                    });
            }
        }
    };

</script>

<style scoped>
    /* header */
    i.el-icon-circle-close-outline::before {
        font-size: 26px !important;
        color: #fff;
        position: absolute;
        right: 0.2rem;
        top: 0.2rem;
    }

    .mainbox>>>.mint-header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 9;
    }

    html,
    body,
    .body-container {
        height: 100%;
    }

    .mainbox {
        overflow-y: auto;
        padding-top: 40px;
        padding-bottom: 60px;
        height: 100%;
    }

    .column-img>>>.mint-swipe {
        width: 100%;
        min-height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;
    }

    .column-img>>>.mint-swipe-items-wrap {
        width: 94%;
        height: 94%;
        border-radius: 10px;
    }

    .column-img>>>.mint-swipe-item img {
        width: 100%;
        height: 100%;
    }

    .nav-list {
        overflow: hidden;
        margin: 0.1rem 0 0.6rem;
    }

    .nav-list {
        font-size: 12px;
    }

    .nav-list div {
        height: auto;
    }

    .nav-list ul {
        overflow: hidden;
    }

    .nav-list li {
        float: left;
        width: 20%;
        font-size: 0.6rem;
        margin-bottom: 0.5rem;
    }

    .nav-list li span {
        display: block;
        width: 2rem;
        height: 2rem;
        border-radius: 0.2rem;
        margin: 0 auto 0.2rem;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center center;
    }

    .nav-list li p {
        display: block;
        text-align: center;
        font-size: 12px;
        line-height: 1.4em;
        color: #333;
    }

    .chanpinlist {
        overflow: hidden;
        position: relative;
        padding: 0.5rem;
        background-color: #f5f5f5;
    }

    .cptitle {
        padding: 0.4rem;
        text-align: center;
    }

    .cptitle img {
        width: 9rem;
    }

    .cpbox {
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .waterfall {
        background-color: #f5f5f5;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
        padding: 0.5rem;
    }

    .cplist {
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #fff;
        margin-bottom: 0.5rem;
    }

    .cplist .cpimg img {
        width: 100%;
        height: 6.8rem;
    }

    .cplist .cptext {
        width: 100%;
        font-size: 0.6rem;
        padding: 0.3rem;
    }

    .button-box {
        display: flex;
        /* justify-content: space-between; */
        justify-content: center;
        padding: 0 1.541667rem;
        margin-top: 1.2rem;
        text-align: center;
    }

    .default-btn {
        display: block;
        width: 11em;
        height: 1.5rem;
        font-size: 0.6rem;
        border: 1px solid #ff8425;
        text-align: center;
        line-height: 1.5rem;
        border-radius: 0.833333rem;
        margin: 0 0.5rem;
        color: #fff;
        background-color: #ff8425;
    }

    .cplist .cptext .cpname {
        display: -webkit-flex;
        display: flex;
        color: #212121;
        overflow: hidden;
        font-size: 0.65rem;
        font-weight: 500;
        line-height: 1rem;
        max-height: 2rem;
    }

    .azj_box {
        width: 12rem;
        height: 14rem;
        background-image: url("../assets/images/azjdgj.png");
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index: 999;
        border-radius: 0.66rem;
        padding: 3.3rem 0 1.1rem 0;
    }

    .azj_box p {
        text-align: center;
        margin-bottom: 0.8rem;
    }

    .azj_box .p1 {
        font-size: 0.92rem;
        color: #fff;
    }

    .azj_box .p2 {
        font-size: 1.55rem;
        color: #f9f740;
    }

    .azj_box .p3 {
        font-size: 0.8rem;
        color: #fff;
    }

    .cplist .cptext .cpclass {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff4400;
        line-height: 1.4em;
    }

    .cplist .cptext .cpclass {
        padding-top: 0.2rem;
    }

    .cplist .cptext .cpadress {
        padding-bottom: 0.2rem;
        display: flex;
        justify-content: flex-start;
    }

    .cplist .cptext .cpadress p {
        font-size: 0.48rem;
        padding: 0.1rem;
        color: #ffa47a;
        margin-right: 8px;
    }

    .cplist .cptext .cphui,
    .cplist .cptext .cpjuan {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
        line-height: 1.4em;
        font-size: 0.58rem;
    }

    .cplist .cptext .cphui {
        padding-bottom: 0.1rem;
    }

    .cplist .cptext .cphui i,
    .cplist .cptext .cpjuan i {
        display: inline-block;
        color: white;
        padding: 0 0.2em;
        border-radius: 3px;
        margin-right: 0.1rem;
        font-size: 0.58rem;
    }

    .cplist .cptext .cphui i {
        background: #ec0746;
    }

    .cplist .cptext .cpjuan i {
        background: #ff841e;
    }

    .cplucheng {
        font-size: 0.72rem;
        color: #ec0746;
    }

    /* popup */
    .mainbox>>>.mint-popup {
        overflow: hidden;
        border-radius: 0.3rem;
        min-width: 240px;
        max-width: 500px;
        background: transparent;
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

    .permislink {
        position: absolute;
        left: 15%;
        bottom: 13%;
        width: 70%;
        height: 1.5rem;
    }

    /*  */
    .indexFl {
        padding: 0 0.5rem 0.5rem;
        overflow: hidden;
    }

    .indexFl img {
        display: block;
        pointer-events: none;
    }

    .guide {
        position: fixed;
        left: 0;
        top: 40px;
        width: 100%;
        height: 2rem;
        z-index: 9;
    }

    .guide .dw {
        position: relative;
        height: 2.083333rem;
    }

    .guide .down-load {
        position: absolute;
        width: 2.5rem;
        height: 0.75rem;
        right: 2.666667rem;
        top: 50%;
        margin-top: -0.375rem;
        line-height: 0;
    }

    .guide .down-load img {
        width: 100%;
        height: 100%;
    }

    .guide .close-down {
        display: block;
        width: 0.583333rem;
        height: 0.583333rem;
        background-image: url("../assets/images/xiazai_del.png");
        background-size: cover;
        background-position: center center;
        position: absolute;
        right: 1.041667rem;
        top: 50%;
        margin-top: -0.291667rem;
    }

    .pay-box {
        position: relative;
        height: 2.083333rem;
    }

    .go-pay {
        position: absolute;
        width: 2.5rem;
        height: 0.875rem;
        right: 0.416667rem;
        top: 50%;
        transform: translateY(-50%);
    }

    .shounav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 1.6rem 0 0.8rem;
        font-size: 0.5rem;
        background: linear-gradient(#ff911e, #fff);
    }

    .shounav .shouitem {
        width: 19%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
    }

    .shounav .shouitem .mtop {
        margin-top: 0.4rem;
    }

    .shounav .shouitem img {
        width: 70%;
    }

    .video-js {
        width: 100%;
        height: 100%;
    }

</style>
