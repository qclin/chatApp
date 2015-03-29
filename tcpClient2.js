var net = require('net');

var client = net.Socket();
client.connect(3000, function() {
  console.log('Connected to Server');

  client.on('data', function(data){
    console.log(data.toString().trim())
  });

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function() {
	  var chunk = process.stdin.read();
	  if (chunk !== null) {
	    client.write(chunk);
	  }
	});

	process.stdin.on('end', function() {
	  process.stdout.write('end');
	});

});

