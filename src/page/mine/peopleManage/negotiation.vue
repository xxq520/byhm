<template>
    <div class="become-member">
        <topnav :topnav="topnav"></topnav>

        <div class="mainbox">

            <div class="merinfo">
                <div class="sname">退款信息</div>
                <div class="stext">
                    <div><span style="color: #999;">退款金额：</span>￥{{money}}</div>
                    <div><span style="color: #999;">退款金额：</span>￥{{yuyi}}</div>
                </div>

            </div>
            <div class="bootinfo">
                <div class="sname">退款进度</div>

                <div style="height: 200px;">
                    <el-steps direction="vertical" :active="step">
                        <el-step title="买家" :description="'发起退款审核;退款原因：'+maijia"></el-step>
                        <el-step title="商家" :description="isPass"></el-step>
                        <el-step title="商家" :description="'商家拒绝退款;拒绝原因：'+shajia" v-if="stepShow==3"></el-step>
                        <el-step title="商家" description="商家已退款" v-else></el-step>
                    </el-steps>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                topnav: {
                    title: '协商记录',
                },
                seq: this.$cookie.get('seq'),
                isActive: this.$cookie.get('isActive'),
                card: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                cardType: this.$cookie.get('cardType'),
                orderSn: this.$route.query.orderSn,
                money: '',
                yuyi: '原路退回',
                step: 1,
                isPass: '',
                maijia: '',
                shajia: '',
                stepShow:0,
            };
        },
        created() {

        },
        mounted() {
            this.getDetali();
        },
        methods: {

            //协商记录
            negotiation() {

            },
            //获取详情
            getDetali() {
                let post = {
                    orderSn: this.orderSn
                };
                axios({
                    url: this.Api1 + '/order/cb/negotiationRecord',
                    params: post,
                    method: "get",
                    headers: {
                        "content-type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data.list[0];
                        this.money = data.actualPrice;
                        switch (data.currentStatus) {
                            case 0:
                                this.step = 1;
                                break;
                            case 1:
                                this.step = 2;
                                break;
                            case 2:
                                this.step = 3;
                                break;
                            case 3:
                                this.step = 3;
                                break;
                        }
                        this.stepShow = data.currentStatus;
                        this.maijia = data.applyReason;
                        this.isPass = data.statusDesc;
                        this.shajia = data.rejectReason;
                    }
                })
            },

        },

    };

</script>

<style scoped>
    .become-member {
        background: #f5f5f5;
        min-height: 100vh;

        overflow: hidden;

    }

    .mainbox {
        padding: 0.5rem;
        font-size: 0.62rem;
        color: #666;
    }



    .mainbox .merinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .sname {
        line-height: 1.6rem;
        position: relative;
        text-indent: 1em;
        color: #666;
    }

    .mainbox .sname::before {
        content: '';
        width: 2px;
        height: 14px;
        background-color: #ff911e;
        position: absolute;
        left: 0.2rem;
        top: 0.52rem;

    }

    .mainbox .merinfo .stext {
        padding: 0.5rem 0.1rem;
        line-height: 1rem;
        border-top: 1px solid #eee;
    }

    .mainbox .merinfo .foot {
        display: flex;
        align-items: center;
        line-height: 1.6rem;

    }

    .mainbox .merinfo .foot div {
        width: 50%;
        display: flex;
        align-items: center;

    }

    .mainbox .merinfo .foot img {
        width: 0.75rem;
        width: 0.75rem;
    }

    .mainbox .bootinfo {
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-radius: 0.4rem;
        padding: 0.3rem;

    }

    .mainbox .bootinfo .stext {
        line-height: 1.4rem;
        border-top: 1px solid #eee;
    }

    .bootinfo>>>.el-step__title.is-finish {
        color: #ff911e;
    }

    .bootinfo>>>.el-step__description.is-finish {
        color: #ff911e;
    }

    .bootinfo>>>.el-step__head.is-finish {
        color: #ff911e;
        border-color: #ff911e;
    }

    .bootinfo>>>.el-step__description.is-process {
        color: #666;
    }

    .bootinfo>>>.el-step__title.is-process {
        font-weight: 500;
        color: #666;
    }

    .bootinfo>>>.el-step__head.is-process {
        color: #666;
        border-color: #666;
    }

</style>
