
var createLikeButton = function(_id) {

  var songLikeBtn_DOM_ID = '#' + _id + '-likebtn'; 

  $(songLikeBtn_DOM_ID).click(function(){ // send '/like' POST request 
    $.post("/like",
    {
        'SongID':_id
    },
    function(data, status){
      $(songLikeBtn_DOM_ID).fadeOut("slow").fadeIn("fast"); //animate buttons
      getNewScore(_id); //update score 
    });
      })
}

var createDisLikeButton = function(_id) {

  var songDisLikeBtn_DOM_ID = '#' + _id + '-dislikebtn';

  $(songDisLikeBtn_DOM_ID).click(function(){ // send '/dislike' POST request 
    $.post("/dislike",
    {
        'SongID':_id
    },
    function(data, status){
      $(songDisLikeBtn_DOM_ID).fadeOut("slow").fadeIn("fast"); //animate buttons
      getNewScore(_id); //update score 
    });
      })
}


var getNewScore = function(_id){
  
  var songScore_DOM_ID = '#' + _id + '-score';

  $.get( "/score/" + _id , function(data) { //send  '/score' GET request
  $(songScore_DOM_ID).fadeOut("slow").html(data).fadeIn("slow"); //animate
  });
}
