<template>
    <div class="order">
        <topnav :topnav="topnav"></topnav>
        <div class="mainBox" >
            <img src="@/assets/images/png.png" alt>
         
        </div>
          <div class="close">
              <span class="closeBtn" @click="closeQuestionBox">联系人工客服</span>
          </div>
    </div>

</template>

<script>
    export default {

        name: "order",
        data() {
            return {

                topnav: {
                    title: '在线客服',
                },
                userid: this.$cookie.get('userid'),
                orderCode: true,
                usre: this.$cookie.get("userPhone")

            };
        },
      created() {
    
                   // window.m7CardInfo = {
                   // "left": {
                   // "url": "https://www.7moor.com/wp-content/uploads/2017/03/publicT_03.png"
                   // },
                   // "right1": {
                   // "text": "紧凑型SUV家庭首选旅行必备家用汽车紧凑型SUV家庭首选旅行必备家用汽车",
                   // "color": "#595959",
                   // "fontSize": 12
                   // },
                   // "right2": {
                   // "text": "内饰做工精细，外观大气",
                   // "color": "#595959",
                   // "fontSize": 12
                   // },
                   // "right3": {
                   // "text": "¥169997-210000",
                   // "color": "#ff6b6b",
                   // "fontSize": 14
                   // },
                   // "extraInfos": ["随时随地－连接企业与客户"],
                   // "url": "https://www.7moor.com/"
                   // }

                   window.qimoClientId = {
                   userId: this.userid, // 自定义用户的唯一id，不能传空字符串、null、中文，id由字母大小写、数字及'-'和 '_'组成
                   priority: false, //是否优先进线设置，非必填，值为boolean类型的true或false
                   nickName:this.usre,//自定义用户昵称，定义用户昵称则userId必传
                   };

                   $.getScript(

                   'https://ykf-webchat.7moor.com/javascripts/7moorInit.js?accessId=ab928cb0-6b2d-11ea-8d70-5f15534745b7&autoShow=false&language=ZHCN',
                   );
      },
        mounted() {
             Indicator.open();
             setTimeout(() => {
                 Indicator.close();
             }, 2000);
        },
        methods: {
          closeQuestionBox(){
                
                 window.kefu = true;

                 window.qimoChatClick()
              setTimeout(() => {
                 
              }, 1000);
                
          }


        },
    
    };

</script>

<style scoped>
    .order {
        width: 100%;
        height: 100%;
    }

  

      .mainBox {
 
      width: 100%;
      height: 80%;
      background-color: #ffffff;
      box-sizing: border-box;
      overflow: auto;
      padding: 5%;
      }
      
      .mainBox img {
      display: block;
      width: 100%;
      height: 100%;
      }

     .close {
      width: 100%;
      text-align: center;
     
      }

   .closeBtn {
     
      width: 7rem;
      height: 1.4rem;
      text-align: center;
      line-height: 1.4rem;
      color: #ffffff;
      background-color: #ff8624;
      border-radius: .7rem;
      font-size: .6rem;
      padding: 0.2rem 0.4rem;

      }


</style>
