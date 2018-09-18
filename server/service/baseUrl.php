<?php 

if (isset($_POST) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $protocol = (!empty($_SERVER['HTTPS'])) ? 'https' : 'http';
    $baseUrl = $protocol . "://" . $_SERVER['SERVER_NAME'];
    $uri = substr($_SERVER['REQUEST_URI'], 0,  strrpos ( $_SERVER['REQUEST_URI'], "server")) ;
    $app = $baseUrl. $uri . "app/";

    //$app = str_replace("server","app", $app);
    $server = $baseUrl . $uri . "server/";

    $dir = '../files/'.$session.'/';
    $file_json = json_decode(file_get_contents($dir . 'settings.json'));
    $formShow = false;

    if ($file_json->forms->formShow == "true") {
        $formShow = true;
    }

    echo json_encode(array("baseUrl" => $baseUrl, "app" => $app, "server" => $server, "formShow" => $formShow));
}
