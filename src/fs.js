
var Fs;

if (typeof window === 'undefined') {
	Fs = require('fs');
} else {
	Fs = {};

	Fs.readFileSync = function (path) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', path, false);
		xhr.send();

		if (xhr.status === 200) {
			return xhr.responseText;
		} else {
			throw xhr.responseText;
		}
	};

	Fs.readFile = function (path, callback) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				if (this.status === 200) {
					callback(null, this.responseText);
				} else {
					callback(this.responseText);
				}
			}
		};

		xhr.open('GET', path, true);
		xhr.send();
	};

}

export default Fs;
