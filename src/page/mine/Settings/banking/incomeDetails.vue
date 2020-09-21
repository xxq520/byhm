<template>
    <div class="income">
        <topnav :topnav="topnav"></topnav>
        <div class="mainTab">
            <div>
                <p>{{(totalMoney/100).toFixed(2)}}</p>
                <p>总收益(元)</p>
            </div>
            <div>
                <p>{{list.length}}</p>
                <p>收益次数</p>
            </div>
        </div>
        <div class="maixBox">
            <ul>
                <li v-for="(item,index) in list" :key="index">
                    <p><span>{{cardId}}<i>{{levelIdName(item.levelId)}}</i></span><span class="price">+￥{{(item.profit/100).toFixed(2)}}</span></p>
                    <p><span>{{item.orderNo}}</span><span>{{textState(item.type)}}</span></p>
                </li>
            </ul>

        </div>
        <!-- <loading :load.sync="loadshow" :end.sync="loadend"></loading> -->
        
    

    </div>
</template>
<script>
export default {
    data(){
        return{
            topnav:{
                title:'收益明细'
            },
            // loading:false,
            // loadshow:true,
            // loadend:false,
            userId:this.$cookie.get('userid'),
            id: this.$route.query.id,
            totalMoney: this.$route.query.total,
            list:[],
            cardId: this.$cookie.get("card"),
        }
    },
    computed:{
        textState(){
           return function (state) {
               console.log(state);
                switch(state){
                    case 1:
                    return '发展获利'
                    break
                    case 2:
                    return '推荐获利'
                    break;
                    case 3:
                    return '保证金返现'
                    break;
                    case 4:
                    return '基金';
                    break;
                    case 5:
                    return '代金券';
                    break;
                    case 6 :
                    return '抵扣券';
                    break;
                    case 7:
                    return "非伙伴运营商基金"
                    break;
                }
           }
        },
        levelIdName(){
            return function(levelId){
                switch(levelId){
                    case 1:
                    return'超级会员';
                    break
                    case 2:
                        return '运营商';
                    break
                    case 3:
                    return'区县运营商';
                    break
                    case 4:
                    return'市运营商';
                    break
                    case 5:
                    return'省运营商';
                    break

                }

            }
        }
    },
    mounted(){
        this.getIncomeList();
    },
    methods:{
        // loadMore(){
        //     this.loading = true;
        //     this.loadshow = false;
        //     this.loadend = true;
        // },
        getIncomeList(){
            axios.get(this.Api + 'ledgerlog/findBeneficiaryLedgerLog?userId='+this.userId+'&weeklyId='+this.id,
            {headers: { "X-Nideshop-Token": this.$cookie.get('token') }
            }).then(res => {
                console.log(res);
                if(res.data.Bool == true){
                    this.list = res.data.Data; 
                }
            })
        },
        changeTextState(state){
            console.log(state);
            switch(state){
                case 1:
                return '发展获利'
                break
                case 2:
                return '推荐获利'
                break;
                case 3:
                return '保证金返现'
                break;
                case 4:
                return '基金';
                break;
                case 5:
                return '代金券';
                break;
                case 6 :
                return '抵扣券';
                break;
                case 7:
                return "非伙伴运营商基金"
                break;
            }
        },
        
    }
}
</script>
<style scoped>
.income{
    overflow: hidden;
    min-height: 100vh;
    background-color: #f2f2f2;
}
.mainTab{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .4889rem /* 22/45 */ 0;
    text-align: center;
    font-size: .8889rem /* 40/45 */;
    color: #333333;
    margin-bottom: .4444rem /* 20/45 */;

}
.mainTab div {
    width: 50%;
    border-left: 1px solid #f2f2f2;
}
.mainTab p:first-child{
    padding: .3333rem /* 15/45 */ 0;
}
.mainTab p:last-child{
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.maixBox {
    background-color: #fff;
    padding: 0 .4444rem /* 20/45 */;
}
.maixBox ul li {
    border-bottom:  1px solid #eeeeee;
    padding: .6667rem /* 30/45 */ 0;
    
}
.maixBox ul li  p{
    display: flex;
    justify-content: space-between;
    font-size: .5333rem /* 24/45 */;
    color: #666666;
}
.maixBox ul li  p:first-child{
    font-size: .5778rem /* 26/45 */;
    color: #333333;
    line-height: .7111rem /* 32/45 */;
    padding-bottom: .2667rem /* 12/45 */;
    
}
.maixBox ul li  p i{
    padding: 0 .4444rem /* 20/45 */ ;
    height: .7111rem /* 32/45 */;
    line-height: .7111rem /* 32/45 */;
    font-size: .4444rem /* 20/45 */;
    color: #ffffff;
    background-color: #ff6e04;
    display: inline-block;
    border-radius: .3556rem /* 16/45 */;
    margin-left: .6667rem /* 30/45 */;
    vertical-align: top;

}
.maixBox ul li  p .price{
    color: #ff6e04;
    font-size: .6667rem /* 30/45 */;

}

.maixBox ul li:last-child{
    border-bottom: none;
}
</style>

