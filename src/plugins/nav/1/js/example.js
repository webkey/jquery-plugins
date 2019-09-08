$(function () {

  /**
   * !Toggle "hover" class
   * */

  var $nav = $('.nav-1-js');
  if ($nav.length) {
    var timeout = {
      add: 1000,
      remove: 1000
    };

    $nav.nav({
      siblings: false,
      onlyHasDrop: false,
      arrowEnable: false,
      timeout: {
        add: timeout.add,
        remove: timeout.remove
      },

      afterInit: function (e, el, param) {
        console.log("%c Nav 1: afterInit ", 'background: #009fff; color: #f9ff00');
      },

      afterHover: function (e, nav, currentItem) {
        // console.log("afterHover:currentItem: ", currentItem);
      },

      afterLeave: function (e, nav, currentItem) {
        // console.log("afterLeave:currentItem: ", currentItem);
      },
    });

    $('a', $nav).attr('title', 'Задержка добавления: ' + timeout.add + ', задержка удаления:' + timeout.remove);

  }

  setTimeout(function () {
    $('.nav-2-js').nav({
      // position: true,
      // observePosition: true,
      // accordionView: false,
      afterInit: function (e, el, param) {
        console.log("%c Nav 2: afterInit ", 'background: #f9ff00; color: #009fff');
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