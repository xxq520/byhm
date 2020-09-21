<template>
  <div class="order">
    <topnav :topnav="topnav"></topnav>
     <div class="hapi">
                  <video  id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls
                     preload="auto"   poster="http://static.qiakr.com/app/full_res.jpg">
                     <source src="http://ndhimg.520shq.com/apk/ylrz.webm">
                     <p class="vjs-no-js">不支持播放</p>
                 </video>     
     </div>      
  </div>
</template>

<script>
    import videojs from 'video.js'
export default {

  name: "order",
  data() {
    return {

        topnav:{
            title:'银联入驻视频',
        },
        userid: this.$cookie.get('userid'),
        orderCode: true,
       
    };
  },
  mounted(){
     this.initVideo();
  },
  methods: {
       initVideo() {
       //初始化视频方法
       let myPlayer = this.$video(myVideo, {
       //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
       controls: true,
      //  autoplay: false,
       //自动播放属性,muted:静音播放
       autoplay: "muted",
       //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
           preload: "auto",
           controlBar: {
           volumePanel: {
           inline: false //默认是true,横着的
           }
           }
           //设置视频播放器的显示宽度（以像素为单位）
          //  width: "375px",
           //设置视频播放器的显示高度（以像素为单位）
          //  height: "650px"
           });
           console.log(myPlayer,'6')
           }
           

  },
  created() {
   
  }
};
</script>

<style scoped>
    .order {
    width: 100%;
    height: 100%;
    }

    .hapi {
    width: 100%;
    height: calc(100% - 40px);
    padding: 2%;
    background-color: #eee;
    }

    .vjs-default-skin {
    width: 100%;
    height: 100%;
    }

</style>
