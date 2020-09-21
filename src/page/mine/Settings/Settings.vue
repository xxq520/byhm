<template>
    <div class="settings">
        <!-- 头部 -->
        <!-- <topnav :topnav="topnav"></topnav> -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <!-- 内容信息 -->
        <div class="mineContent">
            <mt-cell title="个人信息" class="line" is-link to="/mine/information"></mt-cell>
            <mt-cell title="收货地址" class="line" is-link @click.native="goshqArea"></mt-cell>
            <mt-cell title="银行卡" class="line" is-link to="/settings/bankList"></mt-cell>
            <mt-cell title="修改密码" class="line" is-link to="/settings/ChangeCode" v-if="applogin!=true"></mt-cell>
            <mt-cell title="关于我们" class="line" is-link to="/settings/About"></mt-cell>
        </div>
        <div class="loginout" v-if="applogin!=true">
            <mt-button type="default" id="logoutbtn" @click="loginOut">退出当前账号</mt-button>
        </div>
    </div>
</template>

<script type="text/javascript">
    //import clearCookie from '@/assets/js/clearCookie';
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '设置'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist:[],
                userName: this.$cookie.get('userPhone'),
               
            }
        },
        mounted() {
            //判断是否是在app登录跳转回来的
            if (sessionStorage.getItem('applogin')) this.applogin = JSON.parse(sessionStorage.getItem('applogin'))
            let params = {
                id: this.id,
                type: this.type
            }
            axios.get(this.Api + '/user/queryUserData', {
                params: params
            }).then(res => {
                console.log(res);
                if (res.data.code == 500) {
                    Toast(res.data.msg)
                };
                this.info = res.data;
                //this.advatar = res.data.avatar==null?this.advatar:res.data.avatar;
            });
            // this.advatarfn();
            axios.get(this.Head + "rest/user/getUserImgUrlBySeq?seq=" + this.seq).then(res => {
                if (res.data.status == 200) {
                    this.advatar = res.data.data;
                }
            });
          
        },
        methods: {
            loginOut() {
                let that = this;
                MessageBox({
                    title: "",
                    message: '<p style="text-align:center;text-indent:0;">确定退出登录?<p>',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        sessionStorage.removeItem('applogin'); // 520app登录跳转识别
                        clearCookie();

                        setTimeout(function () {
                            if (that.applogin) {
                                window.action.loginOut();
                            } else {
                                that.$router.push({
                                    path: '/login'
                                });
                            }
                        }, 50);
                    }
                });
            },


            goback() {
                this.$router.push({
                    path: '/mine'
                });
            },
            goshqArea() {
                 this.$router.push('/areaList')              
            },
  
        },

    }

</script>

<style scoped>
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
        z-index: 1000;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .settings {
        padding-top: 40px;
        min-height: 100vh;
        background: #eee;
    }

    .settings .mineContent {
        padding: 0 0.2222rem;
        background: white;
    }

    .settings .mineContent .line {
        font-size: 0.6222rem;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
    }

    .settings .mineContent .line #avatar {
        width: 30px;
        height: 30px;
    }

    .settings .mineContent .line #clear {
        width: 2.7778rem;
        height: 0.8444rem;
    }

    .settings .mineContent .line .item {
        font-size: 15px;
        color: #666666;
    }

    .mint-cell {
        min-height: 2.4rem;
    }

    .settings>>>.mint-msgbox {
        width: 60%;
    }

    .settings>>>.mint-cell-wrapper {
        background: none;
    }

    .settings>>>.mint-cell:last-child {
        background: none;
    }

    .settings>>>.mint-cell-title {
        font-size: 15px;
    }

    .code02 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 20rem;
        padding: 0 10px;
        line-height: 1.8em;
    }

    .loginout {
        height: 2.2222rem
            /* 100/45 */
        ;
        margin-top: 0.5rem;
    }

    .loginout #logoutbtn {
        color: #ff0000;
        font-size: 0.6667rem
            /* 30/45 */
        ;
        background: #fff;
        width: 100%;
        border-radius: 0;
        border: none;
    }

    .loginout>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

</style>
