'use strict';

angular.module('netMessage.expertModeSettings', ['ngRoute'])
    .controller('expertModeSettings', ['$scope', '$rootScope', '$modal', '$location', '$http' ,  function ($scope, $rootScope, $modal, $location, $http) {
        var tempSourceCode = CodeMirror.fromTextArea(
            document.getElementById("codeMirrorDiv"),
            {
                lineNumbers: true,
                matchBrackets: true,
                continueComments: "Enter",
                mode: "htmlmixed"
            }
        );

        var tempExpertHeader = CodeMirror.fromTextArea(
            document.getElementById("codeMirrorExpertHeader"),
            {
                lineNumbers: true,
                matchBrackets: true,
                continueComments: "Enter",
                mode: "htmlmixed"
            }
        );

        $scope.init = function () {
            if ($rootScope.data.modeSettings.modeType == "1") {
                $location.path('/' + $scope.currentTemplate + '/options/' + $scope.clientId);
            }

            var sourceCode = $rootScope.sourceCode;
            $scope.sourceCode = $rootScope.sourceCode;

            if (sourceCode === undefined || sourceCode === false || sourceCode === null || sourceCode === '') {
                $rootScope.data.modeSettings.modeType = "1";
            }

            $scope.expert_header = $rootScope.data.modeSettings.expert_header;

            $scope.$watch("expert_header", function (newValue, oldValue) {
                $rootScope.data.modeSettings.expert_header = newValue;
            });

            var url = $location.path();
            var urlArray = url.split("/");
            var currentTemplate = urlArray[1];
            var clientid = urlArray[3];

            /*
            $http({
                url: '../server/files/'+clientid+'/sourceCode.html',
                method: "GET"

            }).success(function (data) {
                tempSourceCode.setValue(data);
                $rootScope.sourceCode  = data;
            });
            */
            //tempSourceCode.on("change",function (a,b) {
            // //   $rootScope.sourceCode = tempSourceCode.getValue();
            // });

            $rootScope.$watch("sourceCode", function (newValue) {
                tempSourceCode.setValue(newValue);
            });

            if (typeof $scope.expert_header === 'string') {
                tempExpertHeader.setValue($scope.expert_header);
            }

            $scope.saveTempSourceCode = function (aa) {
                $("#runBtn").button('loading');
                $rootScope.sourceCode = tempSourceCode.getValue();
                $("#runBtn").button('reset');
            };

            $scope.importSourceCode = function () {
                $("#importBtn").button('loading');
                $rootScope.importSourceCode = true;
                $("#importBtn").button('reset');
            };

            $scope.saveSourceCode = function () {
                $("#saveCodeBtn").button('loading');
                $rootScope.sourceCode = tempSourceCode.getValue();
                $scope.expert_header = tempExpertHeader.getValue();

                var url = $location.path();
                var urlArray = url.split("/");
                var clientid = urlArray[3];
                var data = $.param({
                    session: clientid,
                    content: $rootScope.sourceCode
                });

                $http({
                    url: '../server/service/postSourceCode.php',
                    method: "POST",
                    data: data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function (data) {
                    $("#saveCodeBtn").button('reset');
                });
            };
        };

        if (!$rootScope.data) {
            $scope.$on("serviceReady", function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
    }])

    .controller('confirmSettingsModalCtrl', function ($scope, $modalInstance, items) {
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
});
