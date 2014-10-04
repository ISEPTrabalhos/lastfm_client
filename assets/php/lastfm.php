<?php
    require_once 'DB.php';

    $func = $_GET["func"];
    $api_key = "e85bfd5e26e0e91b53160653d86ba063";
    $api_url = "http://ws.audioscrobbler.com/2.0/?method=";
    $db = new DB('HOST_NAME', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD');


    switch($func) {
        case 'getArtistTopTags':
            getArtistTopTags();
            break;
        case 'getTopTracksTag':
            getTopTracksTag();
            break;
        default:
            break;
    }

    function getArtistTopTags() {
        global $api_url;
        global $api_key;
        global $db;

        $artist = $_GET["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $url = $api_url . 'artist.gettoptags&artist=' . $artist . '&api_key=' . $api_key;
        $responseXML = file_get_contents($url);

        $newXML = new DOMDocument('1.0', 'ISO-8859-1');

        $newXML->loadXML($responseXML);
        $nodelist = $newXML->getElementsByTagName("name");

        $tags = "";
        for ($i = 0; $i < 10; $i++) {
            $tagNode = $nodelist->item($i);
            $tagValue = $tagNode->nodeValue;
            $tags .= $tagValue . ";";
        }

        // save data into DB
        $select = "SELECT * FROM logtag WHERE request = '{$url}'";
        $db->select($select);
        if($db->getNumElem() == 0){
            $query = "INSERT INTO logtag (id, request, response) VALUES (NULL, '{$url}', '{$tags}');";
            $db->insert($query);
        }

        echo $tags;
    }

    function getTopTracksTag() {
        global $api_url;
        global $api_key;
        global $db;

        $tag = $_GET["tag"];
        $tag = str_replace(' ', "%20", $tag);
        $limit = $_GET["limit"];
        $url = $api_url . 'tag.gettoptracks&tag=' . $tag . '&limit=' . $limit . '&api_key='. $api_key .'&format=json';
        $response = file_get_contents($url);

        // save data into DB
        $select = "SELECT * FROM logtracks WHERE request LIKE '{$url}' AND response LIKE '{$response}'";
        $db->select($select);
        if($db->getNumElem() == 0){
            $query = "INSERT INTO logtracks (id, request, response) VALUES (NULL, '{$url}', '{$response}');";
            $db->insert($query);
        }

        echo $response;
    }