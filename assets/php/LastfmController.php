<?php
require_once 'DB.php';

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Class to handle the call's to the LastFM API
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
class LastfmController {
    private $_api_key; // API primary key
    private $_api_url;
    private $_db; // connection to our DB

	/**
	 * @param $db_hostname
	 * @param $db_database
	 * @param $db_username
	 * @param $db_password
	 * @param $api_key
	 */
	public function __construct($db_hostname, $db_database, $db_username, $db_password, $api_key) {
        /* Create the DB connection to store the log of query's to the lastFM API */
        $this->_db = new DB($db_hostname, $db_database, $db_username, $db_password);

        $this->_api_key = $api_key;
        $this->_api_url = "http://ws.audioscrobbler.com/2.0/?method=";
    }

    public function getAllInfo($get) {
        $info = array(); // array to store all info receveid
        // get track info : ALBUM AND MBID
        $trackInfo = $this->getTrackInfo($get);
        $info[0] = $trackInfo[0];
        $info[1] = $trackInfo[1];
        $info[5] = $trackInfo[2]; // in case of album cover doesnt work
        // get ARTIST IMAGE
        $info[2] = $this->getArtistImage($get);
        // get artist TOP 3 ALBUNS
        $info[3] = $this->getArtistTop3Albums($get);
        // get ARTIST TOP TRACK*/
        $info[4] = $this->getArtistTopTrack($get);
        return json_encode($info);
    }


    /**
     * getArtistTopTrack
     *
     * Get the list of tracks of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    private function getArtistTopTrack($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $json = file_get_contents($this->_api_url . 'artist.getTopTracks&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        $response = json_decode($json, true) ;
        return $response['toptracks']['track'][0]['name'];
    }

    /**
     * getArtistTop3Albums
     *
     * Get the 3 top albuns of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    private function getArtistTop3Albums($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $json = file_get_contents($this->_api_url . 'artist.getTopAlbums&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        $response = json_decode($json, true) ;
        $top = "";
        for($i=0;$i < 3; $i++) {
            $top .= $response['topalbums']['album'][$i]['name'];
            if($i==0 || $i==1) {
                $top.= ", ";
            }
        }
        return $top;
    }

    /**
     * getArtistImage
     *
     * Get the picture of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    private function getArtistImage($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $json = file_get_contents($this->_api_url . 'artist.getInfo&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        $response = json_decode($json, true) ;
        return $response['artist']['image'][2]['#text'];
    }

    /**
     * getTrackInfo
     *
     * Get a lot of info about one single album
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    private function getTrackInfo($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $track = $get["track"];
        $track = str_replace(' ', "%20", $track);
        $json = file_get_contents($this->_api_url . 'track.getInfo&track=' . $track . '&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        $response = json_decode($json, true) ;
        $info = array();
        $info[0] = $response['track']['album']['mbid'];
        $info[1] = $response['track']['album']['title'];
        $info[2] = $response['track']['album']['image'][2]['#text'];
        return $info;
    }

    /**
     * getArtistTopTrack
     *
     * Get all the top tag's from one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string of all tag's separated by ,
     */
    public function getArtistTopTags($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);

	    // add exception. Return error '';
	    if(empty($get["artist"]) || $get["artist"] == ' ') return '';

        $url = $this->_api_url . 'artist.gettoptags&artist=' . $artist . '&api_key=' . $this->_api_key;
        $responseXML = file_get_contents($url);

        $newXML = new DOMDocument('1.0', 'ISO-8859-1');

        $newXML->loadXML($responseXML);
        $nodelist = $newXML->getElementsByTagName("name");
        $tags = "";
        for ($i = 0; $i < $nodelist->length; $i++) {
            $tagNode = $nodelist->item($i);
            $tagValue = $tagNode->nodeValue;
            $tags .= $tagValue . ";";
        }

        // save data into DB
	    $this->_db->insertUniq('logtag', array(
		    'request' => $url,
		    'response' => $tags
	    ));

        return $tags;
    }

    /**
     * getTopTracksTag
     *
     * Get one list of track's based on the tag sent
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getTopTracksTag($get) {
        $tag = $get["tag"];
        $tag = str_replace(' ', "%20", $tag);
        $limit = $get["limit"];
        $url = $this->_api_url . 'tag.gettoptracks&tag=' . $tag . '&limit=' . $limit . '&api_key='. $this->_api_key .'&format=json';
        $response = file_get_contents($url);

        // save data into DB
	    $this->_db->insertUniq('logtracks', array(
		    'request' => $url,
		    'response' => $response
	    ));

        return $response;
    }

    /**
     * getAlbumCover
     *
     * Get the album cover picture from coverartarchive.org
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getAlbumCover($get){
        $mbid = $get["mbid"];
        $url = "http://ia701205.us.archive.org/12/items/mbid-" . $mbid . "/index.json";

	    try{
	        $response = file_get_contents($url);
	        $imgSrc = json_decode($response,true);
		    return $imgSrc['images'][0]['image'];
	    }catch(Exception $e){return '#';}
    }

    /**
     * getEventsAt
     *
     * Get the list of events based on location
     * $_GET(required) - location
     * $_GET(optional) - page
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getEventsAt($get) {
        $location = preg_replace('/\s+/', '%20', $get['location']);
        $page = (isset($get['page']) && !empty($get['page'])) ? $get['page'] : '1';
        $limit = 3;

        // http://ws.audioscrobbler.com/2.0/?method=geo.getEvents&location=porto&distance=10&api_key=e85bfd5e26e0e91b53160653d86ba063&limit=3&page=200
        $url = $this->_api_url . 'geo.getEvents&location=' . $location . '&distance=' . $get['distance'] . '&limit=' . $limit . '&page=' . $page . '&api_key=' . $this->_api_key . '&format=json';

        $response = file_get_contents($url);

        // save data into DB
	    $this->_db->insertUniq('logevent', array(
		    'request' => $url,
		    'response' => $response
	    ));

        return $response;
    }
}