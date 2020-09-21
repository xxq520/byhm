<template>
    <div class="agent-application">
        <topnav :topnav="topnav"></topnav>
        <div class="application">
            <div class="application-from" v-if="comefrom=='operation'">
                <div class="title">选择需要升级的合伙人等级</div>
                <div class="name">
                    <mt-cell title='合伙人等级' is-link @click.native="partLevelfn"> {{ partText }}</mt-cell>
                </div>
            </div>
            <div class="application-from">
                <div class="title">经营信息</div>
                <div class="name">
                    <!-- <mt-cell title='经营省份' is-link v-if="business.province" @click.native="businessfn(1)">{{ business.province.text }}</mt-cell>
          <mt-cell title='经营城市' is-link v-if="business.city" @click.native="businessfn(2, business.province.id)">{{ business.city.text }}</mt-cell>
          <mt-cell title='经营区县' is-link v-if="business.county" @click.native="businessfn(3, business.city.id)">{{ business.county.text }}</mt-cell> -->
                    <mt-cell title='经营省份' ref="prov" is-link
                        v-if="partText=='省合伙人'|| partText=='市合伙人' ||partText=='县合伙人'"
                        @click.native="businessfn(1)">
                        {{ business.province.text }}</mt-cell>
                    <mt-cell title='经营城市' ref="city" is-link v-if=" partText=='市合伙人' ||partText=='县合伙人'"
                        @click.native="businessfn(2, business.province.id)">
                        {{ business.city.text }}</mt-cell>
                    <mt-cell title='经营区县' ref="county" is-link v-if="partText=='县合伙人'"
                        @click.native="businessfn(3, business.city.id)">
                        {{ business.county.text }}</mt-cell>
                </div>
            </div>
            <div class="application-from">
                <div class="title">
                    <p>基本信息(必填)</p>
                    <i class="el-icon-question" @click="partnerDropTrue"></i>
                </div>
                <div class="name">
                    <mt-field disableClear label='申请人姓名：' placeholder="请输入您的名字" type="text" v-model="name" readonly
                        v-if="nameBoo"></mt-field>
                    <mt-field disableClear label='申请人姓名：' placeholder="请输入您的名字" type="text" v-model="name" v-else>
                    </mt-field>
                </div>
                <div class="tel">
                    <mt-field disableClear label='申请人手机号：' placeholder="请输入手机号" type="tel" v-model="phone" readonly>
                    </mt-field>
                </div>
                <div class="invite-tel">
                    <mt-field disableClear label='推荐人手机号：' placeholder="请输入推荐人手机号" type="tel" v-model="inviteTel"
                        readonly></mt-field>
                </div>
             <div class="provCity" v-if="areadata.prov && areadata.city && areadata.area">
                <mt-cell title='联系地区' is-link>
                     {{ areadata.prov && areadata.city && areadata.area?areadata.prov.name+areadata.city.name+areadata.area.name:'' }}
                     </mt-cell>
             </div>
                <div class="provCity" @click="adressfn" v-else>
                    <mt-cell title='联系地区' is-link>
                        {{ areadata.prov && areadata.city && areadata.area?areadata.prov.name+areadata.city.name+areadata.area.name:'' }}
                    </mt-cell>
                </div>
                <div class="address">
                    <textarea v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" readonly
                        v-if="addressBoo"></textarea>
                    <textarea v-model="address" placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等" v-else></textarea>
                </div>
            </div>
        </div>
        <div class="pay-btn-box">
            <div class="pay-btn" @click="application">确定申请</div>
        </div>
        <adressPopup :visible.sync="visible" @region-change="region" @visible-change="visiblefn"></adressPopup>
        <firstTier-selection :post.sync="post" :visible.sync="firsttier" @region-change="selectRegion"
            @visible-change="firsttierfn"></firstTier-selection>
        <mt-popup v-model="typeVisible" position="bottom">
            <div class="visiblebtn">
                <mt-button size="small" type="default" class="quxiao" @click="typeVisible = false">取消</mt-button>
                <mt-button size="small" type="primary" class="queding" @click="quedingfn">确定</mt-button>
            </div>
            <mt-picker :slots="typeslots" value-key="text" @change="typechange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="partnerDrop" popup-transition="popup-fade" class="attention">
            <div class="attbox">
                <div class="list">
                    <span>申请人姓名：</span>
                    <p>申请人的真实姓名，用于识别真实身份之用，建议填写真实姓名。</p>
                </div>
                <div class="list">
                    <span>申请人手机号：</span>
                    <p>用户注册账号的手机号码，在登录系统、身份验证、找回密码和提现操作的唯一账号凭证，更换后应该及时联系平台进行更改，以免影响使用。</p>
                </div>
                <div class="list">
                    <span>推广地区：</span>
                    <p>用于申请运营地区的区域，应该顺序选择省、市、县。</p>
                </div>
                <div class="list">
                    <span>详细地址：</span>
                    <p>填入详细的门牌号各楼宇号单元室，用于日后判断身份角色和驻银联的凭证。</p>
                </div>
            </div>
            <div class="detaiBtn" @click="partnerDropFalse">我知道了</div>
        </mt-popup>
        <!-- <div class="huimeng" v-show="type = 0">
         <p>感谢您的支持，建议您同时开通成为惠盟用户，享受惠盟用户专属回报。</p>
         <span @click="quxiao">取消</span>
         <span class="kaitong" @click="kaitong">去开通</span>
     </div> -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                topnav: {
                    title: "申请资料"
                },
                name: "",
                nameBoo: true,
                phone: "",
                inviteTel: "",
                visible: false,
                firsttier: false,
                areadata: {},
                areadatabloor: true,
                business: {},
                post: {},
                businessAreaVo: {},
                address: '',
                addressBoo: true,
                userid: this.$cookie.get('userid'),
                cardNumber: this.$cookie.get('card'),
                isActive: this.$cookie.get('isActive'),
                type: this.$cookie.get('level_id'),
                code: this.$route.params.code,
                exper: this.$route.params.exper,
                partnerDrop: false,
                comefrom: this.$route.params.comefrom,
                partText: '',
                typeVisible: false,
                typedata: new Object,
                agencyLevel:'',
             
                typeslots: [{
                        flex: 1,
                        values: [],
                        textAlign: "center"
                    }


                ],

            };
        },
        created() {
            if(this.exper){
            this.agencyLevel= this.exper=='county'?3:this.exper=='city'?4:this.exper=='province'?5:''
            
            };
           
            let that = this;

            function user() {
                return axios.post(that.Api + '/user/queryByCardNo?cardNo=' + that.cardNumber)
            };

            function code() {
                return axios.post(that.Api + '/user/queryByCardNo?cardNo=' + that.code)
            };
            axios.all([user(), code()])
                .then(axios.spread(function (userd, codes) {
                    that.name = userd.data.nickname;
                    that.nameBoo = that.name ? true : false
                    that.phone = userd.data.mobile;
                    that.inviteTel = codes.data.mobile;
                    let post = {};
                    if (userd.data.province) post.prov = {
                        name: userd.data.province
                    };
                    if (userd.data.city) post.city = {
                        name: userd.data.city
                    };
                    if (userd.data.county) post.area = {
                        name: userd.data.county
                    };
                    that.areadatabloor = !that.areadata.prov && !that.areadata.city && !that.areadata.area ?
                        true : false;
                    that.areadata = post;
                    that.address = userd.data.address;
                    that.addressBoo = that.address ? true : false;

                }));

            if (this.exper == 'province' || this.exper == 'city' || this.exper == 'county') {
                this.$set(this.business, 'province', {});
                console.log(this.business);
                this.typeslots[0].values.push({
                    text: '省合伙人',
                    id: 1
                });
            };
            if (this.exper == 'city' || this.exper == 'county') {
                this.$set(this.business, 'city', {});
                this.typeslots[0].values.push({
                    text: '市合伙人',
                    id: 2
                });
            };
            if (this.exper == 'county') {
                this.$set(this.business, 'county', {});
                this.typeslots[0].values.push({
                    text: '县合伙人',
                    id: 3
                });
            };
            if(this.exper == 'province'){
                this.partText='省合伙人'
            } else if(this.exper == 'city'){
               this.partText='市合伙人'
            }else if(this.partText='县合伙人'){
                this.partText='县合伙人'
            }
           
        },
        watch:{
        partText(){
             this.agencyLevel=this.partText=='县合伙人'?3:this.partText=='市合伙人'?4:this.partText=='省合伙人'?5:3;
         
        }
        },
        methods: {
            partLevelfn() { 
            this.typeVisible = true;
             this.agencyLevel=this.partText=='县合伙人'?3:this.partText=='市合伙人'?4:this.partText=='省合伙人'?5:3;
           
             
            },
            typechange(picker, values) {
                this.typedata = values[0];
            },
            quedingfn() {
                this.typeVisible = false;
                this.partText = this.typedata.text;
                this.business = {}
                switch (this.typedata.id) {
                    case 1:
                        this.$set(this.business, 'province', {});
                        break;
                    case 2:
                        this.$set(this.business, 'province', {});
                        this.$set(this.business, 'city', {});
                        break;
                    case 3:
                        this.$set(this.business, 'province', {});
                        this.$set(this.business, 'city', {});
                        this.$set(this.business, 'county', {});
                        break;
                }
            },
            
            region(val) {
                this.areadata = val;
            },
            visiblefn(val) {
                this.visible = val;

            },
            adressfn() {
                if (this.areadatabloor) this.visible = true;
            },
            firsttierfn(val) {
                this.firsttier = val;
            },
            partnerDropTrue() {
                this.partnerDrop = true;
            },
            partnerDropFalse() {
                this.partnerDrop = false;
            },
            businessfn(val, id) {
                
                this.firsttier = true;
                this.post = {
                    type: val,
                    id: id ? id : ''
                };
                console.log(this.business,'5')
            },
            selectRegion(val) {
                let post = {
                    id: val.id,
                    text: val.text
                };
                switch (val.type) {
                    case 1:
                        this.$set(this.business, 'province', post);
                        if (this.exper == 'city' || this.exper == 'county') this.$set(this.business, 'city', {});
                        if (this.exper == 'county') this.$set(this.business, 'county', {});
                        this.$set(this.businessAreaVo, 'province', val.text);
                        break;
                    case 2:
                        this.$set(this.business, 'city', post);
                        if (this.exper == 'county') this.$set(this.business, 'county', {});
                        this.$set(this.businessAreaVo, 'city', val.text);
                        break;
                    case 3:
                        this.$set(this.business, 'county', post);
                        this.$set(this.businessAreaVo, 'county', val.text);
                        break;
                };
            },
            application() {
                
                   
                if (!this.areadata.prov && !this.areadata.city && !this.areadata.area) {
                    Toast('请选择联系地址');
                    return;
                };
                  if (!this.address) {
                  Toast('请填写详细地址');
                  return;
                  };
                let that = this;
                let post = {
                    userInfoVo: {
                        id: this.userid,
                        name: this.name,
                        mobile: this.phone,
                        superMobile: this.inviteTel,
                        superCardNo: this.$route.query.source == 'own' ? " " : this.code,
                        area: this.areadata.prov.name + ',' + this.areadata.city.name + ',' + this.areadata.area
                            .name,
                        address: this.address
                    },
                    businessAreaVo: {},
                    isOperator: 0,
                  agencyLevel: this.agencyLevel
                };

                if ( this.comefrom=='operation'&&this.partText == '') {
                    Toast('请选择合伙人等级')
                    return
                }
                
                for (var i in this.business) {
                 
                    if (this.business[i].text) {
                        console.log(this.business[i].text);
                        post.businessAreaVo[i] = this.business[i].text;
                        console.log(post.businessAreaVo);
                        
                    } 
                     else {
                    //     switch (i) {
                    //         case 'province':
                    //             Toast('请选择经营省份');
                    //             return;
                    //             break;
                    //         case 'city':
                    //             Toast('请选择经营城市');
                    //             return;
                    //             break;
                    //         case 'county':
                    //             Toast('请选择经营区县');
                    //             return;
                    //             break;
                    //     }
                    
                    if(this.partText == '省合伙人'){
                        console.log(this.business.province.text);
                    switch (this.business.province.text) {
                    case undefined:
                    Toast('请选择经营省份');
                    return;
                    break;

                    }
                    }
                    if (this.partText == '市合伙人') {

                    switch (undefined) {
                    case this.business.province.text:
                    Toast('请选择经营省份');
                    return;
                    break;
                    case this.business.city.text:
                    Toast('请选择经营城市');
                    return;
                    break;
                    }
                    }
                    if (this.partText == '县合伙人') {

                    switch (undefined) {
                    case this.business.province.text:
                    Toast('请选择经营省份');
                    return;
                    break;
                    case this.business.city.text:
                    Toast('请选择经营城市');
                    return;
                    break;
                    case this.business.county.text:
                    Toast('请选择经营区县');
                    return;
                    break;
                    }
                    }
                      }
                };

                let level = this.exper == 'province' ? 5 : this.exper == 'city' ? 4 : this.exper == 'county' ? 3 : 1;
                  // let level = this.partText == '省合伙人' ? 5 : this.partText == '市合伙人' ? 4 : this.partText == '县合伙人' ? 3 :
                  // 1;
                //   console.log(post, '55')
                axios({
                    method: 'post',
                    url: this.Api + 'application/record/save/agency',
                    data: post,
                    headers: {
                        "X-Nideshop-Token": this.$cookie.get("token")
                       
                    }
                   
                }).then(res => {
                    // console.log(this.type, res)

                    if (res.data.code == 0) {
                        if (that.isActive == 1) {
                            that.$router.push({
                                path: '/successful',
                                query: {
                                    type: 'partner'
                                }
                            })
                        } else {
                            MessageBox({
                                title: "",
                                message: '感谢您的支持，建议您同时开通成为惠盟用户，享受惠盟用户专属回报。',
                                showCancelButton: true,
                                confirmButtonText: '去开通'
                            }).then(action => {
                                if (action === 'confirm'){
                                   
                                   
                                     that.$router.push({name: 'toBecomeMember', params:{card: that.cardNo, level:that.level,cardType:4}})
                                } else {
                                    that.$router.push({
                                        path: '/successful',
                                        query: {
                                            type: 'partner'
                                        }
                                    })
                                }
                            })
                        }
                    }
                    else{
                      Toast(res.data.msg)
                    }
                })
            }
        }
    };

</script>

<style scoped>
    .huimeng {
        width: 64%;
        font-size: 0.66rem;
        position: fixed;
        top: 25%;
        left: 18%;
        background-color: #fff;
        color: #999;
        line-height: 1.2rem;

        border: 1px solid #eee;
        border-radius: 3px;
    }

    .huimeng p {
        text-indent: 1.4rem;
        padding: 5px 12px;
        border-bottom: 1px solid #ddd;
    }

    .huimeng span {
        display: block;
        float: left;
        width: 50%;
        height: 1.5rem;
        line-height: 1.5rem;
        text-align: center;
    }

    .huimeng span.kaitong {
        color: #ff8c39;
    }

    .agent-application {
        background-color: #f5f5f5;
        min-height: 100vh;
    }

    .application {
        padding: 0.833333rem 0.625rem 0 0.625rem;
    }

    .application-from {
        overflow: hidden;
        margin-bottom: 0.5rem;
    }

    .application-from .title {
        overflow: hidden;
        background-color: #ffe9c9;
        color: #ec0746;
        font-size: 0.666667rem;
        padding: 10px;
        border-radius: 0.208333rem 0.208333rem 0 0;
    }

    .application-from .title p {
        float: left;
    }

    .application-from .title i {
        float: right;
        font-size: 0.8rem;
    }

    .agent-application>>>.mint-cell-wrapper {
        border-bottom: 1px solid #eeeeee;
        background-image: none;
    }

    .agent-application>>>.mint-cell-title {
        width: 116px;
        flex: none;
    }

    .agent-application>>>.mint-cell-text {
        font-size: 14px;
        color: #333333;
    }

    .agent-application>>>.mint-cell-value {
        font-size: 13px;
        flex: 1;
    }

    .cart-list {
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        padding: 0.7rem 10px;
        font-size: 14px;
        line-height: 1.4em;
        border-bottom: 1px solid #eee;
        background-color: #fff;
    }

    .cart-list label {
        float: left;
        width: 7.5em;
        color: #333;
    }

    .cart-list p.lmain {
        display: -webkit-flex;
        /* Safari */
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
        display: -webkit-flex;
        /* Safari */
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
        background-color: #fff;
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
        background: -webkit-linear-gradient(left,
            #ff9500,
            #ff8c39);
        /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,
            #ff9500,
            #ff8c39);
        /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,
            #ff9500,
            #ff8c39);
        /* Firefox 3.6 - 15 */
        background: linear-gradient(to right, #ff9500, #ff8c39);
        /* 标准的语法 */
        text-align: center;
        line-height: 1.666667rem;
        color: #ffffff;
        font-size: 0.625rem;
        letter-spacing: 2px;
    }

    .provCity label,
    .provCity p.lmain {
        width: auto;
    }

    /* attention */
    .attention {
        width: 90vw;
        background: white;
        border-radius: 8px;
        padding: 10px;
        font-size: 0.6rem;
        line-height: 1.4em;
    }

    .attention .attbox {
        overflow: hidden;
        margin: 0.5rem 0;
    }

    .attention .attbox .list {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .attention .attbox .list span {
        text-align: justify;
        width: 8em;
        padding-right: 1em;
    }

    .attention .attbox .list span:after {
        content: " ";
        display: inline-block;
        width: 100%;
    }

    .attention .attbox .list p {
        flex: 1;
    }

    .attention .detaiBtn {
        display: block;
        margin: 0 auto;
        width: 6em;
        text-align: center;
        border-radius: 2rem;
        line-height: 2em;
        color: white;
        background: #ff6e04;
        margin-bottom: 0.5rem;
    }

    .mint-popup {
        width: 100%;
    }

    .visiblebtn>>>.mint-button--small {
        font-size: 14px;
        padding: 0 8px;
        height: 25px;
    }

    .visiblebtn>>>.mint-button--default {
        -webkit-box-shadow: none;
        box-shadow: none;
    }

    .visiblebtn {
        padding: 0.5rem;
        border-bottom: 1px solid #eaeaea;
        overflow: hidden;
    }

    .visiblebtn .quxiao {
        float: left;
        border: 1px solid #ccc;
    }

    .visiblebtn .queding {
        float: right;
    }

</style>
