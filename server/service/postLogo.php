<?php

if (isset($_FILES) && isset($_FILES["logo"]) && !empty($_FILES) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $ext = strtolower(pathinfo($_FILES["logo"]["name"], PATHINFO_EXTENSION));

    $file_dir = '/files/'.$session.'/logo.'.$ext;
    $target_dir = '..'.$file_dir;

    $dir = '../files/'.$session.'/';
    /*
     * Création du dossier avec l'id client
     */

    define('IMAGE_CROP_WIDTH', 600);
    define('IMAGE_CROP_HEIGHT', 300);

    $im = new imagick($_FILES["logo"]["tmp_name"]);
    $format = $im->getImageFormat();

    if ($format == 'GIF') {
        if (move_uploaded_file($_FILES["logo"]["tmp_name"], $target_dir)) {

        } else {
            die("error");
        }
    } else {
        $im->resizeImage(IMAGE_CROP_WIDTH, IMAGE_CROP_HEIGHT, imagick::FILTER_LANCZOS, 1, true);
        $im->writeImage($target_dir);
    }

    $return = array();
    $return["file"] = '../server' . $file_dir . "?t=" . time();
    echo json_encode($return);




   /* if (move_uploaded_file($_FILES["logo"]["tmp_name"], $target_dir))
    {
        $return["file"] = '/server'. $file_dir;
        echo json_encode($return);
    }*/
}