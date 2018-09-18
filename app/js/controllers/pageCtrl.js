'use strict';

/* Controllers */

angular.module('netMessage.page', ['ngRoute']).controller("pageCtrl", ['$rootScope', '$scope', '$http', '$timeout', '$location', function ($rootScope, $scope, $http, $timeout, $location) {
    $scope.currentTemplate = "1";
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

    $scope.$watch(function (newValue, oldValue) {
        getUrlParams();
    });

    var alreadyLoaded = false;

    $scope.$on("serviceReady", function () {
        if (alreadyLoaded === false && $rootScope.data.modeSettings.modeType === '2') {
            alreadyLoaded = true;

            $('head').append($rootScope.data.modeSettings.expert_header);
        }

        $scope.options = $rootScope.data.options;
        $rootScope.data.components.title.realText = $rootScope.data.components.title.text;
        // $rootScope.data.components.customcountdown.realEndDate = $rootScope.data.components.customcountdown.endDate;
        $rootScope.data.components.customcountdown.realEndDate = moment($rootScope.data.components.customcountdown.endDate).format('LLLL');
        $rootScope.data.components.customcountdown.realEventText = $rootScope.data.components.customcountdown.introduction.text;
        $rootScope.data.components.cgu.realText = $rootScope.data.components.cgu.text;
        $rootScope.data.forms.realIntroduction =  $rootScope.data.forms.introduction;
        $rootScope.data.components.text.realText = $rootScope.data.components.text.text;
        $rootScope.data.components.customcountdown.realTxtDay = $rootScope.data.components.customcountdown.nbreLabel.day;
        $rootScope.data.components.customcountdown.realTxtHour = $rootScope.data.components.customcountdown.nbreLabel.hour;
        $rootScope.data.components.customcountdown.realTxtMinute = $rootScope.data.components.customcountdown.nbreLabel.minute;
        $rootScope.data.components.customcountdown.realTxtSecond = $rootScope.data.components.customcountdown.nbreLabel.second;
        $rootScope.data.components.customcountdown.realTxtEndMessage = $rootScope.data.components.customcountdown.expiration.text;
        $rootScope.data.components.customcountdown.realTxtAgendaBtn = $rootScope.data.components.customcountdown.calagenda.btnText;		$rootScope.data.components.storetitles.realTxtStoresTitle   = replaceText($rootScope.data.components.storetitles.title);
        $rootScope.data.components.storetitles.realTxtStoresName    = replaceText($rootScope.data.components.storetitles.customStoreName);
        $rootScope.data.components.storetitles.realTxtStoresAdA     = replaceText($rootScope.data.components.storetitles.customStoreAddressa);
        $rootScope.data.components.storetitles.realTxtStoresAdB     = replaceText($rootScope.data.components.storetitles.customStoreAddressb);
        $rootScope.data.components.storetitles.realTxtStoresAdC     = replaceText($rootScope.data.components.storetitles.customStoreAddressc);
        $rootScope.data.components.storetitles.realTxtStoresPostC   = replaceText($rootScope.data.components.storetitles.customStorePostalCode);
        $rootScope.data.components.storetitles.realTxtStoresTown    = replaceText($rootScope.data.components.storetitles.customStoreTown);
        $rootScope.data.components.storetitles.realTxtStoresOpenHour= replaceText($rootScope.data.components.storetitles.customStoreOpenHour);
        $rootScope.data.components.storetitles.realTxtStoresLat     = replaceText($rootScope.data.components.storetitles.customStoreLatitude);
        $rootScope.data.components.storetitles.realTxtStoresLong    = replaceText($rootScope.data.components.storetitles.customStoreLongitude); 		$rootScope.data.components.barcode.realText = $rootScope.data.components.barcode.titre.text;
        $rootScope.data.components.barcode.realTxtPersonalise = $rootScope.replaceText($rootScope.data.components.barcode.defaultValue);        $http.get('../server/files/'+$scope.clientId+'/order.json').success(function (data) {
            var i = 1;
            console.log(data);
            data.forEach(function(element) {
                $('#row'+i).after($('#'+element));
                i++;
            }, this);
        });
    });

    $http.get('../server/files/'+$scope.clientId+'/settings.json').success(function (data) {
        if (data.template) {
            $scope.currentTemplate = data.template.id;
        } else {
            $scope.currentTemplate = $scope.clientId;
        }
    });

    function getUrlParams () {
        var url = $location.path();
        var urlArray = url.split("/");

        $scope.clientId = urlArray[2];
    }

    /*
     WATCH URL FOR MODIFICATIONS, SETTINGS, TEMPLATE
     */
    $scope.$watch(function () {
        getUrlParams();
    });
}]);
