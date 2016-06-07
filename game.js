// game.js

var x = 1;

var canvas = document.getElementById("backgroundCanvas");
var context = canvas.getContext("2d");
var stats = document.getElementById("stats");


function startGame() { 
    console.log("start");
}

window.onload = function() {
    
    z = document.getElementById("newGame");
    console.log( z );
    z.onclick = startGame;

}
