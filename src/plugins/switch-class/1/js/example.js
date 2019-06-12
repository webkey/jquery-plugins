/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
  // Для адаптива
  // На примере навигации
  var $nav = $('.nav-opener-js'),
      nav;
  if ($nav.length) {
    nav = $nav.switchClass({
      switchClassTo: $('.shutter--nav-js').add('.nav-overlay-js')
      , modifiers: {
        activeClass: 'nav-is-open',
        stopRemoveClass: 'stop-nav-remove-class'
      }
      , cssScrollFixed: true
      , beforeAdded: function () {
        $('html').addClass('open-only-mob');
        // open-only-mob - используется для адаптива

        // пример добавления классов с задержкой
        var $curItem = $('.nav-js').children(), speed = 1000;

        $('.nav-js').prop('counter', 0).animate({
          counter: $curItem.length
        }, {
          duration: speed,
          easing: 'swing',
          step: function (now) {
            $curItem.eq(Math.round(now)).addClass('show-nav-item')
          }
        });
      }
      , beforeRemoved: function () {
        $('html').removeClass('open-only-mob');
        // open-only-mob - используется для адаптива
        $('.nav-js').stop().children().removeClass('show-nav-item')
      }
    });
  }

  // Первый свитчер
  var $switcher1 = $('.tc-js'),
      tc1;
  if ($switcher1.length) {
    var options = {
      // /*options*/
      switcher: '.tc__switcher-js'
      , adder: '.tc__opener-js'
      , remover: '.tc__remover-js'
      , switchClassTo: $('.tc__popup-js').add('.tc__overlay-js')
      , modifiers: {
        activeClass: 'active'
      }
      , cssScrollFixed: false
      , removeOutsideClick: true
    };

    // $switcher1.switchClass();

    // tc1 = $switcher1.switchClass(options);
    setTimeout(function () {
      // Добавить кнопку(и) динамически
      $('#add-switcher').html('<a href="#" class="tc__switcher-js"><span>Открыть попап 1 (switcher) (loaded)</span></a>');
      tc1 = $switcher1.switchClass(options);
    }, 1500);
  }

  // Второй свитчер
  var $switcher2 = $('.tc-2-js'),
      tc2;
  if ($switcher2.length) {
    tc2 = $switcher2.switchClass({
      remover: '.tc-2__remover-js'
      , adder: '.tc-2__opener-js'
      , switchClassTo: $('.tc-2__popup-js').add('.tc__overlay-js')
      , modifiers: {
        activeClass: 'is-open'
      }
      , cssScrollFixed: true
      , beforeAdded: function () {
        // console.log('beforeAdded 2');
      }
      , afterRemoved: function () {
        // console.log('afterRemoved 2');
      }
    });
  }

  setTimeout(function () {
    $('#add-switcher-02').html('<a href="#" class="tc-3-js"><span>Открыть попап 3 (loaded)</span></a>');

    // Трений свитчер. Добавляется на страницу динамически
    var $switcher3 = $('.tc-3-js');
    var tc3 = $switcher3.switchClass({
      switcher: '.tc-3__switcher-js'
      , remover: '.tc-3__remover-js'
      , switchClassTo: $('.tc-3__popup-js').add('.tc__overlay-js')
      , modifiers: {
        activeClass: 'active'
      }
      , cssScrollFixed: true
      , beforeAdded: function () {
        // console.log('beforeAdded 3');
        // Если нужно удалять уже добавленные классы одного экземпляра плагина, при добавлении другого
        tc1.switchClass('remove');
        tc2.switchClass('remove');
      }
      , afterRemoved: function () {
        // console.log('afterRemoved 3');
      }
    });

    tc2.on('switchClass.beforeAdded', function () {
      tc1.switchClass('remove');
      tc3.switchClass('remove');
      nav.switchClass('remove');
    });
    tc1.on('switchClass.beforeAdded', function () {
      tc2.switchClass('remove');
      tc3.switchClass('remove');
      nav.switchClass('remove');
    });
    nav.on('switchClass.beforeAdded', function () {
      tc1.switchClass('remove');
      tc2.switchClass('remove');
      tc3.switchClass('remove');
    });
  }, 1500);
});