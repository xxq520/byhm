<template>
  <div class="MyHeader">
    <!-- 头部 -->
    <topnav :topnav="topnav"></topnav>
    <!-- 内容信息 -->
    <div class="mineContent">
      <mt-cell title="上级昵称" class="line"><span class="item">哈哈哈</span></mt-cell>
      <mt-cell title="上级身份" class="line"><span class="item">区域合伙人</span></mt-cell>
      <mt-cell title="上级卡号" class="line"><span class="item">888888</span></mt-cell>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
   name: 'MyHeader',
   data() {
    return {
      topnav:{
        title:'我的上级'
      },
    }
   },
   mounted(){

   },
   methods: {

   }
}
</script>

<style scoped>
.MyHeader {
  min-height: 100vh;
}
.MyHeader .mineContent {
  padding: 0 0.2222rem;
  background: white;
}
.MyHeader .mineContent .line {
  font-size: 0.6222rem;
  color: #333333;
  border-bottom: 1px solid #eeeeee;
}

.MyHeader >>> .mint-cell-wrapper {
  background: none;
}
.MyHeader >>> .mint-cell:last-child {
  background: none;
}
.MyHeader >>> .mint-cell-title {
  font-size: 15px;
}

</style>
