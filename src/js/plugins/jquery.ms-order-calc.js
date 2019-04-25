/*! jquery.ms-order-calc
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Calculation of quantity and price of goods
 */

;(function ($) {
  var defaults = {
    spinner: '.order-calc__number-js',
    price: '.order-calc__price-js',
    priceSum: '.order-calc__price-sum-js',
    btnRemove: '.order-calc__remove-js',
    row: 'tr',
    totalResult: '.order-calc__total-results-js',
    totalCount: '.order-calc__counts-total-js',
    totalPrice: '.order-calc__price-total-js',
    warningRemove: false,
    warningRemoveDelay: 3000,
    objParams: {},
    tplRemoveItem: '<div><div><span>Товар удален</span> <a class="order-calc__cancel-js">Отмена</a></div></div>',

    classes: {
      init: 'ms-order-calc--initialized',
      hasNotItems: 'order-calc__hasnt-items'
    }
  };

  function MsOrderCalc(element, options) {
    var self = this;

    self.config = $.extend(true, {}, defaults, options);

    self.element = element;

    self.callbacks();

    self.calcAll();
    self.changeNumber();

    self.removeTimeout = 0;
    if (!self.config.warningRemove) {
      self.immediateRemoveItem();
    } else {
      self.showWarningRemoveItem();
      self.cancelRemoveItem();
    }

    self.init(); // create DOM structure of the plugins
  }

  /** track events */
  MsOrderCalc.prototype.callbacks = function () {
    var self = this;
    $.each(self.config, function (key, value) {
      if (typeof value === 'function') {
        self.element.on(key + '.msOrderCalc', function (e, param) {
          return value(e, self.element, param);
        });
      }
    });
  };

  MsOrderCalc.prototype.calcAll = function () {
    // console.log('===calcAll===');
    var self = this, counter = 0;

    var $spinner = self.element.find(self.config.spinner);
    $.each($spinner, function () {
      var $curSpinner = $(this);
      var curSpinnerVal = +$curSpinner.val();
      if (!curSpinnerVal) {
        return;
      }
      counter++;

      self.createObjParams($curSpinner, curSpinnerVal);
    });

    // call the function to recalculate the total result, if there is at least one item
    // counter && self.calcTotalResult();
    self.calcTotalResult();
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

  MsOrderCalc.prototype.immediateRemoveItem = function () {
    var self = this;

    self.element.on('click', self.config.btnRemove, function (e) {

      var $curRow = $(this).closest(self.config.row);
      var id = $curRow.find(self.config.spinner).data('id');

      // remove current item from object
      delete self.config.objParams[id];

      self.calcTotalResult();

      self.removeItem($curRow);

      e.preventDefault();

    });
  };

  MsOrderCalc.prototype.showWarningRemoveItem = function () {
    var self = this;

    self.element.on('click', self.config.btnRemove, function (e) {

      var $curRow = $(this).closest(self.config.row);
      var $curCells = $curRow.children();
      var id = $curRow.find(self.config.spinner).data('id');

      // remove item with class ".order-calc__remove-row-js"
      self.removeItem(self.element.find('.order-calc__remove-row-js'));

      $curRow.addClass('order-calc__remove-row-js');
      $curCells.addClass('order-calc__remove-cell-js');
      $curRow.append($(self.config.tplRemoveItem).clone().addClass('order-calc__remove-warning-js'));

      // remove current item from object
      delete self.config.objParams[id];

      self.calcTotalResult();

      // add callback showedWarningRemoveItem (after calcTotalResult)
      self.element.trigger('showedWarningRemoveItem.msOrderCalc');

      clearTimeout(self.removeTimeout);

      self.removeTimeout = setTimeout(function () {
        self.removeItem($curRow);
      }, self.config.warningRemoveDelay);

      e.preventDefault();

    });
  };

  MsOrderCalc.prototype.cancelRemoveItem = function () {
    var self = this;

    self.element.on('click', '.order-calc__cancel-js', function (e) {

      // clear removeTimeout
      clearInterval(self.removeTimeout);

      var $curRow = $(this).closest(self.config.row);
      var $curCells = $curRow.children();

      $curRow.removeClass('order-calc__remove-row-js');
      $curCells.removeClass('order-calc__remove-cell-js');
      $curRow.find('.order-calc__remove-warning-js').remove();

      // add callback canceledRemoveItem (before calcAll)
      self.element.trigger('canceledRemoveItem.msOrderCalc');

      self.calcAll();

      e.preventDefault();
    });
  };

  MsOrderCalc.prototype.removeItem = function (row) {
    // console.log('===removeItem===');
    var self = this;

    var id = row.find(self.config.spinner).data('id');
    var curElement = row.closest(self.element);
    row.remove();

    // remove current item from object
    delete self.config.objParams[id];

    self.calcAll();

    // add callback removedItem
    self.element.trigger('removedItem.msOrderCalc');

    // count number of items
    var rowsLengths = curElement.find(self.config.price).length;
    if (!rowsLengths) {
      // add callback removedAllItem
      self.element.trigger('removedAllItems.msOrderCalc');

      curElement.addClass(self.config.classes.hasNotItems);
    }
  };

  MsOrderCalc.prototype.createObjParams = function (spinner, count) {
    var self = this;

    var $curRow = $(spinner).closest(self.config.row);
    var $curPrice = $curRow.find(self.config.price);
    var priceVal = $curPrice.data('price');
    var priceValSum = Math.round(priceVal * count * 100) / 100;

    // create the object with id's item
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
  };

  MsOrderCalc.prototype.calcTotalResult = function () {
    // console.log('===calcTotalResult===');
    var self = this;

    var totalCount = self.sumParam(self.config.objParams, 'count');
    var totalPrice = self.sumParam(self.config.objParams, 'priceSum');

    // add callback getTotalResults
    self.element.trigger('getTotalResults.msOrderCalc', {'totalCount': totalCount, 'totalPrice': totalPrice});

    // add total results to DOM
    self.element.find(self.config.totalCount).text(totalCount);
    self.element.find(self.config.totalPrice).text(totalPrice);
  };

  MsOrderCalc.prototype.sumParam = function (obj, param) {

    var result = 0;
    var prop;

    for (prop in obj) {
      result += obj[prop][param];
    }

    return Math.round(result * 100) / 100;

  };

  MsOrderCalc.prototype.init = function () {

    this.element.addClass(this.config.classes.init);

    this.element.trigger('created.msOrderCalc');

  };

  $.fn.msOrderCalc = function (options) {
    'use strict';

    return this.each(function () {
      new MsOrderCalc($(this), options);
    });

  };
})(jQuery);