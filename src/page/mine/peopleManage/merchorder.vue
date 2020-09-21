<template>
    <div class="become-member">
        <!-- 头部 -->
        <!-- <topnav :topnav="topnav" class="topnav"></topnav> -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==item.id}" @click="messagebtnfn(item.id)" v-for="item in navlist">
                {{item.name}}
            </li>
        </ul>
        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <ul class="list">
                <div class="nodata" v-if="!list.length"><img src="@/assets/images/xinx-img.png"></div>
                <li v-for="(item,index) in list" :key="index">
                    <div class="head">
                        <div style="display: flex;">
                            <div><img :src="item.imgUrl" v-if="item.imgUrl"><img src="@/assets/images/dp_tx_nmtx.png"
                                    v-else>
                            </div>
                            <div style="margin: 0  0.4rem;" @click="goshop(item.merId)">{{item.merName}} <i
                                    class="el-icon-arrow-right"></i></div>
                        </div>
                        <div style="color: #ff4400;">{{item.currentOrderStatusDesc}}</div>
                    </div>
                    <div @click="getDetalis(item.orderSn)">
                        <div class="main-pic">
                            <img v-for="element in item.orderDetails" :src="element.picUrl">
                        </div>
                        <div class="goinfo">
                            <div>下单时间:{{item.createTime}}</div>
                            <div>共{{item.orderDetails.length}}件商品,总价￥{{item.totalOrderPrice}}</div>
                        </div>
                    </div>
                    <div class="foot">
                        <div v-if="item.currentOrderStatus==0" @click="goPay(item.orderSn,item.totalOrderPrice)">去支付
                        </div>
                        <div @click="gethxCard(item.orderSn)" v-if="item.currentOrderStatus==2">核销码</div>
                        <div v-if="item.currentOrderStatus==6||item.currentOrderStatus==7"
                            @click="Oncemore(item.merId)">
                            再来一单</div>
                        <div @click="deleteOrder(item.orderSn)"
                            v-if="item.currentOrderStatus==6||item.currentOrderStatus==7">删除</div>
                        <div @click="gocomment(item.orderSn)" v-if="item.currentOrderStatus==9&&shopcoms">去评价</div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
            </div>
        </div>
        <mt-popup v-model="popupVisible" popup-transition="popup-fade">
            <div class="tanchuan">
                <div class="maix">
                    <div class="colse">
                        <div @click="chxCard">X</div>
                    </div>
                    <div class="cm">{{pageSize}}</div>
                    <img :src="imgs">
                </div>
            </div>

        </mt-popup>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '全部订单',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: this.$route.query.merchid,
                loadshow: true,
                loadend: false,
                loading: false,
                page: 1, //当前页
                pageSize: 8, //每页显示行数
                navlist: [{
                        name: '全部',
                        id: '0'
                    },
                    {
                        name: '待付款',
                        id: '1'
                    },
                    {
                        name: '待使用',
                        id: '6'
                    },
                    {
                        name: '待评价',
                        id: '5'
                    },
                    {
                        name: '退款/售后',
                        id: '4'
                    },


                ],
                list: [],
                popupVisible: false,
                xflist: [],
                imgs: '',
                merId: this.$cookie.get('merId'),
                shopcoms: true,
                applogin: false,
            };
        },
        created() {

        },
        mounted() {

            this.applogin = sessionStorage.getItem('applogin') ? true : false;
            this.shopcom()
        },
        methods: {
            //获取商家是否开启评论功能
            shopcom() {
                console.log(window.location.href);
                console.log(this.$cookie.get("token"));
                axios({
                    url: this.Api1 + '/order/comment-status',
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.shopcoms = res.data.data;
                    }

                })
            },
            //返回
            goback() {
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS()
                } else {
                    this.$router.push('/mine')
                }
            },
            //去评价
            gocomment(val) {
                this.$router.push({
                    path: '/mine/goComment',
                    query: {
                        orderSn: val
                    }
                })
            },
            //删除订单
            deleteOrder(val) {
                MessageBox({
                    title: "温馨提示",
                    message: '是删除该订单？',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        let post = {
                            orderSn: val,
                            type: 0
                        };
                        axios({
                            url: this.Api1 + '/order/delete',
                            data: post,
                            method: "post",
                            headers: {
                                "Content-Type": "application/json; charset=UTF-8",
                                "X-Nideshop-Token": this.$cookie.get("token")
                            },
                        }).then(res => {
                            if (res.data.code == 200) {
                                Toast('删除成功')
                                this.page = 1;
                                this.list = [];
                                this.loadMore();
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    }
                })
            },
            //再来一单
            Oncemore(id) {
                this.$router.push({
                    path: '/comment/marketDetalis',
                    query: {
                        id: id
                    }
                })
            },
            //跳转去支付

            goPay(val,money) {
      
                
                if (this.applogin) {
                   window.action.AppGoPay(10036,val,money)
                } else {
                    window.location.href = this.Price + 'home/indexwap?comefrom=10035&busimode=0&salenumber=' + val +
                        '&seq=' + this.seq;
                }

            },
            //跳转店铺详情
            goshop(val) {
                this.$router.push({
                    path: '/comment/marketDetalis',
                    query: {
                        id: val
                    }
                });
            },
            //弹窗

            chxCard() {
                this.popupVisible = false
            },
            //去详情
            getDetalis(val) {
                this.$router.push({
                    path: '/mine/orderdetails',
                    query: {
                        orderSn: val
                    }
                })
            },
            //获取核销码
            gethxCard(val) {
                this.popupVisible = true;
                let post = {
                    orderSn: val
                };
                axios({
                    url: this.Api1 + '/order/wo',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.imgs = res.data.data.imgUrl;
                        this.pageSize = res.data.data.code;
                    }

                })
            },
            //切换tap
            messagebtnfn(val) {
                this.messagebtn = val;
                this.page = 1;
                this.list = [];
                this.loadMore();
            },
            loadMore() {
                let that = this;

                this.loading = true;
                this.loadshow = true;
                let post = {
                    orderStatusBar: this.messagebtn,
                    userId: this.userid,
                    pageIndex: this.page,
                    pageSize: this.pageSize,
                };
              console.log(post);
                axios({
                    url: this.Api1 + '/order/list',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    console.log('555');
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        if (data.list.length == 0) {
                            that.loadend = true;
                            that.loading = true;
                            that.loadshow = false;
                            return false;
                        };
                        (that.page) ++;
                        that.list = that.list.concat(data.list);

                    } else {
                        Toast(res.data.message)
                    };
                    that.loading = false;
                    that.loadshow = false;
                })
            },
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        padding-top: 40px;
        overflow: hidden;
    }

    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 16px;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .managebtn {
        width: 100%;
        margin-top: 0.4rem;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: auto;
        padding: 0 0.5rem;
    }

    .managebtn::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .managebtn li {

        text-align: center;
        padding: .4889rem 0;
        font-size: .58rem;
        color: #333333;
        height: 2.2rem;
        line-height: 1.2rem;
        width: 19%;
        flex-shrink: 0;
    }

    .managebtn li p.count {
        color: #666666;
        font-size: .5333rem;
        line-height: .6667rem;
    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 80%;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: 10%;
    }

    .managebtn li.hover p {
        color: #ff6e04;
    }

    .list {
        padding: 0.4rem;
    }

    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
        padding: 0.3rem;
    }

    .list li .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0;
        border-bottom: 1px solid #eee;
    }

    .list li .head img {
        width: 1rem;
        height: 1rem;
    }

    .list li .main-pic {
        display: flex;
        justify-content: flex-start;

        flex-wrap: wrap;
        padding: 0.5rem 0 0.2rem;
    }

    .list li .main-pic img {

        width: 18%;
        height: 2.5rem;
        border-radius: 0.416667rem;
        margin-right: 0.25rem;
        margin-bottom: 0.3rem;
    }

    .list li .goinfo {
        line-height: 1.2rem;
        margin-bottom: 0.3rem;

    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .list li .foot div {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #ddd;
        margin-right: 0.4rem;


    }

    .mint-popup {
        width: 70%;
    }

    .tanchuan {
        background-image: url("../../../assets/images/user/dd_bg.png");
        background-size: 100%;
        position: relative;
        padding: 0.5rem;

    }

    .tanchuan>>>.colse {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-right: 0.3rem;
        font-size: 0.65rem;
        color: #999;
        margin-bottom: 1rem;
    }

    .tanchuan .maix {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 1rem;
    }

    .tanchuan .maix img {
        width: 6rem;
        height: 6rem;
        box-shadow: 0 0 2px #999;
    }

    .tanchuan>>>.cm {

        width: 80%;
        color: #333;
        font-size: 0.8rem;
        text-align: center;
        margin-bottom: 2rem;

    }

</style>
