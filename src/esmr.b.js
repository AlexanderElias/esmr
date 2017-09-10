import Fs from './fs';

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

function toCode (data) {
	'use strict';
	// data = data.match(/(export default)|/);
	if (data.indexOf('export default') !== -1) {
		data = data.replace('export default', 'return');
	}
	data = '(function(){\n\t\'use strict\';\n' + data + '\n}());';
	return eval.call(null, data);
}

function getAsync (path, callback) {
	Fs.readFile(path, function (error, data) {
		if (error) {
			callback(error);
		} else {
			callback(
				null,
				Modules[path] = {
					path: path,
					code: toCode(data)
				}
			);
		}
	});
}

function getSync (path) {
	var data = Fs.readFileSync(path, 'UTF8');
	return Modules[path] = {
		path: path,
		code: toCode(data)
	};
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
		return getSync(path);
	}
}

export default function Esmr (path, callback) {
	if (typeof path === 'object') {
		return path.map(function (p) {
			return getHandler(p, callback);
		});
	} else {
		return getHandler(path, callback);
	}
}
