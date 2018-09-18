<?php 
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

}

if (isset($_GET) && isset($_GET["opeKey"]) && isset($_GET["nList"]) && isset($_GET["nRec"])) {
    switch ($_GET["nRec"]) {
        case 1:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"1","errorCode":0,"errorMessage":"OK","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}],"record":[{"name":"PRENOM","value":"Julie"},{"name":"NOM","value":"Martinez"},{"name":"SMS","value":"06 75 55 55 06"}]}';
            break;
        case 2:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"2","errorCode":0,"errorMessage":"OK","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}],"record":[{"name":"PRENOM","value":"Thillel"},{"name":"NOM","value":"Ba"},{"name":"SMS","value":"06 78 86 92 06"}]}';
            break;
        case 3:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"3","errorCode":0,"errorMessage":"OK","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}],"record":[{"name":"PRENOM","value":"S"},{"name":"NOM","value":"Heuclin"},{"name":"SMS","value":"06 79 75 61 69"}]}';
            break;
        case 4:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"4","errorCode":0,"errorMessage":"OK","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}],"record":[{"name":"PRENOM","value":"Philippe"},{"name":"NOM","value":"Israel"},{"name":"SMS","value":"685812475"}]}';
            break;
        case 5:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"5","errorCode":0,"errorMessage":"OK","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}],"record":[{"name":"PRENOM","value":"Guillaume"},{"name":"NOM","value":"FOURMAULT"},{"name":"SMS","value":"06 70 53 30 04"}]}';
            break;
        default:
            $json = '{"nblist":2,"Nlist":"1","Nrec":"6","errorCode":103,"errorMessage":"Record n\\u00b0 6 no exist !","list":[{"numero":1,"name":"TEST_SMS_COURIR.CSV "},{"numero":2,"name":"PORTABLES_NETMESSAGE.CSV "}]}';
            break;
    }
    echo $json;
}
