<template>
  <div class="order">
    <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <mt-navbar v-model="selected">
        <div class="order-tab">
            <mt-tab-item id="1">待支付</mt-tab-item>
        </div>
         <div class="order-tab">
            <mt-tab-item id="2">已完成</mt-tab-item>
        </div>
         <div class="order-tab">
            <mt-tab-item id="3">全部订单</mt-tab-item>
        </div>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container v-model="selected">
        <!-- 待支付 -->
        <mt-tab-container-item class="dai-h" id="1">
            <div class="dai-box">
                <div class="shnegji-order" v-for="(item,index) in daiPayList" :key="index">
                    <div class="top">
                        <div class="order-number">
                            <!-- <div class="check-box" @click="check(n)">
                                <span class="nocheck" v-if="nocheck"></span>
                                <span class="check" v-else>√</span>
                            </div> -->
                            <!-- <input class="check-input" type="checkbox" v-model="checked" :value="item.id"> -->
                            订单编号：{{item.order_sn}}
                        </div>
                        <div class="zhuang-tai red">{{item.order_status_text}}</div>
                    </div>
                    <div class="main" @click.stop="gotoDetails(item.order_price,item.remark,item.order_sn,item.order_status_text,item.add_time)">
                        <div class="pic">
                            <img src="@/assets/images/upgrade/sfsj_img_sj.png"/>
                        </div>
                        <div class="commtent">
                            <div class="name">{{item.remark}}</div>
                            <div class="price">
                                <div>
                                    应付：<span class="linght-red">¥{{toMoney(item.order_price)}}</span>
                                </div>
                                <div class="pay" @click.stop="goToPay(item.order_price,item.remark,item.order_sn)">去支付</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no-order" v-if="daiPayList.length == 0">没有订单</div>
            </div>
            <!-- <div class="jiesuan">
                <div class="left">
                    <el-checkbox class="allchecked" v-model="allchecked"></el-checkbox>
                    <span class="all-select-text">全选</span>
                    <span class="bishu">共3笔</span>
                    <div class="count">
                        <span>合计：</span><i class="red">¥2500.00</i>
                    </div>
                </div>
                <div class="pay-btn">去结算</div>
            </div> -->
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
            <!-- 已完成 -->
            <div class="wancheng-box">
                <div class="shnegji-order" v-for="(item,index) in alreadyPayList" :key="index">
                    <div class="top">
                        <div class="order-number">订单编号：{{item.order_sn}}</div>
                        <div class="zhuang-tai">{{item.order_status_text}}</div>
                    </div>
                    <div class="main" @click.stop="gotoDetails(item.order_price,item.remark,item.order_sn,item.order_status_text,item.add_time)">
                        <div class="pic">
                            <img src="@/assets/images/upgrade/sfsj_img_sj.png"/>
                        </div>
                        <div class="commtent">
                            <div class="name">{{item.remark}}</div>
                            <div class="price">
                                <div>
                                    应付：<span class="linght-red">¥{{toMoney(item.order_price)}}</span>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 没有订单显示 -->
                <div class="no-order" v-if="alreadyPayList.length == 0">没有订单</div>
            </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
            <!-- 全部 -->
            <div class="all-box">
                <div class="shnegji-order" v-for="(item,index) in allPayList" :key="index">
                    <div class="top">
                        <div class="order-number">订单编号：{{item.order_sn}}</div>
                        <div class="zhuang-tai" :class="{'red':item.pay_status==0}" >{{item.order_status_text}}</div>
                        <!-- <div class="zhuang-tai" >已完成</div> -->
                    </div>
                    <div class="main" @click.stop="gotoDetails(item.order_price,item.remark,item.order_sn,item.order_status_text,item.add_time)">
                        <div class="pic">
                            <img src="@/assets/images/upgrade/sfsj_img_sj.png"/>
                        </div>
                        <div class="commtent">
                            <div class="name">{{item.remark}}</div>
                            <div class="price">
                                <div>
                                    应付：<span class="linght-red">¥{{toMoney(item.order_price)}}</span>
                                </div>
                                <div class="pay" @click.stop="goToPay(item.order_price,item.remark,item.order_sn)" v-if="item.pay_status == 0">去支付</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 没有订单显示 -->
                <div class="no-order" v-if="allPayList.length == 0">没有订单</div>
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
            title:'升级订单',
        },
        selected: '1',
        /*nocheck: true,
        list: [
            {
                id: 1,
                name: 'iPhone 7',
                price: 16188,
                count: 1
            },
            {
                id: 2,
                name: 'iPhone 8',
                price: 16188,
                count: 1
            },
            {
                id: 3,
                name: 'iPhone X',
                price: 16188,
                count: 1
            }
        ],
        checked: [],
        allchecked: true*/
        userid: this.$cookie.get('userid'),
        orderCode: true,
        daiPayList: [],
        alreadyPayList: [],
        allPayList: []
    };
  },
  mounted(){
    
  },
  methods: {
    getOrder() {
        let that = this
        axios({
            method:'post',
            url: that.Api + 'order/accountSubmits?userId='+ that.userid + '&levelId=',
        }).then(res => {
            console.log(res)
            if(res.data.errno == 0) {
                that.allPayList = res.data.data.orderVoList
                for(let i = 0; i < that.allPayList.length;i++){
                    if(that.allPayList[i].pay_status == 0) {
                        that.allPayList[i].order_status_text = '待支付'
                        that.daiPayList.push(that.allPayList[i])
                    } else if(that.allPayList[i].pay_status == 2) {
                        that.allPayList[i].order_status_text = '已完成'
                        that.alreadyPayList.push(that.allPayList[i])
                    }
                }
                
            }
        })
    },
    //价格保存两位小数点函数
    toMoney(val) {
        let money = (val/100).toFixed(2)
        return money
    },
    //去支付
    goToPay(price,name,code) {
        let that = this
        that.$router.push({ name: "cashRegister", query: {money: price, name: name, code: code } });
    },
    //跳转到订单详情
    gotoDetails(price,name,code,status,time) {
        this.$router.push({ name: "orderDetails", query: {money: price, name: name, code: code, status: status, time: time} });
    }
  },
  created() {
    this.getOrder();
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
    height: 2.041667rem;
    border-top: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    font-size: .583333rem;
    background-color: #ffffff;
    width: 100%;
}
.jiesuan .left {
    width: calc(100% - 3.75rem);
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
.pay-btn {
    background-color: #ff8922;
    color: #ffffff;
    line-height: 2.041667rem;
    text-align: center;
    width: 3.75rem;
    font-size: .625rem;
}
.allchecked {
    margin: 0 .625rem 0 .416667rem;
}
.no-order {
    margin-top: .833333rem;
    font-size: 14px;
    text-align: center;
    
}
</style>
