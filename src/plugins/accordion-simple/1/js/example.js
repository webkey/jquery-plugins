$(function () {
  var $accordionSimple_1 = $('.accordion-simple_1-js');
  if ($accordionSimple_1.length) {
    var initAccordionSimple_1 = $accordionSimple_1.accordionSimple({
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

    // Use methods
    $('h1').on('click', function () {
      initAccordionSimple_1.accordionSimple('open', $('#some-drop'), function () {
        console.log('Show after opened!');
      });
    });
  }
});