/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	/** ! инициализация спиннера */
	$('.spinner-js').spinner({
		min: 0
	});

	/** ! only number input */
	// link: https://stackoverflow.com/questions/995183/how-to-allow-only-numeric-0-9-in-html-inputbox-using-jquery
	$("[data-only-number]").keydown(function (e) {
		// Allow: backspace, delete, tab, escape, enter and .
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
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

	$('.order-calc-js').msOrderCalc({
		row: '.c-tr',
		objParam: {
			'P209101_155_44': {
				'count': 1,
				'price': 200,
				'priceSum': 200
			},
			'P209102_170_48': {
				'count': 5,
				'price': 200,
				'priceSum': 1000
			}
		}

		// created: function (e, el, param) {
		// 	console.log("e: ", e);
		// 	console.log("el: ", el);
		// }
	})
		.css('border', '4px solid coral'); // для проверки jquery цепочки
});