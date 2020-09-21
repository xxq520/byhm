<template>
  <div class="recruitment-agent">
    <recruit-top ref="top" :content="content"></recruit-top>
    <!-- <recruit-pay :payContent="payContent"></recruit-pay> -->
    <div class="pay-btn-box">
      <div class="pay-btn" @click="goToApplication">立即成为用户</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "recruitmentAgent",
  data() {
    return {
     content: {
       title:'区县推广商',
       text: [
         '假设一位区县级区县推广商发展20位推广商，平均每位推广商发展了500位用户，合计平均一个区县发展一万名惠盟用户，归属于区县级区县推广商每位用户的开发奖是100元，则发展的直接收益是一百万元，如果一个区县发展了两万名用户，直接发展奖金就是二百万元，且年年有，当然，这需要付出艰辛与持续的努力。区县推广商是推广商在爱之家商城的推介人，享受按“发展企业级推广商”算的提成为0.25%（商品出厂价计），固定年提成达数十万元，也是年年有，是财富永动机。',
         '区县推广商在一个区县内发展联盟商家约一千家，每家的开发奖金50元，不计算在内。',
         '前期的直接资金投入只有一万元预付用户费，且会在发展的前一百位用户中逐个返还。'
       ],

     },

    };
  },
  methods: {
    goToApplication() {
      if(this.$refs.top._data.agreen) {
        this.$router.push({ name: "agentApplication",query:{level: 3}});
      }else{
        Toast({message:'请同意成为推广商协议',position:'middle'})
      }

    }
  },

  created() {

  },
  mounted() {
    console.log(this.$refs.top._data.agreen);
  }
};
</script>

<style scoped>
.recruitment-agent {
  background: #f5f5f5;
}
.pay-btn-box {
  padding: 1.458333rem 0;
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
</style>
