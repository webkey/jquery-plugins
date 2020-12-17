$(function () {
  var $levelMenu = $('.js-level-menu');
  if ($levelMenu.length) {
    var timeout = {
      show: 0,
      hide: 0
    };

    $levelMenu.levelMenu({
      siblings: true,
      onlyHasDrop: false,
      arrowEnable: false,
      accordionView: false,
      mouseleavePrevent: false,
      collapsible: false,
      animationSpeed: 700,
      timeout: {
        show: timeout.show,
        hide: timeout.hide
      },
      // modifiers: {
      //   selected: 'booooo'
      // },

      afterInit: function (e, el, param) {
        console.log("%c Level Menu has initialized ", 'background: #009fff; color: #f9ff00');
      },

      afterSelected: function (e, nav, currentItem) {
        // console.log("afterHover:currentItem: ", currentItem);
      },

      afterLeave: function (e, nav, currentItem) {
        // console.log("afterLeave:currentItem: ", currentItem);
      },
    });

    $('a', $levelMenu).attr('title', 'Задержка добавления: ' + timeout.show + ', задержка удаления:' + timeout.hide);

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
  }
});