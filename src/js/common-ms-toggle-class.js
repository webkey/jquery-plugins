/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	// $.fn.simplePopupDynamic.defaultOptions.outsideClose = false;
	// $.fn.simplePopupDynamic.defaultOptions.escapeClose = false;

	// Первый свитчер
	var $switcher1 = $('.tc__switcher-01-js');
	if ($switcher1.length) {
		$switcher1.tClass({
			/*options*/
			switcher: $switcher1
			, elements: ['.popup-01-js', '.close-popup-01-js', '.tc__switcher-01-js']
			// , removeOutsideClick: false
			, afterInit: function () {
				console.log(1);
			}
			, afterRemoved: function () {
				console.log('afterRemoved 01');
				// $('html').removeClass('afterOpen-001');
			}
			, afterAdded: function () {
				console.log('afterAdded 01');
				// $('html').addClass('afterOpen-001');
			}
		});
	}

	$(document).on('click', '.popup-01-js a', function () {
		console.log(1);
	});

	setTimeout(function () {
		// проверка на повторную инициализацию
		// $popup.simplePopupDynamic({});

		// Добавить кнопку(и) динамически
		$('#add-opener').html('<a class="tc__switcher-01-js"><span>Открыть попап 1</span></a>');
	}, 1500);

	// Второй свитчек
	var $switcher2 = $('.tc__switcher-02-js');
	if ($switcher2.length) {
		$switcher2.tClass({
			/*options*/
			elements: ['.popup-02-js', '.close-popup-02-js', '.tc__switcher-02-js']
			, modifiers: {
				currentClass: 'tc--open'
			}
			, afterRemoved: function () {
				console.log('afterRemoved 02');
				// $('html').removeClass('afterOpen-001');
			}
			, afterAdded: function () {
				console.log('afterAdded 02');
				// $('html').addClass('afterOpen-001');
			}
		});
	}

});