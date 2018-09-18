'use strict';

myApp.directive('netlogo', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/logoComponent/logoComponent.html',
        controller: function ($scope, $attrs, $rootScope) {
            $scope.DEFAULT_IMAGE = 'img/votre-logo-ici.png';
            $rootScope.$watch("data.components.logo.size", function (newValue) {
                if (newValue == undefined && $scope.settings != undefined) {
                    $scope.settings.size = $rootScope.defaultData.components.logo.size;
                }
            });

            $scope.$watch("settings.src", function (newValue) {
                $scope.hasImage = $scope.settings != undefined && newValue != "";
            });

            $scope.openLink = function () {
                if ($scope.settings.link != undefined && $scope.settings.link.length > 0 && !$rootScope.editMode) {
                    if ($scope.settings.link.indexOf("http") !== 0) {
                        $scope.settings.link = "http://" + $scope.settings.link;
                    }

                    if ($scope.settings.blank == true) {
                        window.open($scope.settings.link);
                    } else {
                        window.location = $scope.settings.link;
                    }
                }
            }
        }
    }
});
