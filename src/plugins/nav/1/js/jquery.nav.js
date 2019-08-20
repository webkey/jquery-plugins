/*!==================================================
/*!jquery.nav.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  'use strict';

  var $window = $(window), $document = $(document);

  // If there's no jQuery, nav plugin can't work
  // ====================================================

  if (!$) return;

  // Inner Plugin Modifiers
  // ====================================================
  var CONST_CLASSES = {
    initClass: 'navJs_initialized',
    element: 'navJs',
    item: 'navJs__item',
    drop: 'navJs__drop',
    angle: 'navJs__angle',
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
        position = function (el, at) {
          $.each(el, function () {
            var el = $(this);
            var parent = el.closest(config.item);
            el.position({
              my: "left top",
              at: at,
              collision: "flip",
              of: parent
            })
          })
        },
        dropPosition = function () {
          var $childrenDrop = $element.children(config.item).children(config.drop);
          // Подменю первого уровня
          position($childrenDrop, "left bottom");
          // Подменю второго уровня
          position($childrenDrop.find(config.drop), "right top");
        },
        recalculateDropPosition = function () {
          if (config.observePosition) {
            // Recalculate on resize
            var timeoutResize;
            $window.on('resize', function () {
              clearTimeout(timeoutResize);

              timeoutResize = setTimeout(function () {
                dropPosition();
              }, 200);
            });

            // Recalculate on scroll
            var timeoutScroll;
            $window.on('scroll', function () {
              clearTimeout(timeoutScroll);

              timeoutScroll = setTimeout(function () {
                dropPosition();
              }, 200);
            });
          }
        },
        addClassesTo = function () {
          var item = arguments[0];

          if (item && item.length) {
            var $item = $(item);

            if (config.position) {
              dropPosition();
            }

            // console.log("Hover ADD: ", $item);
            $item
                .addClass(config.modifiers.hover)
                // Установить флаг активного состояния
                .prop('isActive', true);

            if (config.siblings) {
              $item.next().addClass(config.modifiers.hoverNext);
              $item.prev().addClass(config.modifiers.hoverPrev);
            }

            _classIsAdded = true;

            $element.trigger('nav.afterHover', item);
          }
        },
        removeClassesFrom = function () {
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);

          if ($item.length) {

            // console.log("Hover REM: ", $item);

            $item
                .removeClass(config.modifiers.hover)
                // Удалить флаг активного состояния
                .prop('isActive', false);

            if (config.siblings) {
              $item.next().removeClass(config.modifiers.hoverNext);
              $item.prev().removeClass(config.modifiers.hoverPrev);
            }

            _classIsAdded = false;

            $element.trigger('nav.afterBlur', item);
          }
        },
        createTimeoutAddClassTo = function () {
          // Если на вход функции не передавать элемент,
          // то очистка будет производиться на всех пунктах
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);

          // ЗАПУСТИТЬ функцию ДОБАВЛЕНИЯ класса С ЗАДЕРЖКОЙ
          // (одновременно записав ее в аттрибут 'addClassWithTimeout')
          // ====================================================
          $item.prop('addClassWithTimeout', setTimeout(function () {

            // Добавить класс hover на ТЕКУЩИЙ пункт
            addClassesTo($item);

          }, timeoutAdd));
        },
        clearTimeoutAddClassTo = function () {
          // Если на вход функции не передавать элемент,
          // то очистка будет производиться на всех пунктах
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);

          var timeoutAddClass = $item.prop('addClassWithTimeout');
          if (timeoutAddClass) {
            $item.prop('addClassWithTimeout', clearTimeout(timeoutAddClass));
          }
        },
        createTimeoutRemoveClassFrom = function () {
          // Если на вход функции не передавать элемент,
          // то очистка будет производиться на всех пунктах
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);

          // Запустить очередь удаления класса,
          // одновременно записав ее в аттрибут "prop"
          // ====================================================
          $item.prop('removeClassWithTimeout', setTimeout(function () {

            // Удалить все классы hover
            // ====================================================
            removeClassesFrom($item);

          }, timeoutRemove));
        },
        clearTimeoutRemoveClassFrom = function () {
          // Если на вход функции не передавать элемент,
          // то очистка будет производиться на всех пунктах
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);

          var timeoutRemoveClass = $item.prop('removeClassWithTimeout');
          if (timeoutRemoveClass) {
            $item.prop('removeClassWithTimeout', clearTimeout(timeoutRemoveClass));
          }
        },
        forceRemoveClassFrom = function () {
          // Если на вход функции не передавать элемент,
          // то очистка будет производиться на всех пунктах
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);
          // Если вторым параметром передать true,
          // классы будут удалены и с дочерних пунктов
          var cond = arguments[1];

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $curItem = $(this);

            // Проверить, наличие пунктов с удалением с задержкой
            // или в активном состоянии
            var timeoutRemoveClass = $curItem.prop('removeClassWithTimeout');
            if (!timeoutRemoveClass && !$curItem.prop('isActive')) return;
            // console.log("forceRemoveClassFrom Item: ", $curItem);

            // Удалить классы на активных пунктах без задержки
            $curItem.prop('removeClassWithTimeout', clearTimeout(timeoutRemoveClass));
            removeClassesFrom($curItem);

            // Чтобы провести очиску и в дочерних элементах,
            // нужно передать на вход функции вторым аргументом true
            if (cond) {
              // Перебрать всех детей активных пунктов
              // ====================================================
              $.each($curItem.find(config.item), function () {
                var $subItemCh = $(this);

                // Проверить, наличие пунктов с удалением с задержкой
                // или в активном состоянии
                var chHT = $subItemCh.prop('removeClassWithTimeout');
                if (!chHT && !$curItem.prop('isActive')) return;
                // console.log("forceRemoveClassFrom Child: ", $subItemCh);

                // 1) Очистить задержку удаления классов
                $subItemCh.prop('removeClassWithTimeout', clearTimeout(chHT));
                // 2) Удалить классы на активных пунктах
                removeClassesFrom($subItemCh);
              })
            }
          });
        },
        clearHoverClassOnResize = function () {
          var resizeByWidth = true;

          var prevWidth = -1;
          $(window).on('resize', function () {
            var currentWidth = $('body').outerWidth();
            resizeByWidth = prevWidth !== currentWidth;
            if (resizeByWidth) {
              removeClassesFrom($(config.item, $element).filter('.' + config.modifiers.hover));
              // $(window).trigger('resizeByWidth');
              prevWidth = currentWidth;
            }
          });
        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {

            if (_classIsAdded && !config.removeOutsideClick) return;

            // if ($(event.target).closest(self.$item.filter('.' + config.modifiers.hover)).length) return;

            forceRemoveClassFrom();
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (_classIsAdded && config.removeEscClick && event.keyCode === 27) {
              forceRemoveClassFrom();
            }
          });

          return false;
        },
        toggleActiveClass = function () {
          var $item = $(config.item, $element);

          // Обработка событий прикосновения к тачскрину,
          // а также ввода и вывода курсора
          // ====================================================
          $element
              .off('touchend mouseenter mouseleave', config.item)
              .on('touchend mouseenter mouseleave', config.item, function (e) {
                var $curItem = $(this);

                // Опция toggleClassCondition должна иметь значение true,
                // чтобы отрабатывало переключение классов.
                // Если параметр toggleClassCondition возвращает false,
                // то выполнение функции прекратить.
                // ====================================================
                var condition = (typeof config.toggleClassCondition === "function") ? config.toggleClassCondition() : config.toggleClassCondition;
                if (!condition) return;

                // Если:
                // 1) в настройках указанно, что нужно проводить проверку на наличие подменю;
                // 2) текущий пункт не содержит подменю;
                // то выполнение функции прекратить
                // ====================================================
                if (config.onlyHasDrop && !$curItem.has(config.drop).length) return;

                // console.log("event.handleObj.origType: ", event.handleObj.origType);

                // Родительские пункты текущего пункта
                // ====================================================
                var $curParentItems = $curItem.parentsUntil($element, config.item);

                // События на TOUCHEND
                //    (для тачскринов)
                // ====================================================
                if (e.handleObj.origType === "touchend") {
                  // console.log('Touchend to: ', $curItem);

                  // Если пункт уже АКТИВЕН
                  // ====================================================
                  if ($curItem.prop('isActive')) {
                    // Прекратить дальнейшее выполнение функции
                    // ====================================================

                    return;
                  }

                  // Если пункт НЕАКТИВЕН
                  // ====================================================

                  // Удалить все классы hover со всех активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
                  // ====================================================
                  removeClassesFrom($item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems));

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

                // События на ВВОД курсора
                // ====================================================
                if (e.handleObj.origType === "mouseenter") {
                  // Удалить БЕЗ ЗАДЕРЖКИ все классы hover со всех активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
                  console.log("mouseenter");
                  // ====================================================
                  var $activeItems = $item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems);
                  console.log("$activeItems: ", $activeItems);
                  forceRemoveClassFrom($activeItems, true);

                  // Перед добавлением класса нужно
                  // ОТМЕНИТЬ УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ c текущего пункта,
                  // если функция удаления запущена.
                  // ====================================================
                  clearTimeoutRemoveClassFrom($curItem);

                  // Если пункт УЖЕ АКТИВЕН,
                  // то повторный ввод курсора в его область
                  // останавливает дальнейшее выполнение функции
                  if ($curItem.prop('isActive')) return;

                  // ЗАПУСТИТЬ функцию ДОБАВЛЕНИЯ класса С ЗАДЕРЖКОЙ
                  // ====================================================
                  createTimeoutAddClassTo($curItem);

                  return;
                }

                if (e.handleObj.origType === "mouseleave") {

                  // Перед удалением класса нужно
                  // ОТМЕНИТЬ ДОБАВЛЕНИЕ класса С ЗАДЕРЖКОЙ c текущего пункта,
                  // если функция добавления запущена.
                  // ====================================================
                  clearTimeoutAddClassTo($curItem);

                  // ЗАПУСТИТЬ функцию УДАЛЕНИЯ класса С ЗАДЕРЖКОЙ
                  // ====================================================

                  // createTimeoutRemoveClassFrom();
                  $curItem.prop('removeClassWithTimeout', setTimeout(function () {

                    // Удалить все классы hover
                    // ====================================================
                    removeClassesFrom($item.filter('.' + config.modifiers.hover).not($curParentItems));

                  }, timeoutRemove));
                }
              });

          // Обработка события клика по стрелке
          // ====================================================
          $element.off('click', config.angle)
              .on('click', config.angle, function (e) {
                var $curItem = $(this);

                // Опция toggleClassCondition должна иметь значение true,
                // чтобы отрабатывало переключение классов.
                // Если параметр toggleClassCondition возвращает false,
                // то выполнение функции прекратить.
                // ====================================================
                var condition = (typeof config.toggleClassCondition === "function") ? config.toggleClassCondition() : config.toggleClassCondition;
                if (!condition) return;

                // Если:
                // 1) в настройках указанно, что нужно проводить проверку на наличие подменю;
                // 2) текущий пункт не содержит подменю;
                // то выполнение функции прекратить
                // ====================================================
                if (config.onlyHasDrop && !$curItem.has(config.drop).length) return;

                if ($curItem.prop('isActive')) {
                  // Если пункт уже АКТИВЕН
                  // ====================================================
                } else {
                  // Если пункт НЕАКТИВЕН
                  // ====================================================

                  // Если при выводе курсора из пункта, курсор попадает на другой пункт,
                  // то удаление класса с активных пунктов нужно производить без задержки
                  // ====================================================
                  forceRemoveClassFrom($curItem.siblings(), true);

                  // Перед добавлением класса
                  // очистить очередь удаления класса
                  // (отменить удаления класса) c текущего пункта,
                  // если она запущена
                  // ====================================================
                  var hoverTimeoutAddFn = $curItem.prop('removeClassWithTimeout');
                  if (hoverTimeoutAddFn) {
                    $curItem.prop('removeClassWithTimeout', clearTimeout(hoverTimeoutAddFn));
                  }

                  // Родительские пункты текущего пункта
                  // ====================================================
                  var $curParentItems = $curItem.parentsUntil($element, config.item);
                }

                e.preventDefault();
              })
        },
        init = function () {
          $element.addClass(CONST_CLASSES.element);
          $(config.item, $element).addClass(CONST_CLASSES.item);
          $(config.drop, $element).addClass(CONST_CLASSES.drop);
          $(config.angle, $element).addClass(CONST_CLASSES.angle).attr('tabindex', 0);
          if (config.position) {
            dropPosition();
          }

          $element.addClass(CONST_CLASSES.initClass);
          $element.trigger('nav.afterInit');
        };

    self = {
      callbacks: callbacks,
      recalculateDropPosition: recalculateDropPosition,
      toggleActiveClass: toggleActiveClass,
      clearHoverClassOnResize: clearHoverClassOnResize,
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
    //     <em>  - стрелка (angle)
    //     <ul> - подменю (drop)
    // ====================================================
    item: 'li',
    drop: 'ul',
    angle: 'li > a + em',

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

    // Точка (включительно и ниже), в которой навигация "прячется" в бутерброд
    // Необходимо укзывать всегда, если она отлична от дефолтного значения 991px
    // breakpoint: 991,

    // Условие, при котором нужно добавлять классы.
    // Например, если классы нужно добавлять только в браузерах шире 1400px:
    // condition: function () {
    //   return window.innerWidth > 1400;
    // }
    toggleClassCondition: true,

    // Удалять классы по клику вне активного пункта
    removeOutsideClick: true,

    // Удалять классы по клику на клавишу Esc
    removeEscClick: true,

    // Использовать jQuery UI Position
    // для смещения подменю, в случае выхода за прделы экрана
    // Необходимо подключать jQuery UI
    position: false,

    // Пересчитывать позицию подменю на ресайз и скролл.
    // Параметр position должен быть в значении true
    observePosition: false,

    // Классы-модификаторы
    modifiers: {
      hover: 'hover',
      hoverNext: 'hover_next',
      hoverPrev: 'hover_prev'
    },
  };

})(window, document, jQuery);