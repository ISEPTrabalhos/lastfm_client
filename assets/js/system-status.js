window.onload = function() {
	sendRequest('assets/php/dbstatus.php', function(xmlHttpObj) {
		if(xmlHttpObj.responseText == 'offline') {
			var warning = document.getElementById("warnings");
			warning.style.display = "block";
			warning.innerHTML += "<p>Our database its temporarly offline. <br/>You can expect the page to run slower.</p>";
		}
	}, 'GET');
}