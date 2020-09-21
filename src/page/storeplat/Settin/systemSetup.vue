<template>
    <div class="settings">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>

        <!-- 内容信息 -->
        <div class="mineContent">
            <mt-cell title="基础设置" class="line" is-link :to="'/storeplat/basic?id='+id"></mt-cell>
            <mt-cell title="店铺设置" class="line" is-link :to="'/storeplat/storeSetup?id='+id"></mt-cell>
            <mt-cell title="提现密码设置" class="line" is-link :to="'/storeplat/Payword?id='+id"></mt-cell>
            <mt-cell title="配送设置" class="line" is-link :to="'/storeplat/distribution?id='+id"></mt-cell>
            <mt-cell title="优惠规则设置" class="line" is-link :to="'/storeplat/Preferential?id='+id"></mt-cell>
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
                    title: '系统设置'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false,
                arealist: [],
                userName: this.$cookie.get('userPhone'),
                id: this.$route.query.id,

            }
        },
        mounted() {

        },
        methods: {



        },

    }

</script>

<style scoped>
    .settings {

        min-height: 100vh;
        background: #eee;
    }


    .settings .mineContent {
        margin-top: 0.5rem;
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
        font-size: 0.58rem;
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
