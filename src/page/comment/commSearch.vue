<template>
    <div class="mainbox">
        <topnav :topnav="topnav" class="topnav" v-if="cearyid"></topnav>
        <header class="mint-header" v-else>
            <div class="heade">
                <div class="mint-header-button is-left">
                    <button class="mint-button" @click="goback">
                        <span class="mint-button-i">
                            <i class="mintui mintui-back"></i>
                        </span>
                    </button>
                </div>
                <div class="search">
                    <div class="searhed">
                        <i class="el-icon-search"></i>
                        <input type="text" placeholder="查找商家\商品" v-model="search" @focus="searhed">
                        <i class="el-icon-circle-close" v-show="close" @click="closefn"></i>
                    </div>
                </div>
                <div @click="submitfn">搜索</div>
            </div>
        </header>

        <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="100">
            <ul class="list">
                <li v-for="(item,index) in list" :key="index">
                    <div class="shopInfo" @click="gocommodity(item.goodsSn)">
                        <div class="left"><img :src="item.listPicUrl"></div>
                        <div class="right">
                            <div class="a1">
                                {{item.goodsName}}
                            </div>
                            <div class="a2">
                                月售 {{item.monthSales}}
                            </div>
                            <div class="a3">
                                <div class="b1" v-show="item.remarks">{{item.remarks}}</div>
                               <div style="margin-right: 0.1rem;" v-show="item.limitNum">限购{{item.limitNum}}份
                               </div>
                                <div>{{!!item.purchaseQuantity?item.purchaseQuantity:1}}份起购</div>
                            </div>
                            <div class="lq">
                                <div class="a4">
                                    <div style="font-size: 0.65rem;">￥{{item.retailPrice}}</div>
                                    <div class="yuanjia">￥{{item.marketPrice}}</div>
                                </div>
                                <img src="@/assets/images/shoppingMall/home_p2_icon_zjsp.png"
                                    @click.stop="choiceSpc(item,item.goodsSn)">
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="loading">
                <loading :load.sync="loadshow" :end.sync="loadend"></loading>
            </div>
        </div>
        <shopcar :id="id" ref="child">
        </shopcar>
        <mt-popup v-model="spevisible" position="bottom"
            style="width: 100%;border-radius:10px 10px 0  0 ; bottom: 2rem;">
            <div class="spebtn">
                <div class="heade">
                    <div class="name">{{goodsName}}</div>
                    <div class="close" @click="closeSpc">x</div>
                </div>
                <div class="mmoo">
                    <div class="a4">
                        <div style="font-size: 0.65rem;">￥{{retailPrice}}
                        </div>
                        <div class="yuanjia">{{marketPrice}}</div>
                    </div>
                    <div style="color: #999;">库存:{{goodstock}}</div>
                </div>

                <div class="subItem" v-for="(item,index) in subItemList" :key="index">
                    <div class="itemTitle">{{item.attrName}}</div>
                    <div class="itemContent">
                        <ul>
                            <li v-for="(b,Index) in item.attrValueList" :key="Index"
                                @click="selectItem(b,index,$event,Index)"
                                :class="subIndex[index] == Index?'selectActive':'itemLi'">{{b.attrValue}}</li>
                        </ul>
                    </div>
                </div>
                <div class="spefoot">
                    <div class="tjspe" @click="speSubmit()">确定</div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        name: 'searh',
        data() {
            return {
                topnav: {
                    title: "适用商品"
                },
                close: false,
                search: '',
                history: [],
                loading: true,
                loadshow: false,
                loadend: true,
                list: [],
                lng: '',
                lat: '',
                pageNum: 1,
                pageSize: 8,
                nodata: false,
                levelid: this.$cookie.get('level_id') ? this.$cookie.get('level_id') : 1,
                score: 5,
                sortStatus: 1,
                keyword: '',
                spevisible: false,
                id: this.$route.query.id ? this.$route.query.id : '',

                showSelectSpec: [],
                subItemList: [],
                selectArr: [], // 存放被选中的值
                subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断,
                goodsName: '',
                retailPrice: '',
                marketPrice: '',
                goodstock: 0,
                keyword: '',
                goodsSn: '',
                cearyid: this.$route.query.cearyid ? this.$route.query.cearyid : '',
                userPhone: this.$cookie.get('userPhone'),
                isCommon: this.$route.query.isCommon


            }
        },
        mounted() {
            if (this.cearyid) {
                this.loading = false;
                this.loadshow = true;
                this.loadend = false;
            }
        },
        methods: {

            //关闭规格
            closeSpc() {
                this.spevisible = false;
            },

            submitfn() {
                if (this.search == '') {
                    Toast('请输入搜索关键词。');
                    return false;
                };
                this.searhShow = true;
                this.subjectShow = true;
                this.list = [];
                this.pageNum = 1;
                this.keyword = this.search;
                this.loadshow = true;
                this.loadend = false;
                this.loading = false;
                this.loadMore();
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                if (this.cearyid) {
                    let post = {
                        merchantId: this.id,
                        voucherId: this.cearyid,
                        isCommon: this.isCommon,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                    axios({
                        method: "get",
                        url: this.Api1 + '/goods/selectGoodsListByVoucherId',
                        params: post,
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        let data = res.data.data;
                        this.loadshow = false;
                        if (data.list.length == 0) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        (this.pageNum) ++;
                        this.list = this.list.concat(data.list);
                        console.log();

                        this.loading = false;
                        this.loadshow = false;
                    });
                } else {
                    let post = {
                        merchantId: this.id,
                        goodsName: this.keyword,
                        pageNum: this.pageNum,
                        pageSize: this.pageSize
                    }
                    axios({
                        method: "get",
                        url: this.Api1 + '/goods/selectGoodsList',
                        params: post,
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        let data = res.data.data;
                        this.loadshow = false;
                        if (data.list.length == 0) {
                            this.loadend = true;
                            this.loading = true;
                            this.loadshow = false;
                            return false;
                        };
                        (this.pageNum) ++;
                        this.list = this.list.concat(data.list);
                        this.loading = false;
                        this.loadshow = false;
                    });
                }

            },
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 100) / 100 + 'km';
                    } else {
                        distance = distance + 'm';
                    }
                    return distance;
                }
            },
            closefn() {
                this.search = '';
                $('.searhed input').focus();
                this.close = false;
            },
            blurfn() {

            },
            searhed() {
                this.close = true;
            },
            //返回
            goback() {
                this.$router.go(-1)
            },
            //去到商品详情
            gocommodity(val) {
                this.$router.push({
                    path: '/comment/commodity',
                    query: {
                        goodsSn: val
                    }
                })
            },
            //选择规格
            choiceSpc(val, id) {

                this.goodsSn = id;
                if (val.specificationType == 1) {
                    let post = {
                        goodsSn: id
                    };
                    this.goodsName = val.goodsName
                    axios({
                        url: this.Api1 + '/goods/querySpecification',
                        params: post,
                        method: "get",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8",
                        },
                    }).then(res => {
                        let data = res.data.data;
                        if (res.data.code == 200 && JSON.stringify(data) != '{}') {
                            this.marketPrice = data.skuList[0].marketPrice;
                            this.retailPrice = data.skuList[0].retailPrice;
                            this.goodstock = data.skuList[0].stock;
                            this.subItemList = data.props;
                            this.skulist = data.skuList[0];
                        }
                    });
                    this.spevisible = true;
                } else {
                    this.showSelectSpec = [];
                    this.speSubmit()
                }
            },
            //获取选定规格
            selectSpec(index) {
                let t = this;
                t.showSpec = true;
            },
            selectItem(res, index, enevt, resIndex) {
                let t = this;
                if (t.selectArr[index] !== res) {
                    t.selectArr[index] = res;
                    t.subIndex[index] = resIndex;
                } else {
                    t.selectArr[index] = "";
                    t.subIndex[index] = -1; // 去掉选中的颜色
                }
                t.checkItem();
            },
            checkItem: function () {
                var self = this;
                let option = []
                for (var i = 0; i < this.selectArr.length; i++) {
                    option.push(this.selectArr[i].attrValue)
                }
                self.$forceUpdate(); // 重绘
                self.showSelectSpec = option
            },

            //提交所选规格
            speSubmit() {
                console.log(this.subItemList);

                for (var i = 0; i < this.subItemList.length; i++) {
                    if (this.selectArr[i] == undefined) {
                        Toast('请选择完整规格');
                        return;
                    }
                }
                this.spevisible = false;
                let post = {
                    username: this.userPhone,
                    merchantId: this.id,
                    goodsSn: this.goodsSn,
                    amount: 1,
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
                        this.showSelectSpec = [];
                        this.subIndex = [];
                        this.$refs.child.choiceSpc();
                    }
                });

            },

        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: visible;
        padding-top: 45px;
        min-height: 100vh;
        background: #fff;
        padding-bottom: 2.5rem;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;
    }

    .mint-header {
        background: #ff911e;
        width: 100%;
        border-bottom: none;
        font-size: 16px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;

    }

    .search {
        overflow: hidden;
        padding: 0.2rem;
        font-size: 0.65rem;
        width: 80%;
        display: flex;
        align-items: center;
    }

    .searhed {
        display: block;
        height: 1.25rem;
        padding: 5px 0.5rem;
        border-radius: 2em;
        flex: 1;
        margin: 0 auto;
        background-color: #eee;
    }

    .searhed input {
        float: left;
        background: transparent;
        color: #856d54;
        font-size: 14px;
        width: calc(100% - 3rem);
    }

    .searhed i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 2px;
        font-size: 14px;

    }

    .searhed i.el-icon-circle-close {
        float: right;
    }

    .send {
        width: 20px;
        position: relative;
        z-index: 1;
        font-size: 0.6rem;
    }

    .send img {
        display: block;
    }

    .send .right-list {
        position: absolute;
        right: -8px;
        top: -0.4em;
        font-size: 12px;
        color: red;
        line-height: 1.4em;
        min-width: 1.4em;
        background: white;
        border-radius: 2rem;
    }



    .mint-header .heade {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mint-header .heade img {
        width: 0.75rem;
        height: 0.75rem;
    }

    .mint-header .heade .tite {
        flex: 1;
        text-align: center;
    }

    .mint-header-button {
        -webkit-box-flex: .12;
        -ms-flex: .12;
        flex: .12;

    }

    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        margin-bottom: 0.4rem;
        border-radius: 0.3rem;
    }

    .list li .shopInfo {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 0.2rem;

    }

    .list li .shopInfo .left {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .list li .shopInfo .left img {
        width: 90%;
        height: 90%;

    }

    .list li .shopInfo .right {
        flex: 1;
        padding-left: 0.3rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .list li .shopInfo .right .a1 {
        line-height: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.65rem;
        font-weight: 500;

    }

    .list li .shopInfo .right .a2 {
        font-size: 0.55rem;
        line-height: 0.8rem;
    }

    .list li .shopInfo .right .lq {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .list li .shopInfo .right .lq .lleft {
        flex: 1;
    }

    .list li .shopInfo .right .lq img {
        width: 0.8rem;
        height: 0.8rem;
    }



  .list li .shopInfo .right .a3 {
  font-size: 0.5rem;
  color: #FF8245;
  display: flex;
  line-height: 0.8rem;
  }

  .list li .shopInfo .right .a3 .b1 {
  background-color: #FFF0EA;
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  margin-right: 0.2rem;

  }
    .list li .shopInfo .right .a4 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
    }

    .list li .shopInfo .right .a4 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;


    }

    .spebtn .mmoo {
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
    }

    .spebtn .mmoo .a4 {
        line-height: 1rem;
        font-size: 0.5rem;
        color: #FF8245;
        display: flex;
        flex: 1;
    }

    .spebtn .mmoo .a4 .yuanjia {
        color: #999;
        text-decoration: line-through;
        margin-left: 0.3rem;


    }

    .spebtn {
        width: 100%;
        max-height: 60vh;
        color: #666;
        font-size: 0.62rem;
        padding: 0.5rem;

    }

    .subItem {
        font-size: 0.8em;
        margin-top: 10px;
    }

    .itemContent ul {
        display: flex;
        flex-wrap: wrap;
    }

    .itemContent ul li {
        width: 30%;
        margin-right: 3%;
        border-radius: 0.4rem;
        margin-top: 0.4rem;
        line-height: 1.5rem;
        height: 1.5rem;
        text-align: center;
    }

    .subItem .itemTitle {
        font-size: 0.65rem;

    }

    .itemLi {
        color: #666;
        background-color: #F5F5F5;
    }

    .selectActive {

        color: #FF4400;
        background-color: #FFF0EA;
    }

    .spebtn .spefoot {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 2rem;

    }

    .spebtn .spefoot .tjspe {
        width: 60%;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
    }

    .spebtn .heade {
        display: flex;
        align-items: center;
        height: 2rem;
        width: 100%;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #f2f2f2;
    }

    .spebtn .heade .name {
        flex: 1;
        font-size: 0.7rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

    }

    .spebtn .heade .close {
        width: 10%;
        font-size: 1.25rem;
        color: #999;
        text-align: center;
    }

</style>
