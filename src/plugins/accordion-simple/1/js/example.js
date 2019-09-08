$(function () {
  var $accordionSimple_1 = $('.accordion-simple_1-js');
  if ($accordionSimple_1.length) {
    $accordionSimple_1.accordionSimple({
      switcher: 'li > a',
      // destroy: {
      //   condition: function () {
      //     return window.innerWidth >= 992;
      //   },
      // },
      afterInit: function (e, el, param) {
        console.log("jQuery Plugin Created !!! It's fired afterInit event");
      }
    });
  }
});