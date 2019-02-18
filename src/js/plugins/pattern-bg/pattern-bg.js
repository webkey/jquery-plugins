/**
 * pattern-bg
 */

(function ($) {
  var patternHeight = {
        top: 584,
        center: 600,
        bottom: 200
      },
      delta = 0,
      change = 0,
      // $spacer = $('<div class="spacer-js" />'),
      $bottomElement = $('.bg-b');

  function changeBgPosition() {
    // $spacer.css('height', '');

    delta = ($(document).height() - patternHeight.top - patternHeight.bottom) % patternHeight.center;
    change = (delta > 0) ? -(patternHeight.top + delta) : -(patternHeight.top + patternHeight.center + delta);

    // $spacer.css('height', patternHeight.center - delta);

    if (delta < 0) {
      // $spacer.css('height', 0);
      $bottomElement.css({
        'background-position-y': -delta,
        'height': patternHeight.bottom
      });
    }
    else {
      $bottomElement.css({
        'background-position-y': 0,
        'height': delta + patternHeight.bottom
      });
    }

  }

  $(window).on('load', function () {
    // $spacer.insertBefore('.footer');
    changeBgPosition();
  });

  $(window).on('resize', function () {
    changeBgPosition();
  });

  new ResizeSensor($('.wrapper'), function(){
    changeBgPosition();
  });


})(jQuery);