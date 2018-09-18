angular.module('customselect', []).directive('customselect', function () {
   return {
       restrict: 'E',
       scope:{           
    	   ngModel: '=',
    	   layouts: '=',
            options: '=?',
            min: '=?',
     	   max: '=?',
     	  interval: '=?'
       },
   
       /*
       template:"<div class='btn-group bootstrap-select'>"+
			       "<button class='btn btn-primary dropdown-toggle' type='button' data-toggle='dropdown' style='white-space: normal; width:100%; text-align: left; ' " +
			       " ng-style=" + '"' +"{'border-color' : layouts.colors.edgeTextField, 'background-color' : layouts.colors.backgroundField ,  'color' : layouts.colors.textField ,'border-radius': layouts.buttonValidation.roundEdgesSlider + 'px', 'font-family': layouts.styles.font, " + 
			       "'font-size'  : layouts.styles.textSize  + 'px', " +
					 "'font-weight': layouts.styles.fontWeight, " +
					 " 'font-style': layouts.styles.fontStyle }" +  '"' +
			       ">{{ngModel || '&nbsp;'}}"+
			       "<span style='margin-top: 10px;' class='caret pull-right'></span></button>"+
			       "<div class='dropdown-menu ' role='menu' style='max-height: 90px; overflow: hidden; min-height: 0px; width: 100%'>" +
			       "<ul class='dropdown-menu inner' >"+
			       "  <li ng-repeat='option in options track by $index' " +
			       " ng-click='select(option)'>" + 
			       "<a ng-class=" + '"' + "{'customselect-active' :  myModel==option}" + '"' + " href='#' onclick='return false;' >{{option}}</a></li>"+
			      " </ul>"+
			      "</div>" +
			    " </div>",
		*/
       
		template: "<div class='btn-group bootstrap-select ' style='width:100%;  '>" +
					"<button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'   " +
					  " ng-style=" + '"' +"{'border-color' : layouts.colors.edgeTextField, 'background-color' : layouts.colors.backgroundField ,  'color' : layouts.colors.textField ,'border-radius': layouts.buttonValidation.roundEdgesSlider + 'px', 'font-family': layouts.styles.font, " + 
				       "'font-size'  : layouts.styles.textSize  + 'px', " +
						 "'font-weight': layouts.styles.fontWeight, " +
						 " 'font-style': layouts.styles.fontStyle }" +  '"' +
					"> " +
					"<div class='filter-option pull-left'>{{ngModel}}</div>&nbsp;<div class='caret'></div></button> " +
					"<div class='dropdown-menu open' style='max-height: 90px; overflow: hidden; min-height: 0px;'> "+
	  				"<ul class='dropdown-menu inner' role='menu' style='max-height: 78px; overflow-y: auto;'> " +
	  				"<li ng-repeat='option in options track by $index' ng-click='select(option)' ><a tabindex='0' ><span class='text'>{{option}}</span>" +
	  				"<i class='icon-ok check-mark'></i></a></li>" +
	  				"</ul></div></div>" ,
  				    
			    
	  controller: function($scope, $document, $window){
		  
		  
		  $scope.$watch( function() {
			  $scope.createList();
		  });
		  
		  
		  
		$scope.createList = function() {
		if($scope.min != undefined && $scope.max != undefined){
			
			var _interval =  parseInt($scope.interval);
			if($scope.interval == undefined) {
				_interval = 15;
			}
			
			var _min = $scope.min;
			var _max = $scope.max;
			
			
			var min = _min.split(":");
			var max = _max.split(":");

			var hourlist = [];

			var minTime = (parseInt(min[0]) * 60) +  parseInt(min[1]);
			var maxTime = (parseInt(max[0]) * 60) +  parseInt(max[1]);
			
			 
			if((maxTime - minTime ) > _interval) {
			  hourlist = populate(minTime, maxTime, _interval);
			} else {
				amp="";
		        ampm = min[0] % 24 < 12 ? 'AM' : 'PM';
		      
		        minHour = min[0];
		     /*   if (minHour >  12){
		        	minHour = minHour - 12;
		        }*/
		        
		        hourlist.push( minHour + ':' + lessTen(min[1]) ); 
		        
		        ampm = max[0] % 24 < 12 ? 'AM' : 'PM';
		        maxHour = max[0];
		      /*  if (maxHour >  12){
		        	maxHour = maxHour - 12;
		        }*/
		        
		        hourlist.push( maxHour + ':' + lessTen(max[1])); 
			}
			$scope.options = hourlist;
		}
		};
		$scope.open = false;
	    $scope.select = function(option){
        	 $scope.ngModel = option;
        	$scope.open = false;
           return false;
        };
       }

   } 
});

function populate(minTime, maxTime, _interval) {
	var hourlist = [];
    
    var hours, minutes, ampm;
    ampm = "";
    for(var i = minTime; i <= maxTime; i += _interval){
        hours = Math.floor(i / 60);
        minutes = i % 60;
        if (minutes < 10){
            minutes = '0' + minutes; // adding leading zero
        }
        
      //  ampm = hours % 24 < 12 ? 'AM' : 'PM';
        
     //   hours = hours % 12;
      //  if (hours === 0){
       //     hours = 12;
        //}
        
        hourlist.push( hours + ':' + minutes); 
    }
    return hourlist;
    
}


function lessTen(num) {
	num = parseInt(num);
	 if(num < 10){
		 num = "0" + num.toString();
	 }
	return num;
}
