/*! jquery.ms-clap.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function($){
	'use strict';

	var MsClap = function(element, config){
		var self,
			$element = $(element),
			$panel = $(config.panel, $element),
			isAnimated = false,
			pref = 'ms-clap-init__',
			initClasses = {
				element: pref + 'container',
				item: pref + 'item',
				header: pref + 'header',
				hand: pref + 'hand',
				panel: pref + 'panel'
			};

		var dataClpsd = $element.attr('data-clap-collapsed');
		var collapsed = (dataClpsd === "true" || dataClpsd === "false") ? dataClpsd === "true" : config.collapsed;

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msClap.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, open = function (_panel) {

			// console.log('open');
			var callback = arguments[1],
				// $activePanelWrap = _panel.parent(),
				// $activeHeader = $activePanelWrap.prev(config.header),

				$activeHeader = _panel.parentsUntil(element).prev(config.header),
				$activePanelWrap = $activeHeader.next(),
				$activePanel = $activePanelWrap.children(config.panel);

			var panelLength = 0;
			$.each($activePanel, function (index, panel) {
				if (!$(panel).data('active')) {
					++panelLength;
				}
			});

			// Открыть панель
			$.each($activePanel, function (index, panel) {

				var $eachPanel = $(panel);

				// Выборка только закрытых панелей на момент открытия
				var opened = 'active';
				if (!$eachPanel.data(opened)) {
					var $eachPanelWrap = $eachPanel.parent(),
						$eachHeader = $eachPanelWrap.prev(),
						$eachItem = $eachPanel.closest(config.item);

					// Добавить класс на активные элементы
					$eachItem.add(config.addActiveClassTo).addClass(config.modifiers.activeClass);

					if (index === panelLength - 1) {
						// Закрыть соседние панели,
						// если открыты
						if (collapsed) {
							$.each($(config.panel, $eachItem.siblings()), function (index, panel) {
								$(panel).data('active') && closePanel($(panel));
							});
						}

						// Открываем, анимируя высоту, только ТЕКУЩУЮ
						// или первую, если текущая открывается внутри закрытых панелей
						// (например, при открытии по хештегу или через метод)
						// Т.е., если родительская панель закрыта, то анимируется только она,
						// А внутренние панели открываются без анимации (в т.ч. текущая)
						changeHeight($eachPanelWrap, $eachPanel.outerHeight(), function () {
							$eachPanel.css({
								position: 'relative',
								left: 'auto',
								top: 'auto'
							});

							// Указать в data-атрибуте, что панель открыта
							$eachPanel.data('active', true);

							// Вызов события после открытия каждой панели панели
							$element.trigger('msClap.afterEachOpen');

							// Вызов события после открытия текущей панели
							$element.trigger('msClap.afterOpen');

							// Вызов callback функции после открытия панели
							if (typeof callback === "function") {
								callback();
							}
						});
					} else {
						$eachPanel.css({
							position: 'relative',
							left: 'auto',
							top: 'auto'
						});

						// Указать в data-атрибуте, что панель открыта
						$eachPanel.data(opened, true);

						// Вызов события после открытия каждой панели панели
						$element.trigger('msClap.afterEachOpen');
					}
				}

			});

		}, close = function (_panel) {
			var callback = arguments[1];

			// Закрыть панели внутры текущей,
			// если открыты
			var $childrenPanel = $(config.panel, _panel);
			console.log("$childrenPanel: ", $childrenPanel.filter(':visible'));
			closePanel($childrenPanel.filter(':visible'));
			// $.each($childrenPanel, function () {
			// 	var $eachPanel = $(this);
			// 	$eachPanel.data('active') && closePanel($eachPanel);
			// });

			// Закрыть текущую панель
			closePanel(_panel, function () {
				// Вызов callback функции после закрытия панели
				if (typeof callback === "function") {
					callback();
				}
			});

		}, closePanel = function (_panel) {
			// console.log('close');
			if (_panel.data('active')) {
				var callback = arguments[1];

				// Удалить активный класс со всех элементов
				_panel.add(config.addActiveClassTo).removeClass(config.modifiers.activeClass);

				// Закрыть панель
				// Вызов события после закрытия каждой панели
				$element.trigger('msClap.afterEachClose');

				_panel
					.slideUp(config.animationSpeed, function () {
						// Вызов callback функции после закрытия панели
						if (typeof callback === "function") {
							callback();
						}
					})
					.data('active', false);// Указать в data-атрибуте, что панель закрыта
			}
		}, events = function () {
			$element.on(config.event + ' focus', config.hand, function (event) {
				// console.log("isAnimated: ", isAnimated);

				console.log("event: ", event.type);

				// Если панель во время клика находится в процессе анимации, то выполнение функции прекратится
				if (isAnimated) {
					event.preventDefault();
					return false;
				}

				var $currentHand = $(this);

				// Если текущий пункт не содержит панелей, то выполнение функции прекратится
				if (!$currentHand.closest(config.item).has(config.panel).length) {
					return false;
				}

				// Начало анимирования панели
				// Включить флаг анимации
				isAnimated = true;

				event.preventDefault();

				// console.log("Текущая панель открыта?: ", $currentPanel.data('active'));

				var $currentPanel = $currentHand.closest(config.header).next(config.panel);

				if (!$currentPanel.data('active')) {
					// Открыть текущую панель
					open($currentPanel);
				} else {
					// Закрыть текущую панель
					close($currentPanel, function () {
						// callback after current panel close
						$element.trigger('msClap.afterClose');
					});
				}
			});
		}, focusing = function () {
			/**
			 * !Clear focus state after mouse key up
			 */
			// $btn.add($settingsBtn).add($settingsResetBtn).add($scrollToContentBtn).mouseup(function () {
			// 	$(this).blur();
			// })
		}, init = function () {
			// $element.addClass(initClasses.element);
			// $(config.item, $element).addClass(initClasses.item);
			// $(config.header, $element).addClass(initClasses.header);
			// $(config.panel, $element).addClass(initClasses.panel);
			$(config.hand, $element)
				// .addClass(initClasses.hand)
				.attr('tabindex', 0);

			// Найти активные панели и установить дата-атрибуту active заначение true
			$(config.panel, $element).filter(':visible').data('active', true);

			$element.addClass(config.modifiers.init);

			$element.trigger('msClap.afterInit');
		};

		self = {
			callbacks: callbacks,
			open: open,
			close: close,
			events: events,
			init: init
		};

		return self;
	};

	$.fn.msClap = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].msClap = new MsClap(_[i], $.extend(true, {}, $.fn.msClap.defaultOptions, opt));
				_[i].msClap.init();
				_[i].msClap.callbacks();
				_[i].msClap.events();
				// _[i].msClap.onfocus();
			}
			else {
				ret = _[i].msClap[opt].apply(_[i].msClap, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.msClap.defaultOptions = {
		item: '.msClap__item-js',//По сути общий ближайший родитель (Далее Элемент) для переключателя и разворачивающейся панели (Далее Панель)
		header: '.msClap__header-js',//Обертка для переключателя (Далее Шапка)
		hand: '.msClap__hand-js',//Переключатель
		panel: '.msClap__panel-js',//Панель (Да)
		event: 'click',//Событие, которое разворачивает/сворачивает Панель
		animationSpeed: 300,//Скорость анимации Панели
		collapsed: true,//Параметр, указывающий на необходимось сворачивать ранее открытые Панели
		modifiers: {
			init: 'msClap--initialized',//Класс, который добавляется сразу после формирования DOM плагина
			activeClass: 'msClap--active'//Класс, который добавляется, на активный Элемент
		},
		addActiveClassTo: null
		/**
		 * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
		 * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
		 * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
		 * @default {JQ Object} - Элемент
		 */
	};

})(jQuery);