'use strict';

angular.module('netMessage.textSettings', ['ngRoute'])
    .controller('TextSettingsCtrl', ['$scope', '$rootScope', '$location', '$http', function ($scope, $rootScope, $location, $http) {
            if ($scope.displayed === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.text && $rootScope.data.components.text.displayed !== undefined) {
                $scope.displayed = $rootScope.data.components.text.displayed;
            } else if ($scope.displayed === undefined) {
                $scope.displayed = true;
            }

            $scope.init = function () {
                if ($rootScope.data.modeSettings.modeType == "2") {
                    $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
                }

                $scope.text = $rootScope.data.components.text.text.replace(/&quot;/g,'');

                $scope.$watch("text", function (newValue, oldValue) {
                    $rootScope.data.components.text.text = newValue;
                    $rootScope.data.components.text.realText = $rootScope.replaceText(newValue);
                });

                $scope.$watch("displayed", function (newValue) {
                    $rootScope.data.components.text.displayed = newValue;
                });

                // Couleur de fond
                $scope.bgColor = $rootScope.data.components.text.bgColor;

                $scope.$watch("bgColor", function (newValue) {
                    $rootScope.data.components.text.bgColor = newValue;
                    $(".note-editable").css("background", $scope.bgColor);
                });

                $(".note-editable").css("background", $scope.bgColor);

                if ($scope.bgColor == undefined) {
                    $scope.bgColor = $rootScope.defaultData.components.text.bgColor;
                }

                var colorPicker = $('.color_primary');
                colorPicker.colpick({
                    color: $scope.bgColor.replace("#", ""),
                    onChange: function ($hsb, $hexa) {
                        $scope.$apply(function () {
                            $scope.bgColor = "#" + $hexa;
                        });
                    },
                    onSubmit: function (a, b ,c) {
                        colorPicker.colpickHide();
                    }
                });


                var myEditor = CKEDITOR.replace('text-settings', { height: 300 });

                CKEDITOR.instances['text-settings'].on('instanceReady', function () {
                    var editor = $('#cke_text-settings .cke_wysiwyg_div');
                    editor.css('backgroundColor', $rootScope.data.components.text.bgColor);
                    editor.css('color', $rootScope.data.options.colorSecondary);
                    editor.css('fontSize', '12px');
                    editor.css('padding', '10px');

                    /*    $rootScope.$watch("data.options.colorPrimary", function (newValue) {
                            editor.css('backgroundColor', $rootScope.data.options.colorPrimary);
                        });*/

                    $rootScope.$watch("data.components.text.bgColor", function (newValue) {
                        editor.css('backgroundColor', $rootScope.data.components.text.bgColor);
                    });
                    $rootScope.$watch("data.options.colorSecondary", function (newValue) {
                        editor.css('color', $rootScope.data.options.colorSecondary);
                    });
                });

                CKEDITOR.instances['text-settings'].on('change', function (event) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            $scope.text = CKEDITOR.instances['text-settings'].getData();
                        });
                    } else {
                        $scope.text = CKEDITOR.instances['text-settings'].getData();
                    }
                });
            }

            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        $scope.init();
                    });
                });
            } else {
                $scope.init();
            }
        }]
    );
