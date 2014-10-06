<?php
require_once 'DB.php';


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Class to handle the call's to the LastFM API
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
class LastfmController {
    private $_api_key; // API primary key
    private $_api_url;
    private $_db; // connection to our DB

    public function __construct($db_hostname, $db_database, $db_username, $db_password, $api_key) {
        /* Create the DB connection to store the log of query's to the lastFM API */
        $this->_db = new DB($db_hostname, $db_database, $db_username, $db_password);

        $this->_api_key = $api_key;
        $this->_api_url = "http://ws.audioscrobbler.com/2.0/?method=";
    }

    /**
     * getArtistTopTrack
     *
     * Get the list of tracks of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getArtistTopTrack($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $response = file_get_contents($this->_api_url . 'artist.getTopTracks&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        return $response;
    }

    /**
     * getArtistTop3Albums
     *
     * Get the 3 top albuns of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getArtistTop3Albums($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $response = file_get_contents($this->_api_url . 'artist.getTopAlbums&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        return $response;
    }

    /**
     * getArtistImage
     *
     * Get the picture of one artist
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getArtistImage($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $response = file_get_contents($this->_api_url . 'artist.getInfo&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        return $response;
    }

    /**
     * getTrackInfo
     *
     * Get a lot of info about one single album
     *
     * @param $get array it's the $_GET global var from the request environment
     * @return string in json of the results
     */
    public function getTrackInfo($get) {
        $artist = $get["artist"];
        $artist = str_replace(' ', "%20", $artist);
        $track = $get["track"];
        $track = str_replace(' ', "%20", $track);
        $response = file_get_contents($this->_api_url . 'track.getInfo&track=' . $track . '&artist=' . $artist . '&api_key='. $this->_api_key .'&format=json');
        return $response;
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
        $url = $this->_api_url . 'artist.gettoptags&artist=' . $artist . '&api_key=' . $this->_api_key;
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
        $this->_db->select($select);
        if($this->_db->getNumElem() == 0){
            $query = "INSERT INTO logtag (id, request, response) VALUES (NULL, '{$url}', '{$tags}');";
            $this->_db->insert($query);
        }

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
        $select = "SELECT * FROM logtracks WHERE request LIKE '{$url}' AND response LIKE '{$response}'";
        $this->_db->select($select);
        if($this->_db->getNumElem() == 0){
            $query = "INSERT INTO logtracks (id, request, response) VALUES (NULL, '{$url}', '{$response}');";
            $this->_db->insert($query);
        }

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
        $url = "coverartarchive.org/release/" . $mbid;
        $response = file_get_contents($url);

        //  save data into DB
        // ** code goes here **

        return $response;
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
        $select = "SELECT * FROM logevent WHERE request = '{$url}'";
        $this->_db->select($select);
        if($this->_db->getNumElem() == 0){
            $query = "INSERT INTO logevent (id, request, response) VALUES (NULL, '{$url}', '{$response}');";
            $this->_db->insert($query);
        }

        return $response;
    }
}