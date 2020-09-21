<template>
   <div class="ChangeCode">

        <topnav :topnav="topnav"></topnav>

        <div class="telwrap">
            <div class="formwrap2">
                <div class="tel">
                        <mt-field disableClear label='手机号' placeholder="请输入手机号" type="tel" v-model="phone"
                                  :attr="{maxlength:15}">
                            <i class="code02" @click="tuxingCode">获取图形码</i>
                        </mt-field>
                </div>
                <div class="tel">
                    <mt-field disableClear label='图形码' placeholder="请输入图形码" type="text" v-model="tuxingModel"
                        :attr="{maxlength:4}">
                        <i class="tuxing"></i><img :src="imgs" alt="">
                    </mt-field>
                </div>
                <div class="codewrap">
                    <div class="code">
                        <mt-field disableClear label='验证码' placeholder="请输入验证码" type="text" v-model="code">
                            <i v-if="captbtn" class="code02">{{ captlist+'s' }}</i>
                            <i v-else class="code02" @click="getcode">获取验证码</i>
                        </mt-field>
                    </div>
                </div>
                <div class="ycode">
                    <mt-field disableClear label='新密码' placeholder="请输入新密码" :type="isSee ? 'text':'password'"
                        v-model.trim="ycode" :attr="{maxlength:16}">
                        <div class="shpassword" :class="{'icolor':ycode!=''}" @click="taggle">
                            <i :class="isSee?'icon-eye-open':'icon-eye-close'"></i>
                        </div>
                    </mt-field>
                </div>
                <div class="surecode">
                    <mt-field disableClear label='确认密码' placeholder="再次输入新密码" :type="isSee2 ? 'text':'password'"
                        v-model.trim="surecode" :attr="{maxlength:16}">
                        <div class="shpassword" :class="{'icolor':surecode!=''}" @click="taggle2">
                            <i :class="isSee2?'icon-eye-open':'icon-eye-close'"></i>
                        </div>
                    </mt-field>
                </div>
            </div>
            <span id="padd">* 新密码长度为6--16位的数字或者英文字母</span>
            <div class="btnwrap">
                <mt-button class="btn" type="default" @click="sureChange">确定修改密码</mt-button>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
    export default {
        name: 'ChangeCode',
        data() {
            return {
                topnav: {
                    title: '修改密码'
                },
                isSee: false,
                isSee2: false,
                code: '',
                phone: '',
                ycode: '',
                surecode: '',
                captlist: 89,
                captbtn: false,
                userPhone: this.$cookie.get('userPhone'),
                tuxingModel: '',
                imgs: '',
            }
        },
        mounted() {

            this.phone = this.userPhone ? this.userPhone : '';
            if (this.phone == undefined || this.phone == 'undefined') {
                this.phone = '';

            }
        },
        methods: {
            tuxingCode() {
                let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
                let codeReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                if (reg.test(this.phone) == false || this.phone == '') {
                    Toast('请输入正确的手机号码');
                    return;
                }
                axios.get(this.Api + 'register/getGraphValidateCode?mobile=' + this.phone).then(res => {
                    this.imgs = res.data.data + '&random=' + new Date().getTime();;
                })
            },
            // 切换显示隐藏密码
            taggle() {
                this.isSee = !this.isSee;
            },
            taggle2() {
                this.isSee2 = !this.isSee2;
            },
            getcode() {
                let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
                let codeReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                let that = this;

                if (reg.test(that.phone) == false || that.phone == '') {
                    Toast('请输入正确的手机号码');
                    return;
                }
                if (this.tuxingModel == '') {
                    Toast('请输入图形验证码！')
                    return;
                }
                axios.get(this.Api + '/update/smscode?phone=' + this.phone + '&graphValidateCode=' + this.tuxingModel)
                    .then(res => {
                        if (res.data.code == 0) {
                            Toast(res.data.msg);
                            that.captlist = 60;
                            that.captbtn = true;
                            var timer = setInterval(function () {
                                that.captlist--;
                                if (that.captlist == 0) {
                                    that.captbtn = false;
                                    clearInterval(timer);
                                };
                            }, 1000);
                           
                        } else {
                            Toast(res.data.msg);
                            that.captbtn = false;
                        }
                    });


            },
            sureChange() {
                // Toast({message:'修改成功',position:'bottom',className:'myToast'})
                let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
                // let codeReg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9|A-Za-z]{6,16}$/;
                let codeReg = /^[a-z0-9]{6,16}$/;
                if (this.phone == '') {
                    Toast('请输入登录手机号码！');
                    return false;
                } else if (this.code == '') {
                    Toast('请输入验证码！');
                    return false;
                } else if (this.ycode == '') {
                    Toast('请输入登录密码！');
                    return false;
                } else if (this.surecode != this.ycode) {
                    Toast('确认密码与新密码不一致！');
                    return false;
                } else if (!(reg.test(this.phone))) {
                    Toast('输入的手机号码格式错误！');
                    return false;
                }
                console.log(this.ycode);
                if (!(codeReg.test(this.ycode))) {
                    Toast('请输入6~16位密码！');
                    return false;
                };
                let post = {
                    mobile: this.phone,
                    password: this.ycode,
                    code: this.code
                };
                let that = this;
                axios.post(this.Api + '/pwd/update?mobile=' + this.phone + '&password=' + this.ycode + '&code=' + this
                    .code).then(res => {
                    if (res.data.code == 0) {
                        Toast("修改成功");
                            //  if(this.backshqPd||this.$route.query.platform == 'android'||this.$route.query.platform
                            //  == 'ios'){
                            //  window.action.paySuccess();
                            //  }else{
                            //  this.$router.push({path:'/mine'})
                            //  }
                    } else {
                        Toast(res.data.msg);
                    }
                })
            }
        },
        created() {

        }
    }

</script>

<style scoped>
    @import '../../assets/fonts/password/style.css';

    /* .myToast{
  width: 100px;
} */
    .tuxing {
        width: 35%;
        height: 1.4rem;
    }

    .formwrap2 {
        background: #fff;
        padding: 0 .4444rem;
    }

    .formwrap2 .code02 {


        font-size: 0.6rem;
        min-width: calc(5em + 18px);
        text-align: center;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 1.2rem;
        padding: 3px 8px;
        line-height: 1.2em;
    }

    .formwrap2 .tel {
        display: flex;
    }

    .telwrap .btnwrap {
        display: flex;
        justify-content: center
    }

    .telwrap .btn {
        width: 10rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin-top: 2.4444rem

        ;
    }

    .telwrap #padd {
        color: #EC0746;
        font-size: .4889rem;
        padding-left: .8889rem

        ;
        display: block;
        margin-top: .4rem

        ;
    }

    .ChangeCode>>>.mint-cell:first-child .mint-cell-wrapper {
        background: none;
    }

    .ChangeCode>>>.mint-cell-title {
        font-size: 15px;
    }

    .ChangeCode>>>.mint-field .mint-cell-title {
        width: 5.5em;
    }

    .ChangeCode>>>.mint-field-core {
        font-size: 15px;
    }

    .shpassword {
        color: #666;
    }

    .shpassword i {
        overflow: hidden;
        font-size: 1rem;
    }

    .icolor {
        color: #ec0746;
    }

</style>
