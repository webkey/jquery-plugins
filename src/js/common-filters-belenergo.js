/**
 * Пример подключения jq плагина с настройками
 */

$(function () {
	/**
	 * !Plugin collapse and expand blocks by fire events on the title of these blocks
	 * !Extended capabilities
	 * */
	(function ($) {
		var JsAccordion = function (settings) {
			var options = $.extend(true, {
				accordionContainer: null,
				accordionItem: null,
				accordionHeader: null, // wrap for accordion's switcher
				accordionHand: null, // accordion's switcher
				accordionContent: null,
				indexInit: 0, // if "false", all accordion are closed
				showFromHash: true, // if "false", all accordion are closed
				animateSpeed: 300,
				scrollToTop: false, // if true, scroll to current accordion;
				scrollToTopSpeed: 300,
				scrollToTopOffset: 0,
				clickOutside: false, // if true, close current accordion's content on click outside accordion;
				collapseInside: true, // collapse attachments,
				modifiers: {
					activeItem: 'is-open',
					activeHeader: 'is-open',
					activeHand: 'is-open',
					activeContent: 'is-open',
					noHoverClass: 'is-open'
				}
			}, settings || {});

			this.options = options;
			var container = $(options.accordionContainer);

			this.$accordionContainer = container;
			this.$accordionItem = $(options.accordionItem, container);
			this.$accordionHeader = $(options.accordionHeader, container);
			this.$accordionHand = $(options.accordionHand, container);
			this.$accordionContent = options.accordionContent ?
				$(options.accordionContent, container) :
				this.$accordionHeader.next();

			this.scrollToTop = options.scrollToTop;
			this._scrollToTopSpeed = options.scrollToTopSpeed;
			this._scrollToTopOffset = options.scrollToTopOffset;
			this.clickOutside = options.clickOutside;
			this._indexInit = options.indexInit;
			this._animateSpeed = options.animateSpeed;
			this._collapseInside = options.collapseInside;

			this.modifiers = options.modifiers;

			this.bindEvents();
			if (options.indexInit !== false) {
				this.activeAccordion();
			}
			this.hashAccordion();
		};

		JsAccordion.prototype.bindEvents = function () {
			var self = this,
				$accordionContent = self.$accordionContent,
				animateSpeed = self._animateSpeed,
				modifiers = self.modifiers;

			self.$accordionHand.on('click', 'a', function (e) {
				e.stopPropagation();
			});

			self.$accordionHand.on('mouseenter', 'a', function () {
				$(this).closest(self.$accordionHand).addClass(modifiers.noHoverClass);
			}).on('mouseleave', 'a', function () {
				$(this).closest(self.$accordionHand).removeClass(modifiers.noHoverClass);
			});

			self.$accordionHand.on('click', function (e) {
				e.preventDefault();

				var $currentHand = $(this),
					$currentHeader = $currentHand.closest(self.$accordionHeader),
					$currentItem = $currentHand.closest(self.$accordionItem),
					$currentItemContent = $currentHeader.next();

				if ($accordionContent.is(':animated')) return;

				if ($currentHeader.hasClass(modifiers.activeHeader)){

					$currentItem.removeClass(modifiers.activeItem);
					$currentHeader.removeClass(modifiers.activeHeader);
					$currentHand.removeClass(modifiers.activeHand);
					$currentItemContent.removeClass(modifiers.activeContent);

					$currentItemContent.slideUp(animateSpeed, function () {

						// console.log('closed');

						if (self._collapseInside) {
							var $internalContent = $currentItem.find(self.$accordionHeader).next();

							$.each($internalContent, function () {
								if ($(this).hasClass(self.modifiers.activeContent)) {

									// self.scrollPosition($currentItem);

									$(this).slideUp(self._animateSpeed, function () {
										// console.log('closed attachment');
										self.scrollPosition($currentItem);
									});
								}
							});


							$currentItem.find(self.$accordionItem).removeClass(self.modifiers.activeItem);
							$currentItem.find(self.$accordionHeader).removeClass(self.modifiers.activeHeader);
							$currentItem.find(self.$accordionHand).removeClass(self.modifiers.activeHand);
							$internalContent.removeClass(self.modifiers.activeContent);
						}
					});

					return;
				}

				var $siblings = $currentItem.siblings();

				$siblings.find(self.$accordionHeader).next().slideUp(self._animateSpeed, function () {
					// console.log('closed siblings');
				});

				$siblings.removeClass(modifiers.activeItem);
				$siblings.find(self.$accordionHeader).removeClass(modifiers.activeHeader);
				$siblings.find(self.$accordionHand).removeClass(modifiers.activeHand);
				$siblings.find(self.$accordionHeader).next().removeClass(modifiers.activeContent);

				// self.scrollPosition($currentItem);

				$currentItemContent.slideDown(animateSpeed, function () {
					// console.log('opened');
					self.scrollPosition($currentItem);
				});

				$currentItem.addClass(modifiers.activeItem);
				$currentHeader.addClass(modifiers.activeHeader);
				$currentHand.addClass(modifiers.activeHand);
				$currentItemContent.addClass(modifiers.activeContent);

				e.stopPropagation();
			});

			$(document).click(function () {
				if (self.clickOutside) {
					self.closeAllAccordions();
				}
			});

			$accordionContent.on('click', function(e){
				e.stopPropagation();
			});
		};

		// show accordion's content from hash tag
		JsAccordion.prototype.hashAccordion = function() {
			var self = this;
			var modifiers = self.modifiers,
				hashTag = window.location.hash;

			if ( !hashTag ) return false;

			var activeItemClass = modifiers.activeItem;
			var activeHeaderClass = modifiers.activeHeader;
			var activeHandClass = modifiers.activeHand;
			var activeContentClass = modifiers.activeContent;

			var $accordionHeader = self.$accordionHeader;
			var $accordionItem = self.$accordionItem;

			var $currentItem = $(hashTag);
			var $currentItemParents = $currentItem.parents().filter($accordionItem);

			// open parents accordion

			if ($currentItemParents.length) {
				var $currentHeaderParents = $currentItemParents.children($accordionHeader),
					$currentHandParents = $currentItemParents.children($accordionItem),
					$currentItemContentParents = $currentHeaderParents.next();

				$currentItemContentParents.slideDown(0);

				$currentItemParents.addClass(activeItemClass);
				$currentHeaderParents.addClass(activeHeaderClass);
				$currentHandParents.addClass(activeHandClass);
				$currentItemContentParents.addClass(activeContentClass);
			}

			// open current accordion

			var $currentHeader = $currentItem.children($accordionHeader),
				$currentHand = $currentHeader.children($accordionItem),
				$currentItemContent = $currentHeader.next();

			$currentItemContent.slideDown(0, function () {
				self.scrollPosition($currentItem);
			});

			$currentItem.addClass(activeItemClass);
			$currentHeader.addClass(activeHeaderClass);
			$currentHand.addClass(activeHandClass);
			$currentItemContent.addClass(activeContentClass);
		};

		// show current accordion's content
		JsAccordion.prototype.activeAccordion = function() {
			var self = this;
			var indexInit = self._indexInit;

			if ( indexInit === false ) return false;

			$.each(self.$accordionContainer, function () {
				var $currentItem = $(this).children().eq(indexInit);

				$currentItem.addClass(self.modifiers.activeItem);
				$currentItem.children(self.$accordionHeader).addClass(self.modifiers.activeHeader);
				$currentItem.children(self.$accordionHeader).find(self.$accordionHand).addClass(self.modifiers.activeHand);

				// self.scrollPosition($currentItem);

				$currentItem.children(self.$accordionHeader).next().addClass(self.modifiers.activeContent).slideDown(self._animateSpeed, function () {
					// console.log('opened active');

					// self.scrollPosition($currentItem);
				});
			});
		};

		// close all accordions
		JsAccordion.prototype.closeAllAccordions = function() {
			var self = this;

			self.$accordionHeader.next().slideUp(self._animateSpeed, function () {
				// console.log('closed all');
			});

			var modifiers = self.modifiers;

			self.$accordionItem.removeClass(modifiers.activeItem);
			self.$accordionHeader.removeClass(modifiers.activeHeader);
			self.$accordionHand.removeClass(modifiers.activeHand);
			self.$accordionHeader.next().removeClass(modifiers.activeContent);
		};

		// open all accordions
		JsAccordion.prototype.openAllAccordions = function() {
			var self = this;

			self.$accordionHeader.next().slideDown(self._animateSpeed, function () {
				// console.log('open all');
			});

			var modifiers = self.modifiers;

			self.$accordionItem.addClass(modifiers.activeItem);
			self.$accordionHeader.addClass(modifiers.activeHeader);
			self.$accordionHand.addClass(modifiers.activeHand);
			self.$accordionHeader.next().addClass(modifiers.activeContent);
		};

		JsAccordion.prototype.scrollPosition = function (element) {
			var self = this;
			if (self.scrollToTop && !$('html, body').is('animated')) {
				$('html, body').animate({ scrollTop: element.offset().top - self._scrollToTopOffset }, self._scrollToTopSpeed);
			}
		};

		window.JsAccordion = JsAccordion;
	}(jQuery));

	/**
	 * Initial accordion
	 * */
	function initMultiAccordion() {
		// accordion default
		var $accordion = $('.js-accordion__container');

		if($accordion.length){
			new JsAccordion({
				accordionContainer: '.js-accordion__container',
				accordionItem: '.js-accordion__item',
				accordionHeader: '.js-accordion__header',
				accordionHand: '.js-accordion__hand',
				// scrollToTop: true,
				// scrollToTopSpeed: 300,
				// scrollToTopOffset: $('.header').outerHeight(),
				indexInit: false,
				clickOutside: false,
				animateSpeed: 200
			});
		}
	}

	initMultiAccordion();

	/**
	 * filter structure
	 * */
	var $filtersContainer = $('.filters-container-js');

	if($filtersContainer.length) {
		$filtersContainer.sfilters({
			tagsItem: $('.structure-item')
		});
	}
});