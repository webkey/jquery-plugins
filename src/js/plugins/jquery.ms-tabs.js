/**
 * ! jquery.ms-tabs.js
 * Version: 2019.1.1
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
        $select = $element.find(config.compactView.elem),
        isAnimated = false,
        activeId,
        isOpen = false,
        isSelectOpen = false,
        collapsible = $element.data('tabs-collapsible') || config.collapsible,
        pref = 'ms-tabs',
        pluginClasses = {
          initialized: pref + '_initialized',
          active: pref + '_active-tab',
          collapsible: pref + '_is-collapsible',
          selectOpen: pref + '_select-open'
        },
        mixedClasses = {
          initialized: pluginClasses.initialized + ' ' + (config.modifiers.initClass || ''),
          active: pluginClasses.active + ' ' + (config.modifiers.activeClass || ''),
          collapsible: pluginClasses.collapsible + ' ' + (config.modifiers.collapsibleClass || ''),
          selectOpen: pluginClasses.selectOpen + ' ' + (config.compactView.openClass || '')
        };

    var callbacks = function () {
      /** track events */
      $.each(config, function (key, value) {
        if (typeof value === 'function') {
          $element.on('msTabs.' + key, function (e, param) {
            return value(e, $element, param);
          });
        }
      });
    }, changeSelect = function () {
      // Изменить контент селекта при изменении активного таба
      $select.html($anchor.filter('[href="#' + activeId + '"]').html() + '<i>&#9660;</i>');
      $element.trigger('msTabs.afterSelectValChange');
    }, eventsSelect = function () {
      // Открыть переключатели табов
      $select.on('click', function () {
        // $element.add($select).toggleClass(mixedClasses.selectOpen);
        if (isSelectOpen) {
          removeOpenSelectClass();
        } else {
          addOpenSelectClass();
        }
      })
    }, addOpenSelectClass = function () {
      isSelectOpen = true;
      $element.add($select).addClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectOpen');
    }, removeOpenSelectClass = function () {
      isSelectOpen = false;
      $element.add($select).removeClass(mixedClasses.selectOpen);
      $element.trigger('msTabs.afterSelectClose');
    }, show = function () {
      // Определяем текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]'),
          $otherPanel = $panel.not('[id="' + activeId + '"]'),
          $activeAnchor = $anchor.filter('[href="#' + activeId + '"]');

      if (!isAnimated) {
        // console.log('Показать таб:', activeId);
        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(mixedClasses.active);

        // Добавить класс на каждый активный элемент
        $activePanel.add($activeAnchor).addClass(mixedClasses.active);

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
      }

      // callback after showed tab
      $element.trigger('msTabs.afterOpen');
      $element.trigger('msTabs.afterChange');
    }, hide = function () {
      // Определить текущий таб
      var $activePanel = $panel.filter('[id="' + activeId + '"]');

      if (!isAnimated) {
        // console.log("Скрыть таб: ", activeId);

        isAnimated = true;

        // Удалить активный класс со всех элементов
        $panel.add($anchor).removeClass(mixedClasses.active);

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
      $element.trigger('msTabs.afterClose');
      $element.trigger('msTabs.afterChange');
    }, hideTab = function ($_panel) {
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
    }, events = function () {
      $anchor.on('click', function (event) {
        event.preventDefault();

        var curId = $(this).attr('href').substring(1);
        // console.log("Таб анимируется?: ", isAnimated);
        // console.log("Текущий таб открыт?: ", isOpen);
        // console.log("Таб нужно закрывать, если открыт?: ", collapsible);
        // console.log("activeId (Предыдущий): ", activeId);

        if (isAnimated || !collapsible && curId === activeId) {
          return false;
        }

        if (collapsible && isOpen && curId === activeId) {
          hide();
        } else {
          activeId = curId;
          // console.log("activeId (Текущий): ", activeId);
          show();
        }

        // Изменить контент селекта
        if (config.compactView) {
          changeSelect();
          removeOpenSelectClass();
        }
      });
    }, init = function () {
      activeId = $anchor.filter('.' + pluginClasses.active).length && $anchor.filter('.' + pluginClasses.active).attr('href').substring(1);

      // console.log("activeId (сразу после инициализации): ", !!activeId);

      $anchor.filter('.' + pluginClasses.active).addClass(mixedClasses.active);

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

      if (activeId) {
        var $activePanel = $panel.filter('[id="' + activeId + '"]');

        // Добавить класс на каждый элемен
        $activePanel.addClass(mixedClasses.active);

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

      // Изменить контент селекта
      if (config.compactView) {
        changeSelect();
      }

      // Добавить специальный класс, если включена возможность
      // разворачивать/сворачивать активный таб
      if (collapsible) {
        $element.addClass(mixedClasses.collapsible);
      }

      // После инициализации плагина добавить внутренний класс и,
      // если указан в опициях, пользовательский класс
      $element.addClass(mixedClasses.initialized);

      $element.trigger('msTabs.afterInit');
    };

    self = {
      callbacks: callbacks,
      eventsSelect: eventsSelect,
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
        _[i].msTabs.eventsSelect();
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
    collapsible: false,
    compactView: false,
    modifiers: {
      initClass: null,
      collapsibleClass: null,
      activeClass: null
    }
  };

})(jQuery);