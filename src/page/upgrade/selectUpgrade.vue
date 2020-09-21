<template>
    <div class="order">
        <!-- 头部 -->
        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
            <p style="font-size: 14px;margin-right: 10px;" @click="goOrder">订单</p>

        </div>
        <div class="order-box">
            <div class="info">
                <p>开通超级会员身份立享专属特权</p>
                <div class="img_box">
                    <img :src="image2" alt="">
                </div>
            </div>
        </div>
        <div>

            <div class="mainBox">
                <p class="title">开通服务</p>
                <ul>
                    <li v-for="(item,idx) in list " @click="changelevel(item.cardType,idx)" :class="{abs:cur_tab==idx}">
                        <div class="a1">
                            <div class="block_1" :class="{add:cur_tab==idx}">{{item.levelName}}</div>
                            <div class="block_2" :class="{add:cur_tab==idx}">{{item.title}}</div>
                        </div>
                        <div class="a2">{{item.price}}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fix_box">
            <p class="payFor" @click="goToCash">立即开通</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "confirmOrder",
        data() {
            return {

                topnav: {
                    title: '惠盟用户福利',
                },
                selected: '1',
                userid: this.$cookie.get('userid'),
                operator: true,
                year: false,
                allPrice: '',
                operatorPrice: '',
                yearPrice: '',
                level: this.$route.query.level,
                image2: '',
                price: '',
                levelid2: '',
                initlevel: this.$cookie.get('level_id'),
                cardType: this.$cookie.get('cardType'),
                isActive: this.$cookie.get('isActive'),
                list: [],
                superior: this.$cookie.get('superior'),
                isPartner: this.$cookie.get('isPartner'),
                cur_tab: 0,
                card: 1,
            };
        },

        created() {
            console.log(this.isActive)
            if (this.isActive == 1 || (this.superior != 0 && this.superior && this.superior != 10948)) {
                this.$router.push({
                    name: "toBecomeMember",
                    params: {
                        code: 0,
                        level: 1,
                        cardType: this.cardType
                    }
                });
            }
        },
        mounted() {
            this.getImg();

        },
        computed: {
            className() {
                return function (idx) {
                    if (this.cur_tab == idx) {
                        return 'act'
                    }
                }
            }
        },
        methods: {
            goOrder() {
                this.$router.push('/myorder')
            },
            getImg() {
                axios({
                    url: this.Api + 'agency/rightsInfo?type=0&showStatus=5&userId=' + this.userid,
                    method: "get",
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    },
                }).then(res => {
                    // console.log(res)
                    this.image2 = res.data.data;
                    this.list = res.data.list;
                });
            },

            changelevel(cardType, index) {
                this.card = cardType;
                this.cur_tab = index;
                // console.log(this.card, this.cur_tab)
            },
            goback() {
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                // console.log(this.$route.query.from);
                if (this.$route.query.platform == 'android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    window.action.backAPPiOS();
                } else {
                    this.$store.commit("bbb");
                    this.$router.push('/')
                }

            },

            //跳转到收银台

            goToCash() {
                console.log(this.$router);

                if (!this.userid) {
                    sessionStorage.setItem('fullPath', this.$router.history.current.fullPath);
                    this.$router.push('/login');
                    return;
                }
                this.$router.push({
                    path: "/cashRegister",
                    query: {
                        cardType: this.card,
                        level: 1,
                        code: 0
                    }
                });
            }

        },

    };

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

    .order-box .info p {
        margin-top: 0.6rem;
        padding: 0 .4444rem;
        height: 1.6rem;
        line-height: 1.6rem;
        font-size: .5778rem;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
    }

    .order-box .img_box {
        padding: .6rem 0.5rem;
    }

    .fix_box {
        display: flex;
        padding: 0 .4444rem;
        height: 2.1778rem;
        line-height: 2.1778rem;
        font-size: .6222rem;
        color: #666666;
        justify-content: center;
        background-color: #ffffff;
        width: 100%;
        box-sizing: border-box;
        align-items: center;
        margin-bottom: 40px;
    }



    .fix_box .payFor {
        width: 60%;
        height: 35px;
        text-align: center;
        line-height: 35px;
        border-radius: 18px;
        color: #fffefe;
        background-color: #ff6e04;
    }

    .mainBox {
        margin-top: .4444rem
            /* 20/45 */
        ;
        background-color: #ffffff;
        padding: 0 .4444rem
            /* 20/45 */
        ;
        overflow: hidden;
    }

    .mainBox .title {

        height: 1.6rem;
        line-height: 1.6rem;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: .6222rem;
        color: #666666;
        border-bottom: 1px solid #eeeeee;
    }

    .mainBox ul {
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 1.6rem 0.4rem;
    }

    .mainBox ul li {
        width: 30%;
        border-radius: .2222rem;
        font-size: .5778rem;
        color: #333333;
        border: 2px solid #ddd;
        height: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    .mainBox ul li .a1 {
        height: 64%;
        width: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 0.5rem;
    }

    .mainBox ul li .a1 .block_1 {
        font-size: 0.65rem;
        font-weight: 500;
        color: #444;
    }

    .mainBox ul li .a1 .block_2 {
        font-size: 0.52rem;
        color: #777;
    }

    .mainBox ul li .a2 {
        width: 100%;
        color: #FF4400;
        font-size: 0.75rem;
        text-align: center;
    }

    .mainBox ul li.abs {
        background-image: url("../../assets/images/156.png");
        background-size: 100% 100%;
        border:none;
    }

    .add {
        color: #ff6e04 !important;
    }

</style>
