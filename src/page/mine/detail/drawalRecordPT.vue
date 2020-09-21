<template>
  <div class="mainbox">
    <topnav :topnav="topnav"></topnav>
    <div class="collapse" v-for="(item,i) in month" :key="i">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item :name="i+1">
          <template slot="title">
            <div class="mian-title">
              {{ formData(item.createTime,'YY')+'年'+formData(item.createTime,'MM')+'月' }} <i class="el-icon-arrow-down" :class="{'updown':activeNames == i+1}"></i>
            </div>
            <div class="moneybox">
              <span>提现:￥{{ amountfn(item.amountStr) }}</span>
              <span>个税:￥{{ amountfn(item.laborTaxStr) }}</span>
              <span>实际:￥{{ amountfn(item.factAmountStr) }}</span>
            </div>
          </template>
          <div class="itembox">
            <div class="itemmain">
              <div class="item" v-for="(post,y) in list[yearmonth[i].y+yearmonth[i].m]" :key="y" @click="listClick(post)">
                  <div class="title">
                    <div class="headimg">
                      <p>{{ formData(post.createTime,'MM')+'-'+formData(post.createTime,'DD') }}</p>
                      <span>{{ formData(post.createTime,'hh')+':'+formData(post.createTime,'mm') }}</span>
                    </div>
                  </div>
                  <div class="mint-cell">
                    <div class="mint-cell-wrapper">
                      <div class="mint-cell-title">
                        <div class="mint-cell-text">
                          <div class="mr-r-5">

                            {{ post.bankName + ' (尾号' + post.bankCardNo.substr(-4) + ')' }}
                          </div>
                          <div class="mr-r">
                            <span>提现￥{{ amountfn(post.amountStr) }}</span>
                            <span>个税￥{{ amountfn(post.laborTaxStr) }}</span>
                          </div>
                        </div>
                        
                      </div>
                      <div class="mint-cell-value">
                        <p class="yqr" style="color:#ff920e;">{{ post.status==0?'申请中':post.status==1?'成功':post.status==2?'完成':post.status==3?'不成功':'' }}</p>
                        <p class="yqt">+{{ amountfn(post.factAmountStr) }}</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
            <div class="morebox">
              <span class="more" @click="getdata">显示更多<i class="el-icon-caret-bottom"></i></span>
              <span class="load" @click="getdata">正在加载中<i class="el-icon-loading"></i></span>
              <span class="all">已全部加载</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'drawalRecord',
  data () {
    return {
      topnav:{
        title:'提现记录'
      },
      messagebtn:0,
      list:{},
      month:[],
      userId:this.$cookie.get('userid'),
      activeNames:1,
      pagelist:[],
      pageSize:5,
      yearmonth:[],
      // userId:10061
    }
  },
  created() {
    Indicator.open();
    axios.get(this.Api + 'withdraw/infoByMonth?userId=' +this.userId,{
       headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                }
    }).then(res => {
      Indicator.close();
      console.log(res)
      if(res.data.length > 0){
        this.month = res.data;
      }else{
        let arr = {
          'createTime':new Date()
        };
        this.month.push(arr);
      };
      let arr = [];
      this.month.forEach((post,index) => {
        let year = this.formData(post.createTime,'YY').toString();
        let month = this.formData(post.createTime,'MM').toString();
        this.yearmonth.push({y:year,m:month});
        this.pagelist.push(1);
        this.$set(this.list,year+month,arr);
      });
      if(this.activeNames > 0) this.getdata();
    }).catch(err => {
      Indicator.close();
      console.log(err)
    })
  },
  methods: {
    handleChange(val) {
      this.activeNames = val;
      if(this.activeNames > 0){
        let ym = this.yearmonth[val - 1].y+this.yearmonth[val - 1].m;
        if(this.list[ym].length == 0){
          this.getdata();
        }
      }
    },
    // 获取数据
    getdata(){
      let n = this.activeNames - 1;
      let ymobj = this.yearmonth[n];
      let post = {
        userId: this.userId,
        month: ymobj.y+'-'+ymobj.m,     //2018-11
        pageNum: this.pagelist[n],
        pageSize: this.pageSize,
       
      };
      this.loadMore(post,n);
    },
    // 输出时间日期
    formData(time,text){
      var date = new Date(time);
      var Y = date.getFullYear();
      var Y = date.getFullYear();
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
      var D = (date.getDate()<10 ? '0'+date.getDate() :date.getDate());
      var h = (date.getHours()<10 ? '0'+date.getHours() :date.getHours());
      var m = (date.getMinutes() <10 ?'0'+date.getMinutes() :date.getMinutes());
      var s = (date.getSeconds()<10 ?'0'+date.getSeconds() :date.getSeconds());
      return text == 'YY'? Y :
             text == 'MM'? M :
             text == 'DD'? D :
             text == 'hh'? h :
             text == 'mm'? m :'';
    },
    loadMore(post,n){
      let that = this;
      let ym = that.yearmonth[n].y+that.yearmonth[n].m;
      that.more(n,'load');
      axios.get(this.Api+'/withdraw/list',{params:post}).then(res => {
        
        let data = res.data.page;
        if(data.list.length < that.pageSize){
          that.more(n,'all');
          if(data.list.length == 0){
            return false;
          }
        }else{
          that.more(n,'more');
        }
        (that.pagelist[n])++;
        if(that.list[ym]){
          that.list[ym] = that.list[ym].concat(data.list);

        }else{
          that.list[ym] = data.list;
        }
        //console.log(that.list,n)
      });
    },
    more(n,val){
      let morebox = $('.morebox').eq(n);
      morebox.find('span').hide();
      switch(val){
        case 'more':
          morebox.find('span.more').show();
          break;
        case 'load':
          morebox.find('span.load').show();
          break;
        case 'all':
          morebox.find('span.all').show();
          break;
      }
    },
    listClick(obj){
      this.$router.push({path:'/bank/withdrawalProcess?id='+obj.id})
    },
    amountfn(val){
      return val?new Number(val.replace(',','')*100)/100:0;
    }
  }
}
</script>

<style scoped>
.mainbox{
  overflow:hidden;
  min-height:100vh;
  background:#f5f5f5;
}
.collapse{
  overflow:hidden;
  margin-top:0.5rem;
}
.collapse >>> .el-collapse{
  border:none;
}
.mian-title{
  width:100%;
  text-align:center;
  background:#ffe9c9;
  color:#ec0a48;
  font-size:14px;
  line-height:36px;
}
.moneybox{
  width:100%;
  overflow:hidden;
  text-align: center;
 
  border-bottom:1px solid #eee;
}
.moneybox span{
  float:left;
  width:33.333%;
  padding:0.3em 0.6em;
  font-size:12px;
  color:#666;
  line-height:1.6em;
}
.collapse >>> .el-collapse-item__arrow{
  display:none;
}
.collapse >>> .el-collapse-item__content{
  border:none;
  padding:0;
}
.collapse >>> .el-collapse-item__header{
  flex-direction:column;
  height:auto;
}
.collapse i.el-icon-arrow-up{
  transition:all linear 0.5s;
}
.collapse .updown{
  transform:rotate(180deg);
}
/**/
.itembox{
  overflow:hidden;
  padding:0 10px;
}
.itembox .item{
  overflow:hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background:white;
  padding:10px 0;
  border-bottom:1px solid #eee;
}
.itembox .item:last-child{
  border-bottom:none;
}
.itemmain{
  overflow:hidden;
}
.itembox .item .title{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right:1px solid #eee;
  padding:0 0.5rem 0 0;
  margin-right:0.5rem;
}
.itembox .item .headimg{
  float:left;
  
  text-align: center;
  line-height:1.4em;
  
}
.itembox .item .headimg p{
  font-size:0.72rem;
  margin-bottom:0.1rem;
}
.itembox >>> .mint-cell{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-image:none;
  flex: 1;
  min-height:0;
}
.itembox >>> .mint-cell-wrapper{
  background-image:none;
  padding:0 0 0 0;
  align-items: stretch;
  width: 100%;
}
.itembox >>> .mint-cell-title{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
}
.itembox >>> .mint-cell-text{
  display:block;
  /* overflow:hidden; */
  text-overflow:ellipsis;
  white-space:nowrap;
  /* max-width:10em; */
  color:#333;
  font-size:0.6rem;
}
.itembox >>> .mint-cell-value{
  width: 30%;
  text-align: right;
  float: right;
  flex-direction: column;
  justify-content: center;
}
.itembox >>> .mint-cell-value p{
  width:100%;
  font-size:0.6rem;
  display:block;
}
.itembox >>> .mint-cell-value p.yqt{
  font-size:0.65rem;
  margin-top:0.3em;
  color:#333;
}
.itembox >>> .mint-cell-label{
  font-size:0.65rem;
  margin-top:4px;
}
.itembox >>> .mr-r-5{
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom:0.3rem;
}
.itembox >>> .mr-r{
  font-size:12px;
  color:#666;
}
.itembox >>> .mr-r span{
  float:left;
  width:50%;
}
.mint-cell-text img {
  width:3rem;
  height:1.2em;
  margin-left: 5px;
}
.item-img img{
  width:auto;
  height:1.4em;
}
.morebox{
  font-size:0.54rem;
  width:100%;
  border-top:1px solid #eee;
  text-align: center;
  color:#999;
  padding:0.2em 0;
  line-height:1.4em;
}
.morebox span{
  display:inline-block;
  width:100%;
}
</style>
