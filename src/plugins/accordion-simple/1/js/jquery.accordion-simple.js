/*!==================================================
/*!jquery.accordion-simple.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  /*'use strict';*/

  // Inner Plugin Classes and Modifiers
  // ====================================================
  var pref = 'accordionSimple';
  var CONST_CLASSES = {
    initClass: pref + '_initialized',
    element: pref,
  };

  var AccordionSimple = function (element, config) {
    var self,
        $element = $(element),
        $window = $(window),
        $html = $('html'),
        isAnimated = false;

    var attrCollapsed = $element.attr('data-clap-collapsed');
    var collapsed = (attrCollapsed === "true" || attrCollapsed === "false") ? attrCollapsed === "true" : config.collapsed;

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('accordionSimple.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        open = function ($_panel) {
          if (!$_panel.length) {
            return;
          }

          console.log('>>>open<<<');

          // Вызов события перед открытием текущей панели
          $element.trigger('msClap.beforeOpen');

          // Добавить класс на активные элементы
          $_panel.closest(config.item).addClass(config.modifiers.active);

          var callback = arguments[1];

          // Открыть панель
          $_panel
              // Открывать родительские Панели необходимо, если, например, открывается вложенная Панель методом "open"
              // Все закрытые родительские Панели открыть без анимации
              .parentsUntil($element, config.panel + ':hidden').show()

              // Указать в data-атрибуте, что родительская Панель открыта
              .data('active', true).attr('data-active', true).end()

              // Добавить активный класс на родительские Элементы
              .parentsUntil($element, config.item).addClass(config.modifiers.active).end()

              // Открыть текущую патель с анимацией
              .slideDown(config.animationSpeed, function () {
                // Указать в data-атрибуте, что Панель открыта
                $(this).data('active', true).attr('data-active', true);

                // Вызов события после открытия текущей панели
                $element.trigger('msClap.afterOpen');

                // Вызов callback функции после открытия панели
                if (typeof callback === "function") {
                  callback();
                }
              });

          if (collapsed) {
            // Проверить у соседей всех родительских Элементов наличие активных Панелей
            // Закрыть эти Панели
            var $siblingsPanel = $_panel.parentsUntil($element, config.item).siblings().find(config.panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($siblingsPanel, function () {
              isAnimated = false; // Анимация завершена
            });
          }
        },
        close = function ($_panel) {
          if (!$_panel.length) {
            return;
          }
          // Закрыть отдельно все вложенные активные панели,
          // И отдельно текущую панель.
          // Это сделано с целью определения события закрытия текущей панели отдельно.

          if (collapsed) {
            // Закрыть активные панели внутри текущей
            var $childrenOpenedPanel = $(config.panel, $_panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($childrenOpenedPanel);
          }

          // Закрыть текущую панель
          // Вызов события перед закрытием текущей панели
          $element.trigger('msClap.beforeClose');

          var callback = arguments[1];

          closePanel($_panel, function () {
            // Вызов события после закрытия текущей панели
            $element.trigger('msClap.afterClose');

            // Вызов callback функции после закрытия панели
            if (typeof callback === "function") {
              callback();
            }
          });
        },
        closePanel = function ($_panel) {
          console.log('>>>close<<<');
          var callback = arguments[1];

          // Удалить активный класс со всех элементов
          $_panel.closest(config.item).removeClass(config.modifiers.active);

          // Закрыть панель
          $_panel
              .slideUp(config.animationSpeed, function () {
                // Указать в data-атрибуте, что панель закрыта
                $(this).data('active', false).attr('data-active', false);

                // Вызов события после закрытия каждой панели
                $element.trigger('msClap.afterEachClose');

                // Вызов callback функции после закрытия панели
                if (typeof callback === "function") {
                  callback();
                }
              });
        },
        togglePanel = function () {
          $(config.switcher).on('click', function (event) {
            // Если панель во время клика находится в процессе анимации, то выполнение функции прекратится
            // Переход по ссылке не произойдет
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
        init = function () {
          $element.addClass(CONST_CLASSES.initClass);
          $element.trigger('accordionSimple.afterInit');
        };

    self = {
      callbacks: callbacks,
      togglePanel: togglePanel,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.accordionSimple.callbacks();
    el.accordionSimple.togglePanel();
    el.accordionSimple.init();
  }

  $.fn.accordionSimple = function () {
    var self = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    // Обойти все выбранные элементы по отдельности
    // и создань инстансы для каждого из них.
    // Косвенно for предохраняет от попытки
    // создания экземпляра объекта на несуществующем элементе,
    // так как l в таком случае будет равно 0, переменная i также равна 0,
    // следовательно условие i < l не выполнится
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        if (self[i].nav) {
          console.info("%c Warning! Plugin already has initialized! ", 'background: #bd0000; color: white');
          return;
        }

        self[i].accordionSimple = new AccordionSimple(self[i], $.extend(true, {}, $.fn.accordionSimple.defaultOptions, opt));

        _run(self[i]);
      } else {
        ret = self[i].accordionSimple[opt].apply(self[i].accordionSimple, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.accordionSimple.defaultOptions = {
    // Дефолтные значения указаны для следующей структуры DOM:
    // ====================================================
    // <ul>     - аккордеон
    //   <li>   - элемент аккордеона (item)
    //     <a>  - заголовок
    //     <em>  - стрелка (switcher)
    //     <ul> - панель (panel)
    // ====================================================
    item: 'li',
    panel: 'ul',
    switcher: 'li > a + em',

    // Параметр, указывающий на необходимось сворачивать ранее открытые Панели
    collapsed: true,

    // Скорость анимации Панели
    animationSpeed: 300,

    modifiers: {
      activeClass: 'active' // Класс, который добавляется, на активный элементы
    }
  };

})(window, document, jQuery);