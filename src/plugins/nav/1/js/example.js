$(function () {
  var $nav = $('.nav-js');
  if ($nav.length) {
    $nav.nav({
      afterInit: function (e, el, param) {
        console.log("jQuery Plugin Created !!! It's fired afterInit event");
      }
    })
        .css('padding', '1rem 2rem')
        .css('background-color', 'lightblue')
        .css('border', '2px solid darkblue');
  }
});