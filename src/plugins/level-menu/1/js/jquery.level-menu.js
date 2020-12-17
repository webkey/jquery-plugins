/*!==================================================
/*!jquery.level-menu.js
/*!Version: 1
/*!Author: Ilchenko Serhey
/*!Description: Menu for BGPB
/*!================================================== */

/* Navigation plugin */
(function (window, document, $) {
  'use strict';

  var $window = $(window);

  // INNER PLUGIN CLASSES
  // ====================
  var PREF = 'lvl-mn';
  var CONST_CLASSES = {
    element: PREF,
    initClass: PREF + '_initialized',
    item: PREF + '__item',
    drop: PREF + '__drop',
    arrow: PREF + '__arrow',
    arrowEnable: PREF + '__arrow_on',
    selected: PREF + '_selected',
    selectedPrev: PREF + '_selected-prev',
    selectedNext: PREF + '_selected-next',
    collapsible: PREF + '_collapsible'
  };

  var LevelMenu = function (element, config) {
    var self;
    var $element = $(element);
    var $html = $('html');
    var _classIsAdded = false;
    var timeoutShow;
    var timeoutHide;

    var $thumb = $element.find(config.thumb);
    var $panels = $element.find(config.panels);
    var $panel = $element.find(config.panel);
    var isAnimated;
    var activeId;
    var isOpen = false;
    var collapsible = $element.data('panels-collapsible') || config.collapsible;

    var pluginClasses = {
      element: CONST_CLASSES.element,
      initClass: CONST_CLASSES.initClass,
      item: CONST_CLASSES.item,
      drop: CONST_CLASSES.drop,
      arrow: CONST_CLASSES.arrow,
      arrowEnable: CONST_CLASSES.arrowEnable,
      selected: CONST_CLASSES.selected + ' ' + (config.modifiers.selected || ''),
      selectedPrev: CONST_CLASSES.selected + ' ' + (config.modifiers.selectedPrev || ''),
      selectedNext: CONST_CLASSES.selected + ' ' + (config.modifiers.selectedNext || ''),
      collapsible: CONST_CLASSES.collapsible + ' ' + (config.modifiers.collapsible || ''),
    };

    // Время задержки добавления/удаления классов
    // ==========================================
    timeoutShow = timeoutHide = config.timeout;
    if (typeof config.timeout === "object") {
      timeoutShow = config.timeout.show;
      timeoutHide = config.timeout.hide;
    }

    // События resize, scroll по таймауту
    // ==================================
    var timeoutEvent;
    $window.on('resize scroll', function (e) {
      clearTimeout(timeoutEvent);

      timeoutEvent = setTimeout(function () {
        if (e.handleObj.origType === "resize") {
          $window.trigger('rangeResize');
        }
        if (e.handleObj.origType === "scroll") {
          $window.trigger('rangeScroll');
        }
      }, 300);
    });

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('levelMenu.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },

        // HIDE/SHOW PANELS
        // ================
        showPanel = function () {
          // Определяем текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]');
          var $otherPanel = $panel.not('[id="' + activeId + '"]');
          var $activeAnchor = $thumb.filter('[data-for="' + activeId + '"]');

          console.log('$activePanel: ', $activePanel);
          if (!$activePanel.length) {
            console.error('Element with id="' + activeId + '" not exist');
            return;
          }

          if (!isAnimated && $activePanel.length) {
            // console.log('Показать таб:', activeId);
            isAnimated = true;

            // Удалить активный класс со всех элементов
            // $panel.add($thumb).removeClass(pluginClasses.selected);
            removeClassesFrom($panel.add($thumb));

            // Добавить активный класс на активные элементы
            // $activePanel.add($activeAnchor).addClass(pluginClasses.selected);
            addClassesTo($activePanel.add($activeAnchor));

            // Анимирование высоты табов
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': $activePanel.outerHeight()
                }, config.animationSpeed);

            // Скрыть все табы, кроме активного
            hideTargetPanel($otherPanel);

            // Показать активный таб
            $activePanel
                .css({
                  'z-index': 2,
                  'visibility': 'visible'
                })
                .animate({
                  'opacity': 1
                }, config.animationSpeed, function () {
                  $activePanel
                      .css({
                        'position': 'relative',
                        'left': 'auto',
                        'top': 'auto',
                        'pointer-events': ''
                      });
                  // .attr('tabindex', 0);

                  $panels.css({
                    'height': '',
                    'overflow': ''
                  });

                  // Анимация полностью завершена
                  isOpen = true;
                  isAnimated = false;
                });

            // callback after showed tab
            $element.trigger('msTabs.afterOpen');
            $element.trigger('msTabs.afterChange');
          }
        },

        hidePanel = function () {
          // Определить текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]');

          if (!isAnimated) {
            // console.log("Скрыть таб: ", activeId);

            isAnimated = true;

            // Удалить активный класс со всех элементов
            // $panel.add($thumb).removeClass(pluginClasses.selected);
            removeClassesFrom($panel.add($thumb));

            // Анимирование высоты табов
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': 0
                }, config.animationSpeed);

            hideTargetPanel($activePanel, function () {
              $panels.css({
                'height': ''
              });

              isOpen = false;
              isAnimated = false;
            });
          }

          // callback after tab hidden
          $element.trigger('msTabs.afterClose');
          $element.trigger('msTabs.afterChange');
        },

        hideTargetPanel = function ($_panel) {
          var callback = arguments[1];
          $_panel
              .css({
                'z-index': -1
              })
              // .attr('tabindex', -1)
              .animate({
                'opacity': 0
              }, config.animationSpeed, function () {
                $_panel.css({
                  'position': 'absolute',
                  'left': 0,
                  'top': 0,
                  'visibility': 'hidden',
                  'pointer-events': 'none'
                });

                // Анимация полностью завершена
                if (typeof callback === "function") {
                  callback();
                }
              });
        },

        togglePanels_fromTabs = function () {
          $thumb.on('mouseenter', function (event) {
            event.preventDefault();

            var curId = $(this).attr('data-for');

            if (isAnimated || !collapsible && curId === activeId) {
              return false;
            }

            if (collapsible && isOpen && curId === activeId) {
              hidePanel();
            } else {
              activeId = curId;
              showPanel();
            }
          });
        },
        // HIDE/SHOW PANELS end

        // TIMEOUTS
        // ========
        // ЗАПУСТИТЬ функцию, которая ОТКРОЕТ panel через [timeoutShow] ms
        // (одновременно записав ее в аттрибут 'showPanelWithTimeout')
        createTimeoutShowPanel = function () {
          var $item = arguments[0] || $thumb;

          // * setTimeout возвращает идентификатор таймера
          $item.prop('showPanelWithTimeout', setTimeout(function () {
            showPanel();
            // addClassesTo($item);
          }, timeoutShow));
        },

        // Очистить очередь таймаута ОТКРЫТИЯ panel
        clearTimeoutShowPanel = function () {
          var $item = arguments[0] || $thumb;

          // В prop showPanelWithTimeout находится идентификатор таймера, который ОТКРОЕТ panel
          var timeoutShowProp = $item.prop('showPanelWithTimeout');
          if (timeoutShowProp) {
            // Функция очистки таймера clearTimeout всегда возвращает undefined (?)
            $item.prop('showPanelWithTimeout', clearTimeout(timeoutShowProp));
          }
        },

        // ЗАПУСТИТЬ функцию, которая СКРОЕТ panel через [timeoutHide] ms
        // (одновременно записав ее в аттрибут 'hidePanelWithTimeout')
        createTimeoutHidePanel = function () {
          var $item = arguments[0] || $thumb;

          // * setTimeout возвращает идентификатор таймера
          $item.prop('hidePanelWithTimeout', setTimeout(function () {
            hidePanel();
            // removeClassesFrom($item);
          }, timeoutHide));
        },

        // Очистить очередь таймаута ЗАКРЫТИЯ panel
        clearTimeoutHidePanel = function () {
          var $item = arguments[0] || $thumb;

          // В prop hidePanelWithTimeout находится идентификатор таймера, СКРОЕТ panel
          var timeoutHideProp = $item.prop('hidePanelWithTimeout');
          if (timeoutHideProp) {
            // Функция очистки таймера clearTimeout всегда возвращает undefined (?)
            $item.prop('hidePanelWithTimeout', clearTimeout(timeoutHideProp));
          }
        },
        // TIMEOUTS end

        /*Add classes*/
        addClassesTo = function () {
          var $item = arguments[0];

          console.log('$item a: ', $item);
          if ($item.length) {
            $item
                .addClass(pluginClasses.selected)
                .prop('isActive', true);

            if (config.siblings) {
              $item.next().addClass(pluginClasses.selectedNext);
              $item.prev().addClass(pluginClasses.selectedPrev);
            }

            _classIsAdded = true;

            $element.trigger('levelMenu.afterAddedClass', $item);
            // console.log("~~ class selected added: ", $item);
          }
        },

        /*Add classes*/
        removeClassesFrom = function () {
          var $item = arguments[0] || $thumb;

          console.log('$item r: ', $item);
          if ($item.length) {
            $item
                .removeClass(pluginClasses.selected)
                .prop('isActive', false);

            if (config.siblings) {
              $item.next().removeClass(pluginClasses.selectedNext);
              $item.prev().removeClass(pluginClasses.selectedPrev);
            }

            _classIsAdded = false;

            $element.trigger('levelMenu.afterRemovedClass', $item);
            // console.log("~~ class selected removed: ", $item);
          }
        },

        /*Immediate add and remove classes*/
        forceAddClassTo = function () {
          var $item = arguments[0] || $thumb;

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $eachCurItem = $(this);

            // Отметить добавление класса с задержкой
            // ====================================================
            clearTimeoutShowPanel($eachCurItem);

            // Добавить класс без задержки
            // ====================================================
            if (!$eachCurItem.prop('isActive')) {
              addClassesTo($eachCurItem);
            }
          });
        },

        forceRemoveClassFrom = function () {
          var $item = arguments[0] || $thumb;
          // Если вторым параметром передать true, классы будут удалены и с дочерних пунктов
          var cond = arguments[1];

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $eachCurItem = $(this);

            // Отметить удаление класса с задержкой
            // ====================================================
            clearTimeoutHidePanel($eachCurItem);

            // Удалить класс без задержки
            // ====================================================
            if ($eachCurItem.prop('isActive')) {
              removeClassesFrom($eachCurItem);
            }

            // Чтобы провести очиску и в дочерних элементах,
            // нужно передать на вход функции вторым аргументом "true"
            if (cond) {
              // Перебрать всех детей активных пунктов
              // ====================================================
              $.each($eachCurItem.find(config.thumb), function () {
                var $eachCurChild = $(this);

                // Отметить удаление класса с задержкой
                // ====================================================
                clearTimeoutHidePanel($eachCurChild);

                // Удалить класс без задержки
                // ====================================================
                if ($eachCurChild.prop('isActive')) {
                  removeClassesFrom($eachCurChild);
                }
              });
            }
          });
        },

        /*Clear classes*/
        removeOnResize = function () {
          var resizeByWidth = true;
          var prevWidth = -1;
          $window.on('rangeResize', function () {
            var currentWidth = $('body').outerWidth();
            resizeByWidth = prevWidth !== currentWidth;
            if (resizeByWidth) {
              removeClassesFrom($(config.thumb, $element).filter('.' + pluginClasses.selected));

              // console.log('%c >>>remove by WIDTH RESIZE<<<', 'background-color: #00f1ff; color: #ff1515');
              prevWidth = currentWidth;
            }
          });
        },

        removeByClickOutside = function () {
          $html.on('click', function (event) {

            if (!_classIsAdded || $(event.target).closest($(config.thumb)).length) return;

            // console.log('%c >>>remove by click OUTSIDE<<<', 'background-color: #00f1ff; color: #ff1515');

            forceRemoveClassFrom();
          });
        },

        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (_classIsAdded && event.keyCode === 27) {

              // console.log('%c >>>remove by click ESC<<< ', 'background-color: #00f1ff; color: #ff1515');

              forceRemoveClassFrom();
            }
          });

          return false;
        },

        // TOGGLE PANELS
        // =============
        togglePanels = function () {
          var $item = $(config.thumb, $element);

          // Обработка событий прикосновения к тачскрину,
          // а также ввода и вывода курсора
          // ====================================================
          $element
              .off('touchend mouseenter mouseleave', config.thumb)
              .on('touchend mouseenter mouseleave', config.thumb, function (e) {

                // console.log('%c ~~~' + e.handleObj.origType + '~~~ ', 'background: #222; color: #bada55');

                var $curItem = $(this);

                // Если в настройках не отключена трансформация навигации с десктопного вида в мобильный (accordionView: false),
                // то при ширине окна браузера ниже указанного в опции "accordionView.breakpoint"
                // дальнейшее выполнение функции прервать.
                // ====================================================
                if (config.accordionView && window.innerWidth < config.accordionView.breakpoint) return;

                // Также выполнение функции прекратить если:
                // 1) в настройках указанно, что нужно проводить проверку на наличие подменю,
                // 2) и текущий пункт не содержит подменю.
                // ====================================================
                if (config.onlyHasDrop && !$curItem.has(config.drop).length) return;

                // Родительские пункты текущего пункта
                // ====================================================
                var $curParentItems = $curItem.parentsUntil($element, config.thumb);

                // События на TOUCHEND (для тачскринов)
                // ====================================================
                if (e.handleObj.origType === "touchend" && !config.arrowEnable) {
                  // console.log('%c >>>touchend<<< ', 'background: #222; color: #bada55');

                  if (!$curItem.prop('isActive')) {
                    // Если пункт НЕАКТИВЕН
                    // ====================================================

                    // Удалить БЕЗ ЗАДЕРЖКИ классы selected со ВСЕХ активных пунктов,
                    // кроме ТЕКУЩЕГО.
                    // ====================================================
                    if (!e.stopEventTouchend) {
                      e.stopEventTouchend = true;
                      removeClassesFrom($item.filter('.' + CONST_CLASSES.selected).not($curItem));
                    }

                    // Если текущий пункт не содержит подменю,
                    // то выполнение функции прекратить
                    // !!! Эта проверка проводится в самом конце,
                    //     чтобы можно было удалять активные классы
                    //     при клике на любой пункт, а не только
                    //     содержащий в себе подменю.
                    // ====================================================
                    if (!$curItem.has(config.drop).length) return;

                    // Добавить классы selected на ТЕКУЩИЙ пункт
                    // ====================================================
                    addClassesTo($curItem);

                    e.preventDefault();

                    return;
                  }
                }

                // События на ВВОД курсора
                // ====================================================
                if (e.handleObj.origType === "mouseenter") {
                  // console.log('%c >>>mouseenter<<< ', 'background: #222; color: #bada55');

                  // Отлавливать событие нужно только на целевом пункте, не затрагивая родителей.
                  // Для этого добавляем в объект события параметр "handled"
                  // и проверяем при всплытие события наличие этого параметра.
                  if (e.handled) return;
                  e.handled = true;

                  var curId = $curItem.attr('data-for');

                  // При повторном наведении на активный пункт ничего не должно происходить
                  if (isAnimated || !collapsible && curId === activeId) {
                    return;
                  }

                  if (collapsible && isOpen && curId === activeId) {
                    hidePanel();
                  } else {
                    activeId = curId;
                    showPanel();
                  }

                  return;
                }

                // События на ВЫВОД курсора
                // ====================================================
                if (!config.mouseleavePrevent && e.handleObj.origType === "mouseleave") {
                  // console.log('%c >>>mouseleave<<< ', 'background: #222; color: #bada55');

                  // Перед удалением класса нужно
                  // ОТМЕНИТЬ ДОБАВЛЕНИЕ класса С ЗАДЕРЖКОЙ c текущего пункта,
                  // если функция добавления запущена.
                  // ====================================================
                  clearTimeoutShowPanel($curItem);

                  // Удалить классы selected
                  // с ТЕКУЩЕГО и РОДИТЕЛЬСКИХ пунктов
                  // ЗАПУСТИТЬ функцию УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ
                  // ====================================================
                  createTimeoutHidePanel($curItem);
                }
              });

          // Обработка события клика по стрелке
          // ====================================================
          config.arrowEnable &&
          $element.off('click keydown', config.arrow)
              .on('click keydown', config.arrow, function (e) {
                // console.log('click keydown');
                // Если в настройках не отключена трансформация навигации с десктопного вида в мобильный (accordionView: false),
                // то при ширине окна браузера ниже указанного в опции "accordionView.breakpoint"
                // дальнейшее выполнение функции прервать.
                // ====================================================
                if (config.accordionView && window.innerWidth < config.accordionView.breakpoint) return;

                // console.log('e.which: ', e.which);
                if( e.which !== 1 && e.which !== 13 && e.which !== 37 && e.which !== 38 && e.which !== 39 && e.which !== 40 ) return;

                var $curItem = $(this).closest(config.thumb);

                // Также выполнение функции прекратить если:
                // 1) в настройках указанно, что нужно проводить проверку на наличие подменю,
                // 2) и текущий пункт не содержит подменю.
                // ====================================================
                if (config.onlyHasDrop && !$curItem.has(config.drop).length) return;

                // console.log('%c >>>arrow click<<< ', 'background: #222; color: #bada55');

                // console.log("$curItem.prop('isActive'): ", $curItem.prop('isActive'));

                if (!$curItem.prop('isActive')) {
                  // Если пункт НЕАКТИВЕН
                  // ====================================================

                  // Удалить БЕЗ ЗАДЕРЖКИ классы selected со ВСЕХ активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ.
                  // ====================================================
                  var $curParentItems = $curItem.parentsUntil($element, config.thumb);
                  forceRemoveClassFrom($item.filter('.' + CONST_CLASSES.selected).not($curItem).not($curParentItems));

                  /// ДОБАВИТЬ класс selected на ТЕКУЩИЙ пунт С ЗАДЕРЖКОЙ
                  // ====================================================
                  forceAddClassTo($curItem);
                } else {
                  // УДАЛИТЬ классы selected с ТЕКУЩЕГО пунта и ДОЧЕРНИХ БЕЗ ЗАДЕРЖКИ
                  // ====================================================
                  forceRemoveClassFrom($curItem, true);
                }

                e.preventDefault();
              })
        },

        /*Initialize*/
        init = function () {
          // Container
          $element.addClass(pluginClasses.element);

          // Item
          $thumb.addClass(pluginClasses.item);

          // Submenu
          $(config.drop, $element).addClass(pluginClasses.drop);

          // Arrow
          var $arrow = $(config.arrow, $element);
          $arrow.addClass(pluginClasses.arrow);

          // Add tabindex to arrows
          if (config.arrowEnable) {
            $arrow.addClass(pluginClasses.arrowEnable).attr('tabindex', 0);
          }

          // INITIALIZED PANELS
          // ==================
          $thumb.filter('.' + pluginClasses.active).addClass(pluginClasses.active);
          $thumb.filter('.' + config.modifiers.activeClass).addClass(pluginClasses.active);

          $panels.css({
            'display': 'block',
            'position': 'relative'
          });

          $panel
              .css({
                'position': 'absolute',
                'left': 0,
                'top': 0,
                'opacity': 0,
                'width': '100%',
                'visibility': 'hidden',
                'z-index': -1,
                'pointer-events': 'none'
              });
          // .attr('tabindex', -1);

          // console.log("config.activeIndex === 0 || config.activeIndex: ", config.activeIndex === 0 || config.activeIndex);

          if ($thumb.filter('.' + CONST_CLASSES.selected).length) {
            activeId = $thumb.filter('.' + CONST_CLASSES.selected).attr('data-for');
          } else if ($thumb.filter('.' + config.modifiers.selected).length) {
            activeId = $thumb.filter('.' + config.modifiers.selected).attr('data-for');
          } else if (config.activeIndex === 0 || config.activeIndex) {
            activeId = $thumb.eq(config.activeIndex).attr('data-for');
          }

          // console.log("activeId (сразу после инициализации): ", activeId);

          if (activeId) {
            var $activeAnchor = $thumb.filter('[href="#' + activeId + '"]'),
                $activePanel = $panel.filter('[id="' + activeId + '"]');

            // Добавить класс на каждый активный элемент
            $activePanel.add($activeAnchor).addClass(pluginClasses.active);

            // Показать активный таб
            $activePanel
                .css({
                  'position': 'relative',
                  'left': 'auto',
                  'top': 'auto',
                  'opacity': 1,
                  'visibility': 'visible',
                  'z-index': 2,
                  'pointer-events': ''
                });
            // .attr('tabindex', 0);

            isOpen = true;
          }

          // Добавить специальный класс, если включена возможность
          // разворачивать/сворачивать активный таб
          if (collapsible) {
            $element.addClass(pluginClasses.collapsible);
          }

          // Add initialization class
          $element.addClass(pluginClasses.initClass);

          // Fire event after initialization
          $element.trigger('levelMenu.afterInit');
        };

    self = {
      callbacks: callbacks,
      togglePanels: togglePanels,
      clearSelectedClassOnResize: removeOnResize,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.levelMenu.callbacks();
    el.levelMenu.togglePanels();
    el.levelMenu.clearSelectedClassOnResize();
    el.levelMenu.removeByClickOutside();
    el.levelMenu.removeByClickEsc();
    el.levelMenu.init();
  }

  $.fn.levelMenu = function () {
    
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        if (self[i].levelMenu) {
          // console.info("%c Warning! Plugin already has initialized! ", 'background: #bd0000; color: white');
          return;
        }
        self[i].levelMenu = new LevelMenu(self[i], $.extend(true, {}, $.fn.levelMenu.defaultOptions, opt));

        _run(self[i]);
      } else {
        ret = self[i].levelMenu[opt].apply(self[i].levelMenu, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.levelMenu.defaultOptions = {
    // Дефолтные значения указаны для
    // следующей структуры DOM:
    // ====================================================
    // <ul>     - меню (container)
    //   <li>   - пункт меню (item)
    //     <a>  - ссылка
    //     <em>  - стрелка (arrow)
    //     <ul> - подменю (drop)
    // ====================================================
    drop: 'ul',
    arrow: 'li > a + em',

    // "thumb" не может быть "a"
    thumb: 'li[data-for]',
    panels: '.js-level-menu-panels',
    panel: '.js-level-menu-panel',

    // Скорость анимирования "panel"
    animationSpeed: 300,

    // Индекс активной "panel" при инициализации плагина
    // Если указать "false", то все "panel" будут закрыты
    // Важно! Указание активного класса в html имеет приоритет выше
    activeIndex: 0,

    // Позволить открывать и закрывать "panel" по клику/тапу/наведению на один и тот же "thumb"
    collapsible: false,

    // Добавлять классы только на пункты
    // имеющие подпункты
    onlyHasDrop: false,

    // Устанавливать дополнительные классы
    // на соседние пункты активного
    siblings: false,

    // Задержка отображения/скрытия
    // По умолчанию 50ms
    // timeout: 50
    // Можно указать отдельно для отображения и скрытия
    // timeout: {
    //   show: 50,
    //   hide: 500
    // }
    timeout: 0,

    // Активировать стрелки.
    // -----------------------------------------------------------------------------------
    // Если значение "arrowEnable" равно "false" (дефолтное значение):
    // - На ДЕСКТОПЕ переключение класса будет происходить только на ховер с указанной задержкой (см. опицию timeout).
    // - На тачскрине по первому клику добавится класс, а по второму произойдет переход по ссылке.
    //   Для удаления класса, кликнуть вне меню.
    // -----------------------------------------------------------------------------------
    // Если значение "arrowEnable" равно "true":
    // - На ДЕСКТОПЕ переключение класса будет происходить на ховер с указанной задержкой (см. опицию timeout),
    //   а при клике на стрелку - без задержки.
    // - На тачскрине переключение класса будет происходить только по клику на стрелку.
    arrowEnable: false,

    // Не удалять класс selected при выводе курсора
    mouseleavePrevent: false,

    // Навигация трансформируется в аккордеон
    accordionView: {
      // Точка, ниже которой навигация трансформируется в аккордеон
      // Необходимо укзывать всегда, если она отлична от дефолтного значения 991px
      breakpoint: 992,
    },

    // Классы-модификаторы
    modifiers: {
      selected: 'hover',
      selectedNext: 'hover_next',
      selectedPrev: 'hover_prev',
    },
  };

})(window, document, jQuery);