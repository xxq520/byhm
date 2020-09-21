<template>
  <div class="agent-application">
         <div class="top">
             <i class="el-icon-arrow-left" @click="goback"></i>
             <span>{{topnav.title}}</span>
         </div>
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
    <div class="pay-btn-box">
      <div class="pay-btn" @click="application">确定申请</div>
    </div>
    <!-- 惠盟弹窗 -->
   
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
      cardNo: this.$cookie.get('card'),
      showInvite: false,
      userid: this.$cookie.get('userid'),
      postInviteTel: '',
      isActive: this.$cookie.get('isActive'),
      initlevel: this.$cookie.get('level_id'),
      levelid2:''
    
    };
  },
   created() {
   this.initialization();
   this.getInviteInfo();
  
   },
  watch:{
    areadata(val){
      
    }
  },
  mounted(){
         axios.post(this.Api +'user/queryByUid?uid='+this.userid).then(res => {
         this.levelid2=res.data.levelId
           if(this.levelid2>this.initlevel){
           Toast('您已升级当前等级，请重新登录刷新级别')
           }
         })
  },

  methods: {
               goback() {

               if (this.$route.query.platform == 'android') {
               window.action.backAPP();
               } else if (this.$route.query.platform == 'ios') {
               window.action.backAPPiOS();
               } else {
                 window.history.go(-1)
              //  this.$router.back()
               }

               },
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
      this.visible = true;
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
      }

      axios({
          method:'get',
          url: that.Api +'order/isPayStatus?userId='+ that.userid,
      }).then(responseData => {
          // console.log(responseData ,'854')
          if(responseData.data.errno == 0) {
              // console.log(responseData.data.data )
              if(responseData.data.data.isPayStatus == 1) {
                // that.$router.push({name: 'order'})
                that.$router.push({name: 'myOrder'})
              }else if(responseData.data.data.isPayStatus == 0) {
                //非链接非伙伴升级
                if(that.$route.query.code == undefined) {
                  //去掉回车换行 
                  let addressStr = that.address.replace(/[\r\n]/g,"")
                  //去掉空格
                  addressStr = addressStr.replace(/\ +/g,"");
                  that.name = that.name.replace(/\ +/g,"");
                   let levelID = parseInt(that.$cookie.get('level_id')) + 1
                  let postData = {
                  
                    "province": that.areadata.prov.name,
                    "city": that.areadata.city.name,
                    "county": that.areadata.area.name,
                    "address": addressStr,
                    "contact": that.name,
                    "contactTel": that.phone,
                    "inviteMobile":that.postInviteTel,
                    "level": levelID
                  }
                 
                  axios({
                      method: "post",
                      url: that.Api + "agency/update",
                      headers: { "X-Nideshop-Token": that.$cookie.get("token") },
                      data: postData
                  }).then(res => {
                      console.log(res)
                      let levelID = parseInt(that.$cookie.get('level_id')) + 1
                      console.log(levelID)
                      if(res.data.code == 0) {
                        console.log('生成订单')
                        axios({
                          method:'post',
                          url: that.Api + 'order/accountSubmits?userId='+ that.userid + '&levelId='+ levelID,
                        }).then(resData => {
                          console.log(resData)
                          
                          if(resData.data.errno == 0) {
                            let orderData = resData.data.data.orderVoList
                            if(orderData.length == 1) {
                              that.$router.push({ name: "cashRegister", query: {money: orderData[0].order_price, name: orderData[0].remark, code: orderData[0].order_sn } });
                            }else if(orderData.length > 1) {
                              that.$router.push({ name: "seperateCashRegister", query: {money: resData.data.data.totalPayment, name: orderData[0].remark, code: resData.data.data.totalOrderSn } });
                            }
                          }else {
                            Toast(resData.data.errmsg)
                          }
                          
                          // setTimeout(function(){
                          //   this.subClick = false;
                          //   that.$router.push({ name: "cashRegister", query: {money: that.price.money, name: that.price.name, code: post.data } });
                          // },2000);
                        })
                      }else if(res.data.code == 500) {
                        MessageBox({
                          title: '温馨提示11',
                          message: res.data.msg,
                        });   
                      }
                  })
                }else {
                  //链接非伙伴升级
                  let levelID = that.$route.query.level
                  //去掉回车换行 
                  let addressStr = that.address.replace(/[\r\n]/g,"")
                  //去掉空格
                  
                  addressStr = addressStr.replace(/\ +/g,"");
                  that.name = that.name.replace(/\ +/g,"");
                  let postData = {
                    "cardNo":that.$route.query.code,
                    "province": that.areadata.prov.name,
                    "city": that.areadata.city.name,
                    "county": that.areadata.area.name,
                    "address": addressStr,
                    "contact": that.name,
                    "contactTel": that.phone,
                    "inviteMobile":that.postInviteTel,
                    "level": levelID
                  }
                
                
                  axios({
                      method: "post",
                      url: that.Api + "agency/update",
                      headers: { "X-Nideshop-Token": that.$cookie.get("token") },
                      data:postData,
                  }).then(res => {
                     
                      if(res.data.code == 0) {
                        console.log('生成订单' )
                        if(that.isActive == 0) {
                          that.$router.push({ name: "confirmOrder", query: {level: levelID}});
                        }else if(that.isActive == 1) {
                          axios({
                            method:'post',
                            url: that.Api + 'order/accountSubmits?userId='+ that.userid + '&levelId='+ levelID,
                          }).then(resData => {
                            console.log(resData)
                            if(resData.data.errno == 0) {
                              let orderData = resData.data.data.orderVoList
                              if(orderData.length == 1) {
                                that.$router.push({ name: "cashRegister", query: {money: orderData[0].order_price, name: orderData[0].remark, code: orderData[0].order_sn } });
                              }else if(orderData.length > 1) {
                                that.$router.push({ name: "seperateCashRegister", query: {money: resData.data.data.totalPayment, name: orderData[0].remark, code: resData.data.data.totalOrderSn } });
                              }
                            }else {
                              Toast(resData.data.errmsg)
                            }
                          })
                        }
                        
                      }else if(res.data.code == 500) {
                        console.log(res.data)
                        MessageBox({
                          title: '温馨提示',
                          message: res.data.msg,
                        });   
                      }
                  })
                }
              }
          }else {
              // Toast({ message: res.data.errmsg, position: "middle" });
          }
      })
      
      
      
      
        
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
    //获取邀请人信息
    getInviteInfo() {
      let that = this
      if(that.$route.query.code == undefined) {
        axios({
          method:'post',
          url: that.Api +'user/queryByCardNo?cardNo=' + that.cardNo,
        }).then(res => {
          console.log(res)
          // that.inviteTel = res.data.mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
          // console.log(that.inviteTel)
          let inviteId = res.data.inviter
          if(inviteId != 0) {
            that.showInvite = true
          }
          axios({
            method:'post',
            url: that.Api +'user/queryByUid?uid=' + inviteId,
          }).then(reponse => {
            console.log(reponse)
            that.inviteTel = reponse.data.mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
            that.postInviteTel = reponse.data.mobile
          })
        })
      }else {
        let cardNo = that.$route.query.code
        axios({
          method:'post',
          url: that.Api +'user/queryByCardNo?cardNo=' + cardNo,
        }).then(res => {
          console.log(res)
          that.showInvite = true
          that.inviteTel = res.data.mobile.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
          that.postInviteTel = res.data.mobile
        })
      }
      
    }
   
  },
 

};
</script>

<style scoped>
    .top{
    width: 100%;
    height: 40px;
    background-color: #ff911e;
    color:#fff;
    display: flex;
    line-height: 40px;
    text-align: center;
    }
    .top i{
    flex: 1;
    line-height: 40px !important;
    font-size: 20px !important;
    }
    .top span {
    flex: 9;
    font-size: 18px;
    text-indent: -50px;
    }
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
}
.pay-btn {
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
