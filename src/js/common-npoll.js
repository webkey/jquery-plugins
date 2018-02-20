$(function () {
	$('#mypoll').npoll({
		question: 'How old are you?',
		buttonText: 'Send',
		containerClass: "jq-npoll",
		formClass: "jq-npoll-form",
		buttonClass: "jq-npoll-submit",
		// пример (1) вызова калбэк-функции
		// , created: function (e, el) {
		// 	// console.log("el: ", el);
		// 	console.log("el.attr('id'): ", el.attr('id'));
		// }
		// пример (2) вызова калбэк-функции (см. 19.7)
		// , beforeResponse: function (e, el) {
		// 	console.log("el.attr('id'): ", el.attr('id'));
		// }
		ajaxOptions: {
			headers: {
				"X-REQUESTED-BY": "npoll"
			}
		},
		// (см. 21.6) respondeerror: function (el) {
		respondeerror: function (e, el, resp) {
			// e - само событие
			// el - элемент
			// resp - ответ от сервера
			// console.log("resp: ", resp); // вывести в консоль ответ об ошибке
			el.remove(); // пример, удаление формы в случае получения ошибки
			return false; // этим мы запрещаем дальнейшее выполнение кода указанное в плагине в $.ajax.fail
		},
		created: function (e, el) {
			console.log("e: ", e);
			console.log("el: ", el);
		}
	});
	// }).css('background-color', 'tomato');

	// 18.1 (начало)
	// $('form').unbind('submit');
	// 18.1 (конец)
});