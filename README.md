#s2serial

A Streams2 frontend for
[node-serialport](https://github.com/voodootikigod/node-serialport).

##Usage:

The S2Serial constructor takes the same arguments as the node-serialport
SerialPort constructor (path, options).  The returned object exposes most 
of the underlying SerialPort API (e.g. the 'open' event and 'open()' 
function).  I/O is handled via 2 members of the S2Serial object: 'tx' and 
'rx'.  The 'rx' member is a Readable stream of bytes from the serial port.  
The 'tx' member is a Writable stream for sending bytes to the serial port.


##Example:

	var S2Serial = require('s2serial').S2Serial;
	var sp = new S2Serial('/dev/tty.usb411', {baudrate: 57600});

	// hypothetical Streams that implement some protocol
	var encoder = new MyEncoder(); // encodes command objs into bytes
	var decoder = new MyDecoder(); // parses stream of bytes and emits objs

	sp.rx.pipe(decoder);
	decoder.on('message', function (msg) {
		console.log('message received from serialport: ' + msg);
	});

	sp.on('open', function () {
		encoder.pipe(sp.tx);
		encoder.send({ cmd: 'getsomething' });
	});

	
##API:

### Class: S2Serial
Lightweight wrapper of SerialPort that provides a Streams2 I/O interface

### Constructor: S2Serial(path, options)
* `path` {String} path to serial device
* `options` {Object}
    * see [node-serialport](https://github.com/voodootikigod/node-serialport)
* Returns: {Object} new S2Serial object

### S2Serial.open(callback)
* passthrough to underlying SerialPort open(cb) 

### S2Serial Event: 'open'
* passthrough from underlying SerialPort 'open' event

### S2Serial.close(callback)
* passthrough to underlying SerialPort close(cb) 

### S2Serial Event: 'close'
* passthrough from underlying SerialPort 'close' event

### S2Serial.flush(callback)
* passthrough to underlying SerialPort flush(cb) 

### S2Serial.rx
* `rx` {Object} 
[Readable Stream](http://nodejs.org/api/stream.html#stream_class_stream_readable) 
of bytes coming from underlying serial port

### S2Serial.tx
* `tx` {Object} 
[Writable Stream](http://nodejs.org/api/stream.html#stream_class_stream_writable) 
of bytes to be sent to underlying serial port

