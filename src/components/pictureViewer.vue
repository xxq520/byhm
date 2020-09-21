<template>
    <vue-picture-viewer class="viewer" :imgData="imgUrl" :switch="true"></vue-picture-viewer>
</template>

<script>
export default {
  props: ['imgUrl'],
  data () {
    return {

    }
  },
  mounted() {
    let that = this;
    this.$nextTick(function(){
      that.imgContainerIMG();
      that.imgContainer();
      let img = new Image();
      let imgchaoshi = true;
      Indicator.open();
      $(img).on('load',function(){
        imgchaoshi = false;
        Indicator.close();
      });
      img.src = that.imgUrl[0].url;
      console.log(img.src );
      setTimeout(() => {
        if(imgchaoshi){
          Toast('图片加载超时');
          Indicator.close();
        };
      },10000)
      $('.handleContainer li').eq(0).on('click',function(){
        that.imgContainerIMG();
      });
      $('.handleContainer li').eq(1).on('click',function(){
        that.imgContainerIMG();
      });
       $('.handleContainer li:last-child').css({
         'display': 'none',
      });
      $('.imgContainer').on('click',function(){
        $('.closeBtn').click(); 
          that.$store.commit("pictureView")

       
      });

      
      $('.closeBtn').on('click',function(){
          that.$store.commit("pictureView")
			   
          
      })
    })
  },
  methods: {
    imgContainerIMG(){
      setTimeout(()=>{
        let width = $('.imgContainer img').width();
        let height = $('.imgContainer img').height();
        let boxw = $('#app').width();
        let boxh = $('#app').height();
        console.log()
        if(width >= boxw && height >= boxh){
          $('.imgContainer img').css({
            'top': 0,
            'left': 0,
            'margin-left': 0,
            'margin-top': 0
          });
        }else if(width >= boxw && height < boxh){
          $('.imgContainer img').css({
            'left': 0,
            'margin-left': 0
          });
        }else if(width < boxw && height >= boxh){
          $('.imgContainer img').css({
            'top': 0,
            'margin-top': 0
          });
        }else if(width == 0){
          $('.imgContainer img').css({
            'width':'100%',
            'height':'auto',
            'left': 0,
            'margin-left': 0,
            'top': 0,
            'margin-top': 0
          });
        }
      })
    },
    imgContainer(){
      setTimeout(()=>{
        $('.imgContainer').css({
          'width':'100%',
          'height':'100%',
          'overflow':'auto'
        })
      })
    }
  }
}
</script>

<style scoped>
.viewer >>> .imgContainer{
    z-index:99;
}
.viewer >>> .imgContainer::-webkit-scrollbar {display:none}
.viewer >>> .imgContainer img{
  max-width:none;
}
.viewer >>> .handleContainer ul{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
   justify-content: space-between;
   padding:0 20px;
}
.viewer >>> .handleContainer ul li{
  margin:0;
}
.viewer >>> .handleContainer{
  bottom:40px;
}
.viewer >>> .imgName{
  position:relative;
  font-size:16px;
}
.viewer >>> .rightArrowCon, .viewer >>> .leftArrowCon, .viewer >>> .thumbnailContainer, .viewer >>> .handleContainer li:nth-child(3){
  display:none;
}

</style>
