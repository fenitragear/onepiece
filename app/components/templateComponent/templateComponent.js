'use strict';

myApp.directive('nettemplate', function () {
    return {
        restrict: 'E',
        scope: {
            templateid: '=',
            clientid: '=',
            editmode: '='
        },
        templateUrl: 'components/templateComponent/templateComponent.html?1',
        controller: function ($scope, $attrs, $location, $rootScope, $http, $timeout) {
            var loadExpertMode = false;

            $rootScope.sourceCode = "";
            $rootScope.importSourceCode = false;

            $rootScope.$watch("sourceCode", function (newValue) {
                $scope.sourceCode = newValue;
            });

            $rootScope.$watch("importSourceCode", function (newValue) {
                if (newValue === true) {
                   $rootScope.sourceCode = $("#regularModeSourceCode").html();
                }

                $rootScope.importSourceCode = false;
            });

            var url = $location.path();
            var urlArray = url.split("/");
            var clientId = urlArray[3];

            if (!$rootScope.editMode) {
                clientId = urlArray[2];
            }

            /*
            $.post('../server/files/'+clientId+'/sourceCode.html', function (data) {
                $scope.sourceCode = data;
            });
            */

            $rootScope.editMode = $rootScope.editMode == true; //fix empty


            $scope.$watch('templateid', function (newValue, oldValue) {});

            getUrlParams();

            /*
             *  CORE INIT
             */
            init();

            /*
             WATCH URL FOR MODIFICATIONS, SETTINGS, TEMPLATE
             */
            $scope.$watch(function () {
                getUrlParams();
            });

            $scope.changeUrl = function (component) {
                if ($scope.editmode && component != undefined) {
                    $rootScope.changeURL(component);
                }
            }

            $rootScope.$watch("storeMapClass", function (newValue){
                $scope.storeMapClass = newValue;
            });

            /*
             CONSTANT SAVE
             */
            var jsonSaveInterval;

            $scope.$watch("clientid", function () {
                clearInterval(jsonSaveInterval);
                jsonSaveInterval = undefined;
                init();

                $scope.$on("serviceReady", function () {
                    $("#templateDiv").removeClass("hide");

                    if ($scope.editmode) {
                        if ($rootScope.data.modeSettings.modeType == "2") {
                            $rootScope.changeURL("expertMode");
                        } else {
                            $rootScope.changeURL("options");
                        }
                    }
                });
            });

            function createNewJSONSaveInterval () {
                if (jsonSaveInterval == undefined && $scope.editmode) {
                    jsonSaveInterval = setInterval(function () {
                        var slimData = JSON.parse(JSON.stringify($rootScope.data));
                        delete slimData.components.title.realText;
                        delete slimData.components.text.realText;
                        delete slimData.components.cgu.realText;
                        delete slimData.forms.realIntroduction;
                        var data = $.param({
                            session: $scope.clientid,
                            content: slimData
                        });

                        $http({
                            url: '../server/service/postJSON.php',
                            method: "POST",
                            data: data,
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function (data) {});
                    }, 2000);
                }
            }

            function getUrlParams () {
                var url = $location.path();
                var urlArray = url.split("/");

                $rootScope.clientid = urlArray[3];
                $scope.currentUrl = urlArray[2];

                if ($rootScope.data) {
                    $rootScope.data.template.id = $scope.templateid;
                }
            }

            function getBaseSettings () {
                $http.get('../server/service/settings.json').success(function (data) {
                    initWithData(data);
                }).error(function (data) {});
            }

            function init () {
                $http.get('../server/service/settings.json').success(function (data) {
                    $rootScope.defaultData = data;

                    $http.get('../server/files/' + $scope.clientid + '/settings.json?t=' + (new Date().getTime()).toString(16)).success(function (data) {
                        initWithData(data);
                        createNewJSONSaveInterval();
                    }).error(function () {
                        $rootScope.data = $rootScope.defaultData;
                        initWithData($rootScope.data);
                        //getBaseSettings();
                        createNewJSONSaveInterval();
                    });
                });
            }

            function initWithData (data) {
                $rootScope.data = data;
                $scope.data = data;

                if ($rootScope.data.components.storetitles == undefined) {
                    $rootScope.data.components.storetitles = new Object();
                    $rootScope.data.components.storetitles.title = $rootScope.defaultData.components.storetitles.title;
                    $rootScope.data.components.storetitles.allStoreTitle = $rootScope.defaultData.components.storetitles.allStoreTitle;
                }

                if ($rootScope.data.components.slider == undefined) {
                    $rootScope.data.components.slider = $rootScope.defaultData.components.slider;
                }

                if ($rootScope.data.components.scratch == undefined) {
                    $rootScope.data.components.scratch = $rootScope.defaultData.components.scratch;
                }

                if ($rootScope.data.components.shake == undefined) {
                    $rootScope.data.components.shake = $rootScope.defaultData.components.shake;
                }

                if ($rootScope.data.components.barcode == undefined) {
                    $rootScope.data.components.barcode = $rootScope.defaultData.components.barcode;
                }

                var displayedComponents = [
                    'cgu',
                    'logo',
                    'text',
                    'title',
                    'customcountdown',
                    'barcode'
                ];

                for (var i = 0; i < displayedComponents.length; i += 1) {
                    if ($rootScope.data.components[displayedComponents[i]].displayed === undefined) {
                        $rootScope.data.components[displayedComponents[i]].displayed = true;
                    } else if ($rootScope.data.components[displayedComponents[i]].displayed == "false") {
                        $rootScope.data.components[displayedComponents[i]].displayed = false;
                    }

                    $rootScope.data.components[displayedComponents[i]].displayed = $rootScope.data.components[displayedComponents[i]].displayed == "true" ? true : $rootScope.data.components[displayedComponents[i]].displayed;
                }

                // Affichage Aperçu message de fin
                if ($rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.expiration.preview !== undefined) {
                    $rootScope.expirationDisplayed = $rootScope.data.components.customcountdown.expiration.preview;
                } else if ($scope.expirationDisplayed === undefined || $scope.expirationDisplayed == "") {
                    $rootScope.expirationDisplayed = false;
                }

                if ($rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.endDate == "") {
                    var l  = moment().add(1, 'days');
                    $rootScope.data.components.customcountdown.endDate = l;
                }
                $rootScope.$watch("data.components.customcountdown.expiration.displayed", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.expiration.displayed = newValue;
                });

                if ($rootScope.data.components.storesDisplayed === undefined) {
                    $rootScope.data.components.storesDisplayed = true;
                } else if ($rootScope.data.components.storesDisplayed == "false") {
                    $rootScope.data.components.storesDisplayed = false;
                }

                $rootScope.data.components.storesDisplayed = $rootScope.data.components.storesDisplayed == "true" ? true : $rootScope.data.components.storesDisplayed;

                if ($rootScope.data.components.logo.blank === undefined) {
                    $rootScope.data.components.logo.blank = true;
                }

                $rootScope.data.components.logo.blank = $rootScope.data.components.logo.blank == ("true" || true) ? true : false;

                if ($rootScope.data.components.logo.formLink === undefined) {
                    $rootScope.data.components.logo.formLink = true;
                }

                $rootScope.data.components.logo.formLink = ($rootScope.data.components.logo.formLink == "true" ? true : false);

                if ($rootScope.data.forms.pageDividerIds == undefined || $rootScope.data.forms.pageDividerIds == "") {
                    $rootScope.data.forms.pageDividerIds = [];
                }

                if ($rootScope.data.forms === undefined || $rootScope.data.forms == "") {
                    $rootScope.data.forms = $rootScope.defaultData.forms;
                }

                if ($rootScope.data.forms.layouts.styles === undefined || $rootScope.data.forms.layouts.styles == "") {
                    $rootScope.data.forms.layouts.styles = $rootScope.defaultData.forms.layouts.styles;
                }

                if ($rootScope.data.forms.layouts.position === undefined || $rootScope.data.forms.layouts.position == "") {
                    $rootScope.data.forms.layouts.position = $rootScope.defaultData.forms.layouts.position;
                }

                if ($rootScope.data.modeSettings === undefined || $rootScope.data.modeSettings == "") {
                    $rootScope.data.modeSettings = $rootScope.defaultData.modeSettings;
                }

                if ($rootScope.data.forms.layouts.colors.backgroundIntroduction === undefined || $rootScope.data.forms.layouts.colors.backgroundIntroduction == "") {
                    $rootScope.data.forms.layouts.colors.backgroundIntroduction = $rootScope.defaultData.forms.layouts.colors.backgroundIntroduction;
                }

                $scope.modeSettings = $rootScope.data.modeSettings;
                $scope.modeSettings.modeTypeList = $rootScope.defaultData.modeSettings.modeTypeList;
                $rootScope.data.forms.formTypes = $rootScope.defaultData.forms.formTypes;
                $scope.template = data.template;
                $scope.logoData = $rootScope.data.components.logo;
				$scope.videoData = $rootScope.data.components.video;
                $scope.titleData = $rootScope.data.components.title;
                $scope.countdownData = $rootScope.data.components.customcountdown;
                $scope.barcodeData = $rootScope.data.components.barcode;
                $scope.textData = $rootScope.data.components.text;
                $scope.sliderData = $rootScope.data.components.slider;
                $scope.scratchData = $rootScope.data.components.scratch;
                $scope.shakeData = $rootScope.data.components.shake;
                $scope.cguData = $rootScope.data.components.cgu;
                $scope.formData = $rootScope.data.forms;
                $scope.storesData = $rootScope.data.components.stores;
                $scope.storeTitlesData = $rootScope.data.components.storetitles;
                $scope.colorPrimary = $rootScope.data.options.colorPrimary;
                $scope.colorSecondary = $rootScope.data.options.colorSecondary;
                $rootScope.recipientCreate = false;

                $scope.$watch("titleData.text", function (newValue) {
                    $scope.titleTextLength = newValue.length; //String(newValue).replace(/<[^>]+>/gm, '').replace(/&nbsp;/gi,'').trim().length;
                });

                $scope.$watch(
                    function () {
                        return $rootScope.data.options.colorPrimary;
                    },
                    function () {
                        $scope.colorPrimary = $rootScope.data.options.colorPrimary;
                    },
                    true
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.stores;
                    },
                    function () {
                        $scope.storesData = $rootScope.data.components.stores;
                    },
                    true
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.options.colorSecondary;
                    },
                    function () {
                        $scope.colorSecondary = $rootScope.data.options.colorSecondary;
                    },
                    true
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.forms;
                    },
                    function () {
                        $scope.forms = $rootScope.data.forms;
                    },
                    true
                );

                $timeout(function () {
                    $rootScope.$broadcast("serviceReady", {});
                });

                if (!loadExpertMode) {
                    $http({
                        url: '../server/files/'+clientId+'/sourceCode.html',
                        method: "GET"
                    }).success(function (data) {
                        // $scope.sourceCode = data;
                        $rootScope.sourceCode = data;
                    }).then(function (data) {}, function (response) {
                        if (response.status == "404") {
                            $rootScope.sourceCode = $("#regularModeSourceCode").html();
                        }
                    });

                    loadExpertMode = true;
                }

                // Affichage bloc formulaire
                $rootScope.$watch("data.forms.formShow", function (newValue, oldValue) {
                    var cdata = new FormData();
                    var formShowVal = newValue;
                    cdata.append("formShowVal" , formShowVal);
                    cdata.append("session", clientId);
                    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
                    xhr.open( 'post', '../server/service/postFormShow.php', true );
                    xhr.send(cdata);
                });

            }
        }
    }
});
