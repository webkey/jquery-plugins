//==========Базовая структура плагина===========//
// Можно использовать для простых плагинов
// Результат действий 1 - 9

;(function($){
	var defaults = {
		question: "Кто ты?",
		buttonText: "Спросить",
		categories: ['вопрос1', 'вопрос2', 'вопрос3'],
		containerClass: "nvote",
		formClass: "nvote-form",
		buttonClass: "nvote-submit"
	};

	$.fn.nvote = function (options) {
		// return this.each(function(){
		//
		// });
		'use strict';

		console.log("this: ", this);

		var config = $.extend({}, defaults, options);

		this.init = function () {
			$('<h1 />', {
				text: "Кто ты?"
			}).appendTo(this.element);

			var form = $('<form />').appendTo(this);

			var x, y, categories = ['вопрос1', 'вопрос2', 'вопрос3'];

			for(x = 0, y = categories.length; x < y; x++) {
				$('<input />', {
					type: 'radio',
					name: 'categories',
					id: categories[x],
					value: categories[x]
				}).appendTo(form);

				$('<label />', {
					text: categories[x],
					"for": categories[x]
				}).appendTo(form);
			}

			$('<button />', {
				"class": "nvote-submit",
				text: "Спросить",
				"disabled": "disabled"
			}).appendTo(form);
		};

		this.init();

		return this;
	}
})(jQuery);