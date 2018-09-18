'use strict';

angular.module('netMessage.optionsSettings', ['ngRoute'])
    .controller('OptionsSettingsCtrl', ['$scope', '$rootScope', '$location', '$animate', function ($scope, $rootScope, $location, $animate) {
        $scope.init = function () {
            if ($rootScope.data.modeSettings.modeType == "2") { 
                //$location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
                $rootScope.changeURL("expertMode");
            }

            $scope.title = $rootScope.data.options.title;
            $scope.colorPrimary = $rootScope.data.options.colorPrimary;
            $scope.colorSecondary = $rootScope.data.options.colorSecondary;

            $scope.$watch("title", function (newValue, oldValue) {
                $rootScope.data.options.title = newValue;
            });

            $scope.$watch("colorPrimary", function (newValue, oldValue) {
                $rootScope.data.options.colorPrimary = newValue;

                $rootScope.data.forms.layouts.colors.background = $rootScope.data.forms.layouts.colors.background || newValue;

                if ($rootScope.data.forms.layouts.colors.background.toUpperCase() === oldValue.toUpperCase()) {
                    $rootScope.data.forms.layouts.colors.background = newValue;
                }

                $rootScope.data.forms.layouts.colors.backgroundIntroduction = $rootScope.data.forms.layouts.colors.backgroundIntroduction || newValue; 

                if ($rootScope.data.forms.layouts.colors.backgroundIntroduction.toUpperCase() === oldValue.toUpperCase()) {
                    $rootScope.data.forms.layouts.colors.backgroundIntroduction = newValue;
                }
                if (oldValue.toUpperCase() !== newValue.toUpperCase()) {
                   // $rootScope.data.components.title.bgColor = newValue;
                   //  $rootScope.data.components.text.bgColor = newValue;
                   //  $rootScope.data.components.cgu.bgColor = newValue;
                    // $rootScope.data.components.customcountdown.introduction.bgColor = newValue;
                    // $rootScope.data.components.slider.bgColor = newValue;
                    // $rootScope.data.components.slider.button.bgColor = newValue;
                    // $rootScope.data.components.customcountdown.calagenda.bgColor = newValue;
                }
                if($rootScope.data.components.title.bgColor == oldValue){
                    $rootScope.data.components.title.bgColor = newValue;
                }
                if($rootScope.data.components.cgu.bgColor == oldValue){
                    $rootScope.data.components.cgu.bgColor = newValue;
                }
                if($rootScope.data.components.text.bgColor == oldValue){
                    $rootScope.data.components.text.bgColor = newValue;
                }
                if($rootScope.data.components.customcountdown.introduction.bgColor == oldValue){
                    $rootScope.data.components.customcountdown.introduction.bgColor = newValue;
                }
                if($rootScope.data.components.customcountdown.counter.bgColor == oldValue){
                    $rootScope.data.components.customcountdown.counter.bgColor = newValue;
                }
                if($rootScope.data.components.customcountdown.calagenda.color == oldValue){
                    $rootScope.data.components.customcountdown.calagenda.color = newValue;
                }
                if($rootScope.data.forms.layouts.colors.backgroundIntroduction == oldValue){
                    $rootScope.data.forms.layouts.colors.backgroundIntroduction = newValue;
                }
                if($rootScope.data.components.slider.bgColor == oldValue){
                    $rootScope.data.components.slider.bgColor = newValue;
                }
                if($rootScope.data.components.slider.button.bgColor == oldValue){
                    $rootScope.data.components.slider.button.bgColor = newValue;
                }
                if($rootScope.data.components.slider.description.textColor == oldValue){
                    $rootScope.data.components.slider.description.textColor = newValue;
                }
                if($rootScope.data.components.slider.price.textColor == oldValue){
                    $rootScope.data.components.slider.price.textColor = newValue;
                }
            });

            $scope.$watch("colorSecondary", function (newValue, oldValue) {
                $rootScope.data.options.colorSecondary = newValue;
                $rootScope.data.forms.layouts.colors.text = $rootScope.data.forms.layouts.colors.text || newValue;

                if ($rootScope.data.forms.layouts.colors.text.toUpperCase() === oldValue.toUpperCase()) {
                    $rootScope.data.forms.layouts.colors.text = newValue;
                }

                if (oldValue.toUpperCase() !== newValue.toUpperCase()) {
                    $rootScope.data.components.customcountdown.expiration.font.color = newValue;
                    // $rootScope.data.components.customcountdown.calagenda.bgColor = newValue;
                    // $rootScope.data.components.customcountdown.calagenda.color = newValue;
                    // $rootScope.data.components.customcountdown.counter.font.color = newValue;
                    // $rootScope.data.components.customcountdown.counter.font.lblcolor = newValue;
                    // $rootScope.data.components.slider.description.textColor = newValue;
                    // $rootScope.data.components.slider.price.textColor = newValue;
                }
                if($rootScope.data.components.customcountdown.calagenda.bgColor.toUpperCase() == oldValue.toUpperCase()){
                    $rootScope.data.components.customcountdown.calagenda.bgColor = newValue;
                }
                if($rootScope.data.components.customcountdown.introduction.color == oldValue){
                    $rootScope.data.components.customcountdown.introduction.color = newValue;
                }

                if($rootScope.data.components.customcountdown.counter.font.color == oldValue){
                    $rootScope.data.components.customcountdown.counter.font.color = newValue;
                }

                if($rootScope.data.components.customcountdown.counter.font.lblcolor == oldValue){
                    $rootScope.data.components.customcountdown.counter.font.lblcolor = newValue;
                }

                if($rootScope.data.components.slider.button.textColor == oldValue){
                    $rootScope.data.components.slider.button.textColor = newValue;
                }

            });


            $rootScope.$watch(
                function () {
                    return $rootScope.data.options.colorPrimary;
                },
                function (newValue, oldValue) {
                    $scope.colorPrimary = newValue;
                }
            );

            $rootScope.$watch(
                function () {
                    return $rootScope.data.options.colorSecondary;
                },
                function (newValue, oldValue) {
                    $scope.colorSecondary = newValue;
                }
            );

            $('.color_primary').colpick({
                color: $scope.colorPrimary.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.colorPrimary = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_primary').colpickHide();
                }
            });

            $('.color_secondary').colpick({
                color: $scope.colorSecondary.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.colorSecondary = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b, c) {
                    $('.color_secondary').colpickHide();
                }
            });
        }

        if (!$rootScope.data) {
            $scope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
}]);

function utf8_decode(str_data) {
    try {
        return decodeURIComponent(escape(str_data));
    } catch (e) {
        return str_data;
    }
}