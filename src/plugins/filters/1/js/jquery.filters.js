// !==================================================
// !jquery.filters.js
// !Version: 2019.1.0
// !Author: ---
// !Description: ---
// !==================================================

;(function ($) {
  'use strict';

  var MsFilters = function (element, config) {
    var self,
        $element = $(element),
        $filters = $(config.filters, $element),
        $group = $(config.group, $element),

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
        enabledButton = function ($_element){
          $_element.prop('disabled', false);
        },
        disabledButton = function ($_element){
          $_element.prop('disabled', true);
        },
        getFilterState = function ($_filter) {
          return $_filter.prop('checked') || $_filter.attr(config.attributes.dataDefaultValue) !== undefined && $_filter.val() !== $_filter.attr(config.attributes.dataDefaultValue);
        },
        countActiveFilters = function ($_filter, $_container) {
          // Возвращает количество отмеченных (активных) фильтров
          var $curFilters = $_container.find($_filter),
              lengthActivateFilters = 0;

          // console.log("$_container: ", $_container);
          // console.log("$curFilters: ", $curFilters);

          $.each($curFilters, function () {
            var $thisFilter = $(this);

            console.log("$thisFilter: ", $thisFilter);
            console.log("getFilterState($thisFilter): ", getFilterState($thisFilter));
            getFilterState($thisFilter) && lengthActivateFilters++
          });


          return lengthActivateFilters;

          // if only checkbox
          // return $_container.find('input:checkbox:checked').length;
        },
        events = function () {
          $filters.on('change keyup', function (event) {
            event.preventDefault();

            var $curFilter = $(this);

            // console.log("event.type: ", event.type);
            // console.log("event.target.type: ", event.target.type);

            // Событие ввода с клавиатуры "keyup" должно отрабатывать только на текстовом инпуте
            if(event.type === 'keyup' && event.target.type !== 'text' ){
              return false
            }

            // фильтра с типом "input text", не должен отрабатывать на событие "change"
            if(event.type === 'change' && event.target.type === 'text' ){
              return false
            }

            var $curContainer = $element,
                $curItem = $curFilter.closest(config.item),
                $curGroup = $curFilter.closest(config.group),
                // label text for tag
                $curLabel = $curFilter.closest('label'),
                $curLabelText = $curLabel.find(config.labelText),
                // buttons
                $curBtnReset = $curItem.find(config.btnReset),
                $curBtnResetAll = $curContainer.find(config.btnResetAll);

            // На li добвить класс, если чекбокс отмечен
            $curFilter.is(':checkbox') &&
            $curFilter.closest('li').toggleClass(config.modifiers.filterActiveClass, getFilterState($curFilter));

            // Отключить кнопку очистки чекбоксов в ГРУППЕ
            disabledButton($curBtnReset);

            // Удалить класс наличия отмеченных чекбоксов в ГРУППЕ
            $curItem.removeClass(config.modifiers.filtersOnClass);

            // Отключить кнопку очистки ВСЕХ чекбоксов
            disabledButton($curBtnResetAll);

            // Удалить класс отображения панели результатов фильтрации
            $element.removeClass(config.modifiers.showResultsPanelClass);

            // Если есть активные фильтры в ГРУППЕ
            if (countActiveFilters($filters, $curGroup)) {
              // Добавить класс наличия отмеченных чекбоксов на фильтры в ГРУППЕ
              $curItem.addClass(config.modifiers.filtersOnClass);
              // Включить кнопку очистки чекбоксов в ГРУППЕ
              enabledButton($curBtnReset);
            }

            // Если есть активные фильтры
            // (проверяем ВСЕ группы фильтров)
            if (countActiveFilters($filters, $group)) {
              // включить кнопку очистки ВСЕХ чекбоксов
              enabledButton($curBtnResetAll);
              // добавить класс отображения панели результатов фильтрации
              $curContainer.addClass(config.modifiers.showResultsPanelClass);
            }

            console.log("Let's go!");
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
    filters: null,
    /**
     * @type: String
     * @default: null
     * @description: Элемент (или элементы), который является фильтром. HTML Element или CSS Selector, перечисленные через запятую.
     * @example: 'input[type="checkbox"], select, .range-slider-js, [data-filter-type="input"]'
     */
    item: '.p-filters-item-js',
    group: '.p-filters-group-js',

    handler: '.p-filters-select-js',
    placeholder: '.p-filters-placeholder-js',
    selected: '.p-filters-selected-js',
    drop: '.p-filters-drop-js',

    labelText: '.p-filters-label-text-js',
    btnReset: '.btn-reset-js',
    btnResetAll: '.btn-clear-filters-js',

    resultsPanel: '.p-filters-results-js',

    attributes: {
      dataGroup: 'data-filter-group',
      dataDefaultValue: 'data-filter-default',
      dataTag: 'data-filter-tag',
      dataName: 'data-filter-name',
      dataType: 'data-filter-type',
      dataPrefix: 'data-filter-value-prefix',
      dataPostfix: 'data-filter-value-postfix',
      dataTitle: 'data-filter-title',
      tagTitle: 'title'
    },

    modifiers: {
      dropOpenClass: 'p-filters-is-open',
      filtersOnClass: 'p-filters-on',
      showResultsPanelClass: 'filters-results-show',
      showSelectedClass: 'filters-selected-show', // show counter of an active filter in group
      showPlaceholderClass: 'filters-placeholder-show',
      filterActiveClass: 'is-active'
    }
  };

})(jQuery);