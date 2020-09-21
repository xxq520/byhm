<template>
    <div class="become-member">
        <topnav :topnav="topnav"></topnav>

        <div class="mainbox" v-if="status">
            <div class="imgs"><img src="@/assets/images/user/by_bgima_1.png" alt=""></div>
            <div style="color: #333;font-size: 0.75rem;line-height: 1.2rem;">提现成功</div>
            <div style="color: #999;font-size: 0.55rem; line-height: 1.2rem;margin-bottom: 2rem;">预计2~3个工作日到账
            </div>
            <div class="btn" @click="Finished">完成</div>
        </div>
        <div class="mainbox" v-else>
            <div class="imgs"><img src="@/assets/images/user/by_bgima_2.png" alt=""></div>
            <div style="color: #333;font-size: 0.75rem;line-height: 1.2rem;">提现申请已提交</div>
            <div style="color: #999;font-size: 0.55rem; line-height: 1.2rem;margin-bottom: 2rem;">等待平台审核
            </div>
            <div class="btn" @click="Finished">完成</div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '提现',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                messagebtn: this.$route.query.merchid,
                money: 179.91,
                value: '',
                checked: 2,
                way: 2,
                status:false
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //完成
            Finished() {
                this.$router.push({
                    path: '/storeplat/assetsment'
                })
            },


        },

    };

</script>

<style scoped>
    .become-member {
        background: #fff;
        min-height: 100vh;
        overflow: hidden;

    }

    .mainbox {

        font-size: 0.62rem;
        color: #666;
        display: flex;
        flex-direction: column;

        align-items: center;
        height: 90vh;
    }

    .mainbox .imgs {
        width: 50%;
        margin-top: 3rem;
        margin-bottom: 1rem;

    }

    .btn {
        width: 60%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
        margin-top: 0.8rem;
    }

    .A1 {
        background-color: #FFF;
        color: #ff911e;
        border: 1px solid #ff911e;


    }

</style>
