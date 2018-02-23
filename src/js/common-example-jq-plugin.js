/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.example-js-plugin').exampleJqPluginName({
		created: function (e, el, param) {
			console.log('jQuery Plugin Created !!!');
		}
	}).css('background-color', 'coral').css('background-color', 'lightblue');

	$('.example-js-plugin2').exampleJqPluginName({
		created: function (e, el, param) {
			console.log('jQuery Plugin Created !!!');
		}
	}).css('background-color', 'coral').css('background-color', 'yellow');
});