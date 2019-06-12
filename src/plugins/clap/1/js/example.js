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
			}
			//Добавлять кастомний ховер
			, customHover: true
			, customHoverSetting: {
				element: 'li',
				timeoutAdd: 70,
				timeoutRemove: 150,
				// siblingsRemoveImmediately: false,
				// modifiers: {
				// 	current: 'hover',
				// 	next: 'hover-next',
				// 	prev: 'hover-prev'
				// }
			}
			, afterAddHover: function () {
				// console.log('.afterAddHover');
			}
			, afterRemoveHover: function () {
				// console.log('.afterRemoveHover');
			}
			// Выравнивать подменю
			, align: true
			, alignSetting: {
				// wrapper: $clap_1_1
			}
		});

		// Тестирование метода "open"
		// Первый параметр: название метода
		// Второй параметр: селектор
		// Трений параметр: callback-функция
		$('.open-panel-js').on('click', function (event) {

			var id = $(this).attr('data-id') || $(this).attr('href');
			myClap.msClap('open', $(id), function () {
				console.log('Открылась панел ' + id);
			});

			event.preventDefault();
			event.stopPropagation();
		});

		// Тестирование метода "hover"
		// myClap.msClap('hover', $('#hashTest').parentsUntil($clap_1_1, 'li'));
	}

	var $clap_1_2 = $('.clap-js');

	if ($clap_1_2.length) {
		var clapSimple = $clap_1_2.msClap({
			// collapsed: true
			// , modifiers: {
			// 	activeClass: 'tab-poookkhh'
			// }
			item: '.clap__item-js',//По сути общий ближайший родитель (Далее Элемент) для переключателя и разворачивающейся панели (Далее Панель)
			header: '.clap__header-js',//Обертка для переключателя (Далее Шапка)
			hand: '.clap__hand-js',//Переключатель
			panel: '.clap__panel-js',//Панель (Да)
			// event: 'click',//Событие, которое разворачивает/сворачивает Панель
			animationSpeed: 250,//Скорость анимации Панели
			// collapsed: false,//Параметр, указывающий на необходимось сворачивать ранее открытые Панели
			accessibility: true,//Enables tabbing and arrow key navigation
			modifiers: {
				// init: 'clap--initialized',//Класс, который добавляется сразу после формирования DOM плагина
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
			}
			//Добавлять кастомний ховер
			, customHover: true
			, customHoverSetting: {
				element: 'li',
				timeoutAdd: 330,
				timeoutRemove: 330
			}, afterAddHover: function () {
				// console.log('.afterAddHover');
			}, afterRemoveHover: function () {
				// console.log('.afterRemoveHover');
			}
			// Выравнивать подменю
			, align: false
			, alignSetting: {

			}
		});

		// Тестирование метода "open"
		// Первый параметр: название метода
		// Второй параметр: селектор
		// Трений параметр: callback-функция
		$('.open-panel-js').on('click', function () {
			var id = $(this).attr('data-id') || $(this).attr('href');
			clapSimple.msClap('open', $(id), function () {
				console.log('Открылась панел ' + id);
			});
		});
	}
});