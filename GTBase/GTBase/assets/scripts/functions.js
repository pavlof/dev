/*GT CAROUSEL*/
/******************************/
function gtCarousel() {
    $('.js-slider').each(function () {
        var thisSlider = $(this);
        var sliderContainer = thisSlider.closest(".slider-container");
        var lastArgs = null;
        thisSlider.iosSlider({
            desktopClickDrag: false,
            snapToChildren: true,
            navNextSelector: sliderContainer.find('.js-slide-button-prev'),
            navPrevSelector: sliderContainer.find('.js-slide-button-next'),
            navSlideSelector: sliderContainer.find('.js-slider-selector'),
            onSlideChange: slideChange,
            //onSliderLoaded: setSliderHeight,
            infiniteSlider: true,
            startAtSlide: '1'
        });
        $(window).resize(function () {
            setSliderHeight(lastArgs);
        });
        sliderContainer.find('.item:eq(0) img').bind('load', function () {
            sliderContainer.addClass("loaded");
            setSliderHeight(lastArgs);
        });
        function slideChange(args) {
            sliderContainer.find('.js-slider-selector').removeClass('active');
            sliderContainer.find('.js-slider-selector:eq(' + (args.currentSlideNumber - 1) + ')').addClass('active');
            setSliderHeight(args);
        }
        function setSliderHeight(args) {
            lastArgs = args;
            var slide = thisSlider.find('.item:eq(0)');
            if (args != null) {
                slide = thisSlider.find('.item:eq(' + (args.currentSlideNumber - 1) + ')');
            }
            var mobileCaptionHeight = slide.outerHeight();
            sliderContainer.find(".js-slider").css("height", mobileCaptionHeight);
        }
    });
}
/*GT ACCORDIONS*/
/******************************/
function gtAccordions() {
    $('.js-accordion-heading').click(function (e) {
        var accHeading = $(this);
        var thisAcc = accHeading.closest(".js-accordion");
        if (!accHeading.hasClass('active')) {
            accHeading.addClass('active');
            thisAcc.find('.js-accordion-content').slideDown();
        } else {
            accHeading.removeClass('active');
            thisAcc.find('.js-accordion-content').slideUp();
        }
    });
}

/*GT OVERLAY*/
/******************************/
function closeOverlay() {
    $(".js-overlay").fadeOut();
    $(".js-overlay-bg, .js-overlay-ajax-bg").fadeOut();
}
function openOverlay(trigger) {
    var overlayselector = trigger.attr("data-overlay-selector");
    $(overlayselector).fadeIn();
    $(".js-overlay-bg").fadeIn();
}
//NON AJAX
function bindOverlayEvents() {
    $("body").on("click", ".js-open-overlay-trigger", function () {
        var trigger = $(this);
        openOverlay(trigger);
    });
    $("body").on("click", ".js-close-overlay-trigger", function () {
        var trigger = $(this);
        closeOverlay(trigger);
    });
}
//Ajax
function overlayAjaxTrigger() {
    $(".js-open-overlay-ajax-trigger").click(function () {
        var ajaxPath = $(this).attr("data-ajax");
        $("body").css("cursor", "progress");
        $.ajax({
            type: "GET",
            url: ajaxPath,
            success: function (response) {
                $("body").append(response);
                $("body").css("cursor", "default");
            }
        });
    });
    $("body").on("click", ".js-close-overlay-trigger", function () { closeOverlay(); });
}


/*GT FORMS*/
/******************************/
function styleForm() {
    $("body").customize();
}

function validateForm() {
 $('.js-form-submit').click(function () {
        $(".js-form-wrapper").validate();
    });
}
/*GT TABS*/
/******************************/
function bindTabs() {
    $(".tabs-menu a").click(function (event) {
        event.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none").removeClass("active");
        $(tab).fadeIn().addClass("active");
    });
}

/*GT NAVS*/
/******************************/
function bindNav() {
    $(".js-mobile-nav-trigger").click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var dropdown = $(".js-drop-down-menu");
        if (!dropdown.hasClass("active")) {
            dropdown.addClass("active").slideDown();
            $("body").click(function () {
                dropdown.removeClass("active").fadeOut();
            });
        } else {
            dropdown.removeClass("active").slideUp();
        }
    });
    $(".js-menu-indicator").click(function (e) {
        var trigger = $(this);
        e.stopPropagation();
        e.preventDefault();
        var dropdown = trigger.closest(".menu-item").children(".drop-down");
        if (!dropdown.hasClass("active")) {
            dropdown.addClass("active").slideDown();
        } else {
            dropdown.removeClass("active").slideUp();
        }
    });
    $(window).resize(function () {
        var dropdowns = $(".drop-down-wrapper").find(".drop-down");
        dropdowns.removeAttr("style");
    });
}

/*GT SHARE*/
/******************************/
function bindSharepopup() {
    $(".js-share-trigger").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).next(".share-popup").fadeIn();
    });
    $("body").click(function (e) {
        $(".share-popup").fadeOut();
    });
}
