angular.module('multiselect', []).directive('multiselect', function () {
   return {
       restrict: 'E',
       scope:{           
    	   ngModel: '=',
    	 
            options: '='
       },
     
       template: "<div class='btn-group' id='__dropdown_list_div__' ng-class='{open: open }' >"+
			       "<button  class='multiselect dropdown-toggle btn btn-default'  ng-click='open=!open'  >"+
				    "<span class='multiselect-selected-text'>{{ngModel.length}} champ(s) choisi(s)</span> <b class='caret'></b></button>"+
				    	"<ul class='multiselect-container dropdown-menu'>" + 
			               "<li ng-repeat='option in options' ng-click='setSelectedItem(option)' ng-class='{active: (ngModel.indexOf( option.id) >= 0)}' ><a tabindex='0'>" + 
			               	"<label class='checkbox'> {{option.name}}</label></a></li>" +                                        
			           "</ul>" +
			       "</div>" ,
		
	  controller: function($scope, $document, $window){
		//  $scope.ngModel = $scope.ngModel.filter(onlyUnique);
	    	 $window.onclick = function (event) {
	    		 if (!event.target) return;
	    		 
	    		 if(!$(event.target).closest('#__dropdown_list_div__').length) {
	    			 $scope.$apply(function(){
	    				 $scope.open = false;
	                   });
	    		 }
	    		 return;
	    	 };
	    	
            $scope.setSelectedItem = function(option){
            	var model = $scope.ngModel;
            	 
            	 var id = option.id;
                if (_.contains(model, id)) {
                	var index = model.indexOf(id);
                	
                	model.splice(index, 1);
 //               	 delete model[model.indexOf(index, 1)];
                } else {
                	model.push(id);
                }
                
                $scope.ngModel = model;
               
                
               return false;
                
            };
        
       }
   } 
});

/*
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}*/