<?php
    require_once 'LastfmController.php';

    $data = parse_ini_file("../../config.ini", true);

    $lastFM = new LastfmController(
        $data['mysql']['hostname'], // localhost
        $data['mysql']['database'], // DB name
        $data['mysql']['username'], // username from DB
        $data['mysql']['password'], // password from DB
        $data['lastfm']['api_key']); // lastFM API key

    // get the function from GET
    $func = $_GET["func"];


    // try to call the function from them lastFM controller.
    try{
        echo $lastFM->$func($_GET);
    }catch(Exception $e) {
        // if and error was trigget it will show the error message on the screen
        die('ERROR: ' . $e->getMessage());
    }
