/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	var $popup = $('.ms-popup-d__init-js');
	if ($popup.length) {
		$popup.simplePopupDinamic({
			afterOpened: function (e, el) {
				console.log('afterOpened, el: ', el);
			},
			afterClosed: function (e, el) {
				console.log('afterClosed, el: ', el);
			}
		})

	}
	var $popupAlt = $('.ms-popup-d__init-alt-js');
	if ($popupAlt.length) {
		$popupAlt.simplePopupDinamic({
			opener: '.ms-popup-d__opener-alt-js',
			popup: '.ms-popup-d__popup-alt-js',
			closeBtn: '.ms-popup-d__close-alt-js',
			afterOpened: function (e, el) {
				console.log('afterOpened, el: ', el);
			},
			afterClosed: function (e, el) {
				console.log('afterClosed, el: ', el);
			}
		})

	}

	setTimeout(function () {
		$('#add-opener').html('<a href="#example-popup" class="ms-popup-d__opener-js"><span>Открыть попап 1</span></a>');
		$('#add-opener2').html('<a href="#example-popup2" class="ms-popup-d__opener-js"><span>Открыть попап 2</span></a>');
		$('#add-opener3').html('<a href="#example-popup3" class="ms-popup-d__opener-alt-js"><span>Открыть попап (Новые классы)</span></a>');
	}, 1500)
});