<template>
  <div class="mainbox">
    <div class="logo"><img src="@/assets/images/loging.png" @click="$router.push({path:'/'})"></div>
    <div class="formbox">
      <div class="form-item">
        <label>手机号</label>
        <div class="form-input">
          <div class="inputed">
            <input type="text" placeholder="输入手机号码" v-model="userPhone" @keyup="phone">
          </div>
        </div>
      </div>
      <div class="form-item">
        <label>验证码</label>
        <div class="form-input">
          <div class="inputed"><input type="text" placeholder="输入验证码" v-model="codeModel"></div>
          <i v-if="code==1" class="code01" @click="codeToast">获取验证码</i>
          <i v-if="code==2" class="code02" @click="codeGet">获取验证码</i>
          <i v-if="code==3" class="code03">{{ captlist+'s后重新获取' }}</i>
        </div>
      </div>
   
      <div class="form-item" >
        <!-- <span class="xieyi"><i class="el-icon-circle-check icheck"></i>阅读并同意《用户协议》</span> -->
        <span class="xieyi" @click="toggle"><i class="el-icon-circle-check" :class="{icheck:check}"></i>阅读并同意《用户协议》</span>
      </div>
      <div class="form-item">
        <div class="sub" :class="subhse" @click="submit">立即绑定</div>
      </div>
    </div>
    <!-- 用户协议 -->
    <img id="preview" style="display: none" :src="contractUrl" preview preview-text="用户协议">
  </div>
</template>

<script>
import regular from "@/assets/js/regular";
export default {
  name: "bindTel",
  data() {
    return {
      code: 1,
      eyes: "close",
      check: false,
      pwModel: "",
      userPhone: "",
      codeModel: "",
      captlist: 89,
      contractUrl: require("@/assets/images/contract/user_agreement.png") //用户协议
    };
  },
  computed: {
    // 按钮灰色转态
    subhse() {
      return {
        subhse:
          this.userPhone == "" || this.codeModel == "" || this.check == false
      };
    }
  },
  mounted() {},
  methods: {
    submit() {
      let that = this;
      if (this.userPhone == "" || this.codeModel == "" || this.check == false)
        return false;
      let post = {
        mobile: this.userPhone,
        mobile_code: this.codeModel
      };
      axios({
        url: this.Api + "/auth/bindMobile",
        method: "post",
        data: qs.stringify(post),
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token2")
        }
      }).then(res => {
        let data = res.data;
        if (data.code == 0) {
           
            that.$cookie.set("userPhone", data.mobile);
            that.$cookie.set("token", data.token);
            that.$cookie.set("isActive", data.isActive);
            that.$cookie.set("card", data.card_no);
            that.$cookie.set("isPartner", data.isPartner);
            that.$cookie.set("level_id", data.level_id);
            that.$cookie.set("seq", data.seq);
            that.$cookie.set("superiorLevel", data.superiorLevel);
            that.$cookie.set("userid", data.userId);
          setTimeout(function() {
          
            that.toasfn("绑定成功");
             that.$router.push({ name: "index" })
          }, 1000);
         
        } else {
          that.toasfn(res.data.msg || res.data.errmsg);
        }
      });
    },
    // 显示隐藏密码
    passwordEye() {
      switch (this.eyes) {
        case "close":
          this.eyes = "open";
          break;
        default:
          this.eyes = "close";
          break;
      }
    },
    toggle() {
      this.check = !this.check;
      if (this.check) {
        document.getElementById("preview").click();
      }
    },
    // 输入电话是否成立
    phone() {
      let that = this;
      let exp = regular.RegPhone;
      if (exp.test(that.userPhone)) {
        that.code = 2;
      } else {
        that.code = 1;
      }
    },
    // 弹出提示电话错误
    codeToast() {
      Toast("输入的手机号码格式错误！");
    },
    // 点击获取手机验证码，并且提示验证码过期时间
    // this.Api + '/shopper/sendcode?mobile='+this.userPhone
    codeGet() {
      let that = this;
      let params = {
        mobile:this.userPhone,
        types:1
      }
      that.code = 3;
      var timer = setInterval(function() {
        that.captlist--;
        if (that.captlist == 87) {
          axios.post(that.Api + 'shopper/sendcodeToLogin', qs.stringify(params))
            .then(res => {
              let data = res.data;
            });
        }
        if (that.captlist == 0) {
          that.captbtn = false;
          that.captlist = 89;
          that.code = 2;
          clearInterval(timer);
        }
      }, 1000);
      // axios.post(this.Api + '/shopper/sendcode',qs.stringify(params)).then(res => {
      //   let data = res.data;
      //     this.code = 3;
      //     var timer = setInterval(function(){
      //       that.captlist--;
      //       if(that.captlist == 0){
      //         that.captbtn = false;
      //         that.captlist = 59;
      //         that.code = 2;
      //         clearInterval(timer);
      //       };
      //     },1000);
      // });
    },
    toasfn(msg) {
      Toast({
        message: msg,
        position: "bottom",
        duration: 2000
      });
    }
  }
};
</script>

<style scoped>
@import "../assets/fonts/password/style.css";
.mainbox {
  overflow: hidden;
}
.logo {
  overflow: hidden;
  text-align: center;
  padding: 2rem 0;
}
.logo img {
  width: 48%;
  max-width: 325px;
}
.formbox {
  overflow: hidden;
  padding: 0 2rem;
  font-size: 0.7rem;
  color: #989898;
}
.formbox .form-item {
  overflow: hidden;
  margin-bottom: 0.8rem;
}
.formbox .form-item label {
  display: block;
  width: 100%;
  line-height: 1.2rem;
}
.formbox .form-item .form-input {
  display: flex;
  width: 100%;
  height: 1.8rem;
  line-height: 1.2rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid #666;
}
.formbox .form-item .inputed {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
.formbox .form-item .inputed input {
  width: 100%;
  font-size: 0.65rem;
}
.formbox .form-item .code01 {
  margin-left: 0.4rem;
  font-size: 0.6rem;
  color: #888;
  border: 1px solid #989898;
  border-radius: 20rem;
  padding: 0 8px;
  line-height: 1.8em;
}
.formbox .form-item .code02 {
  margin-left: 0.4rem;
  font-size: 0.6rem;
  color: #ec0746;
  border: 1px solid #ff9f18;
  border-radius: 20rem;
  padding: 0 8px;
  line-height: 1.8em;
}
.formbox .form-item .code03 {
  margin-left: 0.4rem;
  font-size: 0.65rem;
  color: #ec0746;
}
.icolor {
  color: #ec0746;
}
.shpassword i {
  overflow: hidden;
  font-size: 1.2rem;
}
.xieyi {
  float: left;
  font-size: 0.6rem;
}
.xieyi .icheck {
  color: #ec0746;
}
.xieyi i {
  font-size: 0.65rem;
  padding-right: 0.1rem;
}
.form-item .sub {
  display: block;
  text-align: center;
  color: white;
  padding: 0.4rem 0;
  width: 70%;
  font-size: 0.7rem;
  line-height: 1.6em;
  background: #ff8f28;
  border-radius: 20rem;
  margin: 0.5rem auto;
}
.form-item .subhse {
  background: #c3c3c3;
}
</style>
