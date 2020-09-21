<template>
   <div class="EditAdvice">
     <!-- 头部 -->
    <div class="head">
      <topnav :topnav="topnav"></topnav>
    </div>
    <!-- 意见填写表单 -->
    <div class="adviceBox">
      <div class="line">
        <label for="name">姓名</label><input type="text" class="name" v-model="name" maxlength="15" onkeyup="this.value=this.value.replace(/\s+/g,'')">
      </div>
      <div class="line">
        <label for="card">卡号</label><input style="border:1px solid #ccc" type="text" class="card" v-model="card" readonly="readonly">
      </div>
      <div class="line">
        <label for="relat">手机号码</label><input type="text" class="relat" v-model="relat" maxlength="11" onkeyup="this.value=this.value.replace(/\s+/g,'')">
      </div>
      <div class="line">
        <label for="problem">问题</label><i id="more" style="color:red">(200字以内)</i>
        <textarea rows="8" cols="20" class="problem" v-model="problem"></textarea>
      </div>
      <div class="line">
        <label for="problem">上传图片</label><i id="more" style="color:red">(最多上传三张图片)</i>
      </div>
      <div class="shop">
        <template v-if="shopImg.length > 0">
          <imgUpload v-for="(item,index) in shopImg" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
        </template>
        <template v-if="shopImg.length == 0">
          <imgUpload @img-upload="shopImgChange" @click.native="shopImgfn(0)"></imgUpload>
        </template>
        <imgUpload :add="true" text="添加更多" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange" @click.native="shopImgAdd"></imgUpload>
      </div>
      <!-- <div class="line">
        <label for="problem">反馈</label>
        <textarea rows="8" cols="20" class="problem" v-model="advice"></textarea>
      </div> -->
    </div>
    <div class="btnBox">
      <button @click="submit">提交</button>
    </div>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "EditAdvice",
  data() {
    return {
      topnav:{
        title:'填写意见'
      },
      name: "",
      card: this.$cookie.get("card"),
      relat: this.$cookie.get("userPhone"),
      problem: "",
      advice: "", //公司反馈信息
      shopImg: [],
      imgUploadStopAdd:false,
      shopImgIndex:null,
      showupload3: true,
    };
  },
  mounted() {
    this.name =
      this.$cookie.get("nickname") == "null" ||
      this.$cookie.get("nickname") == ""
        ? ""
        : this.$cookie.get("nickname");
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    shopImgAdd(){
      if(this.shopImg.length >= 3){
        Toast('图片限制在3张以内！');
      }else{
        this.shopImgIndex = this.shopImg.length;
      }
    },
    shopImgChange(val){
      if(this.shopImgIndex == this.shopImg.length){
        this.shopImg.push(val.url)
        if(this.shopImg.length>=2) {
          this.showupload3 = false
        }
        if(this.shopImg.length >= 3){
          this.imgUploadStopAdd = true;
        }
      }else{
        if(val.url){
          this.shopImg[this.shopImgIndex] = val.url;
        }else{
          this.shopImg.splice(this.shopImgIndex,1)
          if(this.shopImg.length<2) {
             this.showupload3 = true
          }
          if(this.shopImg.length < 8){
            this.imgUploadStopAdd = false;
          }
        };
        this.shopImgIndex = null;
      };
    },
    submit() {
      // console.log(this.name.length);
      var RegPhone = /^1[3456789]\d{9}$/;
      var RegName=/^[\u4e00-\u9fa5a-z]+$/gi;
      this.name == null || this.name == "" || this.name.length>15 || this.name.length<1
        ? Toast("姓名请输入1~15位中文字符")
        :!RegName.test(this.name)?Toast('姓名请输入1~15位中文字符')
        : this.card == null || this.card == ""
          ? Toast("卡号不能空")
          : this.relat == null || this.relat == ""
            ? Toast("联系方式不能空")
            : !RegPhone.test(this.relat)
              ? Toast("手机号码格式错误")
              : this.problem == null || this.problem == ""
                ? Toast("问题不能空") : this.problem.length >200 ? Toast("反馈问题字数请限制在200字以内！")
                : axios({
                    url: this.Api + "/feedback/save",
                    method: "post",
                    data: {
                      "feedbackVo":{
                        userName: this.name,
                        mobile: this.relat,
                        content: this.problem
                      },
                      "imgUrls":this.shopImg
                    },
                    headers: {
                      "X-Nideshop-Token": this.$cookie.get("token")
                    }
                  }).then(res => {
                    if (res.data.errno == 0) {
                      let data = res.data;
                      Toast(data.data);
                      setTimeout(() => {
                        // this.$router.push({path:'/tools/Advice'})
                        this.$router.go(-1);
                      }, 1500);
                    } else {
                      Toast(res.data.errmsg);
                    }
                  });
    },
    shopImgfn(i){
      this.shopImgIndex = i;
      // console.log(this.shopImgIndex);
    },
  }
};
</script>

<style scoped>
.EditAdvice .head >>> .mint-header-title {
  font-size: 0.75rem;
}
.EditAdvice {
  position: relative;
  width: 100%;
  background: #fff;
  min-height: 100vh;
  margin-bottom: 30px;
  background-image: url("../../../assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: -50px;
}
/* 表单区 */
.EditAdvice .adviceBox {
  margin-top: 70px;
  width: 100%;
}
.EditAdvice .adviceBox .line {
  width: 90%;
  margin: 0 auto 10px;
}
/* 上传图片 */
.EditAdvice .adviceBox .line .upload{
  font-size: .6222rem /* 28/45 */;
  position: relative;
}
.EditAdvice .adviceBox .line #more{
  font-size: .5333rem /* 24/45 */;
}
.shop {
  display: flex;
  padding: .5556rem 1.3rem;
  flex-wrap: wrap;
  justify-content: space-between;
}
.EditAdvice .adviceBox .line label {
  font-size: 0.7111rem /* 32/45 */;
  display: inline-block;
  width: 21%;
  text-align-last: justify;
}
.EditAdvice .adviceBox .line input {
  width: 75%;
  height: 1.1111rem /* 50/45 */;
  font-size: 0.6222rem /* 28/45 */;
  margin-left: 0.4444rem;
  text-align: center;
  border: 1px solid #313131;
}
.EditAdvice .adviceBox .line .problem {
  width: 99%;
  border: 1px solid #313131;
  font-size: 0.6222rem /* 28/45 */;
  margin-top: 10px;
}
/* 底部按钮 */
.EditAdvice .btnBox button {
  background: hsl(27, 100%, 57%);
  outline: none;
  border: none;
  width: 100%;
  height: 1.7778rem /* 80/45 */;
  color: #fff;
  font-size: 0.7778rem /* 35/45 */;
  position: fixed;
  bottom: 0;
}
/* 头部 */
.EditAdvice .head >>> .mint-header {
  background: transparent;
  border-bottom: none;
}
.EditAdvice >>> .el-collapse-item__header {
  padding-left: 0.4444rem /* 20/45 */;
}
</style>
