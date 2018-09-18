angular.module('timelist', []).directive('timelist', function () {
   return {
       restrict: 'A',
       scope:{           
    	   ngModel: '=',
    	   min: '=',
    	   max: '='
    	 },
     
       template:  "<option value='{{list}}' ng-repeat='list in timeList.data' >{{list}}</option>",
			     
	  link: function($scope){
		  $scope.timeList = {};
		  $scope.timeList.min =  $scope.min;
		  $scope.timeList.max =  $scope.max;
		  $scope.timeList.data = [];
		  $scope.timeList.data = createTimeList($scope.min, $scope.max);
		  
		  $scope.$watch( function(newValue, oldValue)
		  {
			
			  $scope.min = newValue.min;
			  $scope.max = newValue.max;
			 
			  if($scope.min != $scope.timeList.min || $scope.max != $scope.timeList.max) {
				  
				  $scope.timeList = {};
				  $scope.timeList.min =  $scope.min;
				  $scope.timeList.max =  $scope.max;
				  $scope.timeList.data = createTimeList($scope.min, $scope.max);
			  }
		  },'true');
		  
		 
       }
   } 
});


function createTimeList(_min,_max) {
	
	var min = _min.split(":");
	var max = _max.split(":");
	  
	var hourlist = [];

	 var minHour = parseInt(min[0]);
	 var maxHour = parseInt(max[0]);
	 var minMinute = round5(parseInt(min[1]));
	 var maxminute = round5( parseInt(max[1]));
	
	 
	 usedMinimumMinutes = false;
	 for(var a = minHour; a <= maxHour; a++) {
		 var startMin = 00;
		 var endMin = 59;	
		 if(!usedMinimumMinutes) {
			 startMin = minMinute;
			 usedMinimumMinutes = true;
		 }
		 
		 if(maxHour == a){
			 endMin = maxminute;
		 }
		 
		  for(m = startMin; m<=endMin; m++) {
		   	
			  var minutes = m;
			  var hours = a;	
			 if(hours == maxHour && minutes == 60){
				 hours = hours + 1;
				 minutes = 0;
			 }
			 
			 if(minutes < 10){
				  minutes = "0" + minutes.toString();
			 }
			 
			 
			 if(hours < 10){
				  hours = "0" + hours.toString();
			 }
			 
			 
			 
			 var hourMin = hours + ":" + minutes;
		  	 hourlist.push(hourMin);
		  	 m = m + 4;
	 	  }
		  
	  }
	  
	
	 
	 return hourlist;
}

function round5(x)
{
    return (x % 5) >= 2.5 ? parseInt(x / 5) * 5 + 5 : parseInt(x / 5) * 5;
}
