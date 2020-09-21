<template>
   <div class="cousterDetail">
     <div class="is-fixed">
      <header class="mint-header">
          <mt-button icon="back" slot="left" @click="goback"></mt-button>
          <h1 class="mint-header-title">消费明细</h1>
          <div class="filter" @click="showFilter">
            <div class="filter-title">筛选</div>
            <div class="jiantou"><img src="@/assets/images/transction.png" class="screen"></div>
          </div>
      </header>
      <!-- <div class="timeDetail">
        <span>{{monthList}}</span>
        <span>支出：￥{{pay}}</span>
      </div> -->
    </div>
    <!-- list -->
    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
      <div class="item" v-for="(item,index) in list" :key="index" @click="toDetail(index,item)">
        <div class="time">
          <p class="minut">{{formData1(item.createTime)}}</p>
          <p class="date">{{formData2(item.createTime)}}</p>
        </div>
        <div class="item_conten">
          <div class="name">{{!item.mername?'匿名':item.mername}}</div>
          <div class="detail">{{!item.categoryName ?'无分类':'['+item.categoryName+']'}}</div>
        </div>
        <div class="profit">{{!item.amountStr? '无支付':'-'+item.amountStr}}</div>
      </div>
    </div>
    <div class="no-data" style="margin-top:30px" v-if="nodata"><img src="@/assets/images/qs.png" alt=""></div>
    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    <!-- 筛选弹窗 -->
    <div class="filterPop">
      <mt-popup v-model="popupVisible" position="top" popup-transition="popup-fade">
        <div class="saixuan">
          <div class="sx-main">
            <div class="card_no">
              <p class="title">商家名称：</p>
              <div class="cardWrap"><input class="content" placeholder="请输入商家名称" type="text" v-model="mername" onkeyup="this.value=this.value.replace(/\s+/g,'')"
                @focus="searhed" @blur="blurfn" onfocus="this.placeholder=''" onblur="this.placeholder='请输入商家名称'" oninput="if(value.length>15)value=value.slice(0,15)"/>
                <i class="el-icon-circle-close" v-show="close" @click="closefn($event)"></i>
              </div>
            </div>
            <div class="own">
              <p class="title">金额：</p>
              <div class="ownTime">
                <div class="numipt">
                  <i style="font-size:14px;color:#666666">￥</i><input oninput="if(value.length>6)value=value.slice(0,6)" placeholder="最低价" onfocus="this.placeholder=''" onblur="this.placeholder='最低价'" type="number" v-model="startMoney" >
                </div>
                <div id="zhi">至</div>
                <div class="numipt">
                  <i style="font-size:14px;color:#666666">￥</i><input oninput="if(value.length>6)value=value.slice(0,6)" placeholder="最高价" onfocus="this.placeholder=''" onblur="this.placeholder='最高价'" type="number" v-model="endMoney">
                </div>
              </div>
            </div>
            <div class="own">
              <p class="title">自定义时间：</p>
              <div class="ownTime">
                <div class="numipt">
                  <input type="text" placeholder='选择开始时间' readonly oninput="if(value.length>10)value=value.slice(0,10)" v-model="inputStartTime" @click="openPicker" onkeyup="this.value=this.value.replace(/\s+/g,'')">
                  <img src="@/assets/images/filter_date.png" alt="">
                </div>
                <div id="zhi">至</div>
                <div class="numipt">
                  <input type="text" placeholder='选择结束时间' readonly oninput="if(value.length>10)value=value.slice(0,10)" v-model="inputEndTime" @click="openPicker2" onkeyup="this.value=this.value.replace(/\s+/g,'')">
                  <img src="@/assets/images/filter_date.png" alt="">
                </div>
              </div>
            </div>
            <div class="time">
              <p class="title">分类：</p>
              <ul class="date" >
                <li v-for="(t,index) in categoryList" :key="index" :class="{'active':messagebtn==t.id}" @click="messagebtnfn(t)" >{{t.name}}</li>
              </ul>
            </div>
          </div>
          <!-- btn -->
          <div class="btnWrap">
            <div class="btn" @click="resetFn"><button>重置</button></div>
            <div class="btn" @click="submit"><button>完成</button></div>
          </div>
        </div>
      </mt-popup>
    </div>
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
  name: "cousterDetail",
  data() {
    return {
      monthList: new Date(),//月份
      pay:'暂无',
      messagebtn:'',
      categoryId:null,
      userId:this.$cookie.get('userid'),
      popupVisible: false,
      list:[],//消费明细列表
      mername:null,//商家名称
      pageNum:1,//当前页
      pageSize:8,//每页显示行数
      close: false,
      pickerValue: false,
      startMoney:null,//起始金额
      endMoney:null,
      startTime: new Date(),
      endTime: new Date(),
      inputStartTime: null,
      inputEndTime: null,
      startDate: new Date('2018/01/01'),
      startDate2: new Date('2018/01/01'),//开始时间
      endDate: new Date(), // 结束时间
      categoryList:[],
      nodata:false,
      loadshow:false,
      loadend:false,
      loading:false,
      // showCatory:false,
    };
  },
  mounted() {
    this.monthList = this.formData3(new Date());
    /* 查询消费总金额 */
    var posts = {
        userId:this.userId,
        startTime:this.formData(new Date()).substring(0,7)+'-01',//查询的开始时间
    }
    axios.get(this.Api+'/detail/totalNumInfoByVip',{params:posts}).then(res=>{
      if (res.status == 200) {
      
        var data = res.data;
        if (data.page.count == 0) {
          this.nodata = true;
          this.pay = 0;
        }else{
          this.pay = !data.page.totalAmount?'暂无':data.page.totalAmount;
        }
      }else{
        Toast('网络异常，请联系管理员')
      }
      this.$nextTick(function(){
        $('.cousterDetail').css({
          'padding-top':function(){
            return $('.cousterDetail .is-fixed').height() + 'px';
          }
        })
      })
    });
  },
  methods: {
    loadMore(){
      this.loading = true;
      this.loadshow = true;
      let that = this;
      let params = {
        userId:this.userId,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        startTime : this.formData(new Date()).substring(0,7)+'-01'//默认筛选开始时间
      }
      axios.get(this.Api+'/detail/listByVip',{params}).then(res=>{
        let data = res.data.page;
        console.log(data);
        if (res.status == 200) {
          if (data.code == 500) {
            Toast(data.msg || data.errmsg)
          }else{
            if (data.list.length == 0) {
              that.loadend = true;
              that.loadshow = false;
              that.loading = true;
              return false;
            };
            ;(that.pageNum)++;
            that.list = that.list.concat(data.list);
            that.loading = false;
            that.loadshow = false;
          }
        }else{
          Toast('后台异常，请联系管理员')
        }
      })
    },
    messagebtnfn(t){
      this.messagebtn = t.id;
      this.categoryId = t.id;
      // this.showCatory = ! this.showCatory;
      // if (this.showCatory == true) {
      //   this.messagebtn = t.id;
      //   this.categoryId = t.id;
      //   // console.log(this.categoryId);
      // }else{
      //   this.categoryId = null;
      // }
    },
    submit(){
      if (this.startMoney && this.endMoney) {
        if (this.endMoney < this.startMoney) {
          Toast('最高价不能小于最低价');
          return false;
        }
      }
      /* 查询消费总金额 */
      var posts = {
        userId:this.userId,
        mername:this.mername=='null'?null:this.mername==''?null:this.mername,
        category:this.categoryId,//分类
        startAmount:this.startMoney==""?null:this.startMoney,//查询金额的上限
        endAmount:this.endMoney==""?null:this.endMoney,//查询金额的下限
        startTime:this.inputStartTime==""?null:this.inputStartTime,//查询的开始时间
        endTime:this.inputEndTime==""?null:this.inputEndTime,//查询的结束时间  如：2018-10-01，可不传
      }
      if (posts.mername == null && posts.startTime == null && posts.endTime == null&& posts.startAmount == null&& posts.endAmount == null) {
        posts.startTime = this.formData(new Date()).substring(0,7)+'-01'//默认筛选开始时间
      }
      axios.get(this.Api+'/detail/totalNumInfoByVip',{params:posts}).then(res=>{
        if (res.status == 200) {
          var data = res.data;
          // console.log('筛选中的总金额',data);
          if (data.page.count == 0) {
            this.nodata = true;
            this.pay = 0;
          }else{
            this.pay = data.page.totalAmount;
          }
        }else{
          Toast('网络异常，请联系管理员')
        }
      })

      /* 查询消费列表 */
      var params = {
        userId:this.userId,
        mername:this.mername=='null'?null:this.mername==''?null:this.mername,
        category:this.categoryId,//分类
        startAmount:this.startMoney==""?null:this.startMoney,//查询金额的上限
        endAmount:this.endMoney==""?null:this.endMoney,//查询金额的下限
        startTime:this.inputStartTime==""?null:this.inputStartTime,//查询的开始时间
        endTime:this.inputEndTime==""?null:this.inputEndTime,//查询的结束时间  如：2018-10-01，可不传
        // pageNum:this.pageNum,
        // pageSize:this.pageSize,
      }
      if (params.mername == null && params.startTime == null && params.endTime == null&& params.startAmount == null&& params.endAmount == null) {
        params.startTime = this.formData(new Date()).substring(0,7)+'-01'//默认筛选开始时间
      }
      axios.get(this.Api+'/detail/listByVip',{params:params}).then(res=>{
        this.popupVisible = false;
        if (res.status == 200) {
          if (!this.inputStartTime) {
            this.monthList = this.formData3(new Date());
          }else if(!this.inputEndTime){
            this.monthList = this.formData3(this.inputStartTime)
          }else{
             this.monthList = this.formData3(this.inputStartTime) +'-'+ this.formData3(this.inputEndTime)
          }
          var data = res.data;
          if (data.page.list.length == 0) {
            this.nodata = true;
            this.list = data.page.list
          }else{
            this.nodata = false;
            this.list = data.page.list;
          }
        }else{
          Toast('网络异常，请联系管理员')
        }
      })
    },
    toDetail(n,item){
      this.$router.push({path:'/mine/cousterDetail/cdDetail',query:{index:n,t:encodeURIComponent(JSON.stringify(item))}})
    },
    closefn(e) {
      this.mername = "";
    },
    resetFn(){
      this.mername = null;
      this.messagebtn = 0;
      this.inputStartTime = null;
      this.inputEndTime = null;
      this.startMoney = null;
      this.endMoney = null;
      this.categoryId = null;
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
    goback() {
      // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
      // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
      if(this.$route.query.platform == 'android'){
        window.action.backAPP();
      }else if(this.$route.query.platform == 'ios'){
        window.action.backAPPiOS();
      }else{
        if(window.history.length > 1){
          this.$router.go(-1);
        }else{
          this.$router.push({path:'/'});
        }
      }
    },
    showFilter() {
      this.popupVisible = !this.popupVisible;
      /* 获取分类列表 */
      axios.get(this.Api + '/detail/queryCategory').then(res=>{
        // console.log(res);
        if (res.status == 200) {
          var data = res.data;
          this.categoryList = data.page;
        }else{
          Toast('网络错误，请重试！')
        }
      })
    },
    showData() {
      this.pickerValue = true;
    },
    formData1(time){// 列表时间格式化
      var date = new Date(time);
      var h = date.getHours() + ':';
      var m = date.getMinutes() < 10?'0'+date.getMinutes():date.getMinutes();
      return h+m;
    },
    formData2(time){// 列表日期格式化
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      return Y+M+D;
    },
    formData3(time){// 自动获取当前月
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      return Y+M;
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
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
.is-fixed{
  width:100%;
  position:fixed;
  top:0;
  left:0;
  background:#f2f2f2;
}
.cousterDetail {
  width: 100%;
  background: #f2f2f2;
  min-height: 100vh;
  overflow: hidden;
}
/* 头部 */
.cousterDetail >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
.cousterDetail .timeDetail {
  font-size: .5333rem;
  color: #666666;
  padding: .6667rem .4444rem;
  display: flex;
  justify-content: space-between;
}
.cousterDetail .filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.cousterDetail .filter .jiantou {
  width: 0.65rem;
  height: 0.6rem;
  color: #fff;
  margin-left: 0.1111rem;
}
.cousterDetail .filter .filter-title {
  font-size: 0.5556rem /* 25/45 */;
}

/* 列表 */
.cousterDetail {
  width: 100%;
}
.cousterDetail .list .item {
  background: #fff;
  padding: 0.6667rem 0.5556rem;
  border-bottom: 1px solid #eeeeee;
  overflow: hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: stretch;
}
.cousterDetail .list .item .time {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 0.4444rem;
}
.cousterDetail .list .item .time .date {
  font-size: .4889rem;
}
.cousterDetail .list .item .time .minut {
  font-size: .6667rem;
  color: #333333;
}
.cousterDetail .list .item .item_conten {
  font-size:.5778rem;
  flex:1;
  border-left: 1px solid #eeeeee;
  padding-left: 0.4444rem;
}
.cousterDetail .list .item .item_conten .detail {
  margin-top: 0.2222rem;
  color:#999;
}
.cousterDetail .list .item .profit {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #ff920e;
  font-size: .8rem;
  width:7em;
  text-align:right;
}
/* 筛选条件弹窗 */
.cousterDetail .filterPop {
  width: 100%;
  background: #fff;
}
.cousterDetail >>> .v-modal {
  top: 2rem;
}
.cousterDetail >>> .mint-popup {
  width: 100%;
}
.cousterDetail >>> .mint-popup-top {
  top: 2rem;
}
.cousterDetail .saixuan {
  position:relative;
}
.cousterDetail .saixuan .sx-main {
  max-height:70vh;
  overflow:auto;
  padding-bottom:1.7rem;
}
.cousterDetail .saixuan .sx-main::-webkit-scrollbar {display:none} /* 隐藏滚动条 */
.cousterDetail .filterPop .card_no {
  padding: 0.6667rem 0.4444rem;
}
.cousterDetail .filterPop .card_no .cardWrap{
  position: relative;
}
.cousterDetail .filterPop .time,
.own {
  padding: 0 0.4444rem 0.6667rem 0.444rem;
}
.cousterDetail .filterPop .card_no .title {
  font-size: .5778rem;
}
.cousterDetail .filterPop .time .title {
  font-size: .5778rem;
}
.cousterDetail .filterPop .own .title {
  font-size: .5778rem;
}
.cousterDetail .filterPop .card_no .content {
  border: 1px solid #c6c6c6;
  border-radius: 2px;
  width: 14.1rem;
  height: 1.3333rem;
  margin-top: 0.4444rem;
  text-indent: .5em;
}
.cousterDetail .filterPop .card_no i {
  font-size: 15px;
  position: relative;
  right: 35px;
  top: 0px;
}
.cousterDetail .filterPop .time .date {
  width: calc(100% + 0.46rem);
  overflow: hidden;
}
.cousterDetail .filterPop .time .date li {
  width: 6.5em;
  height: 1.3333rem;
  border: 1px solid #c6c6c6;
  border-radius: 2px;
  font-size: .5rem;
  display: block;
  text-align: center;
  float: left;
  margin-right: 0.4rem;
  margin-top: 0.4444rem;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cousterDetail .filterPop .time .date li:last-child {
  margin-right: none;
}
.cousterDetail .filterPop .own .ownTime {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
.cousterDetail .filterPop .own .ownTime #zhi{
  font-size: .6667rem;
  margin: .4444rem ;
  padding-top: 7px;
}
.cousterDetail .filterPop .own .ownTime .numipt{
  border-radius: 2px;
  border:1px solid #c6c6c6;
  width: 39.7%;
  height: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .1111rem .2222rem;
  margin-top: .444rem;
}
.cousterDetail .filterPop .own .ownTime .numipt input{
  width: 90%;
}
.cousterDetail .filterPop .own .ownTime .numipt img{
  width: .69rem;
  height: .69rem;
}
.cousterDetail .filterPop .btnWrap{
  position:absolute;
  left:0;
  bottom:0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: .5rem;
}
.cousterDetail .filterPop .btnWrap .btn{
  width: 50%;
  height: 1.5556rem;
  color: #666666;
}
.cousterDetail .filterPop .btnWrap button{
  width: 100%;
  height: 100%;
  font-size: .6222rem;
  outline: none;
  border: none;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  background: #fff;
}
.cousterDetail .filterPop .btnWrap .btn:nth-child(2) button{
  border-right: none;
  color: #ff920e;
}
</style>
