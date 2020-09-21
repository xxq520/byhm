<template>
  <div class="order">
    <!-- 头部 -->
      <div class="top_nav">
          <i class="el-icon-arrow-left" @click="goback"></i>
          <span>{{topnav.title}}</span>
      </div>
    <mt-navbar v-model="selected">
        <div class="tabList">
            <div class="order-tab" @click="changeState(0,'1')">
                <mt-tab-item id="1">未付款</mt-tab-item>
            </div>
            <div class="order-tab" @click="changeState(501,'2')">
                <mt-tab-item id="2" >待确认</mt-tab-item>
            </div>
            <div class="order-tab" @click="changeState(502,'3')">
                <mt-tab-item id="3" >驳回</mt-tab-item>
            </div>
            <div class="order-tab"  @click="changeState(201,'4')">
                <mt-tab-item id="4">已完成</mt-tab-item>
            </div>
            <div class="order-tab" @click="changeState(null,'5')">
                <mt-tab-item id="5" >全部订单</mt-tab-item>
            </div>
        </div>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container  >
        <mt-tab-container-item >
            <div class="wancheng-box" >
                <div class="shnegji-order" v-for="(item,index) in allPayList" :key="index" ref="listCon">
                    <div class="top">
                        <div class="order-number">
                           <!-- <template  v-if=" item.order_price >1000&&(orderStatus == 0 || orderStatus == 501 || orderStatus == 502)">  -->
                            <template v-if=" orderStatus == 0 || orderStatus == 501 || orderStatus == 502">

                                <input class="check-input" type="checkbox" v-model="item.checked" :value="item.id" @change="checkedOneFn(index)" >
                            </template>
                            订单编号：{{item.order_sn}}</div>
                        <div class="zhuang-taibohui" v-if="item.order_status == 502" >{{item.order_status_text}}</div>
                        <div class="zhuang-tai" v-else>{{item.order_status_text}}</div>
                    </div>
                    <div class="main" @click.stop="gotoDetails(item.order_sn,item.remark,item.orderType)">
                        <div class="pic">
                             <img src="@/assets/images/upgrade/yhfl_img_xfq.png" v-if="item.orderType==4"/>
                            <img src="@/assets/images/upgrade/sfsj_img_sj.png" v-else/>
                             
                        </div>
                        <div class="commtent">
                            <div class="name">{{item.remark}}</div>
                            <div class="price">
                                <div>
                                    应付：<span class="linght-red">¥{{toMoney(item.order_price)}}</span>
                                </div>
                                <div class="payfor"
                                    @click.stop="goToPay(item.order_sn,item.paymentMethod)"
                                    v-if="item.order_status == 0">去支付</div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 没有订单显示 -->
                <div class="no-order" v-if="alreadyPayList.length == 0">没有更多订单</div>
                
                <template v-if="allPayList.length > 0 &&(orderStatus == 0 || orderStatus == 501 || orderStatus == 502 )">
                    <div class="jiesuan" >
                        <div class="left">
                            <!-- <el-checkbox class="allchecked" v-model="allchecked" @change="checkAllChange"></el-checkbox>
                            <span class="all-select-text">全选</span> -->
                            <!-- <span class="bishu">共{{checked.length}}笔</span> -->
                            <div class="count">
                                <p class="red">已选：{{toMoney(totalMeny)}}</p>
                                <p>合计：¥{{toMoney(totalMeny)}}</p>
                            </div>
                        </div>
                        <div class="btn_list">
                            
                            <div class="pay-btn" @click="linkToUpLoad">上传汇款单</div>
                            
                        </div>
                     </div>
                </template>
           
            </div>
        </mt-tab-container-item>
    
        
    </mt-tab-container>

  </div>
</template>

<script>
export default {
  name: "order",
  data() {
    return {

        topnav:{
            title:'我的订单',
        },
        selected: '1',
        nocheck: true,
        checked: [],
        allchecked: false,
        userid: this.$cookie.get('userid'),
        orderCode: true,
        daiPayList: [],
        alreadyPayList: [],
        allPayList: [],
        totalMeny:0,
        levelId:this.$cookie.get('level_id'),
        orderStatus:0,
        selectedMoney:0,
        oredrNoList:[],
        seq:this.$cookie.get('seq'),
        back:this.$route.query.back
    };
  },
   beforeRouteLeave (to, from, next) {
        if(to.path =='/orderDetail' || to.path == '/myorder/upLoading'){
            from.meta.keepAlive = true;
            let idx = this.selected;
            let status = this.orderStatus;
            sessionStorage.setItem("selected", idx);
            sessionStorage.setItem("status",status);
        }
        else{
            from.meta.keepAlive = false;
             sessionStorage.removeItem("selected");
             sessionStorage.removeItem("status");
        }
        next();
    },

    activated(){
        let idx= sessionStorage.getItem("selected");
        let status = sessionStorage.getItem("status")
        this.$nextTick(() => {
            if (idx) {
                this.selected = idx;
                this.orderStatus = status;
                if(this.orderStatus == 'null'){
                  this.orderStatus = null;
                }
                this.changeState(this.orderStatus ,this.selected );
            } else {
                this.selected = '1';
                this.orderStatus = 0;
                this.changeState(this.orderStatus ,this.selected )
            }
        })
    },
  mounted(){
    //   this.getOrder();
     console.log(sessionStorage.getItem('applogin'),'5',this.$route.query.back)
   if(localStorage.getItem("applogin")&&this.$route.query.back){
   
   try {
   window.action.backAPP();
   } catch (err) {
   window.action.backAPPiOS();
   }

   }
  },
  computed:{
     
  },
  methods: {
    changeState(state,id){
        this.orderStatus = state;
        this.alreadyPayList= [];
        this.selected = id;
        this.getOrder();

    },
           goback() {

           // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
           // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
           // console.log(this.$route.query.from);
         
           if (this.$route.query.platform == 'android') {
           window.action.backAPP();
           } else if (this.$route.query.platform == 'ios') {  
           window.action.backAPPiOS();
           } if(localStorage.getItem("applogin")){

           try {
           window.action.backAPP();
           } catch (err) {
           window.action.backAPPiOS();
           }
           } else {
             this.$store.commit("bbb");
           this.$router.go(-1)

           }

           },
    getOrder() {
        let that = this
        console.log(that.orderStatus);
        let param = {
            userId:this.userid,
            // levelId:that.levelId,
            orderStatus:that.orderStatus
        }
        axios({
                url: this.Api + "order/accountSubmits",
                method: "post",
                data: qs.stringify(param),
                headers: {
                    "X-Nideshop-Token": this.$cookie.get("token"),

                }
            }).then(res=>{
                console.log(res);
                if(res.data.errno == 0){
                    that.allPayList = res.data.data.orderVoList;
                    // console.log(that.allPayList,'5');
                    // if(this.orderStatus==0&&that.allPayList.length==0){
                    //          this.changeState(501,'2')
                    // }
                }
            })
    },
    //价格保存两位小数点函数
    toMoney(val) {
        let money = (val/100).toFixed(2)
        return money
    },
    //去支付
    goToPay(code,way) { 
            //    if (this.$cookie.get('superior') == 'null' ) {
            //    Toast({
            //    message: "尊贵的用户，您还没绑定推荐人，无法完成支付，请重新通过推荐人的链接登录系统并绑定关系后，才能完成支付流程。谢谢！",
            //    position: "middle",
            //    duration: 4500
            //    });
            //    return false;
            //    }
          switch (way) {
            //微信
          case 0:
          window.location.href = this.Price + 'home/indexwap?salenumber=' + code + '&seq=' + this.seq +
          '&comefrom=10021&busimode=0';
      
          break;
          // 银联 新
          case 2:
          window.location.href = this.Price + 'home/indexwap?salenumber=' + code + '&seq=' + this.seq +
          '&comefrom=10027&busimode=0';         
          break;
        
         // 高汇通
            case 3:
            window.location.href = this.Price + 'home/indexwap?salenumber=' + code + '&seq='
            + this.seq +'&comefrom=10027&busimode=0&wxOpenId=true';
            break;
            };
          // 线下接口
        //   let post = {
        //   "orderCode":code,
        //   "serial":"123456",
        //   "status":1,
        //   "ssn":code
        //   };
        //   this.subClick = true;
        //   console.log(post)
        //   axios({
        //   url:this.Api + '/pay/notify',
        //   method:"post",
        //   data:post
        //   }).then(res => {
        //   console.log(res)
        //   this.subClick = false;
        //   if(res.data.errno==0){
        //   this.$router.push({path:'/successful'})
        //   }else{
        //   Toast(res.data.errmsg)
        //   }
        //   }).catch(err => {
        //   this.subClick = false;
        //   console.log(err)
        //   })
    },
    //跳转到订单详情
    gotoDetails(code,remark,type) {
        this.$router.push({ name: "orderDetail", query: {code: code,remark:remark,type:type} });
    },
    checkedOneFn(idx){
        let temp = 0;
        let orderNo = [];  
        for(let i=0; i<this.allPayList.length; i++){
            if(this.allPayList[i].checked == true){
                temp += this.allPayList[i].order_price;
                orderNo.push(this.allPayList[i].order_sn);
            }
        }
        this.totalMeny = temp;
        this.oredrNoList = orderNo;
        console.log(this.oredrNoList);
        sessionStorage.setItem('orderNo',this.oredrNoList);  
    },
    isCheckedFn(){
        console.log(111)
        for(let i=0; i<this.allPayList.length; i++){
            if(this.allPayList[i].checked == false){
                return false;
            }
        }
        return true;
    },
    checkAllChange(){
        if(this.allchecked){
            for(let i=0; i<this.allPayList.length; i++){
                this.allPayList[i].checked = true;
            }
        }else{
            for(let i=0; i<this.allPayList.length; i++){
                this.allPayList[i].checked = false;
            }
        }
    },
    linkToUpLoad(){
        if(this.totalMeny == ''){
            Toast('请勾选要上传汇款单的订单');
            return
        }
         this.$router.push({ name: "upLoading"});
    },
    getTotal(){
         var selected = 0;
        var price = 0;
        for (var i = 0; i < checkboxs.length - 1; i++) {
            if (checkboxs[i].className.indexOf("icon-radio2") != -1) {
                selected += parseInt(singleCounts[i].value);
                console.log(selected);
                price += parseFloat(singleCounts[i].value * singlePrices[i].innerHTML);
            }
        }
        selectedTotal.innerHTML = selected;
        priceTotal.innerHTML = price;

    }
    
  },
  created() {
    this.getOrder();
  }
};
</script>

<style scoped>
.top_nav{
width: 100%;
height: 40px;
background-color: #ff911e;
color:#fff;
display: flex;
line-height: 40px;
text-align: center;
}
.top_nav i{
flex: 1;
line-height: 40px !important;
font-size: 20px !important;
}
.top_nav span {
flex: 9;
font-size: 18px;
  text-indent: -50px;
}
.order {
  background: #f5f5f5;
  min-height: 100vh;
  overflow:hidden;
}
.order >>> .mint-navbar .mint-tab-item.is-selected {
    color: #fd7b02;
    border-bottom: .0625rem solid #fd7b02;
}
.order .order-tab {
    /* width: 33.33%; */
    padding: 0 .625rem;
}
.order >>> .mint-navbar .mint-tab-item-label {
    /* font-size: .666667rem; */
    font-size: .6222rem /* 28/45 */;
}
/* .dai-h {
    height: calc(100vh - 3.75rem);
} */
/* .dai-box {
    height: calc(100% - 2.041667rem);
    overflow-y: auto;
} */
.wancheng-box, .all-box, .dai-box {
    height: calc(100vh - 3.75rem);
    overflow-y: auto;
    /* padding-bottom: 2rem; */
}
.shnegji-order {
    padding: 0 .416667rem .625rem .416667rem;
    background-color: #ffffff;
    margin-top: .416667rem;
}
.shnegji-order .top {
    height: 1.833333rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #eeeeee;
}
.shnegji-order .top .order-number {
    font-size: .583333rem;
    color: #333333;
}
.shnegji-order .top .zhuang-tai {
    font-size: .583333rem;
    color: #ff6e04;
}
.shnegji-order .top .zhuang-taibohui{
    font-size: .583333rem;
    color: #fe2b2b;
   
}
.shnegji-order .top .red {
    color: #e70808;
}
.check-box {
    display: inline-block;
}
.check,.nocheck {
    width: .416667rem;
    height: .416667rem;
    border: 1px solid #cccccc;
    display: inline-block;
    margin-right: 5px;
}
.check {
    font-size: 12px;
    line-height: 8px;
    color: #e70808;
}
.shnegji-order .main {
    display: flex;
    justify-content: space-between;
    margin-top: .416667rem;
}
.shnegji-order .main .pic {
    width: 2.916667rem;
    height: 2.916667rem;
    margin: 0 .5rem 0 .625rem;
}
.shnegji-order .main .commtent {
    width: calc(100% - 4.041667rem);
}
.commtent .name {
    font-size: .541667rem;
    color: #333333;
    margin: .416667rem 0 .625rem 0;
}
.commtent .price {
    color: #666666;
    font-size: .541667rem;
    display: flex;
    justify-content: space-between;
}
.commtent .price .payfor{
    padding: 0 .4444rem /* 20/45 */;
    line-height: .8889rem /* 40/45 */;
    background-color: #ff6e04;
    color: #ffffff;
    border-radius: .4444rem /* 20/45 */;
}
.linght-red {
    color: #fd0278;
    font-size: .666667rem;
}
.pay {
    padding: 2px 6px;
    border-radius: .416667rem;
    background: #ff8d34;
    color: #ffffff;
    font-size: 12px;
}
.check-input {
    -webkit-appearance: checkbox;
    float: left;
    margin: 4px 5px 0 0;
}
.jiesuan {
    height: 2.1778rem /* 98/45 */;
    border-top: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    font-size: .583333rem;
    background-color: #ffffff;
    width: 100%;
    padding: 0 .5333rem /* 24/45 */;
    box-sizing: border-box;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
}
.jiesuan .left {
    /* width: calc(100% - 3.75rem); */
    display: flex;
    align-items: center;
}
.all-select {
    margin: .083333rem 0 0 .416667rem;
}
.bishu {
    margin: 0 1.666667rem 0 .416667rem;
}
.count {
    font-size: .625rem;
}
.count .red {
    color: #fc4d00;
    font-size: .666667rem;
}
.btn_list{
    display: flex;
    justify-content: flex-end;
}
.pay-btn {
    background-color: #ff8922;
    color: #fffefe;
    /* line-height: 2.041667rem; */
    height: .9778rem /* 44/45 */;
    line-height: .9778rem /* 44/45 */;
    text-align: center;
    width: 3.5556rem /* 160/45 */;
    font-size: .625rem;
    border-radius: .4889rem /* 22/45 */;
    font-size: .5333rem /* 24/45 */;
    margin-left: .4444rem /* 20/45 */;
   


}
.allchecked {
    margin: 0 .625rem 0 .416667rem;
}
.no-order {
    margin-top: .5rem;
    font-size: 14px;
    text-align: center;
    margin-bottom: .5rem
    
}
.tabList{
    overflow: auto;
    white-space: nowrap;
    display: flex;
}
.tabList::-webkit-scrollbar {
    display: none;
}
</style>
