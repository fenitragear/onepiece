'use strict';

myApp.directive('netvideo', ['$rootScope', '$http', function ($rootScope, $http) {
    return {
        restrict: 'E',
        scope: {
            settings: '=',
			editmode: '='
        },
        templateUrl: 'components/videoComponent/videoComponent.html',
        compile: function($scope, element, attrs){
            return {
                pre: function(scope, element, attributes, controller, transcludeFn){
                    
                },
                post: function(scope, element, attributes, controller, transcludeFn){
                    if (!$rootScope.data) {
                        scope.$on("serviceReady",function () {
                            setTimeout(function() {
                                scope.$apply(function () {
                                    init();
                                });
                            });
                        });
                    } else {
                        init();
                    }
        
                    function init ()  {
						scope.loop = getBoolValue(scope.settings.loop);
						
						scope.autoplay = getBoolValue(scope.settings.autoplay);

                        scope.playlist = scope.settings.src.split('?v=')[1];
                        
                        setTimeout(function () {
							if (!scope.editmode){
								$('#embedVideoId').height($('#embedVideoId').width() * 9 / 16);
							}
							else {
								$('#embedVideoId').height(145); //hack
							}
                        }, 0);
            
                        $rootScope.$watch("data.components.video.src", function (newValue) {
                            if (newValue != '') {
								scope.settings.src = newValue;
								$('#removeVideoOverlay').attr('src', '');
								getVideoThumb(newValue);
                            } else {
								var overlayImage = 'url(../server/service/video/default-video-image.jpg)';
								$('#removeVideoOverlay').attr('src', '../server/service/video/default-video-image.jpg');		
                            }
                        });
						
						$rootScope.$watch("data.components.video.autoplay", function (newValue) {
							scope.autoplay = getBoolValue(newValue);
						});
						
						$rootScope.$watch("data.components.video.loop", function (newValue) {
							scope.loop = getBoolValue(newValue);
						});	
    
                        if ($('.settings_container').width() == null) {
                            $('#removeVideoOverlay').remove();
                        }
                    }
					
					function getBoolValue(bValue){
                        if (bValue == true || bValue == 'true') {
                            return 1;
                        } else {
                            return 0;
                        }						
					}
					
					function getVideoThumb(videoUrl){
						var video_id = "";
						
						/* DAILY MOTION */
						var match = videoUrl.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
						if (match !== null) {
							if(match[4] !== undefined) {
								video_id = match[4];
							}
							video_id = match[2];
							
							scope.videoThumbSrc = "https://www.dailymotion.com/thumbnail/video/" + video_id;
							return;
						}
						
						/* YOUTUBE */
						var match2 = videoUrl.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/);
						if (match2) {
							video_id = match2[1];
							
							scope.videoThumbSrc = "http://img.youtube.com/vi/" + video_id + "/mqdefault.jpg";
							return;
						}
							
						/* VIMEO */
						var match3 = videoUrl.match(/https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
						if (match3){
							video_id = match3[3];
							var jsonUrl = "http://vimeo.com/api/v2/video/" + video_id + ".json";
							var videoJson = $http.get(jsonUrl).success(function(data){
								scope.videoThumbSrc = data[0].thumbnail_large;
								return;
							});
						}

						scope.videoThumbSrc = "";
					}
			
                }
            }
        }
    }
}]);
