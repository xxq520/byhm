<template>
  <div class="mainbox">
      <topnav :topnav="topnav"></topnav>
      <!--  -->
      <div class=topTab v-if="isShow">
        <p @click="changeState(0)">全部收益</p>
        <p @click="changeState(1)">发展收益</p>
        <p @click="changeState(2)">管理收益</p>
      </div>
      <div class="mainTab">
          <div>
              <p>{{Number(total).toFixed(2)}}</p>
              <p>总收益(元)</p>
          </div>
          <div>
              <p>{{count}}</p>
              <p>收益次数</p>
          </div>
      </div>
    <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
      <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
      <div class="itembox" v-else>
         <ul >
              <li v-for="(item,index) in list" :key="index">
                  <p><span>{{item.cardNo}}<i>{{item.levelName}}</i></span><span
                           class="price">+￥{{(item.profitStr*100/100).toFixed(2)}}</span></p> 
                          
               <!-- <p><span>{{item.cardNo}}<i>{{item.levelName}}</i></span><span
                       class="price">+￥{{item.profitStr}}</span></p> -->
                  <p><span>{{ formData(item.createTime,'YY')}}</span><span>{{item.remark}}</span>
                  </p>
              </li>
          </ul>
         <loading :load.sync="loadshow" :end.sync="loadend"></loading>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Earndetail',
  data () {
    return {
      topnav:{
        title:'收益明细',
      },
      messagebtn:0,
      nodata:false,
      loading:false,
      list:[],
      loadshow:true,
      loadend:false,
      userId:this.$cookie.get('userid'),
      pageNum:1,
      pageSize:10,
      isShow:false, //是否显示tab
      total:'',
      type:0,
      count:'', //
       allLoaded: false,
    }
  },
  mounted() {
    if(this.$route.query.type == 1){
      this.type  = 1;
      this.list = [];
      this. pageNum = 1;
    }else{
      this.type = 2;
      this.list = [];
      this. pageNum = 1;
    }
  },
  methods: {
    goback() {
      // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
      // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
      // console.log(this.$route.query.from);
    if (this.$route.query.platform == 'android') {
    this.$store.commit("bbb");
    window.action.backAPP();
    } else if (this.$route.query.platform == 'ios') {
    this.$store.commit("bbb");
    window.action.backAPPiOS();
    } else {
    this.$store.commit("bbb");
    this.$router.go(-1)
    }
    },
  

    loadMore() {
      this.loading = true;
      this.loadshow = true;
      let that = this;
      let param = {
        userId:this.userId,
        pageNo:this.pageNum,
        pageSize:this.pageSize,
        profitType:this.type

      }
      // axios.get(this.Api+'/benefit/list',{params:param}).then(res=>{
      //   if (res.status == 200) {
      //     let data = res.data.page;
      //     if (data.list.length == 0) {
      //       that.loadend = true;
      //       that.loadshow = false;
      //       that.loading = true;
      //       return false;
      //     };
      //     (that.pageNum)++;
      //     that.list = that.list.concat(data.list)
      //     that.loading = false;
      //     that.loadshow = false;
      //     that.list.length != 0 ? this.nodata = false : this.nodata = true;
      //   }else{
      //     Toast('后台异常，请联系管理员')
      //   }
      // })

       axios({
        method:'get',
        url:this.Api + 'benefit/user/profit/detail',
        params:param,
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token")
        }
      }).then(res =>{
        console.log(res,'58');
        if(res.data.code == 0){
          this.total = res.data.totalProfit;
          this.count = res.data.page.total;
          this.list = this.list.concat(res.data.page.list);

          if(res.data.page.hasNextPage == false){
            this.loadend = true;
            this.loadshow = false;
            this.loading = true;
            return false;
          }
         
          this.pageNum++;
          console.log(this.pageNum);
          
          this.loading = false;
          this.loadshow = false;
          // this.list.length != 0 ? this.nodata = false : this.nodata = true;
        }
      })
   
    },
    getList(){
      let param = {
        userId:this.userId,
        pageNum:this.pageNum,
        pageSize:this.pageSize,
        profitType:this.type
      }
      axios({
        method:'get',
        url: this.Api + 'benefit/user/profit/detail',
        params:param,
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token")
        }
      }).then(res =>{
        console.log(res);
        if(res.data.code == 0){
          this.total = res.data.totalProfit;
          this.count = res.data.page.total;
          if(res.data.page.nextPage == false){
            this.loadend = true;
            this.loadshow = false;
            this.loading = true;
            return false;
          }
          
          (this.pageNum)++
          console.log(this.pageNum);
          this.list = this.list.concat(res.data.page.list);
          this.loading = false;
          this.loadshow = false;
          this.list.length > 0 ? this.nodata = true :this.nodata = false;
        }
      })
   
    },
    formData(time){
      var date = new Date(time);
      var Y = date.getFullYear() + '.';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
      var D = date.getDate()<10 ? '0'+ date.getDate():date.getDate();
      var h = date.getHours() <10 ? '0'+date.getHours() :date.getHours();
      var m = date.getMinutes() <10 ? '0'+date.getMinutes() : date.getMinutes() ;
      var s = date.getSeconds() <10 ? '0'+date.getSeconds() : date.getSeconds();
      return Y+M+D+' '+h+':'+m+':'+s;
    },
 
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
   position: relative;
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
   .topTab{
     position: absolute;
     right: .4444rem /* 20/45 */;
     width: 3.7778rem /* 170/45 */;
     background-color: #616161;
     border-radius:.4444rem /* 20/45 */;
     top: 40px;
     padding: 0 .3333rem /* 15/45 */;
   }
   .topTab::after{
    content: '';
    position: absolute;
    right: .4444rem /* 20/45 */;
    top: -5px;
    width:0;
    height:0;
    border-right:.4rem solid transparent;
    border-left:.4rem solid transparent;
    border-bottom:.5rem solid #616161;

   }
  .topTab p{
    height: 1.3333rem /* 60/45 */;
    line-height: 1.3333rem /* 60/45 */;
    border-bottom: 1px solid #1c1c1c;
    color: #ffffff;
    font-size: .4889rem /* 22/45 */;
    text-align: center;
  }
  .topTab p:last-child{
    border-bottom: none;
  }
  
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
}

  /* loading */
  .loading{
    width:100%;
    overflow:hidden;
    text-align: center;
    font-size:14px;
    color:#666;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding:10px 0;
  }
  .loading >>> .mint-spinner-fading-circle{
    display:inline-block;
    margin-right:5px;
  }

  .mainTab{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .4889rem /* 22/45 */ 0;
    text-align: center;
    font-size: .8889rem /* 40/45 */;
    color: #333333;
    margin-bottom: .4444rem /* 20/45 */;

}
.mainTab div {
    width: 50%;
    border-left: 1px solid #f2f2f2;
}
.mainTab p:first-child{
    padding: .3333rem /* 15/45 */ 0;
}
.mainTab p:last-child{
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.maixBox {
    background-color: #fff;
    padding: 0 .4444rem /* 20/45 */;
}
.maixBox ul li {
    border-bottom:  1px solid #eeeeee;
    padding: .6667rem /* 30/45 */ 0;
    
}
.maixBox ul li  p{
    display: flex;
    justify-content: space-between;
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.maixBox ul li  p:first-child{
    font-size: .5778rem /* 26/45 */;
    color: #333333;
    line-height: .7111rem /* 32/45 */;
    padding-bottom: .2667rem /* 12/45 */;
    
}
.maixBox ul li  p i{
    padding: 0 .4444rem /* 20/45 */ ;
    height: .7111rem /* 32/45 */;
    line-height: .7111rem /* 32/45 */;
    font-size: .4444rem /* 20/45 */;
    color: #ffffff;
    background-color: #ff6e04;
    display: inline-block;
    border-radius: .3556rem /* 16/45 */;
    margin-left: .6667rem /* 30/45 */;
    vertical-align: top;

}
.maixBox ul li  p .price{
    color: #ff6e04;
    font-size: .6667rem /* 30/45 */;

}

.maixBox ul li:last-child{
    border-bottom: none;
}
</style>
