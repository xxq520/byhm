<template>
<div>
  <!--二维码展示-->
  <div class="erma-box">
    <div class="title">百业惠盟用户二维码</div>
    <div class="ewmbox">
      <div id="qrcode" class="ewmPng" ref="qrcode"></div>
    </div>
    <div class="cart-item">
      <div class="cart-box">
        <div class="cart-list">
          <label>支付方式:</label>
          <p class="lmain pay-box"><input type="text" placeholder="选择支付类型" :value="payChannel" readonly @click="typefn"><span class="sanjiao"></span></p>
        </div>
        <div class="cart-list">
          <label>消费金额:</label>
          <p class="lmain"><input type="text" placeholder="输入消费金额" @blur="amountChange($event)" @keyup="shuru($event)"></p>
        </div>
      </div>
    </div>
    <div class="addsub-box">
      <div class="addsub" @click="submint">生成记账二维码</div>
    </div>
    <div class="tip-box">
      <div class="tip-title">温馨提示：</div>
      <div class="tip-text">此处输入的金额为记账金额，只用于商家对用户消费金额记账之用，不作为支付凭证。支付前出示用户卡即可享受优惠，也可让商家扫码用于记录用户卡信息或记账金额。</div>
    </div>
  </div>
  <mt-popup v-model="typeVisible" position="bottom">
    <div class="visiblebtn">
      <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
      <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
    </div>
    <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
  </mt-popup>
  
  
</div>
</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  props:['text'],
  data () {
    return {
      postdata:{
        payChannel:'',
        amount:''
      },
      typeModel:{},
      payChannel:'',
      typeVisible:false,
      typeslots:[
        {
          flex: 1,
          values: [
            {
              type:0,
              name:'微信'
            },
            {
              type:1,
              name:'支付宝'
            },
            {
              type:2,
              name:'刷卡'
            },
            {
              type:3,
              name:'现金'
            },
            {
              type:4,
              name:'其他'
            }
          ],
          textAlign: 'center'
        }
      ]
    }
  },
  components: {
    QRCode
  },
  watch:{
    text(val){
      this.qrcode(val);
    }
  },
  
  mounted() {
    let that = this
    this.submint(that.text)
  },
  methods: {
    submint(){
      /*if(!this.postdata.payChannel && this.postdata.payChannel ==''){
        Toast('选择支付方式');
        return false;
      }
      if(!this.postdata.amount && this.postdata.amount ==''){
        Toast('输入正确的提现金额');
        return false;
      }*/
      this.$emit("change",this.postdata);
    },
    amountChange(ev){
      let elem = ev.currentTarget;
      let val = elem.value;
      if(/\./.test(val)){
        val = new Number(val).toFixed(2);
        if(isNaN(val)){
          val = '';
          //Toast('输入正确的提现金额,小数点后保留2位数。');
        };
        this.postdata.amount = val;
        event.currentTarget.value = val;
      };
    },
    shuru(event){
      let elem = event.currentTarget;
      let val = elem.value;
      val = elem.value.replace(/[^(\d|\.)]/g,'');
      this.postdata.amount = new Number(val);
      event.currentTarget.value = val;
    },
    // closeEWM(){
    //   this.popupVisible = false;
    // },
    // rightPopup(){
    //   this.rightVisible = false;
    // },
    typefn(){
      this.typeVisible = true;
    },
    typechange(picker, values){
      this.typeModel = values[0];
    },
    quedingfn(){
      this.typeVisible = false;
      this.postdata.payChannel = this.typeModel.type;
      this.payChannel = this.typeModel.name;
      this.typeModel = {};
    },
    quxiaofn(){
      this.typeVisible = false;
    },
    qrcode (text) {
    
      document.getElementById('qrcode').innerHTML = '';
      let qrcode = new QRCode('qrcode', {
          width: 232,  // 设置宽度
          height: 232, // 设置高度
          text: text
      });
    }
  }
}
</script>

<style scoped>
/*ewm*/
.mint-header{background:#ff911e;height:auto;border-bottom:none;font-size:.8rem;}
.mint-popup{
  width:100%;
}
.mint-popup-right{
  height:100%;
}
.cart-item{
  overflow:hidden;
  background:white;
  border-radius:0.4rem;
  padding: 1.041667rem 0;
  border-radius:0;
}
.cart-item .cart-title{
  padding:0.3rem 0.5rem;
  background:#ffe9c9;
  color:#ec0746;
  font-size:0.72rem;
  line-height:1.4em;
  overflow:hidden;
}
.cart-item .cart-title p{
  float:left;
}
.cart-item .cart-title span{
  float:right;
  color:#999;
  font-size:0.6rem;
}
.cart-item .cart-title span i{
  padding-right:0.1rem;
}
.cart-item .cart-box{
  padding:0 0.5rem;
}
.cart-item .cart-box .cart-list{
  overflow:hidden;
  padding:0.5rem 0;
  font-size:0.6rem;
  line-height:1.4em;
  width: 8.333333rem;
  margin: 0 auto;
}
.cart-item .cart-box .cart-list label{
  float:left;
  width: 3.333333rem;
  color:#333;
}
.cart-item .cart-box .cart-list p.lmain{
  float: left;
  width: 5rem;
  color:#333;
  border: 1px solid #c8c8c8;
  border-radius: .083333rem;
}
.cart-item .cart-box .cart-list input{
  width:100%;
  font-size:0.6rem;
  text-align: center;
  padding-right: 1.041667rem;
}
.addsub-box {
  padding-bottom: .833333rem;
}
.addsub{
  display:block;
  text-align: center;
  color:white;
  width:60%;
  font-size:0.7rem;
  height: 1.666667rem;
  line-height: 1.666667rem;
  background:#ff8f28;
  border-radius:20rem;
  margin: 0 auto;
}
.visiblebtn >>> .mint-button--small{
  font-size: 14px;
  padding: 0 8px;
  height: 25px;
}
.visiblebtn >>> .mint-button--default{
  -webkit-box-shadow: none;
  box-shadow: none;
}
.visiblebtn{
  padding:0.5rem;
  border-bottom:1px solid #eaeaea;
  overflow:hidden;
}
.visiblebtn .quxiao{
  float:left;
  border:1px solid #ccc;
}
.visiblebtn .queding{
  float:right;
}
.erwm{
  flex:1;
  width:100%;
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
.ewmbox{
  width: 5.208333rem;
  height: 5.208333rem;
  margin: 0 auto;
  overflow: hidden;
}
.EWM .ewmPng{
  width: 100%;
  height: 100%;
  
}
.erma-box {
  background-color: #ffffff;
  text-align: center;
  margin-top: .416667rem;
  margin-bottom: 1.666667rem;
}
.erma-box .title {
  padding: .833333rem 0 .416667rem 0;
  font-size: .625rem;
  color: #333333;
  font-weight: bold;
}
.tip-box {
  display: flex;
  padding: 0 .833333rem .833333rem .833333rem;
  font-size: 12px;
  color: #f52052;
}
.tip-box .tip-title {
  font-size: 12px;
  color: #f52052;
  width: 60px;
}
.tip-box .tip-text {
  width: calc(100% - 60px);
  text-align: left;
}
.pay-box {
  position: relative;
}
.sanjiao {
  position: absolute;
  width: 0;
  height: 0;
  border-width: .333333rem;
  border-style: solid;
  border-color: #9c9c9c transparent transparent transparent;
  display: block;
  right: .208333rem;
  top: .25rem;
}
</style>
