<template>
  <div class="agent-application">
      <div class="top">
          <i class="el-icon-arrow-left" @click="goback"></i>
          <span>{{topnav.title}}</span>
      </div>
    <div class="cart-item-top" v-if="operator.status != 1">
      <div class="auditIcon">
        <img :src="imgRe" alt="" v-if="operator.status == 0">
        <img :src="imgNo" alt="" v-else>
      </div>
      <p class="audit_title"></p>
      <p class="audit_content"></p>
    </div>
    <div class="application">
      <div class="application-from">
        <div class="title">基本信息</div>
        <div class="name">
          <mt-field disableClear label='申请人姓名：' placeholder="请输入您的名字" type="text" v-model="operator.realName" readonly></mt-field>
        </div>
        <div class="tel">
          <mt-field disableClear label='申请人手机号：' placeholder="请输入手机号" type="tel" v-model="operator.mobile" readonly></mt-field>
        </div>
        <div class="invite-tel">
          <mt-field disableClear label='推荐人手机号：' placeholder="请输入推荐人手机号" v-model="inviteNum" type="tel" readonly ></mt-field>
        </div>
       <div class="provCity">
          <mt-cell title='联系地区'>{{ operator.province+operator.city+operator.county }}</mt-cell>
        </div>
        <div class="address">
          <textarea v-model="operator.address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" readonly></textarea>
        </div>
      </div>
      <div class="application-from">
        <div class="title">经营信息</div>
        <div class="name">
          <mt-cell title='运营商等级'>{{ operator.levelName }}</mt-cell>
          <mt-cell title='经营省份'>{{ operator.province }}</mt-cell>
          <mt-cell title='经营城市'>{{ operator.city }}</mt-cell>
          <mt-cell title='经营区县'>{{ operator.county }}</mt-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topnav:{
        title:'经营信息'
      },
      imgNo: require("@/assets/images/audit_no.png"),
      imgRe: require("@/assets/images/review.png"),
      userid:this.$cookie.get('userid'),
      type: this.$cookie.get("level_id"),
      operator:new Object(),
      inviteNum:'',
    }
  },
  mounted() {
    Indicator.open();
    let params = {
      id: this.userid,
      type: this.type
    };
    axios.get(this.Api + "/user/queryUserData", { params: params }).then(res=>{
      Indicator.close();
      this.operator = res.data;
    })

    axios({
      method:'post',
      url: this.Api + 'application/record/info',
      data:qs.stringify({
        userId: this.userid,
        type: 2
      }),
      headers: {
        "X-Nideshop-Token": this.$cookie.get("token")
      }
    }).then(res => {
      console.log(res)
      if(res.data.code == 0){
        this.inviteNum = res.data.data.userInfoVo.superMobile;
      }
    })
  },
  methods: {
           goback() {

        this.$store.state.xianshi = true;

           // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
           // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
           // console.log(this.$route.query.from);
           if (this.$route.query.platform == 'android') {  
        window.action.backAPP();
           } else if (this.$route.query.platform == 'ios') {
       
           this.$store.commit("bbb");
           window.action.backAPPiOS();
           }  else {
          
           this.$router.go(-1)
           }
           
           },
  }
}
</script>

<style scoped>
  .top{
  width: 100%;
  height: 40px;
  background-color: #ff911e;
  color:#fff;
  display: flex;
  line-height: 40px;
  text-align: center;
  }
  .top i{
  flex: 1;
  line-height: 40px !important;
  font-size: 20px !important;
  }
  .top span {
  flex: 9;
  font-size: 18px;
  text-indent: -50px;
  }
.cart-item-top {
  margin-top: 1.2222rem;
}
.cart-item-top .auditIcon {
  width: 2.2222rem;
  height: 2.6667rem;
  margin: 0 auto;
}
.cart-item-top .audit_title {
  color: #ff911e;
  font-size: 0.6667rem;
  text-align: center;
  margin-top: 5px;
}
.cart-item-top .audit_content {
  color: #666666;
  font-size: 0.5333rem;
  text-align: center;
  line-height: 0.8rem;
}
.agent-application {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.application {
  padding: 0.833333rem 0.625rem 0 0.625rem;
}
.application-from {
  overflow:hidden;
  margin-bottom:0.5rem;
}
.application-from .title {
  background-color: #ffe9c9;
  color: #ec0746;
  font-size: 0.666667rem;
  padding: 10px;
  border-radius: 0.208333rem 0.208333rem 0 0;
}
.agent-application >>> .mint-cell-wrapper {
  border-bottom: 1px solid #eeeeee;
  background-image:none;
}
.agent-application >>> .mint-cell-title {
  width: 116px;
  flex:none;
}
.agent-application >>> .mint-cell-text {
  font-size: 14px;
  color: #333333;
}
.agent-application >>> .mint-cell-value {
  font-size: 13px;
  flex:1;
}
.cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.7rem 10px;
  font-size: 14px;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}
.cart-list label {
  float: left;
  width: 7.5em;
  color: #333;
}
.cart-list p.lmain {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: calc(100% - 7.7em);
  color: #333;
}
.cart-list p.adress span {
  display: block;
  flex: 1;
  height: 1.4em;
  word-break: break-all;
}
.cart-list p.adress i {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-list input {
  display: block;
  flex: 1;
  font-size: 0.7rem;
  color: #333;
  word-break: break-all;
}
.address {
  background-color: #fff;
  border-bottom: 1px solid #eeeeee;
}
.address textarea {
  width: 100%;
  padding: 5px 10px;
}
.pay-btn-box {
  padding: 1.458333rem 0;
  text-align: center;
}
.pay-btn {
  display: inline-block;
  width: 9.375rem;
  height: 1.666667rem;
  border-radius: 0.833333rem;
  background: -webkit-linear-gradient(
    left,
    #ff9500,
    #ff8c39
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #ff9500,
    #ff8c39
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #ff9500,
    #ff8c39
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff9500, #ff8c39); /* 标准的语法 */
  text-align: center;
  line-height: 1.666667rem;
  color: #ffffff;
  font-size: 0.625rem;
  letter-spacing: 2px;
}
.provCity label, .provCity p.lmain{
  width:auto;
}
</style>
