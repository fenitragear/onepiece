'use strict';

myApp.directive('netstores', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '=',
            titles: '=',
            colorprimary: '=',
            colorsecondary: '='
        },
        templateUrl: 'components/storesComponent/storesComponent.html',
        controller: function ($scope, $attrs, $rootScope) {
            $scope.geolocalized = false;
            $scope.geolocalizationMessage = "Cette page nécessite votre autorisation pour s'afficher correctement.<br />Veuillez autoriser la géolocalisation depuis les réglages de votre téléphone.";
            $scope.routeBtnEnabled = true;
            $scope.routed = false;
            $scope.editMode = $rootScope.editMode;
            $scope.storesDisplayed = ($rootScope.data !== undefined && $rootScope.data.components !== undefined && $rootScope.data.components.storesDisplayed !== undefined) ? $rootScope.data.components.storesDisplayed : true;
            $scope.storesCallDisplayed = ($rootScope.data !== undefined && $rootScope.data.components !== undefined && $rootScope.data.components.storetitles !== undefined && $rootScope.data.components.storetitles.call.displayed !== undefined) ? $rootScope.data.components.storetitles.call.displayed : true;
            $scope.storesItiDisplayed = ($rootScope.data !== undefined && $rootScope.data.components !== undefined && $rootScope.data.components.storetitles !== undefined && $rootScope.data.components.storetitles.itinerary.displayed !== undefined) ? $rootScope.data.components.storetitles.itinerary.displayed : true;
            $scope.allStoresDisplayed = ($rootScope.data !== undefined && $rootScope.data.components !== undefined && $rootScope.data.components.storetitles !== undefined && $rootScope.data.components.storetitles.allStores.displayed !== undefined) ? $rootScope.data.components.storetitles.allStores.displayed : true;
            $scope.geolocCurrentType = ($rootScope.data !== undefined && $rootScope.data.components !== undefined && $rootScope.data.components.storetitles !== undefined && $rootScope.data.components.storetitles.geolocType !== undefined) ? $rootScope.data.components.storetitles.geolocType : 'geo';
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            $scope.$watch("settings", function () {
               init();
            });

            $rootScope.$watch("currentLat", function (newValue, oldValue) {
                if (newValue != undefined) {
                    getLocation();
                }
            });

			$rootScope.$watchCollection(
				function () {
					if ($rootScope.data) {
						return $rootScope.data.components.storetitles;
					}

					return 0;
				},
				function (newValue) {
					$scope.titles = newValue;
				}
			);
			
			$rootScope.$watch('data.components.storesDisplayed', function (newValue) {
				$scope.storesDisplayed = newValue;
			});
            $rootScope.$watch('data.components.storetitles.call.displayed', function (newValue) {
                $scope.storesCallDisplayed = newValue;
            });
            $rootScope.$watch('data.components.storetitles.geolocType', function (newValue) {
                $scope.geolocCurrentType = newValue;
            });

            $rootScope.$watch('data.components.storetitles.itinerary.displayed', function (newValue) {
                $scope.storesItiDisplayed = newValue;
            });
            $rootScope.$watch('data.components.storetitles.allStores.displayed', function (newValue) {
                $scope.allStoresDisplayed = newValue;
            });

            function init () {
                $scope.geolocalized = false;
                $scope.storeList = $scope.settings;
                $scope.hasStores = ($scope.storeList != undefined && $scope.storeList.length > 0);
                $scope.storeSize = $scope.storeList != undefined ? $scope.storeList.length : 0;

                if ($scope.storeList && $rootScope.data.components.storesDisplayed === true) {
                    $scope.closestStore = $scope.storeList[1];
                    
                    if ($scope.storeSize == 1) {
                        $scope.geolocalized = true;
                        return;
                    }

                    if ($rootScope.currentLat != undefined) {
                        getLocation();
                    } else {
                        $scope.storeList.sort(function (a, b){
                            return a.originalPos - b.originalPos;
                        });

                        $scope.closestStore = $scope.storeList[1];
                    }
                }

				/*
                $rootScope.$watchCollection(
                    function () {
                        if ($rootScope.data) {
                            return $rootScope.data.components.storesDisplayed;
                        }

                        return true;
                    },
                    function (newValue) {
                        $scope.storesDisplayed = newValue;
						console.log('watchCollection', $scope.storesDisplayed);
                    }
                );
				*/
            }

            /*
                GET LOCATION
             */
            function getLocation () {
                $scope.routed = true;
                $scope.geolocalized = true;
                $scope.currentLat = $rootScope.currentLat;
                $scope.currentLng = $rootScope.currentLng;
                if($scope.geolocCurrentType=='geo'){
                    find_closest_marker($scope.currentLat, $scope.currentLng);
                }
            }

            /*
                TEST IF MOBILE, to launch google map apps or equivalent
             */
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

            $scope.openMapsRoute = function (dlat,dlong) {
                console.log("okokokok");
                if ($scope.routed == false) {
                    $scope.routeBtnEnabled = false;
                    getRouteLocation();
                } else {
                    openRoute(dlat,dlong);
                }
            }

            function openRoute (dlat,dlong) {
                var params;

                if ($scope.currentLat) {
                    params = "saddr=" + $scope.currentLat + "," + $scope.currentLng + "&daddr=" + dlat + "," + dlong ;
                } else {
                    params = "daddr=" + dlat + "," + dlong;
                }

                if (isMobile.iOS()) {
                    window.open("http://maps.apple.com/maps?"+ params);
                } else {
                    window.open("http://maps.google.com/maps?"+ params);
                }
            }

            function getRouteLocation () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        function (position) {
                            $scope.geolocalized = true;
                            $scope.routed = true;

                            $scope.$apply(function () {
                                $rootScope.currentLat = position.coords.latitude;
                                $rootScope.currentLng =  position.coords.longitude;

                                $scope.currentLat = position.coords.latitude;
                                $scope.currentLng =  position.coords.longitude;
                                $scope.routeBtnEnabled = true;
                            });
                        },
                        function () {
                            $scope.geolocalized = true;
                            $scope.routed = true;

                            $scope.$apply(function () {
                                $scope.routeBtnEnabled = true;
                            });
                        }
                    );
                }

                $scope.geolocalized = true;
            }

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

            function getScreenWidth () {
                if ($rootScope.editMode) {
                   return $("nettemplate").parent().parent().width();
                }

                return $(window).width();
            }

            $scope.openStoresMap = function () {
                $rootScope.mapMode = true;

                var height = getScreenHeight();
                var scrollTop = getScrollTop() ;

                $("#map-panel").show();
                $("#map-panel").css("top", height + scrollTop + "px");
                $("#map-panel").css("height", height);
                $(".template").css("height", height);
                $(".template").css("overflow", 'hidden');

                $("#map-panel").animate({top : 0}, 1000, function () {
                    var width  = getScreenWidth();
                    $("#map-panel").css("width",width);
                    $(".angular-google-map-container").css("height", height - 93 ); //remove header size
                    $(".list-mode").css("height", height - 93 ); //remove header size

                    $scope.$apply(function () {
                        $rootScope.mapModeTemplate = true;
                    });
                });
            }

            /*
                STACKOVERFLOW
                http://stackoverflow.com/questions/4057665/google-maps-api-v3-find-nearest-markers
             */
            function find_closest_marker (lat, lng) {
                var R = 6371; // radius of earth in km
                var distances = [];
                var closest = -1;

                for (var i=0; i < $scope.storeList.length; i++ ) {
                    var mlat = $scope.storeList[i].lat;
                    var mlng = $scope.storeList[i].lng;
                    var dLat  = rad(mlat - lat);
                    var dLong = rad(mlng - lng);
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    var d = R * c;

                    distances[i] = d;
                    $scope.storeList[i].distance = d;

                    if (closest == -1 || d < distances[closest]) {
                        closest = i;
                    }
                }

                $scope.closestStore = $scope.storeList[closest];

                $scope.storeList.sort(function (a, b) {
                    return a.distance - b.distance;
                });
            }

            function rad (value) {
                /** Converts numeric degrees to radians */
                return value * Math.PI / 180;
            }
        }
    }
});
