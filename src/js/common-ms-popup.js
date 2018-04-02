/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	// $.fn.simplePopupDynamic.defaultOptions.outsideClose = false;
	// $.fn.simplePopupDynamic.defaultOptions.escapeClose = false;

	var $popupStatic = $('.ms-popup-d__opener--static-js');
	if ($popupStatic.length) {
		$popupStatic.simplePopupDynamic({
			/*options*/
			modifiers: {
				isOpen: 'ms-popup-d--static--active'
			}
			,afterClose: function () {
				console.log('callback: afterClose');
				// $('html').removeClass('afterOpen-001');
			}
			, afterOpen: function () {
				console.log('callback: afterOpen');
				// $('html').addClass('afterOpen-001');
			}
		})
	}
	var $popup = $('.ms-popup-d__init-js');
	if ($popup.length) {
		$popup.simplePopupDynamic({
			opener: '.ms-popup-d__opener-js'
			// dataClickOutside: false,
			// dataClickEsc: false
			// , afterOpen: function (e, el) {
			// 	console.log('afterOpen ($popup), el: ', el);
			// }
			, afterClose: function (e, el) {
				console.log('callback: afterClose');
				// $('html').removeClass('afterOpen-002');
			}
			, afterOpen: function () {
				console.log('callback: afterOpen');
				// $('html').addClass('afterOpen-002');
			}
			// , afterInit: function (e, el) {
			// 	console.log('afterInit, e: ', e);
			// 	console.log('afterInit, el: ', el);
			// }
		})
	}
	var $popupAlt = $('.ms-popup-d__init-alt-js');
	if ($popupAlt.length) {
		$popupAlt.simplePopupDynamic({
			dataClickOutside: false,
			dataClickEsc: false,

			opener: '.ms-popup-d__opener-alt-js',
			popup: '.ms-popup-d__popup-alt-js',
			closeBtn: '.ms-popup-d__close-alt-js',
			modifiers: {
				isOpen: 'ms-popup-d--active'
			}
			, afterClose: function (e, el) {
				console.log('callback: afterClose');
			}
			, afterOpen: function () {
				console.log('callback: afterOpen');
			}
		})
	}
	var $popupAlt2 = $('.ms-popup-d__init-alt2-js');
	if ($popupAlt2.length) {
		$popupAlt2.simplePopupDynamic({
			opener: '.ms-popup-d__opener-alt2-js'
			, afterClose: function (e, el) {
				console.log('callback: afterClose');
			}
			, afterOpen: function () {
				console.log('callback: afterOpen');
			}
		})
	}

	setTimeout(function () {
		// проверка на повторную инициализацию
		$popup.simplePopupDynamic({});

		$('#add-opener').html('<a href="#example-popup1" class="ms-popup-d__opener-js"><span>Открыть попап 1</span></a>');
		$('#add-opener2').html('<a href="#example-popup2" class="ms-popup-d__opener-js"><span>Открыть попап 2</span></a>');
		$('#add-opener3').html('<a href="#example-popup3" class="ms-popup-d__opener-alt-js"><span>Открыть попап 3 (Новые классы)</span></a>');
		$('#add-opener4').html('<a href="#example-popup1" class="ms-popup-d__opener-alt2-js"><span>Открыть попап 1 (Но кнопка открытия инициализируется с недефолтным классом)</span></a>');
	}, 1500);

});