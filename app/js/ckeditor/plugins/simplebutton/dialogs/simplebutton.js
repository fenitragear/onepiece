/*
	This file is a part of simplebuttion project.

	Copyright (C) Thanh D. Dang <thanhdd.it@gmail.com>

	simplebuttion is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	simplebuttion is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

CKEDITOR.dialog.add( 'simplebuttonDialog', function( editor) {

    var valid = true;
    var LinkTypeLblValue = 'URL';
    var locationpath = location.href;
    var url = locationpath.split('/');
    var cid = url[url.length-2];
    var linkTypeItems = [[ 'URL', 'http://' ], [ 'Téléphone', 'tel:' ], [ 'Courriel', 'mailto:' ],  ['Calendrier', 'cal:']];

    var colorValues = function(color)
    {
        if (!color)
            return;
        if (color.toLowerCase() === 'transparent')
            return [0, 0, 0, 0];
        if (color[0] === '#')
        {
            if (color.length < 7)
            {
                // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
                color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
            }
            return [parseInt(color.substr(1, 2), 16),
                parseInt(color.substr(3, 2), 16),
                parseInt(color.substr(5, 2), 16),
                color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1];
        }
        if (color.indexOf('rgb') === -1)
        {
            // convert named colors
            var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
            var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
            temp_elem.style.color = flag;
            if (temp_elem.style.color !== flag)
                return; // color set failed - some monstrous css rule is probably taking over the color of our object
            temp_elem.style.color = color;
            if (temp_elem.style.color === flag || temp_elem.style.color === '')
                return; // color parse failed
            color = getComputedStyle(temp_elem).color;
            document.body.removeChild(temp_elem);
        }
        if (color.indexOf('rgb') === 0)
        {
            if (color.indexOf('rgba') === -1)
                color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
            return color.match(/[\.\d]+/g).map(function (a)
            {
                return +a
            });
        }
    }
    var rgbToHex = function (rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    var fetchEventInfos = function (url) {
        var rawFile = new XMLHttpRequest();
        rawFile.open('GET', url, false);
        rawFile.send();
        return (rawFile.status === 200 || rawFile.status == 0) ? rawFile.responseText : "null";
    }

    var getAlertValueArray = function(cal){
        var Unit = "D";
        var alertVal = 1;
        if(cal !== undefined || cal != ''){
            var C = parseInt(cal);
            if( C >= 1440){
                Unit = 'D';
                alertVal = Math.round(C/1440);
            }else{
                var Hour = C/60;
                if(Hour < 1){
                    Unit = 'M';
                    alertVal = Math.round(Hour*60);
                }else{
                    Unit = 'H';
                    alertVal = Math.round(Hour);
                }
            }
        }
        return [Unit, alertVal];
    }

    // Récupérer la valeur rootscope du bloc formulaire côté affichage
    var getFrmDisplayValue = function () {
        var readFrm = new XMLHttpRequest();
        readFrm.open('GET', '../server/files/' + cid + '/form/formshow.txt', false);
        readFrm.send();
        var responseFormShow = readFrm.responseText == "true" ? true : false;
        return responseFormShow;
    }
    var responseFormShow = getFrmDisplayValue();
    if(responseFormShow){
        linkTypeItems.push([ 'Formulaire', 'form:' ]);
    }
    var linkTypeChanged = function () {
        var dialog = this.getDialog(),
            targetName = dialog.getContentElement( 'tab-basic', 'button-url' ),
            Typevalue = this.getValue();
        targetName.getElement().show();

        var mailElems = dialog.getContentElement( 'tab-basic', 'mailbox' );
        mailElems.getElement().hide();

        var calElems = dialog.getContentElement( 'tab-basic', 'eventbox' );
        calElems.getElement().hide();
        var calAdrElems = dialog.getContentElement( 'tab-basic', 'adcalendar' );

        var setLinkValueToNull = function(){
            // if(!dialog.insertMode){
            targetName.setValue("");
            // }
        }
        setLinkValueToNull();

        switch(Typevalue){
            case 'http://':
                targetName.enable();
                targetName.setLabel('URL');
                break;
            case 'mailto:':
                targetName.enable();
                targetName.setLabel('Courriel');
                mailElems.getElement().show();
                break;
            case 'tel:':
                targetName.enable();
                targetName.setLabel('Téléphone');
                break;
            case 'cal:':
                targetName.enable();
                targetName.setLabel('Nom de l\'événement');
                calElems.getElement().show();
                break;
            case 'form:':
                var linkForm = null;
                targetName.setLabel('Lien vers le formulaire');
                $.post('../server/service/baseUrl.php', { session: cid }, function (data) {
                    linkForm = data.app + "form.html#/form/" + cid + '/';
                    targetName.setValue(linkForm);
                    targetName.disable();
                }, 'json');
                break;
        }
    }

    return {
        title: 'Insertion bouton',
        minWidth: 400,
        minHeight: 200,
        resizable: CKEDITOR.DIALOG_RESIZE_NONE,
        contents: [
            {
                id: 'tab-basic',
                elements: [
                    {
                        type: 'text',
                        id: 'button-text',
                        label: 'Texte sur le bouton',
                        labelStyle: 'font-weight:bold;',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Veuillez indiquer un texte sur le bouton" ),
                        setup: function( element, preview ) {
                            this.preview_button = preview;
                            this.setValue( element.getText() );
                        },
                        commit: function( element ) {
                            element.setText( this.getValue() );
                        },
                        onChange: function() {
                            this.preview_button.setText( this.getValue() );
                        }
                    },
                    {
                        id: 'linkType',
                        type: 'select',
                        label: 'Type de lien',
                        labelStyle: 'font-weight:bold;',
                        items: linkTypeItems,
                        onChange: linkTypeChanged,
                        setup: function( element ) {
                            this.setValue(element.getAttribute('name') || 'http://');
                            var isFormBlocDisplayed = getFrmDisplayValue();
                            if(!isFormBlocDisplayed && element.getAttribute('name') == 'form:'){
                                this.setValue('http://');
                            }
                        },
                        commit: function( element ) {
                            var  linktypeVals = this.getValue();
                            element.setAttribute( "name", linktypeVals );
                        }

                    },
                    {
                        type: 'text',
                        id: 'button-url',
                        labelStyle: 'font-weight:bold;',
                        label: LinkTypeLblValue,
                        validate: function() {
                            var dialog = this.getDialog();
                            var LinkTypeValue = dialog.getValueOf('tab-basic','linkType');
                            switch(LinkTypeValue){
                                case 'http://':
                                    if(this.getValue() == ''){
                                        if(LinkTypeValue != '#'){
                                            alert( 'Le lien ne doit pas être vide' );
                                            return false;
                                        }
                                    }
                                    var regUrl =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                                    if (regUrl.test(this.getValue()) == false)
                                    {
                                        alert('URL invalide');
                                        return false;
                                    }

                                    break;
                                case 'mailto:':
                                    if(this.getValue() == ''){
                                        if(LinkTypeValue != '#'){
                                            alert( 'Le champ courriel ne doit pas être vide' );
                                            return false;
                                        }
                                    }
                                    var regMail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                                    if (regMail.test(this.getValue()) == false)
                                    {
                                        alert('Courriel invalide');
                                        return false;
                                    }
                                    break;
                                case 'tel:':
                                    if(this.getValue() == ''){
                                        if(LinkTypeValue != '#'){
                                            alert( 'Le champ téléphone ne doit pas être vide' );
                                            return false;
                                        }
                                    }
                                    if ( isNaN(this.getValue()) ) {
                                        alert('Numéro de téléphone invalide');
                                        return false;
                                    }
                                    break;
                                case 'cal:':
                                    if(this.getValue() == ''){
                                        if(LinkTypeValue != '#'){
                                            alert( 'Le champ nom de l\'événement ne doit pas être vide' );
                                            return false;
                                        }
                                    }
                                    break;
                            }
                        },
                        setup: function( element ) {
                            var that = this;
                            var elHrefVal = element.getAttribute( "href" );
                            if(element.getAttribute( "name" ) && element.getAttribute( "name" ).length){
                                var tname = element.getAttribute( "name" );
                                elHrefVal = element.getAttribute( "href" ).replace(tname,'');
                            }
                            // this.setValue(elHrefVal);
                            var isFormBlocDisplayed = getFrmDisplayValue();
                            if(!isFormBlocDisplayed && element.getAttribute( "name" ) && element.getAttribute( "name" ).length && element.getAttribute('name') == 'form:'){
                                this.setValue("");
                            }
                            // this.setValue( element.getAttribute( "href" ) );
                            if(element.getAttribute( "name" ) && element.getAttribute( "name" ).length && element.getAttribute('name') == 'mailto:'){
                                var newelHrefVal = elHrefVal.split('?subject=')[0];
                                elHrefVal = newelHrefVal;
                            }
                            this.setValue(elHrefVal);
                            // When calendar selected
                            if(element.getAttribute( "name" ) && element.getAttribute( "name" ).length && element.getAttribute('name') == 'cal:'){
                                var allText         = fetchEventInfos(elHrefVal);
                                var sujet           = allText.split("SUMMARY;LANGUAGE=en-us:")[1].split("TRANSP")[0];
                                var lieu            = allText.split("LOCATION:")[1].split("SUMMARY")[0];
                                var lieu_r          = lieu.replace(/\\,/g, ",");
                                var description     = allText.split("DESCRIPTION:")[1].split("DTSTAMP")[0];
                                description     = description.replace(/\\n/g, "\n");
                                var beginDate       = allText.split("DTSTART;VALUE=DATE-TIME:")[1].split("DTEND")[0];
                                var endDate         = allText.split("DTEND;VALUE=DATE-TIME:")[1].split("LOCATION")[0];
                                var alert           = '1440';
                                if(allText.split("TRIGGER;VALUE=DURATION:-PT")[1] !== undefined){
                                    alert           = allText.split("TRIGGER;VALUE=DURATION:-PT")[1].split("ACTION:DISPLAY")[0];
                                }
                                var alertValArray   = getAlertValueArray(alert);
                                var alertVal        = alertValArray[1];
                                var alertValUnit    = alertValArray[0];
                                var thatdialog      = that.getDialog();
                                thatdialog.setValueOf('tab-basic','button-url',sujet);
                                thatdialog.setValueOf('tab-basic','adcalendar',lieu_r);
                                thatdialog.setValueOf('tab-basic','descalendar',"");
                                thatdialog.setValueOf('tab-basic','descalendar',description);
                                thatdialog.setValueOf('tab-basic','alertInput',alertVal);
                                thatdialog.setValueOf('tab-basic','alertInputSelect',alertValUnit);
                                // Parse Begin Date
                                var beginYear       = beginDate.substring(0,4);
                                var beginMonth      = beginDate.substring(4,6);
                                var beginDay        = beginDate.substring(6,8);
                                var beginHour       = beginDate.substring(9,11);
                                var beginMinute     = beginDate.substring(11,13);
                                var beginSecond     = beginDate.substring(13,15);
                                var beginDateParsed = beginDay + "/" + beginMonth + "/" + beginYear + " " + beginHour + ":" + beginMinute;
                                thatdialog.setValueOf('tab-basic','begincalendar',beginDateParsed);
                                // Parse End Date
                                var endYear         = endDate.substring(0,4);
                                var endMonth        = endDate.substring(4,6);
                                var endDay          = endDate.substring(6,8);
                                var endHour         = endDate.substring(9,11);
                                var endMinute       = endDate.substring(11,13);
                                var endSecond       = endDate.substring(13,15);
                                // var endDateParsed = endMonth + "/" + endDay + "/" + endYear + " " + endHour + ":" + endMinute + ":" + endSecond;
                                var endDateParsed   = endDay + "/" + endMonth + "/" + endYear + " " + endHour + ":" + endMinute;
                                thatdialog.setValueOf('tab-basic','endcalendar',endDateParsed);

                            }
                            // this.setValue(elHrefVal);
                        },
                        commit: function( element ) {
                            var dialog = this.getDialog();
                            var LinkTypeValue = dialog.getValueOf('tab-basic','linkType');
                            var newHrefValue = LinkTypeValue + this.getValue();
                            if(this.getValue().indexOf( '://' ) !== -1 || this.getValue().indexOf( 'tel:' ) !== -1 || this.getValue().indexOf( 'mailto:' ) !== -1 ){
                                newHrefValue = this.getValue();
                            }
                            if(LinkTypeValue == 'mailto:'){
                                var mailObjectValue = dialog.getValueOf('tab-basic','mail-object');
                                var mailMessageValue = dialog.getValueOf('tab-basic','mail-messages');
                                newHrefValue = newHrefValue + '?subject=' + mailObjectValue + '&body=' + mailMessageValue.replace(/(?:\r|\n|\r\n)/g, '%0D%0A');
                            }
                            // Ajout calendrier
                            if(LinkTypeValue == 'cal:'){
                                var subjectValue    = this.getValue();
                                // subjectValue    = subjectValue.replace(",", "\\,");
                                var addressValue    = dialog.getValueOf('tab-basic','adcalendar');
                                // addressValue    = addressValue.replace(",", "\\,");
                                var descValue       = dialog.getValueOf('tab-basic','descalendar');
                                var eventBeginValue = dialog.getValueOf('tab-basic','begincalendar');
                                var eventEndValue   = dialog.getValueOf('tab-basic','endcalendar');
                                var alertValue      = dialog.getValueOf('tab-basic','alertInput');
                                var alertUnitValue  = dialog.getValueOf('tab-basic','alertInputSelect');
                                var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
                                // Alerte
                                var valueALert      = alertValue;
                                var unitALert       = alertUnitValue;
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

                                // var beginDateCal    = moment(new Date(eventBeginValue)).format('MM/DD/YYYY H:mm');
                                var beginDateCal    = moment(eventBeginValue, 'DD/MM/YYYY H:mm').format('MM/DD/YYYY H:mm');
                                var EndDateCal      = moment(eventEndValue, 'DD/MM/YYYY H:mm').format('MM/DD/YYYY H:mm');
                                var descCal = descValue;
                                if((descValue.match(/\n/g)||[]).length > 0){
                                    descCal = descValue.replace(/(\r\n|\n|\r)/gm, " \\n ");
                                }

                                var  placeCal = addressValue.split(',').join('\\,');

                                var cal_single = ics();
                                cal_single.addEvent(subjectValue, descCal, placeCal, beginDateCal, EndDateCal);
                                // cal_single.download('Mon agenda');
                                var the_cal = cal_single.build();
                                var cdata = new FormData();
                                cdata.append("caldata" , the_cal);
                                cdata.append("session", cid);
                                var dateUniqueId = new Date().valueOf();
                                var uid = "event_"+ dateUniqueId +".ics";
                                cdata.append("iswysiwyg", uid);
                                var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
                                xhr.open( 'post', '../server/service/postCalendar.php', true );
                                xhr.send(cdata);

                                newHrefValue = "../server/files/" + cid + "/calendar/" + uid;
                                // LinkTypeValue = this.getValue();
                            }

                            element.setAttribute( "href", newHrefValue );
                            element.setAttribute( "name", LinkTypeValue );
                            element.removeAttribute('data-cke-saved-href');
                            element.removeAttribute('data-cke-saved-name');
                        }
                    },
                    {
                        type: 'vbox',
                        id: 'mailbox',
                        label: 'Infos',
                        // widths: ['320px'],
                        children: [
                            {
                                type: 'text',
                                id: 'mail-object',
                                label: 'Objet du mail',
                                validate: function(element) {
                                    var adialog = this.getDialog();
                                    var linkTypen = adialog.getContentElement( 'tab-basic', 'linkType' );
                                    if(linkTypen.getValue() == 'mailto:'){
                                        if(this.getValue() == ''){
                                            alert( "Objet du mail ne doit pas être vide" );
                                            return false;
                                        }
                                    }
                                },
                                setup: function( element, preview ) {
                                    if(element.getAttribute( "name" ) && element.getAttribute( "name" ).length && element.getAttribute('name') == 'mailto:'){
                                        this.setValue(element.getAttribute( "href" ).split('subject=')[1].split('&body')[0]);
                                    }
                                },
                                commit: function( element ) {
                                    var adialog = this.getDialog();
                                    var mailObjectInput = adialog.getContentElement( 'tab-basic', 'mail-object' );
                                    mailObjectInput.getElement().setAttribute('name',this.getValue());
                                }
                            },
                            {
                                type: 'textarea',
                                id: 'mail-messages',
                                label: 'Corps du mail',
                                rows: 3,
                                validate: function() {
                                    var adialog = this.getDialog();
                                    var linkTypenc = adialog.getContentElement( 'tab-basic', 'linkType' );
                                    if(linkTypenc.getValue() == 'mailto:'){
                                        if(this.getValue() == ''){
                                            alert( "Le corps du mail ne doit pas être vide" );
                                            return false;
                                        }
                                    }
                                },
                                setup: function (element) {
                                    if(element.getAttribute( "name" ) && element.getAttribute( "name" ).length && element.getAttribute('name') == 'mailto:'){
                                        var thisVal = element.getAttribute( "href" ).split('&body=')[1];
                                        var remThisVal = thisVal.replace(/%0D%0A/g, '\n');
                                        this.setValue(remThisVal);
                                    }
                                },
                                commit: function( element ) {
                                    var adialog = this.getDialog();
                                    var mailBodyInput = adialog.getContentElement( 'tab-basic', 'mail-messages' );
                                    mailBodyInput.getElement().setAttribute('name',this.getValue());
                                }
                            }
                        ]
                    },
                    {
                        type: 'vbox',
                        id: 'eventbox',
                        label: '',
                        controlStyle:'background-color: #9D9D9D',
                        vboxStyle:'background-color: #9D9D9D',
                        children: [
                            {
                                type: 'text',
                                id: 'adcalendar',
                                label: 'Adresse de l\'événement',
                                labelStyle: 'float:left;',
                                inputStyle: 'width: 57%; float: right'
                            },
                            {
                                type: 'textarea',
                                id: 'descalendar',
                                label: 'Description de l\'événement',
                                labelStyle: 'float:left;',
                                inputStyle: 'width: 57%; float: right',
                                rows: 3
                            },
                            {
                                type: 'hbox',
                                id: 'alertbox',
                                widths: ['44%','50%'],
                                children: [
                                    {
                                        type: 'text',
                                        id: 'alertInput',
                                        label: 'Alerte',
                                        labelStyle: 'float:left;',
                                        inputStyle: 'width: 64%; float: left; margin-left:20px;height:29px',
                                        validate: CKEDITOR.dialog.validate.integer('La valeur de l\'alerte doit être de type numérique')
                                    },
                                    {
                                        type: 'select',
                                        id: 'alertInputSelect',
                                        label: '',
                                        labelStyle: 'float:left;;font-weight:bold',
                                        inputStyle: 'width: 228px;',
                                        items: [
                                            [ "Jour(s)", "D" ],
                                            [ "Heure(s)", "H" ],
                                            [ "Minutes(s)", "M"]
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'text',
                                id: 'begincalendar',
                                label: 'Date de début (Europe/Paris)*',
                                validate: function(element) {
                                    var adialog = this.getDialog();
                                    var linkTypen = adialog.getContentElement( 'tab-basic', 'linkType' );
                                    if(linkTypen.getValue() == 'cal:'){
                                        if(this.getValue() == ''){
                                            alert( "La date de début ne doit pas être vide" );
                                            return false;
                                        }
                                        var regDate = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
                                        if (regDate.test(this.getValue()) == false)
                                        {
                                            alert('Date de début invalide');
                                            return false;
                                        }
                                    }
                                },
                                setup: function( element, preview ) {
                                    var thisbgId = this.getElement().getId();
                                    var todayb = moment().format('DD/MM/YYYY H:mm');
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
                                    $('#' + thisbgId).find('input').datetimepicker({
                                        autoclose: true,
                                        format: 'dd/mm/yyyy hh:ii',
                                        language: 'fr',
                                        startDate: todayb
                                    });
                                },
                                commit: function( element ) {
                                    var adialog = this.getDialog();
                                    var beginCalInput = adialog.getContentElement( 'tab-basic', 'begincalendar' );
                                    beginCalInput.getElement().setAttribute('name',this.getValue());
                                }
                            },
                            {
                                type: 'text',
                                id: 'endcalendar',
                                label: 'Date de fin (Europe/Paris)*',
                                validate: function(element) {
                                    var adialog = this.getDialog();
                                    var linkTypen = adialog.getContentElement( 'tab-basic', 'linkType' );
                                    if(linkTypen.getValue() == 'cal:'){
                                        if(this.getValue() == ''){
                                            alert( "La date de fin ne doit pas être vide" );
                                            return false;
                                        }
                                        var regDate = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
                                        if (regDate.test(this.getValue()) == false)
                                        {
                                            alert('Date de fin invalide');
                                            return false;
                                        }
                                    }
                                },
                                setup: function( element, preview ) {
                                    var thisId = this.getElement().getId();
                                    var todaye = moment().format('DD/MM/YYYY H:mm');
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
                                    $('#' + thisId).find('input').datetimepicker({
                                        autoclose: true,
                                        format: 'dd/mm/yyyy hh:ii',
                                        language: 'fr',
                                        startDate: todaye
                                    });
                                },
                                commit: function( element ) {
                                    var adialog = this.getDialog();
                                    var endCalInput = adialog.getContentElement( 'tab-basic', 'endcalendar' );
                                    endCalInput.getElement().setAttribute('name',this.getValue());
                                }
                            }
                        ]
                    },
                    {
                        type: 'select',
                        id: 'font-family',
                        label: 'Police',
                        labelStyle: 'float:left; margin-right: 16%;width:100px;font-weight:bold',
                        inputStyle: 'width:210px',
                        items: [
                            ['Arial Bold','Arial Bold'], ['Arial Rounded Bold','Arial Rounded Bold'], ['Calibri','Calibri'], ['Century Gothic','Century Gothic'],  ['Comic Sans MS','Comic Sans MS'],  ['Courier New','Courier New'],
                            ['Helvetica','Helvetica'], ['Helvetica Narrow','Helvetica Narrow'], ['Helvetica Black','Helvetica Black'], ['Helvetica Light','Helvetica Light'], ['Impact','Impact'], ['Neuropol','Neuropol'],
                            ['Palatino Roman','Palatino Roman'], ['Tahoma','Tahoma'],  ['Take Cover','Take Cover'],['Times New Roman','Times New Roman'], ['Verdana','Verdana']
                        ],
                        setup: function( element, preview ) {
                            var inputId = this.getInputElement().getId();
                            var thisInputId = $('#' + inputId );
                            this.getInputElement().forEach(function (node) {
                                if(node.$.value !== undefined){
                                    node.setStyle('font-family', node.$.value);
                                }
                            });

                            this.preview_button = preview;
                            // this.setValue( element.getStyle('font-family').replace(/\\([\s\S])|(")/g,""));
                            // this.setValue( element.getStyle('font-family').replace(/&quot;/g,'');
                            this.setValue( element.getStyle('font-family').replace(/^"(.*)"$/, '$1'));
                            thisInputId.css('font-family', element.getStyle('font-family'));
                        },
                        commit: function( element ) {
                            element.setStyle( 'font-family', this.getValue().replace(/^"(.*)"$/, '$1'));
                        },
                        onChange: function() {
                            this.preview_button.setStyle('font-family',this.getValue());
                            var inputId = this.getInputElement().getId();
                            var thisInputId = $('#' + inputId );
                            thisInputId.css('font-family', this.getValue());
                        }
                    },
                    {
                        type: 'text',
                        id: 'font-size',
                        label: 'Taille police (px)',
                        labelStyle: 'float:left; margin-right: 16%;width:100px;font-weight:bold',
                        inputStyle: 'width: 57%; float: right',
                        controlStyle: 'margin-bottom:20px',
                        setup: function( element, preview ) {
                            this.preview_button = preview;
                            this.setValue( element.getStyle('font-size').split('px')[0] );

                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );

                            var slider_ctfirst = thisInputId.slider({
                                min: 12,
                                max: 20,
                                value: parseInt(element.getStyle('font-size').split('px')[0])
                            }).on("change", function (e) {
                                thisInputId.val(parseInt(e.value.newValue));
                                preview.setStyle('font-size', e.value.newValue + 'px');
                            }).data('slider_ctfirst');
                        },
                        commit: function( element ) {
                            element.setStyle( 'font-size', this.getValue() + 'px' );
                        }
                    },
                    {
                        type: 'text',
                        id: 'button-size',
                        label: 'Longueur du bouton (px)',
                        labelStyle: 'float:left; margin-right: 16%;width:100px;font-weight:bold',
                        inputStyle: 'width: 57%; float: right',
                        controlStyle: 'margin-bottom:20px',
                        setup: function( element, preview ) {
                            this.preview_button = preview;
                            this.setValue( element.getStyle('width').split('px')[0] );
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            var slider_btn_length = thisInputId.slider({
                                min: 75,
                                max: 250,
                                value: parseInt(element.getStyle('width').split('px')[0])
                            }).on("change", function (e) {
                                thisInputId.val(parseInt(e.value.newValue));
                                preview.setStyle('width', e.value.newValue + 'px');
                            }).data('slider_btn_length');
                        },
                        commit: function( element ) {
                            element.setStyle( 'width', this.getValue() + 'px' );
                            // element.setStyle( 'text-align', 'center' );
                        }
                    },
                    {
                        type: 'text',
                        id: 'border-width',
                        label: 'Taille de la bordure (px)',
                        labelStyle: 'float:left; margin-right: 16%;width:100px;font-weight:bold',
                        inputStyle: 'width: 57%; float: right',
                        controlStyle: 'margin-bottom:20px',
                        setup: function( element, preview ) {
                            this.preview_button = preview;
                            this.setValue( element.getStyle('border-width').split('px')[0] );
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            var slider_btn_bw = thisInputId.slider({
                                min: 0,
                                max: 10,
                                value: parseInt(element.getStyle('border-width').split('px')[0])
                            }).on("change", function (e) {
                                thisInputId.val(parseInt(e.value.newValue));
                                preview.setStyle('border-width', e.value.newValue + 'px');
                            }).data('slider_btn_bw');
                        },
                        commit: function( element ) {
                            element.setStyle( 'border-width', this.getValue() + 'px' );
                        }
                    },
                    {
                        type: 'text',
                        id: 'border-radius',
                        label: 'Taille des arrondis (px)',
                        labelStyle: 'float:left; margin-right: 16%;width:100px;font-weight:bold',
                        inputStyle: 'width: 57%; float: right',
                        controlStyle: 'margin-bottom:20px',
                        setup: function( element, preview ) {
                            this.preview_button = preview;
                            this.setValue( element.getStyle('border-radius').split('px')[0] );
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            var slider_btn_br = thisInputId.slider({
                                min: 0,
                                max: 20,
                                value: parseInt(element.getStyle('border-radius').split('px')[0])
                            }).on("change", function (e) {
                                thisInputId.val(parseInt(e.value.newValue));
                                preview.setStyle('border-radius', e.value.newValue + 'px');
                            }).data('slider_btn_br');
                        },
                        commit: function( element ) {
                            element.setStyle( 'border-radius', this.getValue() + 'px' );
                        }
                    },
                    {
                        type: 'text',
                        id: 'bgColorInput',
                        label: 'Couleur de fond',
                        labelStyle: 'float:left;width:335px;font-weight:bold',
                        inputStyle: 'width: 10%;height: 40px; border-raidus: 100%; -webkit-border-radius: 100%; -moz-border-radius: 100%; cursor: pointer',
                        controlStyle: 'margin-bottom:10px',
                        setup : function (element, preview) {
                            this.preview_button = preview;
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            thisInputId.attr('spellcheck','false');
                            thisInputId.colpick({
                                onShow: function(){
                                    var redc = rgbToHex(colorValues(thisInputId.val())[0]);
                                    var greenc = rgbToHex(colorValues(thisInputId.val())[1]);
                                    var bluec = rgbToHex(colorValues(thisInputId.val())[2]);
                                    thisInputId.colpickSetColor(redc+greenc+bluec,true);
                                },
                                onChange:function(hsb,hex,rgb,el,bySetColor) {
                                    $(el).val('#'+hex);
                                    preview.setStyle('background-color', '#'+hex);
                                    thisElem.setStyle('background-color', '#'+hex);
                                    thisElem.setStyle('color', '#'+hex);
                                },
                                onSubmit: function (a, b ,c) {
                                    thisInputId.colpickHide();
                                }
                            });
                            this.setValue( element.getStyle('background-color').split('px')[0] );
                            thisElem.setStyle('background-color', element.getStyle('background-color').split('px')[0]);
                            thisElem.setStyle('color', element.getStyle('background-color').split('px')[0]);
                        },
                        onChange: function() {
                            this.preview_button.setStyle('background-color', this.getValue());
                        },
                        commit: function( element ) {
                            element.setStyle( 'background-color', this.getValue());
                        }
                    },
                    {
                        type: 'text',
                        id: 'txtColorInput',
                        label: 'Couleur du texte',
                        labelStyle: 'float:left;width:335px; font-weight:bold',
                        inputStyle: 'width: 10%; height: 40px; border-raidus: 100%; -webkit-border-radius: 100%; -moz-border-radius: 100%; cursor: pointer',
                        controlStyle: 'margin-bottom:10px',
                        setup : function (element, preview) {
                            this.preview_button = preview;
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            thisInputId.attr('spellcheck','false');
                            thisInputId.colpick({
                                onShow: function(){
                                    var redc = rgbToHex(colorValues(thisInputId.val())[0]);
                                    var greenc = rgbToHex(colorValues(thisInputId.val())[1]);
                                    var bluec = rgbToHex(colorValues(thisInputId.val())[2]);
                                    thisInputId.colpickSetColor(redc+greenc+bluec,true);
                                },
                                onChange:function(hsb,hex,rgb,el,bySetColor) {
                                    $(el).val('#'+hex);
                                    preview.setStyle('color', '#'+hex);
                                    thisElem.setStyle('background-color', '#'+hex);
                                    thisElem.setStyle('color', '#'+hex);
                                },
                                onSubmit: function (a, b ,c) {
                                    thisInputId.colpickHide();
                                }
                            });
                            this.setValue( element.getStyle('color').split('px')[0] );
                            thisElem.setStyle('background-color', element.getStyle('color').split('px')[0]);
                            thisElem.setStyle('color', element.getStyle('color').split('px')[0]);
                        },
                        onChange: function() {
                            this.preview_button.setStyle('color', this.getValue());
                        },
                        commit: function( element ) {
                            element.setStyle( 'color', this.getValue());
                        }

                    },
                    {
                        type: 'text',
                        id: 'borderColorInput',
                        label: 'Couleur de la bordure',
                        labelStyle: 'float:left;width:335px;font-weight:bold',
                        inputStyle: 'width: 10%; height: 40px; border-raidus: 100%; -webkit-border-radius: 100%; -moz-border-radius: 100%; cursor: pointer;margin-bottom:100px',
                        controlStyle: 'margin-bottom:10px',
                        setup : function (element, preview) {
                            this.preview_button = preview;
                            var inputId = this.getInputElement().getId();
                            var thisElem = this.getInputElement();
                            var thisInputId = $('#' + inputId );
                            thisInputId.attr('spellcheck','false');
                            thisInputId.colpick({
                                onShow: function(){
                                    var redc = rgbToHex(colorValues(thisInputId.val())[0]);
                                    var greenc = rgbToHex(colorValues(thisInputId.val())[1]);
                                    var bluec = rgbToHex(colorValues(thisInputId.val())[2]);
                                    thisInputId.colpickSetColor(redc+greenc+bluec,true);
                                },
                                onChange:function(hsb,hex,rgb,el,bySetColor) {
                                    $(el).val('#'+hex);
                                    preview.setStyle('border-color', '#'+hex);
                                    thisElem.setStyle('background-color', '#'+hex);
                                    thisElem.setStyle('color', '#'+hex);
                                },
                                onSubmit: function (a, b ,c) {
                                    thisInputId.colpickHide();
                                }
                            });
                            this.setValue( element.getStyle('border-color').split('px')[0] );
                            thisElem.setStyle('background-color', element.getStyle('border-color').split('px')[0]);
                            thisElem.setStyle('color', element.getStyle('border-color').split('px')[0]);
                        },
                        onChange: function() {
                            this.preview_button.setStyle('border-color', this.getValue());
                        },
                        commit: function( element ) {
                            element.setStyle( 'border-color', this.getValue());
                        }
                    },
                    {
                        type : 'html',
                        html : '<div class="cke_btn_preview"><p class="cke_preview_title">Aperçu</p><div style="background-color: #ccc;border: 1px solid #bbb;padding: 10px;text-align: center;"><a class="preview-button"></a></div></div>',
                        setup: function( element ) {
                            var _table = this.getElement().getAscendant('table');
                            var preview_button = _table.findOne(".preview-button");
                            preview_button.setAttribute( "style", element.getAttribute( "style" ) );
                            preview_button.setText( element.getText() );
                            $('.cke_btn_preview').parent().parent().wrapAll("<div style='display: block;position:absolute!important;bottom:0;right:0;left:0;'></div>");
                            $('.cke_btn_preview').parent().parent().css('position','relative');
                            $('.cke_btn_preview').parent().css('position','absolute');
                            $('.cke_btn_preview').parent().css('bottom','45px');
                            $('.cke_btn_preview').parent().css('width','443px');
                            $('.cke_btn_preview').parent().css('left','0px');
                        }
                    }
                ]
            }
        ],
        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( !element || !element.hasClass('simple-button-plugin') ) {
                element = editor.document.createElement( 'a' );
                element.setAttribute('class', 'simple-button-plugin');
                element.setAttribute('target', '_blank');
                // var style_button = 'display:inline-block;background-color:#27AE61;border: 2px solid #27AE61;color:#fff !important;padding:5px 10px;border-radius:5px;font-size:14px;width:110px;text-decoration: none !important; cursor: pointer;';
                var style_button = 'display:inline-block;background-color:#27AE61;border-style:solid;border-width:2px;border-color:#27AE61; color:#fff !important;padding:5px 10px;border-radius:5px;font-size:14px;width:110px;text-decoration: none !important; cursor: pointer;margin:auto;';
                element.setAttribute( "style", style_button );
                element.setText( 'Mon bouton' );
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;

            var preview_button = this.getElement().findOne(".preview-button");
            this.setupContent( this.element, preview_button );

            //Footer buttons fixed position
            // $('.cke_dialog_footer').parent().parent().css('position','relative');
            $('.cke_dialog_footer').parent().wrapAll("<div style='display: block;position:absolute!important;bottom:0;right:0;left:0;'></div>");
        },
        onOk: function() {
            var dialog = this;
            var simple_btn = this.element;
            if(simple_btn.getAttribute('name') != 'http://' || this.getValueOf('tab-basic','linkType') != 'http://'){
                simple_btn.setAttribute('target','_self');
            }
            this.commitContent(simple_btn);
            if ( this.insertMode )
                editor.insertElement(simple_btn);
        }
    };
});