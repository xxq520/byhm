<template>
    <div class="glode">
        <topnav :topnav="topnav"></topnav>
        <!-- 银行卡入驻入口 -->
         <div class="bankCart" >
            <template v-if="isYLEnter &&  (type == 4 || type === undefined||type == 4 )">
              <div class="enter" >
                  <div class="img_box" @click="linkToBackYL"><img src="@/assets/images/blank.png"/>银联入驻</div>
              </div>
              <i></i>
            </template>
             <div class="enter" v-if="type == 1 ||type === undefined ||type == 3 ||type==5">
                <div class="img_box2" @click="addbank"><img src="@/assets/images/txcz_icon.png"/>普通入驻</div>
            </div>
        </div>
        <template v-if="isYLEnter &&(type == 4 || type === undefined||type == 6 )">
            <p class="enter_text">银联入驻请准备好相关资料：（1）身份证号码 （2）邮箱  （3）身份证正反面 （4）银行卡号、图片、开户支行名称  （5）经营地址和门牌号（6）收银台照片、经营场景照、门店照片、自拍照、经营场所室内照</p>
            <div class="looking">
              <p>查看<span @click="agreenFn">《行业成员资金管理授权书》</span></p>
               <p style="text-indent:1.3rem; "> <span @click="agreenFn2">《银联入驻手册》</span>
              </p>
              <p style="text-indent:1.3rem;"> <span @click="linkToVideo">《银联入驻视频》</span></p>
            </div>
        </template>
        
        <!-- 入驻后银联 -->
         <template v-if="!isYLEnter && (type == 4 ||type === undefined ||type == 6 )">
        <div class="bankList YLbank"  >
            <p class="text" v-if="type == 4">对分账账户提现（入驻后）</p>
            <p class="text" v-if="type == 6">对高汇通账户提现（入驻后）</p>
            <div class="looking">
                <p><i @click="agreenFn">《行业成员资金管理授权书》</i><i @click="agreenFn2">《银联入驻手册》</i></p>
                <p><i @click="linkToVideo">《银联入驻视频》</i></p>
            </div>
            
            <div class="cartList">
                <div class="text">
                <div class="bankname"><img src="@/assets/images/bank.png">{{YLbankName?YLbankName.substr(0,position):''}}<span class="state">({{applyStatusText}})</span></div>
                <div class="numbers">
                    <span>****</span>
                    <span>****</span>
                    <span>****</span>
                    <span>{{bankCardNo?bankCardNo.substr(-4):'****'}}</span>
                </div>
                </div>
                <div class="buttext">
                <div class="but">
                    <template v-if="isShowTX">
                       <span style="color:#ff6e04;" @click="linktoYLTX(type)">提现</span>
                        <i>|</i>
                    </template>
                     <span @click="linkToYLState">查看</span>

                  
                </div>
                </div>
            </div>
        </div>
        </template>
         <!-- 入驻前 -->
        <template v-if="type == 3 || type === undefined||type == 5">
          <div class="bankcart" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3" >
            <div class="bankList" v-show=" bank.length != 0" >
              <p v-if="type == 3">对分账账户提现（入驻前）</p>
              <p v-if="type == 5">对高汇通账户提现（入驻前）</p>
              <div class="cartList" v-for="(item,index) in bank" :key="index">
                  <div class="text">
                  <div class="bankname"><img src="@/assets/images/bank.png">{{item.bankName}}</div>
                  <div class="numbers">
                      <span>****</span>
                      <span>****</span>
                      <span>****</span>
                      <span>{{ item.bankCardNo.substr(-4) }}</span>
                  </div>
                  </div>
                  <div class="buttext">
                  <div class="but">
                      <span style="color:#ff6e04;"  @click="gotixian(item.id,type)">提现</span>
                      <i>|</i>
                      <span @click="removebank(item,index)">解绑</span>
                  </div>
                  </div>
              </div>
            </div>
          </div>
            <!-- <loading :load.sync="loadshow" :end.sync="loadend"></loading> -->
        </template>
       
        <!-- 普通入驻 -->
        <template v-if="type == 1 ">
          <div class="bankcart" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3" >
            <div class="bankList" v-show=" bank.length != 0" >
              <p>对普通账户提现</p>
              <div class="cartList" v-for="(item,index) in bank" :key="index">
                  <div class="text">
                  <div class="bankname"><img src="@/assets/images/bank.png">{{item.bankName}}</div>
                  <div class="numbers">
                      <span>****</span>
                      <span>****</span>
                      <span>****</span>
                      <span>{{ item.bankCardNo.substr(-4) }}</span>
                  </div>
                  </div>
                  <div class="buttext">
                  <div class="but">
                      <span style="color:#ff6e04;"  @click="tixian(item.id)">提现</span>
                      <i>|</i>
                      <span @click="removebank(item,index)">解绑</span>
                  </div>
                  </div>
              </div>
            </div>
          </div>
            <loading :load.sync="loadshow" :end.sync="loadend"></loading>
        </template>
       
      
        <picture-viewer v-if="$store.state.picture1"  :imgUrl.sync="imgUrl"></picture-viewer>
        <picture-viewer v-if="$store.state.picture2"  :imgUrl.sync="list"></picture-viewer>
     
    </div>
</template>
<script>

export default {

    data(){
        return{
            topnav:{
                title:'银行卡'
            },
            bank:[],//普通银行卡入驻列表
            popupVisible:false,
            bankid:'',
            banklast:'',
            bankname:'',
            index: null,
            userid: this.$cookie.get('userid'),
            page:1,
            limit:10,
            loading:false,
            loadshow:true,
            loadend:false,
            isYLEnter: false,//是否入驻
            bankCardNo:'',//银联入驻银行卡号
            applyStatusText:'提交资料',
            YLbankName:'',//银联入驻银行卡号
            position: 1,//截取的位置
            isShowYLLink: true,
            isShowTX: false, //提现按钮
            agreen:false,
            imgUrl:[{
              url:require("@/assets/images/contract/hangyexieyi.png"),
              name: '行业成员资金管理授权确认书'
             
            }],
        
           
             list:[
            {
              url:require("@/assets/images/contract/yinlinruzhu.png"),
              name: '银行入驻手册11'
            }],
            type:this.$route.query.idx, //提现账户类型 0:入驻前1：银联 2：普通
            backshqPd: sessionStorage.getItem('applogin'), // app登录判断
            app: this.$route.query.platform,
        }
    },
     mounted(){
        this.getYLinfo();
    },
   
    methods:{
      
        loadMore(){
          this.loading = true;
          this.loadshow = true;
          let that = this;
          axios.post(this.Api + '/useraccount/list?page='+this.page+'&limit='+this.limit+'&userid='+this.userid).then(res => {
            let data = res.data;
          
            if(data.page.list == 0){
              that.loading = true;
              that.loadshow = false;
              if(that.bank.length == 0) that.loadend = true;
              return false;
            };
            (that.page)++;
            that.bank = that.bank.concat(data.page.list);
            console.log(that.bank,'8')
            that.loading = false;
            that.loadshow = false;
          });
        },
        addbank(){
          this.$router.push('/settings/bankCard');
        },
        removebank(obj,index){
          let that = this;
          MessageBox({
            title:"",
            message: '确定要解绑'+obj.bankName+'尾号为'+obj.bankCardNo.substr(-4)+'的银行卡吗？',
            showCancelButton: true
          }).then(action => {
            if(action ==='confirm'){
              axios({
                url:this.Api + '/useraccount/delete?id='+obj.id,
                method:"get",
                headers:{
                  "X-Nideshop-Token": this.$cookie.get('token')
                }
              }).then(res => {
                that.popupVisible = false;
                if(res.data == false){
                  Toast('系统错误，解绑失败！');
                  return false;
                };
                Toast('尾号为'+ obj.bankCardNo.substr(-4) +'的'+obj.bankName+'银行卡解绑成功！');
                that.bank.splice(index,1);
              });
            }else{
              that.popupVisible = false;
            }
          });
        },
        linkToBackYL(){
          //  this.$router.push('/settings/bankCardYL');
           if(this.app){
             window.location.href=this.YLApi+"wholesale/uploading?from=by&isApp="+this.app+"&seq="+this.$cookie.get('seq');
          }else{
            window.location.href=this.YLApi+"wholesale/uploading?from=by&seq="+this.$cookie.get('seq');
          }
         
        },
        linktoYLTX(type){
            this.$router.push('/settings/cashWithdrawal?index='+type);
        },
        tixian(id){
          // console.log(id);
          this.$router.push({path:'/settings/withdrawal',query:{bankid:id}});
        },
        gotixian(id,type){
          // console.log(id);
          this.$router.push({path:'/settings/separateWithdrawal', query:{bankid:id,index:type}});
        },
         // 获取银联入驻信息
        getYLinfo(){
            let seq = this.$cookie.get('seq');
            axios.get(this.Api + 'UnionPayEnter/findAccountInfo?seq='+ seq,{headers: { "X-Nideshop-Token": this.$cookie.get('token') }})
            .then(res => {
           
                 
                if(res.data.code == 200){
                let applyStatus = res.data.data.applyStatus;
                console.log(applyStatus);
                if(applyStatus == '20'){
                this.isYLEnter = true;
                
                return;
                }
            
                this.bankCardNo = res.data.data.bankCard;
                this.YLbankName = res.data.data.bankName;
                console.log(this.YLbankName);
                if(this.YLbankName){
                    let idx = this.YLbankName.indexOf('行'); //截取银行名称
                    this.position = idx +1;

                }
                     if(applyStatus == '21'){
                     this.applyStatusText = '提交资料';
                     this.isYLEnter = false;
                     return;
                     }
        
                if(applyStatus == '00' || applyStatus == '01'|| applyStatus == '02'||applyStatus == '03'){
                    this.isYLEnter = false;
                    this.applyStatusText = '审核中';
                    return;
                }
                if(applyStatus == '05'){
                    this.isYLEnter = false;
                    this.isShowTX = true;
                    this.applyStatusText = '入驻成功';
                    this.bankCardNo = res.data.data.bankCard;
                    return;
                }
                if(applyStatus == '04' || applyStatus == '99'){
                    this.isYLEnter = false;
                    this.applyStatusText ='入驻失败';
                    return;
                }
                            
                }
            })
        },
        linkToYLState(){
          if(this.app){
            window.location.href= this.YLApi + 'wholesale/uploadf?from=by&isApp='+this.app+'&seq='+this.$cookie.get('seq')
          }else{
            window.location.href= this.YLApi + 'wholesale/uploadf?from=by&seq='+this.$cookie.get('seq');
          }
          // 
        },
        agreenFn() {
          // this.imgurl =[{
          //     url:require("@/assets/images/contract/hangyexieyi.png"),
          //     name: '银行'
          //   }];
          // this.imgurl.url = require("@/assets/images/contract/hangyexieyi.png");
          // this.imgUrl.name ='银行'
              this.$store.commit("pictureView")          
        },
        agreenFn2() {
        

        this.$store.commit("pictureView2");
        
  
        },
        linkToVideo(){
          
            if (this.$route.query.platform == 'android') {
            this.$router.push('/video')
            }else{
               window.location.href="http://ndhimg.520shq.com/apk/ylrz.webm";
            }
             
        }
    }
}
</script>
<style scoped>
.topNav{
  position:fixed;
  left:0;
  top:0;
  width:100%;
  
}

.glode{
    padding-top:50px;
    min-height:100vh;
    width: 100%;
    background-color: #f2f2f2;
    padding-right: .6667rem /* 30/45 */;
    padding-left: .6667rem /* 30/45 */;
    box-sizing: border-box;
    overflow: hidden;
}

.bankCart{
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  /* align-items: stretch; */
  align-items: center;
  background:white;
  border-radius:.2222rem /* 10/45 */;
  margin-bottom: .4444rem /* 20/45 */;
  /* padding: .6667rem  0; */
}

.looking{
  font-size: .6rem /* 24/45 */;
  color: #999999;
  margin-bottom: .8889rem /* 40/45 */;
}
.looking p{
  line-height: 1.1rem;
}
.looking span {
  color: #2498ff;
}
.bankCart i{
   width: 1px;
   height: 1.3778rem /* 62/45 */;
   background-color: #d6d5d5;
   display: inline-block;
    
}
.enter{
  display: flex;
  justify-content: space-between;
  /* height: 1.3778rem ;
  line-height: 1.3778rem ; */
  font-size: .6667rem /* 30/45 */;
  width: 100%;
  /* padding-left: .8889rem ; */
  color: #333333;
  padding: .6667rem /* 30/45 */ 0 .6667rem /* 30/45 */ .8889rem /* 40/45 */;

}
.enter .img_box , .enter  .img_box2 {
  width: 100%;
}
.enter .img_box2 img{
  width: .9333rem /* 42/45 */;
  height: .9333rem /* 42/45 */;
  vertical-align: middle;
  margin-right: .6667rem /* 30/45 */;
}
.enter .img_box  img{
  width: 1.0667rem /* 48/45 */;
  height: .7111rem /* 32/45 */;
  vertical-align: middle;
  margin-right: .6667rem /* 30/45 */;
}
.enter .btn{
  color: #ff6e04;
}
.enter_text{
  font-size: .4889rem /* 22/45 */;
  margin-bottom: .4444rem /* 20/45 */;
  color: #999999;
}
.YLbank {
    padding-bottom: .8889rem /* 40/45 */;
    margin-top: .8889rem /* 40/45 */;
}
.cartList{
    width: 100%;
    padding: 0 .6667rem /* 30/45 */;
    box-sizing: border-box;
    margin-bottom: .4444rem /* 20/45 */;
}
.bankList p {
    font-size: .5333rem /* 24/45 */;
    color: #333333;
    margin-bottom: .4444rem /* 20/45 */;
} 
.bankList p.text{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bankList p i{
  color: #2498ff;
}
.bankList p.text span:last-child{
  font-size: .2667rem /* 12/45 */;
}
.bankList .cartList{
    background-color: #ffffff;
    width: 100%;
    padding: .6667rem /* 30/45 */ 1.2667rem /* 57/45 */;
    box-sizing: border-box;
    border-radius: .2222rem /* 10/45 */;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    align-items: stretch;
}
 .bankList .cartList .text{
  flex:1;
}
.bankList .cartList .buttext{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size:12px;
  color:#666;
}
.bankList .cartList .buttext .but i{
  padding:0 0.7em;
  color:#e9e9e9;
}
.bankList .cartList .text .bankname{
  font-size:16px;
  line-height:1.6em;
  color:#333;
  margin-bottom:0.4em;
}
.bankList .cartList .text .addtext{
  font-size:16px;
  line-height:1.6em;
  color:#fe7000;
}
.bankList .cartList .text .bankname img{
  width:auto;
  height:1em;
  vertical-align: middle;
  padding-right:0.5em;
}
.bankList .cartList .text .bankname .state{
 color:#fe7000;
 font-size: 14px;
 margin-left: .4444rem /* 20/45 */;
}
.bankList .cartList .text .numbers{
  font-size:14px;
  line-height:1.6em;
  color:#999;
}
.banklist .text .bankname .state{
 color:#fe7000;
 font-size: 14px;
 margin-left: .4444rem /* 20/45 */;
}
.glode >>> .imgName .center{
  margin: 0;
}
</style>

