'use strict';

myApp.directive('netshake', ['$rootScope', '$timeout', '$http', function ($rootScope, $timeout, $http) {
    return {
        restrict: 'E',
        scope: {
            settings : '=',
			editmode : '='
        },
        templateUrl: 'components/shakeComponent/shakeComponent.html',
        compile: function($scope, element, attrs){
            function getShakeBG(){
				var chosenImage = -1;
				var returnBG = '';
				if (angular.isDefined($rootScope.data.components.shake)){
                        if ($rootScope.data.components.shake.image != undefined && $rootScope.data.components.shake.image.length > 1){
							returnBG = $rootScope.data.components.shake.image[1].src;
						}
				}
				else {
					returnBG = '../server/service/shake/black.png';
				}
				
				return returnBG;
            }
            function getShakeFG(){
				var returnFG = '';
				if (angular.isDefined($rootScope.data.components.shake)){
                        if ($rootScope.data.components.shake.image != undefined && $rootScope.data.components.shake.image.length > 1){
                            returnFG = $rootScope.data.components.shake.image[0].src;
                            
						}
				}
				else {
					returnFG =  '../server/service/shake/image_a_secouer_default.png';
                }
				$scope.FG = returnFG;
				return returnFG;
            }
            function fireShakeChange(newValue, oldValue) {
                setCallback();
                $timeout(function(){ 
                    var img = new Image();
                    img.onload = function(){
                        var height = img.height;
                        var width = img.width;
                        var newHeight = ($('netshake').width() / width) * height;
                        $('#shake2').height(newHeight);
                        $('#shake2').width($('netshake').width());
                        setTimeout(function(){
                                var overlayImage = 'url(' + img.src + ')';
                                $('#shakeRemoveOverlay').attr('src', img.src);	
                                $('#shake2').attr('src', img.src);
                        }, 100);
                    }
                    img.src = getShakeFG();
                })
            }

            (function() { 
                var shakeEvent = new Shake({threshold: 5});
                shakeEvent.start();
                function onshake() {
                    callShakeCallback();
                    var img = new Image();
                    img.onload = function(){
                        var height = img.height; 
                        var width = img.width;
                        var newHeight = ($('netshake').width() / width) * height;
                        $('#shake2').height(newHeight);
                        $('#shake2').width($('netshake').width());

                        setTimeout(function(){
                            $('#shakeRemoveOverlay').attr('src', img.src);	
                            $('#shake2').attr('src', img.src);
                            var url = $rootScope.data.components.shake.link;
                            if (url != '') {
                                if (url.indexOf("http") !== 0) {
                                    url = "http://" + url;
                                }

                                $('#shake2').on("click", function()
                                {
                                    if($rootScope.data.components.shake.openNewWindow.toString()=="true"){
                                        window.open(url);
                                    }else{
                                        window.location = url;
                                    }
                                });	
                            }
                        }, 100);
                    }
                    img.src = getShakeBG();

                    track('home_shake');

                    window.removeEventListener('shake', onshake, false);
                    shakeEvent.stop();
                    
                }
                window.addEventListener('shake', onshake, false);
            
                if(!window.ondevicemotion) {
                    console.error("Device motion not supported");
                } 
            })();

            function setCallback(){
				if (angular.isDefined($rootScope.data)){
                    function callbackFunc(element) {
						
						if (!$scope.callBackAlreadyCalled){
							var xmlHttp = new XMLHttpRequest();
							xmlHttp.open("GET", $rootScope.data.components.shake.finShakeCallback, true);
							xmlHttp.send(null);
                            console.log('setShakeCallback');
                            /*var xhrz = new XMLHttpRequest();
                            var formDataz = new FormData();
                            formDataz.append("response", "setcallback/");
                            xhrz.open('post', "../server/service/postShakeCall.php");
                            xhrz.send(formDataz);*/
							$scope.callBackAlreadyCalled = true;
						}
                    }
					window.callback = callbackFunc;
				}
				else {
                    function callbackFunc(element) {
                        element.container.clean();
                    }
					window.callback = callbackFunc;
				}				
            }

            function callShakeCallback(){
				if (!$scope.callBackAlreadyCalled){
					$scope.callBackAlreadyCalled = true;
                    $http({
                        method: 'GET',
                        url: $rootScope.data.components.shake.finShakeCallback
                      }).then(function successCallback(response) {
                            /*var xhrz = new XMLHttpRequest();
                            var formDataz = new FormData();
                            formDataz.append("response", "/success");
                            xhrz.open('post', "../server/service/postShakeCall.php");
                            xhrz.send(formDataz);*/
                            console.log("success callback");
                        }, function errorCallback(response) {
                            /*var xhrz = new XMLHttpRequest();
                            var formDataz = new FormData();
                            formDataz.append("response", "/error");
                            xhrz.open('post', "../server/service/postShakeCall.php");
                            xhrz.send(formDataz);*/
                            console.log("error callback");
                        });
				}			
            }
            
            return {
                pre: function(scope, element, attributes, controller, transcludeFn){
                    
                },
                post: function(scope, element, attributes, controller, transcludeFn){
                    if (!$rootScope.data) {
                        scope.$on("serviceReady",function () {
                            scope.$apply(function () {
                                init();
                            });
                        });
                    } else {
                        init();
                    }
        
                    function init ()  {
                        scope.FG = $rootScope.data.components.shake.image[0].src;
                        scope.callBackAlreadyCalled = false;
                        
                        $timeout(function(){ 
                            setCallback();
                            var img = new Image();
                            img.onload = function(){
                                var height = img.height;
                                var width = img.width;
                                var newHeight = ($('netshake').width() / width) * height;
                                $('#shake2').height(newHeight);
                                $('#shake2').width($('netshake').width());
								setTimeout(function(){
										var overlayImage = 'url(' + img.src + ')';
										$('#shakeRemoveOverlay').attr('src', img.src);	
                                        $('#shake2').attr('src', img.src);
								}, 100);
                            }
                            img.src = getShakeFG();
                            
                        });
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.shake.image;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireShakeChange(newValue, oldValue);
                                    $scope.FG = newValue;
                                }
                            },
                            true
                        );
                    }
                }
            }
        },
        link: function($scope, element, attrs){
            $scope.$on("serviceReady",function () {
                
            });
        },
        controller: function ($scope, $attrs, $rootScope, $timeout) {
            window.counting = function (p) {

            }
        }
    }
}]);
