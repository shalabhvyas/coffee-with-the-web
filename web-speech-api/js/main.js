var speechRecognizer = {};

speechRecognizer.init = function() {

	var startButton = $('#startButton');

	if (!('webkitSpeechRecognition' in window)) {
		upgrade();
	} else {

		var recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			startButton.removeClass('btn-primary').addClass('btn-danger').text('Stop Listening');
			this.final_transcript = '';

		}

		recognition.onresult = function(event) {
			var interim_transcript = '';

			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					this.final_transcript += event.results[i][0].transcript;					
					$('#speechResults').append($('<p></p>').addClass('text-success').text('Final Result: '+this.final_transcript));
					this.final_transcript = '';
				} else {
					interim_transcript += event.results[i][0].transcript;					
					$('#speechResults').append($('<p></p>').addClass('text-muted').text('Intermin Result: '+interim_transcript));
				}
			}


		}



		recognition.onerror = function(event) {
			startButton.removeClass('btn-danger').addClass('btn-primary').text('Start Listening');
		}
		recognition.onend = function() {
			startButton.removeClass('btn-danger').addClass('btn-primary').text('Start Listening');
		}

		this.recognition = recognition;
	}


};


speechRecognizer.start = function() {

	var startButton = $('#startButton');

	if(this.recognition === undefined)
		this.init();

	if(startButton.text().indexOf('Start') != -1)
		this.recognition.start();
	else 
		this.recognition.stop();
};