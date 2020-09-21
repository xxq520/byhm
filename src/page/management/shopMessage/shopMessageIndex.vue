<template>
  <div class="shopMessageIndex">
    <topnav :topnav="topnav"></topnav>
    <div class="topWrap" @click="toShopMessage">
        <mt-cell title="基本信息管理"  is-link >
          <img slot="icon" src="@/assets/images/shopMessage1.png" width="24">
        </mt-cell>
    </div>
    <!-- <div class="topWrap" @click="toShopDetail">
      <mt-cell title="资质信息管理" is-link >
        <img slot="icon" src="@/assets/images/shopMessage2.png" width="24">
      </mt-cell>
    </div> -->
  </div>
</template>

<script type="text/javascript">
export default {
  name: "shopMessageIndex",
  data() {
    return {
      topnav: {
        title: "店铺信息管理"
      },
      id:'',//店铺id
    };
  },
  mounted() {
    var url = window.location.href;
   if (url.indexOf("?") != -1) {
     this.id = url.split('id=')[1]
   }
  },
  methods: {
    toShopMessage(){
      this.$router.push({name:'shopMessage',query:{id:this.id}})
    },
    toShopDetail(){
       this.$router.push({name:'shopMsgDetail',query:{id:this.id}})
    },

  }
};
</script>

<style scoped>
.shopMessageIndex{
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
}
.shopMessageIndex .topWrap{
  margin-top: .2222rem;
  /* background: #f5f5f5; */
}
.shopMessageIndex .topWrap >>> .mint-cell-wrapper{
  padding: .8889rem;
  background-image: none;
}
.shopMessageIndex .topWrap >>> .mint-cell:last-child{
  background-image: none;
}
.shopMessageIndex .topWrap >>> .mint-cell-allow-right::after{
  border:solid 2px #696969;
  border-bottom-width: 0;
  border-left-width: 0;
  width: 7px;
  height: 7px;
}
.shopMessageIndex .topWrap >>> .mint-cell-text{
  font-size: .6rem;
  color: #666666;
}
.shopMessageIndex .topWrap img{
  width: .9rem;
  margin-right: .6rem;
}
</style>
