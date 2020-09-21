<template>
    <div class="mainbox" v-cloak>
        <topnav :topnav="topnav"></topnav>
        <div class="shopbtns">
            <div class="name">
                <div class="fs">营销</div>
            </div>
            <div class="btnbox">
                <div class="btnlist" @click="goyouhui">
                    <img src="@/assets/images/storeplat/spxx_icon_yh.png">
                    <p>优惠券</p>
                </div>
                <div @click="gomanjian" class="btnlist">
                    <img src="@/assets/images/storeplat/spxx_icon_mj.png">
                    <p>满减</p>
                </div>
                <div @click="gomess" class="btnlist">
                    <img src="@/assets/images/storeplat/spxx_icon_zk.png">
                    <p>折扣</p>
                </div>
            </div>
        </div>
        <!-- <div class="shopbtns">
            <div class="name">
                <div class="fs">配送</div>
            </div>
            <div class="btnbox">
                <div class="btnlist" @click="godada">
                    <img src="@/assets/images/storeplat/spxx_icon_da.png">
                    <p>达达</p>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '应用管理',
                },
                levelId: this.$cookie.get("level_id"),
                postdata: {},
                type: 0,
                seq: this.$cookie.get('seq'),
                facadePhoto: '',
                backshqPd: sessionStorage.getItem('applogin'), // app登录判断
                showbtnbox: true,
                userPhone: this.$cookie.get("userPhone"),
            }
        },
        mounted() {

        },
        methods: {
            //去到折扣列表
            gomess() {
                this.$router.push({
                    path: '/storeplat/Fullactlist',
                    query: {
                        fenlei: 0
                    }
                })
            },
            //去到优惠券
            goyouhui() {

                this.$router.push({
                    path: '/storeplat/IssueCoupons'
                })
            },
            //跳转到满减列表
            gomanjian() {
                this.$router.push({
                    path: '/storeplat/Fullactlist',
                    query: {
                        fenlei: 1
                    }
                })
            },
            //跳转到达达
            godada() {
                this.$router.push({
                    path: '/storeplat/Express'
                })
            },


        }
    }

</script>

<style scoped>
    .mainbox {
        min-height: 100vh;
        background: #f5f5f5;
        overflow: hidden;
        padding-bottom: 50px;
    }


    .shopbtns {
        width: 100%;
    }

    .name {
        height: 2.25rem;
        line-height: 2.25rem;
        padding: 0 0.4rem;
        font-size: 0.65rem;

    }

    .name .fs {
        padding-left: 0.5rem;
        position: relative;
    }

    .name .fs::before {
        content: '';
        width: 3px;
        height: 16px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.8rem;
    }

    .btnbox {
        overflow: hidden;
        padding: 0.6rem 0.5rem;
        display: flex;
        flex-wrap: wrap;
        background-color: #fff;
    }

    .btnbox .btnlist {
        font-size: 0.58rem;
        color: #333;
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .btnbox .btnlist img {
        display: block;
        width: 2rem;
        height: 2rem;

    }

    .btnbox .btnlist p {
        text-align: center;
        margin-top: 0.3rem;
    }

</style>
