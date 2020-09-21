<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-main">
      <div class="cart-item">
        <div class="cart-title">店铺负责人</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>负责人姓名:</label>
            <p class="lmain"><input type="text" placeholder="输入您的姓名" v-model="postdata.contact"></p>
          </div>
          <div class="cart-list">
            <label>负责人手机号:</label>
            <p class="lmain"><input type="text" placeholder="输入手机号" v-model="postdata.contactTel"></p>
          </div>
          <div class="cart-list">
            <label>推荐人姓名:</label>
            <p class="lmain"><input type="text" placeholder="输入推荐人姓名" v-model="postdata.inviterName" readonly></p>
          </div>
          <div class="cart-list">
            <label>推荐人手机号:</label>
            <p class="lmain"><input type="text" placeholder="输入推荐人手机号" v-model="postdata.inveteMobile" readonly></p>
          </div>
        </div>
      </div>

      <div class="cart-item">
        <div class="cart-title">店铺信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>店铺名称:</label>
            <p class="lmain"><input type="text" placeholder="输入店铺名称" v-model="postdata.name"></p>
          </div>
          <div class="cart-list">
            <label>店铺类型:</label>
            <p class="lmain"><input type="text" placeholder="输入店铺类型" readonly :data="postdata.category" v-model="categoryName" @click="categoryfn"></p>
          </div>
          <div class="cart-list">
            <label>店铺服务电话:</label>
            <p class="lmain"><input type="text" placeholder="输入店铺服务电话" v-model="postdata.mobile"></p>
          </div>
          <div class="cart-list provCity" @click="adressfn">
            <label v-if="!areadata">地区/详细地址:</label>
            <label v-else>
              <p v-if="areadata.prov && areadata.prov.name && areadata.prov.name!=''">{{ areadata.prov.name }}</p>
              <p v-if="areadata.city && areadata.city.name && areadata.city.name!=''">{{ areadata.city.name }}</p>
              <p v-if="areadata.area && areadata.area.name && areadata.area.name!=''">{{ areadata.area.name }}</p>
              <!--<p v-if="areadata.street && areadata.street.name && areadata.street.name!=''">{{ areadata.street.name }}</p>-->
            </label>
            <p class="lmain adress">
              <span></span><i class="el-icon-arrow-right"></i>
            </p>
          </div>
          <div class="cart-list textarea">
            <textarea placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" v-model="postdata.address"></textarea>
          </div>
          <div class="cart-list">
            <label>营业时间:</label>
            <p class="lmain"><input type="text" placeholder="输入营业时间" v-model="postdata.openTime" readonly @click="openTimedata"></p>
          </div>
          <!--<div class="cart-list">
            <label>人均消费:</label>
            <p class="lmain"><input type="text" placeholder="输入人均消费"></p>
          </div>-->
          <div class="cart-list">
            <label>店铺介绍:</label>
            <p class="lmain"><input type="text" placeholder="输入店铺介绍" v-model="postdata.remarks"></p>
          </div>
          <div class="cart-list">
            <label>上传店铺门头照:</label>
            <div class="lmain">
              <imgUpload :img.sync="postdata.facadePhoto" @img-upload="facadePhotoChange" @click.native="facadePhotofn"></imgUpload>
            </div>
          </div>
          <div class="cart-list">
            <label>上传店铺营业执照:</label>
            <div class="lmain">
              <div class="uploadbox">
                <div class="upload">
                  <div class="upload-icon" v-if="!postdata.bizLicence || postdata.bizLicence==''"><i class="el-icon-plus"></i></div>
                  <img :src="postdata.bizLicence" v-else>
                </div>
              </div>
            </div>
          </div>

          <div class="cart-list1">
            <div class="title">
              <label>上传店铺照片：</label>
              <div>上传至少两张</div>
            </div>
            <div class="shop">

              <template v-if="shopImg.length > 0">
                <imgUpload text="720x400" :delete.sync="imgClear" v-for="(item,index) in shopImg" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn($event,index)"></imgUpload>
              </template>
              <template v-if="shopImg.length == 0">
                <imgUpload text="720x400" :delete.sync="imgClear" @img-upload="shopImgChange" @click.native="shopImgfn($event,0)"></imgUpload>
              </template>

              <imgUpload :add="true" text="添加更多" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange" @click.native="shopImgAdd"></imgUpload>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="sub" @click="submitfn">确定修改</div>

    <!--地区选择-->
    <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup>
    <!--商店类型选择-->
    <mt-popup v-model="typeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
    </mt-popup>
    <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>
  </div>
</template>

<script>
export default {
  name: 'shopMessage',
  data () {
    return {
      topnav:{
        title:'店铺信息管理'
      },
      shopid:'',
      dialogImageUrl: '',
      dialogVisible: false,
      visible:false,
      areadata:null,
      facadePhoto:'',
      postdata:new Object(),
      // 商店类型选择
      categoryName:'',
      typeVisible:false,
      typeModel:'',
      typeslots:[
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      openVisible:false,
      shopImg: [],
      shopImgIndex:null,
      imgUploadStopAdd:false,
      imgClear:false
    }
  },
  mounted() {
    // this.shopid = this.$route.params.postId;
    let that = this;
    Indicator.open();
    axios({
      url:this.Api + '/merchant/info',
      method:"post",
      headers:{
        "X-Nideshop-Token": this.$cookie.get('token')
      }
    }).then(res => {
      Indicator.close();
      console.log(res)
      if(res.data.errno != 0){
        Toast(res.data.errmsg);
        return false;
      };
      let data = res.data.data;

      this.postdata = data.merchant;
      this.shopImg = data.imgUrls;

      if(!this.areadata) this.areadata = {};
      if(data.merchant.province && data.merchant.province != ''){
        this.areadata['prov'] = {}
        this.areadata['prov'].name = data.merchant.province;
      };
      if(data.merchant.city && data.merchant.city != ''){
        this.areadata['city'] = {}
        this.areadata['city'].name = data.merchant.city;
      };
      if(data.merchant.county && data.merchant.county != ''){
        this.areadata['area'] = {}
        this.areadata['area'].name = data.merchant.county;
      };
      /*if(data.merchant.street && data.merchant.street != ''){
        this.areadata['street'] = {}
        this.areadata['street'].name = data.merchant.street;
      };*/
      // 当图片少于等于2张时不能删除
      if(this.shopImg.length <= 2){
        this.imgClear = true;
      }else{
        this.imgClear = false;
      }

      // 类型
      axios({
        url:this.Api + '/merchant/categoryList',
        method:"post",
        headers:{
          "X-Nideshop-Token": this.$cookie.get('token')
        }
      }).then(res => {
        let data = res.data.categoryEntities;
        data.forEach((post,index) => {
          let p = {
            id: post.id,
            name: post.name
          };
          this.typeslots[0].values.push(p);
          if(post.id == this.postdata.category) this.categoryName = post.name;
        });
      })
    });
  },
  methods: {
    // 获取地址
    region(val){
      this.areadata = val;
    },
    adressfn(){
      this.visible = true;
    },
    visiblefn(val){
      this.visible = val;
    },
    // 商家类型
    categoryfn(){
      this.typeVisible = true;
    },
    typechange(picker, values){
      this.typeModel = values[0];
    },
    quedingfn(){
      this.typeVisible = false;
      this.categoryName = this.typeModel.name;
      this.postdata.category = this.typeModel.id;
    },
    quxiaofn(){
      this.typeVisible = false;
    },
    // 营业时间
    openVisiblefn(val){
      this.openVisible = val;
    },
    openTimefn(val){
      this.postdata.openTime = val;
    },
    openTimedata(){
      this.openVisible = true;
    },
    // 图片上传
    facadePhotofn(){

    },
    facadePhotoChange(val){
      if(val.url){
        this.postdata.facadePhoto = val.url;
        this.facadePhoto = val.url;
      }else{
        this.postdata.facadePhoto = '';
        this.facadePhoto = '';
        this.imguploadfn();
      };
    },
    shopImgAdd(){
      if(this.shopImg.length >= 8){
        Toast('店铺照片限制在8张以内，请勿添加过多图片。');
      }else{
        this.shopImgIndex = this.shopImg.length;
      };
    },
    shopImgfn(ev,i){
      this.shopImgIndex = i;
    },
    shopImgChange(val){
      if(this.shopImgIndex == this.shopImg.length){
        this.shopImg.push(val.url);
        if(this.shopImg.length >= 8){
          this.imgUploadStopAdd = true;
        }
      }else{
        if(val.url){
          this.shopImg[this.shopImgIndex] = val.url;
        }else{
          this.shopImg.splice(this.shopImgIndex,1);
          if(this.shopImg.length < 8){
            this.imgUploadStopAdd = false;
          };
          this.imguploadfn();
        };
        this.shopImgIndex = null;
      };
      // 当图片少于2张时不能删除
      if(this.shopImg.length <= 2){
        this.imgClear = true;
      }else{
        this.imgClear = false;
      }
    },
    imguploadfn(){
      let data = this.postdata;
      let areadata = this.areadata;
      let post = {
        "imgUrls":this.shopImg,
        "merchant":{
          "facadePhoto": data.facadePhoto,
          "bizLicence": data.bizLicence,
          "id": data.id
        }
      };
      axios.post(this.Api + 'merchant/update',post).then(res => {
        console.log(res)
      })
    },
    //提交
    submitfn(){
      if(this.shopImg.length < 2){
        Toast('店铺照片上传至少两张');
        return false;
      };
      this.postupdata();
    },
    postupdata(){
      Indicator.open();
      let data = this.postdata;
      let areadata = this.areadata;
      let post = {
        "imgUrls":this.shopImg,
        "merchant":{
          "address": data.address,
          "bizLicence": data.bizLicence,
          "category": data.category,
          "city": areadata.city.name,
          "contact": data.contact,
          "contactTel": data.contactTel,
          "county": areadata.area.name,
          "facadePhoto": data.facadePhoto,
          "inveteMobile": data.inveteMobile,
          "inviter": data.inviter,
          "mobile": data.mobile,
          "name": data.name,
          "openTime": data.openTime,
          "province": areadata.prov.name,
          "remarks": data.remarks,
          // "street": areadata.street.name,
          "id": data.id
        }
      };
      axios.post(this.Api + 'merchant/update',post).then(res => {
        Indicator.close();
        Toast(res.data.errmsg);
        console.log(res)
      }).catch((err)=>{
        Indicator.close();
        Toast(err.message);
      })
    }
  }
}
</script>

<style scoped>
.cart-main{
  padding:1rem 0.5rem 0;;
}
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f2f2f2;
}
.cart-item{
  overflow:hidden;
  background:white;
  border-radius:0.4rem;
  margin-bottom:0.5rem;
}
.cart-item .cart-title{
  padding:0.3rem 0.5rem;
  background:#ffe9c9;
  color:#ec0746;
  font-size:0.72rem;
  line-height:1.4em;
}
.cart-item .cart-box{
  padding:0 0.5rem;
}
.cart-item .cart-box .cart-list{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding:0.5rem 0;
  font-size:0.6rem;
  line-height:1.4em;
  border-bottom:1px solid #eee;
}
.cart-item .cart-box .cart-list:last-child{
  border-bottom:none;
}
.cart-item .cart-box .cart-list label{
  float:left;
  width:7.5em;
  color:#333;
}
.cart-item .cart-box .cart-list .lmain{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width:calc(100% - 7.7em);
  color:#333;
}
.cart-item .cart-box .cart-list p.adress span{
  display:block;
  flex: 1;
  height:1.4em;
  word-break : break-all;
}
.cart-item .cart-box .cart-list p.adress i{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-item .cart-box .cart-list input{
  display:block;
  flex: 1;
  font-size:0.6rem;
  color:#333;
  word-break : break-all;
}
/**/
.uploadbox{
  width:150px;
  position: relative;
}
.upload{
  width:100%;
  height:100px;
  overflow:hidden;
  border-radius:5px;
}
.upload-icon{
  border:1px dashed #ccc;
  height:100%;
  text-align: center;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.upload-icon i{
  font-size:1.8rem;
  color:#ccc;
}
.imgClear{
  position:absolute;
  right:-3px;
  top:-4px;
  font-size:20px;
  border-radius:50%;
  background:white;
  color:#ec0746;
  width:18px;
  height:18px;
}
/**/
.textarea textarea{
  width:100%;
  font-size:0.7rem;
  line-height:1.4em;
}
.test-textarea-ab{
  color:#999;
}
.form-item{
  overflow:hidden;
  padding:0 0.5rem;
  font-size:0.7rem;
  color:#989898;
  margin-bottom:0.8rem;
}
.xieyi{
  float:left;
  font-size:0.6rem;
}
.xieyi .icheck{
  color:#ec0746;
}
.xieyi i{
  font-size:0.65rem;
  padding-right:0.1rem;
}
.sub{
  display:block;
  text-align: center;
  color:white;
  padding:0.4rem 0;
  width:60%;
  font-size:0.7rem;
  line-height:1.6em;
  background:#ff8f28;
  border-radius:20rem;
  margin:1rem auto;
}
.provCity label, .provCity p.lmain{
  width:auto;
}
.mint-popup{
  width:100%;
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
.cart-list1 {
  padding: 0.7rem 0;
  font-size: 0.7rem;
  line-height: 1.4em;
  align-items: center;
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
.shop {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.shop .uploadbox{
  max-width:150px;
  width:48%;
  position: relative;
}
.shop .upload {
  margin: 0 0 10px 0;
  color: #999999;
}
</style>
