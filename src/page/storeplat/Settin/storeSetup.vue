<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
        <div class="logotp">
            <div class="uploads" @click="uploadfn($event)">
                <div class="upload-icon">
                    <img :src="logoUrl.url" v-if="logoUrl.url">
                </div>
                <input accept="image/*" type="file" style="display:none">
            </div>
            <div v-show="logoUrl.url">点击更换LOGO</div>
            <div v-show="!logoUrl.url">点击上传LOGO</div>
        </div>
        <div class="cart-main">
            <div class="cart-list">
                <label>店铺名称<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="输入店铺名称" v-model="name" class="a1">

                </p>
            </div>
            <div class="cart-list">
                <label>营业状态<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="选择营业状态" readonly v-model="shopClassName" @click="shopClassfn">
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="cart-list">
                <label>营业时间<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="选择营业时间" v-model="openTime" readonly @click="openTimedata">
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="cart-list">
                <label>联系电话<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="输入联系电话" v-model="mobile" class="a1">
                </p>
            </div>
            <div class="cart-list">
                <label>经营品类<span class="f1">*</span>:</label>
                <p class="lmain">
                    <input type="text" placeholder="经营品类" readonly :data="postdata.category" v-model="categoryName"
                        >
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="cart-list address-list" @click="adressfn">
                <label>店铺地址<span class="f1">*</span>:</label>
                <p class="lmain">
                    <span v-if="!address"
                        style="font-size: 0.58rem; color: #888; flex: 1;text-align: right;padding-right: 0.5rem;">请选择自取地址</span>
                    <label v-else class="diqu">
                        {{address}}
                    </label>
                    <i class="el-icon-arrow-right mr-l-14"></i>
                </p>
            </div>
            <div class="cart-list1">
                <div class="title shop-tip-title">
                    <label>上传店铺照片<span class="f1">*</span>:</label>
                    <div class="shop-tip">至少需上传1张图片</div>
                </div>
                <div class="shop">
                    <template v-if="shopImg.length > 0">
                        <imgUpload text="720x400" v-for="(item,index) in shopImg" :key="index" :img.sync="item"
                            @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
                    </template>
                    <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange"
                        @click.native="shopImgAdd"></imgUpload>
                </div>
            </div>
            <div class="cart-list1">
                <div class="title shop-tip-title">
                    <label>营业资质<span class="f1">*</span>:</label>
                </div>
                <div class="shop">
                    <imgUpload :img.sync="imageUrl.url" @img-upload="facadeChange"></imgUpload>
                </div>
            </div>
            <div class="carttext">
                <div class="title">店铺公告：</div>
                <div class="text"><textarea type="text" placeholder="请输入店铺介绍" v-model="notice"
                        @change="changeLength($event)"></textarea></div>
            </div>

        </div>
        <div class="sub">
            <mt-button @click="subfn" :disabled="disabled">保存</mt-button>
        </div>

        <mt-popup v-model="typeVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="typeslots" value-key="name" @change="typechange"></mt-picker>
        </mt-popup>
        <!-- 店铺类型 -->
        <mt-popup v-model="shopVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="shopquxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="shopquedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="shopslots" value-key="name" @change="shopchange"></mt-picker>
        </mt-popup>
        <!-- 营业时间 -->
        <openTime :visible.sync="openVisible" @openVisible="openVisiblefn" @time-data="openTimefn"></openTime>

    </div>
</template>

<script>
    import regular from '@/assets/js/regular';
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        name: 'shopMessage',
        data() {
            return {
                topnav: {
                    title: '店铺设置'
                },
                id: this.$route.query.id,
                mobile: '',
                name: '',
                categoryName: '',
                address: '',
                remarks: '',
                label: '',
                dialogImageUrl: '',
                dialogVisible: false,
                showusername: true, //必填图标控制
                showsub: true, //控制上传按钮
                areadata: null,
                visible: false,
                typeVisible: false,
                bizLicence: null,
                facadePhoto: null,
                shopImg: [],
                shopImgIndex: null,
                imgUploadStopAdd: false,
                shopImgShow: false,
                postdata: new Object(),
                imageUrl: {},
                logoUrl: {},
                typeslots: [{
                    flex: 1,
                    values: [],
                    textAlign: 'center'
                }],
                categoryId: '',
                inveteCard: '',
                imgUrl: [{
                    url: require("@/assets/images/contract/shangjia.png"),
                    name: '惠盟商家合同协议'
                }],
                showsptime: true,

                shopClassName: null, // 店铺分类
                shopClassId: null,
                shopVisible: false,
                shopslots: [{
                    flex: 1,
                    values: [{
                            id: '0',
                            name: '营业中'
                        },
                        {
                            id: '1',
                            name: '休息中'
                        },
                        {
                            id: '2',
                            name: '已关闭'
                        },
                    ],
                    className: 'slot1',
                    textAlign: 'center'
                }, ],
                openTime: '', //营业时间
                openVisible: false,
                notice: '',
                disabled: false,
                province: '',
                city: '',
                area: '',
            }
        },
        computed: {
            ...mapState(["mapPost"])
        },
        watch: {
            mapPost(val) {
                if (val && val.point) {
                    this.mapadress = val;
                    this.mapadressfn();
                    this.removeMapPost();
                }
            },
        },
        beforeRouteLeave(to, from, next) {
            sessionStorage.removeItem("getpost");
            next();
        },
        mounted() {
            // 类型

            this.getArea();
            // this.getfenlei();
            this.getInfo()
        },

        methods: {
            //获取分类
            getfenlei() {
                axios({
                    url: this.Api1 + '/basic/queryMerCategoryAll',
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        this.navlist = res.data.data;
                        this.typeslots[0].values = res.data.data;
                    }
                })
            },
            // 营业执照上传成功
            facadeChange(val) {
                this.imageUrl = val;
            },
            //logo图上传
            logoChange(val) {
                this.logoUrl = val;
            },
            //获取选取的地址
            getArea() {
                this.areadata = JSON.parse(sessionStorage.getItem('getpost'));
                var that = this
                setTimeout(() => {
                    if (that.areadata != null) {
                        that.address = that.areadata.address;
                        that.tipName = that.areadata.province + '' + that.areadata.city + '' + that.areadata
                            .area;
                        let indexs = this.address.indexOf('县');
                        let indexss = this.address.indexOf('区');

                        if (indexs > -1 || indexss > -1) {} else {
                            that.address = that.tipName + that.address;
                        }
                    }
                }, 500);
            },
            // 提交店铺申请
            subfn() {
                let that = this;
                if (this.shopImg == null) {
                    Toast('请上传店铺图片', 'middle')
                    return false
                }
                if (that.name == null || that.name == '') {
                    Toast('请填写店铺名称', 'middle')
                    return false
                }
                if (that.mobile == null || that.mobile == '') {
                    Toast('请填写店铺联系电话', 'middle')
                    return false
                }
                if (that.categoryId == null || that.categoryId == '') {
                    Toast('请选择店铺分类', 'middle')
                    return false
                }
                if (that.openTime == null || that.openTime == '') {
                    Toast('请选择店铺营业时间', 'middle')
                    return false
                }
                if (that.address == null || that.address == '') {
                    Toast('请选择店铺地址', 'middle')
                    return false
                }
                if (that.logoUrl.url == null || that.logoUrl.url == '') {
                    Toast('请上传店铺logo', 'middle')
                    return false
                }
                if (that.imageUrl.url == null || that.imageUrl.url == '') {
                    Toast('请上营业执照', 'middle')
                    return false
                }
                if (that.shopClassName == null) {
                    Toast('请选择店铺分类', 'middle')
                    return false
                }
                let post = {
                    merchantUrls: this.shopImg,
                    id: this.id,
                    name: that.name,
                    mobile: that.mobile,
                    category: that.categoryId,
                    province: that.province,
                    city: that.city,
                    county: that.area,
                    address: that.address,
                    storeStatus: this.shopClassId,
                    openTime: that.openTime,
                    notice: that.notice,
                    logoUrl: that.logoUrl.url,
                    bizLicence: that.imageUrl.url
                };
                that.disabled = true
                that.restrictedSubmission()
                axios({
                    url: this.Api1 + '/shop/merchant/updateMerchant',
                    data: post,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        Toast('保存成功')
                    } else {
                        Toast(res.data.message)
                    }
                }).catch((err) => {


                })
            },

            adressfn() {
                this.changeMapPost(this.mapadress);
                this.changeMap(this.mapadress);
                this.$router.push({
                    path: '/mapAdress',
                    query: {
                        id: this.id
                    }
                });
            },
            toasfn(msg) {
                Toast({
                    message: msg,
                    position: 'middle',
                    duration: 2000
                });
            },
            //获取信息
            getInfo() {
                var that = this;
                let post = {
                    merchantId: this.id
                };
                axios({
                    url: this.Api1 + '/shop/merchant/selectMerchant',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.shopImg = data.merchantUrls;
                        this.id = data.id;
                        that.name = data.name;
                        that.mobile = data.mobile;
                        that.categoryId = data.category;
                        that.categoryName = data.categoryName;
                        that.province = data.province;
                        that.city = data.city;
                        that.area = data.county;
                        that.address = data.address;
                        this.shopClassId = data.storeStatus;
                        that.openTime = data.openTime;
                        that.notice = data.notice;
                        that.logoUrl.url = data.logoUrl;


                        that.imageUrl.url = data.bizLicence;
                        this.shopClassName = this.shopClassId == 0 ? '营业中' : this.shopClassId == 0 ? '休息中' :
                            '已关闭'
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            // 上传图片
            bizLicencefn(val) {

                this.bizLicence = val.url;
                this.bizLicence ? this.showupload1 = false : this.showupload1 = true;
            },
            facadePhotofn(val) {
                this.facadePhoto = val.url;
                this.facadePhoto ? this.showupload2 = false : this.showupload2 = true;
            },

            shopImgAdd() {
                if (this.shopImg.length >= 8) {
                    Toast('图片限制在8张以内！');
                } else {
                    this.shopImgIndex = this.shopImg.length;
                }
            },
            shopImgfn(i) {
                this.shopImgIndex = i;
            },

            shopImgChange(val) {
                console.log(val);
                
                if (this.shopImgIndex == this.shopImg.length) {
                    this.shopImg.push(val.url)
                    if (this.shopImg.length >= 8) {
                        this.imgUploadStopAdd = true;
                    }
                } else {
                    if (val.url) {
                        this.shopImg[this.shopImgIndex] = val.url;
                    } else {
                        this.shopImg.splice(this.shopImgIndex, 1)
                        if (this.shopImg.length < 8) {
                            this.imgUploadStopAdd = false;
                        }
                    };
                    this.shopImgIndex = null;
                };
            },
            // 商家类型
            categoryfn() {
                this.typeVisible = true;
            },
            typechange(picker, values) {
                this.typeModel = values[0];
            },
            quedingfn() {
                this.typeVisible = false;
                this.categoryName = this.typeModel.name;
                this.categoryId = this.typeModel.id;
                // console.log( this.categoryId);
                this.categoryName ? this.showsptype = false : this.showsptype = true;
                this.postdata.category = this.typeModel.id;
            },
            quxiaofn() {
                this.typeVisible = false;
            },
            timechange(picker, values) {
                this.timeModel = values[0];
            },

            // 企业类型选择
            shopClassfn() {
                this.shopVisible = true;
            },
            shopquxiaofn() {
                this.shopVisible = false;
            },
            shopchange(picker, values) {
                this.shopModel = values[0];
            },
            shopquedingfn() {
                this.shopVisible = false;
                this.shopClassName = this.shopModel.name
                this.shopClassId = this.shopModel.id
            },
            // 营业时间
            openVisiblefn(val) {
                this.openVisible = val;
            },
            openTimefn(val) {
                this.openTime = val;
            },
            openTimedata() {
                this.openVisible = true;
            },
            //判断店铺介绍字数
            changeLength(e) {
                if (this.notice.length >= 59) {
                    this.notice = this.notice.substring(0, 59)
                }

            },
            changeLength2(e) {

                if (this.notice.length >= 15) {
                    this.label = this.label.substring(0, 15)
                }
            },
            //限制多次点击提交按钮
            restrictedSubmission() {
                let mytime = setTimeout(
                    () => {
                        this.disabled = false
                        clearTimeout(mytime);
                    }, 5000)
            },
            mapadressfn() {
                if (this.mapadress.point) {
                    if (!this.areadata) this.areadata = {};
                    if (this.mapadress.province && this.mapadress.province != '') {
                        this.$set(this.areadata, 'prov', {
                            name: this.mapadress.province
                        });
                    };
                    if (this.mapadress.city && this.mapadress.city != '') {
                        this.$set(this.areadata, 'city', {
                            name: this.mapadress.city
                        });
                    };
                    if (this.mapadress.area && this.mapadress.area != '') {
                        this.$set(this.areadata, 'area', {
                            name: this.mapadress.area
                        });
                    };
                    this.address = this.mapadress.address;
                    console.log(this.areadata)
                }
            },
            // 上传图片
            uploadfn(event) {
                var el = event.currentTarget;
                let that = this;
                // Toast('请选择相册后上传图片','middle')
                el.querySelector('input').click();
                el.querySelector('input').onchange = function () {
                    that.ceartupload(this);
                };
            },
            // 上传事件函数
            ceartupload(event) {
                let that = this;
                let cancelToken = axios.CancelToken; //Axios使我修改axios原型链了。
                that.source = cancelToken.source();
                let form = new FormData();
                form.append("file", event.files[0]);
                // 判断上传图片不能大于10mb
                if (event.files[0].size / (1024 * 1024) > 8) {
                    Toast('上传图片太大，请上传8mb以下的图片。')
                    that.closeUpload();
                    return false;
                };
                this.uploadStop = true;
                if (that.zero == false) that.zero = true;
                this.clear = true;
                axios({
                    method: 'post',
                    url: this.Img + 'upload',
                    data: form,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    cancelToken: that.source.token,
                }).then(res => {
                    this.logoUrl = res.data.data;
                    event.value = ''; // 上传完图片清除input值
                }).catch((err) => {
                    console.log(err)
                })
            },
            ...mapMutations(["changeMap", "removeMap", "changeMapPost", "removeMapPost"])
        },
        created() {

        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
        padding-top: 40px;
    }

    .logotp {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        padding: 0.5rem;
        font-size: 0.58rem;
        color: #333;
    }

    .logotp .uploads {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        overflow: hidden;
        background-color: #eee;
        margin: 0.5rem 0;
    }

    .logotp .uploads .upload-icon {
        border: none;
    }

    .logotp .uploads img {
        width: 100%;
        height: 100%;
    }

    .cart-main {
        padding: 0.5rem;
        background-color: #fff;
    }

    .topNav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
    }



    .cart-title {
        padding: 0.3rem 0.5rem;
        background: #ffe9c9;
        color: #ec0746;
        font-size: 0.72rem;
        line-height: 1.4em;
    }



    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 0;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        color: #333;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.2rem;

    }

    .cart-list p.lmain,
    .cart-list div.lmain2 {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem
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
        text-align: right;
        font-size: 0.6rem;
        color: #888;
        word-break: break-all;
    }

    .cart-list input.a1 {

        padding-right: 0.8rem;
    }

    .textarea textarea {
        width: 100%;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .test-textarea-ab {
        color: #999;
    }

    .el-upload--picture-card {
        height: 100px;
        line-height: 100px;
    }

    .sub {
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .sub button {
        text-align: center;
        color: white;
        width: 60%;
        font-size: 0.7rem;
        height: 1.7778rem;
        line-height: 1.6em;
        background: #ff8f28;
        border-radius: 20rem;
    }

    .cart-list i.must {
        font-size: 1rem;
        color: #ec0746;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .cart-list i.must::before {
        content: "*";
        display: block;
        line-height: 0.4em;
        padding-top: 0.45em;
    }

    .upload {
        width: 150px;
        height: 100px;
        overflow: hidden;
        border-radius: 5px;
        margin-left: 10px;
    }

    .upload-icon {
        border: 1px dashed #ccc;
        height: 100%;
        text-align: center;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;

    }

    .upload-icon i {
        font-size: 1.8rem;
        line-height: 1;
        color: #ccc;
    }

    .imgClear {
        position: absolute;
        right: -3px;
        top: -4px;
        font-size: 20px;
        border-radius: 50%;
        background: white;
        color: #ec0746;
        width: 18px;
        height: 18px;
    }


    .provCity label,
    .provCity p.lmain {
        width: auto;
    }

    .mint-popup {
        width: 100%;
    }

    .visiblebtn>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .visiblebtn>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

    .cart-list1 {
        padding: 0.7rem 0;
        font-size: 0.7rem;
        line-height: 1.4em;
        align-items: center;
    }

    .cart-list1 .title {
        display: flex;

    }

    .cart-list1 .title div {
        display: flex;
        align-items: center;
        position: relative;
        padding-right: 1rem;
        color: #999999;
    }

    .cart-list1 i.must {
        font-size: 1rem;
        color: #ec0746;
        position: absolute;
        right: 0;
        top: 4px;
    }

    .cart-list1 i.must::before {
        content: "*";
        line-height: 0.4em;
        padding-top: 0.45em;
    }

    .shop {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .shop {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

    }

    .lmain .uploadbox {
        position: relative;
    }

    .uploadbox>>>.upload {
        height: 100%;
    }

    .shop .uploadbox {
        margin-right: 0.5rem;

        width: 3rem;
        height: 3rem;
        position: relative;
    }

    .shop .upload {
        margin: 0 0 10px 0;
        color: #999999;
        width: 100%;
    }

    .address-list {
        align-items: center;
    }

    .address-list p.lmain {
        align-items: center;
    }

    .cart-list p.lmain .diqu {
        flex: 1;
        text-align: right;
    }

    .mr-l-14 {
        margin-left: .583333rem;
    }

    .black {
        color: #888888;
        font-size: 0.6rem;
    }

    .textarea {
        align-items: center;
    }

    .textarea textarea {
        color: #888888;
    }

    .mainbox>>>.contract {
        background: none;
    }

    .protocol {
        width: 90vw;
        height: 20rem;
        background: #ffffff;
        overflow-y: auto;
        margin: 0 auto;
    }

    .cart-list .tm-label {
        width: 8.5em;
    }

    .carttext {
        font-size: 0.7rem;
        padding: 0.7rem 0 0 0;
    }

    .carttext .title {
        width: 100%;
        display: block;
        padding: 0 0 .291667rem 0;
    }

    .carttext .title span {
        font-size: 9px !important;
    }

    .carttext .text textarea {
        width: 100%;
        height: 50px;
        color: #888888;
    }

    .cart-list p.address-text {
        width: 100%;
        margin: 0;
    }

    .bizLicence>>>.upload {
        height: 160px;
    }

    .ruzhuway {
        font-size: 0.6rem;
    }

    .cart-list1 .shop-tip-title {
        justify-content: space-between;
    }

    .shop-tip {
        font-size: 12px;
    }

</style>
