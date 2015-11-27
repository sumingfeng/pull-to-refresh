/* =========================================================
 * su-pull.js 1.0
 * author:sumingfeng 
 * Demo: demo.html
 * ========================================================= */

$.fn.transition = function(duration) {
	
        if (typeof duration !== 'string') {
			
            duration = duration + 'ms';
			
        }
        for (var i = 0; i < this.length; i++) {
			
            var elStyle = this[i].style;
			
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
			
        }
	
        return this;
	
    };

$.fn.transform = function(transform) {
	
        for (var i = 0; i < this.length; i++) {
			
            var elStyle = this[i].style;
			
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
			
        }
	
        return this;
	
 };

 $.fn.transitionEnd = function(callback) {
	 
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
			
            if (e.target !== this) return;
			
            callback.call(this, e);
			
            for (i = 0; i < events.length; i++) {
				
                dom.off(events[i], fireCallBack);
				
            }
        }
        if (callback) {
			
            for (i = 0; i < events.length; i++) {
				
                dom.on(events[i], fireCallBack);
				
            }
        }
        return this;
};

$.fn.Su_pull = function(opts,callback){

	var defaults = {
		
		diff: '50'
	};
	
	opts = opts || $.extend(defaults,opts);
	
	var isTouched,isMoved,isScrolling,wasScrolled,touchesStart = {},that=this,
		
		refresh = false,useTranslate = false,startTranslate = 0,translate,triggerDistance, 
		
		dynamicTriggerDistance;
	

	function handleTouchStart(e){
		
		e.preventDefault();
		
		isTouched = true;
		
		isMoved = false;
		
		touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
		
		touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
	}
	
	function handleTouchMovie(e){
		
		if(!isTouched) return;
		
		var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
		
		var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
		
		if(typeof isScrolling === "undefined"){
		
			isScrolling = !!(isScrolling || Math.abs(pageY-touchesStart.y) > Math.abs(pageX-touchesStart.x));
			
		}
		
		if(!isScrolling){
			
			isTouched = false;
			
			return;
		}
		
		scrollTop = that[0].scrollTop;
		
		if(typeof wasScrolled ==='undefined' && scrollTop !=0){
			
			wasScrolled = true;
		}
		
		if(!isMoved){
			
			that.removeClass('transitioning');
			
			if(scrollTop > that[0].offsetHeight){
				
				isTouched = false;
				
				return;
			}
			
			if(opts.diff != 'undefined'){
			
				triggerDistance = opts.diff;
				
				if (triggerDistance.indexOf('%') >= 0) triggerDistance = that[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
				
				startTranslate = that.hasClass('refreshing') ? triggerDistance : 0;
				
				if (that[0].scrollHeight === that[0].offsetHeight) {
					
					useTranslate = true;
					
				} else {
					
					useTranslate = false;
					
				}
				
				useTranslate = true;
				
			}
		}
		
		
		isMoved = true;
		
		touchesDiff = pageY - touchesStart.y;
		
		if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
				
			if (useTranslate) {
				
					e.preventDefault();
				
					translate = (Math.pow(touchesDiff, 0.85) + startTranslate);
				
					that.transform('translate3d(0,' + translate + 'px,0)');
				
				} else {}
			
				if ((useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance) || (!useTranslate && touchesDiff >= triggerDistance * 2)) {
					
					refresh = true;
					
					that.addClass('pull-up').removeClass('pull-down');
					
				} else {
					
					refresh = false;
					
					that.removeClass('pull-up').addClass('pull-down');
				}
			
			} else {

				that.removeClass('pull-up pull-down');
				
				refresh = false;
				
				return;
			}
	}
	
	function handleTouchEnd(e) {
		
			if (!isTouched || !isMoved) {
				
				isTouched = false;
				
				isMoved = false;
				
				return;
			}
		
			if (translate) {
				
				that.addClass('transitioning');
				
				translate = 0;
			}
		
			that.transform('');
		
			if (refresh) {
				
				that.addClass('refreshing');
				
				callback && callback(e,that);
				
				callback && resertDo();
				
				
			} else {
				
				that.removeClass('pull-down');
				
			}
		
			isTouched = false;
		
			isMoved = false;
		}
  
	function resertDo(){ //重置
		
		that.removeClass('refreshing').addClass('transitioning');
				
		that.transitionEnd(function () {
					
			that.removeClass('transitioning pull-up pull-down');
			
		});
	
	}
	
	that.on("touchstart",handleTouchStart);
	
	that.on("touchmove",handleTouchMovie);

	that.on("touchend",handleTouchEnd);

	
}