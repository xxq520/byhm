<template>
  <mt-popup v-model="popupVisible" position="bottom" pop-transition="popup-fade" class="adress">
    <div class="title">请选择</div>
    <div class="timelist" v-if="postdata['prov'] && postdata['prov'].name!=null && postdata['prov'].name!=''">
      <div class="tlist">
        <span :class="{'checked':postdata['prov'] && postdata['prov'].name!=null && postdata['prov'].name!=''}"></span>
        <input type="text" :value="postdata['prov'].name" placeholder="请选择省份" readonly @click="provinces()">
      </div>
      <div class="tlist">
        <span :class="{'checked':postdata['city'] && postdata['city'].name!=null && postdata['city'].name!=''}"></span>
        <input type="text" :value="postdata['city'].name" placeholder="请选择城市" readonly @click="cityfn(postdata['prov'].id, postdata['prov'].name)">
      </div>
      <div class="tlist">
        <span :class="{'checked':postdata['area'] && postdata['area'].name!=null && postdata['area'].name!=''}"></span>
        <input type="text" :value="postdata['area'].name" placeholder="请选择地区" readonly>
      </div>
    </div>
    <div class="mianbox">
      <template v-if="!loadshow">
        <div class="mtitle">{{ tltext }}</div>
        <div class="item" v-for="(item,index) in letter" :key="index" v-if="item.length > 0">
          <div class="zimu">{{ index }}</div>
          <div class="listtext">
            <p v-for="(p,i) in item" :key="i">
              <span v-if="type==1" @click="cityfn(p.areaid, p.areaname)">{{ p.areaname }}</span>
              <span v-if="type==2" @click="areafn(p.areaid, p.areaname)">{{ p.areaname }}</span>
              <span v-if="type==3" @click="confirm(p.areaid, p.areaname)">{{ p.areaname }}</span>
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
  props: ["visible"],
  data () {
    return {
      letter:{'A':[], 'B':[], 'C':[], 'D':[], 'E':[], 'F':[], 'G':[], 'H':[], 'I':[], 'J':[], 'K':[], 'L':[], 'M':[], 'N':[], 'O':[], 'P':[], 'Q':[], 'R':[], 'S':[], 'T':[], 'U':[], 'V':[], 'W':[], 'X':[], 'Y':[], 'Z':[]},
      tltext:'',
      btnvisible: 0,
      popupVisible: this.visible,
      type:1,
      region:{},
      postdata:{},
      loadshow:false,
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
      this.provinces();
      this.$emit("visible-change",val);
    }
  },
  mounted() {
    this.provinces();
  },
  methods: {
    provinces(){
      let that = this;
      this.loadshow = true;
      this.tltext = '选择省份';
      this.postdata = {};
      this.type = 1;
      let param = {
        type: this.type,
        id: '0'
      }
      axios({
          method: "post",
          url: that.Api + "UnionPayEnter/areaList",
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: qs.stringify(param)
        }).then(res => {
          if(res.data.code == 200){
            let data = res.data.data;
            console.log(data);
            that.letterfn(data);
          }
        })
    },
    cityfn(val,text){
      let that = this;
      this.loadshow = true;
      this.tltext = '选择城市';
      this.type = 2;
      this.postdata['prov'] = {
        id: val,
        name: text
      };
      this.postdata['city'] = {};
      this.postdata['area'] = {};
      this.postdata['street'] = {};
      // axios.get(this.Api+'region/getRegion?parentId='+val).then(res => {
      //   let data = res.data.data;
      //   that.letterfn(data);
      // })
      let param = {
        type : this.type,
        id :  this.postdata['prov'].id
      }
       axios({
          method: "post",
          url: that.Api + "UnionPayEnter/areaList",
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: qs.stringify(param)
        }).then(res => {
          if(res.data.code == 200){
            let data = res.data.data;
            console.log(data);
            that.letterfn(data);
          }
        })
    },
    areafn(val,text){
      let that = this;
      this.loadshow = true;
      this.tltext = '选择地区';
      this.postdata['city'] = {
        id: val,
        name: text
      };
      this.postdata['area'] = {};
      this.type = 3;
      // axios.get(this.Api+'region/getRegion?parentId='+val).then(res => {
      //   console.log(res.data.data);
      //   let data = res.data.data;
      //   that.letterfn(data);
        
      // })
  
      let param = {
        type : this.type,
        id : val
      }
       axios({
          method: "post",
          url: that.Api + "UnionPayEnter/areaList",
          headers: { "X-Nideshop-Token": that.$cookie.get('token') },
          data: qs.stringify(param)
        }).then(res => {
          if(res.data.code == 200){
            let data = res.data.data;
            console.log(data);
            that.letterfn(data);
          }
        })

    },
    confirm(val, text){
      let that = this;
      this.loadshow = true;
      this.postdata['area'] = {
        id: val,
        name: text
      };
      this.region = this.postdata;
      this.popupVisible = false;
    },
    letterfn(arr){
      let that = this;
      this.loadshow = false;
      for(var i in that.letter){
        that.letter[i] = [];
        ;(function(i){
          arr.forEach(d => {
            if(i == spell(d.areaname).substr(0,1)){
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
  padding:0 15px;
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
