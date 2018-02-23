/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	var $popupOpener = $('.btn-qr-code-js');
	if ($popupOpener.length) {
		$popupOpener.SimplePopup({
			popup: '.popup-default-js',
			closeBtn: '.popup-default__close-js',
			afterClose: function (e, el, popup) {
				console.log('afterClose, el: ', el);
				console.log('afterClose, popup: ', popup);
			}
		})
	}
});