<template>
  <div class="InviteJoin">

    <!-- 轮播 -->
    <div class="swiper-box">
        <div class="swiper-wrap">
            <div class="swiper-list" v-for="(item,index) in proxyData" :key="index">

                <div class="proxy">
                    <div class="title">{{item.title}}</div>
                    <div class="main">
                        <div class="condition">
                            <!-- <div>申请条件：</div>
                            <div>
                                <span class="start">*</span>
                                <p>{{item.condition}}</p>
                            </div> -->
                            {{item.condition}}
                        </div>
                        <!-- <div class="quanyi">
                            <div class="quanyi-title">推广权益：</div>
                            <div class="quanyi-main">
                                <div class="quanyi-text" v-for="(qy,aa) in item.quanyi" :key="aa">
                                    <div class="xing">*</div>
                                    <div>{{qy}}</div>
                                </div>
                                <div class="quanyi-text">
                                    <div class="xing">*</div>
                                    <div>享受自己发展市公司/区县推广商/推广商发展的惠盟用户收益</div>
                                </div>
                                <div class="quanyi-text">
                                    <div class="xing">*</div>
                                    <div>真正实现财富收益最大化回报</div>
                                </div>

                            </div>

                        </div> -->
                    </div>
                    <div>
                        <div class="understan" @click="goDetails(item.level)">了解详情</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <bottomnav :carcount="carcount"></bottomnav>
  </div>
</template>

<script>
import swiper from '@/assets/js/swiperVue';
export default {
  name: "investment",
  data() {
    return {
      swiperIndex:0,
      carcount: "推广商招募",
      proxyData: [
        //   {'level':'5','title': '省级区域服务代理商', 'condition': '成为惠盟用户，再资金投入5万元购买省公司代理-钻石卡 ', 'quanyi':['奖励5万元省级代理收益（相当于您零成本获得省公司代理身份）','享受自己发展市公司/区域合伙人/经销商发展的惠盟用户收益','真正实现财富收益最大化回报']},
        //   {'level':'4','title': '市级区域服务代理商', 'condition': '成为惠盟用户，再资金投入3万元购买市公司代理-白金卡 ', 'quanyi':['奖励3万元市级代理收益（相当于您零成本获得市公司代理身份）','享受自己发展区域合伙人/经销商发展的惠盟用户收益','真正实现财富收益最大化回报']},
        //   {'level':'3','title': '县级区域服务代理商', 'condition': '成为惠盟用户，再资金投入1万元购买区域合伙人-金卡 ', 'quanyi':['奖励1万元区域代理收益（相当于您零成本获得区域合伙人身份）','享受自己发展经销商发展的惠盟用户收益','真正实现财富很高回报']},
        //   {'level':'2','title': '经销商', 'condition': '已经成为惠盟用户 ', 'quanyi':['享受自己发展的惠盟用户收益','真正实现财富收益不错回报',]},
            {'level':'5','title': '省级区域服务推广商', 'condition': '成为百业惠盟的推广商需要是在所在地长期生活与工作的人士，能为当地推广商、惠盟商家、消费者提供就近、及时、满意、高效的服务。'},
            {'level':'4','title': '市级区域服务推广商', 'condition': '成为百业惠盟的推广商需要是在所在地长期生活与工作的人士，能为当地推广商、惠盟商家、消费者提供就近、及时、满意、高效的服务。'},
            {'level':'3','title': '县级区域服务推广商', 'condition': '成为百业惠盟的推广商需要是在所在地长期生活与工作的人士，能为当地推广商、惠盟商家、消费者提供就近、及时、满意、高效的服务。'},
            {'level':'2','title': '推广商', 'condition': '成为百业惠盟的推广商需要是在所在地长期生活与工作的人士，能为当地推广商、惠盟商家、消费者提供就近、及时、满意、高效的服务。 ' },
      ]
    };
  },
  methods: {
      goDetails(level) {
          this.$router.push({ name: 'invite', params: {level: level, code: '0'} });
      },
    //判断邀请人是不是推广商
    dealer() {
        let that = this
        console.log(that.$cookie.get('superiorLevel'))
        if (that.$cookie.get('superiorLevel') == 2) {
            that.proxyData.pop();
        }
    }
  },
  mounted(){
        let that = this;
        this.dealer();
        var swiperbox = swiper({
            box:".swiper-box",wrap:".swiper-wrap",list:".swiper-list"
        });
        swiperbox.swiperTouch(function(){
            that.swiperIndex = this.index;
        });
   },
};
</script>

<style scoped>
/* 海报轮播 */
  .InviteJoin{
    width: 100%;
    position: relative;
    height: 100vh;
    background-image: url("../../assets/images/zhaoshang.png");
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
  }
    .swiper-box{
        position: absolute;
        left:10%;
        top:0;
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 80%;
        height:100%;
    }

  .InviteJoin .swiper-list .proxy {
      width: 100%;
      height:100%;
      /* height: 12rem /* 1000/45 * */
      display: block;
      background-image: url("../../assets/images/proty.png");
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 10px;
      line-height: 20px;
      padding-bottom: .833333rem;
      -webkit-transform: scale(0.9);
        transform: scale(0.9);
        opacity: .7;
  }
  .InviteJoin .iActive .proxy{
      -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 1;
  }
.title {
    color: #ffffff;
    font-size: .875rem;
    text-align: center;
    padding: .625rem 0;
}
.condition,.quanyi {
    padding: 0 1.083333rem 0 1.758333rem;
    color: #ffffff;
    /* display: flex; */
    font-size: 14px;
    letter-spacing: 3px;
    text-indent: 18px;

}
.condition div:first-child {
    float: left;
    font-size: 14px;
    width: 70px;
}
.condition div:last-child{
    display: flex;
    font-size: 12px;
    width: calc(100% - 74px);
    margin-bottom: 10px;
}
.quanyi-title {
    float: left;
    font-size: 14px;
    width: 70px;
}
.quanyi-main {
    float: left;
    font-size: 12px;
    width: calc(100% - 74px);
}
.quanyi-text {
    display: flex;
    justify-content: flex-start;
}
.xing,.start {
    line-height: 24px;
    font-size: 14px;
    margin-right: 4px;
}
.understan {
    width: 4.041667rem;
    height: 1.208333rem;
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
  font-size: .666667rem;
  color: #ffffff;
  text-align: center;
  line-height: 1.208333rem;
  border-radius: .208333rem;
  margin: .625rem auto 0 auto;
}
.main {
    height: 120px;
    overflow-y: auto;
}
</style>
