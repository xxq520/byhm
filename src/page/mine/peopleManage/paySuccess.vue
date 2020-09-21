<template>
    <div class="become-member">
        <topnav :topnav="topnav"></topnav>

        <div class="mainbox">
            <div class="imgs"><img src="@/assets/images/user/by_bgima_1.png" alt=""></div>
            <div style="color: #333;font-size: 0.75rem;line-height: 1.2rem;">{{paytitle}}</div>
            <div style="color: #999;font-size: 0.55rem; line-height: 1.2rem;margin-bottom: 2rem;">您已完成支付</div>
            <div class="btn" v-if="!id">查看订单</div>
            <div class="btn A1" v-if="!id">返回首页</div>
            <div class="btn " v-if="id" @click="goback">完成</div>
        </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '付款',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                id: this.$route.query.id,
                money: 179.91,
                value: '',
                checked: 2,
                way: 2,
                paytitle: '支付成功',
                salenumber: this.$route.query.salenumber,
            };
        },
        created() {
            if (this.salenumber) {
             this.getDetali();
            }
        },
        mounted() {
            if (this.id) {
                this.paytitle = "核销成功"
            }
        },
        methods: {
            //去评价
            //获取详情
            getDetali() {
                let post = {
                    orderSn: this.salenumber,
                    type: 0
                };
                axios({
                    url: this.Api1 + '/order/get',
                    params: post,
                    method: "get",
                    headers: {
                        "content-type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                       if(res.data.data.payStatus != "支付成功"){
                            this.$router.push({
                            path: '/merchorder',query:{merchid:0}
                            })
                       }
                    }
                })
            },
            goback(){
              this.$router.go(-1)
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
