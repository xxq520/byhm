<template>
    <div class="buy-card-record">
        <!-- 头部 -->
        <div class="head">
            <topnav :topnav="topnav"></topnav>
        </div>

        <!-- <div class="money">
      <div>收款金额</div>
      <div class="price">¥ {{ money?money/100:'' }}</div>
    </div> -->
        <div class="mian">
            <div class="cart-list provCity" @click="adressfn">
                <label v-if="!areadata">推广地区/详细地址:</label>
                <label v-else>
                    <p>{{ areadata.prov.name }}</p>
                    <p>{{ areadata.city.name }}</p>
                    <p>{{ areadata.area.name }}</p>

                </label>
                <p class="lmain adress">
                    <span></span><i class="el-icon-arrow-right"></i>
                </p>
            </div>
            <div class="padd">

                <div class="flex-box mb-10">
                    <div>推荐人</div>
                    <div class="l-s-1">{{ post.realName?post.realName:'' }}</div>
                </div>
                <div class="flex-box mb-10">
                    <div>推荐人手机</div>
                    <div>{{ post.inviterMobile? post.inviterMobile:'' }}</div>
                </div>
            </div>
            <div class="xinxi">
                <div class="flex-box mb-10">
                    <div>商品名称</div>
                    <div class="l-s-1">{{ post.goodsName }}</div>
                </div>
                <div class="flex-box mb-10">
                    <div>获券总额</div>
                    <div>{{ toMoney(post.coupon) }}</div>
                </div>
                <div class="flex-box mb-10">
                    <div>收款方</div>
                    <div>付款给百业惠盟</div>
                </div>


                <div class="flex-box mb-10">
                    <div>付款金额</div>
                    <div id="price">¥ {{ post.price?toMoney(post.price):'' }}</div>
                </div>
            </div>
            <!--<div class="flex-box mb-10">
      <div>卡号<input type="number" id="card-input" placeholder="请输入卡号"></div>
      <div><img class="i-icon" src="@/assets/images/ghh.png"/></div>
    </div>
    <div class="use-card">
      <a>可用银行卡与限额</a>
    </div>-->
            <div class="pay-box">
                <div class="pay-way">支付方式</div>
                
                <div class="between-flex" v-if="$store.state.weixin3">
                    <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/weixin.png" />微信支付</div>
                    <div>
                        <div class="select-pay" :class="{'quan':checked=='0'}" @click="checkedfn(0)" ref="weixin"
                            id="weixin">
                            <i class="el-icon-check select"></i>
                        </div>
                    </div>
                </div>
                       <!-- <div class="between-flex" v-if="$store.state.weixinshow">
                           <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/weixin.png" />高汇通</div>
                           <div>
                               <div class="select-pay" :class="{'quan':checked=='3'}" @click="checkedfn(3)" ref="weixin"
                                   id="weixin">
                                   <i class="el-icon-check select"></i>
                               </div>
                           </div>
                       </div> -->
                 <div class="between-flex">
                     <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/blank.png" />银联支付
                             </div>
                         <div>
                         <div class="select-pay" :class="{'quan':checked=='2'}" @click="checkedfn(2)"
                                 ref="weixin" id="weixin">
                                 <i class="el-icon-check select"></i>
                                 </div>
                             </div>
                     </div>
            </div>
            <div class="next-box">
                <div v-if="!subClick" class="next-btn" @click="priceCheck">确定支付</div>
                <div v-else class="next-btn" style="background:#999;">
                    <mt-spinner type="fading-circle" color="#fff" :size="15"></mt-spinner>确定支付
                </div>
            </div>
        </div>
        <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup>
    </div>
</template>

<script>
    export default {
        name: "cashRegister",
        data() {
            return {
                topnav: {
                    title: '确认订单',
                },
                money: '',
                name: '',
                code: '',
                xuan: '',
                way: '', //支付方式 0-微信 2-银联
                seq: this.$cookie.get('seq'),
                subClick: false,
                checked: '', //是否选中
                weixinShow: true,
                visible: false,
                areadata: null,
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                cardType2: this.$route.query.cardType,
                level: this.$route.query.level,
                code2: this.$route.query.code,
                post: {},
                inviterMobile: null,
                inviterCardNo: null,
                 weixinshow:false

            };
        },
        created() {
            this.checkedfn(2);
            this.getPrice();
         
            this.initialization();
            this.getUpgradePrice();
        },
        beforeRouteLeave(to, from, next) {
          if (this.$route.query.platform == 'android' || this.$route.query.platform == 'ios') {

          } else {
          this.$store.commit('gb3')
          }
        next();
        },
        mounted() {
     
        },
        methods: {
            priceCheck() {

             
                if (this.areadata == null) {
                    Toast({
                        message: "请选择地区",
                        position: "middle"
                    });

                    return false;
                }
                if (this.areadata['city'].name == undefined || this.areadata['prov'].name ==
                    undefined || this.areadata['area'].name == undefined) {
                    Toast({
                        message: "请选择地区",
                        position: "middle"
                    });
                    return false;
                }
                let level2 = this.level == undefined ? 1 : this.level;
                let cardType4 = this.cardType2 == undefined ? this.cardType : this.cardType2;

                let param = {
                    level: level2,
                    province: this.areadata.prov.name,
                    city: this.areadata.city.name,
                    county: this.areadata.area.name,
                    cardNo: !parseInt(this.code2) ? this.inviterCardNo : this.code2,
                    inviterMobile: this.inviterMobile ? this.inviterMobile : null,
                    cardType: this.cardType2 ? this.cardType2 : 1
                }
                axios({
                    method: "post",
                    url: this.Api + "agency/updateArea",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                    data: param
                }).then(res => {
                    if (res.data.code == 0) {
                        let data = res.data.data;
                        this.$cookie.set('level_id', data.levelId);
                        this.$cookie.set('cardType', data.cardType);
                        this.$cookie.set('province', data.province);
                        this.$cookie.set('city', data.city);
                        this.$cookie.set('county', data.county);
                        this.$cookie.set('address', data.address);
                        this.$cookie.set('isFake', data.isFake);
                        this.$cookie.set('isActive', data.isActive);
                        this.$cookie.set('vip_time', data.expireTime);
                        console.log(res, '76')

                        let that = this;
                        let param = {
                            userId: this.userid,
                            levelId: this.level,
                            payMethod: this.way
                        }
                        axios({
                            method: "post",
                            url: that.Api + "order/accountSubmits",
                            headers: {
                                "X-Nideshop-Token": that.$cookie.get('token')
                            },
                            data: qs.stringify(param)
                        }).then(res => {
                            if (res.data.errno == 0) {
                                that.$router.push({
                                    name: "myOrder",
                                });
                            } else {
                                Toast(res.data.errmsg)
                            }
                        })


                    }

                });

            },
            initialization() {
                if (this.$cookie.get("province") && this.$cookie.get("province") != 'null') {
                    console.log(this.$cookie.get("province"))
                    this.areadata = {}
                    this.areadata['prov'] = {}
                    this.areadata['prov'].name = this.$cookie.get("province");
                    if (this.areadata['prov'].name == undefined||this.areadata['prov'].name == 'undefined') {
                        this.areadata['prov'].name = null
                    }
                }
                if (this.$cookie.get("city") && this.$cookie.get("city") != 'null') {
                    this.areadata['city'] = {}
                    this.areadata['city'].name = this.$cookie.get("city")
                    if (this.areadata['city'].name == undefined||this.areadata['city'].name == 'undefined') {
                        this.areadata['city'].name = null
                    }
                }
                if (this.$cookie.get("county") && this.$cookie.get("county") != 'null') {
                    this.areadata['area'] = {}
                    this.areadata['area'].name = this.$cookie.get("county")
                    if (this.areadata['area'].name == undefined||this.areadata['area'].name == 'undefined') {
                        this.areadata['area'].name = null
                    }
                }

            },
            getUpgradePrice() {
                let level2 = this.level == undefined ? 1 : this.level;
                let cardType4 = this.cardType2 == undefined ? this.cardType : this.cardType2;

                axios({
                    url: this.Api + 'goods/getUpgradePrice?userId=' + this.userid + '&cardType=' + cardType4 +
                        '&levelId=' + level2,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        console.log(res, '3');
                        this.post = res.data.data;
                        this.inviterCardNo = res.data.data.inviterCardNo;
                        this.inviterMobile = res.data.data.inviterMobile;
                    }
                });
            },

            toMoney(val) {
                let money = (val / 100).toFixed(2)
                return money
            },
            region(val) {
                this.areadata = val;
                console.log(this.areadata, '87');

            },
            visiblefn(val) {
                this.visible = val;
            },
            goBack() {
                this.$router.go(-1);
            },
            getPrice() {
                this.money = this.$route.query.money;
                this.name = this.$route.query.name;
                // this.code = this.$route.query.code;
                this.xuan = this.$route.query.xuan;
                // this.way = this.$route.query.way;
            },
            // 选择支付方式
            checkedfn(val) {
                console.log(val);
                this.checked = val == this.checked ? '' : val;
                this.way = val;
                console.log(this.way);
            },
            adressfn() {
                this.visible = true;
            },
        }
    }

</script>

<style scoped>
    /* >>>可以修改某一个标签里面的其他组件样式 */
    .mian {
        padding: 0.5rem;
    }

    .cart-list {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 10px;
        background-color: #fff;
        font-size: 14px;
        line-height: 1.4em;
        margin-bottom: 0.5rem;
    }

    .cart-list label {
        float: left;
        width: 7.5rem;
        color: #333;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        width: calc(100% - 7.7em);
        color: #333;
    }

    .cart-list p.adress span {
        display: block;
        flex: 1;
        height: 1.4em;
        word-break: break-all;
    }

    .cart-list p.adress i {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .cart-list input {
        display: block;
        flex: 1;
        font-size: 0.7rem;
        color: #333;
        word-break: break-all;
    }

    .buy-card-record {
        height: 100vh;
        background: #eee;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
    }

    .money {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .625rem;
    }

    #price {
        font-size: 0.7rem;
        color: #ec0746;
        margin-left: 14px;
    }

    .flex-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #ffffff;
        padding: 1.1rem 0;
    }

    .flex-box div:first-child {
        font-size: .625rem;
        color: #666;

    }

    .flex-box div:last-child {
        font-size: .541667rem;
        color: #666666;
    }

    .padd {
        padding: 0 0.5rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
    }

    .xinxi {
        padding: 0 0.5rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
    }

    .mb-10 {

        border-bottom: 1px solid #eee;
    }

    .l-s-1 {
        letter-spacing: 1px;
    }

    #card-input {
        height: 40px;
        padding-left: 30px;
        font-size: 12px;
        width: 10.416667rem;
    }

    .use-card {
        text-align: right;
        font-size: 12px;
        color: #194dd1;
        padding-right: 1.25rem;
    }

    .use-card a {
        border-bottom: 1px solid #194dd1;
    }

    .next-box {
        text-align: center;
        margin-top: 15px;
    }

    .next-btn {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin: 0 auto;
        width: 9.375rem;
        padding: 0.5rem 0;
        border-radius: 20rem;
        background: -webkit-linear-gradient(left,
                #ff9500,
                #ff8c39);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ff9500, #ff8c39);
        /* 标准的语法 */
        text-align: center;
        color: #ffffff;
        font-size: 15px;
        line-height: 1.4em;
        letter-spacing: 2px;
    }

    .go-back {
        width: 10px;
        position: absolute;
        left: 10px;
        top: 18px;
    }

    .i-icon {
        width: .291667rem;
        height: .666667rem;
    }

    .next-btn span {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .next-btn>>>.mint-spinner-fading-circle {
        display: inline-block;
        margin-right: 5px;
        padding-top: 0.2em;
    }

    .pay-way {
        background: #f2f2f2;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        color: #333333;
        font-size: .625rem;
        letter-spacing: 3px;
        font-weight: bold;
    }

    .between-flex {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        font-size: .625rem;
        color: #666666;
        padding: 0 0.833333rem;
        background: #ffffff;
        margin-bottom: 1px;
    }

    .flex-pic {
        display: flex;
        align-items: center;
    }

    .weixin-pic {
        width: 1.333333rem;
        margin-right: .791667rem;
    }

    .select-pay i {
        display: none;
    }

    .select-pay {
        width: .833333rem;
        height: .833333rem;
        border-radius: 50%;
        font-weight: bold;
        border: 1px solid #a5a5a5;
    }

    .select {
        color: #F52052;
        font-size: .916667rem;
    }

    .quan {
        border-color: #F52052;
        background: #F52052;
    }

    .quan i {
        display: inline-block;
        font-size: .7rem;
        color: white;
        line-height: .75rem;
    }

</style>
