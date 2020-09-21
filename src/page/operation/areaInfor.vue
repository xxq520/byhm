<template>
  <div class="agent-application">
      <div class="top">
          <i class="el-icon-arrow-left" @click="goback"></i>
          <span>{{topnav.title}}</span>
      </div>
      <div class="main">
        <ul v-for="item in areaList">
          <li class="abs">负责区域
            <p class="aba">{{item.area}}</p>
          </li>
          <li>有效期
           <p class="aba">{{item.termStr}}</p>
          </li>
        </ul>
      </div>
        
  </div>
</template>

<script>
export default {
  data () {
    return {
      topnav:{
        title:'负责区域'
      },
      type:this.$route.query.type,
      userid: this.$cookie.get('userid'),
      areaList:[]
    }
  },
  mounted() {
    
  this.getArea()
  },
  methods: {
      getArea() {
      axios({
      method: 'get',
      url: this.Api + 'user/getResponsibleArea?userId=' + this.userid +
      '&type=' + this.type,
      headers: {
      "X-Nideshop-Token": this.$cookie.get("token")
      }
      }).then(res => {
      if (res.data.code == 0) {

      this.areaList = res.data.data;
      }
      console.log(this.areaList, '5')
      })


      },
      goback() {
    
  
      if (this.$route.query.platform == 'android') {
    
      window.action.backAPP();
      } else if (this.$route.query.platform == 'ios') {
      
      window.action.backAPPiOS();
      } else {
        this.$store.commit("bbb");
      this.$router.go(-1)
      }

      }
  }
}
</script>

<style scoped>
  .top{
  width: 100%;
  height: 40px;
  background-color: #ff911e;
  color:#fff;
  display: flex;
  line-height: 40px;
  text-align: center;
  }
  .top i{
  flex: 1;
  line-height: 40px !important;
  font-size: 20px !important;
  }
  .top span {
  flex: 9;
  font-size: 18px;
  text-indent: -50px;
  }
  .agent-application{
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
  }
 .main {
   font-size: 0.62rem;
   color: #666;
 }
 .main ul {
   margin-top: 0.5rem;
   background-color: #fff;
   padding: 0.1rem  0.3rem;
 }
 .main ul li{
   display: flex;
   height: 1.8rem;
   line-height: 1.8rem;
 }
  .main ul .abs{
  border-bottom: 1px solid #eee;
  }
  .main ul li .aba{
     text-align: right;
     flex: 1;
     padding-right: 0.3rem;
  }
</style>
