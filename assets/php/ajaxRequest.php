<?php
    require_once 'LastfmController.php';

    $lastFM = new LastfmController('HOST_NAME', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD');

    $func = $_GET["func"];

    try{
        echo $lastFM->$func($_GET);
    }catch(Exception $e) {
        die('ERROR: ' . $e->getMessage());
    }