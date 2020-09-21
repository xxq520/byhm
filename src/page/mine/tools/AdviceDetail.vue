<template>
   <div class="AdviceDetail">
     <!-- 头部 -->
    <div class="head">
      <topnav :topnav="topnav"></topnav>
    </div>
    <!-- 意见填写表单 -->
    <div class="adviceBox">
      <div class="line">
        <label for="name">姓名</label><input type="text" class="name grey" v-model="name"  readonly="readonly">
      </div>
      <div class="line">
        <label for="card">卡号</label><input type="text" class="card grey" v-model="card" readonly="readonly">
      </div>
      <div class="line">
        <label for="relat">手机号码</label><input type="text" class="relat grey" v-model="relat" readonly="readonly">
      </div>
      <div class="line">
        <label for="problem">问题</label>
        <textarea rows="8" cols="20" class="problem grey" v-model="problem" readonly="readonly"></textarea>
      </div>
      <div class="line">
        <label for="problem">图片信息</label>
        <div class="imgBox" v-for="(t,i) in images" :key="i">
          <img :src='t' alt="">
        </div>
        <span class="noImages" v-if="images.length == 0">用户暂未上传反馈图片</span>
      </div>
      <div class="line">
        <label for="problem">反馈</label>
        <textarea rows="8" cols="20" class="problem grey" id="reply" v-model="advice" readonly="readonly"></textarea>
      </div>
    </div>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "AdviceDetail",
  data() {
    return {
      topnav:{
        title:'查看反馈'
      },
      name:'',
      card:this.$cookie.get('card'),
      relat:'',
      problem:'',
      advice:'',//公司反馈信息
      images:''
    };
  },
  mounted() {
    this.name=this.$cookie.get('nickname')=='null'|| this.$cookie.get('nickname')==''?'':this.$cookie.get('nickname');
    var msgId = this.$route.query.msgId

    axios({
      url:this.Api + '/feedback/infoOne?msgId='+msgId,
      method:'post',
      headers:{
        "X-Nideshop-Token": this.$cookie.get('token'),
      }
    }).then(res=>{
      if (res.data.errno == 0) {
        let data = res.data.data;
        // console.log('查看意见反馈列表',data);
        if (data.length==0) {
          this.allLoaded = true;
        }else{
          this.name = data.feedback.userName;
          this.relat = data.feedback.mobile;
          this.problem = data.feedback.content;
          this.images = data.imgUrls;
          this.advice = data.feedback.reply == null||data.feedback.reply == ''?'暂无反馈，请稍后查看!':data.feedback.reply;
        }
      }else{
        Toast(res.data.errmsg)
      }
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>

<style scoped>
.AdviceDetail  .head >>> .mint-header-title{
  font-size: .75rem;
}
.AdviceDetail .adviceBox .line .grey{
  border:1px solid #ccc
}
.AdviceDetail {
  position: relative;
  width:100%;
  background: #fff;
  min-height:100vh;
  background-image: url('../../../assets/images/bg.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position-y: -50px;
}
/* 表单区 */
.AdviceDetail .adviceBox {
  margin-top: 2.8rem;
  width: 100%;
}
.AdviceDetail .adviceBox .line{
  width: 90%;
  margin: 0 auto 10px;
}
.AdviceDetail .adviceBox .line .noImages{
  color: red;
  font-size: .6222rem /* 28/45 */;
}
.AdviceDetail .adviceBox .line .imgBox{
  margin-top: 10px;
}
.AdviceDetail .adviceBox .line label{
  font-size: .7111rem /* 32/45 */;
  display: inline-block;
  width: 21%;
  text-align-last: justify;
}
.AdviceDetail .adviceBox .line input{
  width: 75%;
  height: 1.1111rem /* 50/45 */;
  font-size: .6222rem /* 28/45 */;
  margin-left: .4444rem;
  text-align: center;
  border: 1px solid #313131
}
.AdviceDetail .adviceBox .line .problem{
  width: 99%;
  border: 1px solid #313131;
  font-size: .6222rem /* 28/45 */;
  margin-top: 10px;
  padding: 10px;
}
.AdviceDetail .adviceBox .line #reply{
  color: red;
}
/* 底部按钮 */
.AdviceDetail .btnBox button {
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
.AdviceDetail .head >>> .mint-header {
  background:transparent;
  border-bottom:none;
}
.AdviceDetail >>> .el-collapse-item__header {
  padding-left: 0.4444rem /* 20/45 */;
}

</style>
