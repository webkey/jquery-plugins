/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	// $.fn.simplePopupDynamic.defaultOptions.outsideClose = false;
	// $.fn.simplePopupDynamic.defaultOptions.escapeClose = false;

	// Первый свитчер
	var $switcher1 = $('.tc__switcher-1-js');
	if ($switcher1.length) {
		$switcher1.tClass({
			/*options*/
			switcher: $switcher1
			, elements: ['.popup-1-js', '.close-popup-1-js', '.tc__switcher-1-js']
			, removeOutsideClick: false
			, afterInit: function () {
				// console.log('afterInit');
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 01');
				// $('html').removeClass('afterOpen-001');
			}
			, afterAdded: function () {
				// console.log('afterAdded 01');
				// $('html').addClass('afterOpen-001');
			}
		});
	}

	// $(document).on('click', '.popup-1-js a', function () {
	// 	console.log(1);
	// });

	setTimeout(function () {
		// проверка на повторную инициализацию
		// $popup.simplePopupDynamic({});

		// Добавить кнопку(и) динамически
		$('#add-opener').html('<a class="tc__switcher-1-js"><span>Открыть попап 1 (loaded)</span></a>');
	}, 1500);

	// Второй свитчек
	var $switcher2 = $('.tc__switcher-2-js');
	if ($switcher2.length) {
		$switcher2.tClass({
			/*options*/
			elements: ['.popup-2-js', '.close-popup-2-js', '.tc__switcher-2-js']
			, modifiers: {
				currentClass: 'tc--open'
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 02');
				// $('html').removeClass('afterOpen-001');
			}
			, afterAdded: function () {
				// console.log('afterAdded 02');
				// $('html').addClass('afterOpen-001');
			}
		});
	}

});