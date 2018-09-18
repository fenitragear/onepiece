angular.module('bDatepicker', []).
directive('bDatepicker', function(){
  return {
    require: '?ngModel',
    restrict: 'A',
    link: function($scope, element, attrs, ngModelCtrl) {
      var originalRender, updateModel;
      updateModel = function(ev) {
    	  element.datepicker('hide');
          element.blur();
        return $scope.$apply(function() {
          return ngModelCtrl.$setViewValue(ev.date);
        });
      };
      if (ngModelCtrl != null) {
        originalRender = ngModelCtrl.$render;
        ngModelCtrl.$render = function() {
          originalRender();
          return element.datepicker.date = ngModelCtrl.$viewValue;
        };
      }
      return attrs.$observe('bDatepicker', function(value) {
        var options;
        options = {};
        if (angular.isObject(value)) {
          options = value;
        }
        if (typeof(value) === "string") {
          options = angular.fromJson(value);
        }
        return element.datepicker(options).on('changeDate', updateModel);
      });
    }
  };
});