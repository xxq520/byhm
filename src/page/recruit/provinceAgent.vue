<template>
  <div class="recruitment-agent">
    <recruit-top ref="top" :content="content"></recruit-top>
    <!-- <recruit-pay :payContent="payContent"></recruit-pay> -->
    <div class="pay-btn-box">
      <div class="pay-btn" @click="goToApplication">立即成为用户</div>
    </div>
    <!-- <div @click="clearCocik">清除登录cookie</div> -->
  </div>
</template>

<script>

export default {
  name: "recruitmentAgent",
  data() {
    return {
     content: {
       title:'省公司推广',
       text: [
         '中国有31个省，有333个市，平均一个省有11个市，假设一位市级推广下面共发展了八万位用户，按归属于省级推广每位用户的开发奖是20元计，那么发展的收益是一千七百六十万元，也是年年有，财富永动机。当然，也同样需要付出艰辛与巨大的持续努力，包括帮助下属市级推广、区县推广商及推广商去发展。',
         '省级推广也自然成为了爱之家商城的推广商，有权发展企业级推广商、推广商、顾客，并获得规定回报，同样，多少是随自己的能力与心思，用心去做，同样也有不菲的收入。',
         '前期直接资金投入也只有五万元，且会在发展的前两千五百位用户中逐个返还。'
       ],

     },

    };
  },
  methods: {
    goToApplication() {
      if(this.$refs.top._data.agreen) {
        this.$router.push({ name: "agentApplication",query:{level: 5}});
      }else{
        Toast({message:'请同意成为推广协议',position:'middle'})
      }

    },
    clearCocik() {
      this.$cookie.delete('userPhone');
      this.$cookie.delete('token');
      this.$cookie.delete('expire');
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
