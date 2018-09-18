'use strict';

myApp.directive('netcountdown',['$window', '$rootScope','$timeout','$location','$interval',function ($window, $rootScope, $timeout, $location,$interval) {
    return {
        restrict: 'E',
        scope: {
            settings: '=',
            editmode: '='
        },
        templateUrl: 'components/customcountdownComponent/customcountdownComponent.html',
        controller: function ($scope, $attrs) {
            var launch = moment().add(1, 'days');
            var timerloop;
           
            // $scope.showDefaultCtSettings = $rootScope.ctDefaultViewDisplay;
            // Call for Countdown service
            ctclocks(launch);
            // if ($rootScope.data && $rootScope.data.components !== undefined && $rootScope.data.components.customcountdown !== undefined && $rootScope.data.components.customcountdown.endDate !== undefined) {
                $rootScope.$watch("data.components.customcountdown.endDate", function (newValue) {
                    if ($rootScope.data && $rootScope.data.components !== undefined && $rootScope.data.components.customcountdown !== undefined && $rootScope.data.components.customcountdown.endDate !== undefined) {
                            $rootScope.data.components.customcountdown.endDate = newValue;
                        if(moment($rootScope.data.components.customcountdown.endDate).isValid()){
                            launch = moment($rootScope.data.components.customcountdown.endDate);
                        }
                        // if($rootScope.data.components.customcountdown.endDate != "")
                        ctclocks(launch);
                    }
                });
            // }
            $scope.countdownOpenLink = function(){
                var editmode = $scope.editmode.toString();
                if(editmode !== 'true'){
                    if($scope.settings.counter.url !== undefined || $scope.settings.counter.url !== "" ){
                        var url = $scope.settings.counter.url;
                        url = url.replace(/(^\w+:|^)\/\//, '');
                        var prefix = 'http://';
                        if(url.indexOf(prefix) === -1){
                            url = prefix + url;
                        }
                        $window.open(url, $scope.settings.counter.newWindow.toString() == 'true' ? '_blank': '_self');
                    }
                }
            }

            function ctclocks(launch) {
                $scope.device = "";
                if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
                    $scope.device = "iphone_";
                }
                var aurl = $location.path();
                var urlArray = aurl.split("/");
                var clientId = urlArray[3];
                if (!$rootScope.editMode) {
                    clientId = urlArray[2];
                }
                $scope.cId = clientId;

                var x = $interval(function() {
                    if ($rootScope.data && $rootScope.data.components !== undefined && $rootScope.data.components.customcountdown !== undefined && $rootScope.data.components.customcountdown.endDate !== undefined) {
                        if(moment($rootScope.data.components.customcountdown.endDate).isValid()){
                            launch = moment($rootScope.data.components.customcountdown.endDate);
                        }
                    }
                    var countDownDate = launch;
                    // Get todays date and time
                    var now = new Date().getTime();
                    // Find the distance between now an the count down date
                    var distance = countDownDate - now;
                    if (distance < 0) {
                        $interval.cancel(x);
                        $rootScope.data.components.customcountdown.expiration.displayed = false;
                        // $rootScope.data.components.customcountdown.expiration.preview = false;
                        // $rootScope.editMode
                        $rootScope.data.components.customcountdown.expiration.trueDisplay = true;
                        $rootScope.data.components.customcountdown.expiration.preview = true;
                    }else{
                        // Time calculations for days, hours, minutes and seconds
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                        // Display the result
                        if(days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0){
                            $scope.NbrTxtDay = pad(days, 2);
                            $scope.NbrTxtHour = pad(hours, 2);
                            $scope.NbrTxtMin = pad(minutes, 2);
                            $scope.NbrTxtSec = pad(seconds, 2);
                        }
                    }
                }, 1000,0,true,launch);
                var pad = function(num, size) {
                    var s = num + "";
                    while (s.length < size) s = "0" + s;
                    return s;
                }
            }
        }
    }
}]);