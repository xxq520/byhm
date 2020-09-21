<template>
  <div class="securities">
    <div class="cantext" ref="cantext">{{ titlefn(vouchar) }}</div>
    <canvas ref="can" width="640" height="1136"></canvas>
  </div>
</template>

<script>
export default {
  props: ["vouchar","index"],
  data () {
    return {
      img: require('@/assets/images/￥.png')
    }
  },
  mounted() {
    this.canvas();
    $(window).on('resize',this.canvas);
  },
  methods: {
    // title
    titlefn(obj){
      switch(obj.type.toString()){
        case '0':
          return obj.discount?parseIn(obj.discount)+'折优惠':'无内容';
          break;
        case '1':
          return obj.preferential && obj.privilege?'折上'+parseIn(obj.preferential)+'折或折上优惠'+parseIn(obj.privilege)+'折':
            obj.preferential && !obj.privilege?'折上'+parseIn(obj.preferential)+'折':
            !obj.preferential && obj.privilege?'折上优惠'+parseIn(obj.privilege)+'折':'无内容';
          break;
        case '2':
          return obj.enoughAmount && obj.verticalReduction?'满'+obj.enoughAmount+'元减'+obj.verticalReduction+'元':
            '无内容';
          break;
        case '3':
          return obj.fixedPriceDetails?obj.fixedPriceDetails:'无内容';
          break;
          case '4':
          return obj.name;
          break;
      };
      // 解决浮点数问题
      function parseIn(num){
        let numd = num.toString().split(".")[0];
        let nums = num.toString().split(".")[1];
        numd = new Number(numd)/10;
        return nums?numd+'.'+nums:numd;
      };
    },
    canvas(){
      let can = this.$refs.can;   
      console.log(can)      // 画图画布element
      let cantext = this.$refs.cantext; // 优惠内容element
      let cxt = can.getContext("2d");   // 画图画笔
      let b = 3;        // 图片大小缩放倍数
      let s = 0.6*b;    // 字体大小比例
      let r = 20*b;     // 圆弧曲线比例
      // 放大画布大小为原来的2倍，避免生成图片模糊
    
      can.width = (can.parentNode.offsetWidth)*b;
      can.height = 210*s + cantext.offsetHeight*b;
      let h = can.offsetHeight;
      let w = can.offsetWidth;
      // 清除画布
      cxt.clearRect(0,0,w,h);
      cantext.style.top = (190*s)/(b*2) +'px';
      // 画图
      cxt.beginPath();
      cxt.moveTo(r, 0);
      cxt.lineTo(w - r, 0);
      cxt.arcTo(w, 0, w, r, r);
      cxt.lineTo(w, (h - r)/2);
      cxt.arcTo(w - r/2, (h - r)/2, w - r/2, h/2, r/2);
      cxt.lineTo(w - r/2, h/2);
      cxt.arcTo(w - r/2, (h + r)/2, w, (h + r)/2, r/2);
      cxt.lineTo(w, h - r);
      cxt.arcTo(w, h, w - r, h, r);
      cxt.lineTo(r, h);
      cxt.arcTo(0, h, 0, h - r, r);
      cxt.lineTo(0, (h + r)/2);
      cxt.arcTo(r/2, (h + r)/2, r/2, h/2, r/2);
      cxt.lineTo(r/2, h/2);
      cxt.arcTo(r/2, (h - r)/2, 0, (h - r)/2, r/2);
      cxt.lineTo(0, r);
      cxt.arcTo(0, 0, r, 0, r);
      cxt.closePath();
      // 添加背景颜色
      let grad=cxt.createLinearGradient(0,0,w,0);
      if(this.index%2 > 0){
        grad.addColorStop(0,"#fb7f7b");
        grad.addColorStop(1,"#e1384e");
      }else{
        grad.addColorStop(0,"#67eae6");
        grad.addColorStop(1,"#92a6f1");
      }
      cxt.fillStyle = grad;
      cxt.fill();
      // 添加字体
      cxt.fillStyle = "#fff";
      cxt.font = 32*s+"px Courier New";
      cxt.fillText("百业惠盟用户可享受", 32*s, 32*s*2);

      cxt.fillStyle = "#fff";
      cxt.font = 22*s+"px Courier New";
      cxt.fillText("（这是本店用户的最低优惠折扣）", (w - 22*s*14)/2, h - s*32*2.3);

      cxt.font = 22*s+"px Courier New";
      cxt.fillText("有效期：", 22*s, h - s*32);
      // 添加日期和日期下划线
      let t = 22*s*4 + 22*s;
      cxt.strokeStyle = '#fff';
      cxt.beginPath();
      cxt.moveTo(t, h - s*32 + 4);
      cxt.lineTo((w - t - 22*s)/2 + t, h - s*32 + 4);
      cxt.closePath();
      cxt.stroke();

      cxt.beginPath();
      cxt.moveTo((w - t - 22*s)/2 + t + 22*s, h - s*32 + 4);
      cxt.lineTo(w - 22*s, h - s*32 + 4);
      cxt.closePath();
      cxt.stroke();

      cxt.font = 22*s+"px Courier New";
      cxt.fillText("至", (w - t - 22*s)/2 + t, h - s*32);
      cxt.font = 24*s+"px Courier New";
      cxt.fillText(this.formData(this.vouchar.useStartDate), t + 5 , h - s*32);
      cxt.fillText(this.formData(this.vouchar.useEndDate), (w - t - 22*s)/2 + t + 22*s + 5 , h - s*32);
      // 添加￥图标
      var img = new Image();
      img.src = this.img;
      img.onload = function(){
        cxt.drawImage(img, w - 32*s*3, 32*s*0.5, 32*s*2, 32*s*2);
        // 恢复本身大小
        can.style.width = can.width/b + 'px';
        can.style.height = can.height/b + 'px';   
        // alert(can.style.width)
        // alert(can.style.height)
      };
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
        //return Y+'-'+M+'-'+D+' '+h+':'+m;
        return Y+'-'+M+'-'+D;
      }
    }
  },
  beforeDestroy() {
    $(window).off('resize',this.canvas);
  }
}
</script>

<style scoped>
.securities{
  overflow:hidden;
  position:relative;
  display: -webkit-flex; /* Safari */
  display: flex;
  align-items: center;
}
.cantext{
  width:100%;
  position:absolute;
  left:0;
  top:0;
  font-size:1.4rem;
  font-weight:bold;
  color:white;
  text-align:center;
  line-height:1.2em;
  padding:0 1rem;
}
</style>