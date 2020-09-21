<template>
    <div class="ChangeCode">

        <topnav :topnav="topnav"></topnav>

        <div class="telwrap">
            <div class="formwrap2" v-if="!xiuCode">
                <div class="tel a1">
                    <mt-field disableClear label='手机号' placeholder="请输入手机号" type="tel" v-model="phone"
                        :attr="{maxlength:15}" readonly>
                    </mt-field>
                </div>

                <div class="code a1">
                    <mt-field disableClear label='验证码' placeholder="请输入验证码" type="text" v-model="code">
                        <i v-if="captbtn" class="code02">{{ captlist+'s' }}</i>
                        <i v-else class="code02" @click="getcode">获取验证码</i>
                    </mt-field>
                </div>

            </div>
            <div class="formwrap2" v-if="xiuCode">
                <div class="ycode a1">
                    <mt-field disableClear label='提现密码' placeholder="请输入提现密码" :type="isSee ? 'text':'password'"
                        v-model.trim="ycode" :attr="{maxlength:16}">
                    </mt-field>
                </div>
                <div class="surecode a1">
                    <mt-field disableClear label='确认密码' placeholder="再次输入提现密码" :type="isSee2 ? 'text':'password'"
                        v-model.trim="surecode" :attr="{maxlength:16}">
                    </mt-field>
                </div>
            </div>

            <div class="btnwrap" v-if="!xiuCode">
                <mt-button class="btn" type="default" @click="sureChange">下一步</mt-button>
            </div>
            <div class="btnwrap" v-if="xiuCode">
                <mt-button class="btn" type="default" @click="Preservation">保存</mt-button>
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
                    title: '提现密码设置'
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
                xiuCode: false,
            }
        },
        mounted() {

            this.phone = this.userPhone ? this.userPhone : '';
            if (this.phone == undefined || this.phone == 'undefined') {
                this.phone = '';

            }
        },
        methods: {

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
                axios({
                    url: this.Api + 'shopper/sendcodeToLogin?mobile=' + this.phone + '&types=0',
                    method: "post"
                }).then(res => {
                    if (res.data.status == 200) {
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
            //验证验证码 下一步
            sureChange() {
                let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
                let codeReg = /^[a-z0-9]{6,16}$/;
                if (this.phone == '') {
                    Toast('请输入登录手机号码！');
                    return false;
                } else if (this.code == '') {
                    Toast('请输入验证码！');
                    return false;
                } else if (!(reg.test(this.phone))) {
                    Toast('输入的手机号码格式错误！');
                    return false;
                }

                let post = {
                    username: this.phone,
                    messageCode: this.code
                };
                let that = this;
                axios({
                    url: this.Api + '/sms/checkCode',
                    data: post,
                    method: "POST",
                    headers: {
                     
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 0) {
                        this.xiuCode = true;

                    } else {
                        Toast(res.data.msg);
                    }
                })
            },
            //保存密码
            Preservation() {
                if (this.ycode != this.surecode) {
                    Toast('请输入相同的提现密码与确认密码！');
                    return false;
                }
                let post = {
                    username: this.phone,
                    withdrawalPwd: this.ycode
                };
                axios({
                    url: this.Api1 + '/user/updateWithdrawalPwd',
                    data: post,
                    method: "POST",
                    headers: {
                          "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('修改成功')
                           this.xiuCode = false;
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
    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        height: 100vh;
        position: relative;
    }

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
        color: #999;
        border: 1px solid #999;
        border-radius: 0.4rem;
        padding: 3px 8px;
        line-height: 1.2em;
    }

    .formwrap2 .tel {
        display: flex;
    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 10%;
    }

    .telwrap .btn {
        width: 10rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin-top: 2.4444rem;
    }

    .telwrap #padd {
        color: #EC0746;
        font-size: .4889rem;
        padding-left: .8889rem;
        display: block;
        margin-top: .4rem;
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

    .ChangeCode>>>.a1 {
        border-bottom: 1px solid #eee;
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
