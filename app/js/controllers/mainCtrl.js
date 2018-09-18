'use strict';
/* Controllers */

myApp.controller("mainCtrl", ['$rootScope', '$scope', '$http', '$timeout', '$location', '$animate', '$modal', '$sce','$anchorScroll', function ($rootScope, $scope, $http, $timeout, $location, $animate, $modal, $sce, $anchorScroll) {
    $scope.idShown = false;
    getUrlParams();
    moment.locale('fr'); // 'fr'
    moment.updateLocale('fr', {
        longDateFormat : {
            LT: "à H:mm",
            LTS: "h:mm:ss A",
            L: "MM/DD",         // Remove year
            LL: "MMMM Do YYYY",
            LLL: "MMMM Do YYYY LT",
            LLLL: "dddd Do MMMM YYYY LT"
        }
    });

    $scope.countlogo = 0;
    $scope.countscratch = 0;
    $scope.countshake = 0;
    $scope.countstores = 0;
    $scope.customcountdown = 0;

    $("#toggleBtnModeSettings").removeClass("hide");

    function gotoSettings(){
		window.location.replace("settings.html#/" + $scope.currentTemplate + "/settings/" + $scope.clientId + "/");
    }    function getUrlParams() {
        var url = $location.path();
        var goodUrl = url.split("/app/");
        var urlArray = goodUrl[goodUrl.length - 1].split("/");
        $scope.currentTemplate = urlArray[1];
        $scope.currentUrl = urlArray[2];
        $scope.clientId = urlArray[3];
        $scope.clientIdValue = "*RSMS:" + $scope.clientId + "*";
        //Check identifiant
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
    
        formData.append("session", $scope.clientId);	
    
        xhr.onload = function () {
            var response = xhr.responseText.split('"')[1];
            if(response=="nok"){
                gotoSettings();    }
        };

        xhr.open('post', "../server/service/checkdir.php");
        xhr.send(formData);
    }

    $rootScope.previous = function () {
        var url = $rootScope.getCurrentSettingsURL();
        var index = $rootScope.navigationArray.indexOf(url);
        var nextIndex = index - 1;

        if (nextIndex < 0) {
            nextIndex = $rootScope.navigationArray.length - 1; //if negative navigation, we go at last item, loop style
        }

        $rootScope.changeURL($rootScope.navigationArray[nextIndex], "back", url);
    };

    $rootScope.editMode = true;

    $rootScope.next = function () {
        var url = $rootScope.getCurrentSettingsURL();
        var index = $rootScope.navigationArray.indexOf(url);
        var nextIndex = index + 1;

        if (nextIndex > $rootScope.navigationArray.length - 1) {
            nextIndex = 0; //if too much navigation, we go at first item, loop style
        }

        $rootScope.changeURL($rootScope.navigationArray[nextIndex], "forward", url);
    }

    $scope.buttonActive = function(component){
        $('#'+component).addClass('buttonActive');
    }

    $rootScope.changeURL = function (component, transitionClass, currentPosition) {
        var url = $location.path();
        var urlArray = url.split("/");
        var templateId = urlArray[1];
        var currentComponent = urlArray[2];
        var clientId = urlArray[3];

        var simpleList = document.getElementById('simpleList');
        if (currentPosition != undefined) {
            var draggableComponents = simpleList.getElementsByClassName("draggablecomponent");
            var draggablecomponentIds = ['options'];
            draggableComponents = Array.from(draggableComponents);
            draggableComponents.forEach(function (element) {
                if (element.id == 'discount') {
                    draggablecomponentIds.push('logo');
                    draggablecomponentIds.push('title');
                } else if (element.id != '') {
                    draggablecomponentIds.push(element.id);
                }
            }, this);
            $rootScope.navigationArray.forEach(function (element) {
                if (draggablecomponentIds.indexOf(element) == -1) {
                    draggablecomponentIds.push(element);
                }
            }, this);
            var i = draggablecomponentIds.indexOf(currentPosition);
            switch (transitionClass) {
                case 'back':
                    i = i - 1;
                    if (i == -1) {
                        i = (draggablecomponentIds.length - 1);
                    }
                    break;
                case 'forward':
                    i = i + 1;
                    i = i % draggablecomponentIds.length;
                    break;
            }
            component = draggablecomponentIds[i];
        }

        if (transitionClass != undefined) {
            $rootScope.transitionClass = transitionClass;
        } else if ($rootScope.navigationArray.indexOf(currentComponent) > $rootScope.navigationArray.indexOf(component)) {
            $rootScope.transitionClass = "back";
        } else {
            $rootScope.transitionClass = "forward";
        }

        if (component != currentComponent) {
            $location.path('/' + templateId + '/' + component + "/" + clientId);
            // Scroll to associated bloc
            var loc = component;
            if(component == 'logo' || component == 'options' || component == 'title'){
                loc = 'discount';
        }
            var newHash = loc;
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash(loc);
            } else {
                $anchorScroll();
    }
        }
    }

    $rootScope.navigationArray = [
        'options',
        'logo',
        'title',
        'scratch',
        'shake',
        'video',
        'slider',
        'text',
        'stores',
        'cgu',
        'form',
        'customcountdown',
        'barcode'
    ];

    $rootScope.getCurrentSettingsURL = function () {
        var url = $location.path();
        var urlArray = url.split("/");

        // that's url part ... ex : options || text || logo
        return urlArray[2];
    };

    if ($scope.clientId == undefined) {
        var clientId = 1;
    } else {
        var clientId = $scope.clientId;
    }

    $http({
        url: '../server/files/' + clientId + '/config.json',
        method: "GET"
    }).success(function (config) {
        var urlTag = config.tagUrl;
        $rootScope.tagUrl = urlTag;
        urlTag = urlTag.replace(new RegExp("\\[NREC\\]", 'g'), $rootScope.currentPage);
        urlTag = urlTag.replace(new RegExp("\\[OPEKEY\\]", 'g'), clientId);
        $http.get(urlTag).success(function (data) {
            $rootScope.tagOptions = data.record;
        });
    }).error(function () {
        $http.get('../server/service/default-config.json').success(function (config) {
            var urlTag = config.tagUrl;
            $rootScope.tagUrl = urlTag;
            urlTag = urlTag.replace(new RegExp("\\[NREC\\]", 'g'), $rootScope.currentPage);
            urlTag = urlTag.replace(new RegExp("\\[OPEKEY\\]", 'g'), clientId);
            $http.get(urlTag).success(function (data) {
                $rootScope.tagOptions = data.record;
            });
        });
    });

    function replaceText(originalText) {
        var realText = originalText;
        var regex;
        if ($rootScope.tagOptions != undefined) {
            $rootScope.tagOptions.forEach(function (element) {
                regex = new RegExp("\\$\\$\\[record\\]" + element.name + "\\$\\$", 'g');
                realText = realText.replace(regex, element.value);
            }, this);
        }
        return realText;
    }

    $rootScope.replaceText = replaceText;

    $scope.totalItems = 25;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 1;
    $rootScope.currentPage = $scope.currentPage;

    if ($rootScope.currentPage != undefined) {
        $scope.currentPage = $rootScope.currentPage;
    }

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function () {
        $http({
            url: '../server/files/' + $scope.clientId + '/config.json',
            method: "GET"
        }).success(function (config) {
            var urlTag = config.tagUrl.replace(new RegExp("\\[OPEKEY\\]", 'g'), $scope.clientId);
            urlTag = urlTag.replace(new RegExp("\\[NREC\\]", 'g'), $scope.currentPage);
            $http.get(urlTag).success(function (data) {
                if (data.errorCode == 0) {
                    $rootScope.tagOptions = data.record;
                    $rootScope.currentPage = $scope.currentPage;
                    $rootScope.data.components.text.realText = replaceText($rootScope.data.components.text.text);
                  /*  $rootScope.data.components.title.realText = replaceText($rootScope.data.components.title.text);*/
                    $rootScope.data.components.titre.realText = replaceText($rootScope.data.components.title.text);
                    // $rootScope.data.components.customcountdown.realEndDate = replaceText($rootScope.data.components.customcountdown.endDate);
                    $rootScope.data.components.customcountdown.realEndDate = moment($rootScope.data.components.customcountdown.endDate).format('LLLL');
                    $rootScope.data.components.customcountdown.realEventText = replaceText($rootScope.data.components.customcountdown.introduction.text);
                    $rootScope.data.components.customcountdown.realTxtDay = replaceText($rootScope.data.components.customcountdown.nbreLabel.day);
                    $rootScope.data.components.customcountdown.realTxtHour = replaceText($rootScope.data.components.customcountdown.nbreLabel.hour);
                    $rootScope.data.components.customcountdown.realTxtMinute = replaceText($rootScope.data.components.customcountdown.nbreLabel.minute);
                    $rootScope.data.components.customcountdown.realTxtSecond = replaceText($rootScope.data.components.customcountdown.nbreLabel.second);
                    $rootScope.data.components.customcountdown.realTxtEndMessage = replaceText($rootScope.data.components.customcountdown.expiration.text);
                    $rootScope.data.components.customcountdown.realTxtAgendaBtn = replaceText($rootScope.data.components.customcountdown.calagenda.btnText);
					$rootScope.data.components.barcode.realText = replaceText($rootScope.data.components.barcode.titre.text);
                    $rootScope.data.components.barcode.realTxtPersonalise = replaceText($rootScope.data.components.barcode.defaultValue);                    $rootScope.data.components.cgu.realText = replaceText($rootScope.data.components.cgu.text);
                    $rootScope.data.forms.realIntroduction = replaceText($rootScope.data.forms.introduction);
                    $rootScope.data.components.storetitles.realTxtStoresTitle   = replaceText($rootScope.data.components.storetitles.title);
                    $rootScope.data.components.storetitles.realTxtStoresName    = replaceText($rootScope.data.components.storetitles.customStoreName);
                    $rootScope.data.components.storetitles.realTxtStoresAdA     = replaceText($rootScope.data.components.storetitles.customStoreAddressa);
                    $rootScope.data.components.storetitles.realTxtStoresAdB     = replaceText($rootScope.data.components.storetitles.customStoreAddressb);
                    $rootScope.data.components.storetitles.realTxtStoresAdC     = replaceText($rootScope.data.components.storetitles.customStoreAddressc);
                    $rootScope.data.components.storetitles.realTxtStoresPostC   = replaceText($rootScope.data.components.storetitles.customStorePostalCode);
                    $rootScope.data.components.storetitles.realTxtStoresTown    = replaceText($rootScope.data.components.storetitles.customStoreTown);
                    $rootScope.data.components.storetitles.realTxtStoresOpenHour= replaceText($rootScope.data.components.storetitles.customStoreOpenHour);
                    $rootScope.data.components.storetitles.realTxtStoresLat     = replaceText($rootScope.data.components.storetitles.customStoreLatitude);
                    $rootScope.data.components.storetitles.realTxtStoresLong    = replaceText($rootScope.data.components.storetitles.customStoreLongitude);

                    $rootScope.data.forms.formFields.forEach(function (element) {
                        if (element.defaultValue != undefined) {
                            var changedElement = $rootScope.replaceText(element.defaultValue);
                            if (element.defaultValue != changedElement) {
                                // $("#changeThisValue_" + element.id)[0].value = changedElement;
                                // Modif from v6
                                $("#changeThisValue_"+element.id).value = changedElement;
                            }
                        }
                    }, this);
                } else {
                    $scope.totalItems = $scope.currentPage - 1;
                    $scope.currentPage--;
                }
                $("#fakeCurrentPage")[0].innerHTML = $rootScope.currentPage;
            });
        });
    };

    $scope.$on("serviceReady", function () {
        $scope.options = $rootScope.data.options;

        $http.get('../server/files/' + $scope.clientId + '/order.json').success(function (data) {
            var i = 1;
            data.forEach(function (element) {
                $('#row' + i).after($('#' + element));
                i++;
            }, this);
        });

        var simpleList = document.getElementById('simpleList');
        if (typeof (Sortable) == "function") {
            var sortable = Sortable.create(simpleList, {
                animation: 150,
                onUpdate: function (evt) {
                    var draggableComponents = simpleList.getElementsByClassName("draggablecomponent");
                    var draggablecomponentIds = [];
                    draggableComponents = Array.from(draggableComponents);
                    draggableComponents.forEach(function (element) {
                        draggablecomponentIds.push(element.id);
                    }, this);
                    var data = $.param({
                        session: $scope.clientId,
                        content: draggablecomponentIds
                    });
                    $.ajax({
                        type: "POST",
                        url: '../server/service/postOrderJSON.php',
                        data: data
                    });
                }
            });
        }
        $scope.pageChanged();
        $rootScope.data.components.text.realText = replaceText($rootScope.data.components.text.text);
        $rootScope.data.components.title.realText = replaceText($rootScope.data.components.title.text);
        // $rootScope.data.components.customcountdown.realEndDate = replaceText($rootScope.data.components.customcountdown.endDate);
        $rootScope.data.components.customcountdown.realEndDate = moment($rootScope.data.components.customcountdown.endDate).format('LLLL');
        $rootScope.data.components.customcountdown.realEventText = replaceText($rootScope.data.components.customcountdown.introduction.text);
        $rootScope.data.components.cgu.realText = replaceText($rootScope.data.components.cgu.text);
        $rootScope.data.components.customcountdown.realTxtDay = replaceText($rootScope.data.components.customcountdown.nbreLabel.day);
        $rootScope.data.components.customcountdown.realTxtHour = replaceText($rootScope.data.components.customcountdown.nbreLabel.hour);
        $rootScope.data.components.customcountdown.realTxtMinute = replaceText($rootScope.data.components.customcountdown.nbreLabel.minute);
        $rootScope.data.components.customcountdown.realTxtSecond = replaceText($rootScope.data.components.customcountdown.nbreLabel.second);
        $rootScope.data.components.customcountdown.realTxtEndMessage = replaceText($rootScope.data.components.customcountdown.expiration.text);
        $rootScope.data.components.customcountdown.realTxtAgendaBtn = replaceText($rootScope.data.components.customcountdown.calagenda.btnText);
        $rootScope.data.components.storetitles.realTxtStoresTitle   = replaceText($rootScope.data.components.storetitles.title);
        $rootScope.data.components.storetitles.realTxtStoresName    = replaceText($rootScope.data.components.storetitles.customStoreName);
        $rootScope.data.components.storetitles.realTxtStoresAdA     = replaceText($rootScope.data.components.storetitles.customStoreAddressa);
        $rootScope.data.components.storetitles.realTxtStoresAdB     = replaceText($rootScope.data.components.storetitles.customStoreAddressb);
        $rootScope.data.components.storetitles.realTxtStoresAdC     = replaceText($rootScope.data.components.storetitles.customStoreAddressc);
        $rootScope.data.components.storetitles.realTxtStoresPostC   = replaceText($rootScope.data.components.storetitles.customStorePostalCode);
        $rootScope.data.components.storetitles.realTxtStoresTown    = replaceText($rootScope.data.components.storetitles.customStoreTown);
        $rootScope.data.components.storetitles.realTxtStoresOpenHour= replaceText($rootScope.data.components.storetitles.customStoreOpenHour);
        $rootScope.data.components.storetitles.realTxtStoresLat     = replaceText($rootScope.data.components.storetitles.customStoreLatitude);
        $rootScope.data.components.storetitles.realTxtStoresLong    = replaceText($rootScope.data.components.storetitles.customStoreLongitude);
        $rootScope.data.forms.realIntroduction                      = replaceText($rootScope.data.forms.introduction);


		$rootScope.data.components.barcode.realText = replaceText($rootScope.data.components.barcode.titre.text);
        $rootScope.data.components.barcode.realTxtPersonalise = replaceText($rootScope.data.components.barcode.defaultValue); 		$rootScope.data.forms.realIntroduction = replaceText($rootScope.data.forms.introduction);        $rootScope.data.forms.formFields.forEach(function (element) {
            if (element.defaultValue != undefined) {
                var changedElement = $rootScope.replaceText(element.defaultValue);
                if (element.defaultValue != changedElement) {
                    $("#changeThisValue_" + element.id).value = changedElement;
                }
            }
        }, this);
        $("#fakeCurrentPage")[0].innerHTML = $rootScope.currentPage;

        //bandeau navigation
        $scope.displayedLogo = $rootScope.data.components.logo.displayed;
        $rootScope.$watch("data.components.logo.displayed", function (newValue) {
            $scope.displayedLogo= newValue;
    });

        $rootScope.$watch("data.components.title.displayed", function (newValue) {
            $scope.displayedTitle= newValue;
        });
        $scope.displayedTitle = $rootScope.data.components.title.displayed;

        $rootScope.$watch("data.components.slider.showSlider", function (newValue) {
            $scope.displayedSlider= newValue;
        });
        $scope.displayedSlider = $rootScope.data.components.slider.showSlider;

        $rootScope.$watch("data.components.customcountdown.displayed", function (newValue) {
            $scope.displayedcustom= newValue;
        });
        $scope.displayedcustom = $rootScope.data.components.customcountdown.displayed;

        $rootScope.$watch("data.components.scratch.showScratch", function (newValue) {
            $scope.displayedscratch= newValue;
        });
        $scope.displayedscratch = $rootScope.data.components.scratch.showScratch;

        $rootScope.$watch("data.components.shake.showShake", function (newValue) {
            $scope.displayedshake= newValue;
        });
        $scope.displayedshake = $rootScope.data.components.shake.showShake;

        $rootScope.$watch("data.components.video.displayed", function (newValue) {
            $scope.displayedvideo= newValue;
        });
        $scope.displayedvideo = $rootScope.data.components.video.displayed;

        $rootScope.$watch("data.components.text.displayed", function (newValue) {
            $scope.displayedtext1= newValue;
        });
        $scope.displayedtext1= $rootScope.data.components.text.displayed;

        $rootScope.$watch("data.components.storesDisplayed", function (newValue) {
            $scope.displayedstores= newValue;
        });
        $scope.displayedstores= $rootScope.data.components.storesDisplayed;
        
        $rootScope.$watch("data.components.cgu.displayed", function (newValue) {
            $scope.displayedtext2= newValue;
        });
        $scope.displayedtext2= $rootScope.data.components.cgu.displayed;

        $rootScope.$watch("data.forms.formShow", function (newValue) {
            $scope.displayedform= newValue;
        });
        $scope.displayedform= $rootScope.data.forms.formShow;
    });

    $scope.switchMode = function (modeType) {
        var component = '';

        if (modeType == 2) {
            var confirmMsg = 'Vous souhaitez accéder au "mode expert". <br/> <strong>Attention</strong> : cela vous est fortement déconseillé si vous ne maitrisez pas HTML, CSS et Javascript.';

            var confirmExpertMode = $modal.open({
                templateUrl: 'components/templateComponent/confirmModal.html',
                controller: 'confirmExpertModalCtrl',
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    items: function () {
                        return { confirmText: confirmMsg, confirmName: "Message d’information" };
                    }
                }
            });

            confirmExpertMode.result.then(function () {
                if ($rootScope.sourceCode === undefined || $rootScope.sourceCode === false || $rootScope.sourceCode === null || $rootScope.sourceCode === '') {
                    $rootScope.importSourceCode = true;
                }

                $rootScope.data.modeSettings.modeType = "2";
                component = 'expertMode';
                $location.path('/' + $scope.currentTemplate + '/' + component + "/" + $scope.clientId);
            }, function () { });
        } else {
            $rootScope.data.modeSettings.modeType = "1";
            component = 'options';
            $location.path('/' + $scope.currentTemplate + '/' + component + "/" + $scope.clientId);
        }
    }

    $scope.changeUrl = function (component) {
        $location.path('/' + $scope.currentTemplate + '/' + component + "/" + $scope.clientId);
        var newHash = component;
        if ($location.hash() !== newHash) {
            // set the $location.hash to `newHash` and
            // $anchorScroll will automatically scroll to it
            $location.hash(component);
        } else {
            $anchorScroll();
        }
    };

    /*
     WATCH URL FOR MODIFICATIONS, SETTINGS, TEMPLATE
     */
    $scope.$watch(
        function () {
            return $location.path();
        },
        function () {
            getUrlParams();
        }
    );

    $scope.showHideID = function () {
        $scope.idShown = !$scope.idShown;
    };

    

}]).controller('alertModalCtrl', function ($scope, $modalInstance, items) {
    $scope.alertName = items.alertName;
    $scope.alertText = items.alertText;

    $scope.ok = function () {
        $modalInstance.close();
    };
}).controller('confirmExpertModalCtrl', function ($scope, $modalInstance, items) {
    $scope.confirmName = items.confirmName;
    $scope.confirmText = items.confirmText;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
