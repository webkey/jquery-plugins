/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	// $.fn.simplePopupDynamic.defaultOptions.outsideClose = false;
	// $.fn.simplePopupDynamic.defaultOptions.escapeClose = false;

	// Первый свитчер
	var $switcher1 = $('.tc-js');
	if ($switcher1.length) {
		$switcher1.tClass({
			// /*options*/
			switchBtn: '.tc__switcher-js'
			, removeBtn: '.tc__remove-js'
			, addBtn: '.tc__add-js'
			, other: ['.tc__popup-js']
			, cssScrollFixed: true
			, removeOutsideClick: true
			, afterInit: function () {
				// console.log('afterInit');
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 1');
			}
			, afterAdded: function () {
				// console.log('afterAdded 1');
			}
		});
	}

	setTimeout(function () {
		// Добавить кнопку(и) динамически
		$('#add-switcher').html('<a href="#" class="tc__switcher-js"><span>Открыть попап 1 (switcher) (loaded)</span></a>');
	}, 1500);

	// Второй свитчер
	var $switcher2 = $('.tc-2-js'), tc2;
	if ($switcher2.length) {
		tc2 = $switcher2.tClass({
			switchBtn: '.tc-2__switcher-js'
			, removeBtn: '.tc-2__remove-js'
			, addBtn: '.tc-2__add-js'
			, other: ['.tc-2__popup-js']
			, modifiers: {
				currentClass: 'tc--open'
			}
			, cssScrollFixed: true
			, beforeAdded: function () {
				// console.log('beforeAdded 2');
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 2');
			}
		});
	}

	setTimeout(function () {
		$('#add-switcher-02').html('<a href="#" class="tc-3-js"><span>Открыть попап 3 (loaded)</span></a>');

		// Трений свитчер. Добавляется на страницу динамически
		var $switcher3 = $('.tc-3-js');
		var tc3 = $switcher3.tClass({
			switchBtn: '.tc-3__switcher-js'
			, removeBtn: '.tc-3__remove-js'
			, other: ['.tc-3__popup-js']
			, modifiers: {
				currentClass: 'tc--active'
			}
			, cssScrollFixed: true
			, beforeAdded: function () {
				// console.log('beforeAdded 3');
				// Если нужно удалять уже добавленные классы одного экземпляра плагина, при добавлении другого
				tc2.tClass('remove');
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 3');
			}
		});

		tc2.on('tClass.beforeAdded', function () {
			tc3.tClass('remove');
		});
	}, 1500);
});