// 
export default {
    RegPhone: /^1[3456789]\d{9}(-\d+)?$/,
    RegIDcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ , // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    RegMail:  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ //校验邮箱
};