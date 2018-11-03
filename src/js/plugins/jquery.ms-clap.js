/**
 * !Detected touchscreen devices
 * */
var TOUCH = Modernizr.touchevents,
	DESKTOP = !TOUCH;

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
			$html = $('html'),
			$panel = $(config.panel, $element),
			isAnimated = false,
			focusElements = 'input, a, [tabindex], area, select, textarea, button, [contentEditable=true]' + config.hand;

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
			},
			tabindexOn = function (_element) {
				// Все элементы _element поставить в фокус-очередь
				_element.attr('tabindex', '0');
			},
			tabindexOff = function (_element) {
				// Все элементы _element убрать с фокус-очереди
				_element.attr('tabindex', '-1');
			},
			open = function (_panel) {
				if (!_panel.length) {
					return;
				}
				// console.log('open');
				$element.trigger('msClap.beforeOpen');// Вызов события перед открытием текущей панели

				if (config.accessibility) {
					// Все элементы с фокусировкой поставить в фокус-очередь
					tabindexOn($(focusElements, _panel));

					// В неактивных Панелях все элементы с фокусировкой убрать с фокус-очереди
					tabindexOff($(focusElements, _panel.find(config.panel).filter(function () {
						return $(this).data('active');
					})));
				}

				// Добавить класс на активные элементы
				_panel.closest(config.item).addClass(config.modifiers.activeClass);

				var callback = arguments[1];
				// Открыть панель
				_panel
					// Открывать родительские Панели необходимо, если, например, открывается вложенная Панель методом "open"
					// Все закрытые родительские Панели открыть без анимации
					.parentsUntil($element, config.panel + ':hidden').show()
					// Указать в data-атрибуте, что родительская Панель открыта
					.data('active', true).attr('data-active', true).end()
					// Добавить активный класс на родительские Елементы
					.parentsUntil($element, config.item).addClass(config.modifiers.activeClass).end()
					.slideDown(config.animationSpeed, function () {
						$(this).data('active', true).attr('data-active', true);// Указать в data-атрибуте, что Панель открыта

						$element.trigger('msClap.afterOpen');// Вызов события после открытия текущей панели

						// Вызов callback функции после открытия панели
						if (typeof callback === "function") {
							callback();
						}
					});

				if (collapsed) {
					// Проверить у соседей всех родительских Элементов наличие активных Панелей
					// Закрыть эти Панели
					var $siblingsPanel = _panel.parentsUntil($element, config.item).siblings().find(config.panel).filter(function () {
						return $(this).data('active');
					});
					close($siblingsPanel, function () {
						isAnimated = false;// Анимация завершена
					});
				}
			},
			close = function (_panel) {
				if (!_panel.length) {
					return;
				}
				// Закрыть отдельно все вложенные активные панели
				// И отдельно текущую панель
				// Это сделано с целью определения события закрытия текущей панели отдельно

				// Все элементы с фокусировкой убрать с фокус-очереди
				if (config.accessibility) {
					tabindexOff($(focusElements, _panel));
				}

				if (collapsed) {
					// Закрыть активные панели внутри текущей
					// var blah = ;
					var $childrenOpenedPanel = $(config.panel, _panel).filter(function () {
						return $(this).data('active');
					});
					// console.log("$childrenOpenedPanel: ", $childrenOpenedPanel);
					closePanel($childrenOpenedPanel);
				}

				// Закрыть текущую панель
				$element.trigger('msClap.beforeClose');// Вызов события перед закрытием текущей панели
				var callback = arguments[1];
				closePanel(_panel, function () {
					$element.trigger('msClap.afterClose');// Вызов события после закрытия текущей панели

					// Вызов callback функции после закрытия панели
					if (typeof callback === "function") {
						callback();
					}
				});
			},
			closePanel = function (_panel) {
				// if (!_panel.data('active')) return;//Не выполнять для неактивных панелей
				// console.log('close');
				var callback = arguments[1];

				// Удалить активный класс со всех элементов
				_panel.closest(config.item).removeClass(config.modifiers.activeClass);

				// Закрыть панель
				_panel
					.slideUp(config.animationSpeed, function () {
						$(this).data('active', false).attr('data-active', false);// Указать в data-атрибуте, что панель закрыта

						$element.trigger('msClap.afterEachClose');// Вызов события после закрытия каждой панели

						// Вызов callback функции после закрытия панели
						if (typeof callback === "function") {
							callback();
						}
					});
			},
			events = function () {
				// $element.on(config.event + ' focus', config.hand, function (event) {
				$(config.hand).on(config.event, function (event) {
					// console.log("isAnimated: ", isAnimated);

					// console.log("event: ", event.type);

					// Если панель во время клика находится в процессе анимации, то выполнение функции прекратится
					// Переход по ссылке не произойдет
					// console.log("isAnimated: ", isAnimated);
					if (isAnimated) {
						event.preventDefault();
						return false;
					}

					// Если текущий пункт не содержит панелей, то выполнение функции прекратится
					// Произойдет переход по сылки
					var $currentHand = $(this);
					if (!$currentHand.closest(config.item).has(config.panel).length) {
						return false;
					}

					// Начало анимирования панели
					// Включить флаг анимации
					isAnimated = true;

					event.preventDefault();

					// console.log("Текущая панель открыта?: ", $currentPanel.data('active'));

					var $currentPanel = $currentHand.closest(config.header).next(config.panel);

					if ($currentPanel.data('active')) {
						// Закрыть текущую панель
						close($currentPanel, function () {
							isAnimated = false;// Анимация завершина
						});
					} else {
						// Открыть текущую панель
						open($currentPanel, function () {
							isAnimated = false;// Анимация завершина
						});
					}
				});
			},
			focusing = function () {
				/**
				 * !Clear focus state after mouse key up
				 */
				// $btn.add($settingsBtn).add($settingsResetBtn).add($scrollToContentBtn).mouseup(function () {
				// 	$(this).blur();
				// })
			},
			hover = function () {
				if (!config.customHover.turnOn) {
					return;
				}
				var timeoutPropName = 'hoverTimeout',
					intentPropName = 'hoverIntent';

				var removeHover = function (_element) {
					_element.removeClass(config.customHover.modifiers.current);
					_element.prev().removeClass(config.customHover.modifiers.prev);
					_element.next().removeClass(config.customHover.modifiers.next);
				};

				var addHover = function (_element) {
					_element.addClass(config.customHover.modifiers.current);
					_element.prev().addClass(config.customHover.modifiers.prev);
					_element.next().addClass(config.customHover.modifiers.next);
				};

				$element.on('mouseenter', config.customHover.element, function () {
					var $this = $(this);

					console.log("$this (mouseenter): ", $this);

					// Если курсор входит в область елемента (а не в любую другую),
					// то с соседних элементов модификаторы удалять без задержки,
					removeHover($this.siblings(config.item));

					if ($this.prop(timeoutPropName)) {
						$this.prop(timeoutPropName, clearTimeout($this.prop(timeoutPropName)));
					}

					$this.prop(intentPropName, setTimeout(function () {
						addHover($this);
					}, config.customHover.timeoutAdd));
				});
				// 	.on('mouseleave', config.customHover.element, function () {
				// 	var $this = $(this);
				//
				// 	console.log("$this (mouseleave): ", $this);
				//
				// 	if ($this.prop(intentPropName)) {
				// 		$this.prop(intentPropName, clearTimeout($this.prop(intentPropName)));
				// 	}
				//
				// 	$this.prop(timeoutPropName, setTimeout(function () {
				// 		removeHover($this);
				// 	}, config.customHover.timeoutRemove));
				// });

				// $element.on('click', config.customHover.element, function (event) {
				$element.on('click', config.customHover.element, function (event) {
					// var $this = $(this).closest(config.customHover.element);
					var $this = $(this);

					console.log("$this (click): ", $this);

					if (!$this.closest(config.item).has(config.panel).length) {
						return;
					}

					event.stopPropagation();

					if ($this.prop(timeoutPropName)) {
						$this.prop(timeoutPropName, clearTimeout($this.prop(timeoutPropName)));
					}

					if ($this.prop(intentPropName)) {
						$this.prop(intentPropName, clearTimeout($this.prop(intentPropName)));
					}

					if (!$this.hasClass(config.customHover.modifiers.current)){
						event.preventDefault();

						// var $siblings = $this.parentsUntil($element, config.item).siblings().find(config.customHover.element);
						var $siblings = $this.siblings();
						console.log("$siblings: ", $siblings);

						addHover($this);
					}
				})
			},
			enterClick = function () {
				if (config.accessibility) {
					$html.keyup(function (event) {
						if (event.keyCode === 13) {
							$(config.hand).filter(':focus').trigger('click');
						}
					});
				}
			},
			init = function () {
				var $activePanel = $panel.filter(':visible');
				// На активные панели установить дата-атрибуту active сo заначением true
				$activePanel.addClass(config.modifiers.activeClass).data('active', true).attr('data-active', true);
				// На элементы содержащие активные панели добавить активный класс
				$activePanel.closest(config.item).addClass(config.modifiers.activeClass);

				if (config.accessibility) {
					// Переключатель поставить в фокус-очередь
					tabindexOn($(config.hand, $element));
					// Все элементы с фокусировкой убрать с фокус-очереди
					tabindexOff($(focusElements, $panel));
					// Все элементы с фокусировкой внутри активных элементов поставить в фокус-очередь
					tabindexOn($(focusElements, $activePanel));
				}

				$element.addClass(config.modifiers.init);

				$element.trigger('msClap.afterInit');
			};

		self = {
			callbacks: callbacks,
			open: open,
			close: close,
			events: events,
			hover: hover,
			enterClick: enterClick,
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
				_[i].msClap.hover();
				_[i].msClap.enterClick();
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
		item: '.msClap__item-js',// По сути общий ближайший родитель (Далее Элемент) для переключателя и разворачивающейся панели (Далее Панель)
		header: '.msClap__header-js',// Обертка для переключателя (Далее Шапка)
		hand: '.msClap__hand-js',// Переключатель
		panel: '.msClap__panel-js',// Панель
		event: 'click',// Событие, которое разворачивает/сворачивает Панель
		animationSpeed: 300,// Скорость анимации Панели
		collapsed: true,// Параметр, указывающий на необходимось сворачивать ранее открытые Панели
		accessibility: false,// Enables tabbing and arrow key navigation
		modifiers: {
			init: 'msClap_initialized',// Класс, который добавляется сразу после формирования DOM плагина
			activeClass: 'is-open'// Класс, который добавляется, на активный Элемент
		},
		customHover: {
			turnOn: false,// Добавлять кастомный ховер?
			element: '.msClap__item-js',// Элемент на который будет добавлятся модификатор
			timeoutAdd: 50,// Задержке пред добавлением модификатора
			timeoutRemove: 50,// Задержке пред удалением модификатора
			modifiers: {
				current: 'hover',
				next: 'hover-next',
				prev: 'hover-prev'
			}
		}
		/**
		 * @description - Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
		 * @example {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
		 * @example {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
		 * @default {JQ Object} - Элемент
		 */
	};

})(jQuery);