<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-main">
      <div class="cart-item">
        <div class="cart-box">
          <mt-cell title="用户" class="line"><span class="item">{{ $route.query.username?$route.query.username:'-' }}</span></mt-cell>
          <mt-cell title="惠盟卡号" class="line"><span class="item">{{ $route.query.cardNo?$route.query.cardNo:'-' }}</span></mt-cell>
          <mt-cell title="记账金额" class="line"><span class="item">{{ $route.query.amount?$route.query.amount/100:'-' }}</span></mt-cell>
          <mt-cell title="支付方式" class="line"><span class="item">{{ payChannel($route.query.payChannel) }}</span></mt-cell>
          <mt-cell title="记账时间" class="line"><span class="item">{{ getdate($route.query.createTime) }}</span></mt-cell>
          <mt-cell title="流水号" class="line"><span class="item">{{ $route.query.orderNum?$route.query.orderNum:'-' }}</span></mt-cell>
        </div>
      </div>
    </div>
    <div class="ts-text">
      <p>温馨提示：本次操作仅用于记账用途，不作为真实支付凭证</p>
    </div>
    <div class="sub" @click="submitfn">确定提交</div>
  </div>
</template>

<script>
export default {
  name: 'shopMessage',
  data () {
    return {
      topnav:{
        title:'支付详情'
      },
      
    }
  },
  mounted() {

  },
  methods: {
    submitfn(){
      this.$router.push({path:'/storeplat'})
    },
    getdate(date){
      let d = new Date(date);
      let yy = d.getFullYear();
      let mm = d.getMonth()+1;
      let dd = d.getDate();
      let hh = d.getHours();
      let mu = d.getMinutes();
      let ss = d.getSeconds();
      return yy+'-'+mm+'-'+dd+' '+hh+':'+mu+':'+ss;
    },
    payChannel(val){
      let pay = [{
          type:1,
          name:'银联'
        },
        {
          type:2,
          name:'支付宝'
        },
        {
          type:3,
          name:'微信'
        },
        {
          type:4,
          name:'其他'
        }];
      for(var i=0;i<pay.length;i++){
        if(pay[i].type == val) return pay[i].name;
      }
      return '-';
    }
  }
}
</script>

<style scoped>
.cart-main{
  padding:1rem 0.5rem 0;;
}
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f2f2f2;
}
.cart-item{
  overflow:hidden;
  background:white;
  border-radius:0.4rem;
  margin-bottom:0.5rem;
}
.cart-item .cart-title{
  padding:0.3rem 0.5rem;
  background:#ffe9c9;
  color:#ec0746;
  font-size:0.72rem;
  line-height:1.4em;
}
.cart-item .cart-box{
  padding:0 0.5rem;
}
.cart-item .cart-box .line {
  font-size: 0.6222rem;
  color: #333333;
  border-bottom: 1px solid #eeeeee;
}
.cart-item .cart-box .line #avatar {
  width: 30px;
  height: 30px;
}
.cart-item .cart-box .line #clear {
  width: 2.7778rem;
  height: 0.8444rem;
}
.cart-item .cart-box .line .item {
  font-size: 14px;
  color: #666666;
}
.cart-item .cart-box >>> .mint-msgbox{
  width: 60%;
}
.cart-item .cart-box >>> .mint-cell-wrapper {
  background: none;
}
.cart-item .cart-box >>> .mint-cell:last-child {
  background: none;
}
.cart-item .cart-box >>> .mint-cell-title {
  font-size: 14px;
}
.ts-text{
  text-align: center;
  color:red;
  font-size:11px;
  padding:1.5em 1rem 0;
}
.sub{
  display:block;
  text-align: center;
  color:white;
  padding:0.4rem 0;
  width:60%;
  font-size:0.7rem;
  line-height:1.6em;
  background:#ff8f28;
  border-radius:20rem;
  margin:1rem auto;
}
</style>
