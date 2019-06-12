$(function () {
  var $filters = $('.p-filters-js');
  if ($filters.length) {
    $filters.msFilters({
      filters: 'input[type="checkbox"], select, .range-slider-js, [data-filter-type="input"]'
    })
        .css('padding', '1rem 2rem')
        .css('background-color', 'lightblue')
        .css('border', '2px solid darkblue');
  }
});