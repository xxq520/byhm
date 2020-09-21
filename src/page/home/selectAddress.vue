<template>
    <div class="adress">
        <div class="tavnav">
            <i class="el-icon-arrow-left" @click="goback()"></i>
            <div class="searhbox">
                <i class="mint-toast-icon mintui mintui-search"></i>
                <input type="text" v-model="araeval" placeholder="请输入要搜索的地址" @input="quyujiansuo(araeval)">
            </div>
        </div>
        <div class="adda">
            <div class="loca">
                您正在看：{{cityVal}}
            </div>
            <div @click="qieShow">
                <span class="adre">切换区县</span>
                <i class="el-icon-arrow-down" v-if="!isShow"></i>
                <i class="el-icon-arrow-up" v-else></i>
            </div>
        </div>
        <div class="areass" v-if="isShow">
            <li v-for="item in arealist" @click="chooseArea(item)">
                <p> {{item.countyName}} </p>
            </li>
        </div>

        <div class="hosity">
            <div style="margin-bottom: 0.6rem;">定位/最近访问</div>
            <ul>
                <li v-for="(item ,index) in history" v-if="index< 8 " @click="xuandw(item)">
                    <p> <img src="@/assets/images/shoppingMall/home_p2_icon_dw.png"
                            v-if="$store.state.cityChoose == item">
                        {{item}}
                    </p>
                </li>
            </ul>
        </div>
        <div class="sclist" v-show="scShow">
            <li v-for="(item,index) in sclist" class="listd" @click="xzsArea(item)">
                <div style="color:#333;"><span v-show="item.provinceName != item.cityName">{{item.provinceName}}</span>
                    {{item.cityName}}
                </div>
            </li>
        </div>
        <div class="mianbox">
            <div class="mtitle">{{ tltext }}</div>
            <div class="item" v-for="(item,index) in letter" :key="index" >
                <div class="zimu">{{ index }}</div>
                <div class="listtext">
                    <p v-for="(p,i) in item" :key="i">
                        <span @click="areafn(p)">{{ p.cityName }}</span>
                    </p>
                </div>
            </div>
        </div>
        <!-- <baiduMap :change="changeCurrent" @getCurrent="getCurrentfn"></baiduMap> -->
    </div>
</template>
<script>
    // 中文转拼音
    import jsonpAdapter from 'axios-jsonp';
    import spell from '@/assets/js/spell';
    import baiduMap from '@/components/baiduMap'
    export default {
        data() {
            return {
                topnav: {
                    title: '选择地址'
                },
                letter: {
                    'A': [],
                    'B': [],
                    'C': [],
                    'D': [],
                    'E': [],
                    'F': [],
                    'G': [],
                    'H': [],
                    'I': [],
                    'J': [],
                    'K': [],
                    'L': [],
                    'M': [],
                    'N': [],
                    'O': [],
                    'P': [],
                    'Q': [],
                    'R': [],
                    'S': [],
                    'T': [],
                    'U': [],
                    'V': [],
                    'W': [],
                    'X': [],
                    'Y': [],
                    'Z': []
                },
                tltext: '',
                type: 1,
                region: {},
                current: new Object(),
                changeCurrent: 0,
                backshqPd: sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route
                    .query.platform == 'ios',

                userid: this.$cookie.get('userid'),
                userName: this.$cookie.get('userPhone'),
                cityVal: '',
                arealist: [],
                isShow: false,
                LngLats: {},
                history: [],
                sclist: [],
                scShow: false,
                araeval: '',
                changeCurrents: 0,

            }
        },
        // components: {
        //     baiduMap
        // },
        mounted() {
            this.LngLats = JSON.parse(sessionStorage.getItem('LngLats'));
            this.cityVal = sessionStorage.getItem('cityMap');
            this.history = sessionStorage.getItem('areaList') ? JSON.parse(sessionStorage.getItem('areaList')) : [];
            this.getarea();
            this.cityfn();

        },
        methods: {
            //tap切换
            xuandw(val) {
                var that = this;
                axios({
                    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + val +
                        '&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
                    adapter: jsonpAdapter
                }).then((res) => {
                    let data = res.data.result.location;
                    sessionStorage.setItem('LngLats', JSON.stringify(data));
                    axios({
                        url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=ufanROIB49bsOCK7FEU2o7Vr&output=json&coordtype=wgs84ll&location=' +
                            data.lat + ',' + data.lng,
                        adapter: jsonpAdapter
                    }).then((res) => {
                        let data = res.data.result;
                        sessionStorage.setItem('provMap', data.addressComponent.province);
                        sessionStorage.setItem('cityMap', data.addressComponent.city);
                        sessionStorage.setItem('distMap', data.addressComponent.district);
                        sessionStorage.setItem('address', null);
                        this.cityVal = data.addressComponent.city;
                    });
                });
                this.$store.commit("cityChose", val);
                setTimeout(() => {
                     this.$router.go(-1)
                }, 100);

            },
            //选择搜索地址
            xzsArea(val) {
                var that = this;
                axios({
                    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + val.cityName +
                        '&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
                    adapter: jsonpAdapter
                }).then((res) => {
                    let data = res.data.result.location;
                    sessionStorage.setItem('LngLats', JSON.stringify(data));
                });

                sessionStorage.setItem('provMap', val.provinceName);
                sessionStorage.setItem('cityMap', val.cityName);
                sessionStorage.setItem('distMap', null);
                sessionStorage.setItem('address', null);
                this.cityVal = val.cityName;
                this.getarea();
                this.scShow = false;
            },
            //切换显示隐藏
            qieShow() {
                this.isShow = !this.isShow;
            },
            //区域搜索
            quyujiansuo(val) {
                if (val == '' || val == null) {
                    this.scShow = false
                    return;
                }
                this.scShow = true;
                axios.get(this.Api1 + '/home/querySearchCityList?city=' + val).then(res => {
                    let data = res.data.data;
                    this.sclist = data;
                })
            },
            getCurrentfn(val) {
                var that = this;
                if (this.changeCurrents != 0) {
                    this.current = val;
                    sessionStorage.setItem('cityMap', val.city);
                    sessionStorage.setItem('provMap', val.province);
                    sessionStorage.setItem('distMap', val.area);
                    sessionStorage.setItem('address', val.address);
                    sessionStorage.setItem('LngLats', JSON.stringify({
                        lng: val.point.lng,
                        lat: val.point.lat
                    }));
                    this.cityVal = val.city;

                    setTimeout(() => {
                         this.$router.go(-1)
                    }, 100);
                }
                this.changeCurrents = 1
            },
            dangqianfn() {
                let that = this
                Indicator.open();
                setTimeout(function () {
                    Indicator.close();
                    that.appGetRegion({
                        province: that.current.province,
                        city: that.current.city,
                        area: that.current.area
                    });

                }, 100);
            },

            cityfn() {
                let that = this;
                this.tltext = '选择城市';
                axios.get(this.Api1 + '/home/querySearchCityList').then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                })
            },
            areafn(val) {
                let that = this;
                sessionStorage.setItem('provMap', val.provinceName);
                sessionStorage.setItem('cityMap', val.cityName);
                sessionStorage.setItem('distMap', null);
                sessionStorage.setItem('address', null);
                this.cityVal = val.cityName;
                this.isShow = true;
                axios({
                    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + val.cityName +
                        '&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
                    adapter: jsonpAdapter
                }).then((res) => {
                    let data = res.data.result.location;
                    sessionStorage.setItem('LngLats', JSON.stringify(data));
                });
                this.getarea()
            },
            //获取市下面的县区
            getarea() {
                axios.get(this.Api1 + '/home/queryAreaList?city=' + this.cityVal).then(res => {
                    let data = res.data.data;
                    this.arealist = data;
                })
            },
            //选择获取的县区
            chooseArea(val) {
                sessionStorage.setItem('distMap', val.countyName);
                axios({
                    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + val.countyName +
                        '&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
                    adapter: jsonpAdapter
                }).then((res) => {    
                   if (res.data.status == 0) {
                        let data = res.data.result.location;
                        sessionStorage.setItem('address', null);
                        sessionStorage.setItem('LngLats', JSON.stringify(data));
                    }

                });

                this.$store.commit("cityChose", val.countyName);
                let searchHistory = sessionStorage.getItem('areaList');
                let areaHistory = [];
                if (searchHistory == null || searchHistory == undefined) {
                    areaHistory.push(val.countyName);
                } else {
                    let searchArr = JSON.parse(searchHistory);
                    if (searchHistory.indexOf(val.countyName) == -1) {
                        if (searchArr.length > 0 && searchArr.length < 3) {
                            areaHistory.push(val.countyName);
                            areaHistory = areaHistory.concat(searchArr);
                        } else if (searchArr.length == 3) {
                            searchArr.splice(2, 1)
                            areaHistory.push(val.countyName);
                            areaHistory = areaHistory.concat(searchArr);
                        } else {
                            areaHistory.push(val.countyName);
                        }
                    } else {
                        areaHistory = searchArr;
                    }
                };
                sessionStorage.setItem('areaList', JSON.stringify(areaHistory));
                setTimeout(() => {
                     this.$router.go(-1)
                }, 100);
            },
            goback() {
                this.$router.go(-1)
            },
            // 同步app地区选择
            appGetRegion(obj) {
                if (this.backshqPd) window.action.getRegion(JSON.stringify(obj));
            },
            letterfn(arr) {
                let that = this;
                for (var i in that.letter) {
                    that.letter[i] = [];
                    
                    (function (i) {
                        arr.forEach(d => {
                            if (i == spell(d.cityName).substr(0, 1)) {
                                that.letter[i].push(d);
                            }
                        })
                    })(i);

                };
            }
        }
    }

</script>

<style scoped>
    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .8rem;
    }

    .tavnav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: 0;
    }

    .searhbox {
        flex: 1;
        overflow: hidden;
        height: 1.3rem;
        margin: 0 auto;
        display: -webkit-flex;
        flex-direction: row;
        justify-content: space-between;
        display: flex;
        padding: 1px 0.5rem;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 1em;
        max-width: 75%;
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

    .adre {
        max-width: 80%;
        overflow: hidden;
        height: 1.5rem;
        line-height: 1.5rem;
    }

    .adress {
        width: 100%;
        overflow: auto;

        display: -webkit-flex;
        padding-top: 40px;
        display: flex;
        flex-direction: column;
        background: #f5f5f5;
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
        padding: 0 15px;
        overflow: auto;
        background: white;
        height: 70vh;
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
        height: 2.2rem;
        line-height: 2.2rem;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        font-size: 14px;
        color: #555;
        border-bottom: 1px solid #eee;

    }

    .adda .loca {


        text-align: left;

        flex: 1;
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

    .sclist {
        position: fixed;
        top: 40px;
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        width: 100%;
        height: calc(100% - 40px);
        overflow-y: scroll;
        padding: 0.4rem;
    }

    .sclist li {

        width: 100%;
        padding: 0.2rem;
        border-bottom: 1px solid #eee;
        line-height: 2.2rem;


    }

    .sclist li:last-child {
        border-bottom: none;
    }

    .areass {
        background-color: #fff;
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem;
        font-size: 0.62rem;
        box-sizing: border-box;
    }

    .areass li {

        height: 1.5rem;
        display: flex;
        font-size: 0.55rem;
        justify-content: center;
        margin-bottom: 0.5rem;
        overflow: hidden;
        margin-right: 0.5rem;
    }

    .areass li p {

        padding: 0 0.6rem;
        text-align: center;
        line-height: 1.5rem;
        line-height: 1.5rem;
        background-color: #f5f5f5;
    }

    .hosity {
        padding: 0.3rem 0.5rem  0;
        font-size: 0.62rem;
    }

    .hosity ul {

        display: flex;
        flex-wrap: wrap;

    }

    .hosity ul li {

        height: 1.5rem;
        display: flex;
        justify-content: center;
        margin-bottom: 0.5rem;
        margin-right: 0.5rem;
    }

    .hosity ul li img {
        width: 0.45rem;
        height: 0.65rem;
        margin-right: 0.1rem;
    }

    .hosity ul li p {
        padding: 0 0.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1.5rem;
        background-color: #fff;
    }

</style>
