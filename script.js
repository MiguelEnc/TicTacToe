$(document).ready(function(){

  $('#playerSelectionModal').modal({
      dismissible: false,
      opacity: .5,
      inDuration: 200,
      outDuration: 400,
      startingTop: '4%',
      endingTop: '40%',
      ready: function(modal, trigger) {
        modal.css('transform', 'translateY(-40%)');
      }
    }
  );

  $('#playerSelectionModal').modal('open');

});


$('#player-x').on('click', function(){
  console.log("Playing with X");
  $('#player1').text('Computer');
  $('#player2').text('Player 1');
});


$('#player-o').on('click', function(){
  console.log("Playing with O");
  $('#player1').text('Player 1');
  $('#player2').text('Computer');
});