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
			$item = $(config.item, $element),
			$header = $(config.header, $element),
			$hand = $(config.hand, $element),
			// $panels = $('.s'),
			// $panel = $header.next(),
			$panels,
			$panel = $(config.panel, $element),
			isAnimated = false,
			// activeId,
			isOpen = false,
			collapsed = $element.data('tabs-collapsed') || config.collapsed;

		var callbacks = function () {
			/** track events */
			$.each(config, function (key, value) {
				if (typeof value === 'function') {
					$element.on('msRolls.' + key, function (e, param) {
						return value(e, $element, param);
					});
				}
			});
		}, open = function (_item, _header) {
			// Определяем текущий таб
			var $activePanel = _header.next().children();

			// console.log('Показать таб:', activeId);
			// isAnimated = true;

			// Удалить активный класс со всех элементов
			// toggleClass([$item, $hand], false);

			// Добавить класс на каждый активный элемент
			toggleClass([_item], true);

			// Анимирование высоты панели
			var $currentPanels = _header.next();
			// $currentPanels.animate({
			// 	'height': $activePanel.outerHeight()
			// }, config.animationSpeed, function () {
			// 	$currentPanels.css({
			// 		'height': ''
			// 	})
			// });
			changeHeight($currentPanels, $activePanel.outerHeight());

			// Скрыть все табы, кроме активного
			// hidePanel(_item.siblings().find($header).next().children());

			// Показать активный таб
			$activePanel
				.css({
					'z-index': 2
					// visibility: 'visible',
					// opacity: 1
				})
				.animate({
					// opacity: 1
				}, config.animationSpeed, function () {
					$activePanel.css({
						position: 'relative',
						left: 'auto',
						top: 'auto'
					}).attr('tabindex', 0);

					// Анимация полностью завершена
					isOpen = true;
					// isAnimated = false;
					_header.data('opened', true);
				});

			// callback after showed tab
			$element.trigger('msRolls.afterShowed');
		}, close = function (_item, _header) {
			// Определяем текущий таб
			var $currentPanel = _header.next().children();

			// console.log("Скрыть таб: ", activeId);

			// Удалить активный класс со всех элементов
			toggleClass([_item], false);

			// Анимирование высоты табов
			changeHeight(_header.next(), 0);
			// $currentPanels.animate({
			// 	'height': 0
			// }, config.animationSpeed);

			hidePanel($currentPanel, function () {
				isOpen = false;
				// isAnimated = false;
				_header.data('opened', false);
			});

			// callback after tab hidden
			$element.trigger('msRolls.afterHidden');
		}, hidePanel = function (_panel) {
			var callback = arguments[1];
			// isAnimated = true;
			_panel
				.css({
					'z-index': -1
				})
				.attr('tabindex', -1)
				.animate({
					// 'opacity': 0
				}, config.animationSpeed, function () {
					_panel.css({
						position: 'absolute',
						left: 0,
						top: 0
						// opacity: 0,
						// visibility: 'hidden'
					});

					// Анимация полностью завершена
					if (typeof callback === "function") {
						callback();
					}

					// isAnimated = false;
				});
		}, changeHeight = function (_element, _val) {
			var callback = arguments[2];

			isAnimated = true;

			_element.animate({
				'height': _val
			}, config.animationSpeed, function () {

				console.log(1);
				isAnimated = false;

				_element.css({
					'height': ''
				});

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
			$element.on('click', config.hand, function (event) {

				console.log("isAnimated: ", isAnimated);

				var $curHand = $(this);

				// var curId = $(this).attr('href').substring(1);
				// // console.log("Таб анимируется?: ", isAnimated);
				// // console.log("Текущий таб открыт?: ", isOpen);
				// // console.log("Таб нужно закрывать, если открыт?: ", collapsed);
				// // console.log("activeId (Предыдущий): ", activeId);
				//
				// if (isAnimated || !collapsed && curId === activeId) {
				// 	return false;
				// }
				if (isAnimated || !collapsed) {
					event.preventDefault();
					return false;
				}
				//
				// if (collapsed && isOpen && curId === activeId) {
				// 	hide();
				// } else {
				// 	activeId = curId;
				// 	// console.log("activeId (Текущий): ", activeId);
				// 	show();
				// }
				// if (collapsed && isOpen) {
				// 	close();
				// } else {
				// 	// activeId = curId;
				// 	// console.log("activeId (Текущий): ", activeId);
				// 	open();
				// }
				var $currentItem = $curHand.closest($item);
				var $currentHeader = $curHand.closest($header);

				if ($currentItem.has($panel).length && !$currentHeader.data('opened')) {
					event.preventDefault();

					// if ($currentPanel.is(':visible')) {
					// 	close($currentItem);
					//
					// 	return;
					// }

					// if (self.options.collapsibleAll) {
					// 	self.closePanel($($container).not($curHand.closest($container)).find($item));
					// }
					//
					// if (self.options.collapsible) {
					// 	self.closePanel($currentItem.siblings());
					// }
					open($currentItem, $currentHeader);

					close($currentItem.siblings(), $currentItem.siblings().find($header));
				} else {
					close($currentItem, $currentHeader);
					close($(config.item, $currentItem), $($header, $currentItem));
				}

				event.preventDefault();
			});
		}, init = function () {
			// activeId = $hand.filter('.' + config.modifiers.activeClass).length && $hand.filter('.' + config.modifiers.activeClass).attr('href').substring(1);

			// console.log("activeId (сразу после инициализации): ", !!activeId);

			$panels = $('<div/>', {
				class: '===@@-js-wrap-@@===',
				css: {
					display: 'block',
					position: 'relative',
					overflow: 'hidden',
					'z-index': 1
				}
			});

			$panel.css({
				display: 'block',
				width: '100%',
				position: 'absolute',
				left: 0,
				top: 0,
				// opacity: 0,
				// visibility: 'hidden',
				'z-index': -1
			})
				.attr('tabindex', -1)
				.wrap($panels);

			// Открыть текущую панел
			// if (activeId) {
			// 	var $activePanel = $panel.filter('[id="' + activeId + '"]');
			//
			// 	// Добавить класс на каждый элемен
			// 	toggleClass([$activePanel], true);
			//
			// 	// Показать активный таб
			// 	$activePanel
			// 		.css({
			// 			'position': 'relative',
			// 			'left': 'auto',
			// 			'top': 'auto',
			// 			'opacity': 1,
			// 			'visibility': 'visible',
			// 			'z-index': 2
			// 		})
			// 		.attr('tabindex', 0);
			//
			// 	isOpen = true;
			// }

			$element.addClass(config.modifiers.init);

			$element.trigger('msRolls.afterInit');
		};

		self = {
			callbacks: callbacks,
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
			activeClass: 'rolls--active'
		}
	};

})(jQuery);