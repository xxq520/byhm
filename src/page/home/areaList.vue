<template>
    <div class="mainbox">
        <topnav :topnav="topnav" class="nav"></topnav>
        <div class="araelist">
            <li v-for="(item,index) in list" class="listd">
                <div style="color:#333;">{{item.provinceName}}{{item.cityName}}{{item.countyName}}{{item.detailInfo}}
                </div>
                <div class="detail">
                    <div style="width: 35%;">{{item.userName}}</div>
                    <div>{{item.telNumber}}</div>
                </div>
                <div class="footer">
                    <div style="color: #f00;" v-if="item.isDefault">默认地址</div>
                    <div v-else @click="setArea(item)">设为默认地址</div>
                    <div @click="editArea(item)">编辑 <i class=" el-icon-edit"></i></div>
                    <div @click="deleteArea(item)">删除 <i class="el-icon-delete"></i></div>
                </div>
            </li>
        </div>
        <div class="footnav" @click="addArea"> 新增地址</div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '地址管理'
                },
                areadata: {},
                userPhone: this.$cookie.get('userPhone'),
                xiuid: this.$route.query.id,
                xiuShow: false,
                list: [],
            }
        },
        created() {

        },

        mounted() {
            this.getInfo()

        },

        methods: {
            //编辑收货地址
            editArea(val) {
                this.$router.push({
                    path: '/newAddress',
                    query: {
                        id: val.id
                    }
                });
            },
            //删除收货地址
            deleteArea(val) {
                MessageBox({
                    title: "温馨提示",
                    message: "确认删除该地址",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确认",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action === 'confirm') {

                        this.deletearea(val)
                    }
                });
            },
            deletearea(val) {

                var that = this;
                let post = {
                    shippingAddressId: val.id,
                }
                axios({
                    url: this.Api1 + '/user/shippingAddress/delete',
                    data: post,
                    method: "post",
                    headers: {
                           "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('删除成功')

                    }
                })
                setTimeout(() => {
                    that.getInfo()
                }, 50);


            },

            //设置默认地址
            setArea(val) {
                var that = this;
                let post = {
                    shippingAddressId: val.id,
                }
                axios({
                    url: this.Api1 + '/user/shippingAddress/setDefault',
                    data: post,
                    method: "post",
                    headers: {
                         "Content-Type": "application/json; charset=UTF-8",
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('设置成功')

                    }
                })
                setTimeout(() => {
                    that.getInfo()
                }, 50);

            },
            //新增收货地址
            addArea() {
                this.$router.push({
                    path: '/newAddress'
                });
            },
            //获取收货地址列表
            getInfo() {

                axios({
                    method: "get",
                    url: this.Api1 + '/user/shippingAddress/queryAll',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    },
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data
                        this.list = data;
                        if (this.list.length == 0) {
                            MessageBox({
                                title: "温馨提示",
                                message: "收货地址为空，是否添加新的收货地址",
                                showCancelButton: true,
                                showConfirmButton: true,
                                confirmButtonText: "添加",
                                cancelButtonText: "取消"
                            }).then(action => {
                                if (action === 'confirm') {

                                    this.$router.push({
                                        path: '/newAddress'
                                    });
                                }
                            });

                        }

                    }
                })
            },

        },
    }

</script>

<style scoped>
    .mainbox {
        background-color: #f5f5f5;
        width: 100%;
        height: 100%;
        padding-bottom: 2.75rem;
        overflow: auto;
        padding-top: 40px;
    }

    .nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }

    .mainbox::-webkit-scrollbar {
        display: none;
    }

    .araelist li {
        background-color: #fff;
        line-height: 1.3rem;
        margin-top: 0.6rem;
        padding: 0.3rem 0.5rem;
        font-size: 0.65rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-bottom: 1px solid #eee;
    }

    .araelist li:last-child {
        border-bottom: none;
    }

    .araelist li .detail {
        display: flex;
        color: #666;
        margin: 0.3rem 0;

    }

    .araelist li .footer {
        padding: 0.5rem 0 0.2rem;
        display: flex;
        color: #666;
        justify-content: flex-end;
        font-size: 0.58rem;
        border-top: 1px solid #eee;

    }

    .araelist li .footer div {
        min-width: 25%;
        text-align: center;
    }

    .araelist .foote {
        display: flex;
        align-items: center;
        color: #333;
        height: 1.5rem;
        padding: 0.3rem;
    }

    .araelist .foote img {
        width: 0.6rem;
        height: 0.3rem;
        margin-left: 0.2rem;
    }

    .footnav {
        background-color: #ff911e;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 1.75rem;
        line-height: 1.75rem;
        font-size: 0.65rem;
        color: #fff;
        text-align: center;
    }

</style>
