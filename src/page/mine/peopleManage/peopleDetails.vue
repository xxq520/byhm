<template>
    <div class="peopleManage">
        <topnav :topnav="topnav"></topnav>
        <template v-if="index > 0">
            <ul class="topBox">
                <li>
                    <p>{{info.lastMonthBenefitStr?info.lastMonthBenefitStr:0.00}}</p>
                    <p>上月收益(元)</p>
                </li>
                <li>
                    <p>{{info.totalBenefitStr?info.totalBenefitStr:0.00}}</p>
                    <p>总收益(元)</p>
                </li>
                <li>
                    <p>{{info.inviteNum?info.inviteNum:0}}</p>
                    <p>发展用户数(人)</p>
                </li>
            </ul>
        </template>
        <div class="infoBox">
            <p>
                <span>人脉姓名</span>
                <span>{{!info.realName || info.realName == '' || info.realName == null ?'惠盟用户':info.realName}}</span>
            </p>
            <p>
                <span>手机号码</span>
                <span v-if="index == 2">保密</span>
                <span v-else>{{info.username}}</span>
            </p>
            <p>
                <span>卡号</span>
                <span>{{info.cardNo}}</span>
            </p>
            <p>
                <span>当前等级</span>
                <span>{{info.levelName}}</span>
            </p>
            <p>
                <span>注册时间</span>
                <span>{{formData(info.createTime)}}</span>
            </p>
            <p>
                <span>类型</span>
                <span v-if="index ==0">潜在人脉</span>
                <span v-if="index ==1">直接人脉</span>
                <span v-if="index ==2">间接人脉</span>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            topnav:{
                 title: "人脉管理"
            },
            id: this.$route.query.id,
            index:this.$route.query.index,
            info : '',
        }
    },
    mounted(){
        this.getDetails();
    },
   
    methods:{
        getDetails(){
            let id = this.id;
            axios.get(this.Api+'/user/queryBenefitInfo?id='+id).then(res=>{
                if (res.status == 200) {
                let data = res.data;
                console.log(data);
                this.info = data;
                // this.username = data.username
                // this.wxNum =data.wechatUnionid==''|| data.wechatUnionid==null?'暂无':data.wechatUnionid;
                // this.lastProfit =data.lastMonthBenefit
                // this.totalProgit =data.totalBenefit
                // this.registerTime =data.createTime
                // this.invitId =data.cardNo
                }else{
                Toast('网络错误，请重试！')
                }
            })
        },
        formData(time){
        var date = new Date(time);
        var Y = date.getFullYear() + '.';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        var D = date.getDate() <10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() <10 ? '0'+date.getHours() : date.getHours();
        // var m = date.getMinutes() + ':';
        var m = date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
        // return Y+M+D+h+m+s;
        return Y+M+D+' '+h+':'+m;
        },
    }
}
</script>
<style scoped>

.peopleManage{
    background-color: #f5f5f5;
    min-height: 100vh;
    overflow: hidden;
}
.peopleManage  .topBox{
    width: 100%;
    background-color: #fff;
    height: 3.1111rem /* 140/45 */;
    display: flex;
    justify-content: space-between;
    padding: .4889rem /* 22/45 */  0;
    box-sizing: border-box;
    margin-bottom: .4444rem /* 20/45 */;
}
.peopleManage  .topBox li{
    width: 33.33%;
    box-sizing: border-box;
    border-right: 1px solid #f2f2f2;
    text-align: center;
    font-size: .8889rem /* 40/45 */;
    color: #333333;
}
.peopleManage  .topBox li:last-child{
    border-right: none;
}

.peopleManage  .topBox li p:last-child{
    font-size: .5333rem /* 24/45 */;
    color: #666666;
    line-height: 1rem /* 45/45 */;
}
.peopleManage .infoBox{
    background-color: #fff;
    padding: 0 .4889rem /* 22/45 */;
}
.peopleManage .infoBox p{
    height: 1.9778rem /* 89/45 */;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    justify-content: space-between;
    font-size: .5778rem /* 26/45 */;
    color: #333333;
    line-height: 1.9778rem /* 89/45 */;
    align-items: center;
}
.peopleManage .infoBox p:last-child{
    border-bottom: none;
}
.peopleManage .infoBox p span:last-child{
    color: #666666;
}
</style>


