<template>
  <div class="agent-application">
    <topnav :topnav="topnav"></topnav>
    <div class="application">
      <div class="application-from">
        <div class="title">申请人信息</div>
        <div class="name">
          <mt-field disableClear label='申请人姓名：' placeholder="请输入您的名字" type="text" v-model="name" ></mt-field>
        </div>
        <div class="tel">
          <mt-field disableClear label='申请人手机号：' placeholder="请输入手机号" type="tel" v-model="phone" @change="che(phone)" :attr="{maxlength:11}" ></mt-field>
        </div>
        <div class="invite-tel" v-if="showInvite">
          <mt-field disableClear label='推荐人手机号：' placeholder="" type="tel" v-model="inviteTel" readonly></mt-field>
        </div>
       <div class="cart-list provCity" @click="adressfn">
            <label v-if="!areadata">推广地区/详细地址:</label>
            <label v-else>
              <p>{{ areadata.prov.name }}</p>
              <p>{{ areadata.city.name }}</p>
              <p>{{ areadata.area.name }}</p>
              <!-- <p>{{ areadata.street.name }}</p> -->                                        
            </label>
            <p class="lmain adress">
              <span></span><i class="el-icon-arrow-right"></i>
            </p>
        </div>
        <div class="address">
          <textarea v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"></textarea>
        </div>
        
        <!-- <div class="mailbox">
          <mt-field disableClear label='邮箱：' type="email" v-model="email" ></mt-field>
        </div> -->
      </div>
    </div>
    <!-- <div class="pay-btn-box">
      <a href="javascript:?" class="pay-btn" @click="application">确定申请</a>
    </div> -->
     <div class="pay-btn-box">
          <el-button type="warning" @click.native="application">确定申请</el-button>
     </div>
    <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup>
  </div>
</template>

<script>
export default {
  name: "agentApplication",
  data() {
    return {
      topnav: {
        title: "申请资料"
      },
      name: "",
      phone: "",
      inviteTel: "",
      visible: false,
      areadata: null,
      level: null,
      address: null,
      cardNo: '',
      urlCode: '',
      showInvite: false,
      userid:this.$cookie.get('userid'),
      money: 398,
      promoter: '',
      cardType2: this.$route.query.cardType,
      cardNumber: this.$cookie.get('card'),
      isFake: "",
      type:'',
      
    };
  },


  methods: {
    che() {
      let cheOk = true;
      var r = this.phone.match(/^[0-9]*$/);
      if (r == null) {
        Toast({ message: "请输入正确格式的手机号！", position: "middle" });
        cheOk = false;
      }
      if (this.phone.length < 11) {
        Toast({ message: "请输入正确格式的手机号！", position: "middle" });
        cheOk = false;
      }
      return cheOk;
    },
    region(val) {
      this.areadata = val;
      console.log(val);
    },
    adressfn() {
     
      if(this.level>1) {
        MessageBox.alert('您此处选择地址是您运营的区域身份，一经确认申请则不能变更。请谨慎选择').then(action => {
          this.visible = true;
        });
      }else {
        this.visible = true;
      }
    },
    visiblefn(val) {
      this.visible = val;
    },
    // 检查信息
    cheContent() {
      let isOk = true;
      if (
        this.name == "" ||
        this.phone == "" ||
        this.areadata == null ||
        this.address == null
      ) {
        isOk = false;
      }
      return isOk;
    },
    // 推广申请
    application() {
   
   
      let that = this;
      let reg = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/gi;
      console.log(this.$cookie.get("userPhone"));
      if (that.name == "") {
        Toast({ message: "请输入名字", position: "middle" });
        return false;
      } else if (!that.che()) {
        Toast({ message: "请输入正确格式的手机号！", position: "middle" });
        return false;
      } else if (that.areadata == null) {
        Toast({ message: "请选择地区", position: "middle" });
        return false;
      } else if (that.address == null) {
        Toast({ message: "请填写详细地址", position: "middle" });
        return false;
      } else if (that.cardNo == that.$cookie.get('card')) {
        Toast({ message: "自己不能邀请自己", position: "middle" });
        return false;
      } else if (that.level < 1 || that.level > 5) {
        Toast({ message: "请重正确的链接进来", position: "middle" });
        return false;
      }
      // } else if (that.email == "") {
      //   Toast({ message: "请填写邮箱", position: "middle" });
      //   return false;
      // } else if (!reg.test(that.email)) {
      //   Toast({ message: "请填写正确的邮箱", position: "middle" });
      //   return false;
      // }
      // else if (that.phone != that.$cookie.get("userPhone")) {
      //   Toast({ message: "请输入注册的手机号", position: "middle" });
      //   return false;
      // }

      if(that.level==1) {
        // that.urlCode = 'user/memberRegister?cardNo='
        //去掉回车换行 
        let addressStr = that.address.replace(/[\r\n]/g,"")
        //去掉空格
        addressStr = addressStr.replace(/\ +/g,"");
        that.name = that.name.replace(/\ +/g,"");
        let postData = {}
        if(that.$route.query.cardType == undefined) {
          postData = {
            
            nickname: that.name,
            mobile: that.phone,
            province: that.areadata.prov.name,
            city: that.areadata.city.name,
            county: that.areadata.area.name,
            // street: that.areadata.street.name,
            address: addressStr,
            // email: that.email,
            levelId: that.level,
            cardType: 1,
            inviter: that.cardNo,
            isFake: that.isFake
          }
        }else {
          postData =  {
            nickname: that.name,
            mobile: that.phone,
            province: that.areadata.prov.name,
            city: that.areadata.city.name,
            county: that.areadata.area.name,
            // street: that.areadata.street.name,
            address: addressStr,
            // email: that.email,
            levelId: that.level,
            cardType: that.$route.query.cardType,
            inviter: that.cardNo,
            isFake: that.isFake
          }
        }
        console.log(postData, '55')
        // console.log(postData,'48')
        // return false
        axios({
          method: "post",
          // url: "http://192.168.1.140:8080/api/"+ "user/memberRegister?cardNo=" + that.cardNo,
          url: this.Api + "user/memberRegister?cardNo=" + that.cardNo,
          headers: { "X-Nideshop-Token": that.$cookie.get("token") },
          data: postData
        }).then(res => {
            console.log(res,'65');
            
            if (res.data.code == 0) {
              if (res.data.msg) {
                Toast({ message: res.data.msg, position: "middle" });
                
                linkto();
              } else {
                if (that.cardNo == '') {
                  // Toast({ message: "您的申请已经递交，请保持电话畅通，我们将尽快联系您。谢谢！", position: "middle" });
                  let data = res.data.userVo
                  // let expire = new Number(this.$cookie.get('expire')); 
                  // expire = expire/(60*60)+'h'; // 设置过期时间

                  that.$cookie.set('level_id', data.levelId);
                  that.$cookie.set('cardType', data.cardType);
                  that.$cookie.set('province', data.province);
                  that.$cookie.set('city', data.city);
                  that.$cookie.set('county', data.county);
                  that.$cookie.set('address', data.address);
                  that.$cookie.set('isFake', data.isFake);
                  that.$cookie.set('isActive', data.isActive);
                  that.$cookie.set('vip_time', data.expireTime);     // 用户过期时间 
                  MessageBox.alert('您的申请已经递交，请保持电话畅通，我们将尽快联系您。谢谢！').then(action => {
                  
                    linkto();
                  });
                } else {
                  Toast({ message: "申请提交成功", position: "middle" });
                  
                  linkto();
                  let data = res.data.userVo;
                  // let expire = new Number(this.$cookie.get('expire')); 
                  // expire = expire/(60*60)+'h'; // 设置过期时间

                  that.$cookie.set('level_id', data.levelId);
                  that.$cookie.set('cardType', data.cardType);
                  that.$cookie.set('province', data.province);
                  that.$cookie.set('city', data.city);
                  that.$cookie.set('county', data.county);
                  that.$cookie.set('address', data.address);
                  that.$cookie.set('isFake', data.isFake);
                  that.$cookie.set('isActive', data.isActive);
                  that.$cookie.set('vip_time', data.expireTime);     // 用户过期时间
                  
                  
                  
                }
              }
            }else if (res.data.code == 500) {
              Toast({ message: res.data.msg, position: "middle" });
              // linkto()
              that.$router.push({name: 'MineIndex'})
            }
            function linkto(){
              let isActive = that.$cookie.get('isActive');
              let isFake = that.$cookie.get('isFake');
              let cardType = that.$cookie.get('cardType');
              console.log(isActive,isFake,cardType,'5',that.type)
              if(isActive == 1&&cardType!=4){
                that.$router.push({path: 'toBecomeMember', query:{card: that.cardNo, level:
                that.level,cardType:1}})
              }else if(isActive == 1&& that.type==4){
                that.$router.push({path:'/upgrading', query:{card: that.cardNo, level:
                that.level }})
              } else  if(isActive ==0 && isFake == 0){
                  
                that.$router.push({path: 'toBecomeMember', query:{card: that.cardNo, level:
                that.level,cardType:4}})
              }else {
                    that.$router.push({path: 'toBecomeMember', query:{card: that.cardNo, level:
                    that.level,cardType:1}})
            
              }
            }
          }).catch(error => {
            return error;
          });
      }else {
        // that.urlCode = 'agency/save?cardNo='
        //去掉回车换行 
        let addressStr = that.address.replace(/[\r\n]/g,"")
        //去掉空格
        addressStr = addressStr.replace(/\ +/g,"");
        that.name = that.name.replace(/\ +/g,"");
        axios({
          method: "post",
          // url: "http://192.168.1.140:8080/api/"+ "agency/save?cardNo=" + that.cardNo,
          url: that.Api + "agency/save?cardNo=" + that.cardNo,
          headers: { "X-Nideshop-Token": that.$cookie.get("token") },
          data: {
            contact: that.name,
            contactTel: that.phone,
            province: that.areadata.prov.name,
            city: that.areadata.city.name,
            county: that.areadata.area.name,
            // street: that.areadata.street.name,
            address: addressStr,
            // email: that.email,
            level: that.level,
            // cardType: that.cardType,
            inviter: that.cardNo,
            isFake: that.isFake
          }
        }).then(res => {
          console.log(res);
          
          if (res.data.code == 0) {
            if (res.data.msg) {
              Toast({ message: res.data.msg, position: "middle" });
              linkto();
            } else {
              if (that.cardNo == '') {
                // Toast({ message: "您的申请已经递交，请保持电话畅通，我们将尽快联系您。谢谢！", position: "middle" });
                let data = res.data.userVo
                // let expire = new Number(this.$cookie.get('expire')); 
                // expire = expire/(60*60)+'h'; // 设置过期时间

                that.$cookie.set('level_id', data.levelId);
                that.$cookie.set('cardType', data.cardType);
                that.$cookie.set('province', data.province);
                that.$cookie.set('city', data.city);
                that.$cookie.set('county', data.county);
                that.$cookie.set('address', data.address);
                that.$cookie.set('isFake', data.isFake);
                that.$cookie.set('isActive', data.isActive);
                that.$cookie.set('vip_time', data.expireTime);     // 用户过期时间
                MessageBox.alert('您的申请已经递交，请保持电话畅通，我们将尽快联系您。谢谢！').then(action => {
                  linkto();
                });
              } else {
                // Toast({ message: "申请提交成功", position: "middle" });
                linkto();
                let data = res.data.userVo;
                // let expire = new Number(this.$cookie.get('expire')); 
                // expire = expire/(60*60)+'h'; // 设置过期时间

                that.$cookie.set('level_id', data.levelId);
                that.$cookie.set('cardType', data.cardType);
                that.$cookie.set('province', data.province);
                that.$cookie.set('city', data.city);
                that.$cookie.set('county', data.county);
                that.$cookie.set('address', data.address);
                that.$cookie.set('isFake', data.isFake);
                that.$cookie.set('isActive', data.isActive);
                that.$cookie.set('vip_time', data.expireTime);     // 用户过期时间
                
              }
            }
          }else if (res.data.code == 500) {
            Toast({ message: res.data.msg, position: "middle" });
            // linkto()
            that.$router.push({name: 'index'})
          }
          function linkto(){
            let isActive = that.$cookie.get('isActive');
            let isFake = that.$cookie.get('isFake');
            if(isActive == 1){
             
              that.$router.push({path: 'becomeMember', query:{card: that.cardNo, level: that.level}})
            }else if(isActive ==0 && isFake == 0){
              that.$router.push({path: 'becomeMember', query:{card: that.cardNo, level: that.level}})
              
            }else {
              that.$router.push({path: 'becomeMember', query:{card: that.cardNo, level: that.level}})

              
            }
          }
        }).catch(error => {
          return error;
        });
      }
      
      
    },
    getLevel() {
      let that = this
      this.level = Math.abs(Math.floor(this.$route.query.level));
      if(this.$route.query.code == 0 ) {
        this.cardNo = '';
        // MessageBox.alert('目前尚未自己成为推广商功能').then(action => {
        //   that.$router.push({name: 'index'})
        // });
        // || that.cardNo == that.$cookie.get('card')
      }else {
        this.cardNo = this.$route.query.code;
        // console.log(that.cardNo)
        that.showInvite = true;
        // let reg =  /^(\d{8})?$/;
        // if(reg.test(that.cardNo)) {
        //   console.log(111)
        // }
        axios({
          method:'post',
          url: that.Api +'user/queryByCardNo?cardNo=' + that.cardNo,
        }).then(res => {
          console.log(res)
          that.inviteTel = res.data.mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
          // console.log(that.inviteTel)
        })
      }

      switch(that.level) {
        case 5:
          that.topnav.title = '省运营商申请资料'
          that.promoter = "省运营商"
          break;
        case 4:
          that.topnav.title = '市运营商申请资料'
          that.promoter = "市运营商"
          break;
        case 3:
          that.topnav.title = '县运营商申请资料'
          that.promoter = "县运营商"
          break;
        case 2:
          that.topnav.title = '运营商申请资料'
          that.promoter = "运营商"
          break;
        case 1:
          that.topnav.title = '用户申请资料'
          that.promoter = "惠盟用户"
          break;
      }
      
      // if(this.$route.query.cardType != null) {
      //   that.cardType = this.$route.query.cardType
      // }
      console.log(this.level,this.cardNo);
    },
    //判断邀请人是不是推广商
    dealer() {
        let that = this
        console.log(that.$cookie.get('superiorLevel'))
        if (that.$cookie.get('superiorLevel') == 2 && that.$route.query.level == 2) {
            MessageBox.alert('您的邀请人是运营商您不能成为运营商').then(action => {
              that.$router.push({path: '/'})
            });
        }
    },
    //初始化申请人数据
    initialization() {
      this.phone = this.$cookie.get("userPhone")
      
      if(this.$cookie.get("nickname") != 'null') {
        this.name = this.$cookie.get("nickname");
      }else if(this.$cookie.get("realName") != 'null') {
        this.name = this.$cookie.get("realName");
      }else {
        this.name = "";
      }
      if(this.$cookie.get("province") && this.$cookie.get("province") != 'null') {
        console.log(this.$cookie.get("province"))
        this.areadata = {}
        this.areadata['prov'] = {}
        this.areadata['prov'].name = this.$cookie.get("province");
      }
      if(this.$cookie.get("city") && this.$cookie.get("city") != 'null') {
        this.areadata['city'] = {}
        this.areadata['city'].name = this.$cookie.get("city")
      }
      if(this.$cookie.get("county") && this.$cookie.get("county") != 'null') {
        this.areadata['area'] = {}
        this.areadata['area'].name = this.$cookie.get("county")
      }
      if(this.$cookie.get("address") && this.$cookie.get("address") != 'null') {
        this.address = this.$cookie.get("address")
      }
    },
    //判断是否购卡，跳转到购卡页
    goBuyCard() {
      let that = this
      //是否体验用户
      if(that.$route.query.cardType >= 6) {
        axios({
          method: 'get',
          url: this.Api + "user/queryByUserId?id=" + that.userid
        }).then(res => {
          console.log(res)
          if(res.data.code == 0) {
            that.isFake = 1
          }else if(res.data.code == 1) {
             MessageBox({
              title: '温馨提示',
              message: '您已享受过百业惠盟免费体验机会，点击“购买年卡”享受更多优惠吧',
              showCancelButton: true,
              confirmButtonText: '购买年卡',
              closeOnClickModal: false
            }).then(action => {
              if(action ==='confirm'){
                this.$router.push({path: '/selectionCard',query: {cardType: 1}})
              }else{
                this.$router.push({path: '/'});
              }
            });
          }
        })
      }
      
    },
    
  },
  created() {
    this.getLevel();
    this.goBuyCard()
    this.dealer()
    this.initialization()
    var cardType8 =this.$cookie.get('cardType');
    this.type = cardType8;
    // console.log(cardType8, '55',this.type)
  },
  mounted() {

  }
};
</script>

<style scoped>
.agent-application {
  background-color: #f2f2f2;
  min-height: 100vh;
}
.application {
  padding: 0.833333rem 0.625rem 0 0.625rem;
}
.application-from {
  background-color: #ffffff;
}
.application-from .title {
  background-color: #ffe9c9;
  color: #ec0746;
  font-size: 0.666667rem;
  padding: 10px;
  border-radius: 0.208333rem 0.208333rem 0 0;
}
.agent-application >>> .mint-cell-wrapper {
  border-bottom: 1px solid #eeeeee;
  background-image:none;
}
.agent-application >>> .mint-field .mint-cell-title {
  width: 116px;
}
.agent-application >>> .mint-cell-text {
  font-size: 14px;
  color: #333333;
}
.agent-application >>> .mint-field .mint-cell-value {
  font-size: 13px;
}
.cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.7rem 10px;
  font-size: 14px;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-list label {
  float: left;
  width: 7.5em;
  color: #333;
}
.cart-list p.lmain {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: calc(100% - 7.7em);
  color: #333;
}
.cart-list p.adress span {
  display: block;
  flex: 1;
  height: 1.4em;
  word-break: break-all;
}
.cart-list p.adress i {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-list input {
  display: block;
  flex: 1;
  font-size: 0.7rem;
  color: #333;
  word-break: break-all;
}
.address {
  border-bottom: 1px solid #eeeeee;
}
.address textarea {
  width: 100%;
  padding: 5px 10px;
}
.pay-btn-box {
  padding: 1.458333rem 0;
  text-align: center;
  cursor: pointer;
}
.el-button--warning{
     padding: 1px 1px;
    cursor: pointer;
    display: inline-block;
    width: 8.375rem;
    height: 1.666667rem;
    border-radius: 0.833333rem;
    line-height: 1.66667rem;
    border-color:#ff9500;
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
    font-size: 0.625rem;
    letter-spacing: 2px;

}
.pay-btn {  
  cursor: pointer;
  display: inline-block;
  width: 9.375rem;
  height: 1.666667rem;
  border-radius: 0.833333rem;
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
  font-size: 0.625rem;
  letter-spacing: 2px;
}
.provCity label, .provCity p.lmain{
  width:auto;
}

</style>
