<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
        <div class="tabnav">
            <ul>
                <li @click="xuanzhe('aduit')" :class="{'hover':change == 'aduit'}">
                    <a>待审核<span>({{aduitLength}})</span><i></i></a></li>
                <li @click="xuanzhe('pass')" :class="{'hover':change == 'pass'}">
                    <a>通过<span>({{passLength}})</span><i></i></a></li>
                <li @click="xuanzhe('unpass')" :class="{'hover':change == 'unpass'}">
                    <a>不通过<span>({{unpassLength}})</span><i></i></a>
                </li>
                <li @click="xuanzhe('whole')" :class="{'hover':change == 'whole'}">
                    <a>全部<span>({{wholeLength}})</span><i></i></a>
                </li>
            </ul>
        </div>

        <div class="maixBox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
            infinite-scroll-distance="3" v-if="change =='aduit'">
            <div class="nodata" v-if="list.length == 0"><img src="@/assets/images/xinx-img.png"></div>
            <div class="itembox" v-else>
                <ul>
                    <li v-for="(item,index) in list" :key="index">

                        <i @click="details(item.id,item.status)">
                            <p>
                                <span>{{item.realName}}<i>{{item.currentName}}</i></span><span
                                    class="price">{{item.checkName}}</span>
                            </p>
                            <p><span>{{item.mobile}}</span><span>申请成为:{{item.levelName}}</span></p>
                        </i>
                    </li>

                </ul>
            </div>
        </div>
        <pass v-if="change == 'pass'"></pass>
        <unpass v-if="change == 'unpass'"></unpass>
        <whole v-if="change == 'whole'"></whole>
    </div>
</template>

<script>
    import pass from '@/page/operation/myOrder/pass'
    import unpass from '@/page/operation/myOrder/unpass'
    import whole from '@/page/operation/myOrder/whole'
    export default {
        data() {
            return {
                topnav: {
                    back: true,
                    title: '升级审核'
                },
                carcount: '运营中心',
                change: 'aduit',
                userId: this.$cookie.get('userid'),
                type: this.$cookie.get("level_id"),
                operator: {},
                mold: this.$route.query.mold,
                operatorChange: true,
                partner: {},
                partnerLevel: '',
                partnerChange: true,
                type2: 1,
                wholeLength: '',
                passLength: '',
                unpassLength: '',
                aduitLength: '',
                messagebtn: 0,
                nodata: false,
                loading: false,
                loadshow: true,
                loadend: false,
                pageNum: 1,
                pageSize: 10,
                isShow: false, //是否显示tab
                total: '',
                type: 0,
                count: '', //
                allLoaded: false,
                aduitlength: '',
                list: [],

            }
        },
        components: {
            pass,
            unpass,
            whole
        },

        // activated() {
        //     let change = sessionStorage.getItem("change");
        //     console.log(change);
        //     this.$nextTick(() => {
        //         if (change) {
        //             this.change = change;
        //         } else {
        //             // this.change = 'partner';
        //             this.change = 'aduit';
        //         }
        //     })
        // },
        mounted() {

            this.title = this.mold == 'apply' ? '申请记录' : '升级审核'
            
            sessionStorage.setItem("mold", this.mold);
            this.mold = sessionStorage.getItem("mold");
            if (this.mold == 'aduited') {
                let params = {
                    userId: this.userId,
                    type: 1,
                    status: '',
                    pageNum: '1',
                    pageSize: '10'
                }
                axios({
                    method: 'get',
                    url: this.Api + "apply/applyList",
                    params: params,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                    console.log(res, '87')
                    if (res.data.code == 0) {
                       
                        this.wholeLength = res.data.page.totalCount;
                        this.unpassLength = res.data.total.statusTwo;
                        this.passLength = res.data.total.statusOne;
                        this.aduitLength = res.data.total.statusZero;
                    }
                }).catch(res => {
                    Toast(res.data.msg)
                })
            }
          
            if (this.mold == 'apply') {
                let params = {
                    userId: this.userId,
                    type: 0,
                    status: '',
                    pageNum: '1',
                    pageSize: '10'
                }
                axios({
                    
                    method: 'get',
                    url: this.Api + "apply/applyList",
                    params: params,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                    }
                }).then(res => {
                          console.log(res, '87')
                    if (res.data.code == 0) {
                       
                        this.wholeLength = res.data.page.totalCount;
                        this.unpassLength = res.data.total.statusTwo;
                        this.passLength = res.data.total.statusOne;
                        this.aduitLength = res.data.total.statusZero;
                    }
                }).catch(res => {
                    Toast(res.data.msg)
                })
            }


        },
        methods: {
            xuanzhe(val) {
                this.change = val;
            },
                 details(id, status) {

                this.$router.push({
                    path: '/operation/aduitDetails',
                    query: {
                        id: id,
                        status: status,
                        mold:this.mold
                    },

                })
            },

            loadMore() {
                if (this.mold == 'aduited') {
                    this.loading = true;
                    this.loadshow = true;
                    let params = {
                        userId: this.userId,
                        type: 1,
                        status: '0',
                         pageNum: this.pageNum,
                         pageSize: ''
                    }

                    axios({
                            method: 'get',
                            url: this.Api + "apply/applyList",
                            params: params,
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            console.log(res,'55')
                            if (res.data.code == 0) {
                                this.total = res.data.totalProfit;
                                this.count = res.data.page.total;
                                this.list = this.list.concat(res.data.page.list);
                                if (res.data.page.totalCount/10 < this.pageNum) {
                                    this.loadend = true;
                                    this.loadshow = false;
                                    this.loading = true;
                                    return false;
                                }
                                this.pageNum++;
                                this.loading = false;
                                this.loadshow = false;
                            }
                        })
                        .catch(res => {
                            Toast(res.data.msg)

                        })
                }
                 if(this.mold =='apply'){
                    this.loading = true;
                    this.loadshow = true;
                    let params = {
                        userId: this.userId,
                        type: 0,
                        status: '0',
                        pageNum: this.pageNum,
                        pageSize: ''
                    }

                    axios({
                            method: 'get',
                            url: this.Api + "apply/applyList",
                            params: params,
                            headers: {
                                "X-Nideshop-Token": this.$cookie.get("token")
                            }
                        }).then(res => {
                            console.log(res,'55')
                            if (res.data.code == 0) {
                                this.total = res.data.totalProfit;
                                this.count = res.data.page.total;
                                this.list = this.list.concat(res.data.page.list);
                               
                                if (res.data.page.totalCount/10 < this.pageNum) {
                                    this.loadend = true;
                                    this.loadshow = false;
                                    this.loading = true;
                                    return false;
                                }
                                this.pageNum++;
                                this.loading = false;
                                this.loadshow = false;
                            }
                        })
                        .catch(res => {
                            Toast(res.data.msg)

                        })
                }

            },

        },
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
        overflow: hidden;
        width: 100%;
        background: white;
        margin-bottom: 0.5rem;
    }

    .tabnav ul {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .tabnav ul li {
        overflow: hidden;
        text-align: center;
        flex-grow: 1;
        font-size: 0.6rem;
    }

    .tabnav ul li a {
        display: inline-block;
        position: relative;
        font-size: 0.58rem;
        padding: 0.6em 1.2em;
        color: #666;
    }

    .tabnav ul li a i {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 2px;
    }

    .tabnav ul li a span {
        display: block;
    }

    .tabnav ul li.hover a {
        color: #f86b1f;
    }

    .tabnav ul li.hover a i {
        background: #f86b1f;
    }
       .mainbox {
       overflow: hidden;
       min-height: 100vh;
       background: #f5f5f5;
       }

       /* loading */
       .loading {
       width: 100%;
       overflow: hidden;
       text-align: center;
       font-size: 14px;
       color: #666;
       display: -webkit-flex;
       /* Safari */
       display: flex;
       justify-content: center;
       flex-direction: row;
       padding: 10px 0;

       }

       .loading>>>.mint-spinner-fading-circle {
       display: inline-block;
       margin-right: 5px;
       }

       span {
       position: relative;
       }

       .mainTab {
       background-color: #fff;
       display: flex;
       justify-content: space-between;
       padding: .4889rem
       /* 22/45 */
       0;
       text-align: center;
       font-size: .8889rem
       /* 40/45 */
       ;
       color: #333333;
       margin-bottom: .4444rem
       /* 20/45 */
       ;

       }

       .mainTab div {
       width: 50%;
       border-left: 1px solid #f2f2f2;
       }

       .mainTab p:first-child {
       padding: .3333rem
       /* 15/45 */
       0;
       }

       .mainTab p:last-child {
       font-size: .5333rem
       /* 24/45 */
       ;
       color: #666666;
       }

       .maixBox {
       background-color: #fff;
       padding: 0 .4444rem
       /* 20/45 */
       ;
       }

       .maixBox ul li {
       position: relative;
       border-bottom: 1px solid #eeeeee;

       padding: 0.67rem;
       padding-left: 0.9rem;

       }

       .maixBox ul li span.checkbox {
       position: absolute;
       left: 0.15rem;
       top: 0.7rem;
       }

       .maixBox ul li p {
       display: flex;
       justify-content: space-between;
       font-size: .5333rem
       /* 24/45 */
       ;
       color: #666666;
       }

       .maixBox ul li p:first-child {

       font-size: .5778rem
       /* 26/45 */
       ;
       color: #333333;
       line-height: .7111rem
       /* 32/45 */
       ;
       padding-bottom: .2667rem
       /* 12/45 */
       ;

       }

       .maixBox ul li p i {
       padding: 0 .4444rem
       /* 20/45 */
       ;
       height: .7111rem
       /* 32/45 */
       ;
       line-height: .7111rem
       /* 32/45 */
       ;
       font-size: .4444rem
       /* 20/45 */
       ;
       color: #ffffff;
       background-color: #ff6e04;
       display: inline-block;
       border-radius: .3556rem
       /* 16/45 */
       ;
       margin-left: .6667rem
       /* 30/45 */
       ;
       vertical-align: top;

       }

       .maixBox ul li p .price {
       color: #ff6e04;
       font-size: .58rem;
       }

       .maixBox ul li:last-child {
       border-bottom: none;
       }

</style>
