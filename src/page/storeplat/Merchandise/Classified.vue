<template>
    <div class="ChangeCode">

        <div class="top_nav">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="telwrap">

            <div class="formwrap2" v-if="!xiuCode">
                <div class="classfor" style="margin-bottom: 0.4rem;">
                    <div>排序</div>
                    <div>分类名称</div>
                    <div> 操作</div>
                </div>
                <div class="classfor" v-for="(item,index) in list">
                    <div>{{index+1}}</div>
                    <div>{{item.categoryName}}</div>
                    <div><img src="@/assets/images/storeplat/icon_dele.png" @click="deles(item.categoryId)">
                        <img src="@/assets/images/storeplat/icon_comp.png" @click="edite(item.categoryId)">
                    </div>
                </div>
            </div>

            <div class="formwrap2" v-if="xiuCode">
                <div class="cart-list">
                    <label>分类名称<span class="f1">*</span>:</label>
                    <p class="lmain">
                        <input type="text" placeholder="请输入分类名称" v-model="className">
                    </p>
                </div>
                <div class="cart-list">
                    <label>排序:</label>
                    <p class="lmain">
                        <input type="number" placeholder="值越小越靠前" v-model="Sorting">
                    </p>
                </div>
            </div>
            <div class="btnwrap" v-if="!xiuCode">
                <div class="btn" type="default" @click="sureChange"><img
                        src="@/assets/images/storeplat/sj_icon_flb.png">添加分类</div>
            </div>
            <div class="btnwrap" v-if="xiuCode">
                <div class="btn" type="default" @click="Preservation" v-if="!editeShow">保存</div>
                <div class="btn" type="default" @click="xiugai()" v-else>修改</div>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">
    export default {
        name: 'ChangeCode',
        data() {
            return {
                topnav: {
                    title: '分类管理'
                },
                userPhone: this.$cookie.get('userPhone'),
                xiuCode: false,
                className: '',
                Sorting: '',
                list: [],
                merId: this.$cookie.get("merId"),
                editeShow: false,
                xiugaId: '',
            }
        },
        mounted() {
            this.loadMore()
        },
        methods: {
            //编辑
            edite(id) {
                this.editeShow = true;
                this.xiuCode = true;
                this.xiugaiId = id;
                axios({
                    method: 'get',
                    url: this.Api1 + "/goods/category/queryDetail",
                    params: {
                        categoryId: id,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": 'application/json; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.className = data.categoryName;
                        this.Sorting = data.sortOrder;

                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //修改分类
            xiugai() {
                var that = this;
                if (that.className == null || that.className == '') {
                    Toast('请填写分类名称')
                    return false
                }
                axios({

                    method: 'post',
                    url: this.Api1 + "/goods/category/update",
                    data: {
                        categoryId: this.xiugaiId,
                        categoryName: this.className,
                        sortOrder: this.Sorting,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": 'application/json; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('修改成功')
                        this.editeShow = false;
                        this.xiuCode = false;
                        this.loadMore();
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //删除
            deles(id) {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/category/delete",
                    data: {
                        categoryId: id,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": 'application/json; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('删除成功')
                        this.loadMore();
                    } else {
                        Toast(res.data.message)
                    }
                })
            },
            //获取
            loadMore() {
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/category/queryAll",
                    data: {
                        merId: this.merId,

                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {

                    if (res.data.code == 200) {
                        let data = res.data.data;
                        this.list = data;
                    }
                })
            },
            //返回
            goback() {
                if (this.xiuCode) {
                    this.xiuCode = false;
                    this.topnav.title = "分类管理";
                    this.editeShow = false;
                    this.className = '';
                    this.Sorting = '';

                } else {
                    if (this.$route.query.platform == 'android' || this.$route.query.platform == 'Android') {
                        window.action.backAPP();
                    } else if (this.$route.query.platform == 'ios' || this.$route.query.platform == 'Ios') {
                        window.action.backAPPiOS()
                    } else {
                        this.$router.go(-1)
                    }
                }

            },
            //添加分类
            sureChange() {
                this.xiuCode = true;
                this.topnav.title = "添加分类"
            },
            //保存
            Preservation() {
                var that = this;
                if (that.className == null || that.className == '') {
                    Toast('请填写分类名称')
                    return false
                }
                axios({
                    method: 'post',
                    url: this.Api1 + "/goods/category/insert",
                    data: {
                        merId: this.merId,
                        categoryName: this.className,
                        sortOrder: this.Sorting,
                    },
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token"),
                        "Content-Type": 'application/json; charset=UTF-8'
                    }
                }).then(res => {
                    if (res.data.code == 200) {
                        Toast('添加成功')
                        this.loadMore();
                        this.xiuCode = false;
                        this.topnav.title = "分类管理";
                        this.className = '';
                        this.Sorting = '';
                    } else {
                        Toast(res.data.message)
                    }
                })
            },

        },
        created() {

        }
    }

</script>

<style scoped>
    .ChangeCode {
        background-color: #f5f5f5;
        width: 100%;
        min-height: 100vh;
        padding-top: 40px;
        padding-bottom: 3.5rem;
        position: relative;
    }

    .top_nav {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 99;
    }

    .top_nav i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top_nav span {
        flex: 9;
        font-size: 0.62rem;
        text-align: center;
        text-indent: -2em;
    }

    .btnwrap {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        left: 0;
        bottom: 0;
    }

    .telwrap .btn {
        width: 9rem;
        height: 1.7778rem;
        font-size: .7111rem;
        background-color: #FF9500;
        border-radius: 40px;
        color: #FEFEFE;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .telwrap .btn img {
        width: 0.75rem;
        height: 0.75rem;
        margin-right: 0.2rem;
    }

    .cart-list {
        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0.5rem;
        font-size: 0.6rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list:last-child {
        border-bottom: none;
    }

    .cart-list label {
        width: 7em;
        display: flex;
        align-items: center;
        color: #333;
    }

    .cart-list label .f1 {
        color: #f00;
        font-size: 0.7rem;
        position: relative;
        top: 0.1rem;
    }

    .cart-list .lmain {
        display: -webkit-flex;
        display: flex;
        font-size: 0.58rem;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem;

    }

    .cart-list input {
        display: block;
        flex: 1;
        text-align: right;
        font-size: 0.55rem;
        color: #888;
    }

    .classfor {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 2rem;
        font-size: 0.58rem;
        color: #333;
        background-color: #fff;
        border-bottom: solid 1px #f5f5f5;
    }

    .classfor div {

        width: 33%;
        display: flex;
        justify-content: center;
    }

    .classfor img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.8rem;
    }

</style>
