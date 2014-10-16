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
    if(tag != "--"){
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
                td.id = topTracks[i].name;
                var a = document.createElement("a");
                var text = document.createTextNode(topTracks[i].name);
                a.appendChild(text);
                var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
                a.href="javascript:"+method+";";
                td.appendChild(a);
                /*td.innerHTML += '<a onmouseover="'+
                        "getMoreInfo('"+topTracks[i].artist.name+"', '"+topTracks[i].name+"');"
                    +'">'+topTracks[i].name+'</a>';*/

                tr.appendChild(td);
                table.appendChild(tr);
            }
            divTagTopTracks.appendChild(table);
        }, "GET");
    }
}

function clearToolTipDiv(trackName) { // clear old tooltip div
    var cell =  document.getElementById(trackName);
    cell.removeChild(cell.childNodes.item(1));
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
        imgSrc = xmlHttpObj1.responseText;
    }, "GET",false);

    // get correspondent cell
    var td = document.getElementById(trackName);

    // CREATE AND DISPLAY DIV
    var divToolTip = document.createElement("div");
    divToolTip.className = "divToolTip";

    //add close button
    var a = document.createElement("a");
    divToolTip.innerHTML += '<div class="close"><a href="javascript:clearToolTipDiv(\''+trackName+'\');"><i class="fa fa-times"></i></a></div>';
    divToolTip.appendChild(a);

    // left div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Artist Image ";
    var image = document.createElement("img");
    image.src = info[2];
    p.appendChild(image);
    divImages.appendChild(p);
    divToolTip.appendChild(divImages);

    // center div
    var divInfo = document.createElement("div");
    divInfo.className = "infos";
    p = document.createElement("p");
    p.innerHTML = "Artist Name: ";
    var span = document.createElement("span");
    span.innerHTML += artistNamNoSpaces;
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Album Name: ";
    var span = document.createElement("span");
    span.innerHTML += info[1];
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Top 3 Albuns: ";
    var span = document.createElement("span");
    span.innerHTML += info[3];
    p.appendChild(span);
    divInfo.appendChild(p);
    p = document.createElement("p");
    p.innerHTML = "Top Track: ";
    var span = document.createElement("span");
    span.innerHTML += info[4];
    p.appendChild(span);
    divInfo.appendChild(p);
    divToolTip.appendChild(divInfo);

    // right div
    var divImages = document.createElement("div");
    divImages.className = "images";
    var p = document.createElement("p");
    p.innerHTML = "Album Image: ";
    var image = document.createElement("img");
	if(imgSrc[0] == '<') imgSrc = info[5];
    image.src = imgSrc;

    p.appendChild(image);
    divImages.appendChild(p);
    divToolTip.appendChild(divImages);

    divToolTip.style.display = "block";
    td.appendChild(divToolTip);
}