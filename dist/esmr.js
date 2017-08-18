(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Esmr', factory) :
	(global.Esmr = factory());
}(this, (function () { 'use strict';

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

	var Fs$1 = Fs;

	var Path;
	var Cwd;
	var Modules = {};

	if (typeof window === 'undefined') {
		Path = require('path');
		Cwd = module.parent.filename.split(Path.sep);
		Cwd = Cwd.slice(0, -1).join(Path.sep) + Path.sep;
	} else {
		Cwd = window.location.host + '/';
		Cwd = Cwd + window.location.pathname + '/';
	}



	function getAsync (path, callback) {
		Fs$1.readFile(path, function (error, data) {
			if (error) {
				callback(error);
			} else {
				callback(null, Modules[path] = convert(data));
			}
		});
	}

	function getSync (path) {
		var data = Fs$1.readFileSync(path, 'UTF8');
		return convert(data);
	}

	function getHandler (path, callback) {
		path = path.slice(-3) === '.js' ? path : path + '.js';
		path = Cwd + path;

		if (path in Modules) {
			if (callback) {
				callback(null, Modules[path]);
			} else {
				return Modules[path];
			}
		} else if (callback) {
			getAsync(path, callback);
		} else {
			return Modules[path] = getSync(path);
		}
	}

	function Esmr (path, callback) {
		if (typeof path === 'object') {
			return path.map(function (p) {
				return getHandler(p, callback);
			});
		} else {
			return getHandler(path, callback);
		}
	}

	return Esmr;

})));
