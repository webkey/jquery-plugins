/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	// Тест переопределения настроек глобально
	// $.fn.msClap.defaultOptions.collapsed = false;

	var $clap_1_1 = $('.clap-js');

	if ($clap_1_1.length) {
		var myClap = $clap_1_1.msClap({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
			animationSpeed: 250
			// , event: 'mouseenter'
			// , collapsed: false
			, modifiers: {
				activeClass: 'is-open'
			}
			, afterEachClose: function () {
				console.log('.afterEachClose');
			}
			, afterEachOpen: function () {
				console.log('.afterEachOpen');
			}
			, afterClose: function () {
				console.log('.afterClose');

				// Удалить класс с элементов
				// myClap.msClap('toggleClass', [$('html')], false);
			}
			, afterOpen: function () {
				console.log('.afterOpen');

				// Добавить класс на элементы
				// myClap.msClap('toggleClass', [$('html')]);
			}
		});

		// Тестирование метода "open"
		// Первый параметр: название метода
		// Второй параметр: селектор
		// Трений параметр: callback-функция
		$('.open-panel-js').on('click', function () {
			myClap.msClap('open', $('#hashExpl'), function () {
				// console.log('Показать после открытия панели!');
			});
		});
	}
});