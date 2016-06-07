

var x = 2;

// which way are we moving?
var directionX = 0;
var directionY = -1;
    
// game in progress?
var playing = false;

var score = 0;
var nBalls = 6;
var MaxBalls = 16;
var ballDiameter = 20;

var balls = document.getElementsByTagName("circle");
var cats = document.getElementsByTagName("image");
var nCats = cats.length;

var ballPositionsX=[0,0,0,0,0,0];
var ballPositionsY=[0,0,0,0,0,0];

var info = document.getElementById('info');
var scoreElement = document.getElementById('score');
var svg = document.getElementById('svgRoot');

var playground = svg.getBoundingClientRect();

function gameOver(msg) {
    playing = false;
    info.innerHTML = "Game Over! " + msg + "Press space to play again.";
    endSound.play();
}

var svgns = "http://www.w3.org/2000/svg";

/*
function weOverlap(r1, r2) { 
    return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}
*/

// are we hitting something?  this isn't very fancy just seeing if we are 
// in roughly the same position, by looking at the centers.
//
// when we do left+right, we are really trying to find the middle, or average, 
// (left+right) divided by two.  since we have this for both r1 and r2, we don't 
// bother doing the division, although it makes the number on the far right bigger.
//
function weOverlap(r1, r2) { 
    if (
        Math.abs(r1.left+r1.right)-(r2.left+r2.right) <= 20 &&
        Math.abs(r1.top+r1.bottom)-(r2.top+r2.bottom) <= 20  
        ) {
        return true;
    }
    return false;
}

function checkBounds() { 
    var ourPos = balls[0].getBoundingClientRect();
    //console.log(ourPos);
    if( ourPos.top < playground.top ||
        ourPos.bottom > playground.bottom || 
        ourPos.left < playground.left || 
        ourPos.right > playground.right
    ) { 
        // out of playground
        gameOver("");
        return false;
    }

    // make sure we didn't hit ourself
    for( i = 1; i < nBalls; i++ ) { 
        if( ballPositionsX[i] == ballPositionsX[0] && ballPositionsY[i] == ballPositionsY[0] ) { 
            gameOver("You hit yourself. ");
            return false;
        }
    }

    // hit cat?
    console.log(nCats);
    for( i = 0; i < nCats; i++ ) { 
        var catRect = cats[i].getBoundingClientRect();
        console.log(catRect);
    console.log(ourPos);
        if( weOverlap(ourPos, catRect) ) { 
            gameOver("Drats. ");
            return false;
        }
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

var z = 0;
var interval = 4;

function addBall() { 
    if( nBalls < MaxBalls ) {
        z = 0;
        interval++;
        //ballsPositionX[nBalls] = ballsPositionX[nBalls-1];
        //ballsPositionY[nBalls] = ballsPositionY[nBalls-1];
        nBalls++;
    }
}

function move() { 
    if( ++z % interval == 0 ) { 
        addBall();
        //score += 10;
    }

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



