/**
 * Created by Serhiy on 06.04.2017.
 */
// Создадим функцию, которая будет задавать вопрос и выводить форму для ответа на него
// =============
// 1 (начало)
// Оборачиваем код (будущий) в анонимную функцию, которую сразу же и вызываем
// Пример: ;(function () {}());
// Создавая таким образом замыкание, в которое и помещаем код плагина
// Внутри замыкания можно размещать приватные данные, которые будут доступны
// только внутри плагина
// Это позволит безопасно использовать плагин вместе с другим js-кодом
// 1 (конец)

// 2 (начало)
// Так как не везде возможно обращение к jquery через знак $,
// то передадим сам объект jQuery в плагин добавив $ аргумент на вход анонимной функции
// и дописав параметр jQuery для вызова функции
// Пример: ;(function ($) {}(jQuery));
// или второй вариант записи
// Пример: ;(function ($) {})(jQuery);
// т.е., (jQuery) назодится внутри круглых скобок, или снаружи
// 2 (конец)

// 3 (начало)
// Во внутрь плагина кроме jQuery можно передавать набор определенных объектов
// Обычно это angi.. (возможно undefined), window, document
// Такой подход позволяет увеличить скорость обращения к этим объектам, если
// часто используется обращение к ним
// 3 (конец)

// 4 (начало)
// Чтобы написать плагин jQuery, нужно расширить его прототип,
// дополнив своей функцией
// В jQuery для этого есть объект fn
// Добавляя новый метод в объект fn, создаем плагин
// Пример: $.fn.npoll = function(){};
// ============
// Важно! В каждом плагине желательно добавлять только ОДНУ функцию в объект fn.
// При этом можно создавать сколько угодно много приватных методов внутри своего плагина,
// но в fn нужно выносить только ОДИН метод
// ============
// 4 (конец)

;(function ($) {
	'use strict';

	// 7 (начало) - Видео 4
	// Перед тем, как добавить метод в объект jQuery.fn,
	// нужно определить объект с настройками плагина
	// Дальше нужно позволить разработчику передавать объект с параметрами плагина на вход внешней функции плагина (см. 8)
	var defaults = {
		question: "What's your name?",
		buttonText: "Submit",
		categories: ["category_1", "category_2", "category_3"],
		// 7 (конец)
		// добавим возможность редактирования темы плагина
		// добавим имена класов к объекту настроек
		containerClass: "npoll",
		formClass: "npoll-form",
		buttonClass: "npoll-submit",

		// Добавляем возможно пользовательской настройки ajax
		// (переопределение любого папраметра ajax запроса).
		ajaxOptions: {
			url: "",
			// метод обработки
			type: 'POST',
			// адрес сервера, когда будет отправлено сообщение
			// тип содержимого
			contentType: 'application/json; charset=utf-8',
			// тип посылаемых данных
			dataType: 'json'
		},

		// Создаем калбек-функцию
		// Способ 1.
		// Это первый способ. Простой. Она рабочий. Не удаляем.
		// , created: function () {}

		// Способ 2.
		// Вызов пользовательских событий в определенных местах работы плагина
		// Эти события можно отлавливать
		// также передавая функцию в объект настроек плагина
		// Для этого не нужно созвавать пустые функции
		// Добавляем код в конструктор, который в цыкле будет проходить
		// поля объекта настроек
		// и если это поле будет функцией, то она будет установлена обработчиком события
		// с помощью метода .on()
		// Переходит к вызову self.init()

		// Насторйки по умолчанию для ошибки ajax запроса
		errorMessage: "Ошибка! Результаты голосования не получены",
		errorClass: 'npoll-error-message'
	};

	// 8 (начало) - Видео 4
	// 8.1
	// Нужно позволить разработчику передавать объект с параметрами плагина на вход внешней функции плагина (см. 7)
	// Для этого в параметры функции добавим аргумен options
	// В него будут передаваться настройки, которые разработчик может поменять

	//code// $.fn.npoll = function(options){

		// 8.2
		// После передачи извне объекта настроек в плагин, нужно сформировать НОВЫЙ объект настроек
		// на основе объеденения defaults и передаваемого разработчиком на вход функции
		// При этом добавленные разработчиком параметры должны быть приоритетнее параметров defaults
		// Эту задачу решает метод jQuery.extend
		// Он вызывается на прямую из объекта jQuery и не требует аргументов на вход
		// Первый аргумент - объект, в котором будет объеденяться объект defaults и поданный разработчиком на вход (в даном случае это пустой объект {})
		// Второй аргумент - объект с настройками по умолчанию
		// Трений аргумент - объект с настойками поданными на вход
		//code// var config = $.extend({}, defaults, options)
		// Чтобы значения объекта options переписывали значения объекта defaults, options должен идти ПОСЛЕ defaults в списке аргументов метода $.extend
		// 8.3
		// К параметрам плагина обращение будет происходить через config.key
		// Пример: config.question => "What's your name?"

	//code// };
	// 8 (конец)

	// 11 (начало) - Видео 5
	// создаем Функцию-Конструктор
	// название с большой буквы (Npoll) - стандарт принятый в сообществе java-script разработчиков
	function Npoll(element, options) {
		// В функцию-конструктор нужно перенести код из функции инициализации (jfirst.init())
		// А также переменные, которые использовались во внешней функции плагина
		// 11 (конец)

		// создадим переменную для this, чтобы можно было обращаться к ней из калбэк-функций
		var self = this;

		// Чтобы метод копировал и вложенные свойства объекта (например, ajaxOptions: {}),
		// необходимо добавить аргумент true
		self.config = $.extend(true, {}, defaults, options);

		// 12 (начало) - Видео 5
		// Вместо установки переменных внутри функции-конструктора
		// (это ограничит область их видимости конструктором)
		// нужно разместить их внутри создаваемой сущности плагина
		// как поля объекта this
		// Было:
		// var config = $.extend({}, defaults, options);
		// Стало:
		// this.config = $.extend({}, defaults, options);
		// переменну element тоже сохраняем внутри сущности плагина
		// (аргумент element в параметрах функции-конструктора - это элемент DOM-дерева, к которому будет применятся плагин) (см. 16)
		// (аргумет options в параметрах функции-конструктора - это набор параметров передаваемых на вход функции разработчиком)  (см. 16)
		self.element = element;

		// Вызываем функциию this.init();
		//??=============Почему this.init()? Ведь пока не создан прототип init(), логично было бы вызывать this.element.init() по аналогии с jfirst.init(); =============??
		// 12 (конец)

		// Инициализацию события "submit" привяжем к "element", а не к самой форме
		// Чтобы избежать вероятности отключений событий на всех формах
		// Нужно привязывать к this.element, а не к element
		//??=============Почему? Разобраться=============??
		self.element.on('submit', function (e) {
			e.preventDefault();

			// Создадим новый объект с данными
			// до того, как создается аджакс запрос
			var dataObj = {
				// данные
				// исользуем объкт барузера JSON и его методом .stringify()
				// внутрь метода передаем объкт selected
				data: JSON.stringify({
					selected:self.element.find(':checked').val()
				})
			};

			// Создаем новый объект с настройками ajax,
			// который будет собираться из настроек собранных из default и options
			// а также переданных разработчиком настроек
			var ajaxSettings = $.extend({}, self.config.ajaxOptions, dataObj)

			// Добавляем отправку ajax-запроса
			// с нужными параметрами
			$.ajax(
				// Добавляем созданный объект настроек аргуметом для метода ajax
				ajaxSettings
			).done(function (data) {
				// метод done принимает на вход данные поступившие от сервера
			}).fail(function (data) { // эта функция принимает на вход аргумент data
				// Польвательские события при срабатывании ощибки
				// Добавляем возможность возвращать false и прекращать дальнейшее выполнение кода внутри обработчика ошибки
				// Создадим новую переменную
				// для возвращаемого значения внутри функции-замыкания функции fail
				// Внутрь переменной поместим возвращаемое значение от обработчика событий
				// Функцию jQuery.trigger использовать нельзя
				// т.к. trigger возвращает объект jQuery для дальнейшего связывания
				// triggerHandler возвращает именно то значени, которое возвращает обработчик события
				var retVal = self.element.triggerHandler('responseerror.npoll', data); // передаем аргумент data в функцию обработчик
				console.log("1: ", 1);

				// Следующий код выполняем, если возвращаемое значение не равно false
				if (retVal !== false) { // Сгенерируем сообщение об ошибке, если такая возникнет
					self.element.append($('<p />'), {
						text: self.config.errorMessage,
						'class': self.config.errorClass
					})
				}
			});

			// Добавляем в плагин обработку ошибок.
			// Убираем форму после отправки запроса
			// 1) сохраним подписи от вариантов ответа (почему не var?)
			self.labels = self.element.find('label');
			// 2) зафиксируем размеры блока, в которой располагается форма
			self.element.width(self.element.width()).height(self.element.height()).find('form').remove();

			// Добавляем пользовательское событие (калбек-функцию)
			// после отпарвки запроса на сервер, но до получения ответ
			self.element.trigger('beforeresponse.npoll');
		});

		// При первом нажати на радиобаттон
		// Активируем кнопку
		// Событие нужно один раз, поэтому используем метод .one()
		self.element.one('change', function () {
			self.element.find('button').removeAttr('disabled');
		});

		// Вызов калбек функции
		// Способ 2.
		// Вызываем метод jQuery $.each()
		// На вход которому подаем объект настроек self.config
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				// Если входной параметр value обладает типом данных function
				// Вешаем на контейнер сооветствующий обаработчик.
				// Имоновать калбек функию желательно в неймспейсе плагина
				// На вход передаем калбэк функцию из настроек (параметр val)

				// Еще нужно передавать внутрь функции обработчика ошибки ajax
				// возвращаемое от сервера значение ответа
				// даже если запрос возвращается с ошибкой, у него может быть объект с данными,
				// который пришел от сервера
				// Внутри этого объекта могут содержаться полезные сведения
				// Автоматически функция будет принимать объект jQuery event (в аргуметах функциях ниже обозначен как "е")
				// Также нужно указать аргумент под передаваемые данные в обработчик (в аргуметах функциях ниже обозначен как "param")
				self.element.on(key + '.npoll', function (e, param) {
					// По инструкции, чтобы передать контейнер в парамер функции-обработчика,
					// Нужно создать замыкание, как сделанно сдесь,
					// Но работает тоже, если не создавать замыкание.
					// ??===================Почему необходимо замыкание=================??
					// Необходимо добавить возможность передачи возвращаемого значения от обработчика
					// в вызов события
					// Для этого нужно доватить return
					// Если его не указать, то будет возвращаться undefined
					return value(e, self.element, param);
				});
				// Чтобы вызвать пользовательское событие,
				// мы можем вызвать событие после создания элемента
				// внутри функции Npoll.prototype.init в самом конце
			}
		});

		self.init();
	}

	// 13 (начало) - Видео 5
	// Вместо того, чтобы размещать функцию инициализаци в приватном пространстве плагина,
	// присоеединяем ее к создаваемой сущности плагина
	// с помощью определения ее как прототипа объкта функции Npoll
	// Npoll.prototype.init = function () {
	// 		здесь код функции
	// };
	// 13 (конец)

	Npoll.prototype.init = function () {

		// 14 (начало) - Видео 5
		// Так как функции init() определена как функция объекта конструктра,
		// можно получить доступ ко всем переменным заданным ранее внутри конструктора
		// также используя this
		// т.е. к config обращаемся через this --> this.config
		// К this через this.element (В данном плагине он является первым элементом выборки - this.first() (см. 16))
		// Присоединение к контейнеру (раньше было jfirst, а после создания функции init() - this (см. 9)) происходит через this.element
		// Переменная jfirst (обращение к первому элементу выборки) больше не нужна
		// var jfirst = this.first();
		// 14 (конец)

		// Добавляем класс к создаваемому элементу
		this.element.addClass(this.config.containerClass);

		// 5 (начало)
		// Неважно!!!
		// 5.1 Добавляем на страницу вопрос
		$('<h1 />', {
			text: this.config.question
		}).appendTo(this.element);

		// 5.2 Создаем форму и добавляем ее на страницу в текущий элемент
		var form = $('<form/>').addClass(this.config.formClass).appendTo(this.element);

		// 15 (начало) - Видео 5
		// можно сделать небольшое упрощение плагина
		// и ввести вхождени categories с помощью конструкции this.config.categories
		// ??=============Узнать, почему такой метод лучше==============??
		// ??=============Почему множественное повторение this.config.categories лучше,
		// чем создать переменную categories = this.config.categories==============??
		// Чтобы не приходилось копировать их в отдельный объект
		// ??=============Почему "объект"? Это оговорка? Почему не "переменная"? Может в этом соль?
		// Может мы создаем не переменню, а новый объект, в который копируем значение this.config.categories
		// и это более ресурсозатратно?===========??
		// 16 (конец)

		// 5.3 Объявляем переменные вне цыкла (рекомендовано)
		// var x, y, categories = this.config.categories;
		var x, y;

		// 5.4 Создаем радиокнопки с атрибутами и подписями к радиокнопкам
		// проганяя в цикле по количесту категорий
		// Добавляем эти элементы внутрь формы
		for (x = 0, y = this.config.categories.length; x < y; x++) {

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

		// 5.5 Добавляем кнопку в конец формы
		$('<button />', {
			"class": this.config.buttonClass,
			text: this.config.buttonText,
			// Чтобы избежать ошибки при отправлении формы с невыбранным баттоном,
			// при загрузке делаем конпку неактивной
			"disabled": "disabled"
		}).appendTo(form);
		// 5 (конец)

		// 6 (начало) - Видео 3
		// Чтобы была возможность продолжить цепочку методов jQuery, в функции необходимо вернуть текущий эемент, т.е. this
		// return this;
		// Но чтобы плагин и следуюющие в цепочке методы применялись не только к первому элементу,
		// но и ко всем в выборке, нужно весь код обернуть в each и вернуть его
		// return this.each(function () {
		// 		здесь код плагина
		// });
		// 6 (конец)

		// Вызов калбек функции
		// Способ 1.
		// Вызываем калбек функцию created, объявленную в опциях по умолчанию defaults
		// И передаем ей на вход элемент-контейнер
		// Это первый способ. Простой. Она рабочий. Не удаляем.
		// this.config.created(this.element)

		// Вызов калбек функции
		// Способ 2.
		this.element.trigger('created.npoll')
	};

	// 9 (начало) - Видео 5
	// Первое, что нужно сделать, это присоеденить init-метод непосредственно к тому элементу,
	// на котором он будет ВИЗУАЛИЗИРОВАТЬСЯ

	// Пример:
	//code// 	jfirst.init = function(){
	// 				здесь помещаем код создающий элементы (см. 5)
	// 				внутри этой функции this ссылается на сам jfirst (т.е. на var jfirst = this.first();)
	//code// 	}
	// 			вызываем функцию init
	//code// 	jfirst.init()
	// Пример (конец)

	// 9 (конец)

	//==========Базовая структура плагина (начало)===========//
	// Можно использовать для простых плагинов
	// Результат действий 1 - 9

	//code// ;(function ($) {
	//code// 	var defaults = {
	//code// 		key: param
	//code// 	};
	//code//
	//code// 	$.fn.npoll = function (options) {
	//code//
	//code// 		var config = $.extend({}, defaults, options);
	//code//
	//code// 		var jfirst = this.first();
	//code//
	//code// 		jfirst.init = function () {
	//code// 			/*здесь помещаем код создающий элементы (см. 5)*/
	//code// 		};
	//code//
	//code// 		jfirst.init();
	//code//
	//code// 		return jfirst;
	//code// 	};
	//code// })(jQuery);

	//==========Базовая структура плагина (конец)===========//

	// 10 (начало) - Видео 5
	// В случае, если плагин более сложный базовой конструкции будет недостаточно
	// Вместо небольшой функции инициализации следует написать
	// полноценную функцию-конструктор
	// создающюю отдельные сущности плагина.
	// Для этого создаем навую функцию function Npoll(){}; (см. 11)
	// 10 (конец)

	$.fn.npoll = function (options) {

		// 16 (начало) - Видео 5
		// Заменив все переменные в соответствии с новой архитектурой плагина
		// во внешней функции (в Npoll.prototype.init) плагина, дополняющего функционал jQuery
		// создаем новую сущность плагина для переданных в плагин элементов и опций (с помощью new)
		new Npoll(this.first(), options);

		// а также вернем первый элемент
		return this.first();
		// 16 (конец)
	}

	// 17 (начало) - Видео 5
	// Результат:
	// Есть Конструктор для сущностей плагина,
	// к которому можно присоеденить что-угодно
	// Этот паттерн создан на основе легковесного паттерна Эдди Османи
	// Этот паттерн не такой очевидный и простой
	// как простое оборачивание функцией инициализации элемента
	// переданного на вход плагина
	// ??=============Посмотреть паттерны у Эдди Османи !!!=================??

	// Мы создали функцию-конструктор (function Npoll(element, options) {};)
	// и обернули создание новых элементов в функцию инициализации (Npoll.prototype.init = function () {};),
	// которая ПРИСОЕДИНЕНА на прамую к СУЩНОСТИ плагина ВОЗВРАЩАЕМОЙ КОНСТРУКТОРОМ
	// 17 (конец)

})(jQuery);