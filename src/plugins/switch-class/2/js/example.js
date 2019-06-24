/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
  // Для тестирования
  $('.switch-class-1-js').switchClass({
    switchClassTo: $('.switch-class-target-1-js'),
    removeOutsideClick: true,
    removeExisting: false,
    modifiers: {
      activeClass: 'switch-class-target-1'
    },
    afterChange: function (e, el) {
      // console.log('afterChange');
      // console.log("this.data('SwitchClass'): ", $(el).data('SwitchClass'));
      // console.log("$(el).hasClass('active'): ", $(el).hasClass('active'));
    }
  });

  $('.switch-class-2-js').switchClass({
    switchClassTo: $('.switch-class-target-2-js'),
    removeOutsideClick: true,
    removeExisting: false,
    modifiers: {
      activeClass: 'switch-class-target-2'
    }
  });

  // Has selector
  // Add dynamical element
  setTimeout(function () {
    // Добавить кнопку(и) динамически
    $('#add-switch-class-3').html('<a href="#" class="switch-class switch-class-3-js">Инстанс 3</a>');
  }, 1500);

  $('body').switchClass({
    selector: '.switch-class-3-js',
    switchClassTo: $('.switch-class-target-3-js'),
    removeOutsideClick: true,
    removeExisting: true,
    modifiers: {
      activeClass: 'switch-class-target-3'
    }
  });

  $('.switch-class-4-js').switchClass({
    switchClassTo: $('.switch-class-target-4-js'),
    removeOutsideClick: true,
    removeExisting: true,
    preventRemoveClass: 'switch-class-prevent-4',
    toggleEl: $('.switch-class-toggle-el-4-js'),
    modifiers: {
      activeClass: 'switch-class-target-4'
    }
  });

  $('.switch-class-5-js').switchClass({
    switchClassTo: $('.switch-class-target-5-js'),
    removeOutsideClick: true,
    removeExisting: true,
    preventRemoveClass: 'switch-class-prevent-5',
    modifiers: {
      activeClass: 'switch-class-active-5'
    }
  });

  // Для адаптива
  // На примере навигации
  var $nav = $('.nav-opener-js__'),
      nav;
  if ($nav.length) {
    nav = $nav.switchClass({
      switchClassTo: $('.shutter--nav-js').add('.nav-overlay-js')
      , modifiers: {
        activeClass: 'nav-is-open',
        stopRemoveClass: 'stop-nav-remove-class'
      }
      , cssScrollFixed: true
      , beforeAdd: function () {
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
      , beforeRemove: function () {
        $('html').removeClass('open-only-mob');
        // open-only-mob - используется для адаптива
        $('.nav-js').stop().children().removeClass('show-nav-item')
      }
    });
  }

  // Первый свитчер
  var $switcher1 = $('.tc-js__'),
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
  var $switcher2 = $('.tc-2-js__'),
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
      , beforeAdd: function () {
        // console.log('beforeAdd 2');
      }
      , afterRemove: function () {
        // console.log('afterRemove 2');
      }
    });
  }

  setTimeout(function () {
    $('#add-switcher-02').html('<a href="#" class="tc-3-js"><span>Открыть попап 3 (loaded)</span></a>');

    // Трений свитчер. Добавляется на страницу динамически
    var $switcher3 = $('.tc-3-js__');
    var tc3 = $switcher3.switchClass({
      switcher: '.tc-3__switcher-js'
      , remover: '.tc-3__remover-js'
      , switchClassTo: $('.tc-3__popup-js').add('.tc__overlay-js')
      , modifiers: {
        activeClass: 'active'
      }
      , cssScrollFixed: true
      , beforeAdd: function () {
        // console.log('beforeAdd 3');
        // Если нужно удалять уже добавленные классы одного экземпляра плагина, при добавлении другого
        tc1.switchClass('remove');
        tc2.switchClass('remove');
      }
      , afterRemove: function () {
        // console.log('afterRemove 3');
      }
    });

  }, 1500);
  // tc2.on('switchClass.beforeAdd', function () {
  //   tc1.switchClass('remove');
  //   tc3.switchClass('remove');
  //   nav.switchClass('remove');
  // });
  // tc1.on('switchClass.beforeAdd', function () {
  //   tc2.switchClass('remove');
  //   tc3.switchClass('remove');
  //   nav.switchClass('remove');
  // });
  // nav.on('switchClass.beforeAdd', function () {
  //   tc1.switchClass('remove');
  //   tc2.switchClass('remove');
  //   tc3.switchClass('remove');
  // });
});