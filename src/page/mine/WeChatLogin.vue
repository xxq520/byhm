<template>
   <div class="wechatlogin">
     <h4 class="title">百业惠盟用户登录</h4>
     <div class="vip-logo">
       <!-- <img src="@/assets/images/vip_hp_b1.png"> -->
       <img :src="advader">
     </div>
     <div class="user">
       <h4 class="name">{{nickname==null||nickname==''?'无法获取':nickname}}</h4>
       <div class="login-way">
         <img src="@/assets/images/wechaicon.png">微信用户登录
       </div>
     </div>
     <div class="text">为了给您更好的服务，请绑定一个百业惠盟账号，若还没有百业惠盟账号，则注册后默认完成绑定。</div>
     <div class="login-btn" v-if="bindtel" @click="goToBindtel">立即绑定</div>
     <!-- <div class="login-btn" v-if="register" @click="goToRegister">快速注册</div> -->
     <div @click="goToLogin" class="login-btn baiye">使用百业惠盟账号登录</div>
     
   </div>
</template>

<script type="text/javascript">

export default {
   name: 'WeChatLogin',
   data() {
       return {
         advader:'',//微信用户头像
         nickname:'',//微信用户昵称
         phone:'',
         bindtel:false,
         token2:''
       }
   },
   mounted(){
     this.getCode1()
   },
   methods: {
     getCode1(){
      let codes = this.getQuery('code')
      let posts = {
        code:codes
      }
      // axios.get('http://by.520shq.com/api/auth/callback?code='+code).then(res=>{
      axios.get(this.Api+'/auth/callback',{params:posts}).then(res=>{
        // console.log(res);
        this.nickname = res.data.nickname
        this.advader = res.data.avatar
        this.phone = res.data.mobile
        this.token2 = res.data.token
        this.$cookie.set('token2',this.token2)
        if (this.phone) {
            this.$cookie.set('userPhone',this.phone)
            this.$cookie.set('token',this.token2)
            this.$cookie.set('isActive',res.data.isActive)
            this.$cookie.set('card',res.data.card_no)
            this.$cookie.set('isPartner',res.data.isPartner)
            this.$cookie.set('level_id',res.data.level_id)
            this.$cookie.set('seq',res.data.seq)
            this.$cookie.set('superiorLevel',res.data.superiorLevel)
            this.$cookie.set('userid',res.data.userId)
          setTimeout(() => {
            this.$router.push({ name: "index"});
            // this.$cookie.set('vip_time',res.data.vip_time)
          }, 1000);
        }else{
          this.bindtel = true
        }
      })
     },
     getQuery(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
          return unescape(r[2]);
      }
      return null;
    },
     goToLogin() {
       this.$router.push({ name: "login"});
     },
     goToBindtel(){
       this.$router.push({ name: "bindTel"});
     }
   }
}
</script>

<style scoped>
.wechatlogin .title {
  font-size: .666667rem;
  text-align: center;
  margin: 1.25rem 0 1.791667rem 0;
}
.vip-logo {
  text-align: center;
}
.vip-logo img {
  width: 2.625rem;
  height: 2.625rem;
}
.user .name {
  font-size: .625rem;
  text-align: center;
  margin-bottom: .333333rem;
}
.login-way {
  font-size: 12px;
  color: #888888;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-way img {
  width: 13px;
  height: 13px;
  margin-right: .416667rem
}
.wechatlogin .text {
  font-size: .541667rem;
  padding: 0 1.25rem;
  margin: 1.25rem 0 1.875rem 0;
}
.login-btn {
    display: block;
    text-align: center;
    color: white;
    padding: 0.4rem 0;
    width: 70%;
    font-size: 0.7rem;
    line-height: 1.6em;
    background: #ff8f28;
    border-radius: 20rem;
    margin: 0.5rem auto;
    letter-spacing: 2px;
}
.baiye {
  background: #ffffff;
  border: 1px solid #ffb54d;
  color: #f1275d;
  font-weight: 400;
  margin-top: 1.041667rem;
}
</style>
