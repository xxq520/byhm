<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="offer-description">
      <div class="description-top">
        <div class="title">百业惠盟用户专享</div>
        <div class="name">{{ titlefn(postdata) }}</div>
      </div>
      <div class="time" v-if="postdata.type==3 && postdata.fixedPrice > 0">
        <div class="title">一口价</div>
        <div class="time-box">
          <span class="dian"></span>价格：{{ postdata.fixedPrice }}元
        </div>
      </div>
       <div class="usage-rules" v-if="postdata.type==4">
        <div class="title">优惠内容</div>
        <div class="time-box">
          {{ postdata.detail?postdata.detail :'无优惠内容'}}
        </div>
      </div>
      <div class="time">
        <div class="title">有效期</div>
        <div class="time-box">
          <span class="dian"></span>{{ formData(postdata.useStartDate) }} 至 {{ formData(postdata.useEndDate) }}
        </div>
      </div>
      <div class="usage-rules">
        <div class="title">使用规则：</div>
        <div class="rules" v-for="(item,i) in rules" :key="i">
          <div class="clire"></div>
          <div class="text">{{ item }}</div>
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
        title:'使用说明'
      },
      id: this.$route.query.id,
      postdata:{},
      rules:[]
    }
  },
  mounted() {
    axios.get(this.Api+ 'voucher/NewInfoOne?id='+this.id).then(res => {
      if(res.data.code==0){
        this.postdata = res.data.voucherEntity;
        this.rules = this.postdata.remarks.split('\n'); // 拆分使用规则换行符添加数组
      }else{
        Toast(res.data.msg);
      }
    })
  },
  methods: {
    titlefn(obj){
      switch(obj.type){
        case 0:
          return obj.discount?parseIn(obj.discount)+'折优惠':'不打折';
          break;
        case 1:
          return obj.preferential && obj.privilege?'折上'+parseIn(obj.preferential)+'折或折上优惠'+parseIn(obj.privilege)+'折':
            obj.preferential && !obj.privilege?'折上'+parseIn(obj.preferential)+'折':
            !obj.preferential && obj.privilege?'折上优惠'+parseIn(obj.privilege)+'折':'不打折';
          break;
        case 2:
          return obj.enoughAmount && obj.verticalReduction?'满'+obj.enoughAmount+'元减'+obj.verticalReduction+'元':
            '不打折';
          break;
        case 3:
          return obj.fixedPriceDetails?obj.fixedPriceDetails:'无内容';
          break;
        case 4:
          return obj.name?obj.name:'无内容';
          break;
      };
      // 解决浮点数问题
      function parseIn(num){
        let numd = num.toString().split(".")[0];
        let nums = num.toString().split(".")[1];
        numd = new Number(numd)/10;
        return nums?numd+'.'+nums:numd;
      }
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
        //return Y+'-'+M+'-'+D+' '+h+':'+m;
        return Y+'-'+M+'-'+D;
      }
    }
  }
}
</script>

<style scoped>
  .offer-description {
    background-color: #f5f5f5;
    height: 100vh;
  }
  .description-top {
    overflow:hidden;
    background-color: #ffffff;
    text-align: center;
    padding:0 20px 0.7em;
  }
  .description-top .title {
    font-size: .6rem;
    color: #333333;
    padding: .833333rem 0 .5rem 0;
  }
  .description-top .name {
    font-size: .875rem;
    color: #333333;
    font-weight: bold;
  }
  .time {
    padding: 0 .416667rem;
    color: #333333;
    height: 2.708333rem;
    background-color: #ffffff;
    margin-top: .416667rem;
  }
  .time .title {
    font-size: .583333rem;
    padding: .625rem 0 .208333rem 0;
  }
  .time .dian {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #999999;
    margin-right: 5px;
  }
  .time-box {
    font-size: 0.6rem;
    display: flex;
    align-items: center;
  }
  .usage-rules {
    background-color: #ffffff;
    margin-top: .416667rem;
    padding: .625rem .416667rem .208333rem .416667rem;
  }
  .usage-rules .title {
    font-size: .65rem;
    color: #333333;
    margin-bottom: .25rem;
  }
  .usage-rules  .time-box{
    color: #666666;
  }
  .rules {
    margin-bottom: .166667rem;
    display: flex;
    width: 100%;
  }
  .rules .clire {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #999999;
    margin-right: 5px;
    float: left;
    margin-top: 6px;
  }
  .rules .text {
    font-size: 0.6rem;
    color: #666666;
    width: calc(100% - 9px);
    float: right;
  }
</style>
