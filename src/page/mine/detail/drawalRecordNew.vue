<template>
    <div class="mainbox">
        <topnav :topnav="topnav"></topnav>
        <div class="collapse" v-for="(item,index) in month" :key="index">
            <el-collapse v-model="activeNames" @click.native="msgClose(index)" accordion>
                <el-collapse-item :name="index+1">
                    <template slot="title">
                        <div class="mian-title">

                            {{ formData(item.month,'YY')+'年'+formData(item.month,'MM')+'月' }}
                            <i class="el-icon-arrow-down" :class="{'updown':activeNames == index+1}"></i>
                        </div>

                        <div class="moneybox">
                            <span>提现:￥{{returnFloat(item.withdrawMoney)}} </span>
                            <span>手续费:￥{{returnFloat(item.fee) }}</span>
                            <span>实际:￥{{returnFloat(item.arrivalAmount) }}</span>
                        </div>
                    </template>

                    <div class="itembox">
                        <div class="itemmain">
                            <div class="item" v-for="(post,y) in item.list" :key="y" @click="listClick(post)">

                                <div class="title">

                                    <div class="headimg">

                                        <p>{{(amounttime(post.applyTime).getMonth()+1) +'-'+amounttime(post.applyTime).getDate() }}
                                        </p>
                                        <span>{{ amounttime(post.applyTime).getHours() +':'+amounttime(post.applyTime).getMinutes()}}</span>
                                    </div>

                                </div>
                                <div class="mint-cell">
                                    <div class="mint-cell-wrapper">
                                        <div class="mint-cell-title">
                                            <div class="mint-cell-text">
                                                <div class="mr-r-5">

                                                    <p> 提现:{{ post.bankName }}</p>
                                                    <p>卡号：{{getHideBankCardNum(post.cardNo)}}
                                                    </p>
                                                </div>
                                                <div class="mr-r">
                                                    <span>提现:￥{{ returnFloat(post.withdrawMoney)}}</span>
                                                    <span>手续费:￥{{ returnFloat(post.fee )}}</span>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="mint-cell-value">
                                            <p class="yqr" style="color:#ff921e;">
                                                {{ post.status=="0"?'申请中':post.status=="1"?'成功':post.status=="2"?'完成':post.status=="3"?'不成功':'' }}
                                            </p>
                                            <p class="yqt">
                                                实际:￥{{( post.status!=0 && post.status!== 3) ? returnFloat(post.arrivalAmount) : returnFloat(0) }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div class="morebox">
              <span class="more" @click="getdata">显示更多<i class="el-icon-caret-bottom"></i></span>
              <span class="load" @click="getdata">正在加载中<i class="el-icon-loading"></i></span>
              <span class="all">已全部加载</span>
            </div> -->
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="no-data" style="margin-top:150px" v-if="nodata"><img src="@/assets/images/qs.png" alt=""></div>
    </div>
</template>

<script>
    export default {
        name: 'drawalRecordNew',
        data() {
            return {
                topnav: {
                    title: '提现记录'
                },

                list: {},
                month: [],
                userId: this.$cookie.get('userid'),
                activeNames: 1,
                activeIndex: -1,
                pagelist: [],
                pageSize: 5,
                yearmonth: [],
                nodata: false,
                index:this.$route.query.index
            }
        },
        created() {
            Indicator.open();
            let  type = this.index==6?1:0
            axios.get(this.Api + "ledgerwithdraw/groupByMonth?userId=" + this.userId+'&type='+type,
             {
                headers: {
                    "X-Nideshop-Token": this.$cookie.get('token')
                }
            }).then(res => {
                var arr = [];

                res.data.Data.forEach((item, index) => {

                    arr.push(item)
                });

                if (!arr.length) {
                    // console.log("1111")
                    this.nodata = true;
                }
                Indicator.close();
                this.month = res.data.Data;
                console.log(this.month)
            }).catch(err => {
                Indicator.close();
                console.log(err)
            })
            // axios.get(this.TXApi + 'ledgerwithdrawweekly/findByUserId?userId='+this.userId+'&auditStatus=1',{headers: { "X-Nideshop-Token": this.$cookie.get('token') }})
            // .then(res => {
            //   Indicator.close();
            //   if(res.data.Bool == true){
            //     console.log(res);

            //   }
            // })
        },
        methods: {
            msgClose(index) {

                this.activeIndex = this.activeIndex == index ? -1 : index;
                console.log(this.activeIndex == index)

            },
            getHideBankCardNum(str) {
                    let length = str.length;
                     
                    if (str.length == '0') return "未绑定";
                    if (length > 4) {
                        let startNum = str.substring(0, 8);
                        let endNum = str.substring(length - 4, length);
                       let  bankCardNum = startNum + " **** " + endNum;
                       return bankCardNum;
                    } 
                
                
            },

            // 获取数据
            // getdata(){
            //   let n = this.activeNames - 1;
            //   let ymobj = this.yearmonth[n];
            //   let post = {
            //     userId: this.userId,
            //     month: ymobj.y+'-'+ymobj.m,     //2018-11
            //     pageNum: this.pagelist[n],
            //     pageSize: this.pageSize,
            //   };
            //   this.loadMore(post,n);
            // },
            // 输出时间日期
            formData(time, text) {
                var date = new Date(time);
                var Y = date.getFullYear();
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
                var D = (date.getDate()<10 ? '0'+date.getDate() :date.getDate());
                var h = (date.getHours()<10 ? '0'+date.getHours() :date.getHours());
                var m = (date.getMinutes() <10 ?'0'+date.getMinutes() :date.getMinutes());
                var s = (date.getSeconds()<10 ?'0'+date.getSeconds() :date.getSeconds());
                return text == 'YY' ? Y :
                    text == 'MM' ? M :
                    text == 'DD' ? D :
                    text == 'hh' ? h :
                    text == 'mm' ? m : '';
            },
            // loadMore(post,n){
            //   let that = this;
            //   let ym = that.yearmonth[n].y+that.yearmonth[n].m;
            //   that.more(n,'load');
            //   axios.get(this.Api+'/withdraw/list',{params:post}).then(res => {
            //     let data = res.data.page;
            //     if(data.list.length < that.pageSize){
            //       that.more(n,'all');
            //       if(data.list.length == 0){
            //         return false;
            //       }
            //     }else{
            //       that.more(n,'more');
            //     }
            //     (that.pagelist[n])++;
            //     if(that.list[ym]){
            //       that.list[ym] = that.list[ym].concat(data.list);
            //     }else{
            //       that.list[ym] = data.list;
            //     }
            //     //console.log(that.list,n)
            //   });
            // },
            // more(n,val){
            //   let morebox = $('.morebox').eq(n);
            //   morebox.find('span').hide();
            //   switch(val){
            //     case 'more':
            //       morebox.find('span.more').show();
            //       break;
            //     case 'load':
            //       morebox.find('span.load').show();
            //       break;
            //     case 'all':
            //       morebox.find('span.all').show();
            //       break;
            //   }
            // },
            returnFloat(value) {
                var value = Math.round(parseFloat(value)) / 100;
                var xsd = value.toString().split(".");
                if (xsd.length == 1) {
                    value = value.toString() + ".00";
                    return value;
                }
                if (xsd.length > 1) {
                    if (xsd[1].length < 2) {
                        value = value.toString() + "0";
                    }
                    return value;
                }
            },

            listClick(obj) {
                this.$router.push({
                    path: '/banking/withdrawalProcess2?id=' + obj.id
                })
            },

            amounttime(val) {
                return new Date(val)
            }
        }
    }

</script>

<style scoped>
    .mainbox {
        overflow: hidden;
        min-height: 100vh;
        background: #f5f5f5;
    }

    .collapse {
        overflow: hidden;
        margin-top: 0.5rem;
    }

    .collapse>>>.el-collapse {
        border: none;
    }

    .mian-title {
        width: 100%;
        text-align: center;
        background: #ffcc99;
        color: #ec0a48;
        font-size: 14px;
        line-height: 36px;
    }

    .moneybox {
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #eee;
    }

    .moneybox span {
        float: left;
        width: 33.333%;
        padding: 0.3em 0.6em;
        font-size: 0.58rem;
        color: #555;
        line-height: 1.6em;
    }

    .collapse>>>.el-collapse-item__arrow {
        display: none;
    }

    .collapse>>>.el-collapse-item__content {
        border: none;
        padding: 0;

    }

    .collapse>>>.el-collapse-item__header {
        height: auto;
        flex-wrap: wrap;
    }

    .collapse i.el-icon-arrow-up {
        transition: all linear 0.5s;
    }

    .collapse .updown {
        transform: rotate(180deg);
    }

    /**/
    .itembox {
        overflow: hidden;
        padding: 0 10px;
    }

    .itembox .item {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        align-items: stretch;
        background: white;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .itembox .item:last-child {
        border-bottom: none;
    }

    .itemmain {
        overflow: hidden;
    }

    .itembox .item .title {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-right: 1px solid #eee;
        padding: 0 0.5rem 0 0;
        margin-right: 0.5rem;
    }

    .itembox .item .headimg {
        float: left;

        text-align: center;
        line-height: 1.4em;

    }

    .itembox .item .headimg p {
        font-size: 0.66rem;
        margin-bottom: 0.3rem;
    }

    .itembox>>>.mint-cell {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-image: none;
        flex: 1;
        min-height: 0;
    }

    .itembox>>>.mint-cell-wrapper {
        background-image: none;
        padding: 0 0 0 0;
        align-items: stretch;
        width: 100%;
    }

    .itembox>>>.mint-cell-title {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 70%;
        float: left;
    }

    .itembox>>>.mint-cell-text {
        display: block;
        /* overflow:hidden; */
        text-overflow: ellipsis;
        white-space: nowrap;
        /* max-width:10em; */
        color: #333;
        font-size: 0.6rem;
    }

    .itembox>>>.mint-cell-value {
        width: 30%;
        text-align: right;
        float: right;
        flex-direction: column;
        justify-content:flex-end ;
    }

    .itembox>>>.mint-cell-value p {
        width: 100%;
        font-size: 0.6rem;
        display: block;
    
     
    }

    .itembox>>>.mint-cell-value p.yqt {
        font-size: 0.56rem;
         padding-top: 0.4rem;
        color: #fa8241;
      

    }

    .itembox>>>.mint-cell-label {
        font-size: 0.65rem;
        margin-top: 4px;
    }

    .itembox>>>.mr-r-5 {
        font-size: 0.55rem;
        white-space: nowrap;
        text-overflow: ellipsis;
          line-height: 0.8rem;
        margin-bottom: 0.3rem;
    }

    .itembox>>>.mr-r {
        font-size: 14px;
        color: #666;
    }

    .itembox>>>.mr-r span {
        float: left;
        width: 50%;
    }

    .mint-cell-text img {
        width: 3rem;
        height: 1.2em;
        margin-left: 5px;
    }

    .item-img img {
        width: auto;
        height: 1.4em;
    }

    .morebox {
        font-size: 0.54rem;
        width: 100%;
        border-top: 1px solid #eee;
        text-align: center;
        color: #999;
        padding: 0.2em 0;
        line-height: 1.4em;
    }

    .morebox span {
        display: inline-block;
        width: 100%;
    }

</style>
