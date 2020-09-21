<template>
  <baidu-map v-if="visible" class="map" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler"
      @click="getClickInfo">
    <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="icon">
      <bm-label :content="cented.text" :labelStyle="{color: 'red', fontSize : '14px'}" :offset="labeloffset"/>
    </bm-marker>
     <bm-marker :position="map_center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="icon1">
         <bm-label content="当前位置" :labelStyle="{color: 'green', fontSize : '12px'}" :offset="labeloffset" />
     </bm-marker>
       <bm-transit :start="map_center" :end="center" :auto-viewport="true" location=""></bm-transit>
    <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="navigationoffset"></bm-navigation>
  </baidu-map>
 
    
</template>

<style scoped>
  .map{
    width:100%;
    height:100%;
  }
</style>

<script>
  export default {
    props: ['cented','visible'],
    data() {
      return {
        zoom: 14,
        center: {
          lng:116.404,
          lat:39.915
        },
        labeloffset:{
          width:-(this.cented.text.length/2)*14 +10,
          height:35
        },
        labeloffset1:{
        width:-(this.cented.text.length/2)*14 +30,
        height:20
        },
        navigationoffset:{},
        icon:{
          url: require('@/assets/images/map.png'), size: {width: 25, height: 25}
        },
         icon1:{
         url: require('@/assets/images/timg.jpg'), size: {width: 20, height: 30}
         },
        map_center:'',
        shop_lng:'',
        shop_lat:'',
        address:'',
        map_center:''
      };
    },
    mounted(){

  
 
    },
    methods: {
      handler({BMap, Map}){
        this.center = {
          lng:this.cented.lnglat[0],
          lat:this.cented.lnglat[1]
        };
        this.navigationoffset = {
          width:20,
          height:$('.map').height() - 100
        }
            let geolocation = new BMap.Geolocation()
            let _this = this
            geolocation.getCurrentPosition(function(r) {
           
            _this.map_center = r.point;
           
            _this.shop_lng = r.point.lng;
            _this.shop_lat = r.point.lat;   
              console.log(r.point.lng,r.point.lat)
           
            })    
      },
          getClickInfo (e) {
         
          this.center.lng = e.point.lng
          this.center.lat = e.point.lat
          }
      
    }
  };
</script>