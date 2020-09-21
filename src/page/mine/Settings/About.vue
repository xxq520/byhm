<template>
  <div class="settings">
    <topnav :topnav="topnav"></topnav>
      <div class="main">
            <div class="logo"><img src="@/assets/images/logo.png"></div>
             <div class="content">
               <p class="suo">百业惠盟一款专业提供商家优惠与折扣的超级APP,是520平台商业生态链基础上，联合优质商家共享资源、引流客户、实惠会员的一种商业合作形势。百业会盟个人会员 (简称:惠盟用户) 可以在全国 (将来在全球)
                 范围内免费享受惠盟商家提供的惠盟用户专属超值优惠，并能享受爱之家商场的"代理"待遇，尊享自购必省钱、分享可赚钱、获得"财富永动机的"超值回报。</p>
                <p>更新内容：</p>
                </div>
            
            <div class="mineContent">
                <mt-cell title="用户协议" class="line" is-link to="/UserProtocol"></mt-cell>
                <mt-cell title="隐私政策" class="line" is-link to="/PrivacyPolicy"></mt-cell>
            </div>
      </div>
   
   
  </div>
</template>

<script type="text/javascript">

export default {
  
   data() {
    return {
      topnav:{
        title:'关于我们'
      },
      id:this.$cookie.get('userid'),//用户编号
      seq:this.$cookie.get('seq'),//用户编号
      type:this.$cookie.get('level_id'),//1 52用户，2表示推广商，6表示商家，0是普用户
     
    }
   },
   mounted(){
    

   },
   methods: {
 
   
   

   },
  
}
</script>

<style scoped>
.settings {
  min-height: 100vh;
  background: #fff;
 
}
.settings .mineContent {
  
  background: white;
}
.settings .mineContent .line {
  font-size: 0.6222rem;
  color: #333333;
  border-bottom: 1px solid #ddd;
}
.settings .mineContent .line #avatar {
  width: 30px;
  height: 30px;
}
.settings .mineContent .line #clear {
  width: 2.7778rem;
  height: 0.8444rem;
}
.settings .mineContent .line .item {
  font-size: 15px;
  color: #666666;
}
.main{
  padding: 0.5rem;
}
.logo {
overflow: hidden;
text-align: center;
padding: 0.4rem 0 1rem 0;
margin-top: 0.3rem;
}
.logo  img{
  width: 3rem;
  height: 3rem;
}
.content{
  font-size: 0.62rem;
  line-height: 1rem;
 
  color: #333;
  padding: 0 0.5rem 0.5rem;
}
.suo{
   text-indent: 2em;
}
</style>
