/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
  var $tabs = $('.tabs-js');

  if ($tabs.length) {
    $tabs.msTabs({
      collapsible: true,
      activeIndex: 2,
      modifiers: {
        initClass: 'MY--INITIALIZED-CLASS',
        activeClass: 'MY--ACTIVE-TAB-CLASS',
        collapsibleClass: 'MY--COLLAPSIBLE-CLASS'
      }
    });
  }

  var $cats = $('.cats-js');

  if ($cats.length) {
    $cats.msTabs({
      activeIndex: 2
    });
  }

  var $compactView = $('.compact-view-true-js');

  if ($compactView.length) {
    $compactView.msTabs({
      compactView: {
        elem: '.tabs__select-js',
        drop: '.tabs__select-drop-js',
        openClass: 'MY--SELECT-OPEN-CLASS',
        // closeByClickOutside: true,
        // closeByClickEsc: true,
      }
    });
  }

  var $compactViewOutsideFalse = $('.compact-view-true-outside-false-js');

  if ($compactViewOutsideFalse.length) {
    $compactViewOutsideFalse.msTabs({
      compactView: {
        elem: '.tabs__select-js',
        drop: '.tabs__select-drop-js',
        openClass: 'MY--SELECT-OPEN-CLASS'
      }
    });
  }
});