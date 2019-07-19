// !==================================================
// !jquery.plugin-name.js
// !Version: 1
// !Author: ---
// !Description: ---
// !==================================================

;(function ($) {
  'use strict';

  var MsExample = function (element, config) {
    var self,
        $element = $(element),
        pref = 'ms-example',
        pluginClasses = {
          initClass: pref + '_initialized'
        };

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('msExample.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        events = function () {
          $element.on('mouseenter', function (event) {
            event.preventDefault();
            alert("Let's go!");
          });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass);
          $element.trigger('msExample.afterInit');
        };

    self = {
      callbacks: callbacks,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msExample = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
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
        _[i].msExample = new MsExample(_[i], $.extend(true, {}, $.fn.msExample.defaultOptions, opt));
        _[i].msExample.callbacks();
        _[i].msExample.init();
        _[i].msExample.events();
      } else {
        ret = _[i].msExample[opt].apply(_[i].msExample, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msExample.defaultOptions = {
    modifiers: {
      activeClass: 'active' // Класс, который добавляется, на активный элементы
    }
  };

})(jQuery);