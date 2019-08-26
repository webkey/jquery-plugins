/*!==================================================
/*!jquery.nav.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  'use strict';

  var $window = $(window), $document = $(document);

  // Inner Plugin Classes and Modifiers
  // ====================================================
  var CONST_CLASSES = {
    initClass: 'navJs_initialized',
    element: 'navJs',
    item: 'navJs__item',
    drop: 'navJs__drop',
    arrow: 'navJs__arrow',
    arrowEnable: 'navJs__arrow_on',
  };

  var Nav = function (element, config) {
    var self,
        $element = $(element),
        $html = $('html'),
        _classIsAdded = false,
        timeoutAdd,
        timeoutRemove;

    // Время задержки добавления/удаления классов
    // ====================================================
    timeoutAdd = timeoutRemove = config.timeout;
    if (typeof config.timeout === "object") {
      timeoutAdd = config.timeout.add;
      timeoutRemove = config.timeout.remove;
    }

    // Resize, scroll with timeout
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
              $element.on('nav.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        /*Position submenu*/
        addPositionClasses = function (position, feedback, $elem) {
          removePositionClasses($elem);
          $elem.addClass(feedback.horizontal + ' ' + feedback.vertical + ' ' + feedback.important)
              .css(position);
        },
        removePositionClasses = function ($elem) {
          $elem
              .removeClass('top')
              .removeClass('right')
              .removeClass('bottom')
              .removeClass('left')
              .removeClass('center')
              .removeClass('horizontal')
              .removeClass('vertical');
        },
        uiPosition = function (el, at) {
          $.each(el, function () {
            var el = $(this);
            var parent = el.closest(config.item);
            el.position({
              my: "left top",
              at: at,
              collision: "flip flip",
              of: parent,
              using: function (position, feedback) {
                addPositionClasses(position, feedback, el);
              }
            })
          })
        },
        dropPosition = function () {
          var $childrenDrop = $element.children(config.item).children(config.drop);
          var $childrenDropDeeper = $childrenDrop.find(config.drop);

          if (config.accordionView && window.innerWidth < config.accordionView.breakpoint) {
            $childrenDrop.add($childrenDropDeeper).css({
              'position': '',
              'top': '',
              'right': '',
              'bottom': '',
              'left': ''
            });
            removePositionClasses($childrenDrop.add($childrenDropDeeper));
          } else {
            // Подменю первого уровня
            uiPosition($childrenDrop, config.submenuPosition.firstLevel);
            // Подменю второго уровня
            uiPosition($childrenDropDeeper, config.submenuPosition.deeperLevel);
          }
        },
        recalculateDropPosition = function () {
          if (config.submenuPosition && config.submenuPosition.observe) {
            // Recalculate on resize
            $window.on('rangeResize', function () {
              dropPosition();
            });

            // Recalculate on scroll
            $window.on('rangeScroll', function () {
              dropPosition();
            });
          }
        },
        /*Timeout functions*/
        createTimeoutAddClass = function () {
          var $item = arguments[0] || $(config.item, $element);

          // ЗАПУСТИТЬ функцию ДОБАВЛЕНИЯ класса С ЗАДЕРЖКОЙ
          // (одновременно записав ее в аттрибут 'addClassWithTimeout')
          // ====================================================
          $item.prop('addClassWithTimeout', setTimeout(function () {
            addClassesTo($item);
          }, timeoutAdd));
        },
        clearTimeoutAddClass = function () {
          var $item = arguments[0] || $(config.item, $element);

          var addClassWTO = $item.prop('addClassWithTimeout');
          if (addClassWTO) {
            $item.prop('addClassWithTimeout', clearTimeout(addClassWTO));
          }
        },
        createTimeoutRemoveClass = function () {
          var $item = arguments[0] || $(config.item, $element);

          // ЗАПУСТИТЬ функцию УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ
          // (одновременно записав ее в аттрибут 'removeClassWithTimeout')
          // ====================================================
          $item.prop('removeClassWithTimeout', setTimeout(function () {
            removeClassesFrom($item);
          }, timeoutRemove));
        },
        clearTimeoutRemoveClass = function () {
          var $item = arguments[0] || $(config.item, $element);

          var removeTimeoutWTO = $item.prop('removeClassWithTimeout');
          if (removeTimeoutWTO) {
            $item.prop('removeClassWithTimeout', clearTimeout(removeTimeoutWTO));
          }
        },
        /*Add and remove classes*/
        addClassesTo = function () {
          var $item = arguments[0];

          if ($item.length) {
            if (config.submenuPosition) {
              dropPosition();
            }

            $item
                .addClass(config.modifiers.hover)
                .prop('isActive', true);

            if (config.siblings) {
              $item.next().addClass(config.modifiers.hoverNext);
              $item.prev().addClass(config.modifiers.hoverPrev);
            }

            _classIsAdded = true;

            $element.trigger('nav.afterHover', $item);
            console.log("~~ class hover added: ", $item);
          }
        },
        removeClassesFrom = function () {
          var $item = arguments[0] || $(config.item, $element);

          if ($item.length) {

            $item
                .removeClass(config.modifiers.hover)
                .prop('isActive', false);

            if (config.siblings) {
              $item.next().removeClass(config.modifiers.hoverNext);
              $item.prev().removeClass(config.modifiers.hoverPrev);
            }

            _classIsAdded = false;

            $element.trigger('nav.afterLeave', $item);
            console.log("~~ class hover removed: ", $item);
          }
        },
        /*Immediate add and remove classes*/
        forceAddClassTo = function () {
          var $item = arguments[0] || $(config.item, $element);

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $eachCurItem = $(this);

            // Отметить добавление класса с задержкой
            // ====================================================
            clearTimeoutAddClass($eachCurItem);

            // Добавить класс без задержки
            // ====================================================
            if (!$eachCurItem.prop('isActive')) {
              addClassesTo($eachCurItem);
            }
          });
        },
        forceRemoveClassFrom = function () {
          var $item = arguments[0] || $(config.item, $element);
          // Если вторым параметром передать true, классы будут удалены и с дочерних пунктов
          var cond = arguments[1];

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $eachCurItem = $(this);

            // Отметить удаление класса с задержкой
            // ====================================================
            clearTimeoutRemoveClass($eachCurItem);

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
              $.each($eachCurItem.find(config.item), function () {
                var $eachCurChild = $(this);

                // Отметить удаление класса с задержкой
                // ====================================================
                clearTimeoutRemoveClass($eachCurChild);

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
              removeClassesFrom($(config.item, $element).filter('.' + config.modifiers.hover));

              console.log('%c >>>remove by WIDTH RESIZE<<<', 'background-color: #00f1ff; color: #ff1515');
              // $(window).trigger('resizeByWidth');
              prevWidth = currentWidth;
            }
          });
        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {

            if (!_classIsAdded || $(event.target).closest($(config.item)).length) return;

            console.log('%c >>>remove by click OUTSIDE<<<', 'background-color: #00f1ff; color: #ff1515');

            forceRemoveClassFrom();
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (_classIsAdded && event.keyCode === 27) {

              console.log('%c >>>remove by click ESC<<< ', 'background-color: #00f1ff; color: #ff1515');

              forceRemoveClassFrom();
            }
          });

          return false;
        },
        /*Main events*/
        toggleActiveClass = function () {
          var $item = $(config.item, $element);

          // Обработка событий прикосновения к тачскрину,
          // а также ввода и вывода курсора
          // ====================================================
          $element
              .off('touchend mouseenter mouseleave', config.item)
              .on('touchend mouseenter mouseleave', config.item, function (e) {

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
                var $curParentItems = $curItem.parentsUntil($element, config.item);

                // События на TOUCHEND (для тачскринов)
                // ====================================================
                if (e.handleObj.origType === "touchend" && !config.arrowEnable) {
                  console.log('%c >>>touchend<<< ', 'background: #222; color: #bada55');

                  if (!$curItem.prop('isActive')) {
                    // Если пункт НЕАКТИВЕН
                    // ====================================================

                    // Удалить БЕЗ ЗАДЕРЖКИ классы hover со ВСЕХ активных пунктов,
                    // кроме ТЕКУЩЕГО.
                    // ====================================================
                    if (!e.stopEventTouchend) {
                      e.stopEventTouchend = true;
                      removeClassesFrom($item.filter('.' + config.modifiers.hover).not($curItem));
                    }

                    // Если текущий пункт не содержит подменю,
                    // то выполнение функции прекратить
                    // !!! Эта проверка проводится в самом конце,
                    //     чтобы можно было удалять активные классы
                    //     при клике на любой пункт, а не только
                    //     содержащий в себе подменю.
                    // ====================================================
                    if (!$curItem.has(config.drop).length) return;

                    // Добавить классы hover на ТЕКУЩИЙ пункт
                    // ====================================================
                    addClassesTo($curItem);

                    e.preventDefault();

                    return;
                  }
                }

                // События на ВВОД курсора
                // ====================================================
                if (e.handleObj.origType === "mouseenter") {
                  console.log('%c >>>mouseenter<<< ', 'background: #222; color: #bada55');

                  // Перед добавлением класса
                  // ОТМЕНЯЕМ УДАЛЕНИЕ класса С ЗАДЕРЖКОЙ c текущего пункта.
                  // Так как событие всплывая отрабатывает и на РОДИТЕЛЬСКИХ пунктах,
                  // то и на них будут отменены УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ,
                  // которые запускаются на событии "mouseleave".
                  // ====================================================
                  clearTimeoutRemoveClass($curItem);

                  // Отлавливать событие нужно только на последнем пункте
                  // Для этого добавим в объект "stopEventMouseenter"
                  // и проверяем при всплытие события наличие этого свойства.
                  if (e.stopEventMouseenter) return;
                  e.stopEventMouseenter = true;

                  // Если пункт УЖЕ АКТИВЕН,
                  // то повторный ввод курсора в его область
                  // останавливает дальнейшее выполнение функции
                  if ($curItem.prop('isActive')) return;

                  // Удалить БЕЗ ЗАДЕРЖКИ все классы hover со всех активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ.
                  // ====================================================
                  forceRemoveClassFrom($item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems));

                  // ЗАПУСТИТЬ функцию ДОБАВЛЕНИЯ класса С ЗАДЕРЖКОЙ
                  // ====================================================
                  createTimeoutAddClass($curItem);

                  return;
                }

                // События на ВЫВОД курсора
                // ====================================================
                if (e.handleObj.origType === "mouseleave") {
                  console.log('%c >>>mouseleave<<< ', 'background: #222; color: #bada55');

                  // Перед удалением класса нужно
                  // ОТМЕНИТЬ ДОБАВЛЕНИЕ класса С ЗАДЕРЖКОЙ c текущего пункта,
                  // если функция добавления запущена.
                  // ====================================================
                  clearTimeoutAddClass($curItem);

                  // Удалить классы hover
                  // с ТЕКУЩЕГО и РОДИТЕЛЬСКИХ пунктов
                  // ЗАПУСТИТЬ функцию УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ
                  // ====================================================
                  createTimeoutRemoveClass($curItem);
                }
              });

          // Обработка события клика по стрелке
          // ====================================================
          config.arrowEnable &&
          $element.off('click', config.arrow)
              .on('click', config.arrow, function (e) {
                // Если в настройках не отключена трансформация навигации с десктопного вида в мобильный (accordionView: false),
                // то при ширине окна браузера ниже указанного в опции "accordionView.breakpoint"
                // дальнейшее выполнение функции прервать.
                // ====================================================
                if (config.accordionView && window.innerWidth < config.accordionView.breakpoint) return;

                var $curItem = $(this).closest(config.item);

                // Также выполнение функции прекратить если:
                // 1) в настройках указанно, что нужно проводить проверку на наличие подменю,
                // 2) и текущий пункт не содержит подменю.
                // ====================================================
                if (config.onlyHasDrop && !$curItem.has(config.drop).length) return;

                console.log('%c >>>arrow click<<< ', 'background: #222; color: #bada55');

                console.log("$curItem.prop('isActive'): ", $curItem.prop('isActive'));
                if (!$curItem.prop('isActive')) {
                  // Если пункт НЕАКТИВЕН
                  // ====================================================

                  // Удалить БЕЗ ЗАДЕРЖКИ классы hover со ВСЕХ активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ.
                  // ====================================================
                  var $curParentItems = $curItem.parentsUntil($element, config.item);
                  forceRemoveClassFrom($item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems));

                  /// ДОБАВИТЬ класс hover на ТЕКУЩИЙ пунт С ЗАДЕРЖКОЙ
                  // ====================================================
                  forceAddClassTo($curItem);
                } else {
                  // УДАЛИТЬ классы hover с ТЕКУЩЕГО пунта и ДОЧЕРНИХ БЕЗ ЗАДЕРЖКИ
                  // ====================================================
                  forceRemoveClassFrom($curItem, true);
                }

                e.preventDefault();
              })
        },
        /*Initialize*/
        init = function () {
          // Container
          $element.addClass(CONST_CLASSES.element);
          // Item
          $(config.item, $element).addClass(CONST_CLASSES.item);
          // Submenu
          $(config.drop, $element).addClass(CONST_CLASSES.drop);
          // Arrow
          var $arrow = $(config.arrow, $element);
          $arrow.addClass(CONST_CLASSES.arrow);
          if (config.arrowEnable) {
            $arrow.addClass(CONST_CLASSES.arrowEnable).attr('tabindex', 0);
          }
          // Position
          console.log("config.submenuPosition: ", config.submenuPosition);
          if (config.submenuPosition) {
            dropPosition();
          }

          $element.addClass(CONST_CLASSES.initClass);
          $element.trigger('nav.afterInit');
        };

    self = {
      callbacks: callbacks,
      recalculateDropPosition: recalculateDropPosition,
      toggleActiveClass: toggleActiveClass,
      clearHoverClassOnResize: removeOnResize,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.nav.callbacks();
    el.nav.recalculateDropPosition();
    el.nav.toggleActiveClass();
    el.nav.clearHoverClassOnResize();
    el.nav.removeByClickOutside();
    el.nav.removeByClickEsc();
    el.nav.init();
  }

  $.fn.nav = function () {
    
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        if (self[i].nav) {
          console.info("%c Warning! Plugin already has initialized! ", 'background: #bd0000; color: white');
          return;
        }
        self[i].nav = new Nav(self[i], $.extend(true, {}, $.fn.nav.defaultOptions, opt));

        _run(self[i]);
      } else {
        ret = self[i].nav[opt].apply(self[i].nav, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.nav.defaultOptions = {
    // Дефолтные значения указаны для
    // следующей структуры DOM:
    // ====================================================
    // <ul>     - меню (container)
    //   <li>   - пункт меню (item)
    //     <a>  - ссылка
    //     <em>  - стрелка (arrow)
    //     <ul> - подменю (drop)
    // ====================================================
    item: 'li',
    drop: 'ul',
    arrow: 'li > a + em',

    // Добавлять классы только на пункты
    // имеющие подпункты
    onlyHasDrop: false,

    // Устанавливать дополнительные классы
    // на соседние пункты активного
    siblings: false,

    // Задержка перед добавлением/удалением класса
    // По умолчанию 50ms
    // Можно указать отдельно для добавления и удаления класса
    // timeout: {
    //   add: 50,
    //   remove: 500
    // }
    // timeout: 50
    timeout: 50,

    // Использовать jQuery UI Position
    // для смещения подменю, в случае выхода за прделы экрана
    // Необходимо подключать jQuery UI
    submenuPosition: {
      firstLevel: 'left bottom',
      deeperLevel: 'right top',
      // Пересчитывать позицию подменю на ресайз и скролл
      observe: false,
    },

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

    // Навигация трансформируется в аккордеон
    accordionView: {
      // Точка, ниже которой навигация трансформируется в аккордеон
      // Необходимо укзывать всегда, если она отлична от дефолтного значения 991px
      breakpoint: 992,
    },

    // Классы-модификаторы
    modifiers: {
      hover: 'hover',
      hoverNext: 'hover_next',
      hoverPrev: 'hover_prev'
    },
  };

})(window, document, jQuery);