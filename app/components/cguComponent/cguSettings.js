'use strict';

angular.module('netMessage.cguSettings', ['ngRoute'])
    .controller('CguSettingsCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {
        $scope.init = function () {
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            $scope.text = $rootScope.data.components.cgu.text.replace(/&quot;/g,'');

            $scope.$watch("text", function (newValue, oldValue) {
                $rootScope.data.components.cgu.text = newValue;
                $rootScope.data.components.cgu.realText = $rootScope.replaceText(newValue);
            });

            if ($scope.displayed === undefined && $rootScope.data.components.cgu.displayed !== undefined) {
                $scope.displayed = $rootScope.data.components.cgu.displayed;
            } else if ($scope.displayed === undefined) {
                $scope.displayed = true;
            }

            $scope.$watch("displayed", function (newValue) {
                $rootScope.data.components.cgu.displayed = newValue;
            });

            $scope.bgColor = $rootScope.data.components.cgu.bgColor;

            $scope.$watch("bgColor", function (newValue) {
                $rootScope.data.components.cgu.bgColor = newValue;
                $(".note-editable").css("background", $scope.bgColor);
            });

            $(".note-editable").css("background", $scope.bgColor);

            if ($scope.bgColor == undefined) {
                $scope.bgColor = $rootScope.defaultData.components.cgu.bgColor;
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

            var myEditor = CKEDITOR.replace('cgu-settings', {height: 270});

            CKEDITOR.instances['cgu-settings'].on('instanceReady', function () {
                var editor = $('#cke_cgu-settings .cke_wysiwyg_div');
                editor.css('backgroundColor', $rootScope.data.components.cgu.bgColor);
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');

                $rootScope.$watch("data.components.cgu.bgColor", function (newValue) {
                    editor.css('backgroundColor', $rootScope.data.components.cgu.bgColor);
                });
            });

            CKEDITOR.instances['cgu-settings'].on('change', function (event) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.text = CKEDITOR.instances['cgu-settings'].getData();
                    });
                } else {
                    $scope.text = CKEDITOR.instances['cgu-settings'].getData();
                }
            });
        };

        if (!$rootScope.data) {
            $scope.$on("serviceReady", function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
    }
]);
