<?php

if (isset($_FILES) && isset($_FILES["logo"]) && !empty($_FILES) && isset($_POST["session"])) {
    $session = $_POST["session"];
    $dir = '/files/'.$session.'/slider';

    if (!is_dir('..'.$dir.'/original')) {
        @mkdir('..'.$dir.'/original');
    }
    if (!is_dir('..'.$dir.'/square')) {
        @mkdir('..'.$dir.'/square');
    }
    if (!is_dir('..'.$dir.'/landscape')) {
        @mkdir('..'.$dir.'/landscape');
    }
    if (!is_dir('..'.$dir.'/portrait')) {
        @mkdir('..'.$dir.'/portrait');
    }
    
    $ext = strtolower(pathinfo($_FILES["logo"]["name"], PATHINFO_EXTENSION));
    $file = uniqid().'.'.$ext;

    $file_dir = $dir  . "/original" .'/' . $file;
    $target_dir = '..'.$file_dir;

    define('IMAGE_CROP_WIDTH', 1000);
    define('IMAGE_CROP_HEIGHT', 700);

    function crop($im,$new,$original,$thumb_a,$thumb_w,$thumb_h,$w,$h,$ext){
        if ( $original >= $thumb_a )
        {
           // If image is wider than thumbnail (in aspect ratio sense)
           $new_height = $thumb_h;
           $new_width = $w / ($h / $thumb_h);
        }
        else
        {
           // If the thumbnail is wider than the image
           $new_width = $thumb_w;
           $new_height = $h / ($w / $thumb_w);
        }
        $thumb = imagecreatetruecolor( $thumb_w, $thumb_h );
        // Resize and crop
        imagecopyresampled($thumb,
                           $im,
                           0 - ($new_width - $thumb_w) / 2, // Center the image horizontally
                           0 - ($new_height - $thumb_h) / 2, // Center the image vertically
                           0, 0,
                           $new_width, $new_height,
                           $w, $h);
        if($ext=="png"){
            imagepng($thumb, $new);
        }else if($ext=="gif"){
            imagegif($thumb, $new, 80);
        }else{
            imagejpeg($thumb, $new, 80);
        }
        
    }

    function cropImageFormat($dir,$file,$original,$dirname,$ext){
        $file_dir = $dir  . "/".$dirname.'/' . $file;
        $target_dir = '..'.$file_dir;

        if($ext=="png"){
            $image = imagecreatefrompng($original);
        }else if($ext=="gif"){
            $image = imagecreatefromgif($original);
        }else{
            $image = imagecreatefromjpeg($original);
        }

        $newFilename = $target_dir;
        $thumb_width = 200;
        $thumb_height = 200;
        switch ($dirname) {
            case 'square':
            $thumb_width = 200;
            $thumb_height = 200;
            break;
            case 'landscape':
            $thumb_width = 200;
            $thumb_height = 150;
            break;
            case 'portrait':
            $thumb_width = 150;
            $thumb_height = 200;
            break;
        } 
        $width = imagesx($image);
        $height = imagesy($image);
        $original_aspect = $width / $height;
        $thumb_aspect = $thumb_width / $thumb_height;
        crop($image,$newFilename,$original_aspect,$thumb_aspect,$thumb_width,$thumb_height,$width,$height,$ext);    
    }

    
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
    $dirNameArray = ['square','landscape','portrait'];
    for($i=0; $i < count($dirNameArray); $i++){
        cropImageFormat($dir,$file,$target_dir,$dirNameArray[$i],$ext);
    }

    $return["file"] = '../server'.$file_dir;
    $return["filename"] = $file;
    echo json_encode($return);
    return;

   /* if (move_uploaded_file($_FILES["logo"]["tmp_name"], $target_dir))
    {
        $return["file"] = '/server'.$file_dir;
        echo json_encode($return);
    } */
}

