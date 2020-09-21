<template>
  <div class="order">
    <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <!-- tab-container -->
    <div class="wancheng-box">
        <div class="shnegji-order">
            <div class="top">
                <div class="order-number">订单状态：{{status}}</div>
            </div>
            <div class="main">
                <div class="pic">
                    <img src="@/assets/images/upgrade/sfsj_img_sj.png"/>
                </div>
                <div class="commtent">
                    <div class="name">{{remark}}</div>
                    <div class="price">
                        <div>
                            <span class="linght-red">¥{{toMoney(price)}}</span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="bottem">
            <div>下单时间：{{time}}</div>
            <div>订单编号：{{code}}</div>
        </div>
    </div>
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
        code: ''
    };
  },
  mounted(){
    
  },
  methods: {
    //获取订单详情
    getOrderDeails() {
        this.status = this.$route.query.status
        this.remark = this.$route.query.name
        this.price = this.$route.query.money
        this.time = this.$route.query.time
        this.code = this.$route.query.code
    },
    //价格保存两位小数点函数
    toMoney(val) {
        let money = (val/100).toFixed(2)
        return money
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
}
.bottem div {
    margin-bottom: .5rem;
    padding-left: .625rem;
}
</style>
