/*GROUPTREE FORM CUSTOMIZER 1.02 - 24.10.2014*/
/*$("#forWrapper").customize({
//classes
class_fakeInput: "fake-input",
class_active: "active",
class_fakeSelect: "fake-select",
selectDropdown: true,
inputRadio: true,
inputCheckbox: true,
displayDropdownEffect: 0 //0 show | 1 fade | 2 slide
});

Note:
If the page contains more than one form, it should be used as this:
$('.form').each( function () {
$(this).customize();
});

*/

$.fn.customize = function (options) {


};

(function ($) {
    $.customize = function (object, options) { };

    $.fn.customize = function (options) {

        //Iterate over each object  
        this.each(function () {

            var self = $(this);

            /*__functions definition*/
            /**********************************************/
            /*customize checkboxes*/
            self.customizeCheckboxes = function () {
                checkboxinputs.each(function () {
                    if(!$(this).closest("." + opts.class_fakeInput).length)
                    {
                        $(this).wrap('<a href="javascript: void(0);" class="fa ' + opts.class_fakeInput + ' checkbox" />');
                        self.bindBoxEvents($(this));
                    }
                });
            }
            /*customize radios*/
            self.customizeRadios = function () {
                radioinputs.each(function () {
                    if(!$(this).closest("." + opts.class_fakeInput).length)
                    {
                        $(this).wrap('<a href="javascript: void(0);" class="fa ' + opts.class_fakeInput + ' radio" />');
                        self.bindBoxEvents($(this));
                    }
                });
            }

            /*binding box events*/
            self.bindBoxEvents = function (input) {
                var fakeInput = input.closest('.' + opts.class_fakeInput);
                var isChecked = ((input.prop('checked')) ? fakeInput.addClass(opts.class_active) : fakeInput.removeClass(opts.class_active));
                /*fake input click*/
                fakeInput.click(function () {
                    if (input.attr('type') == "radio") {
                        var radioname = input.attr("name");
                        $('input[name="' + radioname + '"]').each(function () {
                            $(this).closest('.' + opts.class_fakeInput).removeClass(opts.class_active).find('input').prop('checked', false);
                        });
                        fakeInput.addClass(opts.class_active);
                        input.prop('checked', true).change();
                    } else {
                        if (fakeInput.hasClass(opts.class_active)) {
                            fakeInput.removeClass(opts.class_active);
                            input.prop('checked', false).change();
                        } else {
                            fakeInput.addClass(opts.class_active);
                            input.prop('checked', true).change();
                        }
                    }
                });

                /*fake input focus*/
                fakeInput.focus(function () {
                    $(this).bind('keypress', function (e) { 
                        e.preventDefault();
                        if (e.keyCode == 32) 
                        {
                            if (input.attr('type') == "radio") {
                                var radioname = input.attr("name");
                                $('input[name="' + radioname + '"]').each(function () {
                                    $(this).closest('.' + opts.class_fakeInput).removeClass(opts.class_active).find('input').prop('checked', false);
                                });
                                fakeInput.addClass(opts.class_active);
                                input.prop('checked', true).change();
                            } else {
                                if (fakeInput.hasClass(opts.class_active)) {
                                    fakeInput.removeClass(opts.class_active);
                                    input.prop('checked', false).change();
                                } else {
                                    fakeInput.addClass(opts.class_active);
                                    input.prop('checked', true).change();
                                }
                            }
                        }
                    });
                });

                /*input change*/
                input.change( function () {
                    if($(this).is(":checked"))
                    {
                        fakeInput.addClass(opts.class_active);
                    } else {
                        fakeInput.removeClass(opts.class_active);
                    }
                });
            }

            /*customize select dropdowns*/
            self.customizeSelectDropdowns = function () {
                var arrowClass = opts.class_fakeSelect + "-arrow";
                var activeOptionClass = opts.class_fakeSelect + "-active-opt";
                var selectCounter = 0;

                selectdropdowns.each(function () {
                    var selectDropdown = $(this);
                    if(!selectDropdown.closest("." + opts.class_fakeSelect).length)
                    {
                        /*getting the original id of the select*/
                        var idOriginalSelect = $(this).attr('id');
                        var classIDoriginal = "";
                        if (idOriginalSelect !== undefined) { classIDoriginal = " " + opts.class_fakeSelect + "-" + idOriginalSelect; }
                        /*wrapping select and get default value*/
                        var selectWrapper = document.createElement('span');
                        selectDropdown.wrap('<span />').closest("span").addClass(opts.class_fakeSelect + classIDoriginal);
                        var selectWrapper = selectDropdown.closest("span." + opts.class_fakeSelect);
                        selectWrapper.append('<span class="' + arrowClass + '" />');
                        selectWrapper.append('<span class="' + activeOptionClass + '" />');
                        var activeOption = selectWrapper.find('.' + activeOptionClass);
                        activeOption.html(selectDropdown.find(':selected').text());
                        $('body').append($(document.createElement('span')).addClass(opts.class_fakeSelect + '-options-cotainer').append('<ul />'));
                        var optionsContainer = $("." + opts.class_fakeSelect + '-options-cotainer:last');
                        var optionsCounter = 0;
                        selectDropdown.find('option').each(function () {
                            optionsContainer.find('ul').append('<li><a id="option' + optionsCounter + '" href="javascript: void(0)">' + $(this).text() + '</a></li>');
                            optionsCounter++;
                        });
                        /*seting options container CSS*/
                        selectDropdown.optionsContainer = optionsContainer;
                        selectDropdown.selectWrapper = selectWrapper;
                        selectDropdown.activeOption = activeOption;
                        var optionsCSS = {
                            'width': selectDropdown.selectWrapper.outerWidth()
                        };
                        selectDropdown.optionsContainer.css(optionsCSS);
                        self.bindSelectEvents(selectDropdown);
                        selectCounter++;
                    }
                });
            }

            /*binding select events*/
            self.bindSelectEvents = function (selectDropdown) {
                var optionsContainer = selectDropdown.optionsContainer;
                var activeOptionClass = opts.class_fakeSelect + "-active-opt";
                var activeOption = selectDropdown.find('.' + activeOptionClass);
                selectDropdown.selectWrapper.on("click", function (e) {
                    e.stopPropagation();
                    if ($(this).hasClass('active')) {
                        self.hideDropdown(selectDropdown);
                        $(this).removeClass('active');
                    } else {
                        self.hideDropdown();
                        self.showDropdown(selectDropdown);
                        $(this).addClass('active');
                    }
                });
                $('body').click(function () {
                    self.hideDropdown();
                    selectDropdown.selectWrapper.removeClass('active');
                });
                selectDropdown.optionsContainer.find('a').each(function () {
                    $(this).click(function () {
                        selectDropdown.activeOption.html($(this).html());
                        var id = $(this).attr('id').replace('option', '');
                        selectDropdown[0].selectedIndex = id;
                        selectDropdown.closest(".fake-select").removeClass("error");
                        selectDropdown.change();
                    });
                });
            }

            self.showDropdown = function (selectDropdown) {
                var offset = 0;
                offset = selectDropdown.selectWrapper.offset();
                offset.top = offset.top + selectDropdown.selectWrapper.outerHeight() -1;
                var optionsCSS = {
                    'top': offset.top,
                    'left': offset.left
                };
                selectDropdown.optionsContainer.css(optionsCSS);
                switch (opts.displayDropdownEffect) {
                    case 0: selectDropdown.optionsContainer.show();
                        break;
                    case 1: selectDropdown.optionsContainer.fadeIn();
                        break;
                    case 2: selectDropdown.optionsContainer.slideDown();
                        break;
                    default: selectDropdown.optionsContainer.show();
                        break;
                }
            }

            self.hideDropdown = function () {
                var optionsContainer = $("." + opts.class_fakeSelect + '-options-cotainer');
                switch (opts.displayDropdownEffect) {
                    case 0: optionsContainer.hide();
                        break;
                    case 1: optionsContainer.fadeOut();
                        break;
                    case 2: optionsContainer.slideUp();
                        break;
                    default: optionsContainer.hide();
                        break;
                }
            }

            //default options
            /**********************************************/
            self.defaults = {
                //classes
                class_fakeInput: "fake-input",
                class_active: "active",
                class_fakeSelect: "fake-select",
                selectDropdown: true,
                inputRadio: true,
                inputCheckbox: true,
                displayDropdownEffect: 0 //0 show | 1 fade | 2 slide
            };

            var opts = $.extend({}, self.defaults, options);
            var checkboxinputs = $(self).find('input[type="checkbox"]');
            var radioinputs = $(self).find('input[type="radio"]');
            var selectdropdowns = $(self).find('select');

            if (opts.selectDropdown) {
                self.customizeSelectDropdowns();
            }
            if (opts.inputRadio) {
                self.customizeRadios();
            }
            if (opts.inputCheckbox) {
                self.customizeCheckboxes();
            }

            // Unless the plug-in is returning an intrinsic value, always have the  
            // function return the 'this' keyword to maintain chainability  
            return this;
        });
    };
})(jQuery);  