<template>
    <div class="mainbox">
        <mt-header title="选择详细地址">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <mt-button class="head-btn" slot="right" @click="getlocationfn">确定定位</mt-button>
        </mt-header>
        <div class="adressSeach">
            <div class="city" @click="addressfn">
                <span>{{ !location.area?location.city:!location.city?location.prov:location.area }}<i
                        class="el-icon-caret-bottom"></i></span>
            </div>
            <div class="seach" @click="seach"><input v-model="keyword" readonly></div>
        </div>
        <baidu-map class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @dragstart="mapTouch"
            @dragend="syncCenterEnd" @zoomend="syncCenterAndZoom">
            <bm-marker v-if="marker" :position="center" :icon="icon"></bm-marker>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        </baidu-map>
        <baidu-map @ready="localhandler"></baidu-map>
        <div class="cell">
            <!--选择地址-->
            <div class="cell-item">
                <div class="cell-icon"><span class="shover"></span></div>
                <div class="cell-adress">
                    <p class="phover">{{ change.title }}</p>
                    <span>{{ change.address }}</span>
                </div>
                <div class="cell-right">
                    <p>目前所选定位</p>
                </div>
            </div>
            <!--选择地址-->
            <div class="cell-item" @click="positioning">
                <div class="cell-icon"><i class="el-icon-location"></i></div>
                <div class="cell-adress">
                    <p class="phover">{{ current.title }}</p>
                    <span>{{ current.address }}</span>
                </div>
                <div class="cell-right">
                    <p>当前GPS定位</p>
                    <span><img src="@/assets/images/sxdw.png">刷新定位</span>
                </div>
            </div>
            <!--选择地址-->
            <div v-for="(item,i) in ar" :key="i" class="cell-item" @click="changeAddress(item)">
                <div class="cell-icon"><span></span></div>
                <div class="cell-adress">
                    <p>{{ item.title }}</p>
                    <span>{{ item.address }}</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import browser from '@/assets/js/browVesion'
    export default {
        data() {
            return {
                id: this.$route.query.id,
                location: {},
                keyword: '',
                ar: [], // 周边位置数组
                center: {
                    lng: 116.404,
                    lat: 39.915
                }, // 初始化坐标
                radius: 1000,
                zoom: 16,
                change: {}, // 当前显示地址位置
                current: {}, // 当前定位地址位置
                icon: {
                    url: require('@/assets/images/map.png'),
                    size: {
                        width: 30,
                        height: 30
                    }
                },
                marker: false,
                localbluoon: true,
                mapbloon: false,
                mapTouchbluoon: false
            }
        },
        computed: {
            ...mapState(["map"])
        },
        watch: {
            change(val) {
                this.handler();
                this.keyword = val.title;
            }
        },
        mounted() {
            if (this.map) this.mapbloon = this.map.point ? true : false;
        },
        methods: {
            goback() {
                this.$router.go(-1);
                this.removeMap();
            },
            getlocationfn() {
                let that = this;
                MessageBox({
                    title: "温馨提示",
                    message: '<p style="text-align:center;text-indent:0;">确定当前选择位置作为地址?<p>',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        let getpost = that.change;
                        getpost.id = that.id;
                        getpost.address = getpost.address.replace(getpost.province + getpost.city + getpost
                            .area, '')
                        that.changeMapPost(getpost);
                        sessionStorage.setItem('getpost', JSON.stringify(getpost));
                        setTimeout(() => {
                            that.goback();
                        }, 500);

                    }
                });
            },
            addressfn() {
                this.$router.push({
                    path: '/mapAdress/region'
                });
            },
            seach() {
                let location = JSON.stringify(this.location)
                this.$router.push({
                    path: '/mapAdress/seach',
                    query: {
                        keyword: encodeURIComponent(this.keyword),
                        location: encodeURIComponent(location)
                    }
                })
            },
            markerfn() {
                if (this.center.lng && this.center.lat) this.marker = true;
                else this.marker = false;
            },
            // 点击选项
            changeAddress(obj) {
                this.change = obj;
            },
            // 重置定位
            positioning() {
                this.localbluoon = false;
                this.localhandler({
                    BMap,
                    Map
                });
            },
            // 获取当前位置
            localhandler({
                BMap,
                Map
            }) {
                Indicator.open();
                let that = this;
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    let lng = new Number(r.longitude);
                    let lat = new Number(r.latitude);
                    // 浏览器版本控制
                    if (browser.brow() == 'chrome' && browser.vesion() < 60) {
                        lng = lng - 0.0055;
                        lat = lat + 0.003;
                    };
                    let myGeo = new BMap.Geocoder();
                    myGeo.getLocation(new BMap.Point(lng, lat), function (result) {
                        if (result) {
                            let ad = result.surroundingPois[0];
                            let adc = result.addressComponents;
                            let current = {
                                province: adc.province,
                                city: adc.city,
                                area: adc.district,
                                title: ad ? ad.title : adc.streetNumber + adc.street,
                                address: ad ? ad.address : adc.district + adc.streetNumber + adc
                                    .street,
                                point: {
                                    lng: lng - 0,
                                    lat: lat - 0
                                }
                            };
                            that.current = current;
                            if (!that.mapbloon) {
                                if (that.id && that.id != '' && that.localbluoon) {
                                    axios({
                                        url: that.Api + "merchant/queryModify?id=" + that.$route
                                            .query.id,
                                        method: "get",
                                    }).then(res => {
                                        if (res.data.errno == 0) {
                                            let data = res.data.data.merchant;
                                            that.getLocationGeocoder({
                                                province: data.province,
                                                city: data.city,
                                                area: data.county,
                                                title: data.name,
                                                address: data.address,
                                                point: {
                                                    lng: data.lng,
                                                    lat: data.lat
                                                }
                                            });
                                        } else {
                                            that.getLocationGeocoder(that.current);
                                        }
                                    });
                                } else {
                                    that.getLocationGeocoder(that.current);
                                };
                            } else {
                                that.getLocationGeocoder(that.map);
                                that.mapbloon = false;
                            }
                        } else {
                            Toast('定位错误，无法定位当前位置！');
                        }
                    });
                    Indicator.close();
                }, {
                    enableHighAccuracy: true
                });
            },
            // 地图显示
            handler() {
                if (this.change.point && this.change.point.lng && this.change.point.lat) {
                    this.center = this.change.point;
                    this.changeMap(this.change);
                } else {
                    this.center = '';
                    this.removeMap();
                }
                this.markerfn();
            },
            mapTouch() {
                this.mapTouchbluoon = true;
            },
            syncCenterAndZoom(e) {
                if (this.mapTouchbluoon) {
                    let that = this;
                    const {
                        lng,
                        lat
                    } = e.target.getCenter();
                    this.center.lng = lng;
                    this.center.lat = lat;
                    this.zoom = e.target.getZoom();
                    this.getLocationGeocoder({
                        point: {
                            lng: this.center.lng,
                            lat: this.center.lat
                        }
                    });
                };
            },
            getLocationGeocoder(obj) {
                let param = {
                    location: obj.point.lat + ',' + obj.point.lng,
                    output: 'json',
                    pois: 1,
                    ak: 'ufanROIB49bsOCK7FEU2o7Vr'
                }

                this.$jsonp('https://api.map.baidu.com/geocoder/v2/', param).then(res => {
                    if (res.status == 0) {
                        let ar = [];
                        let data = res.result;
                        let component = data.addressComponent;
                        this.$set(this.location, 'prov', component.province);
                        this.$set(this.location, 'city', component.city);
                        this.$set(this.location, 'area', component.district);
                        data.pois.forEach(post => {
                            ar.push({
                                province: component.province,
                                city: component.city,
                                area: component.district,
                                title: post.name,
                                address: post.addr,
                                point: {
                                    lng: post.point.x,
                                    lat: post.point.y
                                }
                            });
                        });
                        this.ar = ar;
                        if (this.mapTouchbluoon) {
                            this.getPost({
                                province: component.province,
                                city: component.city,
                                area: component.district,
                                title: data.sematic_description.split(',')[0],
                                address: data.formatted_address,
                                point: {
                                    lng: data.location.lng,
                                    lat: data.location.lat
                                }
                            });
                            this.mapTouchbluoon = false;
                        } else {
                            this.getPost(obj);
                        }
                    }
                })
            },
            syncCenterEnd(e) {
                this.syncCenterAndZoom(e);
            },
            // 当前数据保存
            getPost(obj) {
                this.change = {
                    province: obj.province ? obj.province : this.location.prov,
                    city: obj.city ? obj.city : this.location.city,
                    area: obj.area ? obj.area : this.location.area,
                    title: obj.title,
                    address: obj.address,
                    point: {
                        lng: obj.point.lng,
                        lat: obj.point.lat
                    }
                };
            },
            ...mapMutations(["changeMap", "removeMap", "changeMapPost", "removeMapPost"])
        }
    }
</script>

<style scoped>
    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .8rem;
    }

    .head-btn>>>.mint-button-text {
        font-size: 12px;
        padding: 5px;
        border: 1px solid #ffac67;
        border-radius: 4px;
    }

    .mainbox {
        overflow: hidden;
        height: 100vh;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
    }

    .map {
        width: 100%;
        height: 12rem;
    }

    /* adressSeach */
    .adressSeach {
        padding: 0.5em 10px;
        font-size: 0.65rem;
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #333;
    }

    .city {
        padding-right: 10px;
    }

    .adressSeach .seach {
        flex: 1;
        padding: 0.4em 1em;
        background: #f1f1f1;
        border-radius: 2em;
    }

    .adressSeach .seach input {
        color: #989898;
        width: 100%;
    }

    /* cell */
    .cell {
        flex: 1;
        overflow: auto;
    }

    .cell-item {
        overflow: hidden;
        border-bottom: 1px solid #e9e9e9;
        padding: 0.7em 10px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        align-items: center;
        font-size: 0.6rem;
        color: #444;
        line-height: 1.6em;
    }

    .cell-item .cell-adress {
        flex: 1;
    }

    .cell-item .cell-adress p {
        font-size: 0.65rem;
    }

    .cell-item .cell-adress p.phover {
        color: #f86b1f;
    }

    .cell-item .cell-adress span {
        display: block;
        color: #999;
    }

    .cell-item .cell-icon {
        overflow: hidden;
        width: 1rem;
        margin-right: 8px;
    }

    .cell-item .cell-icon i {
        font-size: 1rem;
        color: #f86b1f;
    }

    .cell-item .cell-icon span {
        display: block;
        width: 0.8rem;
        height: 0.8rem;
        padding: 0.1rem;
        border-radius: 50%;
        border: 1px solid #ccc;
    }

    .cell-item .cell-icon span.shover {
        border-color: #f86b1f;
    }

    .cell-item .cell-icon span.shover:after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #f86b1f;
    }

    .cell-item .cell-right {
        padding-left: 10px;
        text-align: right;
    }

    .cell-item .cell-right span {
        color: #f86b1f;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .cell-item .cell-right span img {
        width: auto;
        height: 1em;
        padding-right: 0.5em;
    }
</style>
