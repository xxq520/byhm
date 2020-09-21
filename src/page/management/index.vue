<template>
    <div class="mainbox" v-cloak>
        <topnav :topnav="topnav"></topnav>
        <div class="shopmain">
            <div class="shopxinx">
                <div class="headimg"><img :src="facadePhoto"></div>
                <div class="shoptext">
                    <div class="shopname">{{ postdata.name }}</div>
                    <div class="shopxx">
                        <p>店铺类型: {{ categoryName }}</p>
                        <p>店铺地址: {{ addressfn([postdata.province, postdata.city, postdata.county, postdata.address]) }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="shopbtns">
                <div class="sbtitle">店铺管理</div>
                <div class="btnbox" v-if="showbtnbox">

                    <router-link :to="postdata.id?'/management/shopMessage/shopMessage?id='+postdata.id:''"
                        class="btnlist">
                        <span :style="{backgroundImage:'url('+imgIcons.xx+')'}"></span>
                        <p>店铺信息</p>
                    </router-link>
                    <div class="btnlist" @click="goToPreview">
                        <span :style="{backgroundImage:'url('+imgIcons.sp+')'}"></span>
                        <p>店铺预览</p>
                    </div>
                    <div @click="goToOffer" class="btnlist">
                        <span :style="{backgroundImage:'url('+imgIcons.yh+')'}"></span>
                        <p>店铺优惠</p>
                    </div>
                    <div @click="gotoCommentList" class="btnlist">
                        <span :style="{backgroundImage:'url('+imgIcons.pl+')'}"></span>
                        <p>店铺评论</p>
                    </div>

                    <div  @click="goToIncome" class="btnlist">
                        <span :style="{backgroundImage:'url('+imgIcons.mx+')'}"></span>
                        <p>收入明细</p>
                    </div>

                    <div @click="goToCx" class="btnlist" v-if="levelId == 2 || levelId==3 || levelId==4 || levelId==5">
                        <span :style="{backgroundImage:'url('+imgIcons.cx+')'}"></span>
                        <p>店铺查询</p>
                    </div>

                    <div v-if="backshqPd && false" class="btnlist" @click="sweepCode">
                        <span :style="{backgroundImage:'url('+imgIcons.sc+')'}"></span>
                        <p>扫一扫</p>
                    </div>
                    <div @click="goshop" class="btnlist" v-show="isShqShow=='true'">
                        <span :style="{backgroundImage:'url('+imgIcons.sg+')'}"></span>
                        <p>商品管理</p>
                    </div>
                    <div @click="goshopOrder" class="btnlist" v-show="isShqShow=='true'">
                        <span :style="{backgroundImage:'url('+imgIcons.dd+')'}"></span>
                        <p>订单管理</p>
                    </div>
                    <div @click="gopfw" class="btnlist" v-if="pfshow">
                        <span :style="{backgroundImage:'url('+imgIcons.pf+')'}"></span>
                        <p>520批发网</p>
                    </div>

                </div>
                <div class="pop-ups-tip" v-else>
                    <div class="tip">
                        <p>{{popTip}}</p>
                        <div class="hidde-tip" @click="goback">返回<span></span></div>
                    </div>
                </div>
            </div>
        </div>
        <bottomnav :carcount="carcount"></bottomnav>
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '商家管理',
                    back: false
                },
                carcount: '商家入驻',
                levelId: this.$cookie.get("level_id"),
                // icons图片
                imgIcons: {
                    xx: require('../../assets/images/dianpuxinxi.png'),
                    sp: require('../../assets/images/dianpushangpin.png'),
                    yh: require('../../assets/images/dianpuyouhui.png'),
                    pl: require('../../assets/images/dianpupinglun.png'),
                    dd: require('../../assets/images/dianpudingdan.png'),
                    mx: require('../../assets/images/profitDetail.png'),
                    sc: require('../../assets/images/scan.png'),
                    cx: require('../../assets/images/sjgl_icon_inquire.png'),
                    pf: require('../../assets/images/sjgl_icon_520pfw.png'),
                    sg: require('../../assets/images/sjgl_icon_manage.png'),
                    dd: require('../../assets/images/sjgl_icon_dd@2x.png')
                },
                postdata: {},
                categoryName: '',
                pfshow: false,
                type: 0,
                seq: this.$cookie.get('seq'),
                facadePhoto: '',
                backshqPd: sessionStorage.getItem('applogin'), // app登录判断
                showbtnbox: true,
                popTip: "抱歉，您的店铺申请还在审核中，此功能不能操作，我们将尽快为您审核，请耐心等候。谢谢！",
                isShqShow: false,
                userPhone: this.$cookie.get("userPhone"),

            }
        },
        mounted() {

            this.isShqShow = this.$cookie.get("isBHShop");
            this.type = this.$cookie.get('vip_type');
            if (this.type == 6) {
                Indicator.open();
                axios({
                    url: this.Api + 'merchant/info',
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    console.log(res)
                    Indicator.close();
                    let data = res.data.data;

                    this.postdata = data.merchant;
                    // this.facadePhoto = data.qualification.facadePhoto?data.qualification.facadePhoto:'';
                    this.facadePhoto = data.merchant.facadePhoto ? data.merchant.facadePhoto : '';
                    //判断是审核不通过
                    if (this.postdata.status == 2) {
                        this.popTip = '抱歉，您的店铺审核不通过，请点击"店铺信息"查看原因，谢谢！'
                    }
                    // 类型
                    axios({
                        url: this.Api + '/merchant/categoryList',
                        method: "post",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    }).then(res => {
                        let data = res.data.categoryEntities;
                        data.forEach((post, index) => {
                            if (post.id == this.postdata.category) this.categoryName = post
                                .name;
                        });
                    })
                }).catch(err => {
                    Indicator.close();
                    // Toast(err.message);
                })
            } else {
                let that = this;
                MessageBox({
                    title: "",
                    message: '您还不商家，是否申请为商家？',
                    showCancelButton: true,
                    closeOnClickModal: false
                }).then(action => {
                    if (action === 'confirm') {
                        that.$router.push({
                            path: '/application/0'
                        });
                    } else {
                        that.$router.push({
                            path: '/'
                        });
                    }
                })
            }
            this.pfwshow()
            this.Bullet();
        },

        methods: {
            //入驻弹窗
            Bullet() {
                axios({
                    url: this.Api + '/merchant/info',
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {                 
                    if (res.data.code = 0) {
                        if (res.data.data.isPrompt == 0) {
                            MessageBox({
                                title: '温馨提示',
                                message: res.data.data.unionPayMsg,
                                showCancelButton: true,
                                confirmButtonText: '去入驻',
                                closeOnClickModal: false
                            }).then(action => {
                                if (action === 'confirm') {
                                    window.location.href = this.YLApi +
                                        "wholesale/uploading?from=by&seq=" + this.$cookie.get('seq');
                                }
                            });
                        }
                    }

                })
            },
            gopfw() {
                let u = navigator.userAgent,
                    app = navigator.appVersion;
                let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
                let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                // console.log(isIOS, isAndroid)
                if (isAndroid) {
                    //这个是安卓操作系统
                    window.location.href = 'http://dh.520shq.com/HelpDoc/Android'
                } else if (isIOS) {
                    //这个是ios操作系统
                    window.location.href = 'https://itunes.apple.com/cn/app/m-ishenghuo/id1243425475?mt=8'
                } else {
                    window.location.href = this.YLApi + 'login?seq=' + this.seq
                }
            },
            //pf 网是否显示
            pfwshow() {
                axios.get(this.Api + '/merchant/entranceShow?seq=' + this.seq, {
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {

                    if (res.data.code == 0) {
                        this.pfshow = res.data.data
                    }
                })
            },
            goshop() {


        
            },
            goshopOrder() {
           
            },
            addressfn(arr) {
                let text = '';
                arr.forEach(post => {
                    if (post) text += post;
                });
                return text;
            },
            // 二维码扫描
            sweepCode() {
                let that = this;
                let api = this.Api;
                window.action.sweepQRCode();
                window['getQRCode'] = function (text) {
                    if (text.indexOf(api) >= 0) {
                        Indicator.open('正在提交扫码');
                        let urls = text.split(api)[1];
                        if (urls.indexOf('/user/saveAndGetCardUsedLog') >= 0) {
                            axios.get(api + urls).then(res => {
                                Indicator.close();
                                that.$router.push({
                                    path: '/management/scanResults',
                                    query: res.data.usedCardLog
                                })
                            }).catch(err => {
                                Toast(err.message);
                                Indicator.close();
                            });
                        }
                    } else if (text.indexOf(window.location.host) >= 0) {
                        window.location.href = text;
                    } else {
                        Toast('二维码无法识别。');
                    }
                }
            },
            //跳转店铺预览
            goToPreview() {
                this.$router.push({
                    path: `/shopDetails?id=${this.postdata.id}`
                })
                
            },
            //跳转到店铺优惠
            goToOffer() {
                this.$router.push({
                    path: `/management/${this.postdata.id}/priceMessage`
                })  
            },
            //跳转到收入明细
            goToIncome() {
                console.log(this.postdata);
                
                if (this.postdata.status == 2 || this.postdata.status == 0) {
                    this.showbtnbox = false;
                }
                if (this.postdata.status == 1) {
                    this.$router.push({
                        path: `/management/profitDetail?id=${this.postdata.id}`
                    })
                }
            },
            //跳转到评论
            gotoCommentList() {
                if (this.postdata.status == 2 || this.postdata.status == 0) {
                    this.showbtnbox = false;
                }
                if (this.postdata.status == 1) {
                    this.$router.push({
                        path: `/comment/commentList?id=${this.postdata.id}&category=${this.postdata.category}`
                    })
                }
            },
            //跳转到店铺查询
            goToCx() {
                this.$router.push({
                    name: "xianShopManage"
                });
            },
            //返回
            goback() {
                this.showbtnbox = true;
            },
        }
    }

</script>

<style scoped>
    .mainbox {
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;
        padding-bottom: 60px;
    }

    .shopmain {
        overflow: hidden;
        padding: 1rem 10px;
    }

    .shopmain .shopxinx {
        padding: 1.5rem 1.5rem 2.5rem;
        background: #ed1e59;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .shopmain .headimg {
        float: left;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background: white;
        overflow: hidden;
    }

    .shopmain .headimg img {
        width: 100%;
        height: 100%;
    }

    .shopmain .shoptext {
        float: right;
        width: calc(100% - 4.5rem);
        min-height: 4rem;
        color: white;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .shopmain .shoptext .shopname {
        font-size: 0.8rem;
        padding-bottom: 0.1rem;
    }

    .shopmain .shoptext .shopxx {
        overflow: hidden;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .shopbtns {
        width: 90%;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0 0.05rem 0.2rem #ccc;
        margin: 0 auto;
        border-radius: 0.4rem;
        transform: translateY(-1.6rem);
    }

    .shopbtns .sbtitle {
        text-align: center;
        width: 100%;
        font-size: 0.8rem;
        padding: 0.3rem 0;
        line-height: 1.2em;
        color: #333;
    }

    .btnbox {
        overflow: hidden;
        padding: 1.5rem 0 0.5rem;
    }

    .btnbox .btnlist {
        float: left;
        width: 33.333%;
        margin-bottom: 0.9rem;
        text-align: center;
    }

    .btnbox .btnlist span {
        display: block;
        width: 2rem;
        height: 2rem;
        overflow: hidden;
        margin: 0 auto 0.2rem;
        background-repeat: no-repeat;
        background-size: 100% auto;
        background-position: center top;
    }

    .btnbox .btnlist p {
        font-size: 12px;
        color: #333;
    }

    .pop-ups-tip {
        /* padding: 0 1.2rem 0.5rem; */
        padding: 0 28px 12px;
        margin-top: 10px;
    }

    .pop-ups-tip .tip {
        background: #eeeeee;
        /* padding: 1.5rem 0.4rem 1rem 0.4rem; */
        padding: 36px 21px 24px 21px;
        font-size: 0.7rem;
        border-radius: 20px;
        margin-bottom: 20px;
    }

    .pop-ups-tip p {
        text-indent: 2em;
    }

    .hidde-tip {
        background: #ffffff;
        border: 1px solid #b4b1b0;
        width: 3.333333rem;
        padding: 0 .583333rem;
        height: 1.458333rem;
        margin: 10px auto 0 auto;
        border-radius: 10px;
        line-height: 1.333333rem;
        text-align: justify;
    }

    .hidde-tip span {
        display: inline-block;
        padding-left: 100%;
    }

</style>
