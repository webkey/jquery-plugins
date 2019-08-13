/*!==================================================
/*!jquery.nav.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  'use strict';

  // If there's no jQuery, nav plugin can't work
  // ====================================================

  if (!$) return;

  // Inner Plugin Modifiers
  // ====================================================
  var CONST_MOD = {
    initClass: 'nav-js-initialized',
  };

  var Nav = function (element, config) {
    var self,
        $element = $(element),
        $html = $('html'),
        _classIsAdded = false;

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
        addClasses = function () {
          var item = arguments[0];

          if (item && item.length) {
            var $item = $(item);

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
          }
        },
        removeClasses = function () {
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
          }
        },
        deepClean = function () {
          var item = arguments[0] || $(config.item, $element);
          var $item = $(item);
          var args = arguments[1];

          // Перебрать все элементы
          // ====================================================
          $.each($item, function () {
            var $curItem = $(this);

            // Проверить, наличие пунктов с удалением с задержкой
            // или в активном состоянии
            var itemHoverTO = $curItem.prop('hoverTimeout');
            if (!itemHoverTO && !$curItem.prop('isActive')) return;
            // console.log("deepClean Item: ", $curItem);

            // 1) Очистить задержку удаления классов
            $curItem.prop('hoverTimeout', clearTimeout(itemHoverTO));
            // 2) Удалить классы на активных пунктах
            removeClasses($curItem);

            // Чтобы провести очиску и в дочерних элементах,
            // нужно передать на вход функции вторым аргументом true
            if (args) {
              // Перебрать всей детям активных пунктов
              // ====================================================
              $.each($curItem.find(self.$item), function () {
                var $subItemCh = $(this);

                // Проверить, наличие пунктов с удалением с задержкой
                // или в активном состоянии
                var chHT = $subItemCh.prop('hoverTimeout');
                if (!chHT && !$curItem.prop('isActive')) return;
                // console.log("deepClean Child: ", $subItemCh);

                // 1) Очистить задержку удаления классов
                $subItemCh.prop('hoverTimeout', clearTimeout(chHT));
                // 2) Удалить классы на активных пунктах
                removeClasses($subItemCh);
              })
            }
          });
        },
        clearHoverClassOnResize = function () {
          $(window).on('resize', function () {
            removeClasses($(config.item, $element).filter('.' + config.modifiers.hover));
          });
        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {

            if (_classIsAdded && !config.removeOutsideClick) return;

            // if ($(event.target).closest(self.$item.filter('.' + config.modifiers.hover)).length) return;

            deepClean();
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (_classIsAdded && config.removeEscClick && event.keyCode === 27) {
              deepClean();
            }
          });

          return false;
        },
        toggleClassHover = function () {
          var $item = $(config.item, $element),
              timeoutAdd,
              timeoutRemove;

          // Время задержки добавления/удаления классов
          // ====================================================
          timeoutAdd = timeoutRemove = config.timeout;

          if (typeof config.timeout === "object") {
            timeoutAdd = config.timeout.add;
            timeoutRemove = config.timeout.remove;
          }
          console.log("timeoutAdd: ", timeoutAdd);
          console.log("timeoutRemove: ", timeoutRemove);

          // Обработка событий прикосновения к тачскрину,
          // а также ввода и вывода курсора
          // ====================================================
          $element
              .off('touchend mouseenter mouseleave', config.item)
              .on('touchend mouseenter mouseleave', config.item, function (e) {
                var $curItem = $(this),
                    event = e;

                // Родительские пункты текущего пункта
                // ====================================================
                var $curParentItems = $curItem.parentsUntil($element, config.item);

                // В toggleClassCondition нужно передать true,
                // чтобы отрабатывало переключение классов.
                // Если параметр toggleClassCondition возвращает false,
                // то выполнение функции прекратить
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

                // События на TOUCHEND
                //    (для тачскринов)
                // ====================================================
                if (event.handleObj.origType === "touchend") {
                  // console.log('Touchend to: ', $curItem);

                  // Если пункт уже АКТИВЕН
                  // ====================================================
                  if ($curItem.prop('isActive')) {
                    // Прекратить дальнейшее выполнение функции
                    // ====================================================

                    return;
                  }

                  // Если пункт НЕ АКТИВЕН
                  // ====================================================

                  // Удалить все классы hover со всех активных пунктов,
                  // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
                  // ====================================================
                  removeClasses($item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems));

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
                  addClasses($curItem);

                  event.preventDefault();

                  return;
                }

                // События на ВВОД курсора
                // ====================================================
                if (event.handleObj.origType === "mouseenter") {

                  // Если перевод курсора происходит на соседние пункты,
                  // (а не дочерние), то
                  // очищаем задержку удаления классов на активных элементах,
                  // а затем удаляем классы без задержки.
                  // ====================================================
                  var $curSiblings = $curItem.siblings();
                  deepClean($curSiblings, true);

                  // Перед добавлением класса
                  // очистить очередь удаления класса
                  // (отменить удаления класса) c текущего пункта,
                  // если она запущена
                  // ====================================================
                  var hoverTimeoutAddFn = $curItem.prop('hoverTimeout');
                  if (hoverTimeoutAddFn) {
                    $curItem.prop('hoverTimeout', clearTimeout(hoverTimeoutAddFn));
                  }

                  // Если пункт уже активен,
                  // то повторный ввод курсора в его область
                  // останавливает дальнейшее выполнение функции
                  if ($curItem.prop('isActive')) return;

                  // console.log('Mouseenter to +=+=+=+=+=+=+: ', $curItem);

                  // Запустить очередь добавления класса,
                  // одновременно записав ее в аттрибут "prop"
                  // ====================================================
                  $curItem.prop('hoverIntent', setTimeout(function () {

                    // Удалить все классы hover со всех активных пунктов,
                    // кроме ТЕКУЩЕГО и РОДИТЕЛЬСКИХ
                    // ====================================================
                    removeClasses($item.filter('.' + config.modifiers.hover).not($curItem).not($curParentItems));

                    // Добавить классы hover на ТЕКУЩИЙ пункт
                    addClasses($curItem);

                  }, timeoutAdd));

                  return;
                }

                if (event.handleObj.origType === "mouseleave") {

                  // console.log('Mouseleave from +=+=+=+=+=+=+: ', $curItem);

                  // Перед удалением класса
                  // очистить очередь добавления класса
                  // (отменить добавление класса) на текущем пункта,
                  // если она запущена
                  // ====================================================
                  var hoverTimeoutRemoveFn = $curItem.prop('hoverIntent');
                  if (hoverTimeoutRemoveFn) {
                    $curItem.prop('hoverIntent', clearTimeout(hoverTimeoutRemoveFn));
                  }

                  // Запустить очередь удаления класса,
                  // одновременно записав ее в аттрибут "prop"
                  // ====================================================

                  $curItem.prop('hoverTimeout', setTimeout(function () {

                    // Удалить все классы hover
                    // ====================================================
                    removeClasses($item.filter('.' + config.modifiers.hover).not($curParentItems));

                  }, timeoutRemove));
                }
              });
        },
        init = function () {
          $element.addClass(CONST_MOD.initClass);
          $element.trigger('nav.afterInit');
        };

    self = {
      callbacks: callbacks,
      toggleClassHover: toggleClassHover,
      clearHoverClassOnResize: clearHoverClassOnResize,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.nav.callbacks();
    el.nav.toggleClassHover();
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
    //     <ul> - подменю (drop)
    // ====================================================
    item: 'li',
    drop: 'ul',

    // Добавлять классы только на пункты
    // имеющие подпункты
    onlyHasDrop: false,

    // Задержка перед добавлением/удалением класса
    // По умолчанию 50ms
    // Можно указать отдельно для добавления и удаления класса
    // timeout: {
    //   add: 50,
    //   remove: 500
    // }
    // timeout: 50
    timeout: 50,

    // Устанавливать дополнительные классы
    // на соседние пункты активного
    siblings: false,

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

    modifiers: {
      hover: 'hover',
      hoverNext: 'hover_next',
      hoverPrev: 'hover_prev'
    }
  };

})(window, document, jQuery);