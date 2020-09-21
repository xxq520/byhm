<template>
  <div class="buy-card-record">
    <!-- 头部 -->
    <!-- 头部 -->
    <div class="head">
      <mt-header title="购卡记录">
      </mt-header>
	  <topnav :topnav="topnav"></topnav>
    </div>
    <!-- 用户卡 -->
    <card></card>
    <div class="between-flex bt bb">
      <div>购卡日期</div>
      <div>2018.10.10</div>
    </div>
    <div class="between-flex bt">
      <div>购卡有效期</div>
      <div>2018.10.10-2019.10.10</div>
    </div>
    <div class="between-flex">
      <div>购卡次数</div>
      <div>1次</div>
    </div>
    <bottomnav :carcount="carcount"></bottomnav>
  </div>
</template>

<script>
export default {
  name: "purchasedCard",
  data() {
    return {
	  topnav:{
		  title:'购卡记录',
		  back:false
		},
      carcount: "用户福利",
    };
  },
  methods: {
  },
};
</script>

<style scoped>
/* >>>可以修改某一个标签里面的其他组件样式 */
/* .hello >>> .mint-button{
    background:#666;
    color:white;
  } */
.buy-card-record {
  height: 100vh;
  background: #f5f5f5;
}
.head >>> .mint-header {
  background: hsl(27, 100%, 57%);
}

.between-flex {
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  font-size: .625rem;
  color: #666666;
  padding: 0 0.833333rem;
  background: #ffffff;
}

.bt {
  border-bottom: 1px solid #bbbbbb;
}
.bb {
  border-top: 1px solid #bbbbbb;
}
.go-back {
  width: 10px;
  position: absolute;
  left: 10px;
  top: 18px;
}
</style>
