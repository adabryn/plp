

var x = 2;

// which way are we moving?
var directionX = 0;
var directionY = -1;
    
// game in progress?
var playing = false;

var score = 0;
var nBalls = 6;
var ballDiameter = 20;

var balls = document.getElementsByTagName("circle");

var ballPositionsX=[0,0,0,0,0,0];
var ballPositionsY=[0,0,0,0,0,0];

var info = document.getElementById('info');
var scoreElement = document.getElementById('score');
var svg = document.getElementById('svgRoot');

var playground = svg.getBoundingClientRect();

function gameOver() {
    playing = false;
    info.innerHTML = "Game Over!  Press space to play again.";
    endSound.play();
}

var svgns = "http://www.w3.org/2000/svg";

function checkBounds() { 
    var ourPos = balls[0].getBoundingClientRect();
    //console.log(ourPos);
    if( ourPos.top < playground.top ||
        ourPos.bottom > playground.bottom || 
        ourPos.left < playground.left || 
        ourPos.right > playground.right
    ) { 
        // out of playground
        gameOver();
        return false;
    }
    return true;
}

function arrowKeyPressed(k) { 
    if( k == 37 ) { 
        // left
        //TweenLite.to(ball, 1, {x:'-=25', onComplete:checkBounds});
        directionX = -1;
        directionY = 0;
    }
    else if( k == 38 ) { 
        // up
        directionX = 0;
        directionY = -1;
    }
    else if( k == 39 ) { 
        directionX = 1;
        directionY = 0;
    }
    else if( k == 40 ) { 
        directionX = 0;
        directionY = 1;
    }
}

document.onkeydown = function(evt) {
    /*
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    
    */
    //info.innerHTML = "key press " + evt.keyCode + " : " + evt.which;

    var k = evt.keyCode;
    if( k >= 37 && k <= 40 ) { 
        if( playing ) {
            arrowKeyPressed(k);
        }
    }
    else if( k == 32 ) {
        if( !playing ) {
            beginGame();
        }
    }
};

function showScore() {
    scoreElement.innerHTML = "" + score;
}

var startingY = 350;

function beginGame() {
    score = 0;
    info.innerHTML = "Go!";
    showScore();
    //startSound.play();

    for( i = 0; i < nBalls; i++ ) {
        ballPositionsX[i] = 250;
        ballPositionsY[i] = startingY+ballDiameter*i;
        balls[i].setAttributeNS(null, "cx", ballPositionsX[i]);
        balls[i].setAttributeNS(null, "cy", ballPositionsY[i]);
    }
//        console.log(balls);

    playing = true;

}

info.innerHTML = "Press Space Bar to begin game";

var startSound = new Howl({
      urls: ['bloop.mp3']
    });

var endSound = new Howl({
      urls: ['gameover.mp3']
    });

// we will run myTimer function ever so many milliseconds to do things
setInterval(myTimer, 1000);

function move() { 
    for( i = nBalls-1; i >= 1; i--) {
        // move body segment forward to position of the ahead segment
        // on the last round
        ballPositionsX[i] = ballPositionsX[i-1];
        ballPositionsY[i] = ballPositionsY[i-1];
    }
//    console.log(ballPositionsY);

//    alert("");

    // advance the head
    ballPositionsX[0] += directionX * ballDiameter;
    ballPositionsY[0] += directionY * ballDiameter;

    // move them
    for( i = 0; i < nBalls; i++) {
        balls[i].setAttributeNS(null, "cx", ballPositionsX[i]);
        balls[i].setAttributeNS(null, "cy", ballPositionsY[i]);
    }

    return checkBounds();
}

function myTimer() {
    if( !playing )
        return;

    score++;
    showScore();

    if( move() ) {
        startSound.play();
    }
}



