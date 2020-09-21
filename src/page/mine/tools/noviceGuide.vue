<template>
    <div class="order">
        <topnav :topnav="topnav"></topnav>

        <div class="peopleClass">
            <ul>
                <li v-for="(item,index) in tools" :key="index">
                    <div class="title">{{item.label}}</div>
                    <a href="javascript:void(0)">
                        <div class="pname">{{item.label}}
                            <img class="inviteText" src="@/assets/images/by_home_icon_bf@2x.png"
                                @click="ToolsFn(item.vidurl,item.label)" alt>
                        </div>
                    </a>
                </li>
            </ul>
        </div>



        <div class="hapi" v-if="videoShow">
            <mt-header :title="title" class="topnav">
                <mt-button icon="back" slot="left" @click="ToolsFn1()"></mt-button>
            </mt-header>
            <video id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="auto">
                <source :src="videoUrl">
                <p class="vjs-no-js">不支持播放</p>
            </video>
        </div>
    </div>
</template>

<script>
    import videojs from 'video.js'
    export default {

        name: "order",
        data() {
            return {

                topnav: {
                    title: '视频教程',
                },
                userid: this.$cookie.get('userid'),
                orderCode: true,
                videoUrl: '',
                videoShow: false,
                fristl: true,
                tools: [{
                        vidurl: 'http://byhm.520shq.com/vedio/%E6%83%A0%E7%9B%9F%E7%94%A8%E6%88%B7%E5%A6%82%E4%BD%95%E7%94%A8%E6%8A%B5%E6%89%A3%E5%8A%B5.mp4',
                        label: "惠盟用户如何用抵扣劵"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/%E7%99%BE%E4%B8%9A%E5%95%86%E5%AE%B6%E5%A6%82%E4%BD%95%E6%8F%90%E7%8E%B0.mp4',
                        label: "百业商家如何提现"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/查看人脉及续周期.mp4',
                        label: "查看人脉及续周期"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/如何邀请商家入驻.mp4',
                        label: "如何邀请商家入驻"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/入驻和发布商品.mp4',
                        label: "入驻和发布商品"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/商家协助入驻.mp4',
                        label: "商家协助入驻"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/商家自己写优惠券.mp4',
                        label: "商家自己写优惠券"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/提现操作和查看记录.mp4',
                        label: "提现操作和查看记录"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/银联入驻教学.mp4',
                        label: "银联入驻教学"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/用户下单.mp4',
                        label: "用户下单"
                    },
                    {
                        vidurl: 'http://byhm.520shq.com/vedio/运营商协助写优惠券.mp4',
                        label: "运营商协助写优惠券"
                    },

                ],
                title: ''
            };
        },
        mounted() {

        },
        methods: {
            initVideo() {
                //初始化视频方法
                let myPlayer = this.$video(myVideo, {
                    //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
                    controls: true,
                    autoplay: true,
                    //自动播放属性,muted:静音播放
                    // autoplay: "muted",
                    //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
                    preload: "auto",
                    controlBar: {
                        volumePanel: {
                            inline: false //默认是true,横着的
                        }
                    }

                });
                myPlayer.volume(1);
            },
            ToolsFn(val, title) {
                var that = this;
                this.title = title;
                this.videoUrl = val;
                this.videoShow = true;
                setTimeout(() => {
                    that.initVideo();
                }, 50);

            },
            ToolsFn1(val) {
                this.videoShow = false;
            },
            // goback() {

            //     if (this.applogin) {
            //         try {
            //             window.action.backAPP();
            //         } catch (err) {
            //             window.action.backAPPiOS();
            //         }
            //     } else {
            //         this.$router.go(-1)
            //     }
            // },

        },
        created() {

        }
    };

</script>

<style scoped>
    .order {
        width: 100%;
        height: 100%;
        background-color: #F5F5F5;

    }

    .peopleClass {
        font-size: 0.58rem;
    }

    .peopleClass ul li {
        background-color: #fff;
        margin-top: 0.5rem;
        width: 100%;
        height: 8.5rem;
        padding: 0.5rem;
    }

    .peopleClass ul li .title {
        margin-bottom: 0.5rem;
    }

    .peopleClass ul li .inviteText {
        width: 2rem;

        height: 2rem;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
    }

    .peopleClass ul li .pname {
        position: relative;
        width: 100%;
        height: 6rem;
        line-height: 6rem;
        font-size: 1rem;
        color: #60A35F;
        background-color: #E3FBE2;

        border-radius: 0.4rem;
    }

    .peopleClass ul li a {
        color: #666;
        font-size: 0.5556rem;
        display: block;
        text-align: center;
    }

    .hapi {
        width: 100%;
        height: 100%;

        background-color: #eee;
        position: absolute;
        left: 0;
        top: 0;
    }

    .hapi .topnav {
        background-color: #ff911e;

        border-bottom: none;
        width: 100%;

    }

    .vjs-default-skin {
        width: 100%;
        height: calc(100% - 40px);
    }

</style>
