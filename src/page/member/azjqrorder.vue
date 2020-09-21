<template>
    <div class="buy-card-record">
        <!-- 头部 -->
        <div class="top">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
       <img src="@/assets/images/hmvip.png" alt="">
    </div>
</template>

<script>
    export default {
        name: "cashRegister",
        data() {
            return {
                topnav: {
                    title: '确认订单',
                },
                money: '',
                name: '',
                code: '',
                xuan: '',
                way: '', //支付方式 0-微信 2-银联
                checked: '', //是否选中
                visible: false,
                areadata: null,
                 seq: this.$route.query.seq,
                 username: this.$route.query.username,
                 password: this.$route.query.password,
                cardType: this.$route.query.cardType,
                 level: this.$route.query.levelId,
                systemCode: this.$route.query.systemCode,
                post: {},
            };
        },
        created() {
            this.submit();
        },
        mounted() {
      
        },
        methods: {
            goback() {
                this.$store.commit("bbb");
                this.$router.push({
                    path: '/'
                })
            },
            submit() {
                // 防止ios在微信浏览器打开键盘弹起后页面上滑
                window.scrollTo(0, 0);
                let post = {
                mobile: this.username,
                password: this.password,
                systemCode:this.systemCode
                };
                Indicator.open();
                axios.post(this.Api + '/auth/login', qs.stringify(post)).then(res => {
                    console.log(res,'85')
                    let data = res.data;
                    Indicator.close();
                    if (data.code == 0) {
                        // cookie保存登录信息
                        // console.log(data, '91')
                        appCookie(data);
                        this.$router.push({
                            path: '/azjqrenorder',
                            query:{seq:this.seq,cardType:this.cardType,level:this.level, systemCode:this.systemCode}
                        })
                    } else {
                    sessionStorage.setItem('fullPath',window.location.href);
                        this.$router.push({
                            path: '/login'
                        })
                        Toast(res.data.msg)
                    }
                }).catch((err) => {
                    Indicator.close();
                  Toast(err.message);   
                })
            },
        }
    }

</script>

<style scoped>
    /* >>>可以修改某一个标签里面的其他组件样式 */
    .top {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
    }

    .top i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;

    }

    .mian {
        padding: 0.5rem;
    }

    .cart-list {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 10px;
        background-color: #fff;
        font-size: 14px;
        line-height: 1.4em;
        margin-bottom: 0.5rem;
    }

    .cart-list label {
        float: left;
        width: 7.5rem;
        color: #333;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        width: calc(100% - 7.7em);
        color: #333;
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
        font-size: 0.7rem;
        color: #333;
        word-break: break-all;
    }

    .buy-card-record {
        height: 100vh;
        background: #eee;
    }

    .head>>>.mint-header {
        background: hsl(27, 100%, 57%);
    }

    .money {
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .625rem;
    }

    #price {
        font-size: 0.7rem;
        color: #ec0746;
        margin-left: 14px;
    }

    .flex-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background: #ffffff;
        padding: 1.1rem 0;
    }

    .flex-box div:first-child {
        font-size: .625rem;
        color: #666;

    }

    .flex-box div:last-child {
        font-size: .541667rem;
        color: #666666;
    }

    .padd {
        padding: 0 0.5rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
    }

    .xinxi {
        padding: 0 0.5rem;
        background-color: #fff;
        margin-bottom: 0.5rem;
    }

    .mb-10 {

        border-bottom: 1px solid #eee;
    }

    .l-s-1 {
        letter-spacing: 1px;
    }

    #card-input {
        height: 40px;
        padding-left: 30px;
        font-size: 12px;
        width: 10.416667rem;
    }

    .use-card {
        text-align: right;
        font-size: 12px;
        color: #194dd1;
        padding-right: 1.25rem;
    }

    .use-card a {
        border-bottom: 1px solid #194dd1;
    }

    .next-box {
        text-align: center;
        margin-top: 15px;
    }

    .next-btn {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin: 0 auto;
        width: 9.375rem;
        padding: 0.5rem 0;
        border-radius: 20rem;
        background: -webkit-linear-gradient(left,
                #ff9500,
                #ff8c39);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ff9500, #ff8c39);
        /* 标准的语法 */
        text-align: center;
        color: #ffffff;
        font-size: 15px;
        line-height: 1.4em;
        letter-spacing: 2px;
    }

    .go-back {
        width: 10px;
        position: absolute;
        left: 10px;
        top: 18px;
    }

    .i-icon {
        width: .291667rem;
        height: .666667rem;
    }

    .next-btn span {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .next-btn>>>.mint-spinner-fading-circle {
        display: inline-block;
        margin-right: 5px;
        padding-top: 0.2em;
    }

    .pay-way {
        background: #f2f2f2;
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
        color: #333333;
        font-size: .625rem;
        letter-spacing: 3px;
        font-weight: bold;
    }

    .between-flex {
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        font-size: .625rem;
        color: #666666;
        padding: 0 0.833333rem;
        background: #ffffff;
        margin-bottom: 1px;
    }

    .flex-pic {
        display: flex;
        align-items: center;
    }

    .weixin-pic {
        width: 1.333333rem;
        margin-right: .791667rem;
    }

    .select-pay i {
        display: none;
    }

    .select-pay {
        width: .833333rem;
        height: .833333rem;
        border-radius: 50%;
        font-weight: bold;
        border: 1px solid #a5a5a5;
    }

    .select {
        color: #F52052;
        font-size: .916667rem;
    }

    .quan {
        border-color: #F52052;
        background: #F52052;
    }

    .quan i {
        display: inline-block;
        font-size: .7rem;
        color: white;
        line-height: .75rem;
    }

</style>
