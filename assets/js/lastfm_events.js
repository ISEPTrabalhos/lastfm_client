function changeSearchTextField() {
    var table1 = document.getElementById("controlls");
    var table2 = document.getElementById("eventtable");

    table1.style.display = (table1.style.display == "none") ? "block" : "none";
    table2.style.display = (table2.style.display == "none") ? "block" : "none";

    // in cleaning duty
    document.getElementById("divTagTopTracks").innerHTML = "";
    document.getElementById("divEventsResults").innerHTML = "";
    document.getElementById("selectTopTag").value = "--";
}

function getEvents() {
    var place = document.getElementById("eventName").value;
    var limit = document.getElementById("limkm").value;
    var result = document.getElementById("divEventsResults");
    place = place.replace(/ /g, "%20");

    // assets/php/lastfm.php?func=getEventsAt&location=Porto&distance=20
    var url = "assets/php/lastfm.php?func=getEventsAt&location="+ place +"&distance=" + limit;

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);
        response.innerHTML = "";

        if(typeof response.events != 'undefined') {
            response.events.event.forEach(function(obj){
                var article = document.createElement("article");
                var title = document.createElement("h2");
                var artist = document.createElement("p");
                var location = document.createElement("p");
                var start = document.createElement("p");
                var description = document.createElement("p");
                var image = document.createElement("img");
                var clear = document.createElement("div");

                title.className = "title";
                artist.className = "artist";
                location.className = "location";
                start.className = "start";
                description.className = "description";
                image.className = "image";
                clear.className = "clear";


                title.innerHTML = obj.title;
                artist.innerHTML = "";

                if(typeof obj.artists.artist != 'object'){
                    artist.innerHTML += obj.artists.artist;
                }else{
                    obj.artists.artist.forEach(function(name) {
                        artist.innerHTML += name;
                    });
                }

                location.innerHTML = obj.venue.location.street + " " + obj.venue.location.city + " " + obj.venue.location.country;

                start.innerHTML = obj.startDate;
                description.innerHTML = obj.description;
                image.src = obj.image[obj.image.length - 1]["#text"];
                image.alt = "photoh";

                result.appendChild(article);
                article.appendChild(title);
                article.appendChild(image);
                article.appendChild(artist);
                article.appendChild(location);
                article.appendChild(start);
                article.appendChild(clear);
                article.appendChild(description);
            });
        }
        /*var divTagTopTracks = document.getElementById("divTagTopTracks");
        divTagTopTracks.innerHTML="";
        var table = document.createElement("table");
        for (var i = 0; i < topTracks.length; i++) {
            //getMoreInfo(topTracks[i].artist.name, topTracks[i].name);
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var a = document.createElement("a");
            var text = document.createTextNode(topTracks[i].name);
            a.appendChild(text);
            var method = "getMoreInfo("+'"'+topTracks[i].artist.name+'"'+","+'"'+topTracks[i].name+'"'+")";
            a.href="javascript:"+method+";";
            td.appendChild(a);
            tr.appendChild(td);
            table.appendChild(tr);
        }
        divTagTopTracks.appendChild(table);*/
    }), "GET";
}