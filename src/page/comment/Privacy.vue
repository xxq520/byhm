<template>
    <div class="mainbox">
        <div class="top_nav" v-if="backapp!='move'">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="content">      
            <img src="@/assets/images/contract/PrivacyPolicy.png" alt="" preview="1" preview-text="隐私政策">
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: "隐私政策"
                },
               imgUrl:[{
               url:require("@/assets/images/contract/PrivacyPolicy.png"),
               name: '隐私政策'
               }],
                backapp: this.$route.query.backapp,
                isShow:false
            }
        },
        mounted() {
            
        },
        methods: {
            appear(){
              this.$store.commit("pictureView3");
            },
            goback() {                 
                if (this.$route.query.platform =='android'||this.$route.query.platform =='Android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios'||this.$route.query.platform =='Ios') {              
                    window.action.backAPPiOS()             
                } else {
                    this.$store.commit("bbb");
                    this.$router.go(-1)
                }
            },
        }
    }

</script>

<style scoped>
    .mainbox {
        background-color: #fff;
        box-sizing: border-box;
        font-size: 0.58rem;
        color: #666;
        position: relative;
        padding-top: 1.3rem;
        width: 100%;
        height: 100%;
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
        z-index: 9;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 16px ;
    }

    .top_nav span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;
    }

    .mainbox .content {

        padding: 1.3rem;
        width: 100%;
        height: 100%;
    }

    .mainbox .jianjie {

        margin-bottom: 1.2rem;
    }

    .mainbox .info p {
        font-size: 0.7rem;
        color: #111;
        height: 1.3rem;
        line-height: 1.3rem;
        margin-bottom: 0.3rem;
    }

    .mainbox .info p {
        font-size: 0.66rem;
        color: #111;
        height: 1.3rem;
        line-height: 1.3rem;
    }

    .mainbox .info .mian {
        margin-bottom: 0.6rem;
    }

</style>
