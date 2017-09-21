$(function () {
	$('#mypoll').npoll({
		question: 'How old are you?',
		buttonText: 'Send',
		created: function (e, el) {
			// console.log("el: ", el);
			// console.log("el.attr('id'): ", el.attr('id'));
		},
		ajaxOptions: {
			headers: {
				"X-REQUESTEDB-BY": "npoll"
			}
		},
		responseerror: function (e, el, resp) {
			el.remove();
			console.log("resp: ", resp);
			return false; // этим мы запрещаем дальнейшее выполнение кода указанное в плагине в $.ajax.fail
		}
	});
	// }).css('background-color', 'tomato');
});