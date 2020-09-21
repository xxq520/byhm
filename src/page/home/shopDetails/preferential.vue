<template>
    <div class="preferentialbox">
        <!-- <div class="preferTitle">
      <p>欢迎“百业惠盟”<br>的尊贵用户光临本店！</p>
      <span>我们将以优惠的价格、真诚的态度为您提供优质的产品和周到的服务！</span>
    </div> -->
        <li class="vouchar" v-for="(item,i) in vouchar" :key="i">
            <!-- <preferentialCanvas :vouchar="item" :index="i"></preferentialCanvas> -->
            <div class="zhekou">
                <p v-if="item.type==0"><span style="background-color: #ff4e00;">折</span>打折优惠</p>
                <p v-if="item.type==1"><span style="background-color: #ffbb02;">减</span>满减优惠</p>
                <p v-if="item.type==2"><span style="background-color: #ff1212;">惠</span>一口价优惠</p>
                <p v-if="item.type==3"><span style="background-color: #028bff;">特</span>特价优惠</p>
                <p v-if="item.type==4"><span style="background-color: #ff35ea;">促</span>折上折优惠</p>
            </div>
            <div class="youhui" @click="shuoming(item.id)">
                 <div class="huodong"><span>{{item.name}} </span> <span style="float: right;">{{item.detail}}</span></div>
                <div class="huodong">{{item.remarks}}</div>
                <div class="times">有效期:{{ formData(item.useStartDate)}}至{{ formData(item.useEndDate)}}</div>
            </div>
        </li>
        <div class="bottomtext">
            本企业诚信经营 货真价惠 童叟无欺<br>感谢您的光临！欢迎您经常光临！
        </div>
    </div>
</template>

<script>
    // import preferentialCanvas from './preferentialCanvas'
    export default {
        // props: ["vouchar"],
        data() {
            return {
                vouchar: [],
                id: this.$route.query.id,
                to: "`/management/privilege?id=${item.id}`",
                shqseq:this.$route.query.seq,
            }
        },
        // components: {
        //     preferentialCanvas
        // },
        mounted() {
            // 店铺优惠
             this.id = this.id?this.id:'';
             this.shqseq = this.shqseq?this.shqseq:'';
            axios({
                url: this.Api + 'voucher/homePageVoucherInfo?merid=' + this.id + '&page=1&size=10&seq='+this.shqseq,
                method: "get"
            }).then(res => {
                if (res.data.code == 0) {
                    // console.log(res, '9')
                    this.vouchar = res.data.pageUtil.list;

                }
            });
        },

        methods: {
            formData(time) {
                if (time) {
                    var date = new Date(time);
                    var Y = date.getFullYear();
                    var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
                    var D = date.getDate() <
                        10 ? '0' + date.getDate() : date.getDate();
                    var h = date.getHours() < 10 ? '0' + date.getHours() :
                        date.getHours();
                    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                    var
                        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); //return
                    Y + '-' + M + '-' + D + ' ' + h + ' :' + m;
                    return Y + '-' + M + '-' + D;
                }
            },
            shuoming(id){
             
                this.$router.push('/management/privilege?id='+id )
            }
        }
    }

</script>

<style scoped>
    .preferentialbox {
        overflow: hidden;
        background: white;
    }




    .bottomtext {
        font-size: 0.6rem;
        overflow: hidden;
        color: #595757;
        text-align: center;
    }

    .vouchar {
        display: block;
        width: 90%;
        margin: 0 auto 0.8rem;
        border-bottom: 1px solid #eee;
    }
   .vouchar .zhekou {
     display: flex;
     flex-direction:row;
     align-items:center;
   }
    .vouchar .zhekou p {
      flex: 1;
        font-size: 0.7rem;
        color: #555;

    }

    .vouchar .zhekou p span {
        display: inline-block;
        padding: 0.15rem 0.25rem;
        margin-right: 0.4rem;
        color: #fff;
    }

    .vouchar .youhui {
        font-size: 0.63rem;
        padding: 0.4rem 0.3rem 0.6rem 1.6rem;
        line-height: 1.2rem;
    }

    .vouchar .youhui .times {
        color: #999;
        font-size: 0.60rem;
    }

    .sub {
        font-size: 0.65rem;
        width: 6em;
        margin: 0 auto;
        line-height: 1.7em;
        text-align: center;
        color: white;
        
        border-radius:0.8rem;
        background-color: #ff6e04;
    }

</style>
