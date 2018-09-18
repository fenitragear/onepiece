<?php

if (isset($_POST) && isset($_POST["session"]) && isset($_POST["content"])) {
    $phpFormURL = $_POST["formDataSubmitUrl"];
    $session = $_POST["session"];
    $content = $_POST["content"];

    $formData = isset($_POST["formData"]) ? $_POST["formData"] : array();

    $limit = $_POST["limit"] == 'true'? true : false;
    $isValid = true;
    $dir = '../files/'.$session.'/';

    /*
     * Création du dossier avec l'id client
     */

    if (!is_dir($dir)) {
        @mkdir($dir);
        @mkdir($dir.'slider');
        @mkdir($dir.'scratch');
        @mkdir($dir.'formData');
    }

    if (!is_dir($dir.'formData')) {
        @mkdir($dir.'formData');
    }

    if ($limit) {
        $summaryDataJson = "";

        if (file_exists($dir.'formsMainData.json')) {
            $summaryDataJson = file_get_contents($dir.'/formsMainData.json');
        }

        $sdj = json_encode($formData);

        if (strpos($summaryDataJson, $sdj) === false) {
            file_put_contents($dir . 'formsMainData.json', $sdj . "\n",  FILE_APPEND);
        } else {
            $isValid = false;
        }
    } else {
        $sdj = "";
    }

    if ($isValid) {
        $contentObj = new stdClass();

        foreach ($content as $cont) {
            $contentObj->{$cont['name']} = $cont['value'];
        }

        $data_string = json_encode($contentObj, JSON_UNESCAPED_UNICODE);
        file_put_contents($dir .'formData/'. 'formData_'.uniqid().'.json', $data_string);

        if (!is_dir($dir . "config.json")) {
            $ch = curl_init( $phpFormURL);
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $data_string );
            curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
            curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
            $result = curl_exec($ch);
            curl_close($ch);
        }
    } 

    echo json_encode(array("isValid" => $isValid, "data"=>$formData));

    exit();
}

function echo_array ($content) {
    echo "<div style='margin-left:15px'>";

    foreach ($content as $key => $row) {
        if (!is_array($row)) {
            $row = substr(strip_tags($row), 0, 100) . (strlen($row) > 100 ? "..." : "");
            echo "<b style='color:red'>$key</b> =>  <div style='margin-left:15px'>$row</div>";
        } else {
            echo "<b style='color:blue'>$key</b> =><br />";
            echo_array($row);
            echo "<br />";
        }
    }

    echo "</div>";
}
