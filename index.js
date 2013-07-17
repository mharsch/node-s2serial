var SerialPort = require('serialport').SerialPort;
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function S2Serial(path, options) {
	EventEmitter.call(this);
	var self = this;
	this._serialport = new SerialPort(path, options);

	this.rx = new Readable().wrap(this._serialport);
	this.tx = new Writable();

	this.tx._write = function _write(buf, encoding, callback) {
		self._serialport.write(buf, callback);
	};

	this._serialport.on('open', function () {
		self.emit('open');
	});
};

S2Serial.prototype.open = function open(cb) {
	this._serialport.open(cb);
}

util.inherits(S2Serial, EventEmitter);

module.exports = {
	S2Serial: S2Serial
}
