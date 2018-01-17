var player = {
  symbol: '',
  set: function(symbol){
    if(this.symbol === '')
      this.symbol = symbol;
  },
  get: function(){
    return this.symbol;
  }
};


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


// Player X selection on modal event
$('#player-x').on('click', function(){
  $('#player1').text('Computer');
  $('#player2').text('Player 1');
  player.set('X');
});

// Player O selection on modal event
$('#player-o').on('click', function(){
  $('#player1').text('Player 1');
  $('#player2').text('Computer');
  player.set('O');
});



$('#0').on('click', function(){
  console.log("0,0");
});

$('#1').on('click', function(){
  console.log("1,0");
});

$('#2').on('click', function(){
  console.log("2,0");
});

$('#3').on('click', function(){
  console.log("0,1");
});

$('#4').on('click', function(){
  console.log("1,1");
});

$('#5').on('click', function(){
  console.log("2,1");
});

$('#6').on('click', function(){
  console.log("0,2");
});

$('#7').on('click', function(){
  console.log("1,2");
});

$('#8').on('click', function(){
  console.log("2,2");
});
