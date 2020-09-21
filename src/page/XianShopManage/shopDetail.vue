<template>
  <div class="mainbox">
    <header class="mint-header">
        <mt-button icon="back" slot="left" @click="goback"></mt-button>
        <h1 class="mint-header-title">商家信息</h1>
        <div class="filter" @click="goOffer" >
          <div class="filter-title">优惠管理</div>
        </div>
    </header>
    <div class="cart-main">
       <!-- 审核情况结果 -->
      <div class="cart-item-top">
        <div class="auditIcon">
          <img :src="approvalImg" alt="">  <!-- 审核通过的icon-->
          <!-- <img src="@/assets/images/audit_no.png" alt=""> -->
        </div>
        <p class="audit_title">{{approvalStatus}}</p>
        <p class="audit_content">{{resultTip}}</p>
        <p class="audit_time" v-if="resulttime">审核时长：{{auditTime}}</p>
        <p class="audit_reason" v-if="reason">不通过原因：{{reasonText}}</p>
        <!-- <p class="audit_content" v-if="tongguo">由于该区域未能统一开放展示，请让商家耐心等候，如果区域开放，我们将第一时间通知您和商家，谢谢!</p> -->
      </div>
      <div class="cart-item">
        <div class="cart-box">
          <div class="cart-list">
            <label>入驻方式:</label>
            <p class="lmain">
              <span class="ruzhuway">{{recommendway}}</span>
            </p>
          </div>
          <div class="cart-list">
            <label>店铺分类:</label>
            <p class="lmain">
              <input type="text" :class="{red: shopClassNameCompared}" placeholder="选择店铺分类" readonly  v-model="shopClassName" @click="shopClassfn">
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
            <p class="lmain"><input type="text" :class="{red: usernameCompared}" placeholder="输入您的姓名" v-model="username"></p>
          </div>
          <div class="cart-list">
            <label>负责人手机号:</label>
            <p class="lmain">
              <input type="text" :class="{red: telCompared}" placeholder="输入手机号" v-model="tel">
              <!-- <i :class="{must:showtel}"></i> -->
            </p>
          </div>
          <div class="cart-list" v-if="inveteShow">
            <label>推荐人姓名:</label>
            <p class="lmain"><input type="text" readonly v-model="recommendname"></p>
          </div>
          <div class="cart-list" v-if="inveteShow">
            <label>推荐人手机号:</label>
            <p class="lmain"><input type="text" readonly v-model="recommendphone" ></p>
          </div>
        </div>
      </div>

      <div class="cart-item">
        <div class="cart-title">店铺信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>店铺名称:</label>
            <p class="lmain">
              <input type="text" placeholder="输入店铺名称" :class="{red: spnameCompared}" v-model="spname">
              <!-- <i :class="{must:showspname}"></i> -->
            </p>
          </div>
          <div class="cart-list">
            <label>店铺类型:</label>
            <p class="lmain">
              <input type="text" placeholder="选择店铺类型" :class="{red: categoryCompared}" readonly :data="postdata.category"  v-model="categoryName" @click="categoryfn">
              <!-- <i :class="{must:showsptype}"></i> -->
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>入驻时长:</label>
            <p class="lmain">
              <input type="text" placeholder="选择入驻时间" readonly :class="{red: enteringTimeCompared}"  v-model="enteringTime" @click="enteringfn">
              <!-- <i :class="{must:showsptime}"></i> -->
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="cart-list">
            <label>店铺服务电话:</label>
            <p class="lmain">
              <input type="text" v-model="spphone" :class="{red: spphoneCompared}" placeholder="输入店铺服务电话">
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
              <textarea v-model="address" :class="{red: addressCompared}" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"></textarea>
              <!-- <i :class="{must:showaddr}"></i> -->
            </p>
          </div>
          <div class="cart-list">
            <label>营业时间:</label>
            <p class="lmain">
              <input type="text" placeholder="选择营业时间" :class="{red: openTimeCompared}" v-model="openTime" readonly @click="openTimedata">
              <i class="el-icon-arrow-right mr-l-14"></i>
            </p>
          </div>
          <div class="carttext">
            <div class="title">店铺介绍<span>(不超过60字)</span>：</div>
            <div class="text"><textarea type="text" placeholder="请输入店铺介绍" :class="{red: shoptextCompared}" v-model="shoptext" @input="changeLength($event)"></textarea></div>
          </div>
          <!-- <div class="cart-list">
            <label>备注信息:</label>
            <p class="lmain"><input type="text" v-model="remarks" :class="{red: remarksCompared}" placeholder="请输入备注信息"></p>
          </div> -->
          <div class="cart-list bizLicence">
            <label class="tm-label">店铺营业执照:</label>
            <div class="lmain lmain2">
              <countyimgUpload :changeShow="bizLicenceChange" text="添加" :img="bizLicence" @img-upload="bizLicencefn"></countyimgUpload>
              <!-- <i :class="{must:showupload1}"></i> -->
            </div>
          </div>
          <div class="cart-list">
            <label class="tm-label">店铺门头照:</label>
            <div class="lmain lmain2">
              <countyimgUpload text="添加" :changeShow="facadePhotoChange" :img="facadePhoto" @img-upload="facadePhotofn"></countyimgUpload>
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
                <countyimgUpload text="720x400" v-for="(item,index) in shopImg" :changeShow="item != beforeDataImgUrls[index] && beforeDataImgUrls.length > 0" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn(index)"></countyimgUpload>
              </template>
              <template v-if="shopImg.length == 0">
                <countyimgUpload text="720x400" @img-upload="shopImgChange" @click.native="shopImgfn(0)"></countyimgUpload>
              </template>

              <countyimgUpload :add="true" text="添加更多" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange" @click.native="shopImgAdd"></countyimgUpload>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="form-item" v-if="xieyiCompared">
      <span class="xieyi"><i class="el-icon-circle-check" :class="{icheck:showxieyi}" @click="toggle"></i>同意申请协议</span>
    </div> -->
    <div class="sub">
      <mt-button @click="subfn" :disabled="disabled" v-if="showChangBtn">{{subText}}</mt-button>
      <mt-button @click="cancelfn" :disabled="disabled" v-if="cancelShow">取消申请</mt-button>
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
    <!-- 合同协议 -->
    <!--<img id="preview" style="display: none" :src="contractUrl" preview preview-text="推广商合同协议">-->
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
      // topnav:{
      //   title:'商家信息'
      // },
      id:'',
      approvalImg: "@/assets/images/audit_ok.png",
      username:'',
      tel:'',
      recommendname: '',
      recommendphone: '',
      spname:'',
      categoryName:'',
      spphone: '',
      address:'',
      remarks: '',
      dialogImageUrl: '',
      dialogVisible: false,
      showxieyi:false,//协议图标控制
      showusername:true,//必填图标控制
      showsub:true,//控制上传按钮
      areadata:null,
      // visible:false,
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
      recommendway: '自主进驻',
      disabled: false,
      reason: false,
      tongguo: false,
      approvalStatus: "", //审核状态标题
      resultTip:"",
      resulttime: false,    //审核时长显示
      auditTime:"",   //审核时长
      showChangBtn: true,   //控制修改按钮显示
      reasonText: "",   //不通过原因
      showOffer: false,
      uploader: "",
      cancelShow: false,
      changId: '', //更改后的id
      subText: "确定提交",
      //提交前后数据对比
      shopClassNameCompared: false,
      usernameCompared: false,
      telCompared: false,
      spnameCompared: false,
      categoryCompared: false,
      enteringTimeCompared: false,
      spphoneCompared: false,
      addressCompared: false,
      openTimeCompared: false,
      shoptextCompared: false,
      remarksCompared: false,
      bizLicenceChange: false,
      facadePhotoChange: false,
      beforeDataImgUrls: [],
      xieyiCompared: true,
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
  mounted() {
     
  },
  
  methods: {
    // clearaddr(){this.address?this.showaddr=false:this.showaddr=true},
    // clearsptype(){this.categoryName?this.showsptype=false:this.showsptype=true},
    // clearspname(){this.spname?this.showspname=false:this.showspname=true},
    // clearuername(){this.username?this.showusername=false:this.showusername=true},
    // cleartel(){this.tel?this.showtel=false:this.showtel=true},
    // clearspphone(){this.spphone?this.shopTel=false:this.shopTel=true},
    // 取消申请弹窗
    cancelfn() {
      let that = this
      MessageBox({
        title: '提示',
        message: '是否取消本次店铺信息更改申请',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        closeOnClickModal: false
      }).then(action => {
        if(action ==='confirm'){
          axios({
            method: 'get',
            url: that.Api + "merchant/cancerModify?id=" + that.changId,
            // url: "http://192.168.1.140:8080/api/merchant/cancerModify?id=" + that.changId,
          }).then(res =>{
            console.log(res)
            if(res.data.errno == 0) {
              Toast(res.data.data)
              that.$router.go(0)
              
            }else {
              Toast(res.data.errmsg)
            }
          })
                    
        }
      });
    },
    goback() {
      if(this.$route.query.platform == 'android'){
        window.action.backAPP();
      }else if(this.$route.query.platform == 'ios'){
        window.action.backAPPiOS();
      }else{
        this.$router.go(-1);
      }
    },
    goOffer() {
      let that = this
      that.$router.push({name:'priceMessage',params:{postId:that.$route.query.id}})
    },
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
      else{
        let expPhone = regular.RegPhone;
        if(!(expPhone.test(this.tel))){
          this.toasfn('输入的手机号码格式错误！');
          return false;
        };
      }
      // else if (this.showxieyi === false) {
      //   Toast('请勾选是否同意申请协议','middle')
      //   return false;
      // }
      
        // if(that.tel != that.$cookie.get("userPhone")) {
        //   this.toasfn('输入注册的手机号！');
        //   return false;
        // }
        let post = {
          "imgUrls":this.shopImg,
          "merchant":{
              // "userid": that.$cookie.get('userid'),
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
              "uploader": that.uploader,
              "facadePhoto": that.facadePhoto,
              "bizLicence": that.bizLicence,
          },
          
        };
        if(that.id!='') post["merchant"]["id"] = that.id;
        that.disabled = true
        that.restrictedSubmission()
        console.log(post);
        axios({
        method: "post",
        url: that.Api + "merchant/helpModify?userId=" + that.$cookie.get('userid'),
        // url: "http://192.168.1.140:8080/api/merchant/helpModify?userId=" + that.$cookie.get('userid'),
        data: post
        })
        .then(res => {
          console.log(res)
          if(res.data.errno == 0) {
            Toast(res.data.errmsg);
            that.$router.push({name: 'xianShopManage'})
          }
        })
        .catch(err => {
          console.log(err);
          //  that.toasfn(err.message);
        });
    },
    // 获取邀请人信息
    getInveterInfo() {
      
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
      // this.bizLicence?this.showupload1=false:this.showupload1=true;
    },
    facadePhotofn(val) {
      this.facadePhoto = val.url;
      // this.facadePhoto?this.showupload2=false:this.showupload2=true;
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
    //初始化申请人数据
    initialization() {
      this.tel = this.$cookie.get("userPhone")
      // this.cleartel()
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
    //时间转换
    timetypefn(val){
      for(var i=0;i<this.timeslots[0].values.length;i++){
        if(this.timeslots[0].values[i].id == val){
          return this.timeslots[0].values[i].name;
        }
      }
    },
    //店铺转换
    shoptypefn(val){
      for(var i=0;i<this.shopslots[0].values.length;i++){
        if(this.shopslots[0].values[i].id == val){
          return this.shopslots[0].values[i].name;
        }
      }
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
      this.shopClassId = this.shopModel.id
    },
     // 营业时间
    openVisiblefn(val){
      this.openVisible = val;
    },
    openTimefn(val){
      this.openTime = val;
      console.log(val)
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
    //限制多次点击提交按钮
    restrictedSubmission() {
      let mytime = setTimeout(
        ()=>{ 
          this.disabled = false
          clearTimeout(mytime);
        }, 5000)
    },
     // 转换类型
    typefn(val){
      for(var i=0;i<this.typeslots[0].values.length;i++){
        if(this.typeslots[0].values[i].id == val){
          return this.typeslots[0].values[i].name;
        }
      }
    },
    typelistfn() {
       // 店铺类型选择
      axios({
        url: this.Api + "/merchant/categoryList",
        method: "post",
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token")
        }
      }).then(res => {
        let data = res.data.categoryEntities;
        data.forEach((post, index) => {
          let p = {
            id: post.id,
            name: post.name
          };
          this.typeslots[0].values.push(p);
          // console.log(this.typeslots)
          if (post.id == this.postdata.category) this.categoryName = post.name;
        });
      });
    },
    //获取数据
    getdata() {
      Indicator.open();
      let that = this;
      axios({
        url: this.Api + "merchant/queryModify?id=" + that.$route.query.id,
        method: "get"
      }).then(res => {
          console.log(res);
          Indicator.close();
          if (res.data.errno == 0) {
            let data = res.data.data;

            if(data.merchant.status == 0) {
              that.approvalStatus = "店铺审核中！";
              that.resultTip = "您的店铺入驻申请正在审核中，请耐心等候！"
              that.auditTime = res.data.errmsg
              that.resulttime = true
              that.showChangBtn = false
              that.xieyiCompared = false
              that.approvalImg =  require("@/assets/images/review.png")
            }
            if(data.merchant.status == 1) {
              that.approvalStatus = "店铺审核通过！";
              that.resultTip = "您的店铺入驻申请已通过！"
              that.showOffer = true
              that.tongguo = true
              that.approvalImg =  require("@/assets/images/audit_ok.png")
              that.subText = "提交更改申请"
            }
            if(data.merchant.status == 2) {
              that.approvalStatus = "店铺审核不通过！"
              that.resultTip = "您的店铺入驻申请审核不通过，请重新提交审核！"
              that.reason = true
              that.reasonText = res.data.errmsg
              that.approvalImg =  require("@/assets/images/audit_no.png")
              that.subText = "重新提交"
            }
            if (data.merchant.uploader == 1) {
              that.recommendway = "协助进驻"
              that.uploader = data.merchant.uploader
            }
            that.postdata = data.merchant;
            that.username = data.merchant.contact;
            that.tel = data.merchant.contactTel;
            that.spname = data.merchant.name;
            that.postdata.category = data.merchant.category
            that.spphone = data.merchant.mobile;
            that.openTime = data.merchant.openTime;
            that.address = data.merchant.address;
            that.categoryName = that.typefn(data.merchant.category)
            that.enteringTime = that.timetypefn(data.merchant.timeRange)
            that.enteringTimeId = data.merchant.timeRange
            that.shopClassName = that.shoptypefn(data.merchant.storeType)
            that.shopClassId = data.merchant.storeType
            that.shoptext = data.merchant.introduce
            that.remarks = data.merchant.remarks
            that.recommendname = data.merchant.inviterName
            that.recommendphone = data.merchant.inveteMobile
            that.categoryId = data.merchant.category
            // that.IDCardZ = data.qualification.frontIdentity,
            // that.IDCardF = data.qualification.reverseIdentity,
            that.bizLicence = data.merchant.bizLicence;
            that.facadePhoto = data.merchant.facadePhoto;
            // that.otherZiZhiImg = data.otherQualication
            that.shopImg = data.imgUrls;
            that.id = data.merchant.id;
            if(data.merchant.inviter == "" || data.merchant.inviter == null) {
              that.inveteShow = false
            }
            
            if (!this.areadata) this.areadata = {};
            if (data.merchant.province && data.merchant.province != "") {
              this.areadata["prov"] = {};
              this.areadata["prov"].name = data.merchant.province;
            }
            if (data.merchant.city && data.merchant.city != "") {
              this.areadata["city"] = {};
              this.areadata["city"].name = data.merchant.city;
            }
            if (data.merchant.county && data.merchant.county != "") {
              this.areadata["area"] = {};
              this.areadata["area"].name = data.merchant.county;
            }
          }
          if(res.data.errno == 1) {
            let data = res.data.data.afterData;
            let beforeData = res.data.data.beforeData
            if(res.data.data.status == 0) {
              that.approvalStatus = "店铺信息更改申请审核中";
              that.resultTip = "您的店铺入驻申请正在审核中，请耐心等候！"
              that.auditTime = res.data.errmsg
              that.resulttime = true
              that.showChangBtn = false
              that.approvalImg =  require("@/assets/images/review.png")
              that.xieyiCompared = false
              that.cancelShow = true
              that.changId = res.data.data.id
              //审核中内容前后对比
              
              if(data.merchant.contact != beforeData.merchant.contact) {
                that.usernameCompared = true
              }
              if(data.merchant.storeType != beforeData.merchant.storeType) {
                that.shopClassNameCompared = true
              }
              if(data.merchant.contactTel != beforeData.merchant.contactTel) {
                that.telCompared = true
              }
              if(data.merchant.name != beforeData.merchant.name) {
                that.spnameCompared = true
              }
              if(data.merchant.category != beforeData.merchant.category) {
                that.categoryCompared = true
              }
              if(data.merchant.timeRange != beforeData.merchant.timeRange) {
                that.enteringTimeCompared = true
              }
              if(data.merchant.mobile != beforeData.merchant.mobile) {
                that.spphoneCompared = true
              }
              if(data.merchant.address != beforeData.merchant.address) {
                that.addressCompared = true
              }
              if(data.merchant.openTime != beforeData.merchant.openTime) {
                that.openTimeCompared = true
              }
              if(data.merchant.introduce != beforeData.merchant.introduce) {
                that.shoptextCompared = true
              }
              if(data.merchant.remarks != beforeData.merchant.remarks) {
                that.remarksCompared = true
              }
              if(data.merchant.bizLicence != beforeData.merchant.bizLicence) {
                that.bizLicenceChange = true
              }
              if(data.merchant.facadePhoto != beforeData.merchant.facadePhoto) {
                that.facadePhotoChange = true
              }
              that.beforeDataImgUrls = beforeData.imgUrls
            }
            if(res.data.data.status == 1) {
              that.approvalStatus = "店铺信息更改申请审核通过";
              // that.resultTip = "您的店铺入驻申请已通过！"
              that.showOffer = true
              that.tongguo = true
              that.approvalImg =  require("@/assets/images/audit_ok.png")
              that.subText = "提交更改申请"
            }
            if(res.data.data.status == 2) {
              that.approvalStatus = "店铺信息更改申请审核不通过"
              // that.resultTip = "您的店铺入驻申请审核不通过，请重新提交审核！"
              that.reason = true
              that.reasonText = res.data.errmsg
              that.approvalImg =  require("@/assets/images/audit_no.png")
              that.subText = "重新提交"

              that.postdata = beforeData.merchant;
              that.username = beforeData.merchant.contact;
              that.tel = beforeData.merchant.contactTel;
              that.spname = beforeData.merchant.name;
              that.postdata.category = beforeData.merchant.category
              that.spphone = beforeData.merchant.mobile;
              that.openTime = beforeData.merchant.openTime;
              that.address = beforeData.merchant.address;
              that.categoryName = that.typefn(beforeData.merchant.category)
              that.enteringTime = that.timetypefn(beforeData.merchant.timeRange)
              that.enteringTimeId = beforeData.merchant.timeRange
              that.shopClassName = that.shoptypefn(beforeData.merchant.storeType)
              that.shopClassId = beforeData.merchant.storeType
              that.shoptext = beforeData.merchant.introduce
              that.remarks = beforeData.merchant.remarks
              that.recommendname = beforeData.merchant.inviterName
              that.recommendphone = beforeData.merchant.inveteMobile
              that.categoryId = beforeData.merchant.category
              that.bizLicence = beforeData.merchant.bizLicence;
              that.facadePhoto = beforeData.merchant.facadePhoto;
              that.shopImg = beforeData.imgUrls;
              that.id = beforeData.merchant.id;

              if(beforeData.merchant.inveteMobile == "" || beforeData.merchant.inveteMobile == null) {
                that.inveteShow = false
              }
              if (!this.areadata) this.areadata = {};
              if (beforeData.merchant.province && beforeData.merchant.province != "") {
                this.areadata["prov"] = {};
                this.areadata["prov"].name = beforeData.merchant.province;
              }
              if (beforeData.merchant.city && beforeData.merchant.city != "") {
                this.areadata["city"] = {};
                this.areadata["city"].name = beforeData.merchant.city;
              }
              if (beforeData.merchant.county && beforeData.merchant.county != "") {
                this.areadata["area"] = {};
                this.areadata["area"].name = beforeData.merchant.county;
              }

              if (beforeData.merchant.uploader == 1) {
                that.recommendway = "协助进驻"
                that.uploader = beforeData.merchant.uploader
              }
              return false

            }
            if (data.merchant.uploader == 1) {
              that.recommendway = "协助进驻"
              that.uploader = data.merchant.uploader
            }

            that.postdata = data.merchant;
            that.username = data.merchant.contact;
            that.tel = data.merchant.contactTel;
            that.spname = data.merchant.name;
            that.postdata.category = data.merchant.category
            that.spphone = data.merchant.mobile;
            that.openTime = data.merchant.openTime;
            that.address = data.merchant.address;
            that.categoryName = that.typefn(data.merchant.category)
            that.enteringTime = that.timetypefn(data.merchant.timeRange)
            that.enteringTimeId = data.merchant.timeRange
            that.shopClassName = that.shoptypefn(data.merchant.storeType)
            that.shopClassId = data.merchant.storeType
            that.shoptext = data.merchant.introduce
            that.remarks = data.merchant.remarks
            that.recommendname = data.merchant.inviterName
            that.recommendphone = data.merchant.inveteMobile
            that.categoryId = data.merchant.category
            that.bizLicence = data.merchant.bizLicence;
            that.facadePhoto = data.merchant.facadePhoto;
            that.shopImg = data.imgUrls;
            that.id = data.merchant.id;

            if(data.merchant.inveteMobile == "" || data.merchant.inveteMobile == null) {
              that.inveteShow = false
            }
            
            if (!this.areadata) this.areadata = {};
            if (data.merchant.province && data.merchant.province != "") {
              this.areadata["prov"] = {};
              this.areadata["prov"].name = data.merchant.province;
            }
            if (data.merchant.city && data.merchant.city != "") {
              this.areadata["city"] = {};
              this.areadata["city"].name = data.merchant.city;
            }
            if (data.merchant.county && data.merchant.county != "") {
              this.areadata["area"] = {};
              this.areadata["area"].name = data.merchant.county;
            }
          };
          this.mapadressfn();
      })
      .catch(err => {
        Indicator.close();
        // Toast(err.message);
      });
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
    this.typelistfn()
    this.getInveterInfo();
    // this.initialization();
    // 重新申请获取数据
    this.getdata()
  },
}
</script>

<style scoped>
.cart-main{
  padding:1rem 0.5rem 0;;
  margin-top: 2rem;
}
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f2f2f2;
}
/* 头部 */
.mainbox >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
}
.mainbox .filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  position: absolute;
  right: 10px;
}
.mainbox .filter .jiantou {
  width: 0.65rem;
  height: 0.6rem;
  color: #fff;
  margin-left: 0.1111rem;
}
.mainbox .filter .filter-title {
  font-size: 0.5556rem /* 25/45 */;
}
.cart-item{
  overflow:hidden;
  background:white;
  border-radius:0.4rem;
  margin-bottom:0.5rem;
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
.cart-item-top .audit_content,.cart-item-top .audit_time,.cart-item-top .audit_reason {
  color: #666666;
  font-size: 0.5333rem;
  text-align: center;
  /* margin-bottom: 1.2222rem; */
  line-height: 0.8rem;
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
  font-size: 0.6rem
}
.mr-l-14 {
  margin-left: .583333rem;
}
.black {
  color: #888888;
  font-size: 0.6rem
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
.cart-item .cart-box .cart-list .red {
  color: #ec0746;
}
.carttext .text .red {
  color: #ec0746;
}
.cart-list1 .shop-tip-title {
  justify-content: flex-start;
}
.shop-tip {
  font-size: 12px;
}
</style>
