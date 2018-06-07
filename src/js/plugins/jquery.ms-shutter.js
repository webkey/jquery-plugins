/*! jquery.ms-msShutter.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: popup-msShutter
 */

;(function($){
	'use strict';

	var Shutter = function(element, config){
		var self,
			$element = $(element),
			modifiers = {
				init: 'ms-shutter--initialized'
			};

		var callbacks = function() {
				/** track events */
				$.each(config, function (key, value) {
					if(typeof value === 'function') {
						$element.on(key + '.msShutter', function (e, param) {
							return value(e, $element, param);
						});
					}
				});
			},
			init = function () {
				$element.addClass(modifiers.init);
				$element.trigger('afterInit.msShutter');
			};

		self = {
			callbacks: callbacks,
			init: init
		};

		return self;
	};

	$.fn.msShutter = function (options) {
		return this.each(function(){
			var msShutter;
			// check for re-initialization
			if(!$(this).data('msShutter')) {
				msShutter = new Shutter(this, $.extend(true, {}, $.fn.msShutter.defaultOptions, options));
				msShutter.callbacks();
				msShutter.init();

				// set data for check re-initialization
				$(this).data('msShutter', msShutter);
			}
		});
	};

	$.fn.msShutter.defaultOptions = {
		opener: '.ms-popup-d__opener-js',
		popup: '.ms-popup-d__popup-js',
		closeBtn: '.ms-popup-d__close-js',
		dataClickOutside: true, // Close all if outside click
		dataClickEsc: true // Close all if escape key click
	}

})(jQuery);