/*GROUPTREE GOOGLE MAPS PLUGIN 1.0 (16.05.2013) */

gtMaps = function (options) {

    /*default options*/
    /**********************************************/
    var debug = true;
    var self = this;
    this.defaults = {
        mapOptions: {
            zoom: 13,
            center: {
                lat: 51.539022,
                long: -0.145224
            },
            mapId: "map-canvas",
            mapType: 0, //0 = road, 1 = satellite, 2 = hybrid, 3 = terrain...
            trafficButton: true,
            panControl: true,
            zoomControl: true,
            scaleControl: true,
            streetViewControl: true,
            overviewMapControl: true,
            mapTypeControl: true
        },
        infobox: {
            boxStyles: {
                background: "#fff",
                width: "160px",
                height: "190px",
                padding: '10px 15px 20px 40px'
            },
            infoBoxOffset: {
                left: 20,
                top: -200
            },
            planRouteHTML: "<a href='#' class='planRoute'>Plan route</a>" //you should keep the planRoute class in the clicable element.
        },
        markers: {
            xmlSource: null,
            markerSelector: ".map-marker",
            markerIco: null,
            markerActiveIco: null,
            activeMarkerZoom: 0,
            fitMarkers: true,
            enableStreetView: true,
            streetViewHTML: "<a href='#' class='streeview'>Street view</a>" //you should keep the streeview class in the clicable element.
        },
        addressFinder: {
            searchInputSelector: "#address",
            searchTriggerSelector: "#search",
            addressMarkerIco: "",
            enableDirections: false,
            directionsPanelSelector: "#directions-panel"
        }
    };

    /*extends the default values with the selected options*/
    var opts = $.extend({}, this.defaults, options);
    if (options !== undefined) {
        opts.mapOptions = $.extend({}, this.defaults.mapOptions, options.mapOptions);
        opts.infobox = $.extend({}, this.defaults.infobox, options.infobox);
        if (options.infobox !== undefined) {
            opts.infobox.boxStyles = $.extend({}, this.defaults.infobox.boxStyles, options.infobox.boxStyles);
            opts.infobox.infoBoxOffset = $.extend({}, this.defaults.infobox.infoBoxOffset, options.infobox.infoBoxOffset);
        }
        opts.markers = $.extend({}, this.defaults.markers, options.markers);
        opts.addressFinder = $.extend({}, this.defaults.addressFinder, options.addressFinder);
    }

    /*variables*/
    /**********************************************/
    this.infoBoxOptions = {
        content: "",
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(25, -175),
        zIndex: null,
        boxStyle: opts.boxStyles,
        closeBoxMargin: "0",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false
    };
    var selectedMaptype = google.maps.MapTypeId.ROADMAP;
    switch (opts.mapOptions.mapType) {
        case 0: selectedMaptype = google.maps.MapTypeId.ROADMAP;
            break;
        case 1: selectedMaptype = google.maps.MapTypeId.SATELLITE;
            break;
        case 2: selectedMaptype = google.maps.MapTypeId.HYBRID;
            break;
        case 3: selectedMaptype = google.maps.MapTypeId.TERRAIN;
            break;
        default: selectedMaptype = google.maps.MapTypeId.ROADMAP;
    };
    this.mapOptions = {
        zoom: opts.mapOptions.zoom,
        center: new google.maps.LatLng(opts.mapOptions.center.lat, opts.mapOptions.center.long),
        mapTypeId: selectedMaptype,
        panControl: opts.mapOptions.panControl,
        zoomControl: opts.mapOptions.zoomControl,
        scaleControl: opts.mapOptions.scaleControl,
        streetViewControl: opts.mapOptions.streetViewControl,
        overviewMapControl: opts.mapOptions.overviewMapControl,
        mapTypeControl: opts.mapOptions.mapTypeControl
    };
    this.mapWrapper_ID = opts.mapOptions.mapID;
    this.markersArray = [];
    this.geocoder = new google.maps.Geocoder();
    this.selectedRouteMarker = null;

    /*functions*/
    /**********************************************/
    this.markerCounter = 0;

    /*gets the data from each DOM element with the selected class*/
    this.addMarkersToMap = function (sourceItems) {
        self.markerCounter = 0;
        sourceItems.each(function () {
            var markerSource = $(this);
            self.parseMarkerSourceItem(markerSource);
        });
        if (self.markersArray.length >= 1 && opts.markers.fitMarkers)
            self.fitMarkers();
    }

    this.parseMarkerSourceItem = function (markerSource) {
        var title = markerSource.attr('data-title');
        var markerPosition = null;
        if (self.checkProperty(markerSource.attr('data-lat')) && self.checkProperty(markerSource.attr('data-lat'))) {
            var lat = parseFloat(markerSource.attr('data-lat'));
            var long = parseFloat(markerSource.attr('data-long'));
            markerPosition = new google.maps.LatLng(lat, long);
            var markerOptions = {
                position: markerPosition,
                map: self.map,
                title: title
            }
            self.markersArray[self.markerCounter] = self.setMarker(markerOptions, markerSource);
            self.markerCounter++;
        } else {
            if (self.checkProperty(markerSource.attr('data-address'))) {
                self.geocoder.geocode({ 'address': markerSource.attr('data-address') }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var markerOptions = {
                            position: results[0].geometry.location,
                            map: self.map,
                            title: title
                        }
                        self.markersArray[self.markerCounter] = self.setMarker(markerOptions, markerSource);
                        self.markerCounter++;
                        self.fitMarkers();
                    }
                });
            }
        }
    }

    this.setMarker = function (markerOptions, markerSource) {
        var marker = new google.maps.Marker(markerOptions);
        marker.sourceElement = markerSource;
        marker.innerHTML = markerSource.attr('data-infobox');
        if (self.checkProperty(opts.markers.markerIco))
            marker.setIcon(opts.markers.markerIco);
        var customMarkerIco = markerSource.attr('data-icon');
        if (self.checkProperty(customMarkerIco))
            marker.setIcon(customMarkerIco);
        if (marker.innerHTML !== undefined)
            self.generateInfobox(marker, marker.innerHTML);
        self.bindMarkerSetActive(marker);
        return marker;
    }

    /*fit the markers to the map*/
    this.fitMarkers = function () {
        self.markerBound = new google.maps.LatLngBounds();
        for (var i in self.markersArray) {
            if (self.markersArray[i] !== undefined)
                self.markerBound.extend(self.markersArray[i].getPosition());
        }
        self.map.fitBounds(self.markerBound);
    }

    /*generates an infobox for each marker*/
    this.generateInfobox = function (marker, innerHTML) {
        var boxText = document.createElement("div");
        var lat = parseFloat(marker.sourceElement.attr('data-lat'));
        var long = parseFloat(marker.sourceElement.attr('data-long'));
        boxText.innerHTML = innerHTML;
        if (opts.addressFinder.enableDirections)
            boxText.innerHTML = boxText.innerHTML + opts.infobox.planRouteHTML;
        if (opts.markers.enableStreetView)
            boxText.innerHTML = boxText.innerHTML + opts.markers.streetViewHTML;
        var markerInfoboxOptions = self.infoBoxOptions;
        markerInfoboxOptions = {
            content: boxText.innerHTML,
            boxStyle: opts.infobox.boxStyles,
            pixelOffset: new google.maps.Size(opts.infobox.infoBoxOffset.left, opts.infobox.infoBoxOffset.top)
        }
        marker.infobox = new InfoBox(markerInfoboxOptions);
    }

    /*checks if the marker source contains icon information*/
    this.markerHasCustomIco = function (marker) {
        if (self.checkProperty(marker.sourceElement.attr('data-icon')) || self.checkProperty(marker.sourceElement.attr('data-active-icon')))
            return true;
        else
            return false;
    }

    /*changes the icon of the marker and displays the infobox*/
    this.activateMarker = function (marker) {
        self.deactivateActiveMarker();
        self.showInfobox(marker);
        var hasCustomMarker = self.markerHasCustomIco(marker);
        if (!hasCustomMarker) {
            if (self.checkProperty(opts.markers.markerActiveIco))
                marker.setIcon(opts.markers.markerActiveIco);
        } else {
            var customMarkerIco = marker.sourceElement.attr('data-active-icon');
            if (self.checkProperty(customMarkerIco))
                marker.setIcon(customMarkerIco);
        }
        self.map.panTo(marker.getPosition());
        var zoom = null;
        if (opts.markers.activeMarkerZoom != 0)
            zoom = opts.markers.activeMarkerZoom;
        else if (self.checkProperty(marker.sourceElement.attr('data-zoom')))
            zoom = parseFloat(marker.sourceElement.attr('data-zoom'));
        if (zoom != null)
            self.changeZoom(zoom);
        self.selectedRouteMarker = null;
    }

    /*changes the icon of the active marker to default*/
    this.deactivateActiveMarker = function () {
        for (var i = 0; i < self.markersArray.length; i++) {
            var hasCustomMarker = self.markerHasCustomIco(self.markersArray[i]);
            if (!hasCustomMarker)
                self.markersArray[i].setIcon(opts.markers.markerIco);
            else if (self.checkProperty(self.markersArray[i].sourceElement.attr('data-icon')))
                self.markersArray[i].setIcon(self.markersArray[i].sourceElement.attr('data-icon'));
        }
        self.hideInfoboxes();
    }

    /*show the infobox once the marker has been set as active*/
    this.showInfobox = function (marker) {
        if (marker.infobox !== undefined) {
            marker.infobox.open(self.map, marker);
            google.maps.event.addListener(marker.infobox, 'domready', function () {
                $('.planRoute').click(function (e) {
                    e.preventDefault();
                    self.selectedRouteMarker = marker;
                    if ($(opts.addressFinder.searchInputSelector).val() == "")
                        $(opts.addressFinder.searchInputSelector).focus();
                    else
                        self.renderDirections();
                });
                $('.streeview').click(function (e) {
                    e.preventDefault();
                    self.selectedStViewMarker = marker;
                    self.showStreetView();
                });
            });
        }
    }

    /*start a search*/
    this.searchAddress = function () {
        self.deactivateActiveMarker();
        self.removeDirections();
        var address = $(opts.addressFinder.searchInputSelector).val();
        self.geocoder.geocode({ 'address': address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.removeAddressMarker();
                self.map.setCenter(results[0].geometry.location);
                self.addressMarker = new google.maps.Marker({
                    map: self.map,
                    position: results[0].geometry.location,
                    icon: opts.addressFinder.addressMarkerIco
                });
            } else {
                alert("Search address was not successful for the following reason: " + status);
            }
        });
    }

    /*display the dicretions in the map and direction details panel*/
    this.renderDirections = function () {
        self.removeDirections();
        self.hideInfoboxes();
        self.removeAddressMarker();
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay = new google.maps.DirectionsRenderer();
        self.directionsDisplay.setMap(self.map);
        self.directionsDisplay.setPanel(document.getElementById('directions-panel'));
        var start = $(opts.addressFinder.searchInputSelector).val();
        var selectedMode = "DRIVING";
        if (document.getElementById("travelmode") !== undefined)
            var selectedMode = document.getElementById("travelmode").value;
        var request = {
            origin: start,
            destination: self.selectedRouteMarker.position,
            travelMode: google.maps.TravelMode[selectedMode]
        };
        self.directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK)
                self.directionsDisplay.setDirections(result);
            else
                alert("Render route was not successful for the following reason: " + status);
        });
    }

    /*bind the events to start a search*/
    this.bindSearchEvent = function () {
        $(opts.addressFinder.searchTriggerSelector).click(function () {
            if (self.selectedRouteMarker == null)
                self.searchAddress();
            else
                self.renderDirections();
        });
    }

    /*binds the click event in each marker*/
    this.bindMarkerSetActive = function (marker) {
        google.maps.event.addListener(marker, "click", function () {
            self.activateMarker(this);
        });
        $(marker.sourceElement).click(function (e) {
            e.preventDefault();
            self.activateMarker(marker);
        });
    }

    /*hides all the opened infoboxes*/
    this.hideInfoboxes = function () {
        for (var i = 0; i < self.markersArray.length; i++) {
            if (self.markersArray[i].infobox !== undefined)
                self.markersArray[i].infobox.close();
        }
    }

    /*remove the route from the map and detail panel*/
    this.removeDirections = function () {
        if (self.directionsDisplay != null && self.directionsDisplay !== undefined) {
            $(opts.addressFinder.directionsPanelSelector).html("");
            self.directionsDisplay.setMap(null);
            self.directionsDisplay = null;
        }
    }

    /*removes the marker of a succesful address*/
    this.removeAddressMarker = function () {
        if (self.addressMarker !== undefined)
            self.addressMarker.setMap(null);
    }

    /*changes the map zoom*/
    this.changeZoom = function (zoom) {
        self.map.setZoom(zoom);
    }

    /*checks if a property exists and contains something*/
    this.checkProperty = function (property) {
        return (property !== undefined && property != "" && property != null);
    }

    /*enables the traffic layer and show the trigger button*/
    this.addTrafficLayer = function () {
        var controlDiv = document.createElement('div');
        $(controlDiv).addClass('gmnoprint');
        var controlUI = document.createElement('div');
        $(controlUI).attr("style", "background:#fff;border:1px solid #717B87;margin:5px 0 0 0;padding:1px 6px;cursor:pointer;text-align:center;box-shadow:0 2px 4px rgba(0, 0, 0, 0.4);");
        controlDiv.appendChild(controlUI);
        var controlText = document.createElement('div');
        $(controlText).attr("style", "font-family:Arial,sans-serif; font-size: 13px;").attr("title", "Click to see the traffic").html('Traffic');
        controlUI.appendChild(controlText);
        self.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
        self.trafficLayer = new google.maps.TrafficLayer();
        google.maps.event.addDomListener(controlUI, 'click', function () {
            if (typeof self.trafficLayer.getMap() == 'undefined' || self.trafficLayer.getMap() === null) {
                controlText.style.fontWeight = "bold";
                self.trafficLayer.setMap(self.map);
            } else {
                self.trafficLayer.setMap(null);
                controlText.style.fontWeight = "normal";
            }
        });
    }

    /*enables the street view and add the button into the infobox*/
    this.showStreetView = function () {
        self.panorama = self.map.getStreetView();
        self.panorama.setPosition(self.selectedStViewMarker.position);
        var headingAngle = 0;
        if (self.checkProperty(self.selectedStViewMarker.sourceElement.attr("data-heading")))
            headingAngle = parseFloat(self.selectedStViewMarker.sourceElement.attr("data-heading"));
        self.panorama.setPov({
            heading: 0,
            pitch: 0,
            heading: headingAngle
        });
        self.panorama.setVisible(true);
        self.map.setStreetView(self.panorama);
    }

    /*gets the source from the XML passed*/
    this.getXMLData = function () {
        $.ajax({
            type: "GET",
            url: opts.markers.xmlSource,
            dataType: "xml",
            success: function (data) {
                self.addMarkersToMap($(data).find("marker"));
            }
        });
    }

    /*initializes the main methods*/
    this.initialise = function () {
        $(opts.addressFinder.directionsPanelSelector).html("");
        self.map = new google.maps.Map(document.getElementById(opts.mapOptions.mapId), self.mapOptions);
        if (opts.mapOptions.trafficButton)
            self.addTrafficLayer();
        if (opts.markers.xmlSource != null)
            self.getXMLData();
        else
            self.addMarkersToMap($(opts.markers.markerSelector));
        self.bindSearchEvent();
    }

    /*START APP*/
    this.initialise();

};