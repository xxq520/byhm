<template>
    <div class="InvitMember">
        <header class="mint-header" id="headerInvait">
            <a href=" javascript:void(0);">
                <mt-button icon="back" slot="left" @click="goback"></mt-button>
            </a>
            <h1 class="mint-header-title">邀请成为惠盟VIP用户</h1>
        </header>
        <!-- 底部海报轮播 -->
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="proxy">
                 <img :src="this.imgUrl" class="proxy_bg">
                    </div>
                </div>
            </div>
        </div>
        <div class="ivtBtn">
            <button type="button" class="btn tag-read" :data-clipboard-text="uri" @click="copyUrl"><img
                    src="@/assets/images/link_ic.png" class="bottomimg">复制专属链接</button>
            <button type="button" class="btn" @click="showShare"><img src="@/assets/images/share_ic.png">分享专属海报</button>
        </div>
        <mt-popup class="pop1" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
            <div class="shareItem">
                <div class="title" style="backgound:#ccc"><img src="@/assets/images/wx-share.png" alt=""></div>
            </div>
            <button class="cancelBtn" @click="hidePop">取消</button>
        </mt-popup>
  
    </div>
</template>

<script type="text/javascript">
    import swiper from '@/assets/js/swiperVue';
    import wx from 'weixin-js-sdk'
    import Clipboard from 'clipboard'; //复制插件
    import imgCanvas from './imgCanvas.js';
    import wxshare from './wxshare.js';
    export default {
        name: 'InvitMember',
        data() {
            return {
                popupVisible: false, //底部分享海报弹窗
                uri: '',
                imgUrl: '',
                inviteCode: this.$route.query.card ? this.$route.query.card : this.$cookie.get('card'),
                userId: this.$route.query.userid ? this.$route.query.userid : this.$cookie.get('userid'),
                level_id: this.$cookie.get('level_id'),
                shareTitle: '邀您成为惠盟尊贵VIP用户 \n        尊享惠盟超级优惠实惠', //分享标题
                pics: '', //分享图片
                summary: '',
                mySwiperIndex: 0,
                images:'',
                level: this.$cookie.get("level_id")
            }
        },
        mounted() {
            let that = this;
            this.$nextTick(function () {
              
                // 获得页面分享链接
                let url = window.location.href;
                let host = window.location.host;
                if (url.indexOf('http') >= 0) {
                    host = 'http://' + window.location.host;
                } else if (url.indexOf('https') >= 0) {
                    host = 'https://' + window.location.host;
                }
                // this.uri = host + '/#/toBecomeMember/' + this.$cookie.get('card') +'/1/4';
                //swiper轮播
                var swiperbox = swiper({
                    box: ".swiper-container",
                    wrap: ".swiper-wrapper",
                    list: ".swiper-slide"
                });
                swiperbox.swiperTouch(function () {
                    that.mySwiperIndex = this.index;
                });
                $('.proxy').height($(window).height() - $('.ivtBtn').height() - $('#headerInvait').height() -
                    20);
                let img = new Image();
                img.src = $('.proxy_bg').eq(0).attr('src');
                img.onload = function () {
                    let _this = this;
                    $('.swiper-container').css({
                        'width': function () {
                            let h = $('.proxy').height();
                            return _this.width * (h / _this.height)
                        }
                    });
                };
                // // 微信分享参数配置
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
            this.getimage();
        },
        methods: {
              getimage(){

              let params = {
              inviteCode: this.inviteCode,
              inviteType:9,
              levelId:this.level
              };
              axios({
              url: this.Api + "/image/poster/inviter",
              params: params,
              method: "get",
              headers: {
              "X-Nideshop-Token": this.$cookie.get('token')
              }
              }).then(res=>{
              if (res.status == 200) {
              this.imgUrl=res.data.data.inivteImageUrl;
              this.uri=res.data.data.qrcodeInviteUrl;
              } else {
              Toast(res.data.msg);
              }
              })
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
            showShare() {
                var that = this
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    this.popupVisible = true;
                    wxshare(that.uri);
                    //弹出指引微信页面打开分享
                } else {
                    //弹出保存二维码功能

                    let dataURL = imgCanvas($('.proxy')[that.mySwiperIndex]);
                   
                let title = '邀您成为惠盟尊贵VIP用户 \n 尊享惠盟超级优惠实惠';
                    let desc = "百业惠盟欢迎您——";

                    if (this.$route.query.platform == 'android') {
                     
                        // window.action.SharePosters(title, desc,images);
                        window.action.ShareScreenShot(title, desc, dataURL.src );
                        // window.action.ShareImgUrl(title, desc, this.images);
                    } else if (this.$route.query.platform == 'ios') {
                        window.action.SharePosters(title, desc,dataURL.src );
                    } else {
                        Toast("请保存页面二维码进行邀请");
                  
                        
                    }
                }
            },
            hidePop() {
                this.popupVisible = false
            },
      
            copyUrl() {
                if (sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route.query
                    .platform == 'ios') {
                    let title = '邀您成为惠盟尊贵VIP用户 \n        尊享惠盟超级优惠实惠';
                    let desc = '百业惠盟欢迎您——';
                    let imgUrl = 'http://dfs.520shq.com/group1/M00/00/C6/wKgAq1xFeCqAWM89AAAOneZK1mU101.png';
                    let links = this.uri;
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

    .InvitMember .pop1 {
        width: 100%;
        background-color: #fff;
    }

    .InvitMember .pop1 .shareItem {
        padding: .8444rem;
    }

    .InvitMember .pop1 .shareItem .title {
        width: 100%;
        height: 80%;
        background: #000;
        opacity: .8;
    }

    .InvitMember .pop1 .shareItem .group ul {
        overflow: hidden;
        width: 15.3333rem;
        margin: 1.3333rem auto 1rem;
    }

    .InvitMember .pop1 .shareItem .group ul li {
        float: left;
        width: 20%;
        display: flex;
        text-align: center;
    }

    .InvitMember .pop1 .shareItem .group ul li img {
        width: 2rem;
        height: 2rem;
    }

    .InvitMember .pop1 .shareItem .group ul li .name {
        font-size: .6222rem;
        color: #666666;

    }

    .InvitMember .pop1 .shareItem .group ul li a {
        display: block;
    }

    .InvitMember .pop1 .cancelBtn {
        width: 100%;
        height: 2rem;
        background-color: #F2F2F2;
        color: #666666;
        font-size: .6667rem;
        border: none;
        outline: none;
    }

    /* 内容正文 */
    .InvitMember {
        width: 100%;
        min-height: 100vh;
        background-color: #313131;
        position: relative;
        overflow: hidden;
    }

    /* header */
    .InvitMember .mint-header {
        background: none;
        border-bottom: none;
        font-size: .8rem;
    }

    .InvitMember .mintui {
        font-size: 20px;
    }

    /* 海报轮播 */
    .InvitMember .swiper-container {
        /* width: 100%; */
        width: 80%;
        position: relative;
        text-align: center;
        overflow: visible;
        padding: 10px 0;
        margin: 0 auto;
    }

    .InvitMember .swiper-slide .proxy {
        background-repeat: no-repeat;
        background-size: contain;
        transform: scale(0.9);
        opacity: .7;
    }

    .InvitMember .iActive .proxy {
        transform: scale(1);
        opacity: 1;
        z-index: 10;
    }

    .InvitMember .swiper-slide .proxy img.proxy_bg {
        width: auto;
        height: 100%;
    }

    .InvitMember .swiper-slide .ewm {
        width: auto;
        height: 13.5%;
        display: block;
        position: absolute;
        top: 27.6%;
        left: 0;
    }

    .InvitMember .swiper-slide .qrcode {
        width: 100%;
        height: 13.8%;
        display: block;
        position: absolute;
        top: 70%;
        left: 0;
    }

    .InvitMember .swiper-slide .qrcode>>>img {
        width: auto;
        height: 100%;
        margin: 0 auto;
    }



    /* 微信名称及二维码 */
    .InvitMember .swiper-container .swiper-wrapper .swiper-slide .name {
        font-size: .55rem;
        color: #fff;
        position: absolute;
        top: 84%;
        width: 100%;
        left: 5%;
        text-align: center;
    }

    .InvitMember .swiper-container .swiper-wrapper .swiper-slide .n2 {
        top: 93%;
    }

    .InvitMember .swiper-container .swiper-wrapper .swiper-slide .n3 {
        top: 93%;
    }

    /* 底部按钮区域 */
    .InvitMember .ivtBtn {
        position: absolute;
        bottom: 0;
        overflow: hidden;
        width: 100%;
    }

    .InvitMember .ivtBtn img {
        width: .7111rem;
        height: .7111rem;
        margin-right: .4rem;
        margin-bottom: -1px;
    }

    .InvitMember .ivtBtn .btn {
        display: inline-block;
        font-size: .7111rem;
        color: #fff;
        background: #EC0746;
        width: 50%;
        height: 2rem;
        border-style: none;
    }

    .InvitMember .ivtBtn .btn:first-child {
        background-color: #ff9408;
        outline: none;
    }

    .InvitMember .ivtBtn .btn:nth-child(2) {
        float: right
    }

</style>
