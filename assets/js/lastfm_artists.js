// Global Variables
//var divTooltip;

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
            // var m = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+",";
            //var method = m + td + ")";
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
    var artistNamNoSpaces = artistName;
    artistName = artistName.replace(/ /g, "%20");
    // get album name
    var albumName = getAlbumName(artistName,trackName);
    // get artist image
    var src = getArtistImage(artistName);
    // get artist top 3 albums artist
    var top3a = getTop3Albums(artistName);
    // get artist tt
    var tt = getArtistTopTrack(artistName);

    // CREATE AND DISPLAY DIV
    var divToolTip = document.createElement("div");
    divToolTip.className = "divToolTip";

    // left div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Artist Image ";
    var image = document.createElement("img");
    image.src = src;
    p.appendChild(image);
    divImages.appendChild(p);
    divToolTip.appendChild(divImages);

    // center div
    var divInfo = document.createElement("div");
    divInfo.className = "infos";
    p = document.createElement("p");
    p.innerHTML = "Artist Image: ";
    var span = document.createElement("span");
    span.innerHTML += artistNamNoSpaces;
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Album Image: ";
    var span = document.createElement("span");
    span.innerHTML += albumName;
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Top 3 Albuns: ";
    var span = document.createElement("span");
    span.innerHTML += top3a;
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Top Track: ";
    var span = document.createElement("span");
    span.innerHTML += tt;
    p.appendChild(span);
    divInfo.appendChild(p);
    divToolTip.appendChild(divInfo);

    // right div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Album Image: ";
    var image = document.createElement("img");
    image.src = "http://placehold.it/114x114";
    p.appendChild(image);
    divImages.appendChild(p);
    divToolTip.appendChild(divImages);

    divToolTip.style.display = "block";
    document.getElementsByTagName("body")[0].appendChild(divToolTip);
}

function getAlbumName(artistName,trackName) {
    trackName = trackName.replace(/ /g, "%20");
    var albumName = "";
    var url = "assets/php/ajaxRequest.php?func=getTrackInfo&track=" + trackName + "&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        albumName = response.track.album.title;
    }, "GET",false);
    return albumName;
}

function getArtistImage(artistName) {
    var url = "assets/php/ajaxRequest.php?func=getArtistImage&artist=" + artistName + "&format=json";
    var src = "";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        src = response.artist.image[2]["#text"];
    }, "GET",false);
    return src;
}

function getTop3Albums(artistName) {
    var url = "assets/php/ajaxRequest.php?func=getArtistTop3Albums&artist=" + artistName + "&format=json";
    var top3a = "";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        for(var i=0; i < 3; i++) {
            top3a += response.topalbums.album[i].name;
            if(i==0 || i==1) {
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
        track = response.toptracks.track[0].name;
    }, "GET",false);
    return track;
}