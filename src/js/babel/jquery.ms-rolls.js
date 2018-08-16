'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! jquery.ms-tabs.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function ($) {
	'use strict';

	var MsRolls = function MsRolls(element, config) {
		var self,
		    $element = $(element),
		    $panel = $(config.panel, $element),
		    isAnimated = false,

		// activeId,
		pref = 'ms-rolls__',
		    initClasses = {
			element: pref + 'container',
			item: pref + 'item',
			header: pref + 'header',
			hand: pref + 'hand',
			panelWrap: pref + 'panel-wrap',
			panel: pref + 'panel'
		};

		var dataClpsd = $element.attr('data-rolls-collapsed');
		var collapsed = dataClpsd === "true" || dataClpsd === "false" ? dataClpsd === "true" : config.collapsed;

		var callbacks = function callbacks() {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msRolls.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		},
		    open = function open(_panel) {

			// console.log('open');
			var callback = arguments[1],

			// $activePanelWrap = _panel.parent(),
			// $activeHeader = $activePanelWrap.prev(config.header),

			$activeHeader = _panel.parentsUntil(element).prev(config.header),
			    $activePanelWrap = $activeHeader.next(),
			    $activePanel = $activePanelWrap.children(config.panel);

			var panelLength = 0;
			$.each($activePanel, function (index, panel) {
				if (!$(panel).data('opened')) {
					++panelLength;
				}
			});

			// Открыть панель
			$.each($activePanel, function (index, panel) {

				var $eachPanel = $(panel);

				// Выборка только закрытых панелей на момент открытия
				var opened = 'opened';
				if (!$eachPanel.data(opened)) {
					var $eachPanelWrap = $eachPanel.parent(),
					    $eachHeader = $eachPanelWrap.prev(),
					    $eachItem = $eachPanel.closest(config.item);

					// Добавить класс на активные элементы
					toggleClass([$eachItem, $eachHeader, $(config.hand, $eachHeader), $eachPanel], true);

					if (index === panelLength - 1) {
						// Закрыть соседние панели,
						// если открыты
						if (collapsed) {
							$.each($(config.panel, $eachItem.siblings()), function (index, panel) {
								$(panel).data('opened') && closePanel($(panel));
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
							$eachPanel.data('opened', true);

							// Вызов события после открытия каждой панели панели
							$element.trigger('msRolls.afterEachOpen');

							// Вызов события после открытия текущей панели
							$element.trigger('msRolls.afterOpen');

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
						$element.trigger('msRolls.afterEachOpen');
					}
				}
			});
		},
		    close = function close(_panel) {
			var callback = arguments[1];

			// Закрыть панели внутры текущей,
			// если открыты
			var $childrenPanel = $(config.panel, _panel);
			$.each($childrenPanel, function () {
				var $eachPanel = $(this);
				$eachPanel.data('opened') && closePanel($eachPanel);
			});

			// Закрыть текущую панель
			closePanel(_panel, function () {
				// Вызов callback функции после закрытия панели
				if (typeof callback === "function") {
					callback();
				}
			});
		},
		    closePanel = function closePanel(_panel) {
			// console.log('close');
			if (_panel.data('opened')) {
				var callback = arguments[1],
				    $currentPanelWrap = _panel.parent(),
				    $currentHeader = $currentPanelWrap.prev(config.header);

				// Удалить активный класс со всех элементов
				toggleClass([_panel.closest(config.item), $currentHeader, $(config.hand, $currentHeader), _panel], false);

				// Закрыть панель
				changeHeight($currentPanelWrap, 0, function () {
					// Вызов события после закрытия каждой панели
					$element.trigger('msRolls.afterEachClose');

					_panel.css({
						position: 'absolute',
						left: 0,
						top: 0
					}).data('opened', false); // Указать в data-атрибуте, что панель закрыта

					// Вызов callback функции после закрытия панели
					if (typeof callback === "function") {
						callback();
					}
				});
			}
		},
		    changeHeight = function changeHeight(_element, _val) {
			var callback = arguments[2];

			_element.animate({
				'height': _val
			}, config.animationSpeed, function () {

				_element.css({
					'height': ''
				});

				if (typeof callback === "function") {
					callback();
				}

				isAnimated = false;
			});
		},
		    toggleClass = function toggleClass(arr) {
			var remove = arguments[1] === false;
			$.each(arr, function () {
				var iElem = this;
				// если массив, то устанавливаем класс на каждый из элемент этого массива
				if ($.isArray(iElem)) {
					$.each(iElem, function () {
						var $curElem = $(this);
						if ($curElem.length) {
							// Если второй аргумент false, то удаляем класс
							if (remove) {
								$curElem.removeClass(config.modifiers.activeClass);
							} else {
								// Если второй аргумент не false, то добавляем класс
								$curElem.addClass(config.modifiers.activeClass);
							}
						} else {
							// В консоль вывести предупреждение,
							// если указанного элемента не существует.
							console.warn('Element "' + this + '" does not exist!');
						}
					});
				} else {
					// Если второй аргумент false, то удаляем класс
					if (remove) {
						$(iElem).removeClass(config.modifiers.activeClass);
					} else {
						// Если второй аргумент не false, то добавляем класс
						$(iElem).addClass(config.modifiers.activeClass);
					}
				}
			});
		},
		    events = function events() {
			$element.on(config.event, config.hand, function (event) {
				// console.log("isAnimated: ", isAnimated);

				// Если панель во время клика находится в процессе анимации,
				// то выполнение функции прекратится
				if (isAnimated) {
					event.preventDefault();
					return false;
				}

				var $currentHand = $(this);

				// Если текущий пункт не содержит панелей,
				// то выполнение функции прекратится
				if (!$currentHand.closest(config.item).has(config.panel).length) {
					return false;
				}

				event.preventDefault();

				// Начало анимирования панели
				// Включить флаг анимации
				isAnimated = true;

				// console.log("Текущая панель открыта?: ", $currentPanel.data('opened'));

				var $currentPanel = $currentHand.closest(config.header).next().children(config.panel);

				if (!$currentPanel.data('opened')) {
					// Открыть текущую панель
					open($currentPanel);
				} else {
					// Закрыть текущую панель
					close($currentPanel, function () {
						// callback after current panel close
						$element.trigger('msRolls.afterClose');
					});
				}
			});
		},
		    onfocus = function onfocus() {
			$element.on('focus', config.hand, function (event) {
				// Если во время получения фокуса панель находится в процессе анимации,
				// то выполнение функции прекратится
				if (isAnimated) {
					event.preventDefault();
					return false;
				}

				var $currentHand = $(this);

				// Если текущий пункт не содержит панелей,
				// то выполнение функции прекратится
				if (!$currentHand.closest(config.item).has(config.panel).length) {
					return false;
				}

				event.preventDefault();

				// Открыть текущую панель
				var $currentPanel = $currentHand.closest(config.header).next().children(config.panel);

				if (!$currentPanel.data('opened')) {
					// Начало анимирования панели
					// Включить флаг анимации
					isAnimated = true;

					open($currentPanel);
				}
			});
		},
		    init = function init() {
			// $element.addClass(initClasses.element);
			// $(config.item, $element).addClass(initClasses.item);
			// $(config.header, $element).addClass(initClasses.header);
			// $(config.panel, $element).addClass(initClasses.panel);
			$(config.hand, $element)
			// .addClass(initClasses.hand)
			.attr('tabindex', 0);

			var $panelWrap = $('<div/>', {
				class: initClasses.panelWrap,
				css: {
					display: 'block',
					position: 'relative',
					overflow: 'hidden'
				}
			});

			$panel.wrap($panelWrap);

			$.each($panel, function (index, panel) {
				$(panel).css({
					display: 'block',
					width: '100%'
				});

				if ($(panel).hasClass(config.modifiers.activeClass)) {

					var $activeHeader = $(panel).parentsUntil(element).prev(config.header),
					    $activePanel = $activeHeader.next().children(config.panel);

					// Добавить класс на активные элементы
					toggleClass([$(panel).parents(config.item), $activePanel, $activeHeader, $(config.hand, $activeHeader)], true);

					$activePanel.css({
						position: 'relative',
						left: 'auto',
						top: 'auto'
					});

					// Указать в data-атрибуте, что панель(и) открыта(ы)
					$activePanel.data('opened', true);
				} else {
					$(panel).css({
						position: 'absolute',
						left: 0,
						top: 0
					});
				}
			});

			$element.addClass(config.modifiers.init);

			$element.trigger('msRolls.afterInit');
		};

		self = {
			callbacks: callbacks,
			open: open,
			close: close,
			toggleClass: toggleClass,
			events: events,
			// onfocus: onfocus,
			init: init
		};

		return self;
	};

	$.fn.msRolls = function () {
		var _ = this,
		    opt = arguments[0],
		    args = Array.prototype.slice.call(arguments, 1),
		    l = _.length,
		    i,
		    ret;
		for (i = 0; i < l; i++) {
			if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) === 'object' || typeof opt === 'undefined') {
				_[i].msRolls = new MsRolls(_[i], $.extend(true, {}, $.fn.msRolls.defaultOptions, opt));
				_[i].msRolls.init();
				_[i].msRolls.callbacks();
				_[i].msRolls.events();
				// _[i].msRolls.onfocus();
			} else {
				ret = _[i].msRolls[opt].apply(_[i].msRolls, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.msRolls.defaultOptions = {
		item: '.rolls__item-js',
		header: '.rolls__header-js',
		hand: '.rolls__hand-js',
		panel: '.rolls__panel-js',
		event: 'click',
		animationSpeed: 300,
		collapsed: true,
		modifiers: {
			init: 'rolls--initialized',
			activeClass: 'rolls--active',
			currentClass: 'current'
		}
	};
})(jQuery);