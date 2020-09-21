<template>
  <div class="glode">
    <topnav :topnav="topnav"></topnav>
    <div class="mainbox">
      <div class="balance">
        <div class="item">
          <label>本月提现</label>
          <span>￥{{currMonth}}</span>
        </div>
        <span class="spantext">{{ '(' + (new Date().getMonth() + 1) + '月)' }}</span>
      </div>
      <div class="balance">
        <div class="item">
          <label>累计总提现</label>
          <span>￥{{all}}</span>
        </div>
      </div>
      <div class="balance">
        <div class="item">
          <label>账户余额</label>
          <span>￥{{balance}}</span>
        </div>
        <span class="spantext" @click="drawAll">全部提现</span>
      </div>
      <div class="balance">
        <div class="item">
          <label>提现金额</label>
          <div class="input-box">
            <input
              type="text"
              placeholder="输入金额"
              v-model="monery"
              @focus="showClose"
              @blur="hideClose($event)"
              @keyup="shuru($event)"
            />
            <i class="el-icon-circle-close" v-show="close" @click="clearFn"></i>
          </div>
        </div>
      </div>
      <div class="balinput">
        <p class="inputtext">{{ msgtext }}</p>
      </div>
      <div class="submit" @click="submit">提现</div>
    </div>
    <div class="tstext">温馨提示：</div>
    <div
      class="tstext"
    >依据国家规定，单月800元（内）可免收个税，超过部分则按劳务报酬累计税率代扣代缴个税；另百业惠盟已接通银联支付，但对所有未成功入驻银联的用户，此部分需另代收6.72%的增值税；</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      topnav: {
        title: "银行卡提现"
      },
      balance: 0,
      currMonth: 0,
      all: 0,
      monery: "",
      close: false,
      bankid: this.$route.query.bankid,
      msgtext: "",
      type: this.$route.query.type,
      userid: this.$cookie.get("userid"),
      index: this.$route.query.index
    };
  },
  mounted() {
    this.balancefn();
  },
  methods: {
    balancefn() {
      if (this.index == 3) {
        axios({
          url: this.Api + "withdraw/getLedgerEarn?userId=" + this.userid,
          method: "get"
        })
          .then(res => {
            console.log(11);
            console.log(res);
            if (res.data.code == 0) {
              this.balance = res.data.data.earn;
              this.currMonth = res.data.data.currMonth;
              this.all = res.data.data.all;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      if (this.index == 5) {
        axios({
          url: this.Api + "withdraw/getGhtLedgerEarn?userId=" + this.userid,
          method: "get"
        })
          .then(res => {
            console.log(11);
            console.log(res);
            if (res.data.code == 0) {
              this.balance = res.data.data.earn;
              this.currMonth = res.data.data.currMonth;
              this.all = res.data.data.all;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    submit() {
      let that = this;
      let reg = /^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$/;
      let balance = new Number(this.balance);
      let monery = new Number(this.monery);
      if (!reg.test(this.monery)) {
        that.msgtext = "请输入提现金额！";
        return false;
      } else if (balance > 100 && monery < 100) {
        // that.msgtext = '请输入大于100元的提现金额！';
        return false;
      } else if (balance < 100 && this.monery != this.balance) {
        // that.msgtext = '请输入大于100元的提现金额！';
        return false;
      } else if (balance < monery) {
        return false;
      }
      let post = {
        userAccountId: this.bankid,
        amount: this.monery
      };

      axios({
        url: that.Api + "withdraw/getLedgerTax",
        method: "post",
        data: post
      })
        .then(res => {
          let data = res.data.data;
          console.log(res);
          if (res.data.code == 0) {
            let factAmount = new Number(data.factAmount);
            let tax = new Number(data.tax);
            MessageBox({
              title: "提示",
              message:
                "依法纳税是每个公民神圣的义务，您本次需代扣代缴税金额为<span>¥" +
                tax +
                "</span>，实际到账金额<span>¥" +
                factAmount +
                "</span>",
              showCancelButton: true,
              closeOnClickModal: false
            }).then(action => {
              if (action === "confirm") {
                if (this.index == 3) {
                  that.messagefn(post, factAmount);
                }
                if (this.index == 5) {
                  that.messageGht(post, factAmount);
                }
              }
            });
          } else {
            MessageBox({
              title: "提示",
              message: res.data.msg || res.data.errmsg,
              showCancelButton: false,
              closeOnClickModal: false
            }).then(action => {
              if (action === "confirm") {
                that.$router.go(-1);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    messagefn(post, money) {
      let that = this;
      MessageBox({
        title: "提示",
        message:
          "您本次提现税后到账金额为<span>¥" +
          money +
          "</span>，您确定现在提现吗？确认后系统会在两个工作日左右到账，请您注意查收。谢谢！",
        showCancelButton: true,
        closeOnClickModal: false
      }).then(action => {
        if (action === "confirm") {
          axios({
            url: that.Api + "/withdraw/withdrawLedger",
            method: "post",
            data: post,
            headers: {
              "X-Nideshop-Token": that.$cookie.get("token")
            }
          })
            .then(res => {
              console.log(res);
              let data = res.data;
              if (data.errno == 0) {
                that.$router.push({ path: "/bank/successful" });
              } else {
                that.msgtext = data.errmsg;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    messageGht(post, money) {
      let that = this;
      MessageBox({
        title: "提示",
        message:
          "您本次提现税后到账金额为<span>¥" +
          money +
          "</span>，您确定现在提现吗？确认后系统会在两个工作日左右到账，请您注意查收。谢谢！",
        showCancelButton: true,
        closeOnClickModal: false
      }).then(action => {
        if (action === "confirm") {
          axios({
            url: that.Api + "/withdraw/withdrawGhtLedger",
            method: "post",
            data: post,
            headers: {
              "X-Nideshop-Token": that.$cookie.get("token")
            }
          })
            .then(res => {
              console.log(res);
              let data = res.data;
              if (data.errno == 0) {
                that.$router.push({ path: "/bank/successful" });
              } else {
                that.msgtext = data.errmsg;
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    },
    showClose() {
      this.close = true;
    },
    hideClose(event) {
      this.close = false;
      let elem = event.currentTarget;
      let val = elem.value;
      val = elem.value.replace(/[^(\d)]/g, "");
      let balance = new Number(this.balance);
      /*if(/\./.test(val)){
        val = new Number(val).toFixed(2);
        if(isNaN(val)){
          val = '';
          this.msgtext = '输入正确的提现金额,小数点后保留2位数。';
        };
      };*/
      if (balance > 100 && new Number(val) < 100 && val != "") {
        this.msgtext = "请输入大于100元的提现金额！";
        return false;
      } else if (balance < new Number(val)) {
        this.msgtext = "余额不足";
        return false;
      } else if (balance < 100) {
        val = this.balance;
        this.msgtext = "余额小于100元，只能全部提现";
      } else {
        this.msgtext = "";
      }
      this.monery = val;
      event.currentTarget.value = val;
    },
    clearFn() {
      this.monery = "";
    },
    drawAll() {
      //全部提现
      this.monery = this.balance;
    },
    back() {
      this.$router.go(-1);
    },
    shuru(event) {
      let elem = event.currentTarget;
      let val = elem.value;
      val = elem.value.replace(/[^(\d)]/g, "");
      this.monery = val;
      event.currentTarget.value = val;
    }
  }
};
</script>

<style scoped>
.glode {
  min-height: 100vh;
  background: #eeeeee;
}
.mainbox {
  padding: 0.5rem 15px;
  overflow: hidden;
  background: white;
  margin: 15px 10px 25px;
}
.balance {
  display: -webkit-flex; /* Safari */
  display: flex;
  width: 100%;
  overflow: hidden;
  font-size: 14px;
  padding: 10px 0;
  line-height: 1.4em;
  border-bottom: 1px solid #eee;
}
.balance .item {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex: 1;
  float: left;
  color: #666;
}
.balance .item label {
  display: inline-block;
  width: 6em;
}
.balance .spantext {
  float: right;
  color: #999;
}
.balinput {
  position: relative;
  font-size: 14px;
  margin-top: 10px;
}
.balinput .inputtext {
  position: absolute;
  left: 0;
  bottom: -10px;
  color: red;
  font-size: 12px;
}
.input-box {
  display: -webkit-flex; /* Safari */
  display: flex;
  flex: 1;
}
.input-box input {
  flex: 1;
  font-size: 14px;
  line-height: 1.4em;
}
.input-box i {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 0.1em;
  color: #666;
}
.submit {
  display: block;
  text-align: center;
  color: white;
  padding: 0.4rem 0;
  width: 100%;
  font-size: 14px;
  line-height: 1.6em;
  background: #ff921f;
  border-radius: 3px;
  margin: 1.5rem auto 0.5rem;
}
.tstext {
  width: 100%;
  font-size: 12px;
  color: #999;
  text-align: center;
  padding: 0 14%;
  line-height: 1.6em;
}
</style>
<style>
.mint-msgbox-message span {
  color: #ff6e03;
}
</style>
