// В случае, если плагин более сложный базовой конструкции будет недостаточно
// Вместо небольшой функции инициализации следует написать
// полноценную функцию-конструктор
// создающюю отдельные сущности плагина.
// Для этого создаем навую функцию function Npoll(){}; (см. 11)

// Определитель
// Калбэк-функция - пользовательская функция, которая вызывается в определенных местах работы плагина, например created: function (){}
// Обработчик событий - функция (внутри плагина), которая "отлавливает" калбэк-функции.
// Калбэк-событие - название события, которое навешивается на элемент, к которому применяется плагин, например created.nvote (название калбэк-функуии + нэймспейс плагина).

;(function($){
	var defaults = {
		question: "Кто ты?",
		buttonText: "Спросить",
		categories: ['вопрос1', 'вопрос2', 'вопрос3'],
		containerClass: "nvote",
		formClass: "nvote-form",
		buttonClass: "nvote-submit"

		// Создаем калбэк-функции
		// created: function () {} // Вызываем ее вконце функции init()
	};

	// функция-конструктор (с большой буквы)
	function Nvote(element, options) {

		// чтобы можно было обращаться к this из калбэк-функций
		var self = this;

		// не var, а поле объекта this;
		self.config = $.extend(true, {}, defaults, options);

		// элемент DOM-дерева, к которому будет применятся плагин
		self.element = element;

		// вызываем функцию-прототип send (отправка формы)
		self.send();
		// установка обработчиков событий (способ 2)
		// key - поле объекта настроек
		// value - значение соответствующего поля настроек
		$.each(self.config, function (key, value) {
			// Если входной параметр value обладает типом данных function, вешаем на контейнер сооветствующий обаработчик.
			// value - пользовательская функция
			if(typeof value === 'function') {
				// key - название функции
				// Именовать калбэк-событие желательно в неймспейсе плагина: key + '.npoll'
				// Набор аргументов передаваемых на вход обработчику:
				//     1) автоматически функция будет принимать объект jquery.event (аргумент "e") (даже если его не указать). Его нужно указать первым аргументом - function (e);
				//     2) второй - аргумент под передаваемые параметры в обработчик на этапе тригерования (второй аргумент методов .trigger() и .triggerHandler()) - function (e, param);
				self.element.on(key + '.nvote', function (e, param) {
					// Запускаем функцию value переданную разработчиком, как свойство параметра key.
					// Набор аргументов передаваемых на вход калбэк-функции:
					//     1) объект jquery.event (e) - value(e)
					//     2) элемент-контейнер (this.element) - value(e, self.element)
					//     3) передаваемые параметры (param) от триггера - value(e, self.element, param)
					// Возвращаем (return) значение возвращаемое калбэк-функцией (нужно для .triggerHandler()).
					return value(e, self.element, param);
				});
			}
		});
		// вызываем функцию-прототип init (создание структуры формы)
		self.init();
	}

	Nvote.prototype.send = function () {
		// var self нужна только, чтобы была возможность обращаться к this из калбэк-функций
		var self = this;

		// Чтобы избежать вероятности отключений событий на всех формах, инициализацию события "submit" привяжем к "element", а не к самой форме
		self.element.on('submit', function (e) {
			e.preventDefault();

			console.log('Запрос отправлен!');
		});

		// При первом нажати на радиобаттон активируем кнопку
		// Чтобы избежать вероятности отключений событий на всех инпут-элеметрах, инициализацию события "change" привяжем к "element", а не к инпут-элементам
		self.element.one('change', function () {
			self.element.find('button').removeAttr('disabled');
		});
	};

	// Функцию init определяем как прототипа объкта функции Npoll
	Nvote.prototype.init = function () {

		// Доступ ко всем переменным заданным внутри конструктора получаем используя this
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
			// Чтобы избежать ошибки при отправлении формы с невыбранным баттоном
			"disabled": "disabled"
		}).appendTo(form);

		// Вызываем калбэк функцию (способ 1) created, объявленную в опциях по умолчанию
		// И передаем ей на вход элемент-контейнер
		// this.config.created(this.element);

		// Вызываем калбэк функцию (способ 2) created, без объявления в опциях
		this.element.trigger('created.nvote');

		// Пример обработчика событий с возможностью передачи в сам обработчик заначения возвращаемого калбэк-функцией
		// Чтобы обработчик мог возвращать переданное калбэк-фукцией значение, нужно использовать jq-метод .triggerHandler() вместо .trigger()
		// .trigger() возвращает объкт jquery;
		// .triggerHandler() - возвращаемое функцией значение (если фукнция ничего не возвращает, то undefined);
		// Также нужно не забыть добавить возможность передачи возвращаемого значения от обработчика в вызов события
		// Eще можно передавать данные (см. ниже var data = 1234;) внутрь функции обработчика
		var data = 1234;
		var retVal = this.element.triggerHandler('testTriggerHandler.nvote', data);
		console.log("retVal: ", retVal);
	};

	$.fn.nvote = function (options) {
		'use strict';

		// return this.each(function(){
		//
		// });
		// jquery и так пробегает все элементы. Зачем each?
		// создаем новую сущность плагина для переданных в плагин элементов и опций (с помощью new)
		new Nvote(this, options);

		// а также вернем елементы поданные на вход плагину
		return this;
	};
})(jQuery);