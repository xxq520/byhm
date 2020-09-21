<template>
   <div class="AboutUs">
     <!-- 头部 -->
    <div class="head">
      <topnav :topnav="topnav"></topnav>
    </div>
    <div class="imgBox">
      <img src="../../../assets/images/aboutUs.jpg" alt="">
    </div>
   </div>
</template>

<script type="text/javascript">
export default {
  name: "AboutUs",
  data() {
    return {
      topnav:{
        title:'关于我们'
      },
    };
  },
  mounted() {
    
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  }
};
</script>

<style scoped>
.AboutUs {
  background: #f5f5f5;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}
.AboutUs .head >>> .mint-header {
  background: transparent;
  /* border-bottom: none; */
  color: #313131;
}
.AboutUs .imgBox {
  width: 100%;
  padding: .444rem;
}
.AboutUs >>> .el-collapse-item__header {
  padding-left: 0.4444rem /* 20/45 */;
}

</style>
