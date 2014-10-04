<?php

$func = $_GET["func"];
$api_key = "e85bfd5e26e0e91b53160653d86ba063";
$api_url = "http://ws.audioscrobbler.com/2.0/?method=";

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
    $artist = $_GET["artist"];

    $responseXML = file_get_contents($api_url . 'artist.gettoptags&artist=' . $artist . '&api_key=' . $api_key);
    $newXML = new DOMDocument('1.0', 'ISO-8859-1');

    $newXML->loadXML($responseXML);
    $nodelist = $newXML->getElementsByTagName("name");

    $tags = "";
    for ($i = 0; $i < 10; $i++) {
        $tagNode = $nodelist->item($i);
        $tagValue = $tagNode->nodeValue;
        $tags .= $tagValue . ";";
    }

    echo $tags;
}

function getTopTracksTag() {
    global $api_url;
    global $api_key;
    $tag = $_GET["tag"];
    $limit = $_GET["limit"];
    $response = file_get_contents($api_url . 'tag.gettoptracks&tag=' . $tag . '&limit=' . $limit . '&api_key='. $api_key .'&format=json');
    echo $response;
}