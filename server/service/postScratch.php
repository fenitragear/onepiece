<?php

if (isset($_FILES) && isset($_FILES["logo"]) && !empty($_FILES) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $dir = '/files/'.$session.'/scratch';

    $ext = strtolower(pathinfo($_FILES["logo"]["name"], PATHINFO_EXTENSION));
    $file = uniqid().'.'.$ext;

    $file_dir = $dir  . "/" . $file;
    $target_dir = '..'.$file_dir;

    $im = new imagick($_FILES["logo"]["tmp_name"]);
    $imageprops = $im->getImageGeometry();
    $width = $imageprops['width'];
    $height = $imageprops['height'];
    $newWidth = 350;
    $newHeight = (350 / $width) * $height;
    $im->resizeImage($newWidth, $newHeight, imagick::FILTER_LANCZOS, 0.9, true);
    // $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    // $im->setImageCompressionQuality(20);
    $im->stripImage();

    $im->writeImage($target_dir);

    $return["file"] = '../server'.$file_dir;
    echo json_encode($return);
} elseif (isset($_POST["imageCallback"]) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $dir = '/files/'.$session.'/scratch';

    if (!is_file($dir . '/'. $_POST["imageCallback"])) {
        copy("./scratch/finscratch.jpg", '../' . $dir . '/'. $_POST["imageCallback"]);
    }
}