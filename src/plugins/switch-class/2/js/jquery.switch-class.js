// ==================================================
// jquery.switch-class.js
// Version: 2.0
// Description: Extended toggle class
// ==================================================

;(function ($) {
  'use strict';

  // Нужно для корректной работы с доп. классом фиксирования скролла
  var countFixedScroll = 0;

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self,
        rootThis = this,
        $element = $(element),
        $html = $('html'),
        pref = 'jq-switch-class',
        pluginClasses = {
          initClass: pref + '_initialized'
        },
        mod = {
          scrollFixedClass: 'css-scroll-fixed'
        },
        $switchClassTo = $element.add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo),
        classIsAdded = false; //Флаг отвечающий на вопрос: класс добавлен?

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('switchClass.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        prevent = function (event) {
          event.preventDefault();
          event.stopPropagation();
          return false;
        },
        toggleFixedScroll = function () {
          $html.toggleClass(mod.scrollFixedClass, !!countFixedScroll);
        },
        add = function () {
          if (classIsAdded) return;

          // Callback before added class
          $element
              .trigger('switchClass.beforeAdd')
              .trigger('switchClass.beforeChange');

          if (config.removeExisting) {
            $.switchClass.remove(true);
          }

          // Добавить активный класс на:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo
              .addClass(config.modifiers.activeClass)
              .data('SwitchClass', rootThis);

          classIsAdded = true;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
            ++countFixedScroll;
            toggleFixedScroll();
          }

          // callback after added class
          $element
              .trigger('switchClass.afterAdd')
              .trigger('switchClass.afterChange');
        },
        remove = function () {
          if (!classIsAdded) return;

          // callback beforeRemove
          $element
              .trigger('switchClass.beforeRemove')
              .trigger('switchClass.beforeChange');

          // Удалять активный класс с:
          // 1) Основной элемент
          // 2) Дополнительный переключатель
          // 3) Элементы указанные в настройках экземпляра плагина
          $switchClassTo
              .removeClass(config.modifiers.activeClass)
              .removeData('SwitchClass');

          classIsAdded = false;

          if (config.cssScrollFixed) {
            // Если в настойках указано, что нужно добавлять класс фиксации скролла,
            // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
            --countFixedScroll;
            toggleFixedScroll();
          }

          // callback afterRemove
          $element
              .trigger('switchClass.afterRemove')
              .trigger('switchClass.afterChange');
        },
        events = function () {
          $element.on('click', function (event) {
            if (classIsAdded) {
              remove();

              event.preventDefault();
              return false;
            }

            add();

            prevent(event);
          });

          $(config.switcher).on('click', function (event) {
            $element.click();
            prevent(event);
          });

          $(config.adder).on('click', function (event) {
            add();
            prevent(event);
          });

          $(config.remover).on('click', function (event) {
            remove();
            prevent(event);
          })

        },
        removeByClickOutside = function () {
          $html.on('click', function (event) {
            if (classIsAdded && config.removeOutsideClick && !$(event.target).closest('.' + config.modifiers.stopRemoveClass).length) {
              remove();
              // event.stopPropagation();
            }
          });
        },
        removeByClickEsc = function () {
          $html.keyup(function (event) {
            if (classIsAdded && config.removeEscClick && event.keyCode === 27) {
              remove();
            }
          });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass).addClass(config.modifiers.initClass);
          $element.trigger('switchClass.afterInit');
        };

    self = {
      callbacks: callbacks,
      remove: remove,
      events: events,
      removeByClickOutside: removeByClickOutside,
      removeByClickEsc: removeByClickEsc,
      init: init
    };

    return self;
  };

  $.switchClass = {
    version: "2.0",
    // defaults: $.fn.switchClass.defaultOptions

    getInstance: function (command) {
      var instance = $('.active').data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

      console.log("instance instanceof SwitchClass: ", instance instanceof SwitchClass);

      if (instance instanceof SwitchClass) {
        if ($.type(command) === "string") {
          instance[command].apply(instance, args);
        } else if ($.type(command) === "function") {
          command.apply(instance, args);
        }

        return instance;
      }

      return false;
    },

    remove: function (all) {
      // Получить текущий инстанс
      var instance = this.getInstance();

      // console.log("instance: ", instance);

      // Если инстанс существует
      if (instance) {
        // 1) удалить классы с текущих элементов
        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          this.remove(all);
        }
      }
    },
  };
  
  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        self[i].switchClass.callbacks();
        self[i].switchClass.events();
        self[i].switchClass.removeByClickOutside();
        self[i].switchClass.removeByClickEsc();
        self[i].switchClass.init();
      } else {
        ret = self[i].switchClass[options].apply(self[i].switchClass, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.switchClass.defaultOptions = {
    // Remove existing classes
    // Set this to false if you do not need to stack multiple instances
    removeExisting: true,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ/УДАЛЯТЬ класс
    // {String}{JQ Object} null - '.switcher-js', или $('.switcher-js')
    adder: null,

    // Дополнительный элемент, которым можно ДОБАВЛЯТЬ класс
    // {String}{JQ Object} null - '.adder-js', или $('.adder-js')
    remover: null,

    // Дополнительный элемент, которым можно УДАЛЯТЬ класс
    // {String}{JQ Object} null - '.remover-js', или $('.remover-js')
    switchClassTo: null,

    // Один или несколько эелментов, на которые будет добавляться/удаляться активный класс (modifiers.activeClass)
    // {JQ Object} null - 1) $('html, .popup-js, .overlay-js')
    // {JQ Object} null - 2) $('html').add('.popup-js').add('.overlay-js')
    removeOutsideClick: true,

    // Удалать класс по клику по пустому месту на странице? Если по клику на определенный элемент удалять класс не нужно, то на этот элемент нужно добавить дата-антрибут [data-tc-stop]
    // {boolean} true - или false
    removeEscClick: true,

    // Удалять класс по клику на клавишу Esc?
    // {boolean} true - или false
    cssScrollFixed: false,

    // Добавлять на html дополнительный класс 'css-scroll-fixed'? Через этот класс можно фиксировать скролл методами css
    // _mixins.sass =scroll-blocked()
    // {boolean} true - или false.
    modifiers: {
      initClass: null,
      activeClass: 'active',
      stopRemoveClass: 'stop-remove-class' // Если кликнуть по елементу с этим классам, то событие удаления активного класса не будет вызвано
    },

    // Список классов-модификаторов
    switcher: null
  };

})(jQuery);