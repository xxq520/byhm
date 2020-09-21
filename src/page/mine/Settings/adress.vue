<template>
  <div class="agent-application">
    <topnav :topnav="topnav"></topnav>
    <div class="application">
      <div class="application-from">
        <div class="title">地址信息</div>
       <div class="cart-list provCity" @click="adressfn">
            <label v-if="!areadata">地区/详细地址:</label>
            <label v-else>
              <p>{{ areadata.prov.name }}</p>
              <p>{{ areadata.city.name }}</p>
              <p>{{ areadata.area.name }}</p>
              <!-- <p>{{ areadata.street.name }}</p> -->
            </label>
            <p class="lmain adress">
              <span></span><i class="el-icon-arrow-right"></i>
            </p>
        </div>
        <div class="address">
          <textarea :readonly="readonly" v-model="postdata.address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"></textarea>
        </div>
        <!-- <div class="mailbox">
          <mt-field disableClear label='邮箱：' type="email" v-model="email" ></mt-field>
        </div> -->
      </div>
    </div>
    <div class="pay-btn-box" v-if="btnblue">
      <div class="pay-btn" @click="application">提交</div>
    </div>
    <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup>
  </div>
</template>

<script>
export default {
  name: "adress",
  data() {
    return {
      topnav: {
        title: "地址信息"
      },
      visible: false,
      areadata: null,
      address: '',
      cardNo: this.$cookie.get('card'),
      urlCode: '',
      postdata:'',
      btnblue:true,
      noChange: false,
      readonly: false
    };
  },
  mounted(){
    axios.post(this.Api + '/user/queryByCardNo?cardNo='+this.cardNo).then(u=>{
      let data = u.data;
      this.postdata = data;
      console.log(u)

      if(data.province && data.city && data.county && data.province != '' && data.city != '' && data.county != ''){
        this.areadata = {};
        this.btnblue = false;
        this.noChange = true
        this.readonly = true
      }
      if(this.areadata && data.province && data.province != ''){
        this.areadata['prov'] = {}
        this.areadata['prov'].name = data.province;
      };
      if(this.areadata && data.city && data.city != ''){
        this.areadata['city'] = {}
        this.areadata['city'].name = data.city;
      };
      if(this.areadata && data.county && data.county != ''){
        this.areadata['area'] = {}
        this.areadata['area'].name = data.county;
      };
    });
  },
  methods: {
    adressfn() {
      if(this.noChange) {
        this.visible = false
      }else {
        this.visible = true;
      }
    },
    region(val) {
      this.areadata = val;
      // console.log(val);
    },
    visiblefn(val) {
      this.visible = val;
    },
    application(){
      let that = this;
      let post = {
        id: parseInt(that.$cookie.get('userid')),
        address: that.postdata.address,
        city: that.areadata.city.name,
        province: that.areadata.prov.name,
        county: that.areadata.area.name,

      }
      axios({
        method: "post",
        url: that.Api + 'user/infoUpdate',
        data: post
      })
      .then(res => {
        if(res.data.code == 0) this.$router.go(-1);

        Toast(res.data.msg);

      })
    }
  }
};
</script>

<style scoped>
.agent-application {
  background-color: #f2f2f2;
  min-height: 100vh;
}
.application {
  padding: 0.833333rem 0.625rem 0 0.625rem;
}
.application-from {
  background-color: #ffffff;
}
.application-from .title {
  background-color: #ffe9c9;
  color: #ec0746;
  font-size: 0.666667rem;
  padding: 10px;
  border-radius: 0.208333rem 0.208333rem 0 0;
}
.agent-application >>> .mint-cell-wrapper {
  border-bottom: 1px solid #eeeeee;
  background-image:none;
}
.agent-application >>> .mint-field .mint-cell-title {
  width: 116px;
}
.agent-application >>> .mint-cell-text {
  font-size: 14px;
  color: #333333;
}
.agent-application >>> .mint-field .mint-cell-value {
  font-size: 13px;
}
.cart-list {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  padding: 0.7rem 10px;
  font-size: 14px;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.cart-list label {
  float: left;
  width: 7.5em;
  color: #333;
}
.cart-list p.lmain {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch;
  width: calc(100% - 7.7em);
  color: #333;
}
.cart-list p.adress span {
  display: block;
  flex: 1;
  height: 1.4em;
  word-break: break-all;
}
.cart-list p.adress i {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-list input {
  display: block;
  flex: 1;
  font-size: 0.7rem;
  color: #333;
  word-break: break-all;
}
.address {
  border-bottom: 1px solid #eeeeee;
}
.address textarea {
  width: 100%;
  padding: 5px 10px;
}
.pay-btn-box {
  padding: 1.458333rem 0;
  text-align: center;
}
.pay-btn {
  display: inline-block;
  width: 9.375rem;
  height: 1.666667rem;
  border-radius: 0.833333rem;
  background: -webkit-linear-gradient(
    left,
    #ff9500,
    #ff8c39
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #ff9500,
    #ff8c39
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #ff9500,
    #ff8c39
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #ff9500, #ff8c39); /* 标准的语法 */
  text-align: center;
  line-height: 1.666667rem;
  color: #ffffff;
  font-size: 0.625rem;
  letter-spacing: 2px;
}
.provCity label, .provCity p.lmain{
  width:auto;
}
</style>
