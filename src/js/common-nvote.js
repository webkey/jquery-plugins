/**
 * nvote init (тренировочная с на основе npoll)
 */

$(function () {
	$('.my-nvote').nvote({

	}).css('background-color', 'coral');

	$('.you-nvote').nvote({
		question: "Что это?",
		buttonText: "Узнать",
		categories: ['задача1', 'задача2', 'задача3']
	}).css('background-color', 'lightgreen');
});