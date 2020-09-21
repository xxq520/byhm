export default function(url,img){
     var wx = require('weixin-js-sdk');
    var imgUrl = 'http://dfs.520shq.com/group1/M00/00/C6/wKgAq1xFeCqAWM89AAAOneZK1mU101.png'
    if(img != null&&img !='undefined'){ 
        imgUrl = img
    }
    console.log(url , img )
    wx.ready(function () {
        wx.onMenuShareTimeline({
            title: '邀请您成为惠盟商家 \r\n          共享惠盟海量客源',
            link: url,
            desc: '百业惠盟分享',
            imgUrl: imgUrl,
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
            imgUrl: 'http://dfs.520shq.com/group1/M00/00/C6/wKgAq1xFeCqAWM89AAAOneZK1mU101.png',
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
            imgUrl: imgUrl,
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
            imgUrl: imgUrl,
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