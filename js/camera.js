(function() {
	var webcamError = function(e) {
	    alert('Webcam error!', e);
	};

	var video = document.getElementById('webcam');
	var canvasSource = document.getElementById('canvas-source');
	var canvasTransparent = document.getElementById('canvas-transparent');
	var contextSource = canvasSource.getContext('2d');
	var contextTransparent = canvasTransparent.getContext('2d');

	var colorToReplace = [20, 100, 210];
	var tolerance = 70;

	navigator.getUserMedia = ( navigator.getUserMedia ||
	                       navigator.webkitGetUserMedia ||
	                       navigator.mozGetUserMedia ||
	                       navigator.msGetUserMedia);



	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio:false, video:true}, function(stream) {
	    	video.src = window.URL.createObjectURL(stream);
	    	writeSourceToCanvas();
	    }, webcamError);
	}

	function writeSourceToCanvas() {
		requestAnimationFrame(writeSourceToCanvas);

		contextSource.drawImage(video, 0, 0, video.width, video.height);
		var transparentBackgroundData = replaceColorByTransparent(contextSource, video.width, video.height);

		contextTransparent.putImageData(transparentBackgroundData, 0, 0);
	}

	function replaceColorByTransparent(source, width, height) {
		var sourceData = source.getImageData(0, 0, width, height);
		var data = sourceData.data;

		for(var i=0; i<data.length; i+=4) {
			var red = data[i];
			var green = data[i+1];
			var blue = data[i+2];
			var alpha = data[i+3];

			var redToReplace = colorToReplace[0];
			var greenToReplace = colorToReplace[1];
			var blueToReplace = colorToReplace[2];

			if (	red < redToReplace+tolerance && red > redToReplace-tolerance
			 	&& 	green < greenToReplace+tolerance && green > greenToReplace-tolerance
			 	&& 	blue < blueToReplace+tolerance && blue > blueToReplace-tolerance) {
				data[i+3] = 0;
			}
		}

		return sourceData;
	}


	document.getElementById('tolerance').addEventListener('change', function(evt) {
		tolerance = parseInt(evt.target.value);
	});

	canvasTransparent.addEventListener('click', function(evt) {
		var x = evt.pageX - this.offsetLeft;
		var y = evt.pageY - this.offsetTop;

		var imgData = contextTransparent.getImageData(x, y, 1, 1).data;
		var R = imgData[0];
		var G = imgData[1];
		var B = imgData[2];

		colorToReplace = [R, G, B];
	});

	var backgrounds = document.querySelectorAll('#imageSelector li img');
	for(var x=0; x<backgrounds.length; x++) {
		backgrounds[x].addEventListener('click', function(evt) {
			document.getElementById('background').src = evt.target.src;
		});
	}
})();