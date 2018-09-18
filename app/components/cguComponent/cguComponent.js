'use strict';

myApp.directive('netcgu', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/cguComponent/cguComponent.html',
        controller: function ($scope, $attrs) {

        }
    }
});