;(function($) {
	$.fn.scrollNav = function(method) {
		var $doc = $(document), $win = $(window);
		var methods = {
			// set $link as current, unset others
			setAsCurrent: function($link) {
				var o = $(this).data('options');
				$(this).find(o['selectors']['current']).removeClass(o['classes']['current']);
				if ($link.size()) {
					$link.addClass(o['classes']['current']);
				}
				if (o['hooks']['onChange']) o.hooks.onChange.apply($(this), [$link]);
			},
			detectSectionOffsets: function() {
				var target, o, sectionOffsets = {};
				$(this).data('buttons').each(function() {
					target = $(this).attr('href');
					try {
                        o = $(target).offset();
                    } catch(e) { o = null;}
					if (null !== o) {
						sectionOffsets[target] = Math.round(o.top);
					}
				});
				return sectionOffsets;
			},
			updateSectionOffsets: function() { $(this).data('sectionOffsets', $(this).scrollNav('detectSectionOffsets'));},
			getCurrentSection: function() {
				var H = Math.round($win.height()/2), top = $win.scrollTop();
				var currentSection = null;
				$.each($(this).data('sectionOffsets'), function(section, offset) {
					if ((offset - H) < top)
						currentSection = section;
				});
				return currentSection;
			},
			onScroll: function() {
				var lastSection = $(this).data('lastSection');
				var section = $(this).scrollNav('getCurrentSection');
				if (null == section) return;
				if (lastSection === section) return;
				$(this).data('lastSection', section);
				$(this).scrollNav('setAsCurrent', $(this).data('buttons').filter(function() {
					return $(this).attr('href') === section;
				}));
			},
			init: function(options) {
				var opts = $.extend({}, $.fn.scrollNav.defaults, options);
				return this.each(function() {
					var $self = $(this);
					var o = $.meta ? $.extend({}, opts, $self.data()) : opts;
					var $btns = $self.find(o['selectors']['button']);
					$self.data('options', o);
					$self.data('lastSection', null);
					$self.data('buttons', $btns);
					$self.scrollNav('updateSectionOffsets');
					$btns.click(function(e) {
						e.preventDefault();
						var $link = $(this);
						if ($link.is(o['selectors']['current'])) return;
						$self.scrollNav('setAsCurrent', $link);
						$doc.unbind('scroll.scrollNav');
						$.scrollTo($link.attr('href'), $.extend(true, {}, o['scrollTo'], {
							onAfter: function() {
								if (o['changeHash']) $win.get().location.hash = href;
								$doc.bind('scroll.scrollNav', function() { $self.scrollNav('onScroll');});
							}
						}));
					});
					$doc.bind('scroll.scrollNav', function() { $self.scrollNav('onScroll');});
					$self.scrollNav('onScroll');
				});
			}
		};

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.scrollNav' );
		}
	};

	// default options
	$.fn.scrollNav.defaults = {
		selectors: {
			button: 'a[href]',
			'current': '.current'
		},
		'classes': {
			current: 'current'
		},
		changeHash: false,
		scrollTo: {
			duration: 750,
			axis: 'y'
		},
		hooks: {
		}
	};

})(jQuery);