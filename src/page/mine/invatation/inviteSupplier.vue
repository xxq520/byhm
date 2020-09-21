<template>
    <div class="InvitChoice">
        <header class="mint-header" id="headerInvait">
            <a href=" javascript:void(0);">
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
            </a>
            <h1 class="mint-header-title">邀请产品企业成为平台供应商</h1>
        </header>
        <!-- 底部海报轮播 -->
        <div class="swiper-container">
            
                    <div class="proxy">
                        <img src="@/assets/images/shareS.png" class="proxy_bg">
                    
                    </div>
    
        </div>
        <div class="ivtBtn">
            <button type="button" class="btn tag-read" :data-clipboard-text="uri" @click="copyUrl"><img
                    src="@/assets/images/link_ic.png" class="bottomimg">复制专属链接</button>
            <!-- <button type="button" class="btn" @click="showShare"><img src="@/assets/images/share_ic.png">分享专属海报</button> -->
        </div>
        <div id="qrcode" ref="qrcode" style="display:none;" class="ewm"></div>
        <mt-popup class="pop1" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <div class="shareItem">
                <div class="title" style="backgound:#ccc"><img src="@/assets/images/wx-share.png" alt=""></div>
            </div>
            <button class="cancelBtn" @click="hidePop">取消</button>
        </mt-popup>
    </div>
</template>

<script type="text/javascript">
    // import swiper from '@/assets/js/swiperVue';
    import wx from 'weixin-js-sdk'
    // import QRCode from 'qrcodejs2'
    import Clipboard from 'clipboard'; //复制插件
    import imgCanvas from './imgCanvas.js';
    import wxshare from './wxshare.js';
    export default {
        name: 'InvitChoice',
        data() {
            return {
                popupVisible: false, //底部分享海报弹窗
                uri: 'http://nfxts.520shq.com/localQuickPurchase/distributionVA/store/generalAgent?seq='+this.$cookie.get('seq'),
                imgUrl: '',
                inviteCode: this.$route.query.card ? this.$route.query.card : this.$cookie.get('card'),
                userId: this.$route.query.userid ? this.$route.query.userid : this.$cookie.get('userid'),
                //  level_id:3,
                shareTitle: '邀请爱之家商城供应商', //分享标题
                pics: '', //分享图片
                summary: '',
                // mySwiperIndex: 0,
                levelid: this.$cookie.get('level_id'),
                isPartner: this.$route.query.isPartner,
                seq: this.$cookie.get('seq'),
                level: this.$cookie.get("level_id")
            }
        },
        // components: { QRCode },

        mounted() {
           
            let that = this;
            this.$nextTick(function () {
                // this.qrcode("qrcode");
                // this.qrcode("qrcode1");
                // this.qrcode("qrcode2");
                // 获得页面分享链接
                let url = window.location.href;
                let host = window.location.host;
                if (url.indexOf('http') >= 0) {
                    host = 'http://' + window.location.host;
                } else if (url.indexOf('https') >= 0) {
                    host = 'https://' + window.location.host;
                }
                this.uri = "http://nfxts.520shq.com/localQuickPurchase/distributionVA/store/generalAgent?seq="+this.seq
                //swiper轮播
                // var swiperbox = swiper({
                //     box: ".swiper-container",
                //     wrap: ".swiper-wrapper",
                //     list: ".swiper-slide"
                // });
                // swiperbox.swiperTouch(function () {
                //     that.mySwiperIndex = this.index;
                // });
                $('.proxy').height($(window).height() - $('.ivtBtn').height() - $('#headerInvait').height() -
                    20);
                let img = new Image();
                img.src = $('.proxy_bg').eq(0).attr('src');
                img.onload = function () {
                    let _this = this;
                    // $('.swiper-container').css({
                    //     'width': function () {
                    //         let h = $('.proxy').height();
                    //         return _this.width * (h / _this.height)
                    //     }
                    // });
                };
                // 微信分享参数配置
                axios.post('http://by.520shq.com/api/wechat/wechatParam?url=' + window.location.href.split('#')[
                    0]).then(res => {
                    if (res.status == 200) {
                        let data = res.data
                        this.signature = data.signature
                        this.timestamp = data.timestamp
                        this.nonceStr = data.nonceStr
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wxd4d112b4765d1b4b',
                            timestamp: this.timestamp,
                            nonceStr: this.nonceStr,
                            signature: this.signature,
                            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline',
                                'translateVoice', 'onMenuShareQQ', 'onMenuShareQZone'
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        })
                    } else {
                        Toast('网络错误，请重试！')
                    }
                });
            })
        },
        methods: {
            goback() {
                if (this.$route.query.platform == 'android') {

                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else {
                    this.$router.go(-1);
                }
            },


            showShare() {
                var that = this
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    this.popupVisible = true;
                    wxshare(that.uri);
                    //弹出指引微信页面打开分享
                    // Toast('请点击右上角圆点菜单图标，进行分享')
                } else {
                                      //弹出保存二维码功能
                                      let dataURL = imgCanvas($('.proxy')[that.mySwiperIndex]);

                                      let title = "诚邀您加入百业惠盟 \n 请您自选尊贵身份";
                                      let desc = "百业惠盟欢迎您——";

                                      if (this.$route.query.platform == 'android') {
                                      // window.action.SharePosters(title, desc,dataURL.src);
                                      window.action.ShareScreenShot(title, desc,dataURL.src);
                                      // window.action.ShareImgUrl(title, desc,dataURL.src );
                                      } else if (this.$route.query.platform == 'ios') {
                                      window.action.SharePosters(title, desc, dataURL.src);
                                      } else {
                                      Toast("请保存页面二维码进行邀请");
                                      // let dataURL = imgCanvas($('.proxy')[that.mySwiperIndex]);
                                      // this.images=dataURL.src;
                                      }

                }
            },
            showShare() {
                var that = this;
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    this.popupVisible = true;
                    wxshare(that.uri);
                    //弹出指引微信页面打开分享
                } else {
                    //弹出保存二维码功能
                    // let dataURL = imgCanvas($('.proxy')[that.mySwiperIndex]);
                    let dataURL = imgCanvas($('.proxy'));
                    let title = "邀请爱之家商城供应商";
                    let desc = "百业惠盟分享";
                    if (sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route
                        .query.platform ==
                        'ios') {
                        window.action.SharePosters(title, desc, dataURL.src);
                    } else {
                        Toast("请保存页面二维码进行邀请");
                    }
                }
            },
            hidePop() {
                this.popupVisible = false
            },
            // qrcode(val) {
            //     //   let url = window.location.href;
            //     //   let host = window.location.host;
            //     //   if(url.indexOf('http') >= 0){
            //     //       host = url.match(/(http\:\/\/)[^(\/\#\/)]{1,}(\/\#\/)/g)[0]
            //     //     }else if(url.indexOf('https') >= 0){
            //     //       host = url.match(/(http\:\/\/)[^(\/\#\/)]{1,}(\/\#\/)/g)[0]
            //     //     }
            //     //   // console.log(url.match(/(http\:\/\/)[^(\/\#\/)]{1,}(\/\#\/)/g)[0])
            //     //  let qrcode = new QRCode('qrcode', {
            //     //      width: 232,  // 设置宽度
            //     //      height: 232, // 设置高度
            //     //      text: host+'/#/invite/'+this.inviteCode+'/3/'
            //     //  });
            //     //  setTimeout(() => {
            //     //    let url = $('#qrcode').find('img').attr('src');
            //     //    $('.swiper-slide').find('img.ewm').attr('src',url)
            //     //  });
            //     let url = window.location.href;
            //     // let url =  "http://nfxts.520shq.com/localQuickPurchase/distributionVA/index?shareSeq="+this.seq
            //     console.log(url);
            //     let host = window.location.host;
            //     if (url.indexOf('http') >= 0) {
            //         host = 'http://' + window.location.host;
            //     } else if (url.indexOf('https') >= 0) {
            //         host = 'https://' + window.location.host;
            //     }
            //     let qrcode = new QRCode(val, {
            //         width: 232, // 设置宽度
            //         height: 232, // 设置高度
            //         // text: host + '/#/optionalUpgrade/' + this.inviteCode + '/' + this.levelid
            //         text:  "http://nfxts.520shq.com/localQuickPurchase/distributionVA/index?shareSeq="+this.seq
            //     });
            // },
            copyUrl() {
                if (sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route.query
                    .platform == 'ios') {
                    let title = '邀请爱之家商城供应商';
                    let desc = '百业惠盟分享';
                    let imgUrl = 'http://nfxts.520shq.com/localQuickPurchase/distributionApp/images/azj.png';
                    let links = this.uri;
                    console.log(this.url);
                    window.action.ShareLinks(title, desc, imgUrl, links);
                } else {
                    var clipboard = new Clipboard('.tag-read')
                    clipboard.on('success', e => {
                        Toast('复制成功')
                        // 释放内存
                        clipboard.destroy()
                    })
                    clipboard.on('error', e => {
                        // 不支持复制
                        Toast('该浏览器不支持自动复制')
                        // 释放内存
                        clipboard.destroy()
                    })
                }
            }
        }
    }
</script>

<style scoped>
    /* 底部分享弹窗 */
    a {
        text-decoration: none;
        color: #fff;
    }

    .InvitChoice .pop1 {
        width: 100%;
        background-color: #fff;
    }

    .InvitChoice .pop1 .shareItem .title {
        width: 100%;
        height: 80%;
        background: #000;
        opacity: .8;
    }

    .InvitChoice .pop1 .shareItem .group ul {
        overflow: hidden;
        width: 15.3333rem;
        margin: 1.3333rem auto 1rem;
    }

    .InvitChoice .pop1 .shareItem .group ul li {
        float: left;
        width: 20%;
        display: flex;
        text-align: center;
    }

    .InvitChoice .pop1 .shareItem .group ul li img {
        width: 2rem;
        height: 2rem;
    }

    .InvitChoice .pop1 .shareItem .group ul li .name {
        font-size: .6222rem;
        color: #666666;

    }

    .InvitChoice .pop1 .shareItem .group ul li a {
        display: block;
    }

    .InvitChoice .pop1 .cancelBtn {
        width: 100%;
        height: 2rem;
        background-color: #F2F2F2;
        color: #666666;
        font-size: .6667rem;
        border: none;
        outline: none;
    }

    /* 内容正文 */
    .InvitChoice {
        width: 100%;
        min-height: 100vh;
        background-color: #313131;
        position: relative;
        overflow: hidden;
    }

    /* header */
    .InvitChoice .mint-header {
        background: none;
        border-bottom: none;
        font-size: .8rem;
    }

    .InvitChoice .mintui {
        font-size: 20px;
    }

    /* 海报轮播 */
    .InvitChoice .swiper-container {
        /* width: 100%; */
        width: 80%;
        position: relative;
        text-align: center;
        overflow: visible;
        padding: 10px 0;
        margin: 0 auto;
    }

    .InvitChoice .swiper-slide .proxy {
        background-repeat: no-repeat;
        background-size: contain;
        transform: scale(0.9);
        opacity: .7;
    }

    .InvitChoice .iActive .proxy {
        transform: scale(1);
        opacity: 1;
        z-index: 10;
    }

    .InvitChoice .swiper-slide .proxy img.proxy_bg {
        width: auto;
        height: 100%;
    }

    .InvitChoice .swiper-slide .ewm {
        width: auto;
        height: 21%;
        display: block;
        position: absolute;
        top: 57%;
        left: 30%;
    }

    .InvitChoice .swiper-slide .qrcode {
        width: 100%;
        height: 21%;
        display: block;
        position: absolute;
        /* top: 57%; */
        top: 53%;
        left: -3px;
    }

    .InvitChoice .swiper-slide .qrcode>>>img {
        width: auto;
        height: 100%;
        margin: 0 auto;
    }

    .InvitChoice .swiper-slide .e2 {
        /* top: 63.5%; */
        top: 41.5%;
        left: -1px;
    }

    .InvitChoice .swiper-slide .e3 {
        /* top: 52.5%;
    left: -2px; */
        top: 57.5%;
        left: -4px;
    }

    /* 微信名称及二维码 */
    .InvitChoice .swiper-container .swiper-wrapper .swiper-slide .name {
        font-size: 16px;
        color: #000;
        position: absolute;
        /* top: 49.9%; */
        top: 46.9%;
        left: 0;
        width: 100%;
        text-align: center;
    }

    .InvitChoice .swiper-container .swiper-wrapper .swiper-slide .n2 {
        /* top: 46.9%; */
        top: 34.7%;


    }

    .InvitChoice .swiper-container .swiper-wrapper .swiper-slide .n3 {
        /* top: 47%; */
        top: 49.5%;
    }

    /* 底部按钮区域 */
    .InvitChoice .ivtBtn {
        position: absolute;
        bottom: 0;
        overflow: hidden;
        width: 100%;
    }

    .InvitChoice .ivtBtn img {
        width: .7111rem;
        height: .7111rem;
        margin-right: .4rem;
        margin-bottom: -1px;
    }

    .InvitChoice .ivtBtn .btn {
        display: inline-block;
        font-size: .7111rem;
        color: #fff;
        background: #EC0746;
        width: 100%;
        height: 2rem;
        border-style: none;
    }

    .InvitChoice .ivtBtn .btn:first-child {
        background-color: #ff9408;
        outline: none;
    }

    .InvitChoice .ivtBtn .btn:nth-child(2) {
        float: right
    }
</style>
