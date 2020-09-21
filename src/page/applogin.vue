<template>
  <div class="mainbox">
    
  </div>
</template>

<script>
import appCookie from '@/assets/js/appCookie';
export default {
  name: 'login',
  data () {
    return {
      phone:'',
      password:''
    }
  },
  mounted() {
    let that = this;
    Indicator.open();
    window['login'] = function(login){
        let datas = JSON.parse(login);
        sessionStorage.setItem('applogin',true);// 520app登录跳转识别
        
        if(datas.lnglat && datas.cityMap){
          let lnglat = datas.lnglat;

          sessionStorage.setItem('cityMap', datas.cityMap);
          sessionStorage.setItem('LngLat', JSON.stringify({lng: lnglat.lng, lat: lnglat.lat}));
        };
        that.submit(datas.mobile,datas.password);
    };
  },
  methods: {
    submit(phone,password){
      let that = this;
      let post = {
        mobile: phone,
        password: password
      };
      axios.post(this.Api + '/auth/login',qs.stringify(post)).then(res => {
        let data = res.data;
        Indicator.close();
        
        if(data.code == 0){
          // 判断是否记录有登录后跳转的页面，如果没有则跳到首页
          let fullPath = sessionStorage.getItem('fullPath');
          let path = (fullPath && fullPath != '')?fullPath:'/';
          setTimeout(function(){
            that.$router.push({path:'/'});
            // 每次登录跳转都清除记录
            sessionStorage.removeItem('fullPath');
          },1000);
          // cookie保存登录信息
          appCookie(data);
        }else{
          Toast(data.msg);
        }
      });
    },
    toasfn(msg){
      Toast({
        message: msg,
        position: 'bottom',
        duration: 2000
      });
    }
  }
}
</script>

