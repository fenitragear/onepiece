<?php

if (isset($_POST) && isset($_POST["session"]) && isset($_POST["content"])) {
    $session = $_POST["session"];
    $content = $_POST["content"];

    $dir = '../files/'.$session.'';

    if (!is_dir('../files')) {
        @mkdir('../files');
    }

    /*
     * Création du dossier avec l'id client
     */

    if (!is_dir($dir)) {
        @mkdir($dir);
    }

    if (!is_dir($dir . '/slider')) {
        @mkdir($dir . '/slider');
    }

    if (!is_dir($dir . '/scratch')) {
        @mkdir($dir . '/scratch');
    }

    if (!is_dir($dir . '/shake')) {
        @mkdir($dir . '/shake');
    }

    if (!is_file($dir . '/config.php')) {
        copy("./default-config.php", $dir . '/config.php');
    }

    if (!is_file($dir . '/config.json')) {
        $str=file_get_contents('./default-config.json');
        $str=str_replace("[OPEKEY]", $session,$str);
        file_put_contents($dir . '/config.json', $str);
    }

    file_put_contents($dir . '/settings.json', json_encode($content));

    echo_array($content);
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
