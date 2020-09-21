<template>
  <div class="mainbox">
    <!-- <topnav :topnav="topnav"></topnav> -->
    <header class="mint-header">
      <mt-button icon="back" slot="left" @click="goback"></mt-button>
      <h1 class="mint-header-title">邀请申请表</h1>
      <!-- <div class="filter" @click="submitfn">
        <div class="filter-title">保存</div>
      </div> -->
    </header>
    <div class="cart-main">
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
            <p class="lmain"><input type="text" readonly v-model="recommendphone" placeholder="输入推荐人手机号"></p>
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
            <div class="text"><textarea type="text" placeholder="请输入店铺介绍" v-model="shoptext" @input="changeLength($event)"></textarea></div>
          </div>
              <div class="carttext">
                  <div class="title">店铺标签<span>(不超过15字)</span>：</div>
                  <div class="text"><textarea type="text" placeholder="添加关键词可以精准搜索到您的店铺 如快餐，西餐等" v-model="label"
                          @input="changeLength2($event)"></textarea></div>
              </div>
          <!-- <div class="cart-list">
            <label>备注信息:</label>
            <p class="lmain"><input type="text" v-model="remarks" placeholder="请输入备注信息"></p>
          </div> -->
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
    <div class="tankuang" v-show="tankuang" >
     <a href="javascript:void(0);" >  
       <img src="@/assets/images/tankuang.png" alt="" @click="hide">
       </a>
    </div>
    <div class="sub">
      <mt-button @click="subfn" :disabled="disabled">上传提交</mt-button>
    </div>
    <!-- <div class="sub">
      <mt-button :disabled="showsub" @click="subfn">上传提交</mt-button>
    </div> -->
    <!--地址选择-->
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
    <picture-viewer v-if="showxieyi" :imgUrl.sync="imgUrl"></picture-viewer>
  </div>
</template>

<script>
import regular from '@/assets/js/regular';
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      topnav:{
        title:'邀请申请表'
      },
      mapadress:new Object(),
      tankuang:false,
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
      showBackTip: false,
      label:'',
      cardNo:this.$route.params.inveteCardId
    }
  },
  computed: {
    ...mapState(["mapPost"])
  },

  watch: {
    shopClassName(val,old) {
      if(val != "") {
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
    username(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    // tel(val,old) {
    //   if(val != '') {
    //     this.showBackTip = true
    //   }
    // },
    spname(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    categoryName(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    enteringTime(val,old) {
      if(val != null) {
        this.showBackTip = true
      }
    },
    spphone(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    areadata(val,old) {
      if(val != null) {
        this.showBackTip = true
      }
      
    },
    address(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    openTime(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    shoptext(val,old) {
      if(val != '') {
        this.showBackTip = true
      }
    },
    // remarks(val,old) {
    //   if(val != '') {
    //     this.showBackTip = true
    //   }
    // },
    bizLicence(val,old) {
      if(val != "") {
        this.showBackTip = true
      }
      
    },
    facadePhoto(val,old) {
      if(val != "") {
        this.showBackTip = true
      }
      
    },
    shopImg(val,old) {
      if(val.length > 0) {
        this.showBackTip = true
      }
     
    },
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
    });
       var u = navigator.userAgent,
       app = navigator.appVersion;
      
       var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
       if(isiOS){
       var ua = navigator.userAgent.toLowerCase();
       if(ua.match(/MicroMessenger/i)=="micromessenger") {
        
        this.tankuang=true;
      
       } else {
    this.tankuang=false
       }
       }
       this.getH()
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
   
    hide(){
      this.tankuang=false;
    },
    getH(){
               axios({
               method: "get",
               url: this.Api + "merchant/isPartner",
               headers: { "X-Nideshop-Token": this.$cookie.get('token') },
          
               }).then(res => {
               console.log(res,'8')
           
               if(res.data.code == 500) {
                    MessageBox({
                    title: '提示',
                    message: res.data.msg,
                  
                    confirmButtonText: '确定'
                   
                    }).then(action => {
                    if(action ==='confirm'){
                       this.$router.push({name: 'MineIndex'})
                    }
                    });
              
               }
               }).catch((err) => {
               console.log(err)
             
               })
    },
    goback() {
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
    },
    // 提交店铺申请
    subfn(){
      // console.log(this.username);
      let that = this;
  
      if (that.shopClassName == null){
        Toast('请选择店铺分类','middle')
        return false
      }else if (that.username == ''){
        Toast('负责人姓名不能为空','middle')
        return false
      } else if(that.tel == '') {
        Toast('负责人手机不能为空','middle')
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
      else if (this.showxieyi === false) {
        Toast('请勾选是否同意申请协议','middle')
        return false;
      }else{
        let expPhone = regular.RegPhone;
        if(!(expPhone.test(this.tel))){
          this.toasfn('输入的手机号码格式错误！');
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
               "label":that.label,
              "userid": that.$cookie.get('userid'),
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
              "uploader": 0,
              "facadePhoto": that.facadePhoto,
              "bizLicence": that.bizLicence,
              "lng":that.mapadress.point.lng,
              "lat":that.mapadress.point.lat,
          },
          // "qualification": {
          //     "facadePhoto": that.facadePhoto,
          //     "bizLicence": that.bizLicence,
          // }
        };
        if(that.id!='') post["merchant"]["id"] = that.id;
        that.disabled = true
        that.restrictedSubmission()
        console.log(post);
        axios({
          method: "post",
          url: that.Api + "merchant/save?cardNo=" + that.inveteCard,
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: post
        }).then(res => {
          console.log(res)
          if(res.data.code == 0) {
            that.toasfn('申请提交成功');
            let data = res.data.userVo;
            that.$router.push({path: '/storeplat'});
            that.$cookie.set('vip_type', data.type);
            that.$cookie.set('merId', data.merchantId);
          }
          if(res.data.code == 500) {
            Toast({ message:res.data.msg,
               duration: 5000
            }
            )
            that.$router.push({name: 'MineIndex'})
          }
        }).catch((err) => {
           console.log(err)
          //  that.toasfn(err.message);
        })
    },

    // 获取邀请人信息
    getInveterInfo() {
      let that = this
      that.inveteCard = this.$route.params.inveteCardId;
      if(that.inveteCard == 0) {
        that.inveteShow = false
        that.inveteCard = ''
        // that.recommendway = '自主入驻'
        return false
      }else {
        // that.recommendway = '推荐入驻'
      }
      if(that.inveteCard == that.$cookie.get("card")) {
         MessageBox.alert('不好意思，目前不能支持自我推荐商户入驻，请点击首页菜单栏的商户入驻功能。').then(action => {
            that.$router.push('/')
         });

      }
      // console.log(that.inveteCard)
      axios({
        method:'post',
        url: that.Api +'user/queryByCardNo?cardNo=' + that.inveteCard,
      }).then(res => {
        // console.log(res)
        that.recommendname = res.data.nickname
        that.recommendphone = res.data.mobile;
  
        // if(that.recommendphone==""||that.recommendphone==null&&this.cardNo!=0){
        //     axios.post(this.Api + '/user/queryByCardNo?cardNo='+this.cardNo).then(u=>{
        //     let data = u.data;
        //     that.recommendname=data.realName;
        //     that.recommendphone = data.mobile;
  
        //     })
        // }
      });
     
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
      this.changeMap(this.mapadress)
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
    ...mapMutations(["changeMapPost","removeMapPost","changeMap","removeMap"])
  },
  created() {
    Indicator.open();
    let that = this;
    this.getInveterInfo();
    this.initialization();
    // 重新申请获取数据
    axios({
      url:this.Api + '/merchant/info',
      method:"get",
      headers:{
        "X-Nideshop-Token": this.$cookie.get('token')
      }
    }).then(res => {
      Indicator.close();
      // console.log(res)
      if(res.data.errno == 0){
        let data = res.data.data;
        console.log(data.merchant)
        
        if(data.merchant && data.merchant.status == 2){
          // 审核不通过通过新邀请链接进来
          // if(that.inveteCard != 0) {
          //   return false
          // }
          // if(data.merchant.inviter && data.merchant.inviter!=null && data.merchant.inviter!==''){
          //   MessageBox({
          //     title: '提示',
          //     message: '尊敬的商家您好，您的商家审核不通过，你上一次的邀请人为' + data.merchant.inviterName + ',是否继续修改申请？',
          //     showCancelButton: true,
          //     confirmButtonText: '继续申请',
          //     closeOnClickModal: false
          //   }).then(action => {
          //     if(action ==='confirm'){
          //       that.recommendname = data.merchant.inviterName;
          //       that.recommendphone = data.merchant.inveteMobile;
          //       // that.recommendway = '邀请入驻'
          //       axios({
          //         url:this.Api + '/user/queryByUid?uid='+data.merchant.inviter,
          //         method:"post"
          //       }).then(res => {
          //         that.inveteShow = true;
          //         that.inveteCard = res.data.cardNo;
          //       }).catch(err => {
          //         Indicator.close();
          //         // Toast(err.message);
          //       })
          //     }
          //   });
          // }
        }else if(data.merchant && data.merchant.status == 1){
          MessageBox.alert('尊敬的商家您好，您已经成为本平台商家，不需要再申请！如需修改信息，请到商家管理。').then(action => {
            this.$router.push({path: "/storeplat"})
          });
          return false;
        }else if(data.merchant && data.merchant.status == 0) {
          MessageBox.alert('尊敬的商家您好，您的店铺入驻申请正在审核中请勿重复申请！').then(action => {
            this.$router.go(-1)
          });
          return false;
        }

        that.username = data.merchant.contact;
        that.tel = data.merchant.contactTel;
        that.spname = data.merchant.name;
        that.categoryId = data.merchant.category;
        that.spphone = data.merchant.mobile;
        that.address = data.merchant.address;
        // that.remarks = data.merchant.remarks;
        that.shoptext = data.merchant.introduce;
        that.openTime = data.merchant.openTime;
        // that.facadePhoto = data.qualification.facadePhoto;
        // that.bizLicence = data.qualification.bizLicence;
        that.facadePhoto = data.merchant.facadePhoto;
        that.bizLicence = data.merchant.bizLicence;
        that.shopImg = data.imgUrls;
        that.enteringTime = that.timetypefn(data.merchant.timeRange);
        that.shopClassName = that.shoptypefn(data.merchant.storeType);
        that.enteringTimeId = data.merchant.timeRange;
        that.shopClassId = data.merchant.storeType;
        that.id = data.merchant.id;

        if(!this.areadata) this.areadata = {};
        if(data.merchant.province && data.merchant.province != ''){
          this.$set(this.areadata, 'prov', {name: data.merchant.province});
        };
        if(data.merchant.city && data.merchant.city != ''){
          this.$set(this.areadata, 'city', {name: data.merchant.city});
        };
        if(data.merchant.county && data.merchant.county != ''){
          this.$set(this.areadata, 'area', {name: data.merchant.county});
        };
        // 类型
        axios({
          url:that.Api + '/merchant/categoryList',
          method:"post",
          headers:{
            "X-Nideshop-Token": that.$cookie.get('token')
          }
        }).then(res => {
          let data = res.data.categoryEntities;
          data.forEach((post,index) => {
            if(post.id == that.categoryId) that.categoryName = post.name;
          });
        })
      }else if(res.data.errno == 2){
        MessageBox.alert('尊敬的商家您好，我们已收到您入驻的申请，请保持电话畅通，耐心等候，我将尽快联系您！').then(action => {
          this.$router.push({name: 'MineIndex'})
        });
        return false;
      };
      this.mapadressfn();
    }).catch(err => {
      Indicator.close();
      // Toast(err.message);
    })
  },

    //   beforeRouteLeave(to, from, next) {
    //   console.log( '55')
    //   if (to.path == '/' || to.path == '/login'
    //   ) {
    //   from.meta.keepAlive = true;
    //              var u = navigator.userAgent,
    //              app = navigator.appVersion;

    //              var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //              if(isiOS){
    //              var ua = navigator.userAgent.toLowerCase();
    //              if(ua.match(/MicroMessenger/i)=="micromessenger") {

    //                  this.$store.commit("tankuang")

    //              } else {
                
    //              }
    //                this.$store.commit("tankuang")
    //             }
    //           }
    //   // let scrollTop = this.$refs.listCon.scrollTop;
 
    //   next();
      
    // },
}
</script>

<style scoped>
  .tankuang{
    width: 100%;
    position:absolute;
    top:0;
    left: 0;
  }

.mainbox >>> .mint-header {
  background: #ff911e;
  height: 2rem;
  border-bottom: none;
  font-size: 16px;
}
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
