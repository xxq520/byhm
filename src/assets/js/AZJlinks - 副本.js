export default function(){
    var href = window.location.href;
    var contentUrl = href.substring(0, href.indexOf("distributionVA/")) + "distributionVA/index";
    //判断浏览器是否为 指定的 浏览器
    function deviceDetect(str) {
        var u = navigator.userAgent;
        if (u.indexOf(str) > 0) {
            return true;
        } else {
            return false;
        }

    }
    var browser = {
        versions: function() {
            var u = navigator.userAgent,
            app = navigator.appVersion;
            return {
                app: u.indexOf('app_webview') > -1,
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                /*android终端或者uc浏览器*/
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                /*ios终端*/
                trident: u.indexOf('Trident') > -1,
                /*IE内核*/
                presto: u.indexOf('Presto') > -1,
                /*opera内核*/
                webKit: u.indexOf('AppleWebKit') > -1,
                /*苹果、谷歌内核*/
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                /*火狐内核*/
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                /*是否为移动终端*/
                iPhone: u.indexOf('iPhone') > -1,
                /*是否为iPhone或者QQHD浏览器*/
                iPad: u.indexOf('iPad') > -1,
                /*是否iPad*/
                webApp: u.indexOf('Safari') == -1,
                /*是否web应该程序，没有头部与底部*/
                souyue: u.indexOf('souyue') > -1,
                superapp: u.indexOf('superapp') > -1,
                weixin: u.toLowerCase().indexOf('micromessenger') > -1,
                Safari: u.indexOf('Safari') > -1
            };

        } (),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    if (browser.versions.ios) {
        //你的代码 唤醒爱之家
        window.location.href = "lovefenxiao://com.huaxiang.fenxiao";
        setTimeout(function() {
            //打开app store
            window.location.href = "https://itunes.apple.com/cn/app/520%E7%88%B1%E4%B9%8B%E5%AE%B6/id1329942009?mt=8";
            window.location.href = "https://itunes.apple.com/cn/app/520%E7%88%B1%E4%B9%8B%E5%AE%B6/id1329942009?mt=8";
        },
        2000)
    } else if (browser.versions.android) {
        //你的代码 唤醒爱之家
        window.location.href = "lovefenxiao://com.huaxiang.fenxiao";
        if (deviceDetect('Mobile MQQBrowser') && !deviceDetect('MicroMessenger')) {
            //如果是QQ或者微信打开链接 那么就调转到腾讯应用市场 可以直接打开app
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huaxiang.fenxiao&channel=0002160650432d595942&fromcase=60001";
        }
        setTimeout(function() {
            window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.huaxiang.fenxiao&channel=0002160650432d595942&fromcase=60001";
            //window.location.href = "http://www.wandoujia.com/apps/com.huaxiang.fenxiao";
        },
        2000)
    } else {
        //回到首页
        window.location.href = contentUrl;
    }
};