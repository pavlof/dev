/*GROUPTREE IMAGE LIGHTBOX 1.00 - 07.01.2015*/

$.fn.gtlightbox = function (options) { };

(function ($) {
    $.gtlightbox = function (object, options) { };

    $.fn.gtlightbox = function (options) {

        var self = this;

        //Iterate over each object  
        this.each(function () {

            var image = $(this);

            /*getting parameters*/
            var src = $(this).attr("data-src") !== undefined ? $(this).attr("data-src") : $(this).attr("src");
            var iconClass = $(this).attr("data-icon") !== undefined ? $(this).attr("data-icon") : "fa-search-plus";
            var iconPosition = $(this).attr("data-iconposition") !== undefined ? $(this).attr("data-iconposition") : "top-left";
            var altAttr = $(this).attr("alt");
            var caption = $(this).attr("data-caption") !== undefined ? $(this).attr("data-caption") : altAttr;

            /*wrap the image*/
            image.wrap("<div class='js-lightbox-image-wrapper lightbox-trigger-image-wrapper'></div>");
            var wrapper = image.closest(".js-lightbox-image-wrapper");

            /*add the icon*/
            wrapper.append("<span class='js-lightbox-image-icon fa " + iconClass + " "  + iconPosition  + " lightbox-trigger-icon'></span>");

            /*bind the event*/
            wrapper.click( function () {
                var imgString = "<img class='js-image' alt='" + altAttr + "' src='" + src + "' />";
                /*generate wrapper and trigger*/
                $("body").append("<div class='overlay-bg js-lightbox-image-overlay-bg'></div>");
                $("body").append("<div class='overlay lightbox-image-overlay js-lightbox-image-overlay' ><div class='inner p0 m0'>" + imgString + "</div><a href='javascript:void(0);' class='close-overlay js-close-overlay-trigger'><i class='fa fa-times'></i></a></div>");
                var overlay = $(".js-lightbox-image-overlay");
                var overlayClosers = $(".js-lightbox-image-overlay-bg, .js-close-overlay-trigger");
                /*events*/
                overlayClosers.click( function () {
                    overlay.fadeOut( function ()  {
                        overlayClosers.remove();
                        overlay.remove();
                    });
                    overlayClosers.fadeOut();
                });
                overlay.find(".js-image").load( function () {
                    overlay.hide();
                    resizeLightbox();
                    overlay.fadeIn();
                });
                $(window).resize( function () {
                    overlay.hide();
                    resizeLightbox();
                    overlay.show();
                });
                /*internal funcitons*/
                function resizeLightbox() {
                    overlay.addClass("checksize");
                    overlay.show();
                    var image = overlay.find(".js-image");
                    overlay.width("auto");
                    overlay.height("auto");
                    overlay.find("inner").width("auto");
                    overlay.find("inner").height("auto");
                    var windowWidth = $(window).width() -40;
                    var imageWidth = image.width();
                    var windowHeight = $(window).height() -40;
                    var imageHeight = image.height();
                    windowHigher = (windowHeight) >= (imageHeight);
                    windowWider = (windowWidth) >= (imageWidth);
                    overlay.find("inner").attr("css","");
                    /*set sizes*/
                    if(windowHigher && windowWider)
                    {
                        overlay.width(imageWidth);
                        overlay.height(image.height());
                        overlay.removeClass("checksize");
                    }
                    if(windowHigher && !windowWider)
                    {
                        overlay.width(windowWidth -40);
                        overlay.height(image.height());
                        overlay.removeClass("checksize");
                    }
                    
                    if(!windowHigher && windowWider)
                    {
                        overlay.height(windowHeight -40);
                        overlay.width(image.width());
                        overlay.removeClass("checksize");
                    }
                    overlay.removeClass("checksize");
                    overlay.height(overlay.height());
                    overlay.width(overlay.width());
                    /*center lightbox*/
                    var overlayWidth = overlay.width();
                    overlay.css("margin-left", ((overlayWidth/2)*-1)  -20 );
                    var overlayHeight = overlay.height();
                    overlay.css("margin-top", ((overlayHeight/2)*-1)  -20 + $(window).scrollTop() );
                    overlay.hide();
                }

            });

        });

    };
})(jQuery);  