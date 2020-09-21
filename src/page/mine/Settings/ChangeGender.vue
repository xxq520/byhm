<template>
   <div class="ChangeGender">
     <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <div class="choose">
      <div class="line" @click="sexfn(0)"><p>男</p><i v-if="sex==0" class="el-icon-circle-check"></i></div>
      <div class="line" @click="sexfn(1)"><p>女</p><i v-if="sex==1" class="el-icon-circle-check"></i></div>
    </div>
   </div>
</template>

<script type="text/javascript">
import jquery from 'jquery'
export default {
   name: 'ChangeGender',
   data() {
       return {
        topnav:{
          title:'性别选择'
        },
        id:this.$cookie.get('userid'),
        sex:0,//1:女  0：男
       }
   },
   mounted(){
     let params = {
      id:this.id,
      type:this.$cookie.get('level_id')
    }
    axios.get(this.Api + '/user/queryUserData',{params:params}).then(res=>{
      this.sex = res.data.gender
    })
   },
   methods: {
    sexfn(val){
      this.sex = val
      let params = {
          id:this.id,
          gender:this.sex,
        }
        axios.post(this.Api+'/user/updateBasicInfo',params).then(res=>{
          if (res.data.code == 0) {
            this.$router.go(-1)
            Toast(res.data.msg)
          }else{
            Toast('网络异常，请重试！')
          }

        })

    }
   }
}
</script>

<style scoped>
  .ChangeGender .choose {
   padding: 0 .6667rem;
  }
  .ChangeGender .choose .line{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    min-height: 48px;
    font-size: 16px;
    color: #333333;
    border-bottom: 1px solid #EEEEEE;
  }
  .ChangeGender .choose .line p, .ChangeGender .choose .line i{
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .ChangeGender .choose .line i{
    font-size:18px;
    color:#ec0746;
  }
</style>
