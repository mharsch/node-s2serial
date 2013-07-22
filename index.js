var SerialPort = require('serialport').SerialPort;
var Duplex = require('stream').Duplex;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function S2Serial(path, options) {
	Duplex.call(this);
	var self = this;
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
};

util.inherits(S2Serial, Duplex);

S2Serial.prototype.open = this._serialport.open;
S2Serial.prototype.close = this._serialport.close;
S2Serial.prototype.flush = this._serialport.flush;

module.exports = {
	S2Serial: S2Serial
}
