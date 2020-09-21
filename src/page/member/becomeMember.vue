<template>
  <div class="become-member">
    <!-- 头部 -->
    <div class="head">
      <mt-header :title="title">
        <!-- <mt-button v-if="!carvist" slot="right" @click="goToCardRecord">购卡记录</mt-button> -->
        <mt-button class="head-btn mr_6" v-if="showxuka" slot="right" @click="goToBuyCard">续卡</mt-button>
        <mt-button class="head-btn" slot="right" @click="goToCardRecord">购卡记录</mt-button>
      </mt-header>
    </div>
    <card :carvist.sync="carvist" :cart.sync="postData"></card>
    <!-- 用户卡 -->
    <template v-if="carvist">
      <div class="between-flex bt bb">
        <div>购卡日期</div>
        <div>{{ postData.startTime }}</div>
      </div>
      <div class="between-flex bt">
        <div>有效期至</div>
        <div>{{ postData.endTime }}</div>
      </div>
      <div class="between-flex">
        <div>购卡次数</div>
        <div>{{ postData.count }}次</div>
      </div>
      <record-number :text.sync="ewmtext" @visibleChange="visibleChange" @change="recordChange"></record-number>
    </template>
    <template v-else>
      <div class="pay-btn-box">
        <div v-if="!subClick" class="pay-btn" @click="goToCash">下一步</div>
        <div v-else class="pay-btn" style="background:#999;">确定支付</div>
      </div>
    </template>
    <!-- 用户卡end -->
    <!-- 二维码 -->
       
    <bottomnav :carcount="carcount" :cart.sync="postData"></bottomnav>
  </div>
</template>

<script>
export default {
  name: "becomeMember",
  data() {
    return {
      carcount: "用户福利",
      title:'超级会员',
      userid:this.$cookie.get('userid'),
      seq:this.$cookie.get('seq'),
      cardNo: this.$cookie.get('card'),
      price:{},
      carvist:false,
      postData:{},
      popupVisible:false,//出示二维码弹窗
      isActive: this.$cookie.get('isActive'),
      card: this.$cookie.get('card'),
      subClick:false,
      //
      rightVisible:false,
      payChannel:'',
      amount:'',
      ewmtext:'',
      isFake: this.$cookie.get('isFake'),
      cardType: this.$cookie.get('cardType'),
      showxuka: false
    };
  },
  mounted(){
    console.log(this.cardType);
  },
  methods: {
    goToCardRecord() {
      this.$router.push({ name: "buyCardRecord", params: { } });
    },
    goToBuyCard() {
      this.$router.push({ name: "selectionCard"});
    },
    pricefn(val){
      this.price = val;
    },
    //跳转到收银台
    goToCash() {
      // if(!this.price.way || this.price.way==''){
      //   Toast('请选择支付方式。');
      //   return false;
      // };
      let that = this;
      let post={
        goodsName: this.price.name,
        orderPrice: this.price.money,
      };
      this.subClick = true;
      axios({
        url:this.Api + '/order/submit?userId='+this.userid+'&cardType=' + this.cardType,
        method:"post",
        // data:post,
        headers:{
          "X-Nideshop-Token": that.$cookie.get('token')
        }
      }).then(res => {
        console.log(res)
        let post = res.data;
        if(post.errno == 0){
          axios.post(this.Api + '/user/queryByCardNo?cardNo='+this.cardNo).then(u=>{
            let data = u.data;
            
            if(!data.city || !data.province || !data.county || data.city=='' || data.province=='' || data.county==''){
              this.subClick = false;
              MessageBox({
                title:"",
                message: '地址信息不全，无法购买用户卡，请跳转完善地址信息。',
                showCancelButton: true
              }).then(action => {
                if(action ==='confirm'){
                  that.$router.push({path:'/mine/adress'});
                }
              });
            }else{
              Toast({
                message: res.data.errmsg,
                position: 'bottom',
                duration: 2000
              });
              setTimeout(function(){
                that.subClick = false;
                that.$router.push({ name: "cashRegister", query: {money: that.price.money, name: that.price.name, code: post.data , way: that.price.way} });
              },2000);
            }
          });
        }else{
          this.subClick = false;
          Toast({
            message: res.data.errmsg,
            position: 'bottom',
            duration: 2000
          });
        }
      });
    },
    //时间格式
    getdate(date){
      let d = new Date(date);
      let yy = d.getFullYear();
      let mm = d.getMonth()+1;
      if(mm < 10) {
        mm = '0' + mm
      }
      let dd = d.getDate();
      if(dd < 10) {
        dd = '0' + dd
      }
      //let hh = d.getHours();
      //let mu = d.getMinutes();
      //let ss = d.getSeconds();
      //return yy+'-'+mm+'-'+dd+' '+hh+':'+mu+':'+ss;
      return yy+'.'+mm+'.'+dd;
    },
    // 二维码
    showEWM(){
      this.rightVisible = true;
    },
    visibleChange(val){
      this.rightVisible = false;
    },
    recordChange(val){
      let params = this.$cookie.get('card');
      this.payChannel = val.payChannel;
      this.amount = val.amount;
      axios.post(this.Api + 'user/queryByCardNo?cardNo='+params).then(res=>{
        let data = res.data;
        if(data.realName == undefined || data.realName == null) {
          data.realName == ""
        }
        this.ewmtext = this.Api + 'user/saveAndGetCardUsedLog?'+
            'userId='+this.userid+
            '&cardNo='+this.card+
            '&payChannel='+this.payChannel+
            '&amount='+this.amount+
            '&username='+data.realName;
      });
      
    },
    //获取基本信息
    getBasicInformation() {
      axios.post(this.Api + '/user/queryByCardNo?cardNo='+this.cardNo).then(res => {
        console.log(res)
        this.isActive = res.data.isActive
        this.isFake = res.data.isFake
        this.$cookie.set('cardType', res.data.cardType);
        this.$cookie.set('isFake', res.data.isFake);
        this.$cookie.set('isActive', res.data.isActive);
        this.getwelfare()
        if(this.isFake == 1) {
          this.title = '惠盟VIP'
        }
        // console.log(this.isFake)
      })
    },
    //判断用户福利显示
    getwelfare() {
      if(this.isActive == 1 ){
        let vtime = this.$cookie.get('vip_time')&&this.$cookie.get('vip_time')!=null?this.$cookie.get('vip_time'):0;
        let tdate = new Date().getTime();
        if(vtime > tdate){
          Indicator.open();
          this.carvist = true;
          axios({
            url:this.Api + '/order/buyCardReport?userId='+this.userid,
            method:"get",
            headers:{
              "X-Nideshop-Token": this.$cookie.get('token')
            }
          }).then(res => {
            console.log(res)
            Indicator.close();
            let data = res.data.data;
            if(!data) return false;
            this.postData = data;
            console.log( this.postData)
            this.postData.startTime = this.getdate(this.postData.startTime);
            this.postData.endTime = this.getdate(this.postData.endTime);
            this.postData.addTime = this.getdate(this.postData.addTime);
          }).catch((err)=>{
            Indicator.close();
            Toast(err.message);
          });
        }else{
          this.carvist = false;
        }
      }else if(this.isActive == 0 && this.isFake == 1) {
        let vtime = this.$cookie.get('vip_time')&&this.$cookie.get('vip_time')!=null?this.$cookie.get('vip_time'):0;
        let tdate = new Date().getTime();
        if(vtime > tdate){
          Indicator.open();
          this.carvist = true;
          axios({
            url:this.Api + '/order/buyCardReport?userId='+this.userid,
            method:"get",
            headers:{
              "X-Nideshop-Token": this.$cookie.get('token')
            }
          }).then(res => {
            console.log(res)
            Indicator.close();
            let data = res.data.data;
            if(!data) return false;
            this.postData = data;
            console.log( this.postData)
            this.postData.startTime = this.getdate(this.postData.startTime);
            this.postData.endTime = this.getdate(this.postData.endTime);
            this.postData.addTime = this.getdate(this.postData.addTime);
          }).catch((err)=>{
            Indicator.close();
            Toast(err.message);
          });
        }else{
          this.carvist = false;
        }
      }else{
        this.carvist = false;
      }
    },
    //判断是否显示续卡
    showXuCardBtn() {
      let that = this
      axios({
        method: 'get',
        url:this.Api + 'order/buyCardReportExp?userId='+that.userid,
      }).then(res => {
        console.log(res)
        if(res.data.errno == 0) {
          console.log(res)
          if(res.data.data.list.length > 0) {
            that.showxuka = true;
          }
          
        }else {
          console.log(res.data.errmsg)
        }
        
      })
    }
  },
  created() {
    this.getBasicInformation()
    this.showXuCardBtn()
  }
};
</script>

<style scoped>

.become-member {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom:60px;
  overflow:hidden;
}

.head >>>.mint-header {
  background: hsl(27, 100%, 57%);
}

.red {
  color: #f74a73;
}

.pay-btn-box {
  overflow:hidden;
  margin-top:0.8rem;
  text-align: center;
}
.pay-btn {
  display: inline-block;
  width: 9.375rem;
  height: 1.666667rem;
  border-radius: .833333rem;
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
  font-size: .625rem;
  letter-spacing: 2px;
}
.between-flex {
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  font-size: .625rem;
  color: #666666;
  padding: 0 0.833333rem;
  background: #ffffff;
}

.bt {
  border-bottom: 1px solid #bbbbbb;
}
.bb {
  border-top: 1px solid #bbbbbb;
}
.go-back {
  width: 10px;
  position: absolute;
  left: 10px;
  top: 18px;
}
/* 二维码 */
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
.EWM{
  width:10.9556rem;
  height:13.1778rem;
  border-radius:40px;
}
.EWM .close{
  width: 1.1556rem;
  height: 1.1556rem;
  border-radius: 50%;
  background:rgba(200,200,200,1);
  position: fixed;
  right: -5px;
  top: -8px;
}
.EWM .ewmPng{
  width: 5.7778rem;
  height: 5.7778rem;
  position: fixed;
  top: 31%;
  right: 24%;
  padding:5px;
  background:white;

}
.mappopup{
  width:80%;
  height: 15rem;
  padding:0.5rem;
  border-radius:0.5rem;
}
.head .head-btn >>> .mint-button-text {
  font-size: 12px;
  padding: 2px;
  border: 1px solid #ffac67;
  border-radius: 4px;
}
.head .mr_6 {
  margin-right: 6px;
}
</style>
