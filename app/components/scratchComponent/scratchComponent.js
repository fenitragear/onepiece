'use strict';

myApp.directive('netscratch', ['$rootScope', '$timeout', '$http', function ($rootScope, $timeout, $http) {
    return {
        restrict: 'E',
        scope: {
            settings : '=',
			editmode : '='
        },
        templateUrl: 'components/scratchComponent/scratchComponent.html',
        compile: function($scope, element, attrs){
            function changeScratchUp() {
                document.getElementById('scratch2').innerHTML = "";
                var img = new Image();
                img.onload = function(){
                    var height = img.height;
                    var width = img.width;
                    var newHeight = ($('netscratch').width() / width) * height;
                    if ($('.settings_container').width() != null) {
                        $('#scratch2').height(newHeight);
                        $('#scratch2').width($('netscratch').width());
						$('#scratch2').wScratchPad({
							bg: getBG(),
							fg: img.src,
							size : getSize(),
							scratchMove: function (e, percent) {
								if (percent > getPercent()){
									callScratchCallback(this);
								}
							}
						});
                        setTimeout(function(){
                            $('canvas.scratchcard-Overlay').height(newHeight);
                            $('canvas.scratchcard-Overlay').width($('netscratch').width());
							$('#removeOverlay').attr('src', img.src);	
                        }, 100);
                    }
                }
                img.src = getFG();
            }
			
			function getFG(){
				if (angular.isDefined($rootScope.data.components.scratch)){
					if ($rootScope.data.components.scratch.selectedType == "simple"){
						if ($rootScope.data.components.scratch.imageSimpleList != undefined && $rootScope.data.components.scratch.imageSimpleList.length > 0){
							return $rootScope.data.components.scratch.imageSimpleList[0].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "gagnant_perdant"){
						if ($rootScope.data.components.scratch.imageGagnantPerdantList.length > 0){
							return $rootScope.data.components.scratch.imageGagnantPerdantList[0].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "dynamique_pourcent"){
						if ($rootScope.data.components.scratch.imageDynamiquePourcentList.length > 0){
							return $rootScope.data.components.scratch.imageDynamiquePourcentList[0].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "dynamique_nombre"){
						if ($rootScope.data.components.scratch.imageDynamiqueNombreList.length > 0){
							return $rootScope.data.components.scratch.imageDynamiqueNombreList[0].src;
						}
					}					
					else if ($rootScope.data.components.scratch.selectedType == "personnalise"){
						if ($rootScope.data.components.scratch.imagePersonnaliseList.length > 0){
							return $rootScope.data.components.scratch.imagePersonnaliseList[0].src;
						}
					}					
				}
				
				return '../server/service/scratch/image_a_gratter.png';
			}
			
			function getBG(){
				var chosenImage = -1;
				var returnBG = '';
				if (angular.isDefined($rootScope.data.components.scratch)){
					if ($rootScope.data.components.scratch.selectedType == "simple"){
                        if ($rootScope.data.components.scratch.imageSimpleList != undefined && $rootScope.data.components.scratch.imageSimpleList.length > 1){
							returnBG = $rootScope.data.components.scratch.imageSimpleList[1].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "gagnant_perdant"){
						chosenImage = Math.floor(Math.random() * 2) + 1;
						if ($rootScope.data.components.scratch.imageGagnantPerdantList.length > chosenImage){
							returnBG = $rootScope.data.components.scratch.imageGagnantPerdantList[chosenImage].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "dynamique_pourcent"){
						chosenImage = Math.floor(Math.random() * $rootScope.data.components.scratch.imageDynamiquePourcentList.length) + 1;
						if ($rootScope.data.components.scratch.imageDynamiquePourcentList.length > chosenImage){
							returnBG = $rootScope.data.components.scratch.imageDynamiquePourcentList[chosenImage].src;
						}
					}
					else if ($rootScope.data.components.scratch.selectedType == "dynamique_nombre"){
						chosenImage = Math.floor(Math.random() * $rootScope.data.components.scratch.imageDynamiqueNombreList.length) + 1;
						if ($rootScope.data.components.scratch.imageDynamiqueNombreList.length > chosenImage){
							returnBG = $rootScope.data.components.scratch.imageDynamiqueNombreList[chosenImage].src;
						}
					}					
					else if ($rootScope.data.components.scratch.selectedType == "personnalise"){
						chosenImage = Math.floor(Math.random() * $rootScope.data.components.scratch.imagePersonnaliseList.length) + 1;
						if ($rootScope.data.components.scratch.imagePersonnaliseList.length > chosenImage){
							returnBG = $rootScope.data.components.scratch.imagePersonnaliseList[chosenImage].src;
						}
					}		
				}
				else {
					returnBG = '../server/service/scratch/black.png';
				}
				
				return returnBG;
            }

            function getPercent(){
				if (angular.isDefined($rootScope.data.components.scratch)){
					return $rootScope.data.components.scratch.inputPourcentage;			
				}
				else {
					return 80;
				}				
            }

            function getSize(){
				if (angular.isDefined($rootScope.data.components.scratch)){
					return $rootScope.data.components.scratch.inputSize;
				}
				else {
					return 45;
				}				
            }

			function callScratchCallback(element){
				element.clear();
				var url = $rootScope.data.components.scratch.inputUrlAtterissage;
				var temps = $rootScope.data.components.scratch.inputDuree;
				temps = temps * 1000;
				/*
				var goodUrl = window.location.href.split("/app/");
				var urlArray = goodUrl[goodUrl.length - 1].split("/");
				var clientId = urlArray[2];
				*/
				
				if (!$scope.callBackAlreadyCalled){
					/*
					var xmlHttp = new XMLHttpRequest();
					xmlHttp.open("GET", $rootScope.data.components.scratch.finScratchCallback, true);
					xmlHttp.send(null);
					*/
					$scope.callBackAlreadyCalled = true;
                    $http.get($rootScope.data.components.scratch.finScratchCallback).success(function(data){
						console.log('ok callScratchCallback');
					}).error(function(err){
						console.log('error callScratchCallback' + err);
					});						
					
					
				}
				if (url != '') {
					if (url.indexOf("http") !== 0) {
						url = "http://" + url;
					}
					if ($rootScope.data.components.scratch.ouvrir == true || $rootScope.data.components.scratch.ouvrir == "true") {
						setTimeout(function(){
							window.location = url;
						}, temps);
					}
					else {
						setTimeout(function(){
							$('#linkBG').on("click", function()
													{
														window.location = url;
													});
							$('#linkBG').show();
						}, temps);
					}
				}				
			}
			
            function setCallback(){
				if (angular.isDefined($rootScope.data)){
                    function callbackFunc(element) {
                        element.container.clean();
                        element.container.style.backgroundImage = getBG();
                        var url = $rootScope.data.components.scratch.inputUrlAtterissage;
                        var temps = $rootScope.data.components.scratch.inputDuree;
                        temps = temps * 1000;
						/*
                        var goodUrl = window.location.href.split("/app/");
                        var urlArray = goodUrl[goodUrl.length - 1].split("/");
                        var clientId = urlArray[2];
						*/
						
						if (!$scope.callBackAlreadyCalled){
							var xmlHttp = new XMLHttpRequest();
							xmlHttp.open("GET", $rootScope.data.components.scratch.finScratchCallback, true);
							xmlHttp.send(null);
							console.log('setCallback');
							$scope.callBackAlreadyCalled = true;
						}
                        if (url != '') {
                            if (url.indexOf("http") !== 0) {
                                url = "http://" + url;
                            }
							if ($rootScope.data.components.scratch.ouvrir == true || $rootScope.data.components.scratch.ouvrir == "true") {
								setTimeout(function(){
									window.location = url;
								}, temps);
							}
							else {
								setTimeout(function(){
									$('#linkBG').on("click", function()
															{
																window.location = url;
															});
									$('#linkBG').show();
								}, temps);
							}
                        }
                    }
                    window.scratchUrl = $rootScope.data.components.scratch.inputUrlAtterissage;
                    window.scratchTemps = $rootScope.data.components.scratch.inputDuree * 1000;
					window.callback = callbackFunc;
				}
				else {
                    function callbackFunc(element) {
                        element.container.clean();
                    }
					window.callback = callbackFunc;
				}				
            }

            function fireScratchChange(newValue, oldValue) {
                document.getElementById('scratch2').innerHTML = "";
                setCallback();
                var img = new Image();
                img.onload = function(){
                    var height = img.height;
                    var width = img.width;
                    var newHeight = ($('netscratch').width() / width) * height;
                    if ($('.settings_container').width() != null) {
                        $('#scratch2').height(newHeight);
                        $('#scratch2').width($('netscratch').width());
						$('#scratch2').wScratchPad({
							bg: getBG(),
							fg: img.src,
							size : getSize(),
							scratchMove: function (e, percent) {
								if (percent > getPercent()){
									callScratchCallback(this);
								}
							}
						});

                        setTimeout(function(){
                            $('canvas.scratchcard-Overlay').height(newHeight);
                            $('canvas.scratchcard-Overlay').width($('netscratch').width());
                            $('#removeOverlay').attr('src', img.src);	
                        }, 100);
                    }
                }
                img.src = getFG();

                if (oldValue == undefined && newValue != undefined && newValue.length == 0) {
                    setTimeout(function(){
                        $('#scratchTypeSelect')[0].options[0].selected = true;
                        $('#scratchTypeSelect').trigger('change');
                    }, 500);
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
						$rootScope.data.components.scratch.showLinkBG = false;
						scope.callBackAlreadyCalled = false;
                        $timeout(function(){
                            setCallback();
                            
                            var img = new Image();
                            img.onload = function(){
                                var height = img.height;
                                var width = img.width;
                                var newHeight = ($('netscratch').width() / width) * height;
                                $('#scratch2').height(newHeight);
                                $('#scratch2').width($('netscratch').width());
								$('#scratch2').wScratchPad({
									bg: getBG(),
									fg: img.src,
									size : getSize(),
									scratchMove: function (e, percent) {
										if (percent > getPercent()){
											callScratchCallback(this);
										}
									}
								});

								setTimeout(function(){
									$('.scratchcard-Cursor').remove();
									$('.scratchcard-Overlay').not(':first').remove();
									$('canvas.scratchcard-Overlay').height(newHeight);
									$('canvas.scratchcard-Overlay').width($('netscratch').width());
									if ($('.settings_container').width() != null) {
										var overlayImage = 'url(' + img.src + ')';
										$('#removeOverlay').attr('src', img.src);	
									} else {
										$('#removeOverlay').remove();
									}
								}, 100);
                            }
                            img.src = getFG();
                        });

                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.imageSimpleList;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.imageGagnantPerdantList;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.imageDynamiqueList;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.imagePersonnaliseList;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.inputUrlAtterissage;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.inputDuree;
                            },
                            function (newValue, oldValue) {
                                if (isNaN(newValue)) {
                                    newValue = 0;
                                }
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            }
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.inputPourcentage;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.inputSize;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );
            
                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.selectedType;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
                                }
                            },
                            true
                        );

                        scope.$watch(
                            function () {
                                return $rootScope.data.components.scratch.ouvrir;
                            },
                            function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    fireScratchChange(newValue, oldValue);
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
