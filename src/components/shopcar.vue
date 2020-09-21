<template>
    <div>
        <div class="footer">
            <div class="left">
                <div class="shopcar" :class="{'bjbh': shopshu==0}" @click="goShopcar">
                    <img src="@/assets/images/shoppingMall/home_p2_icon_buy.png">
                    <div class="shumu" v-show="shopshu>0">{{shopshu}}</div>
                </div>
                <div class="shop">
                    <div class="money" v-show="shopshu>0">￥{{postDate.afterDiscountTotalAmount}}</div>
                    <div class="pei" v-show="shopshu==0">购物车是空的</div>
                    <div class="pei" >另需配送费{{postDate.shipFee}}元</div>
                </div>
            </div>
            <div class="right" :class="{'bjbh': shopshu==0}" @click="goShoporder" v-if="postDate.whetherSent">
                去结算
            </div>
            <div class="right bjbh" v-else style="font-size: 0.55rem;">
                满{{minPrice}}元起送
            </div>
        </div>
        <mt-popup v-model="carvisible" position="bottom"
            style="width: 100%;border-radius:10px 10px 0  0 ; bottom: 2rem;">
            <div class="carbtn">
                <div class="name">优惠已减{{postDate.discountAmount}}元</div>
                <div class="carhead">
                    <div class="total" style="color: #333;"> 共有{{shopshu}}件商品</div>
                    <div class="clear" style="color: #FF4400;" @click="clearCar()"> 清空购物车</div>
                </div>
                <div class="maincar">
                    <div class="shopInfo" v-for="(item,index) in list">
                        <div class="left"><img :src="item.imgUrl"></div>
                        <div class="right">
                            <div class="lleft">
                                <div class="c1">
                                    {{item.goodsName==null?'美酒':item.goodsName}}
                                </div>
                                <div class="c2">
                                    {{item.skuDesc}}
                                </div>
                                <div class="c3">
                                    <div style="display: flex;">
                                        <div style="font-size: 0.65rem;">￥{{item.retailPriceString}}</div>
                                        <div class="yuanjia">￥{{item.marketPriceString}}</div>
                                    </div>
                                    <div class="add">
                                        <img src="@/assets/images/shoppingMall/home_p2_icon_js.png"
                                            @click="jianshop(item)">
                                        <div style="margin: 0 0.3rem;">{{item.amount}}</div>
                                        <img src="@/assets/images/shoppingMall/home_p2_icon_zjsp.png"
                                            @click="addshop(item)">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        props: ["disvisible", "spevisible", "id"],
        name: 'shopcar',
        data() {
            return {
                shopshu: 0,
                carvisible: false,
                userPhone: this.$cookie.get('userPhone'),
                merchantId: this.id,
                list: [],
                postDate: {},
                showSelectSpec: [],
                goodsid: [],
                minPrice: 0,
            }
        },
        mounted() {

            this.choiceSpc()
        },
        methods: {

            //增加商品
            addshop(val) {
                this.showSelectSpec = val.attrSymbolPath.split(',')
                let post = {
                    username: this.userPhone,
                    merchantId: this.merchantId,
                    amount: 1,
                    goodsSn: val.goodsSn,
                    propertiesValueList: this.showSelectSpec
                };
                axios({
                    url: this.Api1 + '/user/shoppingCart/buyerCart',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.postDate = res.data.data;
                        this.list = res.data.data.buyerItems;
                        this.shopshu = this.postDate.totalCount;
                    }else {
                        Toast(res.data.message)
                    }
                });
            },
            //减少商品
            jianshop(val) {
                this.showSelectSpec = val.attrSymbolPath.split(',');
                let post = {
                    username: this.userPhone,
                    merchantId: this.merchantId,
                    amount: -1,
                    goodsSn: val.goodsSn,
                    propertiesValueList: this.showSelectSpec
                };
                axios({
                    url: this.Api1 + '/user/shoppingCart/buyerCart',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.postDate = res.data.data;
                        this.list = res.data.data.buyerItems;
                        this.shopshu = this.postDate.totalCount;
                    } else {
                        Toast(res.data.message)
                    }
                });
            },
            //清空购物车
            clearCar() {
                let post = {
                    username: this.userPhone,
                    merchantId: this.merchantId,
                };
                axios({
                    url: this.Api1 + '/user/shoppingCart/clearGoods',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.choiceSpc();
                        Toast('购物车已清空');
                         this.carvisible = false;
                         
                    } else {
                        Toast(res.data.message)
                    }
                });
            },
            //去到购物车
            goShopcar() {
                if (this.shopshu == 0) {

                } else {
                    this.carvisible = !this.carvisible;
                    this.$emit('update:disvisible', false)
                    this.$emit('update:spevisible', false)
                }
            },
            //获取购物车信息
            choiceSpc() {
                let post = {
                    username: this.userPhone,
                    merchantId: this.merchantId
                };
                axios({
                    url: this.Api1 + '/user/shoppingCart/buyerCart',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    
                    if (res.data.code == 200) {

                        this.minPrice = res.data.data.minPrice;
                        this.postDate = res.data.data;
                        this.list = res.data.data.buyerItems;
                        this.shopshu = this.postDate.totalCount;
                        for (let i = 0; i < this.list.length; i++) {
                            this.goodsid.push(this.list[i].goodsId)
                        }
                        this.shopCar(this.goodsid);
                        this.shopMoney(this.postDate.totalPrice)
                    }else if(res.data.code == 401||res.data.code == 402){

                    } else {
                        Toast(res.data.message)
                    }
                });
            },

            //提交订单
            goShoporder() {
                if (this.shopshu == 0) {

                } else {
                    this.$router.push({
                        path: '/comment/Settlement',
                        query: {
                            id: this.id
                        }
                    })
                }
            },
            ...mapMutations(["shopCar", "shopMoney"])
        }
    }

</script>

<style scoped>
    .footer {
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        height: 2rem;
        display: flex;
        z-index: 9999;
    }

    .footer .left {
        flex: 1;
        display: flex;
        justify-content: space-around;
        background-color: #212121;
    }

    .footer .left .shopcar {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background-color: #ff911e;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 1.1rem;
        bottom: 0.6rem;
    }

    .footer .left .bjbh {
        background-color: #999 !important;
    }

    .footer .left .shopcar .shumu {
        min-width: 0.6rem;
        height: 0.6rem;
  
        border-radius: 50%;
        line-height: 0.6rem;
        text-align: center;
        background-color: #E0302D;
        color: #fff;
        font-size: 0.33rem;
        position: absolute;
        right: 0.2rem;
        top: 0;
    }

    .footer .left .shopcar img {
        width: 60%;
        height: 60%;
    }

    .footer .left .shop {
        font-size: 0.58rem;
        color: #fff;
        flex: 1;
        text-align: center;
        text-indent: 5em;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .footer .left .shop .money {
        font-size: 0.75rem;
        line-height: 1.1rem;
    }

    .footer .left .shop .pei {
        font-size: 0.45rem;
        line-height: 0.9rem;
        color: #aaa;
    }

    .footer .right {
        width: 30%;
        line-height: 2rem;
        text-align: center;
        background-color: #ff911e;
        color: #fff;
        font-size: 0.625rem;
    }

    .footer .bjbh {
        background-color: #999 !important;
    }

    /* 购物车样式 */
    .carbtn {

        width: 100%;
        max-height: 60vh;
        color: #666;
        font-size: 0.62rem;
    }

    .carbtn .name {
        background-color: #FFF8CC;
        color: #FF4400;
        text-align: center;
        line-height: 1.4rem;
    }

    .carbtn .carhead {
        height: 2rem;
        padding: 0 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .carbtn .maincar {
        overflow: auto;
        max-height: 50vh;
    }

    .carbtn .maincar::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }

    .carbtn .maincar .shopInfo {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.2rem;
    }

    .carbtn .maincar .shopInfo .left {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .carbtn .maincar .shopInfo .left img {
        width: 90%;
        height: 90%;
    }

    .carbtn .maincar .shopInfo .right {
        flex: 1;
        padding-left: 0.3rem;
        display: flex;
        justify-content: space-between;
    }

    .carbtn .maincar .shopInfo .right .c1 {
        line-height: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.65rem;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .carbtn .maincar .shopInfo .right .c1 img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.5rem;
    }

    .carbtn .maincar .shopInfo .right .c2 {
        line-height: 0.8rem;
        display: flex;
        align-items: center;
    }

    .carbtn .maincar .shopInfo .right .c2 div {
        padding: 0 0.2rem;
        border-right: 1px solid #bbb;
    }

    .carbtn .maincar .shopInfo .right .c2 div:last-child {
        border: none;
    }

    .carbtn .maincar .shopInfo .right .c3 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
        justify-content: space-between;
    }

    .carbtn .maincar .shopInfo .right .c3 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;
    }

    .carbtn .maincar .shopInfo .right .lleft {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
    }

    .carbtn .maincar .shopInfo .right .add {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        padding-bottom: 0.5rem;
        width: 30%;
    }

    .carbtn .maincar .shopInfo .right .add img {
        width: 0.8rem;
        height: 0.8rem;
    }

</style>
