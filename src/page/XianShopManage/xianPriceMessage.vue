<template>
  <div class="mainbox">
    <mt-header title="店铺优惠管理">
      <mt-button icon="back" slot="left" @click="back"></mt-button>
      <mt-button slot="right" @click="addPrice"><i class="el-icon-plus" style="font-size:18px;"></i></mt-button>
    </mt-header>
    <div class="cart-main">

      <div class="cart-item" v-for="(item,index) in update" :key="index">
        <div class="cart-title">
          <p>编辑店铺优惠</p>
          <span @click="clearfn(item.id,index)"><i class="el-icon-delete"></i>删除</span>
        </div>
        <div class="cart-box">
          <div class="cart-list">
            <label>优惠类型:</label>
            <p class="lmain"><input type="text" placeholder="选择优惠类型" readonly :value="item.type==0?'活动':item.type==1?'优惠':''" @click="typefn(index,'update')"></p>
          </div>
          <!-- <div class="cart-list">
            <label>优惠标题:</label>
            <p class="lmain"><input type="text" placeholder="限制字数，不超过30个" :value="item.name" @blur="valuefn($event,index,'name')"></p>
          </div> -->
          <div class="cart-list">
            <label>优惠详情:</label>
            <p class="lmain"><textarea type="text" class="detail" placeholder="限制字数，不超过100个" :value="item.detail" @blur="valueDetailfn($event,index,'detail')"></textarea></p>
          </div>
        </div>
      </div>

      <div v-if="update.length == 0" class="addWrap" @click="addPrice">
        <img src="@/assets/images/add.png" alt="">
        <p>暂无优惠</p>
      </div>
    </div>
    <div class="sub" @click="submitfn">确定修改</div>
    <!--选择优惠类型-->
    <mt-popup v-model="typeVisible" position="bottom">
      <div class="visiblebtn">
        <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
        <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
      </div>
      <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
    </mt-popup>
    <!--添加优惠-->
    <mt-popup v-model="rightVisible" position="right">
      <mt-header title="添加店铺优惠">
        <mt-button icon="back" slot="left" @click="rightPopup"></mt-button>
      </mt-header>
      <div class="cart-item" style="padding:1rem 10px;border-radius:0;" v-for="(item,index) in savedata" :key="index">
        <div class="cart-title">
          <p>添加店铺优惠</p>
        </div>
        <div class="cart-box">
          <div class="cart-list">
            <label>优惠类型:</label>
            <p class="lmain"><input type="text" placeholder="选择优惠类型" :value="item.type==0?'活动':item.type==1?'优惠':''" readonly @click="typefn(index,'save')"></p>
          </div>
          <!-- <div class="cart-list">
            <label>优惠标题:</label>
            <p class="lmain"><input type="text" placeholder="限制字数，不超过30个" @blur="saveName($event,index,'name')"></p>
          </div> -->
          <div class="cart-list" style="border-bottom:1px solid #eee">
            <label>优惠详情:</label>
            <p class="lmain"><textarea type="text" class="detail" placeholder="限制字数，不超过100个" @blur="detailfn($event,index,'detail')"></textarea></p>
          </div>
        </div>
      </div>
      <div v-if="savedata.length > 0" class="addsub" @click="addfn">确定添加</div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  name: 'priceMessage',
  data () {
    return {
      list:1,
      savedata:[],
      update:[],
      typeVisible:false,
      rightVisible: false,
      typeModel:'',
      index:'',
      arrTpye:'',
      typeslots:[
        {
          flex: 1,
          values: [
            {
              type:0,
              name:'活动'
            },
            {
              type:1,
              name:'优惠'
            }
          ],
          textAlign: 'center'
        }
      ]
    }
  },
  mounted() {
    this.getpostfn();
    
  },
  methods: {
    back(){
      this.$router.go(-1);
    },
    getpostfn(){
      let that = this;
      that.update = [];
      that.savedata = [];
      axios({
        url:this.Api + 'voucher/anoInfo?merid='+that.$route.query.id,
        method:"post",
      }).then(res => {
        console.log(res)
        let data = res.data;
        for(var i in data.data){
          data.data[i].forEach(p => {
            let post = {
              id:p.id,
              type:p.type,
              name:p.name,
              detail:p.detail,
              merid: that.$route.query.id
            };
            that.update.push(post);
          });
        };
      });
    },
    rightPopup(){
      this.rightVisible = false;
      this.savedata = [];
    },
    // saveName(ev,i,t){
    //   let text = ev.currentTarget.value;
    //   ev.currentTarget.value = text.substring(0,30);
    //   this.savedata[i][t] = ev.currentTarget.value;
    // },
    detailfn(ev,i,t){
      let text = ev.currentTarget.value;
      ev.currentTarget.value = text.substring(0,100);
      this.savedata[i][t] = ev.currentTarget.value;
    },
    addPrice(){
      let that = this
      if(this.update.length >= 5){
        Toast('只能填写5条优惠！');
        return false;
      };
      this.rightVisible = true;
      let post = {
        detail:'',
        name:'',
        type:0,
        merid: that.$route.query.id
      };
      this.update.forEach(data => {
        if(data.type == 0) post.type = 1;
      });
      this.savedata.push(post);
    },
    // 添加优惠
    addfn(){
      // for(var i=0;i<this.savedata.length;i++){
      //   for(var y in this.savedata[i]){
      //     if(this.savedata[i][y] === '' || this.savedata[i][y] === null){
      //       Toast('请把信息填完整后再添加！')
      //       return false;
      //     }
      //   }
      // };
      Indicator.open();
      this.rightVisible=false;
      console.log(this.savedata)
      axios({
        url:this.Api + 'voucher/helpSave',
        method:"post",
        data:this.savedata,
        headers:{
          "X-Nideshop-Token": this.$cookie.get('token')
        }
      }).then(res => {
        Toast(res.data.errmsg)
        Indicator.close();
        if(res.data.errno == 0){
          this.getpostfn();
        }
      }).catch((err)=>{
        Indicator.close();
        Toast(err.message);
      })
    },

    valuefn(e,i,t){
      let text = e.currentTarget.value;
      e.currentTarget.value = text.substring(0,30);
      this.update[i][t] = e.currentTarget.value
    },
    valueDetailfn(e,i,t){
      let text = e.currentTarget.value;
      e.currentTarget.value = text.substring(0,100);
      this.update[i][t] = e.currentTarget.value
    },
    // 修改优惠
    submitfn(){
      if(this.update.length==0){
        Toast('请添加优惠！')
        return false;
      }
      // for(var i=0;i<this.update.length;i++){
      //   for(var y in this.update[i]){
      //     if(this.update[i][y] === '' || this.update[i][y] === null){
      //       Toast('请把信息填完整后再修改！')
      //       return false;
      //     }
      //   }
      // };
      Indicator.open();
      axios({
        url:this.Api + '/voucher/update',
        method:"post",
        data:this.update,
        headers:{
          "X-Nideshop-Token": this.$cookie.get('token')
        }
      }).then(res => {
        Indicator.close();
        Toast(res.data.errmsg);
        if(res.data.errno == 0){
          this.getpostfn();
        }
      }).catch((err)=>{
        Indicator.close();
        Toast(err.message);
      })
    },
    // 删除优惠
    clearfn(id,i){
      let that = this;
      let arr = {};
      arr.ids = id;
      MessageBox({
        title: '提示',
        message: '<p style="text-align:center;text-indent:0;">是否删除优惠?<p>',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        closeOnClickModal: false
      }).then(action => {
        if(action ==='confirm'){
          Indicator.open();
          axios({
            url:that.Api + 'voucher/delete',
            method:"post",
            data:qs.stringify(arr),
          }).then(res => {
            Toast(res.data.errmsg)
            Indicator.close();
            if(res.data.errno == 0){
              that.getpostfn();
            }
          }).catch((err)=>{
            Indicator.close();
            Toast(err.message);
          });
                    
        }
      });
      
    },
    //
    // 
    typefn(i,type){
      this.typeVisible = true;
      this.index = i;
      this.arrTpye = type;
    },
    typechange(picker, values){
      this.typeModel = values[0];
    },
    quedingfn(){
      this.typeVisible = false;
      // for(var i=0;i<this.update.length;i++){
      //   if(this.update[i].type == this.typeModel.type){
      //     Toast({
      //       message: this.typeModel.name+'已经存在。',
      //       position: 'bottom',
      //       duration: 2000
      //     });
      //     return false;
      //   }
      // };
      if(this.arrTpye == 'update'){
        this.update[this.index].type = this.typeModel.type;
      }else if(this.arrTpye == 'save'){
        this.savedata[this.index].type = this.typeModel.type;
      };
      this.index = '';
      this.arrTpye = '';
    },
    quxiaofn(){
      this.typeVisible = false;
      this.index = '';
      this.arrTpye = '';
    },
  }
}
</script>

<style scoped>
.mint-header{background:#ff911e;height:auto;border-bottom:none;font-size:.8rem;}
.cart-main{
  padding:1rem 0.5rem 1.8rem;
}
.cart-main .addWrap{
  width:100%;
  margin:1rem auto;
  text-align: center;
}
.cart-main .addWrap img{
  width: 2.3333rem;
  height: 2.3333rem;
}
.cart-main .addWrap p{
  font-size:0.6rem;
  color:#999;
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
  overflow:hidden;
}
.cart-item .cart-title p{
  float:left;
}
.cart-item .cart-title span{
  float:right;
  color:#999;
  font-size:0.6rem;
}
.cart-item .cart-title span i{
  padding-right:0.1rem;
}
.cart-item .cart-box{
  padding:0 0.5rem;
}
.cart-item .cart-box .cart-list{
  overflow:hidden;
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
  width:7em;
  color:#333;
}
.cart-item .cart-box .cart-list p.lmain{
  float:right;
  width:calc(100% - 7em);
  color:#333;
}
.cart-item .cart-box .cart-list input{
  width:100%;
  font-size:0.6rem;
}
.sub{
  position:fixed;
  left:0;
  bottom:0;
  display:block;
  text-align: center;
  color:white;
  padding:0.4rem 0;
  width:100%;
  font-size:0.7rem;
  line-height:1.6em;
  background:#ff8f28;
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
.mainbox >>> .mint-popup-right{
  height:100%;
}
.addsub{
  display:block;
  text-align: center;
  color:white;
  padding:0.4rem 0;
  width:60%;
  font-size:0.7rem;
  line-height:1.6em;
  background:#ff8f28;
  border-radius:20rem;
  margin:0 auto;
}
.cart-list .detail {
  width: 100%;
  height: 90px;
}
</style>
