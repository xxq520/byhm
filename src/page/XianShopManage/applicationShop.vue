<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="cart-main">
      <div class="cart-item">
        <div class="cart-box">
          <div class="cart-list">
            <label>入驻方式:</label>
            <p class="lmain">
              <span class="ruzhuway">协助入驻</span>
            </p>
          </div>
          <div class="cart-list">
            <label>店铺分类:</label>
            <p class="lmain">
              <input type="text" placeholder="选择店铺分类" readonly  v-model="shopClassName" @click="shopClassfn">
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
         
        </div>
      </div>
      <div class="cart-item">
        <div class="cart-title">店铺负责人</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>负责人姓名:</label>
            <p class="lmain"><input type="text" placeholder="输入您的姓名" v-model="username"></p>
          </div>
          <div class="cart-list">
            <label>负责人手机号:</label>
            <p class="lmain">
              <input type="text" placeholder="输入手机号" v-model="tel">
              <!-- <i :class="{must:showtel}"></i> -->
            </p>
          </div>
          <div class="cart-list" v-if="inveteShow">
            <label>推荐人姓名:</label>
            <p class="lmain"><input type="text" readonly v-model="recommendname" placeholder="输入推荐人姓名"></p>
          </div>
          <div class="cart-list" v-if="inveteShow">
            <label>推荐人手机号:</label>
            <p class="lmain"><input type="text" readonly v-model="recommendphone"  placeholder="输入推荐人手机号"></p>
          </div>
        </div>
      </div>

      <div class="cart-item">
        <div class="cart-title">店铺信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>店铺名称:</label>
            <p class="lmain">
              <input type="text" placeholder="输入店铺名称" v-model="spname">
              <!-- <i :class="{must:showspname}"></i> -->
            </p>
          </div>
          <div class="cart-list">
            <label>店铺类型:</label>
            <p class="lmain">
              <input type="text" placeholder="选择店铺类型" readonly :data="postdata.category"  v-model="categoryName" @click="categoryfn">
              <!-- <i :class="{must:showsptype}"></i> -->
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
       
          <div class="cart-list">
            <label>入驻时长:</label>
            <p class="lmain">
              <input type="text" placeholder="选择入驻时间" readonly  v-model="enteringTime" @click="enteringfn">
              <!-- <i :class="{must:showsptime}"></i> -->
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>店铺服务电话:</label>
            <p class="lmain">
              <input type="text" v-model="spphone" placeholder="输入店铺服务电话">
              <!-- <i :class="{must:shopTel}"></i> -->
            </p>
          </div>
          <div class="cart-list address-list" @click="adressfn">
            <label>店铺所属地区:</label>
            <p class="lmain">
              <span v-if="!areadata" class="black">请选择店铺所属地区</span>
              <label v-else class="diqu">
                <span>{{ areadata.prov.name }}</span>
                <span>{{ areadata.city.name }}</span>
                <span>{{ areadata.area.name }}</span>
                <!-- <span>{{ areadata.street.name }}</span> -->
              </label>
              <i class="el-icon-arrow-right mr-l-14"></i>
              <!-- <i :class="{must:showspdiqu}"></i> -->
            </p>
          </div>

          <div class="cart-list textarea">
            <!-- <label>填写详细地址:</label> -->
            <p class="lmain address-text">
              <textarea v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"></textarea>
              <!-- <i :class="{must:showaddr}"></i> -->
            </p>
          </div>
          <div class="cart-list">
            <label>营业时间:</label>
            <p class="lmain">
              <input type="text" placeholder="选择营业时间" v-model="openTime" readonly @click="openTimedata">
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="carttext">
            <div class="title">店铺介绍<span>(不超过60字)</span>：</div>
            <div class="text"><textarea type="text" placeholder="请输入店铺介绍" v-model="shoptext" @input="changeLength($event)" ></textarea></div>
          </div>
          <div class="carttext">
              <div class="title">店铺标签<span>(不超过15字)</span>：</div>
              <div class="text"><textarea type="text" placeholder="添加关键词可以精准搜索到您的店铺 如快餐，西餐等" v-model="label"
                      @input="changeLength2($event)"></textarea></div>
          </div>
          <div class="cart-list bizLicence">
            <label class="tm-label">店铺营业执照:</label>
            <div class="lmain lmain2">
              <imgUpload text="添加" :img="bizLicence" @img-upload="bizLicencefn"></imgUpload>
              <!-- <i :class="{must:showupload1}"></i> -->
            </div>
          </div>
          <div class="cart-list">
            <label class="tm-label">店铺门头照:</label>
            <div class="lmain lmain2">
              <imgUpload text="添加" :img="facadePhoto" @img-upload="facadePhotofn"></imgUpload>
              <!-- <i :class="{must:showupload2}"></i> -->
            </div>
          </div>
          <div class="cart-list1">
            <div class="title shop-tip-title">
              <label>上传店铺照片</label>
              <div class="shop-tip">(至少上传2张，最多上传8张):</div>
            </div>
            <div class="shop">
              <template v-if="shopImg.length > 0">
                <imgUpload text="720x400" v-for="(item,index) in shopImg" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
              </template>
              <template v-if="shopImg.length == 0">
                <imgUpload text="720x400" @img-upload="shopImgChange" @click.native="shopImgfn(0)"></imgUpload>
              </template>

              <imgUpload :add="true" text="添加更多" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange" @click.native="shopImgAdd"></imgUpload>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-item">
      <span class="xieyi"><i class="el-icon-circle-check" :class="{icheck:showxieyi}" @click="toggle"></i>是否同意申请协议</span>
    </div>
    <div class="sub">
      <mt-button @click="subfn" :disabled="disabled">上传提交</mt-button>
    </div>
    <!-- <div class="sub">
      <mt-button :disabled="showsub" @click="subfn">上传提交</mt-button>
    </div> -->
    <!-- <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup> -->
    <!--商店类型选择-->
    <mt-popup v-model="typeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
    </mt-popup>
    <!-- 协议弹窗 -->
    <!-- <mt-popup v-model="popupVisible" class="contract">
        <div class="protocol">
            <iframe :src="'/static/pdf/web/viewer.html?file=' + fileUrl" height="560" width="100%"></iframe>
        </div>
    </mt-popup> -->
    <!--商店入驻时间选择-->
    <mt-popup v-model="timeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="timequxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="timequedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="timeslots" value-key="name" @change="timechange"></mt-picker>
    </mt-popup>
    <!-- 店铺类型 -->
    <mt-popup v-model="shopVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="shopquxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="shopquedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="shopslots" value-key="name" @change="shopchange"></mt-picker>
    </mt-popup>
    <!-- 营业时间 -->
    <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>
   
    <picture-viewer v-if="showxieyi" :imgUrl.sync="imgUrl"></picture-viewer>
  </div>
</template>

<script>
import regular from '@/assets/js/regular';
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'shopMessage',
  data () {
    return {
      topnav:{
        title:'邀请申请表'
      },
      id:'',
      username:'',
      tel:'',
      recommendname: '',
      recommendphone: '',
      spname:'',
      categoryName:'',
      spphone: '',
      address:'',
      remarks: '',
      label:'',
      dialogImageUrl: '',
      dialogVisible: false,
      showxieyi:false,//协议图标控制
      showusername:true,//必填图标控制
      showsub:true,//控制上传按钮
      areadata:null,
      visible:false,
      typeVisible:false,
      bizLicence:null,
      facadePhoto:null,
      shopImg: [],
      shopImgIndex:null,
      imgUploadStopAdd:false,
      shopImgShow: false,
      postdata:new Object(),
      typeslots:[
        {
          flex: 1,
          values: [],
          textAlign: 'center'
        }
      ],
      categoryId: null,
      inveteShow: true,
      inveteCard: '',
      imgUrl:[{
          url:require("@/assets/images/contract/shangjia.png"),
          name:'惠盟商家合同协议'
      }],
      // contractUrl: require("@/assets/images/contract/shangjia.jpg"),
      enteringTime: null, //入驻时间
      enteringTimeId: null,
      showsptime: true,
      timeVisible: false,
      timeslots: [
         {
          flex: 1,
          values: [
            {id: '0', name: '半年'},
            {id: '1', name: '一年'},
            {id: '2', name: '一年半'},
            {id: '3', name: '二年'},
          ],
          className: 'slot1',
          textAlign: 'center'
        },
      ],
      shopClassName: null, // 店铺分类
      shopClassId: null,
      shopVisible: false,
      shopslots: [
         {
          flex: 1,
          values: [
            {id: '0', name: '企业'},
            {id: '1', name: '个体工商户'},
            {id: '2', name: '微小商户'},
          ],
          className: 'slot1',
          textAlign: 'center'
        },
      ],
      openTime:'',    //营业时间
      openVisible:false,
      shoptext: '',
      disabled: false
    }
  },
  computed: {
    ...mapState(["mapPost"])
  },
  watch:{
    mapPost(val){
      if(val && val.point){
        this.mapadress = val;
        this.mapadressfn();
        this.removeMapPost();
      }
    },
  },
  beforeRouteLeave (to, from, next) {


  sessionStorage.removeItem("getpost");
  
  next();
  },
  mounted() {
     // 类型
      axios({
        url:this.Api + '/merchant/categoryList',
        method:"post",
        headers:{
          "X-Nideshop-Token": this.$cookie.get('token')
        }
      }).then(res => {
	    console.log(res)
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
  },
  updated() {
    // if (this.facadePhoto && this.bizLicence && this.username && this.tel && this.spname && this.categoryName && this.address && this.showspdiqu === false  &&this.showupload3 === false && this.showxieyi === true) {
    //   this.showsub = false
    // }
  },
  methods: {
    // clearaddr(){this.address?this.showaddr=false:this.showaddr=true},
    // clearsptype(){this.categoryName?this.showsptype=false:this.showsptype=true},
    // clearspname(){this.spname?this.showspname=false:this.showspname=true},
    // clearuername(){this.username?this.showusername=false:this.showusername=true},
    // cleartel(){this.tel?this.showtel=false:this.showtel=true},
    // clearspphone(){this.spphone?this.shopTel=false:this.shopTel=true},

    // 提交店铺申请
    subfn(){
      // console.log(this.username);
      let that = this;
      // if (!this.facadePhoto || !this.bizLicence || !this.username ||!this.tel || !this.spname || !this.categoryName || !this.address || this.showupload3 || this.showspdiqu) {
      //   Toast('信息输入不全','middle')
      // }
      if (that.shopClassName == null){
        Toast('请选择店铺分类','middle')
        return false
      }else if (that.username == ''){
        Toast('负责人姓名不能为空','middle')
        return false
      } else if(that.tel == '') {
        Toast('负责人手机不能为空','middle')
        return false
      }else if(that.spname == '') {
        Toast('店铺名不能为空','middle')
        return false
      }else if(that.spname == '') {
        Toast('店铺名不能为空','middle')
        return false
      }else if(that.categoryName == '') {
        Toast('请选择店铺类型','middle')
        return false
      }else if(that.enteringTime == null) {
        Toast('请选择入驻时长','middle')
        return false
      }else if(that.spphone == '') {
        Toast('请输入店铺服务电话','middle')
        return false
      } else if(that.areadata == null) {
        Toast('请选择店铺所属地区','middle')
        return false
      }else if(that.address == '') {
        Toast('请输入详细地址','middle')
        return false
      }else if(that.openTime == '') {
        Toast('请选择营业时间','middle')
        return false
      }else if(that.bizLicence == null) {
        Toast('请上传营业执照','middle')
        return false
      }else if(that.facadePhoto == null) {
        Toast('请上传店铺门头照','middle')
        return false
      }else if(that.shopImg.length == 0 ) {
        Toast('请上传店铺照片','middle')
        return false
      }else if(that.shopImg.length < 2 ) {
        Toast('最少上传2张店铺照','middle')
        return false
      }
      else if (this.showxieyi === false) {
        Toast('请勾选是否同意申请协议','middle')
        return false;
      }else{
        let expPhone = regular.RegPhone;
        if(!(expPhone.test(this.tel))){
          this.toasfn('您输入的负责人手机号码格式错误！');
          return false;
        };
      }
        // if(that.tel != that.$cookie.get("userPhone")) {
        //   this.toasfn('输入注册的手机号！');
        //   return false;
        // }
        let post = {
          "imgUrls":this.shopImg,
          "merchant":{
              // "userid": that.$cookie.get('userid'),
              "label":that.label,
              "contact": that.username,
              "contactTel": that.tel,
              "inviterName": that.recommendname,
              "inveteMobile": that.recommendphone,
              "name": that.spname,
              "category": that.categoryId,
              "mobile": that.spphone,
              "province": that.areadata.prov.name,
              "city": that.areadata.city.name,
              "county": that.areadata.area.name,
              // "street": that.areadata.street.name,
              "address": that.address,
              "remarks": that.remarks,
              "timeRange": that.enteringTimeId,
              "storeType": that.shopClassId,
              "openTime": that.openTime,
              "introduce": that.shoptext,
              "uploader": 1,
              "facadePhoto": that.facadePhoto,
              "bizLicence": that.bizLicence,
          },
          // "qualification": {
          //     "facadePhoto": that.facadePhoto,
          //     "bizLicence": that.bizLicence,
          // }
        };
       
        console.log(post);
        that.disabled = true
        that.restrictedSubmission()
        axios({
          method: "post",
          url: that.Api + "merchant/AssistMerchantToSettle",
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: post
        }).then(res => {
          console.log(res)
          if(res.data.errno == 0) {
            Toast(
            {message:res.data.data,
            duration: 4000
            })
            that.$router.push({name: 'xianShopManage'})
          }else {
            Toast( {message:res.data.errmsg,
              duration: 4000
            })
          }
        }).catch((err) => {
           console.log(err)
          //  that.toasfn(err.message);
        })
        

    },
    // 获取邀请人信息
    getInveterInfo() {
      let that = this
      that.recommendname = that.$cookie.get("nickname")
      that.recommendphone = that.$cookie.get("userPhone")
    },

    toggle(){
      this.showxieyi = !this.showxieyi;

      //if(this.showxieyi) {
      //  document.getElementById('preview').click();
      //}

    },
    adressfn(){
      // this.visible = true;
      // this.showspdiqu = false
      this.changeMapPost(this.mapadress);
      this.changeMap(this.mapadress);
      this.$router.push({path:'/mapAdress',query:{id: this.id}});
    },
    // 获取地址
    // region(val){
    //   this.areadata = val;
    // },
    // visiblefn(val){
    //   this.visible = val;
    // },
    toasfn(msg){
      Toast({
        message: msg,
        position: 'middle',
        duration: 2000
      });
    },
    // 上传图片
    bizLicencefn(val){

      this.bizLicence = val.url;
      this.bizLicence?this.showupload1=false:this.showupload1=true;
    },
    facadePhotofn(val) {
      this.facadePhoto = val.url;
      this.facadePhoto?this.showupload2=false:this.showupload2=true;
    },

    shopImgAdd(){
      if(this.shopImg.length >= 8){
        Toast('图片限制在8张以内！');
      }else{
        this.shopImgIndex = this.shopImg.length;
      }
    },
    shopImgfn(i){
      this.shopImgIndex = i;
    },
    shopImgChange(val){
      if(this.shopImgIndex == this.shopImg.length){
        this.shopImg.push(val.url)
        // if(this.shopImg.length>=2) {
        //   this.showupload3 = false
        // }
        if(this.shopImg.length >= 8){
          this.imgUploadStopAdd = true;
        }
      }else{
        if(val.url){
          this.shopImg[this.shopImgIndex] = val.url;
        }else{
          this.shopImg.splice(this.shopImgIndex,1)
          // if(this.shopImg.length<2) {
          //    this.showupload3 = true
          // }
          if(this.shopImg.length < 8){
            this.imgUploadStopAdd = false;
          }
          // console.log(this.shopImg.length)
        };
        this.shopImgIndex = null;
      };
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
      this.categoryId = this.typeModel.id;
      // console.log( this.categoryId);
      this.categoryName?this.showsptype=false:this.showsptype=true;
      this.postdata.category = this.typeModel.id;
    },
    quxiaofn(){
      this.typeVisible = false;
    },
    
    // 入驻时间选择
    enteringfn() {
      this.timeVisible = true;
    },
    timequxiaofn() {
      this.timeVisible = false;
    },
    timechange(picker, values){
      this.timeModel = values[0];
    },
    timequedingfn() {
      this.timeVisible = false;
      this.enteringTime = this.timeModel.name
      this.enteringTimeId = this.timeModel.id
      // this.enteringTime?this.showsptime=false:this.showsptime=true;

    },
    // 企业类型选择
    shopClassfn(){
      this.shopVisible = true;
    },
    shopquxiaofn() {
      this.shopVisible = false;
    },
    shopchange(picker, values){
      this.shopModel = values[0];
    },
    shopquedingfn() {
      this.shopVisible = false;
      this.shopClassName = this.shopModel.name
      this.shopClassId = this.timeModel.id
    },
     // 营业时间
    openVisiblefn(val){
      this.openVisible = val;
    },
    openTimefn(val){
      this.openTime = val;
    },
    openTimedata(){
      this.openVisible = true;
    },
    //判断店铺介绍字数
    changeLength(e) {
      if(this.shoptext.length>=59) {
        this.shoptext = this.shoptext.substring(0, 59)
      }

    },
      changeLength2(e) {
        
      if(this.shoptext.length>=15) {
      this.label = this.label.substring(0, 15)
      }
      },
    //限制多次点击提交按钮
    restrictedSubmission() {
      let mytime = setTimeout(
        ()=>{ 
          this.disabled = false
          clearTimeout(mytime);
        }, 5000)
    },
    mapadressfn(){
      if(this.mapadress.point){
        if(!this.areadata) this.areadata = {};
        if(this.mapadress.province && this.mapadress.province != ''){
          this.$set(this.areadata, 'prov', {name: this.mapadress.province});
        };
        if(this.mapadress.city && this.mapadress.city != ''){
          this.$set(this.areadata, 'city', {name: this.mapadress.city});
        };
        if(this.mapadress.area && this.mapadress.area != ''){
          this.$set(this.areadata, 'area', {name: this.mapadress.area});
        };
        this.address = this.mapadress.address;
        console.log(this.areadata)
      }
    },
    ...mapMutations(["changeMap","removeMap","changeMapPost","removeMapPost"])
  },
  created() {
    this.getInveterInfo();
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
.topNav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.cart-item{
  overflow:hidden;
  background:white;
  border-radius:0.4rem;
  margin-bottom:0.5rem;
  margin-top: 1.5rem;
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
  padding:0.7rem 0;
  font-size:0.7rem;
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
.cart-item .cart-box .cart-list p.lmain,.cart-item .cart-box .cart-list div.lmain2{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width:calc(100% - 7em);
  color:#333;
  margin-left: .416667rem
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
.textarea textarea{
  width:100%;
  font-size:0.6rem;
  line-height:1.4em;
}
.test-textarea-ab{
  color:#999;
}
.cart-item >>> .el-upload--picture-card{
  height:100px;
  line-height:100px;
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
  width: 10rem;
  height: 1.7778rem;
  margin:1rem auto;
}
.sub button{
  text-align: center;
  color:white;
  width:100%;
  font-size:0.7rem;
  height: 1.7778rem;
  line-height:1.6em;
  background:#ff8f28;
  border-radius:20rem;
}
.cart-item .cart-box .cart-list i.must{
  font-size:1rem;
  color:#ec0746;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-item .cart-box .cart-list i.must::before{
  content: "*";
  display:block;
  line-height:0.4em;
  padding-top:0.45em;
}
.upload{
  width:150px;
  height:100px;
  overflow:hidden;
  border-radius:5px;
  margin-left: 10px;
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
  line-height:1;
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
/* .select >>> .el-input--suffix .el-input__inner {
  padding: 0;
  border: none;
  height: auto;
  line-height: inherit;
  font-size: 0.7rem;
}
.select >>> .el-input__icon{
  line-height: inherit;
} */
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
.cart-list1 i.must::before{
  content: "*";
  line-height:0.4em;
  padding-top:0.45em;
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
.shop .uploadbox{
  max-width:150px;
  width:48%;
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
.cart-item .cart-box .address-list p.lmain{
  align-items: center;
}
.cart-item .cart-box .address-list .diqu{
  width: 10em;
  color: #888888;
  font-size: 0.6rem;
}
.mr-l-14 {
  margin-left: .583333rem;
}
.black {
  color: #888888;
  font-size: 0.6rem;
}
.cart-item .cart-box .textarea {
  align-items: center;
}
.cart-item .cart-box .textarea textarea {
  color: #888888;
}
.cart-item .cart-box .cart-list input{
  color: #888888;
}
.mainbox >>> .contract {
  background: none;
}
.protocol {
    width: 90vw;
    height:20rem;
    background: #ffffff;
    overflow-y: auto;
    margin: 0 auto;
}
.cart-item .cart-box .cart-list .tm-label {
  width: 8.5em;
}
.carttext {
  font-size: 0.7rem;
  border-bottom: 1px solid #eee;
  padding: 0.7rem 0 0 0;
}
.carttext .title {
  width: 100%;
  display: block;
  padding: 0 0 .291667rem 0;
}
.carttext .title span {
  font-size: 9px !important;
}
.carttext .text textarea {
  width: 100%;
  height: 50px;
  color: #888888;
}
.cart-item .cart-box .cart-list p.address-text {
  width: 100%;
  margin: 0;
}
.bizLicence >>> .upload {
  height: 160px;
}
.ruzhuway {
  font-size: 0.6rem;
}
.cart-list1 .shop-tip-title {
  justify-content: flex-start;
}
.shop-tip {
  font-size: 12px;
}
</style>
