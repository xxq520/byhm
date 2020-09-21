<template>
    <div class="settings">
        <!-- 头部 -->
        <header class="mint-header">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <h1 class="mint-header-title">{{topnav.title}}</h1>
        </header>
        <div v-if="!yinye">
            <div class="shopimg">
                <div class="gon"> 店铺图片</div>
                <div class="imgs">
                    <div class="dimg"> <img :src="postData.facadePhoto"></div>
                </div>
            </div>
            <div class="tuijie">
                <mt-cell title="商家名称" class="line"><span class="item">{{postData.name==null?'':postData.name}}</span>
                </mt-cell>
                <mt-cell title="经营品类" class="line"><span
                        class="item">{{postData.categoryName==null?'':postData.categoryName}}</span>
                </mt-cell>
                <mt-cell title="联系电话" class="line"> <a :href="'tel:'+postData.mobile"
                       class="aaa" > <img
                            src="@/assets/images/shoppingMall/home_p2_icon_lxsj.png">联系商家</a>
                </mt-cell>
                <mt-cell title="商家地址" class="line" @click.native="navigat"><span class="item"
                        style="font-size: 0.5rem;" >{{postData.address}}
                    </span>
                    <i class="el-icon-arrow-right"></i>
                </mt-cell>
                <mt-cell title="营业时间" class="line"><span
                        class="item">{{postData.openTime==null?'':postData.openTime}}</span>
                </mt-cell>
                <mt-cell title="营业执照" class="line" @click.native="goqualificat"><span class="item"><i
                            class="el-icon-arrow-right"></i></span>
                </mt-cell>
            </div>
            <div>
                <div class="gongao">商家公告</div>
                <div class="content">{{postData.notice}}</div>
            </div>
        </div>
        <div class="abs" v-else>
            <img :src="postData.bizLicence">
        </div>

    </div>
</template>

<script type="text/javascript">
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '商家信息'
                },
                userid: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                applogin: false,
                id: this.$route.query.id ? this.$route.query.id : '',
                postData: {},
                shopImg: {},
                yinye: false,
                LngLats : JSON.parse(sessionStorage.getItem('LngLats')),
            }
        },
        mounted() {
            this.handler();
        },
        methods: {
            handler() {
                let LngLats = JSON.parse(sessionStorage.getItem('LngLats'));
                let param = {
                    merchantId: this.id,
                };
                Indicator.open();
                axios({
                    url: this.Api1 + '/shop/merchantDetails/merchantInfo',
                    params: param,
                    method: "get"
                }).then(res => {
                    Indicator.close();
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shopImg = data.merchantGalleries;
                        this.postData = data;
                    }
                }).catch(err => {
                    Indicator.close();
                })
            },
            //判断是否有装地图
            navigat() {            
                var that = this;
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (result) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        var latCurrent = result.point.lat; //获取到的纬度
                        var lngCurrent = result.point.lng; //获取到的经度
                        if (latCurrent && lngCurrent) {
                            var scheme = '';
                            console.log(that.center)
                            var queryStr = '?origin=name:我的位置|latlng:' + latCurrent + ',' + lngCurrent +
                                '&destination=' +
                                that.postData.lat + ',' + that.postData.lng +
                                '&region=' + that.postData.address + '&coord_type=bd09ll&mode=driving';
                            console.log(queryStr);

                            if (that.$route.query.platform == 'ios') {
                                // ios 端
                                scheme = 'baidumap://map/direction' + queryStr;
                            } else {
                                // android 端
                                scheme = 'bdapp://map/direction' + queryStr;
                            }
                            // 主要实现代码
                            window.location.href = scheme;
                            var startTime = Date.now();
                            var count = 0;
                            var endTime = 0;
                            var t = setInterval(function () {
                                    count += 1;
                                    endTime = Date.now() - startTime;
                                    if (endTime > 800) {
                                        clearInterval(t);
                                    }
                                    if (count < 30) return;
                                    if (!(document.hidden || document.webkitHidden)) {
                                        window.location.href = 'https://api.map.baidu.com/direction' +
                                            queryStr + '&output=html';
                                    }
                                },
                                20);
                            window.onblur = function () {
                                clearInterval(t);
                            };
                        } else {
                            alert('获取不到定位，请检查手机定位设置');
                        }
                    }
                });
            },
            //查看营业执照
            goqualificat() {
                this.yinye = true;
                this.topnav.title = "营业执照"

            },
            goback() {
                if (this.yinye) {
                    this.yinye = false;
                    this.topnav.title = "商家信息"
                } else {
                    this.$router.go(-1);
                }
            },


        },

    }

</script>

<style scoped>
    .settings {
        min-height: 100vh;
        background: #fff;
    }

    .mint-header {
        background: #ff911e;
        height: 1.75rem;
        border-bottom: none;
        font-size: 16px;
    }

    .settings .mineContent {
        padding: 0 0.4rem;
        background: white;
    }

    .settings .tuijie {
        padding: 0 0.4rem;
        background: white;
    }

    .line {
        font-size: 0.55rem;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
    }

    .settings .mineContent .line #avatar {
        width: 30px;
        height: 30px;
    }

    .settings .mineContent .line #clear {
        width: 2.7778rem;
        height: 0.8444rem;
    }

    .settings .mineContent .line .item {
        font-size: 0.55rem;
        color: #666666;
    }
 

.aaa {
    color: #FF4400;
    display: flex;
    align-items: center;
    }
    .aaa img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.3rem;
    }
    .settings>>>.mint-msgbox {
        width: 60%;
    }

    .settings>>>.mint-cell-wrapper {
        background: none;
    }

    .mint-cell.line2 {
        background-color: #f5f5f5;

    }

    .settings>>>.mint-cell-title {
        font-size: 0.55rem;
    }

    .code02 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 20rem;
        padding: 0 10px;
        line-height: 1.8em;
    }

    .tuijie>>>.item {
        font-size: 0.55rem;
    }

    .tuijie>>>.mint-cell-text {
        font-size: 0.62rem;
        min-width: 3rem;
        display: inline-block;
    }

    .gongao {
        width: 100%;
        line-height: 2rem;
        padding: 0 0.7rem;
        color: #444;
        font-size: 0.65rem;
        background-color: #fff;
    }

    .content {
        width: 100%;
        padding: 0 0.7rem;
        color: #999;
        font-size: 0.56rem;
    }

    .shopimg {
        width: 100%;
        border-bottom: 1px solid #eee;
        padding: 0 0.5rem 0.3rem;
    }

    .shopimg .gon {
        color: #444;
        font-size: 0.65rem;
        background-color: #fff;
        line-height: 2rem;
    }

    .shopimg .imgs {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .shopimg .imgs .dimg {
        width: 22%;
        height: 3.2rem;
        display: flex;
        align-items: center;
        overflow: hidden;
        border-radius: 0.3rem;
        margin-right: 3%;
        margin-bottom: 0.3rem;
    }

    .shopimg .imgs .dimg img {
        width: 100%;
        height: 100%;
    }

    .abs {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
    }

    .abs img {
        width: 80%;
    }

</style>
