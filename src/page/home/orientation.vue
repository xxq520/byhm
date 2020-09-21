<template>
    <div class="adress">
        <mt-header title="选择地址">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button slot="right" @click="goadd" style="font-size: 14px;">新增地址</mt-button>
        </mt-header>
        <div class="adda">
            <div class="loca" @click="areaChoose">
                <img src="@/assets/images/by_home_i1.png" />
                <mt-button>
                    <span class="adre">{{cityVal}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </mt-button>
            </div>
            <div class="searhbox">
                <i class="mint-toast-icon mintui mintui-search"></i>
                <input type="text" v-model="araeval" placeholder="请输入要搜索的地址" @input="quyujiansuo(araeval)" />
            </div>
        </div>
        <div class="location" @click="locationfn">
            <img src="@/assets/images/by_home_icon2.png" />
            <div class="rb">获取当前定位</div>
        </div>

        <div class="scrollss">
            <div class="heade scope">
                <img src="@/assets/images/by_home_icon_s.png" />
                <div>我的收货地址</div>
            </div>
            <div class="araelist">
                <li v-for="(item,index) in arealist" class="listd" v-show="index<3||isShow" @click="xzmArea(item)">
                    <div style="color:#111; line-height: 1rem;">
                        {{item.provinceName}}{{item.cityName}}{{item.countyName}}{{item.detailInfo}}</div>
                    <div class="detail">
                        <span>{{item.userName}}</span>
                        <span>{{item.shippingSex}}</span>
                        <span>{{item.telNumber}}</span>
                    </div>
                </li>
                <div v-if="arealist.length> 3">
                    <div class="foote" v-show="isShow">
                        <div @click="qieShow">收起全部</div>
                        <img src="@/assets/images/by_home_icon_xl.png" />
                    </div>
                    <div class="foote" v-show="!isShow">
                        <div @click="qieShow">展开全部地址</div>
                        <img src="@/assets/images/by_home_icon_sl.png" />
                    </div>
                </div>
            </div>
            <div class="heade" id="xifu">
                <img src="@/assets/images/by_home_i1.png" />
                <div>附近地址</div>
            </div>
            <div class="araelist">
                <li v-for="(item,index) in nearby" class="listd" @click="xzfArea(item)">
                    <div style="color:#333;">{{item.name}}</div>
                    <div class="price">
                        <p class="juli" v-if="item.detail_info.distance>1000">
                            {{(item.detail_info.distance/1000).toFixed(2)}}km</p>
                        <p class="juli" v-else>{{parseInt(item.detail_info.distance)}}m</p>
                    </div>
                </li>
            </div>
        </div>

        <div class="sclist" v-show="scShow">
            <li v-for="(item,index) in sclist" class="listd" @click="xzsArea(item)">
                <div style="color:#333;">{{item.name}}</div>
                <div style="color:#333;">{{item.area}}</div>
            </li>
        </div>
        <div class="mianbox" v-if="!loadshow">
            <div class="mtitle">{{ tltext }}</div>
            <div class="item" v-for="(item,index) in letter" :key="index" v-if="item.length > 0">
                <div class="zimu">{{ index }}</div>
                <div class="listtext">
                    <p v-for="(p,i) in item" :key="i">
                        <span v-if="type==2" @click="cityfn(p.id, p.name)">{{ p.name }}</span>
                        <span v-if="type==3" @click="areafn(p.id, p.name)">{{ p.name }}</span>
                    </p>
                </div>
            </div>
        </div>


        <div id="allmap"></div>
    </div>
</template>

<script>
    // 中文转拼音
    import jsonpAdapter from "axios-jsonp";
    import spell from "@/assets/js/spell";
    export default {
        data() {
            return {
                topnav: {
                    title: "选择地址"
                },
                letter: {
                    A: [],
                    B: [],
                    C: [],
                    D: [],
                    E: [],
                    F: [],
                    G: [],
                    H: [],
                    I: [],
                    J: [],
                    K: [],
                    L: [],
                    M: [],
                    N: [],
                    O: [],
                    P: [],
                    Q: [],
                    R: [],
                    S: [],
                    T: [],
                    U: [],
                    V: [],
                    W: [],
                    X: [],
                    Y: [],
                    Z: []
                },
                tltext: "",
                type: 1,
                region: {},
                postdata: {
                    prov: {},
                    city: {},
                    area: {}
                },
                loadshow: true,
                current: new Object(),
                changeCurrent: 0,
                backshqPd: sessionStorage.getItem("applogin") ||
                    this.$route.query.platform == "android" ||
                    this.$route.query.platform == "ios",

                userid: this.$cookie.get("userid"),
                userName: this.$cookie.get("userPhone"),
                cityVal: "",
                arealist: [],
                isShow: false,
                LngLats: {},
                nearby: [],
                sclist: [],
                scShow: false,
                araeval: "",
                changeCurrents: 0
            };
        },
        components: {

        },
        mounted() {
            this.LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
            this.cityVal = sessionStorage.getItem("cityMap");
            axios({
                url: 'https://api.map.baidu.com/place/v2/search?query="美食$酒店$公共设施"&location=' +
                    this.LngLats.lat +
                    "," +
                    this.LngLats.lng +
                    "&radius=300&city_limit=true&output=json&scope=2&page_size=20&ak=ufanROIB49bsOCK7FEU2o7Vr",
                adapter: jsonpAdapter
            }).then(res => {
                if (res.data.status == 0) {
                    this.nearby = res.data.results;
                }
            });
            this.getInfo();
        },
        methods: {
            //获取收货地址列表
            getInfo() {
                axios({
                    method: "get",
                    url: this.Api1 + "/user/shippingAddress/queryAll",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.arealist = data;
                    }
                });
            },

            //选择保存地址进行定位
            xzmArea(val) {
                var that = this;
                sessionStorage.setItem("cityMap", val.cityName);
                sessionStorage.setItem("provMap", val.provinceName);
                sessionStorage.setItem("distMap", val.countyName);
                sessionStorage.setItem("address", val.detailInfo);
                sessionStorage.setItem(
                    "LngLats",
                    JSON.stringify({
                        lng: val.baiDuLng,
                        lat: val.baiDuLat
                    })
                );
                this.cityVal = val.cityName;
                setTimeout(() => {
                    that.$router.go(-1);
                }, 300);
            },
            //选择附近地址
            xzfArea(val) {
                console.log(val)
                var that = this;

                sessionStorage.setItem("cityMap", val.city);
                sessionStorage.setItem("provMap", val.province);
                sessionStorage.setItem("distMap", val.area);
                sessionStorage.setItem("address", val.address);
                sessionStorage.setItem(
                    "LngLats",
                    JSON.stringify({
                        lng: val.location.lng,
                        lat: val.location.lat
                    })
                );

                setTimeout(() => {
                    that.$router.go(-1);
                }, 300);
            },
            //选择搜索地址
            xzsArea(val) {
                var that = this;
                console.log(val)
                if (val.city) {
                    sessionStorage.setItem("cityMap", val.city);
                   
                }
                if (val.province) {
                    sessionStorage.setItem("provMap", val.province);
                    
                }
                if (val.area) {
                    sessionStorage.setItem("distMap", val.area);
               
                }
                if (val.address) {
                    sessionStorage.setItem("address", val.address);
                   
                } else {
                    sessionStorage.setItem("address", val.name);
                  
                }

                sessionStorage.setItem(
                    "LngLats",
                    JSON.stringify({
                        lng: val.location.lng,
                        lat: val.location.lat
                    })
                );
               
                setTimeout(() => {
                    that.$router.go(-1);
                }, 300);
            },
            //切换显示隐藏
            qieShow() {
                this.isShow = !this.isShow;
            },
            areaChoose() {
                this.provinces();
                this.loadshow = false;
            },
            //新增地址跳转
            goadd() {
                this.$router.push("/newAddress");
                this.$cookie.get("token");
            },
            //区域搜索
            quyujiansuo(val) {
                // console.log(val)
                if (val == "" || val == null) {
                    this.scShow = false;
                    return;
                }
                this.scShow = true;
                axios({
                    url: "https://api.map.baidu.com/place/v2/search?query=" +
                        val +
                        "&region=" +
                        this.cityVal +
                        "&city_limit=false&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr",
                    adapter: jsonpAdapter
                }).then(res => {
                    if (res.data.status == 0) {
                        this.sclist = res.data.results;
                        // console.log(this.sclist, '2')
                    }
                });
            },
            dangqianfn() {
                let that = this;
                Indicator.open();
                setTimeout(function () {
                    Indicator.close();

                    that.appGetRegion({
                        province: that.current.province,
                        city: that.current.city,
                        area: that.current.area
                    });
                }, 300);
            },
            locationfn() {
                var that = this;
                var myCity = new BMap.LocalCity();
                myCity.get(function (result) {
                    var myGeo = new BMap.Geocoder();
                    var point = new BMap.Point(result.center.lng, result.center.lat);
                    myGeo.getLocation(point, function (rs) {

                        var addComp = rs.addressComponents;
                        that.current = rs.addressComponents;
                        console.log(rs.addressComponents);
                        sessionStorage.setItem('cityMap', addComp.city);
                        sessionStorage.setItem('provMap', addComp.province);
                        sessionStorage.setItem('distMap', addComp.district);
                        sessionStorage.setItem('address', rs.address);

                        sessionStorage.setItem('LngLats', JSON.stringify({
                            lng: rs.point.lng,
                            lat: rs.point.lat
                        }));
                        that.cityVal = addComp.city;
                        setTimeout(() => {
                            that.$router.go(-1);
                        }, 300);
                    })
                });
            },
            provinces() {
                let that = this;
                this.tltext = "选择省份";
                that.$set(that.postdata, "prov", {});
                that.$set(that.postdata, "city", {});
                that.$set(that.postdata, "area", {});
                this.type = 2;
                axios.get(this.Api + "region/getRegion?parentId=1").then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                });
            },
            cityfn(val, text) {
                let that = this;

                this.tltext = "选择城市";
                this.type = 3;
                this.$set(that.postdata, "prov", {
                    id: val,
                    name: text
                });
                sessionStorage.setItem("provMap", text);

                axios.get(this.Api + "region/getRegion?parentId=" + val).then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                });
            },
            areafn(val, text) {
                let that = this;
                this.loadshow = true;
                this.tltext = "选择地区";
                this.$set(that.postdata, "city", {
                    id: val,
                    name: text
                });
                sessionStorage.setItem("cityMap", text);

                this.type = 4;
                this.cityVal = text;

                axios({
                    url: "https://api.map.baidu.com/geocoder/v2/?address=" +
                        text +
                        "&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr",
                    adapter: jsonpAdapter
                }).then(res => {
                    let data = res.data.result.location;
                    sessionStorage.setItem("LngLats", JSON.stringify(data));
                });
                sessionStorage.setItem("address", text);
            },

            goback() {
                this.$router.go(-1);
            },
            // 同步app地区选择
            appGetRegion(obj) {
                if (this.backshqPd) window.action.getRegion(JSON.stringify(obj));
            },
            letterfn(arr) {
                let that = this;
                this.loadshow = false;
                for (var i in that.letter) {
                    that.letter[i] = [];
                    (function (i) {
                        arr.forEach(d => {
                            if (i == spell(d.name).substr(0, 1)) {
                                that.letter[i].push(d);
                            }
                        });
                    })(i);
                }
            }
        }
    };

</script>

<style scoped>
    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: 0.8rem;
    }

    .head-btn>>>.mint-button-text {
        font-size: 12px;
        padding: 5px;
        border: 1px solid #ffac67;
        border-radius: 4px;
    }

    .adre {
        max-width: 80%;
        overflow: hidden;
        height: 1.5rem;
        line-height: 1.5rem;
    }

    .adress {
        width: 100%;
        overflow: hidden;
        height: 100vh;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        background: #f5f5f5;
    }

    .location {
        padding: 0.3rem;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        font-size: 14px;
        background: white;
        justify-content: center;
        margin: 5px 0;
    }

    .location img {
        width: 0.7rem;
        height: 0.7rem;
        margin-right: 0.2rem;
    }

    .timelist {
        padding: 0 10px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        font-size: 14px;
        background: white;
    }

    .timelist .tp {
        padding: 10px 0;
    }

    .timelist .tlist p {
        float: left;
        padding: 10px 0;
    }

    .timelist .tlist p.dangqian {
        color: #ff911e;
        padding: 10px 0 8px 0;
        border-bottom: 2px solid #ff911e;
    }

    .timelist .tlist span {
        float: left;
        padding: 10px 0.3em;
    }

    .mianbox {
        width: 100%;
        margin-top: 0.1rem;
        flex: 1;
        height: calc(100% - 125px);
        padding: 0 15px;
        overflow: auto;
        background: white;
        position: fixed;
        top: 125px;
    }

    .mtitle {
        font-size: 12px;
        line-height: 1.4em;
        color: #999;
        padding: 10px 0;
    }

    .item {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }

    .item .zimu {
        width: 1em;
        font-size: 14px;
        color: #999;
        margin-right: 15px;
        line-height: 1.4em;
    }

    .item .listtext {
        flex: 1;
    }

    .item .listtext p {
        color: #0d0d0d;
        font-size: 14px;
        line-height: 1.4em;
        padding-bottom: 15px;
    }

    .adda {
        background-color: #fff;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.1rem 0.5rem;
    }

    .adda .loca {
        color: #fff;
        text-align: left;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        overflow: hidden;
        max-width: 35%;
    }

    .loca i.el-icon-caret-bottom {
        color: #333;
        font-size: 14px;
        padding-top: 1px;
    }

    .loca img {
        width: 0.5rem;
        height: 0.6rem;
        margin-right: 0.1rem;
    }

    .loca .mint-button {
        height: 1.5rem;
        background-color: transparent;
        border: 0;
        -webkit-box-shadow: none;
        box-shadow: none;

        color: #333;
        display: inline-block;
        padding: 0;
        font-size: inherit;
    }

    .loca>>>.mint-button-text {
        padding-top: 0.2em;
        display: block;
        width: 100%;
        display: flex;
        align-items: center;
    }

    .searhbox {
        flex: 1;
        overflow: hidden;
        margin: 0 auto;
        display: -webkit-flex;
        flex-direction: row;
        justify-content: space-between;
        display: flex;

        padding: 1px 0.5rem;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 2em;
        width: 75%;
        margin: 0.2rem 0.5rem 0;
        align-items: center;
        background-color: #eee;
    }

    .searhbox input {
        background: transparent;
        color: #856d54;
        float: left;
        width: calc(100% - 1.5rem);
        height: 28px;
    }

    .searhbox i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 1px;
    }

    .scrollss {
        width: 100%;
        height: calc(100% - 125px);
        overflow: auto;
    }

    .araelist {
        padding: 0.2rem 0.4rem;
        font-size: 0.52rem;
        color: #666;
        background-color: #fff;
    }

    .heade {
        display: flex;
        align-items: center;
        color: #333;
        font-size: 0.58rem;
        padding: 0.2rem 0.5rem;
        background-color: #fff;
        margin-top: 0.3rem;
        position: sticky;
        top: 0;
    }

    .heade img {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.2rem;
    }

    .araelist li {
        min-height: 2.5rem;
        padding: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid #eee;
    }

    .araelist li:last-child {
        border-bottom: none;
    }

    .araelist .foote {
        display: flex;
        align-items: center;
        color: #333;
        height: 1.5rem;
        padding: 0.3rem;
    }

    .araelist .foote img {
        width: 0.6rem;
        height: 0.3rem;
        margin-left: 0.2rem;
    }

    .sclist {
        position: fixed;
        top: 125px;
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        width: 100%;
        height: calc(100% - 125px);
        overflow-y: scroll;
        padding: 0.4rem;
    }

    .sclist li {
        height: 2.5rem;
        width: 100%;
        padding: 0.2rem;
        border-bottom: 1px solid #eee;
    }

    .sclist li:last-child {
        border-bottom: none;
    }

</style>
