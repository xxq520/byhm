<template>
  <div class="uploadbox" v-if="add">
    <i v-if="clear" class="el-icon-error imgClear" @click="closeUpload()"></i>
    <div class="upload" @click="uploadfn($event)">
      <div class="upload-icon">
        <i class="el-icon-plus"></i>
        <p>{{ text }}</p>
      </div>
      <input accept="image/*" type="file" style="display:none">
    </div>
    <div class="progress" v-if="zero">
      <div class="progress-text">{{ progressText }}</div>
      <mt-progress :value="progress" :bar-height="5"></mt-progress>
    </div>
  </div>
  <div class="uploadbox" v-else>
    <i v-if="!clear && imgObj.url" class="el-icon-error imgClear" @click="imgClearfn()"></i>
    <i v-if="clear" class="el-icon-error imgClear" @click="closeUpload()"></i>
    <div class="upload" @click="uploadfn($event)">
      <div class="upload-icon" v-if="!imgObj.url">
        <i class="el-icon-plus"></i>
        <p>{{ text }}</p>
      </div>
      <img :src="imgObj.url" v-else>
      <div class="change-title" v-if="changeShow? changeShow : changeHide">修改内容</div>
      <input accept="image/*" type="file" style="display:none">
    </div>
    <div class="progress" v-if="zero">
      <div class="progress-text">{{ progressText }}</div>
      <mt-progress :value="progress" :bar-height="5"></mt-progress>
    </div>
  </div>
</template>

<script>
export default {
  props: ["img",'add','stop','text','delete','changeShow'],
  data () {
    return {
      imgObj:{},
      progress:0,
      progressText:'0%',
      zero: false,
      uploadStop: this.stop,
      clearImage: this.delete,
      clear:false,
      source:null,   //取消上传
      changeHide: false
    }
  },
  watch:{
    imgObj(val){
      this.$emit("img-upload",val);
    },
    img(val){
      this.imgfn(val);
    },
    stop(val){
      this.uploadStop = val;
    },
    delete(val){
      this.clearImage = val;
    }
  },
  mounted() {
    this.imgfn(this.img)
  },
  methods: {
    imgfn(val){
      if(val || val=='' || val==null){
        let post = {
          url: val
        }
        this.imgObj = post;
      }
    },
    // 删除图片
    imgClearfn(){
      if(this.clearImage && this.clearImage==true){
        return false;
      };
      let that = this;
      // MessageBox({
      //   title:"",
      //   message: '是否确定删除图片？',
      //   showCancelButton: true
      // }).then(action => {
      //   if(action ==='confirm'){
      //     axios.post(that.Img + '/del',qs.stringify({url: that.imgObj.url})).then(res => {
      //       if( that.imgObj.thumbnail ) axios.post(that.Img + '/del',qs.stringify({url: that.imgObj.thumbnail}));
      //       that.imgObj = {};
      //       Toast('图片删除成功')
      //     })
      //   }
      // });
      console.log(that.imgObj.url)
      that.imgObj = {};
    },
    // 取消上传
    closeUpload(){
      let that = this;
      if(that.source){
        that.source.cancel('取消上传');//"取消上传"这几个字，会在上面catch（）的error中输出的，可以console看一下。
      };
      this.clear = false;
      this.zero = false;
    },
    // 上传图片
    uploadfn(event){
      if(this.uploadStop && this.uploadStop==true){
        return false;
      };
      var el = event.currentTarget;
      let that = this;
      // Toast('请选择相册后上传图片','middle')
      el.querySelector('input').click();
      el.querySelector('input').onchange = function(){
        that.ceartupload(this);
      };
    },
    // 上传事件函数
    ceartupload(event) {
      let that = this;
      let cancelToken = axios.CancelToken;//Axios使我修改axios原型链了。
      that.source = cancelToken.source();
      let form = new FormData();
      form.append("file", event.files[0]);
      // 判断上传图片不能大于10mb
      if(event.files[0].size/(1024*1024) > 8){
        Toast('上传图片太大，请上传8mb以下的图片。')
        that.closeUpload();
        return false;
      };
      if(that.zero == false) that.zero = true;
      this.clear = true;
      axios({
        method: 'post',
        url: this.Img + 'upload',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
        cancelToken:that.source.token,
        //上传监控事件
        //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
        //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
        onUploadProgress (a){        
            if (a.lengthComputable) {
              ;(function(){
                that.progress = Math.floor((a.loaded / a.total)*100);
                that.progressText = that.progress + '%';
              })();
            }
        },
        //下载监控事件
        onDownloadProgress (a){
            if (a.lengthComputable) {
              ;(function(){
                that.progress = Math.floor((a.loaded / a.total)*100);
                that.progressText = that.progress + '%';
              })();
            }
        }
      }).then(res => {
        this.clear = false;
        this.imgObj = res.data.data;
        this.progress = 0;
        this.progressText = '0%';
        event.value = ''; // 上传完图片清除input值
        this.zero = false;
      }).catch((err)=>{
        console.log(err)
      })
    },
  }
}
</script>

<style scoped>
.uploadbox{
  max-width:150px;
  width:100%;
  position: relative;
  background:white;
  border-radius:6px;
  margin: 0 0 10px 0;
}
.progress{
  position:absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:rgba(0,0,0,0.25);
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index:1;
}
.progress >>> .mt-progress{
  width:90%;
  margin:0 auto;
  height:auto;
  line-height:auto;
  padding-bottom:10px;
}
.progress-text{
  font-size:0.7rem;
  color:white;
  padding-left:8px;
  padding-bottom:5px;
  text-align:center;
  font-weight:bold;
}
.progress >>> .mt-progress-progress{
  background-color:#ff8f28;
}
.progress >>> .mt-progress-content{
  display: inline-flex;
  width:100%;
}
.upload {
  position: relative;
  color: #999999;
  width:100%;
  height:100px;
  overflow:hidden;
  border-radius:5px;
}
.imgClear{
  position:absolute;
  right:-3px;
  top:-4px;
  font-size:20px;
  border-radius:50%;
  background:white;
  color:#ec0746;
  width:18px;
  height:18px;
  z-index:9;
}
.upload-icon{
  border:1px dashed #ccc;
  height:100%;
  text-align: center;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.upload-icon i{
  font-size:30px;
  color:#ccc;
}
.upload-icon p{
  font-size:14px;
  color:#999;
}
.uploadbox img {
  height: auto;
  max-height: 100%;
}
.change-title {
  position: absolute;
  width: 100%;
  height: 30px;
  left: 0;
  top: 50%;
  margin-top: -15px;
  background-color: #000000;
  color: #f90000;
  text-align: center;
  line-height: 30px;
  opacity: 0.8;
}
</style>
