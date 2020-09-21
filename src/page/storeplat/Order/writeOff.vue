<template>
    <div class="mainbox" v-cloak>
        <topnav :topnav="topnav"></topnav>
        <div class="main">
            <input type="text" placeholder="请输入核销码" v-model="shopCard">
            <div class="hexiao" @click="goConfirm()">核销</div>
        </div>
        <div class="footer">
            <div class="btn" @click="sweepCode()">
                <img src="@/assets/images/storeplat/sj_icon_sma.png"> 扫码核销
            </div>
            <div class="miaoshu">扫一扫更方便噢</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '扫码核销',
                },
                shopCard: '',
            }
        },
        mounted() {

        },
        methods: {
            //查看核销商品
            goConfirm() {
                if (this.shopCard == null || this.shopCard == '') {
                    Toast('请输入待核销的商品核销码')
                    return false
                }
                let post = {
                    code:this.shopCard,
                };
                axios({
                    url: this.Api1 + '/order/getOrderByCode',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                           this.$router.push({
                           path: '/storeplat/Confirmwrite',
                           query: {
                           Card: this.shopCard
                           }
                           })
                    } else {
                        Toast(res.data.message)
                    }
                })



            
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
                        if (urls.indexOf('/storeplat/Confirmwrite') >= 0) {
                            axios.get(api + urls).then(res => {
                                Indicator.close();
                                that.$router.push({
                                    path: '/storeplat/Confirmwrite',
                                    query: res.data.Card
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
        }
    }

</script>

<style scoped>
    .mainbox {
        min-height: 100vh;
        background: #fff;
        overflow: hidden;
        padding-bottom: 60px;
    }

    .main {
        width: 90%;
        height: 1.5rem;
        border-radius: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f5f5f5;
        margin: 1rem 5%;
        padding-left: 0.8rem;
    }

    .main input {
        flex: 1;
        line-height: 1.5rem;
        font-size: 0.6rem;
        color: #333;
    }

    .main .hexiao {
        width: 3rem;
        height: 1.5rem;
        background-color: #333;
        color: #fff;
        font-size: 0.65rem;
        border-radius: 0.8rem;
        line-height: 1.5rem;
        text-align: center;
    }

    .footer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 0;
        padding-bottom: 2rem;
        font-size: 0.55rem;
        color: #999;
    }

    .footer .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 1.5rem;
        background-color: #ff9d19;
        color: #fff;
        font-size: 0.68rem;
        border-radius: 0.8rem;
        margin-bottom: .5rem;
    }

    .footer .btn img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.5rem;
    }

</style>
