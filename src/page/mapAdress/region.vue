<template>
    <div class="adress">
        <mt-header title="选择地址">
            <mt-button icon="back" slot="left" @click="goback"></mt-button>
        </mt-header>
        <div class="location">
            <div class="lp">当前定位：{{ !current.area?current.city:!current.city?current.prov:current.area }}</div>
            <div class="rb" @click="locationfn">重新定位</div>
        </div>
        <div class="timelist">
            <div class="tp">已选：</div>
            <div class="tlist">
                <p v-if="postdata['prov'].name" @click="provinces()">{{ postdata['prov'].name }}</p>
                <p v-else class="dangqian">选择省份</p>
            </div>
            <div class="tlist" v-if="postdata['prov'].name">
                <span>-</span>
                <p v-if="postdata['city'].name" @click="cityfn(postdata['prov'].id, postdata['prov'].name)">
                    {{ postdata['city'].name }}</p>
                <p v-else class="dangqian">选择城市</p>
            </div>
            <div class="tlist" v-if="postdata['city'].name">
                <span>-</span>
                <p v-if="postdata['area'].name" @click="cityfn(postdata['prov'].id, postdata['prov'].name)">
                    {{ postdata['area'].name }}</p>
                <p v-else class="dangqian">选择地区</p>
            </div>
        </div>
        <div class="mianbox">
            <template v-if="!loadshow">
                <div class="mtitle">{{ tltext }}</div>
                <div class="item" v-for="(item,index) in letter" :key="index" v-if="item.length > 0">
                    <div class="zimu">{{ index }}</div>
                    <div class="listtext">
                        <p v-for="(p,i) in item" :key="i">
                            <span v-if="type==2" @click="cityfn(p.id, p.name)">{{ p.name }}</span>
                            <span v-if="type==3" @click="areafn(p.id, p.name)">{{ p.name }}</span>
                            <span v-if="type==4" @click="confirm(p.id, p.name)">{{ p.name }}</span>
                        </p>
                    </div>
                </div>
            </template>
            <loading :load.sync="loadshow"></loading>
        </div>
        <baiduMap :change="changeCurrent" @getCurrent="getCurrentfn"></baiduMap>
    </div>
</template>

<script>
    // 中文转拼音
    import {
        mapState,
        mapMutations
    } from 'vuex';
    import jsonpAdapter from 'axios-jsonp';
    import spell from '@/assets/js/spell';
    import baiduMap from '@/components/baiduMap'
    export default {
        data() {
            return {
                letter: {
                    'A': [],
                    'B': [],
                    'C': [],
                    'D': [],
                    'E': [],
                    'F': [],
                    'G': [],
                    'H': [],
                    'I': [],
                    'J': [],
                    'K': [],
                    'L': [],
                    'M': [],
                    'N': [],
                    'O': [],
                    'P': [],
                    'Q': [],
                    'R': [],
                    'S': [],
                    'T': [],
                    'U': [],
                    'V': [],
                    'W': [],
                    'X': [],
                    'Y': [],
                    'Z': []
                },
                tltext: '',
                type: 1,
                postdata: {
                    prov: {},
                    city: {},
                    area: {}
                },
                Ak: '95qe9LWme6C13wI6IaM15lj9w6FmvM47',
                loadshow: false,
                current: new Object(),
                changeCurrent: 0,
            }
        },
        computed: {
            ...mapState(["map"])
        },
        components: {
            baiduMap
        },
        mounted() {
            this.provinces();
        },
        methods: {
            goback() {
                let that = this;
                let post = this.postdata;
                if ((!post.area.name || post.area.name == '') && post.prov.name) {
                    MessageBox({
                        title: "",
                        message: '是否取消当前地区选择。',
                        showCancelButton: true
                    }).then(action => {
                        if (action === 'confirm') {
                            that.$router.go(-1);
                        }
                    });
                } else {
                    that.$router.go(-1);
                }
            },
            getCurrentfn(val) {
                this.current = val;
            },
            locationfn() {
                this.changeCurrent = Math.random();
            },
            provinces() {
                let that = this;
                this.loadshow = true;
                this.tltext = '选择省份';
                that.$set(that.postdata, 'prov', {});
                that.$set(that.postdata, 'city', {});
                that.$set(that.postdata, 'area', {});
                this.type = 2;
                axios.get(this.Api + 'region/getRegion?parentId=1').then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                })
            },
            cityfn(val, text) {
                let that = this;
                this.loadshow = true;
                this.tltext = '选择城市';
                this.type = 3;
                this.$set(that.postdata, 'prov', {
                    id: val,
                    name: text
                });
                axios.get(this.Api + 'region/getRegion?parentId=' + val).then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                })
            },
            areafn(val, text) {
                let that = this;
                this.loadshow = true;
                this.tltext = '选择地区';
                this.$set(that.postdata, 'city', {
                    id: val,
                    name: text
                });
                this.type = 4;
                axios.get(this.Api + 'region/getRegion?parentId=' + val).then(res => {
                    let data = res.data.data;
                    that.letterfn(data);
                })
            },
            confirm(val, text) {
                let that = this;
                this.loadshow = true;
                this.$set(that.postdata, 'area', {
                    id: val,
                    name: text
                });

                let param =that.postdata.area.name;
                axios({
                    url: 'https://api.map.baidu.com/geocoder/v2/?address=' + param +
                        '&output=json&ak=ufanROIB49bsOCK7FEU2o7Vr',
                    adapter: jsonpAdapter
                }).then((res) => {
            
                    if (res.data.status == 0) {

                        let map = {
                            province: that.postdata.prov.name,
                            city: that.postdata.city.name,
                            area: that.postdata.area.name,
                            title: '',
                            address: that.postdata.prov.name + that.postdata.city.name + that.postdata.area
                                .name,
                            point: res.data.result.location
                        };
                        this.changeMap(map);
                        setTimeout(() => {
                            that.$router.go(-1);
                        }, 1);
                    }
                })
            },
            letterfn(arr) {
                let that = this;
                this.loadshow = false;
                for (var i in that.letter) {
                    that.letter[i] = [];;
                    (function (i) {
                        arr.forEach(d => {
                            if (i == spell(d.name).substr(0, 1)) {
                                that.letter[i].push(d);
                            }
                        })
                    })(i);
                };
            },
            ...mapMutations(["changeMap", "removeMap"])
        }
    }

</script>

<style scoped>
    .mint-header {
        background: #ff911e;
        border-bottom: none;
        font-size: .8rem;
    }

    .adress {
        width: 100%;
        overflow: hidden;
        height: 100vh;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: column;
        background: #f5f5f5;
    }

    .location {
        padding: 10px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        font-size: 14px;
        background: white;
    }

    .location .lp {
        flex: 1;
    }

    .location .rb {
        color: #ec0746;
    }

    .timelist {
        padding: 0 10px;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        font-size: 14px;
        background: white;
    }

    .timelist .tp {
        padding: 0 0 10px 0;
    }

    .timelist .tlist {}

    .timelist .tlist p {
        float: left;
        padding: 0 0 10px 0;
    }

    .timelist .tlist p.dangqian {
        color: #ff911e;
        padding: 0 0 8px 0;
        border-bottom: 2px solid #ff911e;
    }

    .timelist .tlist span {
        float: left;
        padding: 0 0.3em 10px;
    }

    .mianbox {
        margin-top: 0.5em;
        flex: 1;
        padding: 0 15px;
        overflow: auto;
        background: white;
    }

    .mtitle {
        font-size: 12px;
        line-height: 1.4em;
        color: #999;
        padding: 10px 0;
    }

    .item {
        overflow: hidden;
        display: -webkit-flex;
        /* Safari */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
    }

    .item .zimu {
        width: 1em;
        font-size: 14px;
        color: #999;
        margin-right: 15px;
        line-height: 1.4em;
    }

    .item .listtext {
        flex: 1;
    }

    .item .listtext p {
        color: #0d0d0d;
        font-size: 14px;
        line-height: 1.4em;
        padding-bottom: 15px;
    }

</style>
