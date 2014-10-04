function CreateXmlHttpRequestObject( )
{

    if (window.XMLHttpRequest)
    {
        xmlHttpObj=new XMLHttpRequest()

    }
    else if (window.ActiveXObject)
    {
        xmlHttpObj=new ActiveXObject("Microsoft.XMLHTTP")
    }
    return xmlHttpObj;
}

//Function that calls via AJaX the php function that returns the top tags of an artist
function getArtistTopTags(){
    var xmlHttpObj = CreateXmlHttpRequestObject();
    var artist = document.getElementById("artistName").value;
    xmlHttpObj.open("GET", "assets/php/lastfm.php?func=getArtistTopTags&artist=" + artist, true);
    xmlHttpObj.onreadystatechange = function() {
        if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
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
        }
    };
    xmlHttpObj.send(null);
}

//Function that get's via AJaX the N top tracks of a tag
function getTopTracksTag() {
    var xmlHttpObj = CreateXmlHttpRequestObject();
    var tag = document.getElementById("selectTopTag").value;
    tag = tag.replace(/ /g, "%20");
    var limit = document.getElementById("topTrackLimit").value;
    xmlHttpObj.open("GET", "assets/php/lastfm.php?func=getTopTracksTag&tag=" + tag + "&limit=" + limit + "&format=json", true);
    xmlHttpObj.onreadystatechange = function () {
        if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
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
                a.href = topTracks[i].url;
                td.appendChild(a);
                tr.appendChild(td);
                table.appendChild(tr);
            }
            divTagTopTracks.appendChild(table);
        }
    };
    xmlHttpObj.send(null);
}