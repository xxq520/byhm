<template>
   <div class="InvitCity">
     <header class="mint-header" id="headerInvait">
          <a href=" javascript:void(0);">
              <mt-button icon="back" slot="left" @click="goback"></mt-button>
          </a>
        <h1 class="mint-header-title">邀请成为运营商</h1>
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
         <button type="button" class="btn tag-read" :data-clipboard-text="uri" @click="copyUrl"><img src="@/assets/images/link_ic.png" class="bottomimg">复制专属链接</button>
         <button type="button" class="btn" @click="showShare"><img src="@/assets/images/share_ic.png">分享专属海报</button>
     </div>
     <div id="qrcode" ref="qrcode" style="display:none;" class="ewm"></div>
      <mt-popup class="pop1" v-model="popupVisible" position="bottom" popup-transition="popup-fade">
        <div class="shareItem">
          <div class="title" style="backgound:#ccc"><img src="@/assets/images/wx-share.png" alt=""></div>
        </div>
        <button class="cancelBtn" @click="hidePop">取消</button>
      </mt-popup>
      <div id="qrcode" ref="qrcode" style="display:none;"></div>   <!--生成二维码-->
   </div>
</template>

<script type="text/javascript">
import swiper from '@/assets/js/swiperVue';
import wx from "weixin-js-sdk";
import QRCode from "qrcodejs2";
import Clipboard from "clipboard"; //复制插件
import imgCanvas from './imgCanvas.js';
import wxshare from './wxshare.js';
export default {
  name: "inviteBusiness",
  data() {
    return {
      popupVisible: false, //底部分享海报弹窗
      uri: "",
      imgUrl: "",
      inviteCode:this.$route.query.card?this.$route.query.card:this.$cookie.get('card'),
      userId:this.$route.query.userid?this.$route.query.userid:this.$cookie.get('userid'),
      level_id: 4,
      shareTitle: "邀您成为运营商 \n        共享惠盟无限商机", //分享标题
      pics: "此为图片", //分享图片
      mySwiperIndex: 0,
      level: this.$cookie.get("level_id")
    };
  },

  mounted() {
    let that = this;
    this.$nextTick(function() {
 
      // 获得页面分享链接
      let url = window.location.href;
      let host = window.location.host;
      if (url.indexOf("http") >= 0) {
        host = "http://" + window.location.host;
      } else if (url.indexOf("https") >= 0) {
        host = "https://" + window.location.host;
      }
      // this.uri = host + "/#/invite/" + this.inviteCode + "/2/";
      //swiper轮播
      var swiperbox = swiper({
          box:".swiper-container",wrap:".swiper-wrapper",list:".swiper-slide"
      });
      swiperbox.swiperTouch(function(){
          that.mySwiperIndex = this.index;
      });
      $(".proxy").height(
        $(window).height() -
          $(".ivtBtn").height() -
          $("#headerInvait").height() -
          20
      );
      let img = new Image();
      img.src = $(".proxy_bg")
        .eq(0)
        .attr("src");
      img.onload = function() {
        let _this = this;
        $(".swiper-container").css({
          width: function() {
            let h = $(".proxy").height();
            return _this.width * (h / _this.height);
          }
        });
      };
      // // 微信分享参数配置
      axios
        .post(
          "http://by.520shq.com/api/wechat/wechatParam?url=" +
            window.location.href.split("#")[0]
        )
        .then(res => {
          if (res.status == 200) {
            let data = res.data;
            this.signature = data.signature;
            this.timestamp = data.timestamp;
            this.nonceStr = data.nonceStr;
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: "wxd4d112b4765d1b4b",
              //  appId:'wxfbec726004f51e9b',
              timestamp: this.timestamp,
              nonceStr: this.nonceStr,
              signature: this.signature,
              jsApiList: [
                "onMenuShareAppMessage",
                "onMenuShareTimeline",
                "translateVoice",
                "onMenuShareQQ",
                "onMenuShareQZone"
              ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          } else {
            Toast("网络错误，请重试！");
          }
        });
    });
  this.getimage()
  },
  methods: {
              //获取图片
              getimage(){

              let params = {
              inviteCode: this.inviteCode,
              inviteType:4,
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
    goback(){
      if(this.$route.query.platform == 'android'){
        window.action.backAPP();
      }else if(this.$route.query.platform == 'ios'){
        window.action.backAPPiOS();
      }else{
        this.$router.go(-1);
      }
    },
    showShare() {
      var that = this;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.popupVisible=true;
        wxshare(that.uri);
        //弹出指引微信页面打开分享
      } else {
                         //弹出保存二维码功能
                         let dataURL = imgCanvas($('.proxy')[that.mySwiperIndex]);

                          let title = "邀您成为运营商 \n 共享惠盟无限商机";
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
    hidePop() {
      this.popupVisible = false;
    },

    copyUrl() {
      if (sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {
        let title = "邀您成为运营商 \n        共享惠盟无限商机";
        let desc = "百业惠盟欢迎您——";
        let imgUrl =
          "http://dfs.520shq.com/group1/M00/00/C6/wKgAq1xFeCqAWM89AAAOneZK1mU101.png";
        let links = this.uri;
        window.action.ShareLinks(title, desc, imgUrl, links);
      } else {
        var clipboard = new Clipboard(".tag-read");
        clipboard.on("success", e => {
          Toast("复制成功");
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on("error", e => {
          // 不支持复制
          Toast("该浏览器不支持自动复制");
          // 释放内存
          clipboard.destroy();
        });
      }
    }
  }
};
</script>

<style scoped>
/* 底部分享弹窗 */
a{
text-decoration:none;
color:#fff;
}
.InvitCity .pop1 {
  width: 100%;
  background-color: #fff;
  /* position: relative; */
}
.InvitCity .pop1 .shareItem .title {
  width: 100%;
  height: 80%;
  background: #000;
  opacity: 0.8;
}
.InvitCity .pop1 .shareItem .group ul {
  overflow: hidden;
  width: 15.3333rem;
  margin: 1.3333rem auto 1rem;
}
.InvitCity .pop1 .shareItem .group ul li {
  float: left;
  width: 20%;
  display: flex;
  text-align: center;
}
.InvitCity .pop1 .shareItem .group ul li img {
  width: 2rem;
  height: 2rem;
}
.InvitCity .pop1 .shareItem .group ul li .name {
  font-size: 0.6222rem;
  color: #666666;
}
.InvitCity .pop1 .shareItem .group ul li a {
  display: block;
}
.InvitCity .pop1 .cancelBtn {
  width: 100%;
  height: 2rem;
  background-color: #f2f2f2;
  color: #666666;
  font-size: 0.6667rem;
  border: none;
  outline: none;
}

/* 内容正文 */
.InvitCity {
  width: 100%;
  min-height: 100vh;
  background-color: #313131;
  overflow: hidden;
}
/* header */
.InvitCity .mint-header {
  background: none;
  border-bottom: none;
  font-size: 0.8rem;
}
.InvitCity .mintui {
  font-size: 20px;
}
/* 海报轮播 */
.InvitCity .swiper-container {
  /* width: 100%; */
  width: 80%;
  position: relative;
  text-align: center;
  overflow: visible;
  padding: 10px 0;
  margin:0 auto;
}
.InvitCity .swiper-slide .proxy {
  background-repeat: no-repeat;
  background-size: contain;
  transform: scale(0.9);
  opacity: .7;
}
.InvitCity .iActive .proxy {
      transform: scale(1);
      opacity: 1;
      z-index: 10;
  }
.InvitCity .swiper-slide .proxy img.proxy_bg {
  width: auto;
  height: 100%;
}
.InvitCity .swiper-slide .ewm {
  width: auto;
  height: 13.6%;
  display: block;
  position: absolute;
  top: 27.6%;
  left: 0;
}
.InvitCity .swiper-slide .qrcode {
  width: 100%;
  height: 13.6%;
  display: block;
  position: absolute;
  top: 67%;
  left: 0px;
}
.InvitCity .swiper-slide .qrcode >>> img {
  width: auto;
  height: 100%;
  margin: 0 auto;
}
.InvitCity .swiper-slide .e2 {
  top: 63%;
  left: -2px;
}
.InvitCity .swiper-slide .e3 {
  top: 52.5%;
  left: -2px;
}

/* 微信名称及二维码 */
.InvitCity .swiper-container .swiper-wrapper .swiper-slide .name {
  font-size: 0.55rem;
  color: #fff;
  position: absolute;
  top: 81%;
  width: 100%;
  left: 5%;
  text-align: center;
}
.InvitCity .swiper-container .swiper-wrapper .swiper-slide .n2 {
  top: 47%;
  transform: rotate(-5.5deg);
  -ms-transform: rotate(-5.5deg); /* IE 9 */
  -moz-transform: rotate(-5.5deg); /* Firefox */
  -webkit-transform: rotate(-5.5deg); /* Safari 和 Chrome */
  -o-transform: rotate(-5.5deg); /* Opera */
}
.InvitCity .swiper-container .swiper-wrapper .swiper-slide .n3 {
  top: 47.2%;
}
/* 底部按钮区域 */
.InvitCity .ivtBtn {
  position: absolute;
  bottom: 0;
  overflow: hidden;
  width: 100%;
}
.InvitCity .ivtBtn img {
  width: 0.7111rem;
  height: 0.7111rem;
  margin-right: 0.4rem;
  margin-bottom: -1px;
}
.InvitCity .ivtBtn .btn {
  display: inline-block;
  font-size: 0.7111rem;
  color: #fff;
  background: #ec0746;
  width: 50%;
  height: 2rem;
  border-style: none;
}
.InvitCity .ivtBtn .btn:first-child {
  background-color: #ff9408;
  outline: none;
}
.InvitCity .ivtBtn .btn:nth-child(2) {
  float: right;
}

</style>
