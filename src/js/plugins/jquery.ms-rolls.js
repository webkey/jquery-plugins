/*! jquery.ms-tabs.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function($){
	'use strict';

	var MsRolls = function(element, config){
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
			},
			dataCollapsed = $element.attr('data-rolls-collapsed'),
			collapsed = dataCollapsed.length ? dataCollapsed : config.collapsed;

		console.log("collapsed: ", collapsed);

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msRolls.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, open = function (_panel) {
			// console.log('open');
			var callback = arguments[1],
				$currentPanelWrap = _panel.parent(),
				$currentHeader = $currentPanelWrap.prev(config.header);

			// Закрыть соседние панели,
			// если открыты
			console.log("collapsed === true: ", collapsed === true || collapsed === 'true');
			if (collapsed === true || collapsed === 'true') {
				var $siblingsPanel = $(config.panel, _panel.closest(config.item).siblings());
				$.each($siblingsPanel, function () {
					var $eachPanel = $(this);
					// console.log("Панель в соседнем пункте открыта?: ", $eachPanel.data('opened'));
					$eachPanel.data('opened') && closePanel($eachPanel);
				});
			}

			// Добавить класс на активные элементы
			toggleClass([_panel.closest(config.item), $currentHeader, $(config.hand, $currentHeader), _panel], true);

			// Открыть панель
			changeHeight($currentPanelWrap, _panel.outerHeight(), function () {
				_panel.css({
						position: 'relative',
						left: 'auto',
						top: 'auto'
					});

				// Указать в data-атрибуте, что панель открыта
				_panel.data('opened', true);

				// Вызов события после открытия текущей панели
				$element.trigger('msRolls.afterOpen');

				// Вызов callback функции после открытия панели
				if (typeof callback === "function") {
					callback();
				}
			});

		}, close = function (_panel) {
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

		}, closePanel = function (_panel) {
			// console.log('close');
			var callback = arguments[1],

				$currentPanelWrap = _panel.parent(),
				$currentHeader = $currentPanelWrap.prev(config.header);

			// Удалить активный класс со всех элементов
			toggleClass([_panel.closest(config.item), $currentHeader, $(config.hand, $currentHeader), _panel], false);

			// Закрыть панель
			changeHeight($currentPanelWrap, 0, function () {
				// Вызов события после закрытия каждой панели
				$element.trigger('msRolls.afterEachClose');

				_panel
					.css({
						position: 'absolute',
						left: 0,
						top: 0
					})
					.data('opened', false);// Указать в data-атрибуте, что панель закрыта

				// Вызов callback функции после закрытия панели
				if (typeof callback === "function") {
					callback();
				}
			});

		}, changeHeight = function (_element, _val) {
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
		}, toggleClass = function (arr) {
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
							console.warn('Element "' + this + '" does not exist!')
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
		}, events = function () {
			$element.on('click', config.hand, function (event) {
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
		}, init = function () {
			// $element.addClass(initClasses.element);
			// $(config.item, $element).addClass(initClasses.item);
			// $(config.header, $element).addClass(initClasses.header);
			// $(config.hand, $element).addClass(initClasses.hand);
			// $(config.panel, $element).addClass(initClasses.panel);

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

				if($(panel).hasClass(config.modifiers.activeClass)) {

					var $activeHeader = $(panel).parentsUntil(element).prev(config.header),
						$activePanel = $activeHeader.next().children(config.panel);

					$activePanel.css({
						position: 'relative',
						left: 'auto',
						top: 'auto'
					});

					// Добавить класс на активные элементы
					toggleClass([$(panel).parents(config.item), $activePanel, $activeHeader, $(config.hand, $activeHeader)], true);

					// Указать в data-атрибуте, что панель(и) открыта(ы)
					$activePanel.data('opened', true);
				} else {
					$(panel).css({
						position: 'absolute',
						left: 0,
						top: 0
					})
				}
			});

			$element.addClass(config.modifiers.init);

			$element.trigger('msRolls.afterInit');
		};

		self = {
			callbacks: callbacks,
			open: open,
			toggleClass: toggleClass,
			events: events,
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
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].msRolls = new MsRolls(_[i], $.extend(true, {}, $.fn.msRolls.defaultOptions, opt));
				_[i].msRolls.init();
				_[i].msRolls.callbacks();
				_[i].msRolls.events();
			}
			else {
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
		animationSpeed: 300,
		collapsed: true,
		modifiers: {
			init: 'rolls--initialized',
			activeClass: 'rolls--active',
			currentClass: 'current'
		}
	};

})(jQuery);