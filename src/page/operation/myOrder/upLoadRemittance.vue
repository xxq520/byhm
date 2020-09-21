<template>
    <div class="upLoad">
        <topnav :topnav="topnav"></topnav>
        <div class="main_box">
            <p class="title">上传汇款单：</p>
            <div class="imgList">
                <template v-if="shopImg.length > 0">
                    <imgUpload text="添加" v-for="(item,index) in shopImg" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
                </template>
                <template v-if="shopImg.length == 0">
                    <imgUpload text="添加" @img-upload="shopImgChange" @click.native="shopImgfn(0)"></imgUpload>
                </template>
                <imgUpload :add="true" text="添加"  @img-upload="shopImgChange" @click.native="shopImgAdd"></imgUpload>
            </div>
        </div>
        <!-- <div class="submit" @click="submin()">提交</div> -->
             <div class="pay-btn-box">
                 <el-button type="warning" @click.native="submin()">提交</el-button>
             </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            topnav:{
                title:'上传汇款单',
            },
            shopImg: [],
            imgUploadStopAdd:false,
            shopImgIndex:null,
            showupload3: true,
            seq:this.$cookie.get('seq'),
            orderList: sessionStorage.getItem('orderNo'),
            
        }
    },
    mounted(){
      
  
    },
    methods: {
         shopImgAdd(){
                this.shopImgIndex = this.shopImg.length;
        },
        shopImgChange(val){
        if(this.shopImgIndex == this.shopImg.length){
            this.shopImg.push(val.url)
            console.log(this.shopImg);
        }else{
            if(val.url){
            this.shopImg[this.shopImgIndex] = val.url;
            }else{
                this.shopImg.splice(this.shopImgIndex,1)
                if(this.shopImg.length<2) {
                    this.showupload3 = true
                }
            };
            this.shopImgIndex = null;
        };
        },
         shopImgfn(i){
            this.shopImgIndex = i;
        },
        submin(){
            let param = {
                imgIdArr: this.shopImg,
                ordernoArr:sessionStorage.getItem('orderNo')?sessionStorage.getItem('orderNo').split(','):'',
                seq:this.$cookie.get('seq')
            }
             if(this.orderList == '' || param.ordernoArr.length ==0){
                 Toast('请勾选对应单号进行上传');
                 return
            }
            if(this.shopImg.length == 0){
                Toast('请上传汇款单');
                return           
            } 
             axios({
                url: this.Api +'order/uploadPic',
                method: "post",
                data: param,
                headers: {
                    "X-Nideshop-Token": this.$cookie.get("token"),
                }
            }).then(res=>{
                if(res.data.errno == 0){
                    Toast(res.data.errmsg);
                    sessionStorage.removeItem("orderNo");
                    this.$router.go(-1);
                }
            })
        },
    },
}
</script>
<style scoped>
.upLoad{
    background-color: #f2f2f2;
    min-height: 100vh;
    overflow: hidden;
}
.main_box{
    margin-top: .4444rem /* 20/45 */;
    background-color: #ffffff;
    padding: .8889rem .4444rem ;

}
.pay-btn-box {
padding: 1.458333rem 0;
text-align: center;
cursor: pointer;


}
.el-button--warning{
padding: 1px 1px;
cursor: pointer;
display: inline-block;
width: 8.375rem;
height: 1.666667rem;
border-radius: 0.833333rem;
line-height: 1.66667rem;
border-color:#ff9500;
background: -webkit-linear-gradient(
left,
#ff9500,
#ff8c39
); /* Safari 5.1 - 6.0 */
background: -o-linear-gradient(
right,
#ff9500,
#ff8c39
); /* Opera 11.1 - 12.0 */
background: -moz-linear-gradient(
right,
#ff9500,
#ff8c39
); /* Firefox 3.6 - 15 */
background: linear-gradient(to right, #ff9500, #ff8c39); /* 标准的语法 */
text-align: center;
line-height: 1.666667rem;
color: #ffffff;
font-size: 0.625rem;
letter-spacing: 2px;

}
.main_box .title{
    font-size: .6222rem /* 28/45 */;
    color: #333333;
    padding-bottom: .6444rem /* 29/45 */;
}
.main_box .imgList{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}



.main_box .imgList >>> .upload-icon{
    /* border-style: solid; */
   border: none;
}

.main_box .imgList >>> .upload {
   border: 1px solid #cccccc;
   
}

.main_box .imgList  >>> .imgClear{
    color: #909090;
}
.submit{
    width: 10rem /* 450/45 */;
    height: 1.7778rem /* 80/45 */;
    line-height: 1.7778rem /* 80/45 */;
    text-align: center;
    font-size: .7111rem /* 32/45 */;
    background-color: #ff9500;
    color: #ffffff;
    border-radius: .8889rem /* 40/45 */;
    margin: 1.3333rem /* 60/45 */ auto 0;
}
</style>


