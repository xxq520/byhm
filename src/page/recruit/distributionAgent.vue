<template>
  <div class="recruitment-agent">
    <recruit-top ref="top" :content="content"></recruit-top>

    <div class="pay-btn-box">
      <div class="pay-btn" @click="goToApplication">立即成为推广商</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "recruitmentAgent",
  data() {
    return {
     content: {
       title:'推广商',
       text: [
         '推广商应以发展发廊、美容院、养生馆、健身房、麻将馆、桑拿浴室、茶楼、饭店、网吧、高尔夫球场等老板为主，因为他们手上本来就有“用户”，这些用户对他们有一定情感，他们也方便与用户沟通，且既然能成为他们的“用户”，就有这种需要也有这个能力成为惠盟用户。对于这些店铺的老板们（也含管理者）来说，做惠盟用户是加分的，百益无一害，不但不会影响他们的生意、关系，而且会加强他们的情感，又彼此获得回报，是多赢模式。',
         '假设一位推广商能发展500位用户，每位用户的直接开发奖是120元，那么发展的直接收益是六万元，如果发展1000位，就是十二万元，对于这些场所来说，是很容易成功发展的事，而且这笔收入年年都有。',
         '每位用户都会成为爱之家商城的推广商，假设将来正常时，每位用户一年的自购与分享的所产生的销售最低按两万元计，则用户的节省或收获超过三千元，远超其398元的用户费。',
         '推广商自动是推广商的上级，则推广商在每位用户身上产生的回报超过一千元，按500位用户，则推广商固定年提成保守估计超过五十万元，且年年有，是财富永动机。',
         '前期无需资金投入，开通帐号后只需成为百业联盟用户，即可成为推广商。'
       ],

     },

    };
  },
  methods: {
    goToApplication() {
      if(this.$refs.top._data.agreen) {
        this.$router.push({ name: "agentApplication",query:{level: 2}});
      }else{
        Toast({message:'请同意成为推广商协议',position:'middle'})
      }

    }
  },

  created() {
    console.log(this.$route.query);
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
