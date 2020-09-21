<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="title">设置优惠条件</div>
    <div class="mineContent">
      <mt-cell title="享受优惠折扣(%)" class="line" v-if="type==0"><input type="text" placeholder="请输入百分比数字" v-model="discount"></mt-cell>
      <template v-if="type==1">
        <a class="mint-cell line">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">
                享受折上折扣(%)
                <el-popover popper-class="fold" placement="bottom" title="享受折上折扣：" width="220" trigger="click" content="即享受店铺优惠结算后再全单打折优惠；例:此处设置为90,即享受全单优惠的9折优惠，以消费100元计算，本单需支付金额90。">
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </span>
            </div>
            <div class="mint-cell-value">
              <input type="text" placeholder="请输入折扣如8.8折即88" v-model="preferential">
            </div>
          </div>
        </a>
        <a class="mint-cell line">
          <div class="mint-cell-wrapper">
            <div class="mint-cell-title">
              <span class="mint-cell-text">
                享受折上优惠(%)
                <el-popover popper-class="fold" placement="bottom" title="享受折上优惠：" width="220" trigger="click" content="即享受店铺优惠结算后再全单优惠；例:此处设置为10,即优惠额为全单的10%，以消费100元计算，本单需支付金额90。">
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </span>
            </div>
            <div class="mint-cell-value">
              <input type="text" placeholder="请输入折扣如8.8折即88" v-model="privilege">
            </div>
          </div>
        </a>
      </template>
      <template v-if="type==2">
        <mt-cell title="满足金额(元)" class="line"><input type="text" placeholder="请输入金额" v-model="enoughAmount"></mt-cell>
        <mt-cell title="立减金额(元)" class="line"><input type="text" placeholder="请输入金额" v-model="verticalReduction"></mt-cell>
      </template>
      <template v-if="type==3">
        <mt-cell title="一口价内容" class="line"><input type="text" placeholder="请输入内容" v-model="fixedPriceDetails"></mt-cell>
        <mt-cell title="一口价金额(元)" class="line"><input type="text" placeholder="请输入金额" v-model="fixedPrice"></mt-cell>
      </template>
      <template v-if="type == 4">
        <div class="cell-title">
          <input type="text" placeholder="请输入优惠标题" v-model="preferentialTitle">
        </div>
      </template>
    </div>
    <template>
      <div class="title">优惠内容（必填）</div>
      <div class="mineContent instructbox">
        <textarea class="instructions" rows="3" placeholder="不超过120个字" @keydown="preferentialcontentFn($event)" @keyup="contentkeydownfn($event)"  maxlength="120" >{{preferentialContent}}</textarea>
      </div>
    </template>
    <div class="title">设置有效时间</div>
    <div class="mineContent">
      <mt-cell title="优惠开始时间" class="line" @click.native="openStartTime()">{{ startdata!=''?formData(startdata):'请选择开始时间' }}<i class="el-icon-date"></i></mt-cell>
      <mt-cell title="优惠结束时间" class="line" @click.native="openEndTime()">{{ enddata!=''?formData(enddata):'请选择结束时间' }}<i class="el-icon-date"></i></mt-cell>
    </div>
    <div class="title">使用说明</div>
    <div class="mineContent instructbox">
      <textarea class="instructions" rows="3" placeholder="请输入使用说明内容" @keydown="contentkeydownfn($event)" @keyup="contentkeyupfn($event)"  maxlength="500">{{ remarks }}</textarea>
    </div>
    <div class="sub" @click="submitfn">{{ id?'提交修改':'新增优惠' }}</div>
    <mt-datetime-picker
     v-model="startValue"
     ref="pickerStart"
     type="datetime"
     year-format="{value} 年"
     month-format="{value} 月"
     date-format="{value} 日"
     hour-format="{value} 时"
     minute-format="{value} 分"
     :start-date="starttime"
     @confirm="startConfirm"></mt-datetime-picker>
    <mt-datetime-picker
     v-model="endValue"
     ref="pickerEnd"
     type="datetime"
     year-format="{value} 年"
     month-format="{value} 月"
     date-format="{value} 日"
     hour-format="{value} 时"
     minute-format="{value} 分"
     :start-date="starttime"
     @confirm="endConfirm"></mt-datetime-picker> 
  </div>
</template>

<script>
export default {
  data () {
    return {
      topnav:{
        title:this.$route.query.text+'优惠设置'
      },
      id: this.$route.query.id,
      type: this.$route.query.type,
      merid: this.$route.params.postId,
      startValue:new Date(),
      endValue:new Date(),
      starttime:new Date('2005/01/01'),
      startdata:'',
      enddata:'',
      discount:'',          // 折扣
      preferential:'',      // 折上折
      privilege:'',         // 折上优惠
      enoughAmount:'',      // 满足
      verticalReduction:'', // 立减
      fixedPrice:'',        // 一口价
      fixedPriceDetails:'', // 一口价详情
      remarks:'',
      preferentialTitle:'', //自定义优惠--优惠标题
      preferentialContent: ''//自定义优惠--优惠内容
    }
  },
  watch:{
    discount(val){
      this.discount = this.numberfn(val);
      
    },
    preferential(val){
      this.preferential = this.numberfn(val);
    },
    privilege(val){
      this.privilege = this.numberfn(val);
    },
       enoughAmount(val) {

       if (this.enoughAmount.length > 4) {
       this.enoughAmount = this.enoughAmount.substr(0, 4)
       };
      //  this.enoughAmount = Math.abs(this.enoughAmount);

       },
       verticalReduction(val) {

       if (this.verticalReduction.length > 4) {
       this.verticalReduction = this.verticalReduction.substr(0, 4)
       };
       this.verticalReduction = Math.abs(this.verticalReduction);

       },
    fixedPrice(val){
      this.fixedPrice = this.numberfn(val);
    }
  },
  mounted() {
    // 获取当前优惠数据
    if(this.id){
      Indicator.open();
      axios.get(this.Api+ 'voucher/NewInfoOne?id='+this.id).then(res => {
        Indicator.close();
        if(res.data.code==0){
          let data = res.data.voucherEntity;
          this.startdata = data.useStartDate;
          this.enddata = data.useEndDate;
          this.discount = data.discount?data.discount:'';                           // 折扣
          this.preferential = data.preferential?data.preferential:'';               // 折上折
          this.privilege = data.privilege?data.privilege:'';                        // 折上优惠
          this.enoughAmount = data.enoughAmount?data.enoughAmount:'';               // 满足
          this.verticalReduction = data.verticalReduction?data.verticalReduction:'';// 立减
          this.fixedPrice = data.fixedPrice?data.fixedPrice:'';                     // 一口价
          this.fixedPriceDetails = data.fixedPriceDetails?data.fixedPriceDetails:'';// 一口价详情
          this.remarks = data.remarks;
          this.preferentialTitle = data.name; //自定义
          this.preferentialContent = data.detail; //自定义
        }else{
          Toast(res.data.msg);
        }
      }).catch(err => {
        Indicator.close();
      })
    }
  },
  methods: {
    submitfn(){
      if(this.layoutfn()) return;
      let post={
        type: this.type,
        merid: this.merid,
        discount: this.discount,                  // 折扣
        preferential: this.preferential,          // 折上折
        privilege: this.privilege,                // 折上优惠
        enoughAmount: this.enoughAmount,          // 满足
        verticalReduction: this.verticalReduction,// 立减
        fixedPrice: this.fixedPrice,              // 一口价
        fixedPriceDetails: this.fixedPriceDetails,// 一口价详情
        useStartDate: this.startdata,
        useEndDate: this.enddata,
        remarks: this.remarks,
        name:this.preferentialTitle,//自定义优惠 --标题
        detail:this.preferentialContent //自定义优惠内容
      };
      if(this.id) post.id = this.id;
      let url = this.id?'voucher/newUpdate':'voucher/newSave';
      Indicator.open();
      // axios.post(this.Api + url,post).then(res => {
        axios.post(this.Api+url,post).then(res => {
          console.log(123)
          console.log(res);
        Toast(res.data.msg);
        Indicator.close();
        if(res.data.code==0){
          this.$router.go(-1);
        }
      }).catch(err => {
        Indicator.close();
      })
    },
    openStartTime() {
      this.$refs.pickerStart.open();
    },
    openEndTime(){
      this.$refs.pickerEnd.open();
    },
    endConfirm(data){
      if(this.startdata==''){
        Toast('请先选择开始日期。');
      }else if(data.getTime() <= this.startdata){
        Toast('结束日期不能小于等于开始日期。')
      }else{
        this.enddata = data.getTime();
      }
    },
    startConfirm(data){
      this.startdata = data.getTime();
    },
    contentkeyupfn(el){
      console.log(el);
      let elm = el.currentTarget;
      this.remarks = elm.value;
    },
    contentkeydownfn(el){
      let elm = el.currentTarget;
      let top = elm.scrollTop;
      let height = elm.offsetHeight;
      elm.style.height = height + top +'px';
    },
    // 输出时间日期
    formData(time){
      if(time){
        var date = new Date(time);
        var Y = date.getFullYear();
        var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
        var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+'-'+M+'-'+D+' '+h+':'+m;
        // return Y+'-'+M+'-'+D;
      }
    },
    numberfn(val){
      let num = val.toString().replace(/[^(\d)]/g,'');
     
      if(num.length > 0){
        num = num.match(/^\d{1,2}/)[0];
      }
      return num;
    },
    layoutfn(){
      switch(this.type){
        case '0':
          if(this.discount == ''){
            Toast('请正确填写的设置优惠条件！');
            return true;
          }
          break;
        case '1':
          if(this.preferential == '' && this.privilege == ''){
            Toast('请正确填写的设置优惠条件！');
            return true;
          }
          break;
        case '2':
          if(this.enoughAmount == '' || this.verticalReduction == ''){
            Toast('请正确填写的设置优惠条件！');
            return true;
          }
          break;
        case '3':
          if(this.fixedPrice == '' || this.fixedPriceDetails == ''){
            Toast('请正确填写的设置优惠条件！');
            return true;
          }
          break;
        case '4':
        if(this.preferentialContent == ''||this.preferentialTitle == '' ){
          Toast('请设置优惠内容！');
          return true;
        }
        break;
      };
      if(this.startdata == ''){
        Toast('请选择开始日期时间！');
        return true;
      }else if(this.enddata == ''){
        Toast('请选择结束日期时间！');
        return true;
      }else if(this.remarks == ''){
        Toast('请填写使用说明内容！');
        return true;
      };
      return false;
    },
    preferentialcontentFn(e){
      console.log(e);
      let el = e.currentTarget;
      this.preferentialContent = el.value;
    }
  },
}
</script>
<style>
.fold{
  background:#ffe9c9;
  color:#ec0746;
  border-color:#ccc;
}
.fold .popper__arrow{
  border-bottom-color:#ccc !important;
}
.fold .popper__arrow::after{
  border-bottom-color:#ffe9c9 !important;
}
.fold .el-popover__title{
  color:#ec0746;
}
</style>
<style scoped>
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
}
.mineContent {
  padding: 0 0.2222rem;
  background: white;
}
.title{
  font-size:15px;
  color:#666;
  padding:0.7rem 10px 0.2rem;
}
.mineContent .line {
  font-size: 0.6222rem;
  color: #333333;
  border-bottom: 1px solid #eeeeee;
}
.mineContent >>> .mint-cell-value input{
  text-align:right;
  font-size: 14px;
}
.mineContent >>> .mint-msgbox{
  width: 60%;
}
.mineContent >>> .mint-cell-wrapper {
  background: none;
}
.mineContent >>> .mint-cell:last-child {
  background: none;
}
.mineContent >>> .mint-cell-title {
  font-size: 15px;
}
.mint-cell-text{
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: center;
}
.el-icon-date{
  font-size:20px;
  padding-left:0.5em;
}
.el-icon-question{
  font-size:18px;
  padding-left:0.2em;
  color:#999;
}
.instructbox{
  overflow:hidden;
  padding:15px 10px;
}
.instructions{
  width:100%;
  min-height:3em;
  font-size:14px;
  outline:none;
}
.instructions:empty:before{ 
    content: '请输入使用说明内容'; 
    color: gray; 
}
.sub {
  display: block;
  text-align: center;
  color: white;
  padding: 0.4rem 0;
  width: 60%;
  font-size: 0.7rem;
  line-height: 1.6em;
  background: #ff8f28;
  border-radius: 20rem;
  margin: 1rem auto;
}
.mainbox >>> .picker-slot{
  font-size:15px;
}
.cell-title{
  min-height: 48px;
  display: block;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  line-height: 1;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
</style>
