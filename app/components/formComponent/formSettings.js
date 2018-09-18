'use strict';

angular.module('netMessage.formSettings', ['ngRoute'])
    .controller('FormMainSettingsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.init = function () {
            $scope.nav = "layouts";
            $scope.formShow = $rootScope.data.forms.formShow;
            $rootScope.$watch("data.forms.formShow", function (newValue) {
                $scope.formShow = newValue;
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
    }])

    .controller('FormSettingsCtrl', ['$scope', '$rootScope', '$modal' , '$location', function ($scope, $rootScope, $modal, $location) {
        $scope.init = function () {
            //$scope.hourIntervalChoices = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60"];

            function isNumber (n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            $rootScope.$watch("data.forms.layouts.position.subPosition", function (newValue, oldValue) {
                $scope.formPosition = $rootScope.data.forms.layouts.position.subPosition;
            });

            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            if ($rootScope.data.forms.pageDividerIds == undefined || $rootScope.data.forms.pageDividerIds == "") {
                $scope.pageDividerIds = [];
            } else {
                $scope.pageDividerIds = $rootScope.data.forms.pageDividerIds;
            }

            if ($rootScope.data.forms.formFields == undefined || $rootScope.data.forms.formFields == "") {
                $scope.formFields = $rootScope.defaultData.forms.formFields;
            } else {
                $scope.formFields = $rootScope.data.forms.formFields;

                if ($scope.formFields.length > 0 && $scope.formFields[0].id == undefined) {
                    var count = 1;

                    angular.forEach($scope.formFields, function(itm) {
                        itm.id = count++;
                    });
                }
            }

            $scope.$watch("formFields", function (newValue, oldValue) {
               

                $rootScope.data.forms.formFields = newValue;
            }, true);

            $scope.limitSwitchBtn = false;

            if ($rootScope.data.forms.limitSwitch == undefined || $rootScope.data.forms.limitSwitch == "") {
                $scope.limitSwitch = $rootScope.defaultData.forms.limitSwitch;
            } else {
                $scope.limitSwitch = $rootScope.data.forms.limitSwitch;
            }

            $scope.$watch("limitSwitch", function (newValue, oldValue) {
                $rootScope.data.forms.limitSwitch = newValue;
            });

            if ($rootScope.data.forms.thankNote == undefined) {
                $scope.thankNote = $rootScope.defaultData.forms.thankNote;
            } else {
                $scope.thankNote = $rootScope.data.forms.thankNote;
            }

            $scope.$watch("thankNote", function (newValue, oldValue) {
                $rootScope.data.forms.thankNote = newValue;
            });

            $scope.mandatoryErrorMessage = $rootScope.data.forms.mandatoryErrorMessage;

            $scope.$watch("mandatoryErrorMessage", function (newValue, oldValue) {
                $rootScope.data.forms.mandatoryErrorMessage = newValue;
            });

            if ($rootScope.data.forms.participatedText == undefined || $rootScope.data.forms.participatedText == "") {
                $scope.participatedText = $rootScope.defaultData.forms.participatedText;
            } else {
                $scope.participatedText = $rootScope.data.forms.participatedText;
            }

            $scope.$watch("participatedText", function (newValue, oldValue) {
                $rootScope.data.forms.participatedText = newValue;
            });

            if ($rootScope.data.forms.uniqueField == undefined) {
                $scope.uniqueField = $rootScope.defaultData.forms.uniqueField;
            } else {
                $scope.uniqueField = $rootScope.data.forms.uniqueField;
            }

            $scope.$watch("uniqueField", function (newValue, oldValue) {
                $rootScope.data.forms.uniqueField = newValue;
            });

            $scope.addValueToUFields = function (val) {
                $scope.uniqueField = val;
            };

            $scope.fieldTypes = $rootScope.defaultData.forms.fieldTypes;

            $scope.showEditFieldBtn = false;
            $scope.responseText = [
                {
                    "deleteIcon": false,
                    text: ""
                },
                {
                    deleteIcon: false,
                    text: ""
                }
            ];

            $scope.suggestFormFields = [
                {"icon": "edit" , "name": "Email", "disableField": "true", "type": 2},
                {"icon": "tasks" , "name": "Société", "disableField": "true", "type": 1, "textMinChar": 0, "textMaxChar": 50},
                {"icon": "edit", "name": "Fonction", "disableField": "true", "type": 1, "textMinChar": 0, "textMaxChar": 50},
                {"icon": "calendar", "name": "Date de naissance", "disableField": "true", "type": 5},
                {"icon": "edit", "name": "Adresse", "disableField": "true", "type": 1, "textMinChar": 0, "textMaxChar": 50},
                {"icon": "edit", "name": "Code Postal", "disableField": "true", "type": 1, "textMinChar": 0, "textMaxChar": 50},
                {"icon": "edit", "name": "Ville", "disableField": "true", "type": 1, "textMinChar": 0, "textMaxChar": 50},
                {"icon": "calendar", "name": "Date", "disableField": "true", "type": 5}
            ];

            // INIT SLIDE UNIT
            $scope.fieldUnityTypes = ["Aucune","€","$","£","Autre"];

            //$scope.disableSwitch = true;
            $scope.switchDisableField = function (field) {
                var index = $scope.formFields.indexOf(field);
                $scope.formFields[index].disableField = $scope.formFields[index].switchBtn;
            };

            $scope.addFormField = function (item) {
                var ranNum = Math.random();
                var d = new Date();
                var id = d.getTime() + "" + Math.random();

                if (!item) {
                    $scope.formFields.push({"id": id,  "icon": "edit", "name": "Autre", "disableField": true, "type": 1});
                } else {
                   var newObject = jQuery.extend(true, {}, item);
                   newObject.id = id;
                   $scope.formFields.push(newObject);
               }
              
            };

            $scope.addPageDividerId = function (id) {
                if (_.contains($scope.pageDividerIds, id)) {
                    var index = $scope.pageDividerIds.indexOf(id);
                    $scope.pageDividerIds.splice(index, 1);
                } else {
                    $scope.pageDividerIds.push(id);
                }

                $rootScope.data.forms.pageDividerIds = $scope.pageDividerIds;

                return false;
            };

            $scope.changeFieldType = function (item) {
                if (item.tempType == "3" || item.tempType == "4" || item.tempType == "6") {
                    $scope.fieldResponseTextInit(item);
                }
            };

            $scope.addFieldResponse = function (tempResponse) {
                tempResponse.push({ "deleteIcon": true,  text: ""});
            };

            $scope.deleteFieldResponse = function(tempResponse, responseText) {
                var index = tempResponse.indexOf(responseText);
                tempResponse.splice(index, 1);
            };

            $scope.sortableFormFields = [];

            $scope.sortableOptions = {
                containment: '#sortableContainer',
                containerPositioning: 'relative',
                // additionalPlaceholderClass: "slider_img",
                orderChanged: function (event) {
                    var end = event.dest.index;
                    var start = event.source.index;
                    $scope.formFields.splice(end, 0, $scope.formFields.splice(start, 1)[0]);
                }
            };

            $scope.fieldResponseTextInit = function (item) {
                if (item.response === undefined) {
                    item.tempResponse = [{ "deleteIcon": false, text: ""} ,{deleteIcon: false, text :""}];
                } else {
                    item.tempResponse = [];
                    var count = 0;
                    var deleteIcon = false;

                    angular.forEach(item.response, function (itm) {
                        count++; 

                        if (count > 2) {
                            deleteIcon = true;
                        }

                        item.tempResponse.push({"deleteIcon": deleteIcon, "text": itm});
                    });
                }
            };

            $scope.inputNumberOnly = function (e) {
                /*var val =  $(e).val();

                val = val.replace(/[^0-9]/g, '');
                alert(val);

                return false;
                */
                // Allow: backspace, delete, tab, escape, enter and .
                /* if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                      // Allow: Ctrl+A
                     (e.keyCode == 65 && e.ctrlKey === true) ||
                      // Allow: Ctrl+C
                     (e.keyCode == 67 && e.ctrlKey === true) ||
                      // Allow: Ctrl+X
                     (e.keyCode == 88 && e.ctrlKey === true) ||
                      // Allow: home, end, left, right
                     (e.keyCode >= 35 && e.keyCode <= 39)) {
                          // let it happen, don't do anything
                          return;
                }
                // Ensure that it is a number and stop the keypress
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                    return false;
                }*/
            };

            $scope.defaultTextCharValue = function (itm, type) {
                if (type == "max") {
                    if (itm.textMaxChar == "") {
                        itm.textMaxChar = 50;
                    }
                } else {
                    if (itm.textMinChar == "") {
                        itm.textMinChar = 0;
                    }
                }
            };

            $scope.getNumber = function (num) {
                var range = [];

                for (var a = 1; a <= num; a++) {
                    range.push(a);
                }

                return range;   
            };

            $scope.inputSelected = function() {
                $scope.lastFocused = document.activeElement;
            };

            function getCaretPosition (oField) {
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

            $scope.insertText = function (text, item) {
                text = '$$[record]'+text+'$$';
                var input = $scope.lastFocused;
                if (input == undefined) {
                    input = document.getElementById("input_" + item.id);
                    input.value = input.value + text;
                    item.tempDefaultValue = input.value;
                    item.defaultValue = input.value;
                    item.value = input.value;
                } else {
                    var pos = getCaretPosition(input);
                    var front = input.value.substring(0, pos);
                    var back = input.value.substring(pos, input.value.length);
                    input.value = front + text + back;
                    item.tempDefaultValue = input.value;
                }
                $scope.lastFocused = undefined;
                $rootScope.data.forms.formFields.forEach(function(element) {
                    if (element.defaultValue != undefined) {
                        var changedElement = $rootScope.replaceText(element.defaultValue);
                        if (element.defaultValue != changedElement) {
                               // $("#changeThisValue_" + element.id)[0].value = changedElement;
                            // modif from v6
                            $("#changeThisValue_"+element.id).value = changedElement;                        }
                    }
                }, this);
            }

            $scope.showEditField = function (item) {
                //delete item.defaultValue ;

                if (item.textMinChar == undefined) {
                    item.textMinChar = 0;
                }
                
                if (item.textMaxChar == undefined) {
                    item.textMaxChar = 50;
                }

                if (item.lineNumber == undefined) {
                    item.lineNumber = 5;
                }

                if (item.sliderMax == undefined) {
                    item.sliderMax = 10;
                }

                if (item.sliderMin == undefined) {
                    item.sliderMin = 0;
                }

                if (item.sliderType == undefined) {
                    item.sliderType = 1;
                }

                if (item.sliderInterval == undefined) {
                    item.sliderInterval = 1;
                }

                if (item.timeMin == undefined) {
                    item.timeMin = "00:00";
                }

                if (item.timeMax == undefined) {
                    item.timeMax = "01:00";
                }

                if (item.jsonName == undefined) {
                    item.jsonName = "";
                }

                if (item.hourInterval == undefined) {
                    item.hourInterval = "15";
                }

                if (item.defaultValue == undefined) {
                    item.defaultValue = "";
                }

                if (item.sliderUnit == undefined) {
                    item.sliderUnit = "Aucune";
                }
                if(item.sliderUnitOtherVal == undefined){
                    item.sliderUnitOtherVal = "";
                }

                item.tempHourInterval = parseInt(item.hourInterval);
                item.tempJsonName = item.jsonName ;
                item.tempTimeMax = item.timeMax;
                item.tempTimeMin    = item.timeMin;

                item.tempSliderInterval = item.sliderInterval;
                item.tempSliderMin = item.sliderMin;
                item.tempSliderMax = item.sliderMax;
                item.tempSliderType = item.sliderType;

                item.tempLineNumber = item.lineNumber;

                item.tempName = item.name;
                item.tempType = item.type;
                item.tempUnit = item.sliderUnit;
                item.tempsliderUnitOtherVal = item.sliderUnitOtherVal;
                item.tempTextMinChar = item.textMinChar;
                item.tempTextMaxChar = item.textMaxChar;

                //item.tempDefaultValue = item.value;
                item.tempDefaultValue = item.defaultValue;

                $scope.fieldResponseTextInit(item);
                //item.showEditFieldBtn = !item.showEditFieldBtn ;
            };
            $scope.validateEditForm = function (item) {
                $rootScope.data.forms.formFields.forEach(function(element) {
                    if (element.defaultValue != undefined) {
                        var changedElement = $rootScope.replaceText(element.defaultValue);
                        if (element.defaultValue != changedElement) {
                            $("#changeThisValue_" + element.id).value = changedElement;
                        }
                    }
                }, this);
                $scope.lastFocused = undefined;
                delete item.defaultValue ;

                var is_valid = true;
                var err_message = "";
                var tempResponse = [];

                if (item.tempName.toString() == "") {
                    is_valid = false;
                    err_message += "<p>-Veuillez entrer un nom de champ valide.</p>";
                }

                if (item.tempType == "3" || item.tempType == "4" || item.tempType == "6") {
                    var keepGoing = true;

                    angular.forEach(item.tempResponse, function (itm) {
                        tempResponse.push(itm.text);

                        if (keepGoing) {
                            if (itm.text.toString() == "") {
                                is_valid = false;
                                err_message += "<p>-Veuillez entrer une réponse valide.</p>";
                                keepGoing = false;
                            }
                        }
                    });
                } else if(item.tempType == "1" || item.tempType == "7") {
                    if (isNumber(item.tempTextMinChar) && isNumber(item.tempTextMaxChar)) {
                        if ((parseInt(item.tempTextMinChar) > parseInt(item.tempTextMaxChar)) || item.tempTextMinChar.toString() == "" || item.tempTextMaxChar.toString() == "") {
                            is_valid = false;
                            err_message += "<p>-Veuillez entrer des valeurs correctes pour les champs minimum/maximum.</p>";
                        }
                    } else {
                        is_valid = false;
                        err_message += "<p>-Veuillez entrer des valeurs correctes pour les champs minimum/maximum.</p>";
                    }
                } else if(item.tempType == "10" ) {

                    if (item.tempUnit == "Autre") {
                        if(item.tempsliderUnitOtherVal == ""){
                            is_valid = false;
                            err_message += "<p>-Veuillez indiquer l'unité.</p>";
                        }else{
                            item.sliderUnitOtherVal = item.tempsliderUnitOtherVal;
                        }
                    }else{
                        item.tempsliderUnitOtherVal = item.sliderUnitOtherVal = "";
                        item.sliderUnit = item.tempUnit;
                    }



                    if (!isNumber(item.tempSliderInterval)) {
                        is_valid = false;
                        err_message += "<p>-Veuillez entrer un intervalle valide.</p>";
                    }

                    if (isNumber(item.tempSliderMin) && isNumber(item.tempSliderMax)) {
                        if ((parseInt(item.tempSliderMin) > parseInt(item.tempSliderMax)) || item.tempSliderMin.toString() == "" || item.tempSliderMax.toString() == "") {
                            is_valid = false;
                            err_message += "<p>-Veuillez entrer des valeurs correctes pour les champs minimum/maximum.</p>";
                        }
                    } else {
                        is_valid = false;
                        err_message += "<p>-Veuillez entrer des valeurs correctes pour les champs minimum/maximum.</p>";
                    }
                } else if (item.tempType == "9" ) {
                    if (item.tempTimeMin > item.tempTimeMax) {
                        is_valid = false;
                        err_message += "<p>-Veuillez entrer des valeurs correctes pour l'heure de début et de fin.</p>";
                    } 

                    if (!isNumber(item.tempHourInterval)) {
                        is_valid = false;
                        err_message += "<p>-Veuillez entrer des valeurs correctes pour les champs intervalle en minutes.</p>";
                    }
                }

                if (!is_valid) {
                    $modal.open({
                        templateUrl: 'components/templateComponent/alertModal.html',
                        controller: 'alertModalCtrl' ,
                        backdrop: "static",
                        keyboard: "false",
                        resolve: {
                            items: function () {
                                return {alertText: err_message, alertName: "Remarque"};
                            }
                        }
                    });
                } else {
                    delete item.defaultValue;

                    if (item.tempType == '1' || item.tempType == '7' || item.tempType == '8' || item.tempType == '2') {
                        item.value = item.tempDefaultValue;
                        item.defaultValue = item.tempDefaultValue;
                    }

                    item.timeMin = item.tempTimeMin;
                    item.timeMax = item.tempTimeMax;

                    item.textMinChar = item.tempTextMinChar;
                    item.textMaxChar = item.tempTextMaxChar;
                    item.lineNumber = item.tempLineNumber;


                    if (item.tempType == "10") {
                        item.sliderInterval = item.tempSliderInterval;
                        item.sliderMin = item.tempSliderMin;
                        item.sliderMax = item.tempSliderMax;
                        item.sliderType = item.tempSliderType;
                        item.sliderUnit = item.tempUnit;
                        item.sliderUnitOtherVal = item.tempsliderUnitOtherVal;
                    } else {
                        delete item.sliderInterval;
                        delete item.sliderMin;
                        delete item.sliderMax;
                        delete item.sliderType;
                        delete item.sliderUnit;
                        delete item.sliderUnitOtherVal
                        delete item.tempSliderInterval;
                        delete item.tempSliderMin;
                        delete item.tempSliderMax;
                        delete item.tempSliderType;
                        delete item.tempUnit;
                        delete item.tempsliderUnitOtherVal;
                    }

                    if (item.tempType != "9") {
                        delete item.hourInterval;
                    } else {
                        item.hourInterval = item.tempHourInterval;
                    }

                    item.name = item.tempName;
                    item.type = item.tempType;
                    item.jsonName = item.tempJsonName ;

                    if (item.type == "3" || item.type == "4" || item.type == "6") {
                        item.response = tempResponse;
                    } else {
                        delete item.response ;
                    }

                    delete item.tempTextMinChar;
                    delete item.tempTextMaxChar;
                    delete item.tempName;
                    delete item.tempType;
                    delete item.tempResponse;
                    delete item.tempJsonName;
                    delete item.tempDefaultValue;
                    delete item.tempHourInterval;
                    delete item.tempTimeMax;
                    delete item.tempTimeMin;
                    delete item.tempLineNumber;
                    delete item.tempInterval;

                    item.showEditFieldBtn = false;
                }
            };

            CKEDITOR.replace('thank-note', {height: 120});

            CKEDITOR.instances['thank-note'].on('instanceReady', function () {
                var editor = $('#cke_thank-note .cke_wysiwyg_div');
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');
            });

            var callStack = 0;
            CKEDITOR.instances['thank-note'].on('change', function (event) {
                var code = CKEDITOR.instances['thank-note'].getData();

                if (code == "<br>" || code == '') {
                    if (callStack === 0) {
                        callStack = 1;
                        code = '<p><span style="font-family: Verdana, sans-serif; font-size: 12px; line-height: normal; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);">Merci pour votre participation !&nbsp;</span></p>';
                        CKEDITOR.instances['thank-note'].setData(code, function () {callStack = 0;});
                    }
                } else {
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            $scope.thankNote = code;
                        });
                    } else {
                        $scope.thankNote = code;
                    }
                }
            });

            var defaultMandatoryErrorMessage = 'Merci de remplir le(s) champ(s) suivant(s) pour pouvoir valider l\'envoi du formulaire :<br/>';

            CKEDITOR.replace('mandatory-error-message', {height: 120});

            CKEDITOR.instances['mandatory-error-message'].on('instanceReady', function () {
                var editor = $('#cke_mandatory-error-message .cke_wysiwyg_div');
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');

                var code = CKEDITOR.instances['mandatory-error-message'].getData();
                if (code == '<br>' || code == '' || code == undefined) {
                    CKEDITOR.instances['mandatory-error-message'].setData(defaultMandatoryErrorMessage);
                }
            });

            var callStack2 = 0;
            CKEDITOR.instances['mandatory-error-message'].on('change', function (event) {
                var code = CKEDITOR.instances['mandatory-error-message'].getData();

                if (code == "<br>" || code == '' || code == undefined) {
                    if (callStack2 === 0) {
                        callStack2 = 1;
                        code = defaultMandatoryErrorMessage;
                        CKEDITOR.instances['mandatory-error-message'].setData(code, function () {callStack2 = 0;});
                    }
                } else {
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            $scope.mandatoryErrorMessage = code;
                        });
                    } else {
                        $scope.mandatoryErrorMessage = code;
                    }
                }
            });

            $scope.confirmDeleteModal = function (item) {
                var index = $scope.formFields.indexOf(item);
                var modalInstance = $modal.open({
                   templateUrl: 'components/formComponent/formConfirmDeleteModal.html',
                   controller: 'confirmDeleteModalCtrl',
                    backdrop: "static",
                    keyboard: "false",
                   size: index,
                   resolve: {
                        items: function () {
                            return $scope.formFields;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.formFields.splice(index, 1);
                }, function () {});
            };
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

    .controller('confirmDeleteModalCtrl', function ($scope, $modalInstance, items) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller('FormLayoutSettingsCtrl', ['$scope', '$rootScope', '$modal', function ($scope, $rootScope, $modal) {
        $scope.init = function () {
            $scope.colorsEditBtn = false;
            $scope.styleEditBtn = false;
            $scope.btnValidationEditBtn = false;

            $.post('../server/service/baseUrl.php', { session: $rootScope.clientid }, function (data) {
                $scope.linkForm = data.app + "form.html#/form/" + $rootScope.clientid + '/';
            }, 'json');

            if ($rootScope.data.forms.layouts == undefined || $rootScope.data.forms.layouts == "") {
                $scope.layouts = $rootScope.defaultData.forms.layouts;
                // $scope.layouts.mainPositionChoices = $rootScope.defaultData.forms.layouts.mainPositionChoices;
            } else {
                $scope.layouts = $rootScope.data.forms.layouts;
                //$scope.layouts.mainPositionChoices = $rootScope.defaultData.forms.layouts.mainPositionChoices;
            }

            if ($rootScope.data.forms.layouts.styles == undefined || $rootScope.data.forms.layouts.styles == "") {
                $scope.layouts.styles = $rootScope.defaultData.forms.layouts.styles;
            } else {
                $scope.layouts.styles = $rootScope.data.forms.layouts.styles;
            }

            $scope.$watch("layouts", function (newValue, oldValue) {
                $rootScope.data.forms.layouts = newValue;
                // $(".note-editable").css("background", $scope.layouts.colors.backgroundIntroduction);
                // $(".note-editable").css("color", $rootScope.data.options.colorSecondary);
            }, true);


            $('.color_background').colpick({
                color: $scope.layouts.colors.background.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.layouts.colors.background = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_background').colpickHide();
                }
            });

            if ($scope.layouts.colors.backgroundIntroduction != undefined) {
                $('.color_backgroundIntroduction').colpick({
                    color: $scope.layouts.colors.backgroundIntroduction.replace("#", ""),
                    onChange: function ($hsb, $hexa) {
                        $scope.$apply(function () {
                            $scope.layouts.colors.backgroundIntroduction = "#" + $hexa;
                        });
                    },
                    onSubmit: function (a, b, c) {
                        $('.color_backgroundIntroduction').colpickHide();
                    }
                });
            }

            if ($scope.layouts.colors.text != undefined) {
                $('.color_text').colpick({
                    color: $scope.layouts.colors.text.replace("#", ""),
                    onChange: function ($hsb, $hexa) {
                        $scope.$apply(function () {
                            $scope.layouts.colors.text = "#" + $hexa;
                        });
                    },
                    onSubmit: function (a, b, c) {
                        $('.color_text').colpickHide();
                    }
                });
            }

            if ($scope.layouts.colors.edgeTextField != undefined) {
                $('.color_border').colpick({
                    color: $scope.layouts.colors.edgeTextField.replace("#", ""),
                    onChange: function ($hsb, $hexa) {
                        $scope.$apply(function () {
                            $scope.layouts.colors.edgeTextField = "#" + $hexa;
                        });
                    },
                    onSubmit: function (a, b, c) {
                        $('.color_border').colpickHide();
                    }
                });
            }

            $('.color_bgField').colpick({
                color: $scope.layouts.colors.backgroundField.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.layouts.colors.backgroundField = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_bgField').colpickHide();
                }
            });

            $('.color_textField').colpick({
                color: $scope.layouts.colors.textField.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.layouts.colors.textField = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_textField').colpickHide();
                }
            });

            //button colors
            if ($scope.layouts.buttonValidation.colors.text != undefined) {
                $('.color_btnText').colpick({
                    color: $scope.layouts.buttonValidation.colors.text.replace("#", ""),
                    onChange: function ($hsb, $hexa) {
                        $scope.$apply(function(){
                            $scope.layouts.buttonValidation.colors.text = "#" + $hexa;
                        });
                    },
                    onSubmit: function (a, b, c) {
                        $('.color_btnText').colpickHide();
                    }
                });
            }

            $('.color_btnEdges').colpick({
                color: $scope.layouts.buttonValidation.colors.edges.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.layouts.buttonValidation.colors.edges = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_btnEdges').colpickHide();
                }
            });

            $('.color_btnBackground').colpick({
                color: $scope.layouts.buttonValidation.colors.background.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                       $scope.layouts.buttonValidation.colors.background = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_btnBackground').colpickHide();
                }
            });
            //end button colors

            $scope.layouts.mainPositionChoices = $rootScope.defaultData.forms.layouts.mainPositionChoices;
            $scope.formShowBox = false;

            if ($rootScope.data.forms.formShow == "true" ||  $rootScope.data.forms.formShow == true) {
                $scope.formShowBox = true ;
            }
            
            $scope.clickFormShowBox = function () {
                $scope.formShowBox = !$scope.formShowBox;
                $rootScope.data.forms.formShow = $scope.formShowBox;

                if (!$scope.formShowBox) {
                    var formLink = !!$rootScope.data.components.logo.formLink;

                    if (formLink) {
                        $rootScope.data.components.logo.alt = "";
                        $rootScope.data.components.logo.link = "";
                        $rootScope.data.components.logo.blank = false;
                        $rootScope.data.components.logo.formLink = false;
                    }

                    angular.forEach($rootScope.data.components.slider.imageList, function (img, key) {
                        var formLink = !!img.formLink;

                        if (formLink) {
                            img.alt = "";
                            img.link = "";
                            img.blank = false;
                            img.formLink = false;
                        }
                    });

                    $scope.layouts.position.subPosition = 5;
                }
            };

            if ($rootScope.data.forms.introduction == undefined) {
                $scope.introduction = $rootScope.defaultData.forms.introduction.replace(/&quot;/g,'');
                $scope.realIntroduction = $rootScope.replaceText($rootScope.defaultData.forms.introduction);
            } else {
                $scope.introduction = $rootScope.data.forms.introduction.replace(/&quot;/g,'');
                $scope.realIntroduction = $rootScope.replaceText($rootScope.data.forms.introduction);
            }

            $scope.$watch("introduction", function (newValue, oldValue) {
                $rootScope.data.forms.introduction = newValue;
                $rootScope.data.forms.realIntroduction = $rootScope.replaceText(newValue);
            });

            $scope.fontNames = [
                'Arial Bold', 'Arial Rounded Bold', 'Calibri', 'Century Gothic',  'Comic Sans MS',  'Courier New',
                'Helvetica', 'Helvetica Narrow', 'Helvetica Black', 'Helvetica Light', 'Impact', 'Neuropol',
                'Palatino Roman', 'Tahoma',  'Take Cover','Times New Roman', 'Verdana',
            ];

            var slider_first = $("input.textSizeSlider").slider({
                min: 12,
                max: 30,
                value: parseInt($scope.layouts.buttonValidation.textSize)
            }).on("change", function (e) {
                $scope.layouts.buttonValidation.textSize = parseInt(e.value.newValue);

                $rootScope.$apply(function () {
                    $scope.layouts.buttonValidation.textSize = parseInt(e.value.newValue);
                });
            }).data('slider_first');

            var slider_second = $("input.roundEdgesSlider").slider({
                min: 0,
                max: 16,
                value:  parseInt($scope.layouts.buttonValidation.roundEdgesSlider)
            }).on("change", function (e) {
                $scope.layouts.buttonValidation.roundEdgesSlider = parseInt(e.value.newValue);

                $rootScope.$apply(function () {
                    $scope.layouts.buttonValidation.roundEdgesSlider = parseInt(e.value.newValue);
                });
            }).data('slider_second');

            var slider_first = $("input.styleTextSizeSlider").slider({
                min: 12,
                max: 30,
                value: parseInt($scope.layouts.styles.textSize)
            }).on("change", function (e) {
                $scope.layouts.styles.textSize = parseInt(e.value.newValue);

                $rootScope.$apply(function () {
                    $scope.layouts.styles.textSize = parseInt(e.value.newValue);
                });
            }).data('slider_third');

            var myEditor = CKEDITOR.replace('form-introduction', {height: 120});

            CKEDITOR.instances['form-introduction'].on('instanceReady', function () {
                var editor = $('#cke_form-introduction .cke_wysiwyg_div');
                editor.css('backgroundColor', $scope.layouts.colors.backgroundIntroduction);
                editor.css('color', $rootScope.data.options.colorSecondary);
                editor.css('fontSize', '12px');
                editor.css('padding', '10px');

                $scope.$watch("layouts.colors.backgroundIntroduction", function (newValue) {
                    editor.css('backgroundColor', $scope.layouts.colors.backgroundIntroduction);
                });

                $rootScope.$watch("data.options.colorSecondary", function (newValue) {
                    editor.css('color', $rootScope.data.options.colorSecondary);
                });
            });

            CKEDITOR.instances['form-introduction'].on('change', function (event) {
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.introduction = CKEDITOR.instances['form-introduction'].getData();
                    });
                } else {
                    $scope.introduction = CKEDITOR.instances['form-introduction'].getData();
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