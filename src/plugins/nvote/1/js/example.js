/**
 * nvote init (тренировочная с на основе npoll)
 */

$(function () {
	$('.nvote-first').nvote({
		// пример присоеденения калбэк-фукции через .trigger()
		created: function () {},
		// пример присоеденения калбэк-фукции через .triggerHandler()
		testTriggerHandler: function (e, el, param) {
			console.log("e: ", e);
			console.log("el: ", el);
			console.log("param: ", param);
			return 'Значение возвращаемое функцией';
		}
		// можно продолжать цепочку методов jquery
	}).css('background-color', 'coral').eq(1).css('background-color', 'red');

	// $('.nvote-two').nvote({
	// 	question: "Что это?",
	// 	buttonText: "Узнать",
	// 	categories: ['задача1', 'задача2', 'задача3']
	// }).css('background-color', 'lightgreen').eq(1).css('background-color', 'green');

	$('form').unbind('submit');
});