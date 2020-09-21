<template>
  <div class="glode">
    <topnav :topnav="topnav"></topnav>

    <div class="success" >
      <div class="succ-img"><img src="@/assets/images/pay_successful.png"></div>
       <div class="succ-title">{{message}}</div>
     <!--<div class="succ-text" v-if=" levelid > 1 || auser == 1 ">您可以尊享百业惠盟全国惠盟商家的优惠待遇了，现在，到货真价惠“为爱为家”的网络商城～爱之家商城逛逛吧!因您的身份在爱之家商城已是企业级经销商，所以不能再赠送抵扣券，可您的身份可以享受更优惠的价格。</div>
      <div class="succ-text" v-else>支付完提示“恭喜您成为百业惠盟的尊贵用户！您可以尊享百业惠盟全国惠盟商家的优惠待遇了，现在，到货真价惠“为爱为家”的网络商城～爱之家商城逛逛吧”。</div> -->
      <!-- <div class="pay-title">支付成功</div>
      <div class="price">实付：¥5000.00</div> -->
      <div class="button-box" >
        <div class="default-btn" @click="goIndex">返回惠盟首页</div>
        <div class="default-btn" @click="goIndex1"  v-if="azj">返回爱之家首页</div>
      </div>
    
    </div>
  </div>
</template>

<script>
import azjlinks from '@/assets/js/AZJlinks'
export default {
  data() {
      return {
        topnav:{
          title:'支付成功',
          back:false
        },
        levelid:0,
        isActive:0,
        seq:this.$cookie.get('seq'),
        userid: this.$cookie.get('userid'),
        auser:0,
        backshqPd: sessionStorage.getItem('applogin'), // app登录判断
        type: this.$route.query.type,
        message:this.$route.query.message,
        partner:false,
        azj:this.$route.query.azj,
    
      }
  },

  mounted(){
           

    if(this.type == 'partner'){
      axios({
        method:'post',
        url: this.Api + 'application/record/info',
        data:qs.stringify({
          userId: this.userid,
          type: 0
        }),
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token")
        }
      }).then(res => {
        console.log(res.data);
        console.log(res.data.data.businessAreaVo);
         if(res.data.data.businessAreaVo != null){
           this.partner = true;
         }
      })
    }else{
      let params = this.$cookie.get('card');
      axios.post(this.Api + '/user/queryByCardNo?cardNo='+params).then(res=>{
        let data = res.data;
        let expire = new Number(this.$cookie.get('expire'));
        expire = expire/(60*60)+'h'; // 设置过期时间
        this.levelid = data.levelId;
        this.isActive = data.isActive;
        this.$cookie.set('level_id', data.levelId,{ expires: expire });        // 代理商级别
        this.$cookie.set('vip_type', data.type,{ expires: expire });           // 用户级别
        this.$cookie.set('vip_time', data.expireTime,{ expires: expire });     // 用户过期时间

        this.$cookie.set('isActive', data.isActive,{ expires: expire });       // 判断是否是用户
        this.$cookie.set('isPartner', data.isPartner,{ expires: expire });     // 合同状态
        this.$cookie.set('cardType', data.cardType,{ expires: expire });       // 用户卡类型

        this.$cookie.set('province', data.province,{ expires: expire });       // 省
        this.$cookie.set('city', data.city,{ expires: expire });               // 市
        this.$cookie.set('county', data.county,{ expires: expire });           // 县
        this.$cookie.set('address', data.address,{ expires: expire });         // 地址
      });
      axios.get(this.Auser + 'localQuickPurchase/dApplicationAction/api/roleTypeApi?userSeq='+this.seq).then(res=>{
        this.auser = res.data.data;
      });
    }
  },
  methods: {
    
    //成功后返回我的页面
    goMineIndex() {
      let that = this
      //setTimeout(function(){
      //    that.$router.push({name:'MineIndex'});
      //},5000);
    },
    goIndex() {
      
      if(this.backshqPd){  
          window.action.backAppIndex(); 
      }else{
        this.$router.push({path:'mine'})
      }
    },

        goIndex1() {

          window.location.href=this.Alinks+'/localQuickPurchase/distributionVA/index'
       
      
        },
    goLove() {
      azjlinks(this, this.userid);
    },
    goToOrder() {
      this.$router.push({path:"/operation/upgradeAduit",query:{mold:"apply"}})
      // this.$router.push({name: 'myOrder'})  
    },
     
  
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
  padding: 0.5rem 1.2rem;
  padding-top:1.5rem;
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
  font-size: .625rem;
  color: #333333;
  margin: 1.583333rem 0 .833333rem 0;
}
.glode .succ-text {
  line-height:1.6em;
  text-indent:2em;
  color: #666666;
  font-size: .541667rem;
  width: 13.958333rem;
  margin: 0 auto;
  text-align: left;
}
.button-box {
  display: flex;
  /* justify-content: space-between; */
  justify-content:center;
  padding: 0 1.541667rem;
  margin-top: 1.2rem;
  text-align: center;
}
.default-btn {
  display:block;
  width: 9em;
  height: 1.5rem;
  font-size: .6rem;
  border: 1px solid #ff8425;
  text-align: center;
  line-height: 1.5rem;
  border-radius: .833333rem;
  margin:0 0.5rem;
  color: #ff951d;
}
.orange {
  color: #ffffff;
  border: 1px solid #ff8425;
  background: #ff8d35
}
.pay-title {
  font-size: .666667rem;
  color: #ff951d;
  margin: 0 0 .333333rem 0;
}
.price {
  font-size: 12px;
  color: #666666;
}
</style>
