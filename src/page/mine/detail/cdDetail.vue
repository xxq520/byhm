<template>
   <div class="cdDetail">
     <header class="mint-header">
        <mt-button icon="back" slot="left" @click="goback"></mt-button>
        <h1 class="mint-header-title">消费明细</h1>
    </header>
    <!-- title -->
    <div class="contentWrap">
      <div class="title">
        <div class="name">{{name}}</div>
        <div class="money">{{money}}</div>
      </div>
      <div class="content">
        <div class="line">
          <span class="line_title">付款方式</span>
          <span class="line_ctt">{{payway}}</span>
        </div>
        <div class="line">
          <span class="line_title">分类</span>
          <span class="line_ctt">{{catagory}}</span>
        </div>
        <div class="line">
          <span class="line_title">订单号</span>
          <span class="line_ctt">{{ordernumber}}</span>
        </div>
        <div class="line">
          <span class="line_title">交易时间</span>
          <span class="line_ctt">{{formData(ordertime)}}</span>
        </div>
      </div>
    </div>
    <!-- 商品说明 -->
    <!-- <div class="ct2">
      <div class="ct2Wrap" @click="openDetail">
        <div class="detail" >
          <span class="line_title">商品说明</span>
          <span class='arrowR' :class="{'el-icon-arrow-right':!showDetail}"></span>
          <span class='arrowR' :class="{'el-icon-arrow-down':showDetail}"></span>
          <span class="line_ctt">共1件</span>
        </div>
      </div>
      <div class="ct2Wrap" v-if="showDetail">
        <div class="detail">
          <span class="line_title">{{product_name}}*{{num}}</span>
          <span class="line_ctt">￥{{price}}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script type="text/javascript">
export default {
   name: 'cdDetail',
   data() {
       return {
         name:'华润成家标超南区(聚德店)',
         money:'-80.02',
         payway:'微信支付',//1.银联;2.支付宝;3.微信;4.其他
         catagory:'美食饮品',
         ordernumber:'201811214356',
         ordertime:'2018.11.21 18:20',
         product_name:'精品摩卡',
         price:'80.02',//商品说明内价格
         num:'1',
         showDetail:false,
       }
   },
   mounted(){
    var data = JSON.parse(decodeURIComponent(this.$route.query.t));
    this.name = !data.mername?'匿名':data.mername;
    this.money = !data.amountStr?'无支付':'-'+data.amountStr;
    this.catagory = !data.categoryName?'无分类':data.categoryName;
    this.ordernumber = data.orderNum;
    this.ordertime = data.createTime;
    this.payway = data.payChannel == 1?'银联':data.payChannel == 2?'支付宝':data.payChannel == 3?'微信':'其他';
   },
   methods: {
     openDetail(){
       this.showDetail = !this.showDetail;
     },
     goback() {
      this.$router.go(-1);
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y+M+D+h+m+s;
    },
   }
}
</script>

<style scoped>
.cdDetail {
  width: 100%;
  background: #f2f2f2;
  min-height: 100vh;
  overflow: hidden;
}
.cdDetail .contentWrap{
  background: #fff;
  margin-top: .4444rem;
}
/* 头部 */
.cdDetail >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
/* title */
.cdDetail .contentWrap .title{
  padding: 1.5556rem 4.8889rem;
}
.cdDetail .title .name{
  font-size: .5778rem;
  color: #333333;
  text-align: center;
}
.cdDetail .title .money{
  font-size: .9333rem;
  color: #333333;
  text-align: center;
}
/* content */
.cdDetail .contentWrap .content .line{
  border-bottom: 1px solid #eeeeee;
  padding: .6667rem .4444rem;
  overflow: hidden;
}
.cdDetail .contentWrap .content .line span{
  font-size: .5778rem;
}
.cdDetail .contentWrap .content .line .line_title{
  color: #333333;
  float: left;
}
.cdDetail .contentWrap .content .line .line_ctt{
  color: #666666;
  float: right;
}
.cdDetail  .ct2{
  margin-top: .4444rem;
}
.cdDetail  .ct2Wrap{
  border-bottom: 1px solid #eeeeee;
  padding: .6667rem .4444rem;
  overflow: hidden;
  background: #fff;
}
.cdDetail .ct2 .detail span{
  font-size: .5778rem;
}
.cdDetail .ct2 .detail .arrowR{
  color: #000;
  float: right;
  margin-top: 2px;
}
.cdDetail .ct2 .detail .line_title{
  color: #333333;
  float: left;
}
.cdDetail .ct2 .detail .line_ctt{
  color: #666666;
  float: right;
}
</style>
