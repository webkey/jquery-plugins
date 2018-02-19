;(function($){
	var defaults = {
		key: 'value',
		containerClass: 'container-class'

		// Callback functions
		// created: function () {} // Вызов вконце функции init()
	};

	function ExampleJqPluginConstructor(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();
		self.event(); // example event
		self.init(); // create DOM structure of the plugins
	}

	/** track events */
	ExampleJqPluginConstructor.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.exampleJqPluginName', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	ExampleJqPluginConstructor.prototype.event = function () {
		var self = this;
		self.element.on('mouseenter', function (e) {
			e.preventDefault();
			alert('Сработало событие наведения курсора на область елемента, к которому применен данный плагин!');
		});
	};

	ExampleJqPluginConstructor.prototype.init = function () {

		this.element.addClass(this.config.containerClass);

		this.element.trigger('created.exampleJqPluginName');

	};

	$.fn.exampleJqPluginName = function (options) {
		'use strict';

		// new ExampleJqPluginConstructor(this, options);
		//
		// return this;

		return this.each(function(){
			new ExampleJqPluginConstructor($(this), options);
		});

	};
})(jQuery);