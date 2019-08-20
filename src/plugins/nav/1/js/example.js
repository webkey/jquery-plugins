$(function () {

  /**
   * !Toggle "hover" class
   * */

  var $nav = $('.nav-1-js');
  if ($nav.length) {
    $nav.nav({
      container: '.nav__list-js',
      drop: 'ul',
      siblings: false,
      onlyHasDrop: true,
      position: true,
      observePosition: true,
      toggleClassCondition: function () {
        return window.innerWidth > 991; // Если ширина меньше 992 то классы не добавлять
      },
      timeout: {
        add: 1000,
        remove: 1000
      },

      afterInit: function (e, el, param) {
        console.log("Nav 1 afterInit");
      },

      afterHover: function (e, nav, currentItem) {
        // console.log("afterHover:currentItem: ", currentItem);
      },

      afterBlur: function (e, nav, currentItem) {
        // console.log("afterBlur:currentItem: ", currentItem);
      },
    });
  }

  setTimeout(function () {
    $('.nav-2-js').nav({
      afterInit: function (e, el, param) {
        console.log("Nav 2 afterInit");
      }
    });
  }, 2000);


  /**
   * !Switch menu
   */
  $('.open-nav-1-js').add('.open-nav-2-js').on('click', function () {
    var $curBtn = $(this);

    $curBtn.add($($curBtn.attr('href'))).addClass('is-open');
  });

  $('.nav-overlay').on('click', function () {
    $('.is-open').removeClass('is-open');
  });

  $('html').keyup(function (event) {
    if (event.keyCode === 27) {
      $('.is-open').removeClass('is-open');
    }
  });
});