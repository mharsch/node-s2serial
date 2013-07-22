#s2serial

A Streams2 frontend for
[node-serialport](https://github.com/voodootikigod/node-serialport).

##Usage:

The S2Serial implements the same API as node-serialport except: 

* The `parser` option is ignored (forcing `raw` mode)
* The returned object implements a 
[Duplex Stream](http://nodejs.org/api/stream.html#stream_class_stream_duplex)


##Example:

	var S2Serial = require('s2serial').S2Serial;
	var sp = new S2Serial('/dev/tty.usb411', {baudrate: 57600});

	// hypothetical Streams that implement some protocol
	var encoder = new MyEncoder(); // encodes command objs into bytes
	var decoder = new MyDecoder(); // parses stream of bytes and emits objs

	sp.pipe(decoder);
	decoder.on('message', function (msg) {
		console.log('message received from serialport: ' + msg);
	});

	sp.on('open', function () {
		encoder.pipe(sp);
		encoder.send({ cmd: 'getsomething' });
	});
