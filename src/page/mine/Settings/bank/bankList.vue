<template>
  <div class="glode">
    <topnav :topnav="topnav"></topnav>
    <div class="bankcart">

      <div class="banklist" >
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
            <span style="color:#ff6e04;" v-if="isShowTX">提现</span>
            <i v-if="isShowTX">|</i>
            <span @click="linkToYLState">查看</span>
           
          </div>
        </div>
      </div>
      <div class="banklist" style="margin-bottom:0;" @click="addbank">
        <div class="text">
          <div class="addtext">+添加银行卡</div>
        </div>
      </div>
    </div>
    <div class="bankcart" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
   
      <div class="banklist" v-for="(item,index) in bank" :key="index">
        <div class="text">
          <div class="bankname"><img src="@/assets/images/bank.png">{{ item.bankName }}</div>
          <div class="numbers">
            <span>****</span>
            <span>****</span>
            <span>****</span>
            <span>{{ item.bankCardNo.substr(-4) }}</span>
          </div>
        </div>
        <div class="buttext">
          <div class="but">
            <span style="color:#ff6e04;" @click="tixian(item.id)">提现</span>
            <i>|</i>
            <span @click="removebank(item,index)">解绑</span>
          </div>
        </div>
      </div>
      
    </div>
    <loading :load.sync="loadshow" :end.sync="loadend"></loading>

  </div>  
</template>

<script>
export default {
  data() {
    return {
      topnav:{
        title:'我的银行卡'
      },
      bank:[],
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
    }
  },
  mounted(){
    this.getYLinfo();
  },
  methods: {
    back(){
      this.$router.go(-1);
      
    },
    tixian(id){
      console.log(id);
      this.$router.push('/settings/withdrawal?bankid='+id);
    },
    addbank(){
      this.$router.push('/settings/bankCard');
    },
    linkToBackYL(){
      //  this.$router.push('/settings/bankCardYL');
      window.location.href=this.YLApi+"wholesale/uploading?from=by&seq="+this.$cookie.get('seq');
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
    loadMore(){
      this.loading = true;
      this.loadshow = true;
      let that = this;
      axios.post(this.Api + '/useraccount/list?page='+this.page+'&limit='+this.limit+'&userid='+this.userid).then(res => {
        let data = res.data;
        console.log(res.data)
        if(data.page.list == 0){
          that.loading = true;
          that.loadshow = false;
          if(that.bank.length == 0) that.loadend = true;
          return false;
        };
        (that.page)++;
        that.bank = that.bank.concat(data.page.list);
        that.loading = false;
        that.loadshow = false;
      });
    },
    // 查看银联入驻状态
    linkToYLState(){
      window.location.href= this.YLApi + 'wholesale/uploadf?from=by&seq='+this.$cookie.get('seq');
    },
    // 获取银联入驻信息
    getYLinfo(){
      console.log(111);
      let seq = this.$cookie.get('seq');
      axios.get(this.Api + 'UnionPayEnter/findAccountInfo?seq='+ seq,{headers: { "X-Nideshop-Token": this.$cookie.get('token') }})
      .then(res => {
        console.log(res);
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
  padding-top:44px;
  min-height:100vh;
}

.bankcart{
  overflow:hidden;
  margin:0.5rem 0;
  padding:0 10px;
}
.banklist{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: stretch;
  padding:0 0.8em;
  background:white;
  border-radius:5px;
  margin-bottom:0.5em;
}
.banklist .text{
  flex:1;
  margin:0.6em 0;
}
.banklist .buttext{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size:13px;
  color:#666;
}
.banklist .buttext .but i{
  padding:0 0.7em;
  color:#e9e9e9;
}
.banklist .text .bankname{
  font-size:16px;
  line-height:1.6em;
  color:#333;
  margin-bottom:0.4em;
}
.banklist .text .addtext{
  font-size:16px;
  line-height:1.6em;
  color:#fe7000;
}
.banklist .text .bankname img{
  width:auto;
  height:1em;
  vertical-align: middle;
  padding-right:0.5em;
}
.banklist .text .bankname .state{
 color:#fe7000;
 font-size: 14px;
 margin-left: .4444rem /* 20/45 */;
}
.banklist .text .numbers{
  font-size:14px;
  line-height:1.6em;
  color:#999;
}
.banklist:last-child{
  border-bottom:none;
}
/* 银联入驻 */
.unionPay{
  display: flex;
  justify-content: space-between;
  padding: .9778rem /* 44/45 */ 0;
  font-size: .6667rem /* 30/45 */;
  width: 100%;
}
.unionPay .img_box{
 
}
.unionPay  img{
  width: 1.0667rem /* 48/45 */;
  height: .7111rem /* 32/45 */;
  vertical-align: middle;
  margin-right: .6667rem /* 30/45 */;
}
.unionPay .btn{
  color: #ff6e04;
}
</style>
