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
                <div class="order-tab" @click="changeState(201,'2')">
                    <mt-tab-item id="2">已完成</mt-tab-item>
                </div>
                <div class="order-tab" @click="changeState(101,'3')">
                    <mt-tab-item id="3">已取消</mt-tab-item>
                </div>
                <div class="order-tab" @click="changeState(null,'4')">
                    <mt-tab-item id="4">全部订单</mt-tab-item>
                </div>
            </div>
        </mt-navbar>

        <!-- tab-container -->
        <mt-tab-container>
            <mt-tab-container-item>

                <div class="wancheng-box" v-infinite-scroll="getOrder" infinite-scroll-disabled="loading"
                    infinite-scroll-distance="3">
                    <div class="shnegji-order" v-for="(item,index) in allPayList" :key="index" ref="listCon">
                        <div class="top">
                            <div class="order-number">
                                <template v-if="orderStatus == 0 || orderStatus == 501 || orderStatus == 502">
                                    <input class="check-input" type="checkbox" v-model="item.checked" :value="item.id"
                                        @change="checkedOneFn(index)">
                                </template>
                                订单编号：{{item.orderSn}}</div>
                            <div class="zhuang-tai">
                                {{item.orderStatus==0?'未支付':item.orderStatus==201?'已完成':item.orderStatus==101?'已取消':""}}
                            </div>
                        </div>
                        <div class="main" @click.stop="gotoDetails(item.orderSn,item.couponRemark)">
                            <div class="pic">
                                <img src="@/assets/images/upgrade/yhfl_img_xfq.png" />
                            </div>
                            <div class="commtent">
                                <div class="name">{{item.couponRemark}}</div>
                                <div class="price">
                                    <div>
                                        应付：<span class="linght-red">¥{{item.orderPrice}}</span>
                                    </div>
                                    <div class="payfor"
                                        @click.stop="goToPay(item.orderSn,item.paymentMethod)"
                                        v-if="item.orderStatus == 0">去支付</div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 没有订单显示 -->
                    <div class="no-order" v-if="alreadyPayList.length == 0">没有更多订单</div>

                    <template
                        v-if="allPayList.length > 0 &&(orderStatus == 0 || orderStatus == 501 || orderStatus == 502 )">
                        <div class="jiesuan">
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
                                <div class="pay-btn" @click="linkToUpLoad">取消订单</div>
                                <!-- <div class="pay-btn" v-if="orderStatus == 0" @click="getOrder">付款</div> -->
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

                topnav: {
                    title: '我的订单',
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
                totalMeny: 0,
                levelId: this.$cookie.get('level_id'),
                orderStatus: 0,
                selectedMoney: 0,
                oredrNoList: [],
                pageNum: 1,
                pageSize: 10,
                loading: false,
                loadshow: true,
                loadend: false,
                seq:this.$cookie.get('seq'),
            };
        },
        beforeRouteLeave(to, from, next) {
            if (to.path == '/buyCardDetail') {
                from.meta.keepAlive = true;
                let idx = this.selected;
                let status = this.orderStatus;
                sessionStorage.setItem("selected", idx);
                sessionStorage.setItem("status", status);
            } else {
                from.meta.keepAlive = false;
                sessionStorage.removeItem("selected");
                sessionStorage.removeItem("status");
            }
            next();
        },

        activated() {
            let idx = sessionStorage.getItem("selected");
            let status = sessionStorage.getItem("status")
            this.$nextTick(() => {
                if (idx) {
                    this.selected = idx;
                    this.orderStatus = status;
                    if (this.orderStatus == 'null') {
                        this.orderStatus = null;
                    }
                    this.changeState(this.orderStatus, this.selected);
                } else {
                    this.selected = '1';
                    this.orderStatus = 0;
                    this.changeState(this.orderStatus, this.selected)
                }
            })
        },
        mounted() {

        },
         created() {
                this.getOrder();

                },
        methods: {
            changeState(state, id) {
                this.pageNum=1;
                this.orderStatus = state;
                this.alreadyPayList = [];
                this.selected = id;
                this.allPayList=[];
                this.getOrder();

            },
            goback() {
                this.$store.commit("bbb");
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
                    this.$router.go(-1)
                }

            },
            getOrder() {
                this.loading = true;
                this.loadshow = true;
                
                let data = {
                    userId: this.userid,
                    orderStatus: this.orderStatus,
                    page: this.pageNum,
                    limit: this.pageSize
                }

                axios({
                    url: this.Api + "order/orderList",
                    method: "get",
                    params: data,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                    }
                }).then(res => {
                    console.log(res, '45');
                    if (res.data.code == 0) {
                        this.allPayList = this.allPayList.concat(res.data.page.list);
                        if (res.data.page.totalCount / 10 < this.pageNum) {
                            this.loadend = true;
                            this.loadshow = false;
                            this.loading = true;
                            return false;
                        }
                        this.pageNum++;
                        this.loading = false;
                        this.loadshow = false;
                    }
                })
            },
       
            //价格保存两位小数点函数
            toMoney(val) {
                let money = (val * 100 / 100).toFixed(2)
                return money
            },
            //去支付
            goToPay( code,way) {   
                
                        //   if (this.$cookie.get('superior') == 'null' ) {
                              
                        //   Toast({
                        //   message: "尊贵的用户，您还没绑定推荐人，无法完成支付，请重新通过推荐人的链接登录系统并绑定关系后，才能完成支付流程。谢谢！",
                        //   position: "middle",
                        //   duration: 4500
                        //   });
                        //   return false;
                        //   }
                
                    
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
                    //   Toast(res.data.msg)
                    //   }
                    //   }).catch(err => {
                    //   this.subClick = false;
                    //   console.log(err)
                    //   })
        },
            
            //跳转到订单详情
            gotoDetails(code, remark) {
                this.$router.push({
                    name: "buyCardDetails",
                    query: {
                        code: code,
                        remark: remark
                    }
                });
            },
            checkedOneFn(idx) {
                let temp = 0;
                let orderNo = [];
                  console.log(this.allPayList,'ai')
                for (let i = 0; i < this.allPayList.length; i++) {
                    if (this.allPayList[i].checked == true) {
                        temp += parseFloat(this.allPayList[i].orderPrice);
                        orderNo.push(this.allPayList[i].orderSn);
                    }
                }
                
                this.totalMeny = temp;
                this.oredrNoList = orderNo;
                console.log(this.oredrNoList,'55')
                sessionStorage.setItem('orderNo', this.oredrNoList);

            },
            isCheckedFn() {
                console.log(111)
                for (let i = 0; i < this.allPayList.length; i++) {
                    if (this.allPayList[i].checked == false) {
                        return false;
                    }
                }
                return true;
            },
            checkAllChange() {
                if (this.allchecked) {
                    for (let i = 0; i < this.allPayList.length; i++) {
                        this.allPayList[i].checked = true;
                    }
                } else {
                    for (let i = 0; i < this.allPayList.length; i++) {
                        this.allPayList[i].checked = false;
                    }
                }
            },
            linkToUpLoad() {
                if (this.totalMeny == '') {
                    Toast('请勾选要取消的订单');
                    return
                }
                MessageBox({
                    title: "温馨提示",
                    message: "确定取消已勾选的" + this.oredrNoList.length + "笔订单吗",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == 'confirm') {
                        axios({
                            method: 'post',
                            url: this.Api + "order/cancel",
                            data: {
                                orderNo: this.oredrNoList
                            },
                            headers: {

                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            console.log(res, '56')
                            if (res.data.code == 0) {

                                this.$router.push({
                                    path: "/buyCardRecord"
                                })
                                this.changeState(101, '3')
                                Toast(res.data.msg)
                            } else {
                                Toast(res.data.msg)
                            }
                        })
                    }
                });

            },
            getTotal() {
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

            },

        },

    };

</script>

<style scoped>
    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
    }

    .top_nav i {
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
        overflow: hidden;
    }

    .order>>>.mint-navbar .mint-tab-item.is-selected {
        color: #fd7b02;
        border-bottom: .0625rem solid #fd7b02;
    }

    .order .order-tab {
        width: 30% !important;
        padding: 0 .625rem;
    }

    .order>>>.mint-navbar .mint-tab-item-label {

        font-size: .6222rem;
    }


    .wancheng-box,
    .all-box,
    .dai-box {
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
        color: #ff6e04;
    }


    .shnegji-order .top .red {
        color: #e70808;
    }

    .check-box {
        display: inline-block;
    }

    .check,
    .nocheck {
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

    .commtent .price .payfor {
        padding: 0 .4444rem;
        line-height: .8889rem;
        background-color: #ff6e04;
        color: #ffffff;
        border-radius: .4444rem;
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
        height: 2.1778rem;
        border-top: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        font-size: .583333rem;
        background-color: #ffffff;
        width: 100%;
        padding: 0 .5333rem;
        box-sizing: border-box;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
    }

    .jiesuan .left {

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

    .btn_list {
        display: flex;
        justify-content: flex-end;
    }

    .pay-btn {
        background-color: #ff8922;
        color: #fffefe;

        height: .9778rem;
        line-height: .9778rem;
        text-align: center;
        width: 3.5556rem;
        font-size: .625rem;
        border-radius: .4889rem;
        font-size: .5333rem;
        margin-left: .4444rem;

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

    .tabList {
        width: 100%;
        overflow: auto;
        white-space: nowrap;
        display: flex;
    }

    .tabList::-webkit-scrollbar {
        display: none;
    }

</style>
