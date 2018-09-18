'use strict';

angular.module('netMessage.barcodeSettings', ['ngRoute'])
    .controller('BarcodeMainSettingsCtrl', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $location, $timeout) {
        var barcode = "";
        if (!$rootScope.data) {
            $scope.$on("serviceReady", function () {
                $scope.$apply(function () {
                    init();
                });
            });
        } else {
            init();
        }

        function init() {
            $scope.barcodeType = $rootScope.data.components.barcode.codeType;
            $scope.$watch("barcodeType", function (newValue) {
                $rootScope.data.components.barcode.codeType = newValue;
            });

            $scope.barcodeMode = $rootScope.data.components.barcode.modeType;
            $scope.$watch("barcodeMode", function (newValue) {
                $rootScope.data.components.barcode.modeType = newValue;
            });

            $scope.displayed = $rootScope.data.components.barcode.displayed;
            $scope.$watch("displayed", function (newValue) {
                $rootScope.data.components.barcode.displayed = newValue;
            });

            //input code
            $scope.inputCode = $rootScope.data.components.barcode.inputCodeNum;
            $scope.$watch("inputCode", function (newValue) {
                $rootScope.data.components.barcode.inputCodeNum = newValue;
            });

            // input code personnalise
            $scope.defaultValue = $rootScope.data.components.barcode.defaultValue;
            $scope.$watch("defaultValue", function (newValue) {
                $rootScope.data.components.barcode.defaultValue = newValue;
                console.log("newValue",newValue);
                $rootScope.data.components.barcode.realTxtPersonalise = $rootScope.replaceText(newValue);
            });

            //titre display
            $scope.display = $rootScope.data.components.barcode.titre.display;
            $scope.$watch("display", function (newValue) {
                $rootScope.data.components.barcode.titre.display = newValue;
            });

            //input titre
            $scope.titre = $rootScope.data.components.barcode.titre.text;
            $scope.$watch("titre", function (newValue, oldValue) {
                $rootScope.data.components.barcode.titre.text = newValue;
                $rootScope.data.components.barcode.titre.realText = $rootScope.replaceText(newValue);
            });

            // Couleur de fond
            $scope.$watch("bgColor", function (newValue) {
                $rootScope.data.components.barcode.titre.bgColor = newValue;
                $(".note-editable").css("background", $scope.bgColor);
            });

            $(".note-editable").css("background", $scope.bgColor);

            if ($scope.bgColor == undefined) {
                $scope.bgColor = $rootScope.data.components.barcode.titre.bgColor;
            }

            $scope.codeTypes = [
                { "name": "Code 39", "value": "code39" },
                { "name": "EAN 13", "value": "ean13" },
                { "name": "Code 128", "value": "code128" }
            ];

            $scope.modeTypes = [
                { "name": "Unitaire", "value": "unitaire" },
                { "name": "Personnalisé", "value": "personalise" }
            ];

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

            $scope.inputSelected = function () {
                $scope.lastFocused = document.activeElement;
            };


            $scope.insertText = function (text, item) {       
                text = '$$[record]' + text + '$$';
                var input = $scope.lastFocused;

                if (input == undefined) {
                    input = document.getElementById("input");
                    input.value = ' ';
                    input.value = input.value + text;
                    $scope.defaultValue = input.value;
                } else {
                    var pos = getCaretPosition(input);
                    var front = input.value.substring(0, pos);
                    var back = input.value.substring(pos, input.value.length);
                    input.value = front + text + back;
                    $scope.defaultValue = input.value;
                }
                $scope.lastFocused = undefined;
                // $rootScope.data.barcode.forEach(function (element) {
                //     if (element.defaultValue != undefined) {
                //         var changedElement = $rootScope.replaceText(element.defaultValue);
                //         if (element.defaultValue != changedElement) {
                //             $("#changeThisValue_" + element.id).value = changedElement;
                //             // $("#changeThisValue_" + element.id)[0].value = changedElement;
                //         }
                //     }
                // }, this);
            }
            var myEditor = CKEDITOR.replace('titre-settings', { height: 300 });

            CKEDITOR.instances['titre-settings'].on('instanceReady', function () {
                var editor = $('#cke_titre-settings .cke_wysiwyg_div');
                editor.css('backgroundColor', $rootScope.data.components.barcode.titre.bgColor);
                editor.css('color', "#000");
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');
                editor.css('text-align', 'center');

                /*    $rootScope.$watch("data.options.colorPrimary", function (newValue) {
                        editor.css('backgroundColor', $rootScope.data.options.colorPrimary);
                    });*/

                $rootScope.$watch("data.components.barcode.titre.bgColor", function (newValue) {
                    editor.css('backgroundColor', $rootScope.data.components.barcode.titre.bgColor);
                });
                $rootScope.$watch("data.options.colorSecondary", function (newValue) {
                    editor.css('color', "#000");
                });
            });

            CKEDITOR.instances['titre-settings'].on('change', function (event) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.titre = CKEDITOR.instances['titre-settings'].getData();
                    });
                } else {
                    $scope.titre = CKEDITOR.instances['titre-settings'].getData();
                }
            });
        }
    }]);