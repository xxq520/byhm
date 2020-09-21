<template>
  <div class="order">
    <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <!-- tab-container -->
    <div class="wancheng-box">
        <div class="shnegji-order">
            <div class="top">
                <div class="order-number">订单状态：{{textState(orderDeails.order_status)}}</div>
            </div>
            <div class="main">
                <div class="pic">
                     <img src="@/assets/images/upgrade/yhfl_img_xfq.png" v-if="type==4" />
                    <img src="@/assets/images/upgrade/sfsj_img_sj.png"  v-else/>
                         
                </div>
                <div class="commtent">
                    <div class="name">{{remark}}</div>
                    <div class="price">
                        <div>
                            <span class="linght-red">¥{{(orderDeails.order_price/100).toFixed(2)}}</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <!-- 驳回原因 -->
        <div class="reason-box" v-if="orderDeails.order_status == 502">
            <p class="titel">驳回理由:</p>
            <div class="reason">{{orderDeails.auditNote}}</div>
            <p class="time">驳回时间：{{fomatDate(orderDeails.reviewDate)}}</p>
        </div>
      
          
        <div class="reason-box"
            v-if="orderDeails.imgUrlArr && orderDeails.imgUrlArr.length > 0">
        
            <p class="titel">上传汇款单:</p>
            <ul >
                <li v-for="(item,index) in orderDeails.imgUrlArr" :key="index"><img :src="item" alt=""/></li>
            </ul>
             <p class="time" v-if="orderDeails.upload_date">上传时间：{{fomatDate(orderDeails.upload_date)}}</p>

        </div>
        <div class="bottem">
            <div v-if="orderDeails.order_status != 0">支付方式：{{payState}}</div>
            <div>下单时间：{{fomatDate(orderDeails.add_time)}}</div>
            <!-- <div>订单类型：运营商订单</div> -->
            <div>订单编号：{{code}}</div>
        </div>
    </div>
    <template v-if="orderDeails.order_status  == 501|| orderDeails.order_status == 502&&orderDeails.order_price>1000">
    <!-- <template v-if="orderDeails.order_status  == 501|| orderDeails.order_status == 502"> -->

        <div class="upload-btn" @click="upLoadImg">上传汇款单</div>
    </template>
    
    <template v-if="orderDeails.order_status  == 0&&orderDeails.order_price>1000">
        <div class="fix-box" >
            <!-- <div @click="upLoadImg" v-if="orderDeails.order_price>1000">上传汇款单</div> -->
            <div @click="upLoadImg" >上传汇款单</div>
                          
            <div v-if="orderDeails.order_status == 0" @click="goToPay(orderDeails.order_price)">支付</div>
        </div>
    </template>
    
  </div>
</template>

<script>
export default {
  name: "order",
  data() {
    return {

        topnav:{
            title:'订单详情',
        },
        status: '',
        remark: '',
        price: '',
        time: '',
        code: this.$route.query.code,
        remark:this.$route.query.remark,
        type:this.$route.query.type,
        orderDeails:{},
        payState:''
    };
  },
  mounted(){
    
  },
 
  methods: {
    getOrderDeails(){
        axios({
        url:this.Api +'order/orderDetail?orderno='+ this.code,
        method:"get",
        
        headers:{
          "X-Nideshop-Token": this.$cookie.get('token')
        }
      }).then(res => {
          console.log(res)
            if(res.data.code == 0){
                this.orderDeails = res.data;
                console.log(this.orderDeails ,'8');
                if(this.orderDeails.imgUrlArr.length != 0 && this.orderDeails.order_status != 0){
                    this.payState = '线下支付'
                }else{
                    this.payState ='线上支付'
                }
            }
      })
    },
    //价格保存两位小数点函数
    toMoney(val) {
        let money = (val/100).toFixed(2)
        return money
    },
    upLoadImg(){
        sessionStorage.setItem('orderNo',this.code)
        this.$router.push({ name: "upLoading"});
    },
    textState(state){
        switch(state){
            case 0:
            return '待支付';
            break
            case 501:
            return '待确认';
            break
            case 502:
            return "驳回";
            break
            case 301:
            return '已完成';
            break
            case 201:
            return '已完成';
            break
        }
    },
    fomatDate(date) {
            date = new Date(date);
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();
            let h = date.getHours();
            let min = date.getMinutes();
            m = m < 10 ? '0' + m : m
            d = d < 10 ? '0' + d : d
            h= h < 10 ? '0' + h : h
            min = min< 10 ? '0'+min :min
            return y+'-'+m + '-' + d+' '+h+':'+min;
    },
    goToPay(price) {
        let that = this
        that.$router.push({ name: "cashRegister", query: {money: price, name: this.remark, code: this.code } });
    },
  },
  created() {
    this.getOrderDeails();
  }
};
</script>

<style scoped>

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
    width: 33.33%;
    padding: 0 .625rem;
}
.order >>> .mint-navbar .mint-tab-item-label {
    font-size: .666667rem;
}

.wancheng-box, .all-box {
    /* height: calc(100vh - 3.75rem); */
    overflow-y: auto;
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
    color: #333333;
}
.shnegji-order .top .red {
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
.linght-red {
    color: #fd0278;
    font-size: .666667rem;
}
.bottem {
    font-size: .541667rem;
    color: #999999;
    margin-top: .416667rem;
    padding: .833333rem 0 .333333rem 0;
    background-color: #ffffff;
    margin-bottom: .416667rem;
}
.bottem div {
    margin-bottom: .5rem;
    padding-left: .625rem;
}
.reason-box {
    margin-top: .416667rem;
    background-color: #fff;
    padding: .8889rem /* 40/45 */ 0.625rem .7333rem /* 33/45 */;
    font-size: .5778rem /* 26/45 */;
    color: #333333;
}
.reason-box .reason {
    padding: .4667rem /* 21/45 */ 0 1.3778rem /* 62/45 */;
    color: #666666;
}
.reason-box .time {
    font-size: .4889rem /* 22/45 */;
    color: #999999;
}

.reason-box  ul {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
    overflow: hidden;
    padding-bottom: .4444rem /* 20/45 */;
}
.reason-box  ul li {
    width: 5.5556rem /* 250/45 */;
    height: 3.5556rem /* 160/45 */;
    margin-right: .4444rem /* 20/45 */;
    margin-top: .4444rem /* 20/45 */;
}
.reason-box  ul li img{
    width: 100%;
    height: 100%;
    display: block;
}
.upload-btn {
    width: 10rem /* 450/45 */;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    text-align: center;
    font-size: .7111rem /* 32/45 */;
    color: #ffffff;
    background-color: #ff9500;
    border-radius: .8889rem /* 40/45 */;
    margin: 1.3333rem /* 60/45 */  auto  .6667rem /* 30/45 */;
}
.fix-box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: .6rem  .5333rem ;
    background-color: #ffffff;
    border-top: 1px solid #eeeeee;
    text-align: right;
    display: flex;
    justify-content: flex-end;
}
.fix-box div{
    width: 3.5556rem /* 160/45 */;
    text-align: center;
    /* display: inline-block; */
    height: .9778rem /* 44/45 */;
    line-height: .9778rem /* 44/45 */;
    color: #ffffff;
    font-size: .5333rem /* 24/45 */;
    border-radius: .4889rem /* 22/45 */;
    background-color: #ff6e04;
    margin-left: .6667rem /* 30/45 */;
    
}
</style>
