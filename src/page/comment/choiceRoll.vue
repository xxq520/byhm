<template>
    <div class="become-member">
        <!-- 头部 -->
        <!-- <topnav :topnav="topnav"></topnav> -->
          <mt-header :title="topnav.title">
              <mt-button icon="back" slot="left" @click="goback"></mt-button>
              <mt-button slot="right" @click="goback">确定</mt-button>
          </mt-header>
        <ul class="list">

            <div class="name" v-if="list.length"> 可用优惠券/折扣券<span
                    style="text-indent: 1em;display: inline-block;">({{list.length}})</span></div>
            <li v-for="(item,index) in list" :key="index" @click="messagebtnfn(item.id)">
                <img class="biao" src="@/assets/images/shoppingMall/by_baimage_tic.png" v-show="messagebtn==item.id" />
                <div class="youInfo ">
                    <div class="a1" v-if="item.type==2">
                        <div style="color: #FF4400;font-size: 0.8rem;">￥{{item.discountAmount}} </div>
                       <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                    </div>
                    <div class="a1" v-else>
                        <div style="color: #FF4400;font-size: 0.8rem;"> {{item.discount}}折</div>
                        <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                    </div>
                    <div class="a2">
                        <div style="display: flex;justify-content: space-between;">
                            <div style="font-size: 0.72rem;"> {{item.name}} </div>

                        </div>
                        <div>适用店铺：{{item.merchantName}}</div>
                        <div style="color:#999;">限：{{arrquxiao(item.startTime)}}-{{arrquxiao(item.endTime)}}</div>
                    </div>
                </div>
            </li>

        </ul>
        <ul class="list">
            <div class="name"> 不可用优惠券/折扣券<span
                    style="text-indent: 1em;display: inline-block;">({{fwlist.length}})</span>
            </div>
            <li v-for="(b,i) in fwlist" :key="i" style="color: #999;">
                <div class="youInfo colors">
                    <div class="a1" v-if="b.type==2">
                        <div style="color: #999;font-size: 1rem;">￥{{b.discountAmount}} </div>
                        <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                    </div>
                    <div class="a1" v-else>
                        <div style="color: #999;font-size: 1rem;"> {{b.discount}}折</div>
                        <div style="font-size: 0.5rem;"> {{item.remarks}} </div>
                    </div>
                    <div class="a2">
                        <div style="display: flex;justify-content: space-between;">
                            <div style="font-size: 0.72rem;"> {{b.name}} </div>

                        </div>
                        <div>适用店铺：{{b.merchantName}}</div>
                        <div style="color:#999;">限：{{arrquxiao(b.startTime)}}-{{arrquxiao(b.endTime)}}</div>
                    </div>
                </div>
                <div class="foot" v-if="b.status != 0">
                    本券不可用原因：{{b.status==1?'已使用':b.status==2?'已过期':''}}
                </div>
            </li>

        </ul>

    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
                topnav: {
                    title: '优惠券/折扣券',
                },
                seq: this.$cookie.get('seq'),
                price: {},
                carvist: false,
                postData: {},
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                list: [],
                yuanyin: '本券不适用于本商品',
                messagebtn: 0,
                fwlist: [],
                goodsId: this.$store.state.shopcarId,
                merId: this.$route.query.id,
                yhjmoney: '',
                yhjmoney: '',
                yhjmoney: '',
                userPhone: this.$cookie.get('userPhone'),

            };
        },
        created() {

        },
        mounted() {
            this.handler();
        },
        methods: {
            goback(){
             this.$router.go(-1)
            },
            arrquxiao(val) {
                let abs = val.split(' ');
                return abs[0];
            },
            messagebtnfn(val) {
                if (this.messagebtn == val) {
                    this.messagebtn = 0;
                } else {
                    this.messagebtn = val;
                    this.couponIds(val)


                }
            },
            handler() {


                let post = {
                    goodsIds: this.goodsId,
                    userId: this.userid,
                    username:this.userPhone,
                    amount: this.$store.state.shopcarAm,
                    merchantId: this.merId
                };
                axios({
                    url: this.Api1 + '/user/userVoucher/goodsVoucherList',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    
                    if (res.data.code == 200) {
                        this.list = res.data.data.usableVoucherList;
                        this.fwlist = res.data.data.noUsableVoucherList;
                    }else {
                    Toast(res.data.message)
                    }
                })
            },
            ...mapMutations(["couponIds"])
        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;
        font-family: PingFang-SC-Bold;
        overflow: hidden;
        padding-top: 40px;

    }
         .become-member>>>.mint-header {
         background: #ff911e;
         border-bottom: none;
         font-size: .65rem;
         position: fixed;
         left: 0;
         top: 0;
         width: 100%;
         z-index: 9;
         }
    .list {
        padding: 0.4rem;
    }

    .list .name {
        font-size: 0.65rem;
        line-height: 1.4rem;
        color: #333;
        font-weight: 500;

    }

    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
        overflow: hidden;
        position: relative;
    }

    .list li .biao {
        position: absolute;
        top: 0;
        right: 0;
        width: 1.2rem;
        height: 1.1rem;
    }

    .list li .youInfo {
        display: flex;
        padding: 0.6rem 0;

        position: relative;
    }

    .list li .youInfo .a1 {
        width: 33%;
        text-align: center;
        line-height: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-right: 1px dashed #eee;
    }

    .list li .youInfo .a2 {
        flex: 1;

        line-height: 1.4rem;
        padding-left: 0.5rem;
    }

    .list li .youInfo::before {
        content: '';
        width: 7px;
        height: 14px;

        border: 1px solid #eee;
        border-radius: 0 20px 20px 0;
        border-left: 1px solid transparent;
        background-color: #f5f5f5;
        position: absolute;
        left: 0px;
        bottom: 1.2rem;
    }

    .list li .youInfo::after {
        content: '';
        width: 7px;
        height: 14px;
        position: absolute;
        border: 1px solid #eee;
        border-radius: 20px 0 0 20px;
        border-right: 1px solid transparent;
        background-color: #f5f5f5;
        position: absolute;
        right: 0px;
        bottom: 1.2rem;
    }

    .list li .foot {
        display: flex;
        padding: 0 0.5rem;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        font-size: 0.5rem;
        color: #999;
        border-top: 1px solid #eee;

    }

    .colors {
        color: #999 !important;
    }

</style>
