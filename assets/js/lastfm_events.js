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

    // assets/php/ajaxRequest.php?func=getEventsAt&location=Porto&distance=20
    var url = "assets/php/ajaxRequest.php?func=getEventsAt&location=" + place + "&distance=" + limit + "&page=" + page;

    //send ajax request
    sendRequest(url, function(xmlHttpObj) {
        var response = JSON.parse(xmlHttpObj.responseText);

        if(typeof response.events != 'undefined') {
	        var i = 0;
            result.innerHTML = "";
            response.events.event.forEach(function(obj){
                var article = document.createElement("article");
                var title = document.createElement("h2");
                var artist = document.createElement("p");
                var location = document.createElement("p");
                var locationSpan = document.createElement("span");
                var start = document.createElement("p");
                var description = document.createElement("div");
	            var description_full = document.createElement("div");
                var image = document.createElement("img");
                var map = document.createElement("iframe");
                var clear = document.createElement("div");
                var artistSpan = document.createElement("span");

                title.className = "title";
                artist.className = "artist";
                location.className = "location";
                start.className = "start";
                description.className = "description";
	            description_full.className = "description_full";
                image.className = "image";
                clear.className = "clear";

	            description.id = "description_" + i;
	            description_full.id = "description_full_" + i;

                article.setAttribute("itemscope", "");
                article.setAttribute("itemtype", "http://schema.org/MusicEvent");
                title.setAttribute("itemprop", "name");

                artistSpan.setAttribute("itemprop","performer");
                artistSpan.setAttribute("itemscope", "");
                artistSpan.setAttribute("itemtype", "http://schema.org/MusicGroup");
                artist.setAttribute("itemprop","name");

                locationSpan.setAttribute("itemprop", "location");
                locationSpan.setAttribute("itemscope", "");
                locationSpan.setAttribute("itemtype", "http://schema.org/MusicVenue");
                location.setAttribute("itemprop", "address");

                start.setAttribute("itemprop", "startdate");
                image.setAttribute("itemprop", "image");

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

	            var str_size = 200;
	            var tmp_desc = obj.description;
	            if(tmp_desc.length > str_size) {
		            description_full.innerHTML = tmp_desc;
		            tmp_desc = tmp_desc.substring(0, str_size);
		            tmp_desc += ' <span class="clickable" onclick="showFullDescription('+i+');">[see more...]</span></div>';
	            }

                description.innerHTML = tmp_desc;
                image.src = obj.image[obj.image.length - 1]["#text"];
                image.alt = "ImageShow";

                var lat = obj.venue.location["geo:point"]["geo:lat"];
                var long = obj.venue.location["geo:point"]["geo:long"]

                map.width = "100%";
                map.height = "400";
                map.frameborder = "0";
                map.scrolling = "no";
                map.marginheight = "0";
                map.marginwidth = "0";
                map.style.border = "0";
                map.src = 'https://www.google.com/maps/embed/v1/view' +
                    '?key=' + 'AIzaSyDn-UcwMbrIiX8wgyNAlLyHnmqOvZsaddw' +
                    '&center='+ lat +','+ long +
                    '&zoom=15' +
                    '&maptype=satellite';

	            description_full.style.display = "none";

                result.appendChild(article);
                article.appendChild(title);
                if(obj.image[obj.image.length - 1]["#text"] != '') article.appendChild(image);
                artistSpan.appendChild(artist);
                article.appendChild(artistSpan);
                locationSpan.appendChild(location);
                article.appendChild(locationSpan);
                article.appendChild(start);
                article.appendChild(clear);
                article.appendChild(description);
	            article.appendChild(description_full);
                article.appendChild(map);

	            i++;
            });

            var page = response.events["@attr"].page;
            var totalpages = response.events["@attr"].totalPages;
            var next = parseInt(page) + 1;
            var prev = parseInt(page) - 1;

            result.innerHTML += "<br />";
            if(parseInt(page) > 1) {
                result.innerHTML += "<button class=\"numBt prev\" onclick=\"getEvents(" + prev + ");\">Previous</button>";
            }

            if(parseInt(page) < parseInt(totalpages)) {
                result.innerHTML += "<button class=\"numBt next\" onclick=\"getEvents(" + next + ");\">Next</button>";
            }

            result.innerHTML += "<br /><div class=\"clear\"></div>";

        }
    }, "GET");
}

function showFullDescription(num){
	var elem = document.getElementById("description_"+num);
	var full = document.getElementById("description_full_"+num);
	full.style.display = "block";
	elem.style.display = "none";
}