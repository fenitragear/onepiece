'use strict';

myApp.directive('nettext', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/textComponent/textComponent.html',
        controller: function ($scope, $attrs) {
        }
    }
});