<template>
    <div class="agent-application">
        <topnav :topnav="topnav"></topnav>
        <div class="application">
            <div class="application-from">
                <div class="title">审核信息</div>
                <div class="name">
                    <mt-field disableClear label='审核状态：' v-model="checkName" type="text" readonly></mt-field>
                </div>
                <div class="tel">
                    <mt-field disableClear label='申请升级等级：' v-model="levelName" type="text" readonly></mt-field>
                </div>
                <div class="invite-tel">
                    <mt-field disableClear label='提交时间：' v-model="applyTimeStr" type="text" readonly>
                    </mt-field>
                </div>
                <div class="invite-tel" v-if="status==1">
                    <mt-field disableClear label='通过时间：' v-model="checkTimeStr" type="text" readonly>
                    </mt-field>
                </div>

            </div>

            <div class="application-from">
                <div class="title">基本信息</div>
                <div class="name">
                    <mt-field disableClear label='申请人姓名：' type="text" v-model="realName" readonly></mt-field>
                </div>
                <div class="tel">
                    <mt-field disableClear label='申请人手机号：' type="text" v-model="mobile" readonly>
                    </mt-field>
                </div>
                <div class="invite-tel">
                    <mt-field disableClear label='推荐人手机号：' type="text" v-model="inviterMobile" readonly>
                    </mt-field>
                </div>

                <div class="tel">
                    <mt-field disableClear label='联系地址：' type="text" v-model="area" readonly>
                    </mt-field>
                </div>
                <div class="invite-tel">
                    <mt-field disableClear label='详细地址：' type="text" v-model="address" readonly>
                    </mt-field>
                </div>

            </div>
        </div>
        <div class="bottomnav" v-if="status==0&&mold=='aduited'">
            <div class="buttons " style="float:right;">
                <router-link to="" class="pass" @click.native="pass">通过</router-link>
            </div>
            <div class="buttons " style="float:right;">
                <router-link to="" class="unpass" @click.native="unpass">不通过</router-link>
            </div>
        </div>
        <div class="bottomnav" v-if="status==1&&mold=='apply'">
            <div class="buttons " style="float:right;">
                <router-link to="" class="pass" @click.native="promote">去升级</router-link>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                topnav: {
                    title: "升级审核详情"
                },
                checkName: '',
                levelName: '',
                applyTimeStr: '',
                realName: '',
                mobile: '',
                inviterMobile: '',
                area: '',
                address: '',
                checkTimeStr: "",
                queryid: this.$route.query.id,
               
                cardNo: this.$cookie.get('card'),
                userid: this.$cookie.get('userid'),
                isActive: this.$cookie.get('isActive'),
                initlevel: this.$cookie.get('level_id'),
                typeid: '',
                mold: this.$route.query.mold,
                id:'',
                 status: this.$route.query.status,
            };
        },
        created(){
                       this.checkName= sessionStorage.getItem('checkName2');
                         this.levelName= sessionStorage.getItem('levelName2');
                        this.applyTimeStr= sessionStorage.getItem('applyTimeStr2');
                           this.realName= sessionStorage.getItem('realName2');
                           this.mobile= sessionStorage.getItem('mobile2');
                           this.inviterMobile= sessionStorage.getItem('inviterMobile2');
                             this.area= sessionStorage.getItem('area2');
                            this.address= sessionStorage.getItem('address2');
                           this.checkTimeStr= sessionStorage.getItem('checkTimeStr2' );
                        //    console.log(this.status,this.mold,this.queryid)

        },
        mounted() { 
            
            sessionStorage.setItem('mold', this.mold);
            sessionStorage.setItem('queryid', this.queryid);
            sessionStorage.setItem('aduitstatus', this.status);
               let id =this.queryid=='undefined'?-1:this.queryid;
            axios({
                method: 'get',
                url: this.Api + "apply/queryApplyById?id=" + id,
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                }
            }).then(res => {
                if (res.data.code == 0) {
                    let datas = res.data.data;
                    console.log(datas, '777')
                    this.checkName = datas.checkName,
                        this.levelName = datas.levelName,
                        this.applyTimeStr = datas.applyTimeStr,
                        this.realName = datas.realName,
                        this.mobile = datas.mobile,
                        this.inviterMobile = datas.inviterMobile,
                        this.area = datas.area,
                        this.address = datas.address,
                        this.checkTimeStr = datas.checkTimeStr,
                        this.id=datas.id;
                        if(this.realName==null||!this.realName){
                         this.realName=""
                        }
                    sessionStorage.setItem('checkName2',this.checkName );
                    sessionStorage.setItem('levelName2', this.levelName);
                    sessionStorage.setItem('applyTimeStr2', this.applyTimeStr);
                    sessionStorage.setItem('realName2', this.realName);
                    sessionStorage.setItem('mobile2', this.mobile);
                    sessionStorage.setItem('inviterMobile2', this.inviterMobile);
                    sessionStorage.setItem('area2', this.area);
                    sessionStorage.setItem('address2', this.address);
                    sessionStorage.setItem('checkTimeStr2',this.checkTimeStr );

                } else {

                }
            })
        },

        methods: {
            promote() {
                this.$router.push({
                    path: '/upgradeInformation',
                  
                })
            },
            pass() {

                MessageBox({
                    title: "审核操作提示",
                    message: "确定本次对" + this.mobile + "申请升级为" + this.levelName +
                        "审核通过吗？审核通过后，该用户就可以进入支付通道从而升级角色了。 ",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == 'confirm') {
                                 axios({
                                 method: 'post',
                                 url: this.Api + "apply/updateStatusByOne",
                                 data:{id:this.id,status: 1},
                                 headers: {

                                 "X-Nideshop-Token": this.$cookie.get("token")
                                 }
                                 }).then(res => {
                                 if(res.data.code==0) {

                                 this.$router.push( {path:"/operation/upgradeAduit",query:{mold:'aduited'}})
                                 Toast(res.data.msg)
                                 }else{
                                 Toast(res.data.msg)
                                 }
                                 })
                       

                    }
                });

            },
            unpass() {
                MessageBox({
                    title: "审核操作提示",
                    message: "确定驳回本次对" + this.mobile + "申请升级为" + this.levelName +
                        "的审核吗？驳回后该用户便无法升级角色了。",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }).then(action => {
                    if (action == 'confirm') {
                                               axios({
                                               method: 'post',
                                               url: this.Api + "apply/updateStatusByOne",
                                               data:{id:this.id,status: 2},
                                               headers: {

                                               "X-Nideshop-Token": this.$cookie.get("token")
                                               }
                                               }).then(res => {
                                               if(res.data.code==0) {

                                               this.$router.push(
                                               {path:"/operation/upgradeAduit",query:{mold:'aduited'}})
                                               Toast(res.data.msg)
                                               }else{
                                               Toast(res.data.msg)
                                               }
                                               })
                    }
                });
            },
        }
    }

</script>


<style scoped>
    .agent-application {
        background-color: #f2f2f2;
        min-height: 100vh;
        color: #444;
        position: relative;
    }

    .application {
        padding: 0.633333rem 0.525rem 3.2rem 0.525rem;
       

    }

    .application-from {
        background-color: #ffffff;
        margin-bottom: 0.5rem;
    }

    .application-from .title {
        background-color: #ffe9c9;
        color: #ec0746;
        font-size: 0.666667rem;
        padding: 10px;
        border-radius: 0.208333rem 0.208333rem 0 0;
    }

    .agent-application>>>.mint-cell-wrapper {
        border-bottom: 1px solid #eeeeee;
        background-image: none;
    }

    .agent-application>>>.mint-field .mint-cell-title {
        width: 116px;
    }

    .agent-application>>>.mint-cell-text {
        font-size: 14px;
        color: #444;
    }

    .agent-application>>>.mint-field .mint-cell-value {
        font-size: 13px;
    }

    .cart-list {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 10px;
        font-size: 14px;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
    }

    .cart-list label {
        float: left;
        width: 7.5em;
        color: #444;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        width: calc(100% - 7.7em);
        color: #444;
    }

    .address {
        padding: 0.3rem 0.5rem;
        border-bottom: 1px solid #eeeeee;
        font-size: 0.6rem;
    }

    .provCity label,
    .provCity p.lmain {
        width: auto;
    }

    .bottomnav {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2rem;
        background-color: #fff;
        padding: 0.2rem 0.3rem;
        display: table;
        -webkit-overflow-scroll:touch;
    }

    .bottomnav div {
        font-size: 0.67rem;
        display: table-cell;
        vertical-align: middle;
    }

    .bottomnav div a {
        text-decoration: none out-line;
        color: #555;
    }

    .buttons {
        overflow: hidden;
        text-align: center;
        font-size: 0.6rem;


    }

    .buttons .pass {
        display: inline-block;
        text-align: center;
        font-size: 0.65rem;
        padding: 0 1.5em;
        line-height: 1.8em;
        background: #ff6e04;
        color: white;
        border-radius: 2rem;
        margin-right: 0.5rem;
        margin-top: 0.3rem;

    }

    .buttons .unpass {
        display: inline-block;
        text-align: center;
        font-size: 0.6rem;
        padding: 0 1.2em;
        line-height: 1.8em;
        border: 1px solid #ff6e04;
        background-color: #fff;
        color: #ff6e04;
        border-radius: 2rem;
        margin-right: 0.5rem;
        margin-top: 0.3rem;
    }

</style>
