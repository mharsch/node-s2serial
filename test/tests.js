var nodeunit = require('nodeunit');
var S2Serial = require('../index.js').S2Serial;

var serpath = '/dev/cu.usbmodem411';
// assumes you have an arduino attached to the above usb path and running the
// 'echo.ino' sketch from node-serialport/test/echo

exports['send/receive a string over loopback'] = function (test) {
	var sp = new S2Serial(serpath, { baudrate: 57600 });
	var received = '';
	sp.on('readable', function () {
		var chunk = sp.read();
		received = received.concat(chunk.toString());
		if (received.length < 4)
			return;
		
		test.ok(received);
		test.equal(received, 'asdf');
		sp.close(function () {
			test.done();
		});
	});
	sp.once('open', function () {
		// thump the arduino with an initial write and wait a bit
		sp.write('bogus');
		setTimeout(function () {
			sp.write('asdf', 'utf8', function (err) {
				if (err) throw new Error(err);
			});
		}, 100);
	});
};
