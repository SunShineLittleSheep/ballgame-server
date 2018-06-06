var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var http    = require('http');
var io      = require('socket.io')(server);

server.listen(8001);

app.get('/phone', function(req, res){
  res.sendFile(__dirname + '/phone.html');
});

app.get('/game',function(req,res){
  res.sendFile(__dirname + '/teeeest.html');
})

console.log('Connection');

var boxbeta = 0;
var box2beta = 0;

var player1connect = false;
var player2connect = false;

io.on('connection', function(socket) {
  socket.on('ison',function(data){
      if (data == 1){
        player1connect = true;
      }else if(data == 2){
        player2connect = true;
      }
      console.log(player1connect);
  });
  socket.on('disconnect', function(data){
    console.log('disconnect');
    player1connect = false;
    player2connect = false;
  });
  

  socket.on('betaout',function(data){
  	boxbeta = data;
    player1connect = true;
  });
  socket.on('betaout2',function(data){
  	box2beta = data;
    player2connect = true;
  });
  socket.on('whoami',function(data){
    var answer = 0;
    if (player1connect == false){
      answer = 1;
      player1connect = true;
    }else if (player2connect == false){
      answer = 2;
      player2connect = true;
    }else{
      answer = 0;
    }
  	socket.emit('answerofit',answer);
    console.log('nowloading'+answer);
  });
  
  setInterval(function(){
  	socket.emit('beta',boxbeta);
  	socket.emit('beta2',box2beta);
  }, 1);
});
