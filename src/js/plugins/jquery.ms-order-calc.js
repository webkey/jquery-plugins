;(function($){
	var defaults = {
		spinner: '.order-calc__number-js',
		price: '.order-calc__price-js',
		priceSum: '.order-calc__price-sum-js',
		btnRemove: '.order-calc__remove-js',
		totalResult: '.order-calc__total-results-js',
		totalCount: '.order-calc__counts-total-js',
		totalPrice: '.order-calc__price-total-js',
		row: 'tr',
		objParam: {},

		initClass: 'ms-order-calc--initialized'

		// Callback functions
		// created: function () {} // Вызов вконце функции init()
	};

	function MsOrderCalc(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		// self.objParam = {};
		self.callbacks();
		self.event(); // example event
		self.init(); // create DOM structure of the plugins
	}

	/** track events */
	MsOrderCalc.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.msOrderCalc', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	MsOrderCalc.prototype.event = function () {
		var self = this;

		self.element.on('change spin', self.config.spinner, function (e, ui) {
			var $curSpin = $(this);
			var $curRow = $curSpin.closest(self.config.row);
			var $curPrice = $curRow.find(self.config.price);
			var priceVal = $curPrice.data('price');

			var currentItemCount = ui ? ui.value : +$curSpin.val();
			var priceValSum = Math.round(priceVal * currentItemCount * 100) / 100;

			// add count items and sum price to DOM
			// $curPrice.attr('data-count-sum', currentItemCount);
			// $curPrice.attr('data-price-sum', priceValSum);

			// add current item's price sum to DOM
			$curRow.find(self.config.priceSum).html(priceValSum);

			// создаем объект состоящий из id элементов, у которых есть поля количества (count), цены (price) и общей цены (priceSum)
			var id = $curSpin.data('id');
			self.config.objParam[id] = {
				'count': currentItemCount,
				'price': priceVal,
				'priceSum': priceValSum
			};

			console.log("self.objParam: ", self.config.objParam);

			// суммируем значения полей количества и общей цены в созданных объектах
			var totalCount = self.sumParam(self.config.objParam, 'count');
			var totalPrice = self.sumParam(self.config.objParam, 'priceSum');

			self.element.find(self.config.totalResult).toggleClass('show', totalCount > 0);
			self.element.find(self.config.totalCount).text(totalCount);
			self.element.find(self.config.totalPrice).text(totalPrice);
		});
	};

	MsOrderCalc.prototype.recalc = function () {
		var self = this;

	};

	MsOrderCalc.prototype.sumParam = function (obj, param) {

		var result = 0;
		var prop;

		for(prop in obj) {
			result += obj[prop][param];
		}

		return Math.round(result*100)/100;

	};

	MsOrderCalc.prototype.init = function () {

		this.element.addClass(this.config.initClass);

		this.element.trigger('created.msOrderCalc');

	};

	$.fn.msOrderCalc = function (options) {
		'use strict';

		return this.each(function(){
			new MsOrderCalc($(this), options);
		});

	};
})(jQuery);