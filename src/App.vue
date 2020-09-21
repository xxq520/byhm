<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>

    </div>
</template>

<script>
    // 定位
    import jsonpAdapter from 'axios-jsonp';
    import baiduMap from '@/components/baiduMap'
    export default {
        name: 'App',
        components: {

            baiduMap
        },
        data() {
            return {
                dituchake: false,
                map: false,
                transitionName: '',
                tatattaa: 998
            }
        },
        mounted() {
            let that = this;
            let timer = setInterval(() => {
                let login = sessionStorage.getItem('login') ? true : false;
                let applogin = sessionStorage.getItem('applogin') ? true : false;
                let LngLats = sessionStorage.getItem('LngLats') ? true : false;
                if (login) {
                    that.map = applogin || LngLats ? false : true;
                    sessionStorage.removeItem('login');
                    clearInterval(timer);
                };
            }, 50);
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {

                this.$store.commit('show')

            } else {

                this.$store.commit('hide')
            }
            setTimeout(() => {

                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {
                //   console.log('555');
                } else {
                    
                    var myCity = new BMap.LocalCity();
                    myCity.get(function (result) {
                        var myGeo = new BMap.Geocoder();
                        var point = new BMap.Point(result.center.lng, result.center.lat);
                        myGeo.getLocation(point, function (rs) {
                            var addComp = rs.addressComponents;
                            sessionStorage.setItem('cityMap', addComp.city);
                            sessionStorage.setItem('provMap', addComp.province);
                            sessionStorage.setItem('distMap', addComp.district);
                            sessionStorage.setItem('address', rs.address);
                            sessionStorage.setItem('LngLats', JSON.stringify({
                                lng: rs.point.lng,
                                lat: rs.point.lat
                            }));
                        })
                    });

                }
            }, 100);
        },
        methods: {

        }
    }

</script>
