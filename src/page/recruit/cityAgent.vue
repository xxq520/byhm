<template>
  <div class="recruitment-agent">
    <recruit-top ref="top" :content="content"></recruit-top>
    
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
       title:'市公司推广',
       text: [
         '中国有2853个区县，有333个市，平均一个市有8.5个区县，假设一位市级推广商下面共发展了8位区县级区县推广商，平均每位区县级伙人发展了一万位用户，按归属于市级推广商每位用户的开发奖是30元计，那么发展的收益是二百四十万元，也是年年有，财富永动机。当然，也同样需要付出艰辛与巨大的努力，包括帮助下属区域合作人及推广商发展。',
         '市级推广商自然成为爱之家商城的推广商，有权发展企业级推广商、推广商、顾客，并获得规定回报，多少就随自己的能力与心思，用心去做，也是不错的收入。',
         '前期直接资金投入只有三万元预付用户费，且会在发展的前一千位用户中逐个返还。'
       ],

     },

    };
  },
  methods: {
    goToApplication() {
      if(this.$refs.top._data.agreen) {
        this.$router.push({ name: "agentApplication",query:{level: 4}});
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
