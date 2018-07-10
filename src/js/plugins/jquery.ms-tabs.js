/*! jquery.ms-tabs.js
 * Version: 2018.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function($){
	'use strict';

	var MsTabs = function(element, config){
		var self,
			$element = $(element),
			$anchor = $element.find(config.anchor),
			$panels = $element.find(config.panels),
			$panel = $element.find(config.panel),
			isAnimated = false,
			activeId,
			isOpen = false,
			collapsed = $element.data('tabs-collapsed') || config.collapsed;

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msTabs.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, show = function () {
			// Определяем текущий таб
			var $activePanel = $panel.filter('[id="' + activeId + '"]'),
				$otherPanel = $panel.not('[id="' + activeId + '"]'),
				$activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

			if (!isAnimated) {
				// console.log('Показать таб:', activeId);
				isAnimated = true;

				// Удалить активный класс со всех элементов
				toggleClass([$panel, $anchor], false);

				// Добавить класс на каждый активный элемент
				toggleClass([$activePanel, $activeAnchor], true);

				// Анимирование высоты табов
				$panels.animate({
					'height': $activePanel.outerHeight()
				}, config.animationSpeed);

				// Скрыть все табы, кроме активного
				hideTab($otherPanel);

				// Показать активный таб
				$activePanel
					.css({
						'z-index': 2,
						'visibility': 'visible'
					})
					.animate({
						'opacity': 1
					}, config.animationSpeed, function () {
						$activePanel.css({
							'position': 'relative',
							'left': 'auto',
							'top': 'auto'
						}).attr('tabindex', 0);

						$panels.css({
							'height': ''
						});

						// Анимация полностью завершена
						isOpen = true;
						isAnimated = false;
					});
			}

			// callback after showed tab
			$element.trigger('msTabs.afterShowed');
		}, hide = function () {
			// Определить текущий таб
			var $activePanel = $panel.filter('[id="' + activeId + '"]');

			if (!isAnimated) {
				// console.log("Скрыть таб: ", activeId);

				isAnimated = true;

				// Удалить активный класс со всех элементов
				toggleClass([$panel, $anchor], false);

				// Анимирование высоты табов
				$panels.animate({
					'height': 0
				}, config.animationSpeed);

				hideTab($activePanel, function () {
					$panels.css({
						'height': ''
					});

					isOpen = false;
					isAnimated = false;
				});
			}

			// callback after tab hidden
			$element.trigger('msTabs.afterHidden');
		}, hideTab = function (tab) {
			var callback = arguments[1];
			tab
				.css({
					'z-index': -1
				})
				.attr('tabindex', -1)
				.animate({
					'opacity': 0
				}, config.animationSpeed, function () {
					tab.css({
						'position': 'absolute',
						'left': 0,
						'top': 0,
						'visibility': 'hidden'
					});

					// Анимация полностью завершена
					if (typeof callback === "function") {
						callback();
					}
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
			$element.on('click', config.anchor, function (event) {
				event.preventDefault();

				var curId = $(this).attr('href').substring(1);
				// console.log("Таб анимируется?: ", isAnimated);
				// console.log("Текущий таб открыт?: ", isOpen);
				// console.log("Таб нужно закрывать, если открыт?: ", collapsed);
				// console.log("activeId (Предыдущий): ", activeId);

				if (isAnimated || !collapsed && curId === activeId) {
					return false;
				}

				if (collapsed && isOpen && curId === activeId) {
					hide();
				} else {
					activeId = curId;
					// console.log("activeId (Текущий): ", activeId);
					show();
				}
			});
		}, init = function () {
			activeId = $anchor.filter('.' + config.modifiers.activeClass).length && $anchor.filter('.' + config.modifiers.activeClass).attr('href').substring(1);

			// console.log("activeId (сразу после инициализации): ", !!activeId);

			$panels.css({
				'display': 'block',
				'position': 'relative',
				'overflow': 'hidden'
			});

			$panel.css({
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'opacity': 0,
				'width': '100%',
				'visibility': 'hidden',
				'z-index': -1
			}).attr('tabindex', -1);

			if (activeId) {
				var $activePanel = $panel.filter('[id="' + activeId + '"]');

				// Добавить класс на каждый элемен
				toggleClass([$activePanel], true);

				// Показать активный таб
				$activePanel
					.css({
						'position': 'relative',
						'left': 'auto',
						'top': 'auto',
						'opacity': 1,
						'visibility': 'visible',
						'z-index': 2
					})
					.attr('tabindex', 0);

				isOpen = true;
			}

			$element.addClass(config.modifiers.init);

			$element.trigger('msTabs.afterInit');
		};

		self = {
			callbacks: callbacks,
			events: events,
			init: init
		};

		return self;
	};

	$.fn.msTabs = function () {
		var _ = this,
			opt = arguments[0],
			args = Array.prototype.slice.call(arguments, 1),
			l = _.length,
			i,
			ret;
		for (i = 0; i < l; i++) {
			if (typeof opt === 'object' || typeof opt === 'undefined') {
				_[i].msTabs = new MsTabs(_[i], $.extend(true, {}, $.fn.msTabs.defaultOptions, opt));
				_[i].msTabs.init();
				_[i].msTabs.callbacks();
				_[i].msTabs.events();
			}
			else {
				ret = _[i].msTabs[opt].apply(_[i].msTabs, args);
			}
			if (typeof ret !== 'undefined') {
				return ret;
			}
		}
		return _;
	};

	$.fn.msTabs.defaultOptions = {
		anchor: '.tabs__anchor-js',
		panels: '.tabs__panels-js',
		panel: '.tabs__panel-js',
		animationSpeed: 300,
		collapsed: false,
		modifiers: {
			init: 'tabs--initialized',
			activeClass: 'tabs--active'
		}
	};

})(jQuery);