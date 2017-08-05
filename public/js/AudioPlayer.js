    
var song = document.getElementById("sound");
var inc = .10;

var play = function() {
    $("#playButton").hide();
    $("#pauseButton").show();
    $("#player-info").text("Playing");
    song.play();
    }

var pause = function() {
    $("#pauseButton").hide();
    $("#playButton").show();
    $("#player-info").text("Paused");
    song.pause();
    }

var volUp = function () {
    song.volume += inc;
    $("#player-info").text("vol +");
    }

var volDn = function() {
    song.volume -= inc;
     $("#player-info").text("vol -");
    }

var mute = function () {
    if (song.volume == 0) {
        song.volume = .60;
        $("#player-info").text(" ");
    }
      else
    {
        song.volume = 0;
        $("#player-info").text("Muted");
        }
    }
