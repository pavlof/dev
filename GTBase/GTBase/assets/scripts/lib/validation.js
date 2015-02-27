/*GROUPTREE VALIDATION PLUGIN 1.11 (22.04.2014) */

/*$('form').validate({
//classes
class_error: "error",
class_mandatory: "required",
// error messages  
message_emptyField: "This field is empty",
message_wrongEmail: "Check your email address",
message_wrongPostcode: "Check the postcode",
message_wrongTelephone: "Check the telephone number",
message_wrongDate: "Insert a date (dd-mm-yyyy)",
message_wrongCreditcard: "Check the credit card number",
message_wrongCCSCode: "Check the credit card security code",
message_differentPass: "The passwords are different",
message_differentEmails: "The emails are different",
message_tooShortPass: "The password is too short",
message_noOptionSelected: "You should select an option",
message_noBoxClicked: "You should select an option",
message_differentFields: "Fields are different",
message_endDateBeforeStart: "The end date should be after the start date",
message_notenoughtcharacters: "The field needs at least ##numberMin## characters",
message_tooManyCharacters: "the maximum number of characters for this field is ##numberMax##",
message_wrongNumber: "The value should be only numbers",
message_wrongURL: "The value should be an URL",
//functions
function_allCorrects: self.submitHandler,
function_wrongForm: self.errorHandler,
//parameters
silent_mode: false,
min_passLenght: 3,
checkbox_label_error_class: false,
error_as_value: true,
error_html: "<span class='validation-label'>##MESSAGE##</span>"
});*/

$.fn.validate = function (options) {

    var self = this;

    /*__functions definition*/
    /**********************************************/
    /*validate text fields*/
    this.validateTextFields = function () {
        textinputs.each(function () {

            var value = $(this).val();
            var fieldrepeatSelector = $(this).attr("data-fieldrepeat");
            var minchars = parseInt($(this).attr("data-minchars"));
            var maxchars = parseInt($(this).attr("data-maxchars"));

            var isMandatory = $(this).hasClass(opts.class_mandatory);
            var fieldIsEmpty = (value === undefined || value == "" || value == $(this).attr("placeholder") || $.inArray(value, messages_array) == 1);

            if (isMandatory && fieldIsEmpty) {
                self.setWrongField($(this), opts.message_emptyField);                         //empty field
            } else if (!fieldIsEmpty) {
                if ($(this).hasClass('email') && !self.validateEmail(value)) {
                    self.setWrongField($(this), opts.message_wrongEmail);                     //not email
                }
                if ($(this).hasClass('ccard') && !self.validateCreditCardNumber(value)) {
                    self.setWrongField($(this), opts.message_wrongCreditcard);                //not credit card num
                }
                if ($(this).hasClass('email-repeat') && value != emailInput.val()) {
                    self.setWrongField($(this), opts.message_differentEmails);                //not credit card num                 
                }
                if ($(this).hasClass('ccscode') && !self.validateCreditCardSC(value)) {
                    self.setWrongField($(this), opts.message_wrongCCSCode);                   //not credit card security code
                }
                if ($(this).hasClass('postcode') && !self.validatePostCode(value)) {
                    self.setWrongField($(this), opts.message_wrongPostcode);                  //not postcode
                }
                if ($(this).hasClass('telephone') && !self.validateTelephone(value)) {
                    self.setWrongField($(this), opts.message_wrongTelephone);                  //not telephone
                }
                if ($(this).hasClass('number') && !self.validateNumber(value)) {
                    self.setWrongField($(this), opts.message_wrongNumber);                  //not number
                }
                if ($(this).hasClass('url') && !self.validateURL(value)) {
                    self.setWrongField($(this), opts.message_wrongURL);                  //not url
                }
                if (fieldrepeatSelector !== undefined && value != $(fieldrepeatSelector).val()) {
                    self.setWrongField($(this), opts.message_differentFields);
                }
                if (minchars !== undefined && value.length < minchars) {
                    self.setWrongField($(this), opts.message_notenoughtcharacters);
                }
                if (maxchars !== undefined && value.length > maxchars) {
                    self.setWrongField($(this), opts.message_tooManyCharacters);
                }

            }
        });
    }

    /*validate date fields*/
    this.compareDates = function (startdate, enddate) {
        var startdate, enddate, stardateinput, enddateinput = null;
        var NaNfield = false;
        var doNotCompare = false;
        dateinputs.each(function () {                                                       //check the value of each date field
            var value = $(this).val();
            var dt = self.convertStringToDate(value);                                       //converting value to date object

            NaNfield = isNaN(dt);

            if (value === undefined || value == "" || value == $(this).attr("placeholder") || $.inArray(value, messages_array) != -1) {
                self.setWrongField($(this), opts.message_emptyField);                           //if the field is empty
            } else {
                if (isNaN(dt)) {
                    self.setWrongField($(this), opts.message_wrongDate);                        //if the field is empty or wrong format
                } else {
                    if ($(this).hasClass('start-date')) {
                        startdate = self.convertStringToDate($(this).val());                    //set start date vars
                        stardateinput = $(this);
                    } else if ($(this).hasClass('end-date')) {
                        enddate = self.convertStringToDate($(this).val());                      //set end date vars
                        endateinput = $(this);
                    } else {
                        doNotCompare = true;
                    }
                }
            }
        });
        if (startdate >= enddate && !NaNfield && !doNotCompare) {
            self.setWrongField(endateinput, opts.message_endDateBeforeStart);               //if end before start date and both have a well formated date set wrong field
        }
    }


    /*validate password fields*/
    this.validatePasswordFields = function () {
        passinputs.each(function () {
            var value = $(this).val();
            if (value === undefined || value == "" || value == $(this).attr("placeholder") || $.inArray(value, messages_array) != -1 && !$(this).hasClass("pass-repeat")) {
                self.setWrongField($(this), opts.message_emptyField);                         	//empty pass field
            } else {
                if (value.length <= (opts.min_passLenght - 1)) {
                    self.setWrongField($(this), opts.message_tooShortPass);                    	//password too short
                    self.setWrongField(passRepeat, opts.message_tooShortPass);
                } else {
                    if (passRepeat.length && value != passRepeat.val()) {
                        //self.setWrongField($(this), opts.message_differentPass);               	//different pass
                        self.setWrongField(passRepeat, opts.message_differentPass);
                    }
                }
            }
        });
    }

    /*validate textarea*/
    this.validateTextareas = function () {
        textareas.each(function () {
            var minchars = parseInt($(this).attr("data-minchars"));
            var value = $(this).val();
            if (value === undefined || value == "" || value == $(this).attr("placeholder") || $.inArray(value, messages_array) != -1) {
                self.setWrongField($(this), opts.message_emptyField);             				//empty textarea
            } else if (minchars !== undefined && value.length < minchars) {
                self.setWrongField($(this), opts.message_notenoughtcharacters);
            }
        });
    }

    /*validate selectdropdowns*/
    this.validateSelects = function () {
        selectdropdowns.each(function () {
            if ($(this).val() == "null" || $(this).val() === undefined || $(this).val() == "") {   //null value
                self.setWrongField($(this), opts.message_noOptionSelected);                 	   //default option selected
            }
        });
    }

    /*validate radio buttons */
    this.validateRadioInputs = function () {
        var radioNamesArray = self.createInputNamesArray(radioinputs);
        for (i = 0; i <= (radioNamesArray.length - 1); i++) {
            var radioName = radioNamesArray[i];
            var lenght = 0;
            formwrapper.find('input[name="' + radioName + '"]').each(function () {
                if ($(this).is(':checked') || $(this).attr('checked') !== undefined) {
                    lenght++;
                }
            });
            if (lenght == 0) {
                self.setWrongField(formwrapper.find('input[name="' + radioName + '"]'), opts.message_noBoxClicked);         //no fields with this name selected
            }
        }
    }

    /*validate checbox buttons */
    this.validateCheckboxInputs = function () {
        var checkboxNamesArray = self.createInputNamesArray(checkboxinputs);
        for (i = 0; i <= (checkboxNamesArray.length - 1); i++) {
            var checkboxName = checkboxNamesArray[i];
            var lenght = 0;
            formwrapper.find('input[name="' + checkboxName + '"]').each(function () {
                if ($(this).is(':checked') || $(this).attr('checked') !== undefined) {
                    lenght++;
                }
            });
            if (lenght == 0) {
                self.setWrongField(formwrapper.find('input[name="' + checkboxName + '"]'), opts.message_noBoxClicked);      //no fields with this name selected
            }
        }
    }

    /*validate files*/
    this.validateFileInputs = function () {
        fileInputs.each(function () {
            var value = $(this).val();
            if (value === undefined || value == "" || value == $(this).attr("placeholder") || $.inArray(value, messages_array) != -1) {
                self.setWrongField($(this), opts.message_emptyField);             				//empty textarea
            }
        });
    }

    /*set field as ERROR*/
    this.setWrongField = function (element, message) {
        valid = false;

        if (!opts.silent_mode) {

            element.addClass(opts.class_error);
            element.closest('.fake-input').addClass(opts.class_error);
            element.closest('.fake-select').addClass(opts.class_error);
            element.next('span').find('.ui-selectmenu').addClass(opts.class_error);
            $(element.attr('data-errortarget')).addClass(opts.class_error);

            /*if the error msg will be inside the field*/
            if (opts.error_as_value) {
                /*if is a textfield or a textarea*/
                if (element.attr('type') == "text" || element.is("textarea")) {
                    if (message !== undefined) {
                        element.val(message.replace("##number##", element.attr("data-minchars")));
                        element.focus(function () { $(this).val("") });
                    }
                }
                /*if is a password field*/
                if (element.attr('type') == "password") {
                    if (message !== undefined) {
                        element.attr('type', 'text');
                        element.val(message);
                        element.focus(function () {
                            $(this).attr('type', 'password').val("");
                        });
                    }
                }
                /*if is a file*/
                if (element.attr('type') == "file") {
                    $(element.attr('data-showiferror')).fadeIn();
                }

                /*set the label close to checkbox with error class*/
                if (opts.checkbox_label_error_class) {
                    if (element.attr('type') == "radio" || element.attr('type') == "checkbox") {
                        formwrapper.find('input[name=' + element.attr('name') + ']').each(function () {
                            $(this).parent().find('label[for=' + $(this).attr('id') + ']').addClass('error');
                        });
                    }
                }
            } else {	/*if the error msg will be outside the field*/
                if (element.attr('type') == "checkbox" || element.attr('type') == "radio") {	/*Set error outside for radios and checkboxes*/
                    var checkboxName = element.attr('name');
                    formwrapper.find('input[name="' + checkboxName + '"]').each(function () {
                        $(this).next(".validation-label").remove();
                    });
                    $(opts.error_html.replace('##MESSAGE##', message.replace("##numberMin##", element.attr("data-minchars")).replace("##numberMax##", element.attr("data-maxchars")))).insertAfter(element.last());
                    var validationLabel = element.next(".validation-label:first");
                    formwrapper.find('input[name="' + checkboxName + '"]').each(function () {
                        $(this).focus(function () { validationLabel.remove(); })
                    });
                } else {	                                                                    /*Set error outside for other form elements*/
                    $(opts.error_html.replace('##MESSAGE##', message.replace("##number##", element.attr("data-minchars")).replace("##numberMax##", element.attr("data-maxchars")))).insertAfter(element);
                    var validationLabel = element.next(".validation-label:first");
                    element.focus(function () { validationLabel.remove(); });
                    element.closest(".fake-select").click(function () { validationLabel.remove(); });
                }
            }

        }
    }

    /*reset field*/
    this.resetField = function (element) {
        valid = false;
        element.removeClass(opts.class_error);
        element.closest('.fake-input').removeClass(opts.class_error);
        $(element.attr('data-errortarget')).removeClass(opts.class_error);
        $(element.attr('data-showiferror')).fadeOut();
        if (element.attr('type') == "checkbox" || element.attr('type') == "radio") {
            var checkboxName = element.attr('name');
            formwrapper.find('input[name="' + checkboxName + '"]').removeClass(opts.class_error);
            formwrapper.find('input[name="' + checkboxName + '"]').closest('.fake-input').removeClass(opts.class_error);
            formwrapper.find('input[name=' + element.attr('name') + ']').each(function () {
                $(this).parent().find('label[for=' + $(this).attr('id') + ']').removeClass('error');
            });
        }
        if (element.attr('type') == "text" && element.hasClass("wrong-pass")) {
            element.val("");
            element.attr("type", "password");
            element.removeClass("error").removeClass("wrong-pass");
        }
        element.next('span').find('.ui-selectmenu').removeClass(opts.class_error);
        $('.form-notification').fadeOut();


    }

    /*create an array of all the diferent inputs names*/
    this.createInputNamesArray = function (inputs) {
        var namesArray = [];
        inputs.each(function () {
            var name = $(this).attr("name");
            if ($.inArray(name, namesArray) == -1) {
                namesArray.push(name);
            }
        });
        return namesArray;
    }

    /*convert string to date object*/
    this.convertStringToDate = function (value) {
        var dateSegments = value.split("-");                                                //converting dd-mm-yyyy to yyyy-mm-dd
        var dt = Date.parse(new Date(parseInt(dateSegments[2], 10), parseInt(dateSegments[1], 10) - 1, parseInt(dateSegments[0], 10)));
        return dt;                                                                          //return date object
    }

    /*regex email */
    this.validateEmail = function (email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    /*regex postcode (UK) */
    this.validatePostCode = function (postcode) {
        var re = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
        return re.test(postcode);
    }

    /*regex credit card */
    this.validateCreditCardNumber = function (ccNumber) {
        var re = /^\d{16}$/;
        return re.test(ccNumber);
    }

    /*regex credit card security code */
    this.validateCreditCardSC = function (ccNumber) {
        var re = /^\d{3}$/;
        return re.test(ccNumber);
    }

    /*regex telephone */
    this.validateTelephone = function (telephone) {
        var re = /^[0-9]+$/;
        return re.test(telephone);
    }

    /*regex number */
    this.validateNumber = function (number) {
        var re = /^[0-9]+$/;
        return re.test(number);
    }

    /*regex url */
    this.validateURL = function (url) {
        var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
        return re.test(url);
    }



    /*detect changes on the inputs to remove the error classes*/
    this.bindEvents = function () {
        textinputs.focus(function () { self.resetField($(this)); });
        checkboxinputs.change(function () { self.resetField($(this)); });
        radioinputs.change(function () { self.resetField($(this)); });
        $('.fake-input').click(function () { self.resetField($(this).find('input')); });
        $(".fake-select").click(function () { self.resetField($(this).find('select')); });
        selectdropdowns.change(function () { self.resetField($(this)); });
        passinputs.focus(function () { self.resetField($(this)); });

        passinputs.keydown(function () { $(this).addClass("wrong-pass"); self.resetField($(this)); });

        dateinputs.focus(function () { self.resetField($(this)); });
        textareas.focus(function () { self.resetField($(this)); });
        fileInputs.change(function () { self.resetField($(this)); });
    }

    this.submitHandler = function () {
    }
    this.errorHandler = function () {
        alert('error, please check the wrong fields');
    }

    this.resetAll = function () {
        formwrapper.find('.' + opts.class_error).removeClass(opts.class_error);
        if (formwrapper.find('.validation-label').length) {
            formwrapper.find('.validation-label').remove();
        }
    }

    //default options
    /**********************************************/
    this.defaults = {
        //classes
        class_error: "error",
        class_mandatory: "required",
        // error messages  
        message_emptyField: "This field is empty",
        message_wrongEmail: "Check your email address",
        message_wrongPostcode: "Check the postcode",
        message_wrongTelephone: "Check the telephone number",
        message_wrongDate: "Insert a date (dd-mm-yyyy)",
        message_wrongCreditcard: "Check the credit card number",
        message_wrongCCSCode: "Check the credit card security code",
        message_differentPass: "The passwords are different",
        message_differentEmails: "The emails are different",
        message_tooShortPass: "The password is too short",
        message_noOptionSelected: "You should select an option",
        message_noBoxClicked: "You should select an option",
        message_differentFields: "Fields are different",
        message_endDateBeforeStart: "The end date should be after the start date",
        message_notenoughtcharacters: "The field needs at least ##numberMin## characters",
        message_tooManyCharacters: "the maximum number of characters for this field is ##numberMax##",
        message_wrongNumber: "The value should be only numbers",
        message_wrongURL: "The value should be an URL",
        //functions
        function_allCorrects: self.submitHandler,
        function_wrongForm: self.errorHandler,
        //parameters
        silent_mode: false,
        min_passLenght: 3,
        checkbox_label_error_class: false,
        error_as_value: true,
        error_html: "<span class='validation-label'>##MESSAGE##</span>"
    };

    /*_setting variables*/
    /**********************************************/
    var opts = $.extend({}, this.defaults, options);

    var formwrapper = this;

    var valid = true;

    var textinputs = formwrapper.find('input[type="text"]').not(":disabled").not('.date');
    var textareas = formwrapper.find('textarea.' + opts.class_mandatory).not(":disabled");
    var passinputs = formwrapper.find('input[type="password"].' + opts.class_mandatory).not(":disabled");
    var passRepeat = formwrapper.find('input[type="password"].pass-repeat.' + opts.class_mandatory).not(":disabled");
    var emailInput = formwrapper.find('input[type="text"].email.' + opts.class_mandatory).not(":disabled");
    var emailRepeat = formwrapper.find('input[type="text"].email-repeat.' + opts.class_mandatory).not(":disabled");
    var selectdropdowns = formwrapper.find('select.' + opts.class_mandatory).not(":disabled");
    var radioinputs = formwrapper.find('input[type="radio"].' + opts.class_mandatory).not(":disabled");
    var checkboxinputs = formwrapper.find('input[type="checkbox"].' + opts.class_mandatory).not(":disabled");
    var dateinputs = formwrapper.find('input.date.' + opts.class_mandatory).not(":disabled");
    var fileInputs = formwrapper.find('input[type="file"].' + opts.class_mandatory).not(":disabled");


    /*this array is to check if the value of the fields is as one of this messages and then set the field as empty*/
    var messages_array = [];
    messages_array[1] = opts.message_emptyField;
    messages_array[2] = opts.message_wrongEmail;
    messages_array[3] = opts.message_wrongPostcode;
    messages_array[4] = opts.message_wrongTelephone;
    messages_array[5] = opts.message_wrongDate;
    messages_array[6] = opts.message_wrongCreditcard;
    messages_array[7] = opts.message_wrongCCSCode;
    messages_array[8] = opts.message_differentPass;
    messages_array[9] = opts.message_differentEmails;
    messages_array[10] = opts.message_tooShortPass;
    messages_array[11] = opts.message_noOptionSelected;
    messages_array[12] = opts.message_noBoxClicked;
    messages_array[13] = opts.message_differentFields;
    messages_array[14] = opts.message_endDateBeforeStart;
    messages_array[15] = opts.message_notenoughtcharacters;
    messages_array[16] = opts.message_wrongNumber;





    /*launching functions*/
    /**********************************************/
    this.each(function () {

        self.resetAll();

        self.validateTextFields();

        self.validateRadioInputs();

        self.validateCheckboxInputs();

        self.validateTextareas();

        self.validateFileInputs();

        self.validateSelects();

        self.compareDates();

        self.validatePasswordFields();

        self.bindEvents();

        if (valid) {
            opts.function_allCorrects();
            return true;
        } else {
            opts.function_wrongForm();
            return false;
        }

    });

    return valid;

};  
  
 