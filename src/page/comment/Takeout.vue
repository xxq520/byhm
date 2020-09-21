<template>
    <div class="mainbox">
        <header class="mint-header">
            <div class="heade">
                <div class="mint-header-button is-left">
                    <button class="mint-button" @click="back">
                        <span class="mint-button-icon">
                            <i class="mintui mintui-back"></i>
                        </span>
                    </button>
                </div>
                <div class="tite">外卖</div>
                <router-link to="/orientation" class="location">
                    <img src="@/assets/images/by_home_tab3.png" />
                    <span class="adress">{{address=='null'?district=='null'?city:district:address}}</span>
                    <i class="el-icon-arrow-right"></i>
                </router-link>
            </div>
        </header>
        <div class="search">
            <div class="searhed">
                <i class="el-icon-search"></i>
                <input type="text" placeholder="查找商家/商品/服务" v-model="search" @focus="searhed" />
            </div>
        </div>
        <!-- <div class="column-img" v-if="banner.length > 0">
            <mt-swipe :auto="4000" :show-indicators="false">
                <mt-swipe-item v-for="(item,i) in banner" :key="i">
                    <a @click="bannerLink(item.jumpTarget)">
                        <img :src="item.imageUrl" />
                    </a>
                </mt-swipe-item>
            </mt-swipe>
        </div> -->

        <div class="maix">
            <div class="tabnav">
                <ul class="tabnav-list">
                    <li :class="{'hover':tabnavText=='distance' && linevist}" @click="tabnav('distance')">
                        <a>
                            {{ distance==''?'附近':distance }}
                            <i :class="tabnavText=='classify' && linevist?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                        </a>
                    </li>
                    <li :class="{'hover':tabnavText=='sorting' && linevist}" @click="tabnav('sorting')">
                        <a>
                            {{ sidxname}}
                            <i
                                :class="tabnavText=='sorting' &&
                                linevist?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
                        </a>
                    </li>
                </ul>
                <div class="tabnav-main" v-if="morevist">
                       <div class="tn-line" v-show="linevist">
                           <div v-for="(item,i) in line" :key="i" class="line"
                               :class="{'hover':tabnavText=='classify'?category==item.id:tabnavText=='distance'?dist==item.id:tabnavText=='sorting'?sidx==item.id:false}"
                               @click="linefn($event,item)">{{ item.name }}</div>
                       </div>
                </div>
            </div>
              <div class="chanpinlist">
                  <div class="indexFl" @click="indexFl" v-if="list.length==0" style="margin-top:1rem">
                      <img src="@/assets/images/indexFl.jpg" />
                  </div>
                  <div class="cpbox" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                      infinite-scroll-distance="3">
                      <!---->
                      <router-link class="goodlist" v-for="(item,index) in list" :key="index"
                          :to="'/shopDetails?id='+item.id">
                          <div class="goodbox">
                              <div class="goodimg">
                                  <img :src="item.facadePhoto" />
                              </div>
                              <div class="goodtext">
                                  <div class="goodname">
                                      <p>
                                          {{ cutString(item.name,10)}}
                                          <img :src="item.icon" v-if="item.isRecommend" />
                                      </p>
                                      <span>{{ categoryfn(item.distance) }}</span>
                                  </div>
                                  <div class="score">
                                      <el-rate v-model="item.grade==0?4:item.grade" disabled text-color="#f86b1f"
                                          :colors="['#f86b1f', '#f86b1f', '#f86b1f']"></el-rate>
                                      <!--<div class="slist">100条点评<span></span>￥50/人</div>-->
                                  </div>
                                  <div class="area">
                                      <p>{{ item.county }}</p>
                                  </div>
                                  <div class="pricebox" v-for="(v,i) in item.voucherList" :key="i">
                                      <div class="cphui" v-if="i < 2">
                                          <i>惠</i>
                                          {{ v.remarks }}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </router-link>
                  </div>
                  <!--loading-->
                  <loading v-if="!nodata" :load.sync="loadshow" :end.sync="loadend"></loading>
                  <div class="nodata" v-if="nodata">暂无数据</div>
              </div>
        </div>
             <mt-popup v-model="permisVisible" style="width: 70%;">
                 <div class="permis">
                     <img src="@/assets/images/tf.png" />
                     <span class="permisClose" @click="permisVisible=false"></span>
                 </div>
             </mt-popup>
    </div>
</template>

<script>
    export default {
        name: "searh",
        data() {
            return {
                close: false,
                search: "",
                history: [],
                urllength: new Number(this.$route.query.urllength),
                loading: true,
                list: [],
                loadshow: true,
                lng: "",
                lat: "",
                page: 1,
                size: 8,
                sidx: "id",
                order: "desc",
                dist:'',
                category: "",
                categoryName: "",
                categoryPost: [{
                    id: "",
                    name: "全部"
                }],
                name: this.$route.query.name ? this.$route.query.name : "",
                loadend: false,
                nodata: false,
                levelid: this.$cookie.get("level_id") ? this.$cookie.get("level_id") : 1,
                linevist: false,
                morevist: false,
                youhuiShow: false,
                tabnavText: "",
                line: [],
                score: 5,
                banner: [],
                tubiao: [],
                address: "",
                sortStatus: "",
                userid: this.$cookie.get("userid"),
                distance: "",
                sidxname: "智能排序",
                permisVisible:false,
            };
        },
        mounted() {
            let that = this;
            let index = 1;
            let timer = setInterval(() => {
                index++;
                
                if (
                    (sessionStorage.getItem("cityMap") &&
                        sessionStorage.getItem("LngLats")) ||
                    index > 15
                ) {
                    // console.log(sessionStorage.getItem("cityMap"), sessionStorage.getItem("LngLats"));
                    clearInterval(timer);
                    let prov = sessionStorage.getItem("provMap");
                    let district = sessionStorage.getItem("distMap");
                    let LngLats = JSON.parse(sessionStorage.getItem("LngLats"));
                    let cityMap = sessionStorage.getItem("cityMap");
                    that.lng = LngLats && LngLats.lng ? LngLats.lng : "";
                    that.lat = LngLats && LngLats.lat ? LngLats.lat : "";
                    that.city = cityMap;
                    that.prov = prov;
                    that.district = district;
                    this.address = sessionStorage.getItem("address");
                    let ides = this.address.indexOf("市");
                    if (ides > -1) {
                        this.address = this.address.substring(ides + 1);
                    }
                    that.loadMore();
                }
            }, 100);

          console.log('55');
        },
        methods: {
                     cutString(str, len) {
                     //length属性读出来的汉字长度为1
                     if (str.length * 2 <= len) { return str; } var strlen=0; var s="" ; for (var i=0; i < str.length;
                         i++) { s=s + str.charAt(i); if (str.charCodeAt(i)> 128) {
                         strlen = strlen + 2;
                         if (strlen >= len) {
                         return s.substring(0, s.length - 1) + "...";
                         }
                         } else {
                         strlen = strlen + 1;
                         if (strlen >= len) {
                         return s.substring(0, s.length - 2) + "...";
                         }
                         }
                         }
                         return s;
                         },
               // 弹出商家申请弹窗
               indexFl() {
               if (this.type == 6) {
               this.$router.push({
               path: "/management"
               });
               } else {
               this.permisVisible = true;
               }
               },
            //图标跳转至对应的查询条件
            gogoods(val) {
                this.$router.push({
                    path: "/goodClassify",
                    query: {
                        id: val.id,
                        urllength: -1
                    }
                });
            },

            // banner轮播图跳转
            bannerLink(links) {
                if (!!links) {
                    if (links.indexOf("http") >= 0 || links.indexOf("https") >= 0) {
                        window.location.href = links;
                    } else {
                        this.$router.push({
                            path: links
                        });
                    }
                }
            },
            //跳转去商家详情
            goShopDetail(val) {

                    this.$router.push({
                        path: "/shopDetails",
                        query: {
                            id: val.merId
                        }
                    });
            },
            //展开优惠信息


            back() {
                if (this.$route.query.platform == "android") {
                    window.action.backAPP();
                } else if (this.$route.query.platform == "ios") {
                    window.action.backAPPiOS();
                } else {
                    let num = this.urllength ? this.urllength : -1;
                    this.$router.go(-1);
                }
            },

            searhed() {
                this.$router.push({
                    path: "searh",
                    query: {
                        urllength: -2
                    }
                });
            },
      
            // 头部导航分类选择
            tabnav(val) {
                switch (val) {
               
                    case "distance":
                          this.morevist = !this.morevist ;
                        this.line = [{
                                id: "",
                                name: "附近"
                            },
                            {
                                id: 500,
                                name: "500m"
                            },
                            {
                                id: 1000,
                                name: "1km"
                            },
                            {
                                id: 3000,
                                name: "3km"
                            },
                            {
                                id: 5000,
                                name: "5km"
                            },
                            {
                                id: 10000,
                                name: "10km"
                            },
                            {
                                id: 20000,
                                name: "20km"
                            }
                        ];
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                    case "sorting":
                         this.morevist = !this.morevist ;
                        this.line = [{
                                id: "",
                                name: "智能排序",
                                order: "desc"
                            },
                            {
                                id: "distance",
                                name: "距离优先",
                                order: "asc"
                            },

                            {
                                id: "view_num",
                                name: "人气优先",
                                order: "desc"
                            }
                        ];
                      
                        this.linevist = this.tabnavText == val ? !this.linevist : true;
                        break;
                }
                this.tabnavText = val;
            },

            // 头部导航详细选择
            linefn(elem, obj) {
                var el = elem.currentTarget;
                $(el)
                    .siblings()
                    .removeClass("hover");
                $(el).addClass("hover");
                this.list = [];
                this.page = 1;
                this.nodata = false;
                this.loadend = false;
                this.lineClick(obj);
            },
            // 头部导航详细选择后，刷新数据
            lineClick(obj) {
                switch (this.tabnavText) {
                    case "classify":
                        this.urllength--;
                        this.category = obj.id;
                        this.categoryName = obj.name;
                        let queryData = {};
                        for (var i in this.$route.query) {
                            queryData[i] = this.$route.query[i];
                        }
                        queryData.urllength = this.urllength;
                        queryData.id = obj.id;
                        this.$router.push({
                            path: "/goodClassify",
                            query: queryData
                        });
                        break;
                    case "distance":
                        this.dist = obj.id;
                        this.distance = obj.name;
                        break;
                    case "sorting":
                        this.sidx = obj.id;
                        this.order = obj.order;
                        this.sidxname = obj.name;
                        break;
                }
                this.loadMore();
                this.zzaofn();
            },
            zzaofn() {
                this.linevist = false;
                this.morevist = false;
            },
                 loadMore() {
                 this.loading = true;
                 this.loadshow = true;
                 let that = this;
                 let post = {
                 category: '1023',
                 name: this.name,
                 lng: this.lng,
                 lat: this.lat,
                 dist: this.dist,
                 pageNum: this.page,
                 pageSize: this.size,
                 levelId: this.levelid,
                 sidx: this.sidx,
                 order: this.order
                 };
                 axios
                 .get(this.Api + "/index/queryMerchantByCategory", {
                 params: post
                 })
                 .then(res => {
                 let data = res.data.page;
                 this.loadshow = false;

                 this.exist = res.data.exist;
                 if (data.list.length == 0) {
                 this.loading = true;
                 if (this.list.length > 0) this.loadend = true;
                 if (this.list.length == 0) this.nodata = true;
                 return false;
                 }
                 this.page++;
                 this.list = this.list.concat(data.list);
                 this.loading = false;
                 });
                 },
            addressfn(arr) {
                let text = "";
                arr.forEach(post => {
                    if (post) text += post;
                });
                return text;
            },
            categoryfn(val) {
                if (val) {
                    let distance = val;
                    if (val / 1000 > 1) {
                        distance = Math.floor((val / 1000) * 100) / 100 + "km";
                    } else {
                        distance = distance + "m";
                    }
                    return distance;
                }
            }
        }
    };

</script>

<style scoped>
    .mainbox {
        overflow: visible;
        padding-top: 40px;
        min-height: 100vh;
        background: #fff;
    }

    .mint-header {
        background: #ff911e;
        width: 100%;
        border-bottom: none;
        font-size: 16px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }

    .search {
        overflow: hidden;
        padding: 0.5rem;
        background: #fff;
        font-size: 0.65rem;
        width: 100%;
    }

    .searhed {
        display: block;
        height: 1.3rem;
        padding: 5px 0.5rem;
        border-radius: 2em;
        width: calc(100% - 1rem);
        margin: 0 auto;
        background-color: #eee;
    }

    .searhed input {
        float: left;
        background: transparent;
        color: #856d54;
        font-size: 14px;
        width: calc(100% - 3rem);
    }

    .searhed i {
        float: left;
        color: #856d54;
        padding-right: 0.2rem;
        padding-top: 2px;
        font-size: 14px;
    }

    .searhed i.el-icon-circle-close {
        float: right;
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

    .chanpinlist {
        overflow: hidden;
    }

    .cptitle {
        padding: 0.5rem;
        border-bottom: 1px solid #d6d6d6;
        text-align: center;
    }

    .cptitle img {
        width: 9rem;
    }

    .cpbox {
        overflow: hidden;
        background: white;
    }

    .nodata {
        text-align: center;
        color: #999;
        font-weight: bold;
        font-size: 0.7rem;
        padding-top: 1rem;
    }

    .tabnav {
        width: 100%;
        background: white;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 40px;
        z-index: 9;
    }

    .tabnav ul.tabnav-list {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }

    .tabnav ul.tabnav-list li {
        overflow: hidden;
        text-align: center;
        /* flex-grow: 1; */
        width: 35%;
    }

    .tabnav ul.tabnav-list li a {
        display: inline-block;
        position: relative;
        font-size: 0.65rem;
        padding: 0.7em 0;
        color: #666;
    }
        .mint-header .heade {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        }

        .mint-header .heade .tite {
        flex: 1;
        text-align: center;
        }

        .mint-header-button {
        -webkit-box-flex: 0.12;
        -ms-flex: 0.12;
        flex: 0.12;
        }

        .mint-header .location {
        color: #fff;
        text-align: left;
        display: flex;
        align-items: center;
        font-size: 0.55rem;
        }

        .location i.el-icon-caret-bottom {
        float: left;
        font-size: 14px;
        padding-top: 1px;
        }

        .location img {
        width: 0.5rem;
        height: 0.6rem;
        margin-right: 0.1rem;
        }
     .adress {
     font-size: 12px;
     float: left;
     max-width: 12em;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
     }
    .tabnav ul.tabnav-list li.hover a {
        color: #f86b1f;
    }

    .tabnav-main {
        overflow: hidden;
        z-index: 99;
        background: rgba(0, 0, 0, 0.4);
        height: 90vh;
        width: 100%;
        position: absolute;
        top: 55px;
    }
     .indexFl {
     padding: 0 0.5rem 0.5rem;
     overflow: hidden;
     }

     .indexFl img {
     display: block;
     pointer-events: none;
     }


    .tabnav-main .tn-line {
        overflow: hidden;
        padding: 0 10px;
        max-height: 40vh;
        overflow: auto;
        background-color: #fff;
        border-top: 1px solid #eee;
    }

    .tabnav-main .tn-line::-webkit-scrollbar {
        display: none;
    }

    .tabnav-main .tn-line .line {
        font-size: 0.6rem;
        border-bottom: 1px solid #eee;
        padding: 0.6em 0;
        color: #333;
    }

    .tabnav-main .tn-line .hover {
        color: #f86b1f;
    }

    .tabnav-main .tn-more {
        padding-bottom: 0.5em;
        color: #333;
    }

    .tabnav-main .morelist {
        overflow: hidden;
        font-size: 0.6rem;
    }

    .tabnav-main .morelist .moretitle {
        overflow: hidden;
        padding: 0.5em 0;
    }

    .tabnav-main .morelist .morebox {
        overflow: hidden;
        width: calc(100% + 0.4em);
    }

    .tabnav-main .morelist .morebox p {
        float: left;
        min-width: calc(25% - 0.4em);
        margin: 0 0.4em 0.4em 0;
        text-align: center;
        line-height: 2.2em;
        border: 1px solid #e9e9e9;
    }

    .tabnav-main .morelist .morebox p.hover {
        color: #f86b1f;
        border-color: #f86b1f;
    }

    /* zzao */
    .zzao {
        background: rgba(0, 0, 0, 0.4);
        height: 100vh;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }

    .cptitle {
    background-color: #fff;
    }
  /* goodlist */
  .goodlist {
  display: block;
  background: white;
  overflow: hidden;
  padding: 10px 0;
  margin: 0 10px;
  border-bottom: 1px solid #e9e9e9;
  }

  .goodlist .goodbox {
  overflow: hidden;
  }

  .goodlist .goodbox .goodimg {
  float: left;
  width: 3.75rem;
  height: 3.75rem;
  overflow: hidden;
  border-radius: 0.4em;
  background: #e9e9e9;
  }

  .goodlist .goodbox .goodimg img {
  display: block;
  width: 100%;
  height: 100%;
  }

  .goodlist .goodbox .goodtext {
  float: right;
  width: calc(100% - 4rem);

  flex-direction: column;
  justify-content: space-between;

  display: flex;
  }

  .goodlist .goodbox .goodname {
  font-size: 0.7rem;
  line-height: 1.4em;
  margin-bottom: 0.2rem;
  display: -webkit-flex;
  /* Safari */
  display: flex;
  }

  .goodlist .goodbox .goodname p {
  flex: 1;
  font-size: 0.7rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 1em;
  }

  .indexFl {
  padding: 0 0.5rem 0.5rem;
  overflow: hidden;
  }

  .indexFl img {
  display: block;
  pointer-events: none;
  }

  .permis {
  overflow: hidden;
  position: relative;
  }

  .permis img {
  pointer-events: none;
  }

  .permisClose {
  position: absolute;
  right: 0;
  top: 15%;
  width: 1.2rem;
  height: 1.2rem;
  }

  .goodlist .goodbox .goodname img {
  margin-left: 0.5rem;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  position: relative;
  top: 0.1rem;
  }

  .goodlist .goodbox .goodname span {
  font-size: 0.6rem;
  color: #999;
  }

  .goodlist .goodbox .score {
  font-size: 0.58rem;
  color: #999;
  }

  /* >>> */
  .score {
  overflow: hidden;
  display: -webkit-flex;
  /* Safari */
  display: flex;
  align-items: center;
  }

  .score>>>.el-rate {
  height: auto;
  overflow: hidden;
  float: left;
  }

  .score>>>.el-rate__icon {
  font-size: 0.58rem;
  margin-right: 0.2em;
  }

  .score>>>.el-rate__item {
  float: left;
  }

  .score>>>.el-rate__text {
  line-height: 0.58rem;
  float: left;
  }

  .score>>>.slist {
  font-size: 0.58rem;
  color: #999;
  float: left;
  line-height: 0.58rem;
  padding-left: 0.5em;
  }

  .score>>>.slist span {
  font-size: 0.6rem;
  color: #ccc;
  padding: 0 10px;
  }

  /* area */
  .area {
  overflow: hidden;
  font-size: 0.58rem;
  color: #999;
  }

  .area p {
  float: left;
  }

  .area span {
  float: right;
  }

  .pricebox {
  overflow: hidden;
  }

  .cphui {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
  line-height: 1.4em;
  font-size: 0.58rem;
  margin-bottom: 0.2rem;
  }

  .cphui i {
  display: inline-block;
  color: white;
  padding: 0 0.2em;
  border-radius: 3px;
  margin-right: 0.1rem;
  font-size: 0.58rem;
  background: #ff841e;
  }

</style>
