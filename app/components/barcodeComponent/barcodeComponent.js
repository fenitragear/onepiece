'use strict';

myApp.directive('netbarcode', ['$window', '$rootScope', '$location', function ($window, $rootScope, $location) {
    return {
        restrict: 'E',
        scope: {
            settings: '='
        },
        templateUrl: 'components/barcodeComponent/barcodeComponent.html',
        controller: function ($rootScope, $scope, $attrs, $location) {
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
            function init() {

            }
        }
    }
}]);

myApp.directive('netbarcodeunitaire', ['$window', '$rootScope', '$location', function ($window, $rootScope, $location) {
    return {
        restrict: 'A',
        scope: {
            settings: '='
        },
        controller: function ($rootScope, $scope, $attrs, $location) {
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }

            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }
                $scope.titre = $rootScope.data.components.barcode.titre.text;
                $scope.$watch("titre", function (newValue, oldValue) {
                    $rootScope.data.components.barcode.titre.text = newValue;
                    $rootScope.data.components.barcode.titre.realText = $rootScope.replaceText(newValue);
                });

                $scope.barcodeType = $rootScope.data.components.barcode.codeType;
                $scope.inputCode = $rootScope.data.components.barcode.inputCodeNum;
                function initBarCode(value, type) {

                    JsBarcode("#codeBarre", value, {
                        format: type,
                        lineColor: "#000",
                        textAlign: "center",
                        textMargin: 2,
                        width: 2,
                        height: 100,
                        displayValue: true,
                        valid:
                            function (valid) {
                                if (valid) {
                                    $("#codeBarre").show();
                                    $("#invalid").hide();
                                }
                                else {
                                    $("#codeBarre").hide();
                                    $("#invalid").show();
                                }
                            }
                    });
                }

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.barcode.inputCodeNum;
                    },
                    function (newValue, oldValue) {
                        $scope.inputCode = $rootScope.data.components.barcode.inputCodeNum;
                        initBarCode(newValue, $scope.barcodeType);

                    }
                );

                $scope.$watch(
                    function () {
                        return $rootScope.data.components.barcode.codeType;
                    },
                    function (newValue, oldValue) {
                        $scope.barcodeType = $rootScope.data.components.barcode.codeType;
                        initBarCode($scope.inputCode, newValue);
                    }
                );
            }
        }
    }
}]);

myApp.directive('netbarcodeperso', ['$window', '$rootScope', '$location', function ($window, $rootScope, $location) {
    return {
        restrict: 'A',
        scope: {
            settings: '='
        },
        controller: function ($rootScope, $scope, $attrs, $location) {
            if (!$rootScope.data) {
                $scope.$on("serviceReady", function () {
                    $scope.$apply(function () {
                        init();
                    });
                });
            } else {
                init();
            }



            function init() {
                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];

                if (!$rootScope.editMode) {
                    clientid = urlArray[2];
                }
                $scope.barcodeType = $rootScope.data.components.barcode.codeType;
                $scope.inputCode = $rootScope.data.components.barcode.inputCodeNum;
                $scope.barcodeMode = $rootScope.data.components.barcode.modeType;
                $scope.titre = $rootScope.data.components.barcode.titre.text;
                
                //watch titre
                $scope.$watch("titre", function (newValue, oldValue) {F
                    $rootScope.data.components.barcode.titre.text = newValue;
                    $rootScope.data.components.barcode.titre.realText = $rootScope.replaceText(newValue);
                });

                //watch defaultValue
                $scope.defaultValue = $rootScope.data.components.barcode.realTxtPersonalise;
                $scope.defaultV = $rootScope.data.components.barcode.defaultValue;

                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.$watch("defaultV", function (newValue) {
                            $rootScope.data.components.barcode.defaultValue = newValue;
                            $rootScope.data.components.barcode.realTxtPersonalise = $rootScope.replaceText(newValue);
                        });
                    });
                }, 500);


                function initBarCode(value, type) {
                    JsBarcode("#codeBarrePerso", value, {
                        text: $scope.final,
                        format: type,
                        lineColor: "#000",
                        textAlign: "center",
                        textMargin: 2,
                        width: 2,
                        height: 100,
                        displayValue: true,
                        valid:
                            function (valid) {
                                if (valid && (!isNaN(value))) {
                                    $("#codeBarrePerso").show();
                                    $("#invalidperso").hide();
                                }
                                else {
                                    $("#codeBarrePerso").hide();
                                    $("#invalidperso").show();
                                }
                            }
                    });
                }
                $rootScope.$watch(
                    function () {
                        return $rootScope.data.components.barcode.realTxtPersonalise;
                    },
                    function (newValue, oldValue) {
                        console.log("defaultValue", newValue);
                        $scope.defaultValue = newValue;
                        initBarCode($scope.defaultValue, $scope.barcodeType);
                    }
                );

                $rootScope.$watch(
                    function () {
                        return $rootScope.data.components.barcode.codeType;
                    },
                    function (newValue, oldValue) {
                        console.log("codeType", newValue);
                        $scope.barcodeType = $rootScope.data.components.barcode.codeType;
                        initBarCode($scope.defaultValue, newValue);
                    }
                );
            }
        }
    }
}]);