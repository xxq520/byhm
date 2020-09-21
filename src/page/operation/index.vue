<template>
    <div class="mainbox">
        <topnav :topnav="topnav">
        </topnav>
        <div class="tabnav" v-if='infolist'>
            <ul :class="{'bianhua':infolist.length <= 2}">
                <li @click="xuanzhe(item.type,item.level,item.taskRole,item.isDismissal)"
                    :class="{'hover':change == item.type}" v-for="item in this.infolist">
                    <a>{{item.name}}<i></i></a>
                </li>

            </ul>
        </div>
        <div class="upgrade">
            <div class="cardbox" @click="applyArea">
                <div v-if="change != '3'&&change != '1'&&change != '2'" >
                    <div>负责区域：</div>
                    <div class="farea" @click="applyArea">
                        <li v-for="(item,i) in areaList" v-if="i<3">{{item}}</li>
                        <li v-if="areaList.length>3">......</li>
                    </div>
                </div>
                <div v-else >
                      <div>负责区域：</div>
                    <li >{{areaInfo}}</li>
                </div>
                <div>当前等级：{{Current}}</div>
            </div>
            <div class="progress" v-if="change == '3'||change == '1'||change == '2'">
                <div class="progress-box">

                    <span :style="{'width':progress+ '%'}"></span>
                </div>

                <div class="progress-text" v-if="change == '3'">
                    <span>县负责人</span>
                    <span>市负责人</span>
                    <span>省负责人</span>
                </div>
                <div class="progress-text" v-if="change == '2'">
                    <span>县合伙人</span>
                    <span>市合伙人</span>
                    <span>省合伙人</span>
                </div>
                <div class="progress-text" v-if="change == '1'">
                    <span>运营商</span>
                    <span>县运营商</span>
                    <span>市运营商</span>
                    <span>省运营商</span>
                </div>
            </div>
            <div v-if="change == '2'">
                <div class="buttons" v-if="userLevel!=13&&zhuangtai >=1">
                    <a href="javascript:;" @click="applyFor">申请</a>
                    <p>{{ userLevel == 11?'可申请为市合伙人(须审核)':userLevel == 12?'可申请为省合伙人(须审核)':'可申请为合伙人(需审核)' }}</p>
                </div>
                <div class="buttons" v-if="zhuangtai==0 ">
                    <a href="javascript:;" @click="applyFor2">待审核</a>
                </div>
            </div>

        </div>
        <div class="earnings">
            <div class="sum">总收益：<span>￥{{ profit.totalProfit }}</span></div>
            <div class="score">
                <div class="score-item">
                    <span>¥{{ profit.toYieldProfit }}</span>
                    <p>待收益</p>
                </div>
                <div class="score-item">
                    <span>¥{{ profit.dayProfit }}</span>
                    <p>今日收益</p>
                </div>
                <div class="score-item">
                    <span>¥{{ profit.monthProfit }}</span>
                    <p>本月收益</p>
                </div>

            </div>
        </div>
        <div class="classify" v-if="change == '1'">
            <router-link :to="'/operation/task?type='+type1" class="item">
                <span><img src="@/assets/images/center/misson.png"></span>
                <p>任务</p>
            </router-link>
            <router-link to="/myorder" class="item">
                <span><img src="@/assets/images/center/order.png"></span>
                <p>订单</p>
            </router-link>
            <router-link :to="'/operation/Income?level='+userLevel" class="item">
                <span><img src="@/assets/images/center/earnings.png"></span>
                <p>收益明细</p>
            </router-link>

            <router-link :to="{path:'/mine/PeopleManage',query:{flag: 0, cardNo: cardNo}}" class="item">
                <span><img src="@/assets/images/center/contacts.png"></span>
                <p>人脉管理</p>
            </router-link>
            <router-link to="/operation/centerInfor" class="item">
                <span><img src="@/assets/images/center/operation.png"></span>
                <p>运营信息</p>
            </router-link>
            <router-link :to="{path:'/operation/upgradeAduit',query:{mold:'aduited'}}" class="item">
                <span><img src="@/assets/images/center/aduit.png"></span>
                <p>升级审核</p>
            </router-link>
        </div>
        <div class="classify" v-if="change == '2'||change == '3'">
            <router-link v-if="duty == '0'" :to="'/operation/task?type='+type1" class="item">
                <span><img src="@/assets/images/center/misson.png"></span>
                <p>任务</p>
            </router-link>
            <router-link :to="'/operation/Income?level='+userLevel" class="item">
                <span><img src="@/assets/images/center/earnings.png"></span>
                <p>收益明细</p>
            </router-link>
            <router-link v-if="duty == '0'" :to="'/operation/partnerInfor?status='+change" class="item">
                <span><img src="@/assets/images/center/operation.png"></span>
                <p>经营信息</p>
            </router-link>

        </div>
        <div class="classify" v-if="change != '3'&&change != '1'&&change != '2'">
            <router-link v-if="duty == '0'" :to="'/operation/task?type='+type1" class="item">
                <span><img src="@/assets/images/center/misson.png"></span>
                <p>任务</p>
            </router-link>
            <router-link :to="'/operation/Income?level='+userLevel" class="item">
                <span><img src="@/assets/images/center/earnings.png"></span>
                <p>收益明细</p>
            </router-link>
            <router-link v-if="duty == '0'" :to="'/operation/partnerInfor?status='+change" class="item">
                <span><img src="@/assets/images/center/operation.png"></span>
                <p>经营信息</p>
            </router-link>

        </div>

        <bottomnav :carcount="carcount" v-show="$store.state.xianshi"></bottomnav>

    </div>

</template>

<script>
    import {
        scrypt
    } from 'crypto';
    export default {
        data() {
            return {
                topnav: {
                    back: false,
                    title: '运营中心'
                },
                carcount: '运营中心',
                change: '1',
                userid: this.$cookie.get('userid'),
                level_id: this.$cookie.get("level_id"),
                list: [],
                type1: 1,

                type3: 2,
                token: this.$cookie.get("token"),
                partnerdj: sessionStorage.getItem("partnerdj"),
                infolist: [],
                profit: [],
                cardNo: this.$cookie.get('card'),
                Current: '',
                status: 1,
                progress: 0,
                userLevel: 0,
                zhuangtai: 0,
                invitation: {},
                Identity: 1,
                areaInfo: '',
                areaList: [],
                duty: 0,

            }
        },

        beforeRouteLeave(to, from, next) {
            if (to.path == '/operation/task' || to.path == '/operation/Income' || to.path == '/myorder' || to
                .path == '/mine/PeopleManage' || to.path == '/operation/centerInfor' || to.path ==
                '/partnerApplication' || to.path == '/operation/partnerInfor') {
                from.meta.keepAlive = true;
               

            } else {
                from.meta.keepAlive = false;
            
              
             this.$destroy();
            }
            next();
        },
        activated() {


        },
        created() {

            this.getinfo();
            this.postfn();
        },

        methods: {
            //获取推荐人卡号
            // 获取负责区域
            getArea() {
                axios({
                    method: 'get',
                    url: this.Api + 'user/getLevelAndArea?userId=' + this.userid +
                        '&type=' + this.change,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 0) {

                        this.areaInfo = res.data.data.areaStr;
                        this.Current = res.data.data.roleStr;
                        this.areaList = this.areaInfo.split(' ')
                    }

                })


            },
            //获取合伙人状态
            getStuats() {
                axios({
                    method: 'get',
                    url: this.Api + '/application/record/agency/level?userId=' + this.userid +
                        '&type=1',
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    this.list = res.data.list;
                    this.zhuangtai = this.list[0].status;

                })

            },
            //进度条
            stylebar(level) {
                switch (level) {
                    case 2:
                        this.progress = 25;

                        break
                    case 3:
                        this.progress = 50;

                        break
                    case 4:
                        this.progress = 75;

                        break
                    case 5:
                        this.progress = 100;

                        break
                    case 8:
                        this.progress = 100 / 3;

                        break
                    case 9:
                        this.progress = 100 / 1.5;

                        break
                    case 10:
                        this.progress = 100;

                        break
                    case 11:
                        this.progress = 100 / 3;

                        break
                    case 12:
                        this.progress = 100 / 1.5;

                        break
                    case 13:
                        this.progress = 100;

                        break
                }
            },
            //运营商 合伙人 负责人收益
            postfn() {
                Indicator.open();
                axios({
                    url: this.Api + "/benefit/getProfitInfo",
                    method: "post",
                    data: qs.stringify({
                        userId: this.$cookie.get('userid'),
                        type: this.change
                    }),
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    if (res.data.code == 0) {
                        this.profit = res.data.data
                        Indicator.close();
                    } else {
                        Indicator.close();
                    }
                });




            },
            // 获取用户身份
            getinfo() {
                axios({
                    method: 'get',
                    url: this.Api + '/user/getMultipleIdentitys?type=1&userId=' + this.userid,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    this.infolist = res.data.data;
                    this.xuanzhe(this.infolist[0].type, this.infolist[0].level)

                })

            },
            //tap 切换
            xuanzhe(val, level, type, duty) {
                this.duty = duty;
                this.type1 = type;
                if (val == 1) {

                } else if (val == 2) {
                    this.status = 0;

                    this.getStuats();
                } else if (val == 3) {
                    this.status = 1;

                } else if (val == 4) {

                } else if (val == 5) {

                } else if (val == 6) {

                }

                this.userLevel = level;
                this.change = val;
                this.stylebar(level);
                this.postfn()
                this.getArea();
            },

            applyFor() {
                let exper = this.userLevel == 11 ? 'city' : this.userLevel == 12 ? 'province' : 'county';
                let comefrom = "operation"
                this.$router.push({
                    path: '/partnerApplications',
                    query: {
                        code: this.invitation.cardNo,
                        exper: exper,
                        source: 'own',
                        comefrom: 'operation'
                    }
                });
            },
            applyFor2() {
                this.$router.push({
                    path: '/operation/partnerInfor',
                    query: {
                        status: this.status
                    }
                });
            },
            applyArea() {
                this.$router.push({
                    path: '/operation/areaInfor',
                    query: {
                        type: this.change
                    }
                });
            }
        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
        padding-bottom: 50px;
    }

    .tabnav {
        overflow-x: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.5rem;
    }

    .tabnav ul {
        overflow-x: scroll;
        display: -webkit-flex;
        display: flex;

    }

    .tabnav .bianhua {
        justify-content: center;
    }

    .tabnav ul::-webkit-scrollbar {
        display: none;
    }

    .tabnav ul li {
        text-align: center;
        flex-shrink: 0;
        font-size: 0.65rem;
        height: 1.8rem;
        line-height: 1.8rem;
        width: 30%;
    }

    .tabnav ul li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0 0.2rem;
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

    .upgrade {
        overflow: hidden;
        padding: 0.5rem;
        background: white;
        margin-bottom: 0.5rem;
    }

    .cardbox {
        width: 100%;
        height: 5.6rem;
        background-image: url('../../assets/images/center/card.jpg');
        background-repeat: no-repeat;
        background-size: 100%;
        overflow: hidden;
        margin-bottom: 0.5rem;
        font-size: 0.58rem;
        color: #444;
        padding: 0.3rem 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

    }

    .cardbox .farea {
        display: flex;
        overflow: hidden;
    }

    .cardbox .farea li {
        padding: 0.2rem 0.2rem 0 0;
    }

    .progress {
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .progress .progress-box {
        overflow: hidden;
        width: 100%;
        height: 0.4em;
        background: #e1e1e1;
        border-radius: 1rem;
    }

    .progress .progress-box span {
        display: block;
        height: 100%;
        background: #ff6e04;
    }

    .progress .progress-text {
        display: flex;
        overflow: hidden;
        padding-top: 0.5em;
        justify-content: space-around;
    }

    .progress .progress-text span {

        text-align: center;
        font-size: 0.6rem;
        line-height: 1.2em;
        color: #666;
    }

    .buttons {
        overflow: hidden;
        text-align: center;
        font-size: 0.6rem;
    }

    .buttons a {
        display: inline-block;
        text-align: center;
        font-size: 0.65rem;
        padding: 0 1.5em;
        line-height: 1.8em;
        background: #ff6e04;
        color: white;
        border-radius: 2rem;
        margin-bottom: 0.2em;
    }

    .buttons p {
        color: #999;
        font-size: 0.56rem;
    }

    .earnings {
        overflow: hidden;
        padding: 0.5rem;
        background: white;
        margin-bottom: 0.5rem;
    }

    .sum {
        overflow: hidden;
        width: 100%;
        padding: 0.5em 0;
        font-size: 0.65rem;
    }

    .sum span {
        color: #ec0746;
    }

    .score {
        overflow: hidden;
        padding-top: 0.5rem;
    }

    .score .score-item {
        float: left;
        width: calc(33% - 1px);
        padding: 0 0.5em;
        text-align: center;
        font-size: 0.6rem;
        color: #666;
        border-right: 1px solid #eee;
    }

    .score .score-item:last-child {
        border-right: none;
    }

    .score .score-item span {
        color: #666;
        line-height: 1.4em;
    }

    .score .score-item p {
        color: #999;
        line-height: 1.4em;
    }

    .classify {
        overflow: hidden;
        padding: 0.5rem;
        background: white;
        margin-bottom: 0.5rem;
    }

    .classify .item {
        float: left;
        width: 33.333%;
        text-align: center;
        padding: 0.5rem 0;
    }

    .classify .item span {
        display: inline-block;
        width: 1.5rem;
        height: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .classify .item p {
        font-size: 0.6rem;
        color: #666;
        line-height: 1.2em;
    }

</style>
