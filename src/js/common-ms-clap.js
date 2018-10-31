/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	// Тест переопределения настроек глобально
	// $.fn.msClap.defaultOptions.collapsed = false;

	var $clap_1_1 = $('.clapNav-js');

	if ($clap_1_1.length) {
		var myClap = $clap_1_1.msClap({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
			item: 'li',//По сути общий ближайший родитель (Далее Элемент) для переключателя и разворачивающейся панели (Далее Панель)
			header: '.clapNav__header-js',//Обертка для переключателя (Далее Шапка)
			hand: '.clapNav__hand-js',//Переключатель
			panel: '.clapNav__panel-js',//Панель (Да)
			// event: 'click',//Событие, которое разворачивает/сворачивает Панель
			animationSpeed: 250,//Скорость анимации Панели
			// collapsed: true,//Параметр, указывающий на необходимось сворачивать ранее открытые Панели
			modifiers: {
				// init: 'clapNav--initialized',//Класс, который добавляется сразу после формирования DOM плагина
				activeClass: 'is-open'//Класс, который добавляется, на активный Элемент
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