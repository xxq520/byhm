<template>
  <mt-popup v-model="popupVisible" position="bottom" pop-transition="popup-fade" class="adress">
    <div class="title">{{ tltext }}</div>
    <div class="mianbox">
      <template v-if="!loadshow">
        <div class="item" v-for="(item,index) in letter" :key="index" v-if="item.length > 0">
          <div class="zimu">{{ index }}</div>
          <div class="listtext">
            <p v-for="(p,i) in item" :key="i">
              <span @click="confirm(p.id, p.name, post.type)">{{ p.name }}</span>
            </p>
          </div>
        </div>
      </template>
      <loading :load.sync="loadshow"></loading>
    </div>
  </mt-popup>
</template>

<script>
// 中文转拼音
import spell from '@/assets/js/spell'; 
export default {
  props: ["post", "visible"],
  data () {
    return {
      letter:{'A':[], 'B':[], 'C':[], 'D':[], 'E':[], 'F':[], 'G':[], 'H':[], 'I':[], 'J':[], 'K':[], 'L':[], 'M':[], 'N':[], 'O':[], 'P':[], 'Q':[], 'R':[], 'S':[], 'T':[], 'U':[], 'V':[], 'W':[], 'X':[], 'Y':[], 'Z':[]},
      tltext:'',
      btnvisible: 0,
      popupVisible: this.visible,
      region:{},
      loadshow:false
    }
  },
  watch:{
    // 获取父级组件打开弹窗
    visible(val){
      this.popupVisible = val;
    },
    // 向父级组件传数据值
    region(val){
      this.$emit("region-change",val);
    },
    // 告诉父级组件关闭弹窗
    popupVisible(val){
      this.$emit("visible-change",val);
    },
    post(val){
      this.provinces(val);
    } 
  },
  mounted() {
    this.provinces(this.post);
  },
  methods: {
    provinces(val){
      let that = this;
      this.loadshow = true;
      this.tltext = '选择';
      if(val.type == 1){
        axios.get(this.Api+'region/getRegion?parentId=1').then(res => {
          let data = res.data.data;
          that.letterfn(data);
        });
      }else if(val.type > 1){
        axios.get(this.Api+'region/getRegion?parentId='+val.id).then(res => {
          let data = res.data.data;
          that.letterfn(data);
        });
      }
    },
    confirm(val, text, type){
      this.region = {
        id: val,
        text: text,
        type: type
      };
      this.popupVisible = false;
    },
    letterfn(arr){
      let that = this;
      this.loadshow = false;
      for(var i in that.letter){
        that.letter[i] = [];
        ;(function(i){
          arr.forEach(d => {
            if(i == spell(d.name).substr(0,1)){
              that.letter[i].push(d);
            }
          })
        })(i);
      };
    }
  }
}
</script>

<style scoped>
.adress{
  width:100%;
  overflow:hidden;
  border-radius:8px 8px 0 0;
  height:80vh;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
}
.adress .title{
  width:100%;
  text-align: center;
  font-size:14px;
  padding:10px 0 4px;
}
.timelist{
  padding:0 15px 0;
  margin-bottom:15px;
}
.timelist .tlist{
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  height:30px;
}
.timelist .tlist input{
  flex:1;
}
.timelist .tlist span{
  width:1px;
  display: block;
  position: relative;
  margin:0 10px;
  background:#ed0c48;
}
.timelist .tlist span::before{
  content: '';
  position:absolute;
  left: -3px;
  top:12px;
  background:white;
  width:5px;
  height:5px;
  border:1px solid #ed0c48;
  border-radius:50%;
}
.timelist .tlist:first-child span{
  height:15px;
  margin-top:15px;
}
.timelist .tlist:first-child span::before{
  top:-3px;
}
.timelist .tlist:last-child span{
  height:15px;
}
.timelist .tlist span.checked::before{
  background:#ed0c48;
}
.mianbox{
  flex: 1;
  background:#fbfbfb;
  border-top:1px solid #e9e9e9;
  padding:15px 15px 0;
  overflow:auto;
}
.mtitle{
  font-size:12px;
  line-height: 1.4em;
  color:#999;
  padding:10px 0;
}
.item{
  overflow:hidden;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
}
.item .zimu{
  width:1em;
  font-size:14px;
  color:#999;
  margin-right:15px;
  line-height:1.4em;
}
.item .listtext{
  flex:1;
}
.item .listtext p{
  color:#0d0d0d;
  font-size:14px;
  line-height:1.4em;
  padding-bottom:15px;
}
</style>
