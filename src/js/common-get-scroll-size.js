/**
 * !Get size of scroll
 * */

function getScrollSize() {
	// создадим элемент с прокруткой
	var div = document.createElement('div');

	div.style.overflow = 'scroll';
	div.style.width = '50px';
	div.style.height = '50px';
	div.style.position = 'fixed';
	div.style.left = '0px';
	div.style.bottom = '0px';
	div.style.visibility = 'hidden';

	// добавить элемент на страницу
	document.body.appendChild(div);

	// удалить элемент со страницы
	document.body.removeChild(div);

	// определить размеры скролла
	var scrollWidth = window.innerWidth - document.body.offsetWidth;
	var scrollHeight = window.innerHeight - document.body.offsetHeight;

	return {
		'width' : scrollWidth,
		'height' : scrollHeight
	};

	/** getScrollSize().width - получить ширину скролла */
	/** getScrollSize().height - получить высоту скролла */
}

var $cont = $('.get-scroll-size-js');

// получить ширину скролла
$('.get-scroll-width-js').on('click', function () {
	$('.scroll-height').remove();
	$(this).after('<div class="scroll-height">' + getScrollSize().width + '<div>');
});

// получить высоту скролла
$('.get-scroll-height-js').on('click', function () {
	$('.scroll-width').remove();
	$(this).after('<div class="scroll-width">' + getScrollSize().height + '<div>');
});

// Добавить/убрать вертикальный скролл
$('.add-vertical-scroll-js').on('click', function () {
	$('.scroll-width').remove();
	$('body').css({
		"height": ""
	});
});

// Добавить/убрать горизонтальный скролл
$('.add-vertical-scroll-js').on('click', function () {
	var spacer_h;
	var s_h = document.getElementById("spacer_h");
	if (s_h) {
		document.body.removeChild(s_h);
	} else {
		spacer_h = document.createElement('div');
		document.body.appendChild(spacer_h);
		spacer_h.style.width = '50px';
		spacer_h.style.height = '1000px';
		spacer_h.setAttribute("id", "spacer_h");
	}
});
// Добавить/убрать горизонтальный скролл
$('.add-horizontal-scroll-js').on('click', function () {
	var spacer_w;
	var s_w = document.getElementById("spacer_w");
	if (s_w) {
		document.body.removeChild(s_w);
	} else {
		spacer_w = document.createElement('div');
		document.body.appendChild(spacer_w);
		spacer_w.style.width = '2000px';
		spacer_w.style.height = '50px';
		spacer_w.setAttribute("id", "spacer_w");
	}
});
