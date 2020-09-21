<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="listbox">
      <router-link class="item" v-for="(item,i) in list" :key="i" :to="`/management/${$route.query.id}/pricelist?text=${item.text}&type=${item.type}`">
        <span><img :src="item.img"></span>
        <p>{{ item.text }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'priceMessage',
  data () {
    return {
      topnav:{
        title:'优惠设置'
      },
      list:[
        {
          img:require("@/assets/images/center/01.png"),
          text:'打折优惠',
          type:0
        },
        {
          img:require("@/assets/images/center/02.png"),
          text:'折上折优惠',
          type:1
        },
        {
          img:require("@/assets/images/center/03.png"),
          text:'满减优惠',
          type:2
        },
        {
          img:require("@/assets/images/center/04.png"),
          text:'一口价优惠',
          type:3
        },
        {
          img:require("@/assets/images/center/06.png"),
          text:'自定义优惠',
          type:4
        }
      ]
    }
  },
  mounted() {
    this.resizefn();
    $(window).on('resize',this.resizefn)
  },
  methods: {
    resizefn(){
      $('.item').css('height',$('.listbox').width()/2 + 'px');
    }
  },
  beforeDestroy() {
    $(window).off('resize',this.resizefn);
  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
}
.listbox{
  overflow:hidden;
  background:white;
  width:calc(100% + 1px);
  margin-top:0.5rem;
}
.item{
  float:left;
  width:calc(50% - 1px);
  border-bottom:1px solid #f5f5f5;
  border-right:1px solid #f5f5f5;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
}
.item span{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex:1;
  justify-content: center;
  align-items: center;
  text-align:center;
}
.item span img{
  width:36%;
}
.item p{
  text-align:center;
  font-size:0.7rem;
  padding:0 0 0.8rem 0;
  color:#333;
}
</style>
