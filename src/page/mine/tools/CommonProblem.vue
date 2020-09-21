<template>
   <div class="CommonProblem" >
     <!-- 头部 -->
    <div class="head" >
      <topnav :topnav="topnav"></topnav>
    </div>
    <!-- 搜索框 -->
    <div class="searhed">
        <!-- <i class="el-icon-search"></i> -->
        <input type="text" placeholder="搜索" v-model="search" 
         onfocus="this.placeholder=''" onblur="this.placeholder='搜索'" @input='oninput($event)' onkeyup="this.value=this.value.replace(/\s+/g,'')">
        <i class="el-icon-circle-close"  @click="closefn($event)"></i>
    </div>
    <!-- 问题列表区 -->
    <div class="ProblemTitle">问题类型</div>
    <!-- 自己写折叠面板 -->
    <div class="container">
      <ul>
        <li v-for="(title,i) in list.title" :key="i">
          <p class="title" v-text="title" @click="show(i)"></p>
          <span class="arrowR " :class="{'el-icon-arrow-down':index==i&&isShow}"></span>
          <span class="arrowR "  :class="{'el-icon-arrow-right':index!=i||!isShow}" ></span>
          <!-- <div class="content" :class="{active:index==i}" v-show="isShow" v-text="list.content[i]"></div> -->
          <div class="content" :class="{active:index==i}" v-show="isShow" >
            <div style="font-size:.55rem;line-height:25px;letter-spacing: .7px;" v-for="(t,n) in list.content[i].value" :key="n">{{t.value}}</div>
          </div>
        </li>
      </ul>
    </div>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "CommonProblem",
  data() {
    return {
      topnav:{
        title:'常见问题'
      },
      search: "",
      
      check: false,
      index: -1,
      isShow: false,
      cc: true,
      list: {
        title: [
          "怎么注册？",
          "怎么购卡？",
          "注册了可以看到用户卡号但为什么不能使用？",
          "怎么提现？",
          "怎么申请省、市、县、运营商？",
          "怎么邀请别人成为运营商呢？",
          "怎么邀请用户呢？",
          "怎么邀请商家入驻呢？",
          "商家怎么管理店铺？",
          "商家怎么自行入驻呢？",
          "商家入驻审核未通过或通过后无法在APP找到店铺资料呢？",
          "怎么查询人脉？",
          "怎么查看收益明细呢？",
          "怎么看发展人的信息呢？",
          // "什么是代金券？",
          "什么是消费券？",
          // "怎么获得代金券？",
          "怎么获得消费券？",
          // "代金券兑换后怎么查询到？",
          "消费券兑换后怎么查询到？",
          "消费券怎么使用？",
          // "代金券怎么使用？",
          "什么角色可以使用消费券？",
          "消费券的使用期限是多久？",
          "消费券有其他限制吗？"
        ],
        content: [
          {id:1,value:[{id:1,value:"答：打开520平台APP，点击最下方菜单栏中“我的”，在右上角有“注册”按钮，点击输入用户名、密码、手机密码、验证码后，点击注册，即可完成注册，之后在520平台APP首页点击进入百业惠盟，即可使用。"}]},
          {id:2,value:[
            {id:1,value:"现在百业惠盟暂不开放用户购卡渠道，若需要购卡成为惠盟用户的话，建议联系当地的省、市、县、运营商索要链接或二维码进行注册购卡。"},
            {id:2,value:"若不清楚当地运营商联系方式，请致电400-180-2520进行咨询。"}
          ]},
          {id:3,value:[{id:1,value:"答：注册后登陆百业惠盟可以看到预先分配好的一卡通卡号，但因为还未购卡，因此无法享受用户的待遇，需要进入首页最下方“用户福利”菜单进行购卡之后，才能享受真正的用户服务。"}]},
          {id:4,value:[
            {id:1,value:"答：第一步：登录百业惠盟，点击右下角“我的”；"},
            {id:2,value:"第二步：点击“立即提现”；"},
            {id:3,value:"第三步：点击“添加银行卡”；"},
            {id:4,value:"第四步：填入开户行、开户支行名称、开户名、银行卡号、身份证件号码，上传银行卡正面、身份证明、身份证反面、门头照、收银台照、经营场所照（个人用户可以随便百度或者户外拍一些照片即可）；"},
            {id:5,value:"第五步：点击“获取验证码”；"},
            {id:6,value:"第六步：点击“立即提交”；"},
            {id:7,value:"第七步：点击添加好的银行卡，选择“提现”；"},
            {id:8,value:"第八步：输入提现金额；"},
            {id:9,value:"第九步：点击确认；"},
            {id:10,value:"第十步：再次确认；"},
            {id:11,value:"最后等待平台审核。"},
          ]},
          {id:5,value:[
            {id:1,value:"答：成为尊贵的运营商只有找到当地区域的省、市、县运营商索要二维码或让他推荐微信链接给您，然后您再点击链接进行登录，并且需要购买一次一卡通之后，方可成为指定身份的用户。"},
            {id:2,value:"若不清楚当地运营商联系方式，请致电400-180-2520进行咨询。"}
          ]},
          {id:6,value:[{id:1,value:"答：要邀请别人成为运营商，首先需要您自己本身就是省、市、县、运营商身份，同时您已经成功购卡并激活了之后，才能通过“我的”菜单，点击“惠盟邀请”功能发送省、市、县、运营商的二维码或者微信链接给被邀请人。对方在微信识别二维码或者点击您推荐的链接后，进行注册购卡即可成为相应身份的运营商。"}]},
          {id:7,value:[{id:1,value:"答：要邀请别人成为惠盟用户，首先需要您自己本身就是推广商或者运营商身份才能进行邀请，同时已经购卡且激活成功之后，才能通过“我的”菜单中“惠盟邀请——惠盟用户”功能发送二维码或者推荐微信链接给对方，对方在微信中识别二维码或点击链接之后，进行注册购卡后即可成为被邀请人。"}]},
          {id:8,value:[{id:1,value:"答：要邀请商家入驻，只要是购卡正式成为惠盟推广商、运营商、惠盟用户都可以通过“我的”里面惠盟邀请商家入驻功能发送二维码或者微信链接给商家，对方在微信识别二维码或者点击链接后，注册购卡后即可填写店铺入驻资料和上传资质图片，提交后平台进行审核，等待审核通过后，商家即可管理店铺。"}]},
          {id:9,value:[{id:1,value:"答：现在商家是根据区域性质开放的，不是所有地区都会有商家显示，在还未开放的地区，商家可以点击首页附加惠盟商家的下方广告图，点击商家入驻申请，即可填入基础资料和上传资质图片提交申请，待平台审核通过。"}]},
          {id:10,value:[{id:1,value:"答：现在商家是根据区域性质开放的，不是所有地区都会有商家显示，在还未开放的地区，商家可以点击首页附加惠盟商家的下方广告图，点击商家入驻申请，即可填入基础资料和上传资质图片提交申请，待平台审核通过。"}]},
          {id:11,value:[{id:1,value:"答：百业惠盟商家是按照区域性质逐步开放的，因为我们需要一个区域发展到一定数量的商家后，才会一次性开放一个区域给用户看到。"}]},
          {id:12,value:[{id:1,value:"答：进入百业惠盟后，点击最下面菜单“我的”，在账号下面可以看到直接人脉，即可看到直接和间接人脉。"}]},
          {id:13,value:[{id:1,value:"答：进入百业惠盟后，点击最下面菜单“我的”，收益就是总收入，日收益是每天的收益，月收益是每月的收益，累计收益是累计的所有的收益。下方的“收益明细”，点击进去，即可看到所有的收益明细。"}]},
          {id:14,value:[{id:1,value:"答：进入百业惠盟后，点击最下面菜单“我的”，在人脉管理那里可以看到潜在人脉，直接人脉和间接人脉。潜在人脉即通过二维码或者微信分享链接给对方，对方登录和注册后未购卡的人脉信息。直接人脉即通过二维码或者微信分享链接给对方，并且已经购卡的惠盟成员。间接人脉即直接发展的人脉后他们再发展其他人的惠盟成员。"}]},
          // {id:15,value:[{id:1,value:"答：代金券是百业惠盟和爱之家商城合作的一种优惠政策，可以在爱之家商城当现金使用（品牌广场除外）。"}]},
          {id:16,value:[{id:1,value:"答：在成为百业惠盟VIP身份以上获得的专属消费优惠，用于在爱之家商城中百业专区抵扣一定支付额度的优惠。"}]},
          // {id:17,value:[{id:1,value:"答：获得代金券只有一种方法，就是惠盟用户推荐一位新的惠盟用户，推荐的惠盟用户就可以获得50元的代金券，之后可以在底部“我的”中兑换爱之家的代金券了。另外如果被推荐的惠盟用户再推荐第三位惠盟用户，那第一位惠盟用户也能会的25元代金券，之后第二惠盟用户能获得50元代金券。"}]},
          {id:18,value:[{id:1,value:"答：获得消费券方法有两种1、在活动期间下载注册百业惠盟APP或者爱之家商城购买99或520消费券后，立即获得99元送300元消费券和365送1200元消费券；2、推荐人或上级赠予的消费券；3、参与活动赢取的平台消费券；4、购买指定商品返赠一部分金额的消费券；5、别人微信赠予或者抢红包所获得的消费券； 6、平台赠予的消费券；"}]},
          // {id:19,value:[{id:1,value:"答：代金券目前只能在爱之家商城中当现金使用，在兑换完毕后，可以点击去商城，并且下载爱之家APP，登录后在爱之家的	“我的”——“我的优惠券”功能中我的卡包就能看到代金券了。"}]},
          {id:20,value:[{id:1,value:"答：消费券只要在百业惠盟注册惠盟用户后，判别原来爱之家非任何级别的经销商后，就会同步到爱之家商城中去，可以在百业惠盟，在底部菜单选择“我的”，里面有个惠盟用户福利，点击下面的优惠专场就可以到爱之家百业专场了，专场中的产品可以使用消费券的。并且也可以下载爱之家商城APP，登录后点击底部“我的”也能看到消费券的数额。"}]},
          {id:21,value:[
            {id:1,value:"答：(1)、登录百业惠盟后在底部菜单栏点击“我的”，点击惠盟用户福利中的“优惠专区”，就可以跳转到爱之家的百业惠专场；"},
            {id:2,value:"(2)、在爱之家商城百业专场选择好购买的商品后，在结算的时候点击使用消费券，即可抵扣商品的10%费用，看到抵扣金额已减，点击支付即可；"},
             {id:12,value:"(3)获得消费券的百业惠盟VIP用户，在爱之家商城的百业惠盟专区选择好商品后，在确定支付的时候可以看到实际支付金额上面会多出一行消费券抵扣信息，这里根据不同角色进行相应的抵扣实际支付费用，惠盟VIP和超级会员角色可以抵扣支付额的10%，任何角色运营商可以抵扣5%。"},
            {id:3,value:"(4)、消费券只能在爱之家的百业专场内的商品支付中使用，其它区域无法使用消费券；"},
            {id:4,value:"(5)、消费券有效期为一年，从百业惠盟购卡成功后开始计算；"},
            {id:5,value:"(6)、如果在百业惠盟升级为任何级别的运营商或者爱之家从VIP、代理商升级为任何级别的经销商，会把未用完的消费券全部清空；"},
            {id:6,value:"(7)、消费券不能和其它优惠同时使用；"},
            {id:7,value:"(8)、消费券若出现消费金额不足10%的时候，可以抵扣剩余部分，其它可以用现金补充支付；"},
            {id:8,value:"(9)、消费券可以循环使用，每次只能抵扣百业专场单次支付商品总价的10%，用不完下次可以继续使用；"},
            {id:9,value:"(10)、消费券不可抵扣运费；"},
            {id:10,value:"(11)、消费券不可取现；"},
            {id:11,value:"(12)、消费券使用规则最终解释权归广州华项科技有限公司所有。"},
             
          ]},
          {id:22,value:[
            {id:1,value:"答：(1)、只要是百业惠盟、爱之家平台的任何角色用户都可以使用，只要在任何渠道获得的消费券都可以在爱之家商城中百业专场消费抵扣。"}]},
            {id:23,value:[
            {id:1,value:"答：(1).答：1、平台或者参与活动赠予的消费券有效期自获得后一年内有效；2、推荐人或上级赠予的消费券根据则赠予人自身的消费券有效期或设置而定，最大不超过赠予人消费券有效期时限；3、购买指定商品返赠的有效期根据平台设置而定；4、活动期内部分角色暂时不设有效期；。"}]},
                {id:24,value:[
                {id:1,value:"答：(1).答：1、消费券只能在爱之家商城百业专区根据角色抵扣相应支付金额；2、消费券不能兑换现金；3、消费券可以赠予他人，但平台所赠予的消费券有赠送限制，根据角色最大只能赠送一半，部分角色不能赠予他人，但别人赠予的消费券可无条件转赠；4、赠予角色只能是百业惠盟用户或者是爱之家用户；5、此消费券活动解析权归广州华磐网络科技有限公司所有；。"}]},
   
        ]
      }
    };
  },
  mounted() {
    $("li p:eq(10)").css({ height: "50px", "line-height": "25px" });
  },
  methods: {
    show: function(i) {
      this.index = i;
      this.isShow = !this.isShow;
    },
    goBack() {
      this.$router.go(-1);
    },
    closefn(e) {
      $(".searhed input").focus();
      this.search = "";
      var oP = document.getElementsByClassName("title");
      for (let i = 0; i < oP.length; i++) {
        var content = oP[i];
        var item = content.getElementsByTagName("span");
        for (let i = 0; i < item.length; i++) {
          if (item[i].length == 0) {
            return false;
          } else {
            item[i].style.background = "none";
          }
        }
      }
    },
  
    oninput(e) {
      var oP = document.getElementsByClassName("title");
      // var oP = document.getElementsByClassName("content");
      // var oP = document.getElementsByClassName("container");
      var str = e.target.value;
      if (str) {
        setTimeout(() => {
          for (let i = 0; i < oP.length; i++) {
            var content = oP[i];
            content.innerHTML = content.innerHTML
              .split(str)
              .join('<span style="background:yellow;">' + str + "</span>");
          }
        }, 1000);
      } else {
        setTimeout(() => {
          for (let k = 0; k < oP.length; k++) {
            let el = oP[k].innerHTML;
            var s = el.match(/[\u4e00-\u9fa5]/g).join("");
            oP[k].innerHTML = s;
          }
        }, 1000);
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
}
.container ul {
  width: 100%;
}
.container li {
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  padding: 0 0.4444rem;
  background: #fff;
}
.container li:last-child {
  margin-bottom: 20px;
}
.container li:nth-child(3n + 0) {
  margin-bottom: 15px;
}
.container li p.title {
  width: 90%;
  font-size: 0.6rem /* 28/45 */;
  color: #000;
  height: 1.6667rem /* 75/45 */;
  line-height: 1.6667rem;
}
.container li p {
  float: left;
}
.container li .arrowR {
  color: #000;
  float: right;
  margin-top: 12px;
  font-size: .7rem;
}
.container li p.active {
  color: #f00;
}
.container li .content {
  background-color: #f8f4f4b0;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  font-size: 0.6222rem /* 28/45 */;
  line-height: 20px;
  display: none;
  float: left;
}
.container li div.active {
  display: block;
  width: 100%;
}
.CommonProblem {
  background: #f5f5f5;
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image: url("../../../assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: -15px;
}
.CommonProblem .head >>> .mint-header {
  background: transparent;
  border-bottom: none;
}
.CommonProblem >>> .el-collapse-item__header {
  padding-left: 0.4444rem /* 20/45 */;
}
.CommonProblem >>> .el-collapse-item__content {
  padding: 0 0.4444rem /* 20/45 */;
}
.CommonProblem .searhed {
  width: 80%;
  height: 1.3333rem /* 60/45 */;
  margin: 0.33rem auto 2.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.CommonProblem .ProblemTitle {
  font-size: 0.7111rem /* 32/45 */;
  padding: 0.4444rem /* 20/45 */;
}
.CommonProblem .searhed input {
  display: block;
  height: 100%;
  width: 100%;
  font-size: 0.6222rem;
}
.CommonProblem .searhed ::-webkit-input-placeholder {
  text-align: center;
  font-size: 0.6222rem /* 28/45 */;
  color: #000;
}

.CommonProblem .searhed i {
  display: block;
  color: #000;
  font-size: 14px;
  padding-right: 5px;
}
</style>
