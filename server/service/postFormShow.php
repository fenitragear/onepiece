<?php
/**
 * Created by PhpStorm.
 * User: Andry
 * Date: 08/05/2018
 * Time: 17:27
 */
if(!empty($_POST['formShowVal']) && !empty($_POST["session"])){
    $data = $_POST['formShowVal'];
    $session = $_POST["session"];
    $dir = '../files/'.$session.'/';
    /*
     * Création du dossier avec l'id client
     */
    if (!is_dir($dir)) {
        @mkdir($dir);
    }
    if (!is_dir($dir.'form')) {
        @mkdir($dir.'form');
    }

    $fname = "formshow.txt";//generates random name
    $file = fopen($dir . "form/" .$fname, 'w');//creates new file
    fwrite($file, html_entity_decode($data,  ENT_QUOTES));
    fclose($file);

    echo json_encode($fname);
}