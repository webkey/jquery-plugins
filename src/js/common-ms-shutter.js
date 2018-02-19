/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.ms-shutter__opener-js').msShutter({
		created: function (e, el, param) {
			console.log('msShutter Plugin Created !!!');
		}
	}).css('border-bottom', '4px solid coral');
});