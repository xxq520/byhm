<template>
   <div class="ChangeName">
     <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <!--  -->
    <div class="telwrap">
         <div class="tel">
             <mt-field disableClear label='昵称：' placeholder="请输入昵称" type="text" v-model.trim="username" ></mt-field>
         </div>
       <span id="padd">* 昵称长度不超过10位</span>
        <div class="btnwrap">
          <mt-button  class="btn" type="default" @click="sureChange">确定修改</mt-button>
        </div>
     </div>
   </div>

</template>

<script type="text/javascript">
export default {
   name: 'ChangeName',
   data() {
       return {
        topnav:{
          title:'修改昵称'
        },
        username:'',
        id:this.$cookie.get('userid')
       }
   },
   mounted(){

   },
   methods: {
    sureChange(){ 
      // console.log(this.username,'6')
    
      if (!this.username || this.username == null) {
        Toast('昵称不能为空')
      }else if (this.username.length > 10) {
        Toast('昵称长度不超过10位')
      }else{
        let params = {
          id:this.id,
          nickname:this.username,
        }
        axios.post(this.Api+'/user/updateBasicInfo',params).then(res=>{
          if (res.data.code == 0) {
            Toast(res.data.msg)
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          }else{
            Toast('网络异常，请重试！')
          }

        })
      }
    }
   }
}
</script>

<style scoped>
@import '../../../assets/fonts/password/style.css';
  .telwrap .btnwrap{
    width: 100%;
  }
  .telwrap .btn{
    width: 100%;
    height: 1.7778rem;
    font-size: .7111rem;
    background-color: #FF9500;
    color: #FEFEFE ;
    position: fixed;
    bottom: 0;
  }
  .telwrap #padd{
    color: #EC0746;
    font-size: .4889rem;
    padding-left: .8889rem /* 40/45 */;
    display: block;
    margin-top: .4rem /* 18/45 */;
  }
  .ChangeName >>> .mint-cell:first-child .mint-cell-wrapper{
    background: none;
    border-bottom: 1px solid #ccc
  }
  .ChangeName >>> .mint-cell-title{
    font-size:15px;
  }
  .ChangeName >>> .mint-field .mint-cell-title{
    width:5.5em;
  }
  .ChangeName >>> .mint-field-core{
    font-size:15px;
  }
</style>
