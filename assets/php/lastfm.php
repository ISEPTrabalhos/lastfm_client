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
        case 'getTrackInfo':
            getTrackInfo();
            break;
        case 'getAlbumCover':
            getAlbumCover();
            break;
        case 'getArtistImage':
            getArtistImage();
            break;
        case 'getArtistTop3Albums':
            getArtistTop3Albums();
            break;
        case 'getArtistTopTrack':
            getArtistTopTrack();
            break;
        case 'getEventsAt':
            $page = (isset($_GET['page']) && !empty($_GET['page'])) ? $_GET['page'] : '1';
            getEventsAt($_GET['location'], $_GET['distance'], $page);
            break;
        default:
            break;
    }

function getArtistTopTrack() {
    global $api_url;
    global $api_key;
    $artist = $_GET["artist"];
    $artist = str_replace(' ', "%20", $artist);
    $response = file_get_contents($api_url . 'artist.getTopTracks&artist=' . $artist . '&api_key='. $api_key .'&format=json');
    echo $response;
}


function getArtistTop3Albums() {
    global $api_url;
    global $api_key;
    $artist = $_GET["artist"];
    $artist = str_replace(' ', "%20", $artist);
    $response = file_get_contents($api_url . 'artist.getTopAlbums&artist=' . $artist . '&api_key='. $api_key .'&format=json');
    echo $response;
}

function getArtistImage() {
    global $api_url;
    global $api_key;
    $artist = $_GET["artist"];
    $artist = str_replace(' ', "%20", $artist);
    $response = file_get_contents($api_url . 'artist.getInfo&artist=' . $artist . '&api_key='. $api_key .'&format=json');
    echo $response;
}


function getTrackInfo() {
        global $api_url;
        global $api_key;
        $artist = $_GET["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $track = $_GET["track"];
        $track = str_replace(' ', "%20", $track);
        $response = file_get_contents($api_url . 'track.getInfo&track=' . $track . '&artist=' . $artist . '&api_key='. $api_key .'&format=json');
        echo $response;
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

    function getAlbumCover(){
        global $db;
        $mbid = $_GET["mbid"];
        $url = "coverartarchive.org/release/" . $mbid;
        $response = file_get_contents($url);

        //  save data into DB
        // ** code goes here **

        echo $response;
    }

    function getEventsAt($location = 'Porto', $distance = '10', $page = '1', $limit = '3') {
        global $api_url;
        global $api_key;
        global $db;

        $location = preg_replace('/\s+/', '%20', $location);

        // http://ws.audioscrobbler.com/2.0/?method=geo.getEvents&location=porto&distance=10&api_key=e85bfd5e26e0e91b53160653d86ba063&limit=3&page=200
        $url = $api_url . 'geo.getEvents&location=' . $location . '&distance=' . $distance . '&limit=' . $limit . '&page=' . $page . '&api_key=' . $api_key . '&format=json';

        $response = file_get_contents($url);

        // save data into DB
        $select = "SELECT * FROM logevent WHERE request = '{$url}'";
        $db->select($select);
        if($db->getNumElem() == 0){
            $query = "INSERT INTO logevent (id, request, response) VALUES (NULL, '{$url}', '{$response}');";
            $db->insert($query);
        }

        echo $response;
    }