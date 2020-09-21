<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="bankmoney">
      <div class="names">{{ post.status==0?'已申请':post.status==1?'审核成功':post.status==2?'打款完成':post.status==3?'审核不成功':'' }}</div>
     
      <div class="timer" v-if="post.status==0">{{ "您的提现申请银行处理中，请耐心等候" }}</div>
      <div class="timer" v-if="post.status==1">{{ "您的提现申请银行审核中，请耐心等候" }}</div>
      <div class="timer" v-if="post.status==2">{{"您的提现已经到账，请注意查收" }}</div>
      <div class="timer" v-if="post.status==3">{{ "您的提现审核不成功，请稍后再试" }}</div>
    </div>
    <div class="bankbox">
      <a class="mint-cell line">
        <div class="wrapper-box">
          <div class="wrapper-list">
            <p>提现总金额</p>
            <span>{{ '￥'+returnFloat(post.withdrawMoney) }}</span>
          </div>
           <div class="wrapper-list" @click="linkToSelected(id)">
            <p>已选周期</p>
            <span>{{post.weeklyCount}}期 <i class="el-icon-arrow-right"></i></span>
          </div>
          <div class="wrapper-list">
            <p>扣除手续费</p>
            <span>{{ '￥'+returnFloat(post.fee) }}</span>
          </div>
          <div class="wrapper-list">
            <p>实际到账</p>
            <span>{{ '￥'+returnFloat(post.arrivalAmount) }}</span>
          </div>
        </div>
      </a>
      <mt-cell class="line l01" :title="'提现-' + account()" :value="'￥'+returnFloat(post.arrivalAmount)"></mt-cell>
    </div>
    <div class="stepsbox">
      <a class="mint-cell line">
        <div class="wrapper-box">
          <div class="steps">

              <div class="stepslist">
                <div class="list-icon">
                  <i :class="{'el-icon-success ihover':post.status >= 0}"></i>
                  <span :class="{'shover':post.status >= 0}"></span>
                </div>
                <div class="stepstext">
                  <div class="stitle"><p>提交申请</p> <span v-if="post.status >= 0">{{ post.createTime?formData(post.createTime):'' }}</span></div>
                </div>
              </div>

              <template v-if="post.status!=3">
                <div class="stepslist">
                  <div class="list-icon">
                    <i :class="{'el-icon-success ihover':post.status >= 1}"></i>
                    <span :class="{'shover':post.status >= 1}"></span>
                  </div>
                  <div class="stepstext">
                    <div class="stitle"><p>审核成功</p> <span v-if="post.status >= 1">{{ post.checkTime?formData(post.checkTime):formData(post.createTime - 24*60*60*1000) }}</span></div>
                  </div>
                </div>
                
                <div class="stepslist">
                  <div class="list-icon">
                    <i :class="{'el-icon-success ihover':post.status == 2}"></i>
                    <span :class="{'shover':post.status >= 2}"></span>
                  </div>
                  <div class="stepstext">
                    <div class="stitle"><p>打款完成</p> <span v-if="post.status >= 2">{{ post.payTime?formData(post.payTime):formData(post.createTime - 24*60*60*1000) }}</span></div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="stepslist">
                  <div class="list-icon">
                    <i :class="{'el-icon-error ihover':post.status == 3}"></i>
                    <span :class="{'shover':post.status >= 3}"></span>
                  </div>
                  <div class="stepstext">
                    <div class="stitle"><p>审核不成功</p> <span v-if="post.status >= 3">{{ post.checkTime?formData(post.checkTime):'' }}</span></div>
                    <!--<div class="describe" v-show="post.remarks!='' && post.remarks!=null">{{ post.remarks }}</div>-->
                  </div>
                </div>
              </template>

            </div>
        </div>
      </a>
    </div>

    <div class="bankbox">
      <a class="mint-cell line">
        <div class="wrapper-box">
           <div class="wrapper-list revenue">
            <p>申请时间：</p>
            <span class="span">{{ post.createTime?formData(post.createTime):'' }}</span>
          </div>
        </div>
      </a> 
    </div>
      <div class="bankbox" v-if=" post.status==2">
          <a class="mint-cell line">
              <div class="wrapper-box">
                  <div class="wrapper-list revenue">
                      <p>到账时间：</p>
                      <span class="span">{{ post.applyTime?formData(post.applyTime):'' }}</span>
                  </div>
              </div>
          </a>
      </div>
  </div>
</template>

<script>
export default {
  name: 'drawalRecord',
  data () {
    return {
      topnav:{
        title:'提现详情',
        send: false
      },
      id:this.$route.query.id,
      post:{},
      revenueText:'',
    
    }
  },
  created() {
    
    
        axios.get(this.Api + "ledgerwithdraw/findInfoById?id="+this.id,{headers: { "X-Nideshop-Token":
        this.$cookie.get('token') }}).then(res =>
        {
       
     
      this.post = res.data.Data
   
    });
  },
  methods: {
    account(){
      if(this.post.bankCardNo){
        return this.post.bankName+'('+this.post.bankCardNo.substr(0,4)+'*********'+this.post.bankCardNo.substr(-4)+')';}
        else{
          return this.post.bankName
        }
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes();
      return Y+M+D+' '+h+m;
      //return Y+M+D;
    },
 
    revenue(){
      axios({
        url:this.Api + '/withdraw/getEarn?userId=' + this.$cookie.get('userid'),
        method:"get"
      }).then(res => {
        console.log(res)
        if(res.data.code == 0){
          let currMonth = new Number(res.data.data.currMonth);
          let val = currMonth + new Number(this.post.amountStr);

          if(val > 800 && val <=4000){
            this.revenueText = '当月提现金额大于800元，少于等于4000元超出平台代扣代缴20%的个人所得税。'
          }else if(val > 4000 && val <=20000){
            this.revenueText = '当月提现金额大于4000元，少于等于20000元超出平台代扣代缴16%的个人所得税。'
          }else if(val > 20000 && val <=50000){
            this.revenueText = '当月提现金额大于800元，少于等于4000元超出平台代扣代缴24%的个人所得税，再减去2000元。'
          }else if(val > 50000){
            this.revenueText = '当月提现金额大于800元，少于等于4000元超出平台代扣代缴32%的个人所得税，再减去7000元。'
          }else{
            this.revenueText = '当月提现金额不大于800元，不征税';
          }
        };
      }).catch(err => {
        console.log(err)
      })
    },
    linkToSelected(id){
      
        this.$router.push({
        path: '/banking/selectedCycle?id=' + id
        })
    },
           
            returnFloat(value) {
            var value = Math.round(parseFloat(value) ) / 100;
            var xsd = value.toString().split(".");
            if (xsd.length == 1) {
            value = value.toString() + ".00";
            return value;
            }
            if (xsd.length > 1) {
            if (xsd[1].length < 2) { value=value.toString() + "0" ; } return value; } },

  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
}
.bankbox{
  overflow:hidden;
  background:white;
  margin-bottom:0.3rem;
}
.bankmoney{
  background:white;
  text-align: center;
  padding:1rem 0;
  margin-bottom:0.3rem;
}
.bankmoney .names{
  font-size:0.7rem;
  color:#ec0746;
  padding:0.2em 0;
}
.bankmoney .timer{
  font-size:0.6rem;
  color:#666;
}
/**/
.mainbox .bankbox {
  padding: 0 0.2222rem;
  background: white;
}
.mainbox .bankbox span{
 text-align: right;
}
.mainbox .bankbox .line {
  font-size: 0.6222rem;
  color: #333;
  border-bottom: 1px solid #eeeeee;
}
.mainbox .bankbox .line:last-child{
  border-bottom:none;
}
.mainbox .bankbox .line #avatar {
  width: 30px;
  height: 30px;
}
.mainbox .bankbox .line #clear {
  width: 2.7778rem;
  height: 0.8444rem;
}
.mainbox .bankbox .line .item {
  font-size: 15px;
  color: #666666;
}
.mainbox >>> .mint-msgbox{
  width: 60%;
}
.mainbox >>> .mint-cell-wrapper {
  background: none;
  font-size:0.6rem;
  padding:10px;
}
.mainbox >>> .mint-cell:last-child {
  background: none;
}
.mainbox >>> .mint-cell-title {
  font-size: 0.6rem;
}
.mainbox >>> .mint-cell-value {
  max-width: calc(100% - 7em);
  text-align: right;
  color:#333;
}
.wrapper-box{
  width:100%;
 
  padding:15px 10px 5px;
  overflow:hidden;
  font-size:0.6rem;
  color:#333;
}
.wrapper-list{
  display:-webkit-flex;
  display:flex;
  width:100%;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom:10px;
  line-height:1.4em;
}
.wrapper-list p{
  width:6em;
}
.wrapper-list span.span{
  max-width:calc(100% - 6em);

}
.l01 >>> .mint-cell-value{
  color:#ff911e;
}
.revenue{
  font-size:12px;
  color:#666;
  justify-content: flex-start;
}
.revenue span{
  flex:1;
}
/* steps */
.stepsbox{
  overflow:hidden;
  margin-bottom:0.3rem;
}
.steps{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  position:relative;
  width:100%;
}
.steps .stepslist{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex:1;
  flex-direction: column;
  align-items: stretch;
  min-height:3em;
  color:#666;
}
.steps .stepslist:last-child{
  min-height:0;
}
.steps .stepslist .list-icon{
  font-size:1.6em;
  position:relative;
  text-align: center;
}
.steps .stepslist .list-icon i{
  background:white;
  display:inline-block;
  position: relative;
  width:0.6em;
  height:0.6em;
  z-index:9;
  border-radius:50%;
  background:#666;
}
.steps .stepslist .list-icon i.ihover{
  color:#ec0746;
  background:white;
  width:1em;
  height:1em;
}
.steps .stepslist .list-icon span{
  position:absolute;
  left:0;
  top:calc(100%/2);
  width:100%;
  height:1px;
  background:#666;
  z-index:1;
}
.steps .stepslist .list-icon span.shover{
  background:#ec0746;
}
.steps .stepslist:first-child .list-icon span{
  left:calc(100%/2);
  width:calc(100%/2);
}
.steps .stepslist:last-child .list-icon span{
  left:0;
  width:calc(100%/2);
}
.steps .stepslist .stepstext{
  padding-left:0.5em;
  text-align: center;
  margin-bottom:0.8em;
  width:100%;
}
.steps .stepslist:last-child .stepstext{
  margin-bottom:0;
}
.steps .stepslist .stepstext .stitle{
  line-height:1.3em;
}
.steps .stepslist .stepstext .stitle p{
  padding:0.5em 0 0.3em;
}
.steps .stepslist .stepstext .stitle span{
  font-size:12px;
  display:block;
  width:100%;
  line-height:1.4em;
  padding:0 0.5em;
}
.steps .stepslist .stepstext .describe{
  font-size:12px;
  margin-top:0.6em;
  color:#666;
  line-height:1.4em;
}
</style>
