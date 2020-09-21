<template>
   <div class="exchangeRecord">
     <header class="mint-header">
        <mt-button icon="back" slot="left" @click="goback"></mt-button>
        <h1 class="mint-header-title">兑换明细</h1>
        <div class="filter" @click="showFilter">
          <div class="filter-title">筛选</div>
          <div class="jiantou"><img src="@/assets/images/transction.png" class="screen"></div>
        </div>
    </header>
    <!-- top -->
    <div class="top">
      <div class="left">
        <p class="num">{{totalNum}}</p>
        <p class="num_title">兑换次数</p>
      </div>
      <div class="right">
        <p class="num">{{totalMoney}}</p>
        <p class="num_title">总金额</p>
      </div>
    </div>
    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="time">
          <p class="minut">{{formData1(item.createTime)}}</p>
          <p class="date">{{formData2(item.createTime)}}</p>
        </div>
        <div class="item_conten">
          <div class="name">{{item.username=='null'?'暂无':item.username}}（{{item.cardNo==null?'暂无':item.cardNo}}）</div>
          <div class="detail">{{item.orderNum}}</div>
        </div>
        <div class="profit">{{item.amountStr == 'null' ? '暂无' :'-'+item.amountStr }}</div>
      </div>
    </div>
    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    <div class="filterPop">
      <mt-popup v-model="popupVisible" position="top" popup-transition="popup-fade">
        <div class="time">
          <p class="title">时间：</p>
          <ul class="date" >
            <li v-for="(t,index) in timeList" :key="index" :class="{'active':messagebtn==index}" @click="messagebtnfn(index)" >{{t}}</li>
          </ul>
        </div>
        <div class="own">
          <p class="title">自定义时间：</p>
          <div class="ownTime">
            <div class="numipt">
              <input type="text" placeholder='选择开始时间' v-model="inputStartTime" @click="openPicker" onkeyup="this.value=this.value.replace(/\s+/g,'')">
              <img src="@/assets/images/filter_date.png" alt="">
            </div>
            <div id="zhi">至</div>
            <div class="numipt">
              <input type="text" placeholder='选择结束时间' v-model="inputEndTime" @click="openPicker2" onkeyup="this.value=this.value.replace(/\s+/g,'')">
              <img src="@/assets/images/filter_date.png" alt="">
            </div>
          </div>
        </div>
        <!-- btn -->
        <div class="btnWrap">
          <div class="btn" @click="resetFn"><button>重置</button></div>
          <div class="btn" @click="submit"><button>完成</button></div>
        </div>
      </mt-popup>
    </div>
    <div class="no-data" style="margin-top:100px" v-if="nodata"><img src="@/assets/images/qs.png" alt=""></div>
    <!-- mint datepicker 开始时间-->
    <mt-datetime-picker ref="picker" type="date" year-format="{value} 年" v-model="startTime"  month-format="{value} 月" date-format="{value} 日"
      @confirm="handleConfirm" :startDate="startDate" :endDate="endDate">
    </mt-datetime-picker>
    <!-- mint datepicker 结束时间-->
    <mt-datetime-picker ref="picker2" type="date" year-format="{value} 年" v-model="endTime"  month-format="{value} 月" date-format="{value} 日"
      @confirm="handleConfirm2" :startDate="startDate2" :endDate="endDate">
    </mt-datetime-picker>
   </div>
</template>

<script type="text/javascript">
import { DatetimePicker } from "mint-ui";
export default {
  name: "exchangeRecord",
  data() {
    return {
      messagebtn:0,
      popupVisible: false,
      merId:'',//商家id
      totalNum:'',//今日交易用户数
      totalMoney:'',//今日交易总金额
      dayNum:null,//时间
      pageNum:1,//当前页
      pageSize:5,//每页显示行数
      list:[],//收入明细列表
      close: false,
      pickerValue: false,
      startTime: new Date(),
      endTime: new Date(),
      inputStartTime: null,
      inputEndTime: null,
      startDate: new Date('2018/01/01'),
      startDate2: new Date('2018/01/01'),//开始时间
      endDate: new Date(), // 结束时间
      timeList:['全部','近7天','近15天','近30天'],
      nodata:false,
      flitTopList:[],
      loadshow:true,
      loadend:false,
      loading:false,
    };
  },
  mounted() {
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    showFilter() {
      this.popupVisible = !this.popupVisible;
    },
    showData() {
      this.pickerValue = true;
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      // var m = date.getMinutes() + ':';
      var m = date.getMinutes();
      var s = date.getSeconds();
      // return Y+M+D+h+m+s;
      return Y+M+D;
    },
    messagebtnfn(val){
      this.messagebtn = val;
      switch (val) {
        case 0:
          this.dayNum =null;
          break;
        case 1:
          this.dayNum = 7;
          break;
        case 2:
          this.dayNum = 15;
          break;
        case 3:
          this.dayNum = 30;
          break;
      }
    },
    submit(){
      console.log('提交逻辑');
    },
    resetFn(){
      this.messagebtn = 0;
      this.inputStartTime = null;
      this.inputEndTime = null;
    },
    handleConfirm(data){
      if(new Date(data).getTime() <= new Date(this.endTime).getTime()){
        let date = this.formData(data);
        this.inputStartTime = date;
        // console.log(this.inputStartTime);
      }else{
        Toast({
          message: '开始时间不能大于结束时间！',
          duration: 2000,
          className:'counttc'
        });
      }
    },
    handleConfirm2(data){
      if(new Date(data).getTime() >= new Date(this.startTime).getTime()){
        let date =this.formData(data);
        this.inputEndTime = date;
        // console.log(this.inputEndTime);
      }else{
        Toast({
          message: '结束时间不能小于开始时间！',
          duration: 2000,
          className:'counttc'
        });
      }
    },
    blurfn() {
      this.close = false;
    },
    searhed() {
      this.close = true;
    },
    // 时间筛选
    openPicker() {
      this.$refs.picker.open();
    },
    openPicker2() {
      this.$refs.picker2.open();
    },
    formData1(time){// 列表时间格式化
      var date = new Date(time);
      var h = date.getHours() + ':';
      var m = date.getMinutes();
      return h+m;
    },
    formData2(time){// 列表日期格式化
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      return Y+M+D;
    },
  }
};
</script>

<style scoped>
.active {
  border: 1px solid #ff920e !important;
}
.exchangeRecord {
  width: 100%;
  background: #f2f2f2;
  min-height: 100vh;
  overflow: hidden;
}
/* 头部 */
.exchangeRecord >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
.exchangeRecord .filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.exchangeRecord .filter .jiantou {
  width: 0.65rem;
  height: 0.6rem;
  color: #fff;
  margin-left: 0.1111rem;
}
.exchangeRecord .filter .filter-title {
  font-size: 0.5556rem /* 25/45 */;
}
/* 交易简介 */
.exchangeRecord .top {
  width: 100%;
  padding: 0.4444rem 0.4444rem;
  margin-bottom: 0.4444rem;
  background: #fff;
  overflow: hidden;
}
.exchangeRecord .top .num {
  font-size: .8889rem;
  margin-top: 0.3333rem;
  color: #333333;
}
.exchangeRecord .top .num_title {
  font-size: .5333rem;
  color: #666666;
  margin-top: 0.6rem;
}
.exchangeRecord .top .right {
  width: 50%;
  border-left: 1px solid #f2f2f2;
  float: right;
  text-align: center;
}
.exchangeRecord .top .left {
  width: 50%;
  float: left;
  text-align: center;
}
/* 列表 */
.exchangeRecord {
  width: 100%;
}
.exchangeRecord .list .item {
  background: #fff;
  padding: 0.6667rem 0.5556rem;
  border-bottom: 1px solid #eeeeee;
  overflow: hidden;
}
.exchangeRecord .list .item .time {
  float: left;
  margin-right: 0.4444rem;
}
.exchangeRecord .list .item .time .date {
  font-size: .4889rem;
}
.exchangeRecord .list .item .time .minut {
  font-size: .6667rem;
  color: #333333;
}
.exchangeRecord .list .item .item_conten {
  font-size:.5778rem;
  float: left;
  border-left: 1px solid #eeeeee;
  padding-left: 0.4444rem;
}
.exchangeRecord .list .item .item_conten .detail {
  margin-top: 0.2222rem;
}
.exchangeRecord .list .item .profit {
  float: right;
  color: #ff920e;
  margin-top: 0.2222rem;
  font-size: .8rem;
}
/* 筛选条件弹窗 */
.exchangeRecord .filterPop {
  width: 100%;
  background: #fff;
}
.exchangeRecord >>> .v-modal {
  top: 2rem;
}
.exchangeRecord >>> .mint-popup {
  width: 100%;
}
.exchangeRecord >>> .mint-popup-top {
  top: 2rem;
}
.exchangeRecord .filterPop .time,
.own {
  padding: 0 0.4444rem 0.6667rem 0.444rem;
  margin-top: 20px;
}
.exchangeRecord .filterPop .time .title {
  font-size: .5778rem;
}
.exchangeRecord .filterPop .own .title {
  font-size: .5778rem;
}

.exchangeRecord .filterPop .time .date {
  width: 100%;
  overflow: hidden;
  margin-top: 0.4444rem;
}
.exchangeRecord .filterPop .time .date li {
  width: 20%;
  height: 1.3333rem;
  border: 1px solid #c6c6c6;
  border-radius: 5px;
  font-size: .5778rem;
  display: block;
  text-align: center;
  padding: 0.2222rem;
  float: left;
  margin-right: 0.46rem;
}
.exchangeRecord .filterPop .time .date li:last-child {
  margin-right: none;
}
.exchangeRecord .filterPop .own .ownTime {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.exchangeRecord .filterPop .own .ownTime #zhi{
  font-size: .6667rem;
  margin: .4444rem ;
  padding-top: 7px;
}
.exchangeRecord .filterPop .own .ownTime .numipt{
  border-radius: 5px;
  border:1px solid #c6c6c6;
  width: 39.7%;
  height: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .1111rem .2222rem;
  margin-top: .444rem;
}
.exchangeRecord .filterPop .own .ownTime .numipt input{
  width: 90%;
}
.exchangeRecord .filterPop .own .ownTime .numipt img{
  width: .69rem;
  height: .69rem;
}
/* 按钮 */
.exchangeRecord .filterPop .btnWrap{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.6667rem;
}
.exchangeRecord .filterPop .btnWrap .btn{
  width: 50%;
  height: 1.5556rem;
  font-size: .5778rem;
  color: #666666;
}
.exchangeRecord .filterPop .btnWrap button{
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  background: #fff;
}
.exchangeRecord .filterPop .btnWrap .btn:nth-child(2) button{
  border-right: none;
  color: #ff920e;
}
</style>
