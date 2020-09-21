<template>
    <div class="peopleManage">
        <!-- 头部 -->
        <mt-header title="转赠消费券" class="topnav">
            <mt-button icon="back" slot="left" @click="goback()"></mt-button>
        </mt-header>
        <!-- 消费券赠送 -->
        <div class="cart-box">
            <div class="cart-list">
                <label>获券账号:</label>
                <p class="lmain">
                    <input type="text" placeholder="请输入手机号码" v-model="phone2" @blur="changePhone">
                </p>
            </div>
            <div class="cart-list">
                <label>转赠券额:</label>
                <p class="lmain">
                    <input type="number" placeholder="请输入转赠的消费券整数金额" v-model="money"
                        oninput="this.value=this.value.replace(/\D/g,'').replace(/^0+(?=\d)/,'')">
                </p>
            </div>
            <p>可赠送的消费券金额:{{gentlemen?gentlemen:0}}</p>
            <div class="next-box">
                <div class="next-btn" @click="pass">确定赠送</div>
            </div>
        </div>
        <!-- 顶部类型切换 -->
        <ul class="managebtn">
            <li :class="{'hover':messagebtn==0}" @click="messagebtnfn(0)">
                <p>潜在人脉</p>
                <p class="count" v-if="total.potentialFriendCount >0">（{{total.potentialFriendCount}}）</p>
            </li>
            <li :class="{'hover':messagebtn==1}" @click="messagebtnfn(1)">直接人脉 <p class="count"
                    v-if="total.directFriendCount >0">（{{total.directFriendCount}}）</p>
            </li>
            <li :class="{'hover':messagebtn==2}" @click="messagebtnfn(2)">间接人脉 <p class="count"
                    v-if="total.indirectFriendCount >0">（{{total.indirectFriendCount}}）</p>
            </li>
        </ul>
        <div class="mainBox">
            <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
                <ul class="list">
                    <li v-for="(item,index) in list" :key="index">

                        <p>
                            <span>{{!item.realName || item.realName=='' || item.realName==null?'惠盟用户':item.realName}}<template
                                    v-if="messagebtn == 1 || messagebtn ==2">（{{item.cardNo}}）</template></span>
                        </p>
                        <p>
                            <span v-if="messagebtn == 0 || messagebtn==1">{{item.username|yingPhone}}</span>
                            <span v-if="messagebtn == 2">推荐人手机号:{{item.superiorName}}</span>
                            <button class="search-btn" v-if="phone==item.username">已选</button>
                            <button class="search-btn" v-else @click="Choice(item.username)">选择</button>

                        </p>
                        <p><span class="zhuce">注册时间：{{item.createTime==null||''?'暂无':formData(item.createTime)}}</span>
                        </p>

                    </li>
                </ul>
                <div class="loading">
                    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
                </div>
            </div>
        </div>


    </div>
</template>
<script>
    import regular from '@/assets/js/regular';
    export default {
        data() {
            return {
                messagebtn: this.$route.query.flag,
                phone: this.$route.query.phone,
                loadshow: true,
                loadend: false,
                loading: false,
                level: this.$cookie.get('level_id'), //0 潜在用户、1 一级用户和 2二级用户
                superior: this.$cookie.get('userid'), //用户id
                type: this.$cookie.get('vip_type'), //非用户(0)、520用户(1)和推广商(2) 区推广3 市推广4 省推广5
                sidx: '', //排序字段
                sort: '', //排序方式
                pageNum: 1, //当前页
                pageSize: 8, //每页显示行数
                list: [],
                total: '',
                type: 0,
                money: '',
                gentlemen: '',
                phone2:'',


            }
        },
        mounted() {
            if (this.phone == undefined) {
                this.phone = ''

            }
              if (this.phone&&this.messagebtn==2) {
               this.phone2 = this.geTel(this.phone)
            }else{
                this.phone2=this.phone
            }


            this.cardNo = this.$route.query.cardNo;
            this.getTotal();

            this.loadMore();
        },
        watch:{
            money(newName,oldName){
                if(newName.match(/\.\d{3}/)){
                    let val = newName.match(/\d+\.\d{2}/);
                    this.money = val[0];
                }
            }
        },
        filters:{
           yingPhone (val){
               
             return val.substring(0, 3)+"****"+ val.substr(val.length-4);
           }
        },
        methods: {
            changePhone(){

                 this.phone=this.phone2
            },
            Choice(uPhone) {
                if(this.messagebtn==2){
                    this.phone=uPhone;

                     this.phone2=this.geTel(uPhone)

                }else{
                    this.phone = uPhone;
                    this.phone2=uPhone
                }

            },
            goback() {
                this.$store.commit("bbb");
                sessionStorage.removeItem("messagebtn")
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                // console.log(this.$route.query.from);
                if (this.$route.query.platform == 'android') {
                    this.$store.commit("bbb");
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                    this.$store.commit("bbb");
                    window.action.backAPPiOS();
                } else {
                    this.$router.go(-1)
                }
            },

            messagebtnfn(val) {

                this.messagebtn = val;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = '';
                this.sort = '';
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();
            },
         geTel(tel){
            return tel.substring(0, 3)+"****"+ tel.substr(tel.length-4);
            },
            pass() {

                   let expPhone = regular.RegPhone;
                  if(!(expPhone.test(this.phone))){
                  Toast('输入的手机号码格式错误！');
                  return false;
                  };
                 if(this.phone==undefined||this.phone==''){
                     Toast("请输入要赠送对象的手机号码！")
                     return;
                 }
                   if(this.money==undefined||this.money==''){
                   Toast("请输入要赠送的消费券金额！")
                   return;
                   }
                      if(parseFloat(this.money)>parseFloat(this.gentlemen)){
                      Toast("赠送的消费券金额不能大于可赠送金额！")
                      return;
                      }
                MessageBox({
                    title: "审核操作提示",
                    message: "确定向账户" + this.phone2 + "赠送" + this.money +
                        "消费券吗？确定后，消费券将赠送到对方账户，不可撤销 ",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == 'confirm') {
                        axios({
                            method: 'get',
                            url: this.Api +
                            "voucher/examples?userId="+this.superior+'&userName='+this.phone+'&amount='+this.money,
                            headers: {

                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            if (res.data.code == 0) {
                                    Toast({
                                    message: "赠送成功",
                                    position: "middle",
                                    duration: 2000
                                    });
                                    setTimeout(() => {
                                         this.$router.go(0)
                                    }, 1500);



                            } else {
                                Toast(res.data.msg)
                            }
                        })


                    }
                });

            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let params = {
                    type: this.type,
                    level: this.messagebtn,
                    superior: this.superior,
                    sidx: this.sidx,
                    sort: this.sort,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize
                };
                axios.get(this.Api + 'user/levelInfo', {
                    params: params
                }).then(res => {
                    if (res.status == 200) {
                        let data = res.data.page;
                        this.gentlemen=res.data.banlean;
                        console.log(res, '51');
                        that.totalNum = data.totalCount;
                        if (data.list.length == 0) {
                            that.loadend = true;
                            that.loadshow = false;
                            that.loading = true;
                            //that.totalNum = that.list.length;
                            return false;
                        };;
                        (that.pageNum) ++;
                        that.list = that.list.concat(data.list);
                        //that.totalNum = that.list.length;
                        that.loading = false;
                        that.loadshow = false;
                    } else {
                        Toast('后台异常，请联系管理员')
                    }
                })
            },
            formData(time) {
                var date = new Date(time);
                var Y = date.getFullYear() + '.';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
                var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
                // var m = date.getMinutes() + ':';
                var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                // return Y+M+D+h+m+s;
                return Y + M + D + ' ' + h + ':' + m;
            },

            getTotal() {
                axios.get(this.Api + 'user/friends/count?userId=' + this.superior, {
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get('token')
                    }
                }).then(res => {
                    if (res.status == 200) {
                        this.total = res.data;
                    } else {
                        Toast('后台异常，请联系管理员')
                    }
                })
            }
        }
    }

</script>
<style scoped>
    .search-btn {
        width: 55px;
        background: #ff6e04;
        border-radius: 1.3rem;
        border: none;
        color: #fff;
        margin-left: 0.2rem;
        height: 30px;
        line-height: 30px;
    }

    button {
        outline: none;
    }

    .peopleManage {
        min-height: 100vh;
        background-color: #f5f5f5;
        overflow: hidden;
    }

    .topnav {
        background-color: #ff911e;
        border-bottom: none;
    }

    .topnav .question {
        width: .8rem
            /* 36/45 */
        ;
        height: .8rem
            /* 36/45 */
        ;
        /* border: 1px solid #ffffff; */
        border-radius: 50%;
        display: inline-block;
        text-align: center;
        line-height: .8rem
            /* 36/45 */
        ;
    }

    /*  */
    .managebtn {
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }


    .managebtn li {
        text-align: center;
        padding: .4889rem
            /* 22/45 */
            0;
        font-size: .6222rem
            /* 28/45 */
        ;
        color: #333333;
        height: 2.2222rem
            /* 100/45 */
        ;
        ;

    }

    .managebtn li p.count {
        color: #666666;
        font-size: .5333rem
            /* 24/45 */
        ;
        line-height: .6667rem
            /* 30/45 */
        ;
    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 3.1111rem
            /* 140/45 */
        ;
        height: 1px;
        background-color: #ff6e04;
        position: absolute;
        bottom: 0;
        left: -7px;
    }

    .managebtn li.hover p {
        color: #ff6e04;
    }

    .mainBox {
        padding-top: .4444rem
            /* 20/45 */
        ;
    }



    .mainBox .itembox .list {
        background-color: #fff;
        padding: 0 .4889rem
            /* 22/45 */
        ;
    }

    .mainBox .itembox .list li {
        border-bottom: 1px solid #eeeeee;
        padding: .6667rem
            /* 30/45 */
            0;
        font-size: .5333rem
            /* 24/45 */
        ;
        color: #666666;

    }

    .mainBox .itembox .list li:last-child {
        border-bottom: none;
    }

    .mainBox .itembox .list li p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.2889rem
            /* 58/45 */
        ;
    }

    .mainBox .itembox .list li p span.zhuce {
        font-size: .5778rem;
        flex: 1;
        color: #333333;
    }

    .mainBox .itembox .list li p .phoneIcon {
        width: .8444rem;
        height: .8444rem;
        margin-left: 0.5rem;

    }

    .mainBox .itembox .list li p .Label {
        height: .8444rem
            /* 38/45 */
        ;
        line-height: .8444rem
            /* 38/45 */
        ;
        padding: 0 .3111rem
            /* 14/45 */
        ;
        font-size: .4889rem
            /* 22/45 */
        ;
        border-radius: .4rem
            /* 18/45 */
        ;
        background-color: #ff6e04;
        color: #fefefe;
    }

    p.rm {
        padding-left: 0.3rem;
    }

    .cart-box {
        padding: 0.5rem 0.3rem;
    }

    .cart-box p {
        text-align: right;
        color: #999;
        font-size: 0.6rem;
        padding: 0 0.5rem;

    }

    .cart-list {
        background-color: #fff;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 0.4rem;
        font-size: 0.7rem;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-list label {
        float: left;
        font-size: 0.6rem;
        width: 7.5em;
        color: #333;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: calc(100% - 7em);
        color: #333;
        margin-left: .416667rem
    }

    .cart-list input {
        display: block;
        flex: 1;

        font-size: 0.6rem;
        color: #333;
        word-break: break-all;
    }

    .next-box {
        text-align: center;
        margin-top: 15px;
    }

    .next-btn {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin: 0 auto;
        width: 12rem;
        padding: 0.5rem 0;
        border-radius: 20rem;
        background: -webkit-linear-gradient(left,
                #ff9500,
                #ff8c39);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,
                #ff9500,
                #ff8c39);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ff9500, #ff8c39);
        /* 标准的语法 */
        text-align: center;
        color: #ffffff;
        font-size: 15px;
        line-height: 1.4em;
        letter-spacing: 2px;
    }

</style>
