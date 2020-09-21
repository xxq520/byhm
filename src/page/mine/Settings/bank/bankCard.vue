<template>
    <div class="glode">
        <topnav :topnav="topnav"></topnav>
        <div class="bank-item">
            <mt-field label="开户行：" placeholder="选择开户行" v-model="bank" readonly @click.native.capture="bankfn">
                <i class="el-icon-arrow-right"></i>
            </mt-field>
            <mt-field label="开户行支行：" placeholder="开户行支行" v-model="bankname" :attr="{ maxlength: 15 }"></mt-field>
            <mt-field label="开户名：" placeholder="您的银行卡开户名" v-model="username" :attr="{ maxlength: 10}"></mt-field>
            <mt-field label="银行卡号：" placeholder="您的银行卡账号" v-model="number" :attr="{ maxlength: 19 }"></mt-field>
            <mt-field label="证件号：" placeholder="开户人身份证号码" :attr="{ maxlength: 18,minlength:15 }" v-model="idcard">
            </mt-field>
        </div>

        <div class="bank-item">
            <mt-field label="手机号码：" placeholder="输入支付手机号码" :attr="{ maxlength: 15 }" v-model="phone" readonly
                :disableClear="true">
                <i class="captbtn" @click="tuxingCode">获取图形码</i>
            </mt-field>
            <mt-field disableClear label='图形码' placeholder="请输入图形码" type="text" v-model="tuxingModel">
                <i class="tuxing"><img :src="imgs" alt=""></i>
            </mt-field>
            <mt-field label="验证码：" placeholder="输入手机验证码" v-model="captcha">
                <div class="captbtn" v-if="captbtn">{{ captlist+'s后重新获取' }}</div>
                <button class="captbtn1" @click="captbtnfn" v-else>获取验证码</button>
            </mt-field>
        </div>

        <div class="bank-btn" @click="submit">立即提交</div>

        <mt-popup v-model="bankVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="quxiaofn">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="bankslots" value-key="name" @change="bankchange"></mt-picker>
        </mt-popup>

    </div>
</template>

<script type="text/javascript">
    export default {
        data() {
            return {
                topnav: {
                    title: '绑定银行卡'
                },
                userid: this.$cookie.get('userid'),
                bankId: '',
                bank: '',
                bankModel: '',
                bankname: '',
                username: '',
                number: '',
                idcard: '',
                phone: '',
                captcha: '',
                oldata: {},
                captbtn: false,
                captlist: 89,
                bankVisible: false,
                bankslots: [{
                    flex: 1,
                    values: [],
                    textAlign: 'center'
                }],
                tuxingModel: '',
                imgs: '',
            }
        },
        created() {
            let that = this;
            this.phone = this.$cookie.get('userPhone');
            Indicator.open();
            axios.get(this.Api + '/useraccount/getAllBankList').then(res => {
                if (res.data.errno == 0) {
                    let data = res.data.data;
                    data.forEach(post => {
                        that.bankslots[0].values.push(post);
                    });
                } else {
                    Toast(res.data.msg);
                };
                Indicator.close();
            }).catch(err => {
                Indicator.close();
            })
        },
        methods: {
            //图形验证码
            tuxingCode() {

                 let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
                 let codeReg =/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                 if (reg.test(this.phone) == false||this.phone == '') {
                 Toast('请输入正确的手机号码');
                 return;
                 }

                 axios.get(this.Api + 'register/getGraphValidateCode?mobile=' + this.phone).then(res => {
                 this.imgs = res.data.data+ '&random='+ new Date().getTime();;
                 })

            },
            bankfn() {
                this.bankVisible = true;
            },
            quedingfn() {
                if (this.bankVisible) {
                    this.bankVisible = false;
                    this.bankId = this.bankModel ? this.bankModel.id : '';
                    this.bank = this.bankModel ? this.bankModel.name : '';
                }
            },
            quxiaofn() {
                if (this.bankVisible) {
                    this.bankVisible = false;
                }
            },
            bankchange(picker, values) {
                this.bankModel = values[0];
            },
            //
            phoneblur() {
                let phonereg = /^1[3|4|5|6|7|8|9]\d{9}$/;
                if (this.phone.length == 0 || !phonereg.test(this.phone)) {
                    MessageBox('提示', '请输入正确的手机号码！');
                    return true;
                } else {
                    return false;
                }
            },
            idCardblur() {
                let idreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (this.idcard.length == 0 || !idreg.test(this.idcard)) {
                    MessageBox('提示', '请输入正确的身份证号码！');
                    return true;
                } else {
                    return false;
                }
            },
            captbtnfn() {
                console.log('1')
                let that = this;
                if (this.tuxingModel == '') {
                    Toast('请输入图形验证码！')
                    return
                }
        
                  
                    axios({
                        url: this.Api + 'useraccount/sendCode?phone=' +
                            that.phone + '&graphValidateCode=' + this.tuxingModel,
                        method: "get",
                        headers: {
                            "X-Nideshop-Token": this.$cookie.get('token')
                        }
                    }).then(res => {
                        console.log(res,'8')
                        if (res.data.errno ==0) {
                            Toast(res.data.errmsg);
                            that.captlist = 60;
                            that.captbtn = true;
                            var timer = setInterval(function () {
                            that.captlist--;
                            if (that.captlist == 0) {
                            that.captbtn = false;
                            that.captlist = 89;
                            clearInterval(timer);
                            };
                            }, 1000);
                          }else{
                          Toast(res.data.errmsg);
                          that.captbtn = false;
                          }
                    });
                
            },
            submit() {
                let that = this;
                var han = /^[\u4e00-\u9fa5]+$/;
                if (this.bankname == '') {
                    Toast("开户行支行不能为空");
                    return;
                } else if (this.username == '') {
                    Toast("开户名不能为空");
                    return;
                } else if (this.bank == '') {
                    Toast("开户行不能为空");
                    return;
                } else if (this.number == '') {
                    Toast("银行卡卡号不能为空");
                    return;
                } else if (this.captcha == '') {
                    Toast("验证码不能为空");
                    return;
                }
                if (this.phoneblur() || this.idCardblur()) {
                    return false;
                };

                Indicator.open();
                let post = {
                    "userid": this.userid,
                    "username": this.username,
                    "idcard": this.idcard, //身份证
                    "bankName": this.bank,
                    "bankCode": this.bankId, //银行编号
                    "bankBranch": this.bankname,
                    "bankCardNo": this.number,
                    "bankMobile": this.phone
                };
                console.log(post)
                axios({
                    url: this.Api + '/useraccount/save?code=' + that.captcha,
                    method: "post",
                    data: post,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    Toast(res.data.errmsg);
                    Indicator.close();
                    if (res.data.errno == 0) {
                        this.$router.go(-1);
                    }
                }).catch(err => {
                    // Toast(err.message);
                    Indicator.close();
                })
            }
        }
    }

</script>

<style scoped>
    .mint-header {
        background: #ff911e;
        height: auto;
        border-bottom: none;
        font-size: .8rem;
    }

    .glode {
        min-height: 100vh;
        font-size: 0.65rem;
        padding-bottom: 3.5em;
    }

    .bank-item {
        overflow: hidden;
        margin-top: 0.5rem;
        background: white;
        font-size: 14px;
    }

    .bank-title {
        padding: 0 10px;
        min-height: 44px;
        line-height: 44px;
    }

    .bank-img-list {
        padding: 0 10px;
        position: relative;
        margin-bottom: 20px;
    }

    .selfied>>>.upload {
        height: 150px;
    }

    .selfied .bank-img-text {
        height: 150px;
    }

    .bank-img-list>>>.el-button {
        width: 5em;
        font-size: 0.6rem;
        float: left;
    }

    .bank-img-list>>>.el-button--small {
        padding: 0.5em 0.5em;
    }

    .bank-img-text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0.7em 10px 0.7em 180px;
        height: 100px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .bank-img-text p {
        font-size: 13px;
        color: #666;
        margin-bottom: 1em;
    }

    .mint-cell {
        border-top: 1px solid #e6e6e6;
    }

    .glode>>>.mint-cell {
        border-bottom: none;
    }

    .tuxing {
        width: 35%;
        height: 1.4rem;
    }

    .glode>>>.mint-field .mint-cell-title {
        width: 7em;
        padding-right: 0.8em;
        text-align: justify;
        text-align-last: justify;
        color: #333;
    }

    .glode>>>.mint-cell-wrapper {
        font-size: 14px;
        background-image: none;
    }

    .captbtn {
        display: inline-block;
        padding-left: 0.5rem;
        margin-left: 0.5em;
        line-height: 1.8em;
        border-left: 1px solid #ccc;
        color: red;
    }

   .captbtn1 {
       margin: 0;
       padding: 0;
       border: 1px solid transparent;
       outline: none;
       background-color: #fff;
   display: inline-block;
   padding-left: 0.5rem;
   margin-left: 0.5em;
   line-height: 1.8em;
   border-left: 1px solid #ccc;
   color: red;
   
   }

    .captTime {
        color: #999;
    }

    .bank-btn {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        font-size: 0.7rem;
        color: white;
        background: #ff911e;
        line-height: 3em;
        text-align: center;
        z-index: 999;
    }

    .mint-popup {
        width: 100%;
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

    .glode>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .glode>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .glode>>>.imgClear {
        display: none;
    }

</style>
