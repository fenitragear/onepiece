<?php

if (isset($_FILES) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $dir = '../files/'.$session;

    if (is_dir($dir)) {
        echo json_encode('ok');
    }else{
        echo json_encode('nok');
    }
}