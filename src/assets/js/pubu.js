

export default function(){
	$.fn.extend({
		Pubu:function fun(list){
			var _this=$(this),
				list=$(list);
			_this.css({ 'position':'relative','margin':'0 auto' });
			list.css({ 'position':'absolute' });
			function fn(){
				var pHeight=[],
					Width=parseInt(list.width()),
					Column=parseInt(_this.width()/Width),
					Margin=(_this.width() - Width*Column)/(Column - 1);
				for(var i=0;i<list.length;i++){
					var num=0;	
					for(var j=i-Column;j>=0;j=j-Column){
						num=num+list.eq(j).height()+Margin;
					};
					list.eq(i).css({"left":i%Column*(Width+Margin)+'px',"top":num+'px'});
					pHeight[i]=num+list.eq(i).height()+Margin;
				};
				pHeight.sort(function(a,b){return b-a});
				_this.css({
					"height": pHeight[0]+"px"
				});
			};
			for(var i=0;i<list.length;i++){
				(function(i){
					var imgs=new Image();
					imgs.src=list.eq(i).find('img').attr('xsrc');
					$(imgs).load(function(){
						list.eq(i).find('img').attr('src',imgs.src);
						fn();
					});
				})(i);
			};
			window.onresize = fn;
		}
	})
};