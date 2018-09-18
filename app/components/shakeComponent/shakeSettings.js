'use strict';

angular.module('netMessage.shakeSettings', ['ngRoute'])
    .controller('ShakeSettingsCtrl', ['$scope', '$rootScope', '$modal', '$location', function ($scope, $rootScope, $modal, $location) {

        $scope.sortableOptions = {};

        $scope.init = function () {
			$scope.nav = "images";
			$scope.currentIndex = -1;

            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            if ($rootScope.data.components.shake == undefined) {
                $rootScope.data.components.shake = new Object();
				$rootScope.data.components.shake.showShake = true;
				$rootScope.data.components.shake.link = "";
				$rootScope.data.components.shake.finShakeCallback = "finshake.jpg";
            } else {
                if ($rootScope.data.components.shake.showShake == undefined) {
					$rootScope.data.components.shake.showShake = false;
				}
			}

			if ($rootScope.data.components.shake.image == undefined|| $rootScope.data.components.shake.image.length==0) {
				$rootScope.data.components.shake.showShake = true;
				reinitShake();
			}

			if ($rootScope.data.components.shake.link == undefined) {
				$rootScope.data.components.shake.link = "";
			}
			
			if ($rootScope.data.components.shake.openNewWindow == undefined) {
				$rootScope.data.components.shake.openNewWindow = false;
            }

			$scope.showShake = ($rootScope.data.components.shake.showShake.toString() == "true" ? true : false);
			$scope.openNewWindow = ($scope.data.components.shake.openNewWindow.toString() == "true" ? true : false);
			
            $scope.$watch("shakeImage", function (newValue, oldValue) {
				$rootScope.data.components.shake.image = newValue;
				if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/shake/black.jpg') {
					$scope.showShake = false;
				} else if(newValue != oldValue) {
					$scope.showShake = true;
				}
            }, true);
			
            $scope.$watch("showShake", function (newValue, oldValue) {
				$rootScope.data.components.shake.showShake = newValue;
			});

			$scope.$watch("shakeLink", function (newValue, oldValue) {
				$rootScope.data.components.shake.link = newValue;
			});

			$scope.$watch("openNewWindow", function (newValue, oldValue) {
				$rootScope.data.components.shake.openNewWindow = newValue;
			});

			$scope.shakeImage = $rootScope.data.components.shake.image;
			$scope.shakeLink = $rootScope.data.components.shake.link;

			var xhrz = new XMLHttpRequest();
			var formDataz = new FormData();
			formDataz.append("session", $rootScope.clientid);
			formDataz.append("imageCallback", $rootScope.data.components.shake.finShakeCallback);
	
			xhrz.open('post', "../server/service/postShake.php");
			xhrz.send(formDataz);
		}
		

        if (!$rootScope.data) {
            $scope.$on("serviceReady", function () {
                $scope.$apply(function ()  {
                    $scope.init();
				});
            });
        } else {
			$scope.init();
        }
		
		function reinitShake(){
			if($rootScope.data.components.shake.image == undefined) {
				$rootScope.data.components.shake.image = new Array();
			}
			if ($rootScope.data.components.shake.image.length == 0) {
				$rootScope.data.components.shake.image = new Array();
				
				$rootScope.data.components.shake.image.push(new Object());
				$rootScope.data.components.shake.image[0].src = "../server/service/shake/image_a_secouer_default.png";
				$rootScope.data.components.shake.image[0].progress = 0;
				$rootScope.data.components.shake.image[0].label = 'Image à secouer';
				
				$rootScope.data.components.shake.image.push(new Object());
				$rootScope.data.components.shake.image[1].src = "../server/service/shake/black.jpg";
				$rootScope.data.components.shake.image[1].progress = 0;
				$rootScope.data.components.shake.image[1].label = 'Image après secouement';
				$rootScope.data.components.shake.image[1].imageInfos = 'Image finale';
			} else {
				$scope.shakeImage = $rootScope.data.components.shake.image;
			}
		}
		
		$scope.uploadShakeImage = function(event, index){
			$scope.currentIndex = index;
			readFileShake(event);
		};
		
        function readFileShake (event) {
            if ((/\.(gif|jpg|jpeg|png)$/i).test(event.target.files[0].name)) {
                uploadShakeImage(event.target.files[0]);
            } else {
                alert("Votre fichier " + event.target.files[0].name + " n'est pas au format png, jpg ou gif.");
            }
        }

        function uploadShakeImage (file) {
            var xhrw = new XMLHttpRequest();
            var formDataw = new FormData();

			formDataw.append("logo", file);
			console.log($rootScope.clientid);
			formDataw.append("session", $rootScope.clientid); //TODO session link

            $scope.$apply(function () {
				$scope.shakeImage[$scope.currentIndex].src = "../server/service/shake/chargement.png";
				$scope.shakeImage[$scope.currentIndex].progress = 0;
            });

            xhrw.upload.onprogress = function (e) {
                var done = e.loaded || e.position, total = e.total || e.totalSize;
                var pourc = (Math.floor(done/total*100));

                $scope.$apply(function () {
					$scope.shakeImage[$scope.currentIndex].progress = pourc;
                });
            };

            xhrw.onload = function () {
				var response = xhrw.responseText;
                response = JSON.parse(response);

                $scope.$apply(function () {
					$scope.shakeImage[$scope.currentIndex].src = response.file + "?t=" + Date.now();

					$scope.currentIndex	= -1;
                });
            };

            xhrw.open('post', "../server/service/postShake.php");
            xhrw.send(formDataw);
        }
		
		$scope.delete = function (index,image) {
			if(index==0){
				image.src = "../server/service/shake/black.jpg";
			}else{
				image.src = "../server/service/shake/black.jpg";
			}
		}

		$scope.restoreDefaultImage = function (image) {
			var defaultScratchImage = "../server/service/shake/image_a_secouer_default.png";
			image.src = defaultScratchImage;
        }
    }]
);
