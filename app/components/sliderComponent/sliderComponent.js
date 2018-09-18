'use strict';

myApp.directive('netslider', function () {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/sliderComponent/sliderComponent.html',
        controller: function ($scope, $attrs, $rootScope, $timeout,$location,setDefaultImages) {
            $scope.openLink = function (image) {
                var url = image.link;

                if(url!='' && url!=undefined && !$rootScope.editMode){
                    if (url.indexOf("http") !== 0 && url != "") {
                        url = "http://" + url;
                    }
                    if (image.blank.toString() == "true") {
                        window.open(url)
                    } else if (image.blank.toString() == "false") {
                        window.location = url;
                    }
                }
            }
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }
            var url = $location.path();
            var urlArray = url.split("/");
            var clientid = urlArray[3];

            if (!$rootScope.editMode) {
                clientid = urlArray[2];
            }

            function initImages(){
                $scope.targetDir = '../server/service/slider/';
                if($rootScope.data.components.slider.imageList!= undefined){
                    if($rootScope.data.components.slider.imageList.length != 0 ){
                        if($rootScope.data.components.slider.sliderType=="Galerie"){
                            $scope.targetDir = '../server/files/'+clientid+'/slider/'+$rootScope.data.components.slider.imageFormat+'/';
                        }
                        else{
                            $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                        }
                    }
                    $scope.showDivPrices = true;
                }
                if($rootScope.data.components.slider.imageList== undefined || $rootScope.data.components.slider.imageList.length==0){
                    $scope.showDivPrices = false;
                    $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                }
            }

            function init() {
                $scope.imageList = $rootScope.data.components.slider.imageList;
                $scope.imageFormat = $rootScope.data.components.slider.imageFormat;
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }
                $scope.$watch("imageFormat", function (newValue, oldValue) {
                    $rootScope.data.components.slider.imageFormat = newValue;
                    if ($rootScope.data.components.slider.imageFormat == "portrait") {
                        $scope.showLine = false;
                    } else {
                        $scope.showLine = true;
                    }
                });
                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;

                    },
                    function (newValue, oldValue) {
                        initImages();
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = $rootScope.data.components.slider.imageList;
                            }
                        }
                        //     if (newValue != oldValue) {
                        //     setTimeout(function () {
                        //         $scope.$apply(function () {
                        //             reinitList();
                        //         });
                        //     }, 1000);
                        // }
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.nbImages;
                    },
                    function (newValue, oldValue) {
                        initImages();
                    }
                );
                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.imageFormat;
                    },
                    function (newValue, oldValue) {
                        $scope.imageFormat = newValue;
                        initImages();
                    }
                );
                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderType;
                    },
                    function (newValue, oldValue) {
                        $rootScope.data.components.slider.sliderType = newValue;
                        initImages();
                    }
                );
            }

        }
    }
});

myApp.directive('basiceffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages','$interval', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages,$interval) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout,$compile) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {
                effect:"basic_linear",
                prev: "", next: "",
                duration: 15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
                revers: 0
            };

            if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
                options.revers = 1;
            }
           
            var basic = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("basicEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    basic();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                                options.gestures = 0;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                                options.gestures = 1;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.directive('bookeffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {

                effect: "book",
                prev: "", next: "",
                duration:15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
            }

            var book = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("bookEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    book();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.directive('carouseleffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {

                effect: "carousel_basic",
                prev: "", next: "",
                duration: 15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
            }


            var carousel = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("carouselEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    carousel();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.directive('cubeeffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {

                effect: "cube",
                prev: "", next: "",
                duration: 15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
            }


            var cube = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("cubeEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    cube();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.directive('rotateeffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {

                effect: "rotate",
                prev: "", next: "",
                duration: 15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
            }


            var rotate = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("rotateEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    rotate();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.directive('stackeffect', ['$rootScope', '$timeout', '$http','modifURL',"$location",'setDefaultImages', function ($rootScope, $timeout, $http,modifURL,$location,setDefaultImages) {
    return {
        restrict: 'A',
        scope: {},
        controller: function ($scope, $element, $attrs, $rootScope, $timeout) {
            var slider = "";
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            var options = {

                effect: "stack",
                prev: "", next: "",
                duration: 15 * 100,
                delay: 20 * 100,
                caption: false,
                gestures: 1,
                stopOn: -1,
            }


            var stack = function () {
                slider = $element.wowSlider(options);
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }

                function reinitList() {
                    if($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.imageList==undefined){
                        $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                    }
                    var divGM = document.getElementById("stackEffect");
                    divGM.innerHTML = "";

                    var ul = document.createElement("ul");
                    angular.forEach($scope.imageList, function (value, key) {
                        var li = document.createElement('li');
                        var img = document.createElement('img');
                        if(value.cropped=="chargement.png"){
                            img.setAttribute("src",  "../server/service/slider/chargement.png");
                        }else{
                            img.setAttribute("src",  $scope.targetDir+value.cropped);
                        }

                        var a = document.createElement("a");

                        if(value.link!=undefined && value.link!="" && !$rootScope.editMode){
                            a.setAttribute("href",modifURL.myFunc(value.link));
                            if(value.blank.toString()=="true"){
                                a.setAttribute("target","_blank");
                            }
                            a.appendChild(img);
                            li.appendChild(a);
                        }else{
                            li.appendChild(img);
                        }

                        ul.appendChild(li);
                    });
                    divGM.appendChild(ul);
                    stack();
                }

                $scope.$watchCollection(
                    function () {
                        return $rootScope.data.components.slider.imageList;
                    },
                    function (newValue, oldValue) {
                        angular.forEach(newValue, function (itm,key) {
                            $rootScope.$watch("data.components.slider.imageList["+key+"].cropped", function (newValue) {
                                $scope.imageList[key].cropped = newValue;
                                reinitList();
                            });
                        });
                        $scope.targetDir = '../server/service/slider/';
                        if($rootScope.data.components.slider.imageList!= undefined){
                            if($rootScope.data.components.slider.imageList.length != 0 ){
                                $scope.targetDir = '../server/files/'+clientid+'/slider/original/';
                            }
                        }
                        if (newValue != undefined) {
                            if (newValue.length > 0) {
                                $scope.imageList = [];
                                $scope.imageList = newValue;
                            }else{
                                $scope.imageList = setDefaultImages.setDefault($rootScope.data.components.slider.sliderType,$rootScope.data.components.slider.nbImages);
                            }
                            if($scope.imageList.length==1){
                                options.controls = false;
                            }else if($scope.imageList.length>1){
                                options.controls = true;
                            }
                        }
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.automatic;
                    },
                    function (newValue, oldValue) {
                        options.autoPlay = (newValue.toString() == "true" ? true : false);
                        reinitList();
                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.slider.sliderLoop;
                    },
                    function (newValue, oldValue) {
                        options.loop = (newValue.toString() == "false" ? true : false);
                        reinitList();
                    }
                );
            }
        }
    }
}]);

myApp.service('modifURL', function() {
    this.myFunc = function (link) {
        var url = link;

        if(url!='' && url!=undefined){
            if (url.indexOf("http") !== 0 && url != "") {
                url = "http://" + url;
            }
            return url;
        }
    }
});

myApp.service('setDefaultImages', function() {
    this.setDefault = function(type,nbImages){
        var imageList = [];
        if (type == "Diaporama") {
            imageList = [
                { src: "diapo1.jpg",cropped:"diapo1.jpg",price:'',oldPrice:'' },
                { src: "diapo2.png",cropped:"diapo2.png",price:'',oldPrice:'' },
                { src: "diapo3.png",cropped:"diapo3.png",price:'',oldPrice:'' }
            ];
        } else {
            if (nbImages == 1) {
                imageList = [
                    { src: "diapo1.jpg",cropped:"diapo1.jpg",price:'',oldPrice:'' }
                ];

            } else if (nbImages == 2) {
                imageList = [
                    { src: "diapo1.jpg",cropped:"diapo1.jpg",price:'',oldPrice:'' },
                    { src: "diapo2.png",cropped:"diapo2.png",price:'',oldPrice:'' },
                    { src: "diapo3.png",cropped:"diapo3.png",price:'',oldPrice:'' },
                    { src: "diapo4.png",cropped:"diapo4.png",price:'',oldPrice:'' }
                ];

            } else if (nbImages == 3) {
                imageList = [
                    { src: "diapo1.jpg",cropped:"diapo1.jpg",price:'',oldPrice:'' },
                    { src: "diapo2.png",cropped:"diapo2.png",price:'',oldPrice:'' },
                    { src: "diapo3.png",cropped:"diapo3.png",price:'',oldPrice:'' },
                    { src: "diapo4.png",cropped:"diapo4.png",price:'',oldPrice:'' },
                    { src: "diapo5.png",cropped:"diapo5.png",price:'',oldPrice:'' },
                    { src: "diapo6.png",cropped:"diapo6.png",price:'',oldPrice:'' },
                    { src: "diapo7.png",cropped:"diapo7.png",price:'',oldPrice:'' },
                    { src: "diapo8.png",cropped:"diapo8.png",price:'',oldPrice:'' },
                    { src: "diapo9.png",cropped:"diapo9.png",price:'',oldPrice:'' }
                ];

            }
        }
        return imageList;
    }
});

