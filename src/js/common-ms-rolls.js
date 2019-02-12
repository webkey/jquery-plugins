/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
  // Тест переопределения настроек глобально
  // $.fn.msRolls.defaultOptions.collapsed = false;

  var $rolls_1_1 = $('.rolls-js');

  if ($rolls_1_1.length) {

    var options = {
      collapsed: true
      // , modifiers: {
      // 	activeClass: 'tab-poookkhh'
      // }
      , animationSpeed: 500
      , accessibility: false // Включить переходы табом
      // , event: 'mouseenter'
      // , collapsed: false
      , modifiers: {
        activeClass: 'is-open'
      }
      , beforeOpen: function (e, el) {
        console.log('.beforeOpen');
      }
      , afterOpen: function () {
        console.log('.afterOpen');
      }
      , beforeClose: function () {
        console.log('.beforeClose');
      }
      , afterClose: function () {
        console.log('.afterClose');
      }
    };

    var myRolls = $rolls_1_1.on('msRolls.afterInit', function () {
      console.log('Plugin MS-Rolls has initialized!');
    }).msRolls(options);

    // Тестирование метода "open"
    // Первый параметр: название метода
    // Второй параметр: селектор
    // Трений параметр: callback-функция
    $('.open-panel-js').on('click', function () {
      myRolls.msRolls('open', $('#hashExpl'), function () {
        console.log('Панель #hashExpl открыта!');
      });
    });
  }
});