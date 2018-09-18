'use strict';

myApp.directive('netmap', ['uiGmapGoogleMapApi', 'uiGmapIsReady', function (uiGmapGoogleMapApi, uiGmapIsReady) {
    return {
        restrict: 'E',
        scope: {
            settings: '=',
            colorprimary: '=',
            colorsecondary: '='
        },
        templateUrl: 'components/mapComponent/mapComponent.html',
        controller: function ($scope, $attrs, $rootScope, $timeout) {
            var centered = false, resized = false;

            $scope.map = {
                center: {
                    latitude: 48.858093,
                    longitude: 2.294694
                },
                zoom: 8,
                control: {},
                bounds: [],
                events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {
                            $scope.mapInstance = map;
                        });
                    },
                    resize: function(){
                        resized = true;
                    },
                    idle: function(map) {
                        if (!centered && resized) {
                            var latlngbounds = new google.maps.LatLngBounds();

                            for (var i = 0; i < $scope.markerList.length; i++) {
                                var latLng = new google.maps.LatLng($scope.markerList[i].latitude, $scope.markerList[i].longitude);
                                latlngbounds.extend(latLng);
                            }

                            var center = latlngbounds.getCenter();

                            $scope.map.center.latitude = center.lat();
                            $scope.map.center.longitude = center.lng();

                            map.fitBounds(latlngbounds);

                            centered = true;
                        }

                        //Window must resize in edit mode
                        if (!$rootScope.editMode) {
                            $(window).resize(function (e) {
                                if (!isMobile.iOS() || isMobile.iOS() && !resized) {
                                    $("#map-panel").css("top", e.target.scrollY);
                                    $("#map-panel").css("height", $(window).height());
                                    $("#map-panel").css("width", $(window).width());

                                    $(".angular-google-map-container").css("height", $(window).height() - 95);
                                    google.maps.event.trigger($scope.mapInstance, 'resize');

                                    resized = true;
                                }
                            });
                        }
                    }
                }
            };

            var resized = false;

            $scope.setMapMode = function () {
                $scope.isMapMode = true;
                $scope.isListMode = false;

                $timeout(function () {
                    google.maps.event.trigger($scope.mapInstance, 'resize');
                }, 200);

                $scope.mapbg = $scope.colorprimary;
                $scope.mapcolor = $scope.colorsecondary;
                $scope.listbg = $scope.colorsecondary;
                $scope.listcolor = $scope.colorprimary;
            }

            $scope.setListMode = function () {
                $scope.isMapMode = false;
                $scope.isListMode = true;
                $scope.mapbg = $scope.colorsecondary;
                $scope.mapcolor = $scope.colorprimary;
                $scope.listbg = $scope.colorprimary;
                $scope.listcolor = $scope.colorsecondary;
            }

            $scope.$watch("colorprimary", function () {
                if ($scope.isMapMode) {
                    $scope.mapbg = $scope.colorprimary;
                    $scope.listcolor = $scope.colorprimary;
                } else {
                    $scope.mapcolor = $scope.colorprimary;
                    $scope.listbg = $scope.colorprimary;
                }
            });

            $scope.$watch("colorsecondary", function () {
                if ($scope.isMapMode) {
                    $scope.mapcolor = $scope.colorsecondary;
                    $scope.listbg = $scope.colorsecondary;
                } else {
                    $scope.mapbg = $scope.colorsecondary;
                    $scope.listcolor = $scope.colorsecondary;
                }
            });

            if (!$rootScope.data) {
                $scope.$on("serviceReady",function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            $scope.$watch("settings", function (newValue) {
                init();
            });

            $scope.$watch(
                function () {
                    return $scope.mapInstance != undefined
                },
                function (mapLoaded) {
                    if (mapLoaded) {
                        $timeout(function () {
                            google.maps.event.trigger($scope.mapInstance, 'resize');
                        }, 1000);
                    }
                }
            );

            var isMobile = {
                Android: function () {
                    return /Android/i.test(navigator.userAgent);
                },
                BlackBerry: function () {
                    return /BlackBerry/i.test(navigator.userAgent);
                },
                iOS: function () {
                    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
                },
                Windows: function () {
                    return /IEMobile/i.test(navigator.userAgent);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
                }
            };

            $scope.openMapsRoute = function (lat, lng) {
                if (isMobile.iOS()) {
                    window.open("http://maps.apple.com/maps?saddr=" + $scope.currentLat + "," + $scope.currentLng + "&daddr=" + lat + "," + lng);
                } else {
                    window.open("http://maps.google.com/maps?saddr=" + $scope.currentLat + "," + $scope.currentLng + "&daddr=" + lat + "," + lng);
                }
            }

            function init () {
                $scope.setListMode();
                $scope.markerList = new Array();
                $scope.storeList = new Array();

                if ($scope.settings) {
                    getBaseStoreList();

                    for (var i=0; i < $scope.settings.length; i++) {
                        var newMarker = new Marker(i, $scope.settings[i].lat, $scope.settings[i].lng);
                        $scope.markerList.push(newMarker);
                    }

                    getLocation();
                }
            }

            function getLocation () {
                if ($scope.storeList.length > 1) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(getStoreListDistance, getBaseStoreList);
                    } else {
                        getBaseStoreList();
                    }
                }
            }

            function getBaseStoreList () {
                $scope.storeList = new Array();

                for (var i=0; i < $scope.settings.length; i++) {
                    var store = $scope.settings[i];
                    store.distance = -1;
                    $scope.storeList.push(store);
                }
            }

            function getStoreListDistance (position) {
                $rootScope.$apply(function () {
                    $rootScope.currentLat = position.coords.latitude;
                    $rootScope.currentLng =  position.coords.longitude;
                });

                $scope.currentLat = position.coords.latitude;
                $scope.currentLng =  position.coords.longitude;

                $scope.storeList = new Array();

                for (var i=0; i < $scope.settings.length; i++) {
                    var store = $scope.settings[i];
                    store.distance = getDistance(store.lat, store.lng, position.coords.latitude, position.coords.longitude);

                    if (store.distance < 1) {
                        store.distance *= 100;
                        store.distance = parseInt(store.distance);
                        store.distanceText = store.distance + "m";
                    } else {
                        store.distance = parseInt(store.distance);
                        store.distanceText = store.distance + "km";
                    }

                    $scope.storeList.push(store);
                }
            }

            $rootScope.$watch("mapMode", function (newValue) {
                $scope.map.refresh = newValue;
            });

            function getScreenHeight () {
                if ($rootScope.editMode) {
                    return $("nettemplate").parent().parent().height();
                }

                return  window.innerHeight ? window.innerHeight : $(window).height();
            }

            function getScrollTop () {
                if ($rootScope.editMode) {
                    return $("nettemplate").parent().parent().scrollTop();
                }

                return 0;
            }

            $scope.closeStoresMap = function () {
                var toBottom = getScreenHeight();
                var scrollTop = getScrollTop();

                centered = false;
                resized = false;
                $scope.mapInstance = undefined;

                $("#map-panel").animate({
                    top:  toBottom + scrollTop
                }, 1000, function () {
                    $("#map-panel").hide();
                    $(".template").removeAttr("style");

                    $scope.$apply(function () {
                        $rootScope.mapMode = false;
                    });
                });
            }

            function getDistance(lat1, lon1, lat2, lon2) {
                var R = 6371; // EARTH Radius
                var φ1 = rad(lat1);
                var φ2 = rad(lat2);
                var Δφ = rad(lat2-lat1) ;
                var Δλ = rad(lon2-lon1) ;

                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

                var d = R * c;

                return d;
            }

            function rad (value) {
                /** Converts numeric degrees to radians */
                return value * Math.PI / 180;
            }

            /*
                MARKER CONSTRUCTOR
             */
            function Marker (id, lat, lng) {
                this.id = id;
                this.latitude = lat;
                this.longitude = lng;

                this.onMarkerClicked = function (marker) {
                    $scope.$apply(function () {
                        $scope.selectedMapStore = $scope.settings[indexOfArrayByAttr($scope.settings, "originalPos", marker.key)];
                        $scope.storeSelected = true;
                    })
                }
            }

            var map;
            /*
                GOOGLE MAP IS READY
             */
            uiGmapGoogleMapApi.then(function(maps) {});
        }
    }
}]);
