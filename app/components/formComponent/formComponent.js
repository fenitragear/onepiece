'use strict';

myApp.directive('netform', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/formComponent/formComponent.html',
        controller: function ($scope, $attrs, $location, $http, $modal, $window, $rootScope) {
            //$('p').removeClass('red').addClass('green');

            $scope.dateOptions = { format: 'mm/dd/yyyy', weekStart: 1 }
            $scope.divIntroduction = true;

            $scope.$watch("settings.introduction", function (newValue, oldValue) {
                $scope.divIntroduction = true;

                newValue = $.trim($("<div />").html(newValue).text());

                if (newValue == "") {
                    $scope.divIntroduction = false;
                }
            });

            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }

            function validateTelephone(telephone) {
                var re = /^\d{10,999}$/;
                return re.test(telephone);
            }

            function paginate() {
                $scope.prevButton = false;
                $scope.nextButton = false;
                $scope.validateButton = false;

                var pageNumber = $scope.page;
                var pd = [];

                if ($scope.settings != undefined) {
                    if ($scope.settings.pageDividerIds != undefined) {
                        pd = $scope.settings.pageDividerIds;
                    }
                } else {
                    if ($rootScope.data === undefined) {
                        return false;
                    }

                    $scope.settings = $rootScope.data.forms;
                }

                $scope.total_page = pd.length + 1;

                if (pd.length >= 0) {
                    var formFields = [];
                    var insert = true;
                    var count = 0;

                    $scope.formFields = [];

                    angular.forEach($scope.settings.formFields, function (item, key) {
                        if (item.disableField.toString() == 'true') {
                            //  item.value="";
                            if (insert) {
                                formFields.push(item.id);
                            }

                            if (pd.indexOf(item.id) >= 0) {
                                count++;

                                if (pageNumber == count) {
                                    $scope.formFields = formFields;
                                    insert = false;

                                    if ($scope.settings.formFields.indexOf(item) != ($scope.settings.formFields.length - 1)) {
                                        $scope.nextButton = true;
                                    }

                                    if ($scope.page > 1) {
                                        $scope.prevButton = true;
                                    }

                                    if ($scope.formFields[$scope.formFields.length - 1] == $scope.settings.formFields[$scope.settings.formFields.length - 1].id) {
                                        //$scope.prevButton = true;
                                        $scope.nextButton = false;
                                        $scope.validateButton = true;
                                    }
                                } else {
                                    formFields = [];
                                }
                            }
                        }
                    });

                    if ($scope.formFields.length <= 0 && pd.indexOf($scope.settings.formFields[$scope.settings.formFields.length - 1]) < 0) {
                        $scope.formFields = formFields;
                        $scope.validateButton = true;

                        if ($scope.page > 1) {
                            $scope.prevButton = true;
                        }
                    }
                }
            }

            $scope.prevButton = false;
            $scope.nextButton = false;
            $scope.validateButton = true;
            $scope.page = 1;

            $scope.prevPage = function () {
                $scope.clicPrevPage = true;
                $scope.clicNextPage = false;
                $scope.page = $scope.page - 1;
                paginate();

            };

            $scope.nextPage = function () {
                $scope.clicPrevPage = false;
                $scope.clicNextPage = true;
                $scope.page = $scope.page + 1;
                paginate();

            };

            $scope.addSelectedCheckbox = function (item, response) {
                var index = $scope.settings.formFields.indexOf(item);

                $scope.settings.formFields[index];

                if ($scope.settings.formFields[index].value == undefined) {
                    $scope.settings.formFields[index].value = [];
                }

                if (0 > $scope.settings.formFields[index].value.indexOf(response)) {
                    $scope.settings.formFields[index].value.push(response)
                } else {
                    $scope.settings.formFields[index].value.splice($scope.settings.formFields[index].value.indexOf(response), 1)
                }
            }

            $scope.saveForm = function () {
                var formData = [];
                var _data = [];
                var mandatoryErrorMessage = "";
                var errorMessage = "";
                var isValid = true;
                var limitSwitch = false;

                if ($scope.settings.limitSwitch == "true" || $scope.settings.limitSwitch == true) {
                    $scope.settings.limitSwitch = true;
                }

                if ($scope.settings.mandatoryErrorMessage === undefined || $scope.settings.mandatoryErrorMessage === '' || $scope.settings.mandatoryErrorMessage === '<br>') {
                    $scope.settings.mandatoryErrorMessage = "Merci de remplir le(s) champ(s) suivant(s) pour pouvoir valider l'envoi du formulaire :<br/>";
                }

                /*
                if($scope.settings.limitSwitch == ("true" || true)) {
                    $scope.settings.limitSwitch = true;
                }
                */

                angular.forEach($scope.settings.formFields, function (item, key) {
                    if (item.disableField == 'true') {
                        if ($scope.settings.uniqueField != undefined && $scope.settings.uniqueField != "") {
                            if ($scope.settings.limitSwitch && $scope.settings.uniqueField.indexOf(item.id) >= 0) {
                                limitSwitch = true;
                                formData.push({ name: item.name, id: item.id, value: item.value });
                            }
                        }

                        var _isValid = true;
                        item.titleColor = $scope.settings.layouts.colors.text;

                        if (item.isRequired.toString() == "true" && (item.value == undefined || $.trim(item.value.toString()) == "")) {
                            _isValid = false;

                            if (mandatoryErrorMessage == "") {
                                mandatoryErrorMessage += $scope.settings.mandatoryErrorMessage;
                            }

                            mandatoryErrorMessage += "-<strong>" + item.name + "</strong><br/>";
                        }

                        //text = 1 , zone de text = 7
                        if ((item.type == "1" || item.type == "7") && item.value != undefined) {
                            if (item.value.length > 0 && (item.value.length < item.textMinChar || item.value.length > item.textMaxChar)) {
                                _isValid = false;
                                errorMessage += "Le champ <strong>" + item.name + "</strong> doit contenir entre " + item.textMinChar + " et " + item.textMaxChar + " caractères.<br/>";
                            }
                        }

                        if (item.type == "2" && item.value != undefined) {
                            if (item.value.length > 0 && !validateEmail(item.value)) {
                                _isValid = false;
                                errorMessage += "Le champ <strong>" + item.name + "</strong> doit contenir une adresse email .<br/>";
                            }
                        }

                        if (item.type == "8" && item.value != undefined) {
                            if (item.value.length > 0) {
                                var phoneChar = item.value;
                                var phoneValid = true;

                                if (item.value.length > 0 && (phoneChar.charAt(0) == "+" || phoneChar.charAt(0) == "0")) {
                                    phoneChar = phoneChar.replace("+", "0");

                                    if (!validateTelephone(phoneChar)) {
                                        phoneValid = false;
                                    }
                                } else {
                                    phoneValid = false;
                                }

                                if (!phoneValid) {
                                    _isValid = false;
                                    errorMessage += "Le champ <strong>" + item.name + "</strong> doit contenir un numéro de téléphone.<br/>";
                                }
                            }
                        }


                        if (!_isValid) {
                            isValid = false;
                            item.titleColor = "red";
                        }

                        var obj = {};
                        obj.value = item.value;
                        obj.id = item.id;
                        obj.name = item.name;

                        if (item.jsonName != undefined) {
                            if (item.jsonName != "") {
                                obj.name = item.jsonName;
                            }
                        }

                        _data.push(obj);
                    } else {
                        var obj = {};
                        obj.value = item.value;
                        obj.id = item.id;
                        obj.name = item.name;

                        if (item.jsonName != undefined) {
                            if (item.jsonName != "") {
                                obj.name = item.jsonName;
                            }
                        }
                        _data.push(obj);
                    }

                    if (item.type == "10") {

                        // item.value = item.value + "test";
                        var objs = {};
                        var slideVa = parseInt(item.value);
                        // item.value = parseInt(item.value);
                        if (item.value) {
                            if (item.sliderUnit != undefined && item.sliderUnit == "Autre" && item.sliderUnitOtherVal != "") {
                                // objs.value = slideVa + item.sliderUnitOtherVal;
                                item.value = slideVa + item.sliderUnitOtherVal;
                            } else {
                                // objs.value = slideVa + item.sliderUnit;
                                item.value = slideVa + item.sliderUnit;
                            }
                        }
                        /*objs.id = item.id;
                        objs.name = item.name;
                          _data.push(objs);*/

                    }
                });

                if (isValid) {
                    var url = $location.path();
                    var urlArray = url.split("/");
                    var clientid = urlArray[3];

                    if (!$rootScope.editMode) {
                        clientid = urlArray[2];
                    }

                    $http({
                        url: '../server/files/' + clientid + '/config.json',
                        method: "GET",
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function (config) {
                        var data = $.param({
                            session: clientid,
                            content: _data,
                            limit: limitSwitch,
                            formData: formData,
                            formDataSubmitUrl: config.formDataSubmitUrl,
                        });

                        var phpFormURL = '../server/service/postFormData.php';

                        if (config.hasPhp == false) {
                            phpFormURL = config.phpFormURL;
                        }

                         $http({
                             url: phpFormURL,
                             method: "POST",
                             data: data,
                             headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                         }).success(function (data) {
                             var thankNote = $scope.settings.thankNote;
                             thankNote = $.trim($("<div />").html(thankNote).text());
 
                             if (thankNote == "") {
                                 thankNote = "Merci pour votre participation !";
                             } else {
                                 thankNote = $scope.settings.thankNote;
                             }
 
                             if (data.isValid == true) {
                                 $modal.open({
                                     templateUrl: 'components/templateComponent/alertModal.html',
                                     controller: 'alertModalCtrl',
                                     resolve: {
                                         items: function () {
                                             return {alertText: thankNote, alertName: ""};
                                         }
                                     }
                                 });
                             } else {
                                 var partMessge = "<p>Vous avez déjà répondu à cette enquête.</p> <p>Merci pour votre participation.</p>";
 
                                 if ($scope.settings.participatedText != "") {
                                     partMessge = $scope.settings.participatedText;
                                 }
 
                                 $modal.open({
                                     templateUrl: 'components/templateComponent/alertModal.html',
                                     controller: 'alertModalCtrl' ,
                                     resolve: {
                                         items: function () {
                                             return {alertText: partMessge, alertName: ""};
                                         }
                                     }
                                 });
                             }
                         });
                    });
                } else {
                    var warningMessage = "";

                    if (mandatoryErrorMessage != "") {
                        warningMessage += mandatoryErrorMessage;
                        warningMessage += "<br/>";
                    }

                    if (errorMessage != "") {
                        warningMessage += errorMessage;
                    }

                    $modal.open({
                        templateUrl: 'components/templateComponent/alertModal.html',
                        controller: 'alertModalCtrl',
                        backdrop: "static",
                        keyboard: "false",
                        resolve: {
                            items: function () {
                                return { alertText: warningMessage, alertName: "" };
                            }
                        }
                    });
                }
            }

            $scope.$watch("settings.layouts", function (newValue, oldValue) {
                if ($scope.settings !== undefined && $scope.settings.layouts != undefined) {
                    $('style.mod-checkbox').remove();
                    var style = '<style class="mod-checkbox">';

                    style += '.materialize-checkbox.filled-in:not(:checked) + label:after , .materialize-checkbox.filled-in:checked + label:after { ';
                    style += 'border: 2px solid ' + $scope.settings.layouts.colors.edgeTextField + '; ';
                    style += 'background-color: ' + $scope.settings.layouts.colors.backgroundField + '; }';
                    style += '.materialize-checkbox.filled-in:checked + label:before { ';
                    style += 'border-right: 2px solid ' + $scope.settings.layouts.colors.textField + '; ';
                    style += 'border-bottom: 2px solid ' + $scope.settings.layouts.colors.textField + '; }';

                    style += '.materialize-radio.with-gap:checked + label:before, .materialize-radio:not(:checked) + label:before { ';

                    style += 'border: 2px solid ' + $scope.settings.layouts.colors.edgeTextField + '; }';

                    style += '.materialize-radio.with-gap:checked + label:after { ';

                    style += 'background-color: ' + $scope.settings.layouts.colors.backgroundField + '; ';
                    style += 'border: 2px solid ' + $scope.settings.layouts.colors.edgeTextField + '; }';

                    style += '</style>';

                    $(style).appendTo('head');

                    $scope.settings.layouts.styles.fontWeight = 'normal';

                    if ($scope.settings.layouts.styles.bold.toString() == 'true') {
                        $scope.settings.layouts.styles.fontWeight = "bold";
                    }

                    $scope.settings.layouts.styles.fontStyle = 'normal';

                    if ($scope.settings.layouts.styles.italic.toString() == 'true') {
                        $scope.settings.layouts.styles.fontStyle = "italic";
                    }

                    $scope.settings.layouts.styles.textDecoration = 'normal';

                    if ($scope.settings.layouts.styles.underlined.toString() == 'true') {
                        $scope.settings.layouts.styles.textDecoration = "underline";
                    }

                    if ($scope.settings.layouts.position.subPosition != '1000') {
                        angular.forEach($scope.settings.formFields, function (item, key) {
                            item.titleColor = newValue;
                        });
                    }
                }
            }, 'true');

            $rootScope.$watch("data.forms.pageDividerIds", function (newValue) {
                $scope.prevButton = false;
                $scope.nextButton = false;
                $scope.validateButton = true;
                $scope.page = 1;

                paginate();
            }, 'true');

            $scope.$watch("settings.formFields", function (newValue, oldValue) {
                var isRearrange = true;
                if ($rootScope.replaceText != undefined) {
                    // newValue.forEach(function(element) {
                    //     if (element.value != undefined) {
                    //         element.value = $rootScope.replaceText(element.value);
                    //     }
                    // }, this);
                    if (newValue != undefined) {
                        newValue.forEach(function (element) {
                            if (element.defaultValue != undefined) {
                                var changedElement = $rootScope.replaceText(element.defaultValue);
                                if (element.defaultValue != changedElement) {
                                    // $("#changeThisValue_" + element.id)[0].value = changedElement;
                                    // modif from v6
                                    $("#changeThisValue_"+element.id).value = changedElement;
                                }
                            }
                        }, this);
                    }
                }
                // $rootScope.data.forms.formFields.forEach(function(element) {
                //     if (element.defaultValue != undefined) {
                //         element.value = $rootScope.replaceText(element.defaultValue);
                //     }
                // }, this);

                if ((newValue !== undefined && oldValue === undefined) || (newValue !== undefined && oldValue !== undefined && newValue.length != oldValue.length)) {
                    $scope.prevButton = false;
                    $scope.nextButton = false;
                    $scope.validateButton = true;
                    $scope.page = 1;
                    paginate();
                }
            }, 'true');

            $scope.item = {
                value: 10
            }


            /*
            $rootScope.$watch("data.forms.formFields", function (newValue, oldValue) {
                var isRearrange = true

                //if (newValue.length != oldValue.length || isRearrange) {
                    $scope.prevButton = false;
                    $scope.nextButton = false;
                    $scope.validateButton = true;
                    $scope.page = 1;
                    paginate();
                //}
            });
            */

            /*
            $rootScope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
            */
        }
    }
});
