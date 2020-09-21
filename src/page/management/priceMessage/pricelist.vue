<template>
  <div class="mainbox">
    <mt-header :title="$route.query.text" fixed>
      <mt-button icon="back" slot="left" @click="goback"></mt-button>
      <mt-button slot="right" @click="editfn()"><i class="el-icon-plus"></i>添加</mt-button>
    </mt-header>
    <div class="tabnav">
      <div class="tabnav-box">
        <ul class="tabnav-list">
          <li @click="tabnav(0)" :class="{'hover':tabhover==0}"><a>进行中</a></li>
          <li @click="tabnav(1)" :class="{'hover':tabhover==1}"><a>未开始</a></li>
          <li @click="tabnav(2)" :class="{'hover':tabhover==2}"><a>已失效</a></li>
        </ul>
        <span class="abline"></span>
      </div>
    </div>
    <div class="listbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
      <div class="offter" v-for="(item,i) in postdata" :key="i">
        <div class="title">{{ titlefn(item) }}</div>
        <div class="fixedPrice" v-if="type==3 && item.fixedPrice > 0">一口价：{{ item.fixedPrice }}元</div>
        <div class="time">
          <span class="dian"></span>{{ formData(item.useStartDate) }} 至 {{ formData(item.useEndDate) }}
        </div>
        <div class="footer">
          <div class="defult-btn" @click="clearPrice(item.id)">删除</div>
          <div class="defult-btn" @click="editfn(item.id)">编辑</div>
        </div>
      </div>
      <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabhover:0,
      postdata:[],
      type:this.$route.query.type,
      userid:this.$cookie.get('userid'),
      merId:this.$route.params.postId,
      loadshow:true,
      loadend:false,
      loading:false,
      page:1,
      pagesize:6
    }
  },
  mounted() {
    this.tabnavTartiom();
    this.loadMore();
  },
  methods: {
    goback(){
      this.$router.go(-1);
    },
    editfn(id){
      let queryData = {};
      for(var i in this.$route.query){
        queryData[i] = this.$route.query[i]
      };
      if(id) queryData.id = id;
      this.$router.push({name:'addromve',params:{postId:this.$route.params.postId},query:queryData})
    },
    tabnav(val){
      this.tabhover = val;
      this.loadend = false;
      this.page = 1;
      this.postdata = [];
      this.tabnavTartiom();
      this.loadMore();
    },
    tabnavTartiom(){
      let width = $('.abline').width();
      let w = $('.tabnav-box').width();
      $('.abline').css("left",(this.tabhover*2+1)*0.05*w + this.tabhover*width + 'px');
    },
    loadMore(){
      this.loading = true;
      this.loadshow = true;
      let that = this;
      let param = {
        //userId:this.userid,
        merId:this.merId,
        type:this.type,
        condition:this.tabhover,
        page:this.page,
        size:this.pagesize
      }
        axios.get(this.Api + 'voucher/newInfo',{params:param}).then(res => {
        console.log(res)
        if(res.data.code==0){
          let data = res.data.pageUtil;
          if(data.list.length == 0){
            that.loadend = true;
            that.loading = true;
            that.loadshow = false;
            return false;
          };
          (that.page)++;
          that.postdata = that.postdata.concat(data.list);
        }else{
          Toast(res.data.msg);
          that.loading = true;
        };
        that.loading = false;
        that.loadshow = false;
      }).catch(err => {
        that.loading = true;
      })
    },
    // 删除优惠
    clearPrice(_id){
      let that = this;
      MessageBox({
        title:"",
        message: '<p style="text-align:center;text-indent:0;">删除优惠，将无法恢复。<br>是否删除？</p>',
        showCancelButton: true
      }).then(action => {
        if(action ==='confirm'){
          axios.get(that.Api + 'voucher/newDelete',{params:{id:_id}}).then(res => {
            that.tabnav(that.tabhover);
          })
        }
      });
    },
    // 输出时间日期
    formData(time){
      if(time){
        var date = new Date(time);
        var Y = date.getFullYear();
        var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
        var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        // return Y+'-'+M+'-'+D+' '+h+':'+m;
        return Y+'-'+M+'-'+D;
      }
    },
    // title
    titlefn(obj){
      switch(this.type){
        case '0':
          return obj.discount?parseIn(obj.discount)+'折优惠':'不打折';
          break;
        case '1':
          return obj.preferential && obj.privilege?'折上'+parseIn(obj.preferential)+'折或折上优惠'+parseIn(obj.privilege)+'折':
            obj.preferential && !obj.privilege?'折上'+parseIn(obj.preferential)+'折':
            !obj.preferential && obj.privilege?'折上优惠'+parseIn(obj.privilege)+'折':'不打折';
          break;
        case '2':
          return obj.enoughAmount && obj.verticalReduction?'满'+obj.enoughAmount+'元减'+obj.verticalReduction+'元':
            '不打折';
          break;
        case '3':
          return obj.fixedPriceDetails?obj.fixedPriceDetails:'无内容';
          break;
        case '4':
        return obj.name
      };
      // 解决浮点数问题
      function parseIn(num){
        let numd = num.toString().split(".")[0];
        let nums = num.toString().split(".")[1];
        numd = new Number(numd)/10;
        return nums?numd+'.'+nums:numd;
      }
    }
  },
}
</script>

<style scoped>
.mainbox >>> .mint-header{background:#ff911e;border-bottom:none;font-size:.8rem;}
.mainbox >>> .mint-header{height:40px;}
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
  padding-top:calc(0.9rem + 1.4em + 40px);
}
.tabnav{
  overflow:hidden;
  width:100%;
  background:white;
  position:fixed;
  z-index:99;
  left:0;
  top:40px;
}
.tabnav .tabnav-box{
  position:relative;
}
.tabnav .tabnav-box .abline{
  position: absolute;
  left:calc(5% + 0);
  bottom:0;
  height:2px;
  width:23%;
  background:#ff8b21;
  transition:all linear 0.2s;
}
.tabnav ul.tabnav-list{
    overflow:hidden;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.tabnav ul.tabnav-list li{
    overflow:hidden;
    text-align: center;
    flex-grow: 1;
}
.tabnav ul.tabnav-list li a{
    display:inline-block;
    position: relative;
    font-size:0.65rem;
    padding:0.7em 0;
    color:#666;
}
.tabnav ul.tabnav-list li.hover a{
    color:#f86b1f;
}
/* listbox */
.listbox{
  overflow:hidden;
}
.listbox .offter {
  background-color: #ffffff;
  padding: 0 10px;
  margin-bottom: .416667rem;
}
.offter .title {
  font-size: .75rem;
  padding: .625rem 0 .333333rem 0;
  color: #333333;
  font-weight: bold;
}
.offter .fixedPrice{
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
  padding-bottom: .2rem;
}
.offter .time {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666666;
  padding-bottom: .625rem;
}
.offter .time .dian {
  display: inline-block;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #999999;
  margin-right: 5px;
}
.offter .footer {
  height: 1.25rem;
  border-top: 1px solid #eeeeee;
  display: flex;
  padding: .125rem 0;
}
.defult-btn {
  flex: 1;
  text-align: center;
  font-size: .6rem;
  color: #666666;
  line-height: 1rem;
}
.defult-btn:first-child {
  border-right: 1px solid #eeeeee;
}
.mainbox >>> .mint-button-text{
  font-size:14px;
}
</style>
