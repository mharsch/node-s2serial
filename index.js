var SerialPort = require('serialport').SerialPort;
var Duplex = require('stream').Duplex;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function S2Serial(path, options) {
	Duplex.call(this);
	var self = this;

	// strip parser option if set.  Force default (raw)
	if (options.parser)
		options.parser = undefined;

	this._serialport = new SerialPort(path, options);

	this.wrap(this._serialport);

	this._write = function _write(buf, encoding, callback) {
		self._serialport.write(buf, function (err, res) {
			if (err) {
				callback(err);
				return;
			}
			if (res && res != buf.length) {
				callback(new Error("write error: " +
				    "wrote %d bytes, expected to write %d",
				    res, buf.length));
				return;
			}
			callback()
		});
	};

	this._serialport.on('open', function () {
		self.emit('open');
	});

	this._serialport.on('close', function () {
		self.emit('close');
	});

	this.open = this._serialport.open;
	this.close = this._serialport.close;
	this.flush = this._serialport.flush;
};

util.inherits(S2Serial, Duplex);

module.exports = {
	S2Serial: S2Serial
}
