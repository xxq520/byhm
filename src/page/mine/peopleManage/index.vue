<template>
    <div class="peopleManage">
        <!-- 头部 -->
        <mt-header title="人脉管理" class="topnav">
            <mt-button icon="back" slot="left" @click="goback()"></mt-button>
            <mt-button slot="right" @click="questionBox"><i class="question"><img
                        src="@/assets/images/icon_yiwen.png" /></i></mt-button>
        </mt-header>
        <!-- 顶部类型切换 -->

        <ul class="managebtn">
            <li :class="{'hover':messagebtn==0}" @click="messagebtnfn(0)">
                <p>潜在人脉</p>
                <p class="count">（{{total.potentialFriendCount?total.potentialFriendCount:0}}）</p>
            </li>
            <li :class="{'hover':messagebtn==1}" @click="messagebtnfn(1)">直接人脉 <p class="count">
                    （{{total.directFriendCount?total.directFriendCount:0}}）</p>
            </li>
            <li :class="{'hover':messagebtn==2}" @click="messagebtnfn(2)">间接人脉 <p class="count">
                    （{{total.indirectFriendCount?total.indirectFriendCount:0}}）</p>
            </li>
            <li :class="{'hover':messagebtn==3}" @click="messagebtnfn(3)">试用会员 <p class="count">
                    （{{total.tryOutFriendCount?total.tryOutFriendCount:0}}）</p>
            </li>
        </ul>

        <ul class="tabnav-list" v-if="messagebtn==3">
            <p style="text-align: left; width:20%;"> {{ '排序:'}}</p>
            <li @click="paixu">
                <span style="float: left; width: 2.6rem;">{{ '时间' }} <i
                        :class="tabnavText?'el-icon-caret-bottom':'el-icon-caret-top'"></i></span>
            </li>
            <li>
                <span style="float: right;" @click="isShow=!isShow">{{ '筛选'}}</span>
            </li>
            <div class="topTab" v-if="isShow">
                <div @click="getAll">全部</div>
                <div @click="getAllinfo">已续过</div>
                <div @click="getAlldelete">未续过</div>
            </div>
        </ul>
        <!-- <div class="topTab" v-if="isShow">
                  <p @click="getAllinfo">已续费</p>
                  <p @click="getAlldelete">未续费</p>
              </div> -->
        <div class="mainBox">
            <div class="itembox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="100">
                <ul class="list">
                    <div class="nodata" v-if="!list.length"><img src="@/assets/images/xinx-img.png"></div>
                    <li v-for="(item,index) in list" :key="index" @click="goDetails(item.id,messagebtn)">
                        <p style="vertical-align:middle;">
                            <span >{{!item.realName || item.realName=='' || item.realName==null?'惠盟用户':item.realName}}
                                <i class="Label"
                                    v-if="messagebtn == 1 ||
                                    messagebtn==2||messagebtn==3">{{item.levelName}}</i>
                                    
                                        <i v-if="item.isRenew==2"> <img v-if="item.isRenew==2"
                                                style="width: 1rem;height:1rem; position: relative;left: 0.3rem;top: 0.3rem;"
                                             src="@/assets/images/yixuuu.png" /></i>
                            </span>
                           
                            <span
                                v-if="messagebtn == 1 || messagebtn ==2">发展人数：{{item.inviteNum?item.inviteNum:0}}</span>
                        </p>
                        <p v-if="messagebtn == 0 || messagebtn==1||messagebtn==3">{{item.username |yingPhone}}
                            <template
                                v-if="messagebtn == 1 || messagebtn ==2||messagebtn==3">（{{item.cardNo}}）</template>
                        </p>
                        <p v-if="messagebtn == 2 ">推荐人手机号:{{item.superiorName}}</p>

                        <p><span class="zhuce">注册时间：{{item.createTime==null||''?'暂无':formData(item.createTime)}}</span>
                            <a @click.stop="danxuka(item.id,item.username)" class="phoneIcon" v-if="item.isRenew==1"><img
                                    src="@/assets/images/xuuu.png" /> </a>
                            <a @click.stop="givefn(item.username)" class="phoneIcon"><img
                                    src="@/assets/images/ylrzgl_icon_ticket.png" /> </a>
                            <template v-if="messagebtn ==0||messagebtn == 1 ||messagebtn==3">
                                <a v-if="backshqPd " @click.stop="infofn(item.username)" class="phoneIcon"><img
                                        src="@/assets/images/ylrzgl_icon_message.png" /> </a>
                                <a v-else :href="'tel:'+item.username " class="phoneIcon"><img
                                        src="@/assets/images/ylrzgl_icon_message.png" /></a>
                                <a v-if="backshqPd " @click.stop="mobilefn(item.username)" class="phoneIcon"><img
                                        src="@/assets/images/icon_phone.png" /> </a>
                                <a v-else :href="'tel:'+item.username " class="phoneIcon"><img
                                        src="@/assets/images/icon_phone.png" /></a>
                            </template>
                        </p>
                        <p class="zhuce" v-if="messagebtn == 3&&item.isStandard==1&&!!item.expireTime">
                            过期时间：{{item.expireTime==null||''?'0':formData(item.expireTime)}}</p>
                    </li>
                </ul>
                <div class="loading">
                    <loading :load.sync="loadshow" :end.sync="loadend"></loading>
                </div>
            </div>
        </div>

        <!-- 弹框 -->
        <div class="winModal" v-if="isShowBox">
            <div class="mainBox">
                <ul>
                    <li>
                        <label>直接人脉：</label>
                        <p>指由当前账户发展，与当前账户产生直接关联的付费用户人脉；</p>
                    </li>
                    <li>
                        <label>间接人脉：</label>
                        <p class="rm">指由当前账户直接人脉发展，与当前账户产生间接关联的付费用户人脉；</p>
                    </li>
                    <li>
                        <label>潜在人脉：</label>
                        <p>指由当前账户发展，与当前账户产生直接关联的非付费用户人脉；</p>
                    </li>
                </ul>
                <div class="closeBtn" @click="closeQuestionBox">我知道了</div>
            </div>
        </div>
                <div class="bottomnav" v-if="messagebtn == 3">
                    <div class="buttons " style="float:right;">
                        <li class="pass" @click="Allxuka">一键续卡</li>
                    </div>
                </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                topnav: '人脉管理',
                isShowBox: false,
                messagebtn: this.$route.query.flag,
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
                backshqPd: sessionStorage.getItem('applogin') || this.$route.query.platform == 'android' || this.$route
                    .query.platform == 'ios',
                tabnavText: true,
                isShow: false,
                isRenew: '',
               
            }
        },
        mounted() {
            let mess = sessionStorage.getItem("messagebtn");
            this.messagebtn = mess ? mess : this.messagebtn;
            this.cardNo = this.$route.query.cardNo;
            this.getTotal();
            this.loadMore();

        },

             filters:{
             yingPhone (val){

             return val.substring(0, 3)+"****"+ val.substr(val.length-4);
             }
             },

        methods: {
            //单独续卡
            danxuka(id,name){
               
                           MessageBox({
                           title: '温馨提示',
                           message: '您是否需要为您下属的试用用户'+name+'续卡',
                           showCancelButton: true,
                           confirmButtonText: '确定',
                           closeOnClickModal: false
                           }).then(action => {
                           if(action ==='confirm'){
                                     axios({
                                     url: this.Api + "user/renewExpireTime?userId="+id,
                                     method: "get",
                                     headers: {
                                     "X-Nideshop-Token": this.$cookie.get("token"),
                                     }
                                     }).then(res => {
                                     if (res.data.code == 0) {
                                      Toast(res.data.msg)
                                      this.getAll()
                                     } else{
                                     Toast(res.data.msg)
                                     }
                                     })
                          
                           }
                           
                           });
               
            },
            //
            //全部续卡
            Allxuka(){
                            
                                  MessageBox({
                                  title: '温馨提示',
                                  message: '您确定要为你的所有需要续卡的下属试用用户续卡?',
                                  showCancelButton: true,
                                  confirmButtonText: '确定',
                                  closeOnClickModal: false
                                  }).then(action => {
                                  if(action ==='confirm'){
                                  axios({
                                  url: this.Api + "user/oneKeyRenew?userId="+this.superior,
                                  method: "get",
                                  headers: {
                                  "X-Nideshop-Token": this.$cookie.get("token"),
                                  }
                                  }).then(res => {
                                  if (res.data.code == 0) {
                                  Toast(res.data.msg)
                                  this.getAll()
                                  } else{
                                  Toast(res.data.msg)
                                  }
                                  })

                                  }

                                  });
            },
            //已续费
            getAllinfo() {
                this.isShow = false;
                this.isRenew = 2;
                this.messagebtn = 3;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = '';
                this.sort = '';
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();
            },
            //未续费
            getAlldelete() {
                this.isShow = false;
                this.isRenew = 1;
                this.messagebtn = 3;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = '';
                this.sort = '';
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();
            },
            //全部
            getAll() {
                this.isShow = false;
                this.isRenew = '';
                this.messagebtn = 3;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = '';
                this.sort = '';
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();
            },

            goback() {
                this.$store.commit("bbb");
                sessionStorage.removeItem("messagebtn")
                // 从安卓和ios来的页面，返回时直接调用他们的方法，返回安卓和ios页面
                // h5页面如果返回去时没有上一级页面就直接返回首页，否则返回上一级页面
                // console.log(this.$route.query.from);
                if (this.$route.query.platform == 'android') {
                    
                    window.action.backAPP();
                } else if (this.$route.query.platform == 'ios') {
                   
                    window.action.backAPPiOS();
                } else {

                    this.$router.go(-1)
                }
            },
            paixu() { 
               
                this.tabnavText = !this.tabnavText;
                this.tabnavText ? this.sort = 'desc' : this.sort = 'asc';
                this.messagebtn = 3;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = 'create_time';
                this.sort = this.sort;
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();


            },
            questionBox() {
                this.isShowBox = !this.isShowBox;
            },
            closeQuestionBox() {
                this.isShowBox = false;
            },
            messagebtnfn(val) {
                
              
                this.list = [];
                this.isRenew = '';
                this.isShow = false;
                this.messagebtn = val;
                this.pageNum = 1;
                this.type = 0;
                this.list = [];
                this.sidx = '';
                this.sort = '';
                sessionStorage.setItem("messagebtn", this.messagebtn);
                this.loadMore();
            },
            // 安卓电话方法
            mobilefn(number) {
                window.action.phoneCall(number);
            },
            // 安卓短信方法
            infofn(number) {
                if (this.$route.query.platform == 'android') {

                    window.action.infofn(number);
                } else if (this.$route.query.platform == 'ios') {

                    window.action.phoneSend(number);
                }
            },
            //爱之家消费卷赠送
            givefn(number) {
                this.$router.push({
                    path: '/consumption',
                    query: {
                        flag: this.messagebtn,
                        phone: number
                    }
                })
            },
            loadMore() {
                this.loading = true;
                this.loadshow = true;

                let params = {
                    type: this.type,
                    level: this.messagebtn,
                    superior: this.superior,
                    sidx: this.sidx,
                    sort: this.sort,
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    isRenew: this.isRenew

                };
                axios.get(this.Api + '/user/queryByLevel', {
                    params: params
                }).then(res => {
                    if (res.status == 200) {
                        let data = res.data.page;
                        if (!res.data.page || data.list.length == 0) {
                            // console.log('5')
                            this.loadend = true;
                            this.loadshow = false;
                            this.loading = true;
                            return false;
                        };
                        (this.pageNum) ++;
                        this.list = this.list.concat(data.list);
                        this.loading = false;
                        this.loadshow = false;

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
            goDetails(id, index) {

                this.$router.push({
                    path: '/mine/peopleDetails',
                    query: {
                        id: id,
                        index: this.messagebtn
                    }
                });
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

    .peopleManage {
        min-height: 100vh;
        background-color: #f5f5f5;
        overflow: hidden;
        padding-top: 1.4rem;
    }

    .topnav {
        background-color: #ff911e;
        border-bottom: none;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }

    .topnav .question {
        width: .8rem;
        height: .8rem;

        border-radius: 50%;
        display: inline-block;
        text-align: center;
        line-height: .8rem;
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
        padding: .4889rem 0;
        font-size: .6222rem;
        color: #333333;
        height: 2.2222rem;


    }

    .managebtn li p.count {
        color: #666666;
        font-size: .5333rem;
        line-height: .6667rem;
    }

    .managebtn li.hover {
        color: #ff6e04;
        position: relative;
    }

    .managebtn li.hover::after {
        content: '';
        width: 3.1111rem;
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
        padding-top: .4444rem;
    }

    ul.tabnav-list {

        display: -webkit-flex;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 0.3rem;
        background-color: #fff;
        font-size: 0.62rem;
        line-height: 1.6rem;
        height: 1.6rem;
        padding: 0.3rem 0.8rem;
        color: #666666;
        position: relative;

    }

    ul.tabnav-list li {

        text-align: center;
        flex-grow: 1;

        line-height: 1rem;
        height: 1rem;
    }

    ul.tabnav-list p {
        line-height: 1rem;
        height: 1rem;
        text-align: left;
        width: 20%;
    }

    ul.tabnav-list li span {
        width: 2.4rem;
        height: 1rem;
        border: #999 1px solid;
        border-radius: 0.5rem;

    }

    .topTab {
        position: absolute;
        right: .4444rem;

        width: 3.7778rem;
        background-color: #616161;
        border-radius: .4444rem;
        top: 40px;
        padding: 0 .3333rem
            /* 15/45 */
        ;
        z-index: 999;
    }

    .topTab::after {
        content: '';
        position: absolute;
        right: .4444rem
            /* 20/45 */
        ;
        top: -5px;
        width: 0;
        height: 0;
        border-right: .4rem solid transparent;
        border-left: .4rem solid transparent;
        border-bottom: .5rem solid #616161;

    }

    .topTab div {
        height: 1.3333rem
            /* 60/45 */
        ;
        line-height: 1.3333rem
            /* 60/45 */
        ;
        border-bottom: 1px solid #1c1c1c;
        color: #ffffff;
        font-size: .4889rem
            /* 22/45 */
        ;
        text-align: center;
    }

    .topTab p:last-child {
        border-bottom: none;
    }

    .mainBox .itembox .list {
        background-color: #fff;
        padding: 0 .4889rem;
    }

    .mainBox .itembox .list li {
        border-bottom: 1px solid #eeeeee;
        padding: 0.6rem 0;
        font-size: .5333rem;
        color: #666666;
      
    }

    .mainBox .itembox .list li:last-child {
        border-bottom: none;
    }

    .mainBox .itembox .list li p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.2889rem;
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
        height: .8444rem;
        line-height: .8444rem;
        padding: 0 .3111rem;
        font-size: .4889rem;
        border-radius: .4rem;
        background-color: #ff6e04;
        color: #fefefe;
    }

    p.rm {
        padding-left: 0.3rem;
    }

    /* 弹框 */
    .winModal {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
    }

    .winModal .mainBox {
        background-color: #ffffff;
        width: 90%;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 12rem;
        border-radius: .2222rem;
        padding: 1.2222rem .6667rem .8889rem;
        box-sizing: border-box;
        overflow: auto;
    }

    .winModal .mainBox ul li {
        display: flex;
        justify-content: flex-start;
        font-size: .5333rem;
        padding-bottom: 1.0222rem;
        color: #666666;
    }

    .winModal .mainBox ul li label {
        width: 45%;
    }

    .winModal .mainBox .closeBtn {
        width: 4.4444rem;
        height: 1.3778rem;
        text-align: center;
        line-height: 1.3778rem;
        color: #ffffff;
        background-color: #ff8624;
        border-radius: .6889rem;
        font-size: .6667rem;
        margin: .6rem auto 0;
    }

</style>
