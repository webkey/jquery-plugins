/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.ms-drop__container-js').msDrop({
		// closeAreOpen: false,
		afterInit: function (e, el, param) {
			// console.log('jQuery Plugin Created !!!');
		}
	})
		// test
		.css('border-bottom', '4px solid green').css('box-shadow', '0 4px red');

	$('.ms-drop__container-js--2').msDrop({
		outsideClick: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
		// test
		.css('border-bottom', '4px solid yellow').css('box-shadow', '0 4px blue');

	$('.ms-drop__container-js--3').msDrop({
		outsideClick: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
		// test
		.css('border-bottom', '4px solid yellow').css('box-shadow', '0 4px blue');
});