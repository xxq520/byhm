<template>
    <div class="settings">
        <!-- 头部 -->
        <topnav :topnav="topnav"></topnav>
        <!-- 内容信息 -->
        <div class="mineContent">
            <mt-cell title="头像" class="line">
                <img id="avatar" :src="advatar" alt="" @click="avatarUpdata($event)">
                <input type="file" id="avatarUpdata" style="display:none;">
            </mt-cell>
            <!-- <mt-cell title="用户名" class="line"><span class="item">{{info.username}}</span></mt-cell> -->
            <mt-cell title="昵称" class="line" is-link to="/settings/ChangeName"><span
                    class="item">{{info.nickname==null?'未设置':info.nickname}}</span></mt-cell>
            <mt-cell title="性别" class="line" is-link to="/settings/ChangeGender"><span
                    class="item">{{info.gender==null?'未选择':info.gender==0?'男':'女'}}</span></mt-cell>
          <div @click="towx(info.weiXinNumber)" class="weixin">
              <mt-cell title="微信号" class="line" is-link><span class="item"
                      >{{info.weiXinNumber==null?'':info.weiXinNumber}}</span></mt-cell>
                     
          </div>
            
            <mt-cell title="手机号" class="line"><span class="item">{{info.mobile}}</span></mt-cell>
        </div>
        <mt-cell title="推荐人信息" class="line2"></mt-cell>
        <div class="tuijie">
         

            <mt-cell title="推荐人姓名" class="line"><span
                    class="item">{{info.inviteRealName==null?'':info.inviteRealName}}</span>
            </mt-cell>
            <mt-cell title="推荐人手机号" class="line"><span
                    class="item">{{info.inviterMobile==null?'':info.inviterMobile}}</span>
            </mt-cell>
            <mt-cell title="推荐人等级" class="line"><span
                    class="item">{{info.inviterLevelName==null?'':info.inviterLevelName}}</span>
            </mt-cell>
            <!--<mt-cell title="清除缓存" class="line">
        <i class="code02">确认清除</i>
      </mt-cell>-->
        </div>
        <mt-cell title="地址信息" class="line2"></mt-cell>
        <div class="tuijie">
            <mt-cell title="所在区域" class="line"><span class="item">{{info.province}}{{info.city}}{{info.county}}</span>
            </mt-cell>
            <mt-cell title="详细地址" class="line"><span class="item">{{info.address==null?'':info.address}}</span>
            </mt-cell>
        </div>
    </div>
</template>

<script type="text/javascript">
    //import clearCookie from '@/assets/js/clearCookie';
    export default {
        name: 'Settings',
        data() {
            return {
                topnav: {
                    title: '个人信息'
                },
                id: this.$cookie.get('userid'), //用户编号
                seq: this.$cookie.get('seq'), //用户编号
                type: this.$cookie.get('level_id'), //1 52用户，2表示推广商，6表示商家，0是普用户
                info: '',
                newAavadar: '', //520shq头像
                advatar: require('@/assets/images/vip_hp_s1.png'),
                applogin: false
                // advatar:require('@/assets/images/vip_hp_s1.png')
            }
        },
        mounted() {
            //判断是否是在app登录跳转回来的
            if (sessionStorage.getItem('applogin')) this.applogin = JSON.parse(sessionStorage.getItem('applogin'))
            let params = {
                id: this.id,
                type: this.type
            }
            axios.get(this.Api + '/user/queryUserData', {
                params: params
            }).then(res => {
                console.log(res, '8');
                if (res.data.code == 500) {
                    Toast(res.data.msg)
                };
                this.info = res.data;
                //this.advatar = res.data.avatar==null?this.advatar:res.data.avatar;
            });
            // this.advatarfn();
            axios.get(this.Head + "rest/user/getUserImgUrlBySeq?seq=" + this.seq).then(res => {
                if (res.data.status == 200) {
                    this.advatar = res.data.data;
                }
            });
        },
        methods: {
            //修改微信号
            towx(val){
               this.$router.push({
               path: '/settings/wxName',
               query: {
               name: val
               }
               })
            },
            
            // 修改头像
            avatarUpdata(event) {
                let that = this;
                let elem = event.currentTarget;
                document.getElementById('avatarUpdata').click();
                document.getElementById('avatarUpdata').onchange = function () {
                    let form = new FormData();
                    form.append("file", this.files[0]);
                    form.append("seq", that.seq);
                    axios.post(that.Head + 'rest/user/fileUpload', form).then(res => {
                        if (res.data.status == 200) {
                            that.advatar = res.data.data;
                        } else {
                            Toast(res.data.msg);
                        }
                    });
                }
            },
            /* 绑定上级关系 */
            // bindTop(){
            //   MessageBox.prompt('请输入用户卡卡号',{confirmButtonText:'立即绑定'}).then(({ value, action }) => {
            //     var regNum = new RegExp("^[0-9]*$");
            //     // value为用户输入的上级卡号
            //     if (value) {
            //       // 执行操作逻辑
            //       if (action = 'confirm') {
            //         if (value.length>8 || !regNum.test(value)) {
            //           Toast('请输入8位数卡号！')
            //         }else{
            //           console.log('执行提交卡号的逻辑');
            //         }
            //       }else{
            //         console.log('用户取消提交');

            //       }
            //     }else{
            //       Toast('用户卡卡号不能为空！')
            //     }
            //   });
            // }
        },

    }

</script>

<style scoped>
    .settings {
        min-height: 100vh;
        background: #eee;
    }

    .settings .mineContent {
        padding: 0 0.4rem;
        background: white;
    }

    .settings .tuijie {
        padding: 0 0.4rem;
        background: white;
    }

    .line {
        font-size: 0.6222rem;
        color: #333333;
        border-bottom: 1px solid #eeeeee;
    }

    .settings .mineContent .line #avatar {
        width: 30px;
        height: 30px;
    }
     .weixin{
         
         border-bottom: 1px solid #eee;
     }
    .settings .mineContent .line #clear {
        width: 2.7778rem;
        height: 0.8444rem;
    }

    .settings .mineContent .line .item {
        font-size: 15px;
        color: #666666;
    }

    .settings>>>.mint-msgbox {
        width: 60%;
    }

    .settings>>>.mint-cell-wrapper {
        background: none;
    }

    .mint-cell.line2 {
        background-color: #f5f5f5;

    }

    .settings>>>.mineContent .mint-cell:last-child {
        background: none;
        border: none;
    }

    .settings>>>.tuijie .mint-cell:last-child {
        background: none;
        border: none;
    }

    .settings>>>.mint-cell-title {
        font-size: 15px;
    }

    .code02 {
        margin-left: 0.4rem;
        font-size: 0.6rem;
        color: #ec0746;
        border: 1px solid #ff9f18;
        border-radius: 20rem;
        padding: 0 10px;
        line-height: 1.8em;
    }

</style>
