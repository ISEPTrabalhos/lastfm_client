// Global Variables
var divTooltip;

//Function that calls via AJaX the php function that returns the top tags of an artist
function getArtistTopTags(){
    var artist = document.getElementById("artistName").value;

    //send ajax request
    sendRequest("assets/php/ajaxRequest.php?func=getArtistTopTags&artist=" + artist, function(xmlHttpObj) {
        var response = xmlHttpObj.responseText;
        var tagNameList = response.split(";");
        var divTopTags = document.getElementById("divTopTags");
        var select = document.getElementById("selectTopTag");
        select.innerHTML="";
        select.onchange = function(){getTopTracksTag();};

        var option0 = document.createElement("option");
        var text0 = document.createTextNode("--");
        option0.appendChild(text0);
        option0.value = "--";
        select.appendChild(option0);

        for (var i = 0; i < tagNameList.length - 1; i++){
            var option = document.createElement("option");
            var text = document.createTextNode(tagNameList[i]);
            option.appendChild(text);
            option.value = tagNameList[i];
            select.appendChild(option);
        }
    }, "GET");
}

//Function that get's via AJaX the N top tracks of a tag
function getTopTracksTag() {
    var limit = document.getElementById("topTrackLimit").value;
    var tag = document.getElementById("selectTopTag").value;
    tag = tag.replace(/ /g, "%20");

    var url = "assets/php/ajaxRequest.php?func=getTopTracksTag&tag=" + tag + "&limit=" + limit + "&format=json";

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var topTracks = response.toptracks.track;
        var divTagTopTracks = document.getElementById("divTagTopTracks");
        divTagTopTracks.innerHTML="";
        var table = document.createElement("table");
        for (var i = 0; i < topTracks.length; i++) {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var a = document.createElement("a");
            var text = document.createTextNode(topTracks[i].name);
            a.appendChild(text);
            // call method to get more info of selected track
            var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
            a.href="javascript:"+method+";";
            td.appendChild(a);
            tr.appendChild(td);
            table.appendChild(tr);
        }
        divTagTopTracks.appendChild(table);
    }, "GET");
}

//Function that  get's via AJaX a list of info of selected track
function getMoreInfo(artistName, trackName) {
    divTooltip = document.getElementById("divToolTip");
    var artistNamNoSpaces = artistName;
    artistName = artistName.replace(/ /g, "%20");
    // get album name
    var albumName = getAlbumName(artistName,trackName);
    //alert(artistNamNoSpaces + " - " + albumName);
    // get artist image
    var image = getArtistImage(artistName);
    //alert(image);
    // get artist top 3 albums artist
    var top3a = getTop3Albums(artistName);
    //alert(top3a);
    // get artist toptrack
    var tt = getArtistTopTrack(artistName);
    //alert(tt);
    //show div
    //divTooltip.style.display = "block";
    //divTooltip.style.left = "50px";
    //divTooltip.style.top = "321px";
}

function getAlbumName(artistName,trackName) {
    trackName = trackName.replace(/ /g, "%20");
    var albumName = "";
    var url = "assets/php/ajaxRequest.php?func=getTrackInfo&track=" + trackName + "&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var atname = document.getElementById("atname");
        //atname.innerHTML = response.track.artist.name;
        var abname = document.getElementById("abname");
        //abname.innerHTML = response.track.album.title;
        albumName = response.track.album.title;
    }, "GET",false);
    return albumName;
}

function getArtistImage(artistName) {
    var url = "assets/php/ajaxRequest.php?func=getArtistImage&artist=" + artistName + "&format=json";
    var src = "";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var image = document.getElementById("atimage");
        //image.src = response.artist.image[2]["#text"];
        src = response.artist.image[2]["#text"];
    }, "GET",false);
    return src;
}

function getTop3Albums(artistName) {
    var url = "assets/php/ajaxRequest.php?func=getArtistTop3Albums&artist=" + artistName + "&format=json";
    var top3a = "";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var top3ab = document.getElementById("top3ab");
        top3ab.innerHTML = "";
        for(var i=0; i < 3; i++) {
            //top3ab.innerHTML += response.topalbums.album[i].name;
            top3a += response.topalbums.album[i].name;
            if(i==0 || i==1) {
               // top3ab.innerHTML += ", ";
                top3a+= ", ";
            }
        }
    }, "GET",false);
    return top3a;
}

function getArtistTopTrack(artistName) {
    var url = "assets/php/ajaxRequest.php?func=getArtistTopTrack&artist=" + artistName + "&format=json";
    var track = "";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        //var toptrack = document.getElementById("toptrack");
        //toptrack.innerHTML = response.toptracks.track[0].name;
        track = response.toptracks.track[0].name;
    }, "GET",false);
    return track;
}