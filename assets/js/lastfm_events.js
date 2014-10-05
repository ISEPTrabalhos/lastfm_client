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

function getEvents(page) {
    var place = document.getElementById("eventName").value;
    var limit = document.getElementById("limkm").value;
    var result = document.getElementById("divEventsResults");
    place = place.replace(/ /g, "%20");

    // assets/php/lastfm.php?func=getEventsAt&location=Porto&distance=20
    var url = "assets/php/lastfm.php?func=getEventsAt&location=" + place + "&distance=" + limit + "&page=" + page;

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);

        if(typeof response.events != 'undefined') {
            result.innerHTML = "";
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
                image.alt = "ImageShow";

                result.appendChild(article);
                article.appendChild(title);
                if(obj.image[obj.image.length - 1]["#text"] != '') article.appendChild(image);
                article.appendChild(artist);
                article.appendChild(location);
                article.appendChild(start);
                article.appendChild(clear);
                article.appendChild(description);
            });

            var page = response.events["@attr"].page;
            var totalpages = response.events["@attr"].totalPages;
            var next = parseInt(page) + 1;
            var prev = parseInt(page) - 1;
            console.log(page+" / "+totalpages);

            result.innerHTML += "<br />";
            if(parseInt(page) > 1) {
                result.innerHTML += "<button class=\"numBt prev\" onclick=\"getEvents(" + prev + ");\">Previous</button>";
            }

            if(parseInt(page) < parseInt(totalpages)) {
                result.innerHTML += "<button class=\"numBt next\" onclick=\"getEvents(" + next + ");\">Next</button>";
            }

            result.innerHTML += "<br /><div class=\"clear\"></div>";

        }
    }), "GET";
}