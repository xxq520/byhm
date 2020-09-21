<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="adressSeach">
      <div class="city" @click="addressfn">
        <span>{{ !location.area?location.city:!location.city?location.prov:location.area }}<i class="el-icon-caret-bottom"></i></span>
      </div>
      <div class="seach"><input v-model="keyword" class="keyword"></div>
      <div class="sbtn" @click="searchKeywordfn">搜索</div>
    </div>
    <div class="cell" v-infinite-scroll="search" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
      <!--选择地址-->
      <div class="cell-item" v-for="(item,i) in ar" :key="i" @click="mapchangefn(item)">
        <div class="cell-icon"></div>
        <div class="cell-adress">
          <p>{{ item.title }}</p>
          <span>{{ item.address }}</span>
        </div>
      </div>
      <loading :load.sync="loadshow" :end.snyc="loadend"></loading>
      <baidu-map @ready="ready"></baidu-map>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      topnav:{
        title:'搜索详细地址'
      },
      location: this.$route.query.location?JSON.parse(decodeURIComponent(this.$route.query.location)):{},
      keyword: this.$route.query.keyword?decodeURIComponent(this.$route.query.keyword):'',
      searchKeyword:'',
      ar:[],
      mapbloon:false,
      loadshow:false,
      loadend:true,
      page:0,
      size:10,
      loading:true,
      local:new Object()
    }
  },
  computed: {
    ...mapState(["map"])
  },
  watch:{
    loading(val){
      if(!val) this.search();
    }
  },
  created(){
    this.mapbloon = this.map.point?true:false;
    if(this.mapbloon){
      this.$set(this.location, 'prov', this.map.province);
      this.$set(this.location, 'city', this.map.city);
      this.$set(this.location, 'area', this.map.area);
    };
  },
  mounted(){
    this.$nextTick(() => {
      $('.keyword').focus();
    });
  },
  methods: {
    addressfn(){
      this.$router.push({path:'/mapAdress/region'});
    },
    // 搜索输入
    searchKeywordfn(){
      this.ar = [];
      this.page = 0;
      this.loadshow = true;
      this.loadend = false;
      this.loading = true;
      this.local.search(this.keyword);
    },
    // 创建api检索
    ready({BMap, Map}){
      let that = this;    
      var options = {      
          onSearchComplete: function(res){   
              if (that.local.getStatus() == BMAP_STATUS_SUCCESS){
                  that.loading = false;
                  that.loadshow = false;
                  if(res.getPageIndex() >= res.getNumPages() - 1){
                    that.loadend = true;
                    that.loading = true;
                    that.loadshow = false;
                  };
                  that.arrfn(res);
              }      
          }      
      };      
      this.local = new BMap.LocalSearch(this.location.city, options);   
      this.local.search(this.keyword);
    },
    // 下拉分页
    search(){
      this.loadshow = true;
      this.loadend = false;
      (this.page)++;
      if(this.page>1) this.local.gotoPage(this.page - 1);
    },
    // 添加数组
    arrfn(obj){
      let that = this;
      let ar = [];
      console.log(obj)
      obj.Ir.forEach(post => {
        ar.push({
          province: post.province,
          city: post.city,
          area: post.area,
          title: post.title,
          address: post.address,
          point:{
            lng: post.point.lng,
            lat: post.point.lat
          }
        })
      });
      this.ar = this.ar.concat(ar);
    },
    mapchangefn(obj){
      this.changeMap(obj);
      this.$router.go(-1);
    },
    ...mapMutations(["changeMap","removeMap"])
  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  height:100vh;
  background:#f2f2f2;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
}
/* adressSeach */
.adressSeach{
  padding:0.5em 10px;
  font-size:0.65rem;
  overflow:hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: center;
  color:#333;
  background:white;
  margin-bottom:0.5em;
}
.city{
  padding-right:10px;
}
.adressSeach .seach{
  flex:1;
  padding:0.4em 1em;
  background:#f1f1f1;
  border-radius:2em;
}
.adressSeach .seach input{
  color:#989898;
  width:100%;
}
.adressSeach .sbtn{
  padding-left:10px;
  color:#333;
}
/* cell */
.cell{
  overflow:auto;
  background:white;
  flex:1;
}
.cell-item{
  overflow:hidden;
  border-bottom:1px solid #e9e9e9;
  padding:0.7em 10px;
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: center;
  font-size:0.6rem;
  color:#444;
  line-height:1.6em;
}
.cell-item .cell-adress{
  flex:1;
}
.cell-item .cell-adress p{
  font-size:0.65rem;
}
.cell-item .cell-adress p.phover{
  color:#f86b1f;
}
.cell-item .cell-adress span{
  display:block;
  color:#999;
}
.cell-item .cell-icon{
  overflow:hidden;
  width:1em;
}
</style>
