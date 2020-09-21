<template>
    <div class="mainbox" v-cloak>
        <mt-header title="商家管理" class="topnav">
            <mt-button slot="right"><i class="question"><img src="@/assets/images/user/mine_icon_8.png"
                        @click="gotel()"></i><i class="question"> <img src="@/assets/images/storeplat/common_nav.png"
                        @click="gomess">
                </i>
            </mt-button>
        </mt-header>
        <div class="shopmain">
            <div class="shopxinx">
                <div class="headimg">
                    <div class="shopimg"> <img :src="postdata.logoUrl"></div>
                    <div class="shopname">{{ postdata.merName }}</div>
                </div>
                <div class="shoptext">
                    <div class="a1">
                        <div class="today">{{postdata.toDayOrderQuantity}}</div>
                        <div>今日订单 (笔)</div>
                    </div>
                    <div class="a1 b1">
                        <div class="today">{{postdata.toDaySales}}</div>
                        <div>今日销售额 (元)</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="shopbtns">
            <div class="btnbox">
                <div class="btnlist" @click="goToPreview(b)" v-for="b in list">
                    <img :src="b.iconUrl">
                    <p>{{b.name}}</p>
                </div>
            </div>
        </div>

        <bottomnav :carcount="carcount"></bottomnav>
        <div class="bullet" v-if="tapShow">
            <div class="main">
                <div class="heads">拨打电话</div>
                <div class="conts">你确定拨打：{{extraInfo}}</div>
                <div class="foots">
                    <div class="c1" @click="gotel">取消</div>
                    <div class="c2" @click="gotel"><a :href="'tel:'+ extraInfo">确定</a></div>
                </div>
            </div>
        </div>
        <div class="addCard" v-if="phoneShow">
            <div class="aba">
                <img :src="imgs" alt="">
                <div class="save" @click="downloadImg(imgs,'phoneCard')">保存二维码</div>
                <div class="closes"><img src="@/assets/images/xiazai_del.png" alt="" @click="gophoneCard"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '商家管理',
                    back: false
                },
                carcount: '商家入驻',
                levelId: this.$cookie.get("level_id"),
                postdata: {},
                namedata: {},
                categoryName: '',
                pfshow: false,
                type: 0,
                seq: this.$cookie.get('seq'),
                facadePhoto: '',
                backshqPd: sessionStorage.getItem('applogin'), // app登录判断
                showbtnbox: true,
                isShqShow: false,
                tapShow: false,
                userPhone: this.$cookie.get("userPhone"),
                info: 1,
                merId: this.$cookie.get("merId"),
                list: [],
                phoneShow: false,
                imgs: '',
                isPrompt: 0,
                extraInfo: '400-180-2520',

            }
        },
        mounted() {
            this.isShqShow = this.$cookie.get("isBHShop");
            this.type = this.$cookie.get('vip_type');

            this.getInfo();
            this.getTbInfo();
        },
        methods: {
            //保存二维码
            downloadImg(imgsrc, name) {
                var image = new Image();
                // 解决跨域 Canvas 污染问题
                image.setAttribute("crossOrigin", "anonymous");
                image.onload = function () {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    var context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);
                    var url = canvas.toDataURL(); //得到图片的base64编码数据
                    var a = document.createElement("a"); // 生成一个a元素
                    var event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = name || "photo"; // 设置图片名称
                    a.href = url; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                };
                image.src = imgsrc;
            },


            //店铺二维码
            gophoneCard() {
                this.phoneShow = false;

            },
            //获取店铺二维码
            getCard() {
                let post = {
                    merchantId: this.merId,
                    merchantName: this.namedata.merName
                }
                axios({
                    url: this.Api + '/image/shopQrCode',
                    method: "get",
                    params: post,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    if (res.data.code == 0) {
                        this.imgs = res.data.data.qrCodeImageUrl;
                        this.phoneShow = true;

                    } else {
                        Toast(res.data.msg)
                    }
                })
            },
            //获取图标信息
            getInfo() {
                let post = {
                    merId: this.merId
                };
                axios({
                    url: this.Api1 + '/basic/queryTodaySales',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.postdata = res.data.data;
                        this.namedata = res.data.data;

                        if (!res.data.data.isUnionPay) {
                            MessageBox({
                                title: '温馨提示',
                                message: res.data.data.unionPayMsg,
                                showCancelButton: true,
                                confirmButtonText: '去入驻',
                                closeOnClickModal: false
                            }).then(action => {
                                if (action === 'confirm') {
                                    window.location.href = this.YLApi +
                                        "wholesale/uploading?from=by&seq=" + this.$cookie.get('seq');
                                }
                            });
                        }

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取图标
            getTbInfo() {
                let post = {
                    merId: this.merId
                };
                axios({
                    url: this.Api1 + '/basic/queryApplications',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.list = res.data.data;
                        if (res.data.extraInfo) {
                            this.extraInfo = res.data.extraInfo;
                        }


                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //去到消息列表
            gomess() {
                this.$router.push({
                    path: '/storeplat/messageList',
                    query: {
                        id: this.merId
                    }
                })
            },
            //联系客服电话
            gotel() {
                this.tapShow = !this.tapShow;
            },
            //跳转到店铺设置
            goshopOrder() {
                this.$router.push({
                    path: '/storeplat/systemSetup',
                    query: {
                        id: this.merId
                    }
                })
            },
            // 二维码扫描
            sweepCode() {
                let that = this;
                let api = this.Api;
                window.action.sweepQRCode();
                window['getQRCode'] = function (text) {
                    if (text.indexOf(api) >= 0) {
                        Indicator.open('正在提交扫码');
                        let urls = text.split(api)[1];
                        if (urls.indexOf('/user/saveAndGetCardUsedLog') >= 0) {
                            axios.get(api + urls).then(res => {
                                Indicator.close();
                                that.$router.push({
                                    path: '/management/scanResults',
                                    query: res.data.usedCardLog
                                })
                            }).catch(err => {
                                Toast(err.message);
                                Indicator.close();
                            });
                        }
                    } else if (text.indexOf(window.location.host) >= 0) {
                        window.location.href = text;
                    } else {
                        Toast('二维码无法识别。');
                    }
                }
            },
            //跳转商品管理
            goToPreview(val) {

                switch (val.id) {                
                    case 9:
                        if (this.namedata.status == 1) {
                            this.sweepCode()
                        }

                        break;
                    case 10:
                        if (this.namedata.status == 1) {
                            this.getCard()
                        }

                        break;
                    case 12:
                        this.$router.push({
                            path: '/management/shopMessage/shopMessage',
                            query: {
                                id: this.merId
                            }
                        })
                        break;
                    default:
                        if (this.namedata.status == 1) {
                            window.location.href = val.jumpTarget;
                        }
                      break;
                };

                switch (key) {
                    case value:

                        break;

                    default:
                        break;
                }


            },

            //返回
            goback() {
                this.showbtnbox = true;
            },
        }
    }

</script>

<style scoped>
    .mainbox {
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;
        padding-bottom: 60px;
    }

    .shopmain {
        overflow: hidden;
        padding: 1.8rem 10px 0.5rem;
        background-image: url('../../assets/images/storeplat/bar_bgima.png');
        background-repeat: no-repeat;
        background-size: 100%;

    }

    .shopmain .shopxinx {

        background: #fff;
        border-radius: 0.5rem;
        color: #333;
    }

    .shopmain .headimg {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0.5rem;
        background: white;
        font-size: 0.58rem;


    }

    .shopmain .headimg .shopimg {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;
        margin-top: -1.5rem;
    }

    .shopmain .headimg .shopimg img {
        width: 100%;
        height: 100%;
    }

    .shopmain .headimg .shopname {
        font-size: 0.68rem;
        line-height: 2rem;
    }

    .shopmain .shoptext {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .shopmain .shoptext .a1 {
        width: 50%;
        text-align: center;
        font-size: 0.58rem;
        color: #333;
        line-height: 1.5rem;
    }

    .shopmain .shoptext .b1 {
        border-left: 1px solid #eee;
    }

    .shopmain .shoptext .a1 .today {
        color: #FF4400;
    }

    .shopbtns {
        width: calc(100% - 20px);
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0 0.05rem 0.2rem #ccc;
        margin: 0 auto;
        border-radius: 0.4rem;
    }

    .btnbox {
        overflow: hidden;
        padding: 1rem 0 0.5rem;
        display: flex;
        flex-wrap: wrap;
    }

    .btnbox .btnlist {

        width: 49%;
        margin-bottom: 0.9rem;
        text-align: center;
        display: flex;
    }

    .btnbox .btnlist img {
        display: block;
        width: 1.5rem;
        height: 1.5rem;
        margin: 0 1rem;
    }

    .btnbox .btnlist p {
        flex: 1;
        font-size: 0.65rem;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .topnav {
        background-color: #FFBB0E;
        border-bottom: none;
        width: 100%;
        color: #333;
    }

    .topnav .question {
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        display: inline-block;
        text-align: center;
        line-height: .8rem;
        margin-right: 0.5rem;
    }

    .bullet {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }

    .bullet .main {
        width: 76%;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 0.58rem;
    }

    .bullet .main .heads {
        line-height: 1.4rem;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }

    .bullet .main .conts {
        display: flex;
        justify-content: center;
        text-indent: 2em;
        align-items: center;
        min-height: 3rem;
    }

    .bullet .main .foots {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.65rem;
        color: #2B7EFA;
        border-top: 1px solid #eee;

    }

    .bullet .main .foots .c1 {
        width: 49%;
        border-right: 1px solid #eee;
        text-align: center;
    }

    .bullet .main .foots .c2 {
        flex: 1;
        text-align: center;
    }

    .addCard {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .addCard .aba {
        width: 82%;
        height: 78%;
        position: relative;
    }

    .addCard .aba img {
        width: 100%;
        height: 88%;
    }

    .addCard .aba .closes {
        width: 100%;
        height: 12%;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .addCard .aba .closes img {
        width: 1.5rem;
        height: 1.5rem;
    }

    .addCard .aba .save {
        width: 44%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        border-radius: 0.8rem;
        background-color: #ff9d19;
        color: #fff;
        font-size: 0.62rem;
        position: absolute;
        bottom: 24%;
        left: 28%;
    }

</style>
