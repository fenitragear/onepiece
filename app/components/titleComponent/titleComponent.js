'use strict';

myApp.directive('nettitle', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/titleComponent/titleComponent.html',
        controller: function ($scope, $attrs) {
            $scope.$watch("settings.text", function (newValue) {
                if (newValue != undefined) {
                    $scope.textLength = $scope.settings.text.length;
                }
            });
        }
    }
});
