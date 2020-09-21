// 创建一个Swiper函数方法，使用原型链来封装Swiper插件
function Swiper(obj){
	this.box = obj.box;				// 最外层，显示标签DOM
	this.wrap = obj.wrap;			// 滑动标签DOM
	this.list = obj.list;
	this.length = $(obj.list).length;	// obj.list滚动内容块DOM
	this.index = 0;					// 滚动当前索引
	$(this.wrap).css({
		'width': '100%',
		'transition':'all linear 0.1s',
		'display': '-webkit-flex',
		'display': 'flex'
	});
	$(obj.list).css({
		'width': '100%',
		'-webkit-flex-shrink': 0,
		'-ms-flex-negative': 0,
		'flex-shrink': 0
	}).eq(this.index).addClass('iActive');
};
// 设定一个对象，值为null，
Swiper.prototype.swiperIndex = null;
// 启动函数，其中fn为插入函数
// 其中fn函数属性赋值给swiperIndex，可以在里面获取图片索引this.index，扩展滚动之后运行的对象
Swiper.prototype.swiperTouch = function(fn){
	var that = this;
	var wrap = this.wrap;
	var box = this.box;
	var list = this.list;
	var hastouch  = ('createTouch' in document)||('ontouchstart' in window);
	var start = hastouch?'touchstart':'mousedown';
	var move = hastouch?'touchmove':'mousemove';
	var end = hastouch?'touchend':'mouseup';

	// hastouch判断touch触屏事件是否存在，以此来判断手机端或者pc端来取值
	// 手机端touch触屏事件
	// pc端mouse鼠标事件
	// 其中分3个阶段，执行不同的步骤，
	// start鼠标左键按下或者触屏开始时获取开始值
	// move鼠标左键按下或触屏开始移动时根据开始值来计算移动值
	// end鼠标左键松开或触屏结束时清除，移动和自身结束事件，等下一次开始再次创建
	$(box).on(start,function(event){
		var slet = translateX(wrap);
		var width = parseInt($(this).width());
		var bx = hastouch?window.event.targetTouches[0].pageX:window.event.screenX;
		var by = hastouch?window.event.targetTouches[0].pageY:window.event.screenY;
		var direction = 0;
		$(wrap).on(move,function(event){
			var wx = hastouch?window.event.targetTouches[0].pageX:window.event.screenX;
			var wy = hastouch?window.event.targetTouches[0].pageY:window.event.screenY;
			direction =(direction!==0)?direction : getDirection(bx, by, wx, wy);

			switch(direction){
				case 3:
				case 4:
					var late = slet+wx-bx;
					if(-late<=0){
						late = 0;
					}else if(-late >= (that.length-1)*width){
						late = -(that.length-1)*width
					}
					$(this).css("transform","matrix(1, 0, 0, 1, "+late+", 0)");
					break;
			}
		});
		$(this).on(end,function(){
			var transitionEvent = whichTransitionEvent();
			$(wrap).on(transitionEvent,function(){
				var getindex = 0;
				var sletend = parseInt(translateX(wrap));
				// 当左右滑动时判断sletend < slet；
				if(sletend < slet){
					if((Math.abs(sletend)%width)/width > 0.3){
						getindex = sletend>0?Math.ceil(Math.abs(sletend)/width):-Math.ceil(Math.abs(sletend)/width);
					}else{
						getindex = sletend>0?Math.floor(Math.abs(sletend)/width):-Math.floor(Math.abs(sletend)/width);
					};
				}else{
					if((Math.abs(sletend)%width)/width > 0.3){	
						getindex = sletend>0?Math.floor(Math.abs(sletend)/width):-Math.floor(Math.abs(sletend)/width);
					}else{
						getindex = sletend>0?Math.ceil(Math.abs(sletend)/width):-Math.ceil(Math.abs(sletend)/width);
					};
				};
				if(-getindex < 0){
					getindex = 0;
				}else if(-getindex > that.length-1){
					getindex = that.length-1
				};
				that.index = Math.abs(getindex);
				$(this).css({
					"transform":function(){
						if(fn && typeof fn == 'function'){
							that.swiperIndex = fn;
							that.swiperIndex();
						};
						return "matrix(1, 0, 0, 1, "+(getindex*width)+", 0)"
					}
				});
				$(list).removeClass('iActive').eq(that.index).addClass('iActive');
			});
			$(wrap).off(move);
			$(this).off(end);
		});
	});
	if(fn && typeof fn == 'function'){
		that.swiperIndex = fn;
		that.swiperIndex();
	};
	// 获取transition过度属性停止后事件，主要处理不同浏览器兼容性
	function whichTransitionEvent(){
		var t,
			el = document.createElement('surface'),
			transitions = {
				'transition':'transitionend',
				'OTransition':'oTransitionEnd',
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			}
		for(t in transitions){
		   if( el.style[t] !== undefined ){
			   return transitions[t];
		   }
		}
	};
	// 获取当前平移值
	// transform最终获得的是一个矩形集合属性matrix(1,0,0,1,0,0) ，其中有6个值
	// 其中第5个属性为x平移属性
	function translateX(elem){
		var slet = $(elem).css("transform");
		if(slet != 'none'){
			slet = slet.replace('matrix(','').replace(')','').split(',')[4];
			slet = new Number(slet);
		}else{
			slet = 0;
		};
		return slet;
	};
};
// 方向
function getDirection(startx, starty, movex, movey) {
	var angx = movex - startx;
	var angy = movey - starty;
	var result = 0;

	var angle = Math.atan2(angy, angx) * 180 / Math.PI;
	if (angle >= -150 && angle <= -30) {
		result = 1;
	} else if (angle > 30 && angle < 150) {
		result = 2;
	} else if ((angle >= 150 && angle <= 180) || (angle >= -180 && angle < -150)) {
		result = 3;
	} else if (angle >= -30 && angle <= 30) {
		result = 4;
	}
	return result;
};
// 模块出口，出口函数，每次调用都会new 一个Swiper方法来创建，每一个new都是独立的，所以创建多独立的Swiper；
export default function(box,wrap){
	return new Swiper(box,wrap)
};