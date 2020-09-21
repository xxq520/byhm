<template>
    <div>
        <mt-popup v-model="shareIsTrue" position="bottom" popup-transition="popup-fade" class="popup share-popup"
            @click="changeShare">
            <p class="share-type">选择分享平台</p>
            <ul class="share-list">
                <div class="soshm"></div>
            </ul>
            <p class="cancel-share" @click="changeShare">取消分享</p>
        </mt-popup>
    </div>
</template>

<script>
    import soshm from 'soshm'
    import wx from 'weixin-sdk-js';
    import Vue from 'vue';

    export default {
        name: "share",
        data() {
            return {
                shareIsTrue: false,
                signature: '',
                timestamp: '',
                nonceStr: ''
            }
        },
        props: {
            shareData: {
                type: Object,
                default: {}
            }
        },
        methods: {
            changeShare() {
                this.shareIsTrue = !this.shareIsTrue;
                soshm.weixinSharetip();
            },
            shareInit() {
                var that = this;
                var getappId = axios.get('http://by.520shq.com/api/wechat/wechatParam', {
                    params: {
                        url: window.location.href.split("#")[0]
                   
                    }
                })
                getappId.then(res => {
                    if (res.status == 200) {
                        let data = res.data
                        this.signature = data.signature
                        this.timestamp = data.timestamp
                        this.nonceStr = data.nonceStr
                        wx.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: 'wxd4d112b4765d1b4b',
                            // appId:'wxfbec726004f51e9b',
                            timestamp: this.timestamp,
                            nonceStr: this.nonceStr,
                            signature: this.signature,
                            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline',
                                'translateVoice', 'onMenuShareQQ', 'onMenuShareQZone'
                            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        })
                    } else {
                        Toast('网络错误，请重试！')
                    }
                    wx.ready(function () {
                        wx.checkJsApi({
                            jsApiList: [
                                'onMenuShareAppMessage',
                                'onMenuShareTimeline',
                                'onMenuShareQQ',
                                'onMenuShareQZone',
                            ]
                        })
                        
                        var shareData = {
                            title: that.shareData.title,
                            desc: that.shareData.digest,
                            link: that.shareData.url,
                            shareUrl: that.shareData.url,
                            imgUrl: that.shareData.pic,
                            success: function () {
                                alert("分享成功")
                            }
                        };
                        wx.onMenuShareAppMessage(shareData);
                        wx.onMenuShareTimeline(shareData);
                        wx.onMenuShareQQ(shareData);
                        wx.onMenuShareQZone(shareData);
                    });
                })
            }
        },
        mounted() {
            var that = this;
            setTimeout(() => {
                soshm('.soshm', that.shareData);
                that.shareInit()
            }, 1000)
        }
    }

</script>

<style>
    .soshm-item-text {
        padding-top: 0.2rem;
    }

    .soshm-item-text {
        display: block !important;
    }

    .soshm {
        display: flex;
        text-align: center;
        justify-content: space-between;
        margin-top: 1rem;
    }

    .soshm>div {
        float: none !important;
    }

    div.share-popup {
        height: 30vh;
        width: 100%;
        background-color: #f1f1f1 !important;
    }

    div.share-popup {
        height: 30vh;
        background-color: #f1f1f1 !important;
    }

    .share-type {
        font-size: 0.7rem;
        text-align: center;
        padding-top: 1rem;
    }

    .share-list {}

    .cancel-share {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1.6rem;
        background-color: #f8f8f8;
        text-align: center;
        font-size: 0.6rem;
        line-height: 1.6rem;
    }

</style>
