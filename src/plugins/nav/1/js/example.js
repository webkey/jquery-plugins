$(function () {
  var $nav = $('.nav-js');
  if ($nav.length) {
    $nav.nav({
      afterInit: function (e, el, param) {
        console.log("jQuery Plugin Created !!! It's fired afterInit event");
      }
    })
  }
});