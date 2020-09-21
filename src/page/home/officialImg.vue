<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="official">
      <div class="pubu">
        <div class="pubu_k" v-for="(item,i) in official" :key="i">
          <img  :xsrc="item.imgUrl">
        </div>
      </div>
      <loading :load.sync="officialloadshow"></loading>
    </div>
  </div>
</template>

<script>
import pubu from '@/assets/js/pubu'
export default {
  data () {
    return {
      topnav:{
        title:'全部图片'
      },
      id:this.$route.query.id,
      official:[],
      officialloadshow:true
    }
  },
  mounted() {
    pubu();
    this.officialimg();
  },
  methods: {
    officialimg (){
      axios({
        url:this.Api + 'merchant/queryMerchantPicture?type=1&merid=' + this.id,
        method:"get"
      }).then(res => {
        let data = res.data;
        this.officialloadshow = false;
        if(data.code == 0){
          this.official = data.list;
          this.$nextTick(function(){
            $('.official .pubu').Pubu('.official .pubu_k');
          });
        };
      });
    } 
  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  padding-top:40px;
  min-height:100vh;
  background:#f2f2f2;
}
.mainbox >>> .mint-header{position:fixed;left:0;top:0;width:100%;z-index:999;}

.official{
  overflow:hidden;
  background:white;
  margin-bottom:0.5rem;
  padding-top:0.5rem;
}
.pubu{
  width:calc(100% - 20px);
}
.pubu_k{
  width:calc(50% - 5px);
}
.pubu_k img{
  display:block;
}
</style>
