/*!==================================================
/*!jquery.accordion-simple.js
/*!Version: 1
/*!Author: *
/*!Description: Accordion
/*!================================================== */

;(function (window, document, $, undefined) {
  /*'use strict';*/

  // Inner Plugin Classes and Modifiers
  // ====================================================
  var PREF = 'jsAccordionSimple';
  var CONST_CLASSES = {
    element: PREF,
    initClass: PREF + '_initialized',
    block: PREF + '__block',
    switcher: PREF + '__switcher',
    panel: PREF + '__panel',
  };

  var AccordionSimple = function (element, config) {
    var self,
        $element = $(element),
        $window = $(window),
        $html = $('html'),
        isAnimated = false;

    var attrCollapsed = $element.attr('data-clap-collapsed');
    var collapsed = (attrCollapsed === 'true' || attrCollapsed === 'false') ? attrCollapsed === 'true' : config.collapsed;

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
        open = function ($panel) {
          if (!$panel.length) return;

          console.log('>>>open<<<');

          // Вторым аргументо передать функцию обратного вызова
          var callback = arguments[1];

          // Вызов события перед открытием текущей панели
          $element.trigger('accordionSimple.beforeOpen');

          // Добавить класс на активные элементы
          $panel.closest(config.block).addClass(config.modifiers.activeClass);

          // Открыть панель
          // 1) Все закрытые РОДИТЕЛЬСКИЕ ПАНЕЛИ открыть без анимации
          // Открывать родительские Панели необходимо, если, например, открывается вложенная Панель методом "open"
          $panel
              .parentsUntil($element, config.panel + ':hidden').show()

          // Указать в data-атрибуте, что РОДИТЕЛЬСКАЯ ПАНЕЛЬ открыта
              .data('active', true).attr('data-active', true).end()

          // Добавить активный класс на РОДИТЕЛЬСКИЕ БЛОКИ
              .parentsUntil($element, config.block).addClass(config.modifiers.activeClass).end()

          // Открыть ТЕКУЩУЮ ПАТЕЛЬ с анимацией
              .slideDown(config.duration, function () {
                // Указать в data-атрибуте, что текущая патель открыта
                $(this).data('active', true).attr('data-active', true);

                // Вызов события после открытия текущей панели
                $element.trigger('accordionSimple.afterOpen');

                // Вызов callback функции после открытия панели
                if (typeof callback === 'function') {
                  callback();
                }
              });

          if (collapsed) {
            // Проверить у соседей всех родительских Элементов наличие активных Панелей
            // Закрыть эти Панели
            var $siblingsPanel = $panel.parentsUntil($element, config.block).siblings().find(config.panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($siblingsPanel, function () {
              isAnimated = false; // Анимация завершена
            });
          }
        },
        close = function ($panel) {
          if (!$panel.length) {
            return;
          }
          // Закрыть отдельно все вложенные активные панели,
          // И отдельно текущую панель.
          // Это сделано с целью определения события закрытия текущей панели отдельно.

          if (collapsed) {
            // Закрыть активные панели внутри текущей
            var $childrenOpenedPanel = $(config.panel, $panel).filter(function () {
              return $(this).data('active');
            });

            closePanel($childrenOpenedPanel);
          }

          // Закрыть текущую панель
          // Вызов события перед закрытием текущей панели
          $element.trigger('accordionSimple.beforeClose');

          var callback = arguments[1];

          closePanel($panel, function () {
            // Вызов события после закрытия текущей панели
            $element.trigger('accordionSimple.afterClose');

            // Вызов callback функции после закрытия панели
            if (typeof callback === 'function') {
              callback();
            }
          });
        },
        closePanel = function ($panel) {
          console.log('>>>close<<<');
          var callback = arguments[1];

          // Удалить активный класс со всех элементов
          $panel.closest(config.block).removeClass(config.modifiers.activeClass);

          // Закрыть панель
          $panel
              .slideUp(config.duration, function () {
                // Указать в data-атрибуте, что панель закрыта
                $(this).data('active', false).attr('data-active', false);

                // Вызов события после закрытия каждой панели
                $element.trigger('accordionSimple.afterEachClose');

                // Вызов callback функции после закрытия панели
                if (typeof callback === 'function') {
                  callback();
                }
              });
        },
        togglePanel = function () {
          $(config.switcher).on('click', function (event) {

            // Если в настройках указанно условые отключения аккордеона,
            // то при выполнении этого условия дальнеейшее выполнение функции прекратить
            if (config.destroy) {
              // При этом, если условие является функцией, то вызывается эта функция,
              var cond = (typeof config.destroy.condition === 'function') ? config.destroy.condition() : config.destroy.condition;

              if (cond) return;
            }

            // Если панель во время клика находится в процессе анимации, то выполнение функции прекратить
            // Если переключатель является ссылкой, переход по ссылке НЕ произойдет
            if (isAnimated) {
              event.preventDefault();
              return false;
            }

            // Если текущий пункт не содержит панелей, то выполнение функции прекратить
            // Если переключатель является ссылкой, переход по ссылке произойдет
            var $currentSwitcher = $(this);
            if (!$currentSwitcher.closest(config.block).has(config.panel).length) {
              return false;
            }

            // Начало анимирования панели
            isAnimated = true;

            // Если переключатель является ссылкой, переход по ссылке НЕ произойдет
            event.preventDefault();

            var $currentPanel = $currentSwitcher.closest(config.switcher).siblings(config.panel);

            if ($currentPanel.data('active')) {
              // Закрыть текущую панель
              close($currentPanel, function () {
                // Анимированные панели закончено
                isAnimated = false;
              });
            } else {
              // Открыть текущую панель
              open($currentPanel, function () {
                // Анимированные панели закончено
                isAnimated = false;
              });
            }
          });
        },
        init = function () {
          // Развернуть ВИДИМЫЕ ПАНЕЛИ без анимации
          var $visibleDrop = $(config.panel, $element);

          $visibleDrop.filter(':visible')
              .show().data('active', true).attr('data-active', true);

          $visibleDrop.filter(':visible')
              .closest(config.block).addClass(config.modifiers.activeClass);

          // Добавить внутренние классы на:
          if (config.pluginClasses) {
            // Контейнер аккордеона
            $element.addClass(CONST_CLASSES.element);

            // Блок
            $(config.block, $element).addClass(CONST_CLASSES.block);

            // Переключатель
            var $switcher = $(config.switcher, $element);
            $switcher.addClass(CONST_CLASSES.switcher);

            // Панель
            $(config.panel, $element).addClass(CONST_CLASSES.panel);
          }

          // Добавить tabindex на переключатели
          if (config.switchersTabindex) {
            $switcher.addClass(CONST_CLASSES.switchersTabindex).attr('tabindex', 0);
          }

          // Add initialization class
          $element.toggleClass(CONST_CLASSES.initClass, config.pluginClasses);

          // Fire event after initialization
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
        if (self[i].accordionSimple) {
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
    // <ul>     - аккордеон - ЭЛЕМЕНТ
    //   <li>   - элемент аккордеона (block), пара переключателя и панели - БЛОК
    //     <a>  - заголовок - ЗАГОЛОВОК
    //     <em>  - стрелка (switcher), или другой элемент переключающий панели - ПЕРЕКЛЮЧАТЕЛЬ
    //     <ul> - панель (panel) - ПАНЕЛЬ
    block: 'li',
    switcher: 'li > em',
    panel: 'ul',

    // Параметр, указывающий на необходимось сворачивать ранее открытые Панели
    collapsed: true,

    // Скорость анимации Панели
    duration: 300,

    // Добавить tabindex на элемент переключающий панели
    switchersTabindex: false,

    // Условие, при котором аккордеон не реагирует на события.
    // При этом, если условие является функцией, то проверка производится при каждом вызоме,
    // а если - простотым значение, то при загрузке страницы.
    destroy: false,
    // destroy: {
    //   condition: window.innerWidth >= 992,
    // },

    // Условие добавление внутренних классов.
    // Если false, то классы не добавлять
    pluginClasses: true,

    modifiers: {
      activeClass: 'is-open' // Класс, который добавляется, на активный элементы
    }
  };

})(window, document, jQuery);