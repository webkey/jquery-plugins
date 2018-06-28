/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	var $tabs = $('.tabs-js');

	if ($tabs.length) {
		$tabs.msTabs({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
		});
	}

	var $cats = $('.cats-js');

	if ($cats.length) {
		$cats.msTabs({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
		});
	}
});