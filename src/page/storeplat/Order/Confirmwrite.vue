<template>
    <div class="mainbox" v-cloak>
        <topnav :topnav="topnav" class="topnav"></topnav>
        <ul class="list">
            <li v-for="(item,index) in list" :key="index">
                <div class="merchandise">
                    <div class="left"><img :src="item.picUrl" alt=""></div>
                    <div class="right">
                        <div class="shopname">
                            {{item.goodsName}}
                        </div>
                        <div class="rolus">
                            {{item.goodsSpecifitionNameValue}}
                        </div>
                        <div class="price">
                            <div style="color: #ff4400;"> ￥{{item.totalPrice}} </div>
                            <div> x{{item.goodsNum}}</div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="foot">
            <div class="btn" @click="submit()">确认核销</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'management',
        data() {
            return {
                topnav: {
                    title: '确认核销',
                },
                shopCard: '',
                list: [],
                Card: this.$route.query.Card,
            }
        },
        mounted() {
            this.queren();
        },
        methods: {
            //获取信息
            queren() {
                let post = {
                    code: this.Card,
                };
                axios({
                    url: this.Api1 + '/order/getOrderByCode',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.list = data.orderDetails;
                    }else{
                        Toast(res.data.message)
                    }
                })
            },
            submit() {
                let post = {
                    code: this.Card,
                };
              
                axios({
                    url: this.Api1 + '/order/wf',
                    params: post,
                    method: "get",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                          this.$router.push({
                          path: '/mine/paySuccess',
                          query: {
                          id: 1
                          }
                          })
                    } else {
                        Toast(res.data.message)
                    }
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
        padding-top: 40px;
        position: relative;
        padding-bottom: 3.5rem;
    }

    .topnav {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }

    .foot {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 1rem 0;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .foot .btn {
        font-size: 0.62rem;
        width: 50%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
        background-color: #ff9d19;
        color: #fff;
        border-radius: 0.8rem;
    }

    .list {
        margin-top: 0.5rem;
    }

    .list li {
        font-size: 0.58rem;
        color: #666;
        background-color: #fff;
        padding: 0.3rem;
        border-bottom: 1px solid #f5f5f5;
    }

    .list li .foot {
        display: flex;
        justify-content: flex-end;
        height: 1.6rem;
        line-height: 1.6rem;
        align-items: center;
        border-top: 1px solid #eee;

    }

    .list li .foot .bnt {
        font-size: 0.58rem;
        padding: 0 0.4rem;
        height: 1.1rem;
        line-height: 1.1rem;
        border-radius: 0.6rem;
        border: 1px solid #ddd;
        margin-right: 0.4rem;
    }

    .list li .foot .a1 {
        border: 1px solid #FF9D19;
        color: #FF9D19;
    }

    .mint-popup {
        width: 70%;
    }

    .list li .merchandise {
        padding: 0.3rem;
        display: flex;
    }

    .list li .merchandise .left {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .list li .merchandise .left img {
        width: 3.75rem;
        height: 3.75rem;
    }


    .list li .merchandise .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 0.4rem;
    }

    .list li .merchandise .right .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .list li .merchandise .right .rolus {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .list li .merchandise .right .rolus .b1 {
        padding: 0 0.5rem;
        border-right: 1px solid #ccc;
    }

    .list li .merchandise .right .rolus .b1:last-child {
        border: none;
    }

    .list li .merchandise .right .rolus .b1:first-child {
        padding: 0 0.5rem 0 0;
    }

</style>
