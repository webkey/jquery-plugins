/*!==================================================
/*!jquery.plugin-name.js
/*!Version: 1
/*!Author: ---
/*!Description: ---
/*!================================================== */

;(function (window, document, $, undefined) {
  /*'use strict';*/

  // Inner Plugin Classes and Modifiers
  // ====================================================
  var pref = 'msExample';
  var CONST_CLASSES = {
    initClass: pref + '_initialized',
    element: pref,
  };

  var MsExample = function (element, config) {
    var self,
        $element = $(element);

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
          $element.addClass(CONST_CLASSES.initClass);
          $element.trigger('msExample.afterInit');
        };

    self = {
      callbacks: callbacks,
      events: events,
      init: init
    };

    return self;
  };

  function _run (el) {
    el.msExample.callbacks();
    el.msExample.events();
    el.msExample.init();
  }

  $.fn.msExample = function () {
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
        if (self[i].msExample) {
          console.info("%c Warning! Plugin already has initialized! ", 'background: #bd0000; color: white');
          return;
        }

        self[i].msExample = new MsExample(self[i], $.extend(true, {}, $.fn.msExample.defaultOptions, opt));

        _run(self[i]);
      } else {
        ret = self[i].msExample[opt].apply(self[i].msExample, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return self;
  };

  $.fn.msExample.defaultOptions = {
    modifiers: {
      activeClass: 'active' // Класс, который добавляется, на активный элементы
    }
  };

})(window, document, jQuery);