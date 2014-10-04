<?php
/**
 * Created by PhpStorm.
 * User: antoniosilva
 * Date: 03/10/14
 * Time: 18:13
 */

function getArtistTopTags()
{
    //$artist = $_GET["artist"];
    $artist = "cher";
    $responseXML = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=" . $artist . "&api_key=e85bfd5e26e0e91b53160653d86ba063");
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

function getTopTracksTag(){
    $tag = $_GET["tag"];
    $limit = $_GET["limit"];
    $response = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=" + $tag + "&limit=" + $limit + "&api_key=e85bfd5e26e0e91b53160653d86ba063&format=json");

}
