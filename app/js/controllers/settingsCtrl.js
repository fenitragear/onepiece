myApp.controller("settingsCtrl", ['$rootScope', '$scope', '$http', '$timeout', '$location', '$animate', '$modal', '$sce',function ($rootScope, $scope, $http, $timeout, $location, $animate, $modal, $sce) {
    getUrlParams();
	
    function getUrlParams () {
        var url = $location.path();
        var goodUrl = url.split("/app/");
        var urlArray = goodUrl[goodUrl.length - 1].split("/");

		$scope.currentTemplate = urlArray[1];
		$scope.currentUrl = urlArray[2];
		$scope.clientId = urlArray[3];
		$scope.template = "";
		$scope.nosettings = true;
		
		$http.get('../server/files/' + $scope.clientId + '/settings.json?t=' + (new Date().getTime()).toString(16)).success(function (data) {
			gotoHome();
			
		}).error(function (err, status) {
			$scope.nosettings = false;
		});
		
    }
	
	function gotoHome(){
		window.location = "index.html#/" + $scope.currentTemplate + "/options/" + $scope.clientId + "/";
	}
	
	$scope.checkrb = function(divid){
		$scope.template = divid;
		console.log('$scope.template', $scope.template);
	}
	
	$scope.next = function(){
		var xhr = new XMLHttpRequest();
		var formData = new FormData();

		formData.append("session", $scope.clientId);
		formData.append("template", $scope.template);		

		xhr.onload = function () {
			var response = xhr.responseText;
			console.log(response);
			response = JSON.parse(response);

			gotoHome();
		};

		xhr.open('post', "../server/service/postTemplate.php");
		xhr.send(formData);		
	};
}]);