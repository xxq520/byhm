<template>
   <div class="InviteJoin">
     <header class="mint-header">
        <mt-button icon="back" slot="left" @click="goback"></mt-button>
        <h1 class="mint-header-title">邀请商铺入驻</h1>
    </header>
    <!-- 底部海报轮播 -->
    <div class="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="n in 5" :key="n">
                <div class="name">邀请ID：888888666</div>
                <img src="@/assets/images/code_pic1.png" class="main-img">
                <img src="@/assets/images/ewm.png" class="ewm">
            </div>
        </div>
     </div>
     <div class="ivtBtn">
         <button type="button" class="btn">复制专属链接</button>
         <button type="button" class="btn">分享邀请海报</button>
     </div>
   </div>
</template>

<script type="text/javascript">
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
export default {
   name: 'InviteJoin',
   data() {
       return {}
   },
   mounted(){
     var mySwiper = new Swiper(".swiper-container", {
        slidesPerView: "auto",
        centeredSlides: true,
        watchSlidesProgress: true,
        onProgress: function (a) {
            var b, c, d;
            for (b = 0; b < a.slides.length; b++) c = a.slides[b], d = c.progress, scale = 1 - Math.min(Math.abs(.2 * d), 1), es = c.style, es.opacity = 1 - Math.min(Math.abs(d / 2), 1), es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = "translate3d(0px,0," + -Math.abs(150 * d) + "px)"
        },
        onSetTransition: function (a, b) {
            for (var c = 0; c < a.slides.length; c++) es = a.slides[c].style, es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = b + "ms"
        }
      });
   },
   methods: {
     goback(){
      this.$router.go(-1);
    }
   }
}
</script>

<style scoped>
  .InviteJoin{
    width: 100%;
    min-height: 100vh;
    background-color: #313131;
  }
  /* header */
  .InviteJoin .mint-header{
    background: none;
    border-bottom: none;
    font-size: .8rem;
  }
  .InviteJoin .mintui{
    font-size: 20px;
  }
  /* 海报轮播 */
  .InviteJoin .swiper-container {
    width: 100%;
    position: relative;
    -webkit-perspective: 1200px;
    -moz-perspective: 1200px;
    -ms-perspective: 1200px;
    perspective: 1200px;
  }

  .InviteJoin .swiper-wrapper {
      margin-top: 1rem /* 45/45 */;
  }

  .InviteJoin .swiper-slide {
    /* position: relative; */
     width: 77%;

  }
  .swiper-slide-active {
      transform: scale(1);
      z-index: 10;
  }
 .swiper-slide.swiper-slide-prev {
      transform: scale(0.8);
      opacity: .7;
  }

  .swiper-slide.swiper-slide-next {
      transform: scale(0.8);
      opacity: .7;
  }

  .InviteJoin .swiper-slide .main-img {
      width: 100%;
      height: 22.2222rem /* 1000/45 */;
      margin: 0 auto;
      display: block
  }
  .InviteJoin .swiper-slide .ewm {
      width: 4.6667rem;
      height: 4.6667rem;
      display: block;
      position: absolute;
      top: 40%;
      left: 31%;
  }
  .InviteJoin .swiper-slide .e2 {
      top: 52%;
      left: 31%;
  }
  .InviteJoin .swiper-slide .e3 {
      top: 52%;
      left: 32%;
  }
  .InviteJoin .swiper-slide .e4 {
      top: 59%;
      left: 31%;
  }
  .InviteJoin .swiper-slide .e5 {
      top: 55%;
      left: 33%;
  }
  .InviteJoin .swiper-slide .e6 {
      top: 61%;
      left: 33%;
  }

  /* 微信名称及二维码 */
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .name{
      font-size: .6rem;
      color: #000;
      position: absolute;
      top: 35%;
      left: 30%;
  }
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .n2{
      top: 67%;
      left: 55%;
  }
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .n3{
      top: 75%;
  }
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .n4{
      top: 50%;
  }
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .n5{
      color: #000;
      top: 50%;
  }
  .InviteJoin .swiper-container .swiper-wrapper .swiper-slide .n6{
      top: 56%;
  }
  /* 底部按钮区域 */
  .InviteJoin .ivtBtn {
      position: fixed;
      bottom: 0;
      overflow: hidden;
      width: 100%;
  }
  .InviteJoin .ivtBtn .btn{
      display: inline-block;
      font-size: .7111rem;
      color:#fff;
      background: #EC0746;
      width: 50%;
      height: 2rem;
      border-style: none;
  }
  .InviteJoin .ivtBtn .btn:first-child{
      background-color: #ff9408;
  }
  .InviteJoin .ivtBtn .btn:nth-child(2){
      float: right
  }

</style>
