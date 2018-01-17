var Player = {
  symbol: '',
  set: function(symbol){
    if(this.symbol === '')
      this.symbol = symbol;
  },
  get: function(){
    return this.symbol;
  }
};

var player1 = Object.create(Player), 
computer = Object.create(Player),
playerOnTurn;

// [y][x]
var board = [["","",""],
["","",""],
["","",""]];


$(document).ready(function(){

  // Player selection modal configuration
  $('#playerSelectionModal').modal({
    dismissible: false,
    opacity: .5,
    inDuration: 200,
    outDuration: 400,
    startingTop: '4%',
    endingTop: '40%',
    ready: function(modal) {
        // Sets modal on the center of the screen vertically
        modal.css('transform', 'translateY(-40%)');        
      }
    }
    );
  $('#playerSelectionModal').modal('open');
});


function playOnPosition(pos, player){
  
  if(board[pos.y][pos.x] == ""){
    board[pos.y][pos.x] = player.get();
    $('#' + pos.y + pos.x).text(playerOnTurn.get());
    
    // changing turns
    if(playerOnTurn === player1){
      playerOnTurn = computer;
    } else {
      playerOnTurn = player1;
    }
  }
}


// Player X selection on modal event
$('#player-x').on('click', function(){
  $('#player1').text('Computer');
  $('#player2').text('Player 1');
  player1.set('X');
  computer.set('O');
  playerOnTurn = player1;
});

// Player O selection on modal event
$('#player-o').on('click', function(){
  $('#player1').text('Player 1');
  $('#player2').text('Computer');
  player1.set('O');
  computer.set('X');
  playerOnTurn = player1;
});


$('#00').on('click', function(){
  playOnPosition({y: 0, x: 0}, playerOnTurn);
});

$('#01').on('click', function(){
  playOnPosition({y: 0, x: 1}, playerOnTurn);
});

$('#02').on('click', function(){
  playOnPosition({y: 0, x: 2}, playerOnTurn);
});

$('#10').on('click', function(){
  playOnPosition({y: 1, x: 0}, playerOnTurn);
});

$('#11').on('click', function(){
  playOnPosition({y: 1, x: 1}, playerOnTurn);
});

$('#12').on('click', function(){
  playOnPosition({y: 1, x: 2}, playerOnTurn);
});

$('#20').on('click', function(){
  playOnPosition({y: 2, x:0 }, playerOnTurn);
});

$('#21').on('click', function(){
  playOnPosition({y: 2, x: 1}, playerOnTurn);
});

$('#22').on('click', function(){
  playOnPosition({y: 2, x: 2}, playerOnTurn);
});
