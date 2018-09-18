'use strict';

angular.module('netMessage.countdownSettings', ['ngRoute'])
    .controller('CountdownMainSettingsCtrl', ['$scope', '$rootScope','$timeout' , function ($scope, $rootScope, $timeout) {

        //trigger datetimerpicker by icon
        $scope.datepickerIconClick = function() {
            $timeout(function() {
                angular.element(document.querySelector('#eventctpicker')).datetimepicker('show');
            }, 0);
        };

        $scope.init = function () {
            $scope.nav = "carb";

            if($rootScope.clientid !== undefined){
                $scope.cId = $rootScope.clientid;
            }
            if ($rootScope.data.modeSettings.modeType == "2") {
                $location.path('/' + $rootScope.data.template.id + '/expertMode/' + $rootScope.clientid);
            }
            // Affichage bouton ajout calendrier
            if ($rootScope.data.components.customcountdown.calagenda.displayed != undefined || $rootScope.data.components.customcountdown.calagenda.displayed != "") {
                $scope.agendaBtnDisplayed = $rootScope.data.components.customcountdown.calagenda.displayed;
            }
            // Affichage Libellés
            if ($rootScope.data.components.customcountdown.nbreLabel.displayed != undefined || $rootScope.data.components.customcountdown.nbreLabel.displayed != "") {
                $scope.lblDisplayed = $rootScope.data.components.customcountdown.nbreLabel.displayed;
            }

        };
        if (!$rootScope.data) {
            $scope.$on("serviceReady",function () {
                $scope.$apply(function () {
                    $scope.init();
                });
            });
        } else {
            $scope.init();
        }
    }])
    .directive('ctpicker',function($rootScope,$interval,$timeout){
        return{
            restrict: 'C',
            link: function (scope, element, attrs) {
                var today = moment().format('YYYY-MM-DD H:mm');
                moment.locale('fr'); // 'fr'
                moment.updateLocale('fr', {
                    longDateFormat : {
                        LT: "à H:mm",
                        LTS: "h:mm:ss A",
                        L: "MM/DD",         // Remove year
                        LL: "MMMM Do YYYY",
                        LLL: "MMMM Do YYYY LT",
                        LLLL: "dddd Do MMMM YYYY LT"
                    }
                });
                element.datetimepicker({
                    autoclose: true,
                    format: 'dd/mm/yyyy hh:ii',
                    language: 'fr',
                    startDate: today,
                    forceParse: true
                }).on('changeDate', function(value){
                        var n = moment(value.date).format('LLLL');
                        var endDt = moment(value.date).format('YYYY/MM/DD H:mm');
                        if(moment(value.date).isValid()){
                            $rootScope.data.components.customcountdown.endDate = endDt;
                            $rootScope.data.components.customcountdown.realEndDate = n;
                        }
                        $rootScope.data.components.customcountdown.expiration.trueDisplay = false;
                        scope.expirationDisplayed  = false;
                        $rootScope.data.components.customcountdown.expiration.displayed = true;
                        $rootScope.data.components.customcountdown.expiration.preview = false;
                        if($rootScope.clientid !== undefined){
                            scope.$apply(function () {
                                $rootScope.data.components.customcountdown.calagenda.displayedDefault = true;
                            });
                        }
                });
            }
        }
    })

    .controller('EventSettingsCtrl', ['$scope', '$rootScope', '$location','$timeout', function ($scope, $rootScope, $location, $timeout) {
            //$scope.DEFAULT_TITLE = "<p>5%</p><p>De réduction</p>";
            //Tabs
            $scope.fontNames = [
                'Arial','Arial Bold', 'Arial Rounded Bold', 'Calibri', 'Century Gothic',  'Comic Sans MS',  'Courier New',
                'Helvetica', 'Helvetica Narrow', 'Helvetica Black', 'Helvetica Light', 'Impact', 'Neuropol',
                'Palatino Roman', 'Tahoma',  'Take Cover','Times New Roman', 'Verdana'
            ];

            // Affichage Bloc
            if ($scope.displayed === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.displayed !== undefined) {
                $scope.displayed = $rootScope.data.components.customcountdown.displayed;
            } else if ($scope.displayed === undefined) {
                $scope.displayed = true;
            }

            // Affichage Date evenement
            if ($scope.endDateDisplayed === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.endDateDisplayed !== undefined) {
                $scope.endDateDisplayed = $rootScope.data.components.customcountdown.endDateDisplayed;
            } else if ($scope.endDateDisplayed === undefined) {
                $scope.endDateDisplayed = true;
            }

            // Affichage Description
            if ($scope.eventDisplayed === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.introduction && $rootScope.data.components.customcountdown.introduction.displayed !== undefined) {
                $scope.eventDisplayed = $rootScope.data.components.customcountdown.introduction.displayed;
            } else if ($scope.eventDisplayed === undefined) {
                $scope.eventDisplayed = true;
            }

            // Affichage Aperçu
            if ($rootScope.data.components.customcountdown.expiration.preview != undefined || $rootScope.data.components.customcountdown.expiration.preview != "") {
                $scope.expirationDisplayed = $rootScope.data.components.customcountdown.expiration.preview;
            }

            $scope.init = function () {

                // Date événementpar défaut

                if ($scope.endDate === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.endDate !== "") {
                    if(moment($rootScope.data.components.customcountdown.endDate).isValid()){
                        // $scope.endDate = moment($rootScope.data.components.customcountdown.endDate).format('DD-MM-YYYY H:mm');
                        $scope.endDate = moment($rootScope.data.components.customcountdown.endDate).format('DD/MM/YYYY H:mm');
                    }
                }else if ($scope.endDate === undefined) {
                    // $scope.endDate = moment().add('1','days').format('DD-MM-YYYY H:mm');
                    $scope.endDate = moment().add('1','days').format('DD/MM/YYYY H:mm');
                    $rootScope.data.components.customcountdown.expiration.displayed = true;
                }

                // ajout au calendrier params
                if ($rootScope.data.components.customcountdown.calagenda.displayed != undefined || $rootScope.data.components.customcountdown.calagenda.displayed != "") {
                    $scope.agendaBtnDisplayed = $rootScope.data.components.customcountdown.calagenda.displayed;
                }
                $scope.$watch("agendaBtnDisplayed", function (newValue) {
                    $rootScope.data.components.customcountdown.calagenda.displayed = newValue;
                });

                $scope.$watch("displayed", function (newValue) {
                    $rootScope.data.components.customcountdown.displayed = newValue;
                });
                $scope.$watch("endDateDisplayed", function (newValue) {
                    $rootScope.data.components.customcountdown.endDateDisplayed = newValue;
                });
                $scope.$watch("eventDisplayed", function (newValue) {
                    $rootScope.data.components.customcountdown.introduction.displayed = newValue;
                });

                // Event introduction
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.introduction.text !== undefined) {
                    $scope.evenement = $rootScope.data.components.customcountdown.introduction.text;
                }else{
                    $scope.evenement = "<h3>Nom de l'événement</h3>";
                }
                // $scope.evenement = $rootScope.data.components.customcountdown.introduction.text;
                $scope.$watch("evenement", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.introduction.text = newValue;
                    $rootScope.data.components.customcountdown.introduction.realText = $rootScope.replaceText(newValue);
                });

                // Event title
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.calagenda.title.text !== undefined) {
                    $scope.title = $rootScope.data.components.customcountdown.calagenda.title.text;
                }else{
                    $scope.title = "Titre";
                }
                // $scope.title = $rootScope.data.components.customcountdown.calagenda.title.text;
                $scope.$watch("title", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.calagenda.title.text = newValue;
                    initCalendar();
                });
                // Event description
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.calagenda.description.text !== undefined) {
                    $scope.description = $rootScope.data.components.customcountdown.calagenda.description.text;
                }else{
                    $scope.description = "Description";
                }
                // $scope.description = $rootScope.data.components.customcountdown.calagenda.description.text;
                $scope.$watch("description", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.calagenda.description.text = newValue;
                    initCalendar();
                });
                // Event place
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.calagenda.place.text !== undefined) {
                    $scope.place = $rootScope.data.components.customcountdown.calagenda.place.text;
                }else{
                    $scope.place = "Lieu";
                }
                // $scope.place = $rootScope.data.components.customcountdown.calagenda.place.text;
                $scope.$watch("place", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.calagenda.place.text = newValue;
                    initCalendar();
                });
                //Alerte
                $scope.alerteUnits = [
                    { "name": "Jour(s)", "value": "D" },
                    { "name": "Heure(s)", "value": "H" },
                    { "name": "Minutes(s)", "value": "M" }
                ];
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.calagenda.alarm.unitALert !== undefined) {
                    $scope.unitALert = $rootScope.data.components.customcountdown.calagenda.alarm.unitALert;
                }else{
                    $scope.unitALert = "D";
                }
                // $scope.unitALert = $rootScope.data.components.customcountdown.calagenda.alarm.unitALert;
                $scope.$watch("unitALert", function (newValue) {
                    $rootScope.data.components.customcountdown.calagenda.alarm.unitALert = newValue;
                    initCalendar();
                });
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.calagenda.alarm.valueALert !== undefined) {
                    $scope.valueALert = parseInt($rootScope.data.components.customcountdown.calagenda.alarm.valueALert);
                }else{
                    $scope.valueALert = "";
                }
                // $scope.valueALert = parseInt($rootScope.data.components.customcountdown.calagenda.alarm.valueALert);
                $scope.$watch("valueALert", function (newValue) {
                    $rootScope.data.components.customcountdown.calagenda.alarm.valueALert = parseInt(newValue);
                    initCalendar();
                });
                // Message when event expired
                if ( $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.expiration.text !== undefined) {
                    $scope.txtEndMessage = $rootScope.data.components.customcountdown.expiration.text;
                }else{
                    $scope.txtEndMessage = "L'offre a expiré";
                }
                // $scope.txtEndMessage = $rootScope.data.components.customcountdown.expiration.text;
                $scope.$watch("txtEndMessage", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.expiration.text = newValue;
                    $rootScope.data.components.customcountdown.realTxtEndMessage = $rootScope.replaceText(newValue);
                });
                // Compte à rebours  Date de fin
                $rootScope.$watch("data.components.customcountdown.endDate", function (newValue) {
                    $rootScope.data.components.customcountdown.endDate = newValue;
                    initCalendar();
                });
                // Affichage  message de fin
                $rootScope.$watch("data.components.customcountdown.expiration.trueDisplay", function (newValue) {
                    $rootScope.data.components.customcountdown.expiration.trueDisplay = newValue;
                });
                // Genéré  fichier calendrier une fois
                $rootScope.$watch("data.components.customcountdown.calagenda.displayedDefault", function (newValue) {
                    $rootScope.data.components.customcountdown.calagenda.displayedDefault = newValue;
                });
                // Affichage Aperçu message de fin
                $scope.$watch("expirationDisplayed", function (newValue, oldValue) {
                    if ($rootScope.editMode) {
                        $rootScope.data.components.customcountdown.expiration.preview = newValue;
                    }
                    $rootScope.data.components.customcountdown.expiration.preview = newValue;
                    $scope.expirationDisplayed = newValue;
                });

                // if ($("input[name='eventwyg']").length) {
                var cteventwyg =   CKEDITOR.replace('eventwyg', {height: 160});
                CKEDITOR.instances['eventwyg'].on('instanceReady', function () {
                    var editor = $('#cke_eventwyg .cke_wysiwyg_div');
                    editor.css('backgroundColor', $rootScope.data.components.customcountdown.introduction.bgColor);
                    editor.css('color', $rootScope.data.options.colorSecondary);
                    editor.css('fontSize', '12px');
                    editor.css('padding', '10px');
                    editor.css('text-align', 'center');
                    editor.css('font-family', $rootScope.data.components.customcountdown.allFontName);
                    /*    $rootScope.$watch("data.options.colorPrimary", function (newValue) {
                        editor.css('backgroundColor', $rootScope.data.options.colorPrimary);
                    });*/
                    $rootScope.$watch("data.components.customcountdown.introduction.bgColor", function (newValue) {
                        editor.css('backgroundColor', $rootScope.data.components.customcountdown.introduction.bgColor);
                    });
                    $rootScope.$watch("data.options.colorSecondary", function (newValue) {
                        editor.css('color', $rootScope.data.options.colorSecondary);
                    });
                    $rootScope.$watch("data.components.customcountdown.allFontName", function (newValue) {
                        editor.css('font-family', $rootScope.data.components.customcountdown.allFontName);
                    });
                });

                CKEDITOR.instances['eventwyg'].on('change', function (event) {
                    if (!$scope.$$phase) {
                        $scope.$apply(function () {
                            $scope.evenement = CKEDITOR.instances['eventwyg'].getData();
                            // initCalendar($rootScope.clientid,$rootScope.data.components.customcountdown.endDate,"Sujet","Ajouter une description","Lieu");
                        });
                    } else {
                        $scope.evenement = CKEDITOR.instances['eventwyg'].getData();
                    }
                });
                function initCalendar(){
                    var aclientId       = $rootScope.clientid;
                    var deadline        = $rootScope.data.components.customcountdown.endDate;
                    var title           = $rootScope.data.components.customcountdown.calagenda.title.text != "" ? $rootScope.data.components.customcountdown.calagenda.title.text : "Sujet";
                    var desc            = $rootScope.data.components.customcountdown.calagenda.description.text != "" ? $rootScope.data.components.customcountdown.calagenda.description.text : "Description";
                    var place           = $rootScope.data.components.customcountdown.calagenda.place.text != "" ? $rootScope.data.components.customcountdown.calagenda.place.text : "Lieu";
                    //  AJOUT AGENDA
                    var saveAs          =saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
                    var valueALert      = $rootScope.data.components.customcountdown.calagenda.alarm.valueALert;
                    var unitALert       = $rootScope.data.components.customcountdown.calagenda.alarm.unitALert;
                    var ptAlertString   = "";

                    if(valueALert.toString()!="NaN" && valueALert.toString()!=''){
                        if(unitALert=="D"){
                            valueALert = valueALert*1440;
                        }else if(unitALert=="H"){
                            valueALert = valueALert*60;
                        }
                        var ptAlert = "-PT"+valueALert+"M";
                        var ptAlertString = "BEGIN:VALARM\nTRIGGER;VALUE=DURATION:"+ptAlert+"\nACTION:DISPLAY\nDESCRIPTION:Reminder\nEND:VALARM";
                    }
                    var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT",ptAlertString,"END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}}}console.log("Unsupported Browser")}};
                    var beginDateCal    = moment(deadline).format('MM/DD/YYYY H:mm');
                    var EndDateCal      = beginDateCal;

                     // var descCal = desc.replace(/<[^>]+>/gm, " ");
                    var descCal = desc;
                    if((desc.match(/\n/g)||[]).length > 0){
                        descCal = desc.replace(/(\r\n|\n|\r)/gm, " \\n ");
                    }
                    // var placeCal = place.replace(/<[^>]+>/gm, " ");
                    // var  placeCal = place.replace(",", "\\,");
                    var  placeCalA = place;
                    var  placeCal = place.split(',').join('\\,');
                    // var titleCal = title.replace(/<[^>]+>/gm, " ");
                     var titleCal = title.replace(",", ",");

                    var cal_single = ics();
                    cal_single.addEvent(titleCal, descCal , placeCal, beginDateCal,EndDateCal);
                    // cal_single.download('Mon agenda');
                    var the_cal = cal_single.build();
                    var cdata = new FormData();

                    var cal_single_A = ics();
                    cal_single_A.addEvent(titleCal, descCal , placeCalA, beginDateCal,EndDateCal);
                    // cal_single.download('Mon agenda');
                    var the_cal_A = cal_single_A.build();

                    cdata.append("caldata" , the_cal);
                    cdata.append("caldataA", the_cal_A);
                    cdata.append("session", aclientId);
                    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
                    xhr.open( 'post', '../server/service/postCalendar.php', true );
                    xhr.send(cdata);
                }
                // }
                //Polices
                if ($rootScope.data.components.customcountdown.allFontName == undefined || $rootScope.data.components.customcountdown.allFontName == "") {
                    $scope.ctFonts= 'Arial';
                } else {
                    $scope.ctFonts = $rootScope.data.components.customcountdown.allFontName;
                }
                $scope.$watch("ctFonts", function (newValue, oldValue) {
                    $rootScope.data.components.customcountdown.allFontName = newValue;
                });
            } // end init scope
            if (!$rootScope.data) {
                $scope.$on("serviceReady",function () {
                    $scope.$apply(function () {
                        $scope.init();
                    });
                });
            } else {
                $scope.init();
            }
        }]
    )
    .controller('AdvancedEventSettingsCtrl', ['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        if ($scope.newWindowUrl === undefined && $rootScope.data && $rootScope.data.components && $rootScope.data.components.customcountdown && $rootScope.data.components.customcountdown.counter.newWindow !== undefined) {
            $scope.newWindowUrl = $rootScope.data.components.customcountdown.counter.newWindow;
        } else if ($scope.newWindowUrl === undefined) {
            $scope.newWindowUrl = true;
        }
        $scope.init = function () {
            // Couleur de fond générale
            $scope.EventBgColor = $rootScope.data.components.customcountdown.introduction.bgColor;
            $scope.$watch("EventBgColor", function (newValue) {
                $rootScope.data.components.customcountdown.introduction.bgColor = newValue;
                $(".note-editable").css("background", $scope.EventBgColor);
            });
            $(".note-editable").css("background", $scope.EventBgColor);
            if ($scope.EventBgColor == undefined) {
                $scope.EventBgColor = $rootScope.defaultData.components.customcountdown.EventBgColor;
            }
            var evecolorPicker = $('.color_primary');
            evecolorPicker.colpick({
                color: $scope.EventBgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.EventBgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    evecolorPicker.colpickHide();
                }
            });
            // Labels
            $scope.txtday = $rootScope.data.components.customcountdown.nbreLabel.day;
            $scope.txthour = $rootScope.data.components.customcountdown.nbreLabel.hour;
            $scope.txtminute = $rootScope.data.components.customcountdown.nbreLabel.minute;
            $scope.txtsecond = $rootScope.data.components.customcountdown.nbreLabel.second;
            $scope.txtAgendaBtn = $rootScope.data.components.customcountdown.calagenda.btnText;

            $scope.$watch("txtday", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.nbreLabel.day = newValue;
                $rootScope.data.components.customcountdown.realTxtDay = $rootScope.replaceText(newValue);
            });
            $scope.$watch("txthour", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.nbreLabel.hour = newValue;
                $rootScope.data.components.customcountdown.realTxtHour = $rootScope.replaceText(newValue);
            });
            $scope.$watch("txtminute", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.nbreLabel.minute = newValue;
                $rootScope.data.components.customcountdown.realTxtMinute = $rootScope.replaceText(newValue);
            });
            $scope.$watch("txtsecond", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.nbreLabel.second = newValue;
                $rootScope.data.components.customcountdown.realTxtSecond = $rootScope.replaceText(newValue);
            });
            $scope.$watch("txtAgendaBtn", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.calagenda.btnText = newValue;
                $rootScope.data.components.customcountdown.realTxtAgendaBtn = $rootScope.replaceText(newValue);
            });

            $scope.$watch("newWindowUrl", function (newValue) {
                $rootScope.data.components.customcountdown.counter.newWindow = newValue;
            });

            // Libellés
            if ($rootScope.data.components.customcountdown.nbreLabel.displayed != undefined || $rootScope.data.components.customcountdown.nbreLabel.displayed != "") {
                $scope.lblDisplayed = $rootScope.data.components.customcountdown.nbreLabel.displayed;
            }
            $scope.$watch("lblDisplayed", function (newValue) {
                $rootScope.data.components.customcountdown.nbreLabel.displayed = newValue;
            });
            // Taille des chiffres
            if ($rootScope.data.components.customcountdown.counter.font.size != undefined || $rootScope.data.components.customcountdown.counter.font.size != "") {
                $scope.ctfontSize = $rootScope.data.components.customcountdown.counter.font.size;
            }
            if($("input.countdownNumberSizeSlider").length){
                var slider_ctfirst = $("input.countdownNumberSizeSlider").slider({
                    min: 20,
                    max: 50,
                    value: parseInt($scope.ctfontSize)
                }).on("change", function (e) {
                    $scope.ctfontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctfontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }

            $scope.$watch("ctfontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.counter.font.size = newValue;
            });

            // Taille des libellés
            if ($rootScope.data.components.customcountdown.counter.font.lblsize != undefined || $rootScope.data.components.customcountdown.counter.font.lblsize != "") {
                $scope.ctlblfontSize = $rootScope.data.components.customcountdown.counter.font.lblsize;
            }

            if($("input.countdownTextSizeSlider").length){
                var slider_lblfirst = $("input.countdownTextSizeSlider").slider({
                    min: 8,
                    max: 15,
                    value: parseInt($scope.ctlblfontSize)
                }).on("change", function (e) {
                    $scope.ctlblfontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctlblfontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }

            $scope.$watch("ctlblfontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.counter.font.lblsize = newValue;
            });

            // URl sur le compte à rebours
            $scope.txtCtUrl = $rootScope.data.components.customcountdown.counter.url;
            $scope.$watch("txtCtUrl", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.counter.url = newValue;
            });

            // Message de fin
            // Taille des Textes
            if ($rootScope.data.components.customcountdown.expiration.font.size != undefined || $rootScope.data.components.customcountdown.expiration.font.size != "") {
                $scope.ctExpfontSize = $rootScope.data.components.customcountdown.expiration.font.size;
            }

            if($("input.countdownEndTextSizeSlider").length){
                var slider_lblfirst = $("input.countdownEndTextSizeSlider").slider({
                    min: 14,
                    max: 40,
                    value: parseInt($scope.ctExpfontSize)
                }).on("change", function (e) {
                    $scope.ctExpfontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctExpfontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }
            $scope.$watch("ctExpfontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.expiration.font.size = newValue;
            });


            // Taille de la date
            if ($rootScope.data.components.customcountdown.endDateFontSize != undefined || $rootScope.data.components.customcountdown.endDateFontSize != "") {
                $scope.ctExpDatefontSize = $rootScope.data.components.customcountdown.endDateFontSize;
            }

            if($("input.countdownEndDateTextSizeSlider").length){
                var slider_lblDatefirst = $("input.countdownEndDateTextSizeSlider").slider({
                    min: 14,
                    max: 40,
                    value: parseInt($scope.ctExpDatefontSize)
                }).on("change", function (e) {
                    $scope.ctExpDatefontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctExpDatefontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }
            $scope.$watch("ctExpDatefontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.endDateFontSize = newValue;
            });



            // Couleur de fond compteur
            $scope.ctBgColor = $rootScope.data.components.customcountdown.counter.bgColor;
            $scope.$watch("ctBgColor", function (newValue) {
                $rootScope.data.components.customcountdown.counter.bgColor = newValue;
                $(".note-editable").css("background", $scope.ctBgColor);
            });
            $(".note-editable").css("background", $scope.ctBgColor);
            if ($scope.ctBgColor == undefined) {
                $scope.ctBgColor = $rootScope.defaultData.components.customcountdown.ctBgColor;
            }
            var colorPicker = $('.ct-bgcolor-picker');
            colorPicker.colpick({
                color: $scope.ctBgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctBgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorPicker.colpickHide();
                }
            });

            // Couleur des chiffres compteur
            $scope.ctFontColor = $rootScope.data.components.customcountdown.counter.font.color;
            $scope.$watch("ctFontColor", function (newValue) {
                $rootScope.data.components.customcountdown.counter.font.color = newValue;
                $(".note-editable").css("background", $scope.ctFontColor);
            });
            $(".note-editable").css("background", $scope.ctFontColor);
            if ($scope.ctFontColor == undefined) {
                $scope.ctFontColor = $rootScope.defaultData.components.customcountdown.ctFontColor;
            }
            var colorPickerNumbers = $('.number_color_primary');
            colorPickerNumbers.colpick({
                color: $scope.ctFontColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctFontColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorPickerNumbers.colpickHide();
                }
            });

            // Couleur des libellés compteur
            $scope.ctLblFontColor = $rootScope.data.components.customcountdown.counter.font.lblcolor;
            $scope.$watch("ctLblFontColor", function (newValue) {
                $rootScope.data.components.customcountdown.counter.font.lblcolor = newValue;
                $(".note-editable").css("background", $scope.ctLblFontColor);
            });
            $(".note-editable").css("background", $scope.ctLblFontColor);
            if ($scope.ctLblFontColor == undefined) {
                $scope.ctLblFontColor = $rootScope.defaultData.components.customcountdown.ctLblFontColor;
            }
            var colorPickerLabels = $('.text_color_primary');
            colorPickerLabels.colpick({
                color: $scope.ctLblFontColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctLblFontColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorPickerLabels.colpickHide();
                }
            });


            // Couleur message de fin
            $scope.ctExpFontColor = $rootScope.data.components.customcountdown.expiration.font.color;
            $scope.$watch("ctExpFontColor", function (newValue) {
                $rootScope.data.components.customcountdown.expiration.font.color = newValue;
                $(".note-editable").css("background", $scope.ctExpFontColor);
            });
            $(".note-editable").css("background", $scope.ctExpFontColor);
            if ($scope.ctExpFontColor == undefined) {
                $scope.ctExpFontColor = $rootScope.defaultData.components.customcountdown.ctExpFontColor;
            }
            var colorPickerExp = $('.exp_color_primary');
            colorPickerExp.colpick({
                color: $scope.ctExpFontColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctExpFontColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorPickerExp.colpickHide();
                }
            });

            // Affichage bouton ajout calendrier
            $scope.advancedAgendaBtnDisplayed = true;
            if ($rootScope.data.components.customcountdown.calagenda.displayed != undefined || $rootScope.data.components.customcountdown.calagenda.displayed != "") {
                $scope.advancedAgendaBtnDisplayed = $rootScope.data.components.customcountdown.calagenda.displayed;
            }

            // Bouton ajout calendrier
            //Fond
            $scope.ctAgendaBgColor = $rootScope.data.components.customcountdown.calagenda.bgColor;
            $scope.$watch("ctAgendaBgColor", function (newValue) {
                $rootScope.data.components.customcountdown.calagenda.bgColor = newValue;
                $(".note-editable").css("background", $scope.ctAgendaBgColor);
            });
            $(".note-editable").css("background", $scope.ctAgendaBgColor);
            if ($scope.ctAgendaBgColor == undefined) {
                $scope.ctAgendaBgColor = $rootScope.defaultData.components.customcountdown.ctAgendaBgColor;
            }
            var colorbgAgendaBgPicker = $('.ct-agendabgcolor-picker');
            colorbgAgendaBgPicker.colpick({
                color: $scope.ctAgendaBgColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctAgendaBgColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorbgAgendaBgPicker.colpickHide();
                }
            });

            $scope.ctAgendaFontColor = $rootScope.data.components.customcountdown.calagenda.color;
            $scope.$watch("ctAgendaFontColor", function (newValue) {
                $rootScope.data.components.customcountdown.calagenda.color = newValue;
                $(".note-editable").css("background", $scope.ctAgendaFontColor);
            });
            $(".note-editable").css("background", $scope.ctAgendaFontColor);
            if ($scope.ctAgendaFontColor == undefined) {
                $scope.ctAgendaFontColor = $rootScope.defaultData.components.customcountdown.ctAgendaFontColor;
            }
            var colorbgAgendaPicker = $('.ct-agendacolor-picker');
            colorbgAgendaPicker.colpick({
                color: $scope.ctAgendaFontColor.replace("#", ""),
                onChange: function ($hsb, $hexa) {
                    $scope.$apply(function () {
                        $scope.ctAgendaFontColor = "#" + $hexa;
                    });
                },
                onSubmit: function (a, b ,c) {
                    colorbgAgendaPicker.colpickHide();
                }
            });
            // Taille du texte
            if ($rootScope.data.components.customcountdown.calagenda.font.size != undefined || $rootScope.data.components.customcountdown.calagenda.font.size != "") {
                $scope.ctAgendaTxtBtnfontSize = $rootScope.data.components.customcountdown.calagenda.font.size;
            }

            if($("input.countdownAgendaBtnTextSizeSlider").length){
                var slider_AgendaBtnText = $("input.countdownAgendaBtnTextSizeSlider").slider({
                    min: 10,
                    max: 25,
                    value: parseInt($scope.ctAgendaTxtBtnfontSize)
                }).on("change", function (e) {
                    $scope.ctAgendaTxtBtnfontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctAgendaTxtBtnfontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }
            $scope.$watch("ctAgendaTxtBtnfontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.calagenda.font.size = newValue;
            });
            // Taille des arrondis
            if ($rootScope.data.components.customcountdown.calagenda.bradius != undefined || $rootScope.data.components.customcountdown.calagenda.bradius != "") {
                $scope.ctAgendaBorderfontSize = $rootScope.data.components.customcountdown.calagenda.bradius;
            }

            if($("input.countdownAgendaBorderSlider").length){
                var slider_AgendaBorder = $("input.countdownAgendaBorderSlider").slider({
                    min: 0,
                    max: 15,
                    value: parseInt($scope.ctAgendaBorderfontSize)
                }).on("change", function (e) {
                    $scope.ctAgendaBorderfontSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctAgendaBorderfontSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }
            $scope.$watch("ctAgendaBorderfontSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.calagenda.bradius = newValue;
            });

            // Taille des arrondis du fond du compteur
            if ($rootScope.data.components.customcountdown.counter.bradius != undefined || $rootScope.data.components.customcountdown.counter.bradius != "") {
                $scope.ctCounterBorderRadiusSize = $rootScope.data.components.customcountdown.counter.bradius;
            }

            if($("input.countdownCounterBradiusSlider").length){
                var slider_CounterBorderRadius = $("input.countdownCounterBradiusSlider").slider({
                    min: 0,
                    max: 15,
                    value: parseInt($scope.ctCounterBorderRadiusSize)
                }).on("change", function (e) {
                    $scope.ctCounterBorderRadiusSize = parseInt(e.value.newValue);
                    $rootScope.$apply(function () {
                        $scope.ctCounterBorderRadiusSize = parseInt(e.value.newValue);
                    });
                }).data('slider_third');
            }
            $scope.$watch("ctCounterBorderRadiusSize", function (newValue, oldValue) {
                $rootScope.data.components.customcountdown.counter.bradius = newValue;
            });

            //Espacement entre les chiffres
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

            $scope.spaceSize = $rootScope.data.components.customcountdown.counter.nbSpaceSize;

            if ($rootScope.data.components.customcountdown.counter.nbSpaceSize == undefined) {
                $scope.spaceSize = $rootScope.defaultData.components.customcountdown.counter.nbSpaceSize;
            }

        } // end init function

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