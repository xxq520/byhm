<template>
    <div class="ChangeCode">
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>

        <div class="telwrap">
            <div class="formwrap2" v-if="!xiuCode">
                <div class="name">
                    <div class="fs">基本信息</div>
                </div>
                <div class="cart-list">
                    <label>商品名称<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="30字以内" v-model="goodsName">
                    </p>
                </div>
                <div class="cart-list">
                    <label>商品分类<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="请选择商品类型" readonly v-model="coutype" @click="typeClassfn">
                        <i class="el-icon-arrow-right "></i>
                    </p>
                </div>
                <div class="cart-list">
                    <label>起购数量:</label>
                    <p class="lmain">
                        <input type="text" placeholder="请输入起购数量" v-model="Purchase" @keyup="rex($event)"
                            @afterpaste="rsx($event)">
                    </p>
                </div>

                <mt-cell title="商品标签" class="line">
                    <div class="items">
                        <el-switch class="switchStyle" v-model="isOpenTag" active-color="#ff9d19" active-text="已开启"
                            on-value="1" inactive-color="#eee" inactive-text="已关闭" off-value="0"
                            @change="changeSwitch1(isOpenTag)">
                        </el-switch>
                    </div>
                </mt-cell>
                <div class="cart-list" v-show="isOpenTag" style="border-top: solid 1px #eee;">
                    <label>标签名称<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="如：热卖" v-model="promotionTag">
                    </p>
                </div>

                <div class="name">
                    <div class="fs">商品规格</div>
                </div>
                <div class="shopcs">
                    <div style="font-size: 0.58rem;">商品规格</div>
                    <div class="duoyu">
                        <div class="fp" @click="tapqie(1)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                                v-show="shopidx==2"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                                v-show="shopidx==1"> 多规格
                        </div>
                        <div class="fp" @click="tapqie(2)"> <img src="@/assets/images/storeplat/by_payment_ics.png"
                                v-show="shopidx==1"> <img src="@/assets/images/storeplat/by_payment_ict.png"
                                v-show="shopidx==2"> 统一规格
                        </div>
                    </div>
                </div>
                <div style="padding: 0.5rem;" v-if="shopidx==1">
                    <div class="rolus" v-if="roluslist.length>0" v-for="(item,idx) in roluslist">
                        <div class="cart-list" style="background-color: #f5f5f5;">
                            <label>规格名称:</label>
                            <p class="lmain">
                                <input type="text" placeholder="请输入规格名称" v-model="item.attrName">
                                <img src="@/assets/images/storeplat/by_page1.png" @click="clearspec(idx)">
                            </p>
                        </div>
                        <div class="cart-list" v-if="item.attrValueList.length>0" v-for="(b,i) in item.attrValueList">
                            <label>规格{{i+1}}:</label>
                            <p class="lmain">
                                <input type="text" placeholder="请输入规格值" v-model="item.attrValueList[i]"
                                    @blur="addrlurs()">
                                <img src="@/assets/images/storeplat/by_page2_ix.png" @click="clearrolus(idx,i)">
                            </p>
                        </div>
                        <div class="add"><span @click="addrolus(idx)">添加规格值</span></div>
                    </div>
                </div>
                <div class="cart" style="justify-content: center;" @click="Addspec()" v-if="shopidx==1">
                    <img src="@/assets/images/storeplat/by_page2_ic.png" style="margin-right: 0.5rem;">
                    <p style="color:#FF4400;">添加新规格</p>
                </div>

                <div class="name">
                    <div class="fs" style="display: flex ;justify-content: space-between;align-items: center;">
                        <p>价格/库存 </p>
                        <p style="color: #ff4400 ;font-size:0.58rem;" @click="Filling">批量填充</p>
                    </div>
                </div>
                <div class="cart-list">
                    <label>销售价<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="商品销售价" v-model="Sellingprice" @keyup="rex2($event)"
                            @afterpaste="rsx2($event)">
                    </p>
                </div>
                <div class="cart-list">
                    <label>市场价<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="市场参考价" v-model="Marketprice" @keyup="rex2($event)"
                            @afterpaste="rsx2($event)">
                    </p>
                </div>
                <div class="cart-list">
                    <label>库存<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="商品库存数量" v-model="shopInvent" @keyup="rex($event)"
                            @afterpaste="rsx($event)">
                    </p>
                </div>
                <div class="cart-list">
                    <label>重量:</label>
                    <p class="lmain">
                        <input type="text" placeholder="商品的重量" v-model="shopWeight" @keyup="rex2($event)"
                            @afterpaste="rsx2($event)">
                    </p>
                </div>

                <div class="More" v-if="shopidx == 1">
                    <div class="ruless" v-for="(m,idx) in zuilist">
                        <div class="rname">规格{{idx+1}}： <span v-for="n in m.skuAttrList">{{n.attrValue}} </span></div>
                        <div class="rval">
                            <input type="text" placeholder="售价" v-model="m.retailPrice" class="abs"
                                @keyup="rex2($event)" @afterpaste="rsx2($event)">
                            <input type="text" placeholder="市场价" v-model="m.marketPrice" class="abs"
                                @keyup="rex2($event)" @afterpaste="rsx2($event)">
                            <input type="text" placeholder="库存" v-model="m.stock" class="abs" @keyup="rex($event)"
                                @afterpaste="rsx($event)">
                            <input type="text" placeholder="重量" v-model="m.weight" class="abs" @keyup="rex2($event)"
                                @afterpaste="rsx2($event)">
                        </div>
                    </div>
                </div>

                <div class="name">
                    <div class="fs" style="display: flex ;justify-content: space-between;align-items: center;">
                        <p>商品图片</p>
                        <p style="color: #999 ;font-size:0.58rem;">至少需上传一张图片</p>
                    </div>
                </div>
                <div class="cart-list1">
                    <div class="shop">
                        <template v-if="shopImg.length > 0">
                            <imgUpload text="720x400" v-for="(item,index) in shopImg" :key="index" :img.sync="item"
                                @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
                        </template>
                        <imgUpload :add="true" text="上传图片" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange"
                            @click.native="shopImgAdd"></imgUpload>
                    </div>
                </div>

            </div>
            <div class="formwrap2" v-if="xiuCode">
                <div class="cart-list" v-if="classList.length>0" v-for="(item,idx) in classList">
                    <label>{{item.name}}:</label>
                    <p class="lmain">
                        <input type="text" placeholder="请输入分类名称" v-model="item.text" readonly>
                        <img src="@/assets/images/storeplat/by_page2_ix.png" @click="closetime(idx)">
                    </p>
                </div>
                <div class="cart" style="justify-content: center;" @click="gotel">
                    <img src="@/assets/images/storeplat/by_page2_ic.png" style="margin-right: 0.5rem;">
                    <p style="color:#FF4400;">添加商品详情</p>
                </div>
            </div>
            <div class="btnwrap" v-if="!xiuCode">
                <div class="btn" type="default" @click="sureChange">下一步</div>
            </div>
            <div class="btnwrap" v-if="xiuCode">
                <div class="btn" type="default" @click="Preservation" v-show="!xgShow">保存</div>
                <div class="btn" type="default" @click="xiugai" v-show="xgShow">修改</div>
            </div>
        </div>
        <div class="bullet" v-if="tapShow">
            <div class="main">
                <div class="heads">新增属性</div>
                <div class="conts">
                    <label>属性名称：</label>
                    <input type="text" placeholder="请输入" v-model="sxname">
                </div>
                <div class="conts">
                    <label>属性说明：</label>
                    <input type="text" placeholder="请输入" v-model="sxvalue">
                </div>
                <div class="foots">
                    <div class="c1" @click="gotel">取消</div>
                    <div class="c2" @click="addtime">确定</div>
                </div>
            </div>
        </div>
        <!-- 优惠券类型 -->
        <mt-popup v-model="typeVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="typequxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="typequedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="typeslorts" value-key="categoryName" @change="typechange"></mt-picker>
        </mt-popup>
    </div>

</template>

<script type="text/javascript">
    export default {
        name: 'ChangeCode',
        data() {
            return {
                topnav: {
                    title: '商品信息'
                },
                userPhone: this.$cookie.get('userPhone'),
                xiuCode: false,
                className: '',
                Sorting: '',
                classList: [],
                sxname: '',
                sxvalue: '',
                tapShow: false,
                goodsName: '',
                actinfo: '',
                restriction: '',
                discount: '',
                coutype: '',
                shopidx: 2,
                typeslorts: [{
                    flex: 1,
                    values: [],
                }],
                typeVisible: false,
                Purchase: '',
                isOpenTag: false,
                promotionTag: '',
                shopWeight: '',
                Sellingprice: '',
                Marketprice: '',
                shopInvent: '',
                shopImg: [],
                shopImgIndex: null,
                imgUploadStopAdd: false,
                shopImgShow: false,
                roluslist: [],
                merId: this.$cookie.get('merId'),
                categoryId: '',
                goodSn: this.$route.query.goodSn,
                xgShow: false,
                skuList: [],
                skuArray: [],
                skuName: [],
                zuilist: [],

            }
        },
        mounted() {
            this.loadMores()
            if (this.goodSn) {
                this.getInfo();
                this.xgShow = true;
            }
        },
        methods: {
            // 正则限制输入
            rex(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, '')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }

            },
            rsx(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^1-9]/g, '0')
                } else {
                    e.target.value = e.target.value.replace(/\D/g, '')
                }
            },
            rex2(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^\d.]/g, '')

                } else {
                    e.target.value = e.target.value.replace(/[^\d.]/g, '')

                }

            },
            rsx2(e) {
                if (e.target.value.length == 1) {
                    e.target.value = e.target.value.replace(/[^\d.]/g, '')
                } else {
                    e.target.value = e.target.value.replace(/[^\d.]/g, '')
                }
            },

            //批量填充
            Filling() {
                var that = this;
                if (that.Marketprice == null || that.Marketprice == '') {
                    Toast('请填写商品市场价')
                    return false
                }
                if (this.Sellingprice == null || this.Sellingprice == '') {
                    Toast('请填写商品销售价')
                    return false
                }
                if (that.shopInvent == null || that.shopInvent == '') {
                    Toast('请选填写商品库存')
                    return false
                }
                if (this.shopWeight == null || this.shopWeight == '') {
                    this.shopWeight = 0;
                }

                for (let i = 0; i < this.zuilist.length; i++) {
                    this.zuilist[i].retailPrice = this.Sellingprice;
                    this.zuilist[i].marketPrice = this.Marketprice;
                    this.zuilist[i].stock = this.shopInvent;
                    this.zuilist[i].weight = this.shopWeight;
                }
                this.$forceUpdate();


            },
            //多规格数据处理
            addrlurs() {
                // 先清空数据，保证连续点击按钮，数据不会重复
                this.skuArray = [];
                this.skuName = [];
                this.skuList = [];

                // 将选中的规格组合成一个大数组 [[1, 2], [a, b]...]
                this.roluslist.forEach(element => {
                    element.attrValueList.length > 0 ? this.skuArray.push(element.attrValueList) : '';
                    this.skuName.push(element.attrName)
                })
                // 勾选了规格，才调用方法

                if (this.skuArray.length > 0) {
                    this.getSkuData([], 0, this.skuArray)
                }
            },
            // 递归获取每条SKU数据
            getSkuData(skuArr = [], i, list) {

                for (let j = 0; j < list[i].length; j++) {
                    if (i < list.length - 1) {
                        skuArr[i] = list[i][j]
                        this.getSkuData(skuArr, i + 1, list) // 递归循环  
                    } else {
                        this.skuList.push({
                            name: [...skuArr,
                                list[i][j]
                            ]
                        }) // 扩展运算符，连接两个数组 
                    }
                }
                this.zuilist = [];

                for (let d = 0; d < this.skuList.length; d++) {
                    this.zuilist.push({
                        skuAttrList: []
                    })
                    for (let e = 0; e < this.skuList[d].name.length; e++) {
                        this.zuilist[d].skuAttrList.push({
                            attrName: this.skuName[e],
                            attrValue: this.skuList[d].name[e]
                        })
                    }
                }

            },

            //获取信息
            getInfo() {
                var that = this;
                let post = {
                    goodsSn: this.goodSn
                };
                axios({
                    url: this.Api1 + '/goods/queryGoodsDetail',
                    params: post,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.goodsName = data.goodsName;
                        this.categoryId = data.categoryId;
                        this.coutype = data.categoryName;
                        this.isOpenTag = data.isOpenTag == 0 ? false : true;

                        this.promotionTag = data.promotionTag;
                        this.Purchase = data.purchaseQuantity;
                        this.shopidx = data.specificationType;
                        this.Marketprice = data.skuList[0].marketPrice;
                        this.Sellingprice = data.skuList[0].retailPrice;
                        this.shopInvent = data.skuList[0].stock;
                        this.shopWeight = data.skuList[0].weight;
                        this.roluslist = data.selectedSaleAttrList;
                        this.shopImg = data.goodsImages;
                        this.classList = data.goodsDetails;
                        this.zuilist = data.skuList;

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取分类id
            loadMores() {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/category/queryAll",
                    data: {
                        merId: this.merId,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.typeslorts[0].values = data;
                    }
                })
            },
            //添加规格值
            addrolus(idx) {

                this.roluslist[idx].attrValueList.push('')

            },
            //删除规格值
            clearrolus(idx, i) {
                this.roluslist[idx].attrValueList.splice(i, 1)
                this.addrlurs();

            },
            //添加规格
            Addspec() {
                for (let k = 0; k < this.roluslist.length; k++) {
                    if (this.roluslist[k].attrName == '') {
                        Toast('请先填写完整添加的规格');
                        return;
                    }
                    if (this.roluslist[k].attrValueList.length == 0) {
                        Toast('请先填写完整添加的规格值');
                        return;
                    }
                }
                this.roluslist.push({
                    attrName: '',
                    attrValueList: []
                })
            },
            //删除规格
            clearspec(idx) {
                if (this.roluslist.length > 1) {
                    this.roluslist.splice(idx, 1);
                    this.addrlurs();
                } else {
                    Toast('多规格商品最少填写一个规格')
                }

            },
            changeSwitch1(data) {
                console.log(data)
            },
            //商品类型
            typeClassfn() {
                this.typeVisible = true;
            },
            typequxiaofn() {
                this.typeVisible = false;
            },
            typechange(picker, values) {
                this.typeModel = values[0];
            },
            typequedingfn() {
                this.typeVisible = false;
                this.coutype = this.typeModel.categoryName;
                this.categoryId = this.typeModel.categoryId;
            },
            //选择规格
            tapqie(val) {
                this.shopidx = val;
                this.skuList = [{
                    marketPrice: this.Marketprice,
                    retailPrice: this.Sellingprice,
                    stock: this.shopInvent,
                    weight: this.shopWeight,
                }];
                this.roluslist = [];
                this.skuArray = [];
                this.skuName = [];
                this.skuList = [];
                this.zuilist = [];
                this.addrlurs();
            },
            //添加属性
            addtime() {
                if (this.sxname == '' || this.sxvalue == '') {
                    Toast("请输入属性名称，与属性说明")
                    return;
                }
                this.classList.push({
                    name: this.sxname,
                    text: this.sxvalue
                })
                this.tapShow = false;
                this.sxname = '';
                this.sxvalue = '';
            },
            //添加
            gotel() {

                this.tapShow = !this.tapShow;
            },
            //删除时间段
            closetime(idx) {
                this.classList.splice(idx, 1)
            },
            //返回
            goback() {
                if (this.xiuCode) {
                    this.xiuCode = false;
                    this.topnav.title = "商品信息"
                } else {
                    if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                        window.action.backAPP();
                    } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                        window.action.backAPPiOS()
                    } else {
                        this.$router.go(-1)
                    }
                }

            },
            //下一步
            sureChange() {
                var that = this
                if (that.goodsName == null || that.goodsName == '') {
                    Toast('请选填写商品名称')
                    return false
                }
                if (this.coutype == null || this.coutype == '') {
                    Toast('请选择商品类型类型')
                    return false
                }
                if (this.Purchase == null || this.Purchase == '') {
                    Toast('请填写商品起购数量')
                    return false
                }
                if (this.isOpenTag) {
                    if (this.promotionTag == null || this.promotionTag == '') {
                        Toast('请填写标签')
                        return false
                    }
                }
                if (that.Marketprice == null || that.Marketprice == '') {
                    Toast('请填写商品市场价')
                    return false
                }
                if (this.Sellingprice == null || this.Sellingprice == '') {
                    Toast('请填写商品销售价')
                    return false
                }
                if (that.shopInvent == null || that.shopInvent == '') {
                    Toast('请选填写商品库存')
                    return false
                }
                if (this.shopWeight == null || this.shopWeight == '') {
                    this.shopWeight = 0;
                }
                if (this.shopImg.length == 0) {
                    Toast('请至少上传一张商品图片')
                    return false
                }
                if (this.shopidx == 1) {
                    if (this.roluslist.length == 0) {
                        Toast('请添加商品规格')
                        return false
                    } else {
                        for (let i = 0; i < this.roluslist.length; i++) {
                            if (this.roluslist[i].attrName == null ||
                                this.roluslist[i].attrName == '') {
                                Toast('请填写商品规格');
                                 return false
                            }
                            if (this.roluslist[i].attrValueList.length == 0) {
                                Toast('请填写商品规格值');
                                 return false
                            }
                        }
                    }
                    for (let i = 0; i < this.zuilist.length; i++) {
                        if (this.zuilist[i].retailPrice == null ||
                            this.zuilist[i].retailPrice == '') {
                            Toast('请填写商品规格对应的销售价，可使用批量填充批量添加');
                            return false
                        }
                        if (this.zuilist[i].marketPrice == null || this.zuilist[i].marketPrice == '') {
                            Toast('请填写商品规格对应的市场价，可使用批量填充批量添加');
                            return false
                        }
                        if (this.zuilist[i].stock == null ||
                            this.zuilist[i].stock == '') {
                            Toast('请填写商品规格对应的库存，可使用批量填充批量添加');
                            return false
                        }
                    }
                }

                this.xiuCode = true;
                this.topnav.title = "商品详情"
            },
            //保存
            Preservation() {
                var that = this
 
                if (this.shopidx == 1) {
                    let post = {
                        merId: this.merId,
                        goodsName: this.goodsName,
                        categoryId: this.categoryId,
                        isOpenTag: Number(this.isOpenTag),
                        promotionTag: this.promotionTag,
                        purchaseQuantity: this.Purchase,
                        specificationType: this.shopidx,
                        skuList: this.zuilist,
                        selectedSaleAttrList: this.roluslist,
                        goodsImages: this.shopImg,
                        goodsDetails: this.classList
                    };
                    axios({
                        url: this.Api1 + '/goods/insert',
                        data: post,
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('添加成功')
                            this.$router.go(-1)
                        } else {
                            Toast(res.data.message)
                        }
                    })
                } else {
                    let post = {
                        merId: this.merId,
                        goodsName: this.goodsName,
                        categoryId: this.categoryId,
                        isOpenTag: Number(this.isOpenTag),
                        promotionTag: this.promotionTag,
                        purchaseQuantity: this.Purchase,
                        specificationType: this.shopidx,
                        skuList: [{
                            marketPrice: this.Marketprice,
                            retailPrice: this.Sellingprice,
                            stock: this.shopInvent,
                            weight: this.shopWeight,
                        }],
                        selectedSaleAttrList: this.roluslist,
                        goodsImages: this.shopImg,
                        goodsDetails: this.classList
                    };
                    axios({
                        url: this.Api1 + '/goods/insert',
                        data: post,
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('添加成功')
                            this.$router.go(-1)
                        } else {
                            Toast(res.data.message)
                        }
                    })
                }

            },
            //修改商品信息
            xiugai() {
                var that = this
                if (that.goodsName == null || that.goodsName === '') {
                    Toast('请选填写商品名称')
                    return false
                }
                if (this.coutype == null || this.coutype === '') {
                    Toast('请选择商品类型类型')
                    return false
                }


                if (this.Purchase == null || this.Purchase === '') {
                    Toast('请填写商品起购数量')
                    return false
                }
                if (this.isOpenTag) {
                    if (this.promotionTag == null || this.promotionTag === '') {
                        Toast('请填写标签')
                        return false
                    }
                }
                if (that.Marketprice == null || that.Marketprice === '') {
                    Toast('请填写商品市场价')
                    return false
                }
                if (this.Sellingprice == null || this.Sellingprice === '') {
                    Toast('请填写商品销售价')
                    return false
                }
                if (that.shopInvent == null || that.shopInvent === '') {
                    Toast('请选填写商品库存')
                    return false
                }
                if (this.shopWeight == null || this.shopWeight === '') {
                    this.shopWeight = 0;
                }
                if (this.shopImg.length == 0) {
                    Toast('请至少上传一张商品图片')
                    return false
                }
                if (this.shopidx == 1) {
                    if (this.roluslist.length == 0) {
                        Toast('请添加商品规格')
                        return false
                    } else {
                        for (let i = 0; i < this.roluslist.length; i++) {
                            if (this.roluslist[i].attrName == null ||
                                this.roluslist[i].attrName == '') {
                                Toast('请填写商品规格');
                                return false
                            }
                            if (this.roluslist[i].attrValueList.length == 0) {
                                Toast('请填写商品规格值');
                                return false
                            }
                        }
                    }
                    for (let i = 0; i < this.zuilist.length; i++) {
                        if (this.zuilist[i].retailPrice == null || this.zuilist[i].retailPrice == '') {
                            Toast('请填写商品规格对应的销售价，可使用批量填充批量添加');
                            return false
                        }
                        if (this.zuilist[i].marketPrice == null || this.zuilist[i].marketPrice == '') {
                            Toast('请填写商品规格对应的市场价，可使用批量填充批量添加');
                            return false
                        }
                        if (this.zuilist[i].stock == null || this.zuilist[i].stock == '') {
                            Toast('请填写商品规格对应的库存，可使用批量填充批量添加');
                            return false
                        }
                    }
                }
                if (this.shopidx == 1) {
                    let post = {
                        merId: this.merId,
                        goodsSn: this.goodSn,
                        goodsName: this.goodsName,
                        categoryId: this.categoryId,
                        isOpenTag: Number(this.isOpenTag),
                        promotionTag: this.promotionTag,
                        purchaseQuantity: this.Purchase,
                        specificationType: this.shopidx,
                        skuList: this.zuilist,
                        selectedSaleAttrList: this.roluslist,
                        goodsImages: this.shopImg,
                        goodsDetails: this.classList
                    };

                    axios({
                        url: this.Api1 + '/goods/update',
                        data: post,
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('修改成功')
                            this.$router.go(-1)
                        } else {
                            Toast(res.data.message)
                        }
                    })
                } else {
                    let post = {
                        merId: this.merId,
                        goodsSn: this.goodSn,
                        goodsName: this.goodsName,
                        categoryId: this.categoryId,
                        isOpenTag: Number(this.isOpenTag),
                        promotionTag: this.promotionTag,
                        purchaseQuantity: this.Purchase,
                        specificationType: this.shopidx,
                        skuList: [{
                            marketPrice: this.Marketprice,
                            retailPrice: this.Sellingprice,
                            stock: this.shopInvent,
                            weight: this.shopWeight,
                        }],
                        selectedSaleAttrList: this.roluslist,
                        goodsImages: this.shopImg,
                        goodsDetails: this.classList
                    };


                    axios({
                        url: this.Api1 + '/goods/update',
                        data: post,
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get("token")
                        },
                    }).then(res => {
                        if (res.data.code == 200) {
                            Toast('修改成功')
                            this.$router.go(-1)
                        } else {
                            Toast(res.data.message)
                        }
                    })
                }
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


        },
        created() {

        }
    }

</script>

<style scoped>
    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        min-height: 100vh;
        padding-top: 40px;
        padding-bottom: 3.5rem;
        position: relative;
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
        z-index: 99;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 0.62rem;
        text-align: center;
        text-indent: -2em;
    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .telwrap .btn {
        width: 9rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .telwrap .btn img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.2rem;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem;

    }

    .cart-list .lmain img {
        width: 0.8rem;
        height: 0.8rem;
        margin-left: 0.5rem;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

    .cart {
        display: flex;
        display: flex;
        height: 2rem;
        background-color: #fff;
        justify-content: space-between;
        align-items: center;
        font-size: 0.62rem;
        padding: 0 0.5rem;
        border-bottom: 1px solid #eee;
    }

    .cart .dijian {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .cart .dijian .c1 {
        width: 3rem;
        margin: 0 0.5rem;
    }

    .cart img {
        width: 0.75rem;
        height: 0.75rem;
    }

    .bullet {
        width: 100%;
        height: 100%;
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #333;
    }

    .bullet .main {
        width: 76%;
        background-color: #fff;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 0.58rem;
    }

    .bullet .main .heads {
        line-height: 1.4rem;
        text-align: center;
        border-bottom: 1px solid #f5f5f5;
    }

    .bullet .main .conts {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 2rem;
    }

    .bullet .main .foots {
        display: flex;
        line-height: 1.5rem;
        font-size: 0.65rem;
        border-top: 1px solid #eee;

    }

    .bullet .main .foots .c1 {
        width: 49%;
        border-right: 1px solid #eee;
        text-align: center;
    }

    .bullet .main .foots .c2 {
        flex: 1;
        text-align: center;
        color: #ff9d19;
    }


    .name {
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;
        border-bottom: 1px solid #eee;


    }

    .name .fs {
        padding-left: 0.5rem;
        position: relative;
    }

    .name .fs::before {
        content: '';
        width: 3px;
        height: 16px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.8rem;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }


    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.1rem;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem;

    }

    .cart-list .lmain .a2 {
        width: 3.5rem;
        text-align: center;
    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

    .shopcs {
        height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
    }

    .shopcs .duoyu {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;

    }

    .shopcs .fs {
        padding-left: 0.5rem;
        position: relative;
    }

    .shopcs .fs::before {
        content: '';
        width: 3px;
        height: 16px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.1rem;
    }

    .shopcs .fp {
        font-size: 0.55rem;
        color: #999;
        height: 1.5rem;
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .shopcs .fp img {
        width: 0.65rem;
        height: 0.65rem;
        margin-right: 0.3rem;
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

    .settings>>>.picker-items {
        width: 100%;

    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

    .formwrap2>>>.switchStyle .el-switch__label {
        position: absolute;
        display: none;
        color: #fff;
    }

    .formwrap2>>>.switchStyle .el-switch__label--left {
        z-index: 9;
        left: 1rem;
    }

    .formwrap2>>>.switchStyle .el-switch__label--right {
        z-index: 9;
        left: -0.1rem;
    }

    .formwrap2>>>.switchStyle .el-switch__label.is-active {
        display: block;
        line-height: 1.2rem !important;
        height: 1.2rem;

    }

    .formwrap2>>>.switchStyle.el-switch .el-switch__core,
    .formwrap2>>>.el-switch .el-switch__label {
        width: 3.1rem !important;
        height: 1.2rem !important;
    }

    .formwrap2>>>.el-switch__core:after {
        top: .22rem;

    }

    .formwrap2>>>.el-switch__core {
        border-radius: 0.6rem;
    }

    .formwrap2>>>.el-switch__label * {
        font-size: 0.5rem;
    }

    .formwrap2>>>.el-switch__core:after {
        width: 0.7rem;
        height: 0.7rem;
    }

    .formwrap2>>>.mint-cell-title {
        font-size: 0.58rem;
    }

    .cart-list1 {
        background-color: #fff;
        font-size: 0.62rem;
        line-height: 1.4em;
        align-items: center;
        padding: 0.5rem;
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

    .rolus .add {
        height: 2rem;
        line-height: 2rem;
        color: #ff4400;
        background-color: #fff;
        font-size: 0.62rem;
        padding: 0 0.5rem;
    }

    .More {
        margin: 0.5rem 0;
        background-color: #fff;
        padding: 0.5rem;
        font-size: 0.55rem;
        color: #333;
    }

    .More .ruless {
        border-bottom: 1px solid #eee;
        padding: 0.3rem 0;
    }

    .More .ruless:last-child {
        border: none;
    }

    .More .ruless .rname {
        line-height: 1rem;
    }

    .More .ruless .rval {
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top: 0.3rem;

    }

    .More .ruless .rval .abs {
        border-radius: 0.3rem;
        height: 1.375rem;
        width: 3rem;
        text-align: center;
        background-color: #f5f5f5;
    }

    .ChangeCode>>>.uploadbox img {
        width: 3rem !important;
        height: 3rem !important;
    }

</style>
