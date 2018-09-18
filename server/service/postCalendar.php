<?php
/**
 * Created by PhpStorm.
 * User: Andry
 * Date: 17/04/2018
 * Time: 17:57
 */
if(!empty($_POST['caldata'])  && !empty($_POST["session"])){
    $data = $_POST['caldata'];
    $dataA = $_POST['caldataA'];
    $session = $_POST["session"];
    $dir = '../files/'.$session.'/';
    /*
     * Création du dossier avec l'id client
     */
    if (!is_dir($dir)) {
        @mkdir($dir);
    }
    if (!is_dir($dir.'calendar')) {
        @mkdir($dir.'calendar');
    }
   
    if(isset($_POST['iswysiwyg'])){
        $fname = $_POST['iswysiwyg'];
        $file = fopen($dir . "calendar/" .$fname, 'w');//creates new file
        fwrite($file, html_entity_decode($data,  ENT_QUOTES));
        fclose($file);
    }
    else{
        $fname = "event.ics";//generates random name
        $file = fopen($dir . "calendar/iphone_" .$fname, 'w');//creates new file
        fwrite($file, html_entity_decode($data,  ENT_QUOTES));
        fclose($file);
    
        $fileA = fopen($dir . "calendar/" .$fname, 'w');//creates new file
        fwrite($fileA, html_entity_decode($dataA,  ENT_QUOTES));
        fclose($fileA);
    }
    

    echo json_encode($fname);
}