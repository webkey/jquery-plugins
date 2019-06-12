/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	var $popup = $('.ms-popup-d__init-js');
	if ($popup.length) {
		$popup.simplePopupDynamic({
			outsideClose: false,
			escapeClose: false
			// , afterOpened: function (e, el) {
			// 	console.log('afterOpened ($popup), el: ', el);
			// },
			// afterClosed: function (e, el) {
			// 	console.log('afterClosed ($popup), el: ', el);
			// }
		})

	}
	var $popupAlt = $('.ms-popup-d__init-alt-js');
	if ($popupAlt.length) {
		$popupAlt.simplePopupDynamic({
			opener: '.ms-popup-d__opener-alt-js',
			popup: '.ms-popup-d__popup-alt-js',
			closeBtn: '.ms-popup-d__close-alt-js'
			// , afterOpened: function (e, el) {
			// 	console.log('afterOpened ($popupAlt), el: ', el);
			// },
			// afterClosed: function (e, el) {
			// 	console.log('afterClosed ($popupAlt), el: ', el);
			// }
		})
	}
	var $popupAlt2 = $('.ms-popup-d__opener-alt2-js');
	if ($popupAlt2.length) {
		$popupAlt2.simplePopupDynamic({
			opener: '.ms-popup-d__opener-alt-js'
			// , afterOpened: function (e, el) {
			// 	console.log('afterOpened ($popupAlt2), el: ', el);
			// },
			// afterClosed: function (e, el) {
			// 	console.log('afterClosed ($popupAlt2), el: ', el);
			// }
		})
	}

	setTimeout(function () {
		// проверка на повторную инициализацию
		$popup.simplePopupDynamic({});


		$('#add-opener').html('<a href="#example-popup" class="ms-popup-d__opener-js"><span>Открыть попап 1</span></a>');
		$('#add-opener2').html('<a href="#example-popup2" class="ms-popup-d__opener-js"><span>Открыть попап 2</span></a>');
		$('#add-opener3').html('<a href="#example-popup3" class="ms-popup-d__opener-alt-js"><span>Открыть попап (Новые классы)</span></a>');
		$('#add-opener4').html('<a href="#example-popup2" class="ms-popup-d__opener-alt-js"><span>Открыть попап 2</span></a>');
	}, 1500)
});