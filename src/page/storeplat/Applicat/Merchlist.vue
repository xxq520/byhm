<template>
    <div class="mainbox" v-cloak>
        <topnav :topnav="topnav" class="nav"></topnav>
        <div class="Snacks" v-for="(ctype,index) in shoplist">
            <div class="header">
                <div class="root"> <span @click="duoChoose(ctype,index)"><img
                            src="@/assets/images/storeplat/by_payment_ics.png" v-show="!ctype.checkedItem">
                        <img src="@/assets/images/storeplat/by_payment_ict.png"
                            v-show="ctype.checkedItem"></span>{{ctype.categoryName}}
                </div>
                <i :class="ctype.selectedItem?'el-icon-arrow-up':'el-icon-arrow-down'"
                    @click="ctype.selectedItem = !ctype.selectedItem"></i>
            </div>
            <ul v-if="ctype.selectedItem">
                <li class="merchandise" v-for="item in ctype.goodsPartInfoVOS">
                    <div class="left"><span @click="danChoose(item,index)" class="xiaotu"><img
                                src="@/assets/images/storeplat/by_payment_ics.png" v-show="!item.pitchOn">
                            <img src="@/assets/images/storeplat/by_payment_ict.png" v-show="item.pitchOn"></span><img
                            :src="item.listPicUrl" alt="">
                    </div>
                    <div class="right">
                        <div class="shopname">
                            {{item.goodsName}}
                        </div>
                        <div class="price">
                            <div style="color: #ff4400;"> ￥{{item.retailPrice}} </div>

                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="footer">
            <span @click="allChoose()"><img src="@/assets/images/storeplat/by_payment_ics.png" v-show="!allShow">
                <img src="@/assets/images/storeplat/by_payment_ict.png" v-show="allShow"> 全选</span>
            <div class="btn" @click="submit">添加</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '商品列表',
                },
                levelId: this.$cookie.get("level_id"),
                seq: this.$cookie.get('seq'),
                userPhone: this.$cookie.get("userPhone"),
                userid: this.$cookie.get("userid"),
                allShow: false,
                shoplist: [],
                eventId: this.$route.query.eventId,
                stime: this.$route.query.stime,
                atime: this.$route.query.atime,
                merid: this.$cookie.get("merId"),
                id: this.$route.query.id,
                aid: this.$route.query.aid,
             
            }
        },
        mounted() {

            if (this.stime) {
                this.getDisInfo()
            } else if (this.aid) {
                this.getAuInfo()
                
            } else {
                this.getInfo()
            }


        },
        methods: {
            //获取折扣活动商品
            getDisInfo() {
                if (!this.eventId) {
                    this.eventId = "";
                }
                let post = {
                    merchantId: this.merid,
                    eventId: this.eventId,
                    type: 0,
                    startTime: this.stime,
                    endTime: this.atime
                };
                axios({
                    url: this.Api1 + '/goods/categoryAndGoods',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shoplist = data;

                        for (let i = 0; i < this.shoplist.length; i++) {
                            console.log(this.shoplist[i].goodsPartInfoVOS);
                            for (let j = 0; j < this.shoplist[i].goodsPartInfoVOS.length; j++) {
                                if (!this.shoplist[i].goodsPartInfoVOS[j].pitchOn) {

                                } else {
                                    this.shoplist[i].checkedItem = true;
                                }
                            }
                        }

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取优惠劵活动商品
            getAuInfo() {
               
                let post = {
                    merchantId: this.merid,
                    voucherId: this.aid,
                    type: -1
                };
                axios({
                    url: this.Api1 + '/goods/categoryAndGoods',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shoplist = data;

                        for (let i = 0; i < this.shoplist.length; i++) {
                            console.log(this.shoplist[i].goodsPartInfoVOS);
                            for (let
                                    j = 0; j < this.shoplist[i].goodsPartInfoVOS.length; j++) {
                                if (!this.shoplist[i].goodsPartInfoVOS[j].pitchOn) {} else {
                                    this.shoplist[i].checkedItem = true;
                                }
                            }
                        }
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取信息
            getInfo() {

                var that = this;

                let post = {
                    merchantId: this.merid
                };
                axios({
                    url: this.Api1 + '/goods/categoryAndGoods',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shoplist = data;


                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //选择一类商品
            duoChoose(val, idx) {
                val.checkedItem = !val.checkedItem;
                let array = this.shoplist[idx].goodsPartInfoVOS;
                if (val.checkedItem) {
                    for (let i = 0; i < array.length; i++) {
                        array[i].pitchOn = true
                    }
                } else {
                    for (let i = 0; i < array.length; i++) {
                        array[i].pitchOn = false
                    }
                }
            },
            //选择单一商品
            danChoose(val, idx) {
                val.pitchOn = !val.pitchOn;
                let array = this.shoplist[idx].goodsPartInfoVOS;
                var newArr = array.filter(item => item.pitchOn == false)
                if (newArr.length == 0) {
                    this.shoplist[idx].checkedItem = true;
                } else {
                    this.shoplist[idx].checkedItem = false;
                }
            },
            //选择全部商品
            allChoose() {
                this.allShow = !this.allShow;
                if (this.allShow) {
                    for (let i = 0; i < this.shoplist.length; i++) {
                        this.shoplist[i].checkedItem = true;
                        for (let j = 0; j < this.shoplist[i].goodsPartInfoVOS.length; j++) {
                            this.shoplist[i].goodsPartInfoVOS[j].pitchOn = true;
                        }
                    }
                } else {
                    for (let i = 0; i < this.shoplist.length; i++) {
                        this.shoplist[i].checkedItem = false;
                        for (let j = 0; j < this.shoplist[i].goodsPartInfoVOS.length; j++) {
                            this.shoplist[i].goodsPartInfoVOS[j].pitchOn = false;
                        }
                    }
                }
            },
            //提交
            submit() {
                let smaShop = []
                for (let i = 0; i < this.shoplist.length; i++) {
                    for (let j = 0; j < this.shoplist[i].goodsPartInfoVOS.length; j++) {
                        if (this.shoplist[i].goodsPartInfoVOS[j].pitchOn) {
                            smaShop.push(this.shoplist[i].goodsPartInfoVOS[j].goodsId)
                        }
                    }
                }
                sessionStorage.setItem('smaShow', 1);
                sessionStorage.setItem('smaShop', JSON.stringify(smaShop));
                setTimeout(() => {
                    this.$router.go(-1);
                }, 1000);
            },

        }
    }

</script>

<style scoped>
    .mainbox {
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;
        padding-bottom: 50px;
        padding-top: 40px;
    }

    .nav {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .Snacks {
        margin-top: 10px;
        font-size: 0.62rem;
        color: #333;
        background-color: #fff;
    }

    .Snacks .header {
        width: 100%;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: solid 1px #eee;
        padding: 0 0.5rem;
    }

    .Snacks .header .root {
        height: 2rem;
        flex: 1;
        display: flex;
        align-items: center;

    }

    .Snacks .header img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
    }

    .Snacks .merchandise {
        padding: 0.3rem 0.5rem;
        display: flex;
        border-bottom: solid 1px #eee;

    }

    .Snacks .merchandise .left {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .Snacks .merchandise .left img {
        width: 3rem;
        height: 3rem;
    }

    .Snacks .merchandise .left .xiaotu img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
    }

    .Snacks .merchandise .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 0.2rem;
    }

    .footer {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        padding: 0 0.6rem;
        font-size: 0.6rem;
        color: #666;
    }

    .footer span {
        height: 2rem;
        display: flex;
        align-items: center;
    }

    .footer img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.5rem;
    }

    .footer .btn {
        width: 3.25rem;
        height: 1.2rem;
        text-align: center;
        line-height: 1.2rem;
        background-color: #FF9D19;
        color: #fff;
        border-radius: 0.6rem;
    }

</style>
