<template>
    <div class="mainbox">
        <div class="logo"><img src="@/assets/images/loging.png"></div>
        <div class="formbox">
            <div class="form-item">
                <label>手机号</label>
                <div class="form-input">
                    <div class="inputed">
                        <input type="text" placeholder="输入手机号码" v-model="userPhone" @focus="getFocus" autocomplete="off"
                            @keyup="phone" :attr="{maxlength:15}">
                    </div>
                </div>
            </div>

            <div class="form-item">
                <label>验证码</label>
                <div class="form-input">
                    <div class="inputed"><input type="text" placeholder="输入验证码" @focus="getFocus" autocomplete="off"
                            v-model="codeModel">
                    </div>
                    <i v-if="code==1" class="code01" @click="codeToast">获取验证码</i>
                    <i v-if="code==2" class="code02" @click="tuxingCode">获取验证码</i>
                    <i v-if="code==3" class="code03">{{ captlist+'s后重新获取' }}</i>
                </div>
            </div>
            <div class="form-item">
                <label>密码</label>
                <div class="form-input">
                    <div class="inputed">
                        <input v-if="eyes=='close'" type="password" placeholder="输入密码" autocomplete="off"
                            v-model="pwModel" :attr="{maxlength:11}" @focus="getFocus">
                        <input v-if="eyes=='open'" type="text" placeholder="输入密码" v-model="pwModel" @focus="getFocus">
                    </div>
                    <div class="shpassword" :class="{'icolor':pwModel!=''}" @click="passwordEye">
                        <i :class="eyes=='close'?'icon-eye-close':'icon-eye-open'"></i>
                    </div>
                </div>
            </div>
            <div class="form-item" v-if="isShow">
                <label>邀请人邀请码</label>
                <div class="form-input">
                    <div class="inputed">
                        <input type="number" placeholder="请输入邀请人卡号(选填)" v-model="invitation" autocomplete="off"
                            :attr="{maxlength:11}">
                    </div>
                </div>
            </div>
            <div class="form-item">
                <!-- <span class="xieyi"><i class="el-icon-circle-check icheck"></i>阅读并同意《用户协议》</span> -->
                <span class="xieyi">
                    <!-- <i class="el-icon-circle-check" :class="{icheck:check}"></i> -->
                    已阅读并同意<a @click="toggle">百业惠盟用户协议</a>
                </span>
            </div>
            <div class="form-item">
                <div class="sub" :class="subhse" @click="submit">同意协议并注册</div>
                <div class="thr-center">
                    已经有账号？<span @click="$router.push({path:'/login'})">立即登录</span>
                </div>
            </div>
        </div>
        <!-- 图形验证码弹窗 -->
        <mt-popup v-model="popupVisible" position="middle">
            <div class="sousuo">
                <div class="frist">请输入图形验证码</div>
                <div class="two">
                    <input type="text" placeholder="输入图形验证码" autocomplete="off" v-model="tuxingModel" @focus="getFocus">
                    <div class="thre" @click="yanxia">
                        <img :src="imgs" alt="" class="tuxing">
                        <span>看不清？换一张 </span>
                    </div>
                </div>
            </div>
            <div class="visiblebtn">
                <div class="quxi" @click="popupVisible=false">取消</div>
                <div class="quedi" @click="codeGet">确定</div>
            </div>

        </mt-popup>
        <!-- 用户协议 -->
        <!--<img id="preview" style="display: none" :src="contractUrl" preview preview-text="用户协议">-->
        <picture-viewer v-if="check" :imgUrl.sync="imgUrl"></picture-viewer>
    </div>
</template>

<script>
    import regular from '@/assets/js/regular';
    export default {
        name: 'login',
        data() {
            return {
                code: 1,
                eyes: 'close',
                check: false,
                pwModel: '',
                userPhone: '',
                codeModel: '',
                captlist: 89,
                cancel: true,
                inviteCode: this.$route.query.inviteCode,
                inviteLevel: this.$route.query.inviteLevel,
                cardType: '',
                invitation: '',
                imgUrl: [{
                    url: require("@/assets/images/contract/user_agreement.png"),
                    name: "用户协议议",
                }],
                submitCheck: true,
                tuxingModel: '',
                imgs: '',
                popupVisible: false,
                isShow:true
            }
        },
        computed: {
            //获取图形验证
            // 按钮灰色转态
            subhse() {
                this.submitCheck = (!regular.RegPhone.test(this.userPhone) || this.pwModel == '' || this.codeModel ==
                    '') ? true : false
                return {
                    'subhse': this.submitCheck
                }
            }
        },
        mounted() {
            let fullPath = sessionStorage.getItem('fullPath');
            // console.log(fullPath)
            let shareCode = sessionStorage.getItem('shareCode');
            if (shareCode) {
                this.inviteCode = shareCode;
            }
            if (fullPath) {
                this.isShow = false;
                var arrFull = fullPath.split('/');
                this.cardType = arrFull[4];
                 
                if (this.cardType == undefined || typeof (this.cardType) != Number) {

                    this.cardType = 1

                }
                if (!this.inviteCode || this.inviteCode == 'undefined') {
                    this.inviteCode = arrFull[2]
                }
                if (!this.inviteLevel || this.inviteLevel == 'undefined') {
                    this.inviteLevel = arrFull[3]
                }
                console.log(this.inviteCode, this.inviteLevel, 'hha', this.cardType, arrFull[2], arrFull[3])
            }

        },
        methods: {
            yanxia() {
                axios.get(this.Api + 'register/getGraphValidateCode?mobile=' + this.userPhone).then(res => {
                    this.imgs = res.data.data + '&random=' + new Date().getTime();
                })
            },
            getFocus() {
                $("input,textarea").on("blur", function () {
                    window.scroll(0, 0);
                })
            },

            //获取图形验证
            tuxingCode() {
                this.popupVisible = true;
                let exp = regular.RegPhone;
                if (exp.test(this.userPhone)) {

                } else {
                    Toast('请输入正确手机号码！')
                    return;
                }
                axios.get(this.Api + 'register/getGraphValidateCode?mobile=' + this.userPhone).then(res => {
                    this.imgs = res.data.data + '&random=' + new Date().getTime();

                })
            },
            submit() {
                let that = this;


                if (this.submitCheck) return false;
                if (this.pwModel.length < 6 || this.pwModel.length > 32) {
                    Toast('请输入6~32位密码！');
                    return false;
                };
                if (this.invitation != '' && this.invitation != undefined) {
                    this.inviteCode = this.invitation;
                }

                let post = {
                    mobile: this.userPhone,
                    password: this.pwModel,
                    code: this.codeModel,
                    inviteCode: this.inviteCode,
                    inviteLevel: this.inviteLevel,
                    cardType: this.cardType
                };
                Indicator.open();
                axios.post(this.Api + '/register/register', qs.stringify(post)).then(res => {
                    console.log(res, '4')
                    let data = res.data;
                    Indicator.close();
                    if (data.code == 0) {
                        MessageBox({
                            title: "温馨提示",
                            message: '注册成功',
                            showCancelButton: true
                        }).then(action => {
                            if (action === 'confirm') {
                                that.login();
                            }
                        });

                    } else {
                        Toast(res.data.msg);
                    }
                }).catch((err) => {
                    Indicator.close();
                    Toast(err.errmsg);
                })
            },
            login() {
                let that = this;
                let post = {
                    mobile: this.userPhone,
                    password: this.pwModel
                };
                Indicator.open();
                axios.post(this.Api + '/auth/login', qs.stringify(post)).then(res => {
                    let data = res.data;
                    Indicator.close();
                    if (data.code == 0) {
                        // 判断是否记录有登录后跳转的页面，如果没有则跳到首页
                        let fullPath = sessionStorage.getItem('fullPath');
                        let path = (fullPath && fullPath != '') ? fullPath : '/';
                        setTimeout(function () {
                            if (/(http:\/\/)|(https:\/\/)/.test(path)) {
                                window.location.href = path;
                            } else {
                                that.$router.push({
                                    path: path
                                });
                            }
                            // 每次登录跳转都清除记录
                            sessionStorage.removeItem('fullPath');
                        }, 1000);
                        // cookie保存登录信息
                        appCookie(data);
                    } else {
                        Toast(data.msg);
                    }
                }).catch((err) => {
                    Indicator.close();
                    that.toasfn(err.message);
                })
            },
            // 显示隐藏密码
            passwordEye() {
                switch (this.eyes) {
                    case 'close':
                        this.eyes = 'open';
                        break;
                    default:
                        this.eyes = 'close';
                        break;
                }
            },
            toggle() {
                this.check = !this.check
                //if(this.check) {
                //  document.getElementById('preview').click();
                //}
            },
            // 输入电话是否成立
            phone() {
                let that = this;
                let exp = regular.RegPhone;
                if (exp.test(that.userPhone)) {
                    that.code = 2;
                } else {
                    that.code = 1;
                }
            },
            // 弹出提示电话错误
            codeToast() {
                Toast('输入的手机号码格式错误！');
            },
            // 点击获取手机验证码，并且提示验证码过期时间
            // this.Api + '/shopper/sendcode?mobile='+this.userPhone
            codeGet() {


                let that = this;
                if (this.tuxingModel == '') {
                    Toast('请输入图形验证码！')
                    return;
                }
                this.popupVisible = false;
                this.codeModel = '';
                this.code = 3;
                clearInterval(timer);
                var timer = setInterval(function () {
                    that.captlist--;
                    if (that.captlist == 0) {
                        that.captbtn = false;
                        that.captlist = 89;
                        that.code = 2;
                        clearInterval(timer);
                    };
                }, 1000);

                axios({
                    url: this.Api + 'shopper/sendcode?mobile=' + this.userPhone + '&graphValidateCode=' +
                        this.tuxingModel,
                    method: "post"
                }).then(res => {
                    console.log(res, '8')
                    let data = res.data;
                    if (res.data.status == 200) {
                        Toast(res.data.msg);
                    } else {
                        this.code = 2;
                        that.captlist = 89;
                        Toast(data.msg);
                    };
                }).catch((err) => {
                    this.code = 2;
                    that.toasfn(err.message);
                })
            },
            toasfn(msg) {
                Toast({
                    message: msg,
                    position: 'bottom',
                    duration: 2000
                });
            }
        }
    }

</script>

<style scoped>
    @import '../assets/fonts/password/style.css';



    .mainbox {
        overflow: hidden;
    }
    
    .logo {
        overflow: hidden;
        text-align: center;
        padding: 2rem 0;
    }

    .logo img {
        width: 48%;
        max-width: 325px;
    }

    .formbox {
        overflow: hidden;
        padding: 0 2rem 1.5rem;
        font-size: 0.7rem;
        color: #989898;
    }

    .formbox .form-item {
        overflow: hidden;
        margin-bottom: 0.8rem;
    }

    .formbox .form-item label {
        display: block;
        width: 100%;
        line-height: 1.2rem;
    }

    .formbox .form-item .form-input {
        display: flex;
        width: 100%;
        height: 1.8rem;
        line-height: 1.2rem;
        padding: 0.3rem 0;
        border-bottom: 1px solid #666;
    }

    .formbox .form-item .inputed {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;

    }

    .formbox .form-item .inputed input {
        width: 100%;
        font-size: 0.65rem;
        background: transparent;
    }

    .formbox .form-item .code01 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #888;
        border: 1px solid #989898;
        border-radius: 20rem;
        padding: 0 8px;
        line-height: 1.8em;
    }

    .formbox .form-item .code02 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 20rem;
        padding: 0 8px;
        line-height: 1.8em;
    }

    .formbox .form-item .code03 {
        margin-left: 0.4rem;
        font-size: 0.65rem;
        color: #ec0746;
    }

    .icolor {
        color: #ec0746;
    }

    .shpassword i {
        overflow: hidden;
        font-size: 1.2rem;
    }

    .xieyi {
        float: left;
        font-size: 12px;
    }

    .xieyi .icheck {
        color: #ec0746;
    }

    .xieyi i {
        font-size: 0.65rem;
        padding-right: 0.1rem;
    }

    .xieyi a {
        font-weight: bold;
        color: #666;
        text-decoration: underline;
    }

    .form-item .sub {
        display: block;
        text-align: center;
        color: white;
        padding: 0.4rem 0;
        width: 70%;
        font-size: 0.7rem;
        line-height: 1.6em;
        background: #ff8f28;
        border-radius: 20rem;
        margin: 0.5rem auto;
    }

    .form-item .subhse {
        background: #c3c3c3;
    }

    .thr-center {
        overflow: hidden;
        text-align: center;
        font-size: 12px;
        line-height: 1.2em;
        padding-top: 0.3rem;
        color: red;
    }

    /* 验证码框 */
    .mint-popup {
        width: 80%;

        border-radius: 0.5rem;
    }

    .mint-popup .sousuo {
        width: 100%;
        padding: 0 10%;
        background-color: f5f5f5;
        margin-top: 0.5rem;
    }

    .mint-popup .sousuo .two input {
        border: 1px solid #999;
        width: 50%;
        height: 1.6rem;
        border-radius: 0.2rem;
        text-align: center;
        float: left;

    }

    .mint-popup .frist {
        height: 1.7rem;
        line-height: 1.7rem;
        text-align: center;
        font-size: 0.75rem;
        color: #333;

    }

    .mint-popup .two {
        margin-top: 0.3rem;
        font-size: 0.6rem;
        color: #999;
        overflow: hidden;

        display: table;
    }

    .mint-popup .thre {
        width: 45%;
        float: right;
    }

    .mint-popup .visiblebtn {
        width: 100%;
        font-size: 0.75rem;
        margin-top: 0.5rem;
        border-top: 1px solid #ddd;
    }

    .mint-popup .visiblebtn .quxi {
        width: 50%;
        float: left;
        text-align: center;
        height: 2.2rem;
        line-height: 2.2rem;
        border-right: 1px solid #ddd;
        color: #666;
    }

    .mint-popup .visiblebtn .quedi {
        width: 50%;
        float: left;
        text-align: center;
        height: 2.2rem;
        line-height: 2.2rem;
        color: #ff8724;
    }

</style>
