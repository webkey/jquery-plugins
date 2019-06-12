/**
 * Пример подключения jq плагина с настройками
 */

$(function () {

  /** ! инициализация спиннера */
  initSpinner($('.spinner-js'));

  function initSpinner(element) {
    element.spinner({
      min: 0
    });
  }

  /** ! only number input */
  // link: https://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
  $("[data-only-number]").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || // Allow: Ctrl+A, Command+A
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });

  /** ========================== */
  /** ========================== */

  /** !инициализация плагина */

  var orderCalcOptions = {
    row: '.c-tr'
    //, objParams: {
    // 	'P209101_155_44': {
    // 		'count': 1,
    // 		'price': 200,
    // 		'priceSum': 200
    // 	},
    // 	'P209102_170_48': {
    // 		'count': 5,
    // 		'price': 200,
    // 		'priceSum': 1000
    // 	}
    // }

    //, created: function (e, el, param) {
    // 	console.log("e: ", e);
    // 	console.log("el: ", el);
    // }
    , getTotalResults: function (e, el, results) {
      // console.log("results: ", results);
      // console.log("getTotalResults ");
      $(el).find('.order-calc__total-results-js').toggleClass('show', results.totalCount > 0);
      $(el).find('.order-calc-btn').prop('disabled', !results.totalCount > 0);
    }
    // , createdObjParams: function (e, el, obj) {
    // 	console.log("obj: ", obj);
    // }
    , showedWarningRemoveItem: function (e, el) {
      // console.log("showedWarningRemoveItem");
      $(el).find('.order-calc-btn').prop('disabled', true);
    }
    , canceledRemoveItem: function (e, el) {
      // console.log("canceledRemoveItem ");
      $(el).find('.order-calc-btn').prop('disabled', false);
    }
    // , removedItem: function () {
    // 	console.log("removedItem ");
    // }
    // , removedAllItems: function () {
    // 	console.log("callback: removedAllItems");
    // }
  };

  $('.order-calc-js').msOrderCalc(orderCalcOptions)
      .css('box-shadow', '0 5px 0 lightgreen'); // для проверки jquery цепочки


  /** ! добавить таблицу динамически */
  $(document).ready(function () {
    setTimeout(function () {
      $.ajax({
        url: "ajax-temp.html",
        cache: false,
        dataType: 'html',
        success: function (html) {
          $("#orderCalcCreate").append(html);
          initSpinner($('.spinner-js'));

          $("#orderCalcCreate").find('.order-calc-js').msOrderCalc(orderCalcOptions)
              .css('box-shadow', '0 5px 0 lightblue'); // для проверки jquery цепочки
        }
      });
    }, 1000)
  });

  $('.order-calc-js--alt').msOrderCalc({
    row: '.c-tr'
    , getTotalResults: function (e, el, results) {
      // console.log("results: ", results);
      // console.log("getTotalResults ");
      $(el).find('.order-calc__total-results-js').toggleClass('show', results.totalCount > 0);
      $(el).find('.order-calc-btn').prop('disabled', !results.totalCount > 0);
    }
    , showedWarningRemoveItem: function (e, el) {
      // console.log("showedWarningRemoveItem");
      $(el).find('.order-calc-btn').prop('disabled', true);
    }
    , canceledRemoveItem: function (e, el) {
      // console.log("canceledRemoveItem ");
      $(el).find('.order-calc-btn').prop('disabled', false);
    }
    // , removedItem: function () {
    // 	console.log("removedItem ");
    // }
    // , removedAllItems: function () {
    // 	console.log("callback: removedAllItems");
    // }
  })
      .css('box-shadow', '0 5px 0 lightcoral'); // для проверки jquery цепочки
});