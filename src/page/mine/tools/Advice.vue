<template>
   <div class="Advice">
     <!-- 头部 -->
    <div class="head">
      <topnav :topnav="topnav"></topnav>
    </div>
    <!-- 搜索框 -->
    <div class="searchBox" v-if="hideChooseAll">
      <div class="searhed" >
        <!-- <i class="el-icon-search"></i> -->
        <input type="text" placeholder="搜索" v-model="search"
         onfocus="this.placeholder=''" onblur="this.placeholder='搜索'"
         onkeyup="this.value=this.value.replace(/\s+/g,'')">
        <i class="el-icon-circle-close"  @click="closefn($event)"></i>
      </div>
      <div class="editer" @click="editFn">编辑</div>
    </div>
    <!-- 列表内容 -->
    <div class="main">
      <div class="chooseAll" v-if="showChooseAll">
        <div @click="chooseAll($event)">全选</div>
        <div  @click="cancel">完成</div>
      </div>
      <!-- 筛选按钮 -->
      <div class="manageNav" v-if="hideChooseAll">
        <el-row>
          <el-col :span="8">
            <span :class="{checkJT:showButton}">时间</span>
            <div class="jiantou" >
              <i class="el-icon-caret-top" :class="{checkJT:sc== 1}" @click="show1()"></i>
              <i class="el-icon-caret-bottom" :class="{checkJT:sc2== 2}" @click="show2()"></i>
            </div>
          </el-col>
          <el-col :span="8">
            <span :class="{checkJT:showButton2}">状态</span>
            <div class="jiantou" >
              <i class="el-icon-caret-top" :class="{checkJT:team== 1}" @click="showT1()"></i>
              <i class="el-icon-caret-bottom" :class="{checkJT:team2== 2}" @click="showT2()"></i>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 具体列表 -->
      <ul class="pro-list">
          <li class="pro-item" v-for="(item,index) in list" :key="index" >
              <div class="pro-desc" @click="showDetail(item)">
                  <p class="pro-title">{{formData(item.addTime)}}</p>
                  <div class="content">
                    <div class="pro-content" v-html="keyWord(item.content,search)">{{item.content}}</div>
                    <div :class="{redFix:item.status == 1}">{{item.status == 0?'待处理':'处理完毕'}}</div>
                  </div>
              </div>
              <i class="checked" id="cc" v-if="showChooseAll" @click="listAll($event,item)"></i>
          </li>
          <li class="more_loading" v-show="allLoaded" style="background:#fff;text-align:center;">
              <span style="font-size:0.6222rem;color:#999;">暂无更多数据~</span>
          </li>
      </ul>
    </div>
    <div class="btnBox">
      <button  v-if="showChooseAll" @click="deletFn()">删除</button>
      <button v-if="hideChooseAll" @click="toEditFn()">新增</button>
    </div>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "Advice",
  data() {
    return {
      topnav:{
        title:'意见反馈'
      },
      search: "",
      allLoaded: false,
      showChooseAll: false,
      hideChooseAll: true,
      team: "",
      team2: "",
      sc: "", //筛选样式控制
      sc2: "",
      userId:this.$cookie.get('userid'),
      checklist: 0,
      list: [],
      chooseList: [],
      statusList:[],
      showCheck: false, //控制时间的选中符号高亮
      showTeam: false, //控制状态的选中符号高亮
      showButton: false, //选中'时间'文字的高亮
      showButton2: false //选中'状态'文字的高亮
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      axios({
        url: this.Api + "/feedback/info?userId=" + this.$cookie.get("userid"),
        method: "post",
        headers: {
          "X-Nideshop-Token": this.$cookie.get("token")
        }
      }).then(res => {
        if (res.data.errno == 0) {
          let data = res.data;
          console.log("意见反馈列表", data);
          if (data.data.length == 0) {
            this.allLoaded = true;
          } else {
            this.list = data.data;
            for (let k = 0; k < this.list.length; k++) {
              this.statusList.push(this.list[k].status)
            }
          }
        } else {
          Toast(res.data.errmsg);
        }
      });
    },
    //  删除
    deletFn() {
      Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      this.chooseList.remove("");
      // console.log(this.chooseList);//选中的列表id
      if (this.chooseList.length == 0) {
        Toast("请任意选择一条“处理完毕”的数据！");
      }else {
        var params = qs.stringify({ msgIds: this.chooseList.join() });
        axios({
          url: this.Api + "/feedback/delete",
          method: "post",
          data: params,
          headers: {
            "X-Nideshop-Token": this.$cookie.get("token")
          }
        }).then(res => {
          var data = res.data
          Toast(res.data.errmsg);
          setTimeout(() => {
            this.list = [];
            this.getList();
            this.hideChooseAll = true;
            this.showChooseAll = false;
          }, 1000);
        });
      }
    },
    // 查看详细信息
    showDetail(item) {
      this.$router.push({ path: "/tools/AdviceDetail", query: { msgId: item.msgId } });
    },
    // 全选
    chooseAll(event) {
      // let elem = event.currentTarget;
      //获得全部选中的id
      if ($(".checked").hasClass("hover")) {
        $(".checked").removeClass("hover el-icon-check");
        this.chooseList = [];
      } else {
        $(".checked").addClass("hover el-icon-check");
        axios({
          url: this.Api + "/feedback/info?userId=" + this.$cookie.get("userid"),
          method: "post",
          headers: {
            "X-Nideshop-Token": this.$cookie.get("token")
          }
        }).then(res => {
          let checkData = res.data.data;
          for (let key in checkData) {
            let checkItem = checkData[key].msgId;
            // this.chooseList.push(checkItem);
            if (checkData[key].status === 0) {
              Toast('待处理意见无法删除！')
            }else{
              this.chooseList.push(checkItem);
            }
          }
        });
      }
    },
    toEditFn() {
      this.$router.push({ name: "EditAdvice" });
    },
    // 完成
    cancel() {
      this.hideChooseAll = true;
      this.showChooseAll = false;
    },
    /* 编辑 */
    editFn() {
      this.hideChooseAll = false;
      this.showChooseAll = true;
    },
    unique(array) {
      var n = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (n.indexOf(array[i]) == -1) {
          n.push(array[i]);
        }
      }
      return n;
    },
    // 问题列表选中
    listAll(event, item) {
      let index = item.msgId;
      let elem = event.currentTarget;
      let checked = $(elem)
        .closest(".pro-item")
        .find(".checked");
      if (elem.className.indexOf("hover") == -1) {
        $(elem).addClass("hover el-icon-check");
        checked.addClass("hover el-icon-check");
        if (item.status === 0) {
          Toast('待处理意见无法删除！')
        }else{
          this.chooseList.push(index);
        }
      } else {
        // console.log('取消选中');
        // this.chooseList[this.chooseList[index]] = "";
        for (let k = 0; k < this.chooseList.length; k++) {
          const element = this.chooseList[k];
          if (element == index) {
            this.chooseList[k]=''
          }
        }
        $(elem).removeClass("hover el-icon-check");
        checked.removeClass("hover el-icon-check");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    closefn(e) {

      this.search = "";
      $(".searhed input").focus();
      var oP = document.getElementsByClassName("pro-content");
      for (let i = 0; i < oP.length; i++) {
        var content = oP[i];
        var item = content.getElementsByTagName("span");
        for (let i = 0; i < item.length; i++) {
          if (item[i].length == 0) {
            return false;
          } else {
            item[i].style.background = "none";
          }
        }
      }
    },
    // 搜索高亮
      //修改后的代码
    keyWord(val,keyword){
        val = val + '';
        if(val.indexOf(keyword) !== -1 && keyword !== ''){
            return val.replace(keyword,'<span style="background:yellow;">'+keyword+'</span>')
        }else{
            return val
        }
    },
    /*oninput(e) { //之前的代码
    oninput(e) {
      var oP = document.getElementsByClassName("pro-content");
      var str = e.target.value;
        if (str) {
            setTimeout(() => {
                for (let i = 0; i < oP.length; i++) {
                    var content = oP[i];
                    content.innerHTML = content.innerHTML
                        .split(str)
                        .join('<span style="background:yellow;">' + str + "</span>");
                }
            }, 1000);
        } else {
            setTimeout(() => {
                for (let k = 0; k < oP.length; k++) {
                    let el = oP[k].innerHTML;
                    var s = el.match(/[\u4e00-\u9fa5]/g).join("");
                    oP[k].innerHTML = s;
                }
            }, 1000);
        }
    },*/
    blurfn() {
      this.search = '';
      this.close = false;
      console.log(oP)
      if (str) {
        setTimeout(() => {
          for (let i = 0; i < oP.length; i++) {
            var content = oP[i];
            content.innerHTML = content.innerHTML
              .split(str)
              .join('<span style="background:yellow;">' + str + "</span>");
          }
        }, 1000);
      } else {
        setTimeout(() => {
          for (let k = 0; k < oP.length; k++) {
            let el = oP[k].innerHTML;
            var s = el.match(/[\u4e00-\u9fa5]/g).join("");
            oP[k].innerHTML = s;
          }
        }, 1000);
      }
    },

    formData(time) {
      var date = new Date(time);
      var Y = date.getFullYear() + ".";
      var M =
        (date.getMonth() + 1 < 10? "0" + (date.getMonth() + 1): date.getMonth() + 1) + ".";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ':';
      var m = date.getMinutes()+ ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
      // return Y+M+D+h+m;
    },
    // 时间筛选控件--升序
    show1() {
      this.showButton = true;
      this.showButton2 = false;
      this.sc = 1;
      this.sc2 = "";
      var params = {
        userId:this.userId,
        sidx:'add_time',
        sort:'asc',
      }
      axios.post(this.Api + '/feedback/queryListByTime',qs.stringify(params)).then(res=>{
        if (res.status == 200) {
          this.list = res.data.data;
          if (this.list.length == 0) {
            this.allLoaded = true;
          }
        }else{
          Toast('网络错误，请重试')
        }
      })
    },
    // 时间筛选控件--降序
    show2() {
      this.showButton = true;
      this.showButton2 = false;
      this.sc = "";
      this.sc2 = 2;
      var params = {
        userId:this.userId,
        sidx:'add_time',
        sort:'desc',
      }
      axios.post(this.Api + '/feedback/queryListByTime',qs.stringify(params)).then(res=>{
        if (res.status == 200) {
          this.list = res.data.data;
          if (this.list.length == 0) {
            this.allLoaded = true;
          }
        }else{
          Toast('网络错误，请重试')
        }
      })
    },
    // 状态筛选控件--升序
    showT1() {
      this.showButton = false;
      this.showButton2 = true;
      this.team = 1;
      this.team2 = "";
      var params = {
        userId:this.userId,
        sidx:'status',
        sort:'asc',
      }
      axios.post(this.Api + '/feedback/queryListByTime',qs.stringify(params)).then(res=>{
        if (res.status == 200) {
          this.list = res.data.data;
          if (this.list.length == 0) {
            this.allLoaded = true;
          }
        }else{
          Toast('网络错误，请重试')
        }
      })
    },
    // 状态筛选控件--降序
    showT2() {
      this.showButton = false;
      this.showButton2 = true;
      this.team2 = 2;
      this.team = "";
      var params = {
        userId:this.userId,
        sidx:'status',
        sort:'desc',
      }
      axios.post(this.Api + '/feedback/queryListByTime',qs.stringify(params)).then(res=>{
        if (res.status == 200) {
          this.list = res.data.data;
          if (this.list.length == 0) {
            this.allLoaded = true;
          }
        }else{
          Toast('网络错误，请重试')
        }
      })
    }
  }
};
</script>

<style scoped>
.for{
  background: red
}
/* 全选单选按钮 */
.Advice .checked {
  width: 0.6666rem;
  height: 0.6666rem;
  position: absolute;
  left: 0.2222rem;
  top: 50%;
  margin-top: -0.3333rem;
  border: 1px solid #ccc;
  overflow: hidden;
  border-radius: 50%;
  color: white;
  font-size: 0.6666rem;
  line-height: 0.6666rem;
}
/* 处理状态颜色切换 */
.Advice .redFix {
  color: red;
}
.Advice .checked.hover {
  background: #03a2ea;
  border-color: #03a2ea;
}
.Advice .main .chooseAll {
  font-size: 0.7333rem /* 33/45 */;
  display: flex;
  justify-content: space-between;
  padding: 0.5556rem /* 25/45 */;
  background-image: url("../../../assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  color: floralwhite;
}
.Advice .main {
  margin-top: 55px;
}
/* 底部按钮 */
.Advice .btnBox button {
  background: hsl(27, 100%, 57%);
  outline: none;
  border: none;
  width: 100%;
  height: 1.7778rem /* 80/45 */;
  color: #fff100;
  font-size: 0.7778rem /* 35/45 */;
  position: fixed;
  bottom: 0;
}
/* 内容列表 */
.Advice .main .pro-list .pro-item {
  display: flex;
  justify-content: space-between;
  padding: 0.4444rem 0.444rem 0.4444rem 1.3rem;
  background: #fff;
  position: relative;
  border-bottom: 1px solid #ccc;
}
.Advice .main .pro-list .pro-item .pro-desc {
  width: 100%;
}
.Advice .main .pro-list .pro-item .pro-title {
  font-size: 0.6222rem /* 28/45 */;
}
.Advice .main .pro-list .pro-item .content {
  font-size: 0.6667rem /* 30/45 */;
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
}
.Advice .main .pro-list .pro-item .content .pro-content {
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.Advice {
  position: relative;
  width: 100%;
  background: #fff;
  min-height: 100vh;
  background-image: url("../../../assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  padding-bottom: 60px;
}
/* 头部 */
.Advice .head >>> .mint-header {
  background: transparent;
  border-bottom: none;
}
.Advice .head >>> .mint-header-title {
  font-size: 0.75rem;
}
.Advice >>> .el-collapse-item__header {
  padding-left: 0.4444rem /* 20/45 */;
}
/* 搜索 */
.Advice .searchBox {
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto 0;
}
.Advice .searchBox .editer {
  font-size: 0.7778rem /* 35/45 */;
  margin-left: 0.6667rem /* 30/45 */;
}
.Advice .searhed {
  width: 75%;
  height: 1.3333rem /* 60/45 */;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.Advice .searhed input {
  display: block;
  height: 100%;
  font-size: 0.6222rem;
}
.Advice .searhed ::-webkit-input-placeholder {
  text-align: right;
  font-size: 0.6667rem /* 30/45 */;
  color: #000;
}
.Advice .searhed i {
  display: block;
  color: #000;
  font-size: 14px;
  padding-right: 5px;
}
/* 筛选 */
.Advice .manageNav {
  overflow: hidden;
  border-bottom: 1px solid #d9d9d9;
}
.Advice .manageNav .el-col {
  width: 50%;
  float: left;
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  text-align: center;
  font-size: 0.65rem;
  line-height: 3em;
}
.Advice .manageNav .el-col .jiantou {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 0.1rem;
}
.Advice .manageNav .el-col .checkJT {
  color: #ec0746;
  outline: none;
}
.Advice .manageNav .el-col .jiantou i {
  display: block;
  font-size: 0.6rem;
  line-height: 0.6em;
}
.Advice .manageNav .el-col .jiantou .screen {
  width: auto;
  height: 1em;
}
</style>
