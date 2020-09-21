<template>
  <div class="glode">
    <topnav :topnav="topnav"></topnav>
    <div class="success">
      <div class="succ-img"><img src="@/assets/images/pay_successful.png"></div>
      <div class="succ-title">提现申请成功</div>
      <div class="succ-text">我们将于2个工作日内支付到您指定账户中， 请注意查收。谢谢 </div>
      <div class="button-box">
        <!-- <div class="default-btn" @click="goIndex">继续提现</div> -->
        <div class="default-btn" @click="goback">返回</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
        topnav:{
          title:'提现成功',
          back:false
        },
        tax:this.$route.query.tax,
        factAmount:this.$route.query.factAmount
      }
  },
  mounted(){
    // this.goMineIndex();
  },
  methods: {
    goback(){
      // this.$router.go(-2)
     
      this.$router.push({path:'/mine'});
    
    },
    //成功后返回我的页面
    goMineIndex() {
      let that = this
      setTimeout(function(){
          that.$router.go(-2)
      },3000);
    },
    goIndex() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.mint-header{background:#ff911e;height:auto;border-bottom:none;font-size:.8rem;height: 44px;}
.glode{
  overflow:hidden;
  height:100vh;
  background-color: #ffffff;
}
.success{
  overflow:hidden;
  text-align: center;
  padding-top:2rem;
}
.succ-img{
  overflow:hidden;
  display:inline-block;
  width:3.5rem;
}

.glode >>>.mint-header-title {
  font-size: .75rem;
}
.glode >>> .mint-header .mint-button {
  font-size: .583333rem;
}
.glode .succ-title {
  text-align: center;
  font-size: .65rem;
  color: #333333;
  margin: 1rem 0 .8rem 0;
}
.glode .succ-text {
  color: #666666;
  font-size: .6rem;
  width: 13.958333rem;
  margin: 0 auto;
}
.button-box {
  overflow:hidden;
  padding: 0 .625rem;
  margin-top: 1rem;
  text-align: center;
}
.default-btn {
  width: 6.25rem;
  font-size: .625rem;
  border: 1px solid #a6a6a6;
  text-align: center;
  line-height: 1.2em;
  border-radius: .833333rem;
  padding:0.5em 0;
  margin:0 auto 0.5rem;
}
.orange {
  color: #ff8425;
  border: 1px solid #ff8425;
}
</style>
