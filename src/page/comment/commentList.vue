
 <template>
    <div class="comment">
      <topnav :topnav="topnav" :category.sync="$route.query.category"></topnav>
      <div class="comment-label">
          <div class="label" v-for="(item,index) in list" :key="index" :class="{active: labelName == index || condition == index}" @click="switchLabel(index)">
            {{item.text+' '+item.num}}
          </div>
      </div>
      <div class="comment-body" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="3">
        <div class="comment-box" v-for="(item,index) in comment" :key="index">
          <div class="people-pic">
            <img :src="item.avatar">
          </div>
          <div class="comment-main">
            <div class="comment-top">
              <div class="name">
                {{ item.anonymous==1?'惠盟用户':item.username }}<!--<span class="live">LV5</span>-->
              </div>
              <div class="time">
                {{ formData(item.updateTime) }}<img class="yz-icom" src="@/assets/images/dpgl_icon_commen.png" v-if="item.supContent == 1">
                <img class="yz-icom" src="@/assets/images/dpgl_icon_commen.png" v-if="item.supContent == 1">
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
      <loading :load.sync="loadshow" :end.sync="loadend"></loading>
    </div>
</template>
<script>
export default {
  name:"comment",
  data() {
    return {
      topnav:{
        title:'全部评论',
        comment:true
      },
      id:this.$route.query.id,
      comment:[],
      list:{},
      page:1,
      size:6,
      defheadimg:require('@/assets/images/dp_tx_nmtx.png'),
      headimg:{},
      condition: this.$route.query.condition?this.$route.query.condition:this.$route.query.labelName?'':'0',
      labelName: this.$route.query.labelName?this.$route.query.labelName:'',
      loading:false,
      loadshow:true,
      loadend:false
    };
  },
  mounted() {
       console.log(this.$route)
  },
  methods: {
    loadMore(){
      this.loading = true;
      this.loadshow = true;
      let post={
        mchid: this.id,
        condition: this.condition==''?'0':this.condition,
        labelName: this.labelName,
        page: this.page.toString(),
        size: this.size.toString()
      };
      axios({
        url:this.Api + 'merchantcomment/allComentList',
        method:"post",
        data:post
      }).then(res => {
        if(res.data.code == 0){
          let data = res.data.resultMap;
          let label = {}
          if(!label['0']){
            label[0] = {
              text:'全部',
              num: data.merchantCount
            };
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
            this.list = label;
          }
          if(data.pageUtil.list.length == 0){
            this.loadend = true;
            this.loading = true;
            this.loadshow = false;
            return false;
          };
          (this.page)++;
          this.advatar(data.pageUtil.list, this.comment.length);
          this.comment = this.comment.concat(data.pageUtil.list);
        };
        this.loading = false;
        this.loadshow = false;
      });
    },
    switchLabel(val) {
      this.condition = '';
      this.labelName = '';
      switch (val) {
        case '0':
        case '1':
        case '2':
        case '3':
          this.condition = val;
          break;
        default:
          this.labelName = val;
          break;
      };
      this.loadend = false;
      this.page = 1;
      this.comment = [];
      this.loadMore();
    },
    // 输出时间日期
    formData(time){
      if(time){
        var date = new Date(time);
        var Y = date.getFullYear();
        var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
        var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
        return Y+'-'+M+'-'+D;
      }
    },
    // 评论头像
    advatar(obj, n){
      let that = this;
      obj.forEach((post,index) => {
        // axios.get(that.Head + "rest/user/getUserImgUrlBySeq?seq=" + post.seq).then(res => {
        //   if(post.anonymous==0 && res.data.status == 200){
        //     this.$set(this.headimg, index + n, res.data.data);
        //   }else{
        //     this.$set(this.headimg, index + n, this.defheadimg);
        //   }
        // });
      });
    }
  }
}
</script>
<style scoped>
.comment{
  min-height:100vh;
  background:#f5f5f5;
  overflow:hidden;
}
.comment-label {
  padding: 0.625rem 0.416667rem 0 0.416667rem;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 0.416667rem);
  background:white;
}
.comment-label .label {
  padding: 2px .5rem;
  font-size: 12px;
  border-radius: 0.708333rem;
  border: 1px solid #d1d1d1;
  color: #8c8c8c;
  text-align: center;
  margin: 0 0.416667rem 0.416667rem 0;
}
.comment-label .active {
  border: 1px solid #f86b1f;
  color: #f86b1f;
}
.comment-body {
  padding: 0 0.416667rem;
  border-top: 1px solid #eeeeee;
  background:white;
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
.comment-box .people-pic img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.comment-box .comment-main {
  width: calc(100% - 2.083333rem);
  border-bottom: 1px solid #eeeeee;
}
.comment-box:last-child .comment-main {
  border-bottom: none;
}
.comment-main .score >>> .el-rate .el-rate__icon {
    font-size: 0.6rem;
}
.comment-top {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
}
.comment-top .name {
  font-size: 0.583333rem;
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
  margin-bottom: 0.416667rem;
}
.comment-pic img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.416667rem;
  margin: 0 0.416667rem 0.416667rem 0;
}
</style>
