;(function($){
	var defaults = {
		key: 'value',
		initClass: 'ms-drop--initialized'

		// Callback functions
		// created: function () {} // Вызов вконце функции init()
	};

	function MsShutter(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();
		self.event(); // example event
		self.init(); // create DOM structure of the plugins
	}

	/** track events */
	MsShutter.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.msShutter', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	MsShutter.prototype.event = function () {
		var self = this;
		self.element.on('mouseenter', function (e) {
			e.preventDefault();
			alert('Сработало событие наведения курсора на область елемента, к которому применен данный плагин!');
		});
	};

	MsShutter.prototype.init = function () {

		this.element.addClass(this.config.initClass);

		this.element.trigger('created.msShutter');

	};

	$.fn.msShutter = function (options) {
		'use strict';

		return this.each(function(){
			new MsShutter($(this), options);
		});

	};
})(jQuery);