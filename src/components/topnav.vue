<template>
    <div class="topNav">
        <mt-header v-if="topnav.title" :title="topnav.title">
            <mt-button v-if="back" icon="back" slot="left" @click="goback"></mt-button>
            <mt-button v-if="topnav.send" slot="right" class="send"><img src="@/assets/images/xinxi.png"></mt-button>

            <router-link v-if="topnav.comment" :to="`/comment/pushComment?id=${$route.query.id}&category=${category}`"
                slot="right"><i class="el-icon-edit-outline" style="font-size:18px;"></i></router-link>

        </mt-header>

        <header class="mint-header" v-if="topnav.searh">
            <mt-button v-if="back" icon="back" slot="left" @click="goback" style="padding-right:0.3em;"></mt-button>
            <router-link to="selectAddress" v-if="citydata">
                <mt-button class="location">
                    <span class="adress">{{ citydata }}</span><i class="el-icon-caret-bottom"></i>
                </mt-button>
            </router-link>
            <h1 class="mint-header-title">
                <div class="searhbox">
                    <router-link :to="'searh?urllength='+(urllength-1)" class="searhed">
                        <i class="mint-toast-icon mintui mintui-search"></i>
                        <input type="text" placeholder="查找商家/商品/服务" readonly :value="name">
                    </router-link>
                </div>
            </h1>
            <!-- 消息中心 -->
            <div v-if="topnav.send" slot="right" class="send" @click="messagefn">
             
                <img src="@/assets/images/shoppingMall/by_home_tab1.png" v-if="info==0">
                <img src="@/assets/images/shoppingMall/by_home_tab2.png" v-else>
            </div>
        </header>
    </div>
</template>

<script>
    export default {
        name: 'topnav',
        props: ["topnav", 'city', 'category', 'info'],
        data() {
            return {
                citydata: this.city,
                back: this.topnav.back === false ? this.topnav.back : true,
                name: this.$route.query.name ? this.$route.query.name : '',
                urllength: this.$route.query.urllength ? this.$route.query.urllength : 1,
                userId: this.$cookie.get('userid')
            }
        },
        watch: {
            city(val) {
                this.citydata = val;
            }
        },
        mounted() {

        },
        methods: {

            goback() {
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                // console.log(this.$route.query.from);
                this.$store.commit("bbb");
           
                if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                    window.action.backAPPiOS();
                } else if (this.$route.name == "bankCartList") {
                    if (this.$route.query.idx === undefined) {
                        this.$router.push({
                            name: "MineIndex"
                        });
                    } else {
                        this.$router.push({
                            path: '/'
                        });
                    }
                } else {
               
                    
                    if (window.history.length > 1) {
                        let num = this.urllength != 1 && this.urllength != '0' ? this.urllength : -1;
                    
                        this.$router.go(num);
                    } else {
                        this.$router.push({
                            path: '/'
                        });
                    }
                }
            },
            messagefn() {
                this.$router.push({
                    path: '/message'
                })
                
            },
            changeTab() {
                console.log(this);
            }
        }
    }

</script>

<style scoped>
    /* header */

    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .8rem;
    }

    .mint-header-button {
        -webkit-box-flex: .12;
        -ms-flex: .12;
        flex: .12;
    }

    .searhbox {
        overflow: hidden;
        margin: 0 auto;
        display: -webkit-flex;
        flex-direction: row;
        justify-content: space-between;
        display: flex;
        padding: 6px 0.5rem;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 2em;
        width: calc(100% - 1rem);
    }

    .searhed input {
        background: transparent;
        color: #856d54;
        float: left;
        width: calc(100% - 0.5rem - 1em);
    }

    .searhed i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 1px;
    }

    .saoma {
        width: auto;
        height: 16px;
        padding-left: 15px;
        padding-top: 2px;
    }

    .send {
        width: 20px;
        position: relative;
        z-index: 1;
        font-size: 0.6rem;
    }

    .send img {
        display: block;
    }

    .send .right-list {
        position: absolute;
        right: -8px;
        top: -0.4em;
        font-size: 12px;
        color: red;
        line-height: 1.4em;
        min-width: 1.4em;
        background: white;
        border-radius: 2rem;
    }

    .adress {
        font-size: 12px;
        float: left;
        max-width: 6em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mint-header .location {
        color: #fff;
    }

    .location i.el-icon-caret-bottom {
        float: left;
        font-size: 14px;
        padding-top: 1px;
    }

    .location>>>.mint-button-text {
        padding-top: 0.2em;
        display: block;
    }

    .fuli {
        font-size: 0.6rem;
        display: inline-block;
        margin-right: 10px;
        line-height: 1;
    }

    .send .infoSize {
        position: absolute;
        top: -0.2rem;
        right: -0.2rem;
        border-radius: 50%;
        background-color: #ff8b1e;
        color: #fff;
        font-size: 0.5rem;

    }

</style>
