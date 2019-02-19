/**! jquery.ms-filters.js
 * Version: 2019.1.0
 * Author: ---
 * Description: ---
 */

;(function ($) {
  'use strict';

  var MsFilters = function (element, config) {
    var self,
        $element = $(element),
        pref = 'ms-filters',
        pluginClasses = {
          initClass: pref + '_initialized'
        };

    var callbacks = function () {
          /** track events */
          $.each(config, function (key, value) {
            if (typeof value === 'function') {
              $element.on('msFilters.' + key, function (e, param) {
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
          $element.trigger('msFilters.afterInit');
        };

    self = {
      callbacks: callbacks,
      events: events,
      init: init
    };

    return self;
  };

  $.fn.msFilters = function () {
    var _ = this,
        opt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        l = _.length,
        i,
        ret;
    for (i = 0; i < l; i++) {
      if (typeof opt === 'object' || typeof opt === 'undefined') {
        _[i].msFilters = new MsFilters(_[i], $.extend(true, {}, $.fn.msFilters.defaultOptions, opt));
        _[i].msFilters.callbacks();
        _[i].msFilters.init();
        _[i].msFilters.events();
      } else {
        ret = _[i].msFilters[opt].apply(_[i].msFilters, args);
      }
      if (typeof ret !== 'undefined') {
        return ret;
      }
    }
    return _;
  };

  $.fn.msFilters.defaultOptions = {
    modifiers: {
      activeClass: 'active' // Класс, который добавляется, на активный элементы
    }
  };

})(jQuery);