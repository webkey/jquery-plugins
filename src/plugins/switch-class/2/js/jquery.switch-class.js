// ==================================================
// jquery.switch-class.js
// Version: 2.0
// Description: Extended toggle class
// ==================================================

;(function (window, document, $) {
  'use strict';

  // Нужно для корректной работы с доп. классом фиксирования скролла
  var countFixedScroll = 0;

  var $W = $(window);
  var $D = $(document);

  // Inner Plugin Modifiers
  var CONST_MOD = {
    initClass: 'SwitcherClasses_initialized',
    activeClass: 'SwitcherClasses_active'
  };

  // Class definition
  // ================

  var SwitchClass = function (element, config) {
    var self = this;
    self.element = element;
    self.config = config;
    self.mixedClasses = {
      initialized: CONST_MOD.initClass + ' ' + (config.modifiers.initClass || ''),
      active: CONST_MOD.activeClass + ' ' + (config.modifiers.activeClass || ''),
      scrollFixedClass: 'css-scroll-fixed'
    };
    self.$switchClassTo = $(self.element).add(config.switcher).add(config.adder).add(config.remover).add(config.switchClassTo);
    self.classIsAdded = false;
  };

  $.extend(SwitchClass.prototype, {
    callbacks: function () {
      var self = this;
      /** track events */
      $.each(self.config, function (key, value) {
        if (typeof value === 'function') {
          $(self.element).on('switchClass.' + key, function (e, param) {
            return value(e, $(self.element), param);
          });
        }
      });
    },
    prevent: function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    toggleFixedScroll: function () {
      var self = this;
      $('html').toggleClass(self.mixedClasses.scrollFixedClass, !!countFixedScroll);
    },
    add: function () {
      var self = this;
      if (self.classIsAdded) return;

      // Callback before added class
      $(self.element)
          .trigger('switchClass.beforeAdd')
          .trigger('switchClass.beforeChange');

      if (self.config.removeExisting) {
        $.switchClass.remove(true);
      }

      // Добавить активный класс на:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      self.$switchClassTo
          .addClass(self.mixedClasses.active);

      // Сохранить в дата-атрибут текущий объект this
      $(self.element).data('SwitchClass', self);

      self.classIsAdded = true;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая ДОБАВЛЕНИЕ активного класса, увеличивается счетчик количества этих вызовов
        ++countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback after added class
      $(self.element)
          .trigger('switchClass.afterAdd')
          .trigger('switchClass.afterChange');
    },
    remove: function () {
      var self = this;

      if (!self.classIsAdded) return;
      console.log("rootSelf (REMOVE): ", self);

      // callback beforeRemove
      $(self.element)
          .trigger('switchClass.beforeRemove')
          .trigger('switchClass.beforeChange');

      // Удалять активный класс с:
      // 1) Основной элемент
      // 2) Дополнительный переключатель
      // 3) Элементы указанные в настройках экземпляра плагина
      self.$switchClassTo
          .removeClass(self.mixedClasses.active);

      // Удалить дата-атрибут, в котором хранится объект
      $(self.element).removeData('SwitchClass');

      self.classIsAdded = false;

      if (self.config.cssScrollFixed) {
        // Если в настойках указано, что нужно добавлять класс фиксации скролла,
        // То каждый раз вызывая УДАЛЕНИЕ активного класса, уменьшается счетчик количества этих вызовов
        --countFixedScroll;
        self.toggleFixedScroll();
      }

      // callback afterRemove
      $(self.element)
          .trigger('switchClass.afterRemove')
          .trigger('switchClass.afterChange');
    },
    events: function () {
      var self = this;

      $(self.element).on('click', function (event) {
        if (self.classIsAdded) {
          self.remove();

          event.preventDefault();
          return false;
        }

        self.add();

        self.prevent(event);
      });

      $(self.config.switcher).on('click', function (event) {
        var self = this;

        $(self.element).click();
        self.prevent(event);
      });

      $(self.config.adder).on('click', function (event) {
        self.add();
        self.prevent(event);
      });

      $(self.config.remover).on('click', function (event) {
        self.remove();
        self.prevent(event);
      })

    },
    removeByClickOutside: function () {
      var self = this;

      $('html').on('click', function (event) {
        console.log("self: ", self);
        if (self.classIsAdded && self.config.removeOutsideClick && !$(event.target).closest('.' + self.config.modifiers.stopRemoveClass).length) {
          console.log('ClickOutside');
          self.remove();
          // event.stopPropagation();
        }
      });
    },
    removeByClickEsc: function () {
      var self = this;

      $('html').keyup(function (event) {
        if (self.classIsAdded && self.config.removeEscClick && event.keyCode === 27) {
          self.remove();
        }
      });
    },
    init: function () {
      var self = this;

      $(self.element).addClass(self.mixedClasses.initialized);
      $(self.element).trigger('switchClass.afterInit');
    }
  });

  $.switchClass = {
    version: "2.0",
    // defaults: $.fn.switchClass.defaultOptions

    getInstance: function (command) {
      var instance = $('.' + CONST_MOD.initClass + '.' + CONST_MOD.activeClass).data("SwitchClass"),
          args = Array.prototype.slice.call(arguments, 1);

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

      // Если инстанс существует
      if (instance) {

        instance.remove();

        // Try to find and close next instance
        // 2) Если на вход функуии передан true,
        if (all === true) {
          // то попитаться найти следующий инстанс и запустить метод .close для него
          // this.remove(all);
        }
      }
    },
  };

  function _run (el) {
    el.switchClass.callbacks();
    el.switchClass.events();
    el.switchClass.removeByClickOutside();
    el.switchClass.removeByClickEsc();
    el.switchClass.init();
  }
  
  $.fn.switchClass = function (options) {
    var self = this,
        args = Array.prototype.slice.call(arguments, 1),
        l = self.length,
        i,
        ret;

    for (i = 0; i < l; i++) {
      if (typeof options === 'object' || typeof options === 'undefined') {
        self[i].switchClass = new SwitchClass(self[i], $.extend(true, {}, $.fn.switchClass.defaultOptions, options));
        _run(self[i]);
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
    removeExisting: false,

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

})(window, document, jQuery);