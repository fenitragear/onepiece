'use strict';

angular.module('netMessage.videoSettings', ['ngRoute'])
.controller('VideoSettingsCtrl', ['$scope', '$rootScope', '$timeout', '$modal', '$location', function ($scope, $rootScope, $timeout, $modal, $location) {
    $scope.init = function () {
        $scope.src = $rootScope.data.components.video.src;
        $scope.displayed = $rootScope.data.components.video.displayed;
        $scope.autoplay = $rootScope.data.components.video.autoplay;
        $scope.loop = $rootScope.data.components.video.loop;

        $scope.$watch("src", function (newValue, oldValue) {
			if (newValue != ''){
				if (newValue.startsWith('http')){
					if (newValue.startsWith('http:')){
						$rootScope.data.components.video.src = newValue.replace('http:', 'https:');
					}
					else {
						$rootScope.data.components.video.src = newValue;
					}
				}
				else {
					$rootScope.data.components.video.src = 'https://' + newValue;
				}
			}
			else {
				$rootScope.data.components.video.src = '';
			}
        });

        $scope.$watch("displayed", function (newValue){
            $rootScope.data.components.video.displayed = newValue;
        });

        $scope.$watch("autoplay", function (newValue){
            $rootScope.data.components.video.autoplay = newValue;
        });

        $scope.$watch("loop", function (newValue){
            $rootScope.data.components.video.loop = newValue;
        });
    }

    if (!$rootScope.data) {
        $scope.$on("serviceReady", function () {
            $scope.$apply(function () {
                $scope.init();
            });
        });
    } else {
        $scope.init();
    }
}]);