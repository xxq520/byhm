<template>
  <baidu-map style="display:none;" @ready="handler"></baidu-map>
</template>

<script>
import browser from '@/assets/js/browVesion'
export default {
  props: ['lnglat','change'],
  data () {
    return {
      
    }
  },
  watch:{
    change(val){
      this.handler({BMap, Map});

    }
  },
  mounted(){
    
  },
  methods: {
    handler ({BMap, Map}){
  
      Indicator.close();
      let that = this;
      let myGeo = new BMap.Geocoder();
   
      if(that.lnglat){
        that.getLocationfn(myGeo,that.lnglat);
      }else{
        
        var geolocation = new BMap.Geolocation();
        geolocation.enableSDKLocation();
    
        geolocation.getCurrentPosition(function(r){
       
          let lng= new Number(r.longitude) - 0;
          let lat= new Number(r.latitude) - 0;
          // 浏览器版本控制
          if(browser.brow() == 'chrome' && browser.vesion() < 60){
            lng = lng - 0.0055;
            lat = lat + 0.003;
          };

          that.getLocationfn(myGeo,{lng: lng, lat: lat});
        },{
          enableHighAccuracy: true
        });
      }
    },
    getLocationfn(obj,lt){

      let that = this;
      obj.getLocation(new BMap.Point(lt.lng, lt.lat), function(result){
          if (result){
            let ad = result.surroundingPois[0];
            let adc = result.addressComponents;
            let current = {
              province: adc.province,
              city: adc.city,
              area: adc.district,
              title: ad?ad.title : adc.streetNumber+adc.street,
              address: ad?ad.address : adc.province+adc.city+adc.district+adc.streetNumber+adc.street,
              point:{
                lng: lt.lng,
                lat: lt.lat 
              }
            };
            that.$emit("getCurrent",current);
          }else{
            Toast('定位错误，无法定位当前位置！');
            that.$emit("getCurrent",{});
          }
      });
    }
  }
}
</script>
<style>
iframe{display:none;}
</style>
