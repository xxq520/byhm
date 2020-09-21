<template>
    <div class="cycleWarp">
        <mt-header fixed title="按周期提现" class="topNav">
            <mt-button icon="back" slot="left" @click="()=>{return $router.go(-1)}"></mt-button>
            <mt-button slot="right" @click="handleCheckAllChange">全选</mt-button>
        </mt-header>
        <div class="collapse" >
            <div class="itemBox" v-for="(item,index) in cycleList" :key="index">
                <div class="itemMaix" >
                    <div class="checkBox">
                       <div class="inputCheck" :class="inputCheckClass(item)" @click="checkedFn($event,item)"></div>
                    </div>
                    <div class="details"  @click="linkToIncome(item.id,item.bonus)">
                        <p>{{fomatDate(item.startTime)}}至{{fomatDate(item.endTime)}}</p>
                        <p class="flexList">
                            <span>发生{{item.orderNos.split(',').length}}笔分利</span>
                            <span>分利金额：<em>￥{{(item.bonus/100).toFixed(2)}}</em></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- <loading :load.sync="loadshow" :end.sync="loadend"></loading> -->
        
        <!--  -->
        <div class="chooseInfo">
            <p>共{{cycleList.length}}批款项   已选<span>{{selectedMun}}</span>批</p>
            <p>已选择金额：<span>￥{{(total/100).toFixed(2)}}</span></p>
            <p>清算费用：<span>￥{{(fee/100).toFixed(2)}}</span></p>
             <p v-if="this.index==6&&this.hahaShow">实际到账金额：<span>￥{{total== 0 ? 0 :(total/100).toFixed(2)}}</span></p>
            <p v-else>实际到账金额：<span>￥{{total== 0 ? 0 :((total-fee)/100).toFixed(2)}}</span></p>
           
        </div>
        <div class="confirm" @click="confirmFn">确认</div>
    </div>
    
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
    data(){
        return {
            checkAll:false,
            count:0,
            userId:this.$cookie.get('userid'),
            cycleList:[],
            checkList:[],
            // loading:false,
            // loadshow:true,
            // loadend:false,
            selectedMun:0,
            total: 0,
            weekIds:'',
            fee:'',
             index:this.$route.query.index,
             money:this.$route.query.money,
             hahaShow:false,
        }
    },
    watch:{
        checkList(val){
            this.selectedMun = 0;
            this.total = 0;
            for(let i=0; i<val.length; i++){
                this.selectedMun ++;
                this.total += val[i].bonus;
            };
               if( this.money>this.total+1){
               this.hahaShow=true
               }else{
               this.hahaShow=false
               }
        }
    },
    computed: {
        ...mapState(["withdrawal"]),
        inputCheckClass(){
            return function(obj){
                console.log(obj)
                for(let i=0; i<this.checkList.length; i++){
                    if(this.checkList[i].id == obj.id){
                        return 'el-icon-circle-check act';
                    }
                };
                return '';
            }
        }
    },
    mounted(){
        this.getData();
        this.getFee();
    },
    methods:{
        // 获取提现周列表;
         
        getData(){
            let type=this.index ==6? 1: 0;
            axios.get(this.Api + 'ledgerwithdrawweekly/findByUserId?userId='+this.userId+'&auditStatus=4'+'&type='+type,
            {headers: { "X-Nideshop-Token": this.$cookie.get('token') }})
            .then(res => {
                console.log(res);
                if(res.data.Bool == true){
                    this.cycleList = res.data.Data;
                    this.checkList = this.withdrawal;
                }
            })
        },
        fomatDate(date) {
            date = new Date(date);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            return m + '-' + d;
        },
        // loadMore(){
        //     this.loading = true;
        //     this.loadshow = false;
        //     this.loadend = true;
        // },
        //全选
        handleCheckAllChange(){
            this.cycleList.forEach(post => {
                for(let i=0; i<this.checkList.length; i++){
                    if(this.checkList[i].id == post.id){
                        return false;
                    }
                };
                this.checkList.push(post);
            })
        },
      
        checkedFn(elem,obj){
            let el = elem.currentTarget;
            for(let i=0; i<this.checkList.length; i++){
                if(this.checkList[i].id == obj.id){
                    this.checkList.splice(i,1);
                    return false;
                }
            };
            this.checkList.push(obj);
        },
        linkToIncome(id,total){
            this.$router.push({path:'/settings/incomeDetails',query:{id:id,total:total}})
        },
        getFee(){
            axios.post(this.Api + 'ledgerwithdraw/getFee?userId='+this.userId+'&auditStatus=4'+'&money='+this.total)
            .then(res => {
                console.log(11);
                console.log(res);
                if(res.data.Bool){
                     this.fee = res.data.Data;
                     sessionStorage.setItem('fee',this.fee);
                }
            })
        },
        confirmFn(){
            this.addWithdrawal(this.checkList);
            this.$router.go(-1)
        },
        ...mapMutations(["addWithdrawal","removeWithdrawal"])
    }
}
</script>
<style scoped>
.topNav{
    background-color: #ff911e;
    border-bottom: none;
}
.cycleWarp{
  overflow:hidden;
  min-height:100vh;
  background:#f2f2f2;
  padding-top: 40px;
}
.collapse{
  overflow:hidden;
  margin-top:0.5rem;
  background-color: #fff;
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
  position: relative;
}
.mian-title .choose{
    width: .7778rem /* 35/45 */;
    height: .7778rem /* 35/45 */;
    display: inline-block;
    position: absolute;
    left: .4444rem /* 20/45 */;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border-radius: 50%;
}
.mian-title .yuan{
border: 1px solid #999999;
}
.collapse >>> .el-collapse-item__arrow{
  display:none;
}
.collapse >>> .el-collapse-item__content{
  border:none;
  padding:0;
}
.collapse >>> .el-collapse-item__header{
  height:auto;
  flex-wrap: wrap;
  border-bottom:none;
}
.collapse i.el-icon-arrow-up{
  transition:all linear 0.5s;
}
.collapse .updown{
  transform:rotate(180deg);
}
.collapse >>> .el-checkbox{
    position: absolute;
    left: .4444rem /* 20/45 */;
    
}
.collapse >>> .el-checkbox__inner {
    width: .8rem /* 36/45 */;
    height: .8rem /* 36/45 */;
    border-radius: 50%;
    border: 1px solid #999999;
    background-color: #ffe9c9;
}
.collapse .total{
    height: 1.1556rem /* 52/45 */;
    line-height: 1.1556rem /* 52/45 */;
    text-align: center;
    width: 100%;
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.el-icon-circle-check{
    font-size: .8444rem /* 38/45 */;
}

.itemBox{
    position: relative;
    margin: 0 .4444rem /* 20/45 */;
    border-bottom: 1px solid #eeeeee;
   
}
.itemBox:last-child{
    border-bottom: none;
}

.itemBox .itemMaix{
    display: flex;
     padding: .4444rem /* 20/45 */ 0;
     font-size: .6667rem /* 30/45 */;
     color: #333333;
     align-items: center;
}
.itemBox .details{
    width: 90%;
    position: relative;
    padding-right: 1.4rem;;
}
.itemBox .details::after{
    content: "";
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    border-top: 1px solid #999999;
    border-right: 1px solid #999999;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    margin-left: .2222rem /* 10/45 */;
    top: 0;
    right: .4889rem /* 22/45 */;
    bottom: 0;
    margin: auto 0;
}
.itemBox .flexList{
    display: flex;
    justify-content: space-between;
    font-size: .5778rem /* 26/45 */;
    color: #666666;
    line-height: 1.2444rem /* 56/45 */;
}
.itemBox .flexList em {
    color: #f86b1f;
    font-style: normal;
}
.itemBox .checkBox{
    width: 10%;
}
.checkBox .inputCheck{
    width: .7556rem /* 34/45 */;
    height: .7556rem /* 34/45 */;
    border-radius: 50%;
    border: 1px solid #999999;
    display: inline-block;
    /* position: relative; */
}
.checkBox .inputCheck.act {
    border: none;
    color: #f52052;
}
.chooseInfo{
    width: 100%;
    background-color: #ffffff;
    padding: .6667rem /* 30/45 */ .4444rem /* 20/45 */;
    font-size: .5778rem /* 26/45 */;
    color: #666666;
    margin-top: .5rem;
}
.chooseInfo p {
    line-height: 1.2444rem /* 56/45 */;
}
.chooseInfo span {
    color: #ff0051;
    
}
.confirm{
    width: 10rem /* 450/45 */;
    height: 1.7778rem /* 80/45 */;
    text-align: center;
    line-height: 1.7778rem /* 80/45 */;
    background-color: #ff8c39;
    font-size: .7111rem /* 32/45 */;
    color: #fefefe;
    border-radius: .8889rem /* 40/45 */;
    margin: 1.7778rem /* 80/45 */ auto 0;
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


