/*
* 作者 : 我是一只小小鸟
* 版本 1.0.0
* 微信号 : mosc246
* 微信公众号 ：share_momo
*
* 移动弹窗
* pup(DOM元素节点).wmob()
*/
function Pwin(elem){
	this.elem=elem;
	this.arr=this.elem.split(',');
	this.agrs=[];
	this.elmpa=[];
	for(var i=0;i<this.arr.length;i++){
		this.agrs[i] = document.getElementById(this.arr[i].substr(1));
		this.elmpa[i] = setTop(this.agrs[i]);
		this.agrs[i].style.cursor = 'all-scroll';
	};
	//查找固定滑动块级
	function setTop(elems){
		var parent,
			bo=document.body;
		if(tostyle(elems,'position')!='fixed'){
			parent=elems.parentNode;
			while(parent!=bo){
				if(tostyle(parent,'position')!='fixed'){
					parent=parent.parentNode;
				}
				return parent
			}
		}else{
			return parent=elems;	
		}
	};
	function tostyle(elems,styleArr){
		if(typeof window.getComputedStyle!='undefined'){
			return window.getComputedStyle(elems,null)[styleArr];	
		}else if(typeof elems.currentStyle!='undefined'){
			return elems.currentStyle[styleArr]	
		}
	};
};
Pwin.prototype.wmob=function(e){
	var parent=this.elmpa;
	var hastouch  = ('createTouch' in document)||('ontouchstart' in window);//判断是否是在触屏状态上（手机触屏）
	var startEvent=hastouch?'touchstart':'mousedown';
	var moveEvent=hastouch?'touchmove':'mousemove';
	var endEvent=hastouch?'touchend':'mouseup';
	console.log(startEvent)
	for(var i=0;i<this.agrs.length;i++){
		this.agrs[i].index=i;
		this.agrs[i]['on'+startEvent]=function(e){
			var e=e||window.event;
			var s=this.index;
			var difl=hastouch?e.targetTouches[0].pageX-parent[s].offsetLeft:evt(e).x-parent[s].offsetLeft;
			var dift=hastouch?e.targetTouches[0].pageY-parent[s].offsetTop:evt(e).y-parent[s].offsetTop;
			addEvent(document,moveEvent,move);
			addEvent(document,endEvent,up);
			function move(e){
				var e=e||window.event;
				var tops=hastouch?e.targetTouches[0].pageY-dift:evt(e).y-dift;
				var toph=document.documentElement.clientHeight-parent[s].offsetHeight;
				var topff=(toph<tops)?toph:(tops<0)?0:tops;
				
				var lefts=hastouch?e.targetTouches[0].pageX-difl:evt(e).x-difl;
				var lefth=document.documentElement.clientWidth-parent[s].offsetWidth;
				var leftff=(lefth<lefts)?lefth:(lefts<0)?0:lefts;
				parent[s].style.top=topff+'px';
				parent[s].style.left=leftff+'px';
			};
			function up(){
				removeEvent(document,moveEvent,move);
				removeEvent(document,endEvent,up);
			};
			function evt(e){
				var clin={}
				clin.x=e.clientX+document.body.scrollLeft + document.documentElement.scrollLeft; 
				clin.y=e.clientY+document.body.scrollTop + document.documentElement.scrollTop;
				return clin;
			}
		};
	};
	window.onresize=function(){
		for(var s=0;s<parent.length;s++){
			var t,l;
			var topr=document.documentElement.clientHeight-parent[s].offsetHeight;
			var leftr=document.documentElement.clientWidth-parent[s].offsetWidth;
			if(topr<parent[s].offsetTop){
				parent[s].style.top=topr+'px';
			}else if(parent[s].offsetTop<0){
				parent[s].style.top=0+'px';
			};
			if(leftr<parent[s].offsetLeft){
				parent[s].style.left=leftr+'px';
			}else if(parent[s].offsetLeft<0){
				parent[s].style.left=0+'px';
			}
		}
	};
	//跨浏览器添加事件
	function addEvent(obj, type, fn) {
		if (obj.addEventListener){
			obj.addEventListener(type, fn, false);//标准W3C
		} else if (obj.attachEvent){
			obj.attachEvent('on' + type, fn);//ie
		}
	};
	//跨浏览器移除事件
	function removeEvent(obj, type, fn) {
		if (obj.removeEventListener) {
			obj.removeEventListener(type, fn, false);//标准W3C
		} else if (obj.detachEvent) {
			obj.detachEvent('on' + type, fn);//ie
		}
	};
	return this;
};


export default function(elem){
	return new Pwin(elem);
};