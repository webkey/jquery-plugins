// В случае, если плагин более сложный базовой конструкции будет недостаточно
// Вместо небольшой функции инициализации следует написать
// полноценную функцию-конструктор
// создающюю отдельные сущности плагина.
// Для этого создаем навую функцию function Npoll(){}; (см. 11)

;(function($){
	var defaults = {
		question: "Кто ты?",
		buttonText: "Спросить",
		categories: ['вопрос1', 'вопрос2', 'вопрос3'],
		containerClass: "nvote",
		formClass: "nvote-form",
		buttonClass: "nvote-submit"
	};

	// функция-конструктор (с большой буквы)
	function Nvote(element, options) {

		console.log("this Nvote: ", this);

		// чтобы можно было обращаться к this из калбэк-функций
		var self = this;

		// не var, а поле объекта this;
		self.config = $.extend(true, {}, defaults, options);

		// элемент DOM-дерева, к которому будет применятся плагин
		self.element  = element;

		// вызываем функциию-прототип init
		self.init();
	}

	// Функцию init определяем как прототипа объкта функции Npoll
	Nvote.prototype.init = function () {

		console.log("this Nvote.prototype.init: ", this);

		// Присоединение к контейнеру происходит через this.element
		this.element.addClass(this.config.containerClass);

		$('<h1 />', {
			text: this.config.question
		}).appendTo(this.element);

		var form = $('<form />').addClass(this.config.formClass).appendTo(this.element);

		var x, y;

		for(x = 0, y = this.config.categories.length; x < y; x++) {
			$('<input />', {
				type: 'radio',
				name: 'categories',
				id: this.config.categories[x],
				value: this.config.categories[x]
			}).appendTo(form);

			$('<label />', {
				text: this.config.categories[x],
				"for": this.config.categories[x]
			}).appendTo(form);
		}

		$('<button />', {
			"class": this.config.buttonClass,
			text: this.config.buttonText,
			"disabled": "disabled"
		}).appendTo(form);

	};

	$.fn.nvote = function (options) {
		'use strict';

		// return this.each(function(){
		//
		// });
		// jquery и так пробегает все элементы. Зачем each?

		console.log("this $.fn.nvote: ", this);

		// создаем новую сущность плагина для переданных в плагин элементов и опций (с помощью new)
		new Nvote(this, options);

		// а также вернем елементы поданные на вход плагину
		return this;
	};
})(jQuery);