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
		objParams: {},

		initClass: 'ms-order-calc--initialized'
	};

	function MsOrderCalc(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;

		self.callbacks();

		self.initialCalc();
		self.changeNumber();
		self.removeItem();

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

	// calculation after load DOM
	MsOrderCalc.prototype.initialCalc = function () {
		var self = this, counter = 0;

		console.log('===initialCalc===');

		var $spinner = self.element.find(self.config.spinner);
		$.each($spinner, function () {
			var $curSpinner = $(this);
			var curSpinnerVal = +$curSpinner.val();

			if(!curSpinnerVal) {
				return;
			}
			counter++;

			self.createObjParams($curSpinner, curSpinnerVal);
		});

		// call the function to recalculate the total result, if there is at least one product
		counter && self.calcTotalResult();
	};

	MsOrderCalc.prototype.changeNumber = function () {
		var self = this;

		self.element.on('change spin', self.config.spinner, function (e, ui) {
			var $curSpinner = $(this);

			var curSpinnerVal = ui ? ui.value : +$curSpinner.val();

			self.createObjParams($curSpinner, curSpinnerVal);

			self.calcTotalResult();
		});
	};

	MsOrderCalc.prototype.recalc = function () {
		var self = this;

	};

	MsOrderCalc.prototype.removeItem = function () {
		var self = this;

		console.log('===removeItem===');

		self.element.on('click', self.config.btnRemove, function (e) {

			console.log(1);

			$(this).closest(self.config.row).fadeOut(300, function () {
				$(this).remove();

				self.initialCalc();
			});

			e.preventDefault();
			
		});
	};

	MsOrderCalc.prototype.createObjParams = function (spinner, count) {
		var self = this;

		var $curRow = $(spinner).closest(self.config.row);
		var $curPrice = $curRow.find(self.config.price);
		var priceVal = $curPrice.data('price');
		var priceValSum = Math.round(priceVal * count * 100) / 100;

		// create the object with id's products
		var id = spinner.data('id');
		self.config.objParams[id] = {
			'count': count,
			'price': priceVal,
			'priceSum': priceValSum
		};

		// add callback createdObjParams
		self.element.trigger('createdObjParams.msOrderCalc', self.config.objParams);

		// add count items and sum price to DOM (data-attributes)
		$curPrice.attr('data-count-sum', count);
		$curPrice.attr('data-price-sum', priceValSum);

		// add current item's price sum to DOM
		$curRow.find(self.config.priceSum).html(priceValSum);

		console.log("self.objParams: ", self.config.objParams);
	};

	MsOrderCalc.prototype.calcTotalResult = function () {
		var self = this;

		console.log('===calcTotalResult===');
		// console.log("self.config.objParams: ", self.config.objParams);

		var totalCount = self.sumParam(self.config.objParams, 'count');
		var totalPrice = self.sumParam(self.config.objParams, 'priceSum');

		// add callback getTotalResults
		self.element.trigger('getTotalResults.msOrderCalc', {'totalCount': totalCount, 'totalPrice': totalPrice});

		// add total results to DOM
		self.element.find(self.config.totalCount).text(totalCount);
		self.element.find(self.config.totalPrice).text(totalPrice);

		self.element.find(self.config.totalResult).toggleClass('show', totalCount > 0);
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