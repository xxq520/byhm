<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-main">
      <!-- 店铺资质 -->
      <div class="cart-item">
        <div class="cart-title">店铺资质</div>
        <div class="cart-box">
          <div class="cart-list zizhi idcard">
            <div class="label">身份证正反面：</div>
            <div class="idpic">
              <div class="idbox"><countyimgUpload text="身份证正面" :img="IDCardZ" @img-upload="IDCardZChange" @click.native="IDCardZfn"></countyimgUpload></div>
              <div class="idbox"><countyimgUpload text="身份证反面" :img="IDCardF" @img-upload="IDCardFChange" @click.native="IDCardFfn"></countyimgUpload></div>
            </div>
          </div>
          <div class="cart-list zizhi">
            <div class="shoplmain">
              <label class="tm-label">手持身份证：</label>
              <div class="lmain">
                <countyimgUpload :img="handheldIdCard" @img-upload="handheldIdCardChange" @click.native="handheldIdCardfn"></countyimgUpload>
              </div>
            </div>
            <div class="shoplmain">
              <label class="tm-label">营业执照：</label>
              <div class="lmain">
                <countyimgUpload :img="bizLicence" @img-upload="bizLicenceChange" @click.native="bizLicencefn"></countyimgUpload>
              </div>
            </div>
          </div>
          <div class="cart-list zizhi">
            <div class="shoplmain">
              <label class="tm-label">开户许可证：</label>
              <div class="lmain">
                <countyimgUpload :img="license" @img-upload="licenseChange" @click.native="licensefn"></countyimgUpload>
              </div>
            </div>
            <div class="shoplmain">
              <label class="tm-label">店铺门头照：</label>
              <div class="lmain">
                <countyimgUpload :img="facadePhoto" @img-upload="facadePhotoChange" @click.native="facadePhotofn"></countyimgUpload>
              </div>
            </div>
          </div>
          <div class="cart-list zizhi">
            <div class="shoplmain">
              <label class="tm-label">收银台照：</label>
              <div class="lmain">
                <countyimgUpload :img="cashPhoto" @img-upload="cashPhotoChange" @click.native="cashPhotofn"></countyimgUpload>
              </div>
            </div>
            <div class="shoplmain">
              <label class="tm-label">经营场所照：</label>
              <div class="lmain">
                <countyimgUpload :img="operatingPhoto" @img-upload="operatingPhotoChange" @click.native="operatingPhotofn"></countyimgUpload>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub">
      <mt-button @click="subfn">提交更改申请</mt-button>
    </div>
  </div>
</template>

<script>
import regular from "@/assets/js/regular";
export default {
  name: "shopDetail",
  data() {
    return {
      topnav: {
        title: "资质信息管理"
      },
      id: this.$route.query.id,
      bizLicence: null,
      IDCardZ: null,
      IDCardF: null,
      imgUploadStopAdd: false,
      handheldIdCard: null, //手持身份证
      license: null,  //许可证
      facadePhoto: null, //门头照
      cashPhoto: null, //收银台照
      operatingPhoto: null, //经营场所照
     
    };
  },
  created() {
    // Indicator.open();
    let that = this;
    // 重新申请获取数据
    axios({
      url: this.Api + "/merchant/info",
      method: "get",
      headers: {
        "X-Nideshop-Token": this.$cookie.get("token")
      }
    }).then(res => {
      Indicator.close();
      console.log(res);
      if (res.data.errno != 0) {
        Toast(res.data.errmsg);
        return false;
      }
      let data = res.data.data;
      that.bizLicence = data.qualification.bizLicence?data.qualification.bizLicence:''
      that.facadePhoto = data.qualification.facadePhoto?data.qualification.facadePhoto:''
      that.IDCardZ = data.qualification.frontIdCard?data.qualification.frontIdCard:''
       console.log(that.IDCardZ)
      that.IDCardF = data.qualification.reverseIdCard?data.qualification.reverseIdCard:''
      that.handheldIdCard = data.qualification.handinIdCard?data.qualification.handinIdCard:''
      that.cashPhoto = data.qualification.checkoutCounterPhoto?data.qualification.checkoutCounterPhoto:''
      that.operatingPhoto = data.qualification.businessPhoto?data.qualification.businessPhoto:''
      that.license = data.qualification.permitsAccounts?data.qualification.permitsAccounts:''
      that.id = data.merchant.id
     
    })
   
  },
  mounted() {


  },
  methods: {
    // 提交店铺申请
    subfn() {
      let that = this;
      console.log(that.IDCardZ)
      if (that.IDCardZ == ""){
        Toast('请上传身份证正面照','middle')
        return false
      } else if(that.IDCardF == "") {
        Toast('请上传身份证反面照','middle')
        return false
      }else if(that.handheldIdCard == "") {
        Toast('请上传手持身份证照','middle')
        return false
      }else if(that.bizLicence == "") {
        Toast('请上传营业执照','middle')
        return false
      }else if(that.license == "") {
        Toast('请上传许可证','middle')
        return false
      }else if(that.facadePhoto == "") {
        Toast('请上传门头照','middle')
        return false
      }else if(that.cashPhoto == "") {
        Toast('请上传收银台照','middle')
        return false
      }else if(that.operatingPhoto == "" ) {
        Toast('请上传经营场所照','middle')
        return false
      }
      let post = {
        merchant: {
          id: that.id
        },
        qualification: {
          frontIdCard: that.IDCardZ,
          reverseIdCard: that.IDCardF,
          handinIdCard: that.handheldIdCard,
          bizLicence: that.bizLicence,
          permitsAccounts: that.license,
          facadePhoto: that.facadePhoto,
          checkoutCounterPhoto: that.cashPhoto,
          businessPhoto: that.operatingPhoto
        }
      };

      console.log(post);
      axios({
        method: "post",
        url: that.Api + "merchant/update",
        data: post
      })
      .then(res => {
         console.log(res)
         if(res.data.errno == 0) {
           Toast(res.data.errmsg)
         }
      })
      .catch(err => {
        console.log(err);
      });
    },
    
    
    // 上传营业执照
    bizLicencefn(val) {
      // this.bizLicence = val.url;
    },
    bizLicenceChange(val){
      if(val.url){
        this.bizLicence = val.url;
      }else{
        this.bizLicence = '';
        // this.imguploadfn();
      };
    },
    // 身份证正反面
    IDCardZfn(val) {
      // this.IDCardZ = val.url;
    },
    IDCardZChange(val){
      if(val.url){
        this.IDCardZ = val.url;
      }else{
        this.IDCardZ = '';
        // this.imguploadfn();
      };
    },
    IDCardFfn(val) {
      // this.IDCardF = val.url;
    },
    IDCardFChange(val){
      if(val.url){
        this.IDCardF = val.url;
      }else{
        this.IDCardF = '';
        // this.imguploadfn();
      };
    },
    //手持身份证
    handheldIdCardfn(val) {
      // this.IDCardF = val.url;
    },
    handheldIdCardChange(val){
      if(val.url){
        this.handheldIdCard = val.url;
      }else{
        this.handheldIdCard = '';
        // this.imguploadfn();
      };
    },
    //开户许可证
    licensefn(val) {
      // this.IDCardF = val.url;
    },
    licenseChange(val){
      if(val.url){
        this.license = val.url;
      }else{
        this.license = '';
        // this.imguploadfn();
      };
    },
    //店铺门头照
    facadePhotofn(val) {
      // this.IDCardF = val.url;
    },
    facadePhotoChange(val){
      if(val.url){
        this.facadePhoto = val.url;
      }else{
        this.facadePhoto = '';
        // this.imguploadfn();
      };
    },
    //收银台照
    cashPhotofn(val) {
      // this.IDCardF = val.url;
    },
    cashPhotoChange(val){
      if(val.url){
        this.cashPhoto = val.url;
      }else{
        this.cashPhoto = '';
        // this.imguploadfn();
      };
    },
    //经营场所照
    operatingPhotofn(val) {
      // this.IDCardF = val.url;
    },
    operatingPhotoChange(val){
      if(val.url){
        this.operatingPhoto = val.url;
      }else{
        this.operatingPhoto = '';
        // this.imguploadfn();
      };
    },
    
  },

};
</script>

<style scoped>
.cart-main {
  padding: 1rem 0.5rem 0;
}
.mainbox {
  overflow: hidden;
  min-height: 100vh;
  background: #f2f2f2;
}
.cart-item {
  overflow: hidden;
  background: white;
  border-radius: 0.4rem;
  margin-bottom: 0.5rem;
}

.cart-item .cart-title {
  padding: 0.3rem 0.5rem;
  background: #ffe9c9;
  color: #ec0746;
  font-size: 0.72rem;
  line-height: 1.4em;
}
.cart-item .cart-box {
  padding: 0 0.5rem;
}
.cart-item .cart-box .zizhi {
  display: flex;
  flex-wrap: wrap;
}
.cart-item .cart-box .zizhi .lmain2 {
  margin-top: 10px;
}
.cart-item .cart-box .cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.7rem 0;
  font-size: 0.6rem;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-item .cart-box .cart-list:last-child {
  border-bottom: none;
}

.cart-item .cart-box .cart-list p.lmain,
.cart-item .cart-box .cart-list div.lmain2 {
  width: calc(100% - 7em);
}

.cart-item .cart-box .cart-list p.adress span {
  display: block;
  flex: 1;
  height: 1.4em;
  word-break: break-all;
}
.cart-item .cart-box .cart-list p.adress i {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-item .cart-box .cart-list input {
  display: block;
  flex: 1;
  font-size: 0.6rem;
  color: #333;
  word-break: break-all;
}
.textarea textarea {
  width: 100%;
  font-size: 0.6rem;
  line-height: 1.4em;
}
.test-textarea-ab {
  color: #999;
}
.cart-item >>> .el-upload--picture-card {
  height: 100px;
  line-height: 100px;
}
.visiblebtn >>> .mint-button--small{
  font-size: 14px;
  padding: 0 8px;
  height: 25px;
}
.visiblebtn >>> .mint-button--default{
  -webkit-box-shadow: none;
  box-shadow: none;
}
.visiblebtn{
  padding:0.5rem;
  border-bottom:1px solid #eaeaea;
  overflow:hidden;
}
.visiblebtn .quxiao{
  float:left;
  border:1px solid #ccc;
}
.visiblebtn .queding{
  float:right;
}
.sub {
  width: 10rem;
  height: 1.7778rem;
  margin: 1rem auto;
}
.sub button {
  text-align: center;
  color: white;
  width: 100%;
  font-size: 0.7rem;
  height: 1.7778rem;
  line-height: 1.6em;
  background: #ff8f28;
  border-radius: 20rem;
}
.cart-item .cart-box .cart-list i.must {
  font-size: 1rem;
  color: #ec0746;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-item .cart-box .cart-list i.must::before {
  content: "*";
  display: block;
  line-height: 0.4em;
  padding-top: 0.45em;
}
.upload {
  width: 150px;
  height: 100px;
  overflow: hidden;
  border-radius: 5px;
  margin-left: 10px;
}
.upload-icon {
  border: 1px dashed #ccc;
  height: 100%;
  text-align: center;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.upload-icon i {
  font-size: 1.8rem;
  line-height: 1;
  color: #ccc;
}
.imgClear {
  position: absolute;
  right: -3px;
  top: -4px;
  font-size: 20px;
  border-radius: 50%;
  background: white;
  color: #ec0746;
  width: 18px;
  height: 18px;
}

.provCity label,
.provCity p.lmain {
  width: auto;
}
.mint-popup {
  width: 100%;
}
.cart-list1 {
  padding: 0.7rem 0;
  font-size: 0.7rem;
  line-height: 1.4em;
  align-items: center;
}
.cart-list1 .title {
  display: flex;
  justify-content: space-between;
  font-size: 0.6222rem;
  color: #333333;
}
.cart-list1 .title div {
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 1rem;
  color: #999999;
}
.cart-list1 i.must {
  font-size: 1rem;
  color: #ec0746;
  position: absolute;
  right: 0;
  top: 4px;
}
.cart-list1 i.must::before {
  content: "*";
  line-height: 0.4em;
  padding-top: 0.45em;
}
.shop {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.shop {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.lmain .uploadbox {
  position: relative;
}
.shop .uploadbox {
  max-width: 150px;
  width: 48%;
  position: relative;
}
.shop .upload {
  margin: 0 0 10px 0;
  color: #999999;
  width: 100%;
}
.cart-item .cart-box .address-list {
  align-items: center;
}
.cart-item .cart-box .address-list p.lmain {
  align-items: center;
}
.cart-item .cart-box .address-list .diqu {
  width: 8rem;
  color: #f14574;
}
.mr-l-14 {
  margin-left: 0.583333rem;
}
.black {
  color: #888888;
}
.cart-item .cart-box .textarea {
  align-items: center;
}
.cart-item .cart-box .textarea textarea {
  color: #f14574;
}
.cart-item .cart-box .cart-list input {
  color: #f14574;
}
.cart-item .cart-box .cart-list .tm-label {
  width: 12.5em;
}
.idcard .label {
  width: 100%;
}
.idcard .idpic {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.idcard .idbox {
  width: 48%;
}
.shoplmain {
  width: 48%;
}
.shoplmain .lmain {
  margin-top: 10px;
}

</style>
