var app = {};

/**
 * !Resize only width
 * */
var resizeByWidth = true;

var prevWidth = -1;
$(window).on('resize', function () {
  var currentWidth = $('body').outerWidth();
  resizeByWidth = prevWidth !== currentWidth;
  if (resizeByWidth) {
    $(window).trigger('resizeByWidth');
    prevWidth = currentWidth;
  }
});

/**
 * !Truncate features
 */
app.cut = {
  config: {
    el: '.js-cut',
    overflow: '.js-cut__overflow',
    content: '.js-cut__content',
    marker: '.js-cut__marker',
    btn: '.js-cut__btn',
    dur: 300,
    isExpanded: false,
  },
  init: function () {
    var self = this;
    if ($(self.config.el).length) {
      console.info('cut.js init');

      self.prepare();
      self.toggle();
    }
    $(window).on('resize', function () {
      self.prepare();
    })
  },
  prepare: function () {
    var self = this;
    var $el = $(self.config.el)

    $.each($el, function () {
      var $curEl = $(this);

      var fullHeight = $(self.config.content, $curEl).outerHeight();
      var cutHeight = $(self.config.marker, $curEl).outerHeight();

      if (fullHeight <= cutHeight) {
        $curEl.removeClass('is-cut').removeClass('is-full');
        $(self.config.overflow, $curEl).css('max-height', '');
        self.isExpanded = false;
      } else if (!self.isExpanded) {
        $curEl.addClass('is-cut');
      }
    })
  },
  toggle() {
    var self = this;
    var $el = $(self.config.el)

    $el.on('click', self.config.btn, function (e) {
      e.preventDefault();
      var $btn = $(this);
      var $curEl = $btn.closest(self.config.el)
      var $overflow = $(self.config.overflow, $curEl)
      var cutHeight = $(self.config.marker, $curEl).css('max-height');
      var fullHeight = $(self.config.content, $curEl).outerHeight();

      if (self.isExpanded) {

        $curEl.addClass('is-cut')
            .removeClass('is-full');

        $overflow.animate({
          'height': cutHeight
        }, self.config.dur, function() {
          $overflow.css({
            height: '',
            'max-height': ''
          });
          $curEl.trigger('afterChange');
          $curEl.trigger('afterUncut');
        });

        $btn.removeClass('active').text($btn.attr('data-btn-show-text'));

        self.isExpanded = false;
      } else {
        $overflow.css('height', $overflow.outerHeight());
        $overflow.css('max-height', 'none');

        setTimeout(function () {
          $curEl.addClass('is-full')
              .removeClass('is-cut');

          $overflow.animate({
            'height': fullHeight
          }, self.config.dur, function() {
            $overflow.css({ height: "" })
            self.isExpanded = true;
            $curEl.trigger('afterChange');
            $curEl.trigger('afterCut');
          });

          $btn.addClass('active').text($btn.attr('data-btn-hide-text'));
        }, 0)
      }
    });
  }
}

$(function () {
  window.app = app;
  app.cut.init();

  // cut();
})
