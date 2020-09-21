<template>
  <div class="glode">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-main">
       <div class="cart-item-top" v-if="isShow">
        <div class="auditIcon">
          <!-- <img :src="approvalImg" alt="">   -->
          <!-- 审核通过的icon-->
          <img src="@/assets/images/audit_ok.png" alt="">
        </div>
        <p class="audit_title">{{approvalStatus}}</p>
        <p class="audit_content">{{resultTip}}</p>
      </div>
      <div class="cart-item">
        <div class="cart-title">开户信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>开户账户姓名：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入开户账户姓名"  v-model="userName">
            </p>
          </div>
          <div class="cart-list">
            <label>开户行：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入开户行"  v-model="bank">
            </p>
          </div>
          <div class="cart-list">
            <label>开户地区：</label>
            <p class="lmain" @click="bankAdressfn">
              <input
                type="text"
                placeholder="请选择开户地区"
                readonly
                 :value="bankAdress?bankAdress.prov.name +'-'+ bankAdress.city.name + '-' +bankAdress.area.name   :''"
              >
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>开户行支行名称：</label>
            <p class="lmain">
              <input
                type="text"
                placeholder="请输入开户支行名称"
                readonly
                :value="bankName" 
                @click="BankPopupfn"
              >
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>开户账户：</label>
            <p class="lmain">
              <input type="number" placeholder="请输入开户账户" v-model="account" :attr="{ maxlength: 19 }">
            </p>
          </div>
          <div class="cart-list">
            <label>身份证号码：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入身份证号码" v-model="cardId"  :attr="{ maxlength: 18,minlength:15 }">
            </p>
          </div>
          <div class="cart-list">
            <label>手机号码：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入银行预留的手机号码" v-model="mobile">
            </p>
          </div>
           <div class="cart-list">
            <label>法人姓名：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入法人姓名" v-model="legalName ">
            </p>
          </div>
          <div class="cart-list">
            <label>法人邮箱：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入法人邮箱" v-model="eMail">
            </p>
          </div>
          <div class="cart-list">
            <label>店铺名称：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入店铺名称" v-model="shopName">
            </p>
          </div>
        </div>
      </div>
      <div class="cart-item">
        <div class="cart-title">地址信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>常住省份：</label>
            <p class="lmain" @click="adressfn">
              <input
                type="text"
                placeholder="请选择省份"
                readonly
                :value="adress.prov?adress.prov.name:''"
              >
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list" @click="adressfn">
            <label>常住城市：</label>
            <p class="lmain">
              <input
                type="text"
                placeholder="请选择城市"
                readonly
                :value="adress.city?adress.city.name:''"
              >
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list" @click="adressfn">
            <label>常住区县：</label>
            <p class="lmain">
              <input
                type="text"
                placeholder="请选择区县"
                readonly
                :value="adress.area?adress.area.name:''"
              >
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>常住地址路名：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入常住地址路名" v-model="adressRoad">
            </p>
          </div>
          <div class="cart-list">
            <label>常住地址门牌：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入常住地址门牌" v-model="adressCard">
            </p>
          </div>
          <!-- <div class="cart-lists">
            <label>详细地址：</label>
            <p class="lmain">
              <input type="text" placeholder="请输入如道路、门牌号、小区、楼栋号、单元室等" v-model="addressDetail">
            </p>
          </div> --> 
        </div>
      </div>
      <div class="cart-item">
        <div class="cart-box">
            <div class="cart-list1">
            <div class="title">
                <label>身份证正反面：</label>
            </div>
            <div class="shop">
               <div class="img_box">
                 <countyimgUploadYL text="添加" :img="IDcardZ"  @img-upload="IDcardZFn"></countyimgUploadYL>
                 <p>身份证正面</p>
               </div>
              <div class="img_box">
                 <countyimgUploadYL text="添加" :img="IDcardF"  @img-upload="IDcardFFn"></countyimgUploadYL>
                 <p>身份证反面</p>
              </div>
            </div>
            </div>
        </div>
        <div class="cart-box">
          <div class="cart-list">
            <label class="tm-label">手持身份证照片：</label>
            <div class="lmain lmain2">
              <countyimgUploadYL text="添加"  :img="handOnCard"  @img-upload="handOnCardFn"></countyimgUploadYL>
            </div>
          </div>
          <div class="cart-list">
            <label class="tm-label">门头照片：</label>
            <div class="lmain lmain2">
              <countyimgUploadYL text="添加" :img="facadePhoto" @img-upload="facadePhotofn"></countyimgUploadYL>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="sub">
      <mt-button @click="subfn">提交申请</mt-button>
    </div> -->
    <!--常住地址  -->
    <adressPopupYL :visible.sync="visible"  @region-change="region" @visible-change="visiblefn"></adressPopupYL>
    <!-- 开户行地区 -->
    <adressPopupYL :visible.sync="BAvisible"  @region-change="bankAdressregion" @visible-change="BAvisiblefn"></adressPopupYL>
    <!-- 开户行 -->
     <mt-popup v-model="bankVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="bankCancelfn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="bankConfirmfn">确定</mt-button>
      </div>
      <mt-picker :slots="bankslots" value-key="name" @change="bankChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import regular from '@/assets/js/regular';
import adressPopupYL from '@/components/adressPopupYL';
import countyimgUploadYL  from '@/components/countyimgUploadYL';
import { constants, close } from 'fs';
export default {
  data() {
    return {
      topnav: {
        title: "银联入驻"
      },
      BAvisible:false,
      visible: false,
      userid: this.$cookie.get('userid'), //用户唯一id
      adress: {}, //地址信息
      bankAdress:'',//开户地区
      userName:'',//账户姓名
      account:'',//账户
      bank:'',//开户行
      bankCode:'',//开户行行号
      bankName:'',//支行名
      cardId:'',//身份证
      mobile:'',//手机号
      addressDetail:'',//详细地址
      IDcardZ:'',//身份证正面
      IDcardF:'', //身份证反面
      handOnCard:'',//手持身份证
      facadePhoto:'',//门头照
      legalName:'',//法人姓名
      eMail: '', //法人邮箱
      shopName:'',//店铺名称
      adressRoad:'',//常住地址路名
      adressCard:'',//常住地址门牌
      showBackTip:false,
      isShow: false,
      approvalImg:'@/assets/images/audit_ok.png',//审核状态
      approvalStatus:'入驻成功', //状态
      resultTip:'您的银联入驻申请审核通过，已成功入驻！',//提示
      bankVisible:false,//开户行
      bankModel:'',
      bankslots: [
        {
          flex: 1,
          values: [],
          textAlign: "center"
        }
      ],
      idcardFrontInfo:'',//身份证正面
      idcardReverseInfo:'',//身份证反面
      idcardSelfieInfo:'',//自拍照
      doorFrontInfo:'',//门面照
      

    };
  },
  components:{
    adressPopupYL,
    countyimgUploadYL
  },
  mounted(){

  },
  methods: {
    // 开户地址
     bankAdressfn(){
     this.BAvisible = true;
   },
    bankAdressregion(val){
      this.bankAdress = val;
       console.log( this.bankAdress);
      
    },
    BAvisiblefn(val){
      this.BAvisible = val;
     
    },
    // 常住地址
    adressfn() {
      this.visible = true;
    },
    region(val) {
      this.adress = val;
      console.log(this.adress);
    },
    visiblefn(val) {
      this.visible = val;
    },

    // 身份证正面
    IDcardZFn(val){
      console.log(val);
      this.IDcardZ = val.path;
      this.idcardFrontInfo = '0001,法人身份证'+','+val.file_path+','+val.file_size+','+val.path;
      console.log(this.idcardFrontInfo);
    },
    // 身份证反面
    IDcardFFn(val){
      this.IDcardF = val.path;
      this.idcardReverseInfo = '0011,身份证反面'+','+val.file_path+','+val.file_size+','+val.path;
      console.log(this.idcardReverseInfo);
      
    },
    // 手持身份证
    handOnCardFn(val){
      this.handOnCard = val.path;
      this.idcardSelfieInfo = '0007,自拍照'+','+val.file_path+','+val.file_size+','+val.path;
      console.log(this.idcardSelfieInfo);
    },
    // 门店
    facadePhotofn(val) {
      console.log(val);
      this.facadePhoto = val.path;
      this.doorFrontInfo = '0005,门头照片'+','+val.file_path+','+val.file_size+','+val.path;
      console.log(this.doorFrontInfo);
    },
    // 提交
    subfn(){
       let expPhone = regular.RegPhone; //手机号码
       let expIDcard =  regular.RegIDcard; //身份证
       let expEMail = regular.RegMail;//邮箱
      if(this.userName == ''){
         Toast('请输入开户账户姓名','middle');
         return false;
      }
      else if(this.account == ''){
         Toast('请输入开户账户','middle');
         return false;
      }
       else if(this.bank == ''){
         Toast('请输入开户行','middle');
         return false;
      }
      else if(this.bankName == ''){
         Toast('请输入开户行支行名称','middle');
         return false;
      }
      else if(this.cardId == ''){
         Toast('请输入身份证号码','middle');
         return false;
      }
      else if(!(expIDcard.test(this.cardId))){
         Toast('请输入正确的身份证号码','middle');
         return false;
      }
      else if(this.mobile == ''){
         Toast('请输入手机号码','middle');
         return false;
      }
      else if(!(expPhone.test(this.mobile))){
         Toast('请输入正确的手机号码','middle');
         return false;
      }
      else if(this.legalName == ''){
         Toast('请输入法人姓名','middle');
         return false;
      }
      else if(this.eMail == ''){
         Toast('请输入法人邮箱','middle');
         return false;
      }
       else if(!(expEMail.test(this.eMail))){
         Toast('请输入正确的邮箱','middle');
         return false;
      }
       else if(this.shopName == ''){
         Toast('请输入店铺名称','middle');
         return false;
      }
      else if(this.adress.prov ==  undefined){
         Toast('请选择地址信息','middle');
         return false;
      }
      else if(this.adressRoad == ''){
         Toast('请输入常住地址路名','middle');
         return false;
      }
       else if(this.adressCard == ''){
         Toast('请输入常住地址门牌','middle');
         return false;
      }
      else if(this.IDcardZ == ''){
         Toast('请上传身份证正面照','middle');
         return false;
      }
      else if(this.IDcardF == ''){
         Toast('请上传身份证反面照','middle');
         return false;
      }
      else if(this.handOnCard == ''){
         Toast('手持身份证照片','middle');
         return false;
      }
      else if(this.facadePhoto == ''){
        Toast('门头照片','middle');
        return false;
      }

       MessageBox({
            title: "温馨提示",
            message: "入驻信息一经提交将无法修改，请您重复确认入驻信息的准确",
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonText:"确定提交",

          }).then(action =>{
            if(action == 'confirm'){

            console.log('确认')
            this.postUpData();

          }else{

            console.log('取消')

          }
          });
     
    },
    //支行popup
    BankPopupfn(){
      if(this.bank == ''){
         Toast('请先输入开户行再选择开户行支行','middle');
         return;
      }
    
       if(this.bankAdress.prov == undefined){
         Toast('请先输入开户行地区再选择开户行支行','middle');
         return;
      }
      this.bankVisible = true;
      this.bankslots[0].values = [];
      this.getBranchBankList();
    },
    bankCancelfn(){
      this.bankVisible = false;
    },
    bankConfirmfn(){
      this.bankVisible = false;
      console.log(this.bankModel);
      this.bankName = this.bankModel.name;
     
      
      
    },
    bankChange(picker, values) {
      this.bankModel = values[0];
    },

    // 获取支行数据
    getBranchBankList(){
      let param = {
        key: this.bank,
        cityId:this.bankAdress.city.id
      }
      axios({
        method: "post",
        url: this.Api + "UnionPayEnter/branchBankList",
        headers: { "X-Nideshop-Token": this.$cookie.get('token') },
        data: param
      }).then(res => {
        // console.log(res);
        if(res.data.code == 200){
          let bankList = res.data.data;
          console.log(bankList);
           bankList.forEach((post, index) => {
             console.log(post);
            let p = {
              code: post.code,
              name: post.bankBranchName
            };
            this.bankCode = p.code;
            this.bankslots[0].values.push(p);
            // if (post.id == this.postdata.category) this.categoryName = post.name;
          });
        }
      })
    },
    postUpData(){
      let param = {
        userid: this.userid,
        userName:this.userName,
        bankCardNo:this.account,
        bankName:this.bankName,
        bankNo:this.bankCode,
        bankBranch:this.bankName,
        idcard:this.cardId,               
        bankMobile:this.mobile,  
        // "address":this.adress,  
        legalEmail:this.eMail,
        regMerType:"02",
        city:this.adress.city.id,
        county:this.adress.area.id,
        province:this.adress.prov.id,
        shopHouseNo:this.adressCard,
        shopRoad:this.adressCard,
        shopName:this.shopName,
        idcardFront:this.IDcardZ,
        idcardReverse:this.IDcardF,
        idcardSelfie:this.handOnCard,
        doorFront:this.facadePhoto,
        idcardFrontInfo:this.idcardFrontInfo,
        idcardReverseInfo:this.idcardReverseInfo,
        idcardSelfieInfo:this.idcardSelfieInfo,
        doorFrontInfo:this.doorFrontInfo,
        legalName:this.legalName
      };
      console.log(param);
      axios({
        method: "post",
        url: this.Api + "UnionPayEnter/upLoadUnionPayEnterMsg",
        headers: { "X-Nideshop-Token": this.$cookie.get('token') },
        data: param
      }).then( res => {
        console.log(res);
      })

    },
    //查询银联入驻信息
    unionPayEnterMsg(){
        axios({
        method: "post",
        url: this.Api + "UnionPayEnter/upLoadUnionPayEnterMsg",
        headers: { "X-Nideshop-Token": this.$cookie.get('token') },
        data: {userid:this.userid}
      }).then( res => {
        console.log(res);
      })
    },
  },
  created() {},
  watch:{
    // facadePhoto(val,old) {
    //   if(old != "") {
    //      this.showBackTip = true
    //   }
      
    // },
  }
};
</script>

<style scoped>
.glode {
  overflow: hidden;
  min-height: 100vh;
  background: #f2f2f2;
}
.cart-main {
  padding: 1rem 0.5rem 0;
}
.cart-item-top {
  margin-bottom: 1.2222rem;
}
.cart-item-top .auditIcon {
  width: 2.2222rem;
  height: 2.6667rem;
  margin: 0 auto;
}
.cart-item-top .audit_title {
  color: #333333;
  font-size: 0.6667rem;
  text-align: center;
  margin-top: 5px;
}
.cart-item-top .audit_content {
  color: #666666;
  font-size: 0.5333rem;
  text-align: center;
  line-height: 0.8rem;
}
.cart-item-top .audit_reason {
  color: #666666;
  font-size: 0.5333rem;
  text-align: center;
  line-height: 0.8rem;
}
.ruzhuway {
  font-size: 0.6rem;
}
.cart-item-top .audit_time {
  color: #666666;
  font-size: 0.5333rem;
  text-align: center;
  line-height: 0.8rem;
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
.cart-item .cart-box .cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.5rem 0;
  font-size: 0.6222rem /* 28/45 */;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-item .cart-box .cart-lists {
  padding: 0.5rem 0;
  font-size: .6222rem /* 28/45 */;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-item .cart-box .cart-list:last-child {
  border-bottom: none;
}
.cart-item .cart-box .cart-lists:last-child {
  border-bottom: none;
}
.cart-item .cart-box .cart-list label {
  float: left;
  width: 9em;
  color: #333;
}
.cart-item .cart-box .cart-list .lmain {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: calc(100% - 7.7em);
  color: #333;
}
.cart-item .cart-box .cart-lists .lmain {
  text-align: left;
  width: calc(100%);
  color: #333;
  padding-top: 0.4667rem /* 21/45 */;
  font-size: .6222rem /* 28/45 */;
}
.cart-item .cart-box .cart-lists .lmain input {
  width: 100%;
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
.shop {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.shop .img_box{
  width: 48%;
  text-align: center;                                                 
}
.shop .img_box p {
  max-width: 150px;
  width: 100%;
  text-align: center;
}
.cart-list1 {
  padding: 0.7rem 0;
  font-size: .6222rem /* 28/45 */;
  line-height: 1.4em;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.cart-list1 .title {
  display: flex;
  justify-content: space-between;
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
.cart-list1 .explain {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 0.6222rem /* 28/45 */;
}
.cart-list1 .explain p {
  width: 48%;
  text-align: center;
  color: #333;
}
.cart-list2{
   -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    padding: 0.5rem 0;
    font-size: 0.6222rem /* 28/45 */;
    line-height: 1.4em;
    border-bottom: 1px solid #eee;
    display: flex;
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
.cart-box >>> .upload-icon{
    border-radius: .2222rem /* 10/45 */;
    border: .0444rem /* 2/45 */ solid #bebebe;  
}
.mint-popup {
  width: 100%;
}
.mint-popup >>> .picker-item{
  font-size: .5rem;
}
.visiblebtn >>> .mint-button--small {
  font-size: 14px;
  padding: 0 8px;
  height: 25px;
}
.visiblebtn >>> .mint-button--default {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.visiblebtn {
  padding: 0.5rem;
  border-bottom: 1px solid #eaeaea;
  overflow: hidden;
}
.visiblebtn .quxiao {
  float: left;
  border: 1px solid #ccc;
}
.visiblebtn .queding {
  float: right;
}

</style>
