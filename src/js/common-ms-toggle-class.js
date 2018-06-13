/**
 * Пример подключения jq плагина с настройками
 */

'use strict';

$(function () {
	// Для адаптива
	var $nav = $('.nav-opener-js'),
		nav;
	if ($nav.length) {
		nav = $nav.tClass({
			toggleClassTo: ['html', '.nav-overlay-js', '.shutter--nav-js']
			, modifiers: {
				currentClass: 'nav-is-open open-only-mob'
				// open-only-mob - используется для адаптива
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
			, beforeAdded: function () {
				// пример добавления классов с задержкой
				var $curItem = $('.nav-js').children(), speed = 1000;

				$('.nav-js').prop('counter', 0).animate({
					counter: $curItem.length
				}, {
					duration: speed,
					easing: 'swing',
					step: function (now) {
						$curItem.eq(Math.round(now)).addClass('show-nav-item')
					}
				});
			}
			, beforeRemoved: function () {
				$('.nav-js').stop().children().removeClass('show-nav-item')
			}
		});
	}

	// Первый свитчер
	var $switcher1 = $('.tc-js'),
		tc1;
	if ($switcher1.length) {
		tc1 = $switcher1.tClass({
			// /*options*/
			switchBtn: '.tc__switcher-js'
			, toggleClassTo: ['html', '.tc__popup-js', '.tc__overlay-js']
			, modifiers: {
				currentClass: 'tc--active'
			}
			, cssScrollFixed: true
			, removeOutsideClick: true
		});
	}

	setTimeout(function () {
		// Добавить кнопку(и) динамически
		$('#add-switcher').html('<a href="#" class="tc__switcher-js"><span>Открыть попап 1 (switcher) (loaded)</span></a>');
	}, 1500);

	// Второй свитчер
	var $switcher2 = $('.tc-2-js'),
		tc2;
	if ($switcher2.length) {
		tc2 = $switcher2.tClass({
			switchBtn: '.tc-2__switcher-js'
			, toggleClassTo: ['html', '.tc-2__popup-js', '.tc__overlay-js']
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
			, toggleClassTo: ['html', '.tc-3__popup-js', '.tc__overlay-js']
			, modifiers: {
				currentClass: 'tc--active'
			}
			, cssScrollFixed: true
			, beforeAdded: function () {
				// console.log('beforeAdded 3');
				// Если нужно удалять уже добавленные классы одного экземпляра плагина, при добавлении другого
				tc1.tClass('remove');
				tc2.tClass('remove');
			}
			, afterRemoved: function () {
				// console.log('afterRemoved 3');
			}
		});

		tc2.on('tClass.beforeAdded', function () {
			tc1.tClass('remove');
			tc3.tClass('remove');
			nav.tClass('remove');
		});
		tc1.on('tClass.beforeAdded', function () {
			tc2.tClass('remove');
			tc3.tClass('remove');
			nav.tClass('remove');
		});
		nav.on('tClass.beforeAdded', function () {
			tc1.tClass('remove');
			tc2.tClass('remove');
			tc3.tClass('remove');
		});
	}, 1500);
});