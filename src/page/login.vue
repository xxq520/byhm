<template>
    <div class="mainbox">
        <mt-header>
            <!-- <mt-button slot="left" @click="goback" v-if="!backshqPd"></mt-button> -->
             <mt-button icon="back" slot="left" @click="goback"></mt-button>
            <!-- <mt-button slot="left" v-else> </mt-button> -->
        </mt-header>
        <div class="logo"><img src="@/assets/images/loging.png"></div>
        <div class="nav">
            <button :class="{'hover':invitebtn==1}" @click="invitemima">密码登录</button>
            <button :class="{'hover':invitebtn==0}" @click="inviteinfo">短信登录</button>
            
        </div>
        <div class="formbox" v-if="invitebtn==1">
            <div class="form-item">
                <label>手机号</label>
                <div class="form-input">
                    <div class="inputed"><input type="text" placeholder="输入手机号码" v-model="phone" maxlength="15"
                            @focus="getFocus" @change="trims">
                    </div>
                    <i class="el-icon-circle-close-outline"
                        style=" width: 28px;height: 28px; text-align: center; line-height: 28px" @click="clear"></i>
                </div>
            </div>
          
            <div class="form-item">
                <label>密码</label>
                <div class="form-input">
                    <div class="inputed"><input type="password" placeholder="输入密码" v-model="password" @focus="getFocus">
                    </div>
                </div>
            </div>
            <div class="form-item" v-if="popupVisible">
                <label>图形验证码</label>
                <div class="form-input">
                    <div class="inputed"><input type="text" placeholder="输入图形验证码" autocomplete="off"
                            v-model="tuxingModel">
                    </div>
                    <img :src="imgs" alt="点击切换验证码" class="tuxing" @click="yanxia">
                </div>
            </div>
            <div class="form-item">
                <router-link :to="{path:'/settings/ChangeCode'}" class="forget">忘记密码</router-link>
                <div @click="registered" class="registered">去注册&gt;&gt;</div>
            </div>
            <div class="form-item">
                <div class="sub" @click="submit">登录</div>
            </div>
        </div>
        <div class="formbox" v-if="invitebtn==0">
            <div class="form-item">
                <label>手机号</label>
                <div class="form-input">
                    <div class="inputed">
                        <input type="text" placeholder="输入手机号码" v-model="phone" autocomplete="off"
                            @keyup="phonechange" :attr="{maxlength:15}" @focus="getFocus" @change="trims">
                    </div>
                </div>
            </div>
            <div class="form-item">
                <label>验证码</label>
                <div class="form-input">
                    <div class="inputed"><input type="text" placeholder="输入验证码" autocomplete="off" v-model="codeModel"
                            @focus="getFocus">
                    </div>
                    <i v-if="code==1" class="code01" @click="codeToast">获取验证码</i>
                    <i v-if="code==2" class="code02" @click="codeGet">获取验证码</i>
                    <i v-if="code==3" class="code03">{{ captlist+'s后重新获取' }}</i>
                </div>
            </div>
            <div class="form-item">
                <router-link :to="{path: '/settings/ChangeCode'}" class="forget">忘记密码</router-link>
                <div @click="registered" class="registered">去注册&gt;&gt;</div>
            </div>
            <div class="form-item">
                <div class="sub" @click="submitinfo">登录</div>
            </div>
            <!-- <div class="thr-center" @click="wxloginFn">
                第三方快速登录-微信登录
                <img v-if="phone=='' || password==''" src="@/assets/images/wx.png">
                <img v-else src="@/assets/images/wx-h.png">
            </div> -->
            <!--<div class="three">
      <div class="thr-title">第三方快速登录</div>
      <div class="thrbox">
        <span><img src="@/assets/images/qq.png"></span>
        <span><img src="@/assets/images/wx.png"></span>
        <span><img src="@/assets/images/xl.png"></span>
      </div>
    </div>-->
        </div>

        <div class="tankuang" v-show="tankuang">
            <a href="javascript:void(0);">
                <img src="@/assets/images/tankuang.png" alt="" @click="hide">
            </a>
        </div>
    </div>
</template>

<script>
    import regular from '@/assets/js/regular';
    import appCookie from '@/assets/js/appCookie.js';
    import {
        setTimeout
    } from 'timers';
    export default {
        name: 'login',
        data() {
            return {
              
                password: '',
                cancel: true,
                backshqPd: sessionStorage.getItem('applogin'),
                tankuang: false,
                invitebtn: 1,
                code: 1,
                captlist: 60,
                phone: '',
                codeModel: '',
                tuxingModel: '',
                popupVisible: false,
                imgs: '',
                zhuce:'注册'

            }
        },
        mounted() {
           
            // clearCookie();
            let shopfios = sessionStorage.getItem('shopfios');
            if (shopfios) {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isiOS) {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        this.tankuang = true;
                    } else {
                        this.tankuang = false
                    }
                }
                sessionStorage.removeItem('shopfios')
            }
            if (this.$cookie.get("userPhone") && this.$cookie.get("token")) {
                this.$router.push({
                    path: '/'
                });
            }
            let fullPath = sessionStorage.getItem('fullPath');
            if (fullPath!=null) {
                let arrFull = fullPath.split('/');
                this.inviteCode = arrFull[2];
                this.inviteLevel = arrFull[3];
                if (!this.inviteLevel) {
                    this.inviteLevel = 1;
                }
            }
            this.keyup();
        },

        methods: {
     
          //给document  添加键盘事件
           keyup(){
           let This = this //存一下this
        //    document.onkeydown = function (event) {  
           $('.sub')[0].onkeydown = function (event) {

           let e = event || window.event || arguments.callee.caller.arguments[0];
           if (e && e.keyCode == 13) {
           This.login() //调用下面的函数，注意This
           }
           };
           },
     
              trims(){
        
               this.phone=this.phone.replace(/\s/g,"")
          
              },
            getFocus() {
                $("input,textarea").on("blur", function () {
                    window.scroll(0, 0);
                })
            },
            inviteinfo() {
                this.invitebtn = 0
            },
            invitemima() {
                this.invitebtn = 1
            },
            hide() {
                this.tankuang = false
            },
            wxloginFn() {
                let APPID = 'wxd4d112b4765d1b4b'
                // let APPID = 'wxfbec726004f51e9b'
                let local = 'http://byhm.520shq.com/#/WeChatLogin';
                // let local = 'https://xcx.520shq.com'//测试地址
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
                    '&redirect_uri=' + encodeURIComponent(local) +
                    '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';

            },
            phonechange() {

                let that = this;
                let exp = regular.RegPhone;
                if (exp.test(that.phone)) {
                    that.code = 2;
                } else {
                    that.code = 1;
                    this.captlist = 60;


                }

            },
            //点击改变图形验证码
            yanxia() {
                axios.get(this.Api + 'captcha/loginCaptcha?mobile=' + this.phone).then(res => {
                    this.imgs = res.data.data
                })

            },
            // 弹出提示电话错误
            codeToast() {
                Toast('输入的手机号码格式错误！');
            },

            // 点击获取手机验证码，并且提示验证码过期时间
            // this.Api + '/shopper/sendcode?mobile='+this.phone
            codeGet() {

                let that = this;
                this.code = 3;
                clearInterval(timer);
                var timer = setInterval(function () {
                    that.captlist--;
                    if (that.captlist == 0) {
                        that.captbtn = false;
                        that.captlist = 60;
                        that.code = 2;
                        clearInterval(timer);
                    };
                }, 1000);
                axios({
                    url: this.Api + 'shopper/sendcodeToLogin?mobile=' + this.phone+'&types=0',
                    // data:{
                    //   mobile:this.phone,
                    //   type: 0
                    // },
                    method: "post"
                }).then(res => {
                 
                    let data = res.data;
                    if (res.data.status == 200) {
                        Toast(res.data.msg);
                    } else {
                        this.code = 2;
                        that.captlist = 60;
                        clearInterval(timer);
                        Toast(data.msg);
                    };
                }).catch((err) => {
                    this.code = 2;
                    that.toasfn(err.message);
                })
            },
            quedingfn() {


                let that = this;
                if (this.tuxingModel == '') {
                    Toast('请输入图形验证码！')
                    return;
                }

                axios({
                    url: this.Api + 'captcha/verifyCaptcha?mobile=' + this.phone + '&graphValidateCode=' +
                        this.tuxingModel,
                    method: "post"
                }).then(res => {
                    if (res.data.code == 0) {
                        this.popupVisible = false;
                        if (this.invitebtn == 0) {
                            Toast('验证成功,请输入正确的短信验证码！')
                        }
                        if (this.invitebtn == 1) {
                            Toast('验证成功,请输入正确的密码！')
                        }
                    } else {
                        axios.get(this.Api + 'captcha/loginCaptcha?mobile=' + this.phone).then(res => {

                            this.imgs = res.data.data
                        })
                        Toast(res.data.msg);
                    };
                }).catch((err) => {
                    that.toasfn(err.message);
                })
            },
            goback() {
                // this.$router.push({
                //     path: '/'
                // });
                  this.$router.back()
              
            },
            clear() {
                this.phone = '';
                    this.password = '';
                 this.popupVisible = false;
                
            },
            registered() {
                this.$router.push({
                    path: '/registered',
                    query: {
                        inviteCode: this.inviteCode,
                        inviteLevel: this.inviteLevel
                    }
                })
            },
            submit() {
                // 防止ios在微信浏览器打开键盘弹起后页面上滑
            
                window.scrollTo(0, 0);
                let that = this;
                        let expPhone = regular.RegPhone;
                        if (this.phone == '') {
                        this.toasfn('请输入登录手机号码！');
                        return false;
                        } else if (this.password == '') {
                        this.toasfn('请输入登录密码！');
                        return false;
                        } else if (!(expPhone.test(this.phone))) {
                        this.toasfn('输入的手机号码格式错误！');
                        return false;
                        };
                if (this.popupVisible == true) {
                    if (this.tuxingModel == '') {
                        Toast('请输入图形验证码！')
                        return;
                    }
                    axios({
                        url: this.Api + 'captcha/verifyCaptcha?mobile=' + this.phone +
                            '&graphValidateCode=' +
                            this.tuxingModel,
                        method: "post"
                    }).then(res => {
                        if (res.data.code == 0) {
                             
                           this.login()
                        } else {
                            axios.get(this.Api + 'captcha/loginCaptcha?mobile=' + this.phone).then(res => {

                                this.imgs = res.data.data
                            })
                            Toast(res.data.msg);
                            return;
                        };
                    })
                }
                if (this.popupVisible == false) {
                  this.login()
                 }
            },
            login(){
                  let that = this;
                     let post = {
                     mobile: this.phone,
                     password: this.password
                     };

                     Indicator.open();

                     axios.post(this.Api + '/auth/login', qs.stringify(post)).then(res => {
                     let data = res.data;
                
                     Indicator.close();
                     that.cancel = false;
                     if (data.code == 0) {
                     that.toasfn("登录成功");
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

                     } else if (data.code == 608) {
                     this.popupVisible = true;
                     axios.get(this.Api + 'captcha/loginCaptcha?mobile=' + this.phone).then(res => {

                     this.imgs = res.data.data
                     })
                     this.password = ''
                     Toast(data.msg);
                     } else {
                     Toast(data.msg);
                     }
                     }).catch((err) => {
                     Indicator.close();
                     that.toasfn(err.message);
                     })
            },
            submitinfo() {
                // 防止ios在微信浏览器打开键盘弹起后页面上滑
                window.scrollTo(0, 0);
                let that = this;
                let expPhone = regular.RegPhone;
                if (this.phone == '') {
                    this.toasfn('请输入登录手机号码！');
                    return false;
                } else if (this.codeModel == '') {
                    this.toasfn('请输入验证码！');
                    return false;
                } else if (!(expPhone.test(this.phone))) {
                    this.toasfn('输入的手机号码格式错误！');
                    return false;
                };
                let post = {
                    mobile: this.phone,
                    code: this.codeModel
                };

                Indicator.open();

                axios.post(this.Api + 'auth/login/cellphone', qs.stringify(post)).then(res => {
                    let data = res.data;
                
                    Indicator.close();
                    that.cancel = false;
                    if (data.code == 0) {
                        // that.toasfn("登录成功");
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
                            that.toasfn("登录成功");
                            // 每次登录跳转都清除记录
                            sessionStorage.removeItem('fullPath');
                        }, 50);
                        // cookie保存登录信息
                       
                        appCookie(data);

                    } else if (data.code == 503) {
                        this.popupVisible = true;
                        // axios.get(this.Api + 'captcha/loginCaptcha?mobile=' + this.phone).then(res => {

                        //     this.imgs = res.data.data
                        // })
                        this.codeModel = '';

                        Toast(data.msg);
                    } else {

                        Toast(data.msg);
                    }
                }).catch((err) => {
                    Indicator.close();
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
    .nav {
        display: flex;
        padding: 0 2rem;
    }

    .nav button {

        flex: 1;
        border: none;
        outline: none;

        text-align: center;
        background-color: #fff;
        color: #666666;
        font-size: 0.7rem;
        height: 2.083333rem;
        line-height: 2.083333rem;
        margin-bottom: 0.7rem;
    }

    .nav button.hover {
        border: none;
        background-color: #fff;
        color: #ff8724;


    }

    .nav button.hover::after {
        content: "";
        width: 4rem;
        height: 2px;
        background-color: #ff8724;
        margin: 0 auto;
        display: block;
    }

    i.el-icon-circle-close-outline::before {
        font-size: 22px !important;
    }

    .tankuang {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .mainbox {
        overflow: hidden;
    }

    .mainbox>>>.mint-header {
        color: #333;
        border-bottom: none;
    }

    .logo {
        overflow: hidden;
        text-align: center;
        padding: 0.5rem 0 2rem 0;
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

    .form-item a {
        color: #989898;
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

    .tuxing {
        width: 35%;
        height: 1.4rem;
        position: relative;
        bottom: 0.2rem;

    }

    .formbox .form-item .inputed input {
        width: 100%;
        font-size: 0.65rem;
    }

    .forget {
        float: left;
    }

    .registered {
        float: right;
        font-size: 16px ;
        color: #ff8723;
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

    .three {
        overflow: hidden;
        padding: 0.5rem 2rem 2rem;
        font-size: 0.7rem;
        color: #989898;
    }

    .thr-center {
        overflow: hidden;
        text-align: center;
        font-size: 0.6rem;
        line-height: 1.2em;
        padding-top: 0.3rem;
    }

    .thr-center img {
        width: auto;
        height: 1.2em;
        padding-left: 0.2em;
        vertical-align: middle;
    }

    .thr-title {
        overflow: hidden;
        margin-bottom: 0.8rem;
    }

    .thrbox {
        overflow: hidden;
        width: calc(100% + 2rem);
    }

    .thrbox span {
        float: left;
        height: 1.2rem;
        margin-right: 2rem;
    }

    .thrbox span img {
        width: auto;
        height: 100%;
        display: block;
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

    /* 验证码弹窗 */
    .visiblebtn>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
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
        min-height: 4.4rem;
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
        font-size: 0.66rem;
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



    .mint-popup .visiblebtn .quedi {


        text-align: center;
        height: 2.2rem;
        line-height: 2.2rem;
        color: #ff8724;
    }

</style>
