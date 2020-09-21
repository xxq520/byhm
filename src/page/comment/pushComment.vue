
  <template>
  <div class="push-comment">
    <topnav :topnav="topnav"></topnav>
    <div class="score">
      <div class="text">总体评分</div>
      <div><el-rate v-model="value1" void-color="#c3c3c3" :colors="['#f86b1f','#f86b1f','#f86b1f']"></el-rate></div>
    </div>
    <div class="comment-text">
      <textarea placeholder="商家满足您的期待吗？说说它的优点和美中不足的地方吧" v-model="content"></textarea>
    </div>
    <div class="comment-pic">
      <template v-if="shopImg.length > 0">
        <imgUpload text="720x400" v-for="(item,index) in shopImg" :key="index" :img.sync="item" @img-upload="shopImgChange" @click.native="shopImgfn(index)"></imgUpload>
      </template>
      <imgUpload :add="true" :commentPhone="true" text="添加图片" :stop.sync="imgUploadStopAdd" @img-upload="shopImgChange" @click.native="shopImgAdd"></imgUpload>
    </div>
    <div class="comment-label">
      <div class="title">添加标签</div>
      <div class="label-box">
        <div class="label" v-for="(item,index) in label" :key="index" @click="switchLabel(item)" :class="{'active':activefn(item)}">{{item}}</div>
      </div>
    </div>
    <div class="anonymous">
      <div class="title">匿名点评</div>
      <div>
        <el-switch v-model="value13"></el-switch>
      </div>
    </div>
    <div class="anonymous-tip">选择匿名点评后，平台将不会展示您的个人信息</div>
    <div class="push-btn-box">
      <div class="push-btn" @click="publishfn">发表</div>
    </div>
  </div>
 </template> 
  <script>
  export default {
    name: "pushComment",
    data() {
      return { 
        topnav:{
          title:'评论'
        },
        anonymous: 0,
        value13: false,
        visible: false,
        value1: 0,
        label: [],
        labelIndex: 0,
        content: '',
        shopImg: [],
        shopImgIndex:null,
        imgUploadStopAdd:false,
        labelName:[],
        id:this.$route.query.id
      }
    },
    mounted() {
      console.log(this.id)
      console.log(window.location.href)
    },
    methods: {
      activefn(text){
        for(let j = 0 ; j< this.labelName.length; j++) {
          if(this.labelName[j] == text) {
            return true;
          }
        };
        return false;
      },
      switchLabel(text) {
        let that = this
        for(let j = 0 ; j< that.labelName.length; j++) {
          if(that.labelName[j] == text){
            that.labelName.splice(j,1);
            return false;
          };
        };
        that.labelName.push(text);
        return true;
      },
      shopImgAdd(){
        if(this.shopImg.length >= 5){
          Toast('图片限制在5张以内！');
        }else{
          this.shopImgIndex = this.shopImg.length;
        }
      },
      shopImgfn(i){
        this.shopImgIndex = i;
      },
      shopImgChange(val){
        
        if(this.shopImgIndex == this.shopImg.length){
          this.shopImg.push(val.url)
        
          if(this.shopImg.length >= 5){
            this.imgUploadStopAdd = true;
          }
        }else{
          if(val.url){
            this.shopImg[this.shopImgIndex] = val.url;
          }else{
            this.shopImg.splice(this.shopImgIndex,1)
            
            if(this.shopImg.length < 5){
              this.imgUploadStopAdd = false;
            }
            
          };
          this.shopImgIndex = null;
        };
      },
      //发表评论
      publishfn() {
        let that = this
        if(that.value13) {
          that.anonymous = 1
        }
        let post = {
          "comment":{
              "mchid": this.$route.query.id,
              "userid": that.$cookie.get('userid'),
              "rate": that.value1,
              "content": that.content,
              "anonymous": that.anonymous,
              "supContent": 0,
              "deleted": 0,
              "replyId": 0,
              "isHide": 0
          },
          "labelName": that.labelName,
          "imgsUrl": that.shopImg
        }
        if (that.value1 == 0){
          Toast('请选择评分星数','middle')
          return false
        };
        if (that.content == ''){
          Toast('请输入评价内容','middle')
          return false
        };
        Indicator.open();
        axios({
          method: "post",
          url: this.Api+"merchantcomment/save",
          data: post
        }).then(res => {
          Indicator.close();
          if(res.data.code == 0) {
            Toast(res.data.msg)
            this.$router.go(-1);
          }
          if(res.data.code == 500) {
            Toast("评论失败！")
          }
        })
        
      },
      //获取标签
      getLabelName() {
        let that = this
        axios({
          method: "get",
          url: this.Api+"merchantcomment/labelList?category="+this.$route.query.category,
        }).then(res => {
          // console.log(res)
          if(res.data.code == 0) {
            that.label = res.data.labelNames
          }
        })
      }
    },
    created() {
      this.getLabelName();
    }
  }
  </script>
  <style scoped>
    .push-comment {
      background-color: #f5f5f5;
      height: 100vh;
    }
    .score {
      padding: .416667rem .416667rem;
      background-color: #ffffff;
      margin-top: .416667rem;
    }
    .score .text {
      font-size: 14px;
      color: #333333;
      margin-bottom: 4px;
    }
    .comment-text {
      padding: 0 .416667rem;
      background-color: #ffffff;
    }
    .comment-text textarea {
      height: 5.833333rem;
      padding: .416667rem .208333rem;
      border: 1px solid #d1d1d1;
      width: 100%;
    }

    .upload {
      width: 60px;
      height: 60px;
      border: 1px dashed #d1d1d1;
      text-align: center;
      line-height: 20px;
      border-radius: .416667rem;
    }
    .comment-pic {
      display: flex;
      flex-wrap: wrap;
      padding: .416667rem .416667rem;
      background-color: #ffffff;
    }
    .comment-pic img.pic {
      width: 60px;
      height: 60px;
      margin-right: .416667rem;
    }
    .upload img {
      width: 1.166667rem;
      height: 1rem;
      margin-top: .416667rem;
    }
    .upload .text {
      font-size: 12px;
      color: #999999;
      text-align: center;
    }
    .comment-label {
      padding: 0 .416667rem;
      background-color: #ffffff;
    }
    .comment-label .title {
      font-size: 14px;
      color: #333333;
      margin: .625rem 0 .416667rem 0;
      padding-top: .416667rem;
    }
    .label-box {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% + .458333rem);
    }
    .label-box .label {
      width: 3.333333rem;
      height: .833333rem;
      font-size: 12px;
      text-align: center;
      border: 1px solid #d1d1d1;
      border-radius: .333333rem;
      line-height: .833333rem;
      margin-right: .458333rem;
      margin-bottom: .416667rem;
    }
    .label-box .active {
      border: 1px solid #f86b1f;
      color: #f86b1f;
    }
    .anonymous {
      display: flex;
      padding: 0 .416667rem;
      background-color: #ffffff;
      justify-content: space-between;
      align-items: center;
      margin: .416667rem 0;
      height: 1.833333rem;
      line-height: 1.833333rem;
    }
    .anonymous .title {
      font-size: 14px;
    }
    .anonymous-tip {
      font-size: 12px;
      margin: .416667rem 0;
      padding: 0 .416667rem;
      color: #999999;
    }
    .push-btn-box {
      text-align: center;
      margin-top: 1.666667rem;
    }
    .push-btn {
      display: inline-block;
      width: 9.375rem;
      height: 1.666667rem;
      background-color: #ff930d;
      border-radius: .833333rem;
      text-align: center;
      line-height: 1.666667rem;
      font-size: 16px;
      color: #ffffff;
    }
    .comment-pic >>> .uploadbox {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    .comment-pic >>> .upload {
      width: 60px;
      height: 60px;
    }
    .comment-pic >>> .upload-icon {
      width: 100%;
      height: 100%;
    }
    .comment-pic >>> .upload-icon p {
      font-size: 12px;
    }
    .comment-pic >>> .uploadbox .upload .comment-img {
      height: 100%;
    }
    
  </style>
