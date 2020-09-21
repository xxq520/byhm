<template>
   <div class="peopleManage">
     <!-- 头部 -->
      <div class="topnav">
          <i class="el-icon-arrow-left" @click="goback"></i>
          <span>{{topnav.title}}</span>
      </div>
     <!-- 顶部类型切换 -->
    <div class="managebtn">
      <el-button-group>
        <el-button :class="{'hover':messagebtn==0}" round @click="messagebtnfn(0)">潜在人脉</el-button>
        <el-button :class="{'hover':messagebtn==1}" round @click="messagebtnfn(1)">直接人脉</el-button>
        <el-button :class="{'hover':messagebtn==2}" round @click="messagebtnfn(2)">间接人脉</el-button>
      </el-button-group>
    </div>
    <div class="manageNav" v-if="messagebtn==1 || messagebtn==2">
      <el-row>
        <el-col :span="8">
          <span :class="{'checkJT':sidx=='create_time'}">加入时间</span>
          <div class="jiantou" >
            <i class="el-icon-caret-top" :class="{'checkJT':sidx=='create_time' && sort=='asc'}" @click="sortChange('create_time','asc')"></i>
            <i class="el-icon-caret-bottom" :class="{'checkJT':sidx=='create_time' && sort=='desc'}" @click="sortChange('create_time','desc')"></i>
          </div>
        </el-col>
        <el-col :span="8">
          <span :class="{'checkJT':sidx=='inviteNum'}">团队规模</span>
          <div class="jiantou" >
            <i class="el-icon-caret-top" :class="{'checkJT':sidx=='inviteNum' && sort=='asc'}" @click="sortChange('inviteNum','asc')"></i>
            <i class="el-icon-caret-bottom" :class="{'checkJT':sidx=='inviteNum' && sort=='desc'}" @click="sortChange('inviteNum','desc')"></i>
          </div>
        </el-col>
        <el-col :span="8">
          <el-dropdown trigger="click" placement="bottom-start" @visible-change="dropdownzhao" @command="handleCommand">
            <span class="el-dropdown-link" :class="{'checkJT':showFilter}">筛选</span>
            <div class="jiantou">
              <img v-if="showFilter" src="@/assets/images/screen_ic.png" class="screen">
              <img v-else src="@/assets/images/screen_ic_nor.png" class="screen">
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command='0'>全部</el-dropdown-item>
              <el-dropdown-item command='2'>仅显示推广商和运营商</el-dropdown-item>
              <el-dropdown-item command='1'>仅显示惠盟用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div v-show="zhao" class="dropdownzhao"></div>
        </el-col>
      </el-row>
    </div>
    <div class="navtext" v-else>
      <img src="@/assets/images/tips.png">您已经邀请但邀请人暂未购买惠盟用户卡的成员
    </div>
    <div class="managebox">
      <div >
        <!-- <div class="nodata" v-if="loadend"><img src="@/assets/images/qs1.png"></div> -->
        <!--潜在用户列表-->
        <div class="itembox" v-if="messagebtn==0" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
          <div class="itemmain" v-for="(item,index) in list" :key="index">
            <div class="item">
                <div class="title">
                  <div class="headimg"><img id="avatar" :src="item.avatar==null?advatar:item.avatar" alt=""></div>
                </div>
                <div class="mint-cell">
                  <div class="mint-cell-wrapper">
        
                    <div class="mint-cell-title">
                      <div class="mint-cell-text">
                        <div class="mr-r-5">
                          {{ !item.realName || item.realName=='' || item.realName==null?'惠盟用户':item.realName}}
                          <img v-if="item.levelId == 0" src="@/assets/images/v_1.png">
                          <img v-if="item.levelId == 1" src="@/assets/images/v_2.png">
                          <img v-if="item.levelId == 2" src="@/assets/images/v_3.png">
                          <img v-if="item.levelId == 3" src="@/assets/images/v_4.png">
                          <img v-if="item.levelId == 4" src="@/assets/images/v_5.png">
                          <img v-if="item.levelId == 5" src="@/assets/images/v_6.png">
                        </div>
                        <div class="mr-r">
                          <!-- <span>{{item.username}}</span> -->
                          <a v-if="backshqPd" @click="mobilefn(item.username)">{{item.username}}</a>
                          <a v-else :href="'tel:' + item.username">{{item.username}}</a>
                        </div>
                      </div>
                      <span class="join-time">{{item.createTime==null||''?'暂无':formData(item.createTime)}}</span>
                    </div>
                    <div class="mint-cell-value" style="width:51%">
                      <p class="yqr">邀请人：{{item.superiorName == null||''?'暂无':item.superiorName}}</p>
                      <p class="yqt">邀请时间：{{item.createTime==null||''?'暂无':formData(item.createTime)}}</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <!--1级用户列表/直接人脉-->
        <div class="itembox" v-if="messagebtn==1 || messagebtn==2" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
          <div class="itemmain" style="border-top:none;" v-for="(item,index) in list" :key="index">
            <div class="item" @click="getpopupdata(index,item)">
                <div class="title">
                  <div class="headimg"><img id="avatar" :src="item.avatar==null?advatar:item.avatar" alt=""></div>
                </div>
                <div class="mint-cell">
                  <div class="mint-cell-wrapper">
                    <div class="mint-cell-title">
                      <div class="mint-cell-text">
                        <div class="mr-r-5">
                          <!-- <template v-if="messagebtn==1"> -->
                          {{ !item.realName || item.realName=='' || item.realName==null?'惠盟用户':item.realName}}
                          <!-- </template> -->
                          <img v-if="item.levelId == 0" src="@/assets/images/v_1.png">
                          <img v-if="item.levelId == 1" src="@/assets/images/v_2.png">
                          <img v-if="item.levelId == 2" src="@/assets/images/v_3.png">
                          <img v-if="item.levelId == 3" src="@/assets/images/v_4.png">
                          <img v-if="item.levelId == 4" src="@/assets/images/v_5.png">
                          <img v-if="item.levelId == 5" src="@/assets/images/v_6.png">
                        </div>
                        <div class="mr-r" v-if="messagebtn==1">
                          <span>{{item.username}}</span>
                        </div>
                      </div>
                      <span class="join-time">加入时间：{{item.createTime==null||''?'暂无':formData(item.createTime)}}</span>
                    </div>
                    <div class="mint-cell-value">
                      <p class="yqr" style="color:#333;">邀请{{item.inviteNum}}人</p>
                      <p class="yqt"><span style="color:#333;">邀请人：<template  v-if="messagebtn==2">{{item.inviteRealName}}</template></span><span style="margin-top:5px;display:block">{{item.superiorName == null||''?'暂无':item.superiorName}}</span></p>
                    </div>
                    <div class="left-icon"><i class="el-icon-arrow-right"></i></div>
                  </div>
                </div>
            </div>
          </div>
          <div class="loading">
            <loading :load.sync="loadshow" :end.sync="loadend"></loading>
          </div>
        </div>
      </div>
    </div>
    <div class="bottonsub">
      <div class="sub">{{ messagebtn==0?'潜在人脉：'+totalNum:messagebtn==1?'直接人脉：'+totalNum:'间接人脉：'+totalNum }}</div>
    </div>
    <!-- 一级用户信息弹窗 -->
    <mt-popup class="memberPop" v-model="popupVisible" position="middle" popup-transition="popup-fade" >
      <!-- <img id="close" src="@/assets/images/close.png" alt="" @click="closeMemberPop"> -->
      <div class="top">
        <div class="imgWrap"><img id="close" src="@/assets/images/close.png" alt="" @click="closeMemberPop"></div>
        <div class="logo">
          <img src="@/assets/images/vip_hp_b1.png" alt="">
          <div class="username" v-if="backshqPd"><a @click="mobilefn(username)">{{username}}</a></div>
          <div class="username" v-else><a :href="'tel:' + username">{{username}}</a></div>
        </div>
        <div class="info">
          <div class="wx">
            <span class="titlename">微信号 <img src="@/assets/images/form_ic.png" alt=""></span>
            <div class="number">{{wxNum== null||''?'暂无':wxNum}}</div>
          </div>
          <div class="invitID">
            <span class="titlename">邀请ID <img src="@/assets/images/form_ic.png" alt=""></span>
            <div class="number">{{cardNo}}</div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <div class="profit">上月收益</div>
          <div class="money">￥<i>{{lastProfit== null||''?'0':lastProfit}}</i></div>
        </div>
        <div class="right">
          <div class="profit">累计收益</div>
          <div class="money">￥<i>{{totalProgit== null||''?'0':totalProgit}}</i></div>
        </div>
      </div>
      <div class="registerTime">
        <span class="rt">注册时间：</span>
        <span class="rc">{{registerTime== null||''?'暂无':formData(registerTime)}}</span>
      </div>
    </mt-popup>
    <!-- 二级用户信息弹窗 -->
    <mt-popup class="memberPop" v-model="popupVisibleEJ" position="middle" popup-transition="popup-fade" >
      <img id="closeGrey" src="@/assets/images/closeGrey.png" alt="" @click="closeMemberPopEJ">
      <div class="bottom" id="EJ">
        <div class="left">
          <div class="profit">上月收益</div>
          <div class="money">￥<i>{{lastProfit== null||''?'暂无':lastProfit}}</i></div>
        </div>
        <div class="right">
          <div class="profit">累计收益</div>
          <div class="money">￥<i>{{totalProgit== null||''?'暂无':totalProgit}}</i></div>
        </div>
      </div>
      <div class="registerTime">
        <span class="rt">注册时间：</span>
        <span class="rc">{{registerTime== null||''?'暂无':formData(registerTime)}}</span>
      </div>
    </mt-popup>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "peopleManage",
  data() {
    return {
      topnav:{
        title:'人脉管理',
        send: false
      },
      showFilter:false,//控制筛选沙漏图标的显示
      advatar:require('@/assets/images/vip_hp_b1.png'),
      zhao:false,
      nodata:false,
      messagebtn:0,
      popupVisible: false, //控制用户信息弹窗组件显示状态
      popupVisibleEJ: false, //控制用户信息弹窗组件显示状态
      level:this.$cookie.get('level_id'),//0 潜在用户、1 一级用户和 2二级用户
      superior:this.$cookie.get('userid'),//用户id
      type:this.$cookie.get('vip_type'),//非用户(0)、520用户(1)和推广商(2) 区推广3 市推广4 省推广5
      sidx:'',//排序字段
      sort:'',//排序方式
      pageNum:1,//当前页
      pageSize:8,//每页显示行数
      list:[],
      username:'',
      wxNum:'',
      invitId:'',
      lastProfit:'',
      totalProgit:'',
      registerTime:'',
      totalNum:'',
      cardNo:'',
      type:0,
      loadshow:true,
      loadend:false,
      loading:false,
      backshqPd: sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route.query.platform == 'ios'
    };
  },
  mounted() {
    this.messagebtn = this.$route.query.flag;
    this.cardNo = this.$route.query.cardNo;
    this.loadMore();
  },
  updated() {
  },
  methods: {
         goback() {
         this.$store.commit("bbb");
         // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
         // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
         // console.log(this.$route.query.from);
         if (this.$route.query.platform == 'android') {
         this.$store.commit("bbb");
         window.action.backAPP();
         } else if (this.$route.query.platform == 'ios') {
         this.$store.commit("bbb");
         window.action.backAPPiOS();
         } else {

         this.$router.go(-1)
         }

         },
    // 安卓电话方法
    mobilefn(number){
      window.action.phoneCall(number);
    },
    loadMore() {
      this.loading = true;
      this.loadshow = true;
      let that = this;
      let params = {
        type:this.type,
        level:this.messagebtn,
        superior:this.superior,
        sidx: this.sidx,
        sort: this.sort,
        pageNum:this.pageNum,
        pageSize:this.pageSize
      };
      axios.get(this.Api + '/user/queryByLevel',{params:params}).then(res=>{
        if (res.status == 200) {
          let data = res.data.page;
          that.totalNum = data.totalCount;
          if (data.list.length == 0) {
            that.loadend = true;
            that.loadshow = false;
            that.loading = true;
            //that.totalNum = that.list.length;
            return false;
          };
          ;(that.pageNum)++;
          that.list = that.list.concat(data.list);
          //that.totalNum = that.list.length;
          that.loading = false;
          that.loadshow = false;
        }else{
          Toast('后台异常，请联系管理员')
        }
      })
    },
    messagebtnfn(val){
      this.messagebtn = val;
      this.pageNum = 1;
      this.type = 0;
      this.list = [];
      this.sidx = '';
      this.sort = '';
      this.loadMore();
    },
    // 加入时间排序  升序asc
    sortChange(sidx, sort){
      this.list = [];
      this.type = 0;
      this.sidx = sidx;
      this.sort = sort;
      this.pageNum = 1;
      this.loadMore();
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      // var m = date.getMinutes() + ':';
      var m = date.getMinutes();
      var s = date.getSeconds();
      // return Y+M+D+h+m+s;
      return Y+M+D+h+m;
    },
    // 处理筛选下拉点击事件回调
    handleCommand(command){
      this.list = [];
      this.type = command;
      this.sidx = '';
      this.sort = '';
      this.pageNum = 1;
      this.loadMore();
    },
    dropdownzhao(val){
      this.zhao = val;
      this.showFilter = val;
    },
    // 打开弹窗
    getpopupdata(index,item){
      if(this.messagebtn == 1){
        this.showMember(index,item);
      }else if(this.messagebtn == 2){
        this.showMemberEJ(index,item);
      }
    },
    // 直接人脉弹窗
    showMember(index,item) {
      this.popupVisible = true;
      var id = item.id;
      axios.get(this.Api+'/user/queryBenefitInfo?id='+id).then(res=>{
        if (res.status == 200) {
          var data = res.data;
          this.username = data.username
          this.wxNum =data.wechatUnionid==''|| data.wechatUnionid==null?'暂无':data.wechatUnionid;
          this.lastProfit =data.lastMonthBenefit
          this.totalProgit =data.totalBenefit
          this.registerTime =data.createTime
          this.invitId =data.cardNo
        }else{
          Toast('网络错误，请重试！')
        }
      })
    },
    //间接人脉弹窗
    showMemberEJ(index,item) {
      this.popupVisibleEJ = true;
      var id = item.id;
      axios.get(this.Api+'/user/queryBenefitInfo?id='+id).then(res=>{
        if (res.status == 200) {
          var data = res.data;
          this.lastProfit =data.lastMonthBenefit
          this.totalProgit =data.totalBenefit
          this.registerTime =data.createTime
        }else{
          Toast('网络错误，请重试！')
        }
      })
    },
    closeMemberPop() {
      this.popupVisible = false;
    },
    closeMemberPopEJ() {
      this.popupVisibleEJ = false;
    }
  }
};
</script>

<style scoped>
  .topnav{
  width: 100%;
  height: 40px;
  background-color: #ff911e;
  color:#fff;
  display: flex;
  line-height: 40px;
  text-align: center;
  }
  .topnav i{
  flex: 1;
  line-height: 40px !important;
  font-size: 20px !important;
  }
  .topnav span {
  flex: 9;
  font-size: 18px;
  text-indent: -50px;
  }
.mr-r{
  margin-top: 5px;
  font-size: .5rem;
}
.mr-r-5{
  display: flex;
  align-items: center;
  font-size: .6222rem;
}
.peopleManage{
  height: 100vh;
  overflow:hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
}
.managebtn{
  overflow:hidden;
  padding:1rem 0 0.5rem;
  background:white;
  text-align: center;
}
.managebtn >>> .el-button.is-round{
  padding:10px 20px;
}
.managebtn >>> .el-button{
  border:none;
  background:#ececec;
  color:#333;
}
.managebtn >>> .el-button.hover{
  background:#ec0746;
  color:white;
}
.managebox{
  overflow:auto;
  font-size:0.65rem;
  padding:0 10px 4em;
  flex:1;
}
.manageNav{
  overflow:hidden;
  background:white;
  border-bottom:1px solid #d9d9d9;
}
.manageNav .el-col{
  float: left;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  text-align: center;
  font-size: 0.65rem;
  color:#939397;
  line-height:3em;
}
.manageNav .el-col .jiantou{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left:0.1rem;
}
.manageNav .el-col .checkJT{
  color: #EC0746;
  outline: none;
}
.manageNav .el-col .jiantou i{
  display:block;
  font-size:0.6rem;
  line-height:.6em;
}
.manageNav .el-col .jiantou .screen{
  width:auto;
  height:1em;
}
.navtext{
  overflow:hidden;
  width:100%;
  font-size:0.6rem;
  color:#999;
  line-height:1.2em;
  margin-bottom:0.8rem;
  padding:0 10px;
}
.navtext img{
  float:left;
  margin-right:0.1rem;
  width:auto;
  height:1.2em;
}
.manageNav >>> .el-dropdown{
  width:100%;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
}
.dropdownzhao{
  width:100vw;
  height:100vh;
  position:fixed;
  left:0;
  top:0;
  background:rgba(0,0,0,0.6);
  z-index:99;
}
.itembox{
  overflow:hidden;
}
.itembox .item{
  overflow:hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background:white;
  padding:10px 0;
  border-bottom:1px solid #eee;
}
.itemmain{
  overflow:hidden;
  border-top:1px solid #eee;
}
.itembox .item .title{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.itembox .item .headimg{
  float:left;
  width:1.7rem;
  height:1.7rem;
  border-radius:50%;
  background:#e9e9e9;
  margin-right:0.5rem;
}
.itembox .item .headimg img{
  width:100%;
  height:100%;
  border-radius: 50%
}
.itembox >>> .mint-cell{
  background-image:none;
  flex: 1;
}
.itembox >>> .mint-cell-wrapper{
  background-image:none;
  padding:0 0 0 0;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
}
.itembox >>> .mint-cell-title{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex:1;
}
.itembox >>> .mint-cell-text{
  display:block;
  /* overflow:hidden; */
  text-overflow:ellipsis;
  white-space:nowrap;
  /* max-width:10em; */
  color:#333;
  font-size:0.6rem;
}
.itembox >>> .mint-cell-value{
  text-align: right;
  float: right;
  flex-direction: column;
  justify-content: center;
}
.itembox >>> .mint-cell-value p{
  width:100%;
  font-size:0.6rem;
  display:block;
}
.itembox >>> .mint-cell-value p.yqt{
  font-size:0.5rem;
  margin-top:0.6em;
}
.itembox >>> .mint-cell-label{
  font-size:0.65rem;
  margin-top:4px;
}
.itembox >>> .mr-r a{
    color: #666666;
}
.mint-cell-text img {
  width:3rem;
  height:1.2em;
  margin-left: 5px;
}
.item-img img{
  width:auto;
  height:1.4em;
}
.join-time {
  font-size: 12px;
  margin-top: 0.3em;
  color: #666666;
}
.left-icon{
  font-size:0.8rem;
  color:#ccc;
  padding-left:0.2rem;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nodata{
  overflow:hidden;
  padding:4rem 0.5rem;
}
.bottonsub{
  position:fixed;
  bottom:0;
  left:0;
  width:100%;
  background:white;
  padding:0.5rem;
}
.sub{
  display:block;
  text-align: center;
  color:white;
  padding:0.5em 0;
  width:60%;
  font-size:0.65rem;
  line-height:1.6em;
  background:#ff8f28;
  border-radius:20rem;
  margin:0 auto;
}
/* 用户信息弹窗 */
.peopleManage .memberPop {
  width: 11.5556rem;
  border-radius: 10px;
}
.peopleManage .memberPop #closeGrey {
  width: .6rem;
  height: .6rem;
  position: fixed;
  right: 10px;
  top: 10px;
}
.peopleManage .memberPop .top {
  width: 100%;
  background-color: #ff9f18;
  border-radius: 10px;
  overflow: hidden;
  padding: 0.11rem 0.6rem;
}
.peopleManage .memberPop .top .imgWrap{
  width: 0.4889rem;
  float: right;
}
.peopleManage .memberPop .top .logo img {
  width: 1.5rem;
  height: 1.5rem;
  display: block;
  margin: 0.3rem auto;
}
.peopleManage .memberPop .top .logo .username {
  font-size: 0.58rem;
  color: #fefefe;
  text-align: center;
}
.peopleManage .memberPop .top .logo .username a{
  color: #fefefe;
}
.peopleManage .memberPop .top .info {
  width: 100%;
  font-size: 0.5333rem;
  color: #fff;
  overflow: hidden;
}
.peopleManage .memberPop .top .info .wx {
  float: left;
}
.peopleManage .memberPop .top .info .invitID {
  float: right;
}
.peopleManage .memberPop .top .info .titlename {
  color: #fefefe;
}
.peopleManage .memberPop .top .info img {
  width: 0.3111rem;
  height: 0.3556rem;
}
.peopleManage .memberPop .bottom {
  padding: 0.4444rem 0.8889rem;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
}
.peopleManage .memberPop #EJ {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 35px 35px 10px 35px;
}
.peopleManage .memberPop .bottom .left {
  float: left;
}
.peopleManage .memberPop .bottom .right {
  float: right;
}
.peopleManage .memberPop .bottom .profit {
  font-size: 0.6222rem;
  color: #666666;
}
.peopleManage .memberPop .bottom .money {
  font-size: 0.7111rem;
  color: #ff3171;
  text-align: center;
  margin: 0.6rem 0;
}
.peopleManage .memberPop .registerTime {
  font-size: 0.5333rem;
  text-align: center;
  padding: 0.4rem 1.6889rem;
  border-top: 1px solid #eeeeee;
}
.peopleManage .memberPop .registerTime .rt {
  color: #666666;
}
.peopleManage .memberPop .registerTime .rc {
  color: #333333;
}
</style>
