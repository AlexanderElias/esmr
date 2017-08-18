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

function toModule (text) {
	text = text.match(/(export default)|/);
	text = text.replace('export default', 'return');
	text = '(function(){\n\t\'use strict\';\n' + text + '\n}());';
	return {
		name: ,
		module: eval(text)
	};
};

function getAsync (path, callback) {
	Fs.readFile(path, function (error, data) {
		if (error) {
			callback(error);
		} else {
			callback(null, Modules[path] = convert(data));
		}
	});
}

function getSync (path) {
	var data = Fs.readFileSync(path, 'UTF8');
	return convert(data);
};

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

export default function Esmr (path, callback) {
	if (typeof path === 'object') {
		return path.map(function (p) {
			return getHandler(p, callback);
		});
	} else {
		return getHandler(path, callback);
	}
};
