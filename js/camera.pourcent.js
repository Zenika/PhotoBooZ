var webcamError = function(e) {
    alert('Webcam error!', e);
};

var video = document.getElementById('webcam');
var canvasSource = document.getElementById('canvas-source');
var canvasTransparent = document.getElementById('canvas-transparent');
var contextSource = canvasSource.getContext('2d');
var contextTransparent = canvasTransparent.getContext('2d');

var colorToReplace = [20, 100, 210];
var tolerance = 0.05;
 
if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: false, video: true}, function(stream) {
        video.src = stream;
    }, webcamError);
} else if (navigator.webkitGetUserMedia) {
	navigator.webkitGetUserMedia({audio:false, video:true}, function(stream) {
    	video.src = window.URL.createObjectURL(stream);
    }, webcamError);
}

function writeSourceToCanvas() {
	requestAnimationFrame(writeSourceToCanvas);

	contextSource.drawImage(video, 0, 0, video.width, video.height);
	var transparentBackgroundData = makeBlueTransparent(contextSource, video.width, video.height);
	contextTransparent.putImageData(transparentBackgroundData, 0, 0);
}

function makeBlueTransparent(source, width, height) {
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

		if (	red < redToReplace+redToReplace*tolerance && red > redToReplace-redToReplace*tolerance
		 	&& 	green < greenToReplace+greenToReplace*tolerance && green > greenToReplace-greenToReplace*tolerance
		 	&& 	blue < blueToReplace+blueToReplace*tolerance && blue > blueToReplace-blueToReplace*tolerance) {
			data[i+3] = 0;
		}
	}

	return sourceData;
}

writeSourceToCanvas();

document.getElementById('tolerance').addEventListener('change', function(evt) {
	tolerance = parseFloat(evt.target.value);
});