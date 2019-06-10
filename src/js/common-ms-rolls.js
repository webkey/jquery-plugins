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

    // Добавляем елемент роллов динамически
    var tplNewRollsItem = '<div class="rolls__header rolls__header-js">\n' +
        '        <a href="#">{{Title 1.4 added after initialized}}</a>\n' +
        '        <a href="#" class="rolls__angle rolls__switcher-js">&nbsp;</a>\n' +
        '      </div>\n' +
        '      <div class="rolls__panel-wrap-js">\n' +
        '        <div class="rolls__panel rolls__panel-js">\n' +
        '          <div>{{Content 1.4}} <br> {{Content 1.4}} <br> {{Content 1.4}}</div>\n' +
        '          <div class="rolls__item rolls__item-js">\n' +
        '            <div class="rolls__header rolls__header-js">\n' +
        '              <a href="#">{{Title 1.4 - 2.1}}</a>\n' +
        '              <a href="#" class="rolls__angle rolls__switcher-js">&nbsp;</a>\n' +
        '            </div>\n' +
        '            <div class="rolls__panel-wrap-js">\n' +
        '              <div class="rolls__panel rolls__panel-js">\n' +
        '                <div>{{Content 1.4 - 2.1}} <br> {{Content 1.4 - 2.1}}</div>\n' +
        '              </div>\n' +
        '            </div>\n' +
        '          </div>\n' +
        '        </div>';
    setTimeout(function () {
      $('#add-rolls-item').html(tplNewRollsItem);
      myRolls.msRolls('init', function () {
        console.log('init!');
      });
    }, 1500);
  }
});