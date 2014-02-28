var gestureRecognizer = {};


gestureRecognizer.hasUserMedia = function(){ 
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
			  navigator.mozGetUserMedia || navigator.msGetUserMedia);
};


gestureRecognizer.initUserMedia = function(){

	var startButton = $('#startButton');

	if(this.hasUserMedia()){

		var localMediaStream = null;
		var video = document.querySelector('video');

		var errorCallback = function(e) {
    			console.log('Rejected media capture!!', e);
  		};

		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
			  navigator.mozGetUserMedia || navigator.msGetUserMedia;

		navigator.getUserMedia({video: true, audio: false},function(stream){
			video.src = window.URL.createObjectURL(stream);
    		localMediaStream = stream;

    		startButton.removeClass('btn-primary').addClass('btn-danger').text('Stop Capturing');

		},errorCallback);

	}else{
		alert('getUserMedia() is not supported in your browser');
	}
};