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
