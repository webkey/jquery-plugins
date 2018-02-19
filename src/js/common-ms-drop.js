/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.ms-drop__container-js--1').msDrop({})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid green').css('box-shadow', '0 4px red');

	$('.ms-drop__container-js--2-1').msDrop({
		closeOutsideClick: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid purple').css('box-shadow', '0 4px gray');

	$('.ms-drop__container-js--2-2').msDrop({
		closeEscClick: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid purple').css('box-shadow', '0 4px gray');

	$('.ms-drop__container-js--3').msDrop({
		closeAfterSelect: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid yellow').css('box-shadow', '0 4px black');

	$('.ms-drop__container-js--4').msDrop({
		preventOption: true,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid coral').css('box-shadow', '0 4px navy');

	$('.ms-drop__container-js--5').msDrop({
		selectValue: false,
		closeAfterSelect: false, // для наглядности отключаем закрытие дропа по клику на опшин
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid lightblue').css('box-shadow', '0 4px darkblue');

	$('.ms-drop__container-js--6-1').msDrop({
		modifiers: {
			isOpen: 'is-open-class-var-1'
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid #f00').css('box-shadow', '0 4px #0f0');

	$('.ms-drop__container-js--6-2').msDrop({
		modifiers: {
			isOpen: 'is-open-class-var-2'
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid #f00').css('box-shadow', '0 4px #0f0');
});