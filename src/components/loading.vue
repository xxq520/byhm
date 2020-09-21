<template>
  <div>
    <div v-show="load" class="loading">
      <mt-spinner type="fading-circle" color="#666" :size="20"></mt-spinner>正在加载
    </div>
    <div v-show="end" class="loading">加载完毕</div>
  </div>
</template>

<script>
export default {
  props: ["load","end"],
  data () {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .loading{
    width:100%;
    overflow:hidden;
    text-align: center;
    font-size:14px;
    color:#999;
    display: -webkit-flex; /* Safari */
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding:10px 0;
  }
  .loading >>> .mint-spinner-fading-circle{
    display:inline-block;
    margin-right:5px;
  }
</style>
