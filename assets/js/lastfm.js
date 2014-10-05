//Function that calls via AJaX the php function that returns the top tags of an artist
function getArtistTopTags(){
    var artist = document.getElementById("artistName").value;

    //send ajax request
    sendRequest("assets/php/lastfm.php?func=getArtistTopTags&artist=" + artist, function(xmlHttpObj) {
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

    var url = "assets/php/lastfm.php?func=getTopTracksTag&tag=" + tag + "&limit=" + limit + "&format=json";

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var topTracks = response.toptracks.track;
        var divTagTopTracks = document.getElementById("divTagTopTracks");
        divTagTopTracks.innerHTML="";
        var table = document.createElement("table");
        for (var i = 0; i < topTracks.length; i++) {
            //getMoreInfo(topTracks[i].artist.name, topTracks[i].name);
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var a = document.createElement("a");
            var text = document.createTextNode(topTracks[i].name);
            a.appendChild(text);
            //a.href = topTracks[i].url;
            var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
            a.href="javascript:"+method+";";
            td.appendChild(a);
            tr.appendChild(td);
            table.appendChild(tr);
        }
        divTagTopTracks.appendChild(table);
    }), "GET";
}

function getMoreInfo(artistName, trackName) {
    //alert("HERE");
    var divTooltip = document.getElementById("divToolTip");
    divTooltip.innerHTML = "";
    artistName = artistName.replace(/ /g, "%20");
    trackName = trackName.replace(/ /g, "%20");
    // get album name
    var url = "assets/php/lastfm.php?func=getTrackInfo&track=" + trackName + "&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        //console.log(response);
        var p = document.createElement("p");
        p.innerHTML += "Artist Name: " + response.track.artist.name;
        divTooltip.appendChild(p);
        var p2 = document.createElement("p");
        p2.innerHTML += "Album Name " + response.track.album.title;
        divTooltip.appendChild(p2);
    }), "GET";
    // get artist image
    url = "assets/php/lastfm.php?func=getArtistImage&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var image = document.createElement("img");
        image.src = response.artist.image[2]["#text"];
        divTooltip.appendChild(image);
    }), "GET";
    // get artist top 3 albums artist
    url = "assets/php/lastfm.php?func=getArtistTop3Albums&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        var p = document.createElement("p");
        p.innerHTML += "Top 3 albums: ";
        for(var i=0; i < 3; i++) {
            alert("FOR !!");
            p.innerHTML += response.topalbums.album[i].name;
            if(i==0 || i==1) {
                p.innerHTML += ", ";
            }
        }
        divTooltip.appendChild(p);
    }), "GET";
}