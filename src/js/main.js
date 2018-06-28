/**
 * !Подсветка снипетов
 */
hljs.initHighlightingOnLoad();
/**
 * !Добавляем кнопку для копирования в буфер
 * */
var snippets = document.querySelectorAll('.snippet');
[].forEach.call(snippets, function (snippet) {
	snippet.firstChild.insertAdjacentHTML('beforebegin', '<button class="btn" data-clipboard-snippet><img class="clippy" width="13" src="img/clippy.svg" alt="Copy to clipboard"></button>');
});
var clipboardSnippets = new ClipboardJS('[data-clipboard-snippet]', {
	target: function (trigger) {
		return trigger.nextElementSibling;
	}
});
clipboardSnippets.on('success', function (e) {
	// e.clearSelection();
});
clipboardSnippets.on('error', function (e) {
	console.warn('It isnt copied!')
});