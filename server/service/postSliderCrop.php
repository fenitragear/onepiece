<?php

if (isset($_FILES) && isset($_FILES["filecropped"]) && !empty($_FILES) && isset($_POST["session"]) && isset($_POST["filename"]) && isset($_POST["imageFormat"])) {
    $session = $_POST["session"];
    $dir = '/files/'.$session.'/slider';

    $ext = strtolower(pathinfo($_FILES["filecropped"]["name"], PATHINFO_EXTENSION));
    $file = $_POST["filename"];

    $file_dir = $dir  . "/" .$_POST["imageFormat"]."/". $file; 
    $target_dir = '..'.$file_dir;

    define('IMAGE_CROP_WIDTH', 1000);
    define('IMAGE_CROP_HEIGHT', 700);

    $im = new imagick($_FILES["filecropped"]["tmp_name"]);

    $format = $im->getImageFormat();

    if ($format == 'GIF') {
        if (move_uploaded_file($_FILES["filecropped"]["tmp_name"], $target_dir)) {

        } else {
            die("error");
        }
    } else {
        $im->resizeImage(IMAGE_CROP_WIDTH, IMAGE_CROP_HEIGHT, imagick::FILTER_LANCZOS, 1, true);
        $im->writeImage($target_dir);
    }

    $return["file"] = $file;
    echo json_encode($return);
    return;

   /* if (move_uploaded_file($_FILES["logo"]["tmp_name"], $target_dir))
    {
        $return["file"] = '/server'.$file_dir;
        echo json_encode($return);
    } */
}

