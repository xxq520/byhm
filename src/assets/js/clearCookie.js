
import vueCookie from 'vue-cookie';
export default function(){
    vueCookie.delete('isBHShop');   
    vueCookie.delete('expire');
    vueCookie.delete('expire');                 // 过期时间
    vueCookie.delete('userPhone');              // 用户账号（名称）
    vueCookie.delete('token');                  // token
    vueCookie.delete('userid');                 // 用户id
    vueCookie.delete('level_id');               // 代理商级别
    vueCookie.delete('vip_type');               // 用户级别
    vueCookie.delete('vip_time');               // 用户过期时间
    vueCookie.delete('seq');                    // seq
    vueCookie.delete('superiorLevel');          // 邀请人是否是推广商
    vueCookie.delete('merId');
    vueCookie.delete('card');                   // 用户用户卡
    vueCookie.delete('isActive');               // 判断是否是用户
    vueCookie.delete('isPartner');              // 0-非520平台伙伴 1-伙伴  2-禁用
    vueCookie.delete('isFake');                 // 升级是否购卡
    vueCookie.delete('cardType');               // 买卡时间 1-季卡 3-年卡
    vueCookie.delete('isShowExpireTimeMsg');    // 用户卡过期七天前提醒
    vueCookie.delete('agencyStatus');           // 运营商及以上级别审核通过

    vueCookie.delete('nickname');               // 昵称1
    vueCookie.delete('realName');               // 昵称2
    vueCookie.delete('province');               // 省
    vueCookie.delete('city');                   // 市
    vueCookie.delete('county');                 // 区
    vueCookie.delete('address');                // 详细地址

    // 首页弹框显示
    vueCookie.delete('isShow');
    vueCookie.delete('isYLEnter');
    
    // 是否有未支付订单
    vueCookie.delete('isPayStatus');
    vueCookie.delete('superior');

};