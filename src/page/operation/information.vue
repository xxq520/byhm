<template>
  <div class="agent-application">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-item-top">
      <div class="auditIcon">
        <img :src="imgOk" alt="" v-if="businessAreaVo.status == '审核通过'">
        <img :src="imgNo" alt="" v-else>
      </div>
      <p class="audit_title">{{businessAreaVo.status}}</p>
      <p class="audit_content">{{ businessAreaVo.county?'当前申请等级：县合伙人':businessAreaVo.city?'当前申请等级：市合伙人':businessAreaVo.province?'当前申请等级：省合伙人':'' }}</p>
    </div>
    <div class="application">
      <div class="application-from">
        <div class="title">经营信息</div>
        <div class="name">
          <mt-cell title='经营省份' is-link v-if="businessAreaVo.province">{{ businessAreaVo.province }}</mt-cell>
          <mt-cell title='经营城市' is-link v-if="businessAreaVo.city">{{ businessAreaVo.city }}</mt-cell>
          <mt-cell title='经营区县' is-link v-if="businessAreaVo.county">{{ businessAreaVo.county }}</mt-cell>
        </div>
      </div>
      <div class="application-from">
        <div class="title">基本信息</div>
        <div class="name">
          <mt-field disableClear label='申请人姓名：' placeholder="请输入您的名字" type="text" v-model="userInfoVo.name" readonly></mt-field>
        </div>
        <div class="tel">
          <mt-field disableClear label='申请人手机号：' placeholder="请输入手机号" type="tel" v-model="userInfoVo.mobile" readonly></mt-field>
        </div>
        <div class="invite-tel">
          <mt-field disableClear label='推荐人手机号：' placeholder="请输入推荐人手机号" type="tel" v-model="userInfoVo.superMobile" readonly></mt-field>
        </div>
       <div class="provCity">
          <mt-cell title='联系地区' is-link>{{ userInfoVo.area }}</mt-cell>
        </div>
        <div class="address">
          <textarea v-model="userInfoVo.address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" readonly></textarea>
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
      imgOk: require("@/assets/images/audit_ok.png"),
      imgNo: require("@/assets/images/review.png"),
      userid:this.$cookie.get('userid'),
      businessAreaVo:new Object(),
      userInfoVo:new Object()
    }
  },
  mounted() {
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
      this.businessAreaVo = res.data.data.businessAreaVo;
      this.userInfoVo = res.data.data.userInfoVo;
    })
  },
  methods: {
    
  }
}
</script>

<style scoped>
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
