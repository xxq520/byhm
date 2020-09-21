<template>
    <div class="optional">
        <!-- <topnav :topnav="topnav"></topnav> -->
        <mt-header title="请自选您在百业惠盟的尊贵身份" class="topNav">
            <mt-button icon="back" slot="left" @click="goBack"></mt-button>
        </mt-header>
        <div class="mainBox">
            <p class="title"><span>平台运营商</span><span>共拥崭新商机 &nbsp;  共创丰厚财富</span></p>
            <ul>
                <li  v-for="(item,index) in list" :key="index" :class="className(item.level,index)"  @click="changelevel(index,item.level)" >
                    <!-- <div > -->
                        <p >{{item.title}}</p>
                        <p class="red">{{item.price}}</p>
                    <!-- </div> -->

                </li>
            </ul>
        </div>
        <div class="mainBox">
            <p class="title"><span>尊贵惠盟用户</span><span>精致生活 自购省钱 分享赚钱</span></p>
            <div :class="{act : cur_tab == 4}" @click="changelevel(4,'1')">
                <p>超级会员</p>
                <p>（购买爱之家商城消费券）</p>
                <p class="red">365元/年</p>
            </div>
             <div :class="{act : cur_tab == 5}" @click="changelevel(5,'1')">
                  <p>惠盟VIP</p>
                  <p>（购买爱之家商城消费券）</p>
                      <p class="red">99元/年</p>
            </div>
        </div>
        <div class="confirm" @click="linkToInvite">确认</div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // topnav:{
            //     title:'选择升级的身份'
            // },
            list:[
                {'level':'5','title': '省运营商', 'price': '50000元'},
                {'level':'4','title': '市运营商', 'price': '30000元'},
                {'level':'3','title': '县运营商', 'price': '10000元'},
                {'level':'2','title': '运营商', 'price': '1000元' }
            ],
            cur_tab:0,
            inviteLevel:this.$route.params.level, 
            inviteCode: this.$route.params.code,
        }
    },
    mounted(){
        console.log(this.inviteLevel); 
        if(this.inviteLevel == 1){
            this.changelevel(4,'1')
            return;
        }
         if(this.inviteLevel == 2){
           this.changelevel(3,'2');
           return;
       }
        if(this.inviteLevel == 3){
            this.changelevel(2,'3')
            return;
        }
       if(this.inviteLevel == 4){
           this.changelevel(1,'4');
           return
       }
       if(this.inviteLevel == 5){
           this.changelevel(0,'5');
           return;
       }
        
       
    },
    computed:{
        className() {
            return function(lvevel,idx){
                if(this.inviteLevel < lvevel){
                    return 'disable'

                }else{
                    if(this.cur_tab == idx){
                        return 'act'
                    }
                }
            }
        }
    },
    methods: {
        goBack(){
            this.$router.push({path:'/'});
        },
        

        changelevel(idx,level){
            this.cur_tab = idx;
            this.level_id = level;
        },
        linkToInvite(){
            if(this.level_id  == 1&&this.cur_tab==4){
                this.$router.push({ path:'/toBecomeMember/'+this.inviteCode+'/'+1+'/'+1});
            }
            else if (this.level_id == 1&&this.cur_tab==5){
                 this.$router.push({ path:'/toBecomeMember/'+this.inviteCode+'/'+1+'/'+4});
            }
             else{
                this.$router.push({ path: "/invite/"+this.inviteCode+'/'+this.level_id });
            }
            
        }
    },
}
</script>
<style scoped>
.topNav{
    background-color: #ff911e;
}
.optional{
    background-color: #f2f2f2;
    min-height: 100vh;
}
.mainBox{
    margin-top: .4444rem /* 20/45 */;
    background-color: #ffffff;
    padding: 0 .4444rem /* 20/45 */;
    overflow: hidden;
}
.mainBox .title{
    
    height: 1.6rem /* 72/45 */;
    line-height: 1.6rem /* 72/45 */;
    display: flex;
    flex-direction:row;
      flex-wrap: wrap;
    font-size: .6222rem /* 28/45 */;
    color: #666666;
    border-bottom: 1px solid #eeeeee;
}
.mainBox ul {
    display: flex;
    justify-content: space-around;
    padding: .6667rem /* 30/45 */ 0 .8222rem /* 37/45 */;
}
.mainBox ul li {
    width: 3.1111rem /* 140/45 */;
    padding: .7778rem /* 35/45 */ 0 ;
    border-radius: .2222rem /* 10/45 */;
    border: 1px solid #cecece;
    text-align: center;
    font-size: .5778rem /* 26/45 */;
    color: #333333;
}
.mainBox ul li.disable{
    pointer-events: none;
    background-color:#999999;
    color: #ffffff; 
}
.mainBox ul li.disable p{
    color: #ffffff;
}
.mainBox .red{
    color: #ff6e04;
    font-size: .4889rem /* 22/45 */;
    padding-top: .2222rem /* 10/45 */;
}
.mainBox  div{
    width: 43% /* 300/45 */;
    padding: 0.666rem /* 35/45 */ 0;
    border: 1px solid #cecece;
    border-radius: .2222rem /* 10/45 */;
    font-size: .5778rem /* 26/45 */;
    text-align: center;
    margin: 0.5rem;
    float: left;
  
}
.mainBox  div p:nth-child(2){
    font-size: .4444rem /* 20/45 */;
}
.confirm{
    width: 10rem /* 450/45 */;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    text-align: center;
    border-radius: .8889rem /* 40/45 */;
    font-size: .7111rem /* 32/45 */;
    color: #fffefe;
    background-color: #ff6e04;
    margin: 1.3333rem /* 60/45 */ auto 0;
}
.mainBox .act{
    background-color: #ff6e04;
    border: 1px solid #ff6e04;
    color: #ffffff;
}
.mainBox .act .red{
    color: #ffffff;
}
.mainBox .title span:last-child{
     background: linear-gradient(to right,#4caaf3 0%, #f21fd2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-fill-color: transparent;
    font-size: .4889rem /* 22/45 */
}

 .optional >>> .mint-header-title{
    flex: none;
  }
</style>


