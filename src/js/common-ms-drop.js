/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	$('.ms-drop__container-js').msDrop({})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid green').css('box-shadow', '0 4px red');

	$('.ms-drop__container-js--01').msDrop({
		outsideClick: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid purple').css('box-shadow', '0 4px gray');

	$('.ms-drop__container-js--02').msDrop({
		closeAfterSelect: false,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid yellow').css('box-shadow', '0 4px black');

	$('.ms-drop__container-js--03').msDrop({
		preventOption: true,
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid coral').css('box-shadow', '0 4px navy');

	$('.ms-drop__container-js--04').msDrop({
		selectValue: false,
		closeAfterSelect: false, // для наглядности отключаем закрытие дропа по клику на опшин
		afterInit: function (e, el, param) {
			// console.log('2 jQuery Plugin Created !!!');
		}
	})
	// тест на правильное срабатывание цепочки методов jquery (для подключения плагина не нужно)
		.css('border-bottom', '4px solid lightblue').css('box-shadow', '0 4px darkblue');
});