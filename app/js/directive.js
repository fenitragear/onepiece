'use strict';

myApp.directive("navigationNext", function () {
    return {
        restrict: "E",
        scope: {},
        controller: function ($scope, $location, $rootScope) {}
    }
}).directive('disableNgAnimate', ['$animate', function ($animate) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $animate.enabled(false, element);
        }
    };
}]).directive('fileInput', function(){
	return {
		restrict: 'E',
		replace: true,
		scope : {
			onChange:'&'
		},
		controller : function(){},
		template : '<input type="file" class="form-control" />',
		link : function($scope, element, attrs){
			element.fileinput({
				allowedFileTypes: ["image"],
				browseClass: "btn btn-file btn-primary btn-block m-t-md",
				showCaption: false,
				showRemove: false,
				showUpload: false,
				showPreview: false,
				browseLabel: attrs['label']
			});
			element.on("change",function(event){
				$scope.onChange({$event: event, $index:attrs['imindex']});
            })
		}
	}
});
