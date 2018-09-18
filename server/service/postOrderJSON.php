<?php

if (isset($_POST) && isset($_POST["session"]) && isset($_POST["content"])) {
    $session = $_POST["session"];
    $content = $_POST["content"];

    $dir = '../files/'.$session.'';

    /*
     * Création du dossier avec l'id client
     */

    if (!is_dir($dir)) {
        @mkdir($dir);
    }
    if ($content != null) {
        file_put_contents($dir . '/order.json', json_encode($content));
    } else {
        $order = file_get_contents($dir . '/order.json');
        if ($order) {
            echo json_decode($order, true);
        }
        echo $order;
    }
}

?>
