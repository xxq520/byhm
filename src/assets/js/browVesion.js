/*
* 作者 : 我是一只小小鸟
* 版本 1.0.0
* 微信号 : mosc246
* 微信公众号 ：share_momo
*
* 获取浏览器名称以及浏览器版本号
* 判断浏览器版本
* browser.brow()获取浏览器名称，browser.vesion()获取浏览器版本
*/
export default {
	browVesion:navigator.userAgent.toLowerCase(),
	brow:function(){
		for(var i in this.browEx()){
			if(this.browEx()[i]==this.browTo().toString()){
				return i;	
			}	
		};
		return '无法识别改浏览器名称';
	},
	vesion:function(){
		for(var i in this.browEx()){
			if(this.browEx()[i]==this.browTo().toString()){
				return parseFloat(this.browEx()[i].toString().match(/[\d.]+/));	
			}
		};
		return '无法识别改浏览器版本号';
	},
	browEx:function(){
		return {
			ie : this.browVesion.match(/(msie\s|rv:)([\w.]+)/gi),
			firefox : this.browVesion.match(/(firefox)\/([\w.]+)/gi),
			chrome : this.browVesion.match(/(chrome)\/([\w.]+)/gi),
			edge : this.browVesion.match(/(edge)\/([\w.]+)/gi),
			opera : this.browVesion.match(/(Opera\/|Opera\s|OPR\/)([\w.]+)/gi),
			safari : this.browVesion.match(/(version)\/([\w.]+)/gi)
		}
	},
	browTo:function(){
		if(this.browVesion.indexOf(this.browEx().ie)>0){
			if(this.browVesion.indexOf(this.browEx().firefox)>0){
				return this.browEx().firefox;
			}
			return this.browEx().ie;
		}else if(this.browVesion.indexOf(this.browEx().chrome)>0){
			if(this.browVesion.indexOf(this.browEx().edge)>0){
				return this.browEx().edge;
			}else if(this.browVesion.indexOf(this.browEx().opera)>0){
				return this.browEx().opera;
			}
			return this.browEx().chrome;
		}else if(this.browVesion.indexOf(this.browEx().firefox)>0){
			return this.browEx().firefox;		
		}else if(this.browVesion.indexOf(this.browEx().edge)>0){
			return this.browEx().edge;
		}else if(this.browVesion.indexOf(this.browEx().opera)>0){
			return this.browEx().opera;
		}else if(this.browVesion.indexOf(this.browEx().safari)>0){
			return this.browEx().safari;
		}
	}	
};