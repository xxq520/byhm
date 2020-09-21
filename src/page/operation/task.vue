<template>
    <div class="mainbox">
        <div class="top">
            <i class="el-icon-arrow-left" @click="goback"></i>
            <span>{{topnav.title}}</span>
        </div>
        <div class="tabnav">
            <ul>
                <li v-for="(item,i) in taskCycleList" :key="i" :class="{'hover':code == item.code}"
                    @click="taskCahnge(item.code)"><a>{{ item.taskCycleDesc }}<i></i></a></li>
            </ul>
        </div>
        <div class="boxmain" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3">
            <div class="boxitem" v-for="(item,i) in list" :key="i">
                <div class="title">
                    <p>{{ item.taskTypeName + '：' + item.taskNum }}</p>
                    <span>{{ item.finishNum ? item.finishNum : 0 }}/{{ item.taskNum?item.taskNum:10}}</span>
                </div>
                <div class="content">
                    <div class="ctext">{{ item.taskDetails }}</div>
                    <div class="cbtn">
                        <div class="wanc" @click=" goback1(item.taskTypeName)">去完成</div>
                    </div>
                </div>
            </div>
            <loading :load.sync="loadshow" :end.sync="loadend"></loading>
        </div>
        <mt-popup v-model="partnerDrop" popup-transition="popup-fade">
            <div class="detailed">
                <div class="detaiTitle">任务详情</div>
                <div class="detaiContent">{{ changeDetails.taskDetails }}</div>
                <div class="detaiBtn" @click="partnerDropFalse">我知道了</div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: '任务中心'
                },
                partnerDrop: false,
                loading: true,
                loadshow: true,
                loadend: false,
                type: this.$route.query.type,
                userid: this.$cookie.get('userid'),
                code: 0,
                changeDetails: new Object(),
                taskCycleList: [],
                list: [],
                // list:[{taskCycleDesc:11111,taskTypeName:222}],

                backshqPd: sessionStorage.getItem('applogin'), // app登录判断
            }
        },
        mounted() {
            let param = {
                userId: this.userid,
                taskRoleOpen: this.type,
            };
            axios({
                method: 'post',
                url: this.Api + 'task/user/cycle',
                data: qs.stringify(param),
                headers: {
                    "X-Nideshop-Token": this.$cookie.get("token")
                }
            }).then(res => {
              
                this.taskCycleList = res.data.taskCycleList;
                console.log( this.taskCycleList)
              if(!this.taskCycleList.length){
                   this.code=-1
              }else{
                  this.code=this.taskCycleList[0].code;
              }
                this.loadMore();
                
            });
            
        },
        methods: {
            taskCahnge(val) {
                this.code = val;
                this.loadMore();
            },
            goback() {
            
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
                     this.$store.commit("bbb");
                     this.$router.go(-1)
                     }

            }, 
            goback1(val) {
             
              
              let str = this.Trim(val)
               switch (str) {
               case "发展超级会员数":
               
                   this.$store.commit("bbb");
          
                this.$router.push({path:"/mine/invitMember"})
              
               break;
               case "发展商家数":
           
                   this.$store.commit("bbb");
            
                 this.$router.push({path:"/mine/inviteShop"});
               break;
               case "发展运营商数":
            
                   this.$store.commit("bbb");
                    if(this.backshqPd){
                     window.action.backAppIndex();
                     }else{
                     this.$router.push({path:"/mine"})
                     }
               break;
                    //  if(this.backshqPd){
                    //  window.action.backAppIndex();
                    //  }else{
                    //  this.$router.push({path:"/mine"})
                    //  }
               }
         
            },
              Trim(str)
              {
              return str.replace(/(^\s*)|(\s*$)/g, "");

              },
            loadMore() {
                this.loading = true;
                this.loadshow = true;
                let that = this;
                let list = [];
                let param = {
                    userId: this.userid,
                    taskRoleOpen: this.type,
                    taskCycle: this.code
                };
                axios({
                    method: 'post',
                    url: this.Api + 'task/user/cycle/list',
                    data: qs.stringify(param),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    this.list = res.data.list;
                    console.log(this.list,'555')
                    this.loadshow = false;
                    this.loadend = true;

                    this.$nextTick(() => {
                        $('.ctext').each(function (i, e) {
                            let fontSize = new Number($(e).css('font-size').replace(
                                /[^\d^\.]/gi, ''));
                            let width = $(e).width();
                            let list = Math.floor(width / fontSize);
                            let t = $(e).text();
                            let htmls = '';
                            if (t.length - list * 2 > -3) {
                                htmls = '<span>查看详情</span>';
                            } else {
                                htmls = '<span>查看详情</span>';
                            };
                            $(e).html(htmls).find('span').click(function () {
                                that.partnerDropTrue(that.list[i]);
                            });
                        });
                    })
                });
            },
            partnerDropTrue(obj) {
                this.partnerDrop = true;
                this.changeDetails = obj;
            },
            partnerDropFalse() {
                this.partnerDrop = false;
            }
        }
    }

</script>

<style scoped>
    .content .wanc {
        background-color: #f86b1f;
        text-align: center;
        border-radius:6px;
    }
    .mainbox {
        overflow: hidden;
        height: 100vh;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
    }

    .top {
        width: 100%;
        height: 40px;
        background-color: #ff911e;
        color: #fff;
        display: flex;
        line-height: 40px;
        text-align: center;
    }

    .top i {
        flex: 1;
        line-height: 40px !important;
        font-size: 20px !important;
    }

    .top span {
        flex: 9;
        font-size: 18px;
        text-indent: -50px;

    }

    .tabnav {
        overflow: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.5rem;
    }

    .tabnav ul {
        overflow: auto;
        white-space: nowrap;
    }

    .tabnav ul::-webkit-scrollbar {
        display: none
    }

    .tabnav ul li {
        display: inline-block;
        text-align: center;
        flex-grow: 1;
        font-size: 0.65rem;
        padding: 0 0.3rem;
    }

    .tabnav ul li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0.8em 0.7em;
        color: #666;
    }

    .tabnav ul li a i {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
    }

    .tabnav ul li.hover a {
        color: #f86b1f;
    }

    .tabnav ul li.hover a i {
        background: #f86b1f;
    }

    /* boxmain */
    .boxmain {
        flex: 1;
        overflow: auto;
        font-size: 0.65rem;
    }

    .boxitem {
        background: white;
        overflow: hidden;
        padding: 10px;
        border-bottom: 1px solid #e9e9e9;
    }

    .title {
        overflow: hidden;
        margin-bottom: 10px;
    }

    .title p {
        float: left;
    }

    .title span {
        float: right;
    }

    .content {
        font-size: 0.6rem;
        line-height: 1.4em;
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }

    .content .ctext {
        overflow: hidden;
        width: calc(100% - 5em);
        height: calc(2.8em - 1px);
    }

    .content .cbtn {
        width: 5em;
        padding-left: 1em;
        margin-bottom: 0.1em;
    }

    .content .cbtn a {
        display: block;
        width: 100%;
        text-align: center;
        border-radius: 2rem;
        line-height: 1.6em;
        color: white;
        background: #ff6e04;
    }

    .mainbox>>>.mint-popup {
        font-size: 0.6rem;
        border-radius: 0.5em;
    }

    .detailed {
        width: 86vw;
        padding: 10px;
    }

    .detailed .detaiTitle {
        font-size: 0.7rem;
        text-align: center;
        margin-bottom: 0.5rem;
    }

    .detailed .detaiContent {
        text-indent: 2em;
        line-height: 1.4em;
        min-height: 6em;
        max-height: 50vh;
        overflow: auto;
        color: #666;
        margin-bottom: 0.5em;
    }

    .detailed .detaiBtn {
        display: block;
        margin: 0 auto;
        width: 6em;
        text-align: center;
        border-radius: 2rem;
        line-height: 2em;
        color: white;
        background: #ff6e04;
    }

</style>
