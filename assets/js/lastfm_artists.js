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
            //var text = document.createTextNode(topTracks[i].name);
            //a.appendChild(text);
            var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
            //a.href="javascript:"+method+";";
            //td.appendChild(a);
            td.innerHTML += '<a onmouseover="'+
                    "getMoreInfo('"+topTracks[i].artist.name+"', '"+topTracks[i].name+"');"
                +'">'+topTracks[i].name+'</a>';
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
    var info;
    var url = "assets/php/ajaxRequest.php?func=getAllInfo&track=" + trackName + "&artist=" + artistName + "&format=json";
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        info = response;
    }, "GET",false);


    var mbid = info[0];
    var urlAlbumCover = "assets/php/ajaxRequest.php?func=getAlbumCover&mbid=" + mbid;
    var imgSrc;
    sendRequest(urlAlbumCover, function(xmlHttpObj1) {
        console.log(xmlHttpObj1.responseText);
        imgSrc = xmlHttpObj1.responseText;
    }, "GET");

    // CREATE AND DISPLAY DIV

    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = ""; // clear old div
    var widget = document.createElement("div");
    widget.className = "widget";

    // top div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Artist Image ";
    var image = document.createElement("img");
    image.src = info[2];
    //image.src = "http://placehold.it/114x114";
    p.appendChild(image);
    divImages.appendChild(p);
    widget.appendChild(divImages);

    // center div

     var line = document.createElement("br");
     var divInfo = document.createElement("div");
     divInfo.className = "infos";
     p = document.createElement("p");
     var span = document.createElement("span");
     span.className = "title";
     span.innerHTML = "Artist Name"
     p.appendChild(span);
     p.appendChild(document.createElement("br"));
     span = document.createElement("span");
     span.innerHTML += artistNamNoSpaces;
     p.appendChild(span);
     divInfo.appendChild(p);

     p = document.createElement("p");
     span = document.createElement("span");
     span.className = "title";
     span.innerHTML = "Album Name";
     p.appendChild(span);
     p.appendChild(document.createElement("br"));
     var span = document.createElement("span");
     span.innerHTML += info[1];
     p.appendChild(span);
     divInfo.appendChild(p);

     p = document.createElement("p");
     span = document.createElement("span");
     span.className = "title";
     span.innerHTML = "Top 3 Albuns";
     p.appendChild(span);
     p.appendChild(document.createElement("br"));
     var span = document.createElement("span");
     span.innerHTML += info[3];
     p.appendChild(span);
     divInfo.appendChild(p);

     p = document.createElement("p");
     span = document.createElement("span");
     span.className = "title";
     span.innerHTML = "Top Track: ";
     p.appendChild(span);
     p.appendChild(document.createElement("br"))
     span = document.createElement("span");
     span.innerHTML += info[4];
     p.appendChild(span);
     divInfo.appendChild(p);

     widget.appendChild(divInfo);

    // right div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Album Image: ";
    var image = document.createElement("img");
    image.src = imgSrc;
    //image.src = "http://placehold.it/114x114";
    p.appendChild(image);
    divImages.appendChild(p);
    widget.appendChild(divImages);

    widget.style.display = "block";
    tooltip.appendChild(widget);
}