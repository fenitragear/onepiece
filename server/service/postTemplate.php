<?php

if (isset($_POST["template"]) && isset($_POST["session"])) {
    $session = $_POST["session"];
	$template = $_POST["template"];
	
    $dir = '../files/'.$session.'';

    if (!is_dir('../files')) {
        @mkdir('../files');
    }
    if (!is_dir($dir)) {
        @mkdir($dir);
    }

	//TODO test if json already exists
	$str = file_get_contents('./settings-' . $template . '.json');
    file_put_contents($dir . '/settings.json', $str);
	
	$str = file_get_contents('./order-' . $template . '.json');
    file_put_contents($dir . '/order.json', $str);		

    echo json_encode('ok');
}