(function(){

	function addImageToSlideshow(imageSrc, asFirstChild) {
		var imagesList = document.getElementById('imagesList');
		var li = document.createElement('li');
		var img = document.createElement('img');
		img.src = imageSrc;

		if(asFirstChild) {
			imagesList.insertBefore(li, imagesList.firstChild);
		}
		else {
			imagesList.appendChild(li);
		}

		if(imagesList.children.length > 24) {
			imagesList.removeChild(imagesList.lastElementChild);
		}

		li.appendChild(img);
		img.addEventListener('click', function() {
			changeSelectedImage(imageSrc);
		})
	}

	function changeSelectedImage(image) {
		$('#selectedPicture').fadeOut(400, function() {
			$('#selectedPicture').attr('src', image);
			$('#selectedPicture').fadeIn(400);
		});
	}

	var source = new EventSource('stream');
	source.addEventListener("message", function(event) {
    	changeSelectedImage(event.data);
			addImageToSlideshow(event.data, true);
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

	// Twitter button
	var twitterAccount = document.getElementById("twitteraccount");
	var twitterButton = document.getElementById("tweetthis");
	var selectedPicture = document.getElementById("selectedPicture");

	function tweet(event) {
		event.preventDefault();
		var account = twitterAccount.value;

		twitterAccount.style.border = '';
		if(account === null || account.trim() === "") {
			twitterAccount.style.border = '1px solid red';
		}

		return fetch('/tweet', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({account: account, url: selectedPicture.src})
		}).then(function(response) {
			if(!response.ok) throw response;
		})
		.catch(function(response) {
			console.log(JSON.stringify(response));
		});
	}

	twitterButton.addEventListener('click', tweet);

	// fetch images
	fetch('/images')
	.then(function(response) {
		return response.json();
	})
	.then(function(images) {
		var imagesToShow = images.reverse().slice(0,24);
		imagesToShow.forEach(function(img) {
			addImageToSlideshow(img, false);
		});
		changeSelectedImage(imagesToShow[0]);
	});
})();
