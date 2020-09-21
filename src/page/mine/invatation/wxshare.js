export default function(url){
     var wx = require('weixin-js-sdk');
     console.log(url,'3')
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: '邀请您成为惠盟商家 \r\n          共享惠盟海量客源',
            link: url,
            desc: '百业惠盟分享',
            imgUrl: '@/assets/images/dp_tx_nmtx.png',
            success () {
                alert('分享朋友圈成功')
            },
            cancel () {
            }
        });
       
        wx.onMenuShareAppMessage({
            title: '邀请您成为惠盟商家 \r\n          共享惠盟海量客源',
            desc: '百业惠盟分享',
            link: url,
            imgUrl: '@/assets/images/dp_tx_nmtx.png',
            success: function () {
                alert('分享给朋友成功')                
            },
            cancel: function () {
            }
        });
        wx.onMenuShareQQ({
            title: '邀请您成为惠盟商家 \r\n          共享惠盟海量客源',
            desc: '百业惠盟分享',
            link: url,
            imgUrl: '@/assets/images/dp_tx_nmtx.png',
            success: function () {
                alert('分享给QQ好友成功')
            },
            cancel: function () {
            }
        });
        wx.onMenuShareQZone({
            title: '邀请您成为惠盟商家 \r\n          共享惠盟海量客源',
            desc: '百业惠盟分享',
            link: url,
            imgUrl: '@/assets/images/dp_tx_nmtx.png',
            success: function () {
                alert('分享给QQ空间成功')
            },
            cancel: function () {
            }
        });
    })
    wx.error(function (res) {
        console.log(res,'5')
    });
};