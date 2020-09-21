<template>
   <div class="ERFilter">
     <header class="mint-header">
        <mt-button icon="back" slot="left" @click="goback"></mt-button>
        <h1 class="mint-header-title">兑换明细</h1>
    </header>

    <div class="list" >
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="item_conten">
          <div class="name">50.00</div>
          <div class="detail">兑换时间：2019-12-12 18：00：00</div>
        </div>
        <div class="profit">兑换成功</div>
      </div>
    </div>
    <div class="no-data" style="margin-top:100px" v-if="nodata"><img src="@/assets/images/qs.png" alt=""></div>
    <div class="endd" v-else>加载完毕</div>
   </div>
</template>

<script type="text/javascript">
import { DatetimePicker } from "mint-ui";
export default {
  name: "ERFilter",
  data() {
    return {
      list:[],
      nodata:false,
    };
  },
  mounted() {
    this.list = this.$route.query.data;
    this.topList = this.$route.query.topList;
    console.log(this.list);
    if (this.list.length == 0) {
      this.nodata = true;
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      // var m = date.getMinutes() + ':';
      var m = date.getMinutes();
      var s = date.getSeconds();
      // return Y+M+D+h+m+s;
      return Y+M+D;
    },
  }
};
</script>

<style scoped>
.ERFilter {
  width: 100%;
  background: #f2f2f2;
  min-height: 100vh;
  overflow: hidden;
  padding-bottom: 60px;
}
/* 头部 */
.ERFilter >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
.ERFilter .filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.ERFilter .filter .jiantou {
  width: 0.65rem;
  height: 0.6rem;
  color: #fff;
  margin-left: 0.1111rem;
}
.ERFilter .filter .filter-title {
  font-size: 0.5556rem /* 25/45 */;
}
/* 列表 */
.ERFilter {
  width: 100%;
}
.ERFilter .endd{
    font-size: .6rem;
    text-align: center;
    color: #666666;
}
.ERFilter .list .item {
  background: #fff;
  padding: 0.6667rem 0.5556rem;
  border-bottom: 1px solid #eeeeee;
  overflow: hidden;
}
.ERFilter .list .item .item_conten {
  font-size:.5778rem;
  float: left;
}
.ERFilter .list .item .item_conten .detail {
  margin-top: 0.2222rem;
}
.ERFilter .list .item .profit {
  float: right;
  color: #ff920e;
  margin-top: 0.2222rem;
  font-size: .8rem;
}

</style>
