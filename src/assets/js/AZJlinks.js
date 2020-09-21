export default function(obj,userid,text){
    Indicator.open('正在跳转爱之家');
    
    axios.get(obj.Api + '/auth/sendLoginMsg?userId=' + userid).then(res => {
        Indicator.close();
        let data = res.data;
        if(res.data.code == 0){
            if(text == 'index'){
                window.location.href = obj.Alinks + '/localQuickPurchase/distributionVA/index?identifying=baiye&userName='+data.userName+'&pwd='+data.password;
            }else{
                window.location.href = obj.Alinks + '/localQuickPurchase/coupons/html/wyf.html?identifying=baiye&userName='+data.userName+'&pwd='+data.password;
            };
        }else{
            Toast('跳转失败');
        }
    })
};