'use strict';

angular.module('netMessage.sliderSettings', ['ngRoute'])
    .controller('SliderSettingsCtrl', ['$scope', '$rootScope', '$modal', '$location', function ($scope, $rootScope, $modal, $location) {
        $("#logo-src").fileinput({
            browseClass: "btn btn-file btn-primary btn-block m-t-md",
            showCaption: false,
            showRemove: false,
            showUpload: false,
            showPreview: false,
            browseLabel: "Choisissez une ou plusieurs images"
        });

        $scope.sortableOptions = {
            containment: '#sortable-container',
            containerPositioning: 'relative',
            additionalPlaceholderClass: "slider_img",
            //restrict move across columns. move only within column.
            orderChanged: function (event) {
                $rootScope.data.components.slider.imageList = $scope.imageList;
            }
        };



        $scope.itemTypes = [
            "Diaporama", "Galerie"
        ];

        $scope.imageFormats = [
            { "name": "Carré", "value": "square" },
            { "name": "Paysage", "value": "landscape" },
            { "name": "Portrait", "value": "portrait" }
        ];

        $scope.itemEffects = [
            "Standard"
        ];

        // $scope.itemEffects = [
        //     "Standard", "Book", "Carousel", "Cube", "Rotate", "Stack"
        // ];

        $scope.itemUnits = [
            "€", "$", "£", "Autre"
        ];

        $scope.nbImageList = [
            "1", "2", "3"
        ];

        $scope.fontNames = [
            'Arial Bold', 'Arial Rounded Bold', 'Calibri', 'Century Gothic', 'Comic Sans MS', 'Courier New',
            'Helvetica', 'Helvetica Narrow', 'Helvetica Black', 'Helvetica Light', 'Impact', 'Neuropol',
            'Palatino Roman', 'Tahoma', 'Take Cover', 'Times New Roman', 'Verdana',
        ];

        $scope.init = function () {
            function formattedValue(val) {
                val = parseInt(val);

                switch (val) {
                    case 0:
                        return 0;
                    case 1:
                        return 1;
                    case 2:
                        return 2;
                    case 3:
                        return 3;
                    case 4:
                        return 4;
                    default:
                        return 0;
                }
            }

            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }

            var textSizeSlider = "";
            var buttonTextSizeSlider = '';

            if ($rootScope.data.components.slider == undefined) {
                $rootScope.data.components.slider = new Object();
                $rootScope.data.components.slider.imageList = new Array();
                $rootScope.data.components.slider.showSlider = ($scope.defaultData.components.slider.showSlider.toString() == "true" ? true : false);
                $rootScope.data.components.slider.sliderLoop = ($scope.defaultData.components.slider.sliderLoop.toString() == "true" ? true : false);
                $rootScope.data.components.slider.automatic = ($scope.defaultData.components.slider.automatic.toString() == "true" ? true : false);
                $rootScope.data.components.slider.sliderType = $scope.defaultData.components.slider.sliderType;
                $rootScope.data.components.slider.effect = $scope.defaultData.components.slider.effect;
                $rootScope.data.components.slider.nbImages = 1;
            } else if ($rootScope.data.components.slider.showSlider == undefined) {
                $rootScope.data.components.slider.showSlider = ($scope.defaultData.components.slider.showSlider.toString() == "true" ? true : false);
            } else if ($rootScope.data.components.slider.sliderLoop == undefined) {
                $rootScope.data.components.slider.sliderLoop = ($scope.defaultData.components.slider.sliderLoop.toString() == "true" ? true : false);
            } else if ($rootScope.data.components.slider.sliderType == undefined) {
                $rootScope.data.components.slider.sliderType == $scope.defaultData.components.slider.sliderType;
            } else if ($rootScope.data.components.slider.effect == undefined) {
                $rootScope.data.components.slider.effect == $scope.defaultData.components.slider.effect;
            }
            else if ($rootScope.data.components.slider.automatic == undefined) {
                $rootScope.data.components.slider.automatic = ($scope.defaultData.components.slider.automatic.toString() == "true" ? true : false);
            }

            //Couleur de fond du module
            $scope.bgColor = $rootScope.data.components.slider.bgColor;

            $scope.$watch("bgColor", function (newValue,oldValue) {
                $rootScope.data.components.slider.bgColor = newValue;
                if($rootScope.data.components.slider.button.bgColor == oldValue){
                    $rootScope.data.components.slider.button.bgColor = newValue;
                    $scope.button.bgColor = newValue;
                }
            });

            if ($scope.bgColor == undefined) {
                $scope.bgColor = $rootScope.defaultData.components.slider.bgColor;
            }

            var colorPicker = $('.bgColor');
            colorPicker.colpick({
                color: $scope.bgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.bgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    colorPicker.colpickHide();
                }
            });

            //Police
            if ($rootScope.data.components.slider.font.name == undefined || $rootScope.data.components.slider.font.name == "") {
                $scope.fontname = 'Calibri';
            } else {
                $scope.fontname = $rootScope.data.components.slider.font.name;
            }
            $scope.$watch("fontname", function (newValue, oldValue) {
                $rootScope.data.components.slider.font.name = newValue;
            });

            //Bouton
            $scope.button = [];

            //Libellé du bouton
            $scope.button.text = $rootScope.data.components.slider.button.text;

            $scope.$watch("button.text", function (newValue) {
                $rootScope.data.components.slider.button.text = newValue;
            });

            if ($scope.button.text == undefined) {
                $scope.button.text = $rootScope.defaultData.components.slider.button.text;
            }

            //Couleur du fond de bouton
            $scope.button.bgColor = $rootScope.data.components.slider.button.bgColor;

            $scope.$watch("button.bgColor", function (newValue) {
                $rootScope.data.components.slider.button.bgColor = newValue;
            });

            if ($scope.button.bgColor == undefined) {
                $scope.button.bgColor = $rootScope.defaultData.components.slider.bgColor;
            }

            var buttonBgColorPicker = $('.buttonBgColor');
            buttonBgColorPicker.colpick({
                color: $scope.button.bgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.button.bgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    buttonBgColorPicker.colpickHide();
                }
            });

            //Couleur du texte de bouton
            $scope.button.textColor = $rootScope.data.components.slider.button.textColor;

            $scope.$watch("button.textColor", function (newValue,oldValue) {
                $rootScope.data.components.slider.button.textColor = newValue;
            });

            if ($scope.button.textColor == undefined) {
                $scope.button.textColor = $rootScope.defaultData.components.slider.button.textColor;
            }

            var buttonTextColorPicker = $('.buttonTextColor');
            buttonTextColorPicker.colpick({
                color: $scope.button.textColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.button.textColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    buttonTextColorPicker.colpickHide();
                }
            });

            //Taille texte du bouton
            if ($rootScope.data.components.slider.button.textSize == undefined || $rootScope.data.components.slider.button.textSize == "") {
                $scope.button.textSize = 13;
            } else {
                $scope.button.textSize = $rootScope.data.components.slider.button.textSize;
            }

            //Description
            $scope.description = [];

             //Couleur du texte de description
             $scope.description.textColor = $rootScope.data.components.slider.description.textColor;

             $scope.$watch("description.textColor", function (newValue, oldValue) {
                 $rootScope.data.components.slider.description.textColor = newValue;
                 if ($scope.price.textColor == oldValue) {
                     $scope.price.textColor = newValue;
                 }
             });
 
             if ($scope.description.textColor == undefined) {
                 $scope.description.textColor = $rootScope.defaultData.components.slider.description.textColor;
             }
 
             var descriptionTextColorPicker = $('.descriptionTextColor');
             descriptionTextColorPicker.colpick({
                 color: $scope.description.textColor.replace("#", ""),
                 onChange: function ($hsb, $hexa) {
                     $scope.$apply(function () {
                         $scope.description.textColor = "#" + $hexa;
                     });
                 },
                 onSubmit: function (a, b, c) {
                     descriptionTextColorPicker.colpickHide();
                 }
             });
             
            //Taille texte
            if ($rootScope.data.components.slider.textSize == undefined || $rootScope.data.components.slider.textSize == "") {
                $scope.textSize = 13;
            } else {
                $scope.textSize = $rootScope.data.components.slider.textSize;
            }

            $scope.$watch("textSize", function (newValue, oldValue) {
                $rootScope.data.components.slider.textSize = newValue;
            });

            //Format des images
            if ($rootScope.data.components.slider.imageFormat == undefined || $rootScope.data.components.slider.imageFormat == "") {
                $scope.imageFormat = "square";
            } else {
                $scope.imageFormat = $rootScope.data.components.slider.imageFormat;
            }

            $scope.$watch("imageFormat", function (newValue, oldValue) {
                $rootScope.data.components.slider.imageFormat = newValue;
            });


            //Prix
            $scope.price = [];

            //Couleur du texte prix
            $scope.price.textColor = $rootScope.data.components.slider.price.textColor;

            $scope.$watch("price.textColor", function (newValue) {
                $rootScope.data.components.slider.price.textColor = newValue;
            });

            if ($scope.price.textColor == undefined) {
                $scope.price.textColor = $rootScope.defaultData.components.slider.price.textColor;
            }

            var priceTextColorPicker = $('.priceTextColor');
            priceTextColorPicker.colpick({
                color: $scope.price.textColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.price.textColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    priceTextColorPicker.colpickHide();
                }
            });


            if ($rootScope.data.components.slider.price.unit != "€" && $rootScope.data.components.slider.price.unit != "$" && $rootScope.data.components.slider.price.unit != "£") {
                $scope.unit = 'Autre';
                $scope.price.unit = $rootScope.data.components.slider.price.unit;
            } else {
                $scope.unit = $rootScope.data.components.slider.price.unit;
            }
            //Unité de prix

            $scope.$watch("unit", function (newValue, oldValue) {
                $scope.unit = newValue;
                if (newValue == "Autre") {
                    $scope.showOther = true;
                    if (oldValue != newValue) {
                        $scope.price.unit = "";
                    }
                } else {
                    $scope.showOther = false;
                    $rootScope.data.components.slider.price.unit = newValue;
                }
            });

            $scope.$watch("price.unit", function (newValue) {
                $scope.price.unit = newValue;
                $rootScope.data.components.slider.price.unit = $scope.price.unit;
            });

            if ($scope.price.unit == undefined) {
                $scope.price.unit = $rootScope.defaultData.components.slider.price.unit;
            }

            $scope.spaceSize = $rootScope.data.components.slider.spaceSize;

            if ($rootScope.data.components.slider.spaceSize == undefined) {
                $scope.spaceSize = $rootScope.defaultData.components.slider.spaceSize;
            }

            var spaceSizeSlider = $("input.spaceSizeSlider").slider({
                ticks: [0, 1, 2, 3, 4],
                value: formattedValue($scope.spaceSize),
                formatter: function (value) {
                    switch (value) {
                        case 0:
                            return "Pas d'espacement";
                        case 1:
                            return "Petit";
                        case 2:
                            return "Moyen";
                        case 3:
                            return "Grand";
                        case 4:
                            return "Très grand";
                        default:
                            return "";
                    }
                }
            }).on("change", function (e) {
                $scope.spaceSize = parseInt(e.value.newValue);

                $rootScope.$apply(function () {
                    $rootScope.data.components.slider.spaceSize = e.value.newValue;
                });
            }).data('slider_third');

            //images
            if (Array.isArray($rootScope.data.components.slider.imageList) === false) {
                $rootScope.data.components.slider.imageList = [];
            }

            if (Number.isNaN($rootScope.data.components.slider.nbImages)) {
                $scope.nbImages = 1;
            } else {
                $scope.nbImages = Number($rootScope.data.components.slider.nbImages);
            }

            $scope.showSlider = ($scope.data.components.slider.showSlider.toString() == "true" ? true : false);

            $scope.loop = ($scope.data.components.slider.sliderLoop.toString() == "true" ? true : false);

            $scope.automatic = ($scope.data.components.slider.automatic.toString() == "true" ? true : false);

            $scope.imageList = $rootScope.data.components.slider.imageList;

            $scope.sliderType = $rootScope.data.components.slider.sliderType;

            $scope.effect = $rootScope.data.components.slider.effect;

            $scope.$watchCollection("imageList", function (newValue, oldValue) {
                $rootScope.data.components.slider.imageList = newValue;
            });

            $scope.$watch("showSlider", function (newValue, oldValue) {
                $rootScope.data.components.slider.showSlider = newValue;
            });

            $scope.$watch("loop", function (newValue, oldValue) {
                $rootScope.data.components.slider.sliderLoop = newValue;
            });

            $scope.$watch("automatic", function (newValue, oldValue) {
                $rootScope.data.components.slider.automatic = newValue;
            });

            $scope.$watch("sliderType", function (newValue, oldValue) {
                $rootScope.data.components.slider.sliderType = newValue;

                if ($rootScope.data.components.slider.sliderType == "Galerie") {
                    $scope.show = false;
                } else {
                    $scope.show = true;
                }
            });

            $scope.$watch("effect", function (newValue, oldValue) {
                $rootScope.data.components.slider.effect = newValue;
            });

            var nbImagesSlider = $("input.nbImagesSlider").slider({
                min: 1,
                max: 3,
                ticks: [1, 2, 3],
                value: parseInt($scope.nbImages)
            }).on("change", function (e) {
                $scope.nbImages = parseInt(e.value.newValue);

                $rootScope.$apply(function () {
                    $scope.nbImages = parseInt(e.value.newValue);
                });
            }).data('slider_third');

            $scope.$watch("imageFormat", function (newValue, oldValue) {
                $rootScope.data.components.slider.imageFormat = newValue;
                setdefaultsize($scope.nbImages,newValue);
            });
            function setdefaultsize(nbImages, imageFormat) {
                //taille dynamique des textes DEBUT
                if (imageFormat == "square") {
                    if (nbImages == 1) {
                        $scope.textSize = 22;
                        $scope.button.textSize = 22;
                    } else if (nbImages == 2) {
                        $scope.textSize = 12;
                        $scope.button.textSize = 12;
                    } else {
                        $scope.textSize = 10;
                        $scope.button.textSize = 10;
                    }
                }

                if (imageFormat == "landscape") {
                    if (nbImages == 1) {
                        $scope.textSize = 22;
                        $scope.button.textSize = 22;
                    } else if (nbImages == 2) {
                        $scope.textSize = 10;
                        $scope.button.textSize = 10;
                    } else {
                        $scope.textSize = 8;
                        $scope.button.textSize = 8;
                    }
                }

                if (imageFormat == "portrait") {
                    if (nbImages == 1) {
                        $scope.textSize = 22;
                        $scope.button.textSize = 22;
                    } else if (nbImages == 2) {
                        $scope.textSize = 15;
                        $scope.button.textSize = 15;
                    } else {
                        $scope.textSize = 13;
                        $scope.button.textSize = 13;
                    }
                }

                var min = 0;
                var max = 0;
                var minbtn = 0;
                var maxbtn = 0;

                if (imageFormat == "square") {
                    if (nbImages.toString() == "1") {
                        min = 15;
                        max = 30;
                        minbtn = 15;
                        maxbtn = 30;
                    } else if (nbImages.toString() == "2") {
                        min = 8;
                        max = 20;
                        minbtn = 8;
                        maxbtn = 20;
                    } else {
                        min = 5;
                        max = 15;
                        minbtn = 5;
                        maxbtn = 15;
                    }
                }

                if (imageFormat == "landscape") {
                    if (nbImages.toString() == "1") {
                        min = 15;
                        max = 30;
                        minbtn = 15;
                        maxbtn = 30;
                    } else if (nbImages.toString() == "2") {
                        min = 8;
                        max = 17;
                        minbtn = 8;
                        maxbtn = 16;
                    } else {
                        min = 5;
                        max = 13;
                        minbtn = 5;
                        maxbtn = 13;
                    }
                }

                if (imageFormat == "portrait") {
                    if (nbImages.toString() == "1") {
                        min = 15;
                        max = 30;
                        minbtn = 15;
                        maxbtn = 30;
                    } else if (nbImages.toString() == "2") {
                        min = 10;
                        max = 25;
                        minbtn = 10;
                        maxbtn = 25;
                    } else {
                        min = 10;
                        max = 20;
                        minbtn = 10;
                        maxbtn = 20;
                    }
                }


                textSizeSlider = $("input.textSizeSlider").slider({
                    min: min,
                    max: max,
                    value: parseInt($scope.textSize)
                }).on("change", function (e) {
                    $scope.textSize = parseInt(e.value.newValue);

                    $rootScope.$apply(function () {
                        $scope.textSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');

                $scope.$watch("textSize", function (newValue, oldValue) {
                    $rootScope.data.components.slider.textSize = newValue;
                });

                buttonTextSizeSlider = $("input.buttonTextSizeSlider").slider({
                    min: minbtn,
                    max: maxbtn,
                    value: parseInt($scope.button.textSize)
                }).on("change", function (e) {
                    $scope.button.textSize = parseInt(e.value.newValue);

                    $rootScope.$apply(function () {
                        $scope.button.textSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');

                $scope.$watch("button.textSize", function (newValue, oldValue) {
                    $rootScope.data.components.slider.button.textSize = newValue;
                });

                $("input.textSizeSlider").slider('refresh');
                $("input.buttonTextSizeSlider").slider('refresh');
                //taille dynamique des textes et boutons FIN
            }

            $scope.$watch("nbImages", function (newValue, oldValue) {
                $rootScope.data.components.slider.nbImages = newValue;
                setdefaultsize(newValue,$scope.imageFormat);
            });
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


        $scope.open = function (image) {
            var index = $scope.imageList.indexOf(image);
            $rootScope.descEmpty = false;
            if ($scope.imageList[index].text == "" && $scope.imageList[index].price == "0" || $scope.imageList[index].text == "Votre texte ici" && $scope.imageList[index].price == "0") {
                $rootScope.descEmpty = true;
            }
            var modalInstance = $modal.open({
                templateUrl: 'components/sliderComponent/sliderSettingsModal.html',
                controller: 'SliderSettingsModalCtrl',
                size: index,
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    items: function () {
                        return $scope.imageList;
                    }
                }
            });

            modalInstance.result.then(
                function (selectedItem) {
                    if ($scope.sliderType.toString() == 'Galerie') {
                        if ($rootScope.descEmpty) {
                            $scope.imageList.splice(index, 1);
                        } else {
                            if (selectedItem) {
                                $scope.imageList.splice(index, 1);
                            } else {
                                image.src = "../server/service/slider/black.jpg";
                                image.cropped = "";
                            }
                        }
                    } else {
                        $scope.imageList.splice(index, 1);
                    }
                },
                function () { }
            );
        };


        $scope.delete = function (index) {

            $scope.open(index);
        }


        $scope.openDesc = function (image) {
            var index = $scope.imageList.indexOf(image);
            $rootScope.currentImage = index;
            var modalInstance = $modal.open({
                templateUrl: 'components/sliderComponent/sliderSettingsDescModal.html',
                controller: 'SliderSettingsDescModalCtrl',
                size: index,
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    item: function () {
                        return $scope.imageList[$rootScope.currentImage];

                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if (selectedItem.applyAll == true) {
                    var count = 0;

                    angular.forEach($scope.imageList, function (itm) {
                        if (count != $rootScope.currentImage) {
                            itm.link = selectedItem.link;
                            //  itm.applyAll = true;
                        }

                        count++;
                    });
                }

                $scope.imageList[$rootScope.currentImage].text = selectedItem.text;
                $scope.imageList[$rootScope.currentImage].link = selectedItem.link;
                $scope.imageList[$rootScope.currentImage].blank = selectedItem.blank;
                $scope.imageList[$rootScope.currentImage].oldPrice = selectedItem.oldPrice;
                $scope.imageList[$rootScope.currentImage].price = selectedItem.price;
                //    $scope.imageList[index].applyAll = selectedItem.applyAll;
            }, function () { });
        }

        $scope.openLink = function (image) {
            var index = $scope.imageList.indexOf(image);

            var modalInstance = $modal.open({
                templateUrl: 'components/sliderComponent/sliderSettingsLinkModal.html',
                controller: 'SliderSettingsLinkModalCtrl',
                size: index,
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    item: function () {
                        return $scope.imageList[index];
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if (selectedItem.applyAll == true) {
                    var count = 0;

                    angular.forEach($scope.imageList, function (itm) {
                        if (count != index) {
                            itm.link = selectedItem.link;
                            //  itm.applyAll = true;
                        }

                        count++;
                    });
                }

                $scope.imageList[index].alt = selectedItem.alt;
                $scope.imageList[index].link = selectedItem.link;
                $scope.imageList[index].blank = selectedItem.blank;
                $scope.imageList[index].formLink = selectedItem.formLink;
                //    $scope.imageList[index].applyAll = selectedItem.applyAll;
            }, function () { });
        }

        $("#logo-src").change(function (event) {
            readFile(event);
        });
        function readFile(event) {
            for (var i = 0; i < event.target.files.length; i++) {
                if ((/\.(gif|jpg|jpeg|png)$/i).test(event.target.files[i].name)) {
                    if(event.target.files[i].size/1024/1024 <= 5){
                        $rootScope.imageCountSize = $rootScope.imageCountSize + event.target.files[i].size/1024/1024;
                        upload(event.target.files[i]);
                    }else{
                        alert("Votre fichier " + event.target.files[i].name + " est trop volumineux, la taille maximale autorisée est de 5Mo");
                    }
                } else {
                    alert("Votre fichier " + event.target.files[i].name + " n'est pas au format png, jpg ou gif.");
                }
            }
        }

        function upload(file) {
            var xhr = new XMLHttpRequest();
            var formData = new FormData();

            formData.append("logo", file);
            formData.append("session", $rootScope.clientid); //TODO session link

            if (Array.isArray($rootScope.data.components.slider.imageList) === false) {
                $rootScope.data.components.slider.imageList = [];
            }

            var index = $rootScope.data.components.slider.imageList.length;

            $scope.$apply(function () {
                $rootScope.data.components.slider.imageList.push(new Object());
                $rootScope.data.components.slider.imageList[index].src = "chargement.png";
                $rootScope.data.components.slider.imageList[index].cropped = "chargement.png";
                $rootScope.data.components.slider.imageList[index].text = "Votre texte ici";
                $rootScope.data.components.slider.imageList[index].link = "";
                $rootScope.data.components.slider.imageList[index].blank = false;
                $rootScope.data.components.slider.imageList[index].price = "0";
                $rootScope.data.components.slider.imageList[index].oldPrice = "0";
                $rootScope.data.components.slider.imageList[index].progress = 0;
            });

            xhr.upload.onprogress = function (e) {
                var done = e.loaded || e.position, total = e.total || e.totalSize;
                var pourc = (Math.floor(done / total * 100));

                $scope.$apply(function () {
                    $rootScope.data.components.slider.imageList[index].progress = pourc;
                });
            };

            xhr.onload = function () {
                var response = xhr.responseText;
                response = JSON.parse(response);
                $scope.$apply(function () {
                    $rootScope.data.components.slider.imageList[index].src = response.file + "?t=" + Date.now();
                    $rootScope.data.components.slider.imageList[index].cropped = response.filename + "?t=" + Date.now();
                });
            };

            xhr.open('post', "../server/service/postSlider.php");
            xhr.send(formData);
        }
    }]).controller('SliderSettingsModalCtrl', function ($scope, $rootScope, $modalInstance, items) {
        $scope.ok = function () {
            $modalInstance.close($scope.checkbox);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.checkbox = false;
        $scope.showCheck = false;
        $scope.descEmpty = $rootScope.descEmpty;
        $scope.sliderType = $rootScope.data.components.slider.sliderType;
        if ($scope.sliderType.toString() == "Galerie") {
            $scope.showCheck = true;
        }

    }).controller('SliderSettingsDescModalCtrl', function ($scope, $rootScope, $modalInstance, $modal, $location, item) {
        var url = $location.path();
        var urlArray = url.split("/");
        var clientId = urlArray[3];

        $scope.formLink = false;
        $scope.applyAll = false;

        if (item.formLink === "true" || item.formLink === true) {
            $scope.formLink = true;
        }

        $("#inputUnit").change(function (event) {
            console.log($('#inputUnit').val());
        });

        $scope.openCrop = function (image) {
            var index = $scope.imageList.indexOf(image);
            $rootScope.currentImage = index;
            var modalInstance = $modal.open({
                templateUrl: 'components/sliderComponent/cropImage.html',
                controller: 'cropImageCtrl',
                backdrop: "static",
                keyboard: "false",
                resolve: {
                    item: function () {
                        return $scope.imageList[index];
                    },
                }
            });
        }

        $scope.imageList = $rootScope.data.components.slider.imageList;

        if ($rootScope.data.components.slider.sliderType == "Galerie") {
            $scope.show = false;
        } else {
            $scope.show = true;
        }

        function readFileNewUpload(event) {
            for (var i = 0; i < event.target.files.length; i++) {
                if ((/\.(gif|jpg|jpeg|png)$/i).test(event.target.files[i].name)) {
                    newUploadFile(event.target.files[i]);
                } else {
                    alert("Votre fichier " + event.target.files[i].name + " n'est pas au format png, jpg ou gif.");
                }
            }
        }

        function newUploadFile(file) {
            var xhr = new XMLHttpRequest();
            var formData = new FormData();

            formData.append("logo", file);
            formData.append("session", $rootScope.clientid); //TODO session link

            var indexNew = $rootScope.currentImage;

            $scope.$apply(function () {
                $rootScope.data.components.slider.imageList[indexNew].src = "../server/service/slider/chargement.png";
                $rootScope.data.components.slider.imageList[indexNew].cropped = "../server/service/slider/chargement.png";
            });

            xhr.onload = function () {
                var response = xhr.responseText;
                response = JSON.parse(response);

                $scope.$apply(function () {
                    $rootScope.data.components.slider.imageList[indexNew].src = response.file + "?t=" + Date.now();
                    $rootScope.data.components.slider.imageList[indexNew].cropped = response.filename + "?t=" + Date.now();
                });
            };

            xhr.open('post', "../server/service/postSlider.php");
            xhr.send(formData);
        }

        $scope.uploadfile = function () {
            document.getElementById("imageUp").click();
        }

        $.post('../server/service/baseUrl.php', { session: clientId }, function (data) {
            var linkForm = data.app + "form.html#/form/" + clientId + '/';
            function init() {
                $scope.currentImage = $rootScope.currentImage;
                $scope.image = $scope.imageList[$scope.currentImage];

                if($scope.image.blank === "false"){
                    $scope.image.blank = false;
                }else if($scope.image.blank === "true"){
                    $scope.image.blank = true;
                }

                $scope.$watch("image.price", function (newValue) {
                    if(newValue==null || newValue.toString()=='0'){
                        $scope.image.price = '0';
                        $scope.image.oldPrice = '0';
                    }else{
                        $scope.image.price == newValue;
                    }
                   
                });

                $scope.$watch("image.oldPrice", function (newValue) {
                    if(newValue==null || newValue.toString()=='0'){
                        $scope.image.oldPrice = '0';
                    }else{
                        $scope.image.oldPrice == newValue;
                    }
                   
                });

                if ($scope.image.price != undefined && $scope.image.price != '') {
                    $scope.image.price = parseFloat($scope.image.price, 10);
                }
                if ($scope.image.oldPrice != undefined && $scope.image.oldPrice != '') {
                    $scope.image.oldPrice = parseFloat($scope.image.oldPrice, 10);
                }

                $scope.src = $scope.image.src;
                $("#imageUp").change(function (event) {
                    readFileNewUpload(event);
                });

            }
            init();

            function applyUrlToAll() {
                if ($scope.applyAll == true) {
                    angular.forEach($scope.imageList, function (itm) {
                        itm.link = $scope.image.link;
                    });
                }
                $scope.applyAll = false;
            }

            $scope.cancel = function () {
                applyUrlToAll();
                $modalInstance.dismiss('cancel');
            };

            $scope.nextImage = function () {
                applyUrlToAll();
                if ($rootScope.currentImage < $scope.imageList.length - 1) {
                    $rootScope.currentImage = $rootScope.currentImage + 1;
                } else {
                    $rootScope.currentImage = 0;
                }
                $scope.currentImage = $rootScope.currentImage;
                init();
            }

            $scope.previousImage = function () {
                applyUrlToAll();
                if ($rootScope.currentImage >= 1) {
                    $rootScope.currentImage = $rootScope.currentImage - 1;
                } else {
                    $rootScope.currentImage = $scope.imageList.length - 1;
                }
                $scope.currentImage = $rootScope.currentImage;
                init();
            }
        }, 'json');


    }).controller('SliderSettingsLinkModalCtrl', function ($scope, $modalInstance, $location, item) {
        var url = $location.path();
        var urlArray = url.split("/");
        var clientId = urlArray[3];

        $.post('../server/service/baseUrl.php', { session: clientId }, function (data) {
            var linkForm = data.app + "form.html#/form/" + clientId + '/';

            $scope.link = item.link;
            $scope.alt = item.alt;

            if(item.blank === "false"){
                $scope.blank = false;
            }else if(item.blank === "true"){
                $scope.blank = true;
            }
            
            $scope.formShow = data.formShow;
            $scope.formLink = false;

            if (item.formLink === "true" || item.formLink === true) {
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

            $scope.applyAll = false;

            $scope.clickFormLinkCheckbox = function () {
                $scope.formLink = !$scope.formLink;
                $scope.link = '';

                if ($scope.formLink == true) {
                    $scope.link = linkForm;
                }
            };

            $scope.ok = function () {
                $modalInstance.close({ alt: $scope.alt, link: $scope.link, blank: $scope.blank, formLink: $scope.formLink, applyAll: $scope.applyAll });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }, 'json');

    }).controller('cropImageCtrl', function ($scope, $rootScope, $modal, $location, $modalInstance, item) {
        function init() {

            $scope.imageFormat = $rootScope.data.components.slider.imageFormat;
            $scope.myImage = item.src;
            $scope.targetDir = '../files/' + $rootScope.clientid + '/slider/' + $scope.imageFormat + '/' + item.cropped;

            if ($scope.imageFormat == "landscape") {
                $scope.width = 400;
                $scope.height = 300;
            } else if ($scope.imageFormat == "square") {
                $scope.width = 400;
                $scope.height = 400;
            } else if ($scope.imageFormat == "portrait") {
                $scope.width = 300;
                $scope.height = 400;
            }
            var $uploadCrop;
            if (item.pointsCrop != undefined) {
                $scope.$uploadCrop = $('#upload-demo').croppie({
                    url: $scope.myImage,
                    points: item.pointsCrop.points,
                    zoom: item.pointsCrop.zoom,
                    viewport: {
                        width: $scope.width,
                        height: $scope.height,
                        type: 'square'
                    },
                    boundary: {
                        width: 450,
                        height: 450
                    }
                });
            } else {
                $scope.$uploadCrop = $('#upload-demo').croppie({
                    url: $scope.myImage,
                    viewport: {
                        width: $scope.width,
                        height: $scope.height,
                        type: 'square'
                    },
                    boundary: {
                        width: 450,
                        height: 450
                    }
                });
                setTimeout(function () {
                    $scope.$uploadCrop.croppie('setZoom', '0.1');
                }, 1000);
            }
        }

        $scope.croppie = function () {
            $scope.$uploadCrop.croppie('result', {
                type: 'base64',
                format: 'png',
                size: { width: $scope.width, height: $scope.height }
            }).then(function (resp) {
                $rootScope.myCroppedImage = resp;
                var dataURI = $rootScope.myCroppedImage;
                var file = dataURItoBlob(dataURI, 'image/png');
                var fdata = new FormData();
                var xhr = new XMLHttpRequest();
                // blob is the output from the convertToBlob method
                fdata.append('filecropped', file, 'a.jpg');
                $scope.filename = item.cropped.split("?t=")[0];
                fdata.append('filename', $scope.filename);
                fdata.append('imageFormat', $scope.imageFormat);
                fdata.append("session", $rootScope.clientid);
                xhr.onload = function () {
                    var response = xhr.responseText;
                    response = JSON.parse(response);
                    $scope.$apply(function () {
                        item.cropped = response.file + "?t=" + Date.now();
                    });

                    $modalInstance.close();
                };

                xhr.open('post', "../server/service/postSliderCrop.php");
                xhr.send(fdata);

                item.pointsCrop = ($('#upload-demo').croppie('get'));
            });
        }

        setTimeout(function () {
            $scope.$apply(function () {
                init();
            });

        }, 100);

        function dataURItoBlob(dataURI, type) {
            // convert base64 to raw binary data held in a string
            var byteString = window.atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            // write the ArrayBuffer to a blob, and you're done
            var bb = new Blob([ab], { type: type });
            return bb;
        }

        $scope.cancel = function () {
            $modalInstance.close();
        }

    });


