<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>

        <div class="cart-main">
            <div class="cart-item">
                <div class="cart-box">
                    <div class="cart-list" v-if="xiuShow" @click="adressfn">
                        <label>所在位置:</label>
                        <p class="lmain">
                            <input type="text" v-model="tipName" placeholder="请输入详细地址">
                        </p>
                    </div>
                    <div class="cart-list address-list" @click="adressfn" v-else>
                        <label>所属在位置:</label>
                        <p class="lmain">
                            <img src="@/assets/images/by_home_icon_dw.png">
                            <span v-if="!areadata" class="black">点击选择</span>
                            <label v-else class="diqu">
                                <span>{{ areadata.province }}</span>
                                <span>{{ areadata.city}}</span>
                                <span>{{ areadata.area}}</span>
                            </label>
                            <i class="el-icon-arrow-right mr-l-14"></i>
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>详细地址:</label>
                        <p class="lmain">
                            <input type="text" v-model="address" placeholder="请输入详细地址">
                        </p>
                    </div>
                    <div class="cart-list">
                        <label>联系人:</label>
                        <p class="lmain">
                            <input type="text" v-model="spname" placeholder="请填写收货人姓名">
                        </p>
                    </div>
                    <div class="cart-list ">
                        <mt-radio title="" v-model="value" :options="['先生', '女士']">
                        </mt-radio>
                    </div>
                    <div class="cart-list">
                        <label>手机号:</label>
                        <p class="lmain">
                            <input type="text" v-model="spphone" placeholder="请填写收货人手机号码">
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="sub" v-if="xiuShow">
            <mt-button @click="xiufn">修改地址</mt-button>
        </div>
        <div class="sub" v-else>
            <mt-button @click="subfn">新增地址</mt-button>
        </div>
    </div>
</template>

<script>
    import regular from '@/assets/js/regular';
    export default {
        name: 'shopMessage',
        data() {
            return {
                topnav: {
                    title: '新增收货地址'
                },
                spname: '',
                address: '',
                spphone: '',
                areadata: {},
                lnglat: null,
                value: '',
                userPhone: this.$cookie.get('userPhone'),
                tipName: '',
                xiuid: this.$route.query.id,
                xiuShow: false,
                xiulist: [],
                province: '',
                area: '',
                city: ''

            }
        },
        created() {

        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.removeItem("getpost");
            next();
        },
        mounted() {

            if (this.xiuid) {
                this.topnav.title = "修改收货地址";
                this.xiuShow = true;
                this.getInfo()
            }
            var that = this
            this.areadata = JSON.parse(sessionStorage.getItem('getpost'));
            setTimeout(() => {
                if (that.areadata != null) {
                    that.address = that.areadata.address;
                    that.tipName = that.areadata.province + '' + that.areadata.city + '' + that.areadata.area;
                    that.tipAddress = that.tipName + '' + that.address;
                    that.province = that.areadata.province;
                    that.city = that.areadata.city;
                    that.area = that.areadata.area;
                }
            }, 1000);


        },

        methods: {

            subfn() {
                var that = this;
                let expPhone = regular.RegPhone;
                if (that.areadata == null) {
                    Toast('请选择收货地址', 'middle')
                    return false
                } else if (that.address == '') {
                    Toast('请输入详细地址', 'middle')
                    return false
                } else if (that.spphone == '') {
                    Toast('收货人手机号不能为空', 'middle')
                    return false
                } else if (that.spname == '') {
                    Toast('收货人姓名不能为空', 'middle')
                    return false
                } else if (that.spname == '') {
                    Toast('店铺名不能为空', 'middle')
                    return false
                } else if (that.value == '') {
                    Toast('请选择收货人性别', 'middle')
                    return false
                } else if (!(expPhone.test(that.spphone))) {
                    Toast('输入的手机号码格式错误！');
                    return false;
                };
                let indexs1 = this.address.indexOf('县');
                let indexs2 = this.address.indexOf('区');
                if (indexs1 > -1) {
                    this.address = this.address.substring(indexs1 + 1)
                }
                if (indexs2 > -1) {
                    this.address = this.address.substring(indexs2 + 1)
                }
                let post = {
                    userName: this.spname,
                    shippingSex: this.value,
                    telNumber: this.spphone,
                    detailInfo: this.address,
                    cityName: this.areadata.city,
                    countyName: this.areadata.area,
                    provinceName: this.areadata.province
                }
                axios({
                    url: this.Api1 + '/user/shippingAddress/save',
                    data: post,
                    method: "post",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    var that = this
                    if (res.data.code == 200) {
                        let data = res.data.data

                        Toast('保存成功', 'middle')
                        setTimeout(() => {
                            that.$router.go(-1)
                        }, 1500);

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //修改地址
            xiufn() {
                var that = this;
                let expPhone = regular.RegPhone;
                if (that.tipName == null) {
                    Toast('请输入收货地址', 'middle')
                    return false
                } else if (that.address == '') {
                    Toast('请输入详细地址', 'middle')
                    return false
                } else if (that.spphone == '') {
                    Toast('收货人手机号不能为空', 'middle')
                    return false
                } else if (that.spname == '') {
                    Toast('收货人姓名不能为空', 'middle')
                    return false
                } else if (that.spname == '') {
                    Toast('店铺名不能为空', 'middle')
                    return false
                } else if (that.value == '') {
                    Toast('请选择收货人性别', 'middle')
                    return false
                } else if (!(expPhone.test(that.spphone))) {
                    Toast('输入的手机号码格式错误！');
                    return false;
                };
                let indexs3 = this.address.indexOf('县');
                let indexs4 = this.address.indexOf('区');
                if (indexs3 > -1) {
                    this.address = this.address.substring(indexs3 + 1)
                }
                if (indexs4 > -1) {
                    this.address = this.address.substring(indexs4 + 1)
                }
                console.log(this.areadata);

                let post = {
                    shippingAddressId: this.xiuid,
                    userName: this.spname,
                    shippingSex: this.value,
                    telNumber: this.spphone,
                    detailInfo: this.address,
                    cityName: this.city,
                    countyName: this.area,
                    provinceName: this.province
                }
                axios({
                    url: this.Api1 + '/user/shippingAddress/edit',
                    data: post,
                    method: "post",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    var that = this

                    if (res.data.code == 200) {
                        let data = res.data.data

                        Toast('修改成功', 'middle')
                        setTimeout(() => {
                            that.$router.go(-1)
                        }, 1000);

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取修改地址的信息
            getInfo() {
                let post = {
                    shippingAddressId: this.xiuid,
                }
                axios({
                    method: "get",
                    url: this.Api1 + '/user/shippingAddress/query',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                    params: post
                }).then(res => {
                    if (res.data.code == 200) {
                        
                        let data = res.data.data;
                        this.spname = data.userName;
                        this.value = data.shippingSex;
                        this.spphone = data.telNumber;
                        this.address = data.detailInfo;
                        this.city = data.cityName;
                        this.area = data.countyName;
                        this.province = data.provinceName;
                        this.tipName = data.provinceName + data.cityName + data.countyName;
               
                    }
                })
            },

            adressfn() {
                this.$router.push({
                    path: '/mapAdress',
                    query: {
                        id: this.id
                    }
                });
            },
        },
    }

</script>

<style scoped>
    .cart-main {
        padding: 0.5rem;
    }

    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #fff;
    }

    .topNav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
    }

    .cart-item {
        overflow: hidden;
        background: white;
        border-radius: 0.4rem;
        margin-bottom: 0.5rem;
        margin-top: 1.5rem;
    }


    .cart-item .cart-box {
        padding: 0 0.5rem;
    }

    .mint-radiolist {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .cart-item .cart-box .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 0;
        font-size: 0.7rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-item .cart-box .cart-list:last-child {
        border-bottom: none;
    }

    .cart-item .cart-box .cart-list label {
        float: left;
        width: 7.5em;
        font-size: 0.55rem;
        color: #333;
    }

    .cart-item .cart-box .cart-list p.lmain,
    .cart-item .cart-box .cart-list div.lmain2 {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem
    }

    .cart-item .cart-box .cart-list p.lmain img {
        width: 0.4rem;
        height: 0.5rem;
    }

    .cart-item .cart-box .cart-list p.adress span {
        display: block;
        flex: 1;
        height: 1.4em;
        word-break: break-all;
    }

    .cart-item .cart-box .cart-list p.adress i {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .cart-item .cart-box .cart-list input {
        display: block;
        flex: 1;
        font-size: 0.6rem;
        color: #333;
        word-break: break-all;
    }


    .test-textarea-ab {
        color: #999;
    }

    .cart-item>>>.el-upload--picture-card {
        height: 100px;
        line-height: 100px;
    }

    .cart-item .cart-box .address-list .diqu {
        width: 10em;
        color: #666666;
        font-size: 0.6rem;
    }

    .sub {
        width: 70%;
        height: 1.5rem;
        margin: 1.5rem auto;
    }

    .sub button {
        text-align: center;
        color: white;
        width: 100%;
        font-size: 0.6rem;
        height: 1.5rem;
        line-height: 1.5em;
        background: #FF9003;
        border-radius: 20rem;
    }

    .black {
        color: #666666;
        font-size: 0.6rem;
    }

    .carttext .title span {
        font-size: 9px !important;
    }

    .mainbox>>>.mint-radio-input:checked+.mint-radio-core {
        background-color: #ff9d19;
        border-color: #ff9d19;
    }

</style>
