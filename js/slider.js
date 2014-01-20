/*
	by subying
	tearlght2008@gmail.com
*/
var oaSlider= function(options){
	var defaults = {
		elem:''
		,showStyle:{style:'slide',dir:'right'}
		,time:5000
		,control: ""
		,autoPlay:true
		,controlSelector:""
		,clickClass:'li-h'  //控制台按钮选中的样式
	}
	,opts =$.extend(defaults, options)
	,_slider = new Function
	,_reControl = ''
	,_stop = new Function
	;


	if(opts.autoPlay){
		//处理播放事件
		_slider = function(){
			var _self = this;
			//
			/*
			_self.timer = setInterval(function(){
				_self.mslider();
			},opts.time);
			*/
			_self.timer = setTimeout(function(){
			   _self.mslider();
			   _self.timer = setTimeout(arguments.callee, opts.time);
			}, opts.time);
		};

		//停止播放
		_stop = function(){
			//clearInterval(this.timer);
			clearTimeout(this.timer);
			this.timer=null;
		};
	}

	//提取控制按钮的element
	_reControl = function(obj){
		var _re = {};
		if(opts.control === ""){
			_re = obj.children("ol");
			if(opts.controlSelector !=""){
				_re = obj.find(opts.controlSelector);
			}
		}else{
			_re = opts.control;
		}
		return _re;
	};



	var elem = opts.elem;
	if(elem.length===0) return false;
	_img = elem.children(".slider_div").children();
	if(_img.length<=1) return false;

	this.img = elem.children(".slider_div").children();
	this.div = elem.children(".slider_div");
	this.ol = _reControl(elem);
	this.txt = elem.children(".slider_txt");
	this.cover = elem.children(".slider_cover");
	this._width = this.img.eq(0).css('width');
	this._height = this.img.eq(0).css('height');
	this.mIndex = 0,this.timer = 0;

	this.stop = _stop;
	this.slider = _slider;
	this.opts = opts;
	this._tempAniObj = '';

	this.init();
};

oaSlider.prototype={
	init:function(){
		var _self = this,opts = _self.opts;
		if(opts.showStyle.style == 'fade'){
			$.each(_self.div.children(),function(i,n){
				if(i==0){
					$(n).css({opacity:1,zIndex:10});
				}else{
					$(n).css({opacity:0,zIndex:9});
				}
			});
		}else{
			if(opts.showStyle.dir === 'right'){
				_self.div.css({left:0,top:0,width:parseInt(_self._width)*(_self.img.length+1)});//_this_img.length+1 针对ie6最后一张图片不显示
			}else{
				_self.div.css({left:0,top:0,height:parseInt(_self._height)*(_self.img.length)});
			}
		}

		_self.ol.hide();
		$(function(){
			_self.ol.show();
			_self.bindFn();
			_self.slider();
		});
	},
	bindFn:function(){
		var _self = this;
		_self.div.hover(function(){
			_self.stop();
		},function(){
			_self.slider();
		});

		/**/
		$.each(_self.ol.children(),function(i,n){
			var _elem = $(n);
			if(i===0){
				_elem.addClass(_self.opts.clickClass);
				_self.txt.children().html(_self.img.eq(i).attr("alt"));
			 }
		});

		 //绑定控制按钮的事件
		_self.ol.children().on('click',function(){
			var i = $(this).index();
			_self.stop();//清楚时间间隔动画，停止自动播放
			if(i != _self.mIndex){//如果要跳转到的图片是当前的图片，则不执行图片切换。
				_self.mslider(i,true);
			}
			_self.slider();//恢复自动播放
		});

	},
	mslider:function(num,clicked){
		var n = 0,_self = this,opts = _self.opts;
		if(typeof(num) ==='undefined' ){
			var num = _self.mIndex + 1;
		}
		if(num < _self.img.length){
			n = num;
		}

		var _now = _self.div.children().eq(_self.mIndex),_next = _self.div.children().eq(n);

		if(opts.showStyle.style == 'fade'){
			if(_self._tempAniObj){
				_self._tempAniObj.stop(true);
			}
			_now.css({zIndex:10}).siblings().css({zIndex:9,opacity:0});
			_next.css({opacity:1});
			_self._tempAniObj = _now;
			_now.animate({opacity:0},500,function(){
				_now.css({zIndex:9});
				_next.css({zIndex:10});
			});
		}else{
			if(opts.showStyle.dir === 'right'){
				_self.div.animate({left:-n*parseInt(_self._width)},1000);
			}else{
				_self.div.animate({top:-n*parseInt(_self._height)},1000);
			}
		}
		_self.txt.children().html(_self.img.eq(n).attr("alt"));
		_self.ol.children().eq(n).addClass(opts.clickClass).siblings().removeClass(opts.clickClass);
		_self.mIndex = n;

	}
};