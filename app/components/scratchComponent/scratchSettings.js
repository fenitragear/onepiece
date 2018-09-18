'use strict';

angular.module('netMessage.scratchSettings', ['ngRoute'])
	.controller('ScratchSettingsCtrl', ['$scope', '$rootScope', '$modal', '$location', function ($scope, $rootScope, $modal, $location) {

		$scope.sortableOptions = {};

		$scope.init = function () {
			$scope.nav = "images";
			$scope.linkForm = '';
			$scope.currentIndex = -1;
			if ($rootScope.data.modeSettings.modeType == "2") {
				$location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
			}

			if ($rootScope.data.components.scratch == undefined) {
				$rootScope.data.components.scratch = new Object();
				$rootScope.data.components.scratch.imageSimpleList = new Array();
				$rootScope.data.components.scratch.imageGagnantPerdantList = new Array();
				$rootScope.data.components.scratch.imageDynamiquePourcentList = new Array();
				$rootScope.data.components.scratch.imageDynamiqueNombreList = new Array();
				$rootScope.data.components.scratch.imagePersonnaliseList = new Array();
				$rootScope.data.components.scratch.showScratch = false;
				$rootScope.data.components.scratch.ouvrir = false;
				$rootScope.data.components.scratch.lien = false;
				$rootScope.data.components.scratch.selectedType = 'gagnant_perdant';
				$rootScope.data.components.scratch.inputUrlAtterissage = '';
				$rootScope.data.components.scratch.inputDuree = 0;
				$rootScope.data.components.scratch.inputPourcentage = 80;
				$rootScope.data.components.scratch.inputSize = 3;
			} else {
				if ($rootScope.data.components.scratch.showScratch == undefined) {
					$rootScope.data.components.scratch.showScratch = false;
					$rootScope.data.components.scratch.ouvrir = false;
					$rootScope.data.components.scratch.lien = false;
				}
				if ($rootScope.data.components.scratch.selectedType == undefined) {
					$rootScope.data.components.scratch.selectedType = 'gagnant_perdant';
				}
			}

			if ($rootScope.data.components.scratch.imageSimpleList == undefined) {
				$rootScope.data.components.scratch.imageSimpleList = new Array();
				$rootScope.data.components.scratch.imageGagnantPerdantList = new Array();
				$rootScope.data.components.scratch.imageDynamiquePourcentList = new Array();
				$rootScope.data.components.scratch.imageDynamiqueNombreList = new Array();
				$rootScope.data.components.scratch.imagePersonnaliseList = new Array();
				$rootScope.data.components.scratch.showScratch = false;
				$rootScope.data.components.scratch.ouvrir = false;
				$rootScope.data.components.scratch.lien = false;
				$rootScope.data.components.scratch.selectedType = 'gagnant_perdant';
				$rootScope.data.components.scratch.inputUrlAtterissage = '';
				$rootScope.data.components.scratch.inputDuree = 0;
				$rootScope.data.components.scratch.inputPourcentage = 80;
				$rootScope.data.components.scratch.inputSize = 3;

				reinitScratchSimple();
				reinitScratchGagnantPerdant();
				reinitScratchDynamiquePourcent();
				reinitScratchDynamiqueNombre();
				reinitScratchPersonnalise();
			}

			$scope.showScratch = ($scope.data.components.scratch.showScratch.toString() == "true" ? true : false);
			$scope.ouvrir = ($scope.data.components.scratch.ouvrir.toString() == "true" ? true : false);
			$scope.lien = ($scope.data.components.scratch.lien.toString() == "true" ? true : false);
			$scope.selectedType = $scope.data.components.scratch.selectedType;

			if ($rootScope.data.components.scratch.inputUrlAtterissage == undefined) {
				$scope.inputUrlAtterissage = '';
			} else {
				$scope.inputUrlAtterissage = $rootScope.data.components.scratch.inputUrlAtterissage;
			}

			if (Number.isNaN($rootScope.data.components.scratch.inputDuree)) {
				$scope.inputDuree = 0;
			} else {
				$scope.inputDuree = Number($rootScope.data.components.scratch.inputDuree);
			}

			if (Number.isNaN($rootScope.data.components.scratch.inputPourcentage)) {
				$scope.inputPourcentage = 80;
			} else {
				$scope.inputPourcentage = Number($rootScope.data.components.scratch.inputPourcentage);
			}

			if (Number.isNaN($rootScope.data.components.scratch.inputSize)) {
				$scope.inputSize = 3;
			} else {
				var sliderValue = 3;
				switch (Number($rootScope.data.components.scratch.inputSize)) {
					case 30:
						sliderValue = 1; break;
					case 45:
						sliderValue = 2; break;
					case 55:
						sliderValue = 3; break;
					case 65:
						sliderValue = 4; break;
					case 75:
						sliderValue = 5; break;
					default:
						sliderValue = 3;
				}
				$scope.inputSize = sliderValue;
			}

			$scope.imageSimpleList = $rootScope.data.components.scratch.imageSimpleList;
			$scope.imageGagnantPerdantList = $rootScope.data.components.scratch.imageGagnantPerdantList;
			$scope.imageDynamiquePourcentList = $rootScope.data.components.scratch.imageDynamiquePourcentList;
			$scope.imageDynamiqueNombreList = $rootScope.data.components.scratch.imageDynamiqueNombreList;
			if ($scope.imageDynamiquePourcentList != undefined) {
				$scope.imageDynamiquePourcentNumber = $scope.imageDynamiquePourcentList.length - 1; // car on ne compte pas l'image à gratter
			} else {
				$scope.imageDynamiquePourcentNumber = 2;
			}
			if ($scope.imageDynamiqueNombreList != undefined) {
				$scope.imageDynamiqueNombreNumber = $scope.imageDynamiqueNombreList.length - 1; // car on ne compte pas l'image à gratter
			} else {
				$scope.imageDynamiqueNombreNumber = 2;
			}
			$scope.imagePersonnaliseList = $rootScope.data.components.scratch.imagePersonnaliseList;
			if ($scope.imagePersonnaliseList != undefined) {
				$scope.imagePersonnaliseNumber = $scope.imagePersonnaliseList.length - 1;
			} else {
				$scope.imagePersonnaliseNumber = 2;
			}

			$.post('../server/service/baseUrl.php', { session: $rootScope.clientid }, function (data) {
				$scope.formShow = data.formShow;
				if (data.formShow == false) {
					$scope.lien = false;
				}
			}, 'json');

			$scope.$watch("imageSimpleList", function (newValue, oldValue) {
				$rootScope.data.components.scratch.imageSimpleList = newValue;
				// if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/scratch/black.jpg') {
				// 	$scope.showScratch = false;
				// } else if (newValue != oldValue) {
				// 	$scope.showScratch = true;
				// }
			}, true);
			// $scope.$watch("imageGagnantPerdantList", function (newValue, oldValue) {
			// 	$rootScope.data.components.scratch.imageGagnantPerdantList = newValue;
			// 	if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/scratch/black.jpg') {
			// 		$scope.showScratch = false;
			// 	} else if (newValue != oldValue) {
			// 		$scope.showScratch = true;
			// 	}
			// }, true);
			// $scope.$watch("imageDynamiquePourcentList", function (newValue, oldValue) {
			// 	$rootScope.data.components.scratch.imageDynamiquePourcentList = newValue;
			// 	if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/scratch/black.jpg') {
			// 		$scope.showScratch = false;
			// 	} else if (newValue != oldValue) {
			// 		$scope.showScratch = true;
			// 	}
			// }, true);
			// $scope.$watch("imageDynamiqueNombreList", function (newValue, oldValue) {
			// 	$rootScope.data.components.scratch.imageDynamiqueNombreList = newValue;
			// 	if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/scratch/black.jpg') {
			// 		$scope.showScratch = false;
			// 	} else if (newValue != oldValue) {
			// 		$scope.showScratch = true;
			// 	}
			// }, true);
			// $scope.$watch("imageDynamiquePourcentNumber", function (newValue, oldValue) {
			// 	if (newValue != oldValue) {
			// 		if (newValue > oldValue) {
			// 			addInputFile();
			// 		}
			// 		else {
			// 			removeInputFile();
			// 		}
			// 	}
			// });
			// $scope.$watch("imageDynamiqueNombreNumber", function (newValue, oldValue) {
			// 	if (newValue != oldValue) {
			// 		if (newValue > oldValue) {
			// 			addInputFile();
			// 		}
			// 		else {
			// 			removeInputFile();
			// 		}
			// 	}
			// });
			// $scope.$watch("imagePersonnaliseList", function (newValue, oldValue) {
				// $rootScope.data.components.scratch.imagePersonnaliseList = newValue;
				// if (newValue != undefined && newValue[0] != undefined && newValue[0].src == '../server/service/scratch/black.jpg') {
				// 	$scope.showScratch = false;
				// } else if (newValue != oldValue) {
				// 	$scope.showScratch = true;
				// }
			// }, true);
			// $scope.$watch("imagePersonnaliseNumber", function (newValue, oldValue) {
				// if (newValue != oldValue) {
					// if (newValue > oldValue) {
						// addInputFile();
					// }
					// else {
						// var max = $scope.imagePersonnaliseList.length-1;
						// if($scope.imagePersonnaliseList[max].src=="../server/service/scratch/black.jpg"){
							// removeInputFile();
						// }
			// 		}
			// 	}
			// });

			$scope.$watch("showScratch", function (newValue, oldValue) {
				$rootScope.data.components.scratch.showScratch = newValue;
			});

			$scope.$watch("ouvrir", function (newValue, oldValue) {
				$rootScope.data.components.scratch.ouvrir = newValue;
				if (!newValue) {
					$scope.inputDuree = 0;
				}
			});

			$scope.$watch("lien", function (newValue, oldValue) {
				$rootScope.data.components.scratch.lien = newValue;
				if (newValue) {
					$.post('../server/service/baseUrl.php', { session: $rootScope.clientid }, function (data) {
						$scope.linkForm = data.app + "form.html#/form/" + $rootScope.clientid + '/';
						$scope.inputUrlAtterissage = $scope.linkForm;
						$scope.formShow = data.formShow;
					}, 'json');
				}
				else {
					if ($rootScope.data.components.scratch.inputUrlAtterissage == $scope.linkForm) { // si on a coché 'lien vers formulaire' et qu'on le decoche
						$scope.inputUrlAtterissage = '';
					}
				}
			});

			$scope.$watch("selectedType", function (newValue, oldValue) {
				if (newValue !== oldValue) {
					$rootScope.data.components.scratch.selectedType = newValue;

					if (newValue == "simple") {
						reinitScratchSimple();
					}
					else if (newValue == "gagnant_perdant") {
						reinitScratchGagnantPerdant();
					}
					else if (newValue == "dynamique_pourcent") {
						reinitScratchDynamiquePourcent();
					}
					else if (newValue == "dynamique_nombre") {
						reinitScratchDynamiqueNombre();
					}
					else if (newValue == "personnalise") {
						reinitScratchPersonnalise();
					}
				}
			});

			$scope.$watch("inputUrlAtterissage", function (newValue, oldValue) {
				$rootScope.data.components.scratch.inputUrlAtterissage = newValue;
			});

			$scope.$watch("inputDuree", function (newValue, oldValue) {
				$rootScope.data.components.scratch.inputDuree = newValue;
			});

			$scope.$watch("inputPourcentage", function (newValue, oldValue) {
				if (newValue < 1) {
					newValue = 1;
				}
				if (newValue == undefined) {
					newValue = 100;
				}
				$scope.inputPourcentage = newValue;
				$rootScope.data.components.scratch.inputPourcentage = newValue;
			});

			$scope.$watch("inputSize", function (newValue, oldValue) {
				var realValue = 55;
				switch (Number(newValue)) {
					case 1:
						realValue = 30; break;
					case 2:
						realValue = 45; break;
					case 3:
						realValue = 55; break;
					case 4:
						realValue = 65; break;
					case 5:
						realValue = 75; break;
					default:
						realValue = 55;
				}
				$rootScope.data.components.scratch.inputSize = realValue;
			});

			var slider = $("input.sizeSlider").slider({
				ticks: [1, 2, 3, 4, 5],
				value: $scope.inputSize,
				formatter: function (value) {
					switch (value) {
						case 1:
							return "Petit";
						case 2:
							return "Normal";
						case 3:
							return "Moyen";
						case 4:
							return "Grand";
						case 5:
							return "Très grand";
						default:
							return "";
					}
				}
			});

			if (slider != undefined) {
				slider.on("change", function () {
					$scope.inputSize = slider[0].value;

				}).data('slider')
			}

			var xhrz = new XMLHttpRequest();
			var formDataz = new FormData();
			formDataz.append("session", $rootScope.clientid);
			formDataz.append("imageCallback", $rootScope.data.components.scratch.finScratchCallback);

			xhrz.open('post', "../server/service/postScratch.php");
			xhrz.send(formDataz);
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

			var modalInstance = $modal.open({
				templateUrl: 'components/scratchComponent/scratchSettingsModal.html',
				controller: 'ScratchSettingsModalCtrl',
				backdrop: "static",
                keyboard: "false",
				size: index,
				resolve: {
					items: function () {
						return $scope.imageList;
					}
				}
			});

			modalInstance.result.then(
				function (selectedItem) {
					$scope.imageList.splice(index, 1);
				},
				function () { }
			);
		};

		$scope.delete = function (image) {
			image.src = "../server/service/scratch/black.jpg";
		}

		$scope.restoreDefaultImage = function (image) {
			var defaultScratchImage = "../server/service/scratch/image_a_gratter.png";
			image.src = defaultScratchImage;
		}

		$scope.openLink = function (image) {
			var index = 0;

			var modalInstance = $modal.open({
				templateUrl: 'components/scratchComponent/scratchSettingsParamModal.html',
				controller: 'ScratchSettingsLinkModalCtrl',
				size: index,
				backdrop: "static",
                keyboard: "false",
				resolve: {
					item: function () {
						return image;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				if ($scope.selectedType == 'gagnant_perdant') {
					image.number = selectedItem.nb; // watch handler fired here
					if (image.number > 0) {
						image.title = (image.number == 1) ? 'Image affichée pour le destinataire GAGNANT' : 'Image affichée pour les ' + image.number + ' destinataires GAGNANTS';
					}
					else {
						image.title = '';
					}
				}
				else if ($scope.selectedType == 'dynamique_pourcent') {
					var total = 0;
					$rootScope.data.components.scratch.imageDynamiquePourcentList.forEach(function (element) {
						if (element.percent != undefined && element.$$hashKey != selectedItem.itemId) {
							total += Number(element.percent);
						}
					}, this);
					if (selectedItem.percent == undefined) {
						selectedItem.percent = 100;
					}
					if (total + selectedItem.percent > 100) {
						selectedItem.percent = 100 - total;
					}
					image.percent = Number(selectedItem.percent);
					image.name = selectedItem.name;
					image.title = 'Image affichée pour ' + image.percent + '% de la liste';
				}
				else if ($scope.selectedType == 'dynamique_nombre') {
					var total = 0;
					$rootScope.data.components.scratch.imageDynamiqueNombreList.forEach(function (element) {
						if (element.nombre != undefined && element.$$hashKey != selectedItem.itemId) {
							total += Number(element.nombre);
						}
					}, this);
					if (selectedItem.nombre == undefined) {
						selectedItem.nombre = 0;
					}
					image.nombre = Number(selectedItem.nombre);
					image.name = selectedItem.name;
					image.title = 'Image affichée pour ' + image.nombre + ' destinataire' + (image.nombre > 1 ? 's' : '') + ' de la liste';
				}
				else if ($scope.selectedType == 'personnalise') {
					image.tag = selectedItem.tag;
					image.valeur = selectedItem.valeur;
					image.name = selectedItem.name;
					image.title = 'Image affichée pour les destinataires ayant "' + image.valeur + '" dans le champs "' + image.tag + '" de la liste';
				}
			}, function () { });
		}

		$scope.uploadImage = function (event, index) {
			$scope.currentIndex = index;
			readFile(event);
		};

		function readFile(event) {
			if ((/\.(gif|jpg|jpeg|png)$/i).test(event.target.files[0].name)) {
				upload(event.target.files[0]);
			} else {
				alert("Votre fichier " + event.target.files[0].name + " n'est pas au format png, jpg ou gif.");
			}
		}

		function upload(file) {
			var xhr = new XMLHttpRequest();
			var formData = new FormData();

			formData.append("logo", file);
			formData.append("session", $rootScope.clientid); //TODO session link

			$scope.$apply(function () {
				var selectType = $rootScope.data.components.scratch.selectedType;
				if (selectType == "simple") {
					$scope.imageSimpleList[$scope.currentIndex].src = "../server/service/scratch/chargement.png";
					$scope.imageSimpleList[$scope.currentIndex].progress = 0;
				}
				else if (selectType == "gagnant_perdant") {
					$scope.imageGagnantPerdantList[$scope.currentIndex].src = "../server/service/scratch/chargement.png";
					$scope.imageGagnantPerdantList[$scope.currentIndex].progress = 0;
				}
				else if (selectType == "dynamique_pourcent") {
					$scope.imageDynamiquePourcentList[$scope.currentIndex].src = "../server/service/scratch/chargement.png";
					$scope.imageDynamiquePourcentList[$scope.currentIndex].progress = 0;
				}
				else if (selectType == "dynamique_nombre") {
					$scope.imageDynamiqueNombreList[$scope.currentIndex].src = "../server/service/scratch/chargement.png";
					$scope.imageDynamiqueNombreList[$scope.currentIndex].progress = 0;
				}
				else if (selectType == "personnalise") {
					$scope.imagePersonnaliseList[$scope.currentIndex].src = "../server/service/scratch/chargement.png";
					$scope.imagePersonnaliseList[$scope.currentIndex].progress = 0;
				}
			});

			xhr.upload.onprogress = function (e) {
				var done = e.loaded || e.position, total = e.total || e.totalSize;
				var pourc = (Math.floor(done / total * 100));

				$scope.$apply(function () {
					var selectType = $rootScope.data.components.scratch.selectedType;
					if (selectType == "simple") {
						$scope.imageSimpleList[$scope.currentIndex].progress = pourc;
					}
					else if (selectType == "gagnant_perdant") {
						$scope.imageGagnantPerdantList[$scope.currentIndex].progress = pourc;
					}
					else if (selectType == "dynamique_pourcent") {
						$scope.imageDynamiquePourcentList[$scope.currentIndex].progress = pourc;
					}
					else if (selectType == "dynamique_nombre") {
						$scope.imageDynamiqueNombreList[$scope.currentIndex].progress = pourc;
					}
					else if (selectType == "personnalise") {
						$scope.imagePersonnaliseList[$scope.currentIndex].progress = pourc;
					}
				});
			};

			xhr.onload = function () {
				var response = xhr.responseText;
				response = JSON.parse(response);

				$scope.$apply(function () {
					var selectType = $rootScope.data.components.scratch.selectedType;
					if (selectType == "simple") {
						$scope.imageSimpleList[$scope.currentIndex].src = response.file + "?t=" + Date.now();
					}
					else if (selectType == "gagnant_perdant") {
						$scope.imageGagnantPerdantList[$scope.currentIndex].src = response.file + "?t=" + Date.now();
					}
					else if (selectType == "dynamique_pourcent") {
						$scope.imageDynamiquePourcentList[$scope.currentIndex].src = response.file + "?t=" + Date.now();
					}
					else if (selectType == "dynamique_nombre") {
						$scope.imageDynamiqueNombreList[$scope.currentIndex].src = response.file + "?t=" + Date.now();
					}
					else if (selectType == "personnalise") {
						$scope.imagePersonnaliseList[$scope.currentIndex].src = response.file + "?t=" + Date.now();
					}

					$scope.currentIndex = -1;
				});
			};

			xhr.open('post', "../server/service/postScratch.php");
			xhr.send(formData);
		}

		function reinitScratchSimple() {
			if ($rootScope.data.components.scratch.imageSimpleList == undefined) {
				$rootScope.data.components.scratch.imageSimpleList = [];
			}
			if ($rootScope.data.components.scratch.imageSimpleList.length == 0) {
				$scope.imageSimpleList = [];

				$scope.imageSimpleList.push(new Object());
				$scope.imageSimpleList[0].src = "../server/service/scratch/image_a_gratter.png";
				$scope.imageSimpleList[0].progress = 0;
				$scope.imageSimpleList[0].label = 'Image à gratter';

				$scope.imageSimpleList.push(new Object());
				$scope.imageSimpleList[1].src = "../server/service/scratch/black.jpg";
				$scope.imageSimpleList[1].progress = 0;
				$scope.imageSimpleList[1].label = 'Image après grattage';
				$scope.imageSimpleList[1].imageInfos = 'Image finale';
			} else {
				$scope.imageSimpleList = $rootScope.data.components.scratch.imageSimpleList;
			}
		}

		function reinitScratchGagnantPerdant() {
			if ($rootScope.data.components.scratch.imageGagnantPerdantList == undefined) {
				$rootScope.data.components.scratch.imageGagnantPerdantList = [];
			}
			if ($rootScope.data.components.scratch.imageGagnantPerdantList.length == 0) {
				$scope.imageGagnantPerdantList = [];

				$scope.imageGagnantPerdantList.push(new Object());
				$scope.imageGagnantPerdantList[0].src = "../server/service/scratch/image_a_gratter.png";
				$scope.imageGagnantPerdantList[0].progress = 0;
				$scope.imageGagnantPerdantList[0].label = 'Image à gratter';
				$scope.imageGagnantPerdantList[0].title = '';

				$scope.imageGagnantPerdantList.push(new Object());
				$scope.imageGagnantPerdantList[1].src = "../server/service/scratch/black.jpg";
				$scope.imageGagnantPerdantList[1].progress = 0;
				$scope.imageGagnantPerdantList[1].label = 'Image GAGNANT(S)';
				$scope.imageGagnantPerdantList[1].title = 'Image affichée pour le destinataire GAGNANT';

				$scope.imageGagnantPerdantList.push(new Object());
				$scope.imageGagnantPerdantList[2].src = "../server/service/scratch/black.jpg";
				$scope.imageGagnantPerdantList[2].progress = 0;
				$scope.imageGagnantPerdantList[2].label = 'Image PERDANT(S)';
				$scope.imageGagnantPerdantList[2].title = 'Image affichée pour les destinataires PERDANTS';
			} else {
				$scope.imageGagnantPerdantList = $rootScope.data.components.scratch.imageGagnantPerdantList;
				if ($scope.imageGagnantPerdantList.length == 3) {
					$scope.imageGagnantPerdantList[1].title = 'Image affichée pour le destinataire GAGNANT';
					$scope.imageGagnantPerdantList[2].title = 'Image affichée pour les destinataires PERDANTS';
				}
			}
		}

		function reinitScratchDynamiquePourcent() {
			if ($rootScope.data.components.scratch.imageDynamiquePourcentList == undefined) {
				$rootScope.data.components.scratch.imageDynamiquePourcentList = [];
			}
			if ($rootScope.data.components.scratch.imageDynamiquePourcentList == undefined) {
				$rootScope.data.components.scratch.imageDynamiquePourcentList = [];
			}
			if ($rootScope.data.components.scratch.imageDynamiquePourcentList.length == 0) {
				$scope.imageDynamiquePourcentList = [];

				$scope.imageDynamiquePourcentList.push(new Object());
				$scope.imageDynamiquePourcentList[0].src = "../server/service/scratch/image_a_gratter.png";
				$scope.imageDynamiquePourcentList[0].progress = 0;
				$scope.imageDynamiquePourcentList[0].label = 'Image à gratter';

				$scope.imageDynamiquePourcentList.push(new Object());
				$scope.imageDynamiquePourcentList[1].src = "../server/service/scratch/black.jpg";
				$scope.imageDynamiquePourcentList[1].progress = 0;
				$scope.imageDynamiquePourcentList[1].label = 'Après grattage';

				$scope.imageDynamiquePourcentNumber = 2;
			} else {
				$scope.imageDynamiquePourcentList = $rootScope.data.components.scratch.imageDynamiquePourcentList;
			}
		}

		function reinitScratchDynamiqueNombre() {
			if ($rootScope.data.components.scratch.imageDynamiqueNombreList == undefined) {
				$rootScope.data.components.scratch.imageDynamiqueNombreList = [];
			}
			if ($rootScope.data.components.scratch.imageDynamiqueNombreList == undefined) {
				$rootScope.data.components.scratch.imageDynamiqueNombreList = [];
			}
			if ($rootScope.data.components.scratch.imageDynamiqueNombreList.length == 0) {
				$scope.imageDynamiqueNombreList = [];

				$scope.imageDynamiqueNombreList.push(new Object());
				$scope.imageDynamiqueNombreList[0].src = "../server/service/scratch/image_a_gratter.png";
				$scope.imageDynamiqueNombreList[0].progress = 0;
				$scope.imageDynamiqueNombreList[0].label = 'Image à gratter';

				$scope.imageDynamiqueNombreList.push(new Object());
				$scope.imageDynamiqueNombreList[1].src = "../server/service/scratch/black.jpg";
				$scope.imageDynamiqueNombreList[1].progress = 0;
				$scope.imageDynamiqueNombreList[1].label = 'Après grattage';

				$scope.imageDynamiqueNombreNumber = 2;
			} else {
				$scope.imageDynamiqueNombreList = $rootScope.data.components.scratch.imageDynamiqueNombreList;
			}
		}

		function reinitScratchPersonnalise() {
			if ($rootScope.data.components.scratch.imagePersonnaliseList == undefined) {
				$rootScope.data.components.scratch.imagePersonnaliseList = [];
			}
			if ($rootScope.data.components.scratch.imagePersonnaliseList.length == 0) {
				$scope.imagePersonnaliseList = [];

				$scope.imagePersonnaliseList.push(new Object());
				$scope.imagePersonnaliseList[0].src = "../server/service/scratch/image_a_gratter.png";
				$scope.imagePersonnaliseList[0].progress = 0;
				$scope.imagePersonnaliseList[0].label = 'Image à gratter';

				$scope.imagePersonnaliseList.push(new Object());
				$scope.imagePersonnaliseList[1].src = "../server/service/scratch/black.jpg";
				$scope.imagePersonnaliseList[1].progress = 0;
				$scope.imagePersonnaliseList[1].label = 'Après grattage';

				$scope.imagePersonnaliseNumber = 2;
			} else {
				$scope.imagePersonnaliseList = $rootScope.data.components.scratch.imagePersonnaliseList;
			}
		}

		function addInputFile() {
			if ($scope.selectedType == 'dynamique_pourcent') {
				$scope.imageDynamiquePourcentList.push(new Object());
				$scope.imageDynamiquePourcentList[$scope.imageDynamiquePourcentList.length - 1].src = "../server/service/scratch/black.jpg";
				$scope.imageDynamiquePourcentList[$scope.imageDynamiquePourcentList.length - 1].progress = 0;
				$scope.imageDynamiquePourcentList[$scope.imageDynamiquePourcentList.length - 1].label = 'Après grattage';
			}
			else if ($scope.selectedType == 'dynamique_nombre') {
				$scope.imageDynamiqueNombreList.push(new Object());
				$scope.imageDynamiqueNombreList[$scope.imageDynamiqueNombreList.length - 1].src = "../server/service/scratch/black.jpg";
				$scope.imageDynamiqueNombreList[$scope.imageDynamiqueNombreList.length - 1].progress = 0;
				$scope.imageDynamiqueNombreList[$scope.imageDynamiqueNombreList.length - 1].label = 'Après grattage';
			}
			else if ($scope.selectedType == 'personnalise') {
				if($scope.imagePersonnaliseNumber!=$scope.imagePersonnaliseList.length-1){
					$scope.imagePersonnaliseList.push(new Object());
					$scope.imagePersonnaliseList[$scope.imagePersonnaliseList.length - 1].src = "../server/service/scratch/black.jpg";
					$scope.imagePersonnaliseList[$scope.imagePersonnaliseList.length - 1].progress = 0;
					$scope.imagePersonnaliseList[$scope.imagePersonnaliseList.length - 1].label = 'Après grattage';
				}
				
			}
		}

		function removeInputFile() {
			if ($scope.selectedType == 'dynamique_pourcent') {
				if (angular.isDefined($scope.imageDynamiquePourcentList)) {
					if ($scope.imageDynamiquePourcentList.length > 2) { //on ne supprime pas les 2 premiers : 0=image à gratter; 1=au moins une image apres grattage
						$scope.imageDynamiquePourcentList.pop();
					}
				}
			}
			else if ($scope.selectedType == 'dynamique_nombre') {
				if (angular.isDefined($scope.imageDynamiqueNombreList)) {
					if ($scope.imageDynamiqueNombreList.length > 2) { //on ne supprime pas les 2 premiers : 0=image à gratter; 1=au moins une image apres grattage
						$scope.imageDynamiqueNombreList.pop();
					}
				}
			}
			else if ($scope.selectedType == 'personnalise') {
				if (angular.isDefined($scope.imagePersonnaliseList)) {
					var max = $scope.imagePersonnaliseList.length-1;
					if ($scope.imagePersonnaliseList.length > 2 && $scope.imagePersonnaliseList[max].src=="../server/service/scratch/black.jpg") { //on ne supprime pas les 2 premiers : 0=image à gratter; 1=au moins une image apres grattage
						$scope.imagePersonnaliseList.pop();
					}else{
						$scope.imagePersonnaliseNumber = $scope.imagePersonnaliseNumber+1;
					}
				}
			}
		}

	}]).controller('ScratchSettingsModalCtrl', function ($scope, $modalInstance, items) {
		$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}).controller('ScratchSettingsLinkModalCtrl', function ($scope, $modalInstance, $location, item, $rootScope) {
		var url = $location.path();
		var urlArray = url.split("/");
		var clientId = urlArray[3];

		$scope.selectedType = $rootScope.data.components.scratch.selectedType;
		$scope.nb = 1;
		$scope.percent = 0;
		$scope.nombre = 0;
		$scope.tag = '';
		$scope.valeur = '';
		$scope.name = '';
		$scope.src = '';

		$scope.error = false;

		$scope.src = item.src;

		if ($scope.selectedType != 'personnalise') {
			if (angular.isDefined(item.number)) {
				$scope.nb = item.number;
			}

			if (angular.isDefined(item.percent)) {
				$scope.percent = Number(item.percent);
			}

			if (angular.isDefined(item.nombre)) {
				$scope.nombre = Number(item.nombre);
			}

			if (angular.isDefined(item.name)) {
				$scope.name = item.name;
			}
			
		} else {
			if (angular.isDefined(item.tag)) {
				$scope.tag = item.tag;
			}

			if (angular.isDefined(item.valeur)) {
				$scope.valeur = item.valeur;
			}

			if (angular.isDefined(item.name)) {
				$scope.name = item.name;
			}
		}

		$scope.ok = function () {
			var total = 0;
			if ($scope.selectedType == 'dynamique_pourcent') {
				$rootScope.data.components.scratch.imageDynamiquePourcentList.forEach(function (element) {
					if (element.percent != undefined && element.$$hashKey != item.$$hashKey) {
						total += Number(element.percent);
					}
				}, this);

				if ($scope.percent == undefined) {
					$scope.percent = 100;
				}
				if (total + $scope.percent > 100) {
					$scope.percent = 100 - total;
					$scope.error = true;
					return;
				}
			}

			$modalInstance.close({ nb: $scope.nb, percent: $scope.percent, nombre: $scope.nombre, tag: $scope.tag, valeur: $scope.valeur, itemId: item.$$hashKey, name: $scope.name });
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
	);
