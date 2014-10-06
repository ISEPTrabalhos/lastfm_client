<?php
    require_once 'LastfmController.php';

    $lastFM = new LastfmController(
        'HOST_NAME', // localhost
        'DB_NAME', // DB name
        'DB_USERNAME', // username from DB
        'DB_PASSWORD', // password from DB
        'e85bfd5e26e0e91b53160653d86ba063'); // lastFM API key

    // get the function from GET
    $func = $_GET["func"];


    // try to call the function from them lastFM controller.
    try{
        echo $lastFM->$func($_GET);
    }catch(Exception $e) {
        // if and error was trigget it will show the error message on the screen
        die('ERROR: ' . $e->getMessage());
    }