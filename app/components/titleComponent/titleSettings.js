'use strict';

angular.module('netMessage.titleSettings', ['ngRoute'])
    .controller('TitleSettingsCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.DEFAULT_TITLE = "<p>5%</p><p>De réduction</p>";

        if ($scope.displayed === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.title && $rootScope.data.components.title.displayed !== undefined) {
            $scope.displayed = $rootScope.data.components.title.displayed;
        } else if ($scope.displayed === undefined) {
            $scope.displayed = true;
        }

        $scope.init = function () {
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            $scope.$watch("displayed", function (newValue) {
                $rootScope.data.components.title.displayed = newValue;
            });

            $scope.text = $rootScope.data.components.title.text.replace(/&quot;/g,'');

            $scope.$watch("text", function (newValue, oldValue) {
                $rootScope.data.components.title.text = newValue;
                $rootScope.data.components.title.realText = $rootScope.replaceText(newValue);
            });

            // Couleur de fond
            $scope.bgColor = $rootScope.data.components.title.bgColor;

            $scope.$watch("bgColor", function (newValue) {
                $rootScope.data.components.title.bgColor = newValue;
                $(".note-editable").css("background", $scope.bgColor);
            });

            $(".note-editable").css("background", $scope.bgColor);

            if ($scope.bgColor == undefined) {
                $scope.bgColor = $rootScope.defaultData.components.title.bgColor;
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

            var myEditor = CKEDITOR.replace('title-settings', {height: 300});

            CKEDITOR.instances['title-settings'].on('instanceReady', function () {
                var editor = $('#cke_title-settings .cke_wysiwyg_div');
                editor.css('backgroundColor', $rootScope.data.components.title.bgColor);
                editor.css('color', $rootScope.data.options.colorSecondary);
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');

                $rootScope.$watch("data.components.title.bgColor", function (newValue) {
                    editor.css('backgroundColor', $rootScope.data.components.title.bgColor);
                });
                $rootScope.$watch("data.options.colorSecondary", function (newValue) {
                    editor.css('color', $rootScope.data.options.colorSecondary);
                });
            });

            CKEDITOR.instances['title-settings'].on('change', function (event) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.text = CKEDITOR.instances['title-settings'].getData();
                    });
                } else {
                    $scope.text = CKEDITOR.instances['title-settings'].getData();
                }
            });

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
    }]
);
