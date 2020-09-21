<template>
    <div>
        <div class="banner" id="banner">
            <img class="bg" src="@/assets/images/franchise.png">
            <div class="text" id="text">
                <h3 class="title">{{content.title}}</h3>
                <div class="content">
                    <p class="text-content" v-for="(item,index) in content.text" :key="index">{{item}}</p>
                    <p class="text-content">具体详情请咨询：<b>4001802520</b> 或留下您的联系方式，说明意向{{promoterName}}区域，我们将尽快与您联系。谢谢！</p>
                </div>
                <div class="agreen" @click="agree">
                    <i id="agree" class="el-icon-circle-check"></i>
                    同意成为{{promoterName}}商协议
                </div>
            </div>
        </div>
        <!-- <a id="xieyi" :href="content.link" :download="content.link"></a> -->
        <!-- 协议弹窗 -->
        <!-- <mt-popup v-model="popupVisible" >
            <div class="protocol">

            </div>
        </mt-popup> -->
        <!--<img id="preview" style="display: none" :src="content.link" preview preview-text="推广商合同协议">-->
        <picture-viewer v-if="agreen" :imgUrl.sync="imgUrl"></picture-viewer>
    </div>
</template>
<script>
export default {
  props: ['content'],
  data() {
    return {
        agreen: false,
        popupVisible: false,
        imgUrl:[{
            url:this.content.link,
            name: this.content.level == 2? '推广商合同协议' : '运营商合同协议'
        }],
        promoterName: '运营'
    };
  },
  mounted() {
    let that = this;
    this.setBannerHeight();
    window.onresize = function (){
        that.setBannerHeight();
    };
      
  },
  methods: {
    agree() {
        let that = this;
        if(!this.agreen) {
            document.getElementById('agree').style.color = '#F52052'
            this.agreen = true
            that.popupVisible = true
            // MessageBox({
            //     title:"",
            //     message: '是否查看百业惠盟协议',
            //     showCancelButton: true
            // }).then(action => {
            //     if(action ==='confirm'){
            //         // alert(document.querySelector('#xieyi').href)
            //         document.querySelector('#xieyi').click();
            //     }

            // });
            //document.getElementById('preview').click();
        }else {
            document.getElementById('agree').style.color = '#999999'
            this.agreen = false
            that.popupVisible = false
        };

    },
    setBannerHeight() {
        let bannerHeight = document.getElementById('text').clientHeight + 105;
        document.getElementById('banner').style.height = bannerHeight + 'px';
        // console.log(bannerHeight);
    },
    getPromoterName() {
        if(this.content.level == 2) {
            this.promoterName = '推广'
        }
    }
  },
  created() {
    this.getPromoterName()
  }
};
</script>
<style scoped>
.banner {
    position: relative;
    background: #ffffff;

}
.banner .bg {
    height: 184px;
}
.text {
    width: 13.125rem;
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    top: 90px;
    left: 50%;
    margin-left: -6.5625rem;
    border-radius: 10px;
    box-shadow: 0px 2px 3px #636060;
    padding: 0 .625rem;
    margin-bottom: 3rem;

}
.text .title {
    text-align: center;
    font-size: 18px;
    margin: 1.041667rem 0 .833333rem 0;
    font-weight: bold;
}
.text-content {
    font-size: 13px;
    text-indent: 13px;
    margin-bottom: 15px;

}

.agreen {
    font-size: 16px;
    display: flex;
    justify-content: center;
    margin-bottom: 1.833333rem;
    color: #333333;
    font-weight: 100;
    font-weight: 400;
}

#agree {
    color: #999999;
    font-size: 22px;
    margin-right: 8px;
}
.protocol {
    width: 90vw;
    height:20rem;
    background: #ffffff;
    overflow-y: auto;
}
</style>

