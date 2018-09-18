<?php

if (isset($_POST) && isset($_POST["session"]) && isset($_POST["content"])) {
    $session = $_POST["session"];
    $content = $_POST["content"];

    $dir = '../files/'.$session.'/';

    /*
     * Création du dossier avec l'id client
     */

    if (!is_dir($dir)) {
        @mkdir($dir);
        @mkdir($dir.'/slider');
        @mkdir($dir.'/scratch');
    }

    file_put_contents($dir . 'sourceCode.html', $content);
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
