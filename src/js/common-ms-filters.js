$(function () {
  var $filters = $('.p-filters-js');
  if ($filters.length) {
    $filters.msFilters({
      afterInit: function (e, el, param) {
        console.log("jQuery Plugin Created !!! It's fired afterInit event");
      }
    })
        .css('padding', '1rem 2rem')
        .css('background-color', 'lightblue')
        .css('border', '2px solid darkblue');
  }
});