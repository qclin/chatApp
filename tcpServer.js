net = require('net');
fs = require('fs');
////// styling with chalk 
var chalk = require('chalk');
var error = chalk.white.bgRed;
//////
var clients = [];
var record= [];  

var key = /[yell]/;

net.createServer(function (socket) {
  // Identify this client
  socket.name = socket.remotePort; 
  var name = error(socket.name);
  // Put this new client in the list
  clients.push(socket);
  
  // Send greeting client 
  socket.write("Hey there you " + name + "\n");
  broadcast(socket.name + " joined the chat\n", socket);
  
  //Broadcast previous chat record to those who log on
  fs.readFile('chatRecord.txt',function(err,data){
    if (err){console.log(err)
    }else{
    socket.write(data.toString(),socket);}
  });

  // reads recieving data
  socket.on('data', function (data) {
          
      var text = data.toString().trim();
      var arr = text.split(" ");
      record.push(socket.name+text+"\n");
      ///// print chat history into txt file 
      fs.writeFile('chatRecord.txt', record, function (err){
            if(err){ console.log(err)
            }else{ console.log('posted');}
      });
      
      if(text ==="yell"){
            broadcast(socket.name+chalk.bold(" AHHHhhh~~~!!"),socket);
      }else if (arr[0]==="load"){
            broadcast(socket.name+chalk.bold.magenta.bgCyan(" ...//--||..┬─┬﻿ ノ( ゜-゜ノ)"),socket);
      }else if (arr.length > 13 ){
            broadcast(socket.name+chalk.bold.red.bgBlue(" (╯°□°)╯︵ ┻━┻ "),socket);
      }else if(arr.length>1 && arr[0] ==="yell"){ 
        var extract = arr.shift();
        var you = arr.join().toUpperCase();
        broadcast(socket.name+"!!!>>>>"+chalk.gray.bgBlack(you)+"<<<<!!!",socket);
      }else if(arr[0]=== "/kick"+socket.name){
        socket.end();
      }else{
        broadcast(socket.name + "> " + data +"\n", socket);  
      }

  });


  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    broadcast(name + " left the chat.\n");
  });
  
  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
  }
 
}).listen(3000);
 
// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 3000\n");