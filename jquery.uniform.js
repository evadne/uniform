//	jquery.uniform v.1.5
//	Originally by Josh Pyles at Pixelmatrix
//	Original v.1.5 Credits: Thomas Reynolds, Buck Wilson, Mathias Bynens, David Kaneda, Eugene Bond

//	uniform/nebula
//	Evadne Wu at Iridia, 2010




/*







Developed against jQuery 1.4.

Usage:

$(function(){
	$("select, :radio, :checkbox").uniform(options);
});

You can customize the classes that Uniform uses:

$("select, :radio, :checkbox").uniform({
	selectClass: 'mySelectClass',
	radioClass: 'myRadioClass',
	checkboxClass: 'myCheckboxClass',
	checkedClass: 'myCheckedClass',
	focusClass: 'myFocusClass'
});

Enjoy!

*/










(function($) {

	if (!$) return;

	$.uniform = {

		options: {

			selectClass: 'selector',
			radioClass: 'radio',
			checkboxClass: 'checker',
			fileClass: 'uploader',
			filenameClass: 'filename',
			fileBtnClass: 'action',
			fileDefaultText: 'No file selected',
			fileBtnText: 'Choose File',
			checkedClass: 'checked',
			focusClass: 'focus',
			disabledClass: 'disabled',
			activeClass: 'active',
			hoverClass: 'hover',
			useID: true,
			idPrefix: 'uniform',
			resetSelector: false

		},

		elements: []
	};

	$.support.selectOpacity = !($.browser.msie && $.browser.version < 7);

	$.fn.uniform = function(options) {

		options = $.extend($.uniform.options, options);

		var el = this;





		if(options.resetSelector != false)
		$(options.resetSelector).mouseup(function(){

			function resetThis(){

				$.uniform.update(el);
			}

			setTimeout(resetThis, 10);

		});





		function doSelect(elem){

			var divTag = $('<div />');
			var spanTag = $('<span />');

			divTag.addClass(options.selectClass);

			if (options.useID) divTag.attr("id", options.idPrefix + "-" + elem.attr("id"));
			
			var selected = elem.find(":selected:first");
			if(selected.length == 0) selected = elem.find("option:first");
			
			spanTag.html(selected.text());
			
			elem.css('opacity', 0).wrap(divTag).before(spanTag);

		//	Redefine variables
		
			divTag = elem.parent("div");
			spanTag = elem.siblings("span");

			elem.change(function() {
				spanTag.text(elem.find(":selected").text());
				divTag.removeClass(options.activeClass);
			})
			.focus(function() {
				divTag.addClass(options.focusClass);
			})
			.blur(function() {
				divTag.removeClass(options.focusClass);
				divTag.removeClass(options.activeClass);
			})
			.mousedown(function() {
				divTag.addClass(options.activeClass);
			})
			.mouseup(function() {
				divTag.removeClass(options.activeClass);
			})
			.click(function(){
				divTag.removeClass(options.activeClass);
			})
			.hover(function() {
				divTag.addClass(options.hoverClass);
			}, function() {
				divTag.removeClass(options.hoverClass);
			})
			.keyup(function(){
				spanTag.text(elem.find(":selected").text());
			});

			//handle disabled state
			if($(elem).attr("disabled")){
				//box is checked by default, check our box
				divTag.addClass(options.disabledClass);
			}
			
			$.uniform.noSelect(spanTag);
			storeElement(elem);

		}
		
		
		
		
		
		function doCheckbox(elem){

			var divTag = $('<div />'),
					spanTag = $('<span />');

			divTag.addClass(options.checkboxClass);

			//assign the id of the element
			if(options.useID){
				divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
			}

			//wrap with the proper elements
			$(elem).wrap(divTag);
			$(elem).wrap(spanTag);

			//redefine variables
			spanTag = elem.parent();
			divTag = spanTag.parent();

			//hide normal input and add focus classes
			$(elem)
			.css("opacity", 0)
			.focus(function(){

				divTag.addClass(options.focusClass);
			})
			.blur(function(){

				divTag.removeClass(options.focusClass);
			})
			.click(function(){

				if(!$(elem).attr("checked")){
					//box was just unchecked, uncheck span
					spanTag.removeClass(options.checkedClass);
				}else{
					//box was just checked, check span.
					spanTag.addClass(options.checkedClass);
				}
			})
			.mousedown(function() {
				divTag.addClass(options.activeClass);
			})
			.mouseup(function() {
				divTag.removeClass(options.activeClass);
			})
			.hover(function() {
				divTag.addClass(options.hoverClass);
			}, function() {
				divTag.removeClass(options.hoverClass);
			});

			//handle defaults
			if($(elem).attr("checked")){
				//box is checked by default, check our box
				spanTag.addClass(options.checkedClass);
			}

			//handle disabled state
			if($(elem).attr("disabled")){
				//box is checked by default, check our box
				divTag.addClass(options.disabledClass);
			}

			storeElement(elem);

		}

		function doRadio(elem){

			var divTag = $('<div />'),
					spanTag = $('<span />');

			divTag.addClass(options.radioClass);

			if(options.useID){
				divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
			}

			//wrap with the proper elements
			$(elem).wrap(divTag);
			$(elem).wrap(spanTag);

			//redefine variables
			spanTag = elem.parent();
			divTag = spanTag.parent();

			//hide normal input and add focus classes
			$(elem)
			.css("opacity", 0)
			.focus(function(){
				divTag.addClass(options.focusClass);
			})
			.blur(function(){
				divTag.removeClass(options.focusClass);
			})
			.click(function(){
				if(!$(elem).attr("checked")){
					//box was just unchecked, uncheck span
					spanTag.removeClass(options.checkedClass);
				}else{
					//box was just checked, check span
					$("."+options.radioClass + " span."+options.checkedClass + ":has([name='" + $(elem).attr('name') + "'])").removeClass(options.checkedClass);
					spanTag.addClass(options.checkedClass);
				}
			})
			.mousedown(function() {
				if(!$(elem).is(":disabled")){
					divTag.addClass(options.activeClass);
				}
			})
			.mouseup(function() {
				divTag.removeClass(options.activeClass);
			})
			.hover(function() {
				divTag.addClass(options.hoverClass);
			}, function() {
				divTag.removeClass(options.hoverClass);
			});

			//handle defaults
			if($(elem).attr("checked")){
				//box is checked by default, check span
				spanTag.addClass(options.checkedClass);
			}
			//handle disabled state
			if($(elem).attr("disabled")){
				//box is checked by default, check our box
				divTag.addClass(options.disabledClass);
			}

			storeElement(elem);

		}

		function doFile(elem){
			//sanitize input
			$el = $(elem);

			var divTag = $('<div />'),
					filenameTag = $('<span>'+options.fileDefaultText+'</span>'),
					btnTag = $('<span>'+options.fileBtnText+'</span>');

			divTag.addClass(options.fileClass);
			filenameTag.addClass(options.filenameClass);
			btnTag.addClass(options.fileBtnClass);

			if(options.useID){
				divTag.attr("id", options.idPrefix+"-"+$el.attr("id"));
			}

			//wrap with the proper elements
			$el.wrap(divTag);
			$el.after(btnTag);
			$el.after(filenameTag);

			//redefine variables
			divTag = $el.closest("div");
			filenameTag = $el.siblings("."+options.filenameClass);
			btnTag = $el.siblings("."+options.fileBtnClass);

			//set the size
			if(!$el.attr("size")){
				var divWidth = divTag.width();
				//$el.css("width", divWidth);
				$el.attr("size", divWidth/10);
			}

			//actions
			$el
			.css("opacity", 0)
			.focus(function(){
				divTag.addClass(options.focusClass);
			})
			.blur(function(){
				divTag.removeClass(options.focusClass);
			})
			.change(function(){
				var filename = $(this).val();
				filename = filename.split(/[\/\\]+/);
				filename = filename[(filename.length-1)];
				filenameTag.text(filename);
			})
			.mousedown(function() {
				if(!$(elem).is(":disabled")){
					divTag.addClass(options.activeClass);
				}
			})
			.mouseup(function() {
				divTag.removeClass(options.activeClass);
			})
			.hover(function() {
				divTag.addClass(options.hoverClass);
			}, function() {
				divTag.removeClass(options.hoverClass);
			});

			//handle defaults
			if($el.attr("disabled")){
				//box is checked by default, check our box
				divTag.addClass(options.disabledClass);
			}
			
			$.uniform.noSelect(filenameTag);
			$.uniform.noSelect(btnTag);
			storeElement(elem);

		}

		function storeElement(elem){
			//store this element in our global array
			elem = $(elem).get();
			if(elem.length > 1){
				$.each(elem, function(i, val){
					$.uniform.elements.push(val);
				});
			}else{
				$.uniform.elements.push(elem);
			}
		}
		
		//noSelect v1.0
		$.uniform.noSelect = function(elem) {
			function f() {
 			return false;
			};
			$(elem).each(function() {
 			this.onselectstart = this.ondragstart = f; // Webkit & IE
 			$(this)
				.mousedown(f) // Webkit & Opera
				.css({ MozUserSelect: 'none' }); // Firefox
			});
 		};

		$.uniform.update = function(elem){

			elem = elem || $($.uniform.elements);
			elem = $(elem);

			elem.each(function(){
				//do to each item in the selector
				//function to reset all classes
				$e = $(this);

				if($e.is("select")){
					//element is a select
					spanTag = $e.siblings("span");
					divTag = $e.parent("div");

					divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass);

					//reset current selected text
					spanTag.html($e.find(":selected").text());

					if($e.is(":disabled")){
						divTag.addClass(options.disabledClass);
					}else{
						divTag.removeClass(options.disabledClass);
					}

				}else if($e.is(":checkbox")){
					//element is a checkbox
					spanTag = $e.closest("span");
					divTag = $e.closest("div");

					divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass);
					spanTag.removeClass(options.checkedClass);

					if($e.is(":checked")){
						spanTag.addClass(options.checkedClass);
					}
					if($e.is(":disabled")){
						divTag.addClass(options.disabledClass);
					}else{
						divTag.removeClass(options.disabledClass);
					}

				}else if($e.is(":radio")){
					//element is a radio
					spanTag = $e.closest("span");
					divTag = $e.closest("div");

					divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass);
					spanTag.removeClass(options.checkedClass);

					if($e.is(":checked")){
						spanTag.addClass(options.checkedClass);
					}

					if($e.is(":disabled")){
						divTag.addClass(options.disabledClass);
					}else{
						divTag.removeClass(options.disabledClass);
					}
				}else if($e.is(":file")){
					divTag = $e.parent("div");
					filenameTag = $e.siblings(options.filenameClass);
					btnTag = $e.siblings(options.fileBtnClass);

					divTag.removeClass(options.hoverClass+" "+options.focusClass+" "+options.activeClass);

					filenameTag.text($e.val());

					if($e.is(":disabled")){
						divTag.addClass(options.disabledClass);
					}else{
						divTag.removeClass(options.disabledClass);
					}
				}
			});
		}

		return this.each(function() {
		
			if(!$.support.selectOpacity) return;

			var elem = $(this);

			if(elem.is("select") && !elem.attr("multiple")) {

				if(elem.attr("multiple") != true)
				doSelect(elem);
				
			} else if (elem.is(":checkbox")) {

				doCheckbox(elem);

			} else if (elem.is(":radio")) {

				doRadio(elem);

			} else if (elem.is(":file")) {

				doFile(elem);
			}

		});
	};
})(jQuery);
