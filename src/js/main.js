/**
 * !Подсветка снипетов
 */
hljs.initHighlightingOnLoad();
/**
 * !Добавляем кнопку для копирования в буфер
 * */
var snippets = document.querySelectorAll('.snippet');
[].forEach.call(snippets, function (snippet) {
  snippet.firstChild.insertAdjacentHTML('beforebegin', '<button class="btn" data-clipboard-snippet><img class="clippy" width="13" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwMjQiIHdpZHRoPSI4OTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICA8cGF0aCBkPSJNMTI4IDc2OGgyNTZ2NjRIMTI4di02NHogbTMyMC0zODRIMTI4djY0aDMyMHYtNjR6IG0xMjggMTkyVjQ0OEwzODQgNjQwbDE5MiAxOTJWNzA0aDMyMFY1NzZINTc2eiBtLTI4OC02NEgxMjh2NjRoMTYwdi02NHpNMTI4IDcwNGgxNjB2LTY0SDEyOHY2NHogbTU3NiA2NGg2NHYxMjhjLTEgMTgtNyAzMy0xOSA0NXMtMjcgMTgtNDUgMTlINjRjLTM1IDAtNjQtMjktNjQtNjRWMTkyYzAtMzUgMjktNjQgNjQtNjRoMTkyQzI1NiA1NyAzMTMgMCAzODQgMHMxMjggNTcgMTI4IDEyOGgxOTJjMzUgMCA2NCAyOSA2NCA2NHYzMjBoLTY0VjMyMEg2NHY1NzZoNjQwVjc2OHpNMTI4IDI1Nmg1MTJjMC0zNS0yOS02NC02NC02NGgtNjRjLTM1IDAtNjQtMjktNjQtNjRzLTI5LTY0LTY0LTY0LTY0IDI5LTY0IDY0LTI5IDY0LTY0IDY0aC02NGMtMzUgMC02NCAyOS02NCA2NHoiIC8+PC9zdmc+" alt="Copy to clipboard"></button>');
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