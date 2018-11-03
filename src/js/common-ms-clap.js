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
			// collapsed: false,//Параметр, указывающий на необходимось сворачивать ранее открытые Панели
			accessibility: true,//Enables tabbing and arrow key navigation
			modifiers: {
				// init: 'clapNav--initialized',//Класс, который добавляется сразу после формирования DOM плагина
				activeClass: 'is-open'//Класс, который добавляется, на активный Элемент
			}
			, afterEachClose: function () {
				// console.log('.afterEachClose');
			}
			, beforeClose: function () {
				// console.log('.beforeClose');
			}
			, afterClose: function () {
				// console.log('.afterClose');

				// Удалить класс с элементов
				// myClap.msClap('toggleClass', [$('html')], false);
			}
			, beforeOpen: function () {
				// console.log('.beforeOpen');
			}
			, afterOpen: function () {
				// console.log('.afterOpen');

				// Добавить класс на элементы
				// myClap.msClap('toggleClass', [$('html')]);
			},
			//Добавлять кастомний ховер
			customHover: {
				turnOn: true,
				element: 'li',
				timeoutAdd: 1000,
				timeoutRemove: 1000
				// modifiers: {
				// 	current: 'hover',
				// 	next: 'hover-next',
				// 	prev: 'hover-prev'
				// }
			}
		});

		// Тестирование метода "open"
		// Первый параметр: название метода
		// Второй параметр: селектор
		// Трений параметр: callback-функция
		$('.open-panel-js').on('click', function () {
			var id = $(this).attr('data-id') || $(this).attr('href');
			myClap.msClap('open', $(id), function () {
				console.log('Открылась панел ' + id);
			});
		});
	}
});