<template>
    <div class="become-member">
        <topnav :topnav="topnav"></topnav>

        <div class="mainbox">

            <div class="merinfo">
                <div>需支付金额(元)</div>
                <div style="margin-top: 0.8rem;font-size: 0.75rem;color: #333;">￥{{money}}</div>
            </div>
            <div class="sname">支付方式</div>
            <div class="bootinfo">
                <div class="between-flex">
                    <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/weixin.png" />微信支付</div>
                    <div>
                        <div class="select-pay" :class="{'quan':checked=='1'}" @click="checkedfn(1)" ref="weixin"
                            id="weixin">
                            <i class="el-icon-check select"></i>
                        </div>
                    </div>
                </div>

                <div class="between-flex">
                    <div class="flex-pic"><img class="weixin-pic" src="@/assets/images/blank.png" />银联支付
                    </div>
                    <div>
                        <div class="select-pay" :class="{'quan':checked=='2'}" @click="checkedfn(2)" ref="weixin"
                            id="weixin">
                            <i class="el-icon-check select"></i>
                        </div>
                    </div>
                </div>

            </div>
            <div class="footer">
                <div class="tijiao">
                    立即支付
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
                    title: '付款',
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
            };
        },
        created() {

        },
        mounted() {

        },
        methods: {
            //去评价
            checkedfn(val) {
                this.checked = val == this.checked ? '' : val;
                this.way = val;

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
    }

    .mainbox .merinfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 5rem;
    }

    .mainbox .sname {
        background-color: #f5f5f5;
        line-height: 2rem;
        padding: 0 0.5rem;
    }

    .mainbox .bootinfo {
        padding: 0 0.5rem;
    }


    .mainbox .bootinfo .stext>>>.mint-radio-input:checked+.mint-radio-core {

        background-color: #ff9d19;
        border-color: #ff9d19;
    }

    .mainbox .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        position: absolute;
        bottom: 2rem;
    }

    .mainbox .footer .tijiao {
        width: 60%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff911e;
        border-radius: 0.8rem;
        color: #fff;
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
        margin-top: 0.8rem;

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
        color: #ff911e;
        font-size: .916667rem;
    }

    .quan {
        border-color: #ff911e;
        background: #ff9d19;
    }

    .quan i {
        display: inline-block;
        font-size: .7rem;
        color: white;
        line-height: .75rem;
    }

</style>
