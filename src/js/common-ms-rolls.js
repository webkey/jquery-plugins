/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	var $rolls_1_1 = $('.rolls-js');

	if ($rolls_1_1.length) {
		$rolls_1_1.msRolls({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
			animationSpeed: 250
			, modifiers: {
				activeClass: 'is-open'
			}
			// , afterEachClose: function () {
			// 	console.log('.afterEachClose');
			// }
			, afterClose: function () {
				console.log('.afterClose');
			}
			, afterOpen: function () {
				console.log('.afterOpen');
			}
		});
	}
});