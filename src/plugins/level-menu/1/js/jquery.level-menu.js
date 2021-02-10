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
    selected: PREF + '_selected',
    selectedPrev: PREF + '_selected-prev',
    selectedNext: PREF + '_selected-next',
    collapsible: PREF + '_collapsible'
  };

  var LevelMenu = function (element, config) {
    var self;
    var $element = $(element);
    var $html = $('html');

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
      selected: CONST_CLASSES.selected + ' ' + (config.modifiers.selected || ''),
      selectedPrev: CONST_CLASSES.selectedPrev + ' ' + (config.modifiers.selectedPrev || ''),
      selectedNext: CONST_CLASSES.selectedNext + ' ' + (config.modifiers.selectedNext || ''),
      collapsible: CONST_CLASSES.collapsible + ' ' + (config.modifiers.collapsible || ''),
    };

    // События resize, scroll по таймауту
    // ==================================
    var timeoutEvent;
    $window.on('resize', function (e) {
      clearTimeout(timeoutEvent);

      timeoutEvent = setTimeout(function () {
        if (e.handleObj.origType === "resize") {
          $window.trigger('rangeResize');
        }
      }, 300);
    });

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('levelMenu.' + key, function (e, param) {
                // Отлавливать событие нужно только на целевом элементе.
                // Если элементы, на которых инитится плагин будут вложены друг в друга,
                // всплывая событие будет отлавливатся не только на дочерних элементах, но и на родителях.
                // Для того, чтобы ограничить отлавливание события только дочерним элементом
                // добавляем в объект события параметр "handled"
                // и проверяем при всплытие события наличие этого параметра.
                if (!e.handled) {
                  e.handled = true;
                  return value(e, $element, param);
                }
              });
            }
          });
        },

        // HIDE/SHOW PANELS
        // ================
        showPanel = function (force) {
          // console.log('activeId: ', activeId);
          // console.log('show: ', $element);

          $element.trigger('levelMenu.beforeShow');
          $element.trigger('levelMenu.beforeChange');

          // Определяем текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]');
          var $otherPanel = $panel.not('[id="' + activeId + '"]');
          var $activeThumb = $thumb.filter('[data-for="' + activeId + '"]');

          if (!$activePanel.length) {
            console.error('Element with id="' + activeId + '" not exist');
            return;
          }

          // Удалить классы
          removeClassesFrom($panel.add($thumb.parent()));

          // Добавить классы
          addClassesTo($activePanel.add($activeThumb.parent()));

          // var duration = force ? 0 : config.animationSpeed;
          if (force) {
            // Блок, который находится в состоянии анимации перевести в конечное состояние
            // При это фалг isAnimated принимает значение "false"
            $panel.filter(':animated').stop(true, true);

            // Вернуть флагу значение "true", так как общий контейнер продолжает анимироваться
            isAnimated = true;

            // Очистить очередь анимаций общего контейнера
            // В очередь добавляются анимации при частом наведении на разные переключатели
            $panels.queue('fx', []);
            $panels.stop();

            // Анимирование общего контейнера блоков
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': $activePanel.outerHeight()
                }, config.animationSpeed, function () {

                  // Анимация полностью завершена
                  $panels.css({
                    'height': '',
                    'overflow': ''
                  });

                  isAnimated = false;
                });

            // Скрыть все блоки, кроме активного
            hideTargetPanel($otherPanel, true);

            // Показать активный блок
            $activePanel
                .css({
                  'z-index': 2,
                  'visibility': 'visible',
                  'opacity': 1,
                  'position': 'relative',
                  'left': 'auto',
                  'top': 'auto',
                  'pointer-events': ''
                });

            isOpen = true;

            $element.trigger('levelMenu.afterShow');
            $element.trigger('levelMenu.afterChange');
          } else {
            if (!isAnimated) {
              isAnimated = true;

              // Анимирование общего контейнера блоков
              $panels
                  .css('overflow', 'hidden')
                  .animate({
                    'height': $activePanel.outerHeight()
                  }, config.animationSpeed);

              // Скрыть все блоки, кроме активного
              hideTargetPanel($otherPanel);

              // Показать активный блок
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

              $element.trigger('levelMenu.afterShow');
              $element.trigger('levelMenu.afterChange');
            }
          }
        },

        hidePanel = function (force) {
          // console.log('activeId: ', activeId);
          // console.log('hide: ', $element);

          if (!activeId) {
            return;
          }

          $element.trigger('levelMenu.beforeHide');
          $element.trigger('levelMenu.beforeChange');

          // Определить текущий таб
          var $activePanel = $panel.filter('[id="' + activeId + '"]');

          if (!$activePanel.length) {
            console.error('Element with id="' + activeId + '" not exist');
            return;
          }

          // Удалить активный класс со всех элементов
          removeClassesFrom($panel.add($thumb.parent()));

          activeId = null;

          if (force) {
            // Блок, который находится в состоянии анимации перевести в конечное состояние
            // При это фалг isAnimated принимает значение "false"
            $panel.filter(':animated').stop(true, true);

            // Вернуть флагу значение "true", так как общий контейнер продолжает анимироваться
            isAnimated = true;

            // Очистить очередь анимаций общего контейнера
            // В очередь добавляются анимации при частом наведении на разные переключатели
            $panels.queue('fx', []);
            $panels.stop();

            // Анимирование общего контейнера блоков
            $panels
                .css('overflow', 'hidden')
                .animate({
                  'height': 0
                }, config.animationSpeed);

            hideTargetPanel($activePanel, true, function () {
              $panels.css({
                'height': ''
              });

              isOpen = false;
              isAnimated = false;

              $element.trigger('levelMenu.afterHide');
              $element.trigger('levelMenu.afterChange');
            });
          } else {
            if (!isAnimated) {
              // Анимирование общего контейнера блоков
              $panels
                  .css('overflow', 'hidden')
                  .animate({
                    'height': 0
                  }, config.animationSpeed);

              hideTargetPanel($activePanel, false, function () {
                $panels.css({
                  'height': ''
                });

                isOpen = false;
                isAnimated = false;

                $element.trigger('levelMenu.afterHide');
                $element.trigger('levelMenu.afterChange');
              });
            }
          }
        },

        hideTargetPanel = function ($targetPanel, force, callback) {
          // force - отключить анимацию;
          // callback - вызов функции после окончания анимации;
          var duration = force ? 0 : config.animationSpeed;
          $targetPanel
              .css({
                'z-index': -1
              })
              // .attr('tabindex', -1)
              .animate({
                'opacity': 0
              }, duration, function () {
                $targetPanel.css({
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
        // HIDE/SHOW PANELS end

        /*Add classes*/
        addClassesTo = function () {
          var $item = arguments[0];

          if ($item.length) {
            $item
                .addClass(pluginClasses.selected)
                .prop('isActive', true);

            if (config.prevNextClasses) {
              $item.next().addClass(pluginClasses.selectedNext);
              $item.prev().addClass(pluginClasses.selectedPrev);
            }

            isOpen = true;

            $element.trigger('levelMenu.afterAddedClass', $item);
            // console.log("~~ class selected added: ", $item);
          }
        },

        /*Add classes*/
        removeClassesFrom = function () {
          var $item = arguments[0] || $thumb;

          if ($item.length) {
            $item
                .removeClass(pluginClasses.selected)
                .prop('isActive', false);

            if (config.prevNextClasses) {
              $item.next().removeClass(pluginClasses.selectedNext);
              $item.prev().removeClass(pluginClasses.selectedPrev);
            }

            isOpen = false;

            $element.trigger('levelMenu.afterRemovedClass', $item);
            // console.log("~~ class selected removed: ", $item);
          }
        },

        /*Clear classes*/
        hideOnResize = function () {
          if (config.hideOnResize) {
            var resizeByWidth = true;
            var prevWidth = -1;
            $window.on('rangeResize', function () {
              var currentWidth = $('body').outerWidth();
              resizeByWidth = prevWidth !== currentWidth;
              if (resizeByWidth) {
                hidePanel();

                // console.log('%c >>>remove by WIDTH RESIZE<<<', 'background-color: #00f1ff; color: #ff1515');
                prevWidth = currentWidth;
              }
            });
          }
        },

        hideByClickOutside = function () {
          $html
              .on('click', function (e) {
                if (config.hideOnOutsideClick) {
                  // Сам элемент, или его родитель является переключателем
                  var isThumb = $(e.target).closest(config.thumb).length;
                  // Сам элемент, или его родитель является блоком ("panel")
                  var isPanel = $(e.target).closest(config.panel).length;
                  // Сам элемент, или его родитель соответстует селектору или набору селекторов в опции "preventElements"
                  var isPreventEl = $(e.target).closest(config.preventElements).length;

                  if (!isOpen || isThumb || isPanel || isPreventEl) return;

                  hidePanel();
                  // console.log('%c >>>remove by click OUTSIDE<<<', 'background-color: #00f1ff; color: #ff1515');
                }
              });
        },

        hideByClickEsc = function () {
          $html.keyup(function (e) {
            if (config.hideOnEscClick) {
              if (isOpen && e.keyCode === 27) {

                hidePanel();
                // console.log('%c >>>remove by click ESC<<< ', 'background-color: #00f1ff; color: #ff1515');
              }
            }
          });

          return false;
        },

        // TOGGLE PANELS
        // =============
        togglePanels = function () {
          // Обработка событий прикосновения к тачскрину,
          // а также ввода и вывода курсора
          // ====================================================
          var eventsMove;

          $element
              .off('touchend mouseenter', config.thumb)
              .on('touchend mouseenter', config.thumb, function (e) {

                // console.log('%c ~~~' + e.handleObj.origType + '~~~ ', 'background: #222; color: #bada55');

                var $curItem = $(this);

                var curId = $curItem.attr('data-for');

                // События на TOUCHEMOVE (для тачскринов)
                // ====================================================
                if (e.handleObj.origType === 'touchmove') {
                  eventsMove = e.handleObj.origType;
                  return;
                }

                // События на TOUCHEND (для тачскринов)
                // ====================================================
                if (e.handleObj.origType === 'touchend') {
                  // console.log('%c >>>touchend<<< ', 'background: #222; color: #bada55');

                  // На мобильных устройствах, если необходимо не переключить блок, а проскроллить зажав один из переключателей,
                  // то после того, как отпустишь палец, сработает событие "touchend", а оно не нужно
                  // Для предотвращения отаработки события "touchend", необходимо делать проверку на 'touchmove'
                  if (eventsMove === 'touchmove') {
                    eventsMove = null;
                    return;
                  }

                  if (curId !== activeId) {
                    // Если пункт НЕАКТИВЕН
                    // ====================================================

                    // Отлавливать событие нужно только на целевом пункте, не затрагивая родителей.
                    // Для этого добавляем в объект события параметр "handled"
                    // и проверяем при всплытие события наличие этого параметра.
                    if (e.handled) return;
                    e.handled = true;

                    if (collapsible && isOpen) {
                      if (isAnimated) {
                        hidePanel(true);
                      } else {
                        hidePanel();
                      }
                    } else {
                      activeId = curId;

                      if (isAnimated) {
                        showPanel(true);
                      } else {
                        showPanel();
                      }
                    }

                    e.preventDefault();

                    return;
                  }
                }

                // События на ВВОД курсора
                // ====================================================
                if (e.handleObj.origType === 'mouseenter') {
                  // console.log('%c >>>mouseenter<<< ', 'background: #222; color: #bada55');

                  // Отлавливать событие нужно только на целевом пункте, не затрагивая родителей.
                  // Для этого добавляем в объект события параметр "handled"
                  // и проверяем при всплытие события наличие этого параметра.
                  if (e.handled) return;
                  e.handled = true;

                  // При повторном наведении на активный пункт ничего не должно происходить (если не активирован "collapsible")
                  if (curId === activeId && !collapsible) {
                    return;
                  }

                  if (collapsible && isOpen && curId === activeId) {
                    if (isAnimated) {
                      hidePanel(true);
                    } else {
                      hidePanel();
                    }
                  } else {
                    activeId = curId;

                    if (isAnimated) {
                      showPanel(true);
                    } else {
                      showPanel();
                    }
                  }

                  // return;
                }

                // События на ВЫВОД курсора
                // ====================================================
                // if (!config.mouseleavePrevent && e.handleObj.origType === 'mouseleave') {
                //   console.log('%c >>>mouseleave<<< ', 'background: #222; color: #bada55 ', e);
                //
                //   hidePanel(true);
                // }
              });

          // События на ВЫВОД курсора
          // ====================================================
          $(config.thumb).add($(config.panel)).add(config.preventElements)
              .on('mouseleave', function (e) {
                if (!config.mouseleavePrevent) {
                  // Сам элемент, или его родитель является переключателем
                  var isThumb = $(e.relatedTarget).closest(config.thumb).length;
                  // Сам элемент, или его родитель является блоком ("panel")
                  var isPanel = $(e.relatedTarget).closest(config.panel).length;
                  // Сам элемент, или его родитель соответстует селектору или набору селекторов в опции "preventElements"
                  var isPreventEl = $(e.relatedTarget).closest(config.preventElements).length;

                  if (isThumb || isPanel || isPreventEl) {
                    return;
                  }

                  hidePanel(true);
                }
              });
        },

        /*Initialize*/
        init = function () {
          // Container
          $element.addClass(pluginClasses.element);

          // Item
          $thumb.addClass(pluginClasses.item);

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

          if ($thumb.parent().filter('.' + CONST_CLASSES.selected).length) {
            activeId = $thumb.parent().filter('.' + CONST_CLASSES.selected).find(config.thumb).attr('data-for');
          } else if ($thumb.filter('.' + config.modifiers.selected).length) {
            activeId = $thumb.parent().filter('.' + config.modifiers.selected).find(config.thumb).attr('data-for');
          } else if (config.activeIndex === 0 || config.activeIndex) {
            activeId = $thumb.eq(config.activeIndex).attr('data-for');
          }

          if (activeId) {
            var $activeAnchor = $thumb.filter('[data-for="' + activeId + '"]'),
                $activePanel = $panel.filter('[id="' + activeId + '"]');

            // Добавить класс на каждый активный элемент
            $activePanel.add($activeAnchor.parent()).addClass(pluginClasses.selected);

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
      hidePanel: hidePanel,
      togglePanels: togglePanels,
      clearSelectedClassOnResize: hideOnResize,
      hideByClickOutside: hideByClickOutside,
      hideByClickEsc: hideByClickEsc,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.levelMenu.callbacks();
    el.levelMenu.togglePanels();
    el.levelMenu.clearSelectedClassOnResize();
    el.levelMenu.hideByClickOutside();
    el.levelMenu.hideByClickEsc();
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
    // Активный класс добавляется на непосредственного родителя
    // Если, например, нужно добавлять класс на "li",
    // то "thumb" должен лежать непосредственно в "li". Вот так: "li > thumb"
    thumb: '[data-for]',
    panels: '.js-level-menu-panels',
    panel: '.js-level-menu-panel',

    // Скорость анимирования блока
    animationSpeed: 300,

    // Индекс активного блока при инициализации плагина
    // Если указать "null", то все блока будут закрыты
    // Важно! Указание активного класса в html имеет приоритет выше
    activeIndex: null,

    // Позволить попеременно открывать и закрывать блок по клику/тапу/наведению на один и тот же переключателю
    collapsible: false,

    // Устанавливать дополнительные классы
    // на соседние пункты активного
    prevNextClasses: false,

    // Не удалять класс selected при выводе курсора
    mouseleavePrevent: false,

    // Работает, если "mouseleavePrevent" установлен в значение "false"
    // Список элементов, при вводе на которые активный блок не закрывается
    preventElements: false,

    // Закрыть активный блок на ресайз
    hideOnResize: false,

    // Закрыть активный блок при клике вне переключателя
    hideOnOutsideClick: false,

    // Закрыть активный блок по клику на клавишу Escape
    hideOnEscClick: false,

    // Классы-модификаторы
    modifiers: {
      selected: 'hover',
      selectedNext: 'hover_next',
      selectedPrev: 'hover_prev',
    },
  };

})(window, document, jQuery);