'use strict';


// Declare app level module which depends on views, and components

var myApp = angular.module(
    'netMessage',
    [
        'ngRoute',
        'ngTouch',
        'ngAnimate',
        'ngSanitize',
        'uiGmapgoogle-maps',
        'netMessage.logoSettings',
		'netMessage.videoSettings',
        'netMessage.titleSettings',
        'netMessage.countdownSettings',
        'netMessage.barcodeSettings',
        'netMessage.sliderSettings',
        'netMessage.scratchSettings',
        'netMessage.textSettings',
        'netMessage.cguSettings',
        'netMessage.formSettings',
        'netMessage.optionsSettings',
        'netMessage.storesSettings',
        'netMessage.shakeSettings',
        'netMessage.page',
        'netMessage.components',
        'netMessage.expertModeSettings',
        'ui.bootstrap',
		'videosharing-embed',
        'ui.sortable',
        'iosSwitch',
        'ui.bootstrap.modal',
        'ui.bootstrap-slider',
        'bDatepicker',
        'multiselect',
        'customselect',
        'timelist',
		'ng-clipboard',
    ]
).config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|tel|mailto|file):/);

    $routeProvider.when('/:template/cgu/:id/', {
        templateUrl: 'components/cguComponent/cguSettings.html',
        controller: 'CguSettingsCtrl'
    }).when('/:template/expertMode/:id/', {
        templateUrl: 'components/expertModeComponent/expertModeSettings.html',
        controller: 'expertModeSettings'
    }).when('/:template/form/:id/', {
        templateUrl: 'components/formComponent/formSettings.html',
        controller: 'FormMainSettingsCtrl'
    }).when('/:template/logo/:id/', {
        templateUrl: 'components/logoComponent/logoSettings.html',
        controller: 'LogoSettingsCtrl'
    }).when('/:template/video/:id/', {
        templateUrl: 'components/videoComponent/videoSettings.html',
        controller: 'VideoSettingsCtrl'
    }).when('/:template/options/:id/', {
        templateUrl: 'components/optionsComponent/optionsSettings.html',
        controller: 'OptionsSettingsCtrl'
    }).when('/:template/slider/:id/', {
        templateUrl: 'components/sliderComponent/sliderSettings.html',
        controller: 'SliderSettingsCtrl'
    }).when('/:template/scratch/:id/', {
        templateUrl: 'components/scratchComponent/scratchSettings.html',
        controller: 'ScratchSettingsCtrl'
    }).when('/:template/shake/:id/', {
        templateUrl: 'components/shakeComponent/shakeSettings.html',
        controller: 'ShakeSettingsCtrl'
    }).when('/:template/text/:id/', {
        templateUrl: 'components/textComponent/textSettings.html',
        controller: 'TextSettingsCtrl'
    }).when('/:template/title/:id/', {
        templateUrl: 'components/titleComponent/titleSettings.html',
        controller: 'TitleSettingsCtrl'
    }).when('/:template/customcountdown/:id/', {
        templateUrl: 'components/customcountdownComponent/customcountdownSettings.html',
        controller: 'CountdownMainSettingsCtrl'
    }).when('/:template/barcode/:id/', {
        templateUrl: 'components/barcodeComponent/barcodeSettings.html',
        controller: 'BarcodeMainSettingsCtrl'
    }).when('/:template/stores/:id/', {
        templateUrl: 'components/storesComponent/storesSettings.html',
        controller: 'StoresMainSettingsCtrl'
    }).when('/page/:clientid', {
        controller: 'pageCtrl'
    })
    .otherwise({redirectTo: '/1/options/1'});
}]).config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
        key: 'AIzaSyDX6d3AjfdEn5ECUJF7HOTzh9k0p2RliNw',
        v: '3.17',
        libraries: 'visualization'
    });
}]);

angular.module('netMessage.controllers', []);
angular.module('netMessage.components', []);
