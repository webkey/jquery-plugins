$(function () {
  var $levelMenu = $('.js-level-menu');
  if ($levelMenu.length) {

    $levelMenu.levelMenu({
      thumb: '.js-level-menu-thumbs [data-for]',
      panels: '.js-level-menu-panels',
      panel: '.js-level-menu-panel',
      activeIndex: 0,
      prevNextClasses: true,
      mouseleavePrevent: true,
      // collapsible: true,
      animationSpeed: 150,

      hideOnResize: false,
      hideOnEscClick: false,

      afterInit: function () {
        // console.log("%c Level Menu has initialized ", 'background: #009fff; color: #f9ff00');
      },

      beforeShow: function (e, nav, currentItem) {
        console.log('beforeShow - $levelMenu1');
      },
    });
  }

  var $levelMenu2 = $('.js-level-menu-2');
  if ($levelMenu2.length) {

    var levelMenu2Inst = $levelMenu2.levelMenu({
      thumb: ".js-level-menu-thumbs-2 [data-for]",
      panels: '.js-level-menu-panels-2',
      panel: '.js-level-menu-panel-2',
      activeIndex: null,
      prevNextClasses: true,
      // mouseleavePrevent: true,
      preventElements: $('.js-level-menu-thumbs-2').add('.new-header-panel__right'),
      // collapsible: true,
      animationSpeed: 150,

      hideOnResize: false,
      hideOnOutsideClick: true,
      hideOnEscClick: true,

      afterInit: function () {
        // console.log("%c Level Menu 2 has initialized ", 'background: #009fff; color: #f9ff00');
      },

      beforeShow: function (e, el) {
        console.log('beforeShow - $levelMenu2');
      },
    });

    $levelMenu.on('levelMenu.beforeShow', function (e) {
      // У всех элементов, на которых инитится плагин отслеживаются одинаковые события
      // Поэтому даже при вызове события "levelMenu.beforeShow" у дочерних элементов,
      // Она выплывет и вызовет это событие у "$levelMenu"
      // Т.е. переключая вкладки у "$levelMenu2", событие будет срабатывать и у "$levelMenu"
      // Чтобы отсделить событие только на "$levelMenu", нужно, как вариант,
      // сравнить "e.target" и "e.currentTarget",
      // где e.target - элемент, на которой действительно отработало событие,
      // a e.delegateTarget - элемент, на котором событие находтся сейчас, фактически, самый верхний родитель
      if (e.target === e.delegateTarget) {
        levelMenu2Inst.levelMenu('hidePanel');
      }
    })
  }

  var $levelMenu3 = $('.js-level-menu-3');
  if ($levelMenu3.length) {

    $levelMenu3.levelMenu({
      thumb: '.js-level-menu-thumbs-3 [data-for]',
      panels: '.js-level-menu-panels-3',
      panel: '.js-level-menu-panel-3',
      activeIndex: 0,
      prevNextClasses: true,
      mouseleavePrevent: true,
      // collapsible: true,
      animationSpeed: 150,

      hideOnResize: false,
      hideOnOutsideClick: false,
      hideOnEscClick: false,

      afterInit: function () {
        // console.log("%c Level Menu 3 has initialized ", 'background: #009fff; color: #f9ff00');
      },

      beforeShow: function () {
        console.log('beforeShow - $levelMenu3');
      },
    });
  }

  // ================================================
  // Mob menu switcher
  const $mobMenuControl = $('.js-mob-menu-control');
  if ($mobMenuControl.length) {
    $mobMenuControl.switchClass({
      removeExisting: true,
      switchClassTo: $('.js-mob-menu').add('.js-mob-menu-overlay'),
      removeEl: $('.js-mob-menu-close').add('.js-mob-menu-overlay'),
      cssScrollFixed: false,
      preventRemoveClass: 'js-mob-menu-prevent-hide',
      modifiers: {
        activeClass: 'mob-menu-is-open'
      },
    });
  }
});
