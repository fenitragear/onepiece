<?php
     $dir = 't/fichier.txt';
    $monfichier = fopen($dir, 'a+');
    fputs($monfichier, $_POST["response"]);
?>