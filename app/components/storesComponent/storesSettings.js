'use strict';

angular.module('netMessage.storesSettings', ['ngRoute'])
    .controller('StoresMainSettingsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.init = function () {
            $scope.nav = "geolocpv";
            if($rootScope.clientid !== undefined){
                $scope.cId = $rootScope.clientid;
            }
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }
        };

        if (!$rootScope.data) {
            $scope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
    }])
    .controller('AdvancedGeolocPvSettingsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.init = function () {
            //-------------------------------Début code -------------------------------------
            // $(".storescustom-src").fileinput({
            //     browseClass: "btn btn-primary btn-block m-t-md",
            //     showCaption: false,
            //     showRemove: false,
            //     showUpload: false,
            //     showPreview: false,
            //     browseLabel: "Importer liste"
            // });
            //-------------------------------Fin code -------------------------------------

            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }
            $scope.storeTitlesData = $rootScope.data.components.storetitles;
            //---------------------  Bloc geolocalisation  -------------------------//
            // Couleur de fond
            $scope.bgColor = $scope.storeTitlesData.bgColor;
            $scope.$watch("bgColor", function (newValue) {
                $rootScope.data.components.storetitles.bgColor = newValue;
            });
            var colorGeoBgPicker = $('.color_geoprimary');
            colorGeoBgPicker.colpick({
                color: $scope.bgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.bgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoBgPicker.colpickHide();
                }
            });
            // couleur de texte
            $scope.txtColor = $scope.storeTitlesData.txtColor;
            $scope.$watch("txtColor", function (newValue) {
                $rootScope.data.components.storetitles.txtColor = newValue;
            });
            var colorGeoTxtPicker = $('.color_geosecondary');
            colorGeoTxtPicker.colpick({
                color: $scope.txtColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.txtColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoTxtPicker.colpickHide();
                }
            });
            //--------------------- Pavé adresse-------------------------//
            // Couleur de fond
            $scope.adbgColor = $scope.storeTitlesData.address.bgColor;
            $scope.$watch("adbgColor", function (newValue) {
                $rootScope.data.components.storetitles.address.bgColor = newValue;
            });
            var colorGeoAdBgPicker = $('.color_adbgColor');
            colorGeoAdBgPicker.colpick({
                color: $scope.adbgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.adbgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoAdBgPicker.colpickHide();
                }
            });
            // couleur de texte
            $scope.adtxtColor = $scope.storeTitlesData.address.txtColor;
            $scope.$watch("adtxtColor", function (newValue) {
                $rootScope.data.components.storetitles.address.txtColor = newValue;
            });
            var colorGeoAdTxtPicker = $('.color_adtxtColor');
            colorGeoAdTxtPicker.colpick({
                color: $scope.adtxtColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.adtxtColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoAdTxtPicker.colpickHide();
                }
            });
            //--------------------- Bouton Appeler -------------------------//
            //toggle
            if ($scope.callDisplayed === undefined && $rootScope.data.components.storetitles.call.displayed !== undefined) {
                $scope.callDisplayed = $rootScope.data.components.storetitles.call.displayed.toString() == "true" ? true : false;
            } else if ($scope.callDisplayed === undefined) {
                $scope.callDisplayed = true;
            }
            $scope.$watch("callDisplayed", function (newValue) {
                $rootScope.data.components.storetitles.call.displayed = newValue;
            });
            // Couleur de fond
            $scope.callbgColor = $scope.storeTitlesData.call.bgColor;
            $scope.$watch("callbgColor", function (newValue) {
                $rootScope.data.components.storetitles.call.bgColor = newValue;
            });
            var colorGeoCallBgPicker = $('.color_callbgColor');
            colorGeoCallBgPicker.colpick({
                color: $scope.callbgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.callbgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoCallBgPicker.colpickHide();
                }
            });
            // couleur de texte
            $scope.calltxtColor = $scope.storeTitlesData.call.txtColor;
            $scope.$watch("calltxtColor", function (newValue) {
                $rootScope.data.components.storetitles.call.txtColor = newValue;
            });
            var colorGeoCallTxtPicker = $('.color_calltxtColor');
            colorGeoCallTxtPicker.colpick({
                color: $scope.calltxtColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.calltxtColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoCallTxtPicker.colpickHide();
                }
            });
            //--------------------- Bouton Itinéraire -------------------------//
            //toggle
            if ($scope.itiDisplayed === undefined && $rootScope.data.components.storetitles.itinerary.displayed !== undefined) {
                $scope.itiDisplayed = $rootScope.data.components.storetitles.itinerary.displayed.toString() == "true" ? true : false;
            } else if ($scope.itiDisplayed === undefined) {
                $scope.itiDisplayed = true;
            }
            $scope.$watch("itiDisplayed", function (newValue) {
                $rootScope.data.components.storetitles.itinerary.displayed = newValue;
            });
            // Couleur de fond
            $scope.itibgColor = $scope.storeTitlesData.itinerary.bgColor;
            $scope.$watch("itibgColor", function (newValue) {
                $rootScope.data.components.storetitles.itinerary.bgColor = newValue;
            });
            var colorGeoItiBgPicker = $('.color_itibgColor');
            colorGeoItiBgPicker.colpick({
                color: $scope.itibgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.itibgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoItiBgPicker.colpickHide();
                }
            });
            // couleur de texte
            $scope.ititxtColor = $scope.storeTitlesData.itinerary.txtColor;
            $scope.$watch("ititxtColor", function (newValue) {
                $rootScope.data.components.storetitles.itinerary.txtColor = newValue;
            });
            var colorGeoItiTxtPicker = $('.color_ititxtColor');
            colorGeoItiTxtPicker.colpick({
                color: $scope.ititxtColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ititxtColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoItiTxtPicker.colpickHide();
                }
            });
            //--------------------- Bouton Voir toutes les boutiques -------------------------//
            //toggle
            if ($scope.allStoresDisplayed === undefined && $rootScope.data.components.storetitles.allStores.displayed !== undefined) {
                $scope.allStoresDisplayed = $rootScope.data.components.storetitles.allStores.displayed.toString() == "true" ? true : false;
            } else if ($scope.allStoresDisplayed === undefined) {
                $scope.allStoresDisplayed = true;
            }
            $scope.$watch("allStoresDisplayed", function (newValue) {
                $rootScope.data.components.storetitles.allStores.displayed = newValue;
            });
            // Couleur de fond
            $scope.allstoresBgColor = $scope.storeTitlesData.allStores.bgColor;
            $scope.$watch("allstoresBgColor", function (newValue) {
                $rootScope.data.components.storetitles.allStores.bgColor = newValue;
            });
            var colorGeoallStoresBgPicker = $('.color_allstoresBgColor');
            colorGeoallStoresBgPicker.colpick({
                color: $scope.allstoresBgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.allstoresBgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoallStoresBgPicker.colpickHide();
                }
            });
            // couleur de texte
            $scope.allstoresTxtColor = $scope.storeTitlesData.allStores.txtColor;
            $scope.$watch("allstoresTxtColor", function (newValue) {
                $rootScope.data.components.storetitles.allStores.txtColor = newValue;
            });
            var colorGeoallStoresTxtPicker = $('.color_allstoresTxtColor');
            colorGeoallStoresTxtPicker.colpick({
                color: $scope.allstoresTxtColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.allstoresTxtColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorGeoallStoresTxtPicker.colpickHide();
                }
            });

            //Type
            $scope.geolocType = $rootScope.data.components.storetitles.geolocType;
            $scope.$watch("geolocType", function (newValue, oldValue) {
                $rootScope.data.components.storetitles.geolocType = newValue;
            });
        };
        
        //-------------------------------Début code -------------------------------------
        // $(".storescustom-src").change(function (event) {
        //     readFile(event);
        // });

        // function readFile (event) {
        //     if ((/\.(csv)$/i).test(event.target.files[0].name)) {
        //         upload(event.target.files[0]);
        //     } else {
        //         alert("Erreur lors de l'import de vos points de vente, le fichier doit être au format .csv");
        //     }
        // }

        // function upload (file) {
        //     if (file) {
        //         var reader = new FileReader();

        //         reader.onload = function (e) {
        //             var contents = e.target.result;
        //             var rows = contents.split("\n");
        //             var storeList = new Array();
        //             if(rows[0].split(";").length == 5 || rows[0].split(";").length == 6) {
        //                 for (var i = 0; i<rows.length; i++) {
        //                     var cols = rows[i].split(";");
        //                     if (cols.length == 5) {
        //                         var store = new Object();
        //                         store.name =  utf8_decode(cols[0]);
        //                         store.address =  utf8_decode(cols[1]);
        //                         store.phone = cols[2];
        //                         store.lat = cols[3];
        //                         store.lng = cols[4];
        //                         store.originalPos = i;
        //                         // if (store.name != "" && store.address != "" && store.phone != "" && store.lat != "" && store.lng != "") {
        //                             storeList.push(store);
        //                         // }
        //                     }
        //                     if (cols.length == 6) {
        //                         var store = new Object();
        //                         store.name =  utf8_decode(cols[0]);
        //                         store.address =  utf8_decode(cols[1]);
        //                         store.phone = cols[2];
        //                         store.lat = cols[3];
        //                         store.lng = cols[4];
        //                         store.openHour = cols[5];
        //                         store.originalPos = i;
        //                         // if (store.name != "" && store.address != "" && store.phone != "" && store.lat != "" && store.lng != "") {
        //                             storeList.push(store);
        //                         // }
        //                     }
        //                 }
        //                 $scope.$apply(function () {
        //                     $rootScope.data.components.stores= storeList;
        //                 });
        //             }else {
        //                     alert("Votre fichier ne contient pas le bon nombre de colonnes.");
        //             }
        //         }
        //         reader.readAsText(file, 'ISO-8859-1');
        //     } else {
        //         alert("Failed to load file");
        //     }
        // }
        //-------------------------------Fin code -------------------------------------

        if (!$rootScope.data) {
            $scope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
    }])
    .controller('StoresSettingsCtrl', ['$scope', '$rootScope', '$location', '$animate','$parse', function ($scope, $rootScope, $location, $animate, $parse) {
        $scope.init = function () {
            $scope.nav = "geolocpv";
            $scope.itemTypes = [
                { "name": "Géolocalisation", "value": "geo" },
                { "name": "Magasin de référence", "value": "custom" }
            ];
            if($rootScope.clientid !== undefined){
                $scope.cId = $rootScope.clientid;
            }
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }
            $scope.storesData           = $rootScope.data.components.stores;
            $scope.storeTitlesData      = $rootScope.data.components.storetitles;
            $scope.title                = $scope.storeTitlesData.title;
            // Custom fields for Customized option type
            $scope.customStoreTitle      = $scope.storeTitlesData.customStoreTitle;
            $scope.customStoreName      = $scope.storeTitlesData.customStoreName;
            $scope.customAdA            = $scope.storeTitlesData.customStoreAddressa;
            $scope.customAdB            = $scope.storeTitlesData.customStoreAddressb;
            $scope.customAdC            = $scope.storeTitlesData.customStoreAddressc;
            $scope.customPostalCode     = $scope.storeTitlesData.customStorePostalCode;
            $scope.customTown           = $scope.storeTitlesData.customStoreTown;
            $scope.customOpenHour       = $scope.storeTitlesData.customStoreOpenHour;
            $scope.customPhone          = $scope.storeTitlesData.customStorePhone;
            $scope.customLatitude       = $scope.storeTitlesData.customStoreLatitude;
            $scope.customLongitude      = $scope.storeTitlesData.customStoreLongitude;
            // All Stores
            $scope.allStoreTitle        = $scope.storeTitlesData.allStoreTitle;
            $scope.inputSelected        = function () {
                $scope.lastFocused = document.activeElement;
            };
            $scope.insertText           = function (text, elemId) {
                text            = '$$[record]' + text + '$$';
                var input = $scope.lastFocused;
                if (input == undefined){
                    input       = document.getElementById(elemId);
                    input.value = input.value + text;
                    var model = $parse(elemId);
                    model.assign($scope,input.value);
                }else{
                    var pos = getCaretPosition(input);
                    var front = input.value.substring(0, pos);
                    var back = input.value.substring(pos, input.value.length);
                    input.value = front + text + back;
                    var modela = $parse(elemId);
                    modela.assign($scope,input.value);
                }
                $scope.lastFocused = undefined;
                reSetValues();
            }
            $scope.$watch("title", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customStoreTitle", function (newValue) {
                console.log("okokokok");
                reSetValues();
            });
            $scope.$watch("customStoreName", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customAdA", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customAdB", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customAdC", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customPhone", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customPostalCode", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customTown", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customOpenHour", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customLatitude", function (newValue) {
                reSetValues();
            });
            $scope.$watch("customLongitude", function (newValue) {
                reSetValues();
            });
            $scope.$watch("allStoreTitle", function (newValue) {
                reSetValues();
            });

            $scope.geolocType = $rootScope.data.components.storetitles.geolocType;
            $scope.$watch("geolocType", function (newValue, oldValue) {
                $rootScope.data.components.storetitles.geolocType = newValue;
                $scope.geolocTypeText = "Afficher le bloc Point de vente ";
                if($scope.geolocType == 'custom'){
                    $scope.geolocTypeText = "Afficher ce bloc";
                }
            });
            if ($scope.displayed === undefined && $rootScope.data.components.storesDisplayed !== undefined) {
                $scope.displayed = $rootScope.data.components.storesDisplayed;
            } else if ($scope.displayed === undefined) {
                $scope.displayed = true;
            }
            $scope.$watch("displayed", function (newValue) {
                $rootScope.data.components.storesDisplayed = newValue;
            });

            $scope.$watch("storesData", function () {
                $rootScope.data.components.stores = $scope.storesData;
                $scope.hasStores = $scope.storesData != undefined && $scope.storesData.length > 0;
            });

            $rootScope.$watch("data.components.stores", function (newValue) {
                $rootScope.data.components.stores = newValue;
            });

            $scope.$watch(
                function () {
                    return $rootScope.data.components.stores;
                },
                function () {
                    $scope.storesData =  $rootScope.data.components.stores;
                }
            );

            $(".stores-src").fileinput({
                browseClass: "btn btn-primary btn-block m-t-md",
                showCaption: false,
                showRemove: false,
                showUpload: false,
                showPreview: false,
                browseLabel: "Importer la liste de vos points de vente"
            });

        };
        function watchTitles () {
            // $rootScope.data.components.storetitles = new Object();
            // $rootScope.data.components.storetitles.title = $scope.title;
            // $rootScope.data.components.storetitles.allStoreTitle = $scope.allStoreTitle;
        }
        function reSetValues() {
            $rootScope.data.components.storetitles.title                = $scope.title;
            $rootScope.data.components.storetitles.realTxtStoresTitle   = $rootScope.replaceText($scope.title);
            $rootScope.data.components.storetitles.customStoreTitle     = $scope.customStoreTitle;
            $rootScope.data.components.storetitles.realTxtCustomTitle   = $rootScope.replaceText($scope.customStoreTitle);
            $rootScope.data.components.storetitles.customStoreName      = $scope.customStoreName;
            $rootScope.data.components.storetitles.realTxtStoresName    = $rootScope.replaceText($scope.customStoreName);
            $rootScope.data.components.storetitles.customStoreAddressa  = $scope.customAdA;
            $rootScope.data.components.storetitles.realTxtStoresAdA     = $rootScope.replaceText($scope.customAdA);
            $rootScope.data.components.storetitles.customStoreAddressb  = $scope.customAdB;
            $rootScope.data.components.storetitles.realTxtStoresAdB     = $rootScope.replaceText($scope.customAdB);
            $rootScope.data.components.storetitles.customStoreAddressc  = $scope.customAdC;
            $rootScope.data.components.storetitles.realTxtStoresAdC     = $rootScope.replaceText($scope.customAdC);
            $rootScope.data.components.storetitles.customStorePostalCode= $scope.customPostalCode;
            $rootScope.data.components.storetitles.realTxtStoresPostC   = $rootScope.replaceText($scope.customPostalCode);
            $rootScope.data.components.storetitles.customStoreTown      = $scope.customTown;
            $rootScope.data.components.storetitles.realTxtStoresTown    = $rootScope.replaceText($scope.customTown);
            $rootScope.data.components.storetitles.customStorePhone     = $scope.customPhone;
            $rootScope.data.components.storetitles.realTxtStoresPhone   = $rootScope.replaceText($scope.customPhone);
            $rootScope.data.components.storetitles.customStoreOpenHour  = $scope.customOpenHour;
            $rootScope.data.components.storetitles.realTxtStoresOpenHour= $rootScope.replaceText($scope.customOpenHour);
            $rootScope.data.components.storetitles.customStoreLatitude  = $scope.customLatitude;
            $rootScope.data.components.storetitles.realTxtStoresLat     = $rootScope.replaceText($scope.customLatitude);
            $rootScope.data.components.storetitles.customStoreLongitude = $scope.customLongitude;
            $rootScope.data.components.storetitles.realTxtStoresLong    = $rootScope.replaceText($scope.customLongitude);
            $rootScope.data.components.storetitles.allStoreTitle        = $scope.allStoreTitle;
        }
        function getCaretPosition(oField) {
            var iCaretPos = 0;
            if (document.selection) {
                oField.focus();
                var oSel = document.selection.createRange();
                oSel.moveStart('character', -oField.value.length);
                iCaretPos = oSel.text.length;
            }
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            return iCaretPos;
        }

        if (!$rootScope.data) {
            $scope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }

        $scope.resetAllStoreTitle = function () {
            $scope.allStoreTitle = $rootScope.defaultData.components.storetitles.allStoreTitle;
        };

        $scope.resetTitle = function () {
            $scope.title =  $rootScope.defaultData.components.storetitles.title;
        };

        $scope.resetCustomTitle = function () {
            $scope.customStoreTitle =  $rootScope.defaultData.components.storetitles.customStoreTitle;
        };

        $scope.delete = function (index) {
            $scope.storesData = new Array();
        };

        $(".stores-src").change(function (event) {
            readFile(event);
        });

        function readFile (event) {
            if ((/\.(csv)$/i).test(event.target.files[0].name)) {
                upload(event.target.files[0]);
            } else {
                alert("Erreur lors de l'import de vos points de vente, le fichier doit être au format .csv");
            }
        }

        function upload (file) {
            if (file) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var contents = e.target.result;
                    var rows = contents.split("\n");
                    var storeList = new Array();
                    if(rows[0].split(";").length == 5 || rows[0].split(";").length == 6) {
                        for (var i = 1; i<rows.length; i++) {
                            var cols = rows[i].split(";");
                            if (cols.length == 5) {
                                var store = new Object();
                                store.name =  utf8_decode(cols[0]);
                                store.address =  utf8_decode(cols[1]);
                                store.phone = cols[2];
                                store.lat = cols[3];
                                store.lng = cols[4];
                                store.originalPos = i;
                                // if (store.name != "" && store.address != "" && store.phone != "" && store.lat != "" && store.lng != "") {
                                    storeList.push(store);
                                // }
                            }
                            if (cols.length == 6) {
                                var store = new Object();
                                store.name =  utf8_decode(cols[0]);
                                store.address =  utf8_decode(cols[1]);
                                store.phone = cols[2];
                                store.lat = cols[3];
                                store.lng = cols[4];
                                store.openHour = cols[5];
                                store.originalPos = i;
                                // if (store.name != "" && store.address != "" && store.phone != "" && store.lat != "" && store.lng != "") {
                                    storeList.push(store);
                                // }
                            }
                        }
                        $scope.$apply(function () {
                            $scope.storesData= storeList;
                        });
                    }else {
                            alert("Votre fichier ne contient pas le bon nombre de colonnes.");
                    }
                }
                reader.readAsText(file, 'ISO-8859-1');
            } else {
                alert("Failed to load file");
            }
        }
    }]
);

function utf8_decode (str_data) {
    try {
        return decodeURIComponent(escape(str_data));
    } catch (e) {
        return str_data;
    }
}
