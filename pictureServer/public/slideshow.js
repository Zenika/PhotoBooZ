(function(){
	var source = new EventSource('stream');
	source.addEventListener("message", function(event) {
    	$('#lastPicture').fadeOut(400, function() {
    		$('#lastPicture').attr('src', event.data);
    		$('#lastPicture').fadeIn(400);
    	});
	}, false);

	source.addEventListener("open", function(event) {
		console.log('Connected');
	}, false);

	source.addEventListener("error", function(event) {
		if (event.target.readyState === EventSource.CLOSED) {
			source.close();
		status.textContent = "Connection closed!";
		} else if (event.target.readyState === EventSource.CONNECTING) {
			status.textContent = "Connection closed. Attempting to reconnect!";
		} else {
			status.textContent = "Connection closed. Unknown error!";
		}
	}, false);
})();