/*!==================================================
/*!jquery.rolls.js
/*!Version: 1
/*!Description: Rolls
/*!==================================================*/

;(function ($) {
  'use strict';

  var MsRolls = function (element, config) {
    var self,
        $element = $(element),
        $panel = $(config.panel, $element),
        $panelWrap = $('.rolls__panel-wrap-js', $element),
        isAnimated = false,
        pref = 'ms-rolls',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        focusElements = 'input, a, [tabindex], area, select, textarea, button, [contentEditable=true]' + config.switcher,
        positionPanelStyle = {
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%'
        },
        destroyPositionPanelStyle = {
          position: '',
          left: '',
          top: '',
          width: ''
        },
        showPanelStyles = {
          opacity: '',
          'user-select': '',
          'pointer-event': '',
          'z-index': ''
        },
        hidePanelStyles = {
          opacity: 0,
          'user-select': 'none',
          'pointer-event': 'none',
          'z-index': -1
        };

    var dataCollapsed = $element.attr('data-rolls-collapsed');
    var collapsed = (dataCollapsed === "true" || dataCollapsed === "false") ? dataCollapsed === "true" : config.collapsed;

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('msRolls.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        tabindexOn = function (_element) {
          // Все элементы _element поставить в фокус-очередь
          _element.attr('tabindex', '0');
        },
        tabindexOff = function (_element) {
          // Все элементы _element убрать с фокус-очереди
          _element.attr('tabindex', '-1');
        },
        open = function ($_panel) {
          // Если входящей Панели не существует, выполнение функции прекращается
          if (!$_panel.length) {
            return false;
          }

          //
          var $activePanelWrap = $_panel.parent(), // Ближайшая родительская обертка активной Панели
              $activeParentsPanels = $_panel.parentsUntil(element, config.panel), // Все родительские Панели активной Панели
              $otherActivePanelsWrap = $activeParentsPanels.parent(), // Все родительские Обертка активной Панели не включая ближайшую
              $otherActiveHeader = $otherActivePanelsWrap.prev(config.header), // Все родительские Обертка активной Панели не включая ближайшую
              $otherActiveParentsItems = $activeParentsPanels.parentsUntil(element, config.item); // Все родительские Элементы активной Панели

          // 1) Открыть все родительские Панели (без анимации)
          // Добавить класс на активные родительские (не ближайшие) элементы
          $activeParentsPanels
              .add($otherActiveParentsItems)
              .add($otherActiveHeader)
              .add($(config.switcher, $otherActiveHeader))
              .addClass(config.modifiers.activeClass);

          // Открывать родительские Панели необходимо, если, например, открывается вложенная Панель методом "open"
          $activeParentsPanels
              .css($.extend(destroyPositionPanelStyle, showPanelStyles))
              .data('active', true).attr('data-active', true); // Указать в data-атрибуте, что Панель открыта;

          // 2) Открыть текущую панель (с анимацией)
          $element.trigger('msRolls.beforeOpen');// Вызов события перед открытием текущей панели

          var $activeItems = $_panel.closest(config.item), // Родительский Элемент активной Панели
              $activeHeader = $activePanelWrap.prev(config.header); // Шапка активной Панели

          // Добавить класс на активные элементы
          $_panel.add($activeItems).add($activeHeader).add($(config.switcher, $activeHeader)).addClass(config.modifiers.activeClass);

          var callback = arguments[1];

          $_panel.css(showPanelStyles); // Панель делаем видимой до начала анимации

          changeHeight($activePanelWrap, $_panel.outerHeight(), function () {
            $_panel
                .css(destroyPositionPanelStyle)
                .data('active', true).attr('data-active', true); // Указать в data-атрибуте, что Панель открыта

            $activePanelWrap.css({
              position: '',
              overflow: '',
              'height': ''
            });

            if (config.accessibility) {
              // Поставить в фокус-очередь все элементы с фокусировкой внутри активной Панели
              tabindexOn($(focusElements, $_panel));

              // В неактивных Панелях все элементы с фокусировкой убрать с фокус-очереди
              tabindexOff($(focusElements, $_panel.find(config.panel).filter(function () {
                return !$(this).data('active');
              })));
            }

            // Вызов события после открытия текущей панели
            $element.trigger('msRolls.afterOpen');

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
            return false;
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
          $element.trigger('msRolls.beforeClose'); // Вызов события перед закрытием текущей панели
          var callback = arguments[1];

          closePanel($_panel, function () {
            $element.trigger('msRolls.afterClose'); // Вызов события после закрытия текущей панели

            // Вызов callback функции после закрытия панели
            if (typeof callback === "function") {
              callback();
            }
          });
        },
        closePanel = function ($_panel) {
          if (!$_panel.length) {
            return false;
          }

          var callback = arguments[1],
              $curPanelWrap = $_panel.parent(); // родительская обертка активной Панели

          var $curItems = $_panel.closest(config.item), // родительский Элемент активной Панели
              $curHeader = $curPanelWrap.prev(config.header); // Шапка активной Панели

          // Удалить активный класс со всех элементов
          $_panel.add($curItems).add($curHeader).add($(config.switcher, $curHeader)).removeClass(config.modifiers.activeClass);

          // Закрыть панель
          changeHeight($curPanelWrap, 0, function () {
            $_panel
                .css(positionPanelStyle)
                .css(hidePanelStyles)
                .data('active', false).attr('data-active', false); // Указать в data-атрибуте, что панель закрыта

            $curPanelWrap.css('height', '');

            // Web accessibility
            if (config.accessibility) {
              // Убрать с фокус-очереди все элементы с фокусировкой внутри текущей Панели
              tabindexOff($(focusElements, $_panel));
            }

            // Вызов callback функции после закрытия панели
            if (typeof callback === "function") {
              callback();
            }
          });
        },
        changeHeight = function ($_wrap, _val) {
          var callback = arguments[2];

          $_wrap.css({
            position: 'relative',
            overflow: 'hidden'
          }).animate({
            'height': _val
          }, config.animationSpeed, function () {

            if (typeof callback === "function") {
              callback();
            }

            isAnimated = false;
          });
        },
        events = function () {
          $(config.switcher, $element).on(config.event, function (event) {
            // Если панель во время клика находится в процессе анимации, то выполнение функции прекратится
            if (isAnimated) {
              event.preventDefault();
              return false;
            }

            var $currentSwitcher = $(this);

            // Если текущий пункт не содержит панелей,
            // то выполнение функции прекратится
            if (!$currentSwitcher.closest(config.item).has(config.panel).length) {
              return false;
            }

            // Начало анимирования панели
            // Включить флаг анимации
            isAnimated = true;

            event.preventDefault();

            // Определение текущей панели
            var $currentPanel = $currentSwitcher.closest(config.header).next().children(config.panel);

            // Проверка на наличише активного дата-атрибута
            if ($currentPanel.data('active')) {
              // Закрыть текущую панель
              close($currentPanel, function () {
                isAnimated = false; // Анимация завершина
              });
            } else {
              // Открыть текущую панель
              open($currentPanel, function () {
                isAnimated = false; // Анимация завершина
              });
            }
          });
        },
        init = function () {
          $panelWrap.css({
            position: 'relative',
            overflow: 'hidden'
          });

          $panel
              .css(positionPanelStyle)
              .css(hidePanelStyles);

          var $activePanel = $panel.filter('.' + config.modifiers.activeClass);

          // Определить в переменных все элементы, на которые нужно добавить активный класс
          var $activeItems = $activePanel.parents(config.item), // Все родительские Элементы активной Панели
              $parentPanels = $activePanel.parents(config.panel), // Все родительские Панели
              $allActivePanels = $activePanel.add($parentPanels), // Все активные Панели, включая текущую и родительские
              $activeHeaders = $activePanel.parents($allActivePanels).prev(), // Все Шапки родительских Элементов
              $activeSwitcher = $(config.switcher, $activeHeaders), // Все Шапки родительских Элементов
              $parentPanelsWrap = $activePanel.parents($panelWrap); // Все вспомогательные обертки родительских Панелей

          // Добавить класс на активные элементы
          $allActivePanels
              .add($activeItems)
              .add($activeHeaders)
              .add($activeSwitcher)
              .addClass(config.modifiers.activeClass);

          // Открыть активные панели
          $allActivePanels.css($.extend(destroyPositionPanelStyle, showPanelStyles));

          // На активные панели установить дата-атрибут active сo заначением true
          $allActivePanels.data('active', true).attr('data-active', true);

          // Очистить стили вспомогательных оберток активных Панелей
          $parentPanelsWrap.css({
            position: '',
            overflow: ''
          });

          // Web accessibility
          if (config.accessibility) {
            // Переключатель поставить в фокус-очередь
            tabindexOn($(config.switcher, $element));
            // Все элементы с фокусировкой внутри панелей убрать с фокус-очереди
            tabindexOff($(focusElements, $panel));
            // Все элементы с фокусировкой внутри активных панелей поставить в фокус-очередь
            tabindexOn($(focusElements, $parentPanels));
          }

          $element.addClass(pluginClasses.initClass);
          $element.trigger('msRolls.afterInit');
        };

    self = {
      callbacks: callbacks,
      open: open,
      close: close,
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
        _[i].msRolls.callbacks();
        _[i].msRolls.init();
        _[i].msRolls.events();
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
    item: '.rolls__item-js', // Общий ближайший родитель (Элемент) для переключателя и разворачивающейся панели (Далее Панель)
    header: '.rolls__header-js', // Обертка для переключателя (Шапка)
    switcher: '.rolls__switcher-js', // Переключатель состояния панели, которая относится к этому переключателю
    panel: '.rolls__panel-js', // Панель
    event: 'click', // Событие, которое разворачивает/сворачивает Панель
    animationSpeed: 300, // Скорость анимации Панели
    collapsed: true, // Параметр, указывающий на необходимось сворачивать ранее открытые Панели
    accessibility: false, // Опримизировать переключение фокуса по табу (снижает скорость выполнения скрипта)
    modifiers: {
      activeClass: 'rolls-active' // Класс, который добавляется, на активный элементы
    }
  };

})(jQuery);