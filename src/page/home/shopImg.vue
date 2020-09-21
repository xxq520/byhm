<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="official">
      <div class="cart-list">
        <label>官方图片</label>
        <router-link :to="`/officialImg?id=${id}`" class="lmain">查看全部<i class="el-icon-arrow-right mr-l-14"></i></router-link>
      </div>
      <div class="pubu">
        <div class="pubu_k" v-for="(item,i) in official" :key="i" v-if="i<2">
          <img  :xsrc="item.imgUrl">
        </div>
      </div>
      <loading :load.sync="officialloadshow"></loading>
    </div>
    <div class="friend">
      <div class="cart-list">
        <label>网友图片</label>
      </div>
      <div class="pubu" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
        <div class="pubu_k" v-for="(item,i) in friend" :key="i">
          <img  :xsrc="item.picUrl">
        </div>
      </div>
      <loading :load.sync="friendloadshow" :end.sync="friendloadend"></loading>
    </div>
  </div>
</template>

<script>
import pubu from '@/assets/js/pubu'
export default {
  data () {
    return {
      topnav:{
        title:'全部图片'
      },
      id:this.$route.query.id,
      official:[],
      friend:[],
      page:1,
      size:6,
      friendloadend:false,
      friendloadshow:true,
      loading:false,
      officialloadshow:true
    }
  },
  mounted() {
    pubu();
    this.officialimg();
  },
  methods: {
    officialimg (){
      axios({
        url:this.Api + 'merchant/queryMerchantPicture?type=0&merid=' + this.id,
        method:"get"
      }).then(res => {
        let data = res.data;
        this.officialloadshow = false;
        if(data.code == 0){
          this.official = data.list;
          this.$nextTick(function(){
            $('.official .pubu').Pubu('.official .pubu_k');
          });
        };
      });
    },
    loadMore (){
      let param = {
        page:this.page,
        size:this.size,
        merid:this.id
      };
      this.friendloadshow = true;
      this.loading = true;
      axios({
        url:this.Api + 'merchant/queryHomepagePicture',
        params:param,
        method:"get"
      }).then(res => {
        let data = res.data;
        this.friendloadshow = false;
        if(data.code == 0){
          if(data.resultMap.pageUtil.list.length == 0){
            this.loading = true;
            this.friendloadend = true;
            return false;
          };
          (this.page)++;
          this.friend = this.friend.concat(data.resultMap.pageUtil.list);
          this.loading = false;
          this.$nextTick(function(){
            $('.friend .pubu').Pubu('.friend .pubu_k');
          });
        };
      });
    },
  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  padding-top:40px;
  min-height:100vh;
  background:#f2f2f2;
}
.mainbox >>> .mint-header{position:fixed;left:0;top:0;width:100%;z-index:999;}

.official, .friend{
  overflow:hidden;
  background:white;
  margin-bottom:0.5rem;
}
.cart-list{
    display: -webkit-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    padding: 0.5rem 10px;
    font-size: 0.7rem;
    border-bottom: 1px solid #eee;
    margin-bottom:10px;
}
.cart-list label{
    float: left;
    flex:1;
    color: #333;
}
.cart-list .lmain{
    display: -webkit-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 0.6rem;
    color: #999;
}
.cart-list .lmain i{
   font-size:0.7rem;
   padding-left:0.1rem;
}
.pubu{
  width:calc(100% - 20px);
}
.pubu_k{
  width:calc(50% - 5px);
}
.pubu_k img{
  display:block;
}
</style>
