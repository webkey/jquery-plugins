/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.ms-shutter__opener-js').msShutter({
		afterInit: function () {
			console.log('After Init msShutter !!!');
		}
	}).css('border-bottom', '4px solid coral');
});