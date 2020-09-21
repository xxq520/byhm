<template>
  <div class="cart">
    <div v-if="isActive == 0&&cardType!=4&&isFake== 0">
      <div class="card_box"  >
        <p>开通正式超级会员身份立享专属特权</p>
        <div class="img_box">
          <img src="http://dfs2.520shq.com/group1/M00/07/A8/wKgAC187shaAMxDgAAFT-H8s03o056.png" />
        </div>
      </div>
    </div>
    <div v-else>
      <div class="img_box1" >
         <img src="@/assets/images/yhfl_img_card.png" />
      </div>
     
    </div>

    <div class="card-content">
      <template>
        <div class="card-num" :class="{'jinse': isActive > 0 || isFake > 0}"
            v-if="post.endTime!=0&&post.endTime!=null&&post.endTime!='1970.01.01'">
            {{ post.endTime}}到期 </div>
        <div class="card-num1" :class="{'jinse': isActive > 0 || isFake > 0}" >NO:{{cardNo }} </div>
       
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: ["carvist",'cart','xucardType'],
  data () {
    return {
      post:this.cart,
      isActive: this.$cookie.get("isActive"), // 已365付款 0未付 1已付
      cardType: this.$cookie.get("cardType"), //
      cardNo: this.$cookie.get("card"),
      cardName: "优惠一卡通(年卡)",
      isFake: this.$cookie.get("isFake"), //是否体验用户 1是 0否
    }
  },
  watch:{
    cart(val){
      this.post = val
    }
  },
  mounted(){

    
  },
  methods: {
    buttonfn(){
      // Toast(this.msg)
    },

    //获取信息
    getInfo() {
      axios.post(this.Api + '/user/queryByCardNo?cardNo='+this.cardNo).then(res => {

        this.isFake = res.data.isFake
       
      })
    }
  },
  created() {
    this.getInfo()
  }
}
</script>

<style scoped>
  .cart {
      position: relative;
      /* padding: 20px 1.458333rem; */
      padding: .4444rem  0;
      /* background: #ffffff; */
      background-color: #f5f5f5;
  }
  .card-content {
     width: 80%;
      position: absolute;
      /* bottom: 20%; */
      bottom: 23%;
      left: 1.4rem;
      padding: 0 0.8rem;
      font-size: 12px;
      letter-spacing: 1px;
  }
  .card-num {
      float: left;
      color: #ffffff;
  }
    .card-num1 {
    float: right;
    color: #ffffff;
    }
  .card-price {
      color: #FFFBC7;

  }
  .jinse {
    color: #FFFBC7;
  }
  .card-name {
    position: absolute;
    font-size: .666667rem;
    font-weight: bold;
    left: 2.291667rem;
    top: 15%;
  }
  .card_box {
    background-color: #ffffff;
  }
  .card_box p {
    height: 1.6rem /* 72/45 */;
    line-height: 1.6rem /* 72/45 */;
    padding: 0 .4444rem /* 20/45 */;
    border-bottom:  1px solid #eeeeee;
    color: #666;
    font-size: .5778rem /* 26/45 */;
  }
  .card_box .img_box{
    padding: .6667rem /* 30/45 */ 1.3333rem /* 60/45 */;
  }
  .img_box1{
    padding: 20px 1.458333rem;
    background-color: #ffffff;
  }
</style>
