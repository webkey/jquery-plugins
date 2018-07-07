/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	// Тест переопределения настроек глобально
	// $.fn.msRolls.defaultOptions.collapsed = false;

	var $rolls_1_1 = $('.rolls-js');

	if ($rolls_1_1.length) {
		var myRolls = $rolls_1_1.msRolls({
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
				// myRolls.msRolls('toggleClass', [$('html')], false);
			}
			, afterOpen: function () {
				console.log('.afterOpen');

				// Добавить класс на элементы
				// myRolls.msRolls('toggleClass', [$('html')]);
			}
		});

		// Тестирование метода "open"
		// Первый параметр: название метода
		// Второй параметр: селектор
		// Трений параметр: callback-функция
		$('.open-panel-js').on('click', function () {
			myRolls.msRolls('open', $('#hashExpl'), function () {
				// console.log('Показать после открытия панели!');
			});
		});
	}
});