import vueCookie from 'vue-cookie';
export default function (string) {
    // console.log(string,'81')
    // cookie保存登录信息
    if (string && string != null && string != '') {
        let data = typeof string == 'string' ? JSON.parse(string) : string;
        let expire = data['expire_time'] ? new Number(data['expire_time']) / (60 * 60) + 'h' : '30D'; // 设置过期时间12h
        // alert(JSON.stringify(string))
        //console.log(expire)
        vueCookie.set('isBHShop', data.isBHShop, {
            expires: expire
        });
        vueCookie.set('expire', data.expire, {
            expires: expire
        }); // 过期时间
        vueCookie.set('userid', data.userId, {
            expires: expire
        }); // 用户id
        vueCookie.set('userPhone', data.username, {
            expires: expire
        }); // 用户账号（名称）
        vueCookie.set('token', data.token, {
            expires: expire
        }); // token
        vueCookie.set('level_id', data['level_id'], {
            expires: expire
        }); // 代理商级别
        vueCookie.set('vip_type', data.type, {
            expires: expire
        }); // 用户级别
        vueCookie.set('vip_time', data['expire_time'], {
            expires: expire
        }); // 用户过期时间
        vueCookie.set('seq', data.seq, {
            expires: expire
        });
        vueCookie.set('isActive', data.isActive, {
            expires: expire
        }); // 判断是否是用户
        vueCookie.set('isPartner', data['is_partner'], {
            expires: expire
        }); // 0-非520平台伙伴 1-伙伴  2-禁用
          vueCookie.set('card', data['card_no'], {
              expires: expire
          }); // 用户用户卡
        vueCookie.set('merId', data['merchantId'], {
            expires: expire
        });
        vueCookie.set('isFake', data['isFake'], {
            expires: expire
        }); // 升级是否购卡
        vueCookie.set('cardType', data['cardType'], {
            expires: expire
        }); // 买卡时间 1-季卡 3-年卡
        vueCookie.set('isShowExpireTimeMsg', data['isShowExpireTimeMsg'], {
            expires: expire
        }); //用户卡过期七天前提醒
        vueCookie.set('agencyStatus', data['agencyStatus'], {
            expires: expire
        }); // 运营商及以上级别审核通过

        vueCookie.set('nickname', data['nickname'], {
            expires: expire
        }); // 昵称1
        vueCookie.set('realName', data['realName'], {
            expires: expire
        }); // 昵称2
        vueCookie.set('fullVipNum', data['fullVipNum'], {
            expires: expire
        });
        vueCookie.set('superior', data['superior'], {
            expires: expire
        });
    } else {
        alert('请登录。')
    }
};
