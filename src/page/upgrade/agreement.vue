<template>
  <div class="main">
    <topnav :topnav="topnav"></topnav>
    <!-- <div class="agreement">
      <div class="agreement-main">
        <div class="agreement-title"><img src="@/assets/images/agreement-icon.png">省运营商合作协议</div>
        <div class="agreement-text">
          <p>协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签定的书面材料。协议书是契约文</p>
          <p>协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签定的书面材料。协议书是契约文</p>
          <p>协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签定的书面材料。协议书是契约文</p>
          <p>协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签定的书面材料。协议书是契约文</p>
          <p>协议书是社会生活中，协作的双方或数方，为保障各自的合法权益，经双方或数方共同协商达成一致意见后，签定的书面材料。协议书是契约文</p>
        </div>
      </div>
    </div> -->
    <div class="xieyi">
      <img :src='imgsrc' @click="agree">
      <picture-viewer v-if="agreen" :imgUrl.sync="imgUrl"></picture-viewer>
    </div>
  </div>
</template>

<script>
export default {
  name: "agreement",
  data() {
    return {
	    topnav:{
        title:'用户升级',
      },
      xieyi:{
        'prov':require('@/assets/images/contract/province.png'),
        'city':require('@/assets/images/contract/city.png'),
        'county':require('@/assets/images/contract/county.png'),
        'yunxing':require('@/assets/images/contract/jingxiaoshang.png'),
        'yonghu':require('@/assets/images/contract/user_agreement.png')
      },
      levelId:this.$cookie.get('level_id'),
      cardType:this.$cookie.get('cardType'),
      imgsrc:'',
      imgUrl:[{
          url:'',
          name: ''
      }],
      agreen:false
    };
  },
  methods: {
    agree(){
      let that = this
      this.agreen = true;
      this.$nextTick(()=>{
        $('.closeBtn').click(function(){
          that.agreen = false;
        })
      })
      
    }
  },
  created() {
    this.imgsrc = this.levelId == 4? this.xieyi['prov']:
       this.levelId == 3? this.xieyi['city']:
       this.levelId == 2? this.xieyi['county']:
       this.levelId==1&&this.cardType==4?this.xieyi['yonghu']:
       this.xieyi['yunxing'];

    this.imgUrl[0].url = this.imgsrc;

    this.imgUrl[0].name = this.levelId == 4? '“百业惠盟”省运营商注册协议':
       this.levelId == 3? '“百业惠盟”市运营商注册协议':
       this.levelId == 2? '“百业惠盟”县运营商注册协议':
       '“百业惠盟”运营商注册协议';
  }
};
</script>

<style scoped>
.main{
  display:-webkit-flex;
  display:flex;
  flex-direction:column;
  width:100%;
  height:100%;
}
.main >>> .mint-header{
  background:white;
  color:#333;
}
.agreement{
  display:-webkit-flex;
  display:flex;
  flex:1;
  background:url('../../assets/images/sfsj_img_bg.jpg') no-repeat;
  background-size:100% auto;
}
.agreement-main{
  flex:1;
  overflow:auto;
  background:white;
  border-radius:0.5rem;
  margin:60% 20px 20px;
  font-size:0.6rem;
  color:#666;
  padding:10px;
}
.agreement-main .agreement-title{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size:0.72rem;
  color:#333;
  line-height:2em;
  margin-bottom:0.3rem;
}
.agreement-main .agreement-title img{
  width:auto;
  height:2em;
  padding-right:0.5em;
}
.agreement-text{
  overflow:hidden;
}
.agreement-text p{
  text-indent:2em;
  line-height:1.4em;
}
.main >>> .imgName .center{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
