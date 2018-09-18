'use strict';

angular.module('netMessage.logoSettings', ['ngRoute'])
    .controller('LogoSettingsCtrl', ['$scope', '$rootScope', '$timeout', '$modal', '$location', function ($scope, $rootScope, $timeout, $modal, $location) {
        var DEFAULT_IMAGE = 'img/votre-logo-ici.png';

        $("#logo-src").fileinput({
            browseClass: "btn btn-primary btn-block m-t-md",
            showCaption: false,
            showRemove: false,
            showUpload: false,
            showPreview: false,
            browseLabel: "Choisissez votre logo"
        });

        $scope.hasLink = false;
        $scope.progress = 0;
        $scope.isDefaultImage = true;

        $scope.init = function () {
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            $scope.src = $rootScope.data.components.logo.src;

            //DETAULT IMAGE
            $scope.$watch("src", function (newValue, oldValue) {
                $rootScope.data.components.logo.src = newValue;
                $scope.isDefaultImage = $scope.src == DEFAULT_IMAGE || $scope.src == "";
            });

            $scope.$watch("logoSize", function (newValue){
                if (newValue != undefined) {
                    $rootScope.data.components.logo.size = newValue;
                }
            });

            $scope.displayed = $rootScope.data.components.logo.displayed;

            $scope.$watch("displayed", function (newValue){
                $rootScope.data.components.logo.displayed = newValue;
            });

            $rootScope.$watch("data.components.logo.link", function (newValue) {
                $scope.hasLink = false;

                if (newValue != undefined) {
                    $scope.hasLink = newValue.length > 0;
                }
            });

            $rootScope.$watch("data.components.logo.formLink", function (newValue) {
                $scope.formLink = false;

                if (newValue === "true" || newValue === true) {
                    $scope.formLink = true;
                }
            });

            $scope.logoSize = $rootScope.data.components.logo.size;

            if ($rootScope.data.components.logo.size == undefined) {
                $scope.logoSize = $rootScope.defaultData.components.logo.size;
            }

            var slider = $("input.logoSlider").slider({
                ticks: [0,1,2,3],
                value: formattedValue($scope.logoSize),
                formatter : function (value) {
                    switch (value) {
                        case 0 :
                            return "Normal";
                        case 1 :
                            return "Moyen";
                        case 2 :
                            return "Grand";
                        case 3 :
                            return "Toute la largeur";
                        default :
                            return "";
                    }
                }
            }).on("change", function () {
                var slideValue = realValue(slider.getValue());
                $scope.logoSize = slideValue;

                $rootScope.$apply(function () {
                    $rootScope.data.components.logo.size = slideValue;
                });
            }).data('slider');
        }

        if (!$rootScope.data) {
            $scope.$on("serviceReady", function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }

        $scope.deleteImage = function () {
            $scope.src = DEFAULT_IMAGE;
            $rootScope.data.components.logo.alt = "";
            $rootScope.data.components.logo.link = "";
            $rootScope.data.components.logo.blank = true;
            $rootScope.data.components.logo.formLink = false;
        }

        $("#logo-src").change(function (event){
            readFile(event);
        });

        function readFile (event) {
            if ((/\.(gif|jpg|jpeg|png)$/i).test(event.target.files[0].name)) {
                upload(event.target.files[0]);
            } else {
                alert("Votre image doit être au format png, jpg ou gif");
            }
        }

        function upload (file) {
            var xhr = new XMLHttpRequest();
            var formData = new FormData();

            formData.append("logo", file);
            formData.append("session", $rootScope.clientid); //TODO session link

            xhr.upload.onprogress = function (e) {
                var done =  e.loaded, total =  e.total;
                var pourc = (Math.floor(done/total*1000)/10);

                $scope.$apply(function () {
                    $scope.progress = pourc;
                });

                if (pourc >= 100) {
                    $timeout(function () {
                        $scope.$apply(function () {
                            $scope.progress = 0;
                        });
                    }, 2000);
                }
            };

            xhr.onload = function () {
                var response = xhr.responseText;
                response = JSON.parse(response);

                $scope.displayed = true;
                $scope.src = response.file + "?t=" + Date.now();
            };

            xhr.open('post', "../server/service/postLogo.php");
            xhr.send(formData);
        }

        function realValue (val) {
            switch (val) {
                case 0:
                    return 42;
                case 1:
                    return 50;
                case 2 :
                    return 75;
                case 3 :
                    return 100;
                default :
                    return 42;
            }
        }

        function formattedValue (val) {
            val = parseInt(val);

            switch (val) {
                case 42:
                    return 0;
                case 50:
                    return 1;
                case 75 :
                    return 2;
                case 100 :
                    return 3;
                default :
                    return 0;
            }
        }

        $scope.openLink = function () {
            var modalInstance = $modal.open({
                templateUrl: 'components/logoComponent/logoComponentLinkModal.html',
                controller: 'LogoSettingsLinkModalCtrl',
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    item: function () {
                        return $rootScope.data.components.logo;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $rootScope.data.components.logo.alt = selectedItem.alt;
                $rootScope.data.components.logo.link = selectedItem.link;
                $rootScope.data.components.logo.blank = selectedItem.blank;
                $rootScope.data.components.logo.formLink = selectedItem.formLink;
            }, function () {});
        };
    }]).controller('LogoSettingsLinkModalCtrl', function ($scope, $rootScope, $modalInstance, $location, item) {
        var url = $location.path();
        var urlArray = url.split("/");
        var clientId = urlArray[3];

        $.post('../server/service/baseUrl.php', {session: clientId}, function(data) {
            var linkForm = data.app + "form.html#/form/" + clientId + '/';

            $scope.link = item.link;
            $scope.alt = item.alt;
            $scope.blank = item.blank;
            $scope.formShow = data.formShow;
            $scope.formLink = false;

            if ( item.formLink === "true" || item.formLink === true ) {
                $scope.formLink = true;
            }

            if ($scope.link == undefined) {
                $scope.link = "";
            }

            if ($scope.alt == undefined) {
                $scope.alt = "";
            }

            if ($scope.blank == undefined) {
                $scope.blank = false;
            }

            // $scope.formLink = !!$scope.formLink;

            $scope.clickFormLinkCheckbox = function () {
                $scope.formLink=!$scope.formLink;
                $scope.link = '' ;

                if ($scope.formLink == true) {
                    $scope.link = linkForm;
                }
            };

            $scope.ok = function () {
                $modalInstance.close({alt : $scope.alt, link : $scope.link, blank : $scope.blank, formLink: $scope.formLink});
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        },'json'
    );
});
