;(function($){
	var defaults = {
		key: 'value',
		tagsGroup: $('.tags-group-js'),
		tagsItem: $('.tags-item-js'),
		tagsElement: $('[data-tags]'),
		filters: $('.filters-js'),
		counterTags: $('.counter'),
		btnReset: $('.filters-reset-js'),
		containerClass: 'sfilters-container',
		classNoItem: 'filter-no-item',
		noItemText: 'No items',
		classCounter: 'filter-counter',
		counterText: 'Total: ',
		classHideElements: 'filters--hide'

		// Callback-functions
		// created: function () {}
	};

	function Sfilters(element, options) {
		var self = this;

		self.config = $.extend(true, {}, defaults, options);

		self.element = element;
		self.filters = element.find(self.config.filters);

		self.callbacks();
		self.resetFilters();
		self.event();
		self.toggleButtons();
		self.init();
	}

	/** track events */
	Sfilters.prototype.callbacks = function () {
		var self = this;
		$.each(self.config, function (key, value) {
			if(typeof value === 'function') {
				self.element.on(key + '.sfilters', function (e, param) {
					return value(e, self.element, param);
				});
			}
		});
	};

	Sfilters.prototype.event = function () {
		var self = this;

		var noItemText = self.element.data('no-filters-test') || self.config.noItemText;
		var counterText = self.element.data('counter-text') || self.config.counterText;

		var tplNoItem = $('<div />', {
			class: self.config.classNoItem,
			text: noItemText
		});

		var tplCounter = $('<div />', {
			class: self.config.classCounter
		});

		self.filters.on('change', ':checkbox', function () {

			var tagsGroup = self.element.find(self.config.tagsGroup);
			var tagsElement = self.element.find(self.config.tagsElement);

			if(tagsElement) {
				var arrTags = self.checkedFilters(self.filters);

				var filterSelector = self.createSelectorTypeAnd(arrTags);

				// show all tag elements
				tagsGroup.removeClass(self.config.classHideElements).show(0);
				tagsElement.removeClass(self.config.classHideElements).show(0);

				// remove messages
				self.element.find('.'+ self.config.classNoItem).remove();
				self.element.find('.'+ self.config.classCounter).remove();

				// add counter message
				if (tagsElement.filter(filterSelector).length) {
					tplCounter.clone().appendTo(self.filters.parent()).end().text(counterText + ' ' + tagsElement.filter(filterSelector).length);
				}

				if (filterSelector) {
					// hide all tag elements
					tagsElement.addClass(self.config.classHideElements).hide(0);
					// show filtering tag elements
					tagsElement.filter(filterSelector).removeClass(self.config.classHideElements).show(0);

					// add not found tags message
					if (!tagsElement.filter(filterSelector).length) {
						self.filters.parent().append(tplNoItem.clone());
					}
				}

				$.each(tagsGroup, function (index, el) {
					// numbers of child element in tags group
					var countFilteringTagsItems = $(el).find(self.config.tagsItem).filter(':not(.'+ self.config.classHideElements +')').length;
					// numbers of element have filters attribute
					var countFilteringTagsElements = $(el).find(self.config.tagsElement).filter(':not(.'+ self.config.classHideElements +')').length;

					$(el).find(self.config.counterTags).attr('data-text', countFilteringTagsItems);
					if(!countFilteringTagsElements){
						$(el).addClass(self.config.classHideElements).hide(0);
					}
				});
			}

		});
	};

	// Toggle buttons state
	Sfilters.prototype.toggleButtons = function () {
		var self = this;

		self.filters.on('change', ':checkbox', function () {
			self.element.find(self.config.btnReset).prop('disabled', !self.checkedFilters(self.filters).length);
		})

	};

	// Reset filters
	Sfilters.prototype.resetFilters = function () {
		var self = this;

		self.element.find(self.config.btnReset).on('click', function () {
			self.filters.find(':checkbox').prop('checked', false).trigger('change');
		})
	};

	// create an array of tag values for the selected filters
	Sfilters.prototype.checkedFilters = function ($container) {
		var $input = $container.find(':checkbox');

		var hasCheckedInput = false;

		var arr = [];

		$.each($input, function () {

			var $currentInput = $(this);

			if ($currentInput.prop('checked')) {
				hasCheckedInput = true;

				arr.push($currentInput.data('tag'));
			}
		});

		return arr;
	};

	// Создаем селектор собирающий в себе все теги.
	// Нужно показать все элементы, которые имеют хотя бы один совпадающий тег.
	// Возвращает массив в виде набора селекторов: [data-tags*="значение-1"], [data-tags*="значение-2"], ... , [data-tags*="значение-n"]
	Sfilters.prototype.createSelectorTypeAnd = function (arr) {
		var newArr = [];

		arr.forEach(function(item, i, arr) {
			newArr.push('[data-tags*="' + item + '"]');
		});

		return newArr.join(', ');
	};

	Sfilters.prototype.init = function () {

		this.element.addClass(this.config.containerClass);

		this.element.trigger('created.sfilters');

	};

	$.fn.sfilters = function (options) {
		'use strict';

		return $.each(this, function () {
			new Sfilters($(this), options);
		});
	};
})(jQuery);