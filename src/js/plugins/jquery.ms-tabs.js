/**
 * ! jquery.ms-tabs.js
 * Version: 2019.1.0
 * Author: Astronim*
 * Description: Extended toggle class
 */

;(function ($) {
  'use strict';

  var MsTabs = function (element, config) {
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
        $panel.add($anchor).removeClass(config.modifiers.activeClass);

        // Добавить класс на каждый активный элемент
        $activePanel.add($activeAnchor).addClass(config.modifiers.activeClass);

        // Анимирование высоты табов
        $panels
            .css('overflow', 'hidden')
            .animate({
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
                'top': 'auto',
                'pointer-events': ''
              }).attr('tabindex', 0);

              $panels.css({
                'height': '',
                'overflow': ''
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
        $panel.add($anchor).removeClass(config.modifiers.activeClass);

        // Анимирование высоты табов
        $panels
            .css('overflow', 'hidden')
            .animate({
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
              'visibility': 'hidden',
              'pointer-events': 'none'
            });

            // Анимация полностью завершена
            if (typeof callback === "function") {
              callback();
            }
          });
    }, events = function () {
      $anchor.on('click', function (event) {
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
        'position': 'relative'
      });

      $panel.css({
        'position': 'absolute',
        'left': 0,
        'top': 0,
        'opacity': 0,
        'width': '100%',
        'visibility': 'hidden',
        'pointer-events': 'none',
        'z-index': -1
      }).attr('tabindex', -1);

      if (activeId) {
        var $activePanel = $panel.filter('[id="' + activeId + '"]');

        // Добавить класс на каждый элемен
        $activePanel.addClass(config.modifiers.activeClass);

        // Показать активный таб
        $activePanel
            .css({
              'position': 'relative',
              'left': 'auto',
              'top': 'auto',
              'opacity': 1,
              'visibility': 'visible',
              'pointer-events': '',
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
      } else {
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
      init: 'tabs-initialized',
      activeClass: 'tabs-active'
    }
  };

})(jQuery);