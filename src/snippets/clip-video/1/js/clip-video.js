$(function () {
	var $toggleEl = $('.js-toggle-el');
	var $closeEl = $('.js-close-el');
	var $container = $('.js-clip-container');
	var $clipEl = $('.js-clip');
	var $clipElHolder = $('.js-clip-holder');
	var $clipElShadow = $('.js-clip-shadow');
	var $clipElVideoFrame = $('.js-clip-video-frame');
	var $video = $('video', $container);
	var animationDuration = {
		show: 0.65,
		expand: 0.5
	};
	var leftPos = 0;
	var topPos = 0;
	var isExpanded = false;
	var isShow = false;
	var saveParams = false;
	var bindEvents = 'mousemove mouseenter mouseleave click';
	var unbindEvents = 'mousemove mouseenter mouseleave click';

	/* Auxiliary elements */
	var rulerLeft = $('<div>', {
		class: 'ruler-left',
		css: {
			position: 'absolute',
			right: '100%',
			bottom: '100%',
			height: 30,
			textAlign: 'center',
			borderBottom: '1px solid lightblue'
		}
	}).clone().prependTo($clipEl);
	var rulerTop = $('<div>', {
		class: 'ruler-top',
		css: {
			position: 'absolute',
			left: 0,
			bottom: '100%',
			paddingLeft: 10,
			borderLeft: '1px solid lightblue'
		}
	}).clone().prependTo($clipEl);

	/* Event on toggle button */
	$toggleEl.off(bindEvents).on(bindEvents, eventsClipVideo());

	$closeEl.off('click').on('click', function (e) {
		var $curContainer = $(this).closest($container);
		collapseVideo($curContainer);
		hideVideo($curContainer);
		e.preventDefault();
	});

	$('html').keyup(function (event) {
		if (isExpanded && event.keyCode === 27) {
			collapseVideo($container);
			hideVideo($container);
		}
	});

	function eventsClipVideo() {
		return function (e) {
			var $curToggleEl = $(this);
			var $curContainer = $curToggleEl.closest($container);
			/* Position on document */
			var x = e.pageX;
			var y = e.pageY;
			// console.log("e: ", e);
			// console.log("e.handleObj.origType: ", e.handleObj.origType);
			// console.log("mouse offset (left, top): ", x + ', ' + y);
			/* Position inside toggle button */
			var offsetX = e.offsetX;
			var offsetY = e.offsetY;
			console.log("mouse offset inner (left, top): ", offsetX + ', ' + offsetY);

			var containerOffset = $curContainer.offset();
			// console.log("container offset (left, top): ", containerOffset.left + ', ' + containerOffset.top);

			var containerHeight = $curContainer.innerHeight();
			var containerWidth = $curContainer.innerWidth();

			leftPos = x - containerOffset.left + containerWidth / 10 + offsetX / 2;
			topPos = y - containerOffset.top - $clipEl.innerHeight() / 2;
			// console.log("real position (left, top): ", leftPos + ', ' + topPos);

			/* Mousemove */
			if (e.handleObj.origType === 'mousemove') {
				/* Position clip box */
				TweenMax.to($clipEl, 0.25, {
					x: leftPos,
					y: topPos,
				});

				/* Position and size video frame */
				TweenMax.to($clipElVideoFrame, 0.25, {
					x: -leftPos,
					y: -topPos,
					height: containerHeight,
					width: containerWidth,
				});

				/* Auxiliary elements */
				rulerLeft.text(leftPos).width(leftPos);
				rulerTop.text(topPos).css({
					height: topPos,
					lineHeight: topPos + 'px',
				});
			}

			/* Mouseenter */
			if (e.handleObj.origType === 'mouseenter') {
				showVideo($curContainer);
			}

			/* Mouseleave */
			if (e.handleObj.origType === 'mouseleave') {
				hideVideo($curContainer);
			}

			/* Click */
			if (e.handleObj.origType === 'click') {
				/* Unbind events on current toggle element */
				$curToggleEl.off(unbindEvents);

				// console.log("isExpanded: ", isExpanded);

				if (isExpanded) {
					collapseVideo($curContainer);
					// TweenMax.pauseAll();
				} else {
					expandVideo($curContainer);
				}
				
				e.preventDefault();
			}
		};
	}

	/* Show video */
	function showVideo($container) {
		$container.addClass('video-show');
		TweenMax.to($clipElHolder, animationDuration.show, {
			opacity: 1,
			scale: 1,
		});

		$video.attr('autoplay', 'autoplay');
		$video[0].play();

		isShow = true;
	}

	/* Hide video */
	function hideVideo($container) {
		$container.removeClass('video-show');
		TweenMax.to($clipElHolder, animationDuration.show, {
			opacity: 0,
			scale: 0.2,
		});

		$video.each(function () {
			$(this).removeAttr('autoplay');
			this.pause();
		});

		isShow = false;
	}

	/* Expand video */
	function expandVideo($container) {
		$container.addClass('video-expand');

		/* Save the initial parameters */
		if (!saveParams) {
			saveParams = true;
			// console.log("real position (left, top): ", leftPos + ', ' + topPos);
			$clipEl.data('leftPos', leftPos);
			$clipEl.data('topPos', topPos);
			$clipEl.data('height', $clipEl.innerHeight());
			$clipEl.data('width', $clipEl.innerWidth());
			$clipEl.data('borderRadius', $clipEl.css('borderRadius'));
			$clipEl.data('boxShadow', $clipElShadow.css('boxShadow'));
		}

		/* Position and size clip box */
		TweenMax.to($clipEl, animationDuration.expand, {
			x: 0,
			y: 0,
			height: $container.innerHeight(),
			width: $container.innerWidth(),
			borderRadius: 0,
			// ease: Circ.easeOut,
			ease: Power3.easeOut,
			onComplete: function () {
				TweenMax.to($closeEl, animationDuration.expand, {
					autoAlpha: 1
				});
			},
		});

		/* Opacity and scale */
		TweenMax.to($clipElHolder, animationDuration.expand, {
			opacity: 1,
			scale: 1
		});

		/* Clear box-shadow */
		TweenMax.to($clipElShadow, animationDuration.expand, {
			boxShadow: 'inset 0px 0px 0px 0px transparent',
		});

		/* Position video frame */
		TweenMax.to($clipElVideoFrame, animationDuration.expand, {
			x: 0,
			y: 0,
		});

		isExpanded = true;
	}

	/* Collapse video */
	function collapseVideo($container) {
		$container.removeClass('video-expand');

		// console.log("$clipEl.data('leftPos'): ", $clipEl.data('leftPos'));
		// console.log("$clipEl.data('topPos'): ", $clipEl.data('topPos'));

		/* Hide close button */
		TweenMax.to($closeEl, animationDuration.expand, {
			autoAlpha: 0
		});

		/* Restore size, position and border-radius clip box */
		TweenMax.to($clipEl, animationDuration.expand, {
			x: $clipEl.data('leftPos'),
			y: $clipEl.data('topPos'),
			height: $clipEl.data('height'),
			width: $clipEl.data('width'),
			borderRadius: $clipEl.data('borderRadius'),
			onComplete: function () {
				/* Bind unbinded events on current toggle element */
				$($toggleEl, $container).on(unbindEvents, eventsClipVideo());
			},
		});
		
		// console.log("$clipEl.data('boxShadow'): ", $clipEl.data('boxShadow'));

		/* Restore box-shadow */
		TweenMax.to($clipElShadow, animationDuration.expand, {
			boxShadow: $clipEl.data('boxShadow'),
		});

		isExpanded = false;
	}
});