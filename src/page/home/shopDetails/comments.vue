<template>
<div class="comment">
    <div class="comment-label">
      <div class="label" v-for="(item,index) in list" :key="index" @click="switchLabel(index)">
        {{item.text+' '+item.num}}
      </div>
    </div>
    <div class="comment-body">
      <div class="comment-box" v-for="(item,index) in comment" :key="index">
        <div class="people-pic">
          <img :src="headimg[index]">
        </div>
        <div class="comment-main">
          <div class="comment-top">
            <div class="name">
              {{ item.anonymous==1?'惠盟用户':item.username.substring(0,1)+'***'}}<!--<span class="live">LV5</span>-->
            </div>
            <div class="time">
              {{ formData(item.updateTime) }}<img class="yz-icom" src="@/assets/images/dpgl_icon_commen.png" v-if="item.supContent == 1">
            </div>
          </div>
          <div class="score">
              <el-rate v-model="item.rate" disabled disabled-void-color="#c3c3c3" :colors="['#f86b1f','#f86b1f','#f86b1f']"></el-rate>
          </div>
          <div class="comment-text">{{ item.content }}</div>
          <div class="comment-pic">
            <img v-for="(url,i) in item.commentPictures" :key="i" :src="url" />
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
export default {
  props: ["category"],
  data () {
    return {
      id:this.$route.query.id,
      comment:[],
      list:{},
      defheadimg:require('@/assets/images/dp_tx_nmtx.png'),
      headimg:{},
    }
  },
  mounted() {
    // 店铺优惠
    axios({
      url:this.Api + 'merchantcomment/merListShow?mchid='+this.id,
      method:"get"
    }).then(res => {
      if(res.data.code == 0){
        let label = {}
        let data = res.data.resultMap
        this.comment = data.merchantCommentVos;
        label[1] = {
          text:'晒图评论',
          num: data.pictureComment
        };
        label[2] = {
          text:'好评',
          num: data.wellComment
        };
        label[3] = {
          text: '最新评论',
          num: data.newestComment
        };
        for(var i in data.labelNames){
          label[i] = {
            text: i,
            num: data.labelNames[i]
          };
        };
        this.advatar(data.merchantCommentVos);
        this.list = label;
        this.$emit("count", data.merchantCount);
      }
    });
  },
  methods: {
    switchLabel(val) {
      console.log(this.category)
      let query = {
        id:this.id,
        category:this.category
      };
      switch (val) {
        case '0':
        case '1':
        case '2':
        case '3':
          query.condition = val;
          break;
        default:
          query.labelName = val;
          break;
      };
      this.$router.push({path:'/comment/commentList',query:query})
    },// 输出时间日期
    formData(time){
      if(time){
        var date = new Date(time);
        var Y = date.getFullYear();
        var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
        var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        //return Y+'-'+M+'-'+D+' '+h+':'+m;
        return Y+'-'+M+'-'+D;
      }
    },
    // 评论头像
    advatar(obj){
      let that = this;
      obj.forEach((post,index) => {
        axios.get(that.Head + "rest/user/getUserImgUrlBySeq?seq=" + post.seq).then(res => {
          if(post.anonymous==0 && res.data.status == 200){
            this.$set(this.headimg, index, res.data.data);
          }else{
            this.$set(this.headimg, index, this.defheadimg);
          }
        });
      });
    }
  }
}
</script>

<style scoped>
.comment-label {
    padding: .625rem .416667rem 0 .416667rem;
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + .416667rem)
}
.comment-label .label {
    padding: 2px .5rem;
    font-size: 12px;
    border-radius: .708333rem;
    border: 1px solid #f86b1f;
    color: #f86b1f;
    text-align: center;
    margin: 0 .416667rem .416667rem 0;
}
.comment-label .active {
    border: 1px solid #f86b1f;
    color: #f86b1f;
}
.comment-body {
  padding: 0 .416667rem;
  overflow:hidden;
}
.comment-box {
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0 0;
}
.comment-box .people-pic {
  width: 1.666667rem;
  height: 1.666667rem;
}
.comment-box .people-pic img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.comment-box .comment-main {
  width: calc(100% - 2.083333rem);
  border-bottom: 1px solid #eeeeee;
}
.comment-top {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}
.comment-top .name {
  font-size: .583333rem;
}
.comment-top .time {
  font-size: 12px;
  color: #999999;
  position: relative;
}
.comment-top .time .yz-icom {
  width: 1.5rem;
  position: absolute;
  right: 6px;
  top: 4px;
}
.comment-top .name .live {
  width: 30px;
  border-radius: 10px;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
  background-color: #f86b1f;
  display: inline-block;
  font-weight: normal;
  margin-left: 10px;
}
.score {
  overflow:hidden;
  width:100%;
  padding:0.2em 0;
}
.score >>> .el-rate{
    height:auto;
    overflow:hidden;
    float:left;
}
.score >>> .el-rate__icon{
    font-size:15px;
    margin-right:0.2em;
}
.score >>> .el-rate__item{
    float:left
}
.score >>> .el-rate__text{
    line-height:15px;
    float:left;
}
.score >>> .slist{
    font-size:0.6rem;
    color:#666;
    float:left;
    line-height:16px;
    padding-left:0.5em;
}
.score >>> .slist span{
    font-size:0.6rem;
    color:#ccc;
    padding:0 10px;
}
.comment-text {
  font-size: 12px;
  color: #333333;
  margin-bottom: .416667rem;
}
.comment-pic img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: .416667rem;
  margin: 0 .416667rem .416667rem 0;
}
</style>