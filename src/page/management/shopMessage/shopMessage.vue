<template>
  <div class="mainbox">
    <!-- <topnav :topnav="topnav"></topnav> -->
    <header class="mint-header">
      <mt-button icon="back" slot="left" @click="goback"></mt-button>
      <h1 class="mint-header-title">基本信息管理</h1>
      <!-- <div class="filter" @click="submitfn">
        <div class="filter-title">保存</div>
      </div> -->
    </header>
    <div class="cart-main">
      <div class="cart-item-top">
        <div class="auditIcon">
          <img :src="approvalImg" alt="">  <!-- 审核通过的icon-->
          <!-- <img src="@/assets/images/audit_no.png" alt=""> -->
        </div>
        <p class="audit_title">{{approvalStatus}}</p>
        <p class="audit_content">{{resultTip}}</p>
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
            <p class="lmain">
              <input type="text" placeholder="输入您的姓名" v-model="contact">
            </p>
          </div>
          <div class="cart-list">
            <label>负责人手机号:</label>
            <p class="lmain">
              <input type="text" placeholder="输入手机号" v-model="contactTel">
            </p>
          </div>
          <div class="cart-list" v-if="inviterShow">
            <label>推荐人姓名:</label>
            <p class="lmain">
              <input type="text" placeholder="输入推荐人姓名" v-model="postdata.inviterName" readonly>
            </p>
          </div>
          <div class="cart-list" v-if="inviterShow">
            <label>推荐人手机号:</label>
            <p class="lmain">
              <input type="text" placeholder="输入推荐人手机号" v-model="postdata.inveteMobile" readonly>
            </p>
          </div>
        </div>
      </div>

      <div class="cart-item">
        <div class="cart-title">店铺信息</div>
        <div class="cart-box">
          <div class="cart-list">
            <label>店铺名称:</label>
            <p class="lmain">
              <input type="text" placeholder="输入店铺名称" v-model="shopname">
            </p>
          </div>
          <div class="cart-list">
            <label>店铺类型:</label>
            <p class="lmain">
              <input
                type="text"
                placeholder="输入店铺类型"
                readonly
                :data="postdata.category"
                v-model="categoryName"
                @click="categoryfn"
              >
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
              <input type="text" placeholder="输入店铺服务电话" v-model="mobile">
            </p>
          </div>
          <!-- <div class="cart-list provCity" @click="adressfn">
            <label v-if="!areadata">地区/详细地址:</label>
            <label v-else>
              <p
                v-if="areadata.prov && areadata.prov.name && areadata.prov.name!=''"
              >{{ areadata.prov.name }}</p>
              <p
                v-if="areadata.city && areadata.city.name && areadata.city.name!=''"
              >{{ areadata.city.name }}</p>
              <p
                v-if="areadata.area && areadata.area.name && areadata.area.name!=''"
              >{{ areadata.area.name }}</p>
              <p v-if="areadata.street && areadata.street.name && areadata.street.name!=''">{{ areadata.street.name }}</p>
            </label>
            <p class="lmain adress">
              <span></span>
              <i class="el-icon-arrow-right"></i>
            </p>
          </div> -->
          <div class="cart-list address-list" @click="adressfn">
            <label>店铺所属地区:</label>
            <p class="lmain">
              <span v-if="!areadata" class="black">请选择店铺所属地区</span>
              <label v-else class="diqu">
                <span v-if="areadata.prov && areadata.prov.name && areadata.prov.name!=''">{{ areadata.prov.name }}</span>
                <span v-if="areadata.city && areadata.city.name && areadata.city.name!=''">{{ areadata.city.name }}</span>
                <span v-if="areadata.area && areadata.area.name && areadata.area.name!=''">{{ areadata.area.name }}</span>
                <!-- <span>{{ areadata.street.name }}</span> -->
              </label>
              <i class="el-icon-arrow-right mr-l-14"></i>
              <!-- <i :class="{must:showspdiqu}"></i> -->
            </p>
          </div>
          <div class="cart-list textarea">
            <textarea placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" v-model="address"></textarea>
          </div>
          <div class="cart-list">
            <label>营业时间:</label>
            <p class="lmain">
              <input
                type="text"
                placeholder="输入营业时间"
                v-model="openTime"
                readonly
                @click="openTimedata"
              >
            </p>
          </div>
          <!--<div class="cart-list">
            <label>人均消费:</label>
            <p class="lmain"><input type="text" placeholder="输入人均消费"></p>
          </div>-->
          <div class="carttext">
            <div class="title">店铺介绍<span>(不超过60字)</span>：</div>
            <div class="text"><textarea type="text" placeholder="请输入店铺介绍" v-model="introduce" @input="changeLength($event)"></textarea></div>
          </div>
            <div class="carttext">
                <div class="title">店铺标签<span>(不超过15字)</span>：</div>
                <div class="text"><textarea type="text" placeholder="添加关键词可以精准搜索到您的店铺 如快餐，西餐等" v-model="label"
                        @input="changeLength2($event)"></textarea></div>
            </div>
          <div class="cart-list bizLicence">
            <label class="tm-label">店铺营业执照:</label>
            <div class="lmain lmain2">
              <countyimgUpload text="添加" :img="bizLicence" @img-upload="bizLicencefn"></countyimgUpload>
              <!-- <i :class="{must:showupload1}"></i> -->
            </div>
          </div>
          <div class="cart-list">
            <label class="tm-label">店铺门头照:</label>
            <div class="lmain lmain2">
              <countyimgUpload text="添加" :img="facadePhoto" @img-upload="facadePhotofn"></countyimgUpload>
              <!-- <i :class="{must:showupload2}"></i> -->
            </div>
          </div>
          <div class="cart-list1">
            <div class="title">
              <label>上传店铺照片<span class="tip-text">(至少上传2张，最多上传8张):</span></label>
            </div>
            <div class="shop">
              <template v-if="shopImg.length > 0">
                <countyimgUpload
                  text="720x400"
                  :delete.sync="imgClear"
                  v-for="(item,index) in shopImg"
                  :key="index"
                  :img.sync="item"
                  @img-upload="shopImgChange"
                  @click.native="shopImgfn($event,index)"
                ></countyimgUpload>
              </template>
              <template v-if="shopImg.length == 0">
                <countyimgUpload
                  text="720x400"
                  :delete.sync="imgClear"
                  @img-upload="shopImgChange"
                  @click.native="shopImgfn($event,0)"
                ></countyimgUpload>
              </template>

              <countyimgUpload
                :add="true"
                text="添加更多"
                :stop.sync="imgUploadStopAdd"
                @img-upload="shopImgChange"
                @click.native="shopImgAdd"
              ></countyimgUpload>
            </div>
          </div>
           <div class="cart-list1" v-if="showOther">
            <div class="title">
              <label>其它材料<span class="tip-text">(不超过4张)</span>：</label>
            </div>
            <div class="shop">
              <template v-if="otherImg.length > 0">
                <countyimgUpload text="720x400" v-for="(item,index) in otherImg" :key="index" :img.sync="item" @img-upload="otherImgChange" @click.native="otherImgfn(index)"></countyimgUpload>
              </template>
              <template v-if="otherImg.length == 0">
                <countyimgUpload text="720x400" @img-upload="otherImgChange" @click.native="otherImgfn(0)"></countyimgUpload>
              </template>

              <countyimgUpload :add="true" text="添加更多" :stop.sync="imgUploadStopAdd" @img-upload="otherImgChange" @click.native="otherImgAdd"></countyimgUpload>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sub" @click="submitfn" v-if="showChangBtn" :disabled="disabled">确定修改</div>

    <!--地区选择-->
    <!-- <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup> -->
    <!--商店类型选择-->
    <mt-popup v-model="typeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
    </mt-popup>
    <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>
    <!-- 店铺类型 -->
    <mt-popup v-model="shopVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="shopquxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="shopquedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="shopslots" value-key="name" @change="shopchange"></mt-picker>
    </mt-popup>
    <!--商店入驻时间选择-->
    <mt-popup v-model="timeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="timequxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="timequedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="timeslots" value-key="name" @change="timechange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import regular from '@/assets/js/regular';
import { mapState, mapMutations } from 'vuex'
export default {
  name: "shopMessage",
  data() {
    return {
      // topnav: {
      //   title: "基本信息管理"
      // },
      id:'',
      shopid: "",
      dialogImageUrl: "",
      dialogVisible: false,
      //visible: false,
      areadata: null,
      facadePhoto: "",
      bizLicence: "",
      postdata: new Object(),
      qualification: {}, //店铺资质资质
      // 商店类型选择
      categoryName: "",
      typeVisible: false,
      typeModel: "",
      typeslots: [
        {
          flex: 1,
          values: [],
          textAlign: "center"
        }
      ],
      openVisible: false,
      shopImg: [],
      shopImgIndex: null,
      otherImg: [], //其它资质
      otherImgIndex: null,
      imgUploadStopAdd: false,
      imgClear: false,
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
      inviterShow: true,
      approvalImg: require("@/assets/images/audit_ok.png"),
      approvalStatus: "审核通过",
      recommendway: "自主进驻",
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
      reason: false,
      resultTip:"",
      resulttime: false,    //审核时长显示
      auditTime:"",   //审核时长
      showChangBtn: true,   //控制修改按钮显示
      reasonText: "",   //不通过原因
      showOther: true,  //控制其他材料显示
      inveteCard: '',   //邀请人卡号
      disabled: false,
      showBackTip: false,
      contact: "",
      contactTel: "",
      shopname: "",
      mobile: "",
      address: "",
      openTime: "",
      introduce: "",
      remarks: "",
      mapadress:new Object(),
      label:''
    };
  },
  computed: {
    ...mapState(["mapPost"])
  },
  mounted() {
    // this.shopid = this.$route.params.postId;
    let that = this;
    Indicator.open();
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
      if(res.data.errno == 0) {
        let data = res.data.data;
        this.postdata = data.merchant;
        this.shopImg = data.imgUrls;
        this.otherImg = data.otherQualication;
        this.enteringTime = that.timetypefn(data.merchant.timeRange);
        this.shopClassId = data.merchant.storeType;
        this.enteringTimeId = data.merchant.timeRange;
        this.contact = data.merchant.contact;
        this.contactTel = data.merchant.contactTel;
        this.shopname = data.merchant.name;
        this.mobile = data.merchant.mobile;
        this.address = data.merchant.address;
        this.openTime = data.merchant.openTime;
        this.introduce = data.merchant.introduce;
        // that.remarks = data.merchant.remarks;
        this.bizLicence = data.merchant.bizLicence;
        this.facadePhoto = data.merchant.facadePhoto;
        this.id = data.merchant.id;
        this.label=data.merchant.label
        
        //判断审核状态
        if(data.merchant.status == 0) {
          that.approvalStatus = "店铺审核中！";
          that.resultTip = "您的店铺入驻申请正在审核中，请耐心等候！"
          that.auditTime = res.data.errmsg
          that.resulttime = true
          that.showChangBtn = false
          that.showOther = false
          that.approvalImg =  require("@/assets/images/review.png")
        }
        if(data.merchant.status == 1) {
          that.approvalStatus = "店铺审核通过！";
          that.resultTip = "您的店铺入驻申请已通过！"
          that.approvalImg =  require("@/assets/images/audit_ok.png")
        }
        if(data.merchant.status == 2) {
          that.approvalStatus = "店铺审核不通过！"
          that.resultTip = "您的店铺入驻申请审核不通过，请重新提交审核！"
          that.reason = true
          that.reasonText = res.data.errmsg
          that.showOther = false
          that.approvalImg =  require("@/assets/images/audit_no.png")
        }
        //判断进驻方式
        if(data.merchant.uploader == 1) {
          that.recommendway = "协助进驻"
        }
        //判断获取邀请人卡号
        if(data.merchant.inviter != null) {
          axios({
            url:this.Api + '/user/queryByUid?uid='+data.merchant.inviter,
            method:"post"
          }).then(res => {
            // console.log(res)
            that.inveteCard = res.data.cardNo;
          }).catch(err => {
            // Toast(err.message);
          })
        }
        //转换店铺分类
        if(this.postdata.storeType == 0) {
          this.shopClassName = '企业'
        }
        if(this.postdata.storeType == 1) {
          this.shopClassName = '个体工商户'
        }
        if(this.postdata.storeType == 2) {
          this.shopClassName = '微小商户'
        }
         //判断是否有邀请人
        if(data.merchant.inviter == null) {
          that.inviterShow = false;
        }
        if (!this.areadata) this.areadata = {};
        if (data.merchant.province && data.merchant.province != "") {
          this.$set(this.areadata, 'prov', {name: data.merchant.province});
        }
        if (data.merchant.city && data.merchant.city != "") {
          this.$set(this.areadata, 'city', {name: data.merchant.city});
        }
        if (data.merchant.county && data.merchant.county != "") {
          this.$set(this.areadata, 'area', {name: data.merchant.county});
        }
        /*if(data.merchant.street && data.merchant.street != ''){
          this.areadata['street'] = {}
          this.areadata['street'].name = data.merchant.street;
        };*/
        
      }
      
      // this.qualification = data.qualification
      // 当图片少于等于2张时不能删除
        // if (this.shopImg.length <= 2) {
        //   this.imgClear = true;
        // } else {
        //   this.imgClear = false;
        // }
        // 类型
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
            if (post.id == this.postdata.category) this.categoryName = post.name;
          });
        });
        this.mapadressfn();
    }).catch(err => {
      Indicator.close();
      // Toast(err.message);
    });
    
  },
  methods: {
    // 获取地址
    // region(val) {
    //   this.areadata = val;
    // },
    adressfn() {
      // this.visible = true;
      this.changeMapPost(this.mapadress);
      this.changeMap(this.mapadress);
      this.$router.push({path:'/mapAdress',query:{id: this.id}});
    },
    // visiblefn(val) {
    //   this.visible = val;
    // },
    // 商家类型
    categoryfn() {
      this.typeVisible = true;
    },
    typechange(picker, values) {
      this.typeModel = values[0];
    },
    quedingfn() {
      this.typeVisible = false;
      this.categoryName = this.typeModel.name;
      this.postdata.category = this.typeModel.id;
    },
    quxiaofn() {
      this.typeVisible = false;
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
    // 上传图片
    //营业执照
    bizLicencefn(val){
      this.postdata.bizLicence = val.url;
      this.bizLicence = val.url;
      // this.bizLicence?this.showupload1=false:this.showupload1=true;
    },
    //门头照
    facadePhotofn(val) {
      this.facadePhoto = val.url;
      this.postdata.facadePhoto = val.url;
      // this.facadePhoto?this.showupload2=false:this.showupload2=true;
    },

    // 营业时间
    openVisiblefn(val) {
      this.openVisible = val;
    },
    openTimefn(val) {
      this.openTime = val;
    },
    openTimedata() {
      this.openVisible = true;
    },
     //判断店铺介绍字数
    changeLength(e) {
      if(this.introduce.length>=59) {
        this.introduce = this.introduce.substring(0, 59)
      }

    },
     changeLength2(e) {
     if(this.shoptext.length>=15) {
     this.label = this.label.substring(0, 15)
     }
     },
    // 图片上传
    
    shopImgAdd() {
      if (this.shopImg.length >= 8) {
        Toast("店铺照片限制在8张以内，请勿添加过多图片。");
      } else {
        this.shopImgIndex = this.shopImg.length;
      }
    },
    shopImgfn(ev, i) {
      this.shopImgIndex = i;
    },
    shopImgChange(val) {
      if (this.shopImgIndex == this.shopImg.length) {
        this.shopImg.push(val.url);
        if (this.shopImg.length >= 8) {
          this.imgUploadStopAdd = true;
        }
      } else {
        if (val.url) {
          this.shopImg[this.shopImgIndex] = val.url;
        } else {
          this.shopImg.splice(this.shopImgIndex, 1);
          if (this.shopImg.length < 8) {
            this.imgUploadStopAdd = false;
          }
          // this.imguploadfn();
        }
        this.shopImgIndex = null;
      }
      // 当图片少于2张时不能删除
      // if (this.shopImg.length <= 2) {
      //   this.imgClear = true;
      // } else {
      //   this.imgClear = false;
      // }
    },
    // imguploadfn() {
    //   let data = this.postdata;
    //   let areadata = this.areadata;
    //   let post = {
    //     imgUrls: this.shopImg,
    //     merchant: {
    //       facadePhoto: data.facadePhoto,
    //       bizLicence: data.bizLicence,
    //       id: data.id
    //     }
    //   };
    //   axios.post(this.Api + "merchant/update", post).then(res => {
    //     // console.log(res);
    //   });
    // },
    //其他资质
     otherImgAdd(){
      if(this.otherImg.length >= 4){
        Toast('图片限制在4张以内！');
      }else{
        this.otherImgIndex = this.otherImg.length;
      }
    },
    otherImgfn(i){
      this.otherImgIndex = i;
    },
    otherImgChange(val){
      if(this.otherImgIndex == this.otherImg.length){
        this.otherImg.push(val.url)
        // if(this.shopImg.length>=2) {
        //   this.showupload3 = false
        // }
        if(this.otherImg.length >= 4){
          this.imgUploadStopAdd = true;
        }
      }else{
        if(val.url){
          this.otherImg[this.otherImgIndex] = val.url;
        }else{
          this.otherImg.splice(this.otherImgIndex,1)
          // if(this.shopImg.length<2) {
          //    this.showupload3 = true
          // }
          if(this.otherImg.length < 4){
            this.imgUploadStopAdd = false;
          }
          // console.log(this.shopImg.length)
        };
        this.otherImgIndex = null;
      };
    },
    goback() {
      if(this.postdata.status != 0) {
        // console.log(this.showBackTip)
        
        if(this.showBackTip){
          MessageBox({
              title: '提示',
              message: '若操作返回，当前的录入和修改的信息将会被清空。请谨慎操作。',
              showCancelButton: true,
              confirmButtonText: '确定',
              closeOnClickModal: false
            }).then(action => {
              if(action ==='confirm'){
                if(window.history.length > 1){
                  this.$router.go(-1);
                }else{
                  this.$router.push({path:'/'});
                }
              }
          });
        }else {
          this.$router.go(-1);
        }
      }else {
        this.$router.go(-1);
      }
     
    },
    //提交
    submitfn() {
      let that = this
      if (that.shopClassName == null){
        Toast('请选择店铺分类','middle')
        return false
      }else if (that.contact == ''){
        Toast('负责人姓名不能为空','middle')
        return false
      } else if(that.contactTel == '') {
        Toast('负责人手机不能为空','middle')
        return false
      }else if(that.shopname == '') {
        Toast('店铺名不能为空','middle')
        return false
      }else if(that.categoryName == '') {
        Toast('请选择店铺类型','middle')
        return false
      }else if(that.enteringTime == null) {
        Toast('请选择入驻时长','middle')
        return false
      }else if(that.mobile == '') {
        Toast('请输入店铺服务电话','middle')
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
      }else{
        let expPhone = regular.RegPhone;
        if(!(expPhone.test(that.contactTel))){
          Toast('输入的手机号码格式错误！');
          return false;
        };
      }
      that.restrictedSubmission()
      this.postupdata();
    },
    postupdata() {
      // Indicator.open();
      let that = this
      let data = this.postdata;
      let areadata = this.areadata;
      let post = {
        imgUrls: that.shopImg,
        merchant: {
          label:that.label,
          address: that.address,
          bizLicence: that.bizLicence,
          facadePhoto: that.facadePhoto,
          category: that.category,
          city: areadata.city.name,
          contact: that.contact,
          contactTel: that.contactTel,
          county: areadata.area.name,
          inviter: that.inviter,
          mobile: that.mobile,
          name: that.shopname,
          openTime: that.openTime,
          province: areadata.prov.name,
          remarks: that.remarks,
          // "street": areadata.street.name,
          timeRange: that.enteringTimeId,
          storeType: that.shopClassId,
          introduce: that.introduce,
          id: data.id
        },
        otherQualication: that.otherImg
      };
      if(that.mapadress.point){
        post.merchant.lng = that.mapadress.point.lng;
        post.merchant.lat = that.mapadress.point.lat;
      };
      if(data.status == 1) {
        axios.post(this.Api + "merchant/update", post)
        .then(res => {
          Indicator.close();
          if(res.data.errno == 0) {
            Toast(res.data.errmsg);
            that.$router.push({path: "/storeplat"});
          }
        })
        .catch(err => {
          Indicator.close();
          Toast(err.message);
        });
    }
      if(data.status == 2) {
        axios({
          method: "post",
          url: that.Api + "merchant/save?cardNo=" + that.inveteCard,
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: post
        }).then(res => {
          if(res.data.code == 0) {
            Toast('申请提交成功');
            that.$router.push({path: "/storeplat"});
          }
          if(res.data.code == 500) {
            Toast(res.data.msg,4000)
            that.$router.push({name: 'MineIndex'})
          }
        }).catch((err) => {
           console.log(err)
          //  that.toasfn(err.message);
        })
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
  watch: {
    shopClassName(val,old) {
      if(old != null) {
        this.showBackTip = true
      }
      
    },
    mapPost(val){
      if(val.point){
        this.mapadress = val;
        this.mapadressfn();
        this.removeMapPost();
      }
    },
    areadata(val,old) {
      if(old != null) {
        this.showBackTip = true
      }
      
    },
    contact(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    contactTel(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    shopname(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    categoryName(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    enteringTime(val,old) {
      if(old != null) {
        this.showBackTip = true
      }
      
    },
    mobile(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    address(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    openTime(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    introduce(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    // remarks(val,old) {
    //   if(old != "") {
    //     this.showBackTip = true
    //   }
      
    // },
    bizLicence(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    facadePhoto(val,old) {
      if(old != "") {
        this.showBackTip = true
      }
      
    },
    shopImg(val,old) {
      if(old.length > 0) {
        this.showBackTip = true
      }
     
    },
    otherImg(val,old) {
      if(old.length > 0) {
        this.showBackTip = true
      }
      
    }
  }
};
</script>

<style scoped>
/* 头部 */
.mainbox >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
.mainbox .filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
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
.cart-item .cart-box .cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.5rem 0;
  font-size: 0.7rem;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-item .cart-box .cart-list:last-child {
  border-bottom: none;
}
.cart-item .cart-box .cart-list label {
  float: left;
  width: 7.5em;
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
/**/
.uploadbox {
  width: 150px;
  position: relative;
}
.upload {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 5px;
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
/**/
.textarea textarea {
  width: 100%;
  font-size: 0.6rem;
  line-height: 1.4em;
}
.test-textarea-ab {
  color: #999;
}
.form-item {
  overflow: hidden;
  padding: 0 0.5rem;
  font-size: 0.7rem;
  color: #989898;
  margin-bottom: 0.8rem;
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
.sub {
  display: block;
  text-align: center;
  color: white;
  padding: 0.4rem 0;
  width: 60%;
  font-size: 0.7rem;
  line-height: 1.6em;
  background: #ff8f28;
  border-radius: 20rem;
  margin: 1rem auto;
}
.provCity label,
.provCity p.lmain {
  width: auto;
}
.mint-popup {
  width: 100%;
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
.shop .uploadbox {
  max-width: 150px;
  width: 48%;
  position: relative;
}
.shop .upload {
  margin: 0 0 10px 0;
  color: #999999;
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
.tip-text {
  font-size: 9px !important;
}
.bizLicence >>> .upload {
  height: 160px;
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
</style>
