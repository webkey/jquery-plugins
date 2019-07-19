/*!==================================================
/*!jquery.nav.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  'use strict';

  // If there's no jQuery, nav plugin can't work
  // =========================================

  if (!$) {
    return;
  }

  // Check if nav plugin is already initialized
  // ========================================

  if ($.fn.nav) {
    console.info("nav plugin already initialized");

    return;
  }

  var Nav = function (element, config) {
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
              $element.on('nav.' + key, function (e, param) {
                return value(e, $element, param);
              });
            }
          });
        },
        events = function () {
          // $element.on('mouseenter', function (event) {
          //   event.preventDefault();
          //   alert("Let's go!");
          // });
        },
        init = function () {
          $element.addClass(pluginClasses.initClass);
          $element.trigger('nav.afterInit');
        };

    self = {
      callbacks: callbacks,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.nav = function () {
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
        _[i].nav = new Nav(_[i], $.extend(true, {}, $.fn.nav.defaultOptions, opt));
        _[i].nav.callbacks();
        _[i].nav.init();
        _[i].nav.events();
      } else {
        ret = _[i].nav[opt].apply(_[i].nav, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.nav.defaultOptions = {
    modifiers: {
      activeClass: 'active' // Класс, который добавляется, на активный элементы
    }
  };

})(window, document, jQuery);